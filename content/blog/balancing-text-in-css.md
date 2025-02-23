---
title: Balancing text in CSS
tags:
  - CSS
  - Design
  - Layout
baseline: true
---

The different values for `text-wrap` provide reading experience enhancements for headings and long-form text.

This post will look at two values for the text-wrap property: `balance` and `pretty`.

## text-wrap: balance

<baseline-status
	featureId="text-wrap-balance">
</baseline-status>

`text-wrap: balance` wraps text in a way that best balances the number of characters on each line, enhancing layout quality and legibility.

Because counting characters and balancing them across multiple lines is computationally expensive, `text-warp: balance` only works for small blocks of text: six lines or less in Chromium browsers and ten lines or less in Firefox.

## text-wrap: pretty

<baseline-status
	featureId="text-wrap-pretty">
</baseline-status>

When using `text-wrap: pretty`, text is wrapped across lines at appropriate characters (for example spaces, in languages like English that use space separators), except that the user agent will use a slower algorithm that favors better layout over speed. This is intended for body copy where good typography is favored over performance (for example, when the number of orphans should be kept to a minimum).

## Comparison

The following example shows the difference between `balance` and `pretty` values for the `text-wrap` property.

<iframe height="778" style="width: 100%;" scrolling="no" title="text-wrap demo" src="https://codepen.io/caraya/embed/GgRZLKN?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/GgRZLKN">
  text-wrap demo</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Limitations

It is not a good idea to apply text-wrap balancing to your entire design. It's a wasted request, due to the six line limit, and may impact page render speed.

Instead of doing this:

```css
* {
  text-wrap: balance;
}
```

Consider applying only to the elements you want to balance:

```css
:is(h1, h2, h3, h4, h5, h6, blockquote) {
  text-wrap: balance;
}
```

The task of balancing text is not free. The browser needs to loop over iterations to discover the best balanced wrapping solution. This performance cost is mitigated by a rule, it only works for six wrapped lines and under in Chromium browsers and ten wrapped lines and under in Firefox.

Balancing text competes with the `white-space` property because they ask for opposite things (`white-space` asks for no wrapping and `text-wrap` asks for balanced wrapping). Overcome this by unsetting the white space property, then `text-wrap: balance` will work as intended.

```css
.balanced {
  white-space: unset;
  text-wrap: balance;
}
```

## Links and References

* [text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap) &mdash; MDN
* [text-wrap](https://drafts.csswg.org/css-text-4/#text-wrap) &mdash; CSS Working Draft
* [Balancing Text In CSS](https://ishadeed.com/article/balancing-text-css/)
