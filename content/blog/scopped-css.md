---
title: "Scopped CSS"
date: "2023-08-02"
---

Scopped CSS has been a hot topic in front-end development. It is designed to give you tighter control over your styles and how they interact with each other.

## The @scope at-rule

The `@scope` root at-rule declares a scoping root and optional scoping limits associated with a set of style rules.

Using the `@scope` at-rule we can specify:

* Rules that apply to all elements in the scope using the `:scope` seelector
* Rules that apply to specific elements in the scope that will override the default rules

This example defines a scope of `.card`. All elements with a the class will be in scope.

Inside the `@scope (.card)` at rule we define the rules for all the elements in scope inside the `:scope` slector.

We also define a title element that will override the defaults and add its own styles.

```css
@scope (.card) {
  :scope {
    padding: 1rem;
    background-color: white;
    font-family: Raleway, sans-serif;
  }

  .title {
    font-size: 1.2rem;
    font-family: Georgia, serif;
  }
}
```

### Inner scope boundaries

Scoped styles won’t target anything inside elements with `slot` class. This gives us a way to bypass the scoped styles.

```css
@scope (.card) {
  /* Scope the following styles to inside `.card` */
  :scope {
    padding: 1rem;
    background-color: white;
  }

  .title {
    font-size: 1.2rem;
    font-family: Georgia, serif;
  }
}
```

Using the styles above and the HTML below. The elements inside the `slot` class element will not get the default styles.

```html
<div class="card">
  <h3 class="title">Moon lander</h3>
  <div class="slot">
    <p>Content here is not affected by scopped style.</p>
  </div>
</div>
```

### Proximity precedence

@scope gives us a way to style elements based on proximity, not just source order and specificity.

What this means: styles will match the closest ancestor @scope definition.

with these scope definitions

```css
@scope (.green) {
  p {
    color: green;
  }
}

@scope (.blue) {
  p {
    color: blue;
  }
}
```

And the following HTML elements, the first example will produce an inner blue paragraph.

```html
<div class="green">
  <p>I’m green</p>
  <div class="blue">
    <p>I’m blue</p>
  </div>
</div>
```

And in this example the inner paragraph will be green since it's the closest scope to the element we're working with.

```html
<div class="blue">
  <p>I’m blue</p>
  <div class="green">
    <p>But I’m green</p>
  </div>
</div>
```

Using scopped CSS is not the same as using Layers. The way I see their relationship is similar to that between media queries and styles queries. Layers work on the macro level (isolating large groups of CSS rules) while scopped styles let you work with individual types of components.

## References

* [Scoping Styles: the @scope rule](https://drafts.csswg.org/css-cascade-6/#scoped-styles) — W3C specification
* [An introduction to @scope in CSS](https://fullystacked.net/posts/scope-in-css/)
* [Scoped CSS is Back](https://keithjgrant.com/posts/2023/04/scoped-css-is-back/)
