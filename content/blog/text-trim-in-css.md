---
title: text-trim in CSS
date: 2025-02-26
tags:
  - CSS
  - Text
  - Typography
---

This post will discuss leading, how to control it in CSS and the new text-box-trim property.

Leading is the space between blocks of text; the term comes from the strips of lead that were used to separate lines of metal type.

I had a hard time wrapping my head around this concept so I did some research and came accross the following:

Consider that a typographic letter has multiple peaks.

There’s the `x-height`, which marks the top of the letter “x” and other lowercase characters (not including ascenders or overshoots), the `cap height`, which marks the top of uppercase characters (again, not including ascenders or overshoots), and the `alphabetic baseline`, which marks the bottom of most letters (not including descenders or overshoots). Then of course there’s the ascender height and descender height too.

You can trim the whitespace between the x-height, cap height, or ascender height and the “over” edge of the text box (this is where overlines begin), and also the white space between the alphabetic baseline or descender height and the “under” edge (where underlines begin if text-underline-position is set to under).

## Margins

In a TBLR (top to bottom, left to right) text, you would normally use the following CSS to control leading:

* [margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top)
* [margin-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom)
* The [margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) shorthand

Or their logical equivalents:

* [margin-block-start](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start)
* [margin-block-end](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end)
* The [margin-block](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block) shorthand

Most of the time, when you want to modify paragraph spacing, you would modify both the top and bottom margins since they are different values. However, you're modifying the margins, not really interacting with the leading itself.

This will make the box smaller or larger but will not make the text box larger than the content within. This is where the `text-box-trim` property comes in.

## text-box-trim

> The text-box-trim and text-box-edge properties in CSS enable developers to trim specifiable amounts of the whitespace that appear above the first formatted line of text and below the last formatted line of text in a text box, making the text box vertically larger than the content within.
>
> source: [Two CSS Properties for Trimming Text Box Whitespace](https://css-tricks.com/two-css-properties-for-trimming-text-box-whitespace/)


There are two related properties: `text-box-trim` and `text-box-edge` that control leading for both inline and block elements in CSS.

A potential rule that could be used to control leading in `h1` elements could look like this

```css
h1 {
  text-box-trim: both;
  text-box-edge: cap alphabetic;
}
```

### text-box-trim

On block containers, and each column of a multi-column container, `text-box-trim` specifies whether to trim half-leading at the start/end of the box’s content to better match its content edge to its text content.

On inline boxes, `text-box-trim` specifies whether to trim the content box to match the specified text-box-edge metric.

The following values are allowed:

none
: No special handling of the first/last line box when applied to a block container.
: When applied to an inline box, specifies that the over/under content edges coincide with the text-over/text-under baselines regardless of text-box-edge.

trim-start
: For block containers and column boxes: trim the block-start side of the first formatted line to the specified metric of its root inline box. If there is no such line, or if there is intervening non-zero padding or borders, there is no effect.
: For inline boxes: trims the block-start side of the box to match its content edge to the metric specified by text-box-edge.

trim-end
: For block containers and column boxes: trim the block-end side of the last formatted line to the specified metric of its root inline box. If there is no such line, or if there is intervening non-zero padding or borders, there is no effect.
: For inline boxes: trims the block-end side of the box to match its content edge to the metric specified by text-box-edge.

trim-both
: Specifies the behavior of trim-start and trim-end simultaneously.

### text-box-edge

Inline boxes, whose primary purpose is to contain text, are sized in the block axis based on their font metrics. The line-fit-edge property controls which metrics are used. These chosen metrics are used as the basis for the layout bounds of the inline box (if it is not the root inline box); and also, by default, are the metrics used for text-box-trim.

The first value specifies the text over edge; the second value specifies the text under edge. If only one value is specified, both edges are assigned that same keyword if possible; else text is assumed as the missing value.

Values have the following meanings:

leading
: Use the ascent/descent plus any positive half-leading. Margin/padding/border is ignored for the purpose of sizing the line box.

text
: Use the text-over baseline/text-under baseline as the over/under edge.

cap
: Use the cap-height baseline as the over edge.

ex
: Use the x-height baseline as the over edge.

There are also some additional values that apply to CKJ (Chinese, Korean, Japanese) text:

ideographic
: Use the ideographic-over baseline/ideographic-under baseline as the over/under edge.

ideographic-ink
: Use the ideographic-ink-over baseline/ideographic-ink-under baseline as the over/under edge.

alphabetic
: Use the alphabetic baseline as the under edge.

## Puting it all together

This looked very confusing to me so I decided to create a little demo to make it clearer beyond the example we used earlier:

```css
h1 {
  text-box-trim: both;
  text-box-edge: cap alphabetic;
}
```

THe idea, shown in the following Codepen, is that we can change the values of `text-box-trim` and `text-box-edge` for both heading and body text to see how they affect the leading of the components. Having colored backgrounds helps to see the effect of the properties.

You can also test them together, see how changing one affects the page layout. The changes are never huge but they may be enough to make a difference in the overall look of the page.

<iframe height="718" style="width: 100%;" scrolling="no" title="Playing with text-box-trim" src="https://codepen.io/caraya/embed/WbNvYWP?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/WbNvYWP">
  Playing with text-box-trim</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Links and References

* [The Thing With Lead­ing in CSS](https://matthiasott.com/notes/the-thing-with-leading-in-css)
* [CSS text-box-trim](https://developer.chrome.com/blog/css-text-box-trim)
* [Leading-Trim: The Future of Digital Typesetting](https://medium.com/microsoft-design/leading-trim-the-future-of-digital-typesetting-d082d84b202)

