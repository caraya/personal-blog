---
title: What is CSS?
date: 2026-02-25
tags:
  - CSS
  - Web Development
---

Defining CSS4 is a tricky endeavor. Unlike the annual ECMAScript specifications or the monolithic releases of CSS2 and HTML5, modern CSS evolves continuously. It consists of many different modules, each with its own specification and development timeline.

This post explores how we can rethink CSS4 as a concept, approach its definition, and understand its implications for web developers.

## Historical Context

To understand why "CSS4" remains a complex topic, we must look at how the language outgrew its original structure. Before CSS, developers styled web pages using HTML attributes and tags, leading to inconsistent, fragile designs.

```html
<p><font color="red">This text is red.</font></p>
```

## CSS1 and CSS2

Håkon Wium Lie first proposed Cascading Style Sheets (CSS) in 1994. CSS separated document content (HTML) from its presentation, allowing for efficient, flexible design. Instead of embedding style information in HTML elements, CSS allowed developers to define styles in a separate stylesheet.

### The Shift to Modules

CSS2 was a massive, monolithic specification. This structure delayed releases because the W3C could not finalize the specification until every single feature reached maturity. To eliminate these bottlenecks, the CSS Working Group (CSSWG) moved to a modular approach after CSS2.

## The Industry Debate: Why Do We Need CSS4?

The desire for "CSS4" stems largely from marketing and the need for clear communication with stakeholders. As Chris Coyier explains in [CSS4?](https://css-tricks.com/css4/):

> So CSS3 was a unique one-off opportunity. Rather than one big spec, break them into parts and start them all off at “Level 3” but then let them evolve separately. That was very on purpose, so things could move quicker independently.
>
The problem? It was almost too effective. CSS3, and perhaps to a larger degree, “HTML5”, became (almost) household names. It was so successful, it’s leaving us wanting to pull that lever again.

This "marketing lever" is essential because version numbers create a sense of progress. David Rupert highlights this in [Perceived Velocity](https://daverupert.com/2019/04/perceived-velocity/):

> A single number bump replaces a mountain of marketing. Every discerning technologist knows it only makes sense to invest in technologies that are moving forward. To invest in a stagnant technology would be a dereliction of duty.

The "stagnant" perception is a real risk for professional adoption. Nicole Sullivan noted the practical business implications:

> Unpopular opinion: CSS and HTML need to increment their version numbers again so we can convince business to invest in these technologies.

### The Challenges of Re-versioning

However, marketing a version that doesn't technically exist can lead to confusion. Because CSS is modular, there is no single "Level 4" to point to. PPK argues for a more strategic, if technically "incorrect," approach in [CSS4 is here!](https://www.quirksmode.org/blog/archives/2020/01/css4_is_here.html):

> I am proposing that we web developers, supported by the W3C CSS WG, start saying “CSS4 is here!” and excitedly chatter about how it will hit the market any moment now and transform the practice of CSS.
>
> Of course “CSS4” has no technical meaning whatsoever. All current CSS specifications have their own specific versions ranging from 1 to 4, but CSS as a whole does not have a version, and it doesn’t need one, either.

## Proposed Paths for Definition

If we move toward a "CSS4" label, the community must decide what technical reality it represents.

The Snapshot Approach
: The W3C already publishes a [CSS Snapshot](https://www.w3.org/TR/css/). This includes only specifications the CSSWG considers stable. However, as it stands, it is written primarily for implementers (browser vendors) rather than authors.

The Living Standard for Developers
: Following the model of the [HTML Living Standard for Web Developers](https://html.spec.whatwg.org/dev/introduction.html), we could create a version tailored for web developers, focusing on usability and clarity over implementer precision.

> This specification is intended for authors of documents and scripts that use the features defined in this specification... More approachable tutorials and authoring guides can provide a gentler introduction to the topic.
>
> — HTML Living Standard for Web Developers

Community-Driven Baselines
: Initiatives like [Baseline](https://web-platform-dx.github.io/web-features-explorer/newly-available/), also published on MDN,  identify features supported across all major evergreen browsers (Chrome, Edge, Firefox, and Safari). This provides a "de facto" versioning system based on practical support rather than spec maturity.

## Conclusion

Ultimately, while "CSS4" might sell a technology to a stakeholder, it doesn't change how we write code. The modular reality of CSS means we must focus on feature support and browser compatibility. Whether we call it CSS4 or a "Living Standard," our goal remains the same: a robust, interoperable web.
