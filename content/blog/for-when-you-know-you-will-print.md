---
title: "For when you know you will print"
date: 2023-12-13
tags: [CSS, Notes]
---

There are times when we know that users will print a page of web content. Maybe a set of directions for a recipe, a map with directions or a page of information that we want to preserve.

While it's impossible to guarantee how browsers will print the document we can use the [print-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust) property to help the browser in the process.

`print-color-adjust` provides a hint to the user-agent about how it should treat color and style choices that might be expensive or generally unwise on a printer or similar device.

If user agents allow users to control this aspect of the document’s display, they take precedence over the hint provided by `print-color-adjust`.

The property has two possible values

economy
: The user agent should make adjustments to the page’s styling as it deems necessary for the output device.
: For example: if the user is printing the document, a browser might ignore any backgrounds and adjust text color to minimize ink usage.

exact
: This value indicates that the page is significant, and should not be tweaked or changed except at the user’s request.
: For example, tables in a website might "zebra-stripe" the steps, alternating between white and light gray backgrounds. Losing this zebra-striping and having a pure-white background would make the content harder to read.

Browsers must propagate the `print-color-adjust` value set on the root element (where it can affect the canvas background).

The `print-color-adjust` property doesn't propagate from the `body` element.

## Link and resources

* [print-color adjust](https://drafts.csswg.org/css-color-adjust/#print-color-adjust)&mdash; CSS Specification
* [print-color-adjust](https://developer.mozilla.org/en-US/docs/Web/CSS/print-color-adjust) &mdash; MDN
