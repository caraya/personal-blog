---
title: CSS Grid Template Areas
date: 2026-02-11
tags:
  - CSS
  - Web Development
  - Layout
---

grid-template-areas is a CSS property that provides a visual, intuitive way to define grid layouts. It represents a paradigm shift in how developers approach layout design: instead of counting column lines, calculating spans, and doing mental math to size items, you create a semantic "map" of your layout directly in your CSS code using named areas.

This post will explore the concept of grid-template-areas in depth, covering:

- What grid-template-areas are
- How they work
- Important rules and common pitfalls
- A comparison with traditional line-based placement
- Real-world examples demonstrating their power

## What Are They?

grid-template-areas allow you to assign human-readable names to specific rectangular sections of your grid—names like "header", "sidebar", "main-content", or "advert". Once named, you can place items into those sections simply by referencing the name.

It effectively turns your CSS code into a visual ASCII-art representation of the actual web page layout. When you look at the code, you don't just see numbers and percentages; you see the shape of the interface itself. This bridges the gap between the design file (like Figma or Sketch) and the codebase, making the stylesheet a source of truth that is legible even to non-developers.

## How Do They Work?

The implementation involves a two-step "handshake" process between the parent container and its children.

### Step 1: Name the Children

First, you must identify the direct children of your grid container that you wish to place. You do this using the grid-area property. The value you assign is a custom identifier—it can be almost any word you choose, provided it doesn't contain spaces.

Note: These names are not strings (they don't use quotes in the child property) and they are distinct from HTML classes or IDs, though keeping them consistent with your class names is a best practice for maintainability.

```css
.header-element {
  grid-area: header;
}
.sidebar-element {
  grid-area: nav;
}
```

### Step 2: Draw the Map

Once the children have names, you define the layout on the parent container using grid-template-areas. This property accepts a series of strings.

Each string represents one row.

Each word inside the string represents one column.

A space separates the columns.

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 100px auto 100px;

  /* The Layout Map */
  grid-template-areas:
    "header header"   /* Row 1: Header spans both columns */
    "nav    main"     /* Row 2: Nav on left, Main on right */
    "footer footer";  /* Row 3: Footer spans both columns */
}
```

By aligning the words vertically in your code (as shown above), you create a map that visually matches the browser's output.

## Crucial Rules & Common Pitfalls

While grid-template-areas is powerful, it is strict. Failing to follow these rules will often cause the entire grid definition to break or be ignored by the browser.

1. Areas Must Be Rectangular

You cannot create L-shaped or T-shaped single areas. Every named area must form a perfect rectangle.

**Valid**: A 2x2 square, a 1x4 strip.

**Invalid**: A shape that spans 3 columns in row 1, but only 1 column in row 2.

If you need a non-rectangular shape (like an L-layout), you must compose it using multiple distinct rectangular areas.

2. Every Cell Must Be Filled

Your map must be complete. You cannot leave a "hole" in your string definition. If you want an empty cell where no content appears, you must use a period character (.) or a series of dots (...) to explicitly mark it as empty.

```css
grid-template-areas:
  "header header"
  "nav    ."      /* The second column in this row is empty */
  "footer footer";
```

3. Row Consistency

Every string (row) in your definition must have the same number of tokens (columns). If your first row defines 3 columns and your second row defines only 2, the declaration is invalid.

## Comparison: Template Areas vs. Line-Based Placement

Standard Grid placement often relies on line-based placement (e.g., grid-column: 1 / 3). While powerful, this approach has downsides compared to template areas.

| Feature | Line-Based Placement (1 / 3) | Grid Template Areas ("head head") |
| :---: | --- | --- |
| Mental Model | **Abstract**. Requires calculating line numbers. "Start at line 2, end at line 4." Prone to "off-by-one" errors. | **Visual**. The code literally looks like the layout. "The header goes here." |
| Maintenance | **Brittle**. If you insert a new column at the start, you must re-calculate the line numbers for every item in the grid. | **Robust**. You simply update the "map" string. The individual children (items) rarely need to be touched. |
| Responsiveness | **Complex**. You must redefine start/end lines for every element inside every media query. | **Simple**. You usually only need to redefine the single grid-template-areas property on the parent container. |
| Empty Space | **Implicit**. Empty space is just where you didn't put anything. | **Explicit**. You must consciously design empty space using the . syntax, which leads to more intentional design. |

## Overlaying Items with Template Areas

One of the lesser-known but most powerful features of CSS Grid is that grid cells are not exclusive. You can stack multiple elements into the same named grid area. This effectively overlays them, similar to using absolute positioning, but without removing the elements from the document flow.

### How it Works

If you assign the same grid-area name to two different elements, Grid will place both of them into that same slot, stacking them on top of each other. This is incredibly useful for captions, hero headers, or badging.

### Example: Hero Image with Text Overlay

In this scenario, we want a title to sit directly on top of a background image, centered perfectly.

```html
<div class="hero-container">
  <!-- The decorative image -->
  <img src="landscape.jpg" class="hero-bg" alt="Landscape">
  <!-- The content to overlay -->
  <div class="hero-content">
    <h1>Welcome to the Grid</h1>
  </div>
</div>
```

In CSS we assign both the image and the text to the same grid area (stack) and define that area on the parent container:

```css
/* 1. Name both items the same thing: 'stack' */
.hero-bg {
  grid-area: stack;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures image covers area without stretch */
}

.hero-content {
  grid-area: stack;
  z-index: 1;         /* Ensure text sits on top of image */
  align-self: center; /* Center content vertically in the area */
  justify-self: center; /* Center content horizontally in the area */
}

/* 2. Define the single area on the parent */
.hero-container {
  display: grid;
  grid-template-areas: "stack";
}
```

By giving both the image and the text the area name stack, they both occupy the exact same coordinate space. You avoid the headaches of `position: absolute, top: 50%, transform: translate(-50%, -50%)`, and fixed heights.

## Best Use Cases for Template Areas (With Examples)

While template areas are excellent, they shine brightest in specific scenarios. Here are detailed examples of where you should prioritize using them over line-based placement.

### 1. High-Level Page Layouts (The Holy Grail)

Defining the macro structure of a page (Header, Nav, Main, Sidebar, Footer) is the classic use case. It makes the overall "skeleton" of the page immediately obvious to anyone reading the CSS file.

```css
.page-layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;

  /* The map instantly reveals the page structure */
  grid-template-areas:
    "header  header  header"
    "nav     main    aside "
    "footer  footer  footer";
}

/* Item assignment */
.header { grid-area: header; }
.nav    { grid-area: nav; }
.main   { grid-area: main; }
.aside  { grid-area: aside; }
.footer { grid-area: footer; }
```

### 2. Responsive Design Re-ordering

This is the strongest argument for template areas. When your layout needs to shift dramatically between Mobile and Desktop, you often don't need to change any other CSS properties (margins, padding, ordering) besides the grid-template-areas string.

Mobile (Single Column Stack):

```css
.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "nav"
    "content"
    "sidebar"
    "footer";
}
```

Desktop (Complex Layout):

```css
@media (min-width: 1024px) {
  .container {
    grid-template-columns: 1fr 3fr 1fr;
    /* Completely moves 'nav' to the top right and 'sidebar' to the left
       without changing HTML source order */
    grid-template-areas:
      "header  header  nav"
      "sidebar content content"
      "footer  footer  footer";
  }
}
```

### 3. Asymmetrical Layouts (Bento Grids)

For dashboard or "Bento Box" style layouts where items span irregular rows and columns, visual mapping is far superior to coordinate math. Calculating that "Widget E" needs to start at col 3 and row 2 is difficult; typing "widget-e" in the second row is easy.

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto auto;
  gap: 10px;

  /* * Widget A: Big square top-left
   * Widget B: Tall strip on the right
   * Widget C: Wide bar at the bottom
   * Widget D & E: Small fillers in the middle
   */
  grid-template-areas:
    "widget-a widget-a widget-d widget-b"
    "widget-a widget-a widget-e widget-b"
    "widget-c widget-c widget-c widget-c";
}
```

### 4. Rapid Prototyping

Because moving layout items is as simple as editing a text string, you can iterate on designs instantly. This is incredibly useful when working with a designer or client in real-time.

Version A (Sidebar Left):

```css
grid-template-areas: "sidebar content";
```

Version B (Sidebar Right):

```css
grid-template-areas: "content sidebar";
```

Version C (No Sidebar):

```css
/* Sidebar disappears from layout but remains in DOM (good for SEO/Accessibility) */
grid-template-areas: "content content";
```
