---
title: Reading Flow and Reading Order
date: 2025-06-18
tags:
  - Keyboard navigation
  - Reading flow
  - Reading order
  - Tab index
baeline: true
---

Reading flow and reading order are important concepts in web accessibility, particularly for users who rely on keyboard navigation. The reading flow refers to the logical sequence in which content is presented to users, while reading order determines how that content is navigated using the keyboard.

This post will explore the reading-flow and reading-order features in Chrome, how they work and how can they be used to improve keyboard navigation and accessibility.

## Reading Flow

<baseline-status featureid="reading-flow"></baseline-status>

The `reading-flow` property modifies the reading order of elements within a block, flex, or grid container (and only on these layouts) when set to a value other than normal. Such a container is referred to as a `reading flow container`.

By default, web content is read out in DOM source order. The source order should provide a sensible reading order for the content, and be reflected in the visual order of the content layout.

However, sometimes the visual order or tab order differs from the source order. For example, using media queries to change a flexbox or grid layout to suit different device or user requirements, the content order may change based on the viewport width.  In such a case, we can use the reading-flow property to ensure the reading and tabbing order reflect the visual order.

You may wish to further fine-tune the reading order within a reading flow container using the `reading-order` property values on the container's children, putting them into groups that are read out in numerical order.

The possible values for the `reading-flow` property are:

normal *default*
: The reading order follows the document order.

flex-visual (flexbox only)
: The reading order follows the visual order of the flex items, taking the [writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode) into account. Therefore, a document in English with `flex-direction: row-reverse` and `reading-flow: flex-visual` set would have a reading order of right to left.

flex-flow (flexbox only)
: The reading order follows the `flex-flow` direction.

grid-columns (grid only)
: The reading order follows the visual order of grid items, column by column, taking the writing mode into account.

grid-rows (grid only)
: The reading order follows the visual order of grid items, row by row, taking the writing mode into account.

grid-order (grid only)
: If any of the container's children has a `reading-order`, the reading order follows the modified item order. If the order property is not applied to the grid items, `grid-order` behaves as normal.

source-order (grid, flex and block)
: The container's reading order doesn't change but it allows modifying the reading order by setting the `reading-order` property on the container's children.

## Reading Order

Reading order is used in children elements of a reading flow container to modify the reading order of those elements. It only works when the `reading-flow` property is set to a value other than `normal`.

I would normally recommend against changing the reading order of elements in a document since it can cause confusion for users who rely on screen readers or keyboard navigation. However, there are cases where it can be useful, such as when we change the layout using media queries because moving a layout from flex rows to columns or vice versa can change the reading order of the content.

### Interaction with the `tabindex` attribute

If a set of reading flow container child elements that are not normally focusable are made focusable with tabindex="0" attributes, their reading order will be modified as expected by the `reading-flow` and `reading-order` properties, in just the same way as interactive elements such as `a` or `button`.

However, any attempt to modify the tabbing order of a reading flow container's content using positive tabindex values will be overriden by `reading-flow` and `reading-order`. You generally shouldn't be using these.

See [Using the tabindex attribute](https://www.tpgi.com/using-the-tabindex-attribute/) and [Don't Use Tabindex Greater than 0](https://adrianroselli.com/2014/11/dont-use-tabindex-greater-than-0.html) for more information about positive tabindex values.

## Interaction with Keyboard Navigation

`reading-flow` and `reading-order` properties affect how keyboard navigation works in a reading flow container. When these properties are applied, the tabbing order of focusable elements will follow the specified reading order, rather than the default DOM order.

This is why we need to be careful when using these properties since they can confuse users when they are navigating a page using the keyboard and expect the tabbing order to follow the visual layout of the page.

## Links and Resources

* [Use CSS reading-flow for logical sequential focus navigation](https://developer.chrome.com/blog/reading-flow/)
* [Reading flow ships in Chrome 137](https://rachelandrew.co.uk/archives/2025/05/02/reading-flow-ships-in-chrome-137/)
* [CSS reading-flow examples](https://chrome.dev/reading-flow-examples/index.html)
* [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/tabindex) &mdash; MDN
* [Don't Use Tabindex Greater than 0](https://adrianroselli.com/2014/11/dont-use-tabindex-greater-than-0.html)
* [Using the tabindex attribute](https://www.tpgi.com/using-the-tabindex-attribute/)
