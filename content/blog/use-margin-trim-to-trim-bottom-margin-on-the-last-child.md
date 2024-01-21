---
title: "Use margin-trim to trim the bottom margin on the last child"
date: 2024-01-17
tags:
  - CSS
  - Notes
---

When writing CSS one of the most annoying and repeating tasks is having to customize the styles for the last element in a list or other repetitive components.

I've lost track of how many times I've had to tweak code like the code shown below where we override the `margin-block-end` or `margin-bottom` property on the last child element to remove the padding or margin.

```css
.child {
  margin-bottom: 2rem;
  border: 1px solid red;
  width: 50vw;
  padding-block: 1rem;
  padding-inline-start: 2rem;
}

.child:last-child {
  margin-block-end: 0;
}
```

It's tedious and, potentially, error-prone. I may forget to add it or the `last-child` element may have other attributes that conflict with the necessary margin removal.

That's where `margin-trim` comes in.

Using this property allows the container to trim the margins of its children where they adjoin the container's edges. Note that `margin-trim` uses logical property names for the possible attribute values; if we change the writing direction then the area that will get compressed when we use start or end attributes will change.

To make this work we place code in two `@supports` blocks. The first one covers when the browser **doesn't** support `margin-trim`.

If this is the case we reveal our warning message that the browser doesn't support `margin-trim` and we set the `margin-block-end` property on the last child element.

```css
@supports not (margin-trim: block-end) {
  .warning {
    display: block;
  }

  .child:last-child {
    margin-block-end: 0;
  }
}
```

The second feature query will match if the browser supports `margin-trim`. If the browser supports `margin-trim`, we add the attribute to the `card` element.

This will have the same effect on browsers that support `margin-trim` with less code and easier to read.

```css
@supports (margin-trim: block-end) {
  .card {
    margin-trim: block-end;
  }
}
```

The possible values for `margin-trim` are:

none
: The container will not trim the children's margins

block
: Removes the block children's margins in the block axis without affecting the margins provided to the container

block-start
: Removes the margin of the first block child with the container's edge to zero

block-end
: Removes the margin of the last child block with the container's edge to zero.

inline
: Removes the block children's margins in the inline axis without affecting the inline margins provided to the container

inline-start
: Removes the margin between the container's edge and the first inline child

inline-end
: Removes the margin between the container's edge and the last inline child
