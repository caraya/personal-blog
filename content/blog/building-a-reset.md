---
title: Building a Reset
date: 2025-09-26
tags:
  - CSS
  - Reset
  - Best Practices
  - Opinion
baseline: true
---

In a previous post ([A History of CSS Resets](https://publishing-project.rivendellweb.net/a-history-of-css-resets/)), we discussed the evolution of CSS resets and their importance in creating a consistent starting point for web development.

In this post, we'll explore how to build a modern, opinionated CSS reset using Cascade Layers, a powerful feature that brings order and predictability to the often chaotic world of CSS.

## Why Create Your Own Reset?

In modern web development, starting a project with a clean, predictable foundation is crucial. While pre-built systems like Open Props or Tailwind's Preflight offer excellent solutions, understanding how to craft your own modern CSS reset is an invaluable skill. This approach, heavily inspired by the work of innovators like [Josh Comeau](https://www.joshwcomeau.com/css/custom-css-reset/), goes beyond traditional resets by leveraging modern CSS features to create a robust, accessible, and developer-friendly starting point.

The cornerstone of this technique is [CSS Cascade Layers (@layer)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers). This feature gives you explicit, author-defined control over the CSS cascade, allowing you to manage specificity wars before they even begin.

## Why Layers?

Traditionally, CSS specificity has been a complex dance of selectors, source order, and the dreaded !important flag. Cascade Layers introduce a new, more powerful criterion to this dance. By defining a set of named layers, you create a clear hierarchy of precedence.

```css
/* Define the layer order. This is the most important step! */
@layer reset, base, layouts, components, utilities;
```

This single line of code establishes a "specificity ladder." No matter how complex a selector is, a style defined in a later layer (e.g., utilities) will always override a style from an earlier layer (e.g., reset or components). This predictability is the system's superpower.

## Anatomy of the Modern Reset (@layer reset)

The reset @layer has one job: to sand down the inconsistencies between different browsers and set sensible, modern defaults. It should contain no project-specific styling (like colors or fonts), only rules that create a consistent canvas to build upon.

Let's break down the key parts of the reset code.

### Intuitive Box-Sizing & Margin Removal

```css
/* 1a. Use a more intuitive box-sizing model on everything. */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 1b. Remove default margin and padding */

* {
  margin: 0;
  padding: 0;
}
```

* `box-sizing: border-box;`: This rule changes the CSS box model so that an element's width and height properties include its padding and border, preventing unexpected size changes.
* `margin: 0; padding: 0;`: This rule removes all default margins and padding from every element, eliminating browser-specific spacing and giving you full control over the layout.

### Core Document & Body Defaults

```css
/* 1c. Set core HTML & Body defaults */
html, body {
  height: 100%;
}

html {
  /* Prevent layout shift when scrollbar appears */
  scrollbar-gutter: stable;

  /* Signal support for light and dark color schemes */
  color-scheme: light dark;
}

/* 2. Set core body defaults. */
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
```

* `height: 100%;`: Allows us to easily use percentage-based heights on child elements relative to the viewport
* `scrollbar-gutter: stable;`: A fantastic modern property that reserves space for the scrollbar before it's needed. This prevents the jarring layout shift that occurs when content grows and a scrollbar suddenly appears.
* `color-scheme: light dark;`: Signals to the browser that your site supports both light and dark modes, allowing it to adjust default form controls and scrollbars accordingly.
* `line-height: 1.5;`: Sets a unitless, accessible default line height for better text readability.
* `-webkit-font-smoothing: antialiased;`: Improves font rendering on many displays for crisper text.

### A Modern Approach to Stacking Context

```css
/* 3. Create a root stacking context to prevent z-index issues. */
#root, #__next {
  isolation: isolate;
}
```

This is a simple but powerful rule for modern JavaScript frameworks (like React or Next.js). isolation: isolate creates a new stacking context on the root element. This prevents child elements with a high z-index from being unexpectedly trapped behind other elements on the page, saving you from common layout headaches.

### Fluid, Internationally-Friendly Media

```css
/* 4. Make images and media easier to work with using logical properties. */
img, picture, video, canvas, svg {
  display: block;
  max-inline-size: 100%;
  block-size: auto;
}
```

* `display: block;`: Removes the small space that often appears below inline images.
* `max-inline-size: 100%;`: This is the modern, logical-property equivalent of `max-width: 100%`. It makes media fluid and responsive. For left-to-right languages, it behaves identically. However, for vertical writing modes (like Japanese), `inline-size` correctly refers to the element's height, making your styling more internationally robust.
* `block-size: auto;`: The logical property for `height: auto;`, ensuring aspect ratios are maintained.

### Smarter Typography & Form Inheritance

```css
/* 5. Inherit fonts for form elements. */
input, button, textarea, select {
  font: inherit;
}

/* 5b. Correct the font size and family for preformatted text. */
pre {
	font-family: monospace, monospace;
	font-size: 1em;
}

/* 6. Improve text wrapping and balancing. */
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
  hanging-punctuation: first last;
}

h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}
```

* `font: inherit;`: By default, form elements don't inherit the parent's font styles. This rule fixes that, ensuring consistency across your entire site.
* `pre { font-family: monospace, monospace; }`: This ensures that preformatted text uses a monospace font, making it easier to read and more consistent with code blocks.
* `pre { font-size: 1em; }`: This sets the font size to 1em to ensure preformatted text inherits the correct size from the enclosing element, making inline code blocks in headings appear consistent.
* `overflow-wrap: break-word;`: Prevents long, unbreakable strings (like URLs) from overflowing their container and breaking the layout.
* `text-wrap: balance;`: A brilliant progressive enhancement that automatically balances the number of characters on each line of a heading. It prevents "orphaned" words on the last line and creates more visually pleasing headlines.
* `hanging-punctuation: first last;`: Another progressive enhancement that allows punctuation (like quotation marks) to hang outside the main text block, creating a cleaner alignment.

### Accessibility First

```css
/* 7. Remove list styles on ul, ol elements with a role attribute. */
ul[role='list'],
ol[role='list'] {
  list-style: none;
}

/* 8. Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  /* ... rules to disable transitions and animations ... */
}
```

* `ul[role='list']`: Instead of bluntly removing list styles from all lists, this selector targets only those explicitly marked with role="list". This is great practice, as it preserves semantic styling for genuine content lists while allowing you to strip bullets from lists used for navigation or layout.
* `prefers-reduced-motion`: This is a non-negotiable for modern, accessible web design. It respects the user's operating system preference and effectively disables animations and transitions for those who may be sensitive to motion.

## How to Choose the Right Layer: A Mental Model

The power of this system comes from knowing where to place your styles. The layer order—reset, base, layouts, components, utilities—creates a spectrum from broad, generic rules to narrow, specific ones.

@layer reset
: **Purpose**: Fix browser defaults and set a consistent baseline.
: **Ask Yourself**: "Is this fixing a browser's weirdness or setting a project-specific style?" If it's fixing a default, it belongs here.

@layer base
: **Purpose**: Apply your project's brand and typography to un-classed HTML elements.
: **Ask Yourself**: "How should a plain &lt;a&gt; or &lt;h1&gt; tag look on my site?" Those styles go in base.
: **Example**: `body { font-family: 'Inter', sans-serif; color: #111; }`

@layer layouts
: **Purpose**: Define the major structural parts of your page.
: **Ask Yourself**: "Does this class define a major region of the page, like a grid or container?" If so, it's a layout.
: **Example**: `.container { width: min(100% - 2rem, 1200px); margin-inline: auto; }`

@layer components
: **Purpose**: Style distinct, self-contained, reusable pieces of UI.
: **Ask Yourself**: "Is this a self-contained widget like a card, button, or modal?" If yes, it's a component.
: **Example**: `.card { padding: 1.5rem; border-radius: 8px; box-shadow: ...; }`

@layer utilities
: **Purpose**: Provide high-powered, single-purpose helper classes that can override anything.
: **Ask Yourself**: "Does this class have a single, immutable job that must always win?" If yes, it's a utility.
: **Example**: `.visually-hidden, .text-center, .flex`.
: Because utilities is the last layer, .text-center will successfully center text inside a heading styled in the base layer or a button styled in the components layer, without any specificity hacks.

## How to Break the Rules: Overriding Layer Precedence

While the power of cascade layers is their predictability, there are times when you need to override this order. The CSS cascade provides two primary "escape hatches" for this purpose. Use them sparingly, as they intentionally disrupt the organized structure you've created.

### Unlayered Styles

Any CSS rule written outside of a @layer block will always override any style written inside a layer, regardless of specificity. This is the most powerful tool for breaking the layer hierarchy.

Example:

```css
@layer utilities {
  .text-blue {
    color: blue; /* This is in a high-precedence layer */
  }
}

/* This is an UNLAYERED style */
.promo-text {
  color: red; /* This will WIN, even though its selector is simple */
}
```

This is useful for quick debugging, integrating third-party CSS that doesn't use layers, or writing critical override styles that must always apply.

### The !important Keyword

The `!important` keyword is the ultimate weapon in the cascade. It works as you'd expect, but it's important to understand its place in the new world order. An !important style will beat any style without it, but when comparing two !important styles, the layer order and specificity come back into play.

The order of precedence becomes:

* Unlayered !important styles
* Layered !important styles (still respecting layer order, so utilities !important beats components !important)
* Unlayered normal styles
* Layered normal styles (respecting layer order)

!!!note  **Rule of thumb**
Avoid !important where possible.

Prefer unlayered styles for intentional overrides, and reserve !important for absolute last-resort situations.
!!!

## Browser Support and Fallbacks

<baseline-status
	featureId="cascade-layers">
</baseline-status>

CSS Cascade Layers are a safe and reliable choice for any modern project. The feature is Baseline Widely Available (the feature has been supported across all major browsers for over 30 months).

Given this long-standing support and official status, the need for a fallback is now an edge case. You should only consider a fallback strategy if your project has a strict requirement to support very old, non-evergreen browser versions.

However, if you require deep legacy browser support, you can use the @supports at-rule to create a fallback:

```css
/* For older browsers that DON'T support @layer */
@supports not (layer) {
  /* ... your entire non-layered stylesheet goes here ... */
}

/* For modern browsers that DO support @layer */
@layer reset, base, layouts, components, utilities;

@layer reset {
  /* ... your entire layered stylesheet goes here ... */
}
```

### The Trade-Off

This approach provides maximum compatibility at the cost of code duplication, as you must maintain every style rule in two places.

This guide's final stylesheet does not include this fallback. However, for a production website that requires deep legacy browser support, this @supports strategy is one possible solution.

## Complete Modern CSS Reset Stylesheet

Here is the full CSS code, ready to be dropped into your project.

```css
/* A Modern, Opinionated CSS Reset Using Cascade Layers */

/* 1. Define the layer order.
Styles in 'reset' have the lowest precedence. */
@layer reset, base, layouts, components, utilities;

@layer reset {
  /*
    Inspired by Josh Comeau's Custom CSS Reset
    Source: https://www.joshwcomeau.com/css/custom-css-reset/
  */

  /* 1a. Use a more intuitive box-sizing model on everything. */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  /* 1b. Remove default margin and padding */
	* {
		margin: 0;
		padding: 0;
	}

  /* 1c. Set core HTML & Body defaults */
  html, body {
    height: 100%;
  }

  html {
    /* Prevent layout shift when scrollbar appears */
    scrollbar-gutter: stable;

    /* Signal support for light and dark color schemes */
    color-scheme: light dark;
  }

  /* 2. Set core body defaults. */
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* 3. Create a root stacking context to prevent z-index issues. */
  #root, #__next {
    isolation: isolate;
  }

  /* 4. Make images and media easier to work
	with using logical properties. */
  img, picture, video, canvas, svg {
    display: block;
		max-inline-size: 100%;
    block-size: auto;
  }

  /* 5. Inherit fonts for form elements. */
  input, button, textarea, select {
    font: inherit;
  }

  /* 5b. Correct the font size and
	family for preformatted text. */
  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  /* 6. Improve text wrapping and
	balancing. */
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
    /* A progressive enhancement for better typography. */
    hanging-punctuation: first last;
  }

  h1, h2, h3, h4, h5, h6 {
    /* Balances text across lines
		for better readability. */
    text-wrap: balance;
  }

  /* 7. Remove list styles on ul, ol
	elements with a role attribute. */
  ul[role='list'],
  ol[role='list'] {
    list-style: none;
  }

  /* 8. Disable animations for users
	who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    html:focus-within {
     scroll-behavior: auto;
    }

    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

@layer base {
  /* un-classed HTML elements
	(typography, links) */
}

@layer layouts {
  /* page structure
	(.container, .grid) */
}

@layer components {
  /* self-contained components
	(.card, .button) */
}

@layer utilities {
  /* high-specificity helper classes
	(.visually-hidden) */
}

/* Styles outside of layers
will have precedence over anything else */
```
