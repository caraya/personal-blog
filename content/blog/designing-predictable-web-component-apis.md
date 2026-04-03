---
title: "Designing Predictable Web Component APIs"
date: 2026-05-15
tags:
  - Javascript
  - Design
  - API
---

A production-ready web component feels invisible to the developer using it. It should behave exactly like a native HTML element, such as an `<input>` or a `<video>` tag. Achieving this requires meticulous API design.

This guide explores how to build predictable APIs for your custom elements and how to architect them so that simple tasks remain effortless while complex integrations remain possible.

## Predictable API Design

When developers use your component, they bring expectations based on years of interacting with the standard Document Object Model (DOM). Breaking these expectations creates friction and bugs.

### Synchronize Properties and Attributes

HTML attributes (like `<my-element status="active">`) and JavaScript properties (like `myElement.status = 'active'`) are distinct concepts in the browser, but developers expect them to remain in sync.

#### The Source of Truth

A common pitfall in web component design is treating attributes and properties as separate, competing states. Instead, establish the JavaScript property as the single source of truth for the component's internal state. HTML attributes serve two secondary purposes: they provide the initial configuration on load, and they expose the current state back to the DOM so developers can use standard CSS attribute selectors (e.g., `my-element[status="active"]`) for styling.

When a developer sets a property via JavaScript, your component should explicitly reflect that state back to the DOM as an HTML attribute.

#### Handling Data Type Conversions

DOM attributes are strictly strings, while JavaScript properties can be numbers, booleans, objects, or arrays. When synchronizing them, your component must handle the type conversion explicitly. For example, if you have a count property, you must parse the string using `Number()` when reading from the attribute, and convert the number to a string using `.toString()` when reflecting it back.

#### Avoiding Infinite Loops

Because property setters update attributes, and the `attributeChangedCallback` method reacts to attribute updates by setting properties, you risk creating a maximum call stack error (an infinite loop). Always check if the new value differs from the current value before updating the attribute or triggering a UI render.

Here is a robust pattern for synchronizing both string and number properties while preventing infinite loops:

```ts
class StatusBadge extends HTMLElement {
  private _status: string = 'default';
  private _count: number = 0;
  private _root: ShadowRoot;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
    this._initialRender();
  }

  static get observedAttributes(): string[] {
    return ['status', 'count'];
  }

  get status(): string {
    return this._status;
  }

  set status(value: string) {
    if (this._status === value) return;
    this._status = value;
    this.setAttribute('status', value);
    this._updateRender();
  }

  get count(): number {
    return this._count;
  }

  set count(value: number | string) {
    const numValue = Number(value) || 0;
    if (this._count === numValue) return;
    this._count = numValue;
    this.setAttribute('count', numValue.toString());
    this._updateRender();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    if (oldValue === newValue) return;

    if (name === 'status') {
      this.status = newValue || 'default';
    } else if (name === 'count') {
      this.count = newValue || 0;
    }
  }

  private _initialRender(): void {
    this._root.innerHTML = `
      <style>
        :host {
          display: inline-block;
          font-family: system-ui, sans-serif;
        }
        .badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: bold;
          color: white;
          background-color: #6c757d;
        }
        .badge[data-status="success"] { background-color: #28a745; }
        .badge[data-status="error"] { background-color: #dc3545; }
        .badge[data-status="warning"] { background-color: #ffc107; color: #212529; }
      </style>
      <span class="badge"></span>
    `;
    this._updateRender();
  }

  private _updateRender(): void {
    const badge = this._root.querySelector('.badge');
    if (badge) {
      badge.textContent = this._count.toString();
      badge.setAttribute('data-status', this._status);
    }
  }
}

customElements.define('status-badge', StatusBadge);
```

#### Handle Boolean Attributes Correctly

Native HTML boolean attributes (like hidden, checked, or disabled) do not rely on their string value. Their presence evaluates to true, and their absence evaluates to false. Setting `<my-button disabled="false">` actually results in a true boolean state because the attribute exists. Your web component must replicate this standard behavior exactly.

Because JavaScript's `setAttribute()` method requires two parameters, the standard convention for setting a boolean attribute to true is to pass an empty string `''` as the second argument. Conversely, to set a boolean attribute to false, you must completely remove it from the DOM using `removeAttribute()` rather than setting it to the string `"false"`. When reading the value, use `hasAttribute()` rather than `getAttribute()`.

Here is how you implement a boolean property that correctly reflects to an attribute:

```ts
class MyButton extends HTMLElement {
  get disabled(): boolean {
    // The presence of the attribute means true
    return this.hasAttribute('disabled');
  }

  set disabled(value: boolean) {
    // Coerce the incoming value to a strict boolean
    const isDisabled = Boolean(value);

    if (isDisabled) {
      // Set the attribute with an empty string
      this.setAttribute('disabled', '');
    } else {
      // Remove the attribute entirely to evaluate to false
      this.removeAttribute('disabled');
    }
  }
}

customElements.define('my-button', MyButton);
```

#### Implement Standard Methods

If your component wraps interactive elements, it should expose standard DOM methods. For example, if you build a custom text input, developers will expect to call `myInput.focus()` and `myInput.blur()`.

Because the actual `<input>` element is hidden inside the Shadow DOM, calling `focus()` on the host element won't automatically focus the internal input. You must explicitly define these methods on your component's class and delegate the calls to the internal element.

#### Handling Multiple Instances

Because each web component is an independent instance of a JavaScript class, method delegation scales naturally. If a page contains five `<custom-search>` elements, the browser creates five distinct class instances, each with its own encapsulated Shadow DOM and its own private variables. Calling `document.querySelectorAll('custom-search')[0].focus()` only triggers the method on the first instance, completely isolated from the others.

#### Delegating to Multiple Internal Elements

When a component contains multiple interactive elements—such as a search bar with a text field and a clear button—you must decide how standard methods behave. Typically, you route the default `focus()` method to the primary interactive element (the text field) and provide custom methods for the secondary elements.

To achieve this, query the specific internal elements from your `shadowRoot` and store their respective references.

```ts
class CustomSearch extends HTMLElement {
  private _input: HTMLInputElement | null = null;
  private _clearBtn: HTMLButtonElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <input type="text" part="input" placeholder="Search...">
      <button type="button" part="clear-btn">Clear</button>
    `;

    // Store isolated references specific to this class instance
    this._input = this.shadowRoot!.querySelector('input');
    this._clearBtn = this.shadowRoot!.querySelector('button');
  }

  // Route the standard DOM method to the primary element
  focus(options?: FocusOptions): void {
    this._input?.focus(options);
  }

  blur(): void {
    this._input?.blur();
  }

  // Provide custom methods for secondary internal elements
  focusClearButton(options?: FocusOptions): void {
    this._clearBtn?.focus(options);
  }
}

customElements.define('custom-search', CustomSearch);
```

Here is a breakdown of how this delegation bridges the gap between the public API and the encapsulated Shadow DOM:

* **Store isolated references**: In the constructor, query the `shadowRoot` and store references to the specific child elements (e.g., `this._input` and `this._clearBtn`). Storing these references in private class fields serves three critical purposes:
  * **Performance optimization**: Querying the DOM via methods like `querySelector` is computationally expensive. By capturing the element references once during initialization, you avoid querying the DOM repeatedly every time a method like `focus()` executes.
  * **Strict encapsulation**: Using the private modifier ensures that external scripts cannot bypass your component's public API to manipulate the internal Shadow DOM elements directly. It protects the component's internal architecture from unintended interference.
  * **Instance isolation**: Because these references bind directly to `this` (the current class instance), multiple `<custom-search>` elements on the same page operate completely independently without interfering with one another.
* **Expose the public API**: Explicitly define public `focus()` and `blur()` methods to instruct the browser to run your custom logic rather than the default host-focus behavior.
* **Provide element-specific methods**: When necessary, expose custom methods like `focusClearButton()` to grant granular access to secondary interactive elements.
* **Pass the command down**: Inside the methods, apply the command directly to the hidden native elements. Using optional chaining (`this._input?.focus()`	) or an if statement ensures the code fails silently if the internal elements are not yet available.

### Semantic Event Naming and Communication

Web components communicate outward by dispatching CustomEvent objects. While properties and attributes pass data down into a component, custom events pass data up to the parent application to notify it of state changes or user interactions.

#### Semantic Naming Conventions

Always dispatch events for component-specific actions. Use lowercase, hyphenated 	names without an "on" prefix. Dispatch `value-changed` rather than `onValueChanged` or `valueChanged`. This matches native DOM conventions like `click` or `keyup`.

#### Crossing the Shadow Boundary

By default, custom events dispatched from an element inside the Shadow DOM are encapsulated; they do not bubble up to the main document. To allow external JavaScript to listen for your component's events, you must explicitly configure the event to cross the shadow boundary.

When constructing a CustomEvent, pass an options object with two crucial properties:

* **bubbles**: true: Allows the event to travel up the DOM tree from the host element.
* **composed**: true: Allows the event to break through the Shadow DOM boundary and enter the light DOM.

Include any relevant payload data in the **detail** property.

Here is an example of an interactive component firing a composed event, and how a parent application listens to it:

```ts
class CustomToggle extends HTMLElement {
  private _button: HTMLButtonElement | null = null;
  private _isOn: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<button part="btn">Off</button>`;
    this._button = this.shadowRoot!.querySelector('button');
  }

  connectedCallback(): void {
    this._button?.addEventListener('click', this._handleToggle);
  }

  disconnectedCallback(): void {
    this._button?.removeEventListener('click', this._handleToggle);
  }

  private _handleToggle = (): void => {
    this._isOn = !this._isOn;

    if (this._button) {
      this._button.textContent = this._isOn ? 'On' : 'Off';
    }

    // Dispatch an event that escapes the Shadow DOM
    this.dispatchEvent(new CustomEvent('toggle-changed', {
      bubbles: true,
      composed: true,
      detail: { isOn: this._isOn }
    }));
  }
}

customElements.define('custom-toggle', CustomToggle);

// Listening to the event from the parent application
const toggle = document.querySelector('custom-toggle');
toggle?.addEventListener('toggle-changed', (event: Event) => {
  const customEvent = event as CustomEvent<{ isOn: boolean }>;
  console.log('Toggle state:', customEvent.detail.isOn);
});
```

#### State Management and Idempotency

In the preceding examples, the `_handleToggle` method updates the state using `this._isOn = !this._isOn;`. Because this method acts as an internal event listener for a toggle button, its explicit purpose is to reverse the state on every user interaction. This operation is not idempotent, executing it multiple times continuously flips the value.

This non-idempotent behavior is correct for internal interaction handlers. However, if you expose a public API method or a property setter (for example, `set isOn(value)`), design it to be idempotent. Passing the same value to a public setter multiple times must yield the exact same state without triggering unintended side effects or redundant DOM updates.

#### Simple Things Should Be Simple, Complex Things Should Be Possible

This classic software design maxim, often attributed to Alan Kay, is the perfect guiding philosophy for web components.

**A production component serves two audiences**: the content author who just wants to drop a widget onto a page, and the application engineer who needs to integrate it deeply into a reactive framework.

#### Making the Simple Things Simple

For basic usage, your component should require zero JavaScript configuration. A developer or content editor should be able to load your script and use your element purely through declarative HTML.

The Simple API (HTML):

```html
<!-- The component works immediately with sensible defaults -->
<user-profile
  name="Jane Doe"
  role="Admin"
  avatar-url="/images/jane.jpg">
</user-profile>
```

To achieve this simplicity:

* **Provide sensible defaults**: Design components to fall back to a safe, functional default state when an attribute is missing, rather than throwing an error or rendering an empty box. For instance, if a `<user-profile>` lacks an avatar-url attribute, display a generic placeholder image or the user's initials instead of a broken image link. This resilient behavior guarantees the component remains usable even with incomplete configuration.
* **Rely on string attributes for basic configuration**: Accept primary configuration through standard HTML string attributes. This approach enables content authors to customize the core behavior of the element directly within the HTML markup, requiring no JavaScript. Reserve complex data structures, such as objects or arrays, for advanced JavaScript property interfaces.
* **Encapsulate baseline styles**: Ensure the component looks structurally sound and visually appealing immediately upon insertion. Package all essential structural CSS, default typography, and baseline spacing within the Shadow DOM. This encapsulation prevents the host application's styles from breaking the layout of the component, sparing consumers from writing external CSS to make the element functional.

#### Making the Complex Things Possible

While string attributes are great for simple data, application developers often need to pass rich data structures, customize the internal layout, or react to precise internal state changes. Your API must gracefully scale to handle these advanced use cases.

Rich Data Properties (JavaScript)
: HTML attributes strictly hold strings. While you can parse JSON strings from attributes, it is computationally expensive, prone to syntax errors, and forces consumers to stringify objects before passing them. Instead, expose standard JavaScript properties on your element's class to accept arrays, objects, or complex data models directly.
: Because these properties represent rich data, you generally do not reflect them back as HTML attributes.

```ts
// Define the shape of the complex data
interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  accessLevel: number;
}

class UserProfile extends HTMLElement {
  private _permissions: UserPermissions | null = null;

  // Expose a public getter and setter for the rich data
  get permissions(): UserPermissions | null {
    return this._permissions;
  }

  set permissions(value: UserPermissions | null) {
    this._permissions = value;
    // Trigger a re-render to update the UI with the new data
    this._updateRender();
  }

  private _updateRender(): void {
    if (this._permissions?.canEdit) {
      // Logic to show edit buttons
    }
  }
}

customElements.define('user-profile', UserProfile);
```

To consume this component, an application engineer passes the object directly via JavaScript:

```ts
const profile = document.querySelector('user-profile');
profile.permissions = {
  canEdit: true,
  canDelete: false,
  accessLevel: 4
};
```

Composition with Slots
: Do not force developers to use your predefined layouts or string properties if they require flexibility. Use the `<slot>` element to allow consumers to inject their own HTML into your component's Shadow DOM. This pattern provides immense flexibility without breaking your component's structural encapsulation.
: Provide a mix of named slots (for specific, targeted areas) and a default slot (for general content). Furthermore, you can listen to the slotchange event to detect when the consumer adds or removes slotted content, allowing your component to react appropriately.

TypeScript (The Internal Template)

```ts
// Inside your component's constructor
this.shadowRoot.innerHTML = `
  <div class="card">
    <header>
      <!-- A named slot for the header. If unused, it shows the fallback text. -->
      <slot name="title">Default Title</slot>
    </header>
    <main>
      <!-- The default slot catches any content not explicitly named. -->
      <slot></slot>
    </main>
  </div>
`;

// Reacting to slotted content changes
const defaultSlot = this.shadowRoot.querySelector('slot:not([name])');
defaultSlot?.addEventListener('slotchange', (e) => {
  const nodes = (e.target as HTMLSlotElement).assignedNodes();
  console.log('New content was injected into the default slot!', nodes);
});
```

HTML (The Consumer's Code)

```html
<user-profile>
  <!-- Injected into the named slot -->
  <span slot="title" class="custom-title">Jane Doe's Profile</span>

  <!-- Injected into the default slot -->
  <p>This is dynamic, consumer-provided content that resides in the Light DOM but renders inside the component's Shadow DOM layout.</p>
</user-profile>
```

Granular Styling with CSS Parts
: If a consumer needs to heavily theme your component, standard CSS custom properties (variables) might not provide enough control. Variables are excellent for colors and fonts, but they fail when a consumer needs to adjust padding, flexbox alignment, or border radii.
: Because standard CSS stops at the shadow boundary, you must explicitly expose internal structural elements using the part attribute. This creates a designated "Styling API," giving application developers intentional access to style specific pieces of your component's internals safely.

Inside the Component's Shadow DOM:

```html
<div class="wrapper" part="container">
  <img src="avatar.jpg" part="avatar-image">
  <h2 part="heading">Jane Doe</h2>
</div>
```

External Consumer's CSS:

```css
/* The consumer targets the exposed parts via the ::part() pseudo-element */
user-profile::part(container) {
  display: flex;
  align-items: center;
  padding: 2rem;
  background-color: var(--surface-color);
}

user-profile::part(avatar-image) {
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

## Architectural Composition Patterns

When constructing complex applications entirely from custom elements, you will frequently need to share logic between components or pass state deeply through the component tree. Web components offer several architectural patterns for composition beyond basic HTML slots.

### Behavioral Composition with Class Mixins

Because web components rely heavily on standard ES2015 classes, you can share reusable behavior without duplicating code by using class mixins. A mixin is a function that takes a base class as an argument and returns a new subclass extending that base.

Mixins solve the "fragile base class" problem common in object-oriented programming. Instead of building deep, restrictive inheritance chains (e.g., `Button extends InteractiveElement extends BaseElement`), you compose exactly the traits a component needs. For example, a single component can inherit from `HTMLElement` and apply multiple decoupled mixins: `WithTheme(WithLogging(HTMLElement)`).

Use mixins to abstract universal capabilities—such as subscribing to a ResizeObserver, participating in native forms via `ElementInternals`, or standardizing lifecycle logging—across entirely different custom elements.

In TypeScript, you achieve this by defining a generic `Constructor` type to represent the incoming base class. This ensures the compiler retains all the typing information of the original base class while adding the mixin's new methods.

```ts
// Define a generic constructor type that captures the base class signature
type Constructor<T = {}> = new (...args: any[]) => T;

// Create the mixin function
function WithLogger<TBase extends Constructor<HTMLElement>>(Base: TBase) {
  return class extends Base {
    connectedCallback(): void {
      // Ensure the base class's connectedCallback runs if it exists
      if ('connectedCallback' in Base.prototype) {
        super['connectedCallback']?.();
      }
      console.log(`[LOG] <${this.tagName.toLowerCase()}> connected to the DOM.`);
    }

    disconnectedCallback(): void {
      if ('disconnectedCallback' in Base.prototype) {
        super['disconnectedCallback']?.();
      }
      console.log(`[LOG] <${this.tagName.toLowerCase()}> disconnected from the DOM.`);
    }

    // You can also add new public methods via the mixin
    logCustomMessage(message: string): void {
      console.log(`[LOG] <${this.tagName.toLowerCase()}>: ${message}`);
    }
  };
}

// Apply the mixin to a new custom element
class MySpecialButton extends WithLogger(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<button>Click Me</button>`;
  }
}

customElements.define('my-special-button', MySpecialButton);

// The TypeScript compiler understands that MySpecialButton now has logCustomMessage()
const btn = new MySpecialButton();
btn.logCustomMessage('Initialized successfully.');
```

### Meta-Programming with Decorators

Another highly effective pattern for composing web components is using decorators. Decorators provide a declarative, meta-programming syntax to modify classes and properties at design time. They are extremely popular in web component ecosystems (most notably the Lit library) to reduce boilerplate code, such as automatically registering elements or setting up property-to-attribute reflection.

In the JavaScript and TypeScript ecosystems, there are two primary variations of decorators you will encounter:

#### Legacy (Experimental) Decorators

Historically, TypeScript supported an early Stage 2 proposal for decorators. You enable this legacy mode by setting "experimentalDecorators": true in your tsconfig.json. Many older codebases and established frameworks rely on this syntax.

Under the experimental specification, a class decorator is simply a function that receives the class constructor as its only argument.

```ts
// A legacy class decorator for registering a custom element
function customElementLegacy(tagName: string) {
  return function (target: Function): void {
    // Automatically register the component
    customElements.define(tagName, target as CustomElementConstructor);
  };
}

@customElementLegacy('legacy-button')
class LegacyButton extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<button>Legacy Bound</button>`;
  }
}
```

#### Standard ECMAScript (Stage 3) Decorators

TypeScript 5.0 introduced support for the official ECMAScript Stage 3 decorator proposal. These standard decorators do not require the experimentalDecorators flag and are natively integrated into the language syntax.

Standard decorators operate slightly differently under the hood. The decorator function receives two arguments: the target (the class or method) and a ClassDecoratorContext object that provides metadata about what is being decorated.

```ts
// A standard class decorator for registering a custom element
function customElement(tagName: string) {
  // The returned function receives the target class and context
  return function <T extends { new (...args: any[]): HTMLElement }>(
    target: T,
    context: ClassDecoratorContext
  ) {
    if (context.kind === 'class') {
      // Automatically register the component using the provided tag name
      customElements.define(tagName, target);
    }
    // Return the unmodified class
    return target;
  };
}

@customElement('modern-button')
class ModernButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `<button>Modern Bound</button>`;
  }
}

// The element is now registered and usable without calling customElements.define manually.
```

By leveraging standard decorators, you can build declarative interfaces for defining properties, handling event delegation, or reacting to attribute changes, significantly streamlining the developer experience of your custom elements.

### State Composition with the Provider Pattern (Context)

When you have a deeply nested tree of custom elements, passing data down through properties step-by-step (prop-drilling) becomes difficult to maintain. To solve this, employ the Provider pattern (often referred to as Context).

In this pattern, a top-level parent element acts as a "Provider" that holds the state. Deeply nested child elements dispatch custom events that bubble up the DOM tree to request that state. The provider listens for these request events, intercepts them, and executes a callback attached to the event detail, passing down the requested data.

```ts
// 1. Define the event detail shape
interface ContextRequestDetail {
  callback: (theme: string) => void;
}

// 2. The Provider Component (Parent)
class ThemeProvider extends HTMLElement {
  private _theme: string = 'dark';

  connectedCallback(): void {
    // Listen for the specific request event during the capture or bubble phase
    this.addEventListener('request-theme-context', this._handleThemeRequest);
  }

  disconnectedCallback(): void {
    this.removeEventListener('request-theme-context', this._handleThemeRequest);
  }

  private _handleThemeRequest = (event: Event): void => {
    // Stop the event from bubbling higher up the DOM
    event.stopPropagation();

    const requestEvent = event as CustomEvent<ContextRequestDetail>;

    // Execute the callback provided by the child, passing the current state
    if (requestEvent.detail && typeof requestEvent.detail.callback === 'function') {
      requestEvent.detail.callback(this._theme);
    }
  }
}

customElements.define('theme-provider', ThemeProvider);
```

And the deeply nested child component consumes the context by dispatching a custom event that bubbles up to the provider:

```ts
// 3. The Consumer Component (Deeply nested child)
class ThemedCard extends HTMLElement {
  private _currentTheme: string = 'light'; // Default fallback

  connectedCallback(): void {
    // Dispatch an event asking for the theme context
    this.dispatchEvent(new CustomEvent<ContextRequestDetail>('request-theme-context', {
      bubbles: true,
      composed: true,
      detail: {
        callback: (theme: string) => {
          this._currentTheme = theme;
          this._applyTheme();
        }
      }
    }));
  }

  private _applyTheme(): void {
    console.log(`Themed card is using the ${this._currentTheme} theme.`);
  }
}

customElements.define('themed-card', ThemedCard);
```

By supporting both the declarative HTML interface (for simplicity) and the rich JavaScript, slot, mixin, decorator, and context interfaces (for complexity), your web component scales seamlessly from static documentation sites to complex, enterprise-grade single-page applications.
