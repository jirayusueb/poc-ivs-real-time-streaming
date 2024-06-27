'use client'

import { Button } from '@/components/ui/button'
import MediaConfig from '@/components/ui/media-config'
import { LocalMediaProvider } from '@/contexts/local-media-context'
import React from 'react'

export default function page() {
  return (
    <LocalMediaProvider>
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
              <div className="h-full aspect-video bg-black"></div>
            </div>
            <div>
              <MediaConfig />
            </div>
          </div>
          <div className="flex gap-6">
            <Button className="w-full">UNMUTE MIC</Button>
            <Button className="w-full">SHOW CAMERA</Button>
          </div>
        </div>
      </div>
    </LocalMediaProvider>
  )
}

// ref: https://codepen.io/amazon-ivs/project/editor/ZzWobn
