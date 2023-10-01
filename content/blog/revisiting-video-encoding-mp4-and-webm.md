---
title: "Revisiting Video Encoding: MP4 and WebM"
date: "2017-03-01"
---

## Introduction

When HTML first introduced the `video` tag I was pumping my fist in joy. No more plugins to play video content. It was as simple as creating marlup like the one below to play and video in an MP4/ACC container with Egnlish and Swedish subtitles that can be changed as needed.

```markup
<!-- Video with subtitles -->
<video src="foo.mp4" poster="foo-poster.png" 
       width="640" height="480" controls>
  <track kind="subtitles" src="foo.en.vtt" srclang="en" label="English">
  <track kind="subtitles" src="foo.sv.vtt" srclang="sv" label="Svenska">
</video>

```

But it wass never as simple as it looked. Because there was no standard video format for HTML5 video, different browsers supported different container formats and different audio and video codecs. So the video turned into something like this:

```markup
<video height="480" width="640" controls
  poster="https://archive.org/download/WebmVp8Vorbis/webmvp8.gif" >
  <source
    src="https://archive.org/download/WebmVp8Vorbis/webmvp8.webm"
    type="video/webm">
  <source
    src="https://archive.org/download/WebmVp8Vorbis/webmvp8_512kb.mp4"
    type="video/mp4">
  <source
    src="https://archive.org/download/WebmVp8Vorbis/webmvp8.ogv"
    type="video/ogg">
  Your browser doesn't support HTML5 video tag.
</video>
```

which produces the following video player:

 Your browser doesn't support HTML5 video tag. 

Each `source` element loads a different version of the video encoded with a different set of audio and video codecs. These files must be encoded separately and hosted separately.

There are also patent issues around MP4/h264 and ACC codecs. The [MPEG Licensing Authority](http://www.mpegla.com/main/default.aspx) create a ["patent pool"](http://www.wipo.int/export/sites/www/ip-competition/en/studies/patent_pools_report.pdf) of essential technologies for MP4 encoding and decoding.

I had hoped that the new HEVC/h265 technology would not be encumbered by MPEG-LA style patent trolls but it was too much, apparently, as MPEG-LA already has an [HVEC patent pool](http://www.mpegla.com/main/programs/HEVC/Pages/Intro.aspx)

So the fight has remained a stalemate with Mozilla and Opera on one side who refuse to pay the MP4 licensing fee and Microsoft, Google and Apple who have caved in and support MPEG4 playback as part of their HTML5 video implementations.

So, if it's not MPEG4 or HVEC/h265 then what alternatives do we have available?

While Google implements MPEG4 in Chrome it has not remained static in the video codec front. In 2009 Google [purchased On2 Technologies](http://www.zdnet.com/article/a-look-at-on2-technologies-and-why-google-wants-it/) and have worked hard to make VP8, VP9 and its successor, [WebM](https://www.webmproject.org/)

MPEG-LA must have seen the benefit of VP8 becausse they began forming a patent pool for the technology. Google didn't like that and the conflict ended with [an agreement](http://www.osnews.com/story/26849/v) that would remove the MPEG-LA as a factor in VP8 licensing so that Google can continue to offer the code free and unencumbered for personal and commercial use, for now.

Why is this important?

> \[B\]ecause this means that VP8 is a hell of lot safer and more free from possible legal repercussions than H.264 itself. What many H.264 proponents do not understand, either wilfully or out of sheer ignorance, is that those H.264 licenses embedded in Windows, OS X, iOS, your 'professional' camera, and so on, [do not cover commercial use](http://www.osnews.com/story/23236/Why_Our_Civilization_s_Video_Art_and_Culture_is_Threatened_by_the_MPEG-LA). If you shoot a video with your camera in H.264, upload it to YouTube, and get some income from advertisements, you're in violation of the H.264 license (and the MPEG-LA made it clear they had [no qualms about going after individual users](http://www.osnews.com/story/22812/MPEG-LA_Further_Solidifies_Theora_as_the_Only_Video_Tag_Choice)). The extension the MPEG-LA announced (under pressure from VP8 and WebM) changed nothing about that serious legal limitation. — [Google called the MPEG-LA's bluff, and won](http://www.osnews.com/story/26849/v)

[Why Our Civilization's Video Art and Culture is Threatened by the MPEG-LA](http://www.osnews.com/story/23236/Why_Our_Civilization_s_Video_Art_and_Culture_is_Threatened_by_the_MPEG-LA)

The other codec worth looking at (mostly because it's supported by Firefox) is [OGG Theora](https://www.theora.org/) from the Xiph.org Foundation. Like VP8 and WebM Theora is free and unencumbered by patents.

MP4 containers can be optimized for a kind of pseudo streaming by re-arranging the "atoms" of the movie (atoms, in this context, are the chunks of data that make up the movie). The video player is looking or the `moov` atom and will not play the movie until it finds it.

If your server is configured for [HTTP Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) it will request smaller chunks until it find the atom it needs.

![](http://rigor.com/wp-content/uploads/2016/01/mp4-fast-start.png)

Different requests for the same video

Unfortunately for on-demand movies the `moov` atom is at the end of the file. So if the server is not configured to handle range requests then the player will have to download the complete file before it can start playing it.

If you're using already made content or don't want to re-encode the video you can use tools like [Handbrake](https://handbrake.fr/) to optimize the video file for streaming across the web by moving the `moov` atom to the beginning of the file.

![](http://rigor.com/wp-content/uploads/2016/01/handbrake.png)

Using Handbrake to re-arrange the video atoms

If you're working with multiple files or are more comfortable you can use [ffmpeg](https://ffmpeg.org/) to encode the file or add the appropriate flag to fast start playback. In the example below we add the `faststart` flag and use the same audio and video codecs as t he original file.

```bash
ffmpeg -i input.mp4 -movflags faststart \
-acodec copy \
-vcodec copy \
output.mp4
```

You can do something similar with WebM videos. The format is based around the [Matroska container](https://matroska.org/), either VP8 or VP9 video codecs and either Opus or Vorbis audio codecs. Matroska files, usually just called MKV files, use a kind of binary XML called [EBML](https://www.wikiwand.com/en/Extensible_Binary_Meta_Language) to store different things like video tracks, audio tracks, subtitles, and other data. These data chunks are called elements and they are similar in concept to the atoms in an MP4 file.

As with all video formats to start playing a WebM video, a browser has to know where the audio and video data is stored in elements. The element we're looking for is `SeekHead`. By default most video creation tools put a SeekHead element at the start of the video. The problem is that each video can have an unlimited number of `SeakHead`. In this case, the first SeekHead will container a pointer to a second SeekHead located at the end of the file.

Even if the first SeekHead contains pointers to the video and audio tracks, the browser still must go fetch the second SeekHead element, to see if there are additional video or audio tracks in the file, and determine which one has preference. Even if the second SeekHead is completely empty the browser must download and parse all SeekHead elements in the WebM file before it can play video content.

When playing a WebM video locally we don't need to worry about the file structure since we have all the content available for playback. When streaming a video over HTTP the order of elements does matter because the browser doesn't have the complete file yet. If the browser doesn't get certain elements at the beginning of the file it has to send range HTTP requests until it finds the data it needs. This can have impact on how quickly the file starts playing and overall page performance. The discussion below is all about rearranging the elements in the container.

Another aspect of WebM streaming performance is to optimize for seeking inside a video. This is another element, `Cues`. For the same reasons we are optimizing for fast start we want the `Cues` element downloaded as early as possible so that, if a user fast forwards the video, they will get a few HTTP downloads as possible.

To accomplish both goals, fast playback and fast seeking we'll use a single tool, [mkclean](https://www.matroska.org/downloads/mkclean.html), a tool specifically designed to address both the fast start and the fast seek problems. Using `original.webm` we run the following command to create the resulting `optimized.web` ready for the web

```bash
mkclean --doctype 4 \
--keep-cues \
--optimize \
original.webm optimized.webm
```
