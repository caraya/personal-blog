---
title: Line Height Units
date: 2025-06-16
tags:
  - CSS
  - Typography
baseline: true
---

<baseline-status featureid="lh"></baseline-status>

<baseline-status featureid="rlh"></baseline-status>

Line height units are not new but not widely used yet. They provide to measure things based on the line height of an element for the current font at the current line height.

There are two line height units:

* `lh`: measured relative to the line height of the element
* `rlh`: measured relative to the line height of the root element (usually the `html` element)

The most common case of using `lh` and `rlh` is to set paragraph block (top and bottom in Latin languages) margins or paddings.

In this example, we set the paragraph block (top and bottom) margins to 1 line height of the element:

```css
p {
	margin-block: 1lh;
}
```

While fully supported in modern browsers, we can still use a fallback for browsers that don't support line height units. The fallback is to use a fixed value, such as `1em`, which is equivalent to the font size of the element. The order of the properties is important, as the browser will use the last one it supports:

```css
article {
  padding: 1em;
  padding: 1lh;
}
```

Jenn simmons created a demo of line height units in action, shown below:

<iframe height="1326" style="width: 100%;" scrolling="no" title="Demo of line using height units for paragraph margins" src="https://codepen.io/jensimmons/embed/YPKZgvX?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/jensimmons/pen/YPKZgvX">
  Demo of line using height units for paragraph margins</a> by Jen Simmons (<a href="https://codepen.io/jensimmons">@jensimmons</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The difference between `lh` and `em` (and `rlh` and `rem`) is consistency. Using `em` and `rem` looks rougher less polished, but it takes a trained eye to see the difference.

If you enable `show margins` and `show line grids` in the Codepen demo, you can see the differece between the two units.
