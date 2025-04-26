---
title: Revisiting adaptive streaming video
date: 2025-05-14
tags:
  - Video
  - Streaming
  - Web
---

Adaptive video streaming is a technique used to deliver video content over the internet in a way that adapts to the viewer's network conditions and device capabilities. This approach ensures a smooth playback experience by dynamically adjusting the video quality based on the available bandwidth and processing power.

This post will discuss what is DASH, how it works and how to use DASH on your pages with Shaka Player and how to generate DASH content with Shaka Packager.

## DASH Overview

Dynamic Adaptive Streaming over HTTP (DASH) is a protocol that specified how adaptive content should be fetched. It is effectively a layer built on top of the [Media Source API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API) (also known as Media Source Extensiosn) for building adaptive bitrate streaming clients.

DASH moves lots of logic out of the network protocol and into the client side application logic, using the simpler HTTP protocol to fetch files. Because we don't rely on streaming servers, we can host our video content on a static file server or in a CDN.

While we can use DASH for live streaming, we will concentrate on on-demand video.

We will not address encrypted video using [Encrypted Media Extensions](https://developer.mozilla.org/en-US/docs/Web/API/Encrypted_Media_Extensions_API). While some companies may think DRM is necessary to protect their content, I don't think it's beneficial for all use cases.

### Alternatives to DASH

There are several other protocols and technologies that can be used for adaptive video streaming, each with its own strengths and weaknesses. Here are some alternatives:

[HLS (HTTP Live Streaming)](https://www.cloudflare.com/learning/video/what-is-http-live-streaming/)
: HLS is a streaming protocol that is particularly used on Apple devices and browsers. It's known for its good compatibility.
: HLS uses a single file format (M3U8) for both the manifest and media segments, which can lead to larger file sizes and slower loading times.

[WebRTC (Web Real-Time Communication)](https://webrtc.org/)
: WebRTC is a protocol specifically designed for low-latency, real-time communication. It's ideal for interactive video conferencing and applications where real-time video is crucial.
:  While not what it was originally designed for, you can create on-demand streaming applications with WebRTC. However, it may not be the best choice for traditional video-on-demand scenarios due to its complexity and overhead.

[Microsoft Smooth Streaming](https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-sstr/8383f27f-7efe-4c60-832a-387274457251)
: This protocol is similar to DASH and HLS in that it delivers adaptive video streaming, adjusting quality based on network conditions.
: It's commonly used in IIS and other Microsoft platforms.

## Available tools

There are several tools available for creating and playing DASH content. While they will both use the same DASH protocol and the same manifest file format, they are not interchangeable.

We'll look at two players and two packagers.

### Players

To play DASH video we need an additional library and code to handle the DASH protocol. These libraries will enable us to play DASH content in `video` tags.

Note that both examples reference a manifest file (`.mpd` extension). It is in the manifest file that the player will find the information about the video segments and their locations.

We'll cover generating manifests when we discuss packagers.

#### Dash.js

Dash.js is the reference player for DASH and is maintained by the DASH Industry forum. It is a JavaScript library that allows you to play DASH content in HTML5 video players.

For Dash.js to work, you need to load the Dash.js library from a CDN, and programmatically create a player instance (`example.js` in this case).
The player will then handle the DASH manifest and media segments.

The last element in the HTML file is an empty video tag that Dash.js will fill with the video content.

```html
<script src="https://cdn.dashjs.org/latest/dash.all.min.js"></script>
<script type="module" src="js/example.js"></script>

<div>
  <video
    width="640"
    height="360"
    id="videoPlayer"
    controls></video>
</div>
```

The `example.js` file initializes the player object with its configuration options.

The first attribute represents the element we'll attach the video to.

The second attribute is the URL to the DASH manifest file.

The third attribute is a boolean value that indicates whether the video should start playing automatically.

```javascript
import { MediaPlayer } from 'https://cdn.dashjs.org/v5.0.0/modern/esm/dash.all.min.js';

const player = MediaPlayer().create();
player.initialize(
  document.querySelector('video'),
  'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd',
  true
);
```

#### Shaka Player

in HTML we first the Shaka Player library and the application code.

We can load the Shaka Player library from a CDN or download it and host it yourself. The example below hosts locally.

We then load our local application code (`myapp.js`).

The final element is the HTML file is an empty video tag that Shaka Player will fill with the video content

```html
<script src="js/shaka-player.compiled.js"></script>
<script src="js/myapp.js"></script>

<video id="video"
  width="640"
  poster="https://shaka-player-demo.appspot.com/assets/poster.jpg"
  controls autoplay></video>
```

In Javascript we first assign the DASH manifest URL to a variable. While each manifest can handle multiple video bitrates, there can be only one manifest per video tag.

```javascript
const manifestUri =
    'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
```

Next we initialize the app. This will install all necessary polyfills and check if the browser supports the Shaka Player API. If it does then we call the `initPlayer` function. If it doesn't, we log an error message.

```javascript
function initApp() {
  // Install polyfills for compatibility
  shaka.polyfill.installAll();

  // Check to see for basic API support.
  if (shaka.Player.isBrowserSupported()) {
    initPlayer();
  } else {
    console.error('Browser not supported!');
  }
}
```

The `initPlayer` function creates a new player instance and attaches it to the video element. It also sets up an error handler and loads the manifest.

Loading the manifest file is asynchronous so we wrap it in a try catch block to handle any errors.

```javascript
async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('video');
  const player = new shaka.Player();
  await player.attach(video);

  // Attach player to the window
  // to make console access easier.
  window.player = player;

  // Listen for error events.
  player.addEventListener(
    'error',
    onErrorEvent
  );

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri);
    // Runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (e) {
    // onError runs if the asynchronous load fails.
    onError(e);
  }
}
```

The next block is error handling.

`onErrorEvent(event)` is designed to be an event-listener callback for Shaka Player’s error events.

It receives a browser Event object, but Shaka Player wraps its error in the event’s detail property as a `shaka.util.Error` andcalls the handler, `onError()`, passing along that Error object.

`onError()` takes the `shaka.util.Error` itself as its argument and logs two things to the console:

* `error.code` &mdash; a numeric identifier for the kind of error
* The full error object

In the full error object you get any additional fields available in the object(like severity, category, stack, custom data, etc.).

```javascript
function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}
```

The final task is to attach the `initApp` function to the `DOMContentLoaded` event. This will ensure that the app is initialized only after the DOM is fully loaded.

```javascript
document.addEventListener(
	'DOMContentLoaded',
	initApp
);
```

### Packagers

Packaging DASH content involves creating the video segments and the manifest file. The manifest file is an XML file (`.mpd` extension) that describes the video segments, their locations, and other metadata.

#### FFmpeg

FFmpeg allows you to create both the segments and the manifest file in a single command. The command below will create a DASH manifest file and two video segments, one for each resolution.

The downside to FFMpeg is that it has a lot of flags and parameters and they can be confusing. The following table contains the flags I used and what they are meant to do:

| Flag / Parameter | Explanation |
| :---: | --- |
| -re | Read input in real‐time (throttles reading to match source’s frame rate). Useful when simulating a live source. |
|-i Appleseed-XIII.mkv | Specify the input file. |
| -sn | Disable subtitle streams (skip all subtitles). |
| -map 0:v:0 | Select the first video stream from input. |
|^ (repeated) | When used twice, you create two output video renditions from the same input stream. |
| -map 0:a:0 | Select the first audio stream from input. |
| -c:v libx264 | Encode all selected video streams with the libx264 (H.264) codec. |
| -c:a aac | Encode all selected audio streams with the AAC codec. |
| -b:v:0 300k | Set the target bitrate of video output #0 to 300 kbps. |
| -s:v:0 640x360 | Resize video output #0 to 640×360 pixels. |
| -b:v:1 1500k | Set the target bitrate of video output #1 to 1500 kbps. |
| -s:v:1 1920x1080 | Resize video output #1 to 1920×1080 pixels. |
| -profile:v:1 baseline | Use the H.264 Baseline profile for the second video output (low-complexity devices). |
| -profile:v:0 main | Use the H.264 Main profile for the first video output (standard devices). |
| -profile:v:0 main | Use the H.264 Main profile for the first video output (standard devices). |
| -bf 1 | Allow one B‐frame between P‐frames. |
| -keyint_min 120 | Set the minimum GOP (Group of Pictures) size to 120 frames. |
| -g 120 | Set the maximum GOP size (and I‐frame interval) to 120 frames. |
| -keyint_min 120 | Set the minimum GOP (Group of Pictures) size to 120 frames. |
| -g 120 | Set the maximum GOP size (and I‐frame interval) to 120 frames. |
| -sc_threshold 0 | Disable scene‐change detection (so GOPs stay the same length regardless of cuts). |
| -b_strategy 0 | Disable alternate bitrate decision strategies (forces simpler bitrate decisions). |
| -use_timeline 1 | Enable DASH timeline mode (segments referenced by explicit timeline). |
| -use_template 1 | Enable DASH template mode (segments referenced by URL template). |
| -adaptation_sets "…" | Group streams into logical sets for DASH clients: here id=0,streams=v (video) and id=1,streams=a (audio). |
| -f dash out.mpd | Select the output format “dash” and write the MPD manifest to out.mpd. |

```bash
ffmpeg -re \
  -i Appleseed-XIII.mkv \
  -sn \
  -map 0:v:0 -map 0:v:0 \
  -map 0:a:0 \
  -c:v libx264 \
  -c:a aac \
  -b:v:0 300k   -s:v:0 640x360 \
  -b:v:1 1500k  -s:v:1 1920x1080 \
  -profile:v:1 baseline -profile:v:0 main \
  -bf 1 \
  -keyint_min 120 -g 120 \
  -sc_threshold 0 -b_strategy 0 \
  -use_timeline 1 -use_template 1 \
  -adaptation_sets "id=0,streams=v id=1,streams=a" \
  -f dash out.mpd
```

#### Shaka Packager

The Shaka packager will group together or package segments (audio, video, subtitles and others) into a single manifest file. The packager will also encrypt the segments if specified.

Shaka packager will not create the segments for you. They need to be created first with a tool like FFmpeg.

I chose to use a precompiled binary rather than compile from source (which would be my first inclination). You can find  precompiled binaries on the [Shaka Packager releases page](https://github.com/shaka-project/shaka-packager/releases/)

For this example, I used FFMpeg to create two video renditions (one at 300 kbps and one at 1500 kbps) and two audio renditions (one at 96 kbps and one at 128 kbps). The command below will create the files.

```bash
ffmpeg -i Appleseed-XIII.mkv \
  -map 0:v -map 0:a \
  -c:v libx264 -b:v 300k \
	-s 640x360 -c:a aac -b:a 96k \
  output_360p_300k.mp4 \
  -map 0:v -map 0:a \
  -c:v libx264 -b:v 1500k \
	-s 1920x1080 -c:a aac -b:a 128k \
  output_1080p_1500k.mp4
```

We then use the Shaka Packager to create the manifest file and package the segments. The command below will create a DASH manifest file with two video renditions and two audio renditions.

```bash
shaka-packager \
  input=output_360p_300k.mp4,stream=video,output=video_300k_360p.mp4 \
  input=output_360p_300k.mp4,stream=audio,output=audio_96k.mp4 \
	\
  input=output_1080p_1500k.mp4,stream=video,output=video_1500k_1080p.mp4 \
  input=output_1080p_1500k.mp4,stream=audio,output=audio_128k.mp4 \
	\
  --mpd_output manifest.mpd
```

## Conclusion

Adaptive streaming video is a powerful technique that allows us to deliver high-quality video content over the internet. By using DASH, we can create adaptive video streams that adjust to the viewer's network conditions and device capabilities.

There are few issues.

Shaka Player has issues when using local manifests. Working around these issues is not trivial and may require using the [createObjectURL()](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static) method to create a URL for the manifest file.

In all the examples above, we've only used one video with multiple renditions. In future research, I want to explore how to use multiple video files with multiple renditions or videos with multiple audio tracks.

There are also additional features specific to each player that we can explore. For example, Shaka Player has a built-in UI that we can use to create a custom video player.

## Links and resources

* [DASH Industry Forum](https://dashif.org/)
* Players
  * [Shaka player tutorial](https://shaka-player-demo.appspot.com/docs/api/tutorial-welcome.html)
  * [Shaka player README](https://github.com/shaka-project/shaka-player/tree/main?tab=readme-ov-file)
  * [Dash.js](https://dashif.org/dash.js/)
* Packagers
  * [ffmpeg dash output for multiple resolutions to be in the same mpd file](https://video.stackexchange.com/questions/36191/ffmpeg-dash-output-for-multiple-resolutions-to-be-in-the-same-mpd-file)
  * [Shaka Packager](https://shaka-project.github.io/shaka-packager/html/documentation.html)
