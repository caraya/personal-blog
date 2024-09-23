---
title: Getting The Codec Attribute For html video
date: 2024-09-23
tags:
  - HTML
  - Video
  - Reference
---

In the last post we discussed encoding video using the FFmpeg command line tool as a way to compress video and test the results. We used h.264 (AVC), h.265 (HEVC), VP9 and AV1.

This post will explore the history of embedded content on the web, the `video` element in detail and some tricks and possible drawbacks using the same codecs that we used in the previous post.

## The Early Days

In the early days of the web we depended on plugins to encode the video and the [embed](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed) and [object](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object) elements to actually embed the content on web pages.

While both `embed` and `object` perform similar tasks, they are different in their structure and the type of materials they embed.

This is the basic syntax for the embed element.

```html
<embed
  type="video/mp4"
  src="http://www.domain.com/path/to/movie.mp4"
  width="640"
  height="480"
  title="Title of my video" />
```

The basic `object` code is different than the embed and it embeds the Flash version of a YouTube video. Note that YouTube no longer supports Flash video and uses [iframes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) to embed content.

```html
<object type="application/x-shockwave-flash" data="http://video.google.com/googleplayer.swf?8755581808731033658" width="400" height="326" id="VideoPlayback">
  <param name="movie" value="http://video.google.com/googleplayer.swf?docId=8755581808731033658" />
  <param name="FlashVars" value="playerMode=embedded" />
  <param name="allowScriptAcess" value="sameDomain" />
  <param name="scale" value="noScale" />
  <param name="quality" value="best" />
  <param name="bgcolor" value="#FFF" />
  <param name="salign" value="TL" />
</object>
```

While these two elements are still part of the HTML Living Standard, they are both deprecated and, since most of the technology that uses them is obsolete, it is recommended that you use the `video` and `audio` elements instead.

## A Deep Dive: Video

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

The mobile codec support picture is about the same. The elephant in the room is also Apple and their restrictions... since they have full control of the most used mobile operating systems (iOS and iPadOS), whatever restrictions they choose to enforce becomes "law" in the mobile ecosystem.

| Codec	| Chromium<br>(Android) | Firefox<br>(Android) | Safari<br>(iOS / iPadOS) |
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

For the purpose of this post, we'll use the following example. A video element with three sources, AV1 in an MP4 container, VP9 in a WebM container and an h.264 video in an MP4 container.

This is the code...

```html
<video controls playsinline width="800" height="600">
	<source src="./flower.mp4" type="video/mp4" />
  <source src="./flower.webm" type="video/webm" />
  <source src="./flower.mp4" type="video/mp4" />
</video>
```

Each source provides a different combination of video codecs, audio codecs and containers

1. AV1 video and AAC audio in an MP4 container
2. VP9 video and AAC audio in a WebM container
3. H.264 video and AAC audio in an MP4 container

The browser will look at the sources and use the first format it supports, without looking at any remaining videos, so the order of the videos matters.

The `playsinline` attribute tells the browser to play the video "inline", within the element's playback area.

That's it for the basics, now we'll dwell into the `type` attribute of the `source` element, and provide a fuller picture of how to use it.

Not all videos are encoded the same way. Even if we say we encoded two videos as an h.264 video in an MP4 container they may not be identical and, more important, they may not play in all devices that claim to support the format. Furthermore you can put many codecs inside an MP4 container and they are all MP4 files.

To ensure that the video can be played, we need to add a `codecs` attribute that will fine tune the video type with specific information about the codec the video is using.

In [Getting the correct HTML codecs parameter for an AV1 video](https://jakearchibald.com/2022/html-codecs-parameter-for-av1/) Jake Archibald describes how to get the codec string for AV1 videos.

I'll try to generalize his process to work with other codecs.

We can get an overview of the video file using [mediainfo](https://mediaarea.net/en/MediaInfo) to get an idea of what we're working with. I run the command line version of the tool with this command: `mediainfo shirushi-x264-800x600.mp4`.

Then we use [ffprobe](https://www.ffmpeg.org/ffprobe.html) to gather the metadata necessary to see if we can build the codecs string for all formats.

The pieces of data that we're interested in are: `Codec ID` and `Format Profile` under the Video section.

```text
(general section removed for brevity)

Video
ID                                 	: 1
Format                             	: AVC
Format/Info                        	: Advanced Video Codec
Format profile                     	: High@L3.1
Format settings                    	: CABAC / 4 Ref Frames
Format settings, CABAC             	: Yes
Format settings, Reference frames  	: 4 frames
Codec ID                           	: avc1
Codec ID/Info                      	: Advanced Video Coding

(rest of the results removed)
```

To get the metadata for the video running FFmpeg as show below. Replace `input.mp4` with the name of the file you want to inspect.

```bash
ffprobe -v error \
-select_streams v:0 \
-show_entries stream=codec_name,profile,level,bit_depth \
-of default=nw=1 input.mp4
```

This will output to screen all the specified metadata about the video. We will have to modify the command for each format we want since they all have different parameters required to build the codecs string.

With these information, we can start building the required strings.

## h.264 / Advanced Video Codec (AVC)

The codec string for h.264 videos is formed from the Format ID (`avc1`), the value for the profile, the value of any constraints and the level converted to hexadecimal numbers.

There are three profiles for x.264 videos. They each have one or more constraint values attached to them. We will need them both to build the codecs value.

| Profile Name | Hexadecimal Value | Typical Contraint |
| :---: | :---: | :---: |
| Baseline | 42 | 00 |
| Main | 4D | 40 |
| High | 64 | 00 or C0 |
[Profiles and typical constraints expressed as hexadecimal numbers]

The h.264 specification supports multiple [levels](https://en.wikipedia.org/wiki/Advanced_Video_Coding#Levels). These levels add a specified set of constraints that indicate a degree of required decoder performance for a profile. A decoder that conforms to a given level must be able to decode all bitstreams encoded for that level and all lower levels.

| Level Number | Hexadecimal Value |
| :---: | :---: |
| 1 | 0A |
| 1.1 | 0B |
| 1.2 | 0C |
| 1.3 | 0D |
| 2	 | 14 |
| 2.1	| 15 |
| 2.2 | 16 |
| 3 | 1E |
| 3.1 | 1F |
| 3.2 | 20 |
| 4 | 28 |
| 4.1 | 29 |
| 4.2 | 2A |
| 5 | 32 |
| 5.1 | 33 |
| 5.2 | 34 |
[Levels expressed as hexadecimal numbers]

The `codecs` is built as follows:

1. The Codec ID string (`avc1`)
2. A period (`.`)
3. The Profile + Constraint concatenated together
4. The Level

SO, for a video encoded with the Baseline Profile, Level 3.1, the string would look like this.

```text
avc1.42001f
```

## h.265 / High Efficiency Video Codec (HEVC)

The `codec` string is formed by the Codec ID (`hvc1`), the Profile value as an integer, the Tier (L low and H for high) and the Level as as an integer with the decimal point removed if applicable (4.1 becomes 41).

H.264 provides seven [profiles](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding#Profiles) with varying levels of features support.

| Profile | Value |
| :---: | :---: |
| Main | 1 |
| Main 10 | 2 |
[Profile Mapping]

Levels and Tiers are presented together as a single string.

The levels are integers where we remove any decimal point. Level 2.1 becomes 21.

The available levels for h.265 is shown in the following table:

| Level Number | Value |
| :---: | :---: |
| 1 | 1 |
| 2 | 2 |
| 2.1 | 21 |
| 3 | 3 |
| 3.1 | 31 |
| 4 | 4 |
| 4.1 | 41 |
| 5 | 5 |
| 5.1 | 51 |
| 5.2 | 52 |
| 6 | 6 |
| 6.1 | 61 |
| 6.2 | 62 |

The tiers represent different levels of performance and complexity that are supported by devices and encoders/decoders. Tiers help define the trade-offs between the performance capabilities required to decode or encode video and the video bitstream's quality and complexity.

Unless encoding for a specific purpose, most of the time we will use the main tier.

| Tier | Representation |
| :---: | --- |
| Main | L (low latency) |
| High | H (higher encoding requirements) |
[Tier Mapping]

If you have an H.265 video file with the following information:

Profile: Main (Profile 1)
Tier: Main Tier (L)
Level: 4.1

They become the following values:

* Codec ID: hvc1
* Profile: 1 (Main)
* Tier: L (Main Tier)
* Level: 4.1 → 41

And the string looks like this when applied to the video source.

```text
video/mp4; codecs="hvc1.1.L41"
```

Note that different encoders may produce slightly different results. Some meay report `hvc1` as the string codec test and some may report `hev1`.

The choice between hev1 and hvc1 depends on how the HEVC bitstream is encapsulated in the MP4 container. Both are valid, but they refer to slightly different ways of storing the HEVC stream in the MP4 file:

hvc1
: This indicates that parameter sets (SPS, PPS, VPS) are stored in-band, meaning that they are included in the stream itself at appropriate intervals. Most players prefer hvc1 because the decoder can retrieve the necessary configuration data directly from the stream.

hev1
: This indicates that parameter sets are not included in the stream, but are provided out-of-band. This might mean that the configuration information (SPS, PPS, VPS) is only present at the beginning of the file, making it potentially less compatible with some players.

Which One Should You Use?

In most cases, you should use hvc1 for the codecs attribute in HTML &lt;source> elements because:

* hvc1 is more broadly supported across web browsers and media players.
* It ensures that the parameter sets are embedded within the stream, increasing compatibility.

However, if ffmpeg reports hev1, and you're using the video as-is without modifying it, then it's technically correct to reflect that in the codecs attribute:

```html
<source src="video.mp4" type='video/mp4; codecs="hev1.1.6.L93"'>
```

## VP9

The codec string for VP9 has the following format:

```text
vp09.[profile].[level].[bit_depth]
```

`vp09` is the base codec identifier for VP9.

The [profile](https://en.wikipedia.org/wiki/VP9#Profiles) value  indicates the VP9 profile, typically ranging from 0 to 3, based on the supported color space, chroma subsampling, and bit depth:

| Profile | Color Depth | Chroma Subsampling |
| :---: | :---: | :---: |
| 0	| 8 bit | 4:2:0 |
| 1	| 8 bit	| 4:2:2, 4:4:4 |
| 2	| 10 or 12 bit | 4:2:0 |
| 3	| 10 or 12 bit | 4:2:2, 4:4:4 |
[VP9 Profile Mapping]

The [level](https://en.wikipedia.org/wiki/VP9#Levels) specifies the conformance tier or level of the VP9 encoding. It refers to resolution, frame rate, and other performance characteristics. The level is typically encoded as a 2-digit (e.g., 10, 20, etc.). The most common levels are:

| Level | Value |
| :---: | :---: |
| Level 1.0 | 10 |
| Level 2.0 | 20 |
| Level 3.0 | 30 |
| Level 4.0 | 40 |

Higher numbers correspond to higher levels of performance (such as handling higher resolutions or frame rates).

If you create the files with FFmpeg, it is possible that the encoder will not include the level value and return `-99` as the value. If that's the case, level information wasn't explicitly encoded. The codec string for VP9 might still be constructed based on profile and bit depth, leaving the profile value at `00`.

```text
vp09.00.00.08
```

The third block refers to the bit depth of the video. Typical values are:

| Bith Depth | Value |
| :---: | :---: |
| 8-bit depth | 08 |
| 10-bit depth | 10 |

* **Profile**: 0 (00)
* **Level**: 3.0 (30)
* **Bit Depth**: 8-bit (08)

The corresponding codec string will be:

```text
vp09.00.30.08
```

## AV1

The AV1 codec string is the most complicated of the four. It has the following structure:

```text
av01.[profile].[level/tier].[bit_depth].[chroma_subsampling].[color_range]
```

`av01` is the base codec identifier for AV1 and will remain the same for all AV1-encoded videos.

AV1 has three main profiles: Main, High and Professional. Their main difference is the

| Profile | Value |
| --- | :---: |
| Main Profile (8-bit) | 0 |
| High Profile (10-bit) | 1 |
| Professional Profile (12-bit) | 2 |
[Available AV1 profiles]

The level and tier are encoded together as a combined value of the level (zero-padded) and the tier (M for Main or H for High tiers).

* The level is a zero-padded two-digit integer number (03 for level 3.0)
* The tier can either be M (Main Tier) or H (High Tier)

We then specify the bit depth as a two digit value. The possible values are listed in the following table:

| Depth | Value |
| :---: | :---: |
| 8-bit depth | 08 |
| 10-bit depth | 10 |
[Bith Depth and their corresponding values]

Next is the [Chroma Subsampling](https://en.wikipedia.org/wiki/Chroma_subsampling). It can have the following values:

| Chroma Subsampling | Value |
| --- | :---: |
| 4:4:4 (no subsampling) | 00 |
| 4:2:2 chroma subsampling | 01 |
| 4:2:0 chroma subsampling | 10 |
[Chroma Subsampling Definitions and Values]

The indicates whether the color range is limited or full:

| Color Range | Value |
| :---: | :---: |
| Limited range<br>(typically used in TV content) | 0 |
| Full range<br>(typically used in web content) | 1 |
[Color Ranges]

Example of AV1 Codec Calculation:

* Profile: 0 (Main profile)
* Level/Tier: Level 5.0, Main Tier (M)
* Bit Depth: 8-bit
* Chroma Subsampling: 4:2:0 (10)
* Color Range: Full (1)

The corresponding codec string will be:

```text
av01.0.05M.08.10.1
```

## Additional Considerations

There are a few things worth considering before we build the codec strings.

### Customizing the ffprobe command

This is the ffprobe command that I use to capture information about an MP4 video.

```bash
ffprobe -v error \
-select_streams v:0 \
-show_entries stream=codec_name,profile,level,bit_depth \
-of default=nw=1 input.mp4
```

Since different codecs have different parameters, we need to query the videos to get the data we need.

While there are bitstrem filters to extract metadata for a given codec ([h264_metadata](https://www.ffmpeg.org/ffmpeg-bitstream-filters.html#h264_005fmetadata), [hevc_metadata](https://www.ffmpeg.org/ffmpeg-bitstream-filters.html#hevc_005fmetadata), [vp9_metadata](https://www.ffmpeg.org/ffmpeg-bitstream-filters.html#vp9_005fmetadata) and [av1_metadata](https://www.ffmpeg.org/ffmpeg-bitstream-filters.html#av1_005fmetadata)) they may not provide all the data that we need to gather the data we need for the codec string.

Then we can modify the `ffprobe` command with these h265/x265 specific headers.

```bash
ffprobe -v error \
-select_streams v:0 \
-show_entries stream=profile,level,codec_tag_string \
-of default=noprint_wrappers=1:nokey=1 shirushi-source_libx265_1pass.mp4
```

The same command for x264 looks like this:

```bash
ffprobe -v error -select_streams v:0 \
-show_entries stream=codec_tag_string,profile,level \
-of default=noprint_wrappers=1:nokey=1 shirushi-source_libx264_1pass.mp4
```

This is the VP9 command:

```bash
ffprobe -v error -select_streams \
v:0 -show_entries stream=codec_tag_string,profile,level \
-of default=noprint_wrappers=1:nokey=1 shirushi-source_libvpx-vp9_1pass.mp4
```

And, finally, the AV1 version:

```bash
ffprobe -v error -select_streams v:0 \
-show_entries stream=codec_tag_string,profile,level \
-of default=noprint_wrappers=1:nokey=1 shirushi-source_libsvtav1_1pass.mp4
```

## Links and Resources

* HTML elements
  * [&lt;video>: The Video Embed element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
  * [&lt;source>: The Media or Image Source element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
* Detecting Codec support
  * [Getting the correct HTML codecs parameter for an AV1 video](https://jakearchibald.com/2022/html-codecs-parameter-for-av1/)
  * [Support for ISOBMFF-based MIME types in Browsers](https://cconcolato.github.io/media-mime-support/)
  * [RFC 6381: The 'Codecs' and 'Profiles' Parameters for "Bucket" Media Types](https://datatracker.ietf.org/doc/html/rfc6381)
  * [RFC 4337: MIME Type Registrations for MPEG-4](https://datatracker.ietf.org/doc/html/rfc4337)
  * [Audio and Video](https://www.chromium.org/audio-video/) &mdash; The Chromium Project
* Javascript APIs
  * [HTMLMediaElement: canPlayType() method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canPlayType)
  * [Media Capabilities API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Capabilities_API)
  * [Encrypted Media Extensions API](https://developer.mozilla.org/en-US/docs/Web/API/Encrypted_Media_Extensions_API)
* Tool Specific Resources
  * VP9
    * [VP9 Bitstream & Decoding Process Specification](https://www.webmproject.org/vp9/)
    * [WebM VP9 Codec Information](https://www.webmproject.org/vp9/levels/)
  * AV1
    * [AV1 Codec Overview](https://aomedia.org/av1/)
    * [AV1 Bitstream & Decoding Process Specification](https://aomedia.org/av1-bitstream-and-decoding-process-specification/)
  * H.264/H.265
    * [H.264 (MPEG-4 AVC) ITU-T Recommendation](https://www.itu.int/rec/T-REC-H.264)
    * [H.265 (HEVC) ITU-T Recommendation](https://www.itu.int/rec/T-REC-H.265)
* FFmpeg Documentation
  * [FFmpeg Codecs Documentation](https://ffmpeg.org/ffmpeg-codecs.html)
  * [FFmpeg libvpx-vp9 Encoder Options](https://trac.ffmpeg.org/wiki/Encode/VP9)
* ffprobe for Video Stream Inspection
  * [FFprobe Documentation](https://ffmpeg.org/ffprobe.html)
