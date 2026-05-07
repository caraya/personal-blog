---
title: "Be Careful With Font Families Fallback"
date: 2026-07-01
tags:
  - Web
  - CSS
  - Fonts
draft: true
---

When we use web fonts, we often specify a font using the `font-family` at-rule. This allows us to specify a list of fonts that the browser should try to use, in order of preference. If the first font isn't available, the browser will try the next one, and so on, until it finds a font that is available on the user's system.

However, when we specify a font override in a child element, it can break the fallback mechanism of the `font-family` property.

This post will explore how font family fallback works in CSS, and how to avoid common pitfalls that can lead to unexpected results.

## Presenting The Problem

When we specify a font family in CSS, we typically import it using a `@font-face` rule, and then use it in our styles. For example:

```css
@font-face {
    font-family: "Inter Variable";
    src: url("InterVariable.ttf");
    font-weight: 100 900;
}
```

Then, we can use this font in our styles with one or more fallback fonts and, ideally, a generic font family as a last resort:

```css
body {
    font-family: "Inter Variable", sans-serif;
    /* Other Styles */
}
```

For the rest of this post, we'll pair [Inter Variable](https://rsms.me/inter/) with [Bricolage Grotesque](https://ateliertriay.github.io/bricolage/) for headings.

When we define a font family on a child element, we need to be careful. If we specify a font family on a child element that doesn't include the same fallback fonts as the parent, we can end up with unexpected results. For example, what would happen if we don't specify a fallback font for the `h1` element, like in this example?


```css
body {
    font-family: "Inter Variable", sans-serif;
    /* Other Styles */
}

h1 {
    font-family: "Bricolage Grotesque";
    /* Other Styles */
}
```

## `font-family` Fallbacks Are Self-Contained

Contrary to what we might expect, if the "Bricolage Grotesque" font fails to load for some reason, the browser will not fall back to the `font-family` declaration on the parent; so it won't use "Inter Variable" or "sans-serif"; instead, it will fall back to the browser's default serif font, likely Times New Roman or a similar font.

The declaration says  says: My `font-family` is "Bricolage Grotesque". And that’s all it says. It doesn't say: My `font-family` is "Bricolage Grotesque", and if that fails, fall back to the nearest ancestor's `font-family` declaration.

It doesn't say: My `font-family` is "Bricolage Grotesque", and if that fails, fall back to "system-ui, sans-serif", this is show in the following example:


```css
/* The fallback happens inside the h1 declaration */
h1 {
	font-family: "Bricolage Grotesque";
}

body {
  font-family: system-ui, sans-serif;
}
```

## The Solution

The solution is simple: include a full font stack in each `font-family` declaration, including the same fallback fonts as the parent. For example:

```css
:heading {
	font-family: "Bricolage Grotesque", serif;
}

:is(h1, h2, h3, h4, h5, h6) {
	font-family: "Bricolage Grotesque", serif;
}
```

## Why This Matters

At its most simple, this is a trivial visual issue: a heading defined in a sans-serif font briefly rendered in a serif font just looks wrong.

It can have real detrimental effects on Core Web Vitals: The eventual swap to the web font can have an impact on your CLS scores if there are significant differences between the web font and the system fallback.

## Conclusion

When using web fonts, it's crucial to ensure that each `font-family` declaration includes appropriate fallback fonts. This ensures that if a web font fails to load, the browser can gracefully fall back to a suitable alternative, maintaining the visual integrity of your website and providing a better user experience. Always remember to include a generic font family as the last option in your font stack to ensure that users without access to your specified fonts still see a readable typeface.
