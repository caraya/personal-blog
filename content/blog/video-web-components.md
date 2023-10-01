---
title: "Video (Web) Components"
date: "2015-11-30"
categories: 
  - "technology"
---

# Video (web) Component

I've always been interested in seeing how to build a component from scratch and I've always been interested in working with video so why not work on a web component that plays back video with the HTML video tag and associated technologies. We'll talk briefly about these technologies and then we'll jump into the code using Polymer 1.0.

## The idea

The idea is to create a web component that will look something like this.

```markup
<athena-video height='320' width='480' controls poster='images/poster.png'>
  <video-source formats='mp4 webm'></video-source>
</athena-video>
```

We also need to acommodate older browsers that, most likely, will need a Flash-based plugin fallback or links to the source videos.

# The pieces

## HTML5 Video

When it was first introduced HTML video was a revolution. For the first time we could run video without a plugin and were free from Flash, Silverlight and other video plugins.

Because we are using tags to define the video we can use tags and attributes to define and describe what the video looks like and what formats of the video will look like. A sample of the HTML5 video tag looks like this:

```markup
<video 
  id="myvideo" 
  controls="controls"
  class="playr_video"
  width="640" height="480"
  poster="http://media.w3.org/2010/05/sintel/poster.png">
  <!-- 
    These are the three sources. This should cover most of ourr deployed player base
  -->
  <source src="//media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4" />
  <source src="//media.w3.org/2010/05/sintel/trailer.webm" type="video/webm" />
  <source src="//media.w3.org/2010/05/sintel/trailer.ogv" 
  type="video/ogg" />  
</video>
```

The example above defines the following via attributes

- Size of the video (width and height)
- Whether controls are available for this video
- The location for the video's poster image (the image that will display before the video starts)

It also uses child elements to define the video formats we will load, the order in which the browsers will look at them and the location of each individual files.

### Different formats

All was not silver roses... browser vendors could not agree in a common format for video so they adopted multiple video formats for the video tag and none of them are completely free to use.

Some vendors (Google, Microsoft and Apple) pushed for [MP4 video](https://en.wikipedia.org/wiki/H.264/MPEG-4_AVC) (also known as AVC or MPEG-4 Part 10, Advanced Video Coding.) as their solution for I remember going to one of the last QuickTime Live conferences (before it folded into Macworld) and being blown away by the quality of the video and how it was presented. I told myself that I wanted to do something like that and that I wanted my videos to be crisp and not eat all available badnwidth.

[MP4](https://en.wikipedia.org/wiki/MPEG-4_Part_14), as a propietary format, is encumbered by all sorts of patents and royalty schemes from the [MPEG Licensing Authority](http://www.mpegla.com/main/default.aspx) as a holder of the patent pool for h264 and MP4 video

Mozilla and Opera (before adopting Blink as their rendering engine) supported [Theora](http://www.theora.org/), an open format without license encumberance, in an [OGG](https://xiph.org/ogg/) container, betting that the open source community would rally around the open format and eschew MP4 altogether.

But even Mozilla caved in their resistance to MP4 for video on the browser, as Brendan Eich [points out](https://groups.google.com/forum/#!topic/mozilla.dev.platform/-xTei5rYThU%5B126-150%5D) Firefox has little to no foothold in the market and, since Google has not made good on their January 2011, pledge to drop H.264 support from Chrome, Mozilla was left in the not very enviable position where they were the only ones defending a codec that never really took off.

I also have some questions about the licensing for Theora. From the Theora FAQ

> Q. Isn't VP3 a patented technology? The Xiph.org Foundation has negotiated an irrevocable free license from On2 to the VP3 codec. It is legal to use VP3 in any way you see fit (unless, of course, you're doing something illegal with it in your particular jurisdiction). You are free to download VP3 and Theora, use them free of charge, implement them in a for-sale product, implement them in a free product, make changes to the source and distribute those changes, or print the source code out and wallpaper your spare room with it. For more information, check the VP3 Legal Terms on the SVN page.

But all of On2's Intellectual property is owned by Google, a company with a vested interest in a competing codec. Are they bound by On2's irrevocable free license? Is in Google's best interest to continue honoring that license grant?

Google, in their efforts to 'be open', created a new video codec based on VP8 and called it [WebM](http://www.webmproject.org/) and released it as a pattented product with a royalty free license. They've moved some Youtube content (not certain how much) to [HTML5](https://www.youtube.com/html5) and WebM as one of the available codecs, the other being h264.

**_Links about WebM and the MPEG LA_**

- [Ars Technica](http://arstechnica.com/business/2011/04/google-builds-webm-patent-pool-of-its-own-to-fight-back-against-mpeg-la/)
- [The WebM Project](http://blog.webmproject.org/2013/03/vp8-and-mpeg-la.html)
- [The Register](http://www.theregister.co.uk/2013/03/08/google_mpegla_webm_patent_license/%0A)

## VTT Video Tracks

[WebVTT: The Web Video Text Tracks Format](http://dev.w3.org/html5/webvtt/)is a W3C Community Specification meaning that browser vendors are not required to support it. That said [all major browsers support VTT Tracks](http://caniuse.com/#feat=webvtt) (according to caniuse.com)

I wrote an article or the Web Platform Documentation Project about using VTT tracks. I will refer you to the [Web Platform Documentation Project](https://docs.webplatform.org/wiki/concepts/VTT_Captioning) or [The Publishing Project](https://publishing-project.rivendellweb.net/html5-video-captioning-using-vtt/) mirror if you want more detailed information on how to create and use VTT tracks. There is also a [Github repository with examples](https://github.com/caraya/vtt-demos) used in the pages cited earlier.

Revisitng the video example we used when discussing HTML5 video and add captions in multiple languages:

```markup
<video 
    id="myvideo" 
    controls="controls"
    class="playr_video"
    width="640" height="480"
    poster="http://media.w3.org/2010/05/sintel/poster.png">
<!-- 
    These are the three sources. This should cover most of 
    our deployed player base.
-->

    <source src="//media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4" >
    <source src="//media.w3.org/2010/05/sintel/trailer.webm"type="video/webm" >
    <source src="//media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg" >  

<!-- 
    These are the subtitles tracks one for English and one for Spanish
-->
<track kind="captions" label="English" srclang="en" src='vtt/sintel.vtt'>
<track kind="subtitles" label="Espanol" srclang="es" src='vtt/sintel-es.vtt'>
</video>
```

## Polymer

Using Web Components may be a great idea but I'm not 100% certain whether the code to create a set of Polymer Custom Elements, one for the outer video element, one for the video sources and one for the VTT tracks. To do otherwise would make the code unmangeable.

I've called the first element `athena-video` and use it as the container for video and track children. Rather than use multiple tags, I'll leverage dataa binding to create the video and source elements from the same source. In an initial deployment we will not consider VTT tracks and will concentrate on getting the video working.

**_Example with a single format:_**

```markup
<athena-video formats='["mp4"]'
    width="480"
    height="640"
    poster="http://media.w3.org/2010/05/sintel/poster.png"
    source="http://media.w3.org/2010/05/sintel/trailer">
</athena-video>
```

**_Example with multiple formats:_**

```markup
<athena-video formats='["mp4", "webm", "ogg"]'
    width="480"
    height="640"
    poster="http://media.w3.org/2010/05/sintel/poster.png"
    source="http://media.w3.org/2010/05/sintel/trailer">
 </athena-video>
```

Some things to note:

- **The way the formats attribute is declared**: This is a requirement for Polymer to be able to use the data to generate the source child elements
- **The source attribute does not have a format**: We will build the URL programatically so the format extension is not needed here
- All source child elements use the same name to make it easier to generate the source child elements.

The Polymer code is [hosted on Github](https://caraya.github.io/athena-video/) and is shown below for completeness. This does not include the script for `webcomponents.js` or the HTML import for Polymer itself, just the declaration for `athena-video`.

```markup
<dom-module id="athena-video">

  <template>
    <style>
      :host {
        display: block;
        box-sizing: border-box;
      }
      video {
        height: auto;
        max-width: 100%;
      }
    </style>
      <video controls poster="{{poster}}" width="{{width}}" height="{{height}}">
        <template is="dom-repeat" items="{{formats}}" as="format">
          <source src="{{url}}.{{format}}" type="video/{{format}}">
        </template>
      </video>
  </template>
  <script>
    Polymer({

    is: 'athena-video',

      properties: {

        /**
        Formats to use when creating source
        children elements
        */
        formats: {
          type: Array,
          value: '["mp4"]'
        },

        /**
        Height of the video
        */
        height: {
          type: Number,
          value: 640
        },
        /**
        Width of the video
        */
        width: {
          type: Number,
          value: 480
        },
        /**
        URL to the poster image for the video
         */
        poster: {
          type: String,
          value: "images/poster.png"
        },
      }
    });

</script>
</dom-module>
```

For those familiar with Polymer this is an almost bare component. It takes advantage of just a few features of Polymer to make the element work.

athena-video makes extensive use of data binding to build the HTML elements. Using the double moustache syntax it binds attributes from the component to equivalent elements in the result HTML.

It also uses repeating templates (the `template is="dom-repeat"` construct) to loop over the formats array and use each one in turn to build the sosurce element.

We will leverage repeating templates again when working with VTT tracks.

## What's next

There are two areas of work left to consider this element ready:

1. Provide a fallback for older browsers not supporting HTML5 video. It may be Flash or it may just be links to download the video.
2. Implementing VTT tracks (at least a subset of them) to provide captions and subtitles
