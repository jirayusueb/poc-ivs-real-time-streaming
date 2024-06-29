import Placeholder from '@/components/placeholder'
import Video from '@/components/video'
import { StageStream, StreamType } from 'amazon-ivs-web-broadcast'
import { useEffect, useRef } from 'react'

/**
 * Participant component.
 *
 * @param {ParticipantProps} props - The component props.
 * @param {string} props.id - The participant ID.
 * @param {string} props.userId - The participant user ID.
 * @param {boolean} props.videoStopped - Whether the video is stopped.
 * @param {boolean} props.audioMuted - Whether the audio is muted.
 * @param {StageStream[]} props.streams - The participant's streams.
 * @returns {JSX.Element} The Participant component.
 */
export default function Participant({ userId, videoStopped, audioMuted, streams }: { userId: string; videoStopped: boolean; audioMuted: boolean; streams: StageStream[] }): JSX.Element {
  const videoStream = streams.find((stream) => stream.streamType === StreamType.VIDEO)
  const audioStream = streams.find((stream) => stream.streamType === StreamType.AUDIO)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current && audioStream) {
      audioRef.current.srcObject = new MediaStream([audioStream.mediaStreamTrack])
    }
  }, [audioRef, audioStream])

  return (
    <div>
      <div className="flex flex-col bg-black aspect-video">
        {videoStream && !videoStopped ? <Video stageStream={videoStream} /> : <Placeholder userId={userId} />}
        <audio ref={audioRef} autoPlay />
        {audioMuted ? <span>Audio Muted</span> : null}
      </div>
    </div>
  )
}
