---
title: "CSS logical property shorthand attributes"
date: "2022-12-07"
---

CSS [logical properties](https://publishing-project.rivendellweb.net/working-with-logical-properties-and-writing-modes/) provide a way to style elements based on the direction the language is written in (left to right, right to left or top to bottom).

## Defining terms

To better understand logical properties, we need to work with the following terms:

**Block dimension**

The dimension perpendicular to the flow of text within a line, i.e., the vertical dimension in horizontal writing modes, and the horizontal dimension in vertical writing modes

For standard English text, it is the vertical dimension.

**Inline dimension**

The dimension parallel to the flow of text within a line, i.e., the horizontal dimension in horizontal writing modes, and the vertical dimension in vertical writing modes.

For standard English text, it is the horizontal dimension.

## Shorthands

In addition to being aware of writing modes, logical properties provide shorthand attributes that are not available with physical properties.

For example, setting margins require from one to four attributes \\depending on how you set them up.

1. When you provide one value:
    
    1. All margins have the same value
2. When you provide two values
    
    1. First value is for top and bottom margins
    2. Second value is for the left and right margins
3. When you provide three values:
    
    1. The first value applies to the top
    2. The second value applies to the right and left margins
    3. the third value applies to the bottom margin
4. When you provide four values the margins apply in the following clockwise order:
    
    1. Top
    2. Right
    3. Bottom
    4. Left

```css
.example {
  /* 1 */
  margin: 2em;
  /* Equivalent to */
  margin-top: 2em;
  margin-right: 2em;
  margin-bottom: 2em;
  margin-right: 2em;

  /* 2 */
  margin: 2em 4em;
  /* Equivalent to */
  margin-top: 2em;
  margin-left: 4em;
  margin-bottom: 2em;
  margin-right: 4em;

  /* 3 */
  margin: 2em 4em 2em;
  /* Equivalent to */
  margin-top: 2em;
  margin-left: 4em;
  margin-bottom: 2em;
  margin-right: 4em;

  /* 4 */
  margin: 2em 5em 2em 4em;
  /* Equivalent to */
  margin-top: 2em;
  margin-left: 5em;
  margin-bottom: 2em;
  margin-right: 4em;
}
```

But there is no way to specify physical properties to only identify the right and left or top to bottom margins together in a single attribute.

However, using logical properties, we can specify block and inline margins using one or two attributes.

1. If you provide one value
    
    1. The value applies to both the start and end values
2. If you provide two values
    
    1. The first one applies to the start value
    2. The second one applies to the end value

This example uses [margin-block](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block) and provides equivalencies to both individual logical styles and physical styles used for English.

```css
.example {
  /* 1 */
  margin-block: 2em;
  /* Equivalent to */
  margin-block-start: 2em;
  margin-block-end: 2em;
  /* For English equivalent to */
  margin-left: 2em;
  margin-right: 2em;

  /* 2 */
  margin-block: 4em 2em;
  /* Equivalent to */
  margin-block-start: 4em;
  margin-block-end: 2em;
  /* For English equivalent to */
  margin-left: 4em;
  margin-right: 2em;
}
```

We can do the same with [margin-inline](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline) to control the inline axis of content, or top to bottom in English and any number of other properties.

## Available properties

The following is a list of properties that use the behavior described in this post with links to the corresponding entry in [MDN](https://developer.mozilla.org/).

- [border-block](https://developer.mozilla.org/en-US/docs/Web/CSS/border-block)
- [border-inline](https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline)
- [margin-block](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block)
- [margin-inline](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline)
- [padding-block](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block)
- [padding-inline](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline)
- [inset-block](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block)
- [inset-inline](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline)

**Note** When you provide more than one value for these properties, the first value will be for the start position based on direction and writing mode. It is always a good idea to test these properties to make sure that they are actually doing what you want them to.

For more information see the [CSS Logical Properties and Values Level 1](https://w3c.github.io/csswg-drafts/css-logical/#position-properties) specification and the [CSS Logical Properties and Values](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties) list in MDN.
