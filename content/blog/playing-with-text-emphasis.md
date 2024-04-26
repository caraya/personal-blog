---
title: Playing With text-emphasis
date: 2024-04-29
tags:
  - CSS
  - Design
  - Experiments
---

Sometimes it's nice to put some sort of emphasis on our text to highlight elements or because we just want it to look different.

One way to create these highlights is to use the [text-emphasis](https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis) property.

This property will add the chosen character or symbol on top of the text, one instance on top of each character of the text.

The `text-emphasis` property is a shorthand for [text-emphasis-style](https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis-style) and [text-emphasis-color](https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis-color). There is also a [text-emphasis-position](https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis-position) property that controls the position of the emphasis related to the text.

If there is not enough space to place the emphasis characters in their desired position, the line height will be increased until it fits.

We will use the first example to cover the possible values provided by the property.

```css
.demo01 {
  text-emphasis: filled double-circle oklch(0.66 0.26 356);
}
```

The first value is either `filled` or `open`:

filled (default)
: The shape is filled with solid color. If neither filled nor open is present, this is the default.

open
: The shape is hollow.

The second value is the shape to use. Either a pre-defined shape or a Unicode character.

dot
: Display small circles as marks.

circle (default)
: Display large circles as marks.
: This is the default shape in horizontal writing modes when no other shape is given.

double-circle
: Display double circles as marks.

triangle
: Display triangles as marks. The filled triangle is '▲' (U+25B2), and the open triangle is '△' (U+25B3).

sesame
: Display sesames as marks. The filled sesame is '﹅' (U+FE45), and the open sesame is '﹆' (U+FE46).
: This is the default shape in vertical writing modes when no other shape is given.

string
: Display the given Unicode string as the marks. **Authors should not specify more than one character when using strings as values. Using more than one grapheme cluster may cause unexpected results since browsers may truncate or ignore strings consisting of more than one grapheme cluster**.
: This is better explained in [Atoms of text: code points, JavaScript characters, grapheme clusters ](https://exploringjs.com/impatient-js/ch_strings.html#atoms-of-text)

The third value is a CSS color. Be mindful not to convey meaning through color alone and to work with a color space that is supported by your target users.

## Examples

`demo02` and `demo03` show combinations of filled and open, different types of built-in marks, and colors in different color spaces.

```css
.demo02 {
  text-emphasis: open double-circle oklch(0.66 0.26 356);
}

.demo03 {
  text-emphasis: filled sesame rebeccapurple;
}
```

`demo06` shows how can change the position of the marks to below the text. However, you must ensure that the marks will not be confused with underlines that distinguish links from regular text.

```css
.demo06 {
  text-emphasis: open double-circle oklch(0.66 0.26 356);
  text-emphasis-position: under;
}
```

`demo07` and `demo08` use the same emoji character. When using emoji characters we can skip adding the fill and color attributes since these are defined in the emoji grapheme cluster.

```css
.demo07,
.demo08 {
  text-emphasis: '🔥';
}
```

In `demo08` we apply the class to a `span` element so the emphasis will appear on part of the line. We can also apply the class to multiple sections of the element to highlight different areas.

```html
<p class="demo07">This is the example paragraph we want to use</p>

<p>This is the <span class="demo08">example paragraph</span> we want to use</p>
```

## Final Notes

This post has concentrated on Latin languages where we don't have any special characters like Ruby and other special signifiers.

Asian languages should be more careful when using `text-emphasis` since the emphasis characters may conflict with Ruby characters and other specially placed characters.

## Links and Resources

* [text-emphasis](https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis) &mdash; MDN
* [Spicing up text with text-emphasis in CSS](https://www.amitmerchant.com/spicing-up-text-with-text-emphasis-in-css/)
