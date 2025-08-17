---
title: Multi Column Layouts
date: 2025-10-08
tags:
  - CSS
  - Layout
  - Web Design
---

CSS has had multi column layout capabilities for years now but I don't think many people (including me) have figured how to use them effectively.

In this post, I'll explore the various ways to create multi column layouts using CSS, basic usage, and how to make the content more readable.

## CSS Multi Column Basics

The CSS multi-column layout module lets you arrange content into multiple columns, similar to how text flows in a newspaper. It's a powerful and simple way to create magazine-style layouts without complex floats or flexbox/grid setups.

### Creating Columns

You can create columns in two primary ways: by defining the number of columns you want or by defining the width you want each column to be.

**column-count**

This property specifies the exact number of columns the content should be divided into. The browser will then figure out how wide each column should be.

```css
.container {
  column-count: 3;
}
```

**column-width**

This property defines the ideal width for the columns. The browser will create as many columns of at least this width as can fit into the available space. This makes your layout responsive by default.

```css
.container {
  /*The browser will create as many 200px columns as it can.*/
  column-width: 200px;
}
```

**columns (Shorthand)**

You can also use the shorthand `columns` property to set both `column-width` and `column-count`.

```css
.container {
  /*
		Creates 3 columns, but only if the container is wide enough to support columns of at least 150px
	*/
  columns: 3 150px;
}
```

## Styling the Gaps and Rules

You can style the space and the dividing line between columns.

Unlike Flexbox and CSS Grid, multi column layouts don't use the [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) property; instead they have their own specific attributes

[column-gap](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)

This property sets the size of the gap between columns. Multi-column layouts have their own gap property, separate from the standard `gap` property used in Flexbox and Grid.

```css
.container {
  column-count: 3;
  /* 40px gap between columns */
	column-gap: 40px;
}
```

[column-rule-width](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-width)

The property defines the width of the line between columns. This property is specific to multi-column layouts.

```css
.container {
  column-count: 2;
  column-rule-style: solid;
  column-rule-width: 10px;
}
```

[column-rule-style](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-style)

This property changes the appearance of the line. It accepts a specific list of values.

```css
.container {
  column-count: 3;
  column-gap: 20px;
  column-rule-width: 4px;
  column-rule-style: dashed;
}
```

The possible values are the same as those for border style:

* `none`: (Default) No rule is drawn. The column-rule-width is ignored.
* `hidden`: The same as none. No rule is drawn.
* `solid`: A single, solid, straight line.
* `dotted`: A series of round dots.
* `dashed`: A series of short dashes.
* `double`: Two parallel solid lines. The column-rule-width is the sum of the two lines and the space between them.
* `groove`: A 3D "carved" effect that appears to be etched into the page.
* `ridge`: The opposite of groove, creating a 3D "embossed" effect that appears to come out from the page.
* `inset`: A 3D effect that makes the content inside the columns appear depressed or sunken.
* `outset`: The opposite of inset, creating a 3D effect that makes the content appear raised.

[column-rule-color](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-color)

This property sets the color of the rule between columns. It supports any color available in CSS.

```css
.container {
  column-count: 2;
  column-gap: 20px;
  column-rule-width: 4px;
  column-rule-style: dashed;
  column-rule-color: oklch(57.1% 0.222 20.1);
}
```

[column-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule) shorthand

This property is a shorthand for [column-rule-width](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-width), [column-rule-style](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-style), and [column-rule-color](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-color).

```css
.container {
  column-count: 3;
  column-gap: 2rem;
  /* 2px blue dotted line */ column-rule: 2px dotted blue;
}
```

## Spanning Across Columns

You can make an element break out of the column structure and span the entire width of the container. This is perfect for headlines, images, or blockquotes that need to be a focal point.

**column-span**

This property makes an element span across all columns.

```css
.full-width-headline {
  column-span: all;
}
```

The possible values are:

none
: The default value. The element stays within a single column.

all
: The element spans across all columns.

When an element has `column-span: all;`, it acts as a divider. The content before the spanning element fills the columns above it, and the content after it continues filling the columns below it.

**Example: Making a headline span all columns.**

Add the `full-width-headline` class
to the headings you want to span the full width. All others headings will remain inside their columns.

```html
<div class="container">
  <p>Some text that flows into columns...</p>
  <h2 class="full-width-headline">A Sprawling Headline</h2>
  <p>More text that continues to flow below the headline...</p>
</div>
```

You can add additional styles to the spanning element to make it stand out.

```css
.full-width-headline {
  column-span: all;
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}
```

**The `column-span` property will only span across the full width of the container or not all all (all and none)**. You can't use it to specify partial span (like span 2 out of 3 columns).

### Controlling Column Breaks

Sometimes, you don't want an element—like an image with a caption, a heading, or a blockquote—to be split across two columns. You can control this using break properties.

The most common properties for this are break-before, break-after, and break-inside.

### break-inside

[break-inside](https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside)
: Controls how columns should behave inside a generated box. If there is no generated box, the property is ignored.

The possible values for this property are:

auto
: Allows, but does not force, any break (page, column, or region) to be inserted within the principal box.

avoid
: Avoids any break (page, column, or region) from being inserted within the principal box.

avoid-page
: Avoids any page break within the principal box.

avoid-column
: Avoids any column break within the principal box.

#### break-before and break-after

[break-before](https://developer.mozilla.org/en-US/docs/Web/CSS/break-before)
: Sets how columns should behave before a generated box. If there is no generated box, the property is ignored.

[break-after](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after)
: Sets how columns should behave after a generated box. If there is no generated box, the property is ignored.

The possible values are:

auto
: Allows, but does not force, any break (page, column, or region) to be inserted right before / after the principal box.

avoid
: Avoids any break (page, column, or region) from being inserted right before / after the principal box.

always
: Forces a page break right after the [principal box](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Visual_formatting_mode). The type of break will depend on the parent container. If we are inside a multicol container then it would force a column break.

avoid-column
: Avoids any column break right before/after the principal box.

column
: Forces a column break right before/after the principal box.

**Example: To prevent a figure from splitting**

We add the `no-split` class to the figure element.

```html
<div class="container">
  <p>Some text that flows into columns...</p>
  <figure class="no-split">
    <img src="your-image.jpg" alt="An example image">
    <figcaption>This caption will not be separated from its image.</figcaption>
  </figure>
  <p>More text that continues to flow...</p>
</div>
```

In the CSS code, we add the following rule to ensure that the figure doesn't split across columns.

```css
.no-split {
  break-inside: avoid;
}
```

**Example: To force a heading to start a new column:**

The following CSS snippet will force all `h3` elements with the class `new-section` to start at the top of a new column.

```css
h3.new-section {
  /*This h3 will always start at the top of a new column*/
  break-before: column;
}
```

## Improving Readability

One of the biggest problems I see with multi column layouts in web content is that it doesn't take long for the content to become unreadable.

Because web pages don't have a fixed height, the content will flow down one column, possibly causing the page to scroll, and making it difficult for users to follow the text.

We have two ways to solve this issue:

We can set a `height` on the container to create a fixed height for the columns.

```css
.container {
	column-count: 2;
  /* fixed height for the container*/
	height: 400px;
	/* Set overflow if necessary */
	overflow: auto;
}
```

The other option is to use `column-span: all` to create a full-width element that breaks the flow of the columns. The flow of text will remain the same but the columns will be shorter and will not cause reading issues if the page is long.

```css
.container {
	column-count: 2;
}

.full-bleed {
	column-span: all;
	background-color: black;
	color: white;
}
```

This will make the columns easier to read since the full-bleed element provides a visual break in the content. However, you're still responsible for ensuring that the height of the column blocks is short enough to ensure ease of reading.
