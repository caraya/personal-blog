---
title: CSS length units
date: 2024-08-05
tags:
  - CSS
  - Length
  - Percentage
  - Measurements
---

Many CSS properties accept numbers as values. Whether these values are whole numbers, decimals, fractions or percentages. Whatever they are, the unit following a number [determines its computed length](https://css-tricks.com/computed-values-more-than-meets-the-eye/).

So, what does the term length mean in the context of CSS as defined in the [CSS Values and Units Module Level 4](https://drafts.csswg.org/css-values-4/) specification?

“Length” means any sort of distance that can be described as a number, such as the physical dimensions of an element, a measure of time, geometric angles… all kinds of things!

Some examples of numbers:

```css
/* Unitless numbers */
1

/* Pixels */
14px

/* em */
1.5em

/* rem */
3rem

/* Percentage */
50%

/* Characters */
650ch

/* Viewport units */
100vw
80vh
50dvh
50svh

/* Container units */
100cqi
50cqb
```

All these numbers, while different, do the same thing: define an element’s dimensions in CSS.

We need units in CSS because they determine how to size elements on a page, regardless of its function. Without them, the browser would have no way of knowing how to apply numbers to an element.

We'll look at different types of units and their associated values.

CSS uses many different types of numbers. Before we jump into discussing units that we attach to numbers, let's have a quick look at the numbers themselves:

Integers
: When written literally, an integer is one or more decimal digits 0 through 9. The first digit of an integer may be immediately preceded by - or + to indicate the integer’s sign.
: In the CSS specifications rounding to the nearest integer requires rounding in the direction of +∞ when the fractional portion is exactly 0.5. (For example, 1.5 rounds to 2, while -1.5 rounds to -1.)

Numbers
: When written literally, a number is either an integer or zero or more decimal digits followed by a dot (.) followed by one or more decimal digits, optionally, it can be concluded by the letter “e” or “E” followed by an integer indicating the base-ten exponent in scientific notation. It corresponds to the &lt;number-token&gt; production in the CSS Syntax Module.
: As with integers, the first character of a number may be immediately preceded by - or + to indicate the number’s sign.

Dimensions
: The general term dimension refers to a number with a unit attached to it.
: When written literally, a dimension is a number immediately followed by a unit identifier. Like keywords, unit identifiers are ASCII case-insensitive.

Ratios
: Ratio values represent the ratio of two numeric values. It most often represents an aspect ratio, relating a width (first) to a height (second).
: The second number is optional, defaulting to 1. However, &lt;ratio&gt; is always serialized with both components.

Percentages
: Percentage values indicate a value that is some fraction of another reference value.
: When written literally, a percentage consists of a number immediately followed by a percent sign %.
: Percentage values are always relative to another quantity, for example, a length. Each property that allows percentages also defines the quantity to which the percentage refers. This quantity can be a value of another property for the same element, the value of a property for an ancestor element, or a measurement of the formatting context.

## Types of units in the CSS Values and Units specification

### Absolute Units

The absolute length units are fixed to each other and anchored to some physical measurement. They are mainly useful when the output environment is known.

### Relative Units

Relative length units specify a length relative to another length. Style sheets that use relative units can more easily scale from one output environment to another.

## List of units and what they represent

### Absolute units

According to the specification:

All of the absolute length units are compatible, and px is their [canonical unit](https://drafts.csswg.org/css-values-4/#canonical-unit) (the unit that will be used for serializing these values).

For a CSS device, these dimensions are anchored either:

1. by relating the physical units to their physical measurements, or
2. by relating the [pixel unit](https://drafts.csswg.org/css-values-4/#visual-angle-unit) to the [reference pixel](https://drafts.csswg.org/css-values-4/#reference-pixel).

For print media at typical viewing distances, the anchor unit should be one of the physical units (inches, centimeters, etc). For screen media (including high-resolution devices), low-resolution devices, and devices with unusual viewing distances, it is recommended instead that the anchor unit be the pixel unit.

| Unit | Name | Notes |
| :---: | --- | --- |
| cm | Centimeters | 1cm = 96px/2.54 |
| mm | Millimeters | 1/10th of 1cm |
| Q | Quarter-millimeters | 1/40th of 1cm |
| in | Inches | 2.54cm = 96px |
| pc | Picas | 1/6th of 1in<br><br>**Mostly used in print** |
| pt | Points | 1/72nd of 1in<br><br>**Mostly used in print** |
| px | Pixels | 1/96th of 1in |

### Font-relative units

The font-relative lengths refer to the font metrics either of the element on which they are used (for the local font-relative lengths) or of the root element (for the root font-relative lengths).

| Unit | Relative to |
| :---:  | --- |
| em | The font size of the element, or its nearest parent container |
| ex | The 0-height of the element’s font |
| cap | The cap height (the nominal height of capital letters) of the element’s font |
| ch | The width of the 0 character of the font in use |
| ic | The average width of a full glyph of the font in use, as represented by the “水” (U+6C34) glyph |
|rem | The font-size value that’s set on the root (html) element |
| lh | The line-height value that’s set on the element |
| rlh | The line-height that’s set on the root (html) element |

You can also viewport units (discussed in the next section) to measure font sizes.

### Viewport Units

The viewport-percentage lengths are relative to the size of the initial containing block—​which is itself based on the size of either the viewport (for continuous media) or the page area (for paged media). When the height or width of the initial containing block is changed, they are scaled accordingly.

| Unit | Description | Notes |
| :---: | --- | --- |
| vw | 1% of viewport’s width | |
| vh | 1% of viewport’s height | |
| vi | 1% of viewport’s size in the root  element’s inline axis| |
| vb | 1% of viewport’s size in the root  element’s block axis| |
| vmin | 1% of the vw or vh, whichever  is smaller| |
| vmax | 1% of the vw or vh, whichever  is larger| |


In addition to the "traditional" viewport units, the specification also defines small, large and dynamic viewports with their corresponding viewport units. See [The large, small, and dynamic viewport units](https://web.dev/blog/viewport-units) for more information.

* **s\* ** units refer to small viewports
* **l\* ** units refer to large viewports
* **d\* ** units refer to dynamic viewports

| Unit | Description | Notes |
| :---: | --- | --- |
| svh | Equal to 1% of the height of the small viewport size | |
| lvh | Equal to 1% of the height of the large viewport size | |
| dvh | Equal to 1% of the height of the dynamic viewport size| |
| svi | Equal to 1% of the size of the small viewport size in the box’s inline axis | |
| lvi | Equal to 1% of the size of the large viewport size in the box’s inline axis | |
| dvi | Equal to 1% of the size of the dynamic viewport size in the box’s inline axis | |
| svb | Equal to 1% of the size of the initial containing block small viewport size in the box’s block axis | |
| lvb | Equal to 1% of the size of the initial containing block large viewport size in the box’s block axis | |
| dvb | Equal to 1% of the size of the initial containing block dynamic viewport size in the box’s block axis | |
| svmin | Equal to the smaller of svw or svh | |
| lvmin | Equal to the smaller of lvw or lvh| |
| dvmin | Equal to the smaller of dvw or dvh| |
| svmax | Equal to the larger of svw or svh.| |
| lvmax | Equal to the larger of lvw or lvh.| |
| dvmax | Equal to the larger of dvw or dvh.| |

### Container units

These units work with [container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries).

| Unit | Relative to |
| --- | --- |
| cqw | 1% of a query container’s width |
| cqh | 1% of a query container’s height |
| cqi | 1% of a query container’s inline size |
| cqb | 1% of a query container’s block size |
| cqmin | The smaller value of cqi or cqb |
| cqmax | The larger value of cqi or cqb |

### Angle units

Angle units indicate an angle value expressed in `degrees`, `gradians`, `radians`, or `turns`. It is used, for example, in gradients and some transform functions.

| Unit | Name | Notes |
| --- | --- | --- |
| deg | degree | There are 360 degrees in a full circle |
| grad | gradian | There are 400 gradians in a full circle |
| rad | radian | There are 2π radians in a full circle |
| turn | turn | There is 1 turn in a full circle |

### Time units

Time units represent a time value expressed in seconds or milliseconds. It is used in animation, transition, and related properties.

The conversion is `1s = 1000ms`.

| Unit | Name | Notes |
| --- | --- | --- |
| s | second | There are 60 seconds in a minute, but there is no unit for minutes |
| ms | millisecond | There are 1,000 milliseconds in a second |

### Fractional units

The `fr` unit represents a fraction of the leftover space in the grid container. Tracks sized with fr units are called flexible tracks as they flex in response to leftover space similar to how flex items with a zero base size fill space in a flex container.

| Unit | Notes |
| --- | --- |
| fr | One fraction of the free space in a grid container |

### Resolution units

Resolution units describe resolutions in [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) or the `image-resolution` property defined in the [CSS Images Module Level 4](https://drafts.csswg.org/css-images-4/#the-image-resolution) and describe the pixel density of an output device, i.e., its resolution.

On screens, the units are related to CSS inches, centimeters, or pixels, not physical values.

| Unit | Name | Notes |
| --- | --- | --- |
| dpi | Dots per inch | |
| dpcm | Dots per centimeter | |
| dppx, x | Dots per pixel unit | |

### Frequency Units

The frequency units represent a frequency dimension, such as the pitch of a speaking voice. They are not currently used in any CSS properties.

| Unit | Name | Notes |
| --- | --- | --- |
| Hz | Herz | Represents the number of occurrences per second |
| kHz | kiloHertz | One kiloHertz is equal to 1000 Hertz |


## Links and resources

* [CSS Values and Units Module Level 4](https://drafts.csswg.org/css-values-4/) specification
* [CSS Length Units](https://css-tricks.com/css-length-units/)
