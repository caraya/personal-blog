---
title: New Features in CSS Multi-Column Layout
date: 2026-03-23
tags:
  - CSS
  - Multi-Column Layout
  - Web Design
  - Future CSS
---

A significant limitation of CSS multi-column layouts has been the restricted control over content flow between columns. While developers can set the number of columns, their width, and the gaps between them, controlling how content breaks and wraps remains a challenge.

Previously, the primary way to influence multi-column behavior was to set a fixed height on the parent container. This approach is often impractical because content might not fit within a specified height, causing columns to overflow the container.

This post covers two features in the CSS Multi-Column Layout Module Level 2 specification that address these limitations: column-height and column-wrap. These features provide solutions for managing content flow and wrapping in complex layouts.

!!! warning Warning:
These features are part of the CSS Multi-Column Layout Module Level 2 specification, which is currently a working draft. Browser support is limited or non-existent. Verify compatibility before using these features in production.
!!!

## The Challenge of Content Flow

In current multi-column layouts, content flows from one column to the next based on the container's height. If content exceeds that height, it overflows, often leading to awkward visual breaks.

If you do not set a height for the container, the columns default to the height of the viewport (or taller), which can hinder readability and navigation. Developers typically work around this by using headers or images that span the full width of the container to manually break the text flow.

## New Multi-Column Features

The Level 2 specification introduces two properties to provide more granular control: column-height and column-wrap.

!!! note Note:
Although these properties appear in the editor's draft, major browsers have not yet implemented them. Furthermore, an ongoing GitHub discussion regarding whether both properties are necessary suggests the attributes may change before the specification is finalized.
!!!

### Column Height

The column-height property allows you to set a specific height for the columns themselves. This enables you to control the height of each column independently of the content inside it.

This differs from setting the container's height because it allows the columns to maintain a consistent height even if the parent container expands to accommodate other elements.

### Column Wrap

The column-wrap property controls how content wraps between columns. With this property, you can specify whether content should wrap to the next column upon reaching the end of the current one, or continue flowing within the same column until it reaches the bottom of the container.

## Implementing the New Features

When these features become available, you can manage layouts by following these steps:

* Set the parent container height using `height` or `block-size`.
* Define the height of individual columns using `column-height`.
* Apply `column-wrap` to prevent content from overflowing the container.
* Add background colors or borders to columns for visual debugging.

## Example Layout

The following HTML and CSS demonstrate the intended use of these Level 2 features.

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
/* Note: This CSS utilizes features not yet supported by most browsers */
.container {
  block-size: 800px;
  inline-size: 80vw;

  /* Level 2 features */
  column-width: 250px;
  column-height: 300px;
  column-wrap: wrap;
}

.columns {
  margin-block-end: 4rem;
  padding: 2rem;
  border: 1px solid black;
}
```
