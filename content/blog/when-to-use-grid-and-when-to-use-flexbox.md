---
title: "When to use Grid and when to use flexbox"
date: "2023-01-25"
---

With flexbox and grid supported in all major browsers, I see variations of these questions asked a lot: what should I use, flexbox or grid? or which one is better flexbox or grid?

The question is deceptively simple, the answer is anything but.

The answer is: ***It depends. Grid and flexbox serve different purposes***.

## Flexbox

Flexbox works on one axis, either rows or columns but not on both axes at the same time.

Whether it's a row flexbox layout

```css
.wrap {
  display: flex;
  flex-flow: row wrap;
}
```

Or a column flexbox layout

```css
.wrap {
  display: flex;
  flex-flow: column wrap;
}
```

You can only add content to it, you cannot place content in specific cells, particularly those that haven't been created yet. Flexbox will only generate new rows or columns when there is content available to fill the new cells.

## Grid

Grid, on the other hand, is a two-dimensional layout system. You can create as many rows and columns as you want and can place content in any of these "cells"

By default, Grid layouts will populate based on the number of columns that you have created and will add as many "rows" as necessary to place all the items.

```css
.wrapper {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  grid-gap: 10px;
}
```

Unlike Flexbox, we can place items in specific locations inside the grid, even if the rows have not been created yet.

In the example, below, we've placed the item represented by `.box2` in the third column, and the second row, spanning one row. The placement also spans multiple columns.

```css
.wrapper {
  width: 600px;
  display: grid;
  grid-template-columns: repeat(6, 100px);
  grid-auto-rows: 200px;
  grid-gap: 10px;
}

.box2 {
  grid-column: 3 / 6;
  grid-row: 2 / 3;
  outline: 2px solid red;
}
```

The following example produces similar results to what we can get with flexbox. It also introduces grid-specific concepts and terminology that is useful in understanding what it does

`minmax`
: Specifies both the minimum and maximum values for the item measured
: The size will not be smaller than the minimum size
: The size will not be larger than the maximum size

`auto-fill`
: Fits as many items matching the specified dimensions as possible
: Will create empty tracks to fill the viewport, even if there is no content to put in them

`auto-fit`
: Fits available content to the viewport
: Removes empty space generated by empty tracks

```css
.wrapper {
  display: grid;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(150px, auto);
}
```

The final detail that is worth mentioning is how to handle children inside grid items.

When you add `display: grid` to a grid container, only the direct children become grid items and can then be placed on the grid that you have created. The children of these items display in normal flow.

You can "nest" grids by making a grid item a grid container. These grids are independent of each other and are difficult, if not impossible, to align with the parent grid.

If you set the value `subgrid` on `grid-template-columns`, `grid-template-rows`, or both, instead of creating a new track listing the nested grid uses the tracks defined on the parent.

The next example defines three elements:

The `.grid` element defines the parent grid.

The `.item` child places the content inside the `.grid` parent and declares subgrids for both columns and rows.

The `.subitem` child of `.item` would not normally be placed using the grid algorithm. Since we used `subgrid` in the `.item` definition, the items in the children will use the same dimensions as the `.grid` grandparent.

```css
.grid {
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(4, minmax(100px, auto));

  border: 2px solid #f76707;
  border-radius: 5px;
  background-color: #fff4e6;

}

.item {
  display: grid;
  grid-column: 2 / 7;
  grid-row: 2 / 4;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;

  border: 2px solid #ffa94d;
  border-radius: 5px;
  background-color: rgba(255 0 255 / .25);
}

.subitem {
  grid-column: 3 / 6;
  grid-row: 1 / 3;

  background-color: rgb(40 240 83/.5);
}
```

The final decision will depend on your project and what you're comfortable with.
