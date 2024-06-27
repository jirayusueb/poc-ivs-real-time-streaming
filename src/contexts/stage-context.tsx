import useScreenshareStage from '@/hooks/use-screen-share-stage'
import useStage from '@/hooks/use-stage'
import { Stage, StageParticipantInfo } from 'amazon-ivs-web-broadcast'
import React, { createContext, PropsWithChildren, useContext } from 'react'

const defaultStageContext = {
  joinStage: undefined,
  participants: [],
  stageConnected: false,
}

const defaultScreenshareStageContext = {
  screenshareStage: undefined,
  joinScreenshareStage: undefined,
  screenshareStageConnected: false,
}

export const StageContext = createContext({
  ...defaultStageContext,
  ...defaultScreenshareStageContext,
})

export const useStageContext = () => useContext(StageContext)

/**
 * StageProvider component that provides the stage context to its children.
 * @param props - PropsWithChildren containing the children components.
 * @returns The StageContext.Provider component.
 */
function StageProvider({ children }: PropsWithChildren<{}>): JSX.Element {
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
    screenshareStage: undefined,
    joinScreenshareStage: undefined,
    screenshareStageConnected: false,
    stageConnected: false,
  }

  return <StageContext.Provider value={state}>{children}</StageContext.Provider>
}

export default StageProvider
