---
title: "SVG Filters In CSS"
date: 2026-07-29
tags:
  - CSS
  - SVG
  - Design
---

Eventhough CSS provides a set of filters like `blur()`, `brightness()`, and `drop-shadow()`, SVG filters offer a much more powerful and flexible way to create complex visual effects. By defining custom filters using SVG, you can achieve unique looks that are not possible with standard CSS filters.

This post will cover how to define SVG filters and use them in CSS to enhance the web experience. It will not cover the individual filter primitives in detail, but will focus on how to set up and apply filters in a web context.

## Defining the filters

There are two ways to define SVG filters to use in CSS:

Create an inline `<svg>` element in your HTML document. Include a `<defs>` block, define your `<filter>`, and assign it a unique id. You usually hide this SVG using `style="display: none;"` so it does not take up layout space.

```markup
<svg width='0' height='0' aria-hidden='true'>
  <defs>
    <!-- filter primitives go here -->
      <filter id="wobble-effect">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.05"
          numOctaves="2"
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="5"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
  </defs>
</svg>
```

You can also define the filters in an external SVG file and reference them using a URL.  We will use the name `filters.svg` for this file. The content of the file remains the same.

Because the SVG filters use IDs to reference the filters, you can define multiple filters in the same file. Each filter **must have a unique ID** so we can reference them in CSS:

```markup
<svg width='0' height='0' aria-hidden='true'>
  <defs>
    <filter id="wobble-effect">
      <!-- filter primitives for wobble effect -->
    </filter>
    <filter id="blur-effect">
      <!-- filter primitives for blur effect -->
    </filter>
  </defs>
</svg>
```

### Hiding the SVG element

When using an inline SVG to define filters, you typically want to hide it from view.

In HTML you use attributes to set the width and height to zero, and add `aria-hidden="true"` to ensure it is ignored by assistive technologies:

```markup
<svg height="0" width="0" aria-hidden="true" id="filters">
</svg>
```

In CSS we take the addtional step of taking the SVG out of the document flow by setting its position to `fixed`:

```css
svg[aria-hidden='true'][height='0'] {
  position: fixed
}
```

## Using the filters in CSS


You would then call it in your CSS like this:

```css
.my-element {
  filter: url(#wobble-effect);
}
```

When defining the filters in an external file, the syntax in CSS changes slightly to include the file name:

```css
.my-element {
  filter: url(filters.svg#wobble-effect);
}
```

However, using an external file to store the filters faces cross-origin resource sharing (CORS) restrictions and inconsistent browser support. Inline SVGs provide the most reliable behavior so we'll use that method for the rest of this article.

### Chaining filters

You can apply multiple filters to the same element by chaining them together in the `filter` property:

```css
.my-element {
  filter: url(#wobble-effect) url(#blur-effect);
}
```
