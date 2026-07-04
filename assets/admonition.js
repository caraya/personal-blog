/**
 * Admonition Web Component
 * A modular, accessible callout component with dynamic title overrides.
 */
export class Admonition extends HTMLElement {
    _container = null;
    _srLabel = null;
    _contentSlot = null;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = this.renderStyles() + this.renderTemplate();
            this._container = this.shadowRoot.querySelector('.admonition');
            this._srLabel = this.shadowRoot.querySelector('.sr-only-label');
            this._contentSlot = this.shadowRoot.querySelector('slot');
            this._contentSlot?.addEventListener('slotchange', () => {
                this.syncAccessibilityState();
            });
        }
    }
    static get observedAttributes() {
        return ['type', 'no-icon', 'plain', 'title'];
    }
    connectedCallback() {
        if (!this.hasAttribute('tabindex')) {
            this.setAttribute('tabindex', '0');
        }
        this.syncAccessibilityState();
    }
    /**
     * Synchronizes attributes to the internal container and CSS variables.
     */
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
        this.syncAccessibilityState();
        // `--color` is handled purely via CSS (authors can set `--color` in
        // the element's `style`); do not treat it as an observed attribute.
    }
    getTypeLabel() {
        const type = this.getAttribute('type');
        const explicitTitle = this.getAttribute('title');
        if (explicitTitle)
            return explicitTitle;
        switch (type) {
            case 'warning':
            return 'Watch Out!';
            case 'info':
                return 'FYI';
            case 'tip':
            case 'note':
                return 'Tip';
            case 'danger':
                return 'Danger';
            case 'todo':
                return 'TODO';
            default:
                return 'Note';
        }
    }
    getTypeRole() {
        return this.getAttribute('type') === 'danger' ? 'alert' : 'note';
    }
    getSlottedText() {
      if (!this._contentSlot)
        return this.textContent?.replace(/\s+/g, ' ').trim() || '';
      const assignedNodes = this._contentSlot.assignedNodes({ flatten: true });
      return assignedNodes
        .map((node) => node.textContent || '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
    syncAccessibilityState() {
        if (!this._container)
            return;
        const label = this.getTypeLabel();
      const contentText = this.getSlottedText();
        this.setAttribute('role', this.getTypeRole());
      this.setAttribute('aria-label', contentText ? `${label}. ${contentText}` : label);
      this.removeAttribute('aria-labelledby');
      this.removeAttribute('aria-describedby');
        if (this._srLabel) {
            this._srLabel.textContent = label;
        }
    }
    renderTemplate() {
        return `
      <div class="admonition">
        <span class="sr-only-label"></span>
        <slot></slot>
      </div>
    `;
    }
    renderStyles() {
        return `
      <style>
        :host {
          --font-sans: system-ui, -apple-system, sans-serif;
          --icon-font: "Segoe UI Emoji", "Apple Color Emoji", "Font Awesome 6 Free", sans-serif;
          
          /* Colors */
          --color-orange: oklch(70% 0.2 45);
          --color-purple: oklch(68% 0.18 300); /* For TODO */
          --color-blue: oklch(60% 0.15 250);
          --color-green: oklch(65% 0.2 145);
          --color-red: oklch(60% 0.2 25);
          --color-accent: oklch(60% 0 0); /* Default Gray */
          --color-light: color-mix(in lab, var(--color, var(--color-accent)), white 92%);
          
          display: block;
        }

        :host(:focus-visible) {
          outline: 3px solid var(--color, var(--color-accent));
          outline-offset: 0.2rem;
          border-radius: 0.3rem;
        }

        .sr-only-label {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .admonition {
          /* Mapping logic: 
             Check --label (the override/inline style) first, 
             then fallback to the internal default.
          */
           --_color: var(--color, currentColor);
           --_bg: var(--color-light, color-mix(in lab, var(--_color, var(--color-accent)), white 92%));
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

        /* Overlapping Label */
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

        /* Floating Icon */
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

        /* Type Variants */
        :host([type="warning"]) { --color: var(--color-orange); --label: "Watch Out!"; --icon: "⚠️"; --color-light: color-mix(in lab, var(--color), white 92%); }
        :host([type="info"]) { --color: var(--color-blue); --label: "FYI"; --icon: "ℹ️"; --color-light: color-mix(in lab, var(--color), white 92%); }
        :host([type="tip"]), :host([type="note"]) { --color: var(--color-green); --label: "Tip"; --icon: "💡"; --color-light: color-mix(in lab, var(--color), white 92%); }
        :host([type="danger"]) { --color: var(--color-red); --label: "Danger"; --icon: "🛑"; --color-light: color-mix(in lab, var(--color), white 92%); }
        :host([type="todo"]) { --color: var(--color-purple); --label: "TODO"; --icon: "📋"; --color-light: color-mix(in lab, var(--color), white 92%); }
      </style>
    `;
    }
}
if (!customElements.get('custom-admonition')) {
    customElements.define('custom-admonition', Admonition);
}
