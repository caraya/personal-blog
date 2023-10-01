---
title: "Encoding video for YouTube and web delivery"
date: "2022-11-30"
---

When preparing a video for uploading to YouTube, it's tempting to go to the top of the line and choose to upload the biggest or the smallest file possible and see what YouTube does with it.

If you're working with the YouTube Content Manager, this [support article](https://support.google.com/youtube/answer/1722171?hl=en) explains what the settings for that specific encoding settings are to use when using that product.

Otherwise, we can use the following media formats:

- .MOV
- .MPEG-1
- .MPEG-2
- .MPEG4
- .MP4
- .MPG
- .AVI
- .WMV
- .MPEGPS
- .FLV
- 3GPP
- WebM
- DNxHR
- ProRes
- CineForm
- HEVC (h265)

We will discuss how to encode a video into two versions:

- One that we can to YouTube
- One that we can load directly into a server to use with the `video` element

We will use the [FFmpeg](https://ffmpeg.org/) and some of the code from Jan Ozer's Produce Videos with FFmpeg: The Beginner's Course.

## Before we start

Things haven't changed much since the `video` tag was first introduced, browser support is a mess, although slightly less of a lot than it was a few years ago.

Both because of patents on certain codecs (h264 and h265) and the unwillingness of participants to agree on a common codec for the web we are faced with our first decision: What codec to use.

The table below, compiled from [caniuse](https://caniuse.com/?search=video%20format) data shows the most popular codecs and their browser support.

| Format/codec | Chrome | Edge | Firefox | Safari | Note |
| --- | --- | --- | --- | --- | --- |
| **MPEG4/h.264** | ✅ | ✅ | ✅ | ✅ | See [caniuse](https://caniuse.com/mpeg4) for mobile info |
| **HEVC/h.265** | Partial | Partial | ❌ | ✅ | See [caniuse](https://caniuse.com/hevc) for full details on what the partial support entails |
| **Ogg/Theora** | ✅ | ✅ | ✅ | ❌ | [caniuse entry](https://caniuse.com/ogv) |
| **WebM** | ✅ | ✅ | ✅ | ✅ | See [caniuse](https://caniuse.com/webm) for full compatibility notes |
| **AV1** | ✅ | Partial | ✅ | ❌ | See [caniuse](https://caniuse.com/av1) for full compatibility notes |

The second issue is more technical. For every codec we choose to use, we also have to address bandwidth constraints for our users.

The third issue is hardware-related. Not all devices or browsers support all the codecs in the table above and, while it's possible to use software decoders it will degrade performance.

So with all these considerations, we'll pick two format/codec combinations

- MP4 container with an h.264 video and m4a audio at 1080p resolution
- WebM container with VP9 video and Opus audio at 1080p resolution

## FFmpeg commands

The most basic FFmpeg command looks like this:

```bash
ffmpeg -i the-living-years-vp9.webm \
the-living-years-mp4.mp4
```

The `-i` flag tells FFmpeg what the input file is and the remaining attribute tells what the resulting file is.

The extension on both the input and output files tells the format that we want to work with and the defaults to use for that format.

For the most part, the defaults are OK but we'll dig deeper into what parameters to use.

### Creating the specific files

First, we will look at creating an MP4 file.

The specific features of this video are:

- `-c:v libx264` specifies that we want to use the x264 codec
- `-s 352x240` indicates the size that we want for the resulting video
- `-c:a aac` specified the `aac` codec for audio
- `-b:a 128k` indicates that we want the resulting audio stream to have a 128kbs bitrate
- `-ar 44100` is the sample rate that we want for the audio

```bash
ffmpeg  -i living-years.webm \
-c:v libx264 \
-s  352x240 \
-c:a aac \
-b:a 128k \
-ar 44100 \
living-years.mp4
```

Creating a VP9 version of our video uses the same command with slightly different syntax.

- `c:v libvpx-vp9` indicates that we want to use the VP9 codec available in the `libvpx` library. The distinction is important because the library also handles VP8 video
- `c:a opus` uses the [Opus](https://opus-codec.org/) audio codec

```bash
ffmpeg  -i living-years.webm \
-c:v libvpx-vp9 \
-c:a opus \
-b:a 128k \
-ar 44100 \
living-years-vp9.webm
```

### Scripting the compression

If you're on a macOS or Linux system or running [WSL](https://learn.microsoft.com/en-us/windows/wsl/about) on Windows 10 or 11, you can automate the process using Bash shell scripts.

```bash
#!/usr/bin/env bash

filename=$1

# Encode MP4 first
ffmpeg  -i ${filename} \
-c:v libx264 \
-s  352x240 \
-c:a aac \
-b:a 128k \
-ar 44100 \
${filename}-mp4.mp4

# Encode VP9
ffmpeg  -i ${filename} \
-c:v libvpx-vp9 \
-c:a opus \
-b:a 128k \
-ar 44100 \
${filename}-vp9.webm
```

Save the script under `video-encode.sh`

Before running it we need to ensure that it's executable with the following command:

```bash
chmod +x video-encode.sh
```

Now you can run the script with any video with a command like this:

```bash
./video-encode.sh video-name.format

# example
./video-encode.sh demo-video.webm
```

The script will generate MP4 and VP9 versions of the video.

We can then upload the VP9 video to Youtube or use it in a `video` element.

The `source` attributes reference the videos we've just created. The browser will look at each attribute and play the first one that it supports, even if it would play any formats listed in later `source` elements.

```html
<video id='video'
 controls="controls" 
 width="352" 
 height="240"  
 poster="https://example.com/poster.png">
  <source 
    id='webm' 
    src="http://example.com/video.webm" 
    type='video/webm' />
  <source 
    id='mp4' 
    src="http://example.com/video.mp4" 
    type='video/mp4' />
</video>
```
