---
title: Web Components FTW!
date: 2024-07-10
tags:
	- Web Components
	- Design
---

Web Components have come a long way since they were introduced and the original Polymer library made them useful for non-experts.

Since the landscape has changed so much, we'll look at some of the new things around web components specifications and APIs, we'll look at Lit, a low-level framework to build web components, Web Components libraries like Wired Elements and Shoelace (AKA Web Awesome) and a new strategy to build web components

## What Are Web Components?

The term "web components" is an umbrella for a series of specifications that allow developers to create custom HTML elements. The component specifications are:

* Custom Elements
* HTML Templates
* Shadow DOM
* Javascript module imports

Javascript module imports took the place of HTML imports, which were blocked by Apple and Mozilla early on in the implementation process.

## Custom elements

At the most basic a web component is a Javascript class that defines the element.

The class must be registered with the CustomElementRegistry to define it as a handler for a specific element:

```js
class HelloWorld extends HTMLElement {

  constructor() {
    // Always call the parent's constructor here
    super();
  }

  // connect component
  connectedCallback() {
    this.textContent = 'Hello World!';
  }

}

customElements.define( 'hello-world', HelloWorld );
```

You can then import the element using a `script` element, like so:

```html
<script type="module" src="./js/components/helloworld.js"></script>.
```

And use it on the page using the element name we associated it with

```html
<hello-world></hello-world>
```

### Web Components Lifecycle Methods

From the moment a custom element is created to the moment it is destroyed, several events can happen:

* The element is added to the page
* It gets updated when an attribute changes or a UI event is triggered
* The element may be removed from the page

All of the above are part of an element’s lifecycle, and we can hook into key events of its life with callback functions, called ‘Custom Element Reactions’.

Custom Element Reactions are called with special care to prevent code from being executed in the middle of a delicate process. The reactions are delayed to the point that all necessary steps are being executed and therefore look to be executed synchronously. To ensure that the hooks are invoked in the same order as their triggers, every custom element has a dedicated ‘custom element reaction queue’, defined in [Custom element reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-reactions).

Lifecycle hooks mean you don’t have to invent a completely new system for constructing and deconstructing elements. Most current JavaScript Frameworks now provide similar functionality, web components provide native browser support for these lifecycle hooks without additional dependencies.

constructor
: provides initial state setup for the component. This initial state can include: creating an instance of the Shadow Dom, setting up event listeners or intializing a component’s state. However, the specification recommends that you defer fetching data and similar tasks to the `connectedCallback` method.
: There are a few limitations in using the constructor:
: * The first element of the constructor is a call to `super()` to inherit the prototype chain and all properties and methods of the HTMLElement it extends (all web components extend `HTMLElement`)
: * It’s forbidden to use a return statement unless it's a simple early-return (`return` or `return this`)
: * You're not allowed to use `document.write()` or `document.open()`
: * The element’s attributes and children should not be inspected, because they don't exist in the DOM yet and therefore attributes aren’t available to inspect yet
: * To better match expectations when using `createElement()` or `createElementNS()` you must not add attributes or children in the constructor method

At its most basic, the constructor for a custom element looks like this:

```js
class HelloWorld extends HTMLElement {
  constructor() {
    super();
  }
}
```

and this example will also add the element's template and render the element for the first time

```js
class HelloWorld extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById('hello-world-template').content;
    this.appendChild(template.cloneNode(true));
    this.render();
  }
}
```

connectedCallback()
: Called each time the element is added to the document.
: This is where you'd fetch data and set the component beyond the initial state we set in the constructor.
: The specification recommends that, as far as possible, developers should implement a custom element's setup in this callback rather than the constructor.

disconnectedCallback()
: Called each time the element is removed from the document.
: This is the perfect spot to remove event listeners attached to the component and any other cleanup.

adoptedCallback()
: Called each time the element is moved to a new document.
: It allows you to free resources in the old document and initialize them in the new document.

attributeChangedCallback()
: Called when attributes are changed, added, removed, or replaced.
: We'll look at this method in more detail when we look at handling attributes in the next section

### Handling Attributes

So far we've used attributes to customize `hello-world`'s output but what happens if we want to let the browser control what happens when attributes are changed, added, removed, or replaced?

To manage attribute changes we need two things:

* A static `observedAttributes` getter method returning an array of the attributes that we want to change
* An implementation of the `attributeChangedCallback` to handle changes in the targetted attributes
* Optionally you can add setters and getters for the attributes that we're monitoring

```js
class HelloWorld extends HTMLElement {
  static get observedAttributes() {
    return [
      'greeting',
      'name'
    ];
  }

  constructor() {
    super();
    const template = document.getElementById('hello-world-template').content;
    this.appendChild(template.cloneNode(true));
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const greeting = this.getAttribute('greeting') || '';
    const name = this.getAttribute('name') || '';
    this.querySelector('.greeting').textContent = greeting;
    this.querySelector('.name').textContent = name;
  }
}

customElements.define('hello-world', HelloWorld);
```

## Templates

This is cool but it gets cumbersome for larger elements. That's where templates come in.

[Templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) are inert blocks of markup that will be ignored by the browser until they are instantiated.

To follow the `hello-world` example we can use the following template:

```html
<template id="hello-world">

  <style>
    p {
      text-align: center;
      font-weight: 700;
    }
  </style>

  <p class="hw-text"></p>
  <p class="hw-text"></p>
  <p class="hw-text"></p>
</template>
```

We then change the custom element definition.

We modify the `connectedCallback` method to include the template. We first clone it and then we append it to the custom element using the [appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) method.

```js
class HelloWorld extends HTMLElement {
  constructor() {
    super();
  }

  // Called when the element is inserted into the DOM
  connectedCallback() {
    const template = document.getElementById('hello-world')
      .content.cloneNode(true);
    const name = this.getAttribute('name') || 'World';
    const hwMsg = `Hello ${name}`;

    Array.from(template.querySelectorAll('.hw-text'))
      .forEach(n => n.textContent = hwMsg);

    // Append the template content to the element
    this.appendChild(template);
  }
}

// Define the custom element
customElements.define('hello-world', HelloWorld);
```

With this in place, we can customize the name of who we're greeting. These are all valid instances of `hello-world`:

```html
<!-- default instance will produce hello world -->
<hello-world></hello-world>

<!-- will produce hello dude -->
<hello-world name="dude"></hello-world>

<!-- will produce hello mom -->
<hello-world name="mom"></hello-world>
```

We'll look at further customization when we talk about slots and parts.

### Template Slots

It took me a while to fully understand what are the benefits of using slots. They allow communication between the Light DOM that lives in the component itself and the Shadow DOM for the component.

Slots serve as placeholders in the component's shadow DOM where developers and consumers of the web component can insert external content. They enable a mix of predefined and custom, external content in web components.

Slots are identified by their name attribute.

So, if we want to add a slot into our trivial example, we could update our template's paragraph element like this:

```html
<p><slot name="my-text">My default text</slot></p>
```

If the slot's content isn't defined when the element is included in the markup, or if the browser doesn't support slots, &lt;my-paragraph> will display the default content "My default text".

To define the slot's content, we include an HTML structure inside the &lt;my-paragraph> element with a slot attribute whose value is equal to the name of the slot we want it to fill. As before, this can be anything you like, for example:

```html
<my-paragraph>
  <span slot="my-text">Let's have some different text!</span>
</my-paragraph>
```

or

```html
<my-paragraph>
  <h1 slot="my-text">The text is a header</h1>
</my-paragraph>
```

Using slots we can have content that will display even in older browsers that don't support slots.

You can have as many slots as you need to convey the meaning and structure of your component.

### Template Parts

!!! note Note:
Parts will only work, and are necessary, when using shadow DOM. When not using shadow DOM parts are unnecessary since you will be able to style the content with CSS directly.
!!!

Template parts do for styles what slots do for content. You can specify names for specific sections of your component and then style it from CSS using the [::part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) pseudo-element.

In the template, we add elements in the template with `part` attributes with names that we want to use in CSS.

In this example, we add `part` attributes to the `greeting` and `name` elements.

```html
<template id="hello-world-template">
  <div>
    <span part="greeting">
      <slot name="greeting"></slot>
    </span>,
    <span part="name">
      <slot name="name"></slot>!
    </span>
  </div>
</template>
```

The Javascript declaration of the element remains the same.

In an external CSS stylesheet, we define the styling for the element we created.

To style the parts we defined in the element we use the following structure

```text
&lt;component-name>::part(&lt;part name>)
```

For example, to style the greeting part in the hello-world component would become `hello-world::part(greeting)`.

This over-specific declaration prevents collisions when more than one component has the same attribute.

```css
hello-world {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 20px;
  font-size: 2rem;
  font-family: system-ui, sans-serif
}

hello-world::part(greeting) {
  color: blue;
  font-weight: bold;
}

hello-world::part(name) {
  color: green;
}
```

## Shadow DOM

The final web component specification is shadow DOM. This allows for encapsulations of styles and structure of a component so it won't bleed into the parent page or let the parent page's styles bleed into the component.

To use shadow DOM you need to:

* In the constructor, create and attach a shadow root to the element using [attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
* In the `connectedCallback` method, run the necessary setup and attach the template to the shadow root

There are two types of shadow roots: open and closed

open
: Elements of the shadow root are accessible from JavaScript outside the root

closed
: Denies access to the node(s) of a closed shadow root from JavaScript outside it.

```js
class HelloWorld extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow root to the element
    this.attachShadow({ mode: 'open' });
  }

  // Called when the element is inserted into the DOM
  connectedCallback() {
    const template = document.getElementById('hello-world')
      .content.cloneNode(true);
    const name = this.getAttribute('name') || 'World';
    const hwMsg = `Hello ${name}`;

    Array.from(template.querySelectorAll('.hw-text'))
      .forEach(n => n.textContent = hwMsg);

    // Append the template content to the shadow root
    this.shadowRoot.appendChild(template);
  }
}

// Define the custom element
customElements.define('hello-world', HelloWorld);
```

## Accessibility And elementInternals()

The last area I want to highlight is [elementInternals()](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals) and the accessibility portion of the interface.

The interface provides a way for custom elements to handle forms. It also exposes the [Accessibility Object Model (AOM)](https://wicg.github.io/aom/explainer.html).

!!! note Note:
Using this interface is in addition to the manual work that you do to create accessibility affordances. You can also override the default values provided by the interface by setting `aria-*` attributes directly on the element.
!!!

The final `hello-world` version uses `elementInternals` to add a `role = 'button'` attribute to the element. This is flagged in the Chrome Devtools accessibility panel and will be used by Assistive Technology tools.

```js
class HelloWorld extends HTMLElement {
	static get observedAttributes() {
		return ['greeting', 'name'];
	}
	constructor() {
		super();
		// attach elementInternals
		this.internals = this.attachInternals();
		// assign the button role to the element
		this.internals.role = 'button';
		const template = document.getElementById('hello-world-template').content;
		//Assign ARIA role
		this.internals.ariaRole = 'button';
		// Tab index
		this.appendChild(template.cloneNode(true));
		this.render();
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) {
			this.render();
		}
	}
	render() {
		const greeting = this.getAttribute('greeting') || '';
		const name = this.getAttribute('name') || '';
		this.querySelector('.greeting').textContent = greeting;
		this.querySelector('.name').textContent = name;
	}
}
customElements.define('hello-world', HelloWorld);
```

## Links And Resources

* Background
  * [A Complete Introduction to Web Components](https://kinsta.com/blog/web-components/)
* Specifications
  * [Custom Elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
  * [HTML Templates](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
  * [ES Modules](https://html.spec.whatwg.org/multipage/webappapis.html#integration-with-the-javascript-module-system) &mdash; replaced HTML Imports
  * Shadow DOM is specified in multiple locations so it's hard to provide a single link
* Accessibility
  * [elementInternals](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
* Declarative Web Components
  * <https://developer.chrome.com/docs/css-ui/declarative-shadow-dom>
  * <https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Declarative-Custom-Elements-Strawman.md>
* Examples
  * Color.js [elements](https://elements.colorjs.io/) &mdash; Lea Verou
    * Be mindful that these components are under development and they may change without notice
  * [playground-elements](https://github.com/google/playground-elements) &mdash; Google
  * [share-url](https://nigelotoole.github.io/share-url/)
  * <https://www.zachleat.com/web/?category=web-components>
