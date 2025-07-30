---
title: CSS Is Learning From SASS
date: 2025-09-08
tags:
  - CSS
  - SASS
  - Web Development
baseline: true
---

In 2023, Chris Coyier wrote [SASS features in CSS](https://chriscoyier.net/2023/07/11/sass-features-in-css/) where he explores the SASS features that have been adopted in CSS.

It's been a couple years so, in this post, I will explore how have the features in Chris's article evolved and what additional features, originally in SASS, have been added to CSS. We'll also look at some of the SASS features that are still not in CSS.

## Some background

SASS is a CSS preprocessor that extends the capabilities of CSS with features like variables, nesting, mixins, and more. It has been widely adopted in the web development community for its powerful features that make writing and maintaining CSS easier.

I used to love SASS and used it extensively in my projects but, over time, I found that many of its features were being adopted by CSS itself or had alternatives in CSS that made SASS less necessary.

## SASS Features in CSS

| Feature | CSS Version | Date Introduced |
| --- | --- | --- |
| Basic Math | [calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) | 2012 |
| Variables | [Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)<br><br>Defined with `--*` | 2016 |

Then it’s taken until this year for any more of Sass features to get gobbled up:

| Feature | CSS Version | Date Introduced |
| --- | --- | --- |
| Nesting | [Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) | 2023 |
| Trigonometric functions | [Trigonometric functions](https://web.dev/articles/css-trig-functions) | 2023 |
| Color Manipulation | [color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) | 2023 |
| Color Manipulation | [Relative Color Syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors)<br> | 2024 |
| Includes | [Constructable Stylesheets](https://web.dev/articles/constructable-stylesheets)<br><br>Javascript feature | 2019 |
| Mixins / Functions / Extend | [Style Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries#container_style_queries) | 2023<br><br>Behind a flag in all browsers<br>according to [caniuse.com](https://caniuse.com/css-container-queries-style) |
| Variable Logic | [@if / @else](https://developer.mozilla.org/en-US/docs/Web/CSS/if) | 2025<br><br>Only Chromium browsers at the time of this post |
| Random | Specified in 	[CSS Values and Units Module Level 5](https://www.w3.org/TR/css-values-5/#randomness) | N/A<br><br>Not supported in any browsers yet |
| Better defined Variables | [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) | 2024 |

But there are some SASS features that don't have a direct equivalent in CSS yet, and may never have one. These include:

* Single-line comments (//)
* Loops (@for, @each, @while)
* Logging of values to console (@debug)

We can simulate some of the loops (`@for` and `@each`), others are impossible to simulate without a preprocessor or Javascript.

## Simulating SASS loops in CSS

CSS does not have built-in support for the different types of loops available in SASS, we can simulate these loops with a combination of existing CSS features.

It is not possible to simulate the `@while` loop. We will look at how to simulate the `@for` and `@each` loops.

### for loops

To simulate a `@for` loop in CSS, we can use CSS variables and inline styles to create a series of elements with different styles based on a counter.

We first define a series of CSS variables inside inline styles on the HTML elements.

For the example below, we use sequential values for the `--i` variable to represent the loop index; we can change these values as needed.

```html
<div class="card" style="--i: 1;"></div>
<div class="card" style="--i: 2;"></div>
<div class="card" style="--i: 3;"></div>
```

We can then use the variables in the CSS to apply styles based on the counter value using the `calc()` function.

```css
.card {
  border: calc(var(--i) * 1px) solid black;
  border-radius: calc(var(--i) * 5px);
  height: calc(var(--i) * 20px);
  width: calc(2rem * var(--i));
  margin-block-end: calc(var(--i) * 20px);
}
```

### each / for-each loops

This SCSS code will generate a series of classes for different button variants.

```scss
$colors: primary, success, danger;

@each $color in $colors {
  .button--#{$color} {
    background-color: var(--#{$color}-color);
  }
}
```

This type of loop can be emulated with data attributes in the HTML and attribute selectors matching the data attributes in the CSS.

First, instead of adding a list to a variable like we do in SASS, we add `data-variant` attributes to the HTML elements:

```html
<button data-variant="primary">Primary</button>
<button data-variant="success">Success</button>
<button data-variant="danger">Danger</button>
```

Then, use [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) in your CSS to target each variant. This approach neatly emulates the logic of the @each loop.

```css
/* Define color variables */
:root {
  --primary-color: #007bff;
  --success-color: #28a745;
  --danger-color: #dc3545;
}

/* Style based on the data-variant attribute */
[data-variant="primary"] {
  background-color: var(--primary-color);
}

[data-variant="success"] {
  background-color: var(--success-color);
}

[data-variant="danger"] {
  background-color: var(--danger-color);
}
```
