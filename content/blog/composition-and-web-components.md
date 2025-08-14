---
title: Composition and Web Components
date: 2025-10-06
tags:
  - Web Components
  - Composition
  - Best Practices
---

When building with Web Components, you have four primary strategies for composing them:

* **Slots**: For injecting user-defined content into a component's template.
* **Nesting**: For building complex components out of smaller ones.
* **A Hybrid Approach**: Combining slots and nested components.
* **HTML-First**: For prioritizing progressive enhancement.

This post will cover these four strategies with examples and best practices.

## Using Slots for Content Projection

The &lt;slot> element is a placeholder inside a component’s Shadow DOM that you can fill with your own HTML from the outside. This process is called content projection, as your external markup is "projected" into the component's render tree. This model is perfect for generic components that need to display user-provided content, like a styled card, a popup modal, or a layout container.

### Simple (Unnamed) Slot

A component can have a single, unnamed (or "default") slot. Any content placed directly inside your custom element's tags will be inserted where the &lt;slot> element appears in its template.

#### Example: A simple &lt;info-card> component

**Component Definition (info-card.js):**

```js
const template = document.createElement('template');
template.innerHTML = `
  <style>
    .card {
      border: 1px solid #ccc;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
    }
  </style>
  <div class="card">
    <h3>Information Card</h3>
    <slot></slot>
  </div>
`;

class InfoCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('info-card', InfoCard);
```

**Usage (index.html):**

With this method, all content inside &lt;info-card> is projected into the single slot.

```html
<info-card>
  <p>This paragraph will be projected into the slot.</p>
  <button>A button, too!</button>
</info-card>
```

### Named Slots

For more complex components, you can use named slots to control where specific pieces of content go. You do this by matching a slot attribute on your content with a name attribute on a &lt;slot> element. This allows for multiple, targeted insertion points.

#### Example: An updated &lt;info-card>

**Component Definition (info-card.js):**

The template now contains multiple slots with name attributes. The class definition remains the same.

```js
// Updated template with named slots
const template = document.createElement('template');
template.innerHTML = `
  <style>
    .card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; }
    header { border-bottom: 1px solid #eee; margin-bottom: 10px; padding-bottom: 10px; }
  </style>
  <div class="card">
    <header>
      <slot name="card-title">Default Title</slot>
    </header>
    <main>
      <slot name="card-body"></slot>
    </main>
  </div>
`;
```

**Usage (index.html):**

Each child element uses the slot attribute to target a specific named slot in the component's template.

```html
<info-card>
  <h2 slot="card-title">My Custom Title</h2>
  <p slot="card-body">This is the main content for the card.</p>
</info-card>
```

## Nesting Components for Structural Composition

The most straightforward composition model works just like standard HTML: you build complex UIs by nesting smaller, simpler components. This creates a hierarchy where each component has a single, focused responsibility. This approach is ideal for building entire applications from a library of reusable parts, much like building with LEGO bricks.

This strategy can require more upfront work since you create a distinct component for each piece of functionality, but it's incredibly powerful for building maintainable and scalable systems.

### Example: A &lt;user-profile> card

Imagine you've already built two simple components: &lt;user-avatar> and &lt;follow-button>. You can compose them inside a new &lt;user-profile> component.

**Component Definition (user-profile.js):**

```js
const profileTemplate = document.createElement('template');
profileTemplate.innerHTML = `
  <style>
    .profile { display: flex; align-items: center; gap: 15px; font-family: sans-serif; }
  </style>
  <div class="profile">
    <user-avatar src="/images/user1.jpg"></user-avatar>
    <div>
      <h2>Jane Doe</h2>
      <follow-button user-id="jane-doe"></follow-button>
    </div>
  </div>
`;

class UserProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(profileTemplate.content.cloneNode(true));
  }
}
customElements.define('user-profile', UserProfile);
```

In this model, the parent component (&lt;user-profile>) owns its internal structure and controls its children, passing data down through attributes and properties.

## Combining Strategies: The Hybrid Approach

Why choose one when you can have both? You can design a component that has a fixed internal structure (built with nested components) while also providing slots for user-provided content. This creates a component with a consistent structure but customizable sections.

### Example: A &lt;site-header> component

This component will always display the company's logo using a &lt;company-logo> component, but it allows the user to provide their own navigation links via a slot.

**Component Definition (site-header.js):**

```js
const headerTemplate = document.createElement('template');
headerTemplate.innerHTML = `
  <style>
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8f9fa; }
    nav { display: flex; gap: 15px; }
  </style>
  <header>
    <company-logo></company-logo>
    <nav>
      <slot name="nav-links"></slot>
    </nav>
  &lt;/header>
`;

class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true));
  }
}
customElements.define('site-header', SiteHeader);
```

**Usage (index.html):**

We only need to provide the navigation links, which are projected into the nav-links slot.

```html
<site-header>
  <a slot="nav-links" href="/home">Home</a>
  <a slot="nav-links" href="/about">About Us</a>
  <a slot="nav-links" href="/contact">Contact</a>
</site-header>
```

This gives you the best of both worlds: a guaranteed structure with &lt;company-logo> and a flexible content area with the &lt;slot>.

## HTML-First Composition (Progressive Enhancement)

A powerful approach, championed by developers like Jeremy Keith as "HTML web components," is to compose your UI directly in HTML. The Javascript for your component then serves to enhance the existing markup rather than creating it from scratch.

The core principle is that the content and basic structure should be useful on their own, even before Javascript loads. This creates a more robust, accessible, and search-engine-friendly experience.

### Example: An enhanced &lt;collapsible-widget>

Instead of using a &lt;template> or Shadow DOM, we start with a working, accessible &lt;details> element directly in the HTML.

**Initial HTML (index.html):**

```html
<collapsible-widget>
  <details>
    <summary>Click to learn more</summary>
    <p>This content is already in the HTML and fully functional!</p>
  </details>
</collapsible-widget>

<script src="collapsible-widget.js" type="module"></script>
```

**Enhancement (collapsible-widget.js):**

The Javascript file finds this existing HTML and enhances it, perhaps by adding smooth animations or other features.

```js
class CollapsibleWidget extends HTMLElement {
  constructor() {
    super();

    // Find the <details> element that already exists inside this component.
    const details = this.querySelector('details');
    if (!details) return;

    // Enhance its functionality, for example, by adding an animation.
    details.addEventListener('toggle', () => {
      if (details.open) {
        console.log("Widget opened! Let's add an animation.");
        // Animation logic would go here...
      }
    });
  }
}
customElements.define('collapsible-widget', CollapsibleWidget);
```

This approach ensures your site is usable on the slowest networks and devices and degrades gracefully if Javascript fails.

## Conclusion

Choosing the right composition strategy depends entirely on your goal. There's no single "best" way; each has its strengths:

* Use Slots when creating generic "wrapper" components that need to display arbitrary content.
* Use Nesting when building a self-contained design system or a complex application UI from smaller, specialized parts.
* Use the Hybrid Approach for components that need a balance of fixed structure and flexible, user-provided content.
* Use the HTML-First method when accessibility, SEO, and resilience are top priorities, ensuring a baseline experience that works without Javascript.

By understanding these four methods, you can build more effective, flexible, and maintainable Web Components.
