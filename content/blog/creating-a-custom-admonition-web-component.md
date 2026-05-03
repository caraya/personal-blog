---
title: "Creating a Custom-Admonition Web Component"
date: 2026-06-22
tags:
  - Web Components
  - CSS
  - Typescript
  - Frontend development
---

I love the way Lea Verou's web site looks, particularly the way the admonitions look on her site.  I looked at t he CSS she used for the admonitions and thought it would be fun to create my own version that mimics the style of her admonitions.

Along the way I decided to move it to a custom element and to keep the code dry by creating a base admonition and use custom versions to extend it. This way, I have more flexibility on styles and I can easiy create new types of admonitions without having to duplicate code.

This post will cover the process of creating the `custom-admonition` web component, along with defaults it uses and how can these be customized.

## Getting started with CSS

This section shows the CSS used for the component. The CSS is authored to work inside the element's shadow DOM, but the same CSS can be adapted for global use by removing the `:host` scoping.

It has been broken down into sections to explain the different parts of the component's design. The full CSS is available in the source repository.

### The base admonition

The component's visual design is driven by a small set of CSS variables and a simple block called `.admonition`.

The CSS variables allow for easy customization of colors, fonts, and icons. Specialized subtypes of admonitions (like warnings or tips) can be created by setting these variables via utility classes or host selectors.

```css
:root {
  --font-sans: system-ui, -apple-system, sans-serif;
  --icon-font: "Segoe UI Emoji", "Apple Color Emoji", "Font Awesome 6 Free", sans-serif;

  /* Colors */
  --color-orange: oklch(70% 0.2 45);
  --color-purple: oklch(68% 0.18 300);
  --color-blue: oklch(60% 0.15 250);
  --color-green: oklch(65% 0.2 145);
  --color-red: oklch(60% 0.2 25);
  --color-accent: oklch(60% 0 0);
}
```

The block provides an overlapping label and (on larger viewports) a floating circular icon. The core admonition styles provide the structure for the component.

```css
.admonition {
  --_color: var(--color, var(--color-accent));
  --_bg: var(--color-light, oklch(95% 0 0));
  --_label: var(--label, "Note");
  --_icon: var(--icon, "ℹ️");

  position: relative;
  background: var(--_bg);
  padding: 1.2rem 1rem 0.8rem;
  border-radius: 0.3rem;
  margin-block: 1.6em 1em;
  font-family: var(--font-sans);
  font-size: 80%;
  font-weight: 500;
}
```

We only add the label and icon if the `plain` attribute is not present. The label is created using a `::before` pseudo-element that overlaps the top of the block, while the icon is created with a `::after` pseudo-element that floats on the left side on wider viewports.

```css
.admonition:not(.plain)::before {
  --offset: 0.5em;
  content: var(--_label);
  display: block;
  padding: 0.3em 1em;
  width: max-content;
  background: var(--label-color, var(--_color));
  color: white;
  font: 800 0.8rem/1.2 var(--font-sans);
  text-transform: uppercase;
  clip-path: polygon(var(--offset) 0, 100% 0, calc(100% - var(--offset)) 100%, 0 100%);
  margin-top: -2.1em;
  margin-left: calc(-1 * var(--offset));
  margin-bottom: 0.8em;
}
```

The last piece of these core styles is the floating icon. We only show it on wider viewports and when neither `plain` nor `no-icon` attributes are present.

```css
@media (min-width: 601px) {
  .admonition:where(:not(.plain, .no-icon)) {
    padding-left: 6.5em;
  }

  .admonition:where(:not(.plain, .no-icon))::after {
    content: var(--_icon);
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: var(--_bg);
    min-width: 1.65em;
    padding: 0.25em 0.45em 0.35em;
    border-radius: 50%;
    text-align: center;
    font-size: 180%;
    color: var(--_color);
    font-family: var(--icon-font);
  }
}
```

The base admonition styles do the heavy lifting. The type variants are just different combinations of CSS variable values that can be applied via utility classes.

```css
/* Type variants (can be applied via utility classes or host selectors) */
.admonition--warning {
  --color: var(--color-orange);
  --label: "Watch Out!";
  --icon: "⚠️";
  --color-light: color-mix(in lab, var(--color), white 92%);
}

.admonition--info {
  --color: var(--color-blue);
  --label: "FYI";
  --icon: "ℹ️";
  --color-light: color-mix(in lab, var(--color), white 92%);
}

.admonition--tip, .admonition--note {
  --color: var(--color-green);
  --label: "Tip";
  --icon: "💡";
  --color-light: color-mix(in lab, var(--color), white 92%);
}

.admonition--danger {
  --color: var(--color-red);
  --label: "Danger";
  --icon: "🛑";
  --color-light: color-mix(in lab, var(--color), white 92%);
}

.admonition--todo {
  --color: var(--color-purple);
  --label: "TODO";
  --icon: "📋";
  --color-light: color-mix(in lab, var(--color), white 92%);
}
```

This CSS is intentionally small: the visual identity comes from a handful of variables. If you use the component (below) the same rules are already baked into the shadow DOM, but extracting the rules like this is useful if you want a non-shadow fallback or global utility classes.

## Creating the Custom Element

The custom element is implemented in TypeScript and uses the CSS shown above via the `renderStyles()` method to ensure the styles are scoped to the shadow DOM. The component observes changes to the `type`, `no-icon`, `plain`, and `title` attributes to update its presentation accordingly.

I removed the content of the `attributeChangedCallback` method in the initial implementation to address it separately later, as it contains the logic for handling attribute changes and updating the component's appearance based on those changes.

I also removed the content of the `renderStyles()` method in the initial implementation because we discussed extensively earlier in the post.

```ts
// Public API, these are the types of admonitions we support out of the box.
export type AdmonitionType = 'note' | 'warning' | 'info' | 'tip' | 'danger' | 'todo';


export class Admonition extends HTMLElement {
  // We define the _container as a class property
  // so we can access it in the lifecycle methods.
  private _container: HTMLDivElement | null = null;

  // The constructor sets the component up
  constructor() {
    // Always call the parent's constructor first
    super();
    // Attach an open shadow root
    this.attachShadow({ mode: 'open' });
    // Render the initial template and styles into the shadow root
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.renderStyles() + this.renderTemplate();
      this._container = this.shadowRoot.querySelector('.admonition');
    }
  }

  // We observe changes to these attributes so we can react to them.
  static get observedAttributes(): string[] {
    return ['type', 'no-icon', 'plain', 'title'];
  }

  // This method is called whenever one of the observed attributes changes.
  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
    // To be filled later.
  }

  // Private method to render the HTML template of the component.
  private renderTemplate(): string {
    return `
      <div class="admonition">
        <slot></slot>
      </div>
    `;
  }

  // Private method to render the CSS styles of the component.
  private renderStyles(): string {
    return `
      <style>
        /* The CSS from above goes here */
      </style>
    `;
  }
}

// If the custom element is not already defined, define it.
if (!customElements.get('custom-admonition')) {
  customElements.define('custom-admonition', Admonition);
}

// This is needed for TypeScript to recognize the custom element in JSX and elsewhere.
declare global {
  interface HTMLElementTagNameMap {
    'custom-admonition': Admonition;
  }
}

```

### The Constructor

```ts
  constructor() {
    // Always call the parent's constructor first
    super();
    // Attach an open shadow root
    this.attachShadow({ mode: 'open' });
    // Render the initial template and styles into the shadow root
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = this.renderStyles() + this.renderTemplate();
      this._container = this.shadowRoot.querySelector('.admonition');
    }
  }
```

### Lifecycle Methods

For this component, we only need to use the `attributeChangedCallback` lifecycle method to react to changes in the observed attributes. This method is called whenever one of the observed attributes changes, allowing us to update the component's appearance accordingly.

We test the name of the changed attribute and update the internal state of the component based on the new value.

* If the `no-icon` attribute we toggle the corresponding class that hides or reveal the icon for the type of admonition
* If the `plain` attributes changes, it toggles the class that hides the label and the icon.
* If the `title` attribute changes, we update the `--label` CSS variable as an inline style to reflect the new title.

```ts
attributeChangedCallback(name, _oldValue, newValue) {
  if (!this._container)
      return;
  if (name === 'no-icon' || name === 'plain') {
      newValue !== null
          ? this._container.classList.add(name)
          : this._container.classList.remove(name);
  }
  if (name === 'title') {
      // Inline styles take precedence over the :host selectors in renderStyles.
      if (newValue !== null) {
          this.style.setProperty('--label', `"${newValue}"`);
      }
      else {
          this.style.removeProperty('--label');
      }
  }
}
```

### Different types

The component exposes a `type` attribute that sets sensible defaults for label, icon and color.

```html
<custom-admonition type="warning">Watch out for this.</custom-admonition>
<custom-admonition type="tip">A small helpful tip.</custom-admonition>
```

### Making it more flexible

The component supports a few attributes to control presentation without requiring extra CSS classes:

* `no-icon` — present/absent attribute; when present the circular icon is suppressed on wide viewports.
* `plain` — present/absent attribute; removes the overlapping label and icon so the block looks simpler.
* `title` — override the label text inline (it sets `--label`).

You can override any variable in the component via inline styles or global CSS. Examples:

```html
<!-- Inline variable overrides -->
<custom-admonition style="--color: hotpink; --label: 'Side note';">A custom color and label.</custom-admonition>

<!-- Turn off the icon -->
<custom-admonition no-icon type="info">No icon shown.</custom-admonition>

<!-- Use plain style -->
<custom-admonition plain type="warning">Plain warning block with no overlapping label.</custom-admonition>
```

### Working with CSS variables

The component exposes several variables you can set on the host or inline via the `style` attribute. The most useful ones are:

* `--color` — the accent color used for the icon and label background.
* `--label` — label text (used as the overlapping label via `content: var(--_label)`).
* `--icon` — the glyph used for the floating icon.
* `--color-light` — the background of the admonition block.
* `--font-sans`, `--icon-font` — typography fallbacks.

Set these on the element directly for per-admonition customisation or on `:root` / a wrapper for global theming.

### The HTML template

### Adding the CSS styles


## Conclusion

<!--
