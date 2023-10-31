---
title: "Video on the web part 3: HTML"
date: "2023-02-15"
---

In previous posts we've looked at the [theory](https://publishing-project.rivendellweb.net/video-on-the-web-part-1-the-theory/) behind the different formats and codecs you can use for your videos and [how to encode video](https://publishing-project.rivendellweb.net/video-on-the-web-part-2-encoding-video/) for use on the web.

This post will cover the HTML necessary to embed a set of (theoretical) videos that we encoded for the project.

1. MP4 container, AV1 video, and Opus audio
2. WebM container, VP9 video, and Opus audio
3. MP4 container, x264 video, and AAC audio
4. OGG container, OGG video, and Vorbis audio

## Building the element

The basic `<video>` element embeds and plays video a single version of the video.

It also provides attributes that will dictate what elements of the player the users will see and the dimensions of the player.

The attributes are:

controls
: Wether the browser shows default controls (play, pause, seek) for the video

playsinline
:whether a mobile browser should play the video embedded on the page or play it full screen (the default)

autoplay
: Whether the video will start playing as soon as the page loads

poster
: Path to an image that will be used as a placeholder before

width, height
: The dimensions for the player
: This will prevent content from shifting around the page

src
: URL or path to the local path to the file

We also provide textual content in case the browser can't play the video.

```html
<video controls
  playsinline
  autoplay='false'
  poster="path/to/poster/image"
  width="250"
  src="path/to/video.mp4">

  <p>Your browser doesn't support the video tag or doesn't support the format the video is encoded in</p>

  <p>Download the <a href="path/to/video.mp4">MP4 Version</a>
</video>
```

Rather than provide a single element in the `src` attribute of the `<video>` element, we can provide one or more versions of the video in separate `source` child elements.

```html
<video  controls
  playsinline
  autoplay='false'
  poster="path/to/poster/image"
  width="250">

  <source
    src="video/video-av1.mp4"
    type="video/mp4" />

  <source
    src="video/video-vp9.webm"
    type="video/webm" />

  <source
    src="video/video-mp4.mp4"
    type="video/mp4" />

  <source
    src="video/video-ogg.webm"
    type="video/webm" />

  <p>Your browser doesn't suport the video tag or doesn't support for format the video is encoded in</p>

  <p>Download the <a href="path/to/video.mp4">MP4 Version</a>
</video>
```

There's an additional section of the `type` attribute worth discussing: The `codecs` parameter.

This parameter lets some video types give the browser more information to decide if the video can be played or not.

This is important because, without this parameter, the browser will have to download at least part of the video before deciding if it can play it or not.

The values for the codecs parameter will depend on the codec you're using and can get fairly complicated.

We'll look at some of these values and how to get them, but it's not intended to be a complete overview. If you want more information check [The `codecs` parameter in common media types](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter)

## VP8 and VP9 video

WebM containers' codecs strings are fairly easy. You pass a comma-separated list of audio and video codecs as shown in the table below.

| MIME type | Description |
| :-- | :-: |
| video/webm;codecs="vp8" | A WebM video with VP8 video in it; no audio is specified |
| video/webm;codecs="vp9" | A WebM video with VP9 video in it |
| video/webm;codecs="vp8,vorbis" | A WebM container with VP8 video and Vorbis audio |
| video/webm;codecs="vp9,opus" | A WebM container with VP9 video and Opus audio |

## MP4

Finding the values for the `codecs` string inside the `type`

In the case of `avc1.4D401E`, `avc1` indicates H.264 video, and this is followed by a dot and three 2-digit hexadecimal numbers defined by the H.264 standard:

1. profile\_idc
2. the byte containing the constraint\_set flags
3. level\_idc

Some examples:

* `avc1.42E01E`: H.264 Constrained Baseline Profile Level 3
* `avc1.4D401E`: H.264 Main Profile Level 3
* `avc1.64001E`: H.264 High Profile Level 3

To get this data, run the following command:

```bash
ffmpeg -i video.mp4  \
-c:v copy \
-bsf:v trace_headers -f null /dev/null 2>dump.txt
```

And then retrieve the individual headers we're looking for:

```bash
grep profile_idc dump.txt
grep constraint_set dump.txt
grep level_idc dump.txt
```

The values are complicated, they will look something like this:

```bash
[trace_headers @ 0x7fa2683123c0] 8    profile_idc   01100100 = 100
```

Take the 8-digit binary number (the second from the right) and convert it to hexadecimal. In the previous example the hexadecimal value of `profile_idc` is `64`

The hexadecimal representation for `constraint_set` is `00`.

Finally, the hexadecimal value of `level_idc` is `1E`

## AV1

Building the `codecs` string for AV1 video is the most complex so far. As outlined in [Getting the correct HTML codecs parameter for an AV1 video](https://jakearchibald.com/2022/html-codecs-parameter-for-av1/) this will also have to grab the headers for the video using FFMPEG and follow the instructions in Jake's article to construct the codecs string.

So now that we have the values for the `codecs` string, we can add it to the `type` attribute, like so:

```html
<video  controls
  playsinline
  autoplay='false'
  poster="path/to/poster/image"
  width="250">

  <source
    src="video/video-av1.mp4"
    type="video/mp4" />

  <source
    src="video/video-vp9.webm"
    type="video/webm;codecs=vp9,opus" />

  <source
    src="video/video-mp4.mp4"
    type="video/mp4,codec=avc1.4D401E,m4a.40.2" />

  <source
    src="video/video-ogg.ogg"
    type="video/ogg" />

  <p>Your browser doesn't support the video tag or doesn't support for format the video is encoded in</p>

  <p>Download the <a href="path/to/video.mp4">MP4 Version</a>
</video>
```

**The order of the source elements matter**. The browser will play the first format that it supports so you must put your preferred format first and then list the fallbacks in order of preference.

In the previous example. If the browser can play AV1 video in an MP4 container, it will use it and stop the search. Same thing with the second and subsequent fallbacks.

## Accessibility: Subtitles and captions

Although we don't see them often, we should always consider adding subtitles and captions to the videos we put online.

```html
<video id="video"
  controls
  laysinline autoplay="false">

  <source
    src="video/video-mp4.mp4"
    type="video/mp4">
  <source
    src="video/video-webm.webm"
    type="video/webm">

  <track
    label="English"
    kind="subtitles"
    srclang="en"
    src="subtitles/video-subtitles-en.vtt" default>

  <track
    label="Deutsch"
    kind="subtitles"
    srclang="de"
    src="subtitles/video-subtitles-de.vtt">

  <track
    label="Español"
    kind="subtitles"
    srclang="es"
    src="subtitles/video-subtitles-es.vtt">
</video>
```

There are five types of tracks available for `video` elements. For accessibility purposes, the two types of tracks we're interested in are captions and subtitles

Captions and subtitles are not the same thing and should not be used interchangeably.

Subtitles provide translation of content that cannot be understood by the viewer. They may also contain additional content, usually extra background information

Closed captions provide transcription and possibly a translation of audio. They may include important non-verbal information such as music cues or sound effects.

Captions are primarily used to provide additional information for deaf users or when the audio is off.

## Links and Resources

* [&lt;video>: The Video Embed element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
* [The codecs parameter in common media types](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter)
* [<source>: The Media or Image Source element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
* [<track>: The Embed Text Track element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)
* [The `codecs` parameter in common media types](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter)
* [Getting the correct HTML codecs parameter for an AV1 video](https://jakearchibald.com/2022/html-codecs-parameter-for-av1/)
* [Web audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs)
* [Web video codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)
* [How to Encode with FFmpeg 5.0](https://www.streamingmedia.com/Articles/ReadArticle.aspx?ArticleID=152090)
* [Produce Videos with FFmpeg: The Beginner's Course](https://jan-s-school-e088.thinkific.com/courses/produce-videos-with-ffmpeg-the-beginner-s-course) — Paid Course
