---
title: Keeping hidden text findable
date: 2025-03-31
tags:
  - Accessibility
  - HTML
---

Text that is visually hidden cannot be found by the browser's find-in-page feature and may not be visible to accessible technology like screen readers. This is a problem for screen reader users, who rely on this feature to navigate content. This post explains how to make hidden text findable for everyone.

## The problem

hidden text in a web page is not searchable when you use the browser's built-in find-in-page feature. This is a problem for screen reader users, who rely on this feature to navigate content. For example, if a user is looking for a specific word or phrase in hidden sections of a document, they may not be able to find it if it is hidden from view.

## One possible solution

One solution that avoids Javascript is to use the `hidden` attribute with the value `until-found`. This attribute is a new HTML feature that allows you to hide content until it is found by the user. When the user searches for a word or phrase, the hidden content will be revealed, making it accessible to everyone.

This example lets you find content inside the `details` elements, even if they are not visible on the page.

The first set of `summary` elements has the `hidden` attribute with the `until-found` value. These elements are visually hidden but are searchable and accessible to assistive technology.

The second set of `details` elements are the ones that hold the content that will be searched. These elements make up a mutually exclusive accordion where only one of the `details` elements can be open at a time.

```html
	<!-- Visually hidden until found -->
  <summary hidden="until-found">What is this page about?</summary>
  <summary hidden="until-found">How does hidden="until-found" work?</summary>
  <summary hidden="until-found">Where can I learn more?</summary>

  <div class="accordion">
    <label>
      <details open name="exclusive">
        <summary>What is this page about?</summary>
        <p>This page demonstrates a native-only, mutually exclusive accordion with <code>hidden="until-found"</code> support.</p>
      </details>
    </label>

    <!-- Accordion Item 2 -->
    <label>
      <details name="exclusive">
        <summary>How does hidden="until-found" work?</summary>
        <p>It allows hidden content to be revealed by browser search (e.g., Ctrl+F), improving accessibility without showing everything upfront.</p>
      </details>
    </label>

    <!-- Accordion Item 3 -->
    <label>
      <details name="exclusive">
        <summary>Where can I learn more?</summary>
        <p>Check out <a href="https://schepp.dev/posts/rethinking-find-in-page-accessibility-making-hidden-text-work-for-everyone/" target="_blank">this blog post by Schepp</a> for the full story.</p>
      </details>
    </label>
  </div>
```

Examples like these are good as a starting point for further explorations of the `hidden` attribute and how to use the different values.

This is also part of [Interop 2025](https://web.dev/blog/interop-2025#the_details_element) so we will see wider support across browsers in the near future.

## Links and resources

* [Rethinking Find-in-Page Accessibility: Making Hidden Text Work for Everyone](https://schepp.dev/posts/rethinking-find-in-page-accessibility-making-hidden-text-work-for-everyone/)
* [hidden="until-found"](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden#the_hidden_until_found_state)
* [Making collapsed content accessible with hidden=until-found](https://developer.chrome.com/docs/css-ui/hidden-until-found)
