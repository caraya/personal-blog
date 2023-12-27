---
title: SVG is good, really
date: 2024-06-30
draft: true
---

SVG is an interesting technology.

It is XML-based but it's still in use, and somewhat actively developed, today.

It uses XML-like markup but it is designed to create graphics.

It has a more powerful set of features than the equivalent CSS. Yes you can do filters in CSS but CSS filters are nowhere near as powerful as the equivalent SVG.

SVG trades verbosity and complexity for power. Yes, as we'll see writing SVG filters is more complex, but they are more flexible in what they allow you to do.

There are two versions of the SVG specification. Version 1.1 is the evolutionary decendant of the original SVG specification. There was an attempt at an updated, called SVG Tiny 1.2 but it doesn't appeaar to have gone anywhere and is now connsidered deprecated. The current work is done in the SVG 2.0 specification, in Candidate Recommendation status since 2018.

This post will look at two parts of SVG and how we can use them to improve our web content.

1. The SVG viewport
2. SVG Filters


The work of Sara Soueidan

[SVG Filters series](https://www.sarasoueidan.com/blog/svg-filters-series/)

Her "Understanding SVG Coordinate Systems and Transformations" three-part series:

* [The viewport, viewBox, and preserveAspectRatio](https://www.sarasoueidan.com/blog/svg-coordinate-systems/)
* [The transform Attribute](https://www.sarasoueidan.com/blog/svg-transformations/)
* [Establishing New Viewports](http://sarasoueidan.com/blog/nesting-svgs)
