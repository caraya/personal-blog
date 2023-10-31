---
title: "Why we still need custom CSS In WordPress (2)"
date: "2023-02-01"
---

The previous post on why we still need custom CSS in WordPress was getting a little long so I made a second post to cover some additional features that are not available in the Gutenberg editor as of the time this post was written (December 2022).

It is also good to reiterate that these features are meant for bespoke designs or designs where the features are relevant to the design. Not all sites need alternate character sets with swatches or table numbers.

If you find yourself reaching out for these tools for every project, perhaps it's time to rethink whether Gutenberg and block themes are a good solution for you. You can still leverage WordPress as a CMS but you may be better served by using another framework for your frontend work.

## Color fonts

Color fonts are a recent addition to (some) browsers. Like audio and video formats for the web, browser vendors have not agreed on a standard format for color fonts.

For the purpose of this section, we will work with COLR/CPAL V1 fonts, supported by Chromium browsers (Chrome, Edge, Opera, and others), and Firefox. We'll also talk about fallbacks for browsers that don't support them.

To support color fonts, the CSS Fonts Level 4 specification provides tools to work with the colors inside a color font.

Each color font provides one or more color palettes that you can use. Tools like Wakmaifondue beta can help by telling you how many palettes are available to the font and how many colors are in the palettes.

In addition to the built-in color palettes, CSS provides the [@font-palette-values](https://www.w3.org/TR/css-fonts-4/#font-palette-prop) at-rule to define custom color palettes for a color font.

The [font-palette](https://www.youtube.com/watch?v=BBBXNT-eDK0) property allows developers to use one of the available color palettes, a custom palette defined with `@font-palette-values`, a palette designated as `light`, a palette designated as `dark` or a palette approaching a regular, non-color, font.

Using [Rocher Color](https://www.harbortype.com/fonts/rocher-color/), a variable color font as an example, we first see how we can set up different color palettes from those available. The `base-palette` attribute tells the browser which available palette to use.

```css
@font-palette-values --Grays {
  font-family: Rocher;
  base-palette: 9;
}

@font-palette-values --Purples {
  font-family: Rocher;
  base-palette: 6;
}

@font-palette-values --Mint {
  font-family: Rocher;
  base-palette: 7;
}
```

The possible values for font-palette are:

normal
: Specifies the default color palette or the default glyph colorization (set by the font maker) to be used for the font.
: With this setting, the palette in the font at index 0 is rendered.

light
: Specifies the first palette in the font that matches 'light' to be used for the font
: Some fonts contain metadata that identify a palette as applicable for a light (close to white) background
: If a font does not have this metadata, the light value behaves as normal.

dark
: Specifies the first palette in the font that matches 'dark' to be used for the font.
: Some fonts contain metadata that identify a palette as applicable for a dark (close to black) background.
: If a font does not have this metadata, the value behaves as normal.

&lt;palette-identifier>
: Allows you to specify your own values for the font palette by using the `@font-palette-values` at-rule
: This value is specified using the &lt;dashed-ident> format starting with two dashes, `--`. This is done to prevent name colisions.

```css
@font-palette-values --Grays {
  font-family: Rocher;
  base-palette: 9;
}

@font-palette-values --Purples {
  font-family: Rocher;
  base-palette: 6;
}

@font-palette-values --Mint {
  font-family: Rocher;
  base-palette: 7;
}

.grays {
  font-palette: --Grays;
}

.purples {
  font-palette: --Purples;
}

.mint {
  font-palette: --Mint;
}
```

You can also create your own custom color palettes for the color font you're using. The `override-colors` descriptor allows you to add a brand new color palette to the font, perhaps matching your branding colors or client guidelines.

You don't have to override all the colors in a palette. The ones that you choose not to override will come from the default palette for the font.

This will require trial and error to figure out what parts of the font are tackled by which color. The results, at least initially, can be surprising.

```css
@font-palette-values --PinkAndGray {
  font-family: rocher;
  override-colors:
    0 rebeccapurple,
    1 #ff00ff,
    2 #c1cbed,
    3 #ff3a92;
}
```

You can also override colors in a specific palette by combining `base-palette` and `override-colors` in the same `@font-palette-values` at-rule.

The `@Greens` palette will use the third palette (the listing is zero-based) and override the first color (at position `0`)

```css
@font-palette-values --Greens {
  font-family: rocher;
  base-palette: 2;
  override-colors:
    0 #F5B944;
}
```

Moderation is the key when using color fonts. Yes, they are awesome, but they can easily be misused.

Don't rely on color as the only way to convey the meaning of your content. Users with cognitive or visual impairments will thank you.

## Animations

Whether you use animation libraries like [GSAP](https://greensock.com/), the [Web Animations API](https://www.w3.org/TR/web-animations-1/) or CSS keyframe animations, you need custom code, CSS, and/or Javascript, to make them work.

Rather than rehash how CSS Keyframe animations work we'll just walk through an example. If you want more information about creating Keyframe animations in CSS, check out [Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) on MDN.

CSS animations are a two-step process.

First: add the `animation` shorthand property or any of its component rules to the element you want to animate:

The individual animation properties are:

* [animation-name](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name)
* [animation-duration](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-duration)
* [animation-timing-function](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function)
* [animation-delay](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay)
* [animation-iteration-count](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-iteration-count)
* [animation-direction](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction)
* [animation-fill-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode)
* [animation-play-state](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-play-state)

```css
.appears {
  width: 200px;
  height: 200px;
  background-color: lightblue;
  border-radius: 50%;

  animation: appears ease 4s forwards;
}
```

We then create a `@key-frames` at-rule that manages the animation. In this example, we start from 0% with an opacity of 0 (invisible, totally transparent) and end at 100% with an opacity of 1 (fully visible).

```css
@key-frames appears {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
```

We can also insert additional keyframes and play with attributes other than opacity.

I've modified the `appears` at-rule by inserting two additional steps at 25 and 75% and changing the background color on each new step.

If a given keyframe in the animation doesn't have a property that is being used elsewhere, it will use the value defined in the element or the default value. Since `background-color` does not appear in 0% and 100%, it will default to lightblue, the background-color of the element we're animating.

```css
@keyframes appears {
  0% {
    opacity: 0;
  }
  25% {
    background-color: rebeccapurple;
  }
  75% {
    background-color: pink;
  }

  100% {
    opacity: 1;
  }
}
```

There are additional features of CSS animations and many areas that can benefit from either keyframe animations or transitions in CSS.

All the font-related work discussed in the previous post, color fonts, and animations require custom CSS to work so, as much as you may or may not like it, we still need custom CSS in WordPress.
