---
title: "Expressing colors in CSS"
date: "2013-12-21"
categories: 
  - "ebook-publishing"
  - "technology"
---

As part of my research in Web Typography I got reacquainted with the many ways you can express colors in CSS. This was originally in my typography document but I think it's better if I move it out to prevent an already long document from becoming unmanageable.

## sRGB colors (3 or 6 digits)

This was what I always associted with colors in CSS and until not too long ago it was the only way to express colors. You can use either syntax but, as you can see in the example below, the 6 digit syntax allows for more precision in defining your colors.

The three definitions of a div container express the same color.

```
div {
  color: #0f0;   // The color 'lime' defined using the 3-digit hexadecimal notation
}

div {
  color: #00ff00; // The color 'lime' defined using the 6-digit hexadecimal notation
}

div {
  color: rgb(0, 255, 0) // The color 'lime' expressed with RGB notation
}
```

## RGBa colors

**This should be run behind a modernizr test as it's not widely supported**

This allows us to fill areas with transparent color; the first thee numbers representing the color in RGB values and the fourth representing a transparency value between 0 and 1 (zero being fully transparent and one being fully opaque). We have long had the opacity property, which is similar, but opacity forces all decendant elements to also become transparent and there is no way to fight it (except weird positional hacks) Cross-browser opacity is also a bit sloppy.

With RGBa, we can make a box transparent and leave its descendants alone

```
div {
   background: rgba(200, 54, 54, 0.5); 
}
```

### Declaring a fallback color

Not all browsers support RGBa, so if the design permits, you should declare a "fallback" color. This color will be most likely be solid (fully opaque). Not declaring a fallback means no color will be applied in browsers that don't support it. This fallback does fail in some really old browsers.

```
div {
   background: rgb(200, 54, 54); /* The Fallback */
   background: rgba(200, 54, 54, 0.5); 
}
```

**Table below taken from the [Mozilla Documentation Project](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value). Credited according to a [Creative Common Attribution-Share Alike License](http://creativecommons.org/licenses/by-sa/2.5/)**

### Color keywords

Color keywords are case-insensitive identifiers which represent a specific color, e.g. `red, blue, brown, lightseagreen`. The name describes the color, though it is mostly artificial. The list of accepted values varied a lot through the different specification:

- CSS Level 1 only accepted 16 basic colors, named the _VGA colors_ as they were taken from the set of displayable colors on [VGA graphic cards](http://en.wikipedia.org/wiki/VGA)
- CSS Level 2 added the `orange` keyword
- From the beginning, browsers accepted other colors, mostly the X11 named colors list as some early browsers were X11 applications, though with a few differences. SVG 1.0 was the first standard to formally define these keywords; CSS Colors Level 3 also formally defined these keywords. They are often referred as the _extended color keywords_, the _X11 colors_, the _SVG colors_

There are a few caveats to consider when using keywords:

- Except the 16 basic colors which are common with HTML, the others cannot be used in HTML. HTML will convert these unknown values with a specific algorithm which will lead to completely different colors. These keywords should only be used in SVG & CSS
- Unknown keywords make the CSS property invalid. Invalid properties being ignored, the color will have no effect. This is a different behavior than the one of HTML.
- No keyword-defined colors in CSS have any transparency, they are plain, solid colors.
- Several keywords denote the same colors:
    
    - `darkgray` / `darkgrey`
    - `darkslategray` / `darkslategrey`
    - `dimgray` / `dimgrey`
    - `lightgray` / `lightgrey`
    - `lightslategray` / `lightslategrey`
    - `gray` / `grey`
    - `slategray` / `slategray`
- Though the names of the keywords have been taken by the usual X11 color names, the color may diverge from the corresponding system color on X11 system as these are tailored for the specific hardware by the manufacturer .

table { border: 1px; color: black; } th, td { border: 1px; color: black; }

| Specifications | Color | Keyword | RGB cubic coordinates | Live Example |
| --- | --- | --- | --- | --- |
| CSS3 | CSS2 | CSS1 |   | `black` | `rgb(  0,   0,   0)` |   |
|   | `silver` | `rgb(192, 192, 192)` |   |
|   | `gray`[\[\*\]](#1 "color_value#1") | `rgb(128, 128, 128)` |   |
|   | `white` | `rgb(255, 255, 255)` |   |
|   | `maroon` | `rgb(128,   0,   0)` |   |
|   | `red` | `rgb(255,   0,   0)` |   |
|   | `purple` | `rgb(128,   0, 128)` |   |
|   | `fuchsia` | `rgb(255,   0, 255)` |   |
|   | `green` | `rgb(  0, 128,   0)` |   |
|   | `lime` | `rgb(  0, 255,   0)` |   |
|   | `olive` | `rgb(128, 128,   0)` |   |
|   | `yellow` | `rgb(255, 255,   0)` |   |
|   | `navy` | `rgb(  0,   0, 128)` |   |
|   | `blue` | `rgb(  0,   0, 255)` |   |
|   | `teal` | `rgb(  0, 128, 128)` |   |
|   | `aqua` | `rgb(  0, 255, 255)` |   |
|   |   | `orange` | `rgb(255, 165,   0)` |   |
|   |   | `aliceblue` | `rgb(240, 248, 255)` |   |
|   | `antiquewhite` | `rgb(250, 235, 215)` |   |
|   | `aquamarine` | `rgb(127, 255, 212)` |   |
|   | `azure` | `rgb(240, 255, 255)` |   |
|   | `beige` | `rgb(245, 245, 220)` |   |
|   | `bisque` | `rgb(255, 228, 196)` |   |
|   | `blanchedalmond` | `rgb(255, 235, 205)` |   |
|   | `blueviolet` | `rgb(138,  43, 226)` |   |
|   | `brown` | `rgb(165,  42,  42)` |   |
|   | `burlywood` | `rgb(222, 184, 135)` |   |
|   | `cadetblue` | `rgb( 95, 158, 160)` |   |
|   | `chartreuse` | `rgb(127, 255,   0)` |   |
|   | `chocolate` | `rgb(210, 105,  30)` |   |
|   | `coral` | `rgb(255, 127,  80)` |   |
|   | `cornflowerblue` | `rgb(100, 149, 237)` |   |
|   | `cornsilk` | `rgb(255, 248, 220)` |   |
|   | `crimson` | `rgb(220,  20,  60)` |   |
|   | `darkblue` | `rgb(  0,   0, 139)` |   |
|   | `darkcyan` | `rgb(  0, 139, 139)` |   |
|   | `darkgoldenrod` | `rgb(184, 134,  11)` |   |
|   | `darkgray`[\[\*\]](#1 "color_value#1") | `rgb(169, 169, 169)` |   |
|   | `darkgreen` | `rgb(  0, 100,   0)` |   |
|   | `darkgrey`[\[\*\]](#1 "color_value#1") | `rgb(169, 169, 169)` |   |
|   | `darkkhaki` | `rgb(189, 183, 107)` |   |
|   | `darkmagenta` | `rgb(139,   0, 139)` |   |
|   | `darkolivegreen` | `rgb( 85, 107,  47)` |   |
|   | `darkorange` | `rgb(255, 140,   0)` |   |
|   | `darkorchid` | `rgb(153,  50, 204)` |   |
|   | `darkred` | `rgb(139,   0,   0)` |   |
|   | `darksalmon` | `rgb(233, 150, 122)` |   |
|   | `darkseagreen` | `rgb(143, 188, 143)` |   |
|   | `darkslateblue` | `rgb( 72,  61, 139)` |   |
|   | `darkslategray`[\[\*\]](#1 "color_value#1") | `rgb( 47,  79,  79)` |   |
|   | `darkslategrey`[\[\*\]](#1 "color_value#1") | `rgb( 47,  79,  79)` |   |
|   | `darkturquoise` | `rgb(  0, 206, 209)` |   |
|   | `darkviolet` | `rgb(148,   0, 211)` |   |
|   | `deeppink` | `rgb(255,  20, 147)` |   |
|   | `deepskyblue` | `rgb(  0, 191, 255)` |   |
|   | `dimgray`[\[\*\]](#1 "color_value#1") | `rgb(105, 105, 105)` |   |
|   | `dimgrey`[\[\*\]](#1 "color_value#1") | `rgb(105, 105, 105)` |   |
|   | `dodgerblue` | `rgb( 30, 144, 255)` |   |
|   | `firebrick` | `rgb(178,  34,  34)` |   |
|   | `floralwhite` | `rgb(255, 250, 240)` |   |
|   | `forestgreen` | `rgb( 34, 139,  34)` |   |
|   | `gainsboro` | `rgb(220, 220, 220)` |   |
|   | `ghostwhite` | `rgb(248, 248, 255)` |   |
|   | `gold` | `rgb(255, 215,   0)` |   |
|   | `goldenrod` | `rgb(218, 165,  32)` |   |
|   | `greenyellow` | `rgb(173, 255,  47)` |   |
|   | `grey` | `rgb(128, 128, 128)` |   |
|   | `honeydew` | `rgb(240, 255, 240)` |   |
|   | `hotpink` | `rgb(255, 105, 180)` |   |
|   | `indianred` | `rgb(205,  92,  92)` |   |
|   | `indigo` | `rgb( 75,   0, 130)` |   |
|   | `ivory` | `rgb(255, 255, 240)` |   |
|   | `khaki` | `rgb(240, 230, 140)` |   |
|   | `lavender` | `rgb(230, 230, 250)` |   |
|   | `lavenderblush` | `rgb(255, 240, 245)` |   |
|   | `lawngreen` | `rgb(124, 252, 0)` |   |
|   | `lemonchiffon` | `rgb(255, 250, 205)` |   |
|   | `lightblue` | `rgb(173, 216, 230)` |   |
|   | `lightcoral` | `rgb(240, 128, 128)` |   |
|   | `lightcyan` | `rgb(224, 255, 255)` |   |
|   | `lightgoldenrodyellow` | `rgb(250, 250, 210)` |   |
|   | `lightgray`[\[\*\]](#1 "color_value#1") | `rgb(211, 211, 211)` |   |
|   | `lightgreen` | `rgb(144, 238, 144)` |   |
|   | `lightgrey`[\[\*\]](#1 "color_value#1") | `rgb(211, 211, 211)` |   |
|   | `lightpink` | `rgb(255, 182, 193)` |   |
|   | `lightsalmon` | `rgb(255, 160, 122)` |   |
|   | `lightseagreen` | `rgb( 32, 178, 170)` |   |
|   | `lightskyblue` | `rgb(135, 206, 250)` |   |
|   | `lightslategray`[\[\*\]](#1 "color_value#1") | `rgb(119, 136, 153)` |   |
|   | `lightslategrey`[\[\*\]](#1 "color_value#1") | `rgb(119, 136, 153)` |   |
|   | `lightsteelblue` | `rgb(176, 196, 222)` |   |
|   | `lightyellow` | `rgb(255, 255, 224)` |   |
|   | `limegreen` | `rgb( 50, 205,  50)` |   |
|   | `linen` | `rgb(250, 240, 230)` |   |
|   | `mediumaquamarine` | `rgb(102, 205, 170)` |   |
|   | `mediumblue` | `rgb(  0,   0, 205)` |   |
|   | `mediumorchid` | `rgb(186,  85, 211)` |   |
|   | `mediumpurple` | `rgb(147, 112, 219)` |   |
|   | `mediumseagreen` | `rgb( 60, 179, 113)` |   |
|   | `mediumslateblue` | `rgb(123, 104, 238)` |   |
|   | `mediumspringgreen` | `rgb(  0, 250, 154)` |   |
|   | `mediumturquoise` | `rgb( 72, 209, 204)` |   |
|   | `mediumvioletred` | `rgb(199,  21, 133)` |   |
|   | `midnightblue` | `rgb( 25,  25, 112)` |   |
|   | `mintcream` | `rgb(245, 255, 250)` |   |
|   | `mistyrose` | `rgb(255, 228, 225)` |   |
|   | `moccasin` | `rgb(255, 228, 181)` |   |
|   | `navajowhite` | `rgb(255, 222, 173)` |   |
|   | `oldlace` | `rgb(253, 245, 230)` |   |
|   | `olivedrab` | `rgb(107, 142,  35)` |   |
|   | `orangered` | `rgb(255,  69,   0)` |   |
|   | `orchid` | `rgb(218, 112, 214)` |   |
|   | `palegoldenrod` | `rgb(238, 232, 170)` |   |
|   | `palegreen` | `rgb(152, 251, 152)` |   |
|   | `paleturquoise` | `rgb(175, 238, 238)` |   |
|   | `palevioletred` | `rgb(219, 112, 147)` |   |
|   | `papayawhip` | `rgb(255, 239, 213)` |   |
|   | `peachpuff` | `rgb(255, 218, 185)` |   |
|   | `peru` | `rgb(205, 133,  63)` |   |
|   | `pink` | `rgb(255, 192, 203)` |   |
|   | `plum` | `rgb(221, 160, 221)` |   |
|   | `powderblue` | `rgb(176, 224, 230)` |   |
|   | `rosybrown` | `rgb(188, 143, 143)` |   |
|   | `royalblue` | `rgb( 65, 105, 225)` |   |
|   | `saddlebrown` | `rgb(139,  69,  19)` |   |
|   | `salmon` | `rgb(250, 128, 114)` |   |
|   | `sandybrown` | `rgb(244, 164,  96)` |   |
|   | `seagreen` | `rgb( 46, 139,  87)` |   |
|   | `seashell` | `rgb(255, 245, 238)` |   |
|   | `sienna` | `rgb(160,  82,  45)` |   |
|   | `skyblue` | `rgb(135, 206, 235)` |   |
|   | `slateblue` | `rgb(106,  90, 205)` |   |
|   | `slategray`[\[\*\]](#1 "color_value#1") | `rgb(112, 128, 144)` |   |
|   | `slategrey`[\[\*\]](#1 "color_value#1") | `rgb(112, 128, 144)` |   |
|   | `snow` | `rgb(255, 250, 250)` |   |
|   | `springgreen` | `rgb(  0, 255, 127)` |   |
|   | `steelblue` | `rgb( 70, 130, 180)` |   |
|   | `tan` | `rgb(210, 180, 140)` |   |
|   | `thistle` | `rgb(216, 191, 216)` |   |
|   | `tomato` | `rgb(255,  99,  71)` |   |
|   | `turquoise` | `rgb( 64, 224, 208)` |   |
|   | `violet` | `rgb(238, 130, 238)` |   |
|   | `wheat` | `rgb(245, 222, 179)` |   |
|   | `whitesmoke` | `rgb(245, 245, 245)` |   |
|   | `yellowgreen` | `rgb(154, 205,  50)` |   |

\[\*\] The 'e'-grey colors (with an e) (`grey`, `darkgrey`, `darkslategrey`, `dimgrey`, `lightgrey`, `lightslategrey`) are only supported since IE 8.0. IE 3 to IE 6 only support the 'a' variants: `gray`, `darkgray`, `darkslategray`, `dimgray`, `lightgray`, `lightslategray`.

See the Mozilla Documentation Project [CSS Color](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) page for more information.

## HSLa colors

_This needs to be used behind a modernizr test, it is not fully supported_

Using HSLa is similar to RGBa in that you declare three values determining the color and then a fourth value for its transparency level. You can read more about browser support below, but it's basically any browser that supports rgba supports hsla too.

```
#some-element {
   background-color: hsla(170, 50%, 45%, 1);
}
```

- **Hue** Think of a color wheel. Around 0o and 360o are reds 120o are greens, 240o are blues. Use anything in between 0-360. Values above and below will be modulus 360
- **Saturation** 0% is grayscale. 100% is fully saturated (full color)
- **Lightness** 0% is completely dark (black). 100% is completely light (white). 50% is average lightness
- **alpha** Opacity/Transparency value. 0 is fully transparent. 1 is fully opaque. 0.5 is 50% transparent.
