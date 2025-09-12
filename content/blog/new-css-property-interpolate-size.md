---
title: New CSS Property - interpolate-size
date: 2025-11-05
tags:
  - CSS
  - Animations
---

The `interpolate-size` property has been added to CSS to enable smooth animations when transitioning an element's size to or from intrinsic sizing keywords like `auto`.

This post will cover what `interpolate-size` is, how it works, its limitations, and provide practical examples of how to use it in your web projects.

## What is interpolate-size?

`interpolate-size` is a CSS property designed to solve a long-standing challenge in web animation: smoothly transitioning an element's dimensions to an intrinsic, content-based size like `height: auto`. For years, developers have struggled with creating fluid opening and closing effects for components with dynamic content, such as accordion menus, collapsible sections, or "read more" widgets. Previously, achieving this required complex JavaScript calculations to measure the content's height and then animate to that specific pixel value. `interpolate-size` elegantly simplifies this entire process, allowing for purely CSS-driven animations that are both performant and easy to implement, gracefully handling content of any length.

## How It Works and Limitations

To enable this animation behavior, you must first explicitly opt-in by setting the `interpolate-size: allow-keywords;` property. This can be applied directly to the element you wish to animate, or more commonly, on a parent element or the `:root` pseudo-class to enable it globally across your document. This opt-in mechanism is crucial for backward compatibility; making it a default behavior could break existing websites that rely on the instantaneous, non-animatable nature of keywords like auto.

Once enabled, you can apply a standard CSS transition to block-level dimension properties such as height, width, inline-size, or block-size. When an element's state changes from a fixed size (`height: 0px`) to an intrinsic size (`height: auto`), the browser can now calculate and render a smooth animation between the two states.

`interpolate-size` has important limitations in its current implementation:

* `No Intrinsic-to-Intrinsic Animation`: The most significant limitation is that you cannot animate between two different intrinsic sizing keywords.
  * For example: you cannot smoothly transition from `height: min-content` to `height: max-content` because the browser has no fixed values to interpolate between.
  * The transition must involve at least an absolute length (`px`, `rem`) or percentage as either the starting or ending value.
* **Block Dimensions Only**: This property is specifically for animating an element's spatial dimensions. It does not apply to other properties that might use keywords, such as `font-size` or `padding`.

## Examples

Here are a few examples to illustrate how `interpolate-size` works.

### Basic Usage: Hover Effect

In this example, we'll create a div that expands to fit its content when you hover over it. This example only requires HTML and CSS.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hover Effect</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="box">
    <p>This is some content that will be revealed on hover.</p>
    <p>It can be any amount of content, and the box will expand to fit it.</p>
  </div>
</body>
</html>
```

Once we set up `interpolate-size: allow-keywords;` in the :root element, we can now use `interpolate-size` to animate the height of the `.box` element to or from an intrinsic size.

```css
:root {
  interpolate-size: allow-keywords;
}

body {
  display: grid;
  place-content: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
}

.box {
  width: 250px;
  height: 50px;
  background-color: lightblue;
  padding: 1rem;
  border-radius: 8px;
  overflow: hidden;
  transition: height 0.5s ease;
}

.box:hover {
  height: auto;
}
```

In this example, the `.box` element starts with a fixed height of 50px. When you hover over it, the height is set to auto, and `interpolate-size` allows the transition to animate smoothly to the full height of the content.

### Practical Example: Accordion

A more practical use case is an accordion menu. This is different than the built-in `<details>` element because it gives you more control over the styling and behavior at the expense of having to wire the elements with scripts.

```html
<div class="accordion">
  <button class="accordion-trigger">Toggle Accordion</button>
  <div class="accordion-content">
    <p>This is the content of the accordion.</p>
    <p>It can contain any amount of text, images, or other elements.</p>
    <p>The accordion will smoothly animate to fit the content in supported browsers.</p>
  </div>
</div>
```

All we need to do is set `interpolate-size: allow-keywords;` in the :root element to use the feature throughout the stylesheet.

```css
:root {
  interpolate-size: allow-keywords;
}

body {
  display: grid;
  place-content: center;
  min-height: 100vh;
  font-family: system-ui, sans-serif;
  background-color: #f0f2f5;
}

.accordion {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 350px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.accordion-trigger {
  position: relative;
  width: 100%;
  padding: 1rem;
  padding-left: 2.2rem;
  cursor: pointer;
  background-color: #f9f9f9;
  font-weight: bold;
  border: none;
  text-align: left;
  font-size: 1rem;
  font-family: inherit;
}

.accordion-trigger::before {
  content: "▶";
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%) rotate(0deg);
  transform-origin: center;
  transition: transform 0.3s ease;
}

.accordion.is-open .accordion-trigger::before {
  transform: translateY(-50%) rotate(90deg);
}

.accordion-content {
  padding: 0 1rem;
  overflow: hidden;
  background-color: #ffffff;
  transition: height 2s ease, padding 2s ease, background-color 2s ease;
}

/* State when closed */
.accordion:not(.is-open) .accordion-content {
  height: 0;
}

/* State when open */
.accordion.is-open .accordion-content {
  height: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: #f0f8ff;
}
```

### Interactive Example: Click-to-Expand Card

This example uses Javascript to toggle a class on a card component, giving you more custom control than a standard &lt;details> element.

```html
<div class="card">
	<div class="card-header">
		<h3>Card Title</h3>
		<button class="toggle-btn">Read More</button>
	</div>
	<div class="card-body">
		<p>This is the hidden content of the card. It contains extra details that are only shown when the user decides to expand it.</p>
		<p>Because we're using `interpolate-size`, the card will grow smoothly to accommodate this text.</p>
	</div>
</div>
```

The styles are more complex because we need to handle both the open and closed states of the card.

The `:root` selector enables `interpolate-size` for the entire document.

We need the additional styles because we change the class of the card when we toggle its visibility.

```css
:root {
  interpolate-size: allow-keywords;
}

.card {
  width: 350px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  margin: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

.card-body {
  padding: 0 1rem;
  height: 0;
  overflow: hidden;
  transition: height 0.5s ease, padding 0.5s ease;
}

.card.is-open .card-body {
  height: auto;
  padding: 1rem;
}
```

Clicking the button toggles the `.is-open` class on the `.card` element. The CSS uses this class to change the `.card-body` from `height: 0` to `height: auto`, triggering the smooth animation in supporting browsers.

```js
const card = document.querySelector('.card');
const toggleBtn = document.querySelector('.toggle-btn');

if (card && toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    card.classList.toggle('is-open');
  });
}
```

## Fallbacks

The `interpolate-size` property is a perfect example of progressive enhancement.

For browsers that do not support `interpolate-size`, the animation won't run and the element's size will change instantaneously. The content will still be shown or hidden correctly, and the layout will adjust as expected, just not smoothly.

## Browser Support

Browser support for `interpolate-size` is still evolving. It is part of the [CSS Transitions Level 2](https://www.w3.org/TR/css-transitions-2/) specification, which browser makers are slowly implementing.

Currently, the transition effect of `interpolate-size` is supported in Chromium-based browsers (starting from version 104), which includes Google Chrome, Microsoft Edge, Opera, and Brave.

It is not currently supported in Firefox or Safari.

For the most up-to-date compatibility information, it is always best to consult resources like [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size) or [CanIUse.com](https://caniuse.com/mdn-css_properties_interpolate-size).
