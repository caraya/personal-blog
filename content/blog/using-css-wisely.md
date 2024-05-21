---
title: Using CSS Wisely
date: 2024-06-05
tags:
  - CSS
  - Opinion
youtube: true
draft: true
---

CSS has progressed enormously in the last few years.

This is both good and bad.

The good
: CSS has become very powerful and it has gained many new features that make design and development work easier.

The bad
: It has become hard to keep all of CSS in your head and, even to know what you're looking for in references like [MDN](https://developer.mozilla.org/), [web.dev](https://web.dev/) or your favorite resource
: CSS has also evolved in both the length of the specification and the content it covers. CSS 1 was 68 pages long while CSS 2, released 2 years later, was 300 pages. After version 2 was released, the CSS Working Group (CSSWG) decided to split features into their own standalone specifications to reduce the time it would take for a feature to be part of a recommendation rather than slow down the entire specification because some features are not ready

This post will try to create a blueprint for people starting up with CSS today. It will also advocate for a less-than-pixel-perfect approach to using CSS.

This post assumes that understand the following CSS terms and how they work:

* [The Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade),
* [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
* [Importance](https://developer.mozilla.org/en-US/docs/Web/CSS/important)

## What can we do with CSS?

I know that this sounds like a weird question but bear with me for a section or two.

CSS (Cascading Style Sheets) is used to style and layout web pages. Even at this most basic level, there are a lot of things to learn

Here's a partial list of things beyond layout and formatting that you can do with CSS.

* **Animations and Transitions**: Create smooth transitions between states and complex animations for elements
* **Responsive Design**: Adapt the layout to different screen sizes and orientations using media queries
* **Pseudo-classes and Pseudo-elements**: Style elements based on their state (`:hover`, and `:focus`) or parts of an element (`::before` and `::after`)
* **Custom Properties (Variables)**: Define reusable values for properties to maintain consistency and simplify updates
* **Transformations**: Apply transformations such as scaling, rotating, and skewing to elements
* **Clipping and Masking**: Create complex shapes and control the visibility of parts of an element
* **Filters**: Apply graphical effects like blur, brightness, and contrast to elements
* **Blend Modes**: Define how an element's content should blend with its background
* **Custom Fonts and Typography**: Use web fonts, control typographic details, and implement responsive typography
* **Shapes**: Wrap text around complex shapes and **elements**
* **Variables and Calculation**: Perform calculations directly within CSS using the `calc()` function
* **Multicolumn Layouts**: Create and style text in multiple columns
* **Container Queries**: Changes the size of elements based on their parent's dimensions
* **Backdrops and Overlays**: Use `backdrop-filter` to apply effects to the background of elements
* **Scroll Snap**: Create smooth, snappable scrolling experiences for users
* **Paged Media Styles**: Define styles specifically for printed versions of webpages.

The trick is not to get overwhelmed with how many things are available, what to learn, or how to use them.

## So where do we start?


## Be The Browser's Mentor, Not Its Micromanager

<lite-youtube videoid="5uhIiI9Ld5M"></lite-youtube>

We don't have to create exactly the same layout for all browsers on all platforms and all operating systems. Instead, provide guidance and let the browser build the site in a way that if a browser doesn't support a given technology it will still work just not the same way as it would if everything was supported.

The website for the presentation is [Be The Browser’s Mentor, Not Its Micromanager.](https://buildexcellentwebsit.es/)


## Peeking at Intrinsic Web Design

Another concept that you've probably heard of is Intrinsic Web Design, coined by Jen Simmons in 2018.

<lite-youtube videoid="20QKda7IhJQ"></lite-youtube>

## CSS or Javascript?

## Links and Resources

<https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-spring-2024-edition/>

<https://developer.mozilla.org/en-US/docs/Web/CSS>
