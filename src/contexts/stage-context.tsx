'use client'

import useScreenshareStage from '@/hooks/use-screen-share-stage'
import useStage from '@/hooks/use-stage'
import { StageParticipantInfoStream } from '@/types/amazon-ivs-web-broadcast'
import { createContext, PropsWithChildren } from 'react'

interface StageContextState {
  joinStage: (token: string) => Promise<void>
  stageJoined: boolean
  leaveStage: () => void
  participants: Map<string, StageParticipantInfoStream>
  screenshareStageJoined: boolean
  publishScreenshare: (token: string) => Promise<void>
  unpublishScreenshare: () => void
  screenshareStageConnected: boolean
}

export const StageContext = createContext<StageContextState>({
  joinStage: async () => {},
  stageJoined: false,
  leaveStage: () => {},
  participants: new Map(),
  screenshareStageJoined: false,
  publishScreenshare: async () => {},
  unpublishScreenshare: () => {},
  screenshareStageConnected: false,
})

function StageProvider({ children }: PropsWithChildren) {
  const { joinStage, stageJoined, leaveStage, participants } = useStage()
  const { publishScreenshare, unpublishScreenshare, screenshareStageJoined } = useScreenshareStage()

  const state = {
    joinStage,
    stageJoined,
    leaveStage,
    participants,
    screenshareStageJoined,
    publishScreenshare,
    unpublishScreenshare,
    screenshareStageConnected: false,
  }

  return <StageContext.Provider value={state}>{children}</StageContext.Provider>
}

export default StageProvider
