import { LocalStageStream, StageParticipantInfo, SubscribeType } from 'amazon-ivs-web-broadcast'

export default class Strategy {
  /**
   * The video stream to publish.
   * @type {MediaStream | undefined}
   */
  private _videoStream?: LocalStageStream

  /**
   * The audio stream to publish.
   * @type {MediaStream | undefined}
   */
  private _audioStream?: LocalStageStream

  /**
   * The type of streams to subscribe to.
   * @type {SubscribeType}
   */
  private _subscribeType: SubscribeType = SubscribeType.NONE

  /**
   * The class constructor.
   *
   * @param {LocalStageStream | undefined} audioStream - The audio stream to publish.
   * @param {LocalStageStream | undefined} videoStream - The video stream to publish.
   * @param {SubscribeType} subscribeType - The type of streams to subscribe to. Defaults to SubscribeType.AUDIO_VIDEO.
   */
  constructor(audioStream?: LocalStageStream, videoStream?: LocalStageStream, subscribeType: SubscribeType = SubscribeType.AUDIO_VIDEO) {
    this._videoStream = videoStream
    this._audioStream = audioStream
    this._subscribeType = subscribeType
  }

  /**
   * Update the media streams to publish.
   *
   * @param {LocalStageStream | undefined} audioStream - The audio stream to publish.
   * @param {LocalStageStream | undefined} videoStream - The video stream to publish.
   */
  updateMedia(audioStream?: LocalStageStream, videoStream?: LocalStageStream): void {
    this._audioStream = audioStream
    this._videoStream = videoStream
  }

  /**
   * Stage the streams to publish.
   * @returns {LocalStageStream[]} The array of streams to publish.
   */
  stageStreamsToPublish(): LocalStageStream[] {
    const streams: LocalStageStream[] = []
    if (this._videoStream) {
      streams.push(this._videoStream)
    }
    if (this._audioStream) {
      streams.push(this._audioStream)
    }
    return streams
  }

  /**
   * Determine if the participant should be published.
   * @param {StageParticipantInfo} participantInfo - The information about the participant.
   * @returns {boolean} True if the participant should be published, false otherwise.
   */
  shouldPublishParticipant(participantInfo: StageParticipantInfo): boolean {
    return true
  }

  /**
   * Determine if the participant should be subscribed to.
   * @param {StageParticipantInfo} participantInfo - The information about the participant.
   * @returns {SubscribeType} The type of streams to subscribe to.
   */
  shouldSubscribeToParticipant(participantInfo: StageParticipantInfo): SubscribeType {
    return this._subscribeType
  }
}
