import { StageStream } from 'amazon-ivs-web-broadcast'
import { useEffect, useRef } from 'react'

/**
 * Renders a video player for a given stage stream.
 *
 * @param {Object} props - The component props.
 * @param {StageStream} props.stageStream - The stage stream to render.
 * @returns {JSX.Element} The rendered video player.
 */
function Video({ stageStream }: { stageStream: StageStream }): JSX.Element {
  const videoRef: React.RefObject<HTMLVideoElement> = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stageStream) {
      videoRef.current.srcObject = new MediaStream([stageStream.mediaStreamTrack])
    }
  }, [videoRef, stageStream])

  return <video ref={videoRef} autoPlay playsInline />
}

export default Video
