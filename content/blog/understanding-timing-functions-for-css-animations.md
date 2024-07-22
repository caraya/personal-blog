---
title: Understanding timing functions for CSS animations
date: 2024-07-17
tags:
  - CSS
  - Animations
---

CSS has had the ability to use keyframe animations for a long time. This post will concentrate in the animation timing functions available and how they affect the animations they are attached to.

## Review: The CSS Animation Property

The animation CSS property applies an animation between styles. It is a shorthand for the following properties:

[animation-delay](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay)
: Specifies the amount of time to wait from applying the animation to an element before beginning to perform the animation.
: The animation can start later, immediately from its beginning, or immediately and partway through the animation.

[animation-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction)
: Sets the direction the animation should play.
: Possible values are `forward`, `backward`, or `alternate` between forward and backward.

[animation-duration](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-duration)
: Sets the length of time that an animation takes to complete one cycle.

[animation-fill-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode)
: Sets how a CSS animation applies styles to its target before and after its execution. Possible values are: `none`, `forward`, `backwards`, and `both`.
: **none**: The animation will not apply any styles to the target when it's not executing. The element will instead be displayed using any other CSS rules applied to it. This is the default value.
: **forwards**: The target will retain the computed values set by the last keyframe encountered during execution. The last keyframe depends on the value of `animation-direction` and `animation-iteration-count`.
: **backwards**: The animation will apply the values defined in the first relevant keyframe as soon as it is applied to the target, and retain this during the animation-delay period. The first relevant keyframe depends on the value of **animation-direction**
: **both**: The animation will follow the rules for both forwards and backwards, thus extending the animation properties in both directions.

[animation-iteration-count](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-iteration-count)
: Sets the number of times an animation should be played before stopping.

[animation-name](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name)
: Specifies the names of one or more `@keyframes` at-rules that describe the animation to apply to an element.
: You can specify multiple @keyframe at-rules to apply to the target element as a comma-separated list of names.
: If the specified name does not match any @keyframe at-rule, no properties are animated.

[animation-play-state](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-play-state)
: Controls whether an animation is running or paused.

[animation-timeline](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline)
: **Limited Availability (Chromium Browsers Only)**
: Specifies the timeline that is used to control the progress of an animation.

[animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function)
: Sets how an animation progresses through the duration of each cycle.
: We'll look at more details about timing functions later in the post.

## Timing Functions

There are three types of timing functions:

* Linear functions (`linear`)
* Cubic Bézier functions (`ease`, `ease-in`, `ease-out` and `ease-in-out`),
* Staircase functions (`steps`).

For each of these types of functions we'll also show and example of an `animation` declaration using the timing functions.

## Linear Easing Functions

The `linear()` function creates a piecewise linear easing, allowing the approximation of complex animations and transitions by interpolating linearly between the specified points. The interpolation occurs at a constant rate from beginning to end. A typical use of the `linear()` function is to provide many points to approximate any curve.

```css
.box01 {
  animation: 5s linear slideright forwards;
}
```

## Cubic Bézier easing function

`cubic-bezier()`  defines a cubic [Bézier curve](https://developer.mozilla.org/en-US/docs/Glossary/Bezier_curve). The easing functions in the cubic-bezier subset of easing functions are often called "smooth" easing functions because they can be used to smooth down the start and end of the interpolation.

Some commonly used pre-defined easing functions like `ease`, `ease-in`, `ease-out`, and `ease-in-out` are Cubic Bézier functions. They can be used as a quick way to set a non-linear easing function. Even a linear function can be defined using a cubic-bezier function.

The table below, taken from [Understanding Easing Functions For CSS Animations And Transitions](https://www.smashingmagazine.com/2021/04/easing-functions-css-animations-transitions/), shows the cubic bézier values for predefined easing functions:

| Easing Function	| cubic-bezier Value | Starting Speed | Middle Speed |	Ending Speed |
| :---: | --- | --- | --- | --- |
| linear | `cubic-bezier(0.0, 0.0, 1.0, 1.0)` | constant | constant | constant |
| ease | `cubic-bezier(0.25, 0.1, 0.25, 1.0)` | fast acceleration | fast acceleration | slow acceleration |
| ease-in | `cubic-bezier(0.42, 0, 1.0, 1.0)` | slow acceleration | fast acceleration | full speed |
| ease-out | `cubic-bezier(0, 0, 0.58, 1.0)` | full speed | slow acceleration | slow acceleration |
| ease-in-out | `cubic-bezier(0.42, 0, 0.58, 1.0)` | slow acceleration | full speed | fast acceleration |

The examples below use the predefined options:

```css

.box02 {
  animation: 5s ease slideright forwards;
}

.box03 {
  animation: 5s ease-in slideright forwards;
}

.box04 {
  animation: 5s ease-out slideright forwards;
}

.box05 {
  animation: 5s ease-in-out slideright forwards;
}
```

## Steps easing function

Displays an animation for n equal-length stops. Each stop has the same duration.

The example and the definitions below are adapted from MDN's [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function)

If n is 5, there are 5 steps. Where the animation holds temporarily, either at 0%, 20%, 40%, 60% and 80%, on the 20%, 40%, 60%, 80% and 100%, or makes 5 stops between the 0% and 100% along the animation, or makes 5 stops including the 0% and 100% marks (on the 0%, 25%, 50%, 75%, and 100%) depends on which  jump term is used. The available options are:

jump-start
: Represents a left-continuous function, the first jump happens when the animation begins.

jump-end (default)
: Represents a right-continuous function, the last jump happens when the animation ends.

jump-none
: Effectively removes a step during the interpolation iteration. Instead, it holds at both the 0% mark and the 100% mark, each for 1/n of the duration.

jump-both
: Includes pauses at both the 0% and 100% marks, effectively adding a step during the animation iteration.

start
: Same as jump-start.

end
: Same as jump-end.

step-start
: Equal to steps(1, jump-start)

step-end
: Equal to steps(1, jump-end)

```css
.box06 {
  animation: 5s steps(50, start) slideright forwards;
}

.box07 {
  animation: 5s steps(50, end) slideright forwards;
}

.box08 {
  animation: 5s steps(50) slideright forwards;
}
```

## Full demo

You can see how these different timing functions work in this Codepen.

<iframe height="1000.00" style="width: 100%;" scrolling="no" title="animation timing functions" src="https://codepen.io/caraya/embed/mdZebYy?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/mdZebYy">
  animation timing functions</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Further readings

* About animation
  * [Disney’s motion principles in designing interface animations](https://medium.com/@ruthiran_b/disneys-motion-principles-in-designing-interface-animations-9ac7707a2b43)
  * [Good to great UI animation tipsGood to great UI animation tips](https://uxdesign.cc/good-to-great-ui-animation-tips-7850805c12e5)
* General Information
  * [Understanding Easing Functions For CSS Animations And Transitions](https://www.smashingmagazine.com/2021/04/easing-functions-css-animations-transitions/)
* Linear Easings
  * [The Path To Awesome CSS Easing With The linear() Function](https://www.smashingmagazine.com/2023/09/path-css-easing-linear-function/)
* Cubic Bezier
  * [Bézier curve](https://developer.mozilla.org/en-US/docs/Glossary/Bezier_curve)
  * [Cubic Bezier Generator](https://cubic-bezier.com/)
