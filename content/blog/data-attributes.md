---
title: Data attributes
date: 2024-09-16
tags:
  - HTML Attributes
  - CSS
  - Javascript
---

Semantic HTML has an extensibility mechanism that allows adding extra data on elements using the `data-*` syntax. This replaces older hacks such as non-standard attributes, or extra properties on DOM.

The syntax is simple. Any attribute on any element whose attribute name starts with `data-` is a data attribute. Say you have an article and you want to store some extra information that doesn't have any visual representation.

```html
<article
  id="electric-cars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">

  <h1>Article Title</h1>

  <p>Article Content</p>
</article>
```

## JavaScript access

Reading the values of these attributes out in JavaScript is also very simple. You can use `getAttribute()` with their full HTML name to read them, but the standard defines a simpler way: a `DOMStringMap` you can read out via a `dataset` property.

To get a data attribute through the dataset object do the following:

* Define the object that holds the properties
* use the `dataset` method to fully build the element to query
* convert the properties from kebab (property-name) to camel case (propertyName)

```js
const article = document.getElementById("electric-cars")
// The following would also work:
// const article = document.querySelector("#electric-cars");

article.dataset.columns; // "3"
article.dataset.indexNumber; // "12314"
article.dataset.parent; // "cars"
```

To set a data property via Javascript, just assign a value to the corresponding dataset property.

```js
article.dataset.columns = 5;
article.dataset.indexNumber = 42;
article.dataset.parent = "vehicles";
```

If the attribute doesn't exist it will be created with the value that we assign.

This command will do a reverse conversion and will add the attribute as `data-some-data` attribute to the element and assign myData as the value.

```js
article.dataset.someData = "mydata";
```

## CSS access

Since data attributes are plain HTML attributes, you can access them from CSS like you do with other attributes. To show the parent data on the article you can use generated content in CSS with the [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) property and the [attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) function:

```css
article::before {
  content: attr(data-parent);
}
```

You can also use CSS [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to change styles according to the data:

```css
article[data-columns="3"] {
  width: 400px;
}

article[data-columns="4"] {
  width: 600px;
}
```

## Combining CSS and Javascript

Before lazy loading became a part of HTML we had to use third party libraries or write our own code to lazy load images on a page. The code looks something like this:

```js
function lazyLoad() {
  const images = document.querySelectorAll('img.lazy-load');
  const options = {
    root: null, // Default to the browser viewport
    rootMargin: '0px',
    // Trigger when 10% of the image is in view
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src'); // Set the src attribute from data-src
        img.classList.remove('lazy-load'); // Optional: Remove lazy-load class once the image is loaded
        observer.unobserve(img); // Stop observing once loaded
      }
    });
  }, options);

  images.forEach(image => {
    observer.observe(image);
  });
}

// Call lazyLoad on page load
window.addEventListener('DOMContentLoaded', lazyLoad);
```

Many of the things we use data attributes can also be acomplished using CSS variables, especially those created with the [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) at-rule.

Which one you use is a matter of preference.
