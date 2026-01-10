---
title: New Features in CSS Multi-Column Layout
date: 2026-03-23
tags:
  - CSS
  - Multi-Column Layout
  - Web Design
  - Future CSS
---

One of the biggest drawbacks of using multi column layouts in CSS has been the limited control over how content flows between columns. We could set the number of columns, their width, and the gap between them, but controlling how content breaks and flows was a challenge.

The only way to influence how multi column layouts behaved was by manually setting the height of the parent container which wasn't always practical or optimal since we don't always know if the content will fit withing the specified height we created and columns would overflow the parent container.

This post will cover two upcoming features in the CSS Multi-Column Layout Module Level 2 specification that address these limitations: `column-height` and `column-wrap`. These features solve the prolems of content flow and wrapping in multi column layouts.

!!! warning  **Warning:**
These features are part of the CSS Multi-Column Layout Module Level 2 specification which is, at the time of writing this post, a working draft. As such, browser support may be limited or non-existent. Always check for compatibility before using these features in production.
!!!

## The Problem with Content Flow in Multi-Column Layouts

When you create a multi-column layout using CSS, the content flows from one column to the next based on the height of the container. If the content exceeds the height of the container, it overflows and can lead to awkward breaks in content.

However, if you don't set a height for the container, the content will flow from one column to the next, but the columns will be as tall as the viewport, if not taller... making it hard to read and hard to navigate through. This is why we break the content with headers, images or other elements that span the full width of the container and break the flow of text.

## New Multi-Column Features

CSS Multi-Column Layout Module Level 2 introduces two new properties that give us more control over how content flows in multi-column layouts: `column-height` and `column-wrap`.

!!! note  **Note:**
Although the properties appear in the CSS Multi-Column Layout Module Level 2 editor draft, they are not yet implemented in any major browsers.

There is also an ongoing GitHub discussion [Do we need column-wrap as well as column-height](https://github.com/w3c/csswg-drafts/issues/11754) regarding the need for both elements, so the attributes may evolve in incompatible ways before it is finalized.
!!!

### Column Height

The [column-height](https://drafts.csswg.org/css-multicol-2/#ch) property allows us to set a specific height for the columns in a multi-column layout. This means that we can now control how tall each column is, regardless of the content inside it.

This is different from setting the height of the container because it allows developers to set the height of the columns independently of the container's height

### Column Wrap

[column-wrap](https://drafts.csswg.org/css-multicol-2/#cwr) allows us to control how content wraps between columns. With this property, we can specify whether content should wrap to the next column when it reaches the end of the current column or if it should continue flowing in the same column until it reaches the bottom of the container.

## How to use these features

You can now do the following:

- Set the height of the parent container using `height` or `block-size`.
- set the height of the `.columns` class using `column-height`.
- Use `column-wrap` to control if columns wrap rather than overflowing.
- For visual inspection, add a background color or border to the columns.

This is the HTML for the example layout. Note the two divs with the `columns` class that will be styled as multi-column layouts.

!!! warning **Warning:**
Note that this is not yet supported in any major browsers, so you will not see the expected results if you try to run this code today.
!!!

```html
<div class="container">
  <div class="columns block1">
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo repellat earum accusamus molestias quam. Facilis laborum aperiam, optio quod fugit, nesciunt laudantium iure, voluptatibus exercitationem saepe error. Tempora, rem dolores?</p>
    <p>Deserunt, qui non ipsam cumque sunt omnis facilis pariatur. Mollitia possimus quod beatae doloribus quidem reprehenderit nisi fugiat odio cum perferendis excepturi ex repellendus nostrum ducimus, veritatis officia vel earum.</p>
  </div>

  <div class="columns block2">
    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corporis ab ratione praesentium aliquam, perspiciatis vel iure laudantium. Cupiditate maxime, exercitationem dicta fugiat iure explicabo libero voluptate iusto tempore, labore officiis.</p>
    <p>Recusandae quasi vero sed deserunt dolor fugiat! Iste sint, fugit magni tenetur, eum voluptatum nisi, voluptates eveniet quia minima similique libero. Suscipit eligendi corporis debitis, voluptates deserunt inventore ab est!</p>
  </div>
</div>
```

```css
.container {
  block-size: 800px;
  inline-size: 80vw;

  column-width: 250px;
  column-height: 300px;
}

.columns {
  margin-block-end: 4rem;
  padding: 2rem;

  border: 1px solid black;
}
```
