---
title: "Revisiting Critical CSS"
date: 2023-12-06
tags:
  - Performance
  - CSS
  - Third-Party Tools
---

Crtical CSS is simple in theory but not so much in execution.

In this post we'll look at what critical CSS is, how does it work and whether it's still necessary for all use cases.

## What is Critical CSS

Critical CSS is the CSS and assets necessary to render the above the fold content for a given page.

You inline this bit of CSS inside a `style` tag in the head of the document and load the document like you normally would.

## How does it work?

Critical CSS works in three stages

1. Identify the CSS that goes above the fold
   1. Depending on how you're building your site you can use tools like:
      * [grunt-critical](https://github.com/bezoerb/grunt-critical)
      * Gulp with the [Critical library](https://github.com/addyosmani/critical)
      * [html-critical-webpack-plugin](https://github.com/anthonygore/html-critical-webpack-plugin)
      * [eleventy-critical-css](https://www.npmjs.com/package/eleventy-critical-css)
2. Inline the CSS you created in step 1 into a `style` element in the head of your document. Most of the tools that generate the critical CSS will inline it for you
3. Load the remaining CSS like you normally would

The idea is that, by inlining the above the fold CSS, we've reduced the number of requests that it takes to show the users content, so it'll appear to load faster.

## Is it still necessary?

There are a few questions I have still left unanswered

How many critical paths are there?
: Should we create different versions of the critical path for each class of device we're targetting?

How careful do we need to be on the size of the critical path window?
: If we decide to go with multiple critical path values then how do we implement it?
: How do we insert each individual critical CSS styles into the page so they won't conflict with each other?

How does critical CSS interact with service worker caches?
: If you precache the CSS in your service worker's cache, is critical CSS still relevant since the file is being pulled from the cache rather than the network?

## Links and resources

* [Critical Library](https://github.com/addyosmani/critical) by Addy Osmani
* [Understanding Critical CSS](https://www.smashingmagazine.com/2015/08/understanding-critical-css/)
* [Implementing Critical CSS on your website](https://nystudio107.com/blog/implementing-critical-css)
* [Should you use Critical CSS?](https://wpjohnny.com/should-you-use-critical-css/)
