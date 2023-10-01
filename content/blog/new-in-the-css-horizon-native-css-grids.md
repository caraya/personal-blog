---
title: "New in the CSS horizon: (Native) CSS Grids"
date: "2016-01-25"
categories: 
  - "technology"
---

# New in the CSS horizon: (Native) CSS Grids

Grids like [960.gs](http://960.gs/), the Grids in [Bootstrap 3](https://getbootstrap.com/examples/grid/) and [Foundation](http://foundation.zurb.com/) or solutions like [SUSY](http://susy.oddbird.net/) rely on floated elements (I make the distinction between Bootstrap 3 and 4 because in 4 you can switch your layout to Flexbox.) They work but they need exact CSS and measurements for the floats to work as intended (the fact that frameworks hide the complexities of existing grid systems doesn't mean they are not there.)

The [CSS Grid Level 1 specification](http://www.w3.org/TR/css-grid-1/) is fundamentally different. When implemented grids will be baked into the browser's CSS parser and will be treated as a first class citizen. We will only have to learn one way to do grids and content layout rather than having to choose a tool that will do multiple unnecessary calculations for us.

From the spec's [Background and Motivation](http://www.w3.org/TR/css-grid-1/#background) section:

> The capabilities of grid layout address these problems. It provides a mechanism for authors to divide available space for layout into columns and rows using a set of predictable sizing behaviors. Authors can then precisely position and size the building block elements of their application by into grid areas defined by these columns and rows. Figure 1 illustrates a basic layout which can be achieved with grid layout.

## Grid or Flexbox?

If we look at examples using flexbox we'll see that we can do a lot of the same things using Flexbox than we can with Grids. So the question becomes when would you use flexbox and when would you use grids for your layout?

The best explanation I've found of these differences is in an[email from Tab Atkins](http://lists.w3.org/Archives/Public/www-style/2013May/0114.html) (editor of the Grid and Flexbox specifications) in the www-style mailing list:

> Flexbox is for one-dimensional layouts—anything that needs to be laid out in a straight line (or in a broken line, which would be a single straight line if they were joined back together). Grid is for two-dimensional layouts. It can be used as a low-powered flexbox substitute (we’re trying to make sure that a single-column/row grid acts very similar to a flexbox), but that’s not using its full power. Flexbox is appropriate for many layouts, and a lot of “page component” elements, as most of them are fundamentally linear. Grid is appropriate for overall page layout, and for complicated page components which aren't linear in their design. The two can be composed arbitrarily, so once they're both widely supported, I believe most pages will be composed of an outer grid for the overall layout, a mix of nested flexboxes and grid for the components of the page, and finally block/inline/table layout at the “leaves” of the page, where the text and content live.

## CSS Grid Terminology

- **Lines**: Lines make up the grid. These can be horizontal or vertical.
- **Tracks**: Track is the space between two Grid Lines, either horizontal or vertical
- **Cells**: Cell is the space between lines. So it is the smallest unit on our grid that is available for us to place an item into. Conceptually it is just like a table cell
- **Areas**: Area is any area on the Grid bound by four grid lines. It may contain a number of Grid Cells

## Browser support

According to caniuse.com [support for CSS Grid](http://caniuse.com/#feat=css-grid) is pretty sketchy as of right now but getting better.

- Microsoft Edge and IE 11 support an older version of the specification (closer to their original submission to W3C)
- Firefox support grids but you have to enable them in preferences by setting `layout.css.grid.enabled` to true in `about:config`
- Chrome and Opera support grids but hide them behind the `experimental Web Platform features` flag in `chrome://flags`
- Webkit supprt grids on their nightly builds but uses the `-webkit` prefix

So don't use grids in production yet but the future is not so distant when we will have grids without floats :-)

# Working example

For this example I will attempt to create a 960px wide grid and will use it as the basis for placing content and playing with media queries to change what the grid will look like.

We will use the following HTML

```
<div class="wrapper">
 <div class="box box1">A</div>
 <div class="box box2">B</div>
 <div class="box box3">C</div>
 <div class="box box4">D</div>
 <div class="box box5">E</div>
 <div class="box box6">F</div>
</div>
```

To tell the browser that we want to use the grid layout we use a new value for the display property: `display: grid`. We can then create the grid using `grid-template-column` and `grid-template-row`.

The grid will have 2 10px gutter (1 from each side) and 1 40px column area we will repeat this pattern 16 times using the `repeat` attribute of our grid.

Although we don't really need the `grid-template-row` attribute, we use it to explicitly give the rows a gutter of 10 pixels.

```
.wrapper {
 display: grid;
 grid-template-columns: 
   repeat(16, 10px 40px 10px);
 grid-template-rows: auto 10px auto;
}
```

We can then begin placing the content. It is important to realized that we have 48 column positions in each row 32 for gutters and 16 for the content cells.

Using the definition of the page's HTML content and our CSS for the grid, we can do permutations like these:

```
.box6 {
  grid-column: 2/7;
  grid-row: 1/4;
}

.box1 {
  grid-column: 2/35;
  grid-row: 5 / 6;
}

.box2 {
  grid-column: 4/12;
  grid-row: 4;
}

.box3 {
  grid-column: 2/12;
  grid-row: 7/8;
}

.box4 {
  grid-column: 2 / 6;
  grid-row: 8;
}

.box5 {
  grid-column: 36/47;
  grid-row: 2/9
}
```

The Pen at [http://codepen.io/caraya/pen/pgpeXY](http://codepen.io/caraya/pen/pgpeXY) shows what these declarations look like in an actual page.

**Things to Notice:**

One of the most frustrating things is that we can't create create implicit rows with the code we have created. In order to get rows working with this setup it appears like we have to sset up an arbitrary number of rows in our grid definition.

All elements we want to have positioned in the grid must have column and row placement definitions.

## The master class from the expert

I love Rachel Andrew and the passion that she has for Grids in CSS. Her presentation from CSS Conf EU 2014 along with her book _A pocket guide to CSS 3 Layout Modules 2nd edition_ got me interested in grids and revisiting flexbox as layout technique.

<iframe src="https://www.youtube.com/embed/GRexIOtGhBU?rel=0" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe>

## Links and resources

- [CSS Grid Specification](http://www.w3.org/TR/css-grid-1/)
- [The future of layout with css grid layouts](https://hacks.mozilla.org/2015/09/the-future-of-layout-with-css-grid-layouts/)\- Mozilla Hacks
- [Grid by Example](http://gridbyexample.com/) by [Rachel Andew](https://rachelandrew.co.uk/)
- Rachel Andrew (2015): _[Get Ready For CSS Grid Layout](http://abookapart.com/products/get-ready-for-css-grid-layout)_. New York: A Book Apart
