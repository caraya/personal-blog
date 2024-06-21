---
title: Scroll-Based Animations
date: 2024-07-01
tags:
  - CSS
  - Animations
---

With scroll-based animations, you can create animations that will trigger based on page scrolling rather than based on time.

The Scroll-driven Animations Specification defines two new types of timelines that you can use:

* **Scroll Progress Timeline**: a timeline linked to the scroll position of a scroll container along a particular axis.
* **View Progress Timeline**: a timeline linked to the relative position of an element within its scroll container.

## How they work

The easiest way to create a scroll animation is to use the `scroll()` function to create an anonymous Scroll Timeline.

```css
@keyframes animate-it {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.subject {
  animation: animate-it linear;
  animation-timeline: scroll(root block);
}
```

The scroll() function accepts two arguments: a `scroller` and an `axis`.

Valid values for the `scroller` argument are:

nearest (default)
: Uses the nearest ancestor scroll container (default).

root
: Uses the document viewport as the scroll container.

self
: Uses the element itself as the scroll container.

Valid values for the `axis` argument are:

block (default)
: Uses the measure of progress along the block axis of the scroll container

inline
: Uses the measure of progress along the inline axis of the scroll container.

y
: Uses the measure of progress along the y axis of the scroll container.

x
: Uses the measure of progress along the x axis of the scroll container.

## Creating a named Scroll Progress Timeline

An alternative way to define a Scroll Progress Timeline is to use a named one.

To create a named Scroll Progress Timeline on an element follow these steps:

1. Set the `scroll-timeline-name` CSS property on the scroll container to an identifier of your liking. **The value must start with `--`**
2. To customize the axis to track declare the `scroll-timeline-axis` property
   1. Allowed values are the same as the `axis` argument of `scroll()`
3: To link the animation to the Scroll Progress Timeline, set the `animation-timeline` property on the element that you want to animate. This is the same value as the `scroll-timeline-name` identifier.

We first create the [@keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) animation sequence.

```css
@keyframes animate-it {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
```

We then set up the name of the scroller in its parent element (`.scroller`) and then set up the scroller and animation in the element we want to animate (`.scroller .subject`).

```css
.scroller {
  scroll-timeline-name: --my-scroller;
  scroll-timeline-axis: inline;
}

.scroller .subject {
  animation: animate-it linear;
  animation-timeline: --my-scroller;
}
```

Using named scroll timelines enables us to use multiple animations on the same page since you can identify a Scroll Progress Timeline by the name that you assigned to it.

## The Javascript option

You can also create Scroll Timelines in Javascript.

To create a Scroll Timeline in JavaScript, create a new instance of the `ScrollTimeline` class. Pass in a property bag with the `source` and `axis` that you want to track.

source
: A reference to the element whose scroller you want to track. Use `document.documentElement` to target the root scroller.

axis
: Determines which axis to track. Similar to the CSS variant, accepted values are `block`, `inline`, `x`, and `y`.

To attach it to a Web Animation, pass it in as the `timeline` property to the `animate` object and omit any duration if there was any.

```js
const tl = new ScrollTimeline({
  source: document.documentElement,
  axis: block;
});

$el.animate({
  opacity: [0, 1],
}, {
  timeline: tl,
});
```

In Javascript, we can also target multiple scroll timelines.

## Examples

The most basic example is the progress bar at the top of the screen as the document scrolls down.

Using the HTML below, we'll look at CSS and Javascript solutions.

```html
<div id="progress">
  …
</div>
```

Both the CSS and Javascript versions will produce identical results.

### CSS Scroll Progress Bar

As discussed earlier, creating scroll timelines is a two-step process.

1. We define the animation (or animations) that we want to use
2. We assign the animation to our target element and we specify the animation timeline we want to use

```css
/* 1 */
@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

#progress {
  position: fixed;
  left: 0; top: 0;
  width: 100%; height: 1em;
  background: red;

  transform-origin: 0 50%;
  /* 2 */
  animation: grow-progress auto linear;
  animation-timeline: scroll();
}
```

The code produces these results:

<iframe height="452.67559814453125" style="width: 100%;" scrolling="no" title="Reading Progress Animatoin" src="https://codepen.io/caraya/embed/MWdQXrv?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/MWdQXrv">
  Reading Progress Animatoin</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Javascript Scroll Progress

The Javascript version of the Scroll Progress indicator uses the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) for the animation.

The process is similar:

1. Capture the target element
2. Create the animation
3. Attach the Scroll Timeline to the animation using the root (`document.documentElement`) scroller

```js
// 1
const $progressbar = document.querySelector('#progress');

$progressbar.style.transformOrigin = '0% 50%';

// 2
$progressbar.animate(
  {
    transform: ['scaleX(0)', 'scaleX(1)'],
  },
  {
    fill: 'forwards',
    // 3
    timeline: new ScrollTimeline({
      source: document.documentElement,
    }),
  }
);
```

The code produces the following result:

<iframe height="489.064208984375" style="width: 100%;" scrolling="no" title="Reading Progress Animation with JS animation" src="https://codepen.io/caraya/embed/BaeYVYo?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/BaeYVYo">
  Reading Progress Animation with JS animation</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Exploring scroll-based animations includes further exploring what you can and can't do with animations on the web, both CSS and WAAPI.

## Links and Resources

* [Scroll-driven Animations](https://scroll-driven-animations.style/)
* [Animate elements on scroll with Scroll-driven animations](https://developer.chrome.com/docs/css-ui/scroll-driven-animations)
* [A Practical Introduction to Scroll-Driven Animations with CSS scroll() and view()](https://tympanus.net/codrops/2024/01/17/a-practical-introduction-to-scroll-driven-animations-with-css-scroll-and-view/)
* [Introducing “Unleash the Power of Scroll-Driven Animations”](https://www.bram.us/2024/05/06/introducing-unleash-the-power-of-scroll-driven-animations/)
