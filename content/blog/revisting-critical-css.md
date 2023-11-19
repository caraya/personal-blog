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

The idea is that, by inlining the above the fold CSS, we've reduced the number of requests that it takes to download the page, making it faster.

## How does it work?

Critical CSS works in three stages

1. Identify the CSS that goes above the fold
   1. Depending on how you're building your site you can use tools like:
      * [grunt-critical](https://github.com/bezoerb/grunt-critical)
      * Gulp with the [Critical library](https://github.com/addyosmani/critical)
      * [html-critical-webpack-plugin](https://github.com/anthonygore/html-critical-webpack-plugin)
      * [eleventy-critical-css](https://www.npmjs.com/package/eleventy-critical-css)
2. Inline the CSS you created in step 1 into a `style` element in the head of your document
3. Load the remaining CSS like you normally would

The idea is that page will load faster with inline styles and then load whatever is not essential for the above the fold content later, after the user has something to read and interact with

## Is it still necessary?

## Links and resources

* [Critical Library](https://github.com/addyosmani/critical) by Addy Osmani
* [Understanding Critical CSS](https://www.smashingmagazine.com/2015/08/understanding-critical-css/)
* [Implementing Critical CSS on your website](https://nystudio107.com/blog/implementing-critical-css)
* [Should you use Critical CSS?](https://wpjohnny.com/should-you-use-critical-css/)
