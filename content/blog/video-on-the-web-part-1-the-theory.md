---
title: "Video on the web part 1: The theory"
date: "2023-02-08"
---

When working with video on the web using the `&lt;video>` element there is an important detail that many developers and people writing web content forget.

MP4, WebM, and AV1 are containers and they can have many different audio and video codecs inside; browsers may not (and most likely will not) support all audio and video combinations for all containers.

I first became aware of this when working with MP4 files.

An MP4 container can contain many different codecs for audio and video and browsers may or may not support all those different combinations.

WebM containers have the same issue. There can be any number of audio and video codecs in the WebM file and not all browsers may support the format. This is particularly important if you use AV1 videos, these are not supported in Safari, even when part of an MP4 or WebM container.

A related issue is one of lack of specification. HTML doesn't define a default codec for the `&lt;video>` element so each browser gets to do what they want.

Although things have improved in recent years, this is still a matter of trial and error, particularly with newer codecs like AV1.

**Note:** For the tables in the rest of this post, ✅ represents support and ❌ indicates lack of support.

The first thing we need to find out is if our target browsers support the container we want to use. I've only looked at three container types: MP4, WebM, and OGG.

| Container Format | Chrome | Edge | Safari | Firefox | Notes |
| --* | --* | --* | --* | --* | --* |
| MP4 | ✅ | ✅ | ✅ | ✅ |   |
| WebM | ✅ | ✅ | ✅ | ✅ |   |
| OGG | ✅ | ✅ | ✅ | ✅ |   |

So we have support across all modern browsers for all three containers. You just have to test which one will provide the smallest file size.

Now let's look at video codecs to put in the containers.

The video table is based on data from caniuse.com and Mozilla's [Web video codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs). **It does not include codecs for [WebRTC](https://webrtc.org/), only those codecs that will work in the `&lt;video>` element or its `&lt;source>` children**.

| Format | Full Codec Name | Container Support | Chrome | Edge | Safari | Firefox | Notes |
| --* | --* | --* | --* | --* | --* | --* | --* |
| VP8 | Video Processor 8 | OGG, WebM | ✅ | ✅ | ✅ | ✅ |   |
| VP9 | Video Processor 9 | MP4, OGG, WebM | ✅ | Partial | ❌ | ✅ |   |
| AV1 | AOMedia Video 1 | MP4, WebM | ✅ | Partial | ❌ | ❌ |   |
| h264 | Advanced Video Coding | MP4 | ✅ | ✅ | ✅ | ✅ |   |
| h265 | High Efficiency Video Coding (HEVC) | MP4 | Partial | Partial | ✅ | ❌ |   |
| Theora | Theora | OGG | ✅ | ✅ | ❌ | ✅ |   |

The audio codec information is taken from caniuse.com and from Mozilla's [Web audio codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs).

| Format | Full Name | Container Support | Chrome | Edge | Safari | Firefox | Notes |
| --* | --* | --* | --* | --* | --* | --* | --* |
| AAC | Advanced Audio Coding | MP4 | ✅ | ✅ | ❌ | ✅ |   |
| FLAC | Free Lossless Audio Codec | MP4, OGG | ✅ | ✅ | ✅ | ✅ |   |
| MP3 | MPEG-1 Audio Layer III | MP4 | ✅ | ✅ | ✅ | ✅ | MP3 are MPEG files with no video tracks |
| Opus | Opus | WebM, MP4, Ogg | ✅ | ✅ | ❌ | ✅ |   |
| Vorbis | Vorbis | WebM, Ogg | ✅ | ✅ | ❌ | ✅ |   |

When looking at the available codecs there are many questions to ask before deciding on a final audio codec/video codec/container combination.

The final choice is a balance between several factors. The most important ones to me are:

* audio quality
* video quality
* file size

You also should consider target devices (different devices may support different container/audio/video combinations) and network connectivity or how long will it take to download the video.

## Choosing a video codec

Choosing a video codec requires many decisions and compromises I've found that these questions (adapted from MDN's video codec guide) have helped me make decisions.

* Do you wish to use an open format, or are proprietary formats also to be considered?
* Do you have the resources to produce more than one format for each of your videos?
  * If you can create more than one version of the video you have more flexibility in what you make available and how browsers will play the content
* Are there any browsers you're willing to sacrifice compatibility with?
* How old is the oldest version of the web browser you need to support?

## Choosing an audio codec

Typically any audio codec will work for all projects unless it's designed for a specific type of application. For example: choosing a voice-only codec and trying to use it for music will have unexpected results.

When choosing a codec to use for your audio, you should first consider the following questions:

* If the audio needs to go into a specific container, make sure that the codec you choose is supported in the desired container
* What kind of audio content will the codec be handling?
  * Certain codecs are specifically designed for voice-only content
* What bit rates and other configurable properties does each codec have that may make it a good (or poor) choice?
* To what extent does latency matter for your needs?
  * If you need a sound that is very precisely timed, the lower the latency the better
* How important is the audio quality?
  * If the quality is important you may want to consider a lossless codec (and pay the price of a large file size)
* How much compression do you need to achieve?

Once you have chosen the codec or codecs that you want to use, we can create the videos and add them to web pages using the `&lt;video>` element.
