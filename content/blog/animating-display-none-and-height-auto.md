---
title: Animating display none and height auto
date: 2024-08-12
youtube: true
tags:
  - CSS
  - Animations
---

New properties and functions will enable you to animate properties that, until now, were not animatable.

We'll look at the following properties:

* `transition-behavior`
* `calc-size()`
* `@starting-style`

used to:

* Change the height of an element from 0 to auto
* Change the value of display from none to block

## The code

These are the properties we'll use for these examples.

### `transition-behavior`

The `transition-behavior` property specifies whether transitions will be started for properties whose animation behavior is [discrete](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior#examples).

!!! note **Discrete definition**
Discrete properties' values are not additive, and interpolation swaps from the start value to the end value at 50%.

Specifically, denoting p as the progress value:

* If p < 0.5, then V_result = V_start
* If p ≥ 0.5, then V_result = V_end
!!!

### `calc-size()`

The `calc-size()` function allows math to be performed on intrinsic sizes, just like you can use `calc()` to perform math on extrinsic sizes.

### `@starting-style`

The `@starting-style` at-rule is used to define starting values for properties set on an element that you want to transition from when an element is first displayed on a previously loaded page.

The `@starting-style` at-rule can be used in two ways:

1. As a standalone block that contains one or more rulesets defining starting style declarations and selecting the elements they apply to
2. Nested within an existing ruleset, that contains one or more declarations defining starting property values for the elements already selected by that ruleset

## How it works

The HTML we'll work with is simple.

* A button element with the class `toggle`
* A div element with the class `container`

```html
<button class="toggle">Toogle Content</button>

<div class="container">
  <h2 class="container__headline">Some Title</h2>
  <p>Some content</p>
</div>
```

The container (`.container`) element holds the content of the dialogue.

the `allow-discrete` rule enables transitions for properties like display & visibility. Their values are applied after the transition has finished.

We also include the final values for the attributes we want to animate in case the browser doesn't support the `@starting-style` at-rule.

```css
.container {
  block-size: 0;
  padding-block: 0;
  display: none;
  transition: all 0.5s ease-in-out;
	transition-behavior: allow-discrete;
}
```

We have separate CSS rules that match the container selector (`.container`) with the `open` attribute.

The values for `block-size`, `display` and `padding-block` are the final values for the transition.

`calc-size` will let us use intrinsic values in the calculations.

The `@starting-style` rule tells the browser what properties to use as the initial state for the animation.

If we don't use it the transition may not happen or may work in unexpected ways.

```css
.container[open] {
  block-size: auto;
  block-size: calc-size(auto);
  display: block;
  padding-block: 2rem;

  @starting-style {
    block-size: 0;
    padding-block: 0;
  }
}
```

there is a little Javascript in the project. We've added a [pointerdown](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event) event to toggle the open attribute on the container element.

```js
const toggle = document.querySelector(".toggle");
const content = document.querySelector(".container");

toggle.addEventListener("pointerdown", (e) => {
  content.toggleAttribute("open");
});
```

## Browser support

We're mostly waiting for Firefox to fully support the feature in Desktop browsers and to implement it in Firefox for Android.

The support table for desktop browsers looks nice.

| Chrome | Edge | Safari | Firefox |
| --- | --- | --- | --- |
|128 - 130<br>Supported | 127<br> Supported | 17.6 - TP<br>Supported | 129 - 131<br>Partial support<br><br>Doesn't animate from `display: none` |

The mobile support is a little more spotty.

Unknown support for Opera Mini and UC browsers likely means it's not supported. As for other browsers, Firefox doesn't provide support in its Android version, I wonder if it's because a different team develops the Android version

| Chrome for Android | Safari on iOS* | Samsung Internet | Opera Mini* | Opera Mobile* | UC Browser for Android | Android Browser* | Firefox for Android |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 127<br>Supported | 17.5<br>Supported | 25<br>Supported | Unknown support | 80<br>Supported | 15.5<br>Unknown support | 127<br>Supported | 127<br>Not supported |

With this data in mind, we should look at these transitions as progressive enhancements at least until Firefox adds the feature in Android and finishes the feature for desktop.

## Further work

We've covered animating from `display: none` and to `height: auto`.

A future step is to research what other discrete properties can we transition as described in [Not Fully Animatable CSS properties](https://vallek.github.io/animatable-css/#not-full-anim).

There are other properties similar to `calc-size` that would work with different types of discrete properties. These are:

* [color-mix()](https://drafts.csswg.org/css-values-5/#color-mix) for color interpolation
* [cross-fade()](https://drafts.csswg.org/css-values-5/#cross-fade) for image interpolation
* [transform-mix()](https://drafts.csswg.org/css-values-5/#transform-mix) for interpolated transform values
* [mix()](https://drafts.csswg.org/css-values-5/#mix) for general-purpose interpolated value

It'll be interesting to see how these properties work once they are implemented.

## Video Tutorials

<lite-youtube videoid="1VsMKz4Zweg"></lite-youtube>

<lite-youtube videoid="4prVdA7_6u0"></lite-youtube>

## Links and resources

* [transition-behavior](https://drafts.csswg.org/css-transitions-2/#transition-behavior-property) as specified
* [transition-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior) &mdash; MDN
* [calc-size](https://drafts.csswg.org/css-values-5/#calc-size) as specified
* [@starting-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style) &mdash; MDN

