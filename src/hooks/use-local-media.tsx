import { getCamera, getMic } from '@/utils/media-device'
import { LocalStageStream, StreamType } from 'amazon-ivs-web-broadcast'
import { useState } from 'react'

export default function useLocalMedia() {
  const [localVideo, setLocalVideo] = useState<LocalStageStream | undefined>(undefined)
  const [localAudio, setLocalAudio] = useState<LocalStageStream | undefined>(undefined)
  const [screenshare, setScreenshare] = useState<LocalStageStream | undefined>(undefined)

  function createScreenshare(track: MediaStreamTrack | undefined): void {
    if (!track) {
      setScreenshare(undefined)
      return
    }
    setScreenshare(new LocalStageStream(track))
  }

  async function setLocalVideoFromId(id: string): Promise<void> {
    const videoTrack = await getCamera(id)
    createLocalStream(videoTrack)
  }

  async function setLocalAudioFromId(id: string): Promise<void> {
    const audioTrack = await getMic(id)
    createLocalStream(audioTrack)
  }

  /**
   * Creates a new LocalStageStream based on the provided media track and
   * updates the state accordingly.
   *
   * @param {MediaStreamTrack} track - The media track to use for the stream.
   * @return {void}
   */
  function createLocalStream(track: MediaStreamTrack | undefined): void {
    if (!track) {
      console.warn('tried to set local media with a null track')
      return
    }
    const stream = new LocalStageStream(track, { simulcast: { enabled: true } })
    if (stream.streamType === StreamType.VIDEO) {
      setLocalVideo(stream)
    } else {
      setLocalAudio(stream)
    }
  }

  return {
    localAudio,
    localVideo,
    screenshare,
    setLocalAudio: setLocalAudioFromId,
    setLocalVideo: setLocalVideoFromId,
    setScreenshare: createScreenshare,
  }
}
