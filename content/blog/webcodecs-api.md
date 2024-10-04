---
title: Webcodecs API
date: 2024-10-07
tags:
  - Video
  - Webcodecs
  - Media
  - Video
  - Audio
  - Javascript
---

WebCodecs is an interesting API. It enhances existing video codecs and allows for video-based applications.

This post will cover the API and how it works.

## What is the WebCodecs API

The WebCodecs API gives web developers low-level access to the individual frames of a video stream and chunks of audio.

Many Web APIs, like the WebAudio and WebRTC, use media codecs internally. However they don't allow developers to work with individual frames of a video stream and unmixed chunks of encoded audio or video.

Web developers have typically gotten around this limitation using WebAssembly in order to get around this limitation. This requires additional bandwidth to download codecs that already exist in the browser, reducing performance and power efficiency, and adding additional development overhead.

The WebCodecs API provides access to codecs that are already in the browser. It gives access to raw video frames, chunks of audio data, image decoders, audio and video encoders and decoders.

## Concepts and Interfaces

Terminology related to WebCodecs.

[AudioDecoder](https://developer.mozilla.org/en-US/docs/Web/API/AudioDecoder)
: Decodes EncodedAudioChunk objects.

[VideoDecoder](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder)
: Decodes EncodedVideoChunk objects.

[AudioEncoder](https://developer.mozilla.org/en-US/docs/Web/API/AudioEncoder)
: Encodes AudioData objects.

[VideoEncoder](https://developer.mozilla.org/en-US/docs/Web/API/VideoEncoder)
: Encodes VideoFrame objects.

[EncodedAudioChunk](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk)
: Represents codec-specific encoded audio bytes.

[EncodedVideoChunk](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk)
: Represents codec-specific encoded video bytes.

[AudioData](https://developer.mozilla.org/en-US/docs/Web/API/AudioData)
: Represents unencoded audio data.

[VideoFrame](https://developer.mozilla.org/en-US/docs/Web/API/VideoFrame)
: Represents a frame of unencoded video data.

[VideoColorSpace](https://developer.mozilla.org/en-US/docs/Web/API/VideoColorSpace)
: Represents the color space of a video frame.

[ImageDecoder](https://developer.mozilla.org/en-US/docs/Web/API/ImageDecoder)
: Unpacks and decodes image data, giving access to the sequence of frames in an animated image.

[ImageTrackList](https://developer.mozilla.org/en-US/docs/Web/API/ImageTrackList)
: Represents the list of tracks available in the image.

[ImageTrack](https://developer.mozilla.org/en-US/docs/Web/API/ImageTrack)
: Represents an individual image track.

[Muxing](https://wiki.videolan.org/Muxing/)
: The process of encapsulating multiple encoded streams – audio, video, and subtitles (if any) – into a container format.

[Demuxing](https://wiki.videolan.org/Demuxing/)
: Demuxing is an abbreviation of demultiplexing. Demuxing is the process of reading a multi-part stream and saving each part &mdash; audio, video, and subtitles (if any) &mdash; as a separate stream. It is the logical reverse of the muxing process.
: There is currently no API for demuxing media containers with WebCodecs. Developers working with containerized media will need to implement their own or use third party libraries like MP4Box.js or jswebm can be used to demux audio and video data into `EncodedAudioChunk` and `EncodedVideoChunk` objects respectively.

## Feature Detection

Since this feature hasn't yet made it to Baseline, we need code defensively by using [feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection) to make sure the code will only run in supported browsers.

```js
if ('VideoEncoder' in window) {
  // WebCodecs API is supported.
  // Do the work here.
}
```

## Working example

This is the HTML elements that we'll use.

```html
<video id="webcam" autoplay muted playsinline style="width: 640px; height: 480px;"></video>

<div class="buttons">
  <button id="start-btn">Start Recording</button>
  <button id="stop-btn" disabled>Stop and Save</button>
</div>
```

The Javascript code is broken down into the following sections:

1. Capture references to the HTML elements defined earlier
2. Initialize variables
3. Start the webcam and requests permission to use it if necessary
4. Use WebCodecs to create a video encoder
5. Create a Writeable Stream to store the encoded video
6. Process each video frame and runs requestAnimationFrame to load the next frame on the video
7. Handles chunks of encoded video
8. Stops the webcam's recording
9. Starts the webcam and sets `click` event listeners for each of the buttons

```js
// 1
const videoElement = document.getElementById('webcam');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');

// 2
let mediaStream;
let mediaRecorder;
let videoTrack;
let videoWriter;
let chunks = [];
let recordedBlobs = [];

// Initialize WebCodecs components
let frameCounter = 0;
let videoEncoder;

// 3
async function startWebcam() {
  // Access the webcam
  mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.srcObject = mediaStream;

  // Create VideoTrack from mediaStream
  videoTrack = mediaStream.getVideoTracks()[0];
}

// 4
async function startRecording() {
  // Setup WebCodecs VideoEncoder
  const videoTrackSettings = videoTrack.getSettings();
  const codecConfig = {
    // Using VP8 codec for video
    codec: 'vp8',
    width: videoTrackSettings.width,
    height: videoTrackSettings.height,
    bitrate: 500_000, // 500kbps
    framerate: videoTrackSettings.frameRate
  };

  videoEncoder = new VideoEncoder({
    output: handleEncodedChunk,
    error: (err) => console.error(err),
  });

  videoEncoder.configure(codecConfig);

  // 5
  // Create a File WritableStream to store the encoded video
  const fileHandle = await window.showSaveFilePicker({
    suggestedName: 'webcam_video.webm',
    types: [{
      description: 'WebM Video',
      accept: { 'video/webm': ['.webm'] }
    }]
  });
  videoWriter = await fileHandle.createWritable();

  // Start processing frames
  processVideoFrames();
  stopButton.disabled = false;
  startButton.disabled = true;
}

// 6
async function processVideoFrames() {
  const videoReader = new VideoFrameReader(videoTrack);

  const processFrame = async () => {
    const frame = await videoReader.read();
    if (frame) {
      frameCounter++;
      videoEncoder.encode(frame);
      frame.close();
      requestAnimationFrame(processFrame); // Continue processing the next frame
    }
  };

  requestAnimationFrame(processFrame); // Start processing frames
}

// 7
async function handleEncodedChunk(chunk) {
  // Write the encoded chunk to the file
  const { byteLength } = chunk;
  const buffer = new ArrayBuffer(byteLength);
  chunk.copyTo(buffer);
  await videoWriter.write(new Uint8Array(buffer));
}

// 8
async function stopRecording() {
  // Stop video track and encoder
  videoTrack.stop();
  videoEncoder.flush();
  videoEncoder.close();

  // Close the file writer
  await videoWriter.close();

  stopButton.disabled = true;
  startButton.disabled = false;
}

// 9
// Start webcam capture
startWebcam();

// Event listeners for buttons
startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
```

I am looking for an example that uses WebCodecs to create a video player without using shared array buffers.

## Links and Resources

* [WebCodecs Explainer](https://github.com/w3c/webcodecs/blob/main/explainer.md)
* [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)
* [Video processing with WebCodecs](https://developer.chrome.com/docs/web-platform/best-practices/webcodecs)
* [WebCodecs API samples](https://w3c.github.io/webcodecs/samples/)
* Webrtchacks
  * [Real-Time Video Processing with WebCodecs and Streams: Processing Pipelines (Part 1)](https://webrtchacks.com/real-time-video-processing-with-webcodecs-and-streams-processing-pipelines-part-1/)
  * [Video Frame Processing on the Web – WebAssembly, WebGPU, WebGL, WebCodecs, WebNN, and WebTransport](https://webrtchacks.com/video-frame-processing-on-the-web-webassembly-webgpu-webgl-webcodecs-webnn-and-webtransport/)
* Demuxers
  * [MP4Box.js](https://gpac.github.io/mp4box.js/)
  * [jswebm](https://jscodec.github.io/jswebm-demo/)
