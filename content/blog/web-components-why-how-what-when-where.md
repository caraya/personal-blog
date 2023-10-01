---
title: "Web Components: Why? How? What? When? Where?"
date: "2015-09-14"
categories: 
  - "technology"
  - "web-components"
---

Now that Polymer has reached 1.0 and that browser vendors are talking about web components, it is time to revisit web components with a more critical eye and ask the following questions:

- **What** are web components?
- **Why** use web components? Why not?
- **How** to use web components?
- **Where** to use web components?
- **How** to build web components?
- **Should we use** web components now?

We will discuss 3 web component implementations:

- Vanilla web components built by hand using only HTML, CSS and Javascript
- Mozilla's [x-tags](https://developer.mozilla.org/en-US/Apps/Tools_and_frameworks/Web_components)
- Google's [Polymer project](https://www.polymer-project.org/1.0/)

In order to make web components work on all modern browsers we must rely, to some degree, in a set of web components [polyfill libraries](http://webcomponents.org/polyfills/) to make sure that the components will work as intended. The only browser to fully support web components is Chrome (as of version 36.) The polyfill is smart enough to know when to let the native systems take over and, if you're not convinced, there are ways to conditionally load the polyfill only if the elements you need are not supported.

With all that out of the way, let's dive to web components.
