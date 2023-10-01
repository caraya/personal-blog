---
title: "Conditional CSS using CSS feature queries"
date: "2017-01-30"
---

In Javasacript we've been able to detect support for specific features almost since day one, at least since we decided that detecting browsers and equating a browser/version combination with support for a feature wasn't a good idea after all.

Take the examples below used to detect if a browser suports HTML Imports, Custom Elements V1 and Shadow DOM v1. Each of the functions will return true or false based on current browser support We can then break our code based on the functions' results.

```javascript
function supportImports() {
  return 'import' in document.createElement('link');
}

function supportsCustomElementsV1() {
  return 'customElements' in window;
}

function supportsShadowDOMV1() {
  return !!HTMLElement.prototype.attachShadow;
}
```

Until very recently it was impossible to do this in CSS without having to use multiple selector definitions and code that is hard to debug and reason through. The `@supports` at-rule fixes this by allowing developers to create code that will only run if the condition is met.

For example, if we want to create content for browsers that support CSS Grids we can do so with code like this:

```css
@supports ( display: grid ) {
  .foo {
    display: grid; 
  }
}
```

We can chain statements together using logical operators (`and` and `or`) to take create compound tests. The example below uses compound queries to take into account vendor prefixes when using linear gradients. The idea is that, if any of the values we test for support is true we then use them as values in the `.foo` class.

```css
@supports (background: -webkit-linear-gradient(top, #0C93C0, #FFF)) or 
          (background:    -moz-linear-gradient(top, #0C93C0, #FFF)) or 
          (background:         linear-gradient(top, #0C93C0, #FFF)) {
  .foo {
    background: -webkit-linear-gradient(top, #0C93C0, #FFF);
    background:    -moz-linear-gradient(top, #0C93C0, #FFF); 
    background:         linear-gradient(top, #0C93C0, #FFF);    
  }

}
```

Another example is creating special code for browsers that support both `display: grid` and modern flexbox (`display: flex`), a different layout for browsers that only support flexbox and a common layout for everyone else.

Note how we add multiple rules under each `@support` at-rule. That way we reduce the numbers of @support at-rules and we group all the rules that fall under a given support block.

I asked Fantasai on Twitter if the cascading rules applied to feature queries. I've pasted the exchange below along with my understanding of her answer.

<blockquote class="twitter-tweet" data-cards="hidden" data-partner="tweetdeck"><p lang="en" dir="ltr"><a href="https://twitter.com/elrond25">@elrond25</a> <a href="https://twitter.com/alanstearns">@alanstearns</a> They're just like <a href="https://twitter.com/media">@media</a>: they're conditionals on their contents</p>— fantasai (@fantasai) <a href="https://twitter.com/fantasai/status/820109512761700354">January 14, 2017</a></blockquote>

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

If I understood this correctly all feature queries will be parsed and all matching content will be played. If more than one rule for a selector is found then the last one found will be used.

```css
/* plain classes without support for grid or flexbox */
.foo {
  display: block;
}

.foo nav {
  display: table;
}

/* supports only flexbox */

@supports (display: flex) {
  .foo {
    display: flex;
  }

  nav {
    display: flex;
  }
}

/* supports both flex and grid */
@supports (display: grid) and (display: flex) {
  .foo {
    display: grid;
  }

  nav {
    display: flex;
  }
}
```

Using feature queries we can create strong feature based styles and be sure that whatever styles we use will work as intended on the browsers we target. This is not a "get out of good design free card" in that this is not an excuse for poor design. Think of feature queries as progressive enhancement (there we go again, those dirty words) and tailor the experience for supported browsers as needed.
