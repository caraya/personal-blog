---
title: "Playing with relative color syntax in CSS"
date: 2023-11-29
---

[Relative color syntax](https://www.w3.org/TR/css-color-5/#relative-colors) gives developers a lot of power to control the colors we use in our pages.

In this post I will base the examples on code from [CSS relative color syntax](https://developer.chrome.com/blog/css-relative-color-syntax/) by [Adam Argyle](https://twitter.com/argyleink). I will try to keep it simple, if you want more details check Adam's article, it goes into a lot of detail on how to use the syntax to do a lot of things.

## Basic syntax and the **from** keyword

at the most basic, the structure of the syntax is as follows

1. The color space for the resulting color
2. The `from` keyword indicates the source of the color we want to work with
3. The parameters for the color, in this case the values for red, green and blue
   1. These parameters will change based on the color space we choose to work with

```css
.base-rgb-color {
	background: rgb(from green r g b);
}
```

You can also use variables to define the colors.

Using variables for the colors gives developers additional flexibility. If we want to change the value of a color, we have to make the change only once and it will propagate down the tree.

In this example, I use traditional CSS variables. We can also define these properties using `@property` from [CSS Properties and Values API](https://drafts.css-houdini.org/css-properties-values-api/)

```css
:root {
	--base-green: green;
}

.base-rgb-color {
	background: rgb(from var(--base-green) r g b);
}
```

## Converting between color spaces

You're not limited to the color space of your original color. You can use relative syntax to convert to other color spaces.

The example below will convert the `--base-green` color to OKLCH without having to do anything else but list the three parameters for OKLCH colors.

```css
:root {
	--base-green: green;
}

.base-srgb-color {
	background: srgb(from var(--base-green) r g b);
}

.base-oklch-color {
	background: oklch(from var(--base-green) l c h);
}
```

## Lightening and darkening

By adjusting the lightness value of a color, you can generate a palette based on a single color and lightness variations.

```css
:root {
	--base-green: green;
}

.light50-oklch-color {
  background: oklch(from var(--base-green) calc(l + 50) c h);
}

.light40-oklch-color {
  background: oklch(from var(--base-green) calc(l + 40) c h);
}

.light30-oklch-color {
  background: oklch(from var(--base-green) calc(l + 30) c h);
}

.light20-oklch-color {
  background: oklch(from var(--base-green) calc(l + 20) c h);
}

.light10-oklch-color {
  background: oklch(from var(--base-green) calc(l + 10) c h);
}
```

This scale only lightens the color. For a real-world application we would create both lighter and darker colors.

The code looks like the following Codepen:

<iframe height="555.910400390625" style="width: 100%;" scrolling="no" title="Lightening colors with relative color spaces" src="https://codepen.io/caraya/embed/JjxNqxE?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/JjxNqxE">
  Lightening colors with relative color spaces</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Playing with hue rotation

We can also play with the hue of a OKLCH color to produce related colors to use.

### Complementary colors

The simplest thing to do is to generate the complimentary color, the one that sits 180 degrees from our base color on the color wheel.

We do this by adding 180 to the hue value of the base color.

```css
:root {
	--base-green: green;
}

.base-oklch-color {
  background: oklch(from var(--base-green) l c h);
}

.complementary-oklch-color {
  background: oklch(from var(--base-green) l c calc(h + 180) );
}
```

<iframe height="431.73046875" style="width: 100%;" scrolling="no" title="Complementary Colors using relative color syntax in OKLCH color space" src="https://codepen.io/caraya/embed/PoVmvVB?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/PoVmvVB">
  Complementary Colors using relative color syntax in OKLCH color space</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Triadic Colors

Creating Triadic colors requires one more element and to break the 360 degree hue wheel into three equal parts at 0, 120 and 240 degrees in  the color wheel.

```css
:root {
	--base-green: green;
}

.base-oklch-color {
  background: oklch(from var(--base-green) l c h);
}

.triadic-oklch-color1 {
  background: oklch(from var(--base-green) l c calc(h + 120));
}

.triadic-oklch-color2 {
  background: oklch(from var(--base-green) l c calc(h + 240));
}
```

<iframe height="563.338623046875" style="width: 100%;" scrolling="no" title="Triadic Colors using relative color syntax and OKLCH color space" src="https://codepen.io/caraya/embed/dyaWEaz?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/dyaWEaz">
  Triadic Colors using relative color syntax and OKLCH color space</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Tetradric Colors

Likewise the set of Tetradric colors require four equidistant points in the color wheel. Base at 0, 90, 180 and 270.

```css
:root {
	--base-green: green;
}

.base-oklch-color {
  background: oklch(from var(--base-green) l c h);
}

.tetradic-oklch-color1 {
  background: oklch(from var(--base-green) l c calc(h + 90));
}

.tetradic-oklch-color2 {
  background: oklch(from var(--base-green) l c calc(h + 180));
}

.tetradic-oklch-color3 {
  background: oklch(from var(--base-green) l c calc(h + 270));
}
```

<iframe height="691.8761596679688" style="width: 100%;" scrolling="no" title="Tetradic colors using relative color syntax in OKLCH color space" src="https://codepen.io/caraya/embed/ZEwKNPG?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/ZEwKNPG">
  Tetradic colors using relative color syntax in OKLCH color space</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Links and Resources

* [Relative color syntax](https://www.w3.org/TR/css-color-5/#relative-colors)
* [CSS relative color syntax](https://developer.chrome.com/blog/css-relative-color-syntax/) &mdash; Adam Argyle
