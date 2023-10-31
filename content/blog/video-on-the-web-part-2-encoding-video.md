---
title: "Video on the web part 2: encoding video"
date: "2023-02-13"
---

In [Video on the web part 1: The theory](https://publishing-project.rivendellweb.net/video-on-the-web-part-1-the-theory/) we discussed the theory of video on the web, what containers, audio and video codecs are available and what browsers support them.

This post will discuss more practical aspects of creating and using video on the web. A follow up post will discuss using the `<video>` element to embed videos on web pages.

This post will not cover DASH or HLS videos.

## Encoding the video

Once we've decided what container and codecs to use, the next step is to create the video or videos that we will use.

To encode the video we will use [FFMPEG](https://ffmpeg.org/)'s command line tool. It provides the most flexibility and it allows for automating the encoding in macOS, Linux and Windows if you use the [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/about).

The simplest FFMPEG command is:

```bash
ffmpeg -i video.mp4 \
-c:v libx264 \
output-video.mp4
```

This commands takes `video.mp4` as the input (indicated by the `-i`) flag, uses lib264 (the open source h264 encoder) and outputs the result as another `MP4` file. It also takes all the FFMPEG defaults:

* Video Codec: h264
  * Data Rate: CRF=23
  * Key Frame: 250
  * Resolution: Same as source
  * Frame rate: Same as source
  * Profile: high
  * X264 Preset: Medium
  * B-frames: as defined in the preset (3)
  * Reference frames: as defined in the preset (3)
* Audio Codec: AAC
  * Audio channels: Same as source
  * Audio samples: 40kHz
  * Audio bitrate: 128 kbps

Replace `video.mp4` with the full path to the video you want to work with and `output-video.mp4` with the name you want to give to the resulting file.

### Explicitly declaring the audio codec

This is not strictly necessary since ACC is the default audio codec when working with h264 video but I believe it's always good to be explicity since people coming into a project or who are not familiar with FFMPEG defaults may not be aware of it.

The `-c:a aac` parameter indicates the audio codec that we want to use.

```bash
ffmpeg -i video.mp4 \
-c:v libx264  \
-c:a aac \
output-video.mp4
```

### Converting to a different format

We can use the same flags that we used to define the video and audio codecs in previuous examples to change the codecs that we use in the video. The final container will be inferred by the extension of the output file.

The following table includes the values for the `c:v` attribute. AV1 has to possible codec values, all others have a single one.

| Format | Type | FFMPEG String |
| :-: | :-: | :-: |
| AVC/h264 | Video | libx264 |
| HEVC/h265 | Video | libx265 |
| VP8 | Video | libvpx |
| VP9 | Video | librvpx-vp9 |
| Theora | Video | libtheora |
| AV1 | Video | libaom-av1 |
| AV1 | Video | librav1e |

The following table shows the values we will use for the `-c:a` parameter in the FFMPEG conversion command.

| Format | Type | FFMPEG String |
| :-: | :-: | :-: |
| AAC | Audio | aac |
| Opus | Audio | libopus |
| MP3 | Audio | libmp3lame |
| FLAC | Audio | flac |
| Vorbis | Audio | vorbis |

With this information, we can convert videos to different formats.

To convert a video to VP9 with Opus audio in a WebM container, the command would look like this:

```bash
ffmpeg -i video.mp4 \
-c:v libvpx-vp9 \
-v:a libopus \
output-video.webm
```

Likewise, to convert a video to AV1 video with AAC audio in an MP4 container the command would look like this:

```bash
ffmpeg -i video.mp4 \
-c:v libaom-av1 \
-c:a aac \
output-video.mp4
```

There may be times when we want to change only the audio or the video codecs, you can do so using the `c:v copy` or `c:a copy` parameters depending on which codec you want to keep, or `-c:av copy` if you want to keep both the audio and video codecs.

This example shows how to change the audio codex in an MP4 video without changing the video codec.

```bash
ffmpeg -i video.mp4 \
-c:v copy \
-c:a libopus \
output-video.mp4
```

The next example converts the video from MP4 to WebM with the same audio codecs.

```bash
ffmpeg -i video.mp4 \
-c:av copy \
output-video.webm
```

## Changing settings

So far, we've left the settings for each format on their defaults, we haven't changed anything other than the codecs and output container. We'll now look at changing settings and characteristics of the video.

The settings will be different for each audio and video codec you use.

In this section we'll look at these cases.

* Video
  * Changing the video resolution
  * Changing the video size
  * Changing the framerate
  * Change the video profile
  * Change the video bitrate setting
* Audio
  * Audio bitrate
  * Audio channels
  * Audio sample rate

While most of these operations should work in all codecs, you should always test with your own content to make sure that you get the results you want.

The sections below will repeat the example with the new relevant filters and parameters.

### Reducing the frame rate

One way to reduce the size of the video file is to reduce the number of frames available for the video. We use a video filter to do so.

```bash
ffmpeg -i video.mp4 \
-filter:v fps=15 \
output-video.mp4
```

### Changing the video size

Another way to reduce the file size is to make the video smaller.

FFMPEG gives you two ways to indicate the size of the target video.

The firt one is to use a predetermined size. The example uses `hd720`, which is equivalent to 1200x720.

```bash
ffmpeg -i input.mp4 \
-c:a copy \
-s hd720 \
output-720-video.mp4
```

You can also set the width and height manually. You can replace the preset with the actual size.

```bash
ffmpeg -i input.mkv \
-c:a copy \
-s 1280x720 \
output.mkv
```

**The size is expressed as `width x height`**

### Changing the framerate

Depending on the type of video, reducing the framerate (fps) may also help reduce the file size since there will be less frames to store in the resulting file.

FFMPEG uses the `-r` flag to control the framerate for the video.

This example will reduce the framerate of the video to 20fps.

```bash
ffmpeg -i input.mp4 \
-c:a copy \
-r 20 \
output.mp4
```

### Change the video bitrate setting

A concept related to frame rate is bit rate.

Where frame rate indicates how many frames will be displayed per second, bit rate refers to how much video data that is being transferred at any given moment.

While it's true that higher bit rates produce higher quality, better looking, video they they also make up for larger file sizes that will take longer to download. Decreasing the bitrate may also affect the subjective quality of the video.

The `b:v` flag indicates the desired average video bitrate for the video.

FFMPEG will calculate and correct the average bit rate produced based on the `-bufsize` option. If we didn't specify -bufsize, these intervals could be significantly longer and would cause the current bit rate to jump a lot over and below the specified average bit rate.

If we specify a smaller `-bufsize`, ffmpeg will check for the output bit rate more frequently and constrain it to the specified average bit rate set from the command line. Hence, lowering `-bufsize` lowers the bitrate variation that the encoder can produce.

```bash
ffmpeg -i input.mp4 \
-c:a copy \
-b:v 5M \
-bufsize 2M \
output-video.mp4
```

This is one of the values where you will have to play with different combinations of bit rate and buffer size to get the best results you want.

These values will be different based on the video source. It's hard to come with a default setting that will work well everywhere.

### Change the video profile

Different codecs provide different profiles. Rather than discuss each set of profiles I've listed the Wikipedia pages where the profiles are listed:

* [h264/AVC Profiles](https://en.wikipedia.org/wiki/Advanced_Video_Coding#Profiles)
* [h265 tiers and levels](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding_tiers_and_levels)
* [AV1 levels](https://en.wikipedia.org/wiki/AV1#Profiles_and_levels)
* [VP9 Profiles](https://en.wikipedia.org/wiki/VP9#Profiles) and [levels](https://en.wikipedia.org/wiki/VP9#Levels)

Note that browser may not support all levels and profiles. Test your desired profile and level combinations before you deploy.

## Audio codecs

Audio codecs are simpler to work with. We'll cover three of the audio parameters:

* Audio codec
* Bitrate
* Channels
* Sample rate

### Audio codec

If you're OK with the defaults, you can skip this option or copy it through to the destination.

The next example explicity adds the AAC audio codec

```bash
ffmpeg -i video.mp4 \
-c:v copy \
-c:a aac \
output-video.mp4
```

While the example below default to AAC when working with h264/AVC videos.

```bash
ffmpeg -i video.mp4 \
-c:v libx264 \
output-video.mp4
```

### Bitrate

Bit rate for audio is similar to bit rate for video.

This example adjust the audio bitrate to 96kbps:

```bash
ffmpeg -i input.mp4 \
-c:v libx264 \
-c:a aac \
-b:a 96k \
output-video.mp4
```

This example adjust the sample rate to 41lkhz down from the original value of 48khz

```bash
ffmpeg -i input.mp4 \
-c:v libx264 \
-c:a aac \
-b:a 96k \
output-video.mp4
```

### Sample rate

The bitrate defines how much data is sent per second of audio. The audio sample rate determines the range of frequencies captured in digital audio.

```bash
ffmpeg -i video.mp4 \ -c:v copy \
-c:a aac \
-ar 44100 \
output-video.mp4
```

### Channels

There may be times when it may make sense to convert a multiple channel stream into a stereo (2-channel) stream or convert a stereo stream in a mono (1-channel) stream.

The `-ac` flag controls the number of audio channels in the output video.

This example will reduce the audio to one channel.

```bash
ffmpeg -i video.mp4 \
-c:v copy \
-c:a aac \
-ac 1 \
output-video.mp4
```

## Final notes and caveats

Not all of these parameters and techniques are applicable to all videos or applicable equally to all videos. You must test your videos and see what areas are more important.

You can create more than one container with multiple codec combinations. We'll look at how to use them in a future post.
