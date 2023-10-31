---
title: "Why we still need custom CSS In WordPress (1)"
date: "2023-01-30"
---

Since the release of Gutenberg as the content editor, and now full site experiences, WordPress has moved to using default styles and the `theme.json` configuration to manage styles for your theme.

There are times when this is not enough since there are things that you can't do in the editor.

If you're working on bespoke sites or sites using animations and specific font features you will need finer control than what the editor provides.

The post will cover some of these areas and why using CSS (or Javascript) is the better solution.

## OpenType Features

OpenType fonts provide a series of features to enhance the looks of the font on the page.

CSS has two mechanisms to use these features in your code. The first one is to use `font-variant-*` descriptors individually or via the [font-variant](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant) shorthand for the following long-hand properties:

* [font-variant-alternates](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates)
* [font-variant-caps](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-caps)
* [font-variant-east-asian](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-east-asian)
* [font-variant-emoji](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-emoji)
* [font-variant-ligatures](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-ligatures)
* [font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
* [font-variant-position](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-position)

The table below shows the OpenType font feature and the `font-variant` descriptor and value combination used in CSS.

| font feature | `font-variant-*` descriptor/value | Notes |
| --- | --- | --- |
| Kerning (kern) or Vertical Kerning (vkrn) | font-kerning: normal | The font-kerning property will set the kern or vkrn feature depending on the writing mode. |
| Standard Ligatures (liga) or Contextual Ligatures (clig) | font-variant-ligatures: common-ligatures |   |
| Discretionary Ligatures (dlig) | font-variant-ligatures: discretionary-ligatures |   |
| Historical Ligatures (hlig) | font-variant-ligatures: historical-ligatures |   |
| Contextual Alternates (calt) | font-variant-ligatures: contextual |   |
| Subscript (subs) | font-variant-position: sub |   |
| Superscript (sups) | font-variant-position: super |   |
| Small Capitals (smcp) | font-variant-caps: small-caps |   |
| Small Capitals From Capitals (c2sc) | font-variant-caps: all-small-caps |   |
| Petite Capitals (pcap) | font-variant-caps: petite-caps |   |
| Petite Capitals From Capitals (c2pc) | font-variant-caps: all-petite-caps |   |
| Unicase (unic) | font-variant-caps: unicase |   |
| Titling (titl) | font-variant-caps: titling-caps |   |
| Lining Figures (lnum) | font-variant-numeric: lining-nums |   |
| Oldstyle Figures (onum) | font-variant-numeric: oldstyle-nums |   |
| Proportional Figures (pnum) | font-variant-numeric: proportional-nums |   |
| Tabular Figures (tnum) | font-variant-numeric: tabular-nums |   |
| Fractions (frac) | font-variant-numeric: diagonal-fractions |   |
| Alternative Fractions (afrc) | font-variant-numeric: stacked-fractions |   |
| Ordinals (ordn) | font-variant-numeric: ordinal |   |
| Slashed Zero (zero) | font-variant-numeric: slashed-zero |   |
| Historical Forms (hist) | font-variant-alternates: historical-forms |   |
| Stylistic Alternates (salt) | font-variant-alternates: stylistic() | Define which alternate gets used by making an @font-feature-values rule |
| Character Variant 1 * Character Variant 99 (cv01 * cv99) | font-variant-alternates: character-variant() | Define which character variant gets used by making an @font-feature-values rule |
| Swash (swsh) or Contextual Swash (cswh) | font-variant-alternates: swash() | Define which swash gets used by making an @font-feature-values rule |
| Ornaments (ornm) | font-variant-alternates: ornaments() | Define which ornament gets used by making an @font-feature-values rule |
| Alternate Annotation Forms (nalt) | font-variant-alternates: annotation() | Define which annotation gets used by making an @font-feature-values rule |
| JIS78 Forms (jp78) | font-variant-east-asian: jis78 |   |
| JIS83 Forms (jp83) | font-variant-east-asian: jis83 |   |
| JIS90 Forms (jp90) | font-variant-east-asian: jis90 |   |
| JIS2004 Forms (jp04) | font-variant-east-asian: jis04 |   |
| Simplified Forms (smpl) | font-variant-east-asian: simplified |   |
| Traditional Forms (trad) | font-variant-east-asian: traditional |   |
| Full Widths (fwid) | font-variant-east-asian: full-width |   |
| Proportional Widths (pwid) | font-variant-east-asian: proportional-width |   |
| Ruby Notation Forms (ruby) | font-variant-east-asian: ruby |   |

Note that not all browsers support all font-variant descriptors. Check [caniuse.com](https://caniuse.com/?search=font-variant) for updated information.

A second, lower level, means to use `font-feature-settings` to control all OpenType-related features for the font. This is meant as a workaround for when we need access to specific features that may or may not be available via `font-variant` descriptors.

There are drawbacks to using this lower-level descriptor.

1. `font-feature-settings` doesn't cascade. If you change one of the values then you need to set all the values you're using, even if they don't change. The higher-level properties cascade individually. You can set one without setting the whole `font-feature-settings` list
2. Some higher-level properties can be synthesized for fonts that do not support the font feature.

The CSS engine in WordPress supports either `font-variant-*` or `font-feature-settings` so you have to add them in your own custom CSS stylesheets.

Tools like [wakamaifondue](https://wakamaifondue.com/beta/) produce CSS stylesheets that handle both `font-feature-settings` and `font-variation-settings` (discussed in the next section).

The following example is the CSS stylesheet Wakamaifondue Beta produced for the [Pacifico](https://fonts.google.com/specimen/Pacifico?category=Handwriting) font.

```css
@font-face {
    font-family: "Pacifico Regular";
    src: url("Pacifico-Regular.ttf");
    unicode-range: U+0000, U+000D, U+0020-007E, U+00A0-0131, U+0134-017E,
    U+018F, U+0192, U+01A0-01A1, U+01AF-01B0, U+01C4-01CC, U+01E6-01E7,
    U+01EA-01EB, U+01FA-021B, U+022A-022D, U+0230-0233, U+0237, U+0259,
    U+02BC, U+02C6-02C7, U+02C9, U+02D8-02DD, U+0300-0304, U+0306-030C,
    U+030F, U+0311-0312, U+031B, U+0323-0324, U+0326-0328, U+032E, U+0331,U+0394, U+03A9, U+03BC, U+03C0,
		U+0400-045F, U+0462-0463, U+046A-046B,
    U+0472-0475, U+048A-04A5, U+04A8-04FF, U+0510-0513, U+051A-051D, U+0524-0529,
		U+052E-052F, U+1E80-1E85, U+1E9E, U+1EA0-1EF9, U+2013-2014, U+2018-201A,
		U+201C-201E, U+2020-2022, U+2026, U+2030, U+2039-203A, U+2044, U+2074,
		U+20A1, U+20A3-20A4, U+20A6-20A7,
		U+20A9, U+20AB-20AE, U+20B1-20B2,
		U+20B4-20B5, U+20B8-20BA, U+20BC-20BD,
		U+2116, U+2122, U+2202, U+220F,
		U+2211-2212, U+2215, U+2219-221A,
		U+221E, U+222B, U+2248, U+2260,
		U+2264-2265, U+25CA, U+FB01-FB02;
}

/* Set custom properties for each layout feature */
:root {
	--pacifico-regular-aalt: "aalt" off;
	--pacifico-regular-case: "case" off;
	--pacifico-regular-dlig: "dlig" off;
	--pacifico-regular-frac: "frac" off;
	--pacifico-regular-ordn: "ordn" off;
	--pacifico-regular-salt: "salt" off;
	--pacifico-regular-ss01: "ss01" off;
	--pacifico-regular-ss02: "ss02" off;
	--pacifico-regular-sups: "sups" off;
}

/* If class is applied, update custom property and
   apply modern font-variant-* when supported */
.pacifico-regular-aalt {
    --pacifico-regular-aalt: "aalt" on;
}

.pacifico-regular-case {
    --pacifico-regular-case: "case" on;
}

.pacifico-regular-dlig {
    --pacifico-regular-dlig: "dlig" on;
}

@supports (font-variant-ligatures: discretionary-ligatures) {
    .pacifico-regular-dlig {
        --pacifico-regular-dlig: "____";
        font-variant-ligatures: discretionary-ligatures;
    }
}

.pacifico-regular-frac {
    --pacifico-regular-frac: "frac" on;
}

@supports (font-variant-numeric: diagonal-fractions) {
    .pacifico-regular-frac {
        --pacifico-regular-frac: "____";
        font-variant-numeric: diagonal-fractions;
    }
}

.pacifico-regular-ordn {
    --pacifico-regular-ordn: "ordn" on;
}

@supports (font-variant-numeric: ordinal) {
    .pacifico-regular-ordn {
        --pacifico-regular-ordn: "____";
        font-variant-numeric: ordinal;
    }
}

.pacifico-regular-salt {
    --pacifico-regular-salt: "salt" on;
}

.pacifico-regular-ss01 {
    --pacifico-regular-ss01: "ss01" on;
}

.pacifico-regular-ss02 {
    --pacifico-regular-ss02: "ss02" on;
}

.pacifico-regular-sups {
    --pacifico-regular-sups: "sups" on;
}

@supports (font-variant-position: super) {
    .pacifico-regular-sups {
        --pacifico-regular-sups: "____";
        font-variant-position: super;
    }
}

.pacifico-regular-aalt,
.pacifico-regular-case,
.pacifico-regular-dlig,
.pacifico-regular-frac,
.pacifico-regular-ordn,
.pacifico-regular-salt,
.pacifico-regular-ss01,
.pacifico-regular-ss02,
.pacifico-regular-sups {
    font-feature-settings: var(--pacifico-regular-aalt),
		var(--pacifico-regular-case),
		var(--pacifico-regular-dlig),
		var(--pacifico-regular-frac),
		var(--pacifico-regular-ordn),
		var(--pacifico-regular-salt),
		var(--pacifico-regular-ss01),
		var(--pacifico-regular-ss02),
		var(--pacifico-regular-sups);
}
```

## Finer Control Over Variable Fonts

While we can define variable fonts when declaring them in `theme.json` there are still items that are not supported in `theme.json` and may not be available in fonts.

Variable fonts define four default axes. Like `font-feature-settings`, these can be set with regular descriptors as explained in the following table.

| Variation axis | Equivalent Descriptor | Notes |
| --* | --* | --* |
| Weight (wght) | font-weight | The `font-weight` property will set the `wght` axis if one is present. |
| Width (wdth) | font-stretch | The `font-stretch` property will set the `wdth` axis if one is present. |
| Slant (slnt) or Italic (ital) | font-sty`le |` The `font-style` property will set the `slnt` or `ital` axis, depending on its value. |  |
| Optical size (opsz) | font-optical-sizing | The `font-optical-sizing` property will set the `opsz` axis if one is present. |

A font doesn't need to use all axes. Optical size is one we don't see in too many fonts.

In addition to these default axes, fonts can define any number of custom axes that are exclusive to the font.

**Note:** See Microsoft's [OpenType Design-Variation Axis Tag Registry](https://learn.microsoft.com/en-us/typography/opentype/spec/dvaraxisreg) documentation for a more in-depth discussion about the OpenType tags and why you would want to register them (or not).

For example, [Recursive](https://www.recursive.design/) defines the following custom axes in addition to `wght` (weight) and `slnt` (Slant):

* MONO (Monospace)
* CASL (Casual)
* CRSV (Cursive)

!!! warning **Warning:**
The name of the axes are case-sensitive. Registered axes are all lowercase and custom axes are all uppercased.
!!!

There are no CSS equivalent to these custom features, so we resort to the lower-level `font-variation-settings` descriptor.

```css
@font-face {
	font-family: "Recursive Sans Linear Light";
	src: url("Recursive_VF_1.084.woff2");
	font-weight: 300 1000;
}

.recursive-sans-linear-light-mono-linear-light {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 300, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-light-italic {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 300, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual-light {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 300, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-light-italic {
  font-variation-settings: "MONO" 1, "CASL" 1, "wght" 300, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-linear {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 400, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-italic {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 400, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 400, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-italic {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 400, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-linear-medium {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 500, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-medium-italic {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 500, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual-medium {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 500, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-medium-italic {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 500, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-linear-semibold {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 600, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-semibold-italic {
  font-variation-settings: "MONO" 1, "CASL" 0, "wght" 600, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual-semibold {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 600, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-semibold-italic {
  font-variation-settings: "MONO" 1, "CASL" 1, "wght" 600, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-linear-bold {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 700, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-bold-italic {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 700, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual-bold {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 700, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-bold-italic {
  font-variation-settings: "MONO" 1, "CASL" 1, "wght" 700, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-linear-extrabold {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 800, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-extrabold-italic {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 800, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual-extrabold {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 800, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-extrabold-italic {
	font-variation-settings: "MONO" 1, "CASL" 1, "wght" 800, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-linear-black {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 900, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-black-italic {
	font-variation-settings: "MONO" 1, "CASL" 0, "wght" 900, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual-black {
  font-variation-settings: "MONO" 1, "CASL" 1, "wght" 900, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-black-italic {
  font-variation-settings: "MONO" 1, "CASL" 1, "wght" 900, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-linear-extrablack {
  font-variation-settings: "MONO" 1, "CASL" 0, "wght" 1000, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-linear-extrablack-italic {
  font-variation-settings: "MONO" 1, "CASL" 0, "wght" 1000, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-mono-casual-extrablack {
  font-variation-settings: "MONO" 1, "CASL" 1, "wght" 1000, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-mono-casual-extrablack-italic {
  font-variation-settings: "MONO" 1, "CASL" 1, "wght" 1000, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear-light {
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 300, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-light-italic {
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 300, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual-light {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 300, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-light-italic {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 300, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear {
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 400, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-italic {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 400, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 400, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-italic {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 400, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear-medium {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 500, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-medium-italic {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 500, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual-medium {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 500, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-medium-italic {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 500, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear-semibold {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 600, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-semibold-italic {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 600, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual-semibold {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 600, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-semibold-italic {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 600, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear-bold {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 700, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-bold-italic {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 700, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual-bold {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 700, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-bold-italic {
    font-variation-settings: "MONO" 0, "CASL" 1, "wght" 700, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear-extrabold {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 800, "slnt" 0,
        "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-extrabold-italic {
    font-variation-settings: "MONO" 0, "CASL" 0, "wght" 800, "slnt" -15,
        "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual-extrabold {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 800, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-extrabold-italic {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 800, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear-black {
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 900, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-black-italic {
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 900, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual-black {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 900, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-black-italic {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 900, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-sans-linear-extrablack {
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 1000, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-linear-extrablack-italic {
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 1000, "slnt" -15, "CRSV" 1;
}

.recursive-sans-linear-light-sans-casual-extrablack {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 1000, "slnt" 0, "CRSV" 0.501;
}

.recursive-sans-linear-light-sans-casual-extrablack-italic {
  font-variation-settings: "MONO" 0, "CASL" 1, "wght" 1000, "slnt" -15, "CRSV" 1;
}
```

Fonts may optionally provide one or more named instances. These instances are combinations of the axes available to the font.

The Font Level 4 specification defines the [font-named-instance](https://w3c.github.io/csswg-drafts/css-fonts/#font-named-instance) descriptor to provide the initial values for the supported axes of the variable font.

Unfortunately, this descriptor only works in the `@font-face` at-rule and there is no way to set these values for elements in the body of the page.

We can use CSS classes to get around this restriction using `font-variation-settings`.

The example below, generated from the Recursive variable font using Wakamaifondue, will produce a sans serif, italic, extra black casual/cursive style for whatever element it is applied to.

Note how we override all of the font's axes every time we make a change. This is necessary because `font-variation-settings` suffers the same issue as `font-feature-settings`: Unless you update all the values every time you make a change, the values you don't change will reset to their default values.

By assigning each one of these possible groupings to CSS classes we make it easier to work with. We just add the specific class to the element in the block editor.

```css
.recursive-sans-casual-extrablack-italic {
  font-variation-settings:  "MONO" 0,
          "CASL" 1,
          "wght" 1000,
          "slnt" -15,"CRSV" 1;
}
```
