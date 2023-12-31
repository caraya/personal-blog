---
title: "Inspecting your variable fonts"
date: "2018-05-23"
---

One of the most frustrating things of working with Variable Fonts is that we have no real way (short of bugging the font creator to provide them for you) to detect what values work for each scale, how they scale and what, if any, pre-defined values are available for each font.

[Axis Praxis](https://www.axis-praxis.org/) is a good starting point. It provides you with a way to test and play with Variable Fonts but you get only one experiment at a time.

![Axis Praxis App on Firefox Nightly 61.0a](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/axis-praxis)

Axis Praxis App on Firefox Nightly 61.0a

[Wakamai Fondue](https://wakamaifondue.com/) (funny way of saying what can my font do?) provides a more thorough and more fun way to test specific variable fonts that you want to use in your projects.

![Wakamai Fondue on Firefox Nightly 61.0a](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/Wakamai-Fondue)

Wakamai Fondue on Firefox Nightly 61.0a

But it does more than just show you what you can do with the font. It creates visual displays of what the selected instance (pre-configured axes combination), gives you the generated CSS and what values the instance used for the axes on the font.

![Wakamai fondue VF font instance example](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/wakamaifondue-instance)

Wakamai fondue VF font instance example

![Wakamaifondue VF font instance CSS listing](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/wakamafondue-instance-css)

Wakamaifondue VF font instance CSS listing

It also shows you all the classes it creates for the instances available on the font. If you've loaded the font using `@font-face` you can just copy the example into your document to test the font.

![Wakamaifondue VF font character listing](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/wakamaifondue-characters)

Wakamaifondue VF font character listing

Wakamaifondue will also list the characters available on the font and give you a way to change the variable axes to see what individual characters will look like under different axes combinations.

![Wakamaifondue display Opentype layout features available to the font. The ones enabled will be added to the generated CSS style sheet](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/wakamaifondue-layout)

Wakamaifondue display Opentype layout features available to the font. The ones enabled will be added to the generated CSS style sheet

If the font has Opentype layout features available they will appear here along with a way to show it and add it to the CSS stylesheet we'll discuss in the next section.

There may not be any features under this section. It depends on the font.

![Wakamaifondue Generated CSS](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/wakamaifondue-css)

Wakamaifondue Generated CSS

The most important part, to me, is that Wakamaifondue generates a CSS style sheet with all the variable fonts instances and the open type features available to the font.

The CSS uses variables to set the different layout features rather than [font-variant-\*](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant). [font-variation-settings](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings) has wider support but it doesn't cascade like `font-variant-*`; See [CSS WG Issue 552](https://github.com/w3c/csswg-drafts/issues/552) for more details on how .

Using variables mean that the features we add will work consistently until more browsers implement font variations and they work consistently across browsers.

You can also combine features to get the results you need.

The example below shows the style sheet generated for the Roboto Regular variable font. This will give you an idea of what you can expect for a fairly complete font.

```css
/**  * CSS for                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 Regular
 * Generated by Wakamai Fondue - https://wakamaifondue.com
 * by Roel Nieskens/PixelAmbacht - https://pixelambacht.nl
 */

/* Set custom properties for each layout feature */
:root {
    --roboto-regular-c2sc: "c2sc" off;
    --roboto-regular-dlig: "dlig" off;
    --roboto-regular-dnom: "dnom" off;
    --roboto-regular-frac: "frac" off;
    --roboto-regular-lnum: "lnum" off;
    --roboto-regular-numr: "numr" off;
    --roboto-regular-onum: "onum" off;
    --roboto-regular-pnum: "pnum" off;
    --roboto-regular-salt: "salt" off;
    --roboto-regular-smcp: "smcp" off;
    --roboto-regular-ss01: "ss01" off;
    --roboto-regular-ss02: "ss02" off;
    --roboto-regular-ss03: "ss03" off;
    --roboto-regular-ss04: "ss04" off;
    --roboto-regular-ss05: "ss05" off;
    --roboto-regular-ss06: "ss06" off;
    --roboto-regular-ss07: "ss07" off;
    --roboto-regular-tnum: "tnum" off;
    --roboto-regular-unic: "unic" off;
    --roboto-regular-cpsp: "cpsp" off;
}

/* If class is applied, update custom property and
   apply modern font-variant-* when supported */
.roboto-regular-c2sc {
    --roboto-regular-c2sc: "c2sc" on;
}

.roboto-regular-dlig {
    --roboto-regular-dlig: "dlig" on;
}

@supports (font-variant-ligatures: discretionary-ligatures) {
    .roboto-regular-dlig {
        --roboto-regular-dlig: "____";
        font-variant-ligatures: discretionary-ligatures;
    }
}

.roboto-regular-dnom {
    --roboto-regular-dnom: "dnom" on;
}

.roboto-regular-frac {
    --roboto-regular-frac: "frac" on;
}

@supports (font-variant-numeric: diagonal-fractions) {
    .roboto-regular-frac {
        --roboto-regular-frac: "____";
        font-variant-numeric: diagonal-fractions;
    }
}

.roboto-regular-lnum {
    --roboto-regular-lnum: "lnum" on;
}

@supports (font-variant-numeric: lining-nums) {
    .roboto-regular-lnum {
        --roboto-regular-lnum: "____";
        font-variant-numeric: lining-nums;
    }
}

.roboto-regular-numr {
    --roboto-regular-numr: "numr" on;
}

.roboto-regular-onum {
    --roboto-regular-onum: "onum" on;
}

@supports (font-variant-numeric: oldstyle-nums) {
    .roboto-regular-onum {
        --roboto-regular-onum: "____";
        font-variant-numeric: oldstyle-nums;
    }
}

.roboto-regular-pnum {
    --roboto-regular-pnum: "pnum" on;
}

@supports (font-variant-numeric: proportional-nums) {
    .roboto-regular-pnum {
        --roboto-regular-pnum: "____";
        font-variant-numeric: proportional-nums;
    }
}

.roboto-regular-salt {
    --roboto-regular-salt: "salt" on;
}

.roboto-regular-smcp {
    --roboto-regular-smcp: "smcp" on;
}

@supports (font-variant-caps: small-caps) {
    .roboto-regular-smcp {
        --roboto-regular-smcp: "____";
        font-variant-caps: small-caps;
    }
}

.roboto-regular-ss01 {
    --roboto-regular-ss01: "ss01" on;
}

.roboto-regular-ss02 {
    --roboto-regular-ss02: "ss02" on;
}

.roboto-regular-ss03 {
    --roboto-regular-ss03: "ss03" on;
}

.roboto-regular-ss04 {
    --roboto-regular-ss04: "ss04" on;
}

.roboto-regular-ss05 {
    --roboto-regular-ss05: "ss05" on;
}

.roboto-regular-ss06 {
    --roboto-regular-ss06: "ss06" on;
}

.roboto-regular-ss07 {
    --roboto-regular-ss07: "ss07" on;
}

.roboto-regular-tnum {
    --roboto-regular-tnum: "tnum" on;
}

@supports (font-variant-numeric: tabular-nums) {
    .roboto-regular-tnum {
        --roboto-regular-tnum: "____";
        font-variant-numeric: tabular-nums;
    }
}

.roboto-regular-unic {
    --roboto-regular-unic: "unic" on;
}

@supports (font-variant-caps: unicase) {
    .roboto-regular-unic {
        --roboto-regular-unic: "____";
        font-variant-caps: unicase;
    }
}

.roboto-regular-cpsp {
    --roboto-regular-cpsp: "cpsp" on;
}

/* Apply current state of all custom properties
   whenever a class is being applied */
.roboto-regular-c2sc,
.roboto-regular-dlig,
.roboto-regular-dnom,
.roboto-regular-frac,
.roboto-regular-lnum,
.roboto-regular-numr,
.roboto-regular-onum,
.roboto-regular-pnum,
.roboto-regular-salt,
.roboto-regular-smcp,
.roboto-regular-ss01,
.roboto-regular-ss02,
.roboto-regular-ss03,
.roboto-regular-ss04,
.roboto-regular-ss05,
.roboto-regular-ss06,
.roboto-regular-ss07,
.roboto-regular-tnum,
.roboto-regular-unic,
.roboto-regular-cpsp {
    font-feature-settings: var(--roboto-regular-c2sc), var(--roboto-regular-dlig), var(--roboto-regular-dnom), var(--roboto-regular-frac), var(--roboto-regular-lnum), var(--roboto-regular-numr), var(--roboto-regular-onum), var(--roboto-regular-pnum), var(--roboto-regular-salt), var(--roboto-regular-smcp), var(--roboto-regular-ss01), var(--roboto-regular-ss02), var(--roboto-regular-ss03), var(--roboto-regular-ss04), var(--roboto-regular-ss05), var(--roboto-regular-ss06), var(--roboto-regular-ss07), var(--roboto-regular-tnum), var(--roboto-regular-unic), var(--roboto-regular-cpsp);
}

/* Variable instances */
.roboto-regular-thin {
    font-variation-settings: "wdth" 100, "wght" 0;
}

.roboto-regular-light {
    font-variation-settings: "wdth" 100, "wght" 45;
}

.roboto-regular-regular-i {
    font-variation-settings: "wdth" 100, "wght" 90;
}

.roboto-regular-medium {
    font-variation-settings: "wdth" 100, "wght" 135;
}

.roboto-regular-bold {
    font-variation-settings: "wdth" 100, "wght" 173;
}

.roboto-regular-black {
    font-variation-settings: "wdth" 100, "wght" 212.5;
}

.roboto-regular-condensed-light {
    font-variation-settings: "wdth" 84, "wght" 45;
}

.roboto-regular-condensed-regular {
    font-variation-settings: "wdth" 84, "wght" 90;
}

.roboto-regular-condensed-bold {
    font-variation-settings: "wdth" 84, "wght" 175;
}
```
