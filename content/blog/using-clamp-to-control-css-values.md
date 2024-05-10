---
title: Using 'clamp' to control CSS Values
date: 2024-05-27
tags:
  - CSS
  - Layout
  - Design
---

Rather than using media queries to control the dimensions of an element, we can use the [clamp](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) to accomplish the same task with less code.

According to MDN:

> The clamp() CSS function clamps a middle value within a range of values between a defined minimum bound and a maximum bound. The function takes three parameters: a minimum value, a preferred value, and a maximum allowed value.

The first example uses CSS variables to establish the values for the default value (`scaler`), `min` and `max` values. We then tell the browser to use `10vw` as the value of the font size as long as it's no smaller than our `min` value and no larger than the `max`.

```css
h1 {
  --minFontSize: 32px;
  --maxFontSize: 200px;
  --scaler: 10vw;

	font-size: clamp(
		var(--minFontSize),
		var(--scaler),
		var(--maxFontSize) );
}
```

## Constraining the measurements of an element

Rather than using media or container queries, we can clamp the dimensions of an item between given sizes.

The most common way I've seen this done is to control the width (or inline size in logical terms) of an element.

The boundaries are expressed in absolute units, in this case, pixels, and the desired width (the middle value) in relative units, in this case, viewport relative units.

```css
.container {
	inline-size: clamp(400px, 40vw, 800px);
}
```

## Fluid typography

The oldest example of the clamp function is creating fluid typography scales.

At its most basic we do the following:

1. Establish a base value for the body's font size
2. Set the multipliers for each heading
3. Create variables for each element's font size using the clamp function the base paragraph size and the multiplier for the corresponding heading
4. Assign the variable to the corresponding element

```css
:root {
  /* Base font size */
  --base-size: 16px; /* 1 */

  /* Scaling factors */
  --h1-scale: 2; /* 2 */
  --h2-scale: 1.75;
  --h3-scale: 1.5;
  --h4-scale: 1.25;
  --h5-scale: 1.1;
  --h6-scale: 1;

  /* Paragraph font size using clamp */
  --p-font-size: clamp(
    14px, /* Minimum */
    calc(var(--base-size) + 1vw), /* Preferred */
    20px /* Maximum */
  ); /* 3 */

  /* Heading font sizes */
  --h1-font-size: clamp(32px, calc(var(--p-font-size) * var(--h1-scale)), 60px); /* 3 */
  --h2-font-size: clamp(28px, calc(var(--p-font-size) * var(--h2-scale)), 48px);
  --h3-font-size: clamp(24px, calc(var(--p-font-size) * var(--h3-scale)), 36px);
  --h4-font-size: clamp(20px, calc(var(--p-font-size) * var(--h4-scale)), 30px);
  --h5-font-size: clamp(18px, calc(var(--p-font-size) * var(--h5-scale)), 26px);
  --h6-font-size: clamp(16px, calc(var(--p-font-size) * var(--h6-scale)), 22px);
}

/* Applying the calculated sizes */
p {
  font-size: var(--p-font-size);
} /* 4 */

h1 {
  font-size: var(--h1-font-size);
}

h2 {
  font-size: var(--h2-font-size);
}

h3 {
  font-size: var(--h3-font-size);
}

h4 {
  font-size: var(--h4-font-size);
}

h5 {
  font-size: var(--h5-font-size);
}

h6 {
  font-size: var(--h6-font-size);
}
```

For a fuller example, check [Creating Fluid Typography with the CSS clamp() Function](https://www.sitepoint.com/fluid-typography-css-clamp-function/) from Sitepoint.
