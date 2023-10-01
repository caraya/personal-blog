---
title: "Video, how has it changed and what you can do with it now"
date: "2013-11-29"
categories: 
  - "technology"
---

Since I last looked at video (it's been a few years), there are new and amazing things that have happened in the field and I'm just amazed at the kind of stuff that you can do.

This essay is the beginning of my exploration into the updated world of web video. In a separate essay I will explore web video's cousin, WebRTC and describe there what the differences are.

## Video is a first class web citizen

The humble video tag has come a long way since I last looked at it. It still requires a lot of extra work to make it work everywhere. Look at the video below: It should work just as good whether your browser support any of the HTML5 video formats or if you must fall back to the Flash plugin.

  

**Download video:** [MP4 format](http://media.w3.org/2010/05/sintel/trailer.mp4) | [Ogg format](http://media.w3.org/2010/05/sintel/trailer.ogv) | [WebM format](http://media.w3.org/2010/05/sintel/trailer.webm)

Note in the example below how we code defensively and provide 3 different versions of the video to work around the lack of a common format supported by all browsers with fallback only necessary for browsers that do not support the `<video>` element.

There are people who still claim that a single format (h264) us all we need to work across all browsers. They say that we need to only provide the MP4 video and let all other browsers fall through to the Flash fallback.

This is almost as ridiculous as vendors decisions not to support one format or another because of perceptions of freedom (I have ranted before [Mozilla's position on H264](http://robert.ocallahan.org/2010/01/video-freedom-and-mozilla_23.html)) but the opposite decision to use only H264 is just as ridiculous. We loose the performance we gain with native video formats and we loose the ability to do some of the things we'll discuss below.

<div data-height="257" data-theme-id="2039" data-slug-hash="oshzb" data-user="caraya" data-default-tab="html" class="codepen"><pre><code>&lt;!-- "Video For Everybody" http://camendesign.com/code/video_for_everybody --&gt;
&lt;video controls="controls" poster="http://media.w3.org/2010/05/sintel/poster.png" width="640" height="480"&gt;
    &lt;source src="http://media.w3.org/2010/05/sintel/trailer.mp4" type="video/mp4" /&gt;
    &lt;source src="http://media.w3.org/2010/05/sintel/trailer.webm" type="video/webm" /&gt;
    &lt;source
        src="http://media.w3.org/2010/05/sintel/trailer.ogv" type="video/ogg" /&gt;
    &lt;object type="application/x-shockwave-flash" data="http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf" width="640" height="480"&gt;
        &lt;param name="movie" value="http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf" /&gt;
        &lt;param name="allowFullScreen" value="true" /&gt;
        &lt;param name="wmode" value="transparent" /&gt;
        &lt;param name="flashVars" value="config={'playlist':['http%3A%2F%2Fmedia.w3.org%2F2010%2F05%2Fsintel%2Fposter.png',{'url':'http%3A%2F%2Fmedia.w3.org%2F2010%2F05%2Fsintel%2Ftrailer.mp4','autoPlay':false}]}" /&gt;
        &lt;img alt="Sintel" src="http://media.w3.org/2010/05/sintel/poster.png" width="640" height="480" title="No video playback capabilities, please download the video below" /&gt;
    &lt;/object&gt;
&lt;p&gt;
    &lt;strong&gt;Download video:&lt;/strong&gt; &lt;a href="http://media.w3.org/2010/05/sintel/trailer.mp4"&gt;MP4 format&lt;/a&gt; | &lt;a href="http://media.w3.org/2010/05/sintel/trailer.ogv"&gt;Ogg format&lt;/a&gt; | &lt;a href="http://media.w3.org/2010/05/sintel/trailer.webm"&gt;WebM format&lt;/a&gt;
&lt;/p&gt;
&lt;/video&gt;</code></pre><p>See the Pen <a href="http://codepen.io/caraya/pen/oshzb">HTML5 Video</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p></div>

<script async src="//codepen.io/assets/embed/ei.js"></script>

Also note that the video will remain the same, in the sections below we will not re-add the video but it will be added to the corresponding codepen example.

## Video Capationing

Moved to a separate article: [HTML5 video captioning using VTT](https://publishing-project.rivendellweb.net/video-how-has-it-changed-and-what-you-can-do-with-it-now/)

## CSS Video Manipulation

One of the first things we will do to our (captioned) video is to play with it using CSS. Because we no longer have to worry whether the effects are going to work or not, and we don't have to use JavaScript CSS gives you a lot more flexibility in terms of what you can do with your video.

For this example we will use jQuery and CSS Translations to move the video to the right, rotate the video 180 degrees and skew the image 45 degrees by pressing buttons located below the video.

<p data-height="257" data-theme-id="2039" data-slug-hash="jKEFg" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/jKEFg">HTML5 Video: CSS Manipulation</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

<script async src="//codepen.io/assets/embed/ei.js"></script>

## Creating a video player programmatically

Having the controls for the video built in to the video tag itself is only optional. While it works for most video types there are times when it's better to create your own video controllers, either because you're bundling he video with a skinned website or you just may want a different user experience

With all the tools we've used so far it is perfectly possible to create video interaction buttons to affect the video outside the video itself.

## Playing Video in the Canvas

Canvas is another new web technology that allows for painting text, images and other elements into a canvas element. An intriguing option would be to take periodic frames from a video and paint them into the canvas.

I took the code for the pen below from [HTML5 Doctor](http://html5doctor.com/video-canvas-magic/) I'm working on translating it to jQuery so I can understand better how it works and whether jQuery can do Canvas manipulation (I'm pretty sure it can but it is most likely operator error)

<p data-height="471" data-theme-id="2039" data-slug-hash="JbsGe" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/JbsGe">HTML5 Video: Canvas Mirror</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

<script async src="//codepen.io/assets/embed/ei.js"></script>

In order to further differentiate the videos I applied a CSS filter to the canvas element to turn the canvas video into black and white. CSS Filters are only supported in Chrome Canary at the time, hopefully that will change soon :-)
