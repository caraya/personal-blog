---
title: Compressing video is more than taking bits out
date: 2024-09-18
tags:
  - Video
  - Web
  - Compression
  - Reference
---

I've always been interested in video compression, particularly on how it works for the web.

This post will cover these areas:

* Terminology necessary to understand the commands we will use
* What codecs are currently available for web delivery and some upcoming codecs
* An encoding ladder example
* Examples of one-pass and multi-pass encodings with the codecs we discuss in the post

This post is heavily influenced by the work of Jan Ozer. Unlike Jan's posts, it will not go into deep details of compressing each with each codec. If you're interested in those areas of compression I suggest you look at Jan's articles in Streaming Media Magazine and his Streaming Learning Center

## Terminology

Codec
: A codec is a device or computer program that encodes or decodes a data stream or signal.
: Codec is a portmanteau of `coder/decoder`.

Bitrate
: The amount of information that is transferred per second in a video or audio clip.
: Bitrate is different from other video quality measurements like resolution, frame rate, and video format.
: You can measure bitrate in bits, kilobytes per second (Kbps), or megabytes per second (Mbps).

1-pass encoding
: In 1-pass encoding the encoder does all the work in the single pass.

2-pass encoding
: Two-pass encodings trade time for quality. In the first pass, the encoder analyzes the video file and, during the second pass, the encoder allocates bitrate according to encoding complexity.

Encoding ladder
: A predefined set of video output levels designed to accommodate users with varying devices and network conditions. Each level offering a different balance of resolution, bitrate, and codec parameters.

Container
: A file format that allows multiple data streams to be embedded into a single file.

## Codec Research

Once HTML(5) came around we got a standard way to embed video (using the [video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element) and audio (using the [audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) element)

But having common elements to embed the content didn't mean that browser agreed to what formats these embeds should take.

While it's true that things have gotten better over the years with browsers supporting mostly the same formats the elephant in the room is still Safari.

| Codec	| Chromium Browsers |	Firefox | Safari |
| :---: | :---: | :---: | :---: |
| VP8 | ✓ | ✓ | ✓ |
| VP9 | ✓ | ✓ | Partial[^1] |
| H.264 (AVC) | ✓ | ✓ | ✓ |
| H.265 (HEVC) | ✓ | ✗ | ✓ |
| AV1 | ✓ | ✓ | Partial[^1] |
[Codecs supported in desktop browsers]

[^1]: Supported only on devices with hardware decoder, e.g.  M3 MacBook Pro, etc.

The mobile codec support picture is about the same. The elephant in the room is also Apple and their operating system restrictions... although it's less of an issue in mobile since they can choose not to support older versions of their operating systems or restrict the support to specific hardware.

| Codec	| Chromium<br>(Android) | Firefox<br>(Android) | Safari<br>(iOS) |
| :---: | :---: | :---: | :---: |
| VP8 | ✓ | ✓ | ✓ |
| VP9 | ✓ | ✓ | Partial[^2] |
| H.264 (AVC) | ✓ | ✓ | ✓ |
| H.265 (HEVC) | Partial[^2] | ✗ | ✓[^3] |
| AV1 | ✓ | ✓ | Partial[^2] |
[ Codecs supported in mobile browsers ]

[^2]: Supported only on devices with hardware decoder, currently the iPhone 15 Pro and iPhone 15 Pro Max.
[^3]: Supported for devices with hardware support on Windows only. Enabled by default in Nightly and can be enabled via the `media.wmf.hevc.enabled` pref in `about:config`. 10-bit or higher colors are not supported.

While we have fewer options to evaluate, we should still provide multiple alternatives considering the rungs in our encoding ladder.

### Newer Codecs (Not Web-Ready)

The MPEG group in charge of new codec development has been busy, they've been working on three new codecs: [VVC/H266](https://en.wikipedia.org/wiki/Versatile_Video_Coding), [EVC](https://en.wikipedia.org/wiki/Essential_Video_Coding) and [LCEVC](https://www.lcevc.org/).

While none of these codecs are playable on the web and FFmpeg has only bundled VVC with its tool using a third-party codec in version 7.x, it's worth keeping an eye on these codecs because they provide better quality than what's currently available and it may affect our encoding ladders once browsers adopt these new formats.

## Creating encoding ladders

An encoding ladder is a predefined set of video output levels designed to accommodate users with varying devices and network conditions. Each level offers a different balance of resolution, bitrate, and codec parameters.

These “rungs” of the ladder create versions of your video for all your target devices, from basic mobile phones on slow networks to 4k or 8k display on large TV and high DPI devices with fast gigabit internet connections.

### Steps to create the ladder

Understand Your Audience
: Determine the range of devices, internet speeds, and viewing conditions your users have. This may require some research, analytics review or web server logs analysis.

Select Your Rungs
: Choose the number and characteristics of your output levels. H264 is a commonly used codec, while resolutions typically range from 360p for low-end consumption, up to 1080p or even 4K for high-end viewing.
: Other codecs may offer better tradeoffs than H264 for certain steps in the ladder.

Optimize Your Encodings
: Test various settings within your chosen rungs to find the best balance between quality and file size.
: These changes may involve tweaking factors like the bitrate, frame rate, or keyframe interval.

Monitor & Adjust
: **The ladder should not remain static**.
: Review performance metrics and user feedback to adjust your ladder over time as technology, network conditions, and user behavior evolve.
: As browsers support new codecs, evaluate them to see if they warrant being included on the ladder

Creating an encoding ladder is left as an exercise for the reader... I'm working on building my own.

## Getting Our Hands Dirty

Now we'll look at how to encode in any of these format combinations using FFmpeg command line tool.

I chose FFmpeg because it combines simplicity (we only need one CLI tool rather than try individual encoders for each format) with powerful features.

Before we start, let's look at common attributes across codecs.

| parameter | example | description |
| :---: | :---: | --- |
| -i | -i my_video.mp4 | The input to work from |
| -c:v | -c:v libx264 | What video codec to use |
| -c:a | -c:a copy | What audio codec to use. The value `copy` will copy the audio codec from the source video |
| -b:v | -b:v 5000k | Sets the video bitrate to the associated value |

Most of the other attributes we'll use are codec specific so we'll list them under each codec.

Any compression of a video makes tradeofs between quality and file size. If you want to use the videos online there are additional considerations to make...

Depending on the location and quality of their network connections, your users may not be able to enjoy the 4k-hardware-accelerated video that you want to serve them. Plan accordingly.

Not all videos encoded with the same codec are the same. Plan accordingly

## X264

X264 is supported everywhere that FFmpeg works, so it'll be the baseline for the work that we do.

### Relying on defaults

When we rely on default values, the only thing we must do is pass `libx264` as the value for our video codec (`-c:v`). Everything else will take default values.

```bash
ffmpeg -i shirushi.mp4 \
-c:v libx264 shirushi-x264.mp4
```

### One pass

For one pass encoding we'll introduce the following parameters, in addition to the generic ones.

| parameter | example | description |
| :---: | :---: | --- |
| -preset | -preset medium | What built-in codec preset to use.<br><br>See [preset](https://trac.ffmpeg.org/wiki/Encode/H.264#Preset) for more information |
| -crf | -crf 22 | Specifies the Constant Rate Factor to use. |
| -b:v | -b:v 1000k | controls the target bitrate for the video |
| -minrate | -minrate 750k | specifies a minimum tolerance/value for the video streaI. We're less likely. to use this than `maxrate` and `bufsize` |
| -maxrate | -maxrate 1000k | specifies a maximum tolerance/value for the video stream. This is only used in conjunction with bufsiz |
| -bufsize| -bufsize 2000k | tells the encoder how often to calculate the average bit rate and check to see |
| -g | -g 48 | The number of frames between two I-frames. This is more relevant for adaptive bitrate streaming (ABR) where I-frames must be at the beginning of every segment. |
| -keyint_min | -keyint_min 25 | the minimum interval between I-frames |
| -sc_threshold | -sc_threshold 40 | sets the threshold for the scene change detection|
| -r | -r 12 | sets or changes the video bitrate |


Use CRF if you want to keep the best quality and care less about the file size. Eventhough CRF is the recommended mode for most users, it may not be desirable if you're encoding files for streaming.

This method provides maximum compression efficiency with a single pass. By adjusting the quantizer for each frame, it gets the bitrate it needs to keep the requested quality level.

```bash
ffmpeg -i sources/shirushi-source.mp4 \
-c:v libx264 \
-preset slow -crf 22 \
-c:a copy shirushi-1pass.mp4
```

In a 1-pass encoding we can also specify our target bitrate for the entire video by adding the `-b:v` parameter with the value representing the bitrate we want to target.

```bash
ffmpeg -i sources/Tears-of-Steel.mp4 \
-b:v 1000k \
-c:v libx264 tears-of-steel-x264-1pass.mp4
```

Another aspect we'll look at how to constraint the bitrate.

```bash
ffmpeg -i sources/Tears-of-Steel.mp4 \
-b:v 1000k -maxrate 1000k -bufsize 2000k\
-c:v libx264 tears-of-steel-x264-1pass.mp4
```

The x264 codec uses three different frame types during encoding: I-frame, B-frame, and P-frame. I-frames are self-contained frames that must appear at the start of a file or file segment; otherwise, they might not play correctly. During ABR streaming playback, the player retrieves multiple file segments and plays them back in sequence. One key requirement during encoding is to ensure that the first frame in every segment is an I-frame.

To accomplish this, you must have regular I-frames, and the I-frame interval must divide evenly into the segment size. So, if your segments are 6 seconds long, your I-frame interval must be either 1, 2, 3, or 6, with 2 being the most frequently used.

This will be dependant of the video's frame rate so you'll have to analyze your source material and then test with different parameter combinations to determine your optimal result.

```bash
ffmpeg -i sources/Tears-of-Steel.mp4 \
-g 48 -keyint_min 48 -sc_threshold 0 \
-c:v libx264 tears-of-steel-x264-1pass-gop48.mp4
```

### Two Pass

In a 2-pass encoding scenario the first pass will not produce video; instead it will produce a log file that will help the second pass be more efficient

!!! note **Note:**
You can add additional commands in the second pass but all parameters you put in the first pass **must** also be in the second pass.
!!!

&nbsp;

| parameter | example | description |
| :---: | :---: | --- |
| -pass | -pass 1| What pass of a multi-pass encoding the command is for |

The two lines perform slightly different tasks.

* Line 1:
  * `-y` &mdash; overwrite existing log file
  * `-pass 1` &mdash; first pass, no output file
  * `-f mp4` &mdash; output format for the second pass
  * `NUL` &mdash; creates log file cataloguing encoding complexity (can name log file if desired)
  * `&& \` &mdash; run second pass only if the first command is successful. This will only work on Linux, macOS, and [WSL](https://learn.microsoft.com/en-us/windows/wsl/about). Powershell uses different separators.
* Line 2:
  * `-pass 2` &mdash; find and use log file for encode
  * `Test_1080p_2P.mp4` &mdash; output file name

```bash
ffmpeg -y -i sources/Tears-of-Steel.mp4 -c:v libx264 -b:v 1000k -pass 1 -f mp4 NUL && \
ffmpeg -i sources/Tears-of-Steel.mp4 -c:v libx264 -b:v 1000k -pass 2 tears-of-steel-x264-2pass.mp4
```

## X265

For X265, the commands will be similar but not identical to those on X264.

### Relying on x265 defaults

The oly thing that changes when calling ffmpeg with defaults is the codec we use for videos, we use `libx265` instead of `libx264`.

```bash
ffmpeg -i shirushi.mp4 -c:v libx265 shirushi-x265.mp4
```

### One pass encoding using x265

| parameter | example | description |
| :---: | --- | --- |
| -x265-params | -x265-params qp=22:aq-mode=2 | Adds additional HEVC encoder parameters. This can be used to fine-tune the encoding process or to modify the parameters used by a preset. |

```bash
ffmpeg -i sources/shirushi-source \
-c:v libx265 \
-b:v 1000k
shirushi-x265-1pass.mp4
```

x265 has many parameters you can use to tune the performance of the codec. The complete list of parameters, is [here](https://x265.readthedocs.io/en/stable/cli.html#). You can use these parameters as the value of `-x265-params` to control different aspects of the encoding process beyond what FFmpeg allows you to do.

In this example, we run an encode using the quantization parameter (QP) to 23 and set the Adaptive Quantization (AQ) (aq-mode) to 2. In AQ, the QP of every block changes in a tradeoff between quality and bitrate.

```bash
ffmpeg -i sources/shirushi-source.mp4 \
-c:v libx265 \
-b:v 1000k
-x265-params qp=22:aq-mode=2 \
shirushi-x265-1pass-params.mp4
```

### Two Pass encoding using x265

Two-pass encoding using x265 is similar to what we do with x264.  It is important to remember to add the same parameters to both passes.

* Line 1:
  * `-y` &mdash; overwrite existing log file
  * `-pass 1` &mdash; first pass, no output file
  * `-c:v libx265` indicates we want to encode the video with x265
  * `-f mp4` &mdash; output format for the second pass
  * `NUL` &mdash; creates log file cataloguing encoding complexity (can name log file if desired)
  * `&& \` &mdash; runs second pass only if the first command ran successfully. This is specific to Linux, macOS, and [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)
* Line 2:
  * `-pass 2` &mdash; find and use log file for encode
  * `Test_1080p_2P.mp4` &mdash; output file name

```bash
ffmpeg -y -i input.mp4 -c:v libx265  -b:v 1000k -pass 1 -f mp4 NUL && \
ffmpeg -i input.mp4 -c:v libx265 -b:v 1000k -pass 2  output.mp4
```

## VP9

The VP* family of codecs was acquired by Google when they bought [On2 Technologies](https://en.wikipedia.org/wiki/On2_Technologies) in 2010.

Before the [Alliance for Open Media](https://aomedia.org/) and the [AV1 Codec](https://en.wikipedia.org/wiki/AV1), VP9 was Google's top of the line codec and it was used to encode YouTube videos with large numbers of views. With newer codecs like x265/HEVC and AV1 being supported in browsers, selection is more complicated than perhaps it's necessary...

### Relying on VP9 defaults

As with all the codecs we will start with a default encoding.

The only detail worth mentioning is the value for the video codec: `libvpx-vp9`. The -vp9 part is important. If you leave it out, FFmpeg will encode the video using the older VP8 codec.

```bash
ffmpeg -i sources/shirushi-source.mp4 \
-c:v libvpx-vp9 shirushi-vp9.mp4
```

I did all my tests running on MP4 containers. However, for web deployment you're likely to need the WEBM container so the command would look like this:

```bash
ffmpeg -i sources/shirushi-source.mp4 \
-c:v libvpx-vp9 shirushi-vp9.webm
```

### One pass

| parameter | example | description |
| :---: | --- | --- |
| -threads | -thread 8 | How many threads to use for encoding |
| -speed | -speed 1 | Encoding speed and quality (1 - 4)|
| -tile-columns | -tile-columns 6 | Number of tile columns to use, log2 (from -1 to 6) |
| -frame-parallel | -frame-parallel 1 | Enable frame parallel decodability features |
| -auto-alt-ref | -auto-alt-ref 1 | Enable use of alternate reference frames (2-pass only) (from -1 to 6) |
| -lag-in-frames | -lag-in-frames 25 | Maximum I-frame bitrate (pct) 0=unlimited (from -1 to INT_MAX) |
| -row-mt | -row-mt 1 | Enable row based multi-threading |

The first example will encode the file to an MP4 container with a defined bitrate and all other default values.

```bash
ffmpeg -i sources/shirushi-source.mp4 \
-c:v libvpx-vp9 \
-b:v 1000k \
shirushi-vp9-1pass.mp4
```

The next example is the WebM equivalent to the previous example.

```bash
ffmpeg -i sources/shirushi-source.mp4 \
-c:v libvpx-vp9 \
-b:v 1000k \
shirushi-vp9-1pass.webm
```

### Two Pass

When using 2-pass VP9 encoding, we generate the log file in the first pass with a combination of standard and VP9-specific settings.

The second pass will generate the result video generates the final video using the log generated in the first pass and the same parameters as the first pass.

I went into a lot more detail with codec-specific parameters in both passes.

```bash
ffmpeg -y -i sources/shirushi-source.mp4 \
-c:v libvpx-vp9 -pass 1 \
-b:v 1000K \
-c:a libopus \
-b:a 48000 \
-g 48 -keyint_min 48 \
-threads 8 \
-speed 4 \
-row-mt 1 \
-tile-columns 4 -f webm /dev/null && \

ffmpeg -i sources/shirushi-source.mp4 \
-c:v libvpx-vp9 -pass 2 \
-b:v 1000K \
-c:a libopus \
-b:a 48000 \
-minrate 1000K \
-maxrate 1500K -g 48 \
-keyint_min 48 -row-mt 1 \
-threads 8 -speed 2 \
-tile-columns 4 shirushi-vp9-2pass-optimized.webm
```

## AV1

Av1 is  an open, royalty-free video coding format initially designed for video transmissions over the Internet. It was developed as a successor to VP9 by the [Alliance for Open Media (AOMedia)](https://aomedia.org/), a consortium founded in 2015. (Source: [Wikipedia](https://en.wikipedia.org/wiki/AV1))

### Relying on AV1 defaults

As we've done so far, we will start with the default values for the codec and output to an MP4 container.

```bash
ffmpeg -i sources/shirushi-source.mp4 -c:v libsvtav1 shirushi-av1.mp4
```

### One pass

| parameter | example | description |
| :---: | --- | --- |
| -cpu | -cpu 8 | How many CPUs to use for encoding
| -threads | -thread 8 | How many threads to use for encoding |
| -speed | -speed 1 | Encoding speed and quality (1 - 4)|
| -tile-columns | -tile-columns 6 | Number of tile columns to use |
| -tile-rows | -tile-rows 0 | Number of tile rows to use |
| -frame-parallel | -frame-parallel 1 | Enable frame parallel decodability features. |
| -auto-alt-ref | -auto-alt-ref 1 | Enable use of alternate reference frames in 2-pass |
| -lag-in-frames | -lag-in-frames 25 | Maximum I-frame bitrate |
| -row-mt | -row-mt 1 | Enable row based multi-threading |
| -g | -g 60 | Controls keyframes placement |
|-keyint_min | -keyint_min 60 | Sets the minimum distance between keyframes |

This is similar to the default settings but we apply all the settings necessary to generate a better result with the single encoding pass.

A further exercise would be to remove each parameter and see if it produces a difference in encoding time or quality as measured with VMAF.

```bash
ffmpeg -y -i sources/shirushi-source.mp4 \
-c:v libsvtav1 \
-b:v 1000K \
-c:a copy \
-g 60 -keyint_min 60 \
-cpu-used 8 \
-auto-alt-ref 1 \
-threads 8 \
-tile-columns 1 -tile-rows 0 \
-row-mt 1 \
-lag-in-frames 25 shirushi-av1-1pass.mp4
```

### Two Pass

This is where I hit a rather serious snag in testing. 2-pass encoding is only supported with the older libaom codec. This is slower and will produce different results than the libsvtav1 codec that we've targeted.

Note that, because we tell FFmpeg to use 8 CPUs on the first pass and 4 CPUs this compression may take longer than expected and it may reduce your machine's performance during the encode process.

```bash
ffmpeg -y -i sources/shirushi-source.mp4 \
-c:v libaom-av1 \
-b:v 1000K \
-g 60 -keyint_min 60 \
-cpu-used 8 \
-auto-alt-ref 1 \
-threads 8 \
-tile-columns 1 -tile-rows 0 \
-row-mt 1 \
-lag-in-frames 25 \
-pass 1 -f mp4 NUL && \

ffmpeg -y -i sources/shirushi-source.mp4 \
-c:v libaom-av1 \
-b:v 1000K -maxrate 1500K \
-g 60 -keyint_min 60 \
-cpu-used 4 \
-auto-alt-ref 1 -threads 8 \
-tile-columns 1 -tile-rows 0 \
-row-mt 1 \
-lag-in-frames 25 \
-pass 2 shirushi-2pass-optimized-av1.mp4
```

## VVC

| parameter | example | description |
| :---: | --- | --- |
| -period | -period 2 | set intra frames refresh period in seconds |
| --vvenc-params | -vvenc-params "decodingrefreshtype=idr" | set the vvenc configuration using a :-separated list of key=value parameters |

Versatile Video Coding (VVC), also known as H.266, ISO/IEC 23090-3, and MPEG-I Part 3, is a video compression standard finalized on 6 July 2020, by the Joint Video Experts Team (JVET) of the VCEG working group of ITU-T Study Group 16 and the MPEG working group of ISO/IEC JTC 1/SC 29. It is the successor to High Efficiency Video Coding (HEVC, also known as ITU-T H.265 and MPEG-H Part 2). It was developed with two primary goals – improved compression performance and support for a very broad range of applications. (Source: [Wikipedia](https://en.wikipedia.org/wiki/Versatile_Video_Coding))

FFmpeg has only included support for VVC since version 7. Older versions may have no support or the support may be incomplete.

Since no browser supports VVC playback I thought about not including it but, in the end, I chose to include it as a testing tool to test the available tooling and because I did find a third-party standalone player that could play the format (VVC video and AAC audio in an MP4 container).

Be aware that, unless you have a powerful workstation to run the tests on, the results will be very slow so I would not try it with long clips unless you have the time to let the encoder run.

As for the command, the only peculiarity is using encoder-specific parameters inside `vvenc-params`. The `-decodingrefreshtype=idr` vvenc parameter creates a closed GOP where frames in the group can only reference other frames in the same group (See [Closed GOP and Open GOP – Simplified Explanation](https://ottverse.com/closed-gop-open-gop-idr/) for a more detailed explanation).


```bash
ffmpeg -y -i sources/shirushi-source.mp4 \
-c:v libvvenc \
-b:v 1000k \
-period 2 \
-vvenc-params "decodingrefreshtype=idr" shirushi-vvc.mp4
```

The 2-pass encoding has been more problematic. I used Jan Ozer's 2023 string from [How to Produce VVC With FFmpeg](https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=157714) but it appears that the VVC encoding plugin has changed considerably since the article was published and it took me a while to figure out what to keep and what to remove.

The final commands are shown below. They are optimized for VMAF testing and may not be appropriate for production applications.

```bash
ffmpeg -y -i sources/shirushi-source.mp4 \
-c:a copy \
-c:v libvvenc \
-vvenc-params "decodingrefreshtype=idr" \
-qpa 0 \
-pass 1 \
-b:v 1000k \
-period 2 \
-f mp4 null  && \

ffmpeg -i sources/shirushi-source.mp4 \
-c:a copy \
-c:v libvvenc \
-vvenc-params "decodingrefreshtype=idr" \
-qpa 0 \
-pass 2 \
-b:v 1000k \
-period 2 shirushi_vvc_2pass.mp4
```

## Related topics

Now that we're done with encoding specific commands, let's look at a couple other things we might want to do with the videos, either as steps before (resizing) or after (running a VMAF test) the encoding.

### Resizing Videos

Resizing the video is necessary to make sure we deliver the best possible experience for our users. No matter how much we compress the video, there is never a reason to send a 1200x1600 pixel video to mobile users.

FFmpeg provides

```bash
ffmpeg -i sources/shirushi-source.mp4 \
-c:v libx264 \
-vf "scale=800x600" \
shirushi-x264-800x600.mp4
```

### VMAF Quality Measurement

Video Multimethod Assessment Fusion (VMAF) is an objective full-reference video quality metric developed by Netflix in cooperation with the University of Southern California, The IPI/LS2N lab Nantes Université, and the Laboratory for Image and Video Engineering (LIVE) at The University of Texas at Austin. It predicts subjective video quality based on a reference and distorted video sequence. The metric can be used to evaluate the quality of different video codecs, encoders, encoding settings, or transmission variants. (Source: [Wikipedia](https://en.wikipedia.org/wiki/Video_Multimethod_Assessment_Fusion))

For our testing, the reference video is our original source and the distorted video is the compressed version. Note that the order of the files matter.

```bash
ffmpeg -y -i shirushi-vvc.mp4 \
-i sources/shirushi-source.mp4 \
-lavfi libvmaf=log_path=vvc-output.xml \
-f mp4 ./null
```

## Final Thoughts

As long as this post is, it barely scratches the surface of using FFmpeg to encode video and testing your  encoding settings to determine your optimal encoding for each video you want to publish.

There is plenty to do in this area.  In the next post I'll cover the `video` html tag and how to best use it to present the videos we've encoded.

## References

* Older Codecs
  * [VP8](https://en.wikipedia.org/wiki/VP8)
  * [H.264 (AVC)](https://en.wikipedia.org/wiki/Advanced_Video_Coding)
* New(er) Codecs
  * [VP9](https://en.wikipedia.org/wiki/VP9)
  * [H.265 (HEVC)](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding)
  * [AV1](https://en.wikipedia.org/wiki/AV1)
* Newer MPEG Codecs
  * [VVC, EVC, LCEVC – MPEG’s New Video Codecs](https://ottverse.com/vvc-evc-lcevc-mpeg-video-codecs/)
  * [VVC/H266](https://en.wikipedia.org/wiki/Versatile_Video_Coding)
  * [EVC](https://en.wikipedia.org/wiki/Essential_Video_Coding)
  * [LCEVC](https://www.lcevc.org/)
* Encoding Ladders
  * [How to Build an Encoding Ladder: What You Need to Know](https://streaminglearningcenter.com/articles/how-to-build-an-encoding-ladder.html)
  * [What is CBR, VBR, CRF, Capped-CRF? Rate Control Modes Explained](https://ottverse.com/what-is-cbr-vbr-crf-capped-crf-rate-control-explained/)
  * [Identifying the Top Rung of a Bitrate Ladder](https://ottverse.com/top-rung-of-encoding-bitrate-ladder-abr-video-streaming/)
  * [Constrained VBR Levels of the Rich and Famous](https://streaminglearningcenter.com/codecs/constrained-vbr-levels-of-the-rich-and-famous.html)
  * [How Many Rungs on Your Encoding Ladder?](https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=145458)
  * [Creating the Perfect Encoding Ladder](https://ottverse.com/creating-the-perfect-encoding-ladder/)
* Managing Output Bitrate
  * [Limiting the output bitrate](https://trac.ffmpeg.org/wiki/Limiting%20the%20output%20bitrate)
* Containers
  * [Matroska](https://en.wikipedia.org/wiki/Matroska)
  * [MPEG4 Part 12 / MP4](https://en.wikipedia.org/wiki/MP4_file_format)
  * [OGG](https://en.wikipedia.org/wiki/Ogg)
  * [WebM](https://en.wikipedia.org/wiki/WebM)
* Quality Metrics
  * [VMAF](https://en.wikipedia.org/wiki/Video_Multimethod_Assessment_Fusion)
  * [SSIM](https://en.wikipedia.org/wiki/Structural_similarity_index_measure)
  * [PSNR](https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio)
* Tools
  * [FFmpeg](https://www.ffmpeg.org/)
  * [MSU Video Quality Measurement tools](https://www.compression.ru/video/quality_measure/)
  * Shaka Project Tools
    * [Shaka Player](https://github.com/shaka-project/shaka-player)
    * [Shaka Packager](https://github.com/shaka-project/shaka-packager)
    * [Shaka Streamer](https://shaka-project.github.io/shaka-streamer)
* Encoding Demos
  * AVC
    * [H.264 Video Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/H.264)
  * HEVC
    * [How to Encode with FFmpeg 5.0](https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=152090)
    * [Easy Guide to HEVC Encoding using FFmpeg – CRF, CBR, 2-Pass, and More!](https://ottverse.com/hevc-encoding-using-ffmpeg-crf-cbr-2-pass-lossless/)
  * VP9
    * [Encoding VP9 in FFmpeg: An Update](https://streaminglearningcenter.com/codecs/encoding-vp9-in-ffmpeg-an-update.html)
    * [Basic Encoding](https://developers.google.com/media/vp9/the-basics)
    * [Recommended Settings for VOD](https://developers.google.com/media/vp9/settings/vod)
    * [WebM Wiki – VP9 Encoding Guide](http://wiki.webmproject.org/ffmpeg/vp9-encoding-guide)
    * [FFmpeg.org: FFmpeg and VP9 Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/VP9)
    * [Google developers blog](https://developers.google.com/media/vp9)
  * AV1 and AV1-SVT
    * [AV1](https://en.wikipedia.org/wiki/AV1)
    * [Using SVT-AV1 within ffmpeg](https://gitlab.com/AOMediaCodec/SVT-AV1/-/blob/master/Docs/Ffmpeg.md)
    * [AV1 beats x264 and libvpx-vp9 in practical use case](https://engineering.fb.com/2018/04/10/video-engineering/av1-beats-x264-and-libvpx-vp9-in-practical-use-case/)
  * VVC
    * [How to Produce VVC With FFmpeg](https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=157714) &mdash; Older article, parameters have changed
    * VVENC [FFmpeg Integration](https://github.com/fraunhoferhhi/vvenc/wiki/FFmpeg-Integration)
