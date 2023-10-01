---
title: "CSS Houdini: Present and Future of CSS"
date: "2018-07-25"
---

> If we grow the language in these few ways \[that allow extensibility\], then we will not need to grow it in a hundred other ways; the users can take on the rest of the task. Guy Steele, [Growing a Language](http://www.cs.virginia.edu/~evans/cs655/readings/steele.pdf), 1998 ACM OOPSLA

CSS Houdini is a [set of APIs](https://drafts.css-houdini.org/) under development by the [CSS Working Group](https://www.w3.org/Style/CSS/) and the Technical Architecture Group to provide users with ways to extend CSS to match their needs. The extensibility language is usually JavaScript but some of these are written in pure CSS.

To translate the tech speak: Houdini will provide the hooks for developers to create their own content types in a performant way without having to wait for the working group to create specs for and browsers to implement.

Tab Atkins from the Chrome team presented about Houdini at CSS Day 2017. He does a much better job at explaining the APIs (expected since he's one of the editors).

<iframe src="https://player.vimeo.com/video/242890906?byline=0&amp;portrait=0" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

Surma, from the Chrome team, created [is Houdini ready yet?](https://ishoudinireadyyet.com/) as a way to track what Houdini is working on and the status of these different projects. I've grouped the table into three categories for the list below:

- Supported in (some) browser(s)
    
    - [Paint API](https://drafts.css-houdini.org/css-paint-api/)
    - [CSS Typed Object Model](https://drafts.css-houdini.org/css-typed-om/)
- Some Support
    
    - [Layout API](https://drafts.css-houdini.org/css-layout-api/)
    - [Properties & Values API](https://drafts.css-houdini.org/css-properties-values-api/)
    - [Animation Worklet](https://wicg.github.io/animation-worklet/)
- Future Looking (no specs currently available)
    
    - Parser API
    - Font Metrics API

Houdini APIs rely on Worklets, a [separate specification](https://www.w3.org/TR/worklets-1/). This spec provides the underpinnings for the other Houdini specifications.

Before we get started, it's important to know that **this is not CSS in JS!** It's a way to enhance CSS with Javascript to produce results that are impossible to produce with CSS alone, as it exists today.

## Worklets

Worklets are lightweight web workers that are better suited than the heavier workers for the kinds of work Houdini is intended for. You will see several different kinds of worklets that are specific for each API.
