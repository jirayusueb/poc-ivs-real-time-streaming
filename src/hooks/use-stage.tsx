import { useEffect, useRef, useState } from 'react'
import { Stage, StageConnectionState, StageEvents, StageParticipantInfo, SubscribeType } from 'amazon-ivs-web-broadcast'
import { useLocalMediaContext } from '@/contexts/local-media-context.jsx'
import Strategy from '@/utils/strategy'

/**
 * Custom hook that manages the connection to an IVS Stage.
 * @returns An object with the following properties:
 * - joinStage: A function to join an IVS Stage.
 * - stageJoined: A boolean indicating whether the user is currently in an IVS Stage.
 * - leaveStage: A function to leave the IVS Stage.
 * - participants: A Map of participants in the IVS Stage.
 */
export default function useStage() {
  const [stageJoined, setStageJoined] = useState<boolean>(false)
  const [participants, setParticipants] = useState<Map<string, StageParticipantInfo>>(new Map())
  const [localParticipant, setLocalParticipant] = useState<StageParticipantInfo>()
  const { currentVideoDevice, currentAudioDevice } = useLocalMediaContext()

  const stageRef = useRef<Stage | undefined>(undefined)
  const strategyRef = useRef<Strategy>(new Strategy(currentAudioDevice, currentVideoDevice))

  useEffect(() => {
    strategyRef.current.updateMedia(currentAudioDevice, currentVideoDevice)
    if (stageRef.current && stageJoined) {
      stageRef.current.refreshStrategy()
    }
  }, [currentAudioDevice, currentVideoDevice])

  /**
   * Handle the event when a participant joins the stage.
   * @param participantInfo - Information about the participant that joined.
   */
  const handleParticipantJoin = (participantInfo: StageParticipantInfo): void => {
    if (isLocalParticipant(participantInfo)) {
      setLocalParticipant(participantInfo)
    } else {
      const participant = createParticipant(participantInfo)
      // NOTE: we must make a new map so react picks up the state change
      setParticipants(new Map(participants.set(participant.id, participant)))
    }
  }

  /**
   * Handle the event when a participant leaves the stage.
   * @param participantInfo - Information about the participant that left.
   */
  const handleParticipantLeave = (participantInfo: StageParticipantInfo): void => {
    if (isLocalParticipant(participantInfo)) {
      setLocalParticipant(undefined)
    } else {
      if (participants.delete(participantInfo.id)) {
        setParticipants(new Map(participants))
      }
    }
  }

  /**
   * Handle the event when media streams are added to a participant.
   * @param participantInfo - Information about the participant with the added streams.
   * @param streams - The streams that were added.
   */
  const handleMediaAdded = (participantInfo: StageParticipantInfo, streams: any): void => {
    if (!isLocalParticipant(participantInfo)) {
      const { id } = participantInfo
      let participant = participants.get(id)
      participant = { ...participant, streams: [...streams, ...participant.streams] }
      setParticipants(new Map(participants.set(id, participant)))
    }
  }

  /**
   * Handle the event when media streams are removed from a participant.
   * @param participantInfo - Information about the participant with the removed streams.
   * @param streams - The streams that were removed.
   */
  const handleMediaRemoved = (participantInfo: any, streams: MediaStream[]): void => {
    if (!isLocalParticipant(participantInfo)) {
      const { id } = participantInfo
      let participant = participants.get(id)
      const newStreams = participant.streams.filter((existingStream) => !streams.find((removedStream) => existingStream.id === removedStream.id))
      participant = { ...participant, streams: newStreams }
      setParticipants(new Map(participants.set(id, participant)))
    }
  }

  /**
   * Handle the event when the mute state of a participant's stream changes.
   * @param participantInfo - Information about the participant whose stream's mute state changed.
   * @param stream - The stream whose mute state changed.
   */
  const handleParticipantMuteChange = (participantInfo: StageParticipantInfo, stream: MediaStream): void => {
    if (!isLocalParticipant(participantInfo)) {
      const { id } = participantInfo
      let participant = participants.get(id)
      participant = { ...participant, ...participantInfo }
      setParticipants(new Map(participants.set(id, participant)))
    }
  }

  /**
   * Handle the event when the connection state of the stage changes.
   * @param state - The new connection state of the stage.
   */
  const handleConnectionStateChange = (state: StageConnectionState): void => {
    if (state === StageConnectionState.CONNECTED) {
      setStageJoined(true)
    } else if (state === StageConnectionState.DISCONNECTED) {
      setStageJoined(false)
    }
  }

  /**
   * Leave the current stage.
   */
  function leaveStage(): void {
    if (stageRef.current) {
      stageRef.current.leave()
    }
  }

  /**
   * Join an IVS Stage with the given token.
   * @param token - The token for the stage to join.
   * @returns A Promise that resolves when the join is complete.
   */
  async function joinStage(token: string): Promise<void> {
    if (!token) {
      alert('Please enter a token to join a stage')
      return
    }
    try {
      const stage = new Stage(token, strategyRef.current)
      stage.on(StageEvents.STAGE_CONNECTION_STATE_CHANGED, handleConnectionStateChange)
      stage.on(StageEvents.STAGE_PARTICIPANT_JOINED, handleParticipantJoin)
      stage.on(StageEvents.STAGE_PARTICIPANT_LEFT, handleParticipantLeave)
      stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_ADDED, handleMediaAdded)
      stage.on(StageEvents.STAGE_PARTICIPANT_STREAMS_REMOVED, handleMediaRemoved)
      stage.on(StageEvents.STAGE_STREAM_MUTE_CHANGED, handleParticipantMuteChange)

      stageRef.current = stage

      await stageRef.current.join()

      // If we are able to join we know we have a valid token so lets cache it
      sessionStorage.setItem('stage-token', token)
    } catch (e) {
      const err = e as Error
      console.error('Error joining stage', err)
      alert(`Error joining stage: ${err.message}`)
    }
  }

  return { joinStage, stageJoined, leaveStage, participants }
}

function createParticipant(participantInfo: StageParticipantInfo) {
  return {
    ...participantInfo,
    streams: [],
  }
}

function isLocalParticipant(info: StageParticipantInfo) {
  return info.isLocal
}
