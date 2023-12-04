---
title: "Revisiting the display property"
date: 2024-01-03
tags:
	- CSS
---

The `display` property has been around for a long time but its definition has evolved over the years.

> Formally, the display property sets an element's inner and outer display types. The outer type sets an element's participation in [flow layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flow_layout); the inner type sets the layout of children.
>
> Source: [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/display)

CSS 2 made a lot of implicit assumptions when dealing with the `display` property. We can keep using them or we can adopt the more explicit behavior from the [CSS Display Module Level 3](https://drafts.csswg.org/css-display/) draft specification where you can use values for both inside and outside display values.

## display-inside and display-outside

The `display` property takes one or two values. If it uses one value, it uses the values that we're used to like:

```css
.element01 {
	display: block;
}

.element02 {
	display: inline;
}

.element03 {
	display: flex;
}

.element04 {
	display: grid;
}
```

These one-value displays have implicity defaults.

### Display outside

These keywords specify the element's outer display type, which is essentially its role in flow layout:

block
: The element generates a block box, with line breaks both before and after the element when in the normal flow.

inline
: The element generates one or more inline boxes **without** line breaks before or after themselves. In normal flow, the next element will be on the same line if there is space.

!!! note **Note:**
In browsers that support two-value syntax, `inline` and `block` are equivalent to `inline flow` and `block flow`.  If you specify an element to be block, you expect the children of the element to participate in block and inline flow layouts.
!!!

### Display inside

These display inside keywords specify the element's inner display type, which defines the type of formatting context that its contents are laid out in:

flow
: The element lays out its contents using flow layout.
: If its outer display type is `inline` or `run-in`, and it is participating in a block or inline formatting context, then it generates an inline box. Otherwise it generates a block container box.
: Depending on the value of other properties (`position`, `float`, or `overflow`) and whether it is participating in a block or inline formatting context, it either establishes a new [block formatting context (BFC)](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context) for its contents or integrates its contents into its parent formatting context.

flow-root
: The element generates a block box that establishes a new block formatting context, defining where the formatting root lies.

table
: defines a block-level box that behaves like HTML `table` elements. It .

flex
: The element behaves like a block-level element
: Lays out its content using the [flexbox model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout).

grid
: The element behaves like a block-level element
: Lays out its content according to the [grid model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout).

!!! note
Browsers that support the two-value display syntax will treat `flex` and `grid` as `box flex` and `box grid`.  If we're using grid and flex, we expect them to create block-level boxes.
!!!

### Legacy precomposed values

CSS 2 uses a single-keyword, precomposed syntax for the display property, requiring separate keywords for block-level and inline-level variants of the same layout mode.

This is what most developers are used to in addition to `inline` and `block`.

inline-block
: The element generates a block box that will be flowed with surrounding content as if it were a single inline box.
: It is equivalent to inline flow-root.

inline-table
: The inline-table value does not have a direct mapping in HTML.
: It behaves like an HTML `table` element, but as an inline box, rather than a block-level box. Inside the table box is a block-level context.
: ***It is equivalent to inline table***.

inline-flex
: The element behaves like an inline-level element and lays out its content according to the flexbox model.
: ***It is equivalent to inline flex***.

inline-grid
: The element behaves like an inline-level element and lays out its content according to the grid model.
: ***It is equivalent to inline grid***.

### Single or double values: which one to use?

Most of the time the single value properties will be fine. They are supported everywhere and they usually do what we want.

It is only when we deliberately want to deviate from the default that using display with two explicit values comes in handy.

Not all variants of the two-value display property are supported in all browsers. Look at the [support matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/display#browser_compatibility) in MDN.

## Links and References

* [Box Layout Modes: the display property](https://drafts.csswg.org/css-display/#the-display-properties) &mdash; CSS Working Draft
* [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) &mdash; MDN


