---
title: "The difference between visual and document order"
date: "2018-03-19"
---

One of the things that I've always been curious about, and that didn't become an issue until I started working with accessibility, is the difference between the logical or document order of your content and the visual order it's displayed in.

This is what we do when working with Media Queries to adapt layouts to different form factors, we change the visual order of the content without altering the order of the content in the document or the [semantics](http://html5doctor.com/lets-talk-about-semantics/) that we've assigned to elements in the content.

![Example of an accessibility tree from Google Web Fundamentals](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/treestructure)

Example of an accessibility tree from [Google Web Fundamentals](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree)

In addition to the DOM, the browser generates an accessibility tree based on a subset of the DOM and passes that accessibility tree to assistive technology devices like screen readers. This is why the document order and the ability to work without CSS are important: ***Screen readers don't care about the visual order of your document or what CSS you styled the content with. It cares that the semantics are appropriate and it reads the content as is, not as you meant to create it***.

So, when we talk about document order I worry about accessibility. When we talk about the visual order I talk about device accommodations and media queries adaptations.

## Useful Links

* [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG/)
* [Rich Internet Applications 1.1](https://www.w3.org/TR/wai-aria-1.1/)
* [How People with Disabilities Use the Web: Overview](https://www.w3.org/WAI/intro/people-use-web/)
* [Web Accessibility Perspectives](https://www.w3.org/WAI/perspectives/)
* [Google Web Fundamentals: Accessibility](https://developers.google.com/web/fundamentals/accessibility/)
* [Google Web Fundamentals: Introduction to Semantics](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/)
* [Google Web Fundamentals: Introduction to ARIA](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/)
