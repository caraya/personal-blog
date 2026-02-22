---
title: Resilient Islands with the Temporal API
date: 2026-04-17
tags:
  - Eleventy
  - Javascript
  - Temporal API
---

While the [base concept of Island Architecture](/what-is-the-islands-architecture/) focuses on performance, there is a second major benefit: **Resilience**. By isolating components, we can ensure that if one fails (or isn't supported by the browser), the rest of the page remains unaffected.

This guide demonstrates an advanced pattern for [`@11ty/is-land`](/eleventy-island-guide/): building a `relative-date` component that relies on the modern (but not yet universal) JavaScript Temporal API. We will implement a "Show on Success" strategy to prevent both layout shifts and broken UI.

## The Strategy: "Show on Success"

Standard hydration often results in a "Flash of Unformatted Content" (FOUC) or "Layout Shift" as static HTML is replaced by a component. The "Show on Success" pattern flips this: the element remains invisible until the JavaScript confirms it can successfully render. This is particularly vital for the Temporal API, which currently lacks universal browser support.

### CSS (Global or Component-level)

We use the `:not([ready])` selector to keep the custom element out of the visual flow. By using display: none, we ensure that the element does not occupy space, preventing empty gaps if the browser fails the Temporal support check.

```css
/* Ensure the island doesn't affect layout until it is fully functional */
relative-date:not([ready]) {
  display: none;
}

/* Optional: Add a subtle fade-in effect for a smoother transition */
relative-date[ready] {
  display: inline;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### HTML in Eleventy

In your Eleventy templates (Nunjucks or Liquid), you pass the raw data through the cascade. Note that we provide no fallback text inside the relative-date tag. This ensures that if the browser doesn't support the logic, the user sees nothing rather than an unformatted date string.

```html
<is-land on:visible>
  <!-- The 'date' attribute is populated by Eleventy's data cascade -->
  <relative-date date="{{ page.date | htmlDateString }}"></relative-date>

  <template data-island>
    <!-- This script is only loaded when the element becomes visible -->
    <script type="module" src="/js/relative-date.js"></script>
  </template>
</is-land>
```

### The Component Script (JavaScript)

Save this file as /js/relative-date.js. This script implements the "Swap Strategy," allowing us to inject a complex, multi-unit time difference into a localized string while maintaining the correct grammar for "ago."

```js
/**
 * relative-date.js
 * Native Temporal Implementation (No Polyfill)
 */
function init() {
  // Exit immediately if the browser doesn't support the new Temporal API
  if (!globalThis.Temporal) {
    console.info('Temporal API not supported. Element will remain hidden.');
    return;
  }

  /**
   * Calculates and formats the relative date string.
   * Returns null if formatting fails, keeping the element hidden.
   */
  function formatRelativeDate(dateStr, locale = 'en-US') {
    try {
      const postDate = Temporal.PlainDate.from(dateStr);
      const today = Temporal.Now.plainDateISO();

      // Calculate the difference with years as the largest unit
      const diff = postDate.until(today, { largestUnit: 'year' });

      // Handle future dates (not expected for blog posts, but good for safety)
      if (diff.sign === -1) {
        return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'second');
      }

      const parts = [];
      const years = Math.abs(diff.years);
      const months = Math.abs(diff.months);
      const days = Math.abs(diff.days);

      const formatUnit = (val, unit) =>
        new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'long' }).format(val);

      if (years > 0) parts.push(formatUnit(years, 'year'));
      if (months > 0) parts.push(formatUnit(months, 'month'));
      if (days > 0) parts.push(formatUnit(days, 'day'));

      // If it's today, return a simple localized string
      if (parts.length === 0) {
        return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(0, 'day');
      }

      // Combine units (e.g., "1 year and 2 months")
      const listFormatter = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' });
      const detailedList = listFormatter.format(parts);

      // Use RelativeTimeFormat to get the correct "ago" context for the locale
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
      const largestUnit = years > 0 ? 'year' : (months > 0 ? 'month' : 'day');
      const largestValue = years > 0 ? years : (months > 0 ? months : days);

      const standardRelative = rtf.format(-largestValue, largestUnit); // e.g., "1 year ago"
      const standardUnit = formatUnit(largestValue, largestUnit);     // e.g., "1 year"

      // Swap the simple unit with our detailed list
      if (standardRelative.includes(standardUnit)) {
        return standardRelative.replace(standardUnit, detailedList);
      }

      return standardRelative;
    } catch (err) {
      console.error('Relative date calculation error:', err);
      return null;
    }
  }

  class RelativeDate extends HTMLElement {
    connectedCallback() {
      const date = this.getAttribute('date');
      // Automatically detect language from the HTML tag or default to English
      const locale = document.documentElement.lang || 'en-US';
      const formatted = formatRelativeDate(date, locale);

      if (formatted) {
        this.innerText = formatted;
        // The presence of this attribute triggers the CSS reveal
        this.setAttribute('ready', '');
      }
    }
  }

  if (!customElements.get('relative-date')) {
    customElements.define('relative-date', RelativeDate);
  }
}

init();
```

## Resilience and Fallback Strategies

A key tenet of Island Architecture is that the failure of one island should not compromise the integrity of the whole page.

### The "All or Nothing" Logic for Temporal

In this implementation, we've prioritized a clean UI over a degraded one.

1. **Initial State**: The relative-date tag is rendered by Eleventy, but remains display: none via CSS.
2. **Dynamic Loading**: When the user scrolls to the island, is-land fetches the script.
3. **Graceful Exit**: If the script loads but finds no Temporal support (e.g., in an older version of Safari or Chrome), the script silently exits. The element stays display: none.
4. **Successful Reveal**: Only when the logic produces a valid human-readable string does the ready attribute appear, instructing the browser to finally show the element.

## Performance Implications & Core Web Vitals

Using islands directly correlates to better performance scores, specifically targeting the metrics that search engines prioritize.

Total Blocking Time (TBT)
: In traditional hydration, the main thread is "blocked" while the browser parses and executes a large bundle. By using on:idle or on:visible, we break up these tasks into smaller chunks, allowing the browser to remain responsive to user scrolls and clicks.

Interaction to Next Paint (INP)
: If a user tries to interact with a page while a massive script is hydrating, the browser will feel sluggish. Islands ensure that interactivity is localized. A script for a relative date won't interfere with the interactivity of a search bar at the top of the page.

Cumulative Layout Shift (CLS)
: Because we use display: none for the initial state of the relative-date component, it doesn't occupy any height or width in the document flow. When it is revealed, it appears as an inline element, which (if placed correctly within a line of text) results in zero layout shift.

## Integration Checklist

1. **Dependency**: Install the component via npm install @11ty/is-land.
2. **Asset Management**: Ensure your Eleventy build process (like eleventy-plugin-bundle or a simple pass-through) copies the is-land.js and relative-date.js files to your _site directory.
3. **Global Styles**: Include the :not([ready]) CSS in your main stylesheet to prevent FOUC.
4. **Template Wrapping**: Audit your templates for non-critical JS and wrap them in &lt;is-land> tags with appropriate triggers. on:visible is usually the safest and most effective default for metadata.

## Next Steps

Now that you've mastered resilient components, take it to the next level by building a full development environment inside an island:

*   **[Capstone: Typescript Playgrounds Implementation](/typescript-playgrounds-implementation/)**: Learn how to run a complete Node.js-like environment in the browser using Sandpack and Import Maps.

