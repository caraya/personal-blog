---
title: "Creating color palettes with color-mix()"
date: "2023-07-26"
---

Since [color-mix()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) is now available in all browsers we can revisit what it is, how it works and one possible use in creating a customizable color palette.

## What is color-mix()

The `color-mix()` function allows you to combine 2 colors, in a given color space, with the specified percentages of each color.

The most basic usage uses only the color space and the two colors

```css
.demo01 {
  background: color-mix(in oklab, red, blue);
}
```

You can use percentage values to indicate how much of each color to apply to the mix.

If you specify a percentage value, it will be subtracted from 100%.

`.demo02` and `.demo03` will produce the same result.

`.demo04` uses the same technique with different values.

```css
.demo02 {
  background: color-mix(in oklab, red 50%, blue);
}

.demo03 {
  background: color-mix(in oklab, red 50%, blue 50%);
}

.demo04 {
  background: color-mix(in oklab, var(--color-1) 75%, var(--color-2));
}
```

If you use percentage in a single color then it doesn't matter which one it is.

`.demo05` and `.demo06` produce the same result using different values each color.

```css
.demo05 {
  background: color-mix(in oklab, var(--color-1), var(--color-2) 65%);
}

.demo06 {
  background: color-mix(in oklab, var(--color-1) 35%, var(--color-2));
}
```

If the color space you're working with support color interpolations you can use them in your mixes.

The next block of demos (07 to 10) use the four possible interpolation values.

Just like when you use them with gradients, the results may not be what you expect them to be.

```css
.demo07 {
  background: color-mix(in hsl longer hue, red, blue);
}

.demo08 {
  background: color-mix(in hsl longer hue, red, blue);
}

.demo09 {
  background: color-mix(in hsl increasing hue, red, blue);
}

.demo10 {
  background: color-mix(in hsl decreasing hue, red, blue);
}
```

We can also use `color-mix()` to lighten and darken colors by mixing the target color with white (to lighten) and black (to darken).

```css
.demo11 {
  background: color-mix(in oklab, #0000ff 50%, white);
  color: whitesmoke;
}

.demo12 {
  background: color-mix(in oklab, #0000ff 50%, black);
  color: whitesmoke;
}
```

This is the technique that we'll use to generate our palette.

## Creating a color palette

We will use `color-mix()` to create a ten-item color palette.

In the `:root` element we'll set up the base color in the `--base-color` variable. This is the only hardcoded value in our initial palette.

Then we'll convert it to the OKLab color space by using `color-mix()` and setting our base color to be 100% of the mix.

```css
@layer colors {
  :root {
    --base-color: #3949AB;

    --oklab-base: color-mix(in oklab, var(--base-color) 100%, hotpink);
```

The first five values (50, 100, 200, 300, and 400) lighten the base color by mixing it with white in different percentages to control the color saturation.

In `--color-50` we use the least amount of color and `--color-400` uses the most color when associated with white

```css
    --color-50: color-mix(
      in oklab,
      var(--oklab-base) 50%,
      white);
    --color-100: color-mix(
      in oklab,
      var(--oklab-base) 60%,
      white);
    --color-200: color-mix(
      in oklab,
      var(--oklab-base) 70%,
      white);
    --color-300: color-mix(
      in oklab,
      var(--oklab-base) 80%,
      white);
    --color-400: color-mix(
      in oklab,
      var(--oklab-base) 90%,
      white);
```

`--color-500` is the base color without any mixing. We use 100% of the color when mixing. I chose to mix it with black but the second color doesn't really matter.

```css
    --color-500: color-mix(in oklab, var(--oklab-base) 100%, black);
```

The second block (600, 700, 800 and 900) darken the color by mixing with black.

```css
    --color-600: color-mix(in oklab, var(--oklab-base) 90%, black);
    --color-700: color-mix(in oklab, var(--oklab-base) 80%, black);
    --color-800: color-mix(in oklab, var(--oklab-base) 70%, black);
    --color-900: color-mix(in oklab, var(--oklab-base) 60%, black);
  }
```

We then create classes for each color with the background using the variables we created in the previous steps and a color for the text using [color-contrast()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-contrast) to check whether white or black would contrast better against the color we're using.

```css
  .color-50 {
    background: var(--color-50);
    color: color-contrast(var(--color-50) vs black, white);
  }

  .color-100 {
    background: var(--color-100);
    color: color-contrast(var(--color-100) vs black, white);
  }

  .color-200 {
    background: var(--color-200);
    color: color-contrast(var(--color-200) vs black, white);
  }

  .color-300 {
    background: var(--color-300);
    color: color-contrast(var(--color-300) vs black, white);
  }

  .color-400 {
    background: var(--color-400);
    color: color-contrast(var(--color-400) vs black, white);
  }

  .color-500 {
    background: var(--color-500);
    color: color-contrast(var(--color-500) vs black, white);
  }

  .color-600 {
    background: var(--color-600);
    color: color-contrast(var(--color-600) vs black, white);
  }

  .color-700 {
    background: var(--color-700);
    color: color-contrast(var(--color-800) vs black, white);
  }

  .color-800 {
    background: var(--color-800);
    color: color-contrast(var(--color-800) vs black, white);
  }

  .color-900 {
    background: var(--color-900);
    color: color-contrast(var(--color-900) vs black, white);
  }
}
```

The full working example that shows the results of the code we've cover4ed so far is in the Pen below:

<iframe height="758.9568481445312" style="width: 100%;" scrolling="no" title="color palettes using color-mix()" src="https://codepen.io/caraya/embed/ExOXPxJ?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/ExOXPxJ"> color palettes using color-mix()</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

We may decide that the colors in the palette don't work, quite as we wanted. There are two ways in which we can change the colors:

1. We can adjust the percentages of the color we mix
2. We can replace the `color-mix()` value with a static color that better matches your project or brand
