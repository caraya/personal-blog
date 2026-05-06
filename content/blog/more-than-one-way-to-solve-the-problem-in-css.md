---
title: "More Than One Way To Solve The Problem In CSS"
date: 2026-06-29
tags:
  - CSS
  - Web Development
  - Complexity
youtube: true
---

As CSS evolves, the CSS Working Group continues to introduce features that replace older, brittle patterns. Many teams, however, still rely on legacy techniques and characterize newer approaches as "over-engineering."

Kevin Powell's presentation at CSS Day 2024 captures this tension by reframing "over-engineering" as a practical path to mastering modern CSS.

This article examines that argument and extends it by showing how complex internals can still expose a simple, maintainable interface for day-to-day development.

## Kevin's Presentation

<lite-youtube videoid="k_3pRxdv-cI"></lite-youtube>

Kevin Powell’s presentation at CSS Day 2024 advocates for "over-engineering" as a primary method for mastering modern CSS and discovering robust, future-proof patterns. He argues that by pushing CSS features like the min() function, logical properties, and complex grid math to their limits, developers transition from simply following old conventions to building browser-driven layouts. While these approaches may initially seem more complex than traditional methods, they often eliminate the need for brittle media queries and repetitive wrapper nesting, ultimately leading to a deeper understanding of the language’s internal mechanics.

To balance this underlying complexity with maintainability, Powell suggests a "car engine" philosophy: keep the internal logic sophisticated but expose simple, named controls for the user. By utilizing locally scoped custom properties, developers can create components that are easy to modify—such as changing a single variable to adjust a button’s "frostiness"—without requiring the next developer to parse the underlying filters or math. This strategy normalizes modern CSS features within a team while providing a clean, declarative interface for day-to-day styling tasks.

## Everything Old Is New Again

<lite-youtube videoid="koS4vjSux8A"></lite-youtube>

Frank Chimero's [Everything Old Is New Again](https://frankchimero.com/blog/2018/everything-easy/) offers a useful historical lens on the same tension between simplicity and complexity in web design.

He asks a revealing question: "Have I been building websites for twenty years or have I been building websites for five years four times?"

A good example of this is the use of width and height attributes for images. In the early days of the web, these attributes were used to reserve space for images before they loaded, preventing layout shifts. This was a simple solution that worked well at the time.

Over time, approaches to this problem have varied, from sizing images with CSS to using JavaScript to calculate and set dimensions dynamically.

We've now come full circle: one of the best ways to prevent layout shifts is to use `width` and `height` attributes in images.

The same cycle appears in layout work, where each era introduces a new answer to a familiar problem.

### How do I put two things next to each other?

Over the last 30 years, we've come up with many ways to solve the problem of placing elements side by side.

When tables were introduced, we used table cells to lay out content and often inserted spacer gifs to control visual gaps. This code places "Hi" and "Mom" next to each other in an invisible table with a spacer cell between them.

This is not semantic and can be difficult to maintain. It is easy to delete a TD or a spacer gif and break the layout, but it was the best solution at the time, and it worked.

```html
<table>
  <tr>
    <td>Hi</td>
    <td><img src="spacer.gif" width="24" height="1" alt=""></td>
    <td>Mom</td>
  </tr>
</table>
```

The next step was floats in CSS. Layout work then required float clearing and a range of float-specific workarounds.

```css
.float-left {
  float: left;
}

.float-right {
  float: right;
}
```

Then came flexbox. A few lines of CSS could align content without many of the layout hacks required by earlier approaches. It still has limitations, but represented a substantial improvement over floats and tables.

```css
.flex-container {
  display: flex;
}
```

Then CSS Grid arrived, offering far stronger control over layout. It is powerful, but not always easy to learn.

Grid also introduces closely related concepts that differ in important ways, such as `auto-fill` versus `auto-fit` in `grid-template-columns` (see [Auto-Sizing Columns in CSS Grid: `auto-fill` vs `auto-fit`](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/) for a clear breakdown).

```css
.grid-container {
  display: grid;
}
```

## There's More Than One Way To Do It

The core issue is not that modern CSS is inherently overengineered. The issue is that many teams still default to older, simpler patterns and dismiss newer methods primarily because they are unfamiliar.

Larry Wall, the creator of Perl, coined the phrase **There is more than one way to do it** to emphasize that multiple solutions can be valid. In practice, teams should choose the solution that best fits their context and constraints.

A common example used in this debate is the content wrapper that centers text and limits line length. One conventional version uses individual padding and margin properties.

```css
.wrapper {
  max-width: 60ch;
  padding-left: 2rem;
  padding-right: 2rem;
  margin-left: auto;
  margin-right: auto;
}
```

A concise refinement uses shorthand padding and margin.

```css
.wrapper {
  max-width: 60ch;
  padding: 0 2rem;
  margin: 0 auto;
}
```

The more "over-engineered" version uses `min()` to compute width as the smaller of `100% - 4rem` and `60ch`.

```css
.wrapper {
  width: min(100% - 4rem, 60ch);
  margin-inline: auto;
}
```

The same pattern can be modernized further with `inline-size`, a logical property that better supports different writing modes and languages.

```css
.wrapper {
  inline-size: min(100% - 4rem, 60ch);
  margin-inline: auto;
}
```

So which one is correct? All of them.

The first two examples are valid and readable. The last two are more complex, but often more robust because they shift part of the calculation to the browser.

## Hiding Complexity: The "Car Engine" Philosophy

The "car engine" philosophy is about hiding internal complexity while exposing a simple interface for day-to-day use. In CSS, that usually means writing sophisticated internals once and then controlling them through named custom properties.

This is effectively an API design approach for CSS: the engine stays under the hood, while other developers interact with a small set of clear controls.

As a secondary example, [Wakamai Fondue](https://wakamaifondue.com/) shows this pattern with variable fonts. It generates custom properties and utility classes so developers can compose behavior without handling low-level font configuration each time.

```css
@font-face {
    font-family: "Inter Variable";
    src: url("InterVariable.ttf");
    font-weight: 100 900;
}

/**
 * OpenType Layout Features
 */

/* Initial values for the layout features */
:root {
    --aalt: off;
    --c2sc: off;
    --case: off;
    --cv01: off;
    --cv02: off;
    --cv03: off;
    --cv04: off;
    --cv05: off;
    --cv06: off;
    --cv07: off;
    --cv08: off;
    --cv09: off;
    --cv10: off;
    --cv11: off;
    --cv12: off;
    --cv13: off;
    --dnom: off;
    --numr: off;
    --salt: off;
    --sinf: off;
    --ss01: off;
    --ss02: off;
    --ss03: off;
    --ss04: off;
    --ss05: off;
    --ss06: off;
    --ss07: off;
    --ss08: off;
    --cpsp: off;
}

/* Classes to apply the layout features */
.access-all-alternates {
    --aalt: 1; /* Use value 1 to 6 for all alternates */
}

.small-capitals-from-capitals {
    --c2sc: on;
}

.case-sensitive-forms {
    --case: on;
}

.character-variants-1 {
    --cv01: on;
}

.character-variants-2 {
    --cv02: on;
}

.character-variants-3 {
    --cv03: on;
}

.character-variants-4 {
    --cv04: on;
}

.character-variants-5 {
    --cv05: on;
}

.character-variants-6 {
    --cv06: on;
}

.character-variants-7 {
    --cv07: on;
}

.character-variants-8 {
    --cv08: on;
}

.character-variants-9 {
    --cv09: on;
}

.character-variants-10 {
    --cv10: on;
}

.character-variants-11 {
    --cv11: on;
}

.character-variants-12 {
    --cv12: on;
}

.character-variants-13 {
    --cv13: on;
}

.discretionary-ligatures {
    font-variant-ligatures: discretionary-ligatures;
}

/* for older browsers, optionally add: */
@supports not (font-variant-ligatures: discretionary-ligatures) {
    .discretionary-ligatures {
        font-feature-settings: "dlig" on;
    }
}

.denominators {
    --dnom: on;
}

.fractions {
    font-variant-numeric: diagonal-fractions;
}

/* for older browsers, optionally add: */
@supports not (font-variant-numeric: diagonal-fractions) {
    .fractions {
        font-feature-settings: "frac" on;
    }
}

.numerators {
    --numr: on;
}

.ordinals {
    font-variant-numeric: ordinal;
}

/* for older browsers, optionally add: */
@supports not (font-variant-numeric: ordinal) {
    .ordinals {
        font-feature-settings: "ordn" on;
    }
}

.proportional-figures {
    font-variant-numeric: proportional-nums;
}

/* for older browsers, optionally add: */
@supports not (font-variant-numeric: proportional-nums) {
    .proportional-figures {
        font-feature-settings: "pnum" on;
    }
}

.stylistic-alternates {
    --salt: on;
}

.scientific-inferiors {
    --sinf: on;
}

.small-capitals {
    font-variant-caps: small-caps;
}

/* for older browsers, optionally add: */
@supports not (font-variant-caps: small-caps) {
    .small-capitals {
        font-feature-settings: "smcp" on;
    }
}

.open-digits {
    --ss01: on;
}

.disambiguation {
    --ss02: on;
}

.round-quotes--commas {
    --ss03: on;
}

.disambiguation-no-slashed-zero {
    --ss04: on;
}

.circled-characters {
    --ss05: on;
}

.squared-characters {
    --ss06: on;
}

.square-punctuation {
    --ss07: on;
}

.square-quotes {
    --ss08: on;
}

.subscript {
    font-variant-position: sub;
}

/* for older browsers, optionally add: */
@supports not (font-variant-position: sub) {
    .subscript {
        font-feature-settings: "subs" on;
    }
}

.superscript {
    font-variant-position: super;
}

/* for older browsers, optionally add: */
@supports not (font-variant-position: super) {
    .superscript {
        font-feature-settings: "sups" on;
    }
}

.tabular-figures {
    font-variant-numeric: tabular-nums;
}

/* for older browsers, optionally add: */
@supports not (font-variant-numeric: tabular-nums) {
    .tabular-figures {
        font-feature-settings: "tnum" on;
    }
}

.slashed-zero {
    font-variant-numeric: slashed-zero;
}

/* for older browsers, optionally add: */
@supports not (font-variant-numeric: slashed-zero) {
    .slashed-zero {
        font-feature-settings: "zero" on;
    }
}

.capital-spacing {
    --cpsp: on;
}

/* Apply the layout features set by the classes */
.access-all-alternates,
.small-capitals-from-capitals,
.case-sensitive-forms,
.character-variants-1,
.character-variants-2,
.character-variants-3,
.character-variants-4,
.character-variants-5,
.character-variants-6,
.character-variants-7,
.character-variants-8,
.character-variants-9,
.character-variants-10,
.character-variants-11,
.character-variants-12,
.character-variants-13,
.denominators,
.numerators,
.stylistic-alternates,
.scientific-inferiors,
.open-digits,
.disambiguation,
.round-quotes--commas,
.disambiguation-no-slashed-zero,
.circled-characters,
.squared-characters,
.square-punctuation,
.square-quotes,
.capital-spacing {
	font-feature-settings: "aalt" var(--aalt),
		"c2sc" var(--c2sc),
		"case" var(--case),
		"cv01" var(--cv01),
		"cv02" var(--cv02),
		"cv03" var(--cv03),
		"cv04" var(--cv04),
		"cv05" var(--cv05),
		"cv06" var(--cv06),
		"cv07" var(--cv07),
		"cv08" var(--cv08),
		"cv09" var(--cv09),
		"cv10" var(--cv10),
		"cv11" var(--cv11),
		"cv12" var(--cv12),
		"cv13" var(--cv13),
		"dnom" var(--dnom),
		"numr" var(--numr),
		"salt" var(--salt),
		"sinf" var(--sinf),
		"ss01" var(--ss01),
		"ss02" var(--ss02),
		"ss03" var(--ss03),
		"ss04" var(--ss04),
		"ss05" var(--ss05),
		"ss06" var(--ss06),
		"ss07" var(--ss07),
		"ss08" var(--ss08),
		"cpsp" var(--cpsp);
}
```

Using this approach, complexity is handled once and exposed through a simpler interface for everyday use.

## Conclusion: There's More Than One Way To Do It

With all the new features in CSS, there are often multiple ways to achieve the same result. Some methods may be, or appear to be, more complex than others, but they often provide more robust and maintainable solutions.

The key is to understand the trade-offs between simplicity and complexity. Whether you are choosing between layout strategies or hiding complexity behind custom-property interfaces, the goal is the same: pick the approach that best fits your needs while keeping the codebase maintainable.
