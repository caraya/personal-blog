---
title: Managing CSS support in Javascript
date: 2024-08-28
tags:
  - Javascript
  - CSS in Javascript
---

Javascript has access to the conditional CSS tools that we have to work when working directly with CSS.

This post will cover `matchMedia` (script support for media queries) and `CSS.Supports` (programmatic access to CSS' `@supports` at-rule). We will also discuss some reasons why would you want to use these Javascript functions rather than doing it straight in CSS.

When working with CSS in JS, you can leverage these methods as one-time events or inside a [change](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) event listeners to trigger new tests if the media query matches or not when building interactive web content or we're not certain of what devices will use the pages or apps we're creating.

This would make the code easier to think through and that will process these conditional rules to create the results we want.

## matchMedia and mediaQueryList

`window.matchMedia` is the JavaScript version of CSS media queries. This will allow you to run media query tests inside JavaScript.

The first example uses `window.matchMedia` to check if a CSS condition is true and, if it does, runs the specified code.

This is static, it will produce its result and will not change it unless you run the script again (or reload the page if running on the browser).

```js
if (window.matchMedia("(max-width: 480px)").matches) {
  console.log('media query matches');
}
```

The next example uses the [change](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event) event listener to change the body background color based on the viewport width.

The way this works is different from the previous example. In defining the query we're working with, we're implicitly creating a [mediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) object which will handle notifying all media queries applied to the page, with support for both immediate and event-driven matching against the state of the document.

The resulting object handles sending notifications to listeners when the media query state changes (i.e. when the media query test starts or stops evaluating to true).

This example does the following:

1. Defines the media query
2. Creates a function that tests if the media query matches and takes appropriate action
3. Adds a `change` event listener and associates the function we created in step 2 with it. The event is added to the `mediaQueryList` object, not to individual media queries

```js
const para = document.querySelector("p");
const mql = window.matchMedia("(max-width: 600px)"); // 1

function screenTest(e) {
  if (e.matches) { // 2
    /* the viewport is 600 pixels wide or less */
    para.textContent = "This is a narrow screen — less than 600px wide.";
    document.body.style.backgroundColor = "red";
  } else {
    /* the viewport is more than 600 pixels wide */
    para.textContent = "This is a wide screen — more than 600px wide.";
    document.body.style.backgroundColor = "blue";
  }
}

mql.addEventListener("change", screenTest); // 3
```

This technique makes it possible to observe a document to detect when its media queries change, and allows you to programmatically make changes to a document based on media query status.

## Supports

We can also leverage the `@supports` at-rule in Javascript using the `supports()` static method of the CSS object. This will return a boolean value indicating if the browser supports a given CSS feature, or not.

You can use this method in one of two ways:

The first form of the function takes one parameter matching the condition of @supports. For example, we can test if the browser supports `grid`.

```js
let result = CSS.supports("display: grid");
```

The second syntax allows to test the support of a pair property-value. For example, we can test if the browser supports [subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid).

```js
let result = CSS.supports("grid-template-columns", "subgrid");
```

We can also use the negation and combination operators available to `@support`.

For example, although it's not nearly as useful for current browsers, we can still test if a browser doesn't support `grid` layouts by using the `not`.

```js
let result = CSS.supports("not (display: grid)");
```

We can also combine queries, just like we do in CSS. This example tests for browser-prefixed instances of `transform-style` and the unprefixed standard version.

```js
let result = CSS.supports(
  "(transform-style: preserve) or
  (-moz-transform-style: preserve) or
  (-webkit-transform-style: preserve)",
);
```

## So why would we use these?

As with many things on the web, the answer is: **It depends**.

As Christian Heilmann writes in [CSS vs. JavaScript: Trust vs. Control](https://chrisheilmann.medium.com/css-vs-javascript-trust-vs-control-5aa33af978a6):

> I get the same impression when we talk about using CSS or JavaScript for layout. Both have their merits, both have their powers. Both have fanbases ready to dig up the most detailed information to advocate for one over the other. But I find this boring. Both used together is what brought the web forward. And it is holding us back that there are two massive camps. One end sees CSS as a thing of the past and in our module driven world we should do all in a scripting space. The other sees CSS and its preprocessors and build scripts as more than enough to do everything.

We've gone to either extreme before.

Earlier in the web's history we thought that [DHTML](https://www.yourhtmlsource.com/javascript/dhtmlexplained.html) (see also the [Wikpedia entry for DHTML](https://en.wikipedia.org/wiki/Dynamic_HTML)) would be the perfect solution. It wasn't, since it didn't address cross browser issues of the main browsers at the time (Netscape and IE).

We then swung the other way around when we started using CSS in ways that wasn't accessible or didn't work . [The checkbox hack](https://css-tricks.com/the-checkbox-hack/) is the opposite of DHTML, it uses (some would say abuses) CSS to eliminate the use of Javascript altogether.

From my perspective, neither approach is optimal. They, like the underlying technologies they use, have strengths and weaknesses and they work best when we use them for what they are best for.

When talking about using Javascript to control CSS, we can use the methods we discussed in this post in two ways:

* To generate CSS based on the results of these queries
* To add or toggle existing CSS classes based on the results of the media queries

Do we need to use Javascript every time we have applied CSS to a page? Definitely not. Is it nice to have this tool in the belt? Definitely!

<!--
## References

* [CSS vs. JavaScript: Trust vs. Control](https://chrisheilmann.medium.com/css-vs-javascript-trust-vs-control-5aa33af978a6) -->
