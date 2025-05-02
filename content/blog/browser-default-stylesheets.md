---
title: Browser default stylesheets
date: 2025-05-21
tags:
  - Web
  - CSS
---

I answered a question in Quora about the default styles for a `p` element.

The answer is more complicated than it would first appear. There is no single default for HTML elements that are common to all browsers.

This post will explore the default stylesheets for the most common browsers and show what the default styles are for a `p` element.

## Where to find the default stylesheets

Before we start digging into the default styles, let's look at where to find the default stylesheets for the major browsers.

The table below shows the default stylesheets for the major browsers. The stylesheets are not always easy to find, but they are there.

| Engine | Browser(s) | URL |
| :---: | :---: | :---:|
| Gecko | Firefox | [html.css](https://searchfox.org/mozilla-central/source/layout/style/res/html.css) |
| WebKit | Safari | [html.css](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/css/html.css) |
| Blink | Chrome, Edge | [html.css](https://github.com/chromium/chromium/blob/main/third_party/blink/renderer/core/html/resources/html.css) |

## Specific browsers

We will look at the default styles for the `p` element in each of the three major rendering engines.

The `p` element is a block-level element that is used to define paragraphs of text.

### WebKit (Safari)

```css
p {
    display: block;
    margin-block: 1__qem;
    margin-inline: 0;
}
```

display: block
: Makes each `p` a block-level box (this is actually the default for `p`). It ensures the element will span the full width available and start on a new line.

margin-block: 1__qem
: Logical-property shorthand for `block-start` and `block-end` margins (i.e. top and bottom in horizontal writing modes).
: `__qem unit`: WebKit-only “quirky-em” unit. The `qem` stands for “quirky em,” a proprietary WebKit magic unit used to handle quirks-mode margin behavior.
: * In standards mode, `1__qem` behaves exactly like 1em.
: * In quirks mode, margins specified with `__qem` can collapse or be ignored (e.g., inside table cells or the reflow root), thereby mimicking older browser behaviors.

margin-inline: 0
: Logical property shorthand that sets `inline-start` and `inline-end` margins ( left and right in horizontal writing modes) to zero.

### Gecko (Firefox)

Gecko uses a similar style to WebKit but with a few differences.

It ignores the `__qem` unit and uses `em` instead.

It uses physical properties instead of local ones

```css
p {
  display: block;
  margin-bottom: 1em;
  margin-top: 1em;
}
```

display: block
: Makes each `p` a block-level box (this is actually the default for `p`). It ensures the element will span the full width available and start on a new line.

margin-bottom: 1em and margin-top: 1em
: Physical properties (margin-top, margin-bottom) always apply to the top and bottom edges of an element’s box, regardless of writing mode or text direction.


### Blink (Chrome, Edge)

Since Blink is a fork of WebKit, it has similar styles to WebKit. We'll discuss the differences below.

```css
p {
  display: block;
  margin-block-start: 1__qem;
  margin-block-end: 1__qem;
  margin-inline-start: 0;
  margin-inline-end: 0;
}
```

display: block
: Makes each `p` a block-level box (this is actually the default for `p`). It ensures the element will span the full width available and start on a new line.

margin-block-start: 1__qem and margin-block-end: 1__qem
: Rather than using the `margin-block` shorthand, Blink uses individual  `margin-block-start` and `margin-block-end` properties to set the top and bottom margins. This is a more explicit way of setting the margins.
: It uses the `__qem` unit, which is a WebKit-only “quirky-em” unit to handle quirks-mode margin behavior.


margin-inline-start: 0 and margin-inline-end: 0
: Like the block properties, Blink uses individual `margin-inline-start` and `margin-inline-end` properties to set the left and right margins rather than using the `margin-inline` shorthand. This is a more explicit way of setting the margins.

## Conclusion

All browsers produce essentially the same result for the `p` element.

* WebKit and Chrome's use of logical properties means developers have to do less work regarding writing modes
* Firefox's use of physical properties was surprising, but it makes sense since you can't change writing modes without CSS so we will override the default styles anyway.

As a final note, the font size for `p` elements can also be changed in the browswer settings. All browsers provide a way to change the default size that overrides the default stylesheet.

So, even if you don't change the styles for paragraphs, the size may not be what you expected in your design.

## References and resources

* [Browser Default Styles](https://browserdefaultstyles.com/) &mdash; A site that provides a comprehensive overview of the default styles for all browsers
* [WebKit Extensions](https://developer.mozilla.org/en-US/docs/Web/CSS/WebKit_Extensions) &mdash; A list of WebKit-specific CSS properties and values
* [WebKit CSS Value Keyword](https://github.com/WebKit/WebKit/blob/13e79e2e2f09579997106164ae66ad5499fc0a27/Source/WebCore/css/CSSValueKeywords.in) &mdash; A list of WebKit-specific CSS value keywords taken from the WebKit source code
* [User Agent Style Sheets: Basics and Samples](https://meiert.com/en/blog/user-agent-style-sheets/) &mdash; A comprehensive guide to user agent style sheets
