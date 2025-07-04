---
title: HTML Web Components
date: 2024-12-02
tags:
  - Design
  - Web Components
  - Evaluation
---

When evaluating web components for the blog, I also came around a different idea.  Can we build web components that don't want to use shadow DOM? Would it make sense to do so?

Another element to look at is to build web components for some aspects of the blog using either bare bones web components that eschew the shadow DOM, or libraries like Lit, Wired Elements or Shoelace/Web Awesome.

The basic idea is this:

1. Create a web component
2. Insert the content in the component's light DOM
3. Evaluate if styling is appropriate or not

## Hand Written Web Components

Most of the time when I see web components in a page, I see this:

```html
<my-component></my-component>
```

Until this component initializes with the `connectedCallback` lifecycle callback there is not content displayed on the page. If the component is not initialized then nothing will display on the page.

Likewise, if we use shadow DOM or templates and the page is not initialized or the Javascript fails to load then there will be no content displayed on the page.

But what happens if we just load HTML inside the web component? Do we still need to initialize it via Javascript?

Asking the question Jeremy Keith has asked in his presentations about technology ***How well do web components fail?***

Using the `super-slider` component from [Eric Meyer's post](https://meyerweb.com/eric/thoughts/2023/11/01/blinded-by-the-light-dom/), let's look at the element itself. Instead of leaving it bare we insert the children directly into the HTML, in the light DOM if you want, and use web component lifecycle methods to wire the necessary scripting.

The HTML looks similar to what we'd do instead of using a web component. We just wrap a web component

```html
<super-slider unit="em" target=".preview h1">
	<label for="title-size">Title font size</label>
	<input id="title-size" type="range" min="0.5" max="4" step="0.1" value="2" />
</super-slider>
```

We define the custom element in Javascript using a class that extends the HTML element.

The constructor is optional, but I always use it to ensure proper inheritance from the parent.

In the `connectedCallback` we initialize the component and its children.

finally we match the Javascript with the custom element name using the `define` method of the [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) interface.

```js
class superSlider extends HTMLElement {
	constructor() {
    super();
  }

	connectedCallback() {
    let targetEl = document.querySelector(this.getAttribute('target'));
    let unit = this.getAttribute('unit');
    let slider = this.querySelector('input[type="range"]');
    slider.addEventListener("input",(e) => {
      targetEl.style.setProperty('font-size', slider.value + unit);
    });
  }
}

customElements.define("super-slider",superSlider);
```

SO what's the difference between an element define like this and a traditional custom element?

It makes the page easier to understand, it provides a fallback in case the script fails to load and it provides a way to enhance the content without adding bloat to the page.

Whether you use this style of components or choose to use shadow DOM to hide content and styles inside the component, or even choose to skip web components altogether, is your choice based on what your project needs.

## Links and Resources

* [Blinded by the Light DOM](https://meyerweb.com/eric/thoughts/2023/11/01/blinded-by-the-light-dom/) &mdash; Eric Meyer
* [HTML Web Components](https://adactio.com/journal/20618) &mdash; Jeremy Keith
* [Shadow DOM is not a good default](https://buttondown.email/cascade/archive/006-shadow-dom-is-not-a-good-default/) &mdash; Robin Rendle
* [HTML Web Components](https://blog.jim-nielsen.com/2023/html-web-components/) &mdash; Jim Nielsen
* [HTML Web Components: An Example](https://blog.jim-nielsen.com/2023/html-web-components-an-example/) &mdash; Jim Nielsen
* [HTML Web Components are Just JavaScript?](https://www.oddbird.net/2023/11/17/components/) &mdash; Miriam Suzanne
* [An Attempted Taxonomy of Web Components](https://www.zachleat.com/web/a-taxonomy-of-web-component-types/) &mdash; Zach Leatherman
* [Messin’ Around With Web Components](https://www.leereamsnyder.com/web-component-and-somehow-also-js-101) &mdash; Lee Reamsnyder
* [The Elevator Pitch for Web Components](https://gomakethings.com/the-elevator-pitch-for-web-components/) &mdash; Chris Ferdinandi
* [Web Components Are Easier Than You Think](https://css-tricks.com/web-components-are-easier-than-you-think/) &mdash; John Rhea
* [Mighty Morphin’ Web Components](https://cloudfour.com/thinks/mighty-morphin-web-components/) &mdash; Tyler Sticka
* [Building an Accessible Image Comparison Web Component](https://cloudfour.com/thinks/building-an-accessible-image-comparison-web-component/) &mdash; Paul Hebert
* [Web Components as Progressive Enhancement](https://cloudfour.com/thinks/web-components-as-progressive-enhancement/) &mdash; Paul Hebert
* [HTML With Superpowers](https://htmlwithsuperpowers.netlify.app) &mdash; Dave Rupert
* [Let’s Talk About Web Components](https://bradfrost.com/blog/post/lets-talk-about-web-components/) &mdash; Brad Frost
