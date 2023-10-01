---
title: "Deep Dive into color-mix()"
date: "2023-03-20"
---

One of the most interesting new CSS features coming into browsers is [color-mix()](https://developer.chrome.com/blog/css-color-mix/).

We will look at two uses of `color-mix()`:

- Mixing colors
- Lightening and darkening a color

We will also discuss some of the drawbacks of the `color-mix()` function and how it relates to `relative colors`

## Mixing Colors

It allows you to combine two colors, the percentages that we want to mix them and output the result.

The default colorspace is [oklab](https://w3c.github.io/csswg-drafts/css-color-4/#ok-lab) and we can change the color space when defining the mix.

The basic use of `color-mix()` is to actually mix the colors.

The structure of the function is as follows:

1. The color space that we want to work with
2. Two or more colors to mix, including percentages to do specific color mixes

The first example is an even 50/50 color mix between two colors.

```css
div {
  background-color: color-mix(
    in oklab,
    #04ff00,
    #00ffff 50%
  );
}
```

You can add more colors to the mix by adding additional values to the list of colors after defining the color space.

In this case we mix three colors equally.

```css
div {
  background-color: color-mix(
    in oklab,
    #04ff00,
    #336699,
    #00ffff
  );
}
```

Using two colors as examples (taken from the [Color Level 5 spec](https://www.w3.org/TR/css-color-5/#ex-mix-syntactic)) all these examples provide equivalent results

```css
.ratios-syntax-examples {
  /* omit the percentage for equal mixes */
  color: color-mix(in lch, purple, plum);
  color: color-mix(in lch, plum, purple);

  /* percentage can go on either side of the color */
  color: color-mix(in lch, purple 50%, plum 50%);
  color: color-mix(in lch, 50% purple, 50% plum);

  /* percentage on just one color? other color gets the remainder */
  color: color-mix(in lch, purple 50%, plum);
  color: color-mix(in lch, purple, plum 50%);

  /* percentages > 100% are equally clamped */
  color: color-mix(in lch, purple 80%, plum 80%);
  /* above mix is clamped to this */
  color: color-mix(in lch, purple 50%, plum 50%);
}
```

From the examples above we can derive the following rules:

- When you don't specify a ratio, the colors are equally mixed
- If only one color specifies a ratio, the other is assumed to be the remainder to 100%
- When ratios exceed 100%, they're clamped and equally distributed

### Nesting color mixes

Like all of CSS, nesting is handled well and as expected; the browser will process functions from the inside out (inner function first) and return their values to the parent context.

In the following example, browsers will treat `mix-color(red, white)` as the inner function and process it first, then pass the result to the outer function and mix it with 40% purple.

```css
color-mix(in lch, purple 40%, color-mix(red, white))
```

You can nest as much as you need to so you can get the result you're looking for.

## Lightening and darkening colors

**Warning** The color space you use matters. Different color spaces may produce different results. Test your color mixes and your lighting mixes to make sure it achieves the goals you want them to.

`color-mix()` can be used to lighten or darken colors.

The first two examples below lighten and darken colors using the lch color space, represented by `in lch` as the first attribute in the `color-mix()`.

<iframe height="300" style="width: 100%;" scrolling="no" title="Lightening colors with color-mix()" src="https://codepen.io/caraya/embed/abadwXg?default-tab=html" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/abadwXg"> Lightening colors with color-mix()</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

<iframe height="300" style="width: 100%;" scrolling="no" title="Darkening colors with color-mix()" src="https://codepen.io/caraya/embed/XWPXgGG?default-tab=html" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/XWPXgGG"> Darkening colors with color-mix()</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

While the next two examples use the oklab color space (`in oklab` as the first parameter to `color-mix()`) to lighten and darken the same two colors.

<iframe height="300" style="width: 100%;" scrolling="no" title="Lightening colors with color-mix() in oklab color space" src="https://codepen.io/caraya/embed/xxaZrMv?default-tab=html" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/xxaZrMv"> Lightening colors with color-mix() in oklab color space</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

<iframe height="300" style="width: 100%;" scrolling="no" title="Darkening colors with color-mix() in oklab color space" src="https://codepen.io/caraya/embed/wvEMqwp?default-tab=html" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/wvEMqwp"> Darkening colors with color-mix() in oklab color space</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

Particularly when darkening colors, the `lch` color runs from mint to brown to black, rather than progressively darkening the green color as I expected, and what happens in the `oklab` color space.

## Relationship to relative colors

These mixes are different than the [color relative syntax](https://w3c.github.io/csswg-drafts/css-color-5/#relative-colors) specified in the Color Level 5 specification in that color-mix doesn't allow for lightening and darkening directly. It only allows you to lighten and darken by specifying the percentage of white or black to mix with the base color.

The relative color syntax will depend on the color space you choose since each color space writes colors in different ways.
