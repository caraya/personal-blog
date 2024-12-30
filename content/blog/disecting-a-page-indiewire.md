---
title: Disecting A Page -- IndieWire
date: 2025-01-08
tags:
  - CSS
  - HTML
  - Javascript
baseline: true
---

[It All Led to ‘Dune’](https://www.indiewire.com/p/denis-villeneuve-career-lookback-interview/) is a very interesting and challenging page to dissect. It has many different elements and APIs that can be used to create a similar page. In this post, we will go through the different elements and APIs that can be used to create a similar page.

## General Observations

The most intersting aspect of the page is that it uses WordPress as a CMS so deciphering the added complexity is a very interesting exercise.

It also appears that the site is using [Animate On Scroll](https://wordpress.org/plugins/animate-on-scroll/) WordPress plugin and the corresponding JS library,the full site editor and, possibly, the Gutenberg plugin (I can't tell if the WordPress editor keeps the Gutenberg prefix or not).

One thing that I find jarring about the design is that each paragraph of text fades in on its own using the [Animate On Scroll](https://wordpress.org/plugins/animate-on-scroll/) WordPress plugin. This is distracting and annoying. Does it really need to animate every paragraph and image? Does it add to the user experience?

## Generating the layout

<baseline-status
	featureId="grid">
</baseline-status>

The layout uses the WordPress [columns block](https://wordpress.org/documentation/article/columns-block/) to setup the content.

Rather than use the direct equivalent of Flexbox, I choose to use css Grid instead. It gives me more flexibility in placing items and can give the same functionality as other blocks we'll cover later.

The easiest grid is a 12 equal-width columns grid, using the repeat function and the fr fractional unit.

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}
```

Another design is a compound [4+3 compound grid](https://stuffandnonsense.co.uk/blog/how-a-3-4-compound-grid-can-improve-on-12-columns). I find this more flexible than the 12 column grid.

The idea is that we can use the 1fr columns as spacers between the different pieces of content and the 2fr columns as the main content areas. As we'll discuss in the next section, we can also place items in different areas of the grid independently of each other.

```css
.grid-container {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 2fr 2fr 1fr 1fr 2fr;
  grid-template-rows: 100px;
  gap: 10px;
}
```

## Placing content on the grid

One of the advantages of using grid is that it allows for specific placement of items inside the grid. This will create a more visually appealing layout that is easier to deal with.

Before we play with placement, we'll style the item children of the grid container.

```css
.item {
  border: 2px solid black;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: fuchsia;
  color: white;
}
```

The following examples will show how to place items in the 4+3 compound grid.

### Headers and full bleed images

Both headers and full bleed images span the full width of the grid. The negative number as the second value of `grid-column` tells the item to span from end of the grid.

These two declarations are equivalent.

The first one uses a negative number to indicate that we go to the end of the grid (the first column in reverse order).

```css
.full-bleed {
  grid-column: 1 / -1;
}
```

The next example uses positive numbers to present the same thing, a way to display content that spans the full width of the grid.

```css
.full-bleed {
  grid-column: 1 / 9;
}
```

The differece is in the code that makes up each type of component.

The full bleed image adds the class to the figure element.

```html
<figure class="full-bleed">
  <img src="path/to/images/image.avif" alt="Dublin Library">
  <figcaption>Dublin Library Ireland</figcaption>
</figure>
```

```css
figure.full-bleed {
  grid-column: 1 / -1;
  background-size: cover;
  margin-inline: 0;

  figcaption {
    text-align: center;
    font-size: 1rem;
  }
}
```

We can also apply the full bleed to headers where there may be content that may or may not span the full width of the grid.

```css
.full-bleed {
  grid-column: 1 / -1;
  background-size: cover;
  margin-inline: 0;
}
```

An example of what a header might look like. We can play with the styles inside the header to make it look more like the IndieWire page.

```html
<header>
	<h2>The Best Library in the World</h2>
	<figure class="image-container">
    <img src="https://via.placeholder.com/400x300" alt="Header Image">
  </figure>
</header>
```

### Placing the main text

Placing the main body of text in the grid is as simple as setting the [grid-column](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) and [grid-row](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row) shorthand properties.

In this example we place the main content (all elements with the `main-content` class) between columns 3 and 7.

```css
.main-content {
  grid-column: 3/7;
}
```

Then you can place the main content in the grid. Each element that matches the class will be placed on the corresponding columns and in subsequent rows automatically.

We trade repetition (we have to add the class to all elements we want centered) for flexibility (the placement is automatic).

```html
  <p class="main-content">Accusamus nostrum minima commodi harum corporis aspernatur aperiam soluta consequatur. Doloribus culpa voluptate velit.</p>
  <p class="main-content">Dolorem id, quod rerum cupiditate repellendus, minima cum dolorum asperiores reprehenderit iure placeat?</p>
```

This would also work to place images in the main content.

```html
<figure class="main-content">
  <img src="path/to/images/image.avif" alt="Dublin Library">
  <figcaption>Dublin Library Ireland</figcaption>
</figure>
```

With the only remaining thing is to style the images in the main content.

```css
figure.main-content {
  img {
    width: 800px;
    aspect-ratio: 4/3;
  }

  figcaption {
    font-size: 1rem;
  }
}
```

### Placing text on specific areas of the grid

The grid allows for placing text on any cell within the grid. Because of how we set the grid, we can place the text in rows that haven't been created yet.

The following example shows utility classes that place content in different areas of the grid.

```css
.far-left {
  grid-column: 1/ 2;
  background-color: lightblue;
}

.left {
  grid-column: 2 / 4;
  background: lightblue;
}

.full-left {
  grid-column: 1 / 4;
  background: lightgreen;
}

.full-right {
  grid-column: -1 / -4;
  background: lightgreen;
}

.right {
  grid-column: -4 / -2;
  background-color: hotpink;
}

.far-right {
  grid-column: -1 / -2;
  background: hotpink;
}
```

You can also place content in specific cells in the grid. This example places the content between columns 4 and 7 and rows 1 and 2.

```css
.example {
  grid-column: 4 / 7;
  grid-row: 1 / 2;
  background: lightcoral;
}
```

### Placing images in the grid

Using the same techniques as before we can place images in the grid.

You must ensure that images are explicitly sized in HTML or CSS. If you don't then the images may expand outside the grid.

```css
figure.far-left {
  grid-column: 1/ 2;
  img {
    width: 400px;
    aspect-ratio: 4/3;
  }
}
```

### Intersection Observer to Reveal Images

<baseline-status
	featureId="intersection-observer">
</baseline-status>

The [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) is a powerful tool that allows you to observe when an element enters or exits the viewport. This can be used to lazy load images, reveal elements on scroll, and more.

The IndieWire page has images fly in from the side as they are revealed. I'd rather just fade them in. This can be done by adding a class to the image when it is in view.

I've chosen to use the native [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to reveal images on scroll. This is a more performant solution than using a third-party library and it helps me manage the CSS classes necessary for the reveal to work.

1. Check if the browser supports IntersectionObserver
2. Select all `img` elements inside `figure` tags. This ensures we are observing the images we want to reveal when they come into view
3. Apply the `lazy-loaded` class to all images initially. This class should set the initial opacity and transition rule in CSS
4. Function to handle intersection events for observed elements
5. Loop through each observed element
6. Check if the element is visible in the viewport
7. Remove the `lazy-loaded` class to stop showing the placeholder state and add the `revealed` class to apply the final styling
8. Stop observing this image, as it has already been revealed
9. Create a new `IntersectionObserver` instance. This observes when elements enter or leave the viewport
10. Add the observer to each image on the page
11. Fallback for browsers that don't support `IntersectionObserver`. This ensures that images are shown without lazy-loading
12. Immediately reveal all images by removing the `lazy-loaded` class

```js
// 1
if ('IntersectionObserver' in window) {
  // 2
  const images = document.querySelectorAll('figure img');

  // 3
  images.forEach(image => {
    image.classList.add("lazy-loaded");
  });

  // 4
  function handleIntersection(entries, observer) {
    // 5
    entries.forEach(entry => {
      // 6
      if (entry.isIntersecting) {
				const image = entry.target;
        // 7
        image.classList.remove("lazy-loaded");
        image.classList.add("revealed");

        // 8
        observer.unobserve(image);
      }
    });
  }

  // 9
  const observer = new IntersectionObserver(handleIntersection);

  // 10
  images.forEach(image => observer.observe(image));
} else {
  // 11
  console.warn("IntersectionObserver is not supported in this browser.");

  // 12
  const images = document.querySelectorAll('figure img');
  images.forEach(image => image.classList.remove("lazy-loaded"));
}
```

## Parallax scrolling

The last part of the IndieWire page that we'll cover is the parallax scrolling effect. I've chose to use browser native CSS and Javascript to create the effect.

Most of the parallax effects I've seen work in sections but there's no reason why you can't apply to smaller elements like a series of images (full bleed or part of the main content).

The basic HTML structure looks as follows:

```html
<div class="parallax" id="parallax">
  <img src="images/santiago002.jpg" alt="Background">
  <div class="content">
    <h1>Parallax Scrolling</h1>
    <p>Scroll down to see the effect.</p>
  </div>
</div>
<section style="background: #333; color: white;">
  <h2>Content Section</h2>
</section>
```

The CSS code handles position of the different elements that make the parallax effect work. Most of the code revolves around the position of the containers and the images.

```css
.parallax {
  position: relative;
  height: 100vh;
  overflow: hidden;

  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: -1;
  }
}

.content {
  position: relative;
  z-index: 1;
  padding: 20px;
  color: white;
  text-align: center;
}

section {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

The Javascript code listens for the scroll event and moves the image up or down depending on the scroll position. The [translateY](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translateY) property is used to move the image up or down.

```js
document.addEventListener("scroll", () => {
  const parallax = document.getElementById("parallax");
  const offset = window.pageYOffset;
  const img = parallax.querySelector("img");

  img.style.transform = `translateY(${offset * 0.5}px)`;
});
```

## Conclusion

None of these techniques are complicated and they can be used to create complex and visually appealing layouts. The IndieWire page is a good example of how to use these techniques to create a visually appealing page.

## Links and Resources

* [It All Led to ‘Dune’](https://www.indiewire.com/p/denis-villeneuve-career-lookback-interview/) &mdash; IndieWire
* [Introduction to scroll animations with Intersection Observer](https://dev.to/ljcdev/introduction-to-scroll-animations-with-intersection-observer-d05)
* [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
* [View transitions](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition)
* [Parallax scrolling](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)
* [Lazy loading images](https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading)
* [CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
* [CSS Flexbox](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
