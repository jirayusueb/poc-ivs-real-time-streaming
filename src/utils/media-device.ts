/**
 * Initializes the device select elements with the available video and audio devices.
 *
 * @returns {Promise<void>} A promise that resolves when the device select elements are initialized.
 */
export async function initializeDeviceSelect(): Promise<void> {
  const videoSelectEl = document.getElementById('video-devices') as HTMLSelectElement | null

  if (!videoSelectEl) {
    throw new Error('Video select element not found.')
  }

  videoSelectEl.disabled = false
  const { videoDevices, audioDevices } = await getDevices()
  videoDevices.forEach((device, index) => {
    const option = new Option(device.label, device.deviceId)
    videoSelectEl.options[index] = option
  })

  const audioSelectEl = document.getElementById('audio-devices') as HTMLSelectElement | null

  if (!audioSelectEl) {
    throw new Error('Audio select element not found.')
  }

  audioSelectEl.disabled = false
  audioDevices.forEach((device, index) => {
    const option = new Option(device.label, device.deviceId)
    audioSelectEl.options[index] = option
  })
}

/**
 * Retrieves the available video and audio devices.
 *
 * @returns {Promise<{videoDevices: MediaDeviceInfo[], audioDevices: MediaDeviceInfo[]}>} A promise that resolves to an object containing the available video and audio devices.
 */
export async function getDevices(): Promise<{ videoDevices: MediaDeviceInfo[]; audioDevices: MediaDeviceInfo[] }> {
  // The following line prevents issues on Safari/FF WRT to device selects
  // and ensures the device labels are not blank
  await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  const devices: MediaDeviceInfo[] = await navigator.mediaDevices.enumerateDevices()
  const videoDevices: MediaDeviceInfo[] = devices.filter((d: MediaDeviceInfo) => d.kind === 'videoinput')
  if (videoDevices.length === 0) {
    throw new Error('No video devices found.')
  }
  const audioDevices: MediaDeviceInfo[] = devices.filter((d: MediaDeviceInfo) => d.kind === 'audioinput')
  if (audioDevices.length === 0) {
    throw new Error('No audio devices found.')
  }

  return { videoDevices, audioDevices }
}

/**
 * Retrieves the camera track for the specified device ID.
 *
 * @param {string | undefined} deviceId - The ID of the device to use for the camera. If undefined, the default camera is used.
 * @returns {Promise<MediaStreamTrack>} A promise that resolves to the camera track.
 */
export async function getCamera(deviceId?: string): Promise<MediaStreamTrack> {
  let media: MediaStream
  const videoConstraints: MediaTrackConstraints = {
    deviceId: deviceId ? { exact: deviceId } : undefined,
    width: { max: 1280 },
    height: { max: 720 },
  }
  media = await navigator.mediaDevices.getUserMedia({
    video: videoConstraints,
    audio: false,
  })
  return media.getTracks()[0]
}

/**
 * Retrieves the microphone track for the specified device ID.
 *
 * @param {string | undefined} deviceId - The ID of the device to use for the microphone. If undefined, the default microphone is used.
 * @returns {Promise<MediaStreamTrack>} A promise that resolves to the microphone track.
 */
export async function getMic(deviceId?: string): Promise<MediaStreamTrack> {
  let media: MediaStream
  const audioConstraints: MediaTrackConstraints = {
    deviceId,
  }
  media = await navigator.mediaDevices.getUserMedia({
    video: false,
    audio: audioConstraints,
  })
  return media.getTracks()[0]
}

/**
 * Retrieves the screen share track for the specified display media constraints.
 *
 * @param {MediaStreamConstraints} constraints - The constraints for the screen share track.
 * @returns {Promise<MediaStream>} A promise that resolves to the screen share media stream.
 */
export async function getScreenshare(
  constraints: MediaStreamConstraints = {
    video: {
      width: { max: 1280 },
      height: { max: 720 },
    },
  }
): Promise<MediaStream> {
  return navigator.mediaDevices.getDisplayMedia(constraints)
}
