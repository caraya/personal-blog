---
title: Responsive Videos ftw
date: 2024-06-05
tags:
  - HTML
  - Video
  - Responsiveness
---

Ever since we've had responsive images we've been able to add media queries to control the conditions that will trigger a match for a specific child element.

But we haven't been able to do the same thing with videos. We have to make a good guess and hope that the videos we send down the wire are small enough that they won't slow down user experiences on mobile or consume large chunks of a user's data plan.

The first example uses two `source` elements:

* The first one will match windows smaller than 599px
* The second one will match otherwise and when the browser doesn't support media queries in `source` elements

```html
<video>
    <source
			src="/sandbox/video-media/small.mp4"
			media="(max-width: 599px)">
    <source src="/sandbox/video-media/large.mp4">
</video>
```

The next example leverages media queries and file formats. The browser will match the first source elements that match the media query and where the video format is supported by the browser.

If the browser supports all the formats that you provide then you should decide which format you want played by default in each instance. These defaults may be different for different form factors.

You also need to evaluate how many formats to use for each video to create and then how many sizes to create. The example uses three sizes and three formats for a total of nine videos; whether that's too much would depend on the use case you are targeting.

***Test your videos on your target devices***. Mobile devices, especially lower-end phones, have asymmetric multi-core architectures and it's usually the lower-powered cores that do most of the work. This may introduce latency to the video decoding, even hardware-based.


```html
<video>
	<source
		media="(min-width: 2000px)"
		src="large.av1"
		type="video/av1">
	<source
		media="(min-width: 2000px)"
		src="large.webm"
		type="video/webm">
	<source
		media="(min-width: 2000px)"
		src="large.mp4"
		type="video/mp4">
	<source
		media="(min-width: 1000px)"
		src="medium.av1"
		type="video/av1">
	<source
		media="(min-width: 1000px)"
		src="medium.webm"
		type="video/webm">
	<source
		media="(min-width: 1000px)"
		src="medium.mp4"
		type="video/mp4">
	<source
		src="small.av1"
		type="video/av1">
	<source
		src="small.webm"
		type="video/webm">
	<source
		src="small.mp4"
		type="video/mp4">
</video>
```

**Differences between picture and video**

It is tempting to think that video and picture `source` elements work the same. This would be wrong.

Unlike `picture` elements, `video` will only choose its value when the page first loads and will not change when the conditions change so that a different child element would be selected.

In `video` you specify sources using a src attribute, unlike `picture` where you use the srcset attribute. `Video` currently doesn't support the srcset attribute.

Unlike images that have the `alt` attribute to provide alternative text for images, the `source` attribute for video and audio doesn't have an equivalent attribute.

Instead, you have to provide a separate [track](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track) element with text captions formatted in the [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API) format.

The combined source and track elements look like this:

```html
<video controls>
  <source
		src="/media/friday.mp4"
		type="video/mp4" />
	<track
		default
		kind="captions"
		srclang="en"
		src="/media/friday-captions.vtt" />
</video>
```

Tracks introduce an additional layer of complexity but are necessary for accessibility reasons and can create richer experiences when we use other types of tracks.
