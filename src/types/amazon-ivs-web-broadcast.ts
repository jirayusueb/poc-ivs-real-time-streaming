import { StageParticipantInfo, StageStream } from 'amazon-ivs-web-broadcast'

export type StageParticipantInfoStream = StageParticipantInfo & { streams: StageStream[] }
