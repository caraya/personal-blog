---
title: "Loading fonts on the web"
date: "2023-08-09"
---

It surprising to me that we still need to discuss font loading on the web after how long we've been able to load fonts using `@font-face`.

Before we jump in let's do a brief trip down font loading memory lane.

In the beginning we didn't have web fonts. We had to rely on web safe fonts that were guaranteed to be installed on most systems.

CSS first introduced `@font-face` in 1998 but it faltered becaue, at the time, it did not providem any level of protection so font foundries were reluctant to let users load their fonts with `@font-face` so the technology lay dormant for years. There was also an issue of browser support; only Internet Explorer supported `@font-face` along with the proprietary Embedded Open Type font format.

The next big step happens in 2008 when Mozilla and Apple implemented `@font-face` in their browsers.

There are two additonal events we need to be aware of as they relate to web fonts.

In 2009 Jeffrey Veen introduced [TypeKit](https://web.archive.org/web/20100813025539/http://typekit.com/) (via WayBack Machine) a font hosting service that addressed a lot of the issues foundries had with donwloadble web fonts. In 2010 the service was acquired by Adobe, it is now called Adobe Fonts and a part of Creative Cloud.

In 2010 Google introduced [Google Fonts](https://fonts.google.com/), an open source library of Web Fonts both created by Google and from other developers and foundries.

Google provides both an API to load the font from Google servers and downloads for you to run from your own server. In 2022, [a court in Hamburg, Germany fined a website for using Google Fonts](https://www.theregister.com/2022/01/31/website_fine_google_fonts_gdpr/) since it collected IP addresses without the user's consent. In light of this ruling, Google no longer makes links available. If you want to use a font in the library, you must download it and use it locally, with all the potential performance issues attached to it.

For more information see [Brief History of Webfonts](https://www.typotheque.com/articles/brief-history-of-webfonts)

Another issue that may impact how we prepare and load web fonts is variable fonts.

On September 14, 2016, Adobe, Apple, Google, and Microsoft joined forces to introduce variable fonts at the ATypI conference in Warsaw, Poland.

Variable fonts provide diferent axes that give you fine grained control over your site's typography. These axes can be traditional typographical elements like weight, width, optical sizing, or slant. Or they can be fully custom axes to control additional aspects of a font.

![](https://publishing-project.rivendellweb.net/wp-content/uploads/2023/07/wakamaifondue-variable-font-axes.png)

List of Roboto Variable Font axes, both default and custom

For more information about variable fonts see [Introducing variable fonts](https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts)

## Before we load the font

Before we load the fonts, we need to figure out what formats to use for the fonts we want to use.

### Format selection

When we first got to work with web fonts, we got a syntax like this:

```css
@font-face {
  font-family: 'MyFontFamily';
  src:
    url('myfont-webfont.eot?#iefix') format('embedded-opentype'),
    url('myfont-webfont.woff') format('woff'),
    url('myfont-webfont.ttf')  format('truetype'),
    url('myfont-webfont.svg#svgFontName') format('svg');
}
```

This combination would cover all browsers then in the market.

What formats to use has been simplified in recent years. Most current browsers support either WOFF or WOFF2 formats so the declaration looks like this:

```css
@font-face {
  font-family: 'MyFontFamily';
  src:
    url('myfont-webfont.woff2') format('woff2'),
    url('myfont-webfont.woff') format('woff')
}
```

In either case the order of the fonts matter. The browser will check each URL in order and will stop on the first match and not process any further.

Zach Leat discusses `@font-face` syntax and why it's ok not to cover everyone in [No @font-face syntax will ever be bulletproof, nor should it be](https://www.zachleat.com/web/retire-bulletproof-syntax/)

### Subsetting

Subsetting is the practice of creating a smaller subset of a font with a custom (and usually limited) collection of glyphs.

There are several possible reasons why we'd want to create font subsets:

1. When a developer wishes to strip unrequired languages from a web font
2. When a font delivery service wishes to optimize the file size of a web font
3. When a foundry wishes to offer a limited character set as a trial font
4. When a foundry (or designer) wishes to distribute a collection of glyphs for a specifics use
5. When a foundry wishes to create a customized collection of custom glyphs for a client.

Since I'm not a foundry, I will worry about cases 1 and 2 because I am delivering font to my users.

One last item before we get into code. Because I'm using this font in a WordPress setting I can't subset to specific glyphs since not all content is visible on the page at the same time and I wouldn't be able to use Glyphhanger's spider to crawl the site since most of the text will be in a database.

[glyphanger](https://github.com/zachleat/glyphhanger#readme) creates these font subsets.

I won't go into details of how to use Glyphhanger, I discussed the process in [Font formats for the web and converting from one to another](https://publishing-project.rivendellweb.net/font-formats-for-the-web-and-converting-from-one-to-another/).

The command to create a subset using only Latin glyphs looks like this:

```bash
glyphhanger --latin \
--subset=OpenSans-VariableFont.woff2  \
--formats=woff-zopfli,woff2
```

## Loading the font: `@font-face`

We've create the font subset that we want to use, we'll now load the font in our CSS.

The most basic declaration will load the font with default values for all other descriptors

```css
@font-face {
  font-family: 'Open Sans';
  src:
    url('OpenSans-VariableFont.woff2') format('woff2'),
    url('OpenSans-VariableFont.woff') format('woff')
}
```

We'll look at the other descriptors in `@font-face` declarations

### font-family

The `font-family` descriptor specifies the name of the font we are loading. It will be used as the font face value for font properties.

### src

The `src` descriptor specifies `local` or `url` attributes pointing to different formats for the font we want to use.

The order you specify the formats matters. The browser will load the first available font and ignore any further `src` descriptors.

### font-weight, font-width, font-stretch

These attributes control weight, stretch (width), and italic styles and are equivalent to CSS attributes.

**font-weight**

A font-weight value. Accepts one value (for non variable fonts) and two values to specify a range that is supported by a variable font, for example `font-weight: 100 900;`

**font-stretch**

A font-stretch value. Accepts one value (for non variable fonts) and two values to specify a range that is supported by a variable font, for example `font-stretch: 50% 200%;`

**font-style**

A font-style value. Accepts one value (for non variable fonts) and two values to specify a range that is supported by a variable font, for example `font-style: oblique 20deg 50deg;`

### font-display

Determines how a font face is displayed based on whether and when it is downloaded and ready to use.

### ascent-override, descent-override, line-gap-override

The override descriptors are mostly useful to help better match fallback fonts with the primary font to reduce or eliminate layout shift due to font size differences.

**ascent-override**

Defines the ascent metric for the font. The ascent metric is the height above the baseline that CSS uses to lay out line boxes in an inline formatting context.

**descent-override**

Defines the descent metric for the font. The descent metric is the height below the baseline that CSS uses to lay out line boxes in an inline formatting context.

**line-gap-override**

defines the line-gap metric for the font. The line-gap metric is the font recommended line-gap or external leading.

### font-feature-settings

`font-feature-settings` provides a low-level mechanism to control the font's OpenTupe features.

Whenever you use this descriptor you will have to update all the values, even those thare are unchanged.

To make this more flexible and slightly less tedious, we can use CSS variables to set all the OpenType layout feature to their off value in the `:root` element and then create classes to enable the feature when needed.

Whenever we apply a class for an OpenType feature, we update all the other classes make sure that only the changes we want are reflected on the page.

Where supported we also take advantage of [font-variant-\*](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant) properties.

The example below was generate for OpenSans Variable using the beta version of [Wakmaifondue](https://wakamaifondue.com/beta/)

```css
:root {
    --open-sans-regular-aalt: "aalt" off;
    --open-sans-regular-dnom: "dnom" off;
    --open-sans-regular-frac: "frac" off;
    --open-sans-regular-lnum: "lnum" off;
    --open-sans-regular-numr: "numr" off;
    --open-sans-regular-onum: "onum" off;
    --open-sans-regular-ordn: "ordn" off;
    --open-sans-regular-pnum: "pnum" off;
    --open-sans-regular-salt: "salt" off;
    --open-sans-regular-ss01: "ss01" off;
    --open-sans-regular-ss02: "ss02" off;
    --open-sans-regular-ss03: "ss03" off;
    --open-sans-regular-ss04: "ss04" off;
    --open-sans-regular-subs: "subs" off;
    --open-sans-regular-sups: "sups" off;
    --open-sans-regular-tnum: "tnum" off;
    --open-sans-regular-zero: "zero" off;
}

.open-sans-regular-aalt {
    --open-sans-regular-aalt: "aalt" on;
}

.open-sans-regular-dnom {
    --open-sans-regular-dnom: "dnom" on;
}

.open-sans-regular-frac {
    --open-sans-regular-frac: "frac" on;
}

@supports (font-variant-numeric: diagonal-fractions) {
    .open-sans-regular-frac {
        --open-sans-regular-frac: "____";
        font-variant-numeric: diagonal-fractions;
    }
}

.open-sans-regular-lnum {
    --open-sans-regular-lnum: "lnum" on;
}

@supports (font-variant-numeric: lining-nums) {
    .open-sans-regular-lnum {
        --open-sans-regular-lnum: "____";
        font-variant-numeric: lining-nums;
    }
}

.open-sans-regular-numr {
    --open-sans-regular-numr: "numr" on;
}

.open-sans-regular-onum {
    --open-sans-regular-onum: "onum" on;
}

@supports (font-variant-numeric: oldstyle-nums) {
    .open-sans-regular-onum {
        --open-sans-regular-onum: "____";
        font-variant-numeric: oldstyle-nums;
    }
}

.open-sans-regular-ordn {
    --open-sans-regular-ordn: "ordn" on;
}

@supports (font-variant-numeric: ordinal) {
    .open-sans-regular-ordn {
        --open-sans-regular-ordn: "____";
        font-variant-numeric: ordinal;
    }
}

.open-sans-regular-pnum {
    --open-sans-regular-pnum: "pnum" on;
}

@supports (font-variant-numeric: proportional-nums) {
    .open-sans-regular-pnum {
        --open-sans-regular-pnum: "____";
        font-variant-numeric: proportional-nums;
    }
}

.open-sans-regular-salt {
    --open-sans-regular-salt: "salt" on;
}

.open-sans-regular-ss01 {
    --open-sans-regular-ss01: "ss01" on;
}

.open-sans-regular-ss02 {
    --open-sans-regular-ss02: "ss02" on;
}

.open-sans-regular-ss03 {
    --open-sans-regular-ss03: "ss03" on;
}

.open-sans-regular-ss04 {
    --open-sans-regular-ss04: "ss04" on;
}

.open-sans-regular-subs {
    --open-sans-regular-subs: "subs" on;
}

@supports (font-variant-position: sub) {
    .open-sans-regular-subs {
        --open-sans-regular-subs: "____";
        font-variant-position: sub;
    }
}

.open-sans-regular-sups {
    --open-sans-regular-sups: "sups" on;
}

@supports (font-variant-position: super) {
    .open-sans-regular-sups {
        --open-sans-regular-sups: "____";
        font-variant-position: super;
    }
}

.open-sans-regular-tnum {
    --open-sans-regular-tnum: "tnum" on;
}

@supports (font-variant-numeric: tabular-nums) {
    .open-sans-regular-tnum {
        --open-sans-regular-tnum: "____";
        font-variant-numeric: tabular-nums;
    }
}

.open-sans-regular-zero {
    --open-sans-regular-zero: "zero" on;
}

@supports (font-variant-numeric: slashed-zero) {
    .open-sans-regular-zero {
        --open-sans-regular-zero: "____";
        font-variant-numeric: slashed-zero;
    }
}

.open-sans-regular-aalt,
.open-sans-regular-dnom,
.open-sans-regular-frac,
.open-sans-regular-lnum,
.open-sans-regular-numr,
.open-sans-regular-onum,
.open-sans-regular-ordn,
.open-sans-regular-pnum,
.open-sans-regular-salt,
.open-sans-regular-ss01,
.open-sans-regular-ss02,
.open-sans-regular-ss03,
.open-sans-regular-ss04,
.open-sans-regular-subs,
.open-sans-regular-sups,
.open-sans-regular-tnum,
.open-sans-regular-zero {
  font-feature-settings: var(--open-sans-regular-aalt), var(--open-sans-regular-dnom), var(--open-sans-regular-frac), var(--open-sans-regular-lnum), var(--open-sans-regular-numr), var(--open-sans-regular-onum), var(--open-sans-regular-ordn), var(--open-sans-regular-pnum), var(--open-sans-regular-salt), var(--open-sans-regular-ss01), var(--open-sans-regular-ss02), var(--open-sans-regular-ss03), var(--open-sans-regular-ss04), var(--open-sans-regular-subs), var(--open-sans-regular-sups), var(--open-sans-regular-tnum), var(--open-sans-regular-zero);
}
```

### font-variation-settings

`font-variation-settings` is the low-level way to control font variations, if they are available for your font.

These low-level features have different levels of support so we come down to the lower level to make sure these features work across browsers.

Like we did with font-feature-settings, we need to prevent unxpected results as outlined in [Boiling eggs and fixing the variable font inheritance problem](https://pixelambacht.nl/2019/fixing-variable-font-inheritance/).

Each class represents a named instance in the OpenSans variable font.

This code was generated with the Beta version of [Wakamaifondue](https://wakamaifondue.com)

```css
.open-sans-regular-light {
  font-variation-settings: "wght" 300, "wdth" 100;
}

.open-sans-regular-regular {
  font-variation-settings: "wght" 400, "wdth" 100;
}

.open-sans-regular-semibold {
  font-variation-settings: "wght" 600, "wdth" 100;
}

.open-sans-regular-bold {
  font-variation-settings: "wght" 700, "wdth" 100;
}

.open-sans-regular-extrabold {
  font-variation-settings: "wght" 800, "wdth" 100;
}

.open-sans-regular-condensed-light {
  font-variation-settings: "wght" 300, "wdth" 75;
}

.open-sans-regular-condensed-regular {
  font-variation-settings: "wght" 400, "wdth" 75;
}

.open-sans-regular-condensed-semibold {
  font-variation-settings: "wght" 600, "wdth" 75;
}

.open-sans-regular-condensed-bold {
  font-variation-settings: "wght" 700, "wdth" 75;
}

.open-sans-regular-condensed-extrabold {
  font-variation-settings: "wght" 800, "wdth" 75;
}
```

### size-adjust

The `size-adjust` descriptor defines a multiplier for glyph outlines and metrics associated with this font.

The `size-adjust` descriptor behaves in a similar fashion to the `font-size-adjust` property. It calculates an adjustment per font by matching x-heights. This makes it easier to harmonize the designs of various fonts when rendered at the same font size.

### Unicode range

This is the little brother to font subsetting. The `unicode-range` descriptor sets the specific range of characters to be used from a font defined using the `@font-face` at-rule.

This will not create a subset like we did with Glyphhanger, but control whether the font is downloaded ot not. If the page doesn't use any character in this range, the font is not downloaded; if it uses at least one, the whole font is downloaded.

## Browser support

Support is good. According to caniuse.com, all browsers except Opera Mini support the technology.

![](https://publishing-project.rivendellweb.net/wp-content/uploads/2023/07/caniuse-web-fonts.webp)

Caniuse @font-face browser support

This post has skipped some additional things that we can use to load fonts faster. Things like preloading the font or, maybe, using a service worker to cache the font files, are outside the `@font-face` loading process.
