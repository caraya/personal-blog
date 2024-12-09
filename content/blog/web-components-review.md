---
title: Web Components Review
date: 2024-12-09
tags:
  - Design
  - Web Components
  - Javascript
  - HTML
  - Reference
baseline: true
---

From their humble beginnings, the specifications that make up web components have become more complex and flexible at the same time.

This post will cover the APIs and specifications that make web components, from the core custom element API to the slots API to mix dark and light DOM, to CSS Parts to style the web components from the outside. This will provide a reference for further work.

## Custom Elements

<baseline-status featureid="autonomous-custom-elements"></baseline-status>

At the most basic level, custom elements are made of two parts:

* The HTML declaration of the element
* Javascript that defines it.

Most of the time when we see a custom element we see the tags without any content. We'll revisit this again when we talk about slots and the shadow DOM.

```html
<demo-element></demo-element>
```

The Javascript initializes the custom element and associates the definition with the HTML we're using for the custom element.

This example uses a class constructor and one of the custom element lifecycle methods to set up the component.

The lifecycle methods are:

connectedCallback()
: called each time the element is added to the document. The specification recommends that, as far as possible, developers should implement custom element setup in this callback rather than the constructor.

disconnectedCallback()
: called each time the element is removed from the document.

adoptedCallback()
: called each time the element is moved to a new document.

attributeChangedCallback()
: called when attributes are changed, added, removed, or replaced. See Responding to attribute changes for more details about this callback.

```js
class demoElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    console.log("Custom element added to page.");
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define("demo-element",demoElement);
```

Shadow DOM and templates build on top of custom elements to create more elaborate components.

## Shadow DOM

<baseline-status featureid="declarative-shadow-dom"></baseline-status>

Shadow dom provides a way to encapsulate the content of the custom element and keep the element's styles separate from the parent's page if we add the styles directly to the custom element.

To add a shadow root, the object that implements shadow DOM in the browser, we add the necessary methods.

First, we create the shadow root using the [attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow) method. We also specify the mode for the shadow root: `open` will let Javascript outside the element to interact with the element's internals; `close` will prevent all external access to the element.

Then, we create the HTML for the component by using the `innerHTML` method of the shadow root.

```js
class demoElement extends HTMLElement {
    constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.innerHTML = `
			<style>
				.demo-container {}
				.demo-content {}
			</style>
			<div class="demo-container">
				<div class="demo-content"></div>
			</div>
    `;
    }

    connectedCallback() {
      console.log("Custom element added to page.");
    }

    disconnectedCallback() {
      console.log("Custom element removed from page.");
    }

    adoptedCallback() {
      console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} has changed.`);
    }

};

customElements.define("demo-element",demoElement);
```

## Templates

<baseline-status featureid="template"></baseline-status>

<!-- <baseline-status featureid="cloneNode"></baseline-status> -->

Templates allow you to create inert content that won't be instantiated until they are needed.

We place the template anywhere in the document. I usually place them as the first children of the `body` element.

```html
<template id="demo-template">
  <div class="demo-container">
    <div class="demo-content"></div>
  </div>
</template>
```

Then, in the constructor, we capture a reference to the template and insert the content.

When we add the content to the shadow root, we add the template to the shadow root by cloning the content of the template using `cloneNode(true)` to copy the template with all its children.

```js
class demoElement extends HTMLElement {
  constructor() {
    super();
    let template = document.getElementById("demo-template");
    let templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }

    connectedCallback() {
      console.log("Custom element added to page.");
    }

    disconnectedCallback() {
      console.log("Custom element removed from page.");
    }

    adoptedCallback() {
      console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} has changed.`);
    }
};

customElements.define("demo-element",demoElement);
```

### Declarative Shadow DOM

<baseline-status featureid="declarative-shadow-dom"></baseline-status>

We discused using the imperative version of shadow DOM.  There is a way to create shadow roots from the template element using the `shadowrootmode` attribute.

In this example we create a custom element using a single file.

We first define the custom element with its template as its first children. This template includes the `shadowrootmode` attribute.

The template also uses an unamed slot to host the content from the light DOM. We'll cover slots later in the document.

The script checks if there is a shadowroot (created declaratively).

If there is a shadow root then we attach a tap event to the button.

If there is no shadow root we create the shadow root, attach it to the custom element, insert the template content and attach a tap event.

In either case, the custom element will take the content of the element's light DOM and insert it into the `button` element that's inside the template

```html
<menu-toggle>
  <template shadowrootmode="open">
    <button>
      <slot></slot>
    </button>
  </template>
  Open Menu
</menu-toggle>

<script>
  class MenuToggle extends HTMLElement {
    constructor() {
      super();

      if (this.shadowRoot) {
        const button = this.shadowRoot.firstElementChild;
        button.addEventListener('tap', toggle);
      } else {
        const shadow = this.attachShadow({mode: 'open'});
        shadow.innerHTML = `<button><slot></slot></button>`;
        shadow.firstChild.addEventListener('tap', toggle);
      }
    }
  }

  customElements.define('menu-toggle', MenuToggle);
</script>
```

### Slots

<baseline-status featureid="slot"></baseline-status>

Slots make it possible to display different text in each element instance in a declarative way.

Slots are identified by their `name` attribute, and allow you to define placeholders in your template that can be filled with any markup fragment you want when the element is used in the markup.

I've modified the template for our `demo-element` component

```html
<template id="demo-template">
	<h2 class="demo-title"><slot name="title"></slot></h2>
	<div class="demo-content"><slot name="content">
</template>
```

Using the template in our custom element's shadow DOM remains the same.

```js
class demoElement extends HTMLElement {
  constructor() {
    super();
    let template = document.getElementById("demo-template");
    let templateContent = template.content;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(templateContent.cloneNode(true));
  }
}


customElements.define("demo-element",demoElement);
```

The main difference is that we now can specify what will be inside every specific section of the element.

In the case of the `content` slot, it will use all the content inside the slotted element.

```html
<demo-element>
  <h2 slot="title">Experiment</h2>
  <div slot="content">
    <p>
	I wonder if this is enough content to make for a
	very long content blog.
		</p>
  </div>
</demo-element>
```

There are also unnamed slots. To me those are less useful so I won't cover them here.

## Styles

There are multiple strategies to add styles to a custom element depending on what your goals are.

### Applying Styles In The Shadow DOM

The easiest way to add styles to a custom element is to add a `style` tag to the template we use for the component.

```html
<template id="demo-template">
	<style>
		.demo-container {}
		.demo-content {}
	</style>
  <div class="demo-container">
    <div class="demo-content"></div>
  </div>
</template>
```

We then attach the template to the custom element's shadow DOM as usual.

### Custom Properties

<baseline-status featureid="custom-properties"></baseline-status>

We can use custom properties defined in the host document's stylesheet to style the content of the custom element.

We define the variables in the `:root` element along with any other variables you use on the page.

```css
:root {
	--text-color: black;
	--background-color: white;
}
```

You then reference the variables in the CSS inside your templates using `var` declarations like you would do in any other stylesheet.

```html
<template id="demo-template">
	<style>
		.demo-container {
			color: var(--text-color, rebeccapurple);
			background: var(--background-color, white)
		}
		.demo-content {
			color: var(--text-color, rebeccapurple);
			background: var(--background-color, white)
		}
	</style>
  <div class="demo-container">
    <div class="demo-content"></div>
  </div>
</template>
```

The variable declarations we define in the host document will override any variable declaration inside a custom element. This means you must be careful with naming the variables you use for your custom elements.

### Shadow Parts

<baseline-status featureid="shadow-parts"></baseline-status>

The final way to style components is using shadow parts and the [::part](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) pseudo element.

We add the `part` attribute to the elements we want to style in the template.

```html
<template id="demo-template">
	<h2 class="demo-title" part="title"><slot name="title"></slot></h2>
	<div class="demo-content" part="content"><slot name="content">
</template>
```

We then use `::part` to match the part attribute we defined on the template. This way we can use a single stylesheet for the application at the cost of some complexity in the selectors we use for the parts of each component.

```css
demo-element::part(title) {
  background-color: black;
  color: white;
}

demo-element::part(content) {
	color: navy;
}
```

## Links and Resources

* [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
* [Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
* [Shadow DOM v1 - Self-Contained Web Components](https://web.dev/articles/shadowdom-v1)
* [attachShadow](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow)
* [&lt;template>: The Content Template element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
* [Using templates and slots](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots)
* [Declarative Shadow DOM](https://web.dev/articles/declarative-shadow-dom)
* [CSS Custom variables in custom element and shadow dom not resolved by IDE or browser](https://stackoverflow.com/q/68926057) &mdash; Stack Overflow
