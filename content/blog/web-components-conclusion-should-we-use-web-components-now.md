---
title: "Web Components Conclusion: Should we use web components now?"
date: "2015-10-07"
categories: 
  - "technology"
  - "web-components"
---

It depends on your target platforms. The only desktop browser to fully implement web components is Chrome (and by extension Opera) so the `webcomponent.js` polyfill must be used for any kind of meaningful support. It's also important to note that the polyfills don't work particularly well on mobile devices and I haven't tested them in any e-book reader (where I assume they will not work.)

It depends on the the scope of your planned components. If your planning to progressively upgrade elements on your page then it makes sense to take the plunge and use them now. However, if you're planning full blown applications based on components you may be better off waiting until the specifications finalilze and browsers add native support.

I had initial concerns about the technologies and their support but after the [Polymer Summit](https://www.polymer-project.org/summit/) the concerns were calmed and it became intriguing to play with Polymer again.

I have a few apps and elements that have been updated to 1.0

- [Athena Document](https://caraya.github.io/athena-document/elements/athena-document/index.html): A markdown viewer using juicy-markdown to parse the document.
- [Udacity Catalog](http://caraya.github.io/api-demo/#!/courses): An experiment using iron-ajax to pull the JSON data for Udacity's catalog and display it using custom elements from the [Polymer element catalog](https://elements.polymer-project.org/)
