---
title: "Scope in CSS: the @scope at-rule"
date: 2023-12-04
draft: true
---

One of the most infuriating things of CSS, for me, is [specificty](https://web.dev/learn/css/specificity) and how you have to make compromises when writing your stylesheets.

You want your styles to be specific about the elements you're targeting but you also want them to be easy to override.

For example, if you want to style the hero image on the header of an article element, you may write something like

```css
article > header > img.hero-image {
	/* Code goes here */
}
```

This is specific enough that will only cover the images that we want but presents some drawbacks:

* Using descendant selectors ties the CSS  to the markup
  * If we change the structure of the page then we must change the CSS
* Specificity makes it hard to change the CSS if we need to adapt for specific hero images in different headers
  * This is also an issue if you want to create reusable CSS that will work in multiple projects

Calculating specifity is not easy. We have to look at each component of our selector, they each have a different weight for the specificity value as shown in the following figure:

![[specifishity.com](https://specifishity.com/) -- Estelle Weyl (click the link for a high resolution PDF)](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/specificity-weyl)

TO get a value of selector, you can calculate it by hand or use tools like the [Specificity calculator](https://specificity.keegan.st/) to get the different values and then make sure that the specificity of your update rules matches or is higher than

## Enter @scope

The [@scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) at-rule helps reduce the specificity requirements in our content by limiting how far up in the element tree for the document, it has to search for matches.

Throughout the post, I will reference this HTML structure.

```html
<div class="wrapper">
  <header>
      <h2>My Awesome Page</h2>
  </header>

  <article>
    <header>
      <h2>Article title</h2>
    </header>

    <h2>subheading</h2>

    <h2>subheading</h2>

    <footer>
      <h2>First footer heading</h2>
    </footer>
  </article>
</div>
```

And the following base CSS.

```css
.wrapper {
  width: 80vw;
  margin: 0 auto;
}

h2 {
  color: blue;
}
```

With these base styles, all `h2` elements are blue

```css
@scope (article header) {
  h2 {
    color: magenta;
    font-style: italic;
    font-size: 3rem;
  }
}

@scope (footer) {
  h2 {
    color: green;
  }
}
```

## Links and Resources

* [@scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) &mdash; MDN
* [Limit the reach of your selectors with the CSS @scope at-rule](https://developer.chrome.com/articles/at-scope/)
