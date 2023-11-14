---
title: OKLCH as my new deafult color space
date: 2023-11-29
---

[CSS Colors Level 4](https://www.w3.org/TR/css-color-4/) introduced new syntactic sugar to color functions.

It also added 14 different color spaces and ways to define colors. The one thca caught my attention is the OKLCH color space.

In `oklch(L C H)` or `oklch(L C H / a)` each item corresponds as follows:

* **L** is perceived lightness (0%-100%). “Perceived” means that it has consistent lightness for our eyes, unlike L in hsl().
* **C** is chroma, from gray to the most saturated color.
* **H** is the hue angle (0-360).
* **a** is alpha or opacity (0-1 or 0-100%).

```css
p {
  color: oklch(0.31 0.2 265) /* admiral blue */;
}

.highlight {
  color: oklch(0.9 0.19 97.4 / 50%) /* yellow with 50% transparency*/
}
```

I have a table with colors from [The New Defaults](https://dudleystorey.github.io/thenewdefaults/) converted to OKLCH as part of my [Patterns](https://patterns.rivendellweb.net/components/detail/oklch-colors--default) project.

## Advantages

I see many advantages to use colors in the OKLCH space

### Defining color palettes

Rather than choosing all the colors in their palettes, they can generate palettes using [CSS relative syntax](https://developer.chrome.com/blog/css-relative-color-syntax/#opacity-as-a-variable) to generate color palettes with as many colors as necessary.

Unlike hsl(), OKLCH uses perceptual lightness, so it's far less likely that we'll get unexpected results, like we had with darken() in Sass.

### Color combinations and manip

Because we use hue as a component of the colors we use, we can modify these colors using relative color syntax to

You can create different types of palettes as shown in the [Color Wheel](https://www.canva.com/colors/color-wheel/): complementary colors,

#### Complementary Colors

Creating complementary colors is simple, add 180 to the hue value. The easiest way to do this is to use `calc()` to do the addition.

```css
.base-oklch-color {
  background: oklch(from var(--base-green) l c h);
}

.complementary-oklch-color {
  background: oklch(from var(--base-green) l c calc(h + 180));
}
```

#### Triadic Colors

Creating Triadic colors requires one more element and to break the 360 degree hue wheel into three equal parts, 0, 120 and 240.

```css
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

#### Tetradric Colors

Likewise the set of Tetradric colors require four equidistant points in the color wheel. Base at 0, 90, 180 and 270.

```css
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

### Wide gamut colors

OKLCH can be used for wide-gamut P3 colors. For instance, new devices (like those from Apple) can display more colors than old sRGB monitors, and we can use OKLCH to specify these new colors.

Not all OKLCH and LCH colors are visible in all monitors. Although browsers will try to find the closest supported color, you should use an OKLCH color picker or similar tool to get the best color for your target device.

One way to do it is to use Color.js to check if the color is in gamut for the color space that you want to work with.

```js
// define color
let lime = new Color("p3", [0, 1, 0]);
// Check if the color is in gamut for P3
lime.inGamut();
// Check if the color is in gamut for SRGB
lime.inGamut("srgb");
// Convert the color to SRGB
let sRGB_lime = lime.to("srgb");
sRGB_lime.inGamut();
```

## Color manipulation

OKLCH gives you better and easier control over color manipulation.

We saw some examples earlier when we talked about color combinations and colors in the color wheel, complimentary, triadic and tetradric colors and we'll talk more about color manipulation in a future post when we talk about relative color syntax.

## Tooling

OKLCH is a new color space. While there is support for the color space in all major browsers, the ecosystem is still limited.

* [OKLCH color picker](https://oklch.com/)
* [Palette generator](https://huetone.ardov.me/)

If you're so inclined then you can use libraries like [color.js](https://colorjs.io/) or [chroma.js](https://gka.github.io/chroma.js/) to work with OKLCH colors programmatically.

## Browser Support

Relative colors are supported in Chrome 119 and later, and Safari 16.4 and later.

See caniuse's [CSS Relative Colors](https://caniuse.com/css-relative-colors) support matrix.

Because the lack of support in Firefox, you will have to use fallbacks until Firefox catches up.

I'm researching ways to make these fallbacks available. The best bet right now seems to be a PostCSS plugin that insert these additional values.


## Coding defensively

Older versions of browsers may not support OKLCH colors. We want to make sure that we provide an equivalent fallback for those browsers.

To test if a browser supports OKLCH, we should be able to use the [@supports](https://developer.mozilla.org/docs/Web/CSS/@supports) at-rule with a rule containing the value we want to test.

This will require additional work since the default rules using eiter `rgb()` or `hex` colors needs to be defined before the media query.

Once the defaults are defined we can override them with something like this:

```css
/* Default styles in SRGB or HEX go here */

@supports (background: oklch(0% 0 0)) {
	.at-0 {
		--base-color: oklch(50% 50 0);
		color: var(--base-color);
	}

  .at-90 {
    --base-color: oklch(50% 50 90);
		color: var(--base-color);
  }

  .at-180 {
		--base-color: oklch(50% 50 180);
		color: var(--base-color);
  }

  .at-270 {
		--base-color: oklch(50% 50 270);
		color: var(--base-color);
  }
}
```

In theory, the [color-gamut](https://developer.mozilla.org/docs/Web/CSS/@media/color-gamut) media query should also give us the results we want. However, the limited number of values presents a problem: Firefox supports `display-p3` colors but does not support `OKLCH` colors (at least as of the date of this post) so none of the values available for the media query work for what we want.

If you use PostCSS in your workflow, another way to deal with the issue is to use the [PostCSS OKLab Function](https://www.npmjs.com/package/@csstools/postcss-oklab-function) plugin. This will insert the equivalent rgb and display-p3 colors before the OKLCH declaration.

In this example, the browser will look at the last value for color that it can use. If the browser doesn't support OKLCH then the value of `color` will be the rgb version.

If the browser supports both color formats then the last one written wins. **Order does matter**.

```css
a[href]:hover,
a[href]:active {
	color: rgb(205, 38, 83);
	color: oklch(55.69% 0.2 12.21);
}
```

## Why should I bother?

In [Are we there yet?](https://svgees.us/blog/colorHistory.html) Chris Lilley asks an interesting question (emphasis in the original):

> Great so what is missing? **Understanding**. Not "what syntax can I use" but "what should I do, and why; what are the trade-offs?"
>
> Source: [Are we there yet?](https://svgees.us/blog/colorHistory.html)

It's an interesting question that I hadn't stopped to think about.

## Links and References

* [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) &mdash; W3C candidate recommendation
* [9. Device-independent Colors: CIE Lab and LCH, Oklab and Oklch](https://www.w3.org/TR/css-color-4/#lab-colors) &mdash; CSS Color Module Level 4
* [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
