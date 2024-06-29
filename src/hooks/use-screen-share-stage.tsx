import { LocalMediaContext } from '@/contexts/local-media-context'
import { getScreenshare } from '@/utils/media-device'
import Strategy from '@/utils/strategy'
import { Stage, StageConnectionState, StageEvents, SubscribeType } from 'amazon-ivs-web-broadcast'
import { useContext, useEffect, useRef, useState } from 'react'

export default function useScreenshareStage() {
  const [screenshareStageJoined, setScreenshareStageJoined] = useState(false)
  const { screenshare, updateScreenshare } = useContext(LocalMediaContext)

  const stageRef = useRef<Stage | undefined>(undefined)
  const strategyRef = useRef(new Strategy(undefined, undefined, SubscribeType.NONE))

  useEffect(() => {
    strategyRef.current.updateMedia(undefined, screenshare)

    if (stageRef.current && screenshareStageJoined) {
      stageRef.current.refreshStrategy()
    }
  }, [screenshare, screenshareStageJoined])

  const handleConnectionStateChange = (state: StageConnectionState) => {
    if (state === StageConnectionState.CONNECTED) {
      setScreenshareStageJoined(true)
    } else if (state === StageConnectionState.DISCONNECTED) {
      setScreenshareStageJoined(false)
    }
  }

  function unpublishScreenshare() {
    if (stageRef.current) {
      stageRef.current.leave()
      updateScreenshare?.(undefined)
    }
  }

  async function publishScreenshare(token: string) {
    if (!strategyRef.current) {
      return
    }
    if (!token) {
      alert('Please enter a token to join a stage')
      return
    }
    try {
      const screenshareVideo = (await getScreenshare()).getVideoTracks()[0]
      updateScreenshare?.(screenshareVideo)
    } catch {
      // cancelled
      return
    }
    try {
      const stage = new Stage(token, strategyRef.current)
      stage.on(StageEvents.STAGE_CONNECTION_STATE_CHANGED, handleConnectionStateChange)

      stageRef.current = stage

      await stageRef.current.join()
      // If we are able to join we know we have a valid token so lets cache it
      sessionStorage.setItem('stage-screenshare-token', token)
    } catch (e) {
      const err = e as Error
      console.error('Error joining screenshare stage', err)
      alert(`Error joining screenshare stage: ${err.message}`)
    }
  }

  return { publishScreenshare, screenshareStageJoined, unpublishScreenshare }
}
