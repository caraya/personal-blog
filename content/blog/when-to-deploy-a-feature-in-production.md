---
title: When to deploy a feature in production
date: 2024-08-21
tags:
  - Design
  - Development
  - Browser Support
  - Reference
---

What browsers should we support?

This is an interesting question: What browsers should we support? This is a deceptively simple question to ask and even harder to answer.

This post will try to address this question along with different ways to address browser support issues.

## Why browser versions don't work

We used to say that supporting the last two versions of major browsers was enough to cover our bases.

But that is not enough.

Unlike the times of monolithic, month-long development cycles, browsers are updated monthly and may or may not contain all the latest CSS and Javascript features.

The CSS working group requires that for a specification to advance into the later stages of the W3C process there must be two interoperable implementations of the specification features. The [CSS Working Group Charter](https://www.w3.org/2020/12/css-wg-charter.html) indicates that:

> In order to advance to [Proposed Recommendation](https://www.w3.org/Consortium/Process/#RecsPR), each module is expected to have [at least two independent implementations](https://www.w3.org/Consortium/Process/#implementation-experience) of each of the features it defines, and to provide evidence for this claim based on tests. The Working Group is therefore expected to proactively work on writing, reviewing, and maintaining tests.

Browsers will not wait for full specifications to be completed and will implement individual features as they are completed and published for review, and to enable them to give feedback to the CSS Working Group.

The same thing happens with Javascript. TC-39 requires interoperable implementations as a requirement before it's included in a yearly release of the specification.

The [TC-39 process](https://tc39.es/process-document/) indicates that as part of the entrance criteria for stage 4 (these are things the feature must have before being approved to enter stage 4) a feature must have:

> * Two compatible implementations which pass the test262 acceptance tests
> * Significant in-the-field experience with shipping implementations, such as that provided by two independent VMs

In Javascript, features are developed independently from each other so whenever one is ready all implementors can release the feature for testing and to gather feedback for specification authors.

Both the CSS and Javascript release processes are independent of the browser versions we're working with.

Besides, with the quick release cadence for browsers, the latest two versions change monthly. It doesn't help developers and it makes things harder for everyone.

## Baseline

The [Baseline](https://web.dev/baseline) initiative is a joint effort by Google, Microsoft, Apple, and Mozilla to categorize browser support for web standards.

The initiative makes it clear what web standards features are ready to use in websites. It designates new features into two categories:

Newly available
: The feature is supported by the latest versions of all core browsers

Widely available
: The feature has been supported across browsers for at least 30 months (2.5 years)

We can use Baseline along with progressive enhancement to decide if a feature should go on a production site or not.

## Progressive enhancement

Progressive enhancement is a design philosophy that provides a baseline of essential content and functionality to as many users as possible while delivering the best possible experience only to users of the most modern browsers that can run all the required code. We'll look at how to do feature detection in CSS and Javascript.

## Feature Detection

[Feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection) helps determine if browsers can handle specific functionality in CSS and Javascript. We'll cover feature detection in more detail later in the post.

A related concept is [polyfill](https://developer.mozilla.org/en-US/docs/Glossary/Polyfill). We use them to add missing features with JavaScript.

### Javascript

There are two ways to detect if a feature is available in Javascript.

The first, and easiest, way to detect a feature is to test if a feature exists in a parent object.

This example checks if the geolocation object exists in the navigator object. If it does, we run the `getCurrentPosition` method of the `navigator.geolocation` object.

```js
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function (position) {
    // show the location on a map, such as the Google Maps API
  });
} else {
  // Give the user a choice of static maps
}
```

Another example is to only load service workers if the browser supports them by testing if the `serviceWorker` exists in the `navigator` object.

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
```

The second way to detect if a browser supports a feature is to create an element in memory using [Document.createElement()](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) and then check if a property exists on it.

The next example checks if the browser supports the canvas element.

The double NOT in this example (!!) is a way to force a return value to become a "proper" boolean value, rather than a Truthy/Falsy value that may skew the results.

```js
function supports_canvas() {
  return !!document.createElement("canvas").getContext;
}

if (supports_canvas()) {
  // Create and draw on canvas elements
}
```

Specific return values of a method on an element
: Create an element in memory using Document.createElement() and then check if a method exists on it. If it does, check what value it returns.
: This example tests two things: The `supports_video` function tests if the browser supports the `video` element.
: `supports_h264_baseline_video` checks if the browser supports the h264 baseline codec.
: It first checks if the browser supports the `video` element by calling the `supports_video` function; if it doesn't then it returns... checking for codec support is pointless if we will not be able to play the video.
: If the browser can use the `video` element then we create another video element and check if we can play the specific video that we target.
: Also note that we specify a `codecs` attribute inside the `canPlayType` declaration. MP4/h264 has multiple audio and video combinations available. Browser support varies for the different available combinations so we must be specific on what we test.

```js
function supports_video() {
  return !!document.createElement('video').canPlayType;
}

function supports_h264_baseline_video() {
  if (!supports_video()) { return false; }
  var v = document.createElement("video");
  return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
}
```

Retention of assigned property value by an element
: Create an element in memory using `Document.createElement()`, set a property to a specific value, then check to see if the value is retained.
: In this example, we create an input element and then test if the type we specify as the parameter for the function can be set as a type attribute for input. We then

```js
function supportsInputType(type){
  var i = document.createElement('input');
  i.setAttribute('type', type);
  return i.type === type;
}
```

Bear in mind that some features are known to be undetectable. In these cases, you'll need to use a different approach, such as using a polyfill.

### CSS feature queries

The main feature detection system in CSS is the [@supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) at-rule.

The @supports at-rule specified CSS declarations that depend on support for CSS features in what's commonly called a feature query.

The at-rule must be placed at the top level of your code or nested inside any other conditional group at-rule.

You can add multiple rules inside the `@supports` at-rule. These would normally be related to the support we tested for or to changes you want to make that are related to the feature you're testing.

This example sets up a basic flex-like container using float and then tests if the browser supports `display: flex`. If it does then we set `display:flex` on the `.flex-container` element and then change the color of the text.


```css
.flex-container > * {
  padding: 0.3em;
  list-style-type: none;
  text-shadow: 0 0 2px red;
  float: left;
}

@supports (display: flex) {
  .flex-container {
    display: flex;
  }

  .flex-container > * {
    text-shadow: 0 0 2px blue;
    float: none;
  }

}
```

## So what's the answer

When should we use a feature in production?

When we're comfortable with it not working exactly the same in all browsers.

The first thing to consider is the property availability: How widely available is the feature?

If the feature is in Baseline Widely available, then we should have no problem with using it in production apps. 30 months is long enough to have made it to all browsers and to have gone through corporate evaluations and deemed ready to be deployed inside the corporate firewall.

If the feature is in Baseline Newly Available, you should be asking **if the feature be used as a progressive enhancement**. If you decide it can, that the lack of the feature will not majorly affect your application in your target browsers, then use it as progressive enhancement and assume some of your users will miss out on the benefits of those features.

If the feature is not in Baseline at all, either because it's an experiment in one or a few browsers or because other browsers have chosen not to implement it at all **don't use the feature in production code**. The feature is not complete and may change drastically from its current implementation.





<https://adactio.com/journal/21128>

<https://clagnut.com/blog/2431>
