---
title: Playing with Relative Color Syntax
date: 2024-06-14
tags:
  - CSS
  - Colors
---

Now that relative colors are supported across browsers it's time to revisit the syntax and see what we can do with it and how it changes what we can natively do with colors.

## Basic Syntax

The most basic syntax for relative colors has the following shape:

1. The color space you want to work on, in the example: OKLCH
2. The color that we want to work from, using the `from` keyword and the color that we want to use, in this case, `#663399`
3. The channels for the target format, in this case, `l` for lightness, `c` for chrome, and `h` for hue

It is important to point out that each color space has different channel names and that you must specify the correct channel names for relative colors to work.

```css
.demo02{
  --background-color: oklch(from #663399 l c h);
}
```

We can also work with variables. In this case, we define the base color as a CSS variable and use it as the color value for our relative syntax.

```css
.demo01 {
  --base-color: #663399;
  --background-color: oklch(from var(--base-color) l c h);
}
```

The rest of the examples below will play with this basic syntax and modify it to achieve different effects, similar to what we've achieved with `color-mix` and other CSS functions.

### Color Conversions

The first thing that comes to mind is that, because we get to specify the color space that we want to use in the color we're working with, we can use this to convert colors to different color spaces.

This would make it easier to work with third-party color palettes, maybe those provided by a designer, and switch them to the color space we want to work with.

This example defines a series of CSS variables that we can apply where colors are allowed:

The first variable defines a `--base-color` in the SRGB color space

The other variables convert the base color to OKLCH, HSL and LAB respectively.

This example makes the conversion easier since all color spaces can take SRGB colors at input. If you use other color spaces as the source this may not be the case and you may run into "out of gamut issues" where SRGB cannot accurately represent colors in other spaces.

```css
:root {
  --base-color: #663399;
  --oklch-color: oklch(from var(--base-color) l c h);
  --hsl-color: hsl(from var(--base-color) h s l);
  --lab-color: lab(from var(--base-color) l a b);
}
```

The fully working example looks like this:

<iframe height="434.5733642578125" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/caraya/embed/OJYbxoM?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/OJYbxoM">
  Untitled</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Opacity As A Variable

Just like any other component of a color we can handle opacity as a component of a color.

The relative color API provides a value for opacity (`alpha`) that we can use in calculations.

In this example, we create three CSS variables with three levels of opacity, calculated by using the `alpha` variable times different values to get the type of opacity we want.


```css
:root {
  --base-color: #663399;
  --transparent-75: oklch(from var(--base-color) l c h / calc(alpha * 0.75));
  --transparent-50: oklch(from var(--base-color) l c h / calc(alpha * 0.5));
  --transparent-25: oklch(from var(--base-color) l c h / calc(alpha * 0.25));
}
```

You can see how it looks and how it works in the Codepen below:

<iframe height="415.52337646484375" style="width: 100%;" scrolling="no" title="Opacity As A Variable in Relative Colors" src="https://codepen.io/caraya/embed/rNgWYvb?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/rNgWYvb">
  Opacity As A Variable in Relative Colors</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Basic Examples

Now that we've seen the basics of how relative colors work, let's look at more specific examples.

### Lighten And Darken A Color

You can adjust the lightness of a color, where it's supported, to make the color lighter or darker than the base color.

The first example shows one lighter and one darker color from the base
This is what this color mini-scale looks like.

<p class="codepen" data-height="505.59222412109375" data-default-tab="result" data-slug-hash="WNBoMvv" data-pen-title="Untitled" data-user="caraya" style="height: 505.59222412109375px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/caraya/pen/WNBoMvv">
  Untitled</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

We can expand on the idea and produce a more functional monochromatic scale. The second example uses four lighter and four darker colors.

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/caraya/embed/XWwjYwo?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/XWwjYwo">
  Untitled</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Having these monochromatic scales helps when you have assigned colors to use. You can generate a scale from a single color.

### Saturate and Desaturate A Color

Using relative color syntax we can control the saturation level of a color in color spaces that support it.

> Saturation, in color theory, describes a color's intensity, purity, or vividness. It refers to the amount of gray present in color, with higher saturation indicating a more vibrant and intense color and lower saturation indicating a more muted or desaturated color. In simpler terms, saturation determines how "pure" a color appears.
>
> source: [Saturation](https://app.uxcel.com/glossary/saturation)

The following example will add and subtract the same amount from the chroma channel of our base color.

```css
:root {
  /* Base Color Settings */
  --base-color: #663399;
  --saturated: oklch(from var(--base-color) l calc(c / 4) h);
  --desaturated: oklch(from var(--base-color) l calc(c * 4) h);
}
```

This is what it looks like:

<iframe height="431.68560791015625" style="width: 100%;" scrolling="no" title="Chroma Saturation" src="https://codepen.io/caraya/embed/OJYbrwr?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/OJYbrwr">
  Chroma Saturation</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Hue Rotation

We can also create interesting color palettes just by modifying the hue of our base color.

### Complementary Colors

The first type of hue rotation we'll look at is creating complementary colors. This is the color that is opposite the base color on the color wheel (180 degrees opposite on the color wheel).



```css
/* Colors */
--base-color: #663399;
--complementary: oklch(from var(--base-color) l c calc(h + 180));

/* This is equivalent */
--complementary: oklch(from var(--base-color) l c calc(h - 180));
```

<iframe height="460.7376708984375" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/caraya/embed/zYQoQWR?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/zYQoQWR">
  Untitled</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Triadic Colors

Triadic Colors are equidistant in the color wheel (120 degrees between colors). There is no primary color in a triadic set so you need to pick which one to use and primary and decide how you will use the accent colors.

```css
:root {
  /* Base Color Settings */
  --triadic1: #663399;
  --triadic2: oklch(from var(--triadic1) l c calc(h + 120));
  --triadic3: oklch(from var(--triadic1) l c calc(h + 240));
}
```

The colors are shown below.

<iframe height="414.6314697265625" style="width: 100%;" scrolling="no" title="Triadic Colors" src="https://codepen.io/caraya/embed/qBGqzme?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/qBGqzme">
  Triadic Colors</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Tetradic Palettes

Tetradic palettes are four colors at equidistant intervals on the color wheel. I normally use 90, 180, and 270 as the other values for hue rotation.

As with Triadic colors, you will have to choose which one to use as the primary and how will you use the accent colors.

```css
:root {
  --tetradic1: #663399;
  --tetradic2: oklch(from var(--tetradic1) l c calc(h + 90));
  --tetradic3: oklch(from var(--tetradic1) l c calc(h + 180));
  --tetradic4: oklch(from var(--tetradic1) l c calc(h + 270));
}
```

These colors look like this:

<iframe height="418.08453369140625" style="width: 100%;" scrolling="no" title="Tetradic  Colors" src="https://codepen.io/caraya/embed/mdYONGK?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/mdYONGK">
  Tetradic  Colors</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Browser Support

Support is getting better with Firefox being the last straggler to implement the feature in production versions (available July 9, 2024).

<picture>
<source type="image/webp" srcset="https://caniuse.bitsofco.de/static/v1/css-relative-colors-1716966128951.webp">
<source type="image/png" srcset="https://caniuse.bitsofco.de/static/v1/css-relative-colors-1716966128951.png">
<img src="https://caniuse.bitsofco.de/static/v1/css-relative-colors-1716966128951.jpg" alt="Data on support for the css-relative-colors feature across the major browsers from caniuse.com">
</picture>

Until the feature becomes [baseline newly available](https://web.dev/baseline) at the earliest and perhaps even baseline widely available, you should use `@supports` to make sure the feature works properly and that you provide fallbacks where it doesn't.

In this `@supports` example we do the following:

* Define the colors as OKLCH without relative syntax first
* Define our relative colors inside a `@supports` at-rule. This will only be triggered in browsers (and versions) that support the feature
* Use the CSS variable. This will take the value from the supported property that appears last in the document.

```css
:root {
	--tetradic1: oklch(44.03% 0.16 303.37);
	/* color looped around the wheel */
	--tetradic2: oklch(44.03% 0.16 33.37)
	--tetradic3: oklch(44.03% 0.16 123.37)
	--tetradic4: oklch(44.03% 0.16 213.37)
}

@supports (color: oklch(from white l c h)) {
	:root {
		--tetradic1: #663399;
		--tetradic2: oklch(from var(--tetradic1) l c calc(h + 90));
		--tetradic3: oklch(from var(--tetradic1) l c calc(h + 180));
		--tetradic4: oklch(from var(--tetradic1) l c calc(h + 270));
	}
}

.demo01 {
	background: var(--tetradic1);
}
```

We can keep experimenting with relative colors. Where you take these colors and how you experiment with them is up to you.
