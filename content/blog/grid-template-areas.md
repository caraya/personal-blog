---
title: Grid template areas
date: 2025-07-23
tags:
  - CSS
  - Layout
  - Web Development
---

CSS Grid Layout changed how developers build two-dimensional layouts, moving us beyond float and table layouts. Most of the time we see grid used for positioning elements in specific areas of the grid.

This post covers grid template areas, from its basic mechanics to its applications and limitations.

## What Are CSS Grid Template Areas?

`grid-template-areas` allows you to assign human-readable names to specific regions of your grid. Instead of placing items based on abstract line numbers, you create a visual "blueprint" of your layout directly within your CSS. This approach makes your code more descriptive, readable, and easier to maintain.

Imagine building a standard webpage layout. You have a header, a main content area, a sidebar, and a footer. With grid-template-areas, you can literally draw this layout with code.

## How It Works: A Simple Two-Step Process

The magic of grid-template-areas lies in its direct relationship with the grid-area property. The implementation is straightforward:

**Name Your Items**: On each child element of your grid container, you assign a name using the grid-area property. These names are entirely up to you.

```css
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main-content { grid-area: main; }
.footer { grid-area: footer; }
```

**Draw Your Layout**: On the grid container itself, you use the `grid-template-areas` property to arrange these named items. Each quoted string represents a row, and the words within the string represent the columns. Repeating a name causes that item to span multiple cells.

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
```

In this example, we've defined a three-row grid. The header and footer each span all three columns, while the second row is split between the sidebar (one column) and main content (two columns). To leave a grid cell empty, you can use a period (`.`) as a placeholder.

## Are grid-template-columns and rows Needed?

A common point of confusion is whether you still need `grid-template-columns` and `grid-template-rows` when using `grid-template-areas`.

The technical answer is no, you don't have to define them. The browser can infer the number of rows and columns from your `grid-template-areas` definition. However, if you omit them, the track sizes will default to auto, meaning their size will be determined by the content within them. This can lead to a flimsy, unpredictable layout that is not ideal for most pages.

For this reason, it is a firm best practice to always define your track sizes explicitly. By combining these properties, you get the best of both worlds: the intuitive naming of `grid-template-areas` and the powerful sizing control of `grid-template-columns` and `grid-template-rows`.

Example:

```css
.container {
  display: grid;
  gap: 1em;
	/* Sidebar is 250px, main takes the rest */
  grid-template-columns: 250px 1fr;
	/* Header/footer fit content, main takes rest of height*/
  grid-template-rows: auto 1fr auto;

  /*MAP your named items onto the grid you just defined*/
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
}
```

## When To Use Grid Template Areas?

`grid-template-areas` shines in specific scenarios where clarity and structure are paramount.

**Complex, Asymmetrical Layouts**: For intricate designs that aren't simple, repeating grids, this feature provides a clear and organized way to define the placement of each major element.

**Responsive Design And Layout Reordering**: This is its killer feature. You can completely restructure your layout for different screen sizes inside a media query simply by redefining the grid-template-areas map. The HTML markup remains untouched, making your responsive code clean and powerful.

```css
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr; /* A single column*/
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
	}
}
```

**Prototyping and Rapid Iteration**: The visual nature of the syntax makes it an excellent tool for quickly experimenting with different layout ideas. Rearranging your layout is as simple as rearranging words in the CSS.

**Improved Readability and Maintainability**: For large projects, named areas are self-documenting. It's far easier for a new developer to understand a layout map than to decipher a complex set of grid line numbers.

## The Drawbacks

`grid-template-areas` is not a one-size-fits-all solution. Understanding its limitations is key to using it effectively.

1. **It Only Works With Rectangular Shapes**: This is the biggest constraint. An area must be a perfect rectangle. You cannot create "L" or "T" shaped areas, which forces you to use line-based placement for more complex shapes
2. **No Overlapping Elements**: The syntax does not allow grid items to overlap. If you need to stack elements (e.g., a caption over an image), you must use an alternative placement method
3. **Verbosity on Large Grids**: To be valid, every single cell in your grid must be filled with a name or a `.` token. For larger grids, this means every row definition will be long and tedious to update if you need to add or remove a track.
4. **Accessibility Risks**: The ease of reordering your layout visually comes with a significant danger. CSS does not change the HTML's DOM order. Keyboard and screen reader users navigate based on the DOM. If your visual order (from `grid-template-areas`) diverges from your DOM order, you can create a confusing and inaccessible experience. Always ensure your reading and tabbing flow remains logical.
5. **Not for Dynamic or Auto-Placed Content**: `grid-template-areas` is designed for layouts where you have a known set of items to place explicitly. It is poorly suited for situations with an unknown number of items, like a photo gallery or a list of search results. In those cases, CSS Grid's [auto-placement algorithm](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout) (`grid-auto-flow`) is the superior choice.

## Conclusion

`grid-template-areas` is a remarkable tool that brings clarity and power to layout design. By pairing it with explicit track sizing and being mindful of its limitations &mdash; especially regarding accessibility and non-rectangular shapes &mdash; you can leverage its full potential to build sophisticated and maintainable designs with confidence.
