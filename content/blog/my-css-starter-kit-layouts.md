---
title: "My CSS Starter Kit: Layouts"
date: "2016-12-19"
---

# Layouts: The Next Generation

Rather than work with floats and positioned content we'll concentrate on 3 new(ish) layout technologies: Multi column, flexbox and grid

## General considerations

The table below, taken from [Responsive Typography](http://shop.oreilly.com/product/0636920034063.do) by Jason Pamental (O’Reilly) gives an idea of the different devices sizes and the elements sizes as related to them. We’ve also put the equivalent print sizes for comparison.

|   |   | Print | Desktop (xl) | Desktop | Tablet | Phone |
| --- | --- | --- | --- | --- | --- | --- |
| Body | Font Size | 12pt | 16px (1em) | 16px (1em) | 16px (1em) | 16px (1em) |
| Line Height | 1.25 | 1.375 | 1.375 | 1.375 | 1.375 |
| Line Length | 60 - 75 | 60 - 75 | 60 - 75 | 60 - 75 | 60 - 75 |
| H1 | Font Size | 36pt (3em) | 48px (3em) | 48px (3em) | 40px (2.5em) | 32px (2em) |
| Line Height | 1.25 | 1.05 | 1.05 | 1.125 | 1.25 |
| H2 | Font Size | 24pt (2em) | 36px (2.25em) | 36px (2.25em) | 32px (2em) | 26px (1.625em) |
| Line Height | 1.25 | 1.25 | 1.25 | 1.25 | 1.15384615 |
| H3 | Font Size | 18pt (1.5em) | 28px (1.75em) | 28px (1.75em) | 24px (1.5em( | 22px (1.375em) |
| Line Height | 1.25 | 1.25 | 1.25 | 1.25 | 1.13636364 |
| H4 | Font Size | 14pt (1.667em) | 18px (1.125em) | 18px (1.125em) | 18px (1.125em) | 18px (1.125em) |
| Line Height | 1.25 | 1.25 | 1.25 | 1.222222 | 1.111111 |
| Blockquote | Font Size | 24pt (2em) | 24px (1.5em) | 24px (1.5em) | 24px (1.5em) | 20px (1.25em) |
| Line Height | 1.458333 | 1.458333 | 1.458333 | 1.458333 | 1.25 |

The length of the line and the size of the font and its line height will affect the look of the layout and the layout will affect the size of the font and its line height. This is important to keep in mind as we look at these new layout options.

## Multi Columns

We've been able to do multi column layouts for a while now but it’s only been recently, when I’ve been pushed to look at layouts beyond the holy grail that I’ve been able to look at columns and their limitations in modern browsers.

The SCSS mixin below allows us to create multiple columns (2 by default) with a 16px gap between columns, attempting to balance the content among the columns. This will create the number of columns specified, regardless of available space.

```scss
@mixin column-attribs ($cols: 2, $gap: 1em, $fill: balance, $span: none){
  // How many columns?
  column-count: $cols;
  // Space between columns
  column-gap: $gap;
  // How do we fill the content of our columns, default is to balance */
  column-fill: $fill;
  // Column span, defaul is not to span columns */
  column-span: $span;
}
```

Columns are a prime candidate to use autoprefixer. I have removed the prefixed attribute in my working code and will only prefix the attributes as needed in the build phase. It is important that you test this thoroughly in your target browsers.

We first import the mixin into our master style sheet. Then we call it using syntax like this:

```scss
/* Column predefined classes */
.cols-2 {
  @include column-attribs(2, 2em);
}

.cols-3 {
  @include column-attribs(3);
}
```

The first class will create two column text with 2em between columns. This will take all available space which may look bad in larger displays.

The second class will create a three column box using all the available screen space. This may not look as intended on phones or other small form factors. Again, test in your target devices and consider using media queries to adjust the layout to fewer or no columns in those smaller devices.

There is an attribute that uses specific width as the basis for the columns. We can modify the `column-attribs` mixin to use columns of a specific width. I will take out the prefixed versions of the values to avoid confusion. They will be prefixed at build time.

`fixed-column-attribs` uses the `column-width` attribute to take a fixed width value (default is 15em) and create as many columns as can possibly fit on screen with a 1em gap between them.

```scss
@mixin fixed-column-attribs ($col-width: 15em, 
                             $gap: 1em, $fill: balance, $span: none){
  // How many columns?
  column-width: $col-width;
  // Space between columns
  column-gap: $gap;
  // How do we fill the content of our columns, default is to balance */
  column-fill: $fill;
  // Column span, defaul is not to span columns */
  column-span: $span;
}
```

These are the basics, we’re not covering all of the multi column specifications. In particular we’re not covering how to do column separators between columns.

## Flexbox

Flexbox is one of the new CSS modules finalized recently. It has a long and checkered story. There are 3 different implementations for browsers throughout its history. We wil only work with the [standard as specified](https://www.w3.org/TR/css-flexbox-1/)

We define 4 different mixins for flexbox declarations. The forward mixins work by creating a flex layout that goes “with the grain” of the layout (left to right in rows) and top to bottom in columns) where the back mixins go against the grain in the reverse direction.

The SCSS mixins look like this:

```scss
    @mixin flex_row_forward() {
      display: flex;
      flex-flow: row wrap;
    }

    @mixin flex_row_back() {
      display: flex;
      flex-flow: row-reverse wrap;
    }

    @mixin flex_column_forward() {
      display: flex;
      flex-flow: column wrap;
    }

    @mixin flex_column_back() {
      display: flex;
      flex-flow: column-reverse wrap;
    }

    @mixin flex_item() {
      display: flex;
      flex: 1 1 auto;
    }
```

We then use the mixins to generate classes. The idea is to provide basic flexbox functionality without loosing the flexibility of adding additional functionality. The classes look like this:

```scss
.flexbox-row-forward {
  @include flex_row_forward();
}

.flexbox-row-back {
  @include flex_row_back();
}

.flexbox-col-forward {
  @include flex_column_forward();
}

.flexbox-col-back {
  @include flex-column_back();
}

.flex-item {
  @include flex_item();
}
```

The class definitions produce the following CSS. We can then add additional rules to the class selectors depending on what additional needs our project has.

```scss
    .flexbox-row-forward {
      display: flex;
      flex-flow: row wrap;
    }

    .flexbox-row-back {
      display: flex;
      flex-flow: row-reverse wrap;
    }

    .flexbox-col-forward {
      display: flex;
      flex-flow: column wrap;
    }

    .flexbox-col-back {
      display: flex;
      flex-flow: column-reverse wrap;
    }

    .flex-item {
      display: flex;
      flex: 1 0 auto;
    }
```

## Grids

I’m really excited about grids. They provide a native alternative to systems like 960.gs, Foundation and Bootstrap when it comes to laying out the content of our sites.

I consider grids part of a bespoke design process that is harder to learn than what we’ve covered so far. Rather than provide full templates I will work through an example layout matching the image below, as close as possible.

![](images/mock1.png)

We’ll use the following mixins to generate the grid and place items on it.

```scss
@mixin generate-grid($columns: 12, $gap: 10px) {
  display: grid;
  grid-gap: #{$gap};
  grid-template-columns: repeat(#{$columns}, 1fr);
  grid-template-rows: 1fr;
}
```

The `generate-grid` mixin will create the grid itself. By default it’ll create a 12 equal columns and add 10 pixel gaps between columns. The idea is that we can create flexible grids bigger or smaller than 12 columns depending on your design needs and how you want to position the content.

Each row will take 1 fraction of the height of the page.

The `generate-grid` mixin is not responsive by default. To make it responsive we need to modify it slighty to provide both minimum and maximum for each column.

```scss
@mixin generate-fluid-grid($min-size: 300px, $max-size: 1fr, $gap: 10px) {
  display: grid;
  grid-gap: #{$gap};
  grid-template-columns: repeat(auto-fill, #{$min-size}, #{$max-size});
  grid-template-rows: 1fr;
}
```

`generate-fluid-grid` will create as many columns that are at least `min-size` (300 pixels by default) and no larger than `max-size` (1fr by default). This is similar on how we work with flexbox.

The `place-item` mixin is used to place an element in a specific position.

```scss
@mixin place-item($col_start: 1, $col_end: 1, $row_start: 1, $row_end: 1) {
  grid-column: #{$col_start} / #{$col_end};
  grid-row: #{$row_start} / #{$row_end};
}
```

This will place content on the grid using column/rown placement. Essentially, the mixin will tell the browser the column start/end and row start/end position. We can then add additional CSS attributes to the item we’re placing.

For Grid I will insist on using [Feature Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) to make sure that browsers support the feature before going crazy with it. It would look something like this:

```css
@supports (display: grid) {
  /* Put all the rules to work with grids here */
}
```

and use it like this to generate a 12 column grid with a 10 pixel gap between columns using the mixin’s default values:

```scss
@supports (display: grid) {

    .wrapper {
       @include generate-grid();
    }
}
```

we’ll place the item indicated by class `box1`with the following data

- Column start (1)
- Column end (2)
- Row Start (1)
- Row End (3)

```scss
.box1 {
  @include place-item(1, 2, 1, 3);
}
```

This will produce the following CSS. Note that I’ve added a general `boxes` class to style all boxes at the same time with color (and size) and other generic attributes.

```css
    .grid-wrapper {
      display: grid;
      grid-gap: 10px;
      grid-template-columns: repeat(15, 1fr);
      grid-template-rows: 1fr;
    }

    .boxes {
      background-color: #663399;
    }

    .box1 {
      grid-area: 1 / 2;
      grid-row: 1 / 3;
    }
```

Now back to our example layout. We’ll create a media query to test for devices larger than 760px and create a 12 column grid.

I’m really excited to get (native) grids to browsers. It opens some seriously cool layout possibilities and my dream of doing magazine style layouts of the web become a real posibility.

We can create asymetrical column layouts. Our columns can have different widths and different heights and we can let the layout dictate the way we code and style our documents.

It is also possible to mix layouts using Flexbox, 3D work, transitions and animations and other web and CSS technologies with Grid. For example you can create a masthead using Flexbox and place that mastead in the top row of a Grid and place additional content below the masthead.

Or we could create a magazine like spread where the images overlap the text or viceversa and where we use columns to layout the content.

They may not match 100% the source material but will be much closer to what we’ve dared do until now.

## Still missing: regions

This one is a gripe. We don’t have a way to tie different portions of our layout. If you’ve worked on with inDesign this is equivalent to threading frames.

A few years ago there were proposals for CSS Regions. Because of a desire for technical purity from Håkon Wium Lie and performance issues from David Baron the proposal along with some early implementations in WebKit and Blink are not in active development (and the implementation Adobe contributed to WebKit was removed from Blink due to performance reasons) but it meant that a very promising feature is now missing from the web.

Imagine, if you will, a design where content is placed in different blocks and, in an ideal world, they would flow from top left and into other boxes until either all boxes are filled or the content has been placed.

There are new proposals for region-like functionality. Stay tuned
