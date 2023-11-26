---
title: "Animating Variable Fonts (2023)"
date: 2024-01-01
tags:
  - CSS
  - Explorations
---

One thing I particularly like about variable fonts is that it allows some interesting animation tricks.

For example, since variable fonts have information about all possible variations of the font, we can animate discreete values, like weight or italics.

There are two things we can do with font animations.

* We can use native CSS to animate changes to the full word or phrase that we want to animate
* We can use a library like [Splitting](https://splitting.js.org/) to break the content into letters or words and then animate each unit of content individually

## Animating blocks of text

The easiest thing to do is to animate entire blocks of text as a unit. We can do this with CSS alone and now dependencies.

We first load the font using [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face).

We specify that we're loading a WOFF2 variable font by using `format("woff2")` and `tech(variations)`.

`font-swap` determines how a font face is displayed based on whether and when it is downloaded and ready to use.

`font-weight` specifies both a lower and upper boundaries for the font-weight attribute.

`unicode-range` specifies the range of [Unicode code points](https://developer.mozilla.org/en-US/docs/Glossary/Code_point) supported in the font.

```css
@font-face {
  font-family: "Recursive";
  src: url("https://assets.codepen.io/32795/recursive.woff2") format("woff2")
    tech(variations);
  font-display: swap;
  font-weight: 300 1000;
  unicode-range: U+000D, U+0020-007E, U+00A0-00FF, U+0131, U+0152-0153,
    U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2007-200B, U+2010, U+2012-2015,
    U+2018-201A, U+201C-201E, U+2020-2022, U+2026, U+2030, U+2032-2033,
    U+2039-203A, U+203E, U+2044, U+2052, U+2074, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215;
}
```

We then format the base element, in this case a `span`. The imporant part is that we set the animation parameters that we want the element to use. These parameters include:

* animation name (`weight`)
* duration (`4s`)
* direction (`alternate`)
* number of repetitions (`infinite`)

```css
span {
  font-size: 10rem;
  color: rebeccapurple;
  animation: weight 4s alternate infinite;
}
```

We then define the keyframe animation that we want to use.

```css
@keyframes weight {
  from {
    font-weight: 300;
  }

  50% {
    font-weight: 900;
  }

  to {
    font-weight: 300;
  }
}
```

## Animating individual characters

```html
<script src="https://unpkg.com/splitting/dist/splitting.js"></script>
```

```css
@import url("https://unpkg.com/splitting/dist/splitting.css");

@font-face {
  font-family: "Recursive";
  src: url("https://assets.codepen.io/32795/recursive.woff2") format("woff2")
    tech(variations);
  font-display: swap;
  font-weight: 300 1000;
  unicode-range: U+000D, U+0020-007E, U+00A0-00FF, U+0131, U+0152-0153,
    U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2007-200B, U+2010, U+2012-2015,
    U+2018-201A, U+201C-201E, U+2020-2022, U+2026, U+2030, U+2032-2033,
    U+2039-203A, U+203E, U+2044, U+2052, U+2074, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215;
}
```

```css
span {
  font-size: 10rem;
  color: rebeccapurple;
  animation: weight 4s infinite;
  animation-delay: calc(var(--char-index) * 150ms);
}
```

```css
@keyframes weight {
  from {
    font-weight: 300;
  }

  50% {
    font-weight: 900;
  }

  to {
    font-weight: 300;
  }
}
```
