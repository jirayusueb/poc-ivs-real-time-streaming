import { Button } from '@/components/ui/button'
import { LocalMediaContext } from '@/contexts/local-media-context'
import { LocalStageStream, StreamType } from 'amazon-ivs-web-broadcast'
import React, { useContext, useState } from 'react'

function MediaActions() {
  const { currentAudioDevice, currentVideoDevice } = useContext(LocalMediaContext)
  const [audioMuted, setAudioMuted] = useState(true)
  const [videoMuted, setVideoMuted] = useState(true)

  if (currentAudioDevice && audioMuted !== currentAudioDevice.isMuted) {
    setAudioMuted(currentAudioDevice.isMuted)
  }

  function toggleDeviceMute(device: LocalStageStream) {
    device.setMuted(!device.isMuted)
    if (device.streamType === StreamType.VIDEO) {
      setVideoMuted(device.isMuted)
    } else {
      setAudioMuted(device.isMuted)
    }
  }

  if (currentVideoDevice && videoMuted !== currentVideoDevice.isMuted) {
    setVideoMuted(currentVideoDevice.isMuted)
  }

  if (!currentAudioDevice || !currentVideoDevice) {
    return null
  }

  return (
    <div className="flex gap-6">
      <Button className="w-full" onClick={() => toggleDeviceMute(currentAudioDevice)}>
        {audioMuted ? 'Unmute Mic' : 'Mute Mic'}
      </Button>
      <Button className="w-full" onClick={() => toggleDeviceMute(currentVideoDevice)}>
        {videoMuted ? 'Show Camera' : 'Hide Camera'}
      </Button>
    </div>
  )
}

export default MediaActions
