'use client'

import useLocalMedia from '@/hooks/use-local-media'
import { getDevices } from '@/utils/media-device'
import { LocalStageStream } from 'amazon-ivs-web-broadcast'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'

export const LocalMediaContext = createContext<LocalMediaContextType>({
  audioDevices: [],
  videoDevices: [],
})

export const useLocalMediaContext = () => useContext(LocalMediaContext)

/**
 * LocalMediaProvider component.
 *
 * @param {PropsWithChildren<{}>} props - The component props.
 * @returns {JSX.Element} The LocalMediaContext.Provider component.
 */
export function LocalMediaProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const [audioDevices, setAudioDevices] = useState<{ label: string; value: string }[]>([])
  const [videoDevices, setVideoDevices] = useState<{ label: string; value: string }[]>([])
  const { localAudio, localVideo, screenshare, setLocalAudio, setLocalVideo, setScreenshare } = useLocalMedia()

  useEffect(() => {
    const setDevices = async (): Promise<void> => {
      const { videoDevices: videoDevicesList, audioDevices: audioDevicesList } = await getDevices()
      setLocalAudio(audioDevicesList[0].deviceId)
      setLocalVideo(videoDevicesList[0].deviceId)
      setAudioDevices(
        audioDevicesList.map((device) => ({
          label: device.label,
          value: device.deviceId,
        }))
      )
      setVideoDevices(
        videoDevicesList.map((device) => ({
          label: device.label,
          value: device.deviceId,
        }))
      )
    }

    setDevices()
  }, [])

  const state: LocalMediaContextType = {
    audioDevices,
    videoDevices,
    screenshare,
    currentAudioDevice: localAudio,
    currentVideoDevice: localVideo,
    updateLocalAudio: setLocalAudio,
    updateLocalVideo: setLocalVideo,
    updateScreenshare: setScreenshare,
  }

  return <LocalMediaContext.Provider value={state}>{children}</LocalMediaContext.Provider>
}

/**
 * The LocalMediaContext type.
 */
export type LocalMediaContextType = {
  audioDevices: { label: string; value: string }[]
  videoDevices: { label: string; value: string }[]
  screenshare?: LocalStageStream
  currentAudioDevice?: LocalStageStream
  currentVideoDevice?: LocalStageStream
  updateLocalAudio?: (id: string) => Promise<void>
  updateLocalVideo?: (id: string) => Promise<void>
  updateScreenshare?: (track?: MediaStreamTrack) => void
}
