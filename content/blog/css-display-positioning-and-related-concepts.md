---
title: "CSS Display,  Positioning and Related Concepts"
date: "2023-05-03"
---

One of the hardest things for me to understand in CSS is positioning: how to position an item the way I want it on the page.

Over the years I've found out that there are multiple concepts associated with positioning:

- Display
- Box Model
- Containing Block
- Parent element
- Position
- z-index

You can also work with `perspective` in CSS but that is not part of positioning so it will not be covered in this post

## Display

The display CSS property defines an element is treated as a block or inline element and the layout used for its children, such as flow layout, grid or flex.

The traditional syntax is a single keyword. Modern browsers also support a two-keyword syntax that defines inner and outer display attributes.

The first attribute is either `block` or `inline`. This describes how the element plays in the page layout alongside other elements.

The second attribute describes the behavior of the element's children.

Until the level 3 specification was released we use a single value for display, like so:

```css
.demo {
  display: grid;
}
```

With the level 3 specification, the equivalent declaration is:

```css
.demo {
  display: block grid;
}
```

The single-value versions are still supported but may create unexpected results. If the browser sees:

```css
.demo {
  display: grid;
}
```

It will interpret it as:

```css
.demo {
  display: block grid;
}
```

This may not be what you were expecting so it pays to code defensively and include both the one-value and the two-value versions of the display property.

There are a few values for the display property that deserve special consideration:

**flow**

The element lays out its contents using flow layout (block-and-inline layout).

If its outer display type is `inline` or `run-in`, and it is participating in a block or inline formatting context, the block generates an inline box. Otherwise, it generates a block container box.

Depending on the value of other properties (such as position, float, or overflow) and whether the block itself participates in a block or inline formatting context, it either establishes a new block formatting context (BFC) for its contents or integrates its contents into its parent formatting context.

**flow-root**

The element generates a block element box that establishes a new block formatting context, defining where the formatting root lies.

**inline-block**

The element generates a block element box that will be flowed with surrounding content as if it were a single inline box (behaving much like a replaced element would).

It is equivalent to an inline flow-root.

For more details on the `display` property check MDN's [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) and [Digging Into The Display Property: The Two Values Of Display](https://www.smashingmagazine.com/2019/04/display-two-value/) for more information.

## Box model

All content it a web page is in a box. The [Box Model](https://web.dev/learn/css/box-model/) describes how these boxes surrounding the content behave and how it interacts with other content on the page.

![](https://publishing-project.rivendellweb.net/wp-content/uploads/2022/12/box.png)

CSS Box Model

There are multiple boxes around the content. They are:

**Content box**

The area where your content is displayed

size it using properties like `inline-size` and `block-size` or `width` and `height`.

**Padding box**

The padding sits around the content as white space

Size it using `padding` and related properties.

**Border box**

The border box wraps the content and any padding

Size it using `border` and related properties.

**Margin box**

The margin is the outermost layer, wrapping the content, padding, and border as whitespace between this box and other elements

Size it using `margin` and related properties.

## Position

The `position` CSS property controls how an element is positioned in a document.

The `top`, `right`, `bottom`, and `left` properties determine the final location of positioned elements. The exact effect of these properties will depend on the value of the position property.

The possible values are:

**static**

The element is positioned according to the normal flow of the document.

The top, right, bottom, left, and z-index properties have no effect. **This is the default value**.

**relative**

The element is positioned according to the normal flow of the document, and then offset relative to itself based on the top, right, bottom, and left values. The offset does not affect the position of any other elements.

This value creates a new stacking context when the value of `z-index` is not auto.

**absolute**

The element is removed from the normal document flow, and no space is created for the element in the page layout.

The element is positioned relative to its closest positioned ancestor, if any; otherwise, it is placed relative to the initial containing block.

Its final position is determined by the values of top, right, bottom, and left.

This value creates a new stacking context when the value of `z-index` is not auto.

**The margins of absolutely positioned boxes do not collapse with other margins**.

**fixed**

The element is removed from the normal document flow, and no space is created for the element in the page layout.

The element is positioned relative to the initial containing block established by the viewport, unless one of its ancestors has a `transform`, `perspective`, or `filter` property set to any value except none, or the `will-change` property is set to `transform`, in which case that ancestor behaves as the containing block.

The final position is determined by the values of top, right, bottom, and left.

This value always creates a new stacking context.

**sticky**

The element is positioned according to the normal flow of the document, and then offset relative to its nearest scrolling ancestor and containing block (nearest block level ancestor), including table-related elements, based on the values of `top`, `right`, `bottom`, and `left`.

The offset does not affect the position of any other elements.

`display: sticky` always creates a new stacking context. A sticky element "sticks" to its nearest ancestor that has a "scrolling mechanism" (created when [overflow](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) is `hidden`, `scroll`, `auto`, or `overlay`), even if that ancestor isn't the nearest actually scrolling ancestor.

## Containing block

The size and position of an element are often impacted by its containing block. It is worth exploring what makes the containing block as this will impact the position of an element on the page.

**The default containing block is the content area of the element itself.** Identifying the actual containing block is hard since it'll depend on the value of the `position` property.

1. If the position property is `static`, `relative`, or `sticky`, the containing block is the content box of the nearest ancestor that is either a `block` container (such as an `inline-block`, `block`, or `list-item` element) or establishes a formatting context (such as a `table`, `flex`, or `grid` container)
2. If the position is `absolute`, the containing block is formed by the padding box of the nearest ancestor element with a position value other than `static`
3. If the position is `fixed`, the containing block is established by the viewport (for continuous media like the browser viewport) or the page area (for paged media)
4. If the position is `absolute` or `fixed`, the containing block may also be formed by the edge of the padding box of the nearest ancestor element that has one of the following:
    
    - A transform or perspective value other than `none`
    - A will-change value of `transform` or `perspective`
    - A contain value of `paint` (e.g. `contain: paint;`)
    - A backdrop-filter other than `none` (e.g. `backdrop-filter: blur(10px);`)

## Parent Element

A related element to containing block is the parent element is the container directly above and connected to an element in the document tree.

Sometimes the parent element is the same as the containing block, but that's not always the case since the location of the containing block depends on the position attribute of the element.

## z-index

The `z-index` CSS property sets the z-order of a positioned element and its children.

![](https://publishing-project.rivendellweb.net/wp-content/uploads/2023/04/zindex.webp)

Graphical representation of z-index. Source: [Javascript in plain English](https://javascript.plainenglish.io/css-z-index-not-working-d5c068b6861)

What has helped me reason through z-index is to think of the content in the page being in layers. The `z-index` property controls how the layers interact with the higher positive values being "closer" to the user.

Something to note:

Larger elements with higher z-index values cover those smaller elements with a lower z-index.
