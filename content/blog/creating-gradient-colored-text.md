---
title: Creating Gradient-Colored Text
date: 2024-10-28
tags:
  - CSS
  - Explorations
---

In addition to black and white or single, solid-color text, we can also use gradients to color the text.

The process is slightly more complicated than just assigning color to the desired element.

We wrap the selector in a feature query for `background-clip: text`. This feature will only work if the feature is supported.

Set the color of the element to transparent so the background will show through.

Then define the gradient for the color with as many stops as you want and in whatever color space works best for your project. Newer color spaces like OKLCH are supported across browsers but your project may have different requirements.

[background-clip](https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip) sets whether an element's background extends underneath its border box, padding box, or content box.

```css
@supports (background-clip: text) {
  h1 {
    font-size: 6rem;
    color: transparent;
    background: linear-gradient(
      to right,
      oklch(62.8% 0.25768330773615683 29.2338851923426),
      oklch(79.27% 0.1709 70.67),
      oklch(96.8% 0.21095439261133309 109.76923207652135),
      oklch(51.98% 0.1768 142.5),
      oklch(45.2% 0.31313625765874376 264.05300810418345),
      oklch(33.9% 0.17927151083764675 301.68475941911254),
      oklch(76.19% 0.1861 327.21),
      oklch(62.8% 0.25768330773615683 29.2338851923426)
    );
    background-clip: text;
  }
}
```

Be mindful of the colors you use when creating the gradient. Some of the colors you use may have not be accessible to all your users.
