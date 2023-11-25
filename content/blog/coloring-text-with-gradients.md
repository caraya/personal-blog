---
title: "Coloring Text With Gradients"
date: 2023-12-27
tags:
  - CSS
  - Explorations
---

In addition to black and white or single, solid color text, we can also use gradients to color the text.

The process is slightly more complicated than just assigning color to the desired element.

1. Check if the browser supports `background-clip` and color conversion syntax for `linear-gradient`
2. Set the color of the text to transparent so that it won't conflict with the background gradient
3. Set the gradient as the background
4. Set the [background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip) property to text

{.custom-ordered}

```css
@supports (background-clip: text) and
  (background: linear-gradient(in oklch to right, #A37, #595)) { /* 1 */
  .gradient-text {
    color: transparent; /* 2 */
    background: linear-gradient(
      in oklch 90deg,
      rgb(131, 58, 180) 0%,
      rgb(253, 29, 29) 20%,
      rgb(252, 176, 69) 40%
    ); /* 3 */
    background-clip: text; /* 4 */
  }
}
```

You can play with the gradients by adding colors and changing the type of gradients that we use to color the text.

The code below uses a conical gradient as the background color. Note that conical gradients use a different syntax than linear gradients we saw in the previous example and we use OKLCH colors so we don't

```css
/* Conical gradients*/
@supports (background-clip: text) and
  (background: conic-gradient(from 45deg, oklch(45.2% 0.31 264.05), oklch(63.22% 0.248 28.28))) {
  .conic-gradient-text {
    color: transparent;
    background: conic-gradient(from 135deg,
      oklch(45.2% 0.31 264.05),
      oklch(63.22% 0.248 28.28));
    background-clip: text;
  }
}
```
