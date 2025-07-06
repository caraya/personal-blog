---
title: CSS Colors
date: 2025-08-06
tags:
  - CSS
  - Web Development
  - Design
  - Colors
---

Since the first CSS specification, web developers were limited to a handful of ways to define colors in the sRGB color space. With the finalization of the [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) and the ongoing development of [Level 5](https://www.w3.org/TR/css-color-5/), we now have access to a vastly expanded universe of color, along with powerful tools to manipulate and mix them.

This post will cover the new color spaces, functions, and syntaxes, with a focus on what's available, how to mix colors, and when to use each color space.

## What Colors Are Available?

 CSS now supports a wide range of color notations. Many of the newer functions give us access to colors outside the traditional sRGB gamut, producing more vibrant and nuanced designs on compatible displays.

### Updated Notations

CSS Color Level 4 introduced a space-separated syntax for `rgb()` and `hsl()` that is now widely supported. The classic syntax is still valid (older code won't break), but the modern syntax is more compact and easier to read.

| Method | Classic Syntax | Modern Syntax<br>(Level 4+)  |
| :----: | :----: | :----: |
| **Keyword** | red | red |
| **Hex** | #ff0000,<br>#f00 | #ff0000 |
| **RGB** | rgb(255, 0, 0) | rgb(255 0 0) |
| **RGBA** | rgba(255, 0, 0, 0.5) | rgb(255 0 0 / 0.5) |
| **HSL** | hsl(0, 100%, 50%) | hsl(0 100% 50%) |
| **HSLA** | hsla(0, 100%, 50%, 0.5) | hsl(0 100% 50% / 0.5) |

### New Color Functions (Level 4)

These functions introduce new ways of thinking about and defining color. Rather than just sRGB, we can now work with a variety of color spaces that better match human perception and the capabilities of modern displays.

#### hwb() - Hue, Whiteness, Blackness

This is often considered a more intuitive way to create tints and shades than HSL. You start with a pure hue and mix in amounts of white and/or black. This model often maps more closely to how artists think about modifying a color. To make a sky blue lighter, you don't adjust "saturation" and "lightness"; you simply add white.

* **Syntax**: hwb(hue whiteness blackness [/ alpha])
* **Example**: `hwb(194 0% 0%)` is a pure cyan. `hwb(194 20% 40%)` is a darker, muted cyan created by mixing the base hue with 20% white and 40% black.

#### lab() & lch() - Perceptually Uniform Colors

These color spaces are designed to align with human vision. Unlike RGB or HSL, a change of 10 in the l (lightness) value of two different colors will look like the same amount of change to our eyes. This predictability is revolutionary for creating accessible color systems, smooth gradients, and consistent data visualizations.

* **lab()**: lab(lightness a-axis b-axis [/ alpha]): L is lightness (0-100). The a axis runs from green (negative values) to red (positive values), and the b axis runs from blue (negative values) to yellow (positive values).
* **lch()**: lch(lightness chroma hue [/ alpha]): L is lightness. C is chroma (similar to saturation, from 0 to ~230), and H is the hue angle (0-360). This is often more intuitive than LAB because it uses a familiar hue wheel concept.
* **Example**: `lch(53 105 40)` is a vibrant red. To make it darker but keep the same vividness, you could simply decrease the lightness: `lch(40 105 40)`.

#### oklab() & oklch() - Improved Perceptual Uniformity

These are improved versions of lab() and lch(). They do an even better job of predicting how humans perceive color and, crucially, they fix an issue where lch gradients between certain colors (like blue and yellow) could still introduce unexpected hue shifts. For this reason, if you're going to use a perceptually uniform color space, OKLCH is generally the best choice.

* **Syntax**: `oklab(...)` and `oklch(...)` work just like their predecessors.
* **Example**: `oklch(63% 0.25 40)`. The chroma value is much smaller, typically ranging from 0 to 0.4.

## The color() Function: Accessing HD Colors

The `color()` function is your gateway to High Definition (HD) colors that are outside the standard sRGB gamut. It allows you to explicitly choose a color space, giving you access to a much wider range of colors on compatible hardware.

* **Syntax**: color(color-space c1 c2 c3 [/ alpha])

### Why Use color()?

The default color space of the web, sRGB, can only represent a limited portion of the colors the human eye can see. Modern screens, like those on new phones, laptops, and monitors, can display much more vibrant colors. The `color()` function lets us tap into these capabilities.

The most common use case is the `display-p3` color space, which offers about 25% more colors than sRGB, particularly in the range of bright reds, oranges, and greens.

```css
.call-to-action {
  /* Fallback for older browsers and non-P3 screens */
  background-color: rgb(0, 255, 0);

  /* A much more vibrant green for capable screens */
  background-color: color(display-p3 0 1 0);
}
```

On a compatible display, the `display-p3` green will look noticeably more vivid and saturated than the sRGB green.

### Color Spaces Not Meant for Direct Display

The `color()` function also includes identifiers for color spaces that are not typically used for direct styling in a browser. Their inclusion is for professional workflows, such as photography, video editing, and color science, where converting between color spaces is necessary.

* **prophoto-rgb**: A very wide gamut used in professional photography.
* **rec2020**: A gamut for Ultra HD television.
* **xyz, xyz-d50, xyz-d65**: Device-independent, "absolute" color spaces used as a reference for converting between other color spaces.

While you *can* write these values, they won't "work" in the way you expect `rgb()` or `display-p3` to. They are specialized tools for specific contexts beyond typical web design.

## A Special Case for Print: device-cmyk()

A unique function introduced in CSS Color Level 5 is `device-cmyk()`. This function specifies colors using the CMYK (Cyan, Magenta, Yellow, Key/Black) model, which is the standard for print media.

* **Syntax**: device-cmyk(C M Y K [/ A])

The crucial word here is **device**. This function is **not color-managed** for screen display. It's a raw instruction intended for a device that understands CMYK natively, like a printer.

### What Happens On-Screen?

Because your monitor is an RGB device, it cannot display a CMYK color. When a browser sees `device-cmyk()`, it makes a "best guess" conversion to show something on screen, but this conversion is **unreliable and inconsistent** across different browsers and operating systems.

### The Correct Use Case: Print Stylesheets

You should only use `device-cmyk()` inside a @media print block. This allows you to define precise colors for the printed version of your page without affecting how it looks on screen.

```css
@media print {
  .company-logo {
    /* Use the official CMYK brand color for accurate printing */
    color: device-cmyk(0.1 0.8 0 0.2);
  }
	/* Ensure text prints with 100% black ink for maximum sharpness */
	color: device-cmyk(0 0 0 1);
}
```

## Mixing Colors with color-mix()

CSS Color 5 introduces color-mix(), a function that lets you mix two colors together in a specified color space. The choice of color space dramatically affects the outcome.

* **Syntax**: color-mix(in \<color-space\>, \<color1\> [\<percentage\>], \<color2\> [\<percentage\>])

### Example: Mixing Blue and Yellow

Let's mix blue and yellow in two different color spaces: srgb and oklch.

```css
.swatch-srgb {
  background-color: color-mix(in srgb, blue, yellow);
}

.swatch-oklch {
  background-color: color-mix(in oklch, blue, yellow);
}
```

* **Result in srgb**: You get a muddy, grayish color in the middle. This is because sRGB is not perceptually uniform, and the path between blue and yellow passes through a "dead zone" of gray.
* **Result in oklch**: You get a vibrant, clean green. This is because OKLCH understands the perceptual path between the two hues and travels along the hue wheel, producing the expected intermediate color.

You can see the difference in the Codepen below:

<iframe height="506" style="width: 100%;" scrolling="no" title="Color Mix Examples" src="https://codepen.io/caraya/embed/JodQxKN?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/JodQxKN">
  Color Mix Examples</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

For smooth, predictable gradients and mixes, always use a perceptually uniform color space like oklch.

## Best Uses for Each Color Space

With so many options, the choice is usually about use case and compatibility. Here's a quick guide to help you decide which color space to use in different scenarios:

### sRGB (via rgb(), hsl(), hex)

* **Best For**: General UI design, body text, and anywhere you need maximum compatibility or are not concerned with advanced color manipulation.
* **Why**: It's the universal standard for the web. Every device can display sRGB colors correctly. Use it as your default and as a fallback for more advanced colors.

### Display-P3 (via color())

* **Best For**: Hero images, call-to-action buttons, brand accents, and anywhere you want colors to be exceptionally vibrant and "pop."
* **Why**: It provides access to richer, more saturated colors that can make a design feel more modern and alive on compatible screens. Always provide an sRGB fallback and test on both P3 and non-P3 displays to ensure the design is effective in both gamuts.

### LCH & OKLCH

* **Best For**:
  * Gradients: Create perfectly smooth, even gradients that don't have muddy "gray" zones.
  * Color Palettes: Easily create harmonious color palettes by keeping Chroma and Hue constant while only changing Lightness, or vice-versa.
  * Data Visualizations: Ensure that different colors in a chart are equally distinguishable.
  * Design Systems: Build predictable and accessible color systems where, for example, changing the lightness of a color for a hover state has a consistent visual effect across all brand colors.
* **Why**: Their perceptual uniformity means that mathematical changes to color values result in visually consistent changes. Prefer OKLCH as it is a more refined system that avoids hue-shifting issues present in LCH.

### LAB & Oklab

* **Best For**: Similar to LCH/OKLCH. It's excellent for any task requiring perceptual uniformity, especially if you are working with color values generated from design tools.
* **Why**: LCH is often more intuitive for designers to write by hand because the Chroma and Hue components are easier to reason about than the abstract a (green-red) and b (blue-yellow) axes of LAB. However, both are powerful tools for color manipulation.

## Color Converter Tool

To make my life easier, I created a [color converter tool](https://color-converter.rivendellweb.net) that uses [Color.js](https://colorjs.io/) to convert the input color (any colors supported by Color.js) to the following color spaces:

* OKLCH
* HSL
* HWB
* Display-P3
* RGB
* HEX

It creates a scale with the original color at the center, 5 lighter and 5 darker shades, with conversions to OKLCH, HWB, Display P3 and RGB. Note that not all steps will be usable, as some steps in the higher ends of the scale may become too dark or too light to notice any difference.

It provides the [complementary color](https://www.interaction-design.org/literature/topics/complementary-colors) in OKLCH, HWB, Display P3 and RGB spaces.

Finally it provides [triadic](https://www.interaction-design.org/literature/article/triadic-color-scheme) and [tetradic](https://arounda.agency/blog/how-to-use-a-tetradic-color-scheme) harmonies in OKLCH, HWB, Display P3 and RGB.
