---
title: Web Components - You Don't Have to Reinvent the Wheel
date: 2024-07-29
tags:
  - Web Components
  - Design
  - Third-Party Code
---

This is a follow-up to [Web Components, FTW](https://publishing-project.rivendellweb.net/web-components.ftw) (which was getting too long) and adds more areas of interest and further research.

## Accessibility And elementInternals()

[The Guide to Accessible Web Components](https://www.erikkroes.nl/blog/accessibility/the-guide-to-accessible-web-components-draft/)

I want to highlight [elementInternals()](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals), in particular the accessibility portion of the interface.

The interface provides a way for custom elements to handle forms. It also exposes the [Accessibility Object Model (AOM)](https://wicg.github.io/aom/explainer.html).

!!! note Note:
Using this interface is in addition to the manual work that you do to create accessibility affordances. You can also override the default values provided by the interface by setting `aria-*` attributes directly on the element.
!!!

These are the recommended roles and attributes to provide basic accessibility according to the [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/), a site that provides a useful set of patterns to start your own accesible web component implementations. We'll use these guidelines to add accessibility attributes to our element.

| Role | Attribute | Element | Usage |
| :---: | :---: | :---: | --- |
| button | | div, a	 | <ul><li>Identifies the element as a button widget</li><li>Accessible name for the button is defined by the text content of the element</li></ul> |
| | tabindex="0" | div, a	| <ul><li>Includes the element in the tab sequence.</li><li>Needed on the a element because it does not have a href attribute.</li></ul> |
| | aria-pressed="false" | a | <ul><li>Identifies the button as a toggle button</li><li> Indicates the toggle button is not pressed. |
| | aria-pressed="true" | a | <ul><li>Identifies the button as a toggle button</li><li> Indicates the toggle button is pressed. |

!!! tip **No ARIA is better than bad ARIA**
[No ARIA is better than bad ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/).

If you will do accessibility, do it well and don't 'half-ass' it.
!!!

First, we will use  `elementInternals` to add `role` and `ariaRole` attributes to the element in the `connectedCallback()`. This is flagged in the Chrome Devtools accessibility panel and will be used by Assistive Technology tools.

```js
connectedCallback() {
	this._internals = this.attachInternals();

	const shadow = this.attachShadow({ mode: 'open' });
	const template = document.getElementById('hello-world-template')
		.content;
	shadow.appendChild(template.cloneNode(true));

	this._internals.role = 'button';
	this._internals.ariaRole = 'button';
	this.render();
}
```

But as I mentioned earlier, we still need to do manual work to make the element accessible.

We will add the `tabindex` attribute to the `hello-world` component using the [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) method.

```js
connectedCallback() {
	this._internals = this.attachInternals();

	const shadow = this.attachShadow({ mode: 'open' });
	const template = document.getElementById('hello-world-template')
		.content;
	shadow.appendChild(template.cloneNode(true));

	this._internals.role = 'button';
	this._internals.ariaRole = 'button';

	this.setAttribute('tabindex', 0);

	this.render();
}
```

As far as accessibility implementatons go, a button is simple. There are more complex structures to work and experiment with.

!!! tip **Test, test and test again**
Make sure that you include accessibility testing on your target devices or that you engage with experts to test your app/site/product for accessibility testing. You may find the hard, and expensive, way that your site wasn't accessible.
!!!

## Low-Level Web Component Libraries

Rather than write component's code ourselves we can use libraries like [Lit](https://lit.dev/) to create a set of web components.

The core of the Lit library is `LitHTML`, a base class that provides additional functionality beyond what we can do with `HTMLElement`.

It also abstracts a lot of the work to create web components and makes it easier to read and reason through other people's components.

The biggest differences between Lit and standard web components are:

* Lit-based elements extend `LitElement` rather than `HTMLElement` and other base HTML interfaces
* The elements use [tagged template literals](https://wesbos.com/tagged-template-literals) to display create the HTML and CSS for the component
* Lit explicitly uses [reactive properties](https://lit.dev/docs/components/properties/). These properties can trigger the reactive update cycle when changed, re-rendering the component, and optionally be read or written to attributes
* Lit provides a declarative way to [add event listeners](https://lit.dev/docs/components/events/#listening-to-events)
* Lit provides a set of optional [decorators](https://lit.dev/docs/components/decorators/) that enable declarative APIs for things like registering elements, defining reactive properties and query properties, or adding event options to event handler methods
  * These decorators will only work when writing components in Typescript or using Babel to transpile Javascript
  * No browser support decorators natively

Reworking our `hello-world` component with Lit looks like this:

```js
import {html, css, LitElement} from 'lit';

export class HelloWorld extends LitElement {
  static styles = css`p {
      .greeting {
        color: blue
      }

      .target {
        color: green
      }`;

  static properties = {
    greeting: {type: String},
    target: {type: String},
  };

  constructor() {
    super();
    this.greeting = "Howdy";
    this.target = 'Somebody';
  }

  render() {
    return html`<p><span class="greeting">${this.greeting}</span>, <span class="target">${this.target}!</span></p>`;
  }
}
customElements.define('hello-world', HelloWorld);
```

Lit is really powerful but it may not be the best tool for simple components or simple composition. We might want to lookat component libraries that build on top of Lit or plain web components.

## Web Component Libraries

I've looked at many web component libraries and I chose two of them to play with in this section.

[Wired Elements](https://wiredjs.com/)
: I like Wired elements because they give a rough, almost unfisined appearance to the elements.

[Shoelace/Web Awesome](https://shoelace.style/)
: Web Awesome (formerly known as Shoelace) provides a polished set of components to use
: There was a [Kickstarter](https://www.kickstarter.com/projects/fontawesome/web-awesome/) for a Web Awesome Pro project. It met its goal, and that's what worry me... some of the Kickstarter rewards include special pro-only components and I don't know when/if they will become available to the open source version; that, to me, may become a limiting factor on adoption.

Since we don't have to implement the components, using third-party libraries is easier than using Lit directly.

### Wired Elements

For example using Wired Elements to nest components inside a card, would look something like this:

The first block defines the structure of the `wired-card` component and its children, both standard HTML and other wired web components.

```html
<wired-card elevation="5">
	<h1>wired-elements</h1>
	<section>
		<wired-input placeholder="your name"></wired-input>
		<wired-button elevation="2">Submit</wired-button>
	</section>
</wired-card>
```

We then load the Wired Elements from a third-party CDN. This will load all Wired Elements which is OK for development. In production you may want to import individual elements so your bundler can tree shake the code.

We also include a script that will produce a popup alert when the user clicks the button.

```html
<script type="module" src="https://unpkg.com/wired-elements?module"></script>
<script type="module">
  const name = document.querySelector("wired-input");
  const button = document.querySelector("wired-button");
  button.addEventListener("click", () => {
    window.alert(`Hello ${name.value.trim()}!`);
  });
</script>
```

### Web Awesome / Shoelace

Web Awesome also combines standard HTML and Web Awesome web components (using the `sl-` prefix).

Note how the elements inside `sl-select` is also a web component, `sl-option` rather than a standard option element.

```html
<form class="input-validation-required">
  <sl-input name="name" label="Name" required></sl-input>
  <br />
  <sl-select label="Favorite Animal" clearable required>
    <sl-option value="birds">Birds</sl-option>
    <sl-option value="cats">Cats</sl-option>
    <sl-option value="dogs">Dogs</sl-option>
    <sl-option value="other">Other</sl-option>
  </sl-select>
  <br />
  <sl-textarea name="comment" label="Comment" required></sl-textarea>
  <br />
  <sl-checkbox required>Check me before submitting</sl-checkbox>
  <br /><br />
  <sl-button type="submit" variant="primary">Submit</sl-button>
</form>
```

The next blocks load the components and uses [whenDefined](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined)to add a submit event listener once the each component has been defined.

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.15.1/cdn/shoelace.js"></script>

<script type="module">
  const form = document.querySelector('.input-validation-required');

  // Wait for controls to be defined before attaching form listeners
  await Promise.all([
    customElements.whenDefined('sl-button'),
    customElements.whenDefined('sl-checkbox'),
    customElements.whenDefined('sl-input'),
    customElements.whenDefined('sl-option'),
    customElements.whenDefined('sl-select'),
    customElements.whenDefined('sl-textarea')
  ]).then(() => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      alert('All fields are valid!');
    });
  });
</script>
```

Both of these examples show how to compose portions of a page or app from individual components (building molecules from atoms if you follow Atomic Web Design).

## HTML Web Components

Rather than have full-blown web components, we can use them to enhance existing HTML and build powerful components with tools we already have.

As Eric Meyer suggests:

> Think about composibility with existing materials. Do you really need to invent an entirely new component from scratch? Or can you use HTML up until it reaches its limit and then enhance the markup?

It comess down to this: Web Components are awesome and provide a lot of new features, but it's nothing we can't  already do with HTML, CSS and a pinch of Javascript.

I will use Eric Meye's [super-slider](https://codepen.io/meyerweb/pen/oNmXJRX) component as an example of how to build an HTML component.

The `super-slider` doesn't use shadow DOM or templates. It performs the following actions in the `connectedCallback` method:

1. Captures the target element defined in the component
2. Captures the unit for the slider
3. Creates an [input](https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event) event handler
4. Style the font size of the target element to the value and the unit joined together

```js
class superSlider extends HTMLElement {
	connectedCallback() {
		let targetEl = document.querySelector(this.getAttribute('target')); // 1
		let unit = this.getAttribute('unit'); // 2
		let slider = this.querySelector('input[type="range"]'); // 3
		slider.addEventListener("input",(e) => {
			targetEl.style.setProperty('font-size', slider.value + unit); // 4
		});
	}
}

customElements.define("super-slider",superSlider);
```

The custom element uses parameters to define the items we'll use in the script.

The `target` attribute uses a css selector. This is important as it won't produce the correct result otherwise.

Since we're not using shadow DOM or templates, we can put the content of the element inside as we would with regular HTML.

```html
<super-slider unit="em" target=".preview h1">
	<label for="title-size">Title font size</label>
	<input id="title-size" type="range" min="0.5" max="4" step="0.1" value="2" />
</super-slider>
```

We then set the target HTML that will get modified by our component.

```html
<div class="preview">
	<h1>This is a title</h1>
</div>
```

We can further refine the component with checks for missing attributes or more complex actions.

Or we can leave it as an organizational unit and not do anything with scripts.

The choice is yours.

## Further Reading

* [Blinded By the Light DOM](https://meyerweb.com/eric/thoughts/2023/11/01/blinded-by-the-light-dom/)
* [HTML web components](https://adactio.com/journal/20618)
