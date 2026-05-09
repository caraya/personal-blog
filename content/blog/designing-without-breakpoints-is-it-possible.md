---
title: "Designing Without Breakpoints: Is It Possible?"
date: 2026-07-08
draft: true
---

Responsive web design has always meant breakpoints. You pick a handful of viewport widths—375px, 768px, 1024px, 1280px—and write media queries to reshape your layout at each one. For most of the history of responsive design, that was the entire toolkit.

But two developments have opened up a different conversation. First, CSS container queries finally shipped in all major browsers, giving us a way to respond to container size rather than viewport size. Second, a growing body of design and engineering work argues that breakpoints are often applied too bluntly—switching layouts too early and too abruptly, leaving a lot of perfectly usable space on the floor.

This post tries to answer two questions: How many breakpoints do we actually need? And can we design and build web content without media queries at all? To answer these, we will explore the flaws of traditional breakpoints, how intrinsic CSS design offers a more fluid alternative, and why container queries fundamentally change the component model.

This discussion assumes you are already comfortable with responsive fundamentals (media queries, Grid, and Flexbox) and focuses on architecture-level decisions.

## The "too early breakpoint" problem

Ahmad Shadeed coined a useful term for a pattern that is all over the web: the too early breakpoint. The scenario is familiar—you resize a browser window a bit, and the layout immediately collapses to a narrow, stacked mobile design even though you still have several hundred pixels of available width.

This happens because developers and designers historically worked with two states—"desktop" and "mobile"—and wrote one breakpoint to flip between them. As Shadeed puts it, this implies a developer who cares about responsive design but not enough about the details.

The reality is that there is no single "desktop" or "mobile" size. Mobile devices range from narrow budget phones to massive folding screens, while desktops range from cramped 11-inch laptops to expansive ultrawide monitors. Furthermore, the binary of "desktop" and "mobile" ignores entirely the growing spectrum of devices that access the web, from tiny smartwatches and wearables to massive 4K smart TVs. A layout designed around two rigid breakpoints fundamentally fails to accommodate this vast and varied ecosystem.

The consequences are practical. Users often resize browser windows for multitasking, and split-view contexts frequently land between common breakpoint presets. iPad layouts also often fall into this middle range: not narrow enough for a phone layout, but not wide enough for a full desktop grid. A two-breakpoint design tends to handle these in-between contexts poorly.

The alternative is not necessarily more breakpoints. It is a design approach that is fluid at its core, changing incrementally rather than snapping between fixed states. This means:

* **More intermediate breakpoints**, designed intentionally rather than only as `min-width` thresholds
* **CSS Grid and Flexbox** for layouts that respond naturally to available space without needing a breakpoint to trigger the change
* **Container queries** for components that need to adapt to their placement in the layout, not just to the viewport
* **Fluid typography and spacing** using `clamp()` to scale values smoothly across a range rather than jumping at fixed widths

## How many breakpoints do we need?

There is no universal answer, but the question itself is worth reframing. The goal is not to have as few breakpoints as possible, or as many as possible. The goal is to have no layout that looks broken, compressed, or wasted at any viewport width.

One practical approach: instead of starting from predefined breakpoints, start from the content itself. Resize the viewport slowly from wide to narrow and add a breakpoint only when something actually breaks or looks wrong—not to force a layout change at a "standard" width. This produces designs with more breakpoints, but each one is earned.

Another approach leans on intrinsic layout tools so heavily that breakpoints become optional for most of the layout. CSS Grid's `auto-fill` and `auto-fit` with `minmax()` can create a grid that reflows from a multi-column arrangement to a single column without a single media query.

In the examples below, assume both grids contain exactly 7 cards and use a small minimum track size so you can see the end-gap behavior clearly on wider screens.

`auto-fill` example:

```css
.card-grid-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
  gap: 0.75rem;
}
```

`auto-fit` example:

```css
.card-grid-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  gap: 0.75rem;
}
```

While both properties create new columns as space allows, they handle extra space differently when there aren't enough items to fill the row:

`auto-fill` maintains the empty columns, leaving blank space at the end of the row. Items stop stretching once there is enough room for a new implicit column.

`auto-fit` collapses any empty columns down to zero, allowing your existing items to stretch (using the 1fr value) and completely fill the row.

For a standalone working demo, see the [design-without-breakpoints examples](../../design-without-breakpoints/).

Using this intrinsic grid pattern, your layout will hold as many columns as fit, dropping to fewer columns automatically as the viewport narrows. No breakpoint needed.

## The case for container queries

Media queries answer the question "how wide is the viewport?" Container queries answer a different, often more useful question: "how wide is this element's container?"

For a long time, this was considered impossible to implement in CSS. The core problem is circular: if a child element's CSS can change based on its parent's size, and those CSS changes affect the parent's size, you get an infinite loop of layout recalculation. The CSS Working Group declined to implement container queries for years for exactly this reason.

The solution came through the [CSS Containment API](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment). By declaring that a container's dimensions do not depend on its children (`container-type: inline-size`), you break the feedback loop. The browser can safely measure the container and let descendants query that measurement:

```css
.card-wrapper {
  container-type: inline-size;
}

.card {
  /* narrow layout */
}

@container (min-width: 30rem) {
  .card {
    /* wide layout */
  }
}
```

The inline-size value is the key choice here. It tells the browser that the element's width (its inline dimension) does not respond to its children, which makes it safe to query. The element's height still wraps its content normally—only the width is "contained." The golden rule: you can only query the dimension you have declared as contained.

### Why this changes the component model

The practical power of container queries is that components can be truly portable. A `ProfileCard` component does not need to know where it will be placed. Whether it appears in a narrow sidebar or a wide main column, it can shift between a stacked and an inline layout based on the space it actually has—not based on an assumption about the viewport.

With media queries alone, this is difficult. You can approximate it by writing breakpoints that match the specific widths your layout produces at specific viewport sizes, but those assumptions break as soon as the component moves to a different part of the page, or as the surrounding layout changes.

### Named containers

When an element has multiple ancestors with containment contexts, you can give them names and target specific ones:

```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

@container sidebar (width > 20rem) {
  .sidebar-widget {
    flex-direction: row;
  }
}
```

This makes it possible to have nested containment contexts without ambiguity.

### Container query units

Container queries also introduce a set of new length units that resolve relative to the queried container rather than the viewport:

| Unit | Meaning |
| :---: | --- |
| cqi | 1% of the container's inline size |
| cqb | 1% of the container's block size |
| cqw | 1% of the container's width |
| cqh | 1% of the container's height |
| cqmin | The smaller of cqi or cqb |
| cqmax | The larger of cqi or cqb |

These are useful for fluid typography that scales with the component rather than the viewport:

```css
@container (width > 700px) {
  .card h2 {
    font-size: max(1.5em, 1.23em + 2cqi);
  }
}
```

## Can we go without media queries entirely?

Almost, but not completely—and "almost" is the interesting part.

A layout built primarily around intrinsic CSS techniques can eliminate the majority of breakpoints. Grid with `auto-fill`/`auto-fit` and `minmax()`, Flexbox with `flex-wrap`, container queries for component-level adaptation, fluid typography with `clamp()`—together these create layouts that respond continuously to available space rather than snapping at fixed thresholds.

What remains genuinely useful for media queries:

* **Global layout changes**. Navigation patterns, sidebar visibility, and page-level structure often do need to change based on the viewport as a whole, not based on any single container. A hamburger menu at narrow viewport widths is a viewport-level concern.
* **Non-size conditions**. Media queries can respond to user preferences: `prefers-color-scheme`, `prefers-reduced-motion`, `prefers-contrast`. None of these have container query equivalents; they are global states.
* **Print stylesheets**. `@media print` remains the right tool for print-specific CSS using [Paged Media](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Paged_media).
* **Older browser fallbacks**. This is mostly a legacy concern now. Container queries have been supported since Safari 16, Chrome 105, and Firefox 110 (see [MDN browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries#browser_compatibility) and [Can I Use](https://caniuse.com/css-container-queries)), and, as of May 2026, stable browser releases are beyond those minimum versions. In practice, fallbacks are mainly needed for unusual long-tail environments (for example, legacy enterprise builds or older embedded WebViews).

### What counts as a viewport-level media query

A viewport-level media query responds to the dimensions or capabilities of the browser viewport as a whole—not to any particular element or component. These are the cases where container queries cannot substitute, because the concern is genuinely global.

The clearest examples are navigational and structural changes that depend on how much screen real estate the user has, regardless of how the page content is arranged:

```css
/* Switch to a collapsed navigation at narrow viewports */
@media (max-width: 48rem) {
  .site-nav {
    display: none;
  }

  .nav-toggle {
    display: block;
  }
}

/* Shift the overall page from a sidebar layout to a single column */
@media (max-width: 60rem) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: none;
  }
}
```

Preference-based queries are also inherently global media queries, because they reflect user or environment settings rather than anything about component layout:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #f0f0f0;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

If moving the element to a different part of the page would change whether the media query should fire, it probably belongs in a container query. If the answer is "it should fire regardless of where the element lives," it belongs in a viewport-level media query.

### Is this the same as a container query on body?

Not exactly. Querying body can look similar to a viewport query, but it is not equivalent:

* **Body width can be narrower than the viewport**. If body has a `max-width`, `padding`, or `margin`, a body container query will trigger at different points than a viewport media query.
* **Scrollbars can change the measured width**. Viewport units like `vw` track viewport size (see [viewport-percentage lengths](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths)), while layout measurements can exclude scrollbar space (see [Window.innerWidth](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth) and [Element.clientWidth](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth)).

Also, preference and environment conditions (`prefers-color-scheme`, `prefers-reduced-motion`, `@media print`, etc.) still require media queries.

## Practical guidance

If you are starting a new project or refactoring an existing layout:

* **Default to intrinsic layout first**: Use `auto-fit` or `auto-fill` with `minmax()` in Grid, and `flex-wrap` in Flexbox, before reaching for a breakpoint.
* **Add `container-type: inline-size` to wrappers that need to act as query containers**: Optimize for the component's available space, not the page width.
* **Reserve media queries for viewport-level concerns**: Navigation patterns, global spacing adjustments, preference queries.
* **Audit your existing breakpoints**: Resize your browser slowly. If a breakpoint fires and nothing looks wrong just before it, the breakpoint is too early.
* **Test continuously for the in-between**: Layouts that only look good at 375px and 1280px have a lot of unchecked territory in between. Design for fluidity rather than snapping.

## Conclusion

The realistic picture for a modern codebase: a handful of viewport-level media queries handling navigation and page structure, plus container queries handling individual component adaptation, plus intrinsic grid and flex for everything that can flow naturally. The total number of breakpoints drops considerably, and the layouts that result work at any viewport width rather than only at the widths you tested.

The goal is not to remove every media query. It is to use each one intentionally, for the concerns that are genuinely global—and to let containers, grids, and fluid values handle the rest.

## Sources

* Ahmad Shadeed, ["The Too Early Breakpoint"](https://ishadeed.com/article/too-early-breakpoint/) (January 2026).
* Josh W. Comeau, ["A Friendly Introduction to Container Queries"](https://www.joshwcomeau.com/css/container-queries-introduction/) (November 2024).
* MDN Web Docs, ["CSS Container Queries"](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) (updated March 2026).
* Can I Use, ["CSS Container Queries (Size)"](https://caniuse.com/css-container-queries) (accessed May 2026).
* MDN Web Docs, ["<length>"](https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths) (viewport-percentage lengths; updated April 2026).
* MDN Web Docs, ["Window: innerWidth property"](https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth) (for viewport width and scrollbar inclusion).
* MDN Web Docs, ["Element: clientWidth property"](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth) (for layout width and scrollbar exclusion).
