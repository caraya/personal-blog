---
title: Instant loading and the speculation rules API
date: 2025-06-25
tags:
  - Performance
  - Web
  - Javascript
---

The Speculation Rules API allows developers to hint the browser about which pages a user is likely to navigate to next, enabling the browser to prefetch or prerender those pages. This can lead to near-instant page loads and a significantly improved user experience.

This post will cover the basics of the Speculation Rules API, how to use it and the benefits it provides, as well as its current browser support status.

## What is the Speculation Rules API?

Speculation rules are a declarative JSON-based syntax, defined inside a `script type="speculationrules"` tag. They allow developers to inform the browser about which pages a user is likely to navigate to next. This enables the browser to proactively fetch (prefetch) or even fully render (prerender) those pages in the background.

The primary benefit of speculation rules is a significant improvement in navigation performance, leading to a much better user experience:

* **Near-Instant Page Loads**: By prerendering a likely next page, the transition can feel instantaneous because the page is already loaded and rendered before the user even clicks the link
* **Faster Resource Availability**: Prefetching ensures that when a user navigates, the necessary HTML, CSS, and JavaScript files are already in the browser's cache, speeding up the rendering process.
* **Reduced Latency**: It helps mitigate network latency by fetching resources ahead of time.

## Browser Support and Baseline

The Speculation Rules API is only supported in Chromium-based browsers.

Both WebKit and Mozilla have expressed interest in the API and also concern over complexity. As of now, there is no support in Firefox or Safari and, I believe, it's unlikely to be fully implemented in the near future, if at all.

## Use Cases and Examples

The Speculation Rules API supports two main actions: **prefetching** and **prerendering**.

Prefetching will download the page and its resources but will not render it, keeping in the cache for later use.

Prerendering will download and render the page, making it ready for immediate display when the user navigates to it.

These rules are defined in a `script` tag with the type set to `speculationrules` and are written in JSON format and can be written individually in their own script tag or together in a single tag, the choice is up to the developer.

### Prefetching with a List of URLs

This rule tells the browser to immediately prefetch specific pages by listing their URLs directly.

```html
<script type="speculationrules">
{
  "prefetch": [{
      "urls": [
        "/about.html",
        "/contact.html"]
  }]
}
</script>
```

### Prefetching Based on Document Rules

This rule uses a pattern (`href_matches`) to find all links that point to articles and prefetches them when a user hovers over them.

The eagerness attribute controls when the speculation happens. The possible values are:

immediate
: The browser speculates on the URLs as soon as the rule is processed.

eager
: The browser speculates (runs the speculation code) as soon as a user hovers over a link (with a ~200ms delay).

moderate
: The browser speculates on hover (no delay) or on pointerdown (when the user starts clicking).

conservative
: The browser speculates only on pointerdown.

```html
<script type="speculationrules">
{
  "prefetch": [{
    "where": {
      "href_matches": "/articles/*"
    },
    "eagerness": "eager"
  }]
}
</script>
```

### Prerendering with a List of URLs

This rule tells the browser to immediately prerender a high-priority page, making it load instantly when clicked.

```html
<script type="speculationrules">
{
  "prerender": [{
    "urls": [
			"/most_popular_product.html"
		]
  }]
}
</script>
```

### Prerendering Based on Document Rules

This rule uses a CSS selector (`selector_matches`) to find all links within the "product-gallery" section and prerenders them on hover or pointer down using the eagerness rules discussed earlier.

```html
<script type="speculationrules">
{
  "prerender": [{
    "where": {
      "selector_matches": ".product-gallery a"
    },
    "eagerness": "moderate"
  }]
}
```

## Considerations, Best Practices and Final thoughts

While the Speculation Rules API can significantly enhance performance, it is essential to use it judiciously:

* **Avoid Overuse**: Speculating on too many pages can lead to excessive resource consumption, especially on mobile devices with limited bandwidth and battery life
* **Monitor Performance**: Regularly test and monitor the performance impact of your speculation rules to ensure they are providing the intended benefits without causing negative side effects
* **User Experience**: Ensure that the pages you speculate on are genuinely likely to be visited next. Speculating on irrelevant pages can lead to wasted resources and a poor user experience
* **Use as progressive enhancement**: Use the Speculation Rules API as a progressive enhancement so that browsers that don't support the API load the pages normally.

## Links and Resources

* <https://calendar.perfplanet.com/2024/speculative-loading-and-the-speculation-rules-api/>
* <https://wicg.github.io/nav-speculation/speculation-rules.html>
* <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/speculationrules>
* <https://caniuse.com/speculation-rules>
