---
title: "Web animations: Learning to love the API"
date: "2016-02-22"
categories: 
  - "technology"
---

> Thanks to Rachel Nabors who first clued me in to the API and to Dan Wilson who provided the final kick in the butt with his articles on WAAPI to finally get me studying and learning.

If you work with SVG you know that can [animate SVG with SMIL](https://www.w3.org/TR/SVG/animate.html) . [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions) and (keyframe) [Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) allow to animate some CSS properties. [requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) gives the browser a way to request an action be performed before the next frame executes.

But each of these animation techniques have their issues.

Browsers are phasing out SMIL. Chrome has had a long discussion on the [intent to deprecate SMIL](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), and whatever happens to Blink happens to Opera as well, IE11 and Edge never implemented it and I’ve never been able to figure out how good is the SMIL support in Firefox. There is a SMIL Polyfill called [Fake SMILE](https://leunen.me/fakesmile/) but is it reasonable for developers to expect it performing as well as native in production instances?

Transitions and animations live in prefix hell.

> Browser vendors sometimes add prefixes to experimental or nonstandard CSS properties, so developers can experiment but changes in browser behavior don't break the code during the standards process. Developers should wait to include the unprefixed property until browser behavior is standardized. From [https://developer.mozilla.org/en-US/docs/Glossary/Vendor\_Prefix](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix)

The issue with vendor prefixes is that they are seldom dropped for the sake of supporting as wider a user base as possible. In theory browser vendors should (and do) drop prefixes when a technology is full standardized but they only do so for current versions, older versions continue working with prefixed versions of the code

So, when it comes time to animations we have to do the following so we can acomodate all browsers that support animation:

```
@-moz-keyframes identifier {
  /* For Firefox */
  0% { top: 0; left: 0; }
  30% { top: 50px; }
  68%, 72% { left: 50px; }
  100% { top: 100px; left: 100%; }
}

@-webkit-keyframes identifier {
  /* Chrome, Opera and Safari */
  0% { top: 0; left: 0; }
  30% { top: 50px; }
  68%, 72% { left: 50px; }
  100% { top: 100px; left: 100%; }
}

@keyframes identifier {
  /* Standards compliant */
  0% { top: 0; left: 0; }
  30% { top: 50px; }
  68%, 72% { left: 50px; }
  100% { top: 100px; left: 100%; }
}
```

And if wereally wanted to cover our bases we should add another version of the code with the `-ms` prefix to cover Microsoft browsers and `-o` to cover Opera browsers before their switch to Blink.

This is where tools like Autoprefixer or a good build automation process comes in handy as we can write the code once and let the tool.

RequestAnimationFrame() is a great API but it’s competing with all the scripts running on the page and you only have 16.6 miliseconds to get everything done in time for the next frame to kick in. If for some reason the scripts don’t complete their tasks in the alloted time we get jitters in the animation or slow and unresponsive scripts blocking some activity on the page.

## Enter the Web Animation API

Web Animation API (WAAPI) is a new Javascript API that seeks to standardize the way we do animations on the web. I superceedes SMIL (and is one of the reasons why SMIL gives a deprecation warning in Chrome and Opera) and supplements CSS Transitions and animations.

Alex Danilo introduces the Web Animation API (WAAPI) for Google I/O Develop. This is a high level overview of the API, how it works and what it can be used for

<iframe width="560" height="315" src="https://www.youtube.com/embed/ep0_0W0qWsc?rel=0" frameborder="0" allowfullscreen></iframe>

The WAAPI presentation that intrigued me the most was Rachel Nabors’ presentation at SFHTML5 in 2015. Besides her obvious passion she does a good job of introducing the subject for a non-technical audience.

<iframe width="560" height="315" src="https://www.youtube.com/embed/GxOq1bnlZXk?rel=0" frameborder="0" allowfullscreen></iframe>

So now that we have a slightly better idea of what WAAPI provides, let’s look at how to make it work.

## How it works

> This section uses code from Dan Wilson’s [Web Animation API tutorial](http://danielcwilson.com/blog/2015/07/animations-part-1/) All Web Animation examples have 3 components. The first one is the `.animate()` declaration for the element we want to animate.

```
var player = document.getElementById('toAnimate').animate()
```

The animate function takes two parameters. The first one is an array of KeyframeEffects. This is where you put the animations that you want to happen and is similar to the `@keyframes` CSS declaration. We’ll see the difference when we look at a full example.

_The values for each property should match how you would specify them in JavaScript using element.style, so opacity will be a number, but transform will expect a string._

```
var player = document.getElementById('toAnimate').animate([
 { transform: 'scale(1)', opacity: 1, offset: 0 },
 { transform: 'scale(.5)', opacity: .5, offset: .3 }
 { transform: 'scale(.667)', opacity: .667 },
 { transform: 'scale(.6)', opacity: .6 }
'], {});
```

The second parameter is a list of _timing properties_. This will map to CSS animation properties, though sometimes with different names.

```
var player = document.getElementById('toAnimate').animate([ ],
{
    duration: 700, //milliseconds
    easing: 'ease-in-out', //'linear', a bezier curve, etc.
    delay: 10, //milliseconds
    iterations: Infinity, //or a number
    direction: 'alternate', //'normal', 'reverse', etc.
    fill: 'forwards' //'backwards', 'both', 'none', 'auto'
});
```

The full example looks like this:

```
var player = document.getElementById('toAnimate').animate([
    { transform: 'scale(1)', opacity: 1, offset: 0 },
    { transform: 'scale(.5)', opacity: .5, offset: .3 },
    { transform: 'scale(.667)', opacity: .667 },
    { transform: 'scale(.6)', opacity: .6 }
  ], {
    duration: 700, //milliseconds
    easing: 'ease-in-out', //'linear', a bezier curve, etc.
    delay: 10, //milliseconds
    iterations: Infinity, //or a number
    direction: 'alternate', //'normal', 'reverse', etc.
    fill: 'forwards' //'backwards', 'both', 'none', 'auto'
  });
```

For comparison, the same animation done with current keyframe animation techniques looks like this:

```
@keyframes emphasis {
  0% {
    transform: scale(1); 
    opacity: 1; 
  }
  39% {
    transform: scale(.5); 
    opacity: .5; 
  }
  78.75% {
    transform: scale(.667); 
    opacity: .667; 
  }
  100% {
    transform: scale(.6);
    opacity: .6; 
  }
}
#toAnimate {
  animation: emphasis 700ms ease-in-out 10ms infinite alternate forwards;
}
```

This is just the basics, we’ll explore more of what this syntax is and how we can enhance it further.

## Does it work for all browsers?

As with many of the new Javascript API browser support is not consistent. The best (native) support for web animations is in Chrome (and Opera); Firefox has limited support for the API (documented at [are we animated yet?](https://birtles.github.io/areweanimatedyet/), while Edge has it ‘[under development](https://dev.windows.com/en-us/microsoft-edge/platform/status/webanimationsjavascriptapi)’. Safari, as usual, is the only holdout with no support (current or planned.)

Supporting the API can mean a lot of things. There is no browser supporting the full specification but you can use the following page to test what aspects of the API your browser supports.

### Does your browser support WAAPI?

<p data-height="266" data-theme-id="2039" data-slug-hash="xGBKVq" data-default-tab="result" data-user="danwilson" class="codepen">See the Pen <a href="http://codepen.io/danwilson/pen/xGBKVq/">WAAPI Browser Support Test</a> by Dan Wilson (<a href="http://codepen.io/danwilson">@danwilson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

### The obligatory polyfill

For browsers that don’t support the specification (of that don’t all the features) there is a [polyfill](https://www.wikiwand.com/en/Polyfill) ￼available on [Github￼](https://github.com/web-animations/web-animations-js/blob/master/README.md). There are several versions of the polyfill; the one I’m most interested in `web-animation-next` version of the polyfill. It supports the proposed features for the specification and features for the specification currently under discussion.

All the features in our examples will work natively in Chrome or through the polyfill.
