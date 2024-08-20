---
title: Using Page Visibility
date: 2024-08-26
tags:
  - Javascript
  - Visibility
---

The PageVisibility API lets your application know when a page is visible to the user. While this information may seem irrelevant it enables the creation of Web pages that behave differently when they are not being viewed. For example:

* You can throttle or pause data-intensive activities like data updates when the page is not visible
* You can pause video/audio content until the user displays the page again
* You can choose to have your application display notifications to the user only when the tab/window is hidden from view
* You can choose to pause animations and automatic actions like carrousel navigations until the tab is visible again
* In a text editor or content management system, you can trigger an auto-save when the user leaves the page or moves to a different tab
* You can collect more accurate analytics data about user engagement and session duration by tracking when the user leaves the page to move to another tab or window

At first, this API may not seem very useful beyond user convenience, but anything that helps save the device's battery power on mobile devices becomes very important. Using the PageVisibility API, your site can help the user's device consume less power and last longer.

```js
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // do something if the page visibility changes to hidden
  } else {
    // do something if the page visibility changes to visible
  }
});
```

there's no `document.visible`, so if you're only interested in that state, you can use `document.visibilityState === "visible"` or `!document.hidden`

```js
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // The page is visible again!
  }
});
```

## Example

This example works with a single YouTube iframe embed on the page and uses the Page Visibility the YouTube Player API for iframe Embeds APIs to pause the video playback when the tab/window is hidden and resume playback when the tab is visible again.

The first section of the scrript loads the YouTube Player API.

```js
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
```

Next we initialize the video with the IFrame API. The `onYouTubeIframeAPIReady` event will fire when the Iframe API is ready. Inside the event we construct a new YouTube player object associated with an existing iframe.

```js
var player;

function onYouTubeIframeAPIReady() {
  player = new YT.Player("youtube-player", {
    events: {
      onReady: onPlayerReady
    }
  });
}
```

The onPlayerReady function will execute when the onReady event fires. In this example, the function indicates that when the video player is ready, we should execute the `handleVisibilityChange` function.

```js
function onPlayerReady(event) {
  handleVisibilityChange();
}
```

The `handleVisibilityChange()` function uses the Page Visibility API to mute the video when the tab is hidded and to resume playback when the tab becomes visible again.

```js
function handleVisibilityChange() {
  if (document.hidden) {
    player.mute();
  } else {
    player.unMute();
  }
}
```

The final step is to add the `visibilitychange` event and associate the `handleVisibilityCange` function to it.

```js
document.addEventListener("visibilitychange", handleVisibilityChange);
```

I was going to add another example on how to use the Page Visibility API and the YouTube Iframe Embed API to mute and unmute mutliple videos when the tab is hidden but I got too many issues with CORS request being blocked so I dropped the idea. I may revisit it later and update the page if I do.

## References

* [Using the Page Visibility API](https://developer.mozilla.org/en-US/blog/using-the-page-visibility-api/) &mdash; MDN
* [Using the Page Visibility API](https://web.dev/articles/pagevisibility-intro) &mdash; web.dev
* [The Page Visibility API: Improve User Experience and Performance](https://dev.to/nialljoemaher/the-page-visibility-api-improve-user-experience-and-performance-451)
