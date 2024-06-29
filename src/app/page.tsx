'use client'

import MediaActions from '@/components/media-actions'
import MediaControl from '@/components/media-controls'
import StageParticipants from '@/components/stage-participants'
import { LocalMediaProvider } from '@/contexts/local-media-context'
import StageProvider from '@/contexts/stage-context'

export default function page() {
  return (
    <LocalMediaProvider>
      <StageProvider>
        <div className="container py-10">
          <div className="flex flex-col gap-10">
            <div className="w-full flex gap-2 flex-col">
              <h1 className="text-3xl font-semibold">IVS Web Broadcast Stages Example</h1>
              <p>
                This sample is used to demonstrate React stages usage.Use the AWS CLIto create a Stage, a corresponding ParticipantToken, and a second ParticipantTokenfor Screenshare. Multiple
                participants can load this page and put in their own tokens. You canread more about stages in our public docs.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <StageParticipants />
              </div>
              <div>
                <MediaControl />
              </div>
            </div>
            <div>
              <MediaActions />
            </div>
          </div>
        </div>
      </StageProvider>
    </LocalMediaProvider>
  )
}

// ref: https://codepen.io/amazon-ivs/project/editor/ZzWobn
