import React, { createContext, useContext } from 'react'

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

function StageProvider() {
  return <div>StageContext</div>
}

export default StageProvider
