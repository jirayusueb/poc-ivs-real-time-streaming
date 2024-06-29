import Video from '@/components/video'
import { LocalMediaContext } from '@/contexts/local-media-context'
import React, { useContext } from 'react'

function MediaVideo() {
  const { currentVideoDevice } = useContext(LocalMediaContext)

  return <div className="h-full aspect-video bg-black">{currentVideoDevice ? <Video stageStream={currentVideoDevice} /> : null}</div>
}

export default MediaVideo
