import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LocalMediaContext } from '@/contexts/local-media-context'
import { StageContext } from '@/contexts/stage-context'
import { useContext, useState } from 'react'

function MediaControl() {
  const cachedStageToken = sessionStorage.getItem('stage-token') || ''
  const cachedScreenshareStageToken = sessionStorage.getItem('stage-screenshare-token') || ''
  const [stageToken, setStageToken] = useState(cachedStageToken)
  const [screenshareToken, setScreenshareToken] = useState(cachedScreenshareStageToken)

  const { audioDevices, videoDevices, updateLocalAudio, updateLocalVideo } = useContext(LocalMediaContext)
  const { joinStage, stageJoined, leaveStage, screenshareStageJoined, publishScreenshare, unpublishScreenshare } = useContext(StageContext)

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
          <Button onClick={() => joinOrLeaveStage()}>{stageJoined ? 'Leave' : 'Join'}</Button>
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
          <Button onClick={() => toggleScreenshare()}>{screenshareStageJoined ? 'Stop Screenshare' : 'Screenshare'}</Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2 justify-end">
          <Label>Select Webcam</Label>
          <div>
            <Select onValueChange={updateLocalVideo} disabled={!videoDevices.length}>
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
            <Select onValueChange={updateLocalAudio} disabled={!audioDevices.length}>
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

export default MediaControl
