import Participant from '@/components/participant'
import { StageContext } from '@/contexts/stage-context'
import { useContext } from 'react'

function StageParticipants() {
  const { participants } = useContext(StageContext)

  return (
    <div>
      {Array.from(participants.keys()).map((key) => {
        const participant = participants.get(key)!
        return <Participant key={key} {...participant} />
      })}
    </div>
  )
}

export default StageParticipants
