---
title: "Experimental Native CSS Grid Masonry"
date: 2026-04-22
tags:
  - CSS
  - Layout
  - Grid
---

Until now, creating masonry layouts on the web has required either CSS hacks or JavaScript libraries. While functional, this approach introduces additional dependencies and potential performance issues.

In 2025, the CSS Working Group began discussing native support for masonry. Following contentious debates over multiple proposals, the grid-lanes syntax reached consensus in early 2026 and is currently being prototyped in browsers.

This post covers grid lanes, how they function, and how to integrate them with traditional grids and subgrids for complex layouts.

## The problem: The "gap" in CSS grid

CSS Grid is two-dimensional; it aligns items to both rows and columns. When utilizing items of varying heights, such as a Pinterest-style board, standard grid layouts leave large empty gaps because every item in a "row" must respect the height of the tallest item in that row.

[Grid lanes](https://drafts.csswg.org/css-grid-3/#grid-lanes-model) are an addition to the CSS Grid Layout Module Level 3. This provides a native implementation of the "masonry" layout pattern, which is a popular design choice for dynamic content like image galleries, portfolios, and social media feeds.

Grid lanes allow developers to create layouts where items align perfectly in one direction (the "lanes") but flow freely and pack tightly in the other, eliminating the rigid row-and-column structure of traditional grids.

Before grid lanes, developers typically solved this using:

* **Multi-column layout**: While functional, this flows content vertically (top-to-bottom), which can break the logical reading order for users.
* **JavaScript libraries**: Scripts like [Masonry.js](https://masonry.desandro.com/) or [Isotope](https://isotope.metafizzy.co/) add heavy overhead and often cause Cumulative Layout Shift (CLS) as the script calculates positions after the initial paint.

## How grid lanes work

Grid lanes treat one axis as a set of defined tracks and the other as a "stacking" axis. Think of it like cars on a highway: the highway has set lanes (columns), but each car (content) can be a different length. Each car simply follows the car in front of it as closely as possible.

**The syntax**

To activate this layout, use the new `grid-lanes` display value:

```css
.container {
  display: grid-lanes;
  /* Define the lanes (columns) */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /* Items automatically pack into these lanes */
  gap: 16px;
}
```

### Using auto-fill versus auto-fit

While both keywords create responsive tracks without media queries, they behave differently when a container has fewer items than available space:

* **auto-fill**: The browser creates as many tracks as can fit in the container, even if some tracks are empty. This is generally preferred for grid lanes because it maintains consistent lane widths regardless of the item count.
* **auto-fit**: The browser creates the tracks but collapses any empty ones, stretching the remaining tracks to fill the entire container. In a masonry layout, this can cause lanes to become unexpectedly wide if there are only one or two items.

**Recommendation**: Use auto-fill for a predictable masonry "lane" appearance.

### Key concepts

* **Automatic packing**: Instead of moving to the "next" available cell in a row, the browser identifies the lane that is currently the "shortest" (the one with the most available space at the top) and places the next item there.
* **Flow direction**: Developers can create "waterfall" layouts (vertical lanes) using `grid-template-columns` or "brick" layouts (horizontal lanes) using `grid-template-rows`. These two flow directions are mutually exclusive within a single container; a grid can pack items vertically or horizontally, but not both simultaneously.
* **Flow tolerance**: A new property, `flow-tolerance`, controls how the browser fills gaps. Using a strict tolerance keeps items in a more natural reading order (leaving gaps if necessary), a loose tolerance packs them as tightly as possible (potentially reordering them visually), and the default `normal` value provides a pragmatic balance between the two.
* **Order sensitivity**: Unlike older masonry hacks, grid lanes respect the DOM order. This is a significant improvement for accessibility and screen readers.

## Integrating grid lanes with traditional grids

A common question is whether developers can combine grid lanes with traditional grid layouts and subgrids. Because grid lanes are an extension of the existing CSS Grid specification, developers can nest traditional grids within lanes or use subgrids to maintain alignment across complex masonry structures.

### Placing items in specific locations

The easiest way to integrate grid lanes with a standard grid is to place specific items in exact locations using `grid-column` and `grid-row`. This allows developers to create "anchor" items that break the flow of the masonry layout while still allowing other items to fill in around them.

```css
.masonry-container {
  display: grid-lanes;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.placed-item {
  /* Spans the first column */
  grid-column: 2 / 3;
}
```

Notice how the placed item (`.placed-item`) does not use a display property. It is simply placed in a specific location, and the remaining items flow around it.

### Nested traditional grids within lanes

Applications can use a standard grid container inside a grid-lanes item. This is ideal for components like cards that need internal alignment (header, body, and footer) while the cards themselves follow a masonry flow.

**TypeScript (MasonryCard.tsx)**

```ts
import React from 'react';

interface CardProps {
  title: string;
  body: string;
}

const MasonryCard: React.FC<CardProps> = ({ title, body }) => {
  return (
    <div className="card-container">
      <div className="internal-grid">
        <header className="font-bold">{title}</header>
        <p className="py-2">{body}</p>
        <footer className="text-sm text-gray-500">Read More</footer>
      </div>
    </div>
  );
};

export default MasonryCard;
```

**JavaScript (MasonryCard.jsx)**

```jsx
import React from 'react';

const MasonryCard = ({ title, body }) => {
  return (
    <div className="card-container">
      <div className="internal-grid">
        <header className="font-bold">{title}</header>
        <p className="py-2">{body}</p>
        <footer className="text-sm text-gray-500">Read More</footer>
      </div>
    </div>
  );
};

export default MasonryCard;
```

**CSS for nesting:**

```css
.masonry-container {
  display: grid-lanes;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.internal-grid {
  display: grid;
  /* Traditional 2-dimensional alignment */
  grid-template-rows: repeat(3, 1fr);
  padding: 1rem;
  border: 5px solid black;
  gap: 1rem;
  background-color: lightskyblue;
}
```

### Using subgrid within grid lanes

Subgrid allows a child element to inherit the track definitions of its parent. When used within grid lanes, a child element can "snap" to the lanes defined by the masonry container. This is useful for complex components that span multiple lanes but need internal elements to align with the overall grid lines.

```css
.masonry-container {
  display: grid-lanes;
  /* 6 lanes */
  grid-template-columns: repeat(6, 1fr);
}

.wide-feature-item {
  /* Spans 3 lanes */
  grid-column: span 3;
  display: grid;
  /* Inherits the 3-lane width from parent */
  grid-template-columns: subgrid;
}
```

While this setup correctly aligns the internal elements with the parent container, the overall visual flow may not initially match expectations due to how the masonry algorithm handles spanning items.

To understand why, developers must look at how grid lanes calculate placement:

* **Standard placement**: The browser places the first row of items in a standard left-to-right sequence. For all subsequent items, it abandons rows entirely and drops the next item into whichever individual lane is currently the shortest.
* **Spanning placement**: When an item spans multiple columns (like grid-column: span 3), the browser can no longer drop it into a single short lane. It must place the item across three adjacent lanes simultaneously.

To accomplish this spanning placement, the browser evaluates the three target lanes and pushes the spanning item down until it clears the tallest content within that specific group. This establishes a straight horizontal starting line for the top of the spanning item.

Consequently, this behavior leaves empty vertical gaps in the shorter lanes immediately above the spanning item. While the subgrid successfully aligns its internal components to the global tracks, developers must account for these vertical gaps when designing wide elements that disrupt the standard single-lane masonry flow.

## Reading order and accessibility

One of the most significant challenges with traditional masonry layouts is the disconnect between the visual order of items and the DOM (Document Object Model) order. Because masonry algorithms prioritize filling empty vertical space, an item that appears second in the HTML might be visually placed in the third column, while the third item might be placed in the first column.

A common misconception is that assistive technology strictly refers to screen readers used by individuals who are blind. Because screen readers process the raw HTML strictly from top to bottom, they actually receive the perfect, intended sequence regardless of the CSS visual layout. The accessibility failures of masonry layouts primarily affect sighted users who rely on logical visual sequences:

* **Sighted keyboard users (motor disabilities)**: Many users navigate the web visually using the Tab key instead of a mouse. Because the Tab key follows the underlying HTML DOM, a scrambled visual order causes the focus indicator to jump erratically across the screen—from the top-left, down to the bottom-right, and back up to the top-middle.
* **Screen magnifier users (low vision)**: Users who zoom into the screen at high percentages can only see a small quadrant of the viewport at any given time. If keyboard focus jumps to an item visually placed on the opposite side of the screen, the viewport is violently yanked to that new location, causing the user to completely lose their context on the page.
* **Cognitive accessibility and static text**: For users with cognitive or learning disabilities, a predictable, logical flow of information is critical. Even if a grid contains purely static text with no interactive elements, aggressively packing the items can jumble the narrative. A sighted user reading naturally (left-to-right, top-to-bottom) might visually encounter the DOM sequence as 1, 4, 2, 3, breaking the reading comprehension flow.

### Using `flow-tolerance` to preserve logical flow

The `flow-tolerance` property helps mitigate this erratic behavior by controlling how aggressively the browser packs items. It establishes a threshold for how far out of visual sequence an item can be placed just to fill a gap.

**Syntax**

```text
flow-tolerance: strict | loose | normal;
```

**Allowed values**

* **strict**: The browser strictly prioritizes the DOM (Document Object Model) reading order. It leaves vertical gaps in the layout rather than pulling an element out of sequence to fill an empty space. This is the most accessible option.
* **loose**: The browser completely ignores reading order, prioritizing a perfectly packed visual layout with minimal gaps. It aggressively reorders items to fit them together, which mimics legacy JavaScript libraries but can severely disrupt keyboard navigation.
* **normal (default)**: The browser attempts to pack items tightly but applies a baseline threshold to prevent extreme visual reordering. It offers a pragmatic balance between masonry aesthetics and logical flow.

#### CSS

```css
.masonry-gallery {
  display: grid-lanes;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;

  /* Enforce a strict reading order for better accessibility */
  flow-tolerance: strict;
}

.gallery-item {
  /* Remove default list styling */
  list-style: none;
}
```

#### HTML

When implementing this pattern, using a semantic HTML `<ul>` list ensures screen readers announce the total number of items correctly.

```html
<ul class="masonry-gallery" aria-label="Image gallery">
  <li class="gallery-item">
    <img src="photo-1.jpg" alt="A scenic mountain landscape">
  </li>
  <li class="gallery-item">
    <img src="photo-2.jpg" alt="A bustling city street at night">
  </li>
  <li class="gallery-item">
    <img src="photo-3.jpg" alt="A close-up of a blooming flower">
  </li>
</ul>
```

## Browser support and implementation

As of early 2026, the grid-lanes syntax has reached consensus within the CSS Working Group.

* **Safari/WebKit**: Offers the most advanced implementation, available in Safari Technology Preview. It includes specialized DevTools like "Order Numbers" to help visualize how items flow through lanes.
* **Firefox**: Firefox was the first to prototype masonry and is currently updating its implementation to match the finalized grid-lanes syntax.
* **Chrome/Edge**: Chromium-based browsers are actively prototyping the feature for upcoming releases. As of Chrome/Edge 140, the feature is behind the `chrome://flags/#enable-css-grid-lanes` flag.

## Summary

CSS grid lanes provide a native, high-performance method for creating dynamic layouts that adapt to content size. By combining the track-sizing power of CSS Grid with the flexibility of a one-dimensional flow, developers can finally implement masonry designs on the web platform without relying on external scripts or compromising accessibility.
