import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLocalMediaContext } from '@/contexts/local-media-context'
import useStage from '@/hooks/use-stage'
import React, { useState } from 'react'

function MediaConfig() {
  const { audioDevices, videoDevices } = useLocalMediaContext()
  const { leaveStage, joinStage, stageJoined, screenshareStageJoined, unpublishScreenshare, publishScreenshare } = useStage()
  const [stageToken, setStageToken] = useState('')
  const [screenshareToken, setScreenshareToken] = useState('')

  function joinOrLeaveStage() {
    if (stageJoined) {
      leaveStage()
    } else {
      joinStage(stageToken)
    }
  }

  function toggleScreenshare() {
    if (screenshareStageJoined) {
      unpublishScreenshare()
    } else {
      publishScreenshare(screenshareToken)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2 justify-end">
          <Label>Token</Label>
          <div>
            <Input type="text" value={stageToken} onChange={(e) => setStageToken(e.target.value)} id="token" name="token" />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <Button>Join</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2 justify-end">
          <Label>Screenshare Token</Label>
          <div>
            <Input type="text" id="screenshare-token" name="screenshare-token" value={screenshareToken} onChange={(e) => setScreenshareToken(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <Button>Screenshare</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2 justify-end">
          <Label>Select Webcam</Label>
          <div>
            <Select disabled={!videoDevices.length}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((device) => (
                  <SelectItem key={device.value} value={device.value}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-end">
          <Label>Select Mic</Label>
          <div>
            <Select disabled={!audioDevices.length}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((device) => (
                  <SelectItem key={device.value} value={device.value}>
                    {device.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MediaConfig
