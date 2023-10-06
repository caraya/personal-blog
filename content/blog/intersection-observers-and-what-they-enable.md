---
title: "Intersection Observers and what they enable"
date: "2023-02-06"
---

Intersection observers are native Javascript API that allows developers to trigger events or behaviors when content comes into or goes out of the viewport.

I find it particularly interesting as a starting point to do more complex work where we want to wait until the item we're working with becomes visible on screen.

For example, if we want all the images on a page to slowly appear as the page is loaded with animations then it makes sense to wait for the individual images to appear in the browser's viewport before we trigger the animation.

The process has two components, Javascript and CSS. We'll look at each one in turn.

## Javascript

We will use Javascript to trigger activity when an element matching the selector we want to use is visible in the specified viewport.

First, we capture all elements matching our required selector (`fade-in`).

```js
const faders = document.querySelectorAll(".fade-in");
```

We then configure the intersection observer, even though we haven't defined it yet.

This was the hardest part for me to work through.

This example will use a few of the intersection observer options. There are a few others that we'll discuss but not use.

The available options are:

`root`
: The element that is used as the viewport for checking the visibility of the target.
: Must be the ancestor of the target.
: Defaults to the browser viewport if not specified or if null.

`rootMargin`
: Margin around the root
: Can have 1 to 4 values, similar to the [CSS margin property](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)
: This set of values grows or shrinks each side of the root element's bounding box before computing intersections
: Defaults to zero (0).

`threshold`
: Either a single number or an array of numbers that indicate at what percentage of the target's visibility the observer's callback should be executed

If you use `threshold` and `rootMargin` together, test your code carefully as it may not do what you want it to.

For this example, we've set up the `threshold` to zero (`0`) and have added 50 pixels to both the top and bottom in `rootMargin` so that the intersection will trigger when the target is 50 pixels from either the top or the bottom of the viewport.

```js
const appearOptions = {
  threshold: 0,
  rootMargin: "50px 0px 50px 0px"
};
```

We next define the intersection observer in a variable. The `IntersectionObserver` constructor takes two parameters: a list of entries and the observer that we want to use.

Once the parameters are defined we can perform tasks in the result.

In the example below we do the following:

- Loop through all available entries
- Skip entries outside the viewport (those that are not intersecting) by returning
- add the `appear` class to the element or elements in the viewport and remove them from the list of items being observed by using the `unobserve` method. Once we've added the class, we don't want to add it again

We defined the `appearOptions` object earlier in the script.

```js
const appearOnScroll = new IntersectionObserver(function(
  entries,
  appearOnScroll
) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add("appear");
      appearOnScroll.unobserve(entry.target);
    }
  });
},
appearOptions);
```

finally, we loop through all the elements in the matching array using the [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) and add the element to the list of elements to observe with the intersection observer's `observe` method.

```js
faders.forEach(fader => {
  appearOnScroll.observe(fader);
});
```

For more information on the API, see MDN's [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and Web Dev Simplified's [JavaScript Intersection Observer Ultimate Guide](https://blog.webdevsimplified.com/2022-01/intersection-observer/)

## CSS

For this example the CSS deals with the classes we added in Javascript.

The first class `fade-in` determines what elements are observed and sets up the initial opacity and the transition that we want to use.

The second class, `appear` sets the final opacity for the elements using the class.

```css
.fade-in {
  opacity: 0;
  transition: opacity 250ms ease-in;
}

.appear {
  opacity: 1;
}
```

The result is available in Codepen and looks like this:

<iframe height="800" style="width: 100%;" scrolling="no" title="Intersection Observer Demo" src="https://codepen.io/caraya/embed/zYLBZBd?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/zYLBZBd"> Intersection Observer Demo</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

I used image fading as an example but there are many other things you can do.

For example, you can trigger animations to start when they come into the viewport or you can make color changes to parts of a paragraph and many other things.

However, I would urge readers to use these techniques in moderation. Please test the results of using intersection observers with your content and your intended audience.
