---
title: Placing items in grids
date: 2024-08-19
tags:
  - CSS
  - Grid
  - Reference
---

Working with grids on web content can be as simple or as complex as you want it to be. This post will cover different ways to place content on a grid and what would you use them for. The idea is to have this post as a reference.

## Explicit positioning

With the following HTML:

```html
<div class="container">
  <div class="box box01">01</div>
  <div class="box box02">02</div>
  <div class="box box03">03</div>
  <div class="box box04">04</div>
  <div class="box box05">05</div>
  <div class="box box06">06</div>
  <div class="box box07">07</div>
  <div class="box box08">08</div>
  <div class="box box09">09</div>
  <div class="box box10">10</div>
</div>
```

This CSS lays out the grid with six equal columns; it repeats the [1fr](https://css-tricks.com/introduction-fr-css-unit/) value 6 times when defining the columns with `grid-template-columns`.

```css
.container {
  width: 60vw;
  inline-size: 60vw;

  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
}
```

We can style the boxes by styling the `box` class:

```css
.box {
  background: hotpink;
  color: white;

  display: flex;
  place-content: center;
  align-items: center;

  font-size: 3rem;
}
```

And can place individual boxes within the grid:

Using the [grid-column](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) and [grid-row](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row) shorthands we can place items in the grids we defined.

These items can span multiple columns using the [span](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column#span_integer_custom-ident_) value.

When declaring positions, positive numbers represent left to right direction. Using negative values are the inverse, right to left.

```css
.box01 {
  grid-column: 5/6;
  grid-row: 1 / span 2;
}

.box08 {
  grid-column: 1/1;
  grid-row: 4;
}

.box10 {
  grid-column: -1 / span 2;
  grid-row: 2 / 4;
}
```

This is what the code looks like in Codepen.

<iframe height="339.5302734375" style="width: 100%;" scrolling="no" title="grid placement (01)" src="https://codepen.io/caraya/embed/wvLrXmZ?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/wvLrXmZ">
  grid placement (01)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

<p></p>

!!! note <h2 style="margin-block-start:0;">Be careful</h2>
Changing the viewing order can have accessibility implications since the visual rendering of the page will be different than what screen readers will read (they will still work from the document order).

Make sure that changing the visual order will not affect the meaning of the content for people using assistive technology.

See [Reordering and Accessibility](https://drafts.csswg.org/css-grid/#order-accessibility) in the [CSS Grid Layout Module Level 2](https://drafts.csswg.org/css-grid/) draft specification
!!!

## Auto placement and implicit grids

When we don't place items on the grid they will be automatically laid out in document order, similar to what Flexbox does, but it provides some additional advantages and disadvantages.

The code has been slightly changed.

We provide two values for the gap property: The first one is the row gap and the second is the columns'.

The biggest difference is that we're sizing the implicit rows that we'll create. Using `grid-auto-rows` we tell the browser that the first and odd rows will be 100px and the second and even rows will be 200px high.

```css
.container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
	grid-auto-columns: 1fr;
  gap: 1rem 2rem;
  grid-auto-rows: 100px minmax(200px, 1fr);
}
```

This will lay out the content in as many rows and columns as necessary until all the content is displayed.

This is what the code looks like:

<p class="codepen" data-height="419.950927734375" data-default-tab="result" data-slug-hash="abgVzEe" data-pen-title="grid placement (02)" data-user="caraya" style="height: 419.950927734375px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/caraya/pen/abgVzEe">
  grid placement (02)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

### grid-auto-flow

Grid has a similar property to `flex-flow`, the `grid-auto-flow` property.

This property controls how the auto-placement algorithm works, specifying exactly how auto-placed items get flowed into the grid.

It takes one or two arguments.

If it has a single value it's either one of `row`, `column` or `dense`.

If it has two attributes then they are a combination of `row` or `column` AND `dense` (`row dense` and `column-dense`).

The possible values are

row
: Items are placed by filling each row in turn, adding new rows as necessary.
: This is the default if you don't provide a value.

column
: Items are placed by filling each column in turn, adding new columns as necessary.

dense
: This algorithm attempts to fill in holes earlier in the grid if smaller items come up later. This may cause items to appear out-of-order when doing so would fill in holes left by larger items.
: If it is omitted, a `sparse` algorithm is used, where the placement algorithm only ever moves forward in the grid when placing items, never backtracking to fill holes. This ensures that all of the auto-placed items appear "in order", even if this leaves holes that could have been filled by later items.

```css
.container {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem 2rem;
  grid-auto-rows: 100px minmax(200px, 1fr);
}
```

This example shows the auto-flow column layout.

<iframe height="540.6832275390625" style="width: 100%;" scrolling="no" title="grid placement (03)" src="https://codepen.io/caraya/embed/qBzVdqR?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/qBzVdqR">
  grid placement (03)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Template areas

Rather than relying on explicit positioning or auto-flow algorithms, we can use areas to define the layout.

The [grid-template-areas](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas) creates a row for every separate string listed, and a column for each cell in the string.

Multiple cell tokens with the same name within and between rows create a grid area that spans the corresponding grid cells. **Unless those cells form a rectangle, the declaration is invalid**.

You can refer to unnamed or empty areas in a grid using null cell tokens. A null cell token is a sequence of one or more U+002E FULL STOP (`.`) characters (`.`, `...`, or `.....`).

```css
.container {
  display: grid;
  gap: 2rem;
  grid-template-areas:
    "h h h h h h"
    "h h h h h h"
    "n m m m m m"
    "n m m m m m"
    "n m m m m m"
    "n m m m m m"
    "n m m m m m"
    "f f f f f f";
}
```

We can then assign elements to each of the areas we created in the template using the grid placement shorthands [grid-row](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row), [grid-column](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column), and [grid-area](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area).

Using nested selectors we can style children elements only within the content of the grid. The paragraphs inside the main grid area are given a specific width using the [inline-size](https://developer.mozilla.org/en-US/docs/Web/CSS/inline-size) property. This will be specific to paragraphs inside the `main` area.

```css
.container > header {
  grid-area: h;
}

.container > nav    {
  grid-area: n;
}

.container > main   {
  grid-area: m;

  p {
    inline-size: 80ch;
  }
}

.container > footer {
  grid-area: f;
}
```

This Codepen shows what a grid area layout looks like:

<iframe height="529.0453491210938" style="width: 100%;" scrolling="no" title="grid placement (04)" src="https://codepen.io/caraya/embed/vYqWNRw?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/vYqWNRw">
  grid placement (04)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Subgrid

When you add `display: grid` to a grid container, only the direct children become grid items and can then be placed on the grid you created. The children of these items display in normal flow.

You can nest grids by making a grid item a grid container. These grids are independent of the parent grid and each other, meaning that they do not take their track sizing from the parent grid. This makes it difficult to line nested grid items up with the main grid.

If you use `grid-template-columns: subgrid`, `grid-template-rows: subgrid` or both, the nested grid uses the tracks defined on the parent.

We will use this HTML for this example:

```html
<div class="container">
  <div class="box a">A</div>
  <div class="box b">B</div>
  <div class="box c">C</div>

  <div class="box featured">
    <div class="box e">E</div>
    <div class="box f">F</div>
    <div class="box g">G</div>
  </div>

  <div class="box h">H</div>
  <div class="box i">I</div>
</div>
```

```css
@supports (grid-template-columns: subgrid) {
  .container {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(100px,auto);
    background-color: #fff;
    color: #444;
  }
}
```

The `.featured` selector uses the subgrid value for both columns and rows.

```css
.featured{
  grid-column: 2 / 5;
  grid-row: 3/ 6;
  display: grid;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
```

The children of the `.featured` class element will use the parent element's column and row definition.

```css
.e {
  grid-row: 1 /2;
  grid-column: 1 ;
}

.f {
  grid-row: 1;
  grid-column: 2 / 4;
}

.g {
  grid-row: 2;
  grid-column: 2/4;
}
```

The subgrid shows how a featured article would work and how would its children line up with the rest of the grid.

<iframe height="668.6493530273438" style="width: 100%;" scrolling="no" title="grid-placement (05)" src="https://codepen.io/caraya/embed/ZEdaxKe?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/ZEdaxKe">
  grid-placement (05)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
