---
title: "Tools for video on the web"
date: "2015-11-16"
categories: 
  - "technology"
---

There are two ways to use video on the web:

- You can upload your content to a hosting server like Youtube or Vimeo and let them worry about compression and delivery
- Compress and upload your video files to your server and assume the cost and the consequences We will work on the second idea, hosting our own video and dealing with storage, transmission and accessibility considerations.

## Creating and using HTML5 video

While not essential to video compression, it is important to know how to create the tags HTML5 video uses to put video on the page

The [Video](http://diveintohtml5.info/video.html) chapter from [Dive into HTML5](http://diveintohtml5.info/) provides a good introduction on the subject and will save us from detailed explanations here.

## What you need to know

The size of video files can be reduced by changing one or bot of the following:

- The codec you choose to use. Some codecs work better than others at a given bitrate
- The dimensions of the file. Larger sizes usually take higher bitrates to maintain quality
- The bitrate (how many bits does it take to render a second of video) the higher the bitrate the larget the size of the video file

### What codec to use

The choice of codecs is influenced by your target platforms and licensing considerations.

In the list below the number indicates the earliest version of the browser that supported the codec. I'm assuming that later versions will support the codec as well.

- [WebM codec support](http://caniuse.com/#feat=webm): Firefox 38, Chrome 41, Opera 32, Chrome for Android 46
- [Ogg/Theora codec suport](http://caniuse.com/#feat=ogv): Firefox 38, Chrome 41, Opera 32
- [MPEG-4/H.264 codec support](http://caniuse.com/#feat=mpeg4): IE 9, Microsoft Edge, Firefox 38, Chrome 41, Safari 8, iOS Safari 8.4, Chrome for Android 46, most if not all ebook readers

One of the biggest considerations when working with MPEG-4/H.264 and most MPEG formats is that they are emcumbered by patents. The licensing is different depending on whether you're using the codec for commercial or non-comercial work, whether you're streaming or not and how many subscribers access your content.

### Bitrate

> Video data rates are given in bits per second. The data rate for a video file is the bitrate. So a data rate specification for video content that runs at 1 megabyte per second would be given as a bitrate of 8 megabits per second (8 mbps). The bitrate for an HD Blu-ray video is typically in the range of 20 mbps, standard-definition DVD is usually 6 mbps, high-quality web video often runs at about 2 mbps, and video for phones is typically given in the kilobits (kbps). For example, these are the targets we usually see for H.264 streaming:
> 
> - LD 240p 3G Mobile @ H.264 baseline profile 350 kbps (3 MB/minute)
> - LD 360p 4G Mobile @ H.264 main profile 700 kbps (6 MB/minute)
> - SD 480p WiFi @ H.264 main profile 1200 kbps (10 MB/minute)
> - HD 720p @ H.264 high profile 2500 kbps (20 MB/minute)
> - HD 1080p @ H.264 high profile 5000 kbps (35 MB/minute)
> 
> From Encoding.com's \[Understanding bitrates in video files\](http://help.encoding.com/knowledge-base/article/understanding-bitrates-in-video-files/)

**Note that 1 byte = 8 bits**. To convert 35MB into bits we need to do the following:

```
35 X 1024 X 1024 X 1024
```

This becomes even more important for ebooks.

When we choose to include the file in our book we need to consider the total size of the book and the possible cost the readers will face when downloading the book to their devices.

When linking to the video hosted elsewhere we assume that the user has WiFI on their device and that they'll be ok with absorbing the bandwidth cost.

## Tools

Rather than rehash the tools and techniques I use, I'll refer you to the video section of Dive into HTML5. Although it's starting to show its age it's still an awesome resource.

> If your video is already compressed then there might or might not be much gain from compressing again. Test and measure results.

### The quick and dirty

When I need to compress video in a hurry, my go to tool is [Miro Video Converter](http://www.mirovideoconverter.com/) a GUI front end to [ffmpeg](https://www.ffmpeg.org/).

It is a crossplatform tool released under GPL. If you are comfortable using ffmpeg directly, Miro has made the its [ffmpeg settings](https://develop.participatoryculture.org/index.php/ConversionMatrix)available so you can use them in your command line experiments.

Rather than write my own instructions I'll refer you to the guide I used to learn and still use when working with Miro: [Dive into HTML5](http://diveintohtml5.it/video.html#miro)

### The more complex

[Handbrake](https://handbrake.fr) provides a more complex video capture and encoding solution without having to jump into commercial software (that's next.) It also allows you to capture unencrypted DVD and Blue Ray video.

Dive into HTML has a good tutorial on using Handbrake to [capture and compress](http://diveintohtml5.it/video.html#handbrake-gui) video.

### Sorenson Squeeze

Sorenson Squeeze is my option when I need the most felixbility and am willing to pay the cost both in terms of money (it is comercial software) and learning curve (the price you pay for the flexibility you get.)

I don't recommend this as a beginner or even intermediate tool. Squeeze, more than the other tools discussed require a lot of experimentation or prior knowledge in order to use corectly. Once you settle on a preset, using Squeeze is as simple as Miro.

In my opinion where Squeeze shines is the creation of multiple bitrate files for Apple's HTTP Live Streaming, Microsoft’s Smooth Streaming, or DASH.

A good tutorial is the tutorial from [Streaming Media Producer](http://www.streamingmedia.com/Producer/Articles/Editorial/Sponsored-Articles/Tutorial-Sorenson-Squeeze-9-94873.aspx)
