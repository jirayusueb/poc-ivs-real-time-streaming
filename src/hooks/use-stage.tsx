import { useLocalMediaContext } from '@/contexts/local-media-context'
import { StageParticipantInfoStream } from '@/types/amazon-ivs-web-broadcast'
import Strategy from '@/utils/strategy'
import { Stage, StageConnectionState, StageEvents, StageParticipantInfo, StageStream } from 'amazon-ivs-web-broadcast'
import { useEffect, useRef, useState } from 'react'

export default function useStage() {
  const [stageJoined, setStageJoined] = useState<boolean>(false)
  const [participants, setParticipants] = useState<Map<string, StageParticipantInfoStream>>(new Map())
  const [localParticipant, setLocalParticipant] = useState<StageParticipantInfo | undefined>(undefined)
  const { currentVideoDevice, currentAudioDevice } = useLocalMediaContext()

  const stageRef = useRef<Stage | undefined>(undefined)
  const strategyRef = useRef<Strategy>(new Strategy(currentAudioDevice, currentVideoDevice))

  useEffect(() => {
    strategyRef.current.updateMedia(currentAudioDevice, currentVideoDevice)
    if (stageRef.current && stageJoined) {
      stageRef.current.refreshStrategy()
    }
  }, [currentAudioDevice, currentVideoDevice, stageJoined])

  /**
   * Handle the event when a participant joins the stage.
   * @param participantInfo - Information about the participant that joined.
   */
  const handleParticipantJoin = (participantInfo: StageParticipantInfo): void => {
    console.log('handleParticipantJoin', { participantInfo })
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
    console.log('handleParticipantLeave', { participantInfo })
    if (isLocalParticipant(participantInfo)) {
      setLocalParticipant(undefined)
    } else {
      if (participants.delete(participantInfo.id)) {
        setParticipants(new Map(participants))
      }
    }
  }

  const handleMediaAdded = (participantInfo: StageParticipantInfo, streams: StageStream[]): void => {
    console.log('handleMediaAdded', { participantInfo, streams })
    const { id } = participantInfo
    let participant = participants.get(id)

    if (!isLocalParticipant(participantInfo) && participant) {
      participant = { ...participant, streams: [...streams, ...participant.streams] }
      setParticipants(new Map(participants.set(id, participant)))
    }
  }

  const handleMediaRemoved = (participantInfo: StageParticipantInfo, streams: StageStream[]): void => {
    console.log('handleMediaRemoved', { participantInfo, streams })
    const { id } = participantInfo
    let participant = participants.get(id)

    if (!isLocalParticipant(participantInfo) && participant) {
      const newStreams = participant.streams.filter((existingStream: any) => !streams.find((removedStream) => existingStream.id === removedStream.id))
      participant = { ...participant, streams: newStreams }
      setParticipants(new Map(participants.set(id, participant)))
    }
  }

  const handleParticipantMuteChange = (participantInfo: StageParticipantInfo, stream: StageStream): void => {
    console.log('handleParticipantMuteChange', { participantInfo, stream })
    const { id } = participantInfo
    let participant = participants.get(id)

    if (!isLocalParticipant(participantInfo) && participant) {
      participant = { ...participant, ...participantInfo }
      setParticipants(new Map(participants.set(id, participant)))
    }
  }

  const handleConnectionStateChange = (state: StageConnectionState): void => {
    console.log('handleConnectionStateChange', { state })
    if (state === StageConnectionState.CONNECTED) {
      setStageJoined(true)
    } else if (state === StageConnectionState.DISCONNECTED) {
      setStageJoined(false)
    }
  }

  function leaveStage(): void {
    console.log('leaveStage')
    if (stageRef.current) {
      stageRef.current.leave()
    }
  }

  async function joinStage(token: string): Promise<void> {
    console.log('joinStage')
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

function createParticipant(participantInfo: StageParticipantInfo): StageParticipantInfoStream {
  return {
    ...participantInfo,
    streams: [],
  }
}

function isLocalParticipant(info: StageParticipantInfo) {
  return info.isLocal
}
