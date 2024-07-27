---
title: Understanding the gap property
date: 2024-08-05
tags:
  - Gap
  - Grid
  - Flexbox
---

The gap property has evolved considerably and has become easier to work with.

This post will discuss the evolution of creating gaps in content and how to use the `gap` property.

In the early days of CSS, we would use the [margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) property

* When one value is specified, it applies the same margin to all four sides
* When two values are specified, the first margin applies to the top and bottom, and the second to the left and right
* When three values are specified, the first margin applies to the top, the second to the right and left, and the third to the bottom
* When four values are specified, the margins apply to the top, right, bottom, and left in clockwise order

More recently we gained [logical properties and values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values) that will consider writing mode and direction when deciding how to use margins.

The table below shows the equivalency of logical properties and Western, Latin languages (top to bottom, left to right writing mode)

| Logical Property | Physical Property |
|:---: | :---: |
| margin-block-end | margin-bottom |
| margin-block-start | margin-top |
| margin-inline-end | margin-right |
| margin-inline-start | margin-left |

We would, sometimes, have to deal with margin collapse, where top and bottom margins would be consolidated to a single value representing the largest of the two.

In [The Gap](https://ishadeed.com/article/the-gap/), Ahmad Shadeed explores this topic and covers some of the things we should be looking at when working with them before jumping into Gap and how to best use it.

Some of the areas he covers:

Component layout
: Most of the time you will change margins when the layout of a component changes, either because you changed the direction or because you added or removed items in the component.

Accounting for the last child elements
: When working with vertical margins (`top` and `bottom` or `inline-block-start` and `inline-block-end`) in Latin and top-to-bottom languages you have to account for the top margin in the first child and the bottom margin in the last

Dynamic content
: We can’t predict when to add or remove a space. We will likely end up with multiple CSS breakpoints to manage spacing when the content wraps into a new line.

Bidirectional margins
: When building a layout that needs to work with both left-to-right (LTR) and right-to-left (RTL) layouts, the margin should be flipped.
: This would require additional code and potentially new media queries to make it work.

## Enter Gap

The [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) property controls the gaps or gutters between rows and columns in [multi-column](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_multicol_layout), [flex](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout) or [grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout) containers.

The `gap` property is more complex than I first thought. How many values it takes and how it works depends on where you're using it

## Using the gap property in grids

When used in grid containers, the gap property takes one or two values.

The first value defines the gutter between rows, and the second defines the gutter between columns.

the first example uses two values for the `gap` attribute, the first one for rows and the second one for columns.

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem 1rem;
}
```

This is what the display looks like:

<iframe height="556.9302978515625" style="width: 100%;" scrolling="no" title="gap in grid (1)" src="https://codepen.io/caraya/embed/jOjVBXG?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/jOjVBXG">
  gap in grid (1)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The second example uses one single value. It will represent **both** column and row gaps.

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3rem;
}
```

And it looks like this. Note how the row and column gaps are the same size.

<iframe height="554.3192138671875" style="width: 100%;" scrolling="no" title="gap in grid (2)" src="https://codepen.io/caraya/embed/abgBWzx?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/abgBWzx">
  gap in grid (2)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Using the gap property in flex containers

When defining a flex container, the `gap` property takes two values. what these values represent depends on the direction. Flex items are laid out in either rows or columns depending on the value of the `flex-direction` property.

For rows (`row` or `row-reverse`) the first value defines the gap between flex lines, and the second value defines the gap between items within each line.

For the gap between lines to make sense the layout must wrap the content. Otherwise, there will be no lines for the gap property to work with.

```css
.container {
  display: flex;
  flex-flow: row wrap;
  gap: 2rem 1rem;
}
```

The result, with additional styles for the items, looks like the Codepen below:

<iframe height="531.48876953125" style="width: 100%;" scrolling="no" title="gap in flex rows" src="https://codepen.io/caraya/embed/oNrYGVY?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/oNrYGVY">
  gap in flex rows</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

For columns (`column` or `column-reverse`), the first value defines the gap between flex items within a flex line, and the second value defines the gaps between each flex line.

We must specify a height for the container for the gap attribute to work. Otherwise, it produces one row that will scroll down until there are no more elements available.

```css
.container {
  display: flex;
  flex-flow: column wrap;
  gap: 4rem 1rem;

  height: 50vw;
}
```

For some reason, the embedded Codepen will not render the same as the [page](https://codepen.io/caraya/pen/JjQbOGb) on the site.

Note that the number sequence is vertical with three numbers per column or the remaining available values.

## The gap property in multi-column

The `gap` property in multi-column containers takes a single value that defines the gap between columns.

We can add dividing lines to the space between columns using the `column-rule-style` property or `column-rule` shorthand.

This example adds a gap between columns and a 10-pixel blue double line between columns.

```css
.container {
  column-count: 2;
  gap: 10rem;
  column-rule: 10px double blue;
}
```

The code looks like this:

<iframe height="619.3575439453125" style="width: 100%;" scrolling="no" title="gap in multi-column layouts" src="https://codepen.io/caraya/embed/zYVoRGe?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/zYVoRGe">
  gap in multi-column layouts</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Closing thoughts

The gap attribute is useful if you know how to use it. Be careful and make sure that your layouts work across your target browsers.
