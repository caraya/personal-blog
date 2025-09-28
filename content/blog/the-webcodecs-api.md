---
title: The WebCodecs API
date: 2025-11-19
tags:
  - Video
  - APIs
baseline: true
---

The [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API) gives web developers unprecedented, low-level access to the browser's built-in media codecs (the encoders and decoders that process video and audio). This unlocks a wide range of powerful, high-performance applications that previously required cumbersome WebAssembly libraries, server-side processing, or were simply not feasible in a browser. Imagine building applications like real-time video editors with transitions and effects, ultra-low-latency cloud gaming clients, or video conferencing tools that apply virtual backgrounds and noise suppression directly on the user's device.

This post introduces the core concepts of the WebCodecs API, walks through a basic video encoding and decoding workflow, and shows how to build applications that adapt to the user's browser capabilities.

## Why Do We Need WebCodecs?

<baseline-status
  featureId="webcodecs">
</baseline-status>

Before WebCodecs, web developers had limited options for handling raw media. You could use the `video` and `audio` elements for simple playback or the MediaStream API for real-time communication, but these are high-level tools. They don't allow you to directly interact with individual frames of a video. Attempting to grab frames by drawing a `video` element to a `canvas` is inefficient and often loses important color information.

WebCodecs bridges this gap by providing a standardized way to interact directly with media codecs. It provides a clear alternative to WebAssembly codecs (like a custom H.264 encoder) which have a significant performance penalty due to the constant need to copy large amounts of data between JavaScript's memory and WebAssembly's memory. By using the browser's native, often hardware-accelerated codecs, WebCodecs provides a massive performance boost.

This enables you to:

* Encode raw media frames (from a canvas, camera, or generated data) into compressed chunks.
* Decode compressed chunks (from a network stream or a file) back into raw frames.
* Work with individual frames for complex effects, computer vision analysis, or precise editing without the overhead of a full media element.

## Core Concepts

The API is built around a few key interfaces that manage the flow of data into and out of the codecs.

1. `VideoEncoder` &amp; `AudioEncoder`: These classes are the entry point for compression. They take raw, uncompressed VideoFrame or AudioData objects and, after a configuration step, output a stream of compressed EncodedVideoChunk or EncodedAudioChunk objects.
2. `VideoDecoder` &amp; `AudioDecoder`: These classes do the reverse. They are configured to understand a specific compressed format and will accept encoded chunks, outputting the original raw VideoFrame or AudioData objects ready for rendering or processing.
3. `VideoFrame` &amp; `AudioData`: These represent a single, uncompressed frame of video or a slice of audio. A VideoFrame is a highly efficient, transferable object that can be a zero-copy reference to a resource like a `canvas` or a frame from a `video` element. This avoids needless data copying. You can also construct them from raw data buffers like an ArrayBuffer.
4. `EncodedVideoChunk` &amp; `EncodedAudioChunk`: These represent a single packet of compressed data from an encoder. They contain the binary data, a timestamp, a duration, and crucial metadata, most importantly the chunk's type (key or delta). A key frame can be decoded independently, while a delta frame depends on a previous frame, making key frames essential for starting a stream or allowing a user to "seek" to a new position.

## The Basic Workflow: Video Encoding & Decoding

Here is a simplified step-by-step process for compressing and then decompressing a video frame, with more detail on each stage.

### Configuration

Both encoders and decoders must be configured before use. This configuration object tells the codec what kind of data to expect and how to process it.

```js
const encoderConfig = {
  codec: 'avc1.42001E', // H.264 Main Profile, Level 3.0
  width: 1920,
  height: 1080,
  bitrate: 2_000_000, // 2 Mbps
  framerate: 30,
  hardwareAcceleration: 'prefer-hardware',
};

const decoderConfig = {
  codec: 'avc1.42001E',
  // Get description from encoder
  description: encoderOutput.decoderConfig.description,
};
```

The codec string is highly specific. `avc1.42001E` refers to a specific profile and level of the H.264 standard. Using the wrong string will cause configuration to fail.

The description is an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing initialization data that the decoder needs. It's often called "extradata" and is provided by the encoder with the first few output chunks. You must capture it from the encoder's output and pass it to the decoder.

### Initialization

You create instances of the encoder and decoder with configuration objects and callback functions to handle their asynchronous output.

```js
// Callback for encoded chunks
const handleEncodedChunk = (chunk, metadata) => {
  // You could send this chunk over the network or store it
  // For this example, we'll feed it directly to the decoder
  if (metadata.decoderConfig) {
    // The first output may contain the decoder description. Configure the decoder now.
    decoder.configure(metadata.decoderConfig);
  }
  decoder.decode(chunk);
};

// Callback for decoded frames
const handleDecodedFrame = (frame) => {
  // Render this frame to a canvas or use it for something else
  console.log('Frame decoded:', frame.timestamp);
  // Close the frame to release memory
  frame.close();
};

const encoder = new VideoEncoder({
  output: handleEncodedChunk,
  error: (e) => console.error(e.message),
});
encoder.configure(encoderConfig);

const decoder = new VideoDecoder({
  output: handleDecodedFrame,
  error: (e) => console.error(e.message),
});
// Decoder is configured later, once the encoder provides
// the necessary metadata
```

### Creating a VideoFrame

You need a source for your frames. A common source is a `canvas` element, which allows you to encode animations, images, or frames from another video.

```js
const canvas = document.getElementById('myCanvas');
// ... draw something on the canvas ...

// Create a VideoFrame from the canvas.
// The timestamp is vital for ordering.

// timestamp in microseconds
const frame = new VideoFrame(canvas, { timestamp: 0 });
```

The timestamp is crucial for ordering frames correctly and ensuring smooth playback and proper audio-video synchronization.

### Encoding

Once you have a VideoFrame, you send it to the encoder's internal queue. You must also specify if it should be a keyFrame, which is essential for the first frame of a stream.

```js
// The 'keyFrame: true' option forces the encoder to create a self-contained frame
// that doesn't depend on previous frames. This is important for starting
// a stream or seeking. Subsequent frames can be delta frames.
encoder.encode(frame, { keyFrame: true });

// After encoding, the frame's data is now owned by the encoder,
// so you MUST close it to avoid memory leaks. This is a critical step.
frame.close();
```

### Decoding

The encoder's output callback will receive EncodedVideoChunk objects asynchronously. You can then pass these chunks to the decoder's queue.

```js
// Inside the handleEncodedChunk function from step 2:
const handleEncodedChunk = (chunk, metadata) => {
  if (metadata.decoderConfig) {
    // First chunk often contains decoder configuration
    decoder.configure(metadata.decoderConfig);
  }
  decoder.decode(chunk);
};
```

The decoder will then process these chunks and fire its output callback with the reconstructed VideoFrames.

## Checking for Codec Support

While H.264 (avc1) is widely supported, modern browsers often support more efficient codecs like VP9, AV1, or even HEVC (H.265/hvc1). Before configuring an encoder, it's a best practice to check if the user's browser actually supports your desired configuration. Hardcoding a codec string will lead to a fragile application.

The WebCodecs API provides a static, asynchronous method for this: VideoEncoder.isConfigSupported(). It takes a configuration object and returns a promise that resolves with a detailed support object.

Here's how you can use it to build a prioritized list of codecs:

```js
async function findSupportedCodec() {
  const configs = [
    { // AV1 - Most efficient, newest
      codec: 'av01.0.04M.08',
      width: 1920, height: 1080, bitrate: 1_500_000, framerate: 30
    },
    { // VP9 - Great efficiency, widely supported in Chrome/Firefox
      codec: 'vp09.00.10.08',
      width: 1920, height: 1080, bitrate: 1_800_000, framerate: 30
    },
    { // H.264 - Best compatibility
      codec: 'avc1.42001E',
      width: 1920, height: 1080, bitrate: 2_500_000, framerate: 30
    }
  ];

  for (const config of configs) {
    try {
      const { supported, supportedConfig } = await VideoEncoder.isConfigSupported(config);
      if (supported) {
        console.log(`Using supported codec: ${config.codec}`);
        return config; // Return the first fully supported configuration
      }
    } catch (e) {
      console.error(`Error checking ${config.codec}:`, e);
    }
  }
  throw new Error("No supported video codec found!");
}
```

You then use the function to get a supported configuration before initializing the encoder:

```js
const myEncoderConfig = await findSupportedCodec();
encoder.configure(myEncoderConfig);
```

The resolved object contains:

* **supported**: A boolean indicating if the exact configuration is usable.
* **supportedConfig**: The browser's closest supported configuration, which might have adjusted values (e.g., a slightly different bitrate).

This check allows you to create a robust fallback system, preferring modern, efficient codecs like AV1 but gracefully degrading to H.264 to ensure your application runs everywhere.

## Putting It All Together: A Practical Example

Let's look at the core logic from the video compression tool to see how these concepts are applied. This example reads frames from a `video` element, encodes them, and then immediately decodes them for playback on a `canvas`.

The process is kicked off when a user selects a video file.

```js
function startProcessing() {
    const video = sourceVideo; // The `video` element with the user's file
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    let decoder;

    // 1. Define the decoder's output callback
    // This function will draw the decoded (re-compressed) frames to our destination canvas.
    const handleDecodedFrame = (frame) => {
        destCtx.drawImage(frame, 0, 0);
        frame.close(); // Release memory
    };

    // 2. Define the encoder's output callback
    // This function is the glue between the encoder and decoder.
    const handleEncodedChunk = (chunk, metadata) => {
        // The first chunk from the encoder contains configuration data
        // that the decoder needs to initialize itself.
        if (metadata.decoderConfig) {
            decoder = new VideoDecoder({
                output: handleDecodedFrame,
                error: (e) => console.error("Decoder error:", e),
            });
            decoder.configure(metadata.decoderConfig);
        }

        // Once configured, we can send every encoded chunk to the decoder.
        if (decoder) {
            decoder.decode(chunk);
        }
    };

    // 3. Initialize the encoder
    const encoder = new VideoEncoder({
        output: handleEncodedChunk,
        error: (e) => console.error("Encoder error:", e),
    });

    // 4. Configure the encoder with video properties and desired bitrate
    encoder.configure({
        codec: 'avc1.42001E',
        width: videoWidth,
        height: videoHeight,
        bitrate: 2_000_000, // 2 Mbps
        framerate: 30,
    });

    // 5. Create a processing loop using requestAnimationFrame
    // This is the ideal way to process a playing video. It syncs with the browser's
    // rendering cycle, ensuring smooth processing without blocking the UI.
    async function processFrame() {
        if (video.paused || video.ended) {
            // Once the video is done, flush any remaining frames from the encoder/decoder queues.
            await encoder.flush();
            if(decoder) await decoder.flush();
            return;
        }

        // Create a VideoFrame from the video's current visual state.
        const frame = new VideoFrame(video, { timestamp: video.currentTime * 1_000_000 });

        encoder.encode(frame);
        frame.close();

        // Continue the loop for the next frame.
        requestAnimationFrame(processFrame);
    }

    // Start the video and the processing loop.
    video.play();
    video.onplay = () => {
      requestAnimationFrame(processFrame);
    }
}
```

This code sets up a complete pipeline: `video` --> `VideoFrame` --> `VideoEncoder` --> `EncodedVideoChunk` --> `VideoDecoder` --> `VideoFrame` --> `canvas`.

## Conclusion

The WebCodecs API is a powerful tool for advanced media manipulation on the web. It provides the direct, low-level control necessary for building high quality video and audio tools that run efficiently in the browser. While it introduces the responsibility of manual resource management (like calling `frame.close()`) and handling asynchronous streams of data, the performance gains and creative possibilities it unlocks are immense, paving the way for the next generation of web-based multimedia applications.
