---
title: A History of CSS Resets
date: 2025-09-19
tags:
  - CSS
  - Web Development
  - History
---

Ensuring a consistent look and feel across different browsers is a big challenge for web developers. One of the earliest and most persistent tools developed to tackle this issue is the CSS reset.

This post explores what CSS resets are, why they were invented, and how their philosophy has evolved over the years.

## What is a CSS Reset and Why Was It Created?

A CSS reset is a stylesheet that overrides the default, built-in styles of a web browser. They solve browser inconsistencies. In the early days of the web, browsers like Netscape Navigator and Internet Explorer had their own unique stylesheets, called "user agent stylesheets."

This meant that a heading (&lt;h1>), a paragraph (&lt;p>), or an unordered list (&lt;ul>) could look vastly different from one browser to another. One browser might give an &lt;h1> a margin of 20 pixels, while another might give it 25 pixels and a slightly different font size. For developers striving for pixel-perfect designs, this chaos was a significant roadblock.

The goal of a CSS reset was to eliminate these inconsistencies by establishing a predictable, common baseline for all HTML elements that developers could build upon.

## The Evolution of CSS Resets

The approach to creating a common baseline has changed significantly over time, moving from aggressive, "scorched-earth" resets to more subtle and targeted methods.

### The Universal Reset (Circa 2004)

One of the first and simplest resets was the universal selector reset. It was a blunt instrument, but effective in its own way.

What it does: It removes all default margins and padding from every single element.

```css
* {
  margin: 0;
  padding: 0;
}
```

* Pros:
  * Extremely simple and easy to understand.
  * Effectively removes all spacing inconsistencies.
* Cons:
  * Too aggressive. It removes useful defaults, forcing developers to redefine spacing for every element.
  * Can have a minor performance impact due to the universal selector (`*`).

### Eric Meyer's "Reset CSS" (Circa 2007)

Web standards pioneer Eric Meyer developed what became the most popular and influential reset for many years. His approach was more comprehensive, targeting specific elements to create a more complete "unstyled" state.

Eric's Reset CSS resets margins, padding, fonts, borders, and list styles for a long list of HTML elements, aiming to make them look completely plain.

```css
/*
  http://meyerweb.com/eric/tools/css/reset/
  v2.0 | 20110126
  License: none (public domain)
*/
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}
body {
  line-height: 1;
}
ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
```

* Pros:
  * Very thorough, creating a consistent, unstyled baseline.
  * Became a de-facto standard for years.
* Cons:
  * Very aggressive, removing all semantic styling (&lt;h1> looks the same as &lt;p>).

### Normalize.css (Circa 2011)

As browsers became more standards-compliant, the need for a heavy-handed reset diminished. A new philosophy emerged: instead of removing all styles, why not normalize them? Co-created by Nicolas Gallagher and Jonathan Neal, [Normalize.css](https://necolas.github.io/normalize.css/) aimed to preserve useful defaults while correcting bugs and inconsistencies.

What it does: It makes built-in browser styling consistent across browsers, rather than removing it. It preserves useful defaults.

Example (Full v8.0.1):

```css
/* normalize.css v8.0.1 | MIT License | [github.com/necolas/normalize.css](https://github.com/necolas/normalize.css) */
html { line-height: 1.15; -webkit-text-size-adjust: 100%; }
body { margin: 0; }
main { display: block; }
h1 { font-size: 2em; margin: 0.67em 0; }
hr { box-sizing: content-box; height: 0; overflow: visible; }
pre { font-family: monospace, monospace; font-size: 1em; }
a { background-color: transparent; }
abbr[title] { border-bottom: none; text-decoration: underline; text-decoration: underline dotted; }
b, strong { font-weight: bolder; }
```

### Sanitize.css (Circa 2012)

Following the philosophy of Normalize.css, Sanitize.css was created as a more opinionated and comprehensive alternative. It normalizes styles for a wider range of elements and includes common, useful defaults.

What it does: Normalizes styles and adds some opinionated but helpful defaults, like a default box-sizing model and system UI font stack.

```css
/*sanitize.css v13.0.0 | CC0 License | https://github.com/csstools/sanitize.css*/
:where(*) { border: 0 solid; box-sizing: border-box; }
:where(blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre) { margin: 0; }
:where(button) { background-color: transparent; background-image: none; }
:where(fieldset) { margin: 0; padding: 0; }
:where(ol, ul) { list-style: none; margin: 0; padding: 0; }
html { font-family: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; line-height: 1.5; }
:where(a) { color: inherit; text-decoration: inherit; }
:where(b, strong) { font-weight: bolder; }
:where(code, kbd, samp, pre) { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 1em; }
:where(small) { font-size: 80%; }
:where(sub, sup) { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
:where(sub) { bottom: -0.25em; }
:where(sup) { top: -0.5em; }
:where(button, input, select) { text-transform: none; }
:where(button, [type="button"], [type="reset"], [type="submit"]) { -webkit-appearance: button; }
:where(progress) { vertical-align: baseline; }
:where(textarea) { margin: 0; }
:where([type="search"]) { -webkit-appearance: textfield; outline-offset: -2px; }
::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; }
::-webkit-input-placeholder { color: inherit; opacity: 0.54; }
::-webkit-file-upload-button { -webkit-appearance: button; font: inherit; }
```

* Pros:
  * Very thorough, handles more edge cases than Normalize.css.
  * Provides excellent, modern starting defaults (e.g., system font stack).
* Cons:
  * Its opinionated nature might not be what every developer wants.

### Tailwind CSS's "Preflight"

Frameworks like Tailwind CSS take a more aggressive approach again, but for a different reason. "Preflight" is an opinionated set of base styles that builds on Normalize.css but goes further, removing almost all default element styling.

What it does: It's designed to make utility classes easier to apply. By removing nearly all default styles (margins, font sizes, etc.), it prevents conflicts and ensures that a utility like text-lg or m-4 behaves predictably on any element.

The example below presents a simplified concept of Preflight:

```css
/* Based on the concepts in Tailwind CSS's Preflight */
*, ::before, ::after { box-sizing: border-box; margin: 0; padding: 0; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
ol, ul { list-style: none; }
img, video, svg { display: block; vertical-align: middle; }
a { color: inherit; text-decoration: inherit; }
```

* Pros:
  * Creates an extremely predictable environment for a utility-first workflow.
  * Removes any need to "undo" browser styles.
* Cons:
  * Not intended for use outside of its framework; it makes unstyled HTML look completely plain.

### Open Props Normalize (Modern Normalization)

A modern evolution of the normalization philosophy comes from [Open Props](https://open-props.style/), a supercharged set of CSS variables. Its version of normalize.css is not just about correcting inconsistencies but also about providing a set of sensible, modern, and opinionated defaults. It can be thought of as "Normalize++".

Key Differences from Original Normalize.css:

* **Opinionated Philosophy**: While the original normalize.css aims to be un-opinionated, the Open Props version is intentionally opinionated. It assumes you want modern best practices like box-sizing: border-box out of the box and removes default margins from elements like headings, assuming you will control spacing deliberately.
* **Zero Specificity**: This is its most powerful feature. The Open Props normalize wraps most of its selectors in the [:where()](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) pseudo-class. This makes the entire stylesheet have zero specificity, meaning you can easily override any of its rules with a simple selector (`h1 { margin-block-start: 2rem; }`) without needing specificity hacks or !important.
* **Modern Defaults Included**: It goes beyond just normalizing and includes defaults that most developers add anyway:
  * **box-sizing**: border-box on all elements.
  * **Responsive media**: (img, video, etc.) by default.
  * **A modern, system font stack**.

How it Works (Conceptual Example):

```css
/* Conceptual example based on Open Props Normalize */
:where(*, *::before, *::after) {
  box-sizing: border-box;
}

:where(h1, h2, p) {
  margin: 0;
}

:where(img, picture) {
  max-width: 100%;
  display: block;
}
```

Can it be used outside of Open Props?

Yes, absolutely. Because it uses `:where()` to have zero specificity and provides an excellent set of modern defaults, it works perfectly as a standalone reset for any project, even if you don't use the rest of the Open Props library. It's a fantastic, lightweight starting point for any modern CSS architecture.

## Choosing Your Own Approach

Now that browsers have largely standardized their default styles, the need for heavy-handed resets has diminished. Modern CSS resets like Normalize.css and Sanitize.css focus on preserving useful defaults while fixing inconsistencies, reflecting a more nuanced understanding of web design.

You can also roll out your own custom reset or normalization stylesheet where you only target the elements and properties that matter most to your project. This custom approach allows you be as opinionated as you want, balancing between a full reset and a light normalization.

Which strategy to use depends on your project's needs, your design philosophy, and your workflow. Whether you prefer a clean slate or a normalized baseline, or create a customized reset, understanding the history and evolution of CSS resets can help you make an informed choice.
