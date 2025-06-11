---
title: H1 element style changes
date: 2025-05-19
tags:
  - HTML
  - CSS
  - Styling
---

Mozilla [posted a note](https://developer.mozilla.org/en-US/blog/h1-element-styles/) about upocoming changes to how the `h1` elements are displayed in browsers. The changes are intended to improve accessibility and consistency across different platforms.

The post will cover the issue, the proposed change and how it may affect your web pages.

## The issue

The HTML spec used to define an outline algorithm that gave `h1` elements an implicit semantic heading level based on how many sectioning elements (`section`, `aside`, `nav`, and `article`) it was nested inside.

The code in the browsers' default stylesheets looked like this. I've removed the `:is()` pseudo-class repetition for clarity

```css
/* where x is :is(article, aside, nav, section) */
x h1 { margin-block: 0.83em; font-size: 1.50em; }
x x h1 { margin-block: 1.00em; font-size: 1.17em; }
x x x h1 { margin-block: 1.33em; font-size: 1.00em; }
x x x x h1 { margin-block: 1.67em; font-size: 0.83em; }
x x x x x h1 { margin-block: 2.33em; font-size: 0.67em; }
```

The rendering worked by reducing the font size and margin of the `h1` element as it was nested deeper inside sectioning elements. The first `h1` in a document would be rendered as a top-level heading, with the largest font size and margin. The next `h1` inside a sectioning would be rendered smaller, matching smaller heading elements (h2, h3, h4).

This default rendering was implemented in browsers default UA styles, but not the heading level in the [accessibility tree](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree) (what screen readers use). So the visual style would be different than the accessibility tree.

The HTML outline algorithm created confusion for developers regarding `h1` element usage and caused inconsistent behavior across different tools. Although [the algorithm was removed from the HTML specification in 2022](https://github.com/whatwg/html/pull/7829), its associated stylesheet rules persisted. Browser vendors are now in the process of removing these default styles.

## What's changing

Browsers have started removing the implicit styles for `h1` elements nested inside sectioning elements. The new default styles will apply a consistent font size and margin to `h1` elements, regardless of their nesting level, without any automatic adjustments based on their position in the document structure.

Auditing tools like Chrome DevTools and Lighthouse now flag cases of `h1`s without defined `font-size` as bad practice. The Lighthouse deprecation warning to look out for is `H1UserAgentFontSizeInSection`.

## The solution

Since browsers are removing implicit styles for `h1` elements, developers should explicitly define the styles for `h1` elements in their CSS. This ensures that the headings are styled consistently across different browsers and that they meet accessibility standards.

## Implementation bugs to watch for

* Firefox: [bug 1885509](https://bugzilla.mozilla.org/show_bug.cgi?id=1885509)
* Chromium: [bug 394111284](https://issues.chromium.org/issues/394111284)
* WebKit: [bug 292765](https://bugs.webkit.org/show_bug.cgi?id=292765)
