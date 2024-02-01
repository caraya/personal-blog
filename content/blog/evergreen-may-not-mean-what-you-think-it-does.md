---
title: "Evergreen may not mean what you think it does"
date: 2024-01-31
tags:
  - CSS
  - Typography
---

Evergreen browsers are those that update themselves automatically, or very close to it, without user intervention.

This is particularly useful when it comes to new features. We don't have to wait for users up upgrade their browsers, the browsers will update themselves, at least in theory.

In [“Evergreen” Does Not Mean Immediately Available](https://css-tricks.com/evergreen-does-not-mean-immediately-available/), the author explains how evergreen auto updates may not work how you expect and users of modern computers may choose not to shut down their browsers and, as a result, not trigger automatic browser updates unless the user clicks on the download button and then clicks the update button to trigger the update.

This is true for Chrome, Edge and Firefox. They release new versions of the browser every four to six weeks (see the [Firefox Release Calendar](https://whattrainisitnow.com/calendar/), [Chrome release schedule](https://chromiumdash.appspot.com/schedule) and [Microsoft Edge release schedule](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-release-schedule#release-schedule)) and those should get pushed to users shortly thereafter.

There is also another potential blocker for evergreen browser updates: corporate IT teams.

There may be a variety of reasons why corporate IT teams would prevent automatic browser updates.

IT teams may block automatic "evergreen" updates until they've had time to test the newer versions to ensure compatibility with corporate applications. They don't want applications breaking because of new features or because browsers removed a needed feature.

Risk mitigation may also be why IT teams may choose to use a [Long Term Support (LTS)](https://en.wikipedia.org/wiki/Long-term_support) version of a browser.

Three of the four major browsers have enterprise or LTS versions:

* [Firefox ESR](https://www.mozilla.org/en-US/firefox/enterprise/)
* [Chrome Enterprise](https://chromeenterprise.google/browser/)
* [Edge for Business](https://www.microsoft.com/en-us/edge/business/download?form=MA13FJ)

Safari has also increased the cadence of release for their Technical Preview and Production browsers but there's no set schedule for release and the TP releases are tied to the Operating System and it still requires user interaction to download and install.

So what does that mean for developers?

It means we should still code defensively and treat these new features as progressive enhancements for a while after their introduction.
In Javascript, we can do [feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection) for both Javascript and CSS features.

The first example would run the code if the browser **does not** support geolocation:

```js
if (!"geolocation" in navigator) {
	// Give the user static maps
	// or use an alternative to built-in geolocation
} else {
  navigator.geolocation.getCurrentPosition(function (position) {
    // show the location on a map, such as the Google Maps API
  });
}
```

We can also detect CSS features using the [supports](https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports_static) static method of the CSS object. This is equivalent to the CSS `@supports` at-rule.

```css
if (CSS.supports("grid-template-columns", "subgrid")) {
  conditional.setAttribute("href", "subgrid-layout.css");
}
```

In CSS we can let the cascade decide what gets shown to the user. For rules with the same value, the last one listed in the document "wins".

In browsers that support all three color spaces, the last one in document order will be used, in this case, Oklch.

```css
.demo {
	color: white;
	color: rgb(255, 255, 255);
	color: oklch(1 0 326);
}
```

For more complex features, we can use the `@support` at-rule.

The following code will use floats by default and will only add Flexbox if the browser supports it.

```css
.flex-container > * {
  padding: 0.3em;
  list-style-type: none;
  text-shadow: 0 0 2px red;
  float: left;
}

@supports (display: flex) {
  .flex-container > * {
    text-shadow: 0 0 2px blue;
    float: none;
  }

  .flex-container {
    display: flex;
  }
}
```
