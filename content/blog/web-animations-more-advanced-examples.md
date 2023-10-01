---
title: "Web Animations: More Advanced Examples"
date: "2016-02-29"
categories: 
  - "technology"
---

In the last example we saw how we could make two separate animation players. In this example we’ll see how we can do multiple animations in the same object the pen below, based on code from Dan Wilson in [Codepen](http://codepen.io/danwilson/pen/PqxvJo/).

HTML for this animation is a sequence of 20 empty `div` tags. I’ll spare you the details.

The SCSS looks like this:

```scss
$background: #e45349;
$light: #efefff;

body {
  background: $background;
  display: flex;
  justify-content: center;
}

div {
  width: 5vw;
  height: 5vh;
  background: $light;
  border-radius: 1vh;
}
```

I’ll break the WAAPI Javascript code below.

The first thing we need to do is create a variable that will hold the elements to animate (in this case 20 `div` tags) and a variable that will hold our timing attribute defaults. We’ll see how we can change them later.

As usual we define a variable to contain all the elements that we want animated. In this case we use `querySelectorAll` to get all the divs in the page. We can get away with this because the only `div` elements on the page are the ones we will animate.

We then setup our timings object with their default settings.

```javascript
/*globals document*/
'use strict';

var a = document.querySelectorAll('div'),

timings = {
  easing: 'ease-in-out',
  // Use a number to indicate a specific # of iterations
  // iterations: Infinity, 
  iterations: 20,
  direction: 'alternate',
  fill: 'both'
};
```

We use array’s [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) method to loop through each of the elements of our array to run 3 animation players.

We also add a delay for each element in the array by 98 milliseconds times the position of the object in the array.

```
a.forEach(function(el, pos) {
  timings.delay = pos * 98;
```

The first animation deals with moving the object.

```
  timings.duration = 2500;
  el.animate([
    { transform: 'translateY(0) scaleX(.8)' },
    { transform: 'translateY(95vh) scaleX(1)' }
  ], timings);
```

The second animation deals with opacity.

```
  timings.duration = 2000; 
  el.animate([
    { opacity: 1 },
    { opacity: 0 }
  ], timings);
```

The third and last animation deals with color.

```
  timings.duration = 3000;
  el.animate([
    { backgroundColor: 'rgb(239, 239, 255)' },
    { backgroundColor: '#e4c349' }
  ], timings);
});
```

Full Code:

<p data-height="266" data-theme-id="2039" data-slug-hash="eJwEVg" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/eJwEVg/">Multiple animate calls</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Another very interesting use is with the upcoming [motion path level 1](https://www.w3.org/TR/motion-1/) specification. Declaring the path in CSS is the same as declaring them in SVG, they use the same syntax.

Dan Wilson wrote about [CSS Motion Paths](http://codepen.io/danwilson/post/css-motion-paths) and provided an example of how css motion paths work. This will work natively in Chrome 46 and Opera 34.

<p data-height="266" data-theme-id="2039" data-slug-hash="ZGmeRO" data-default-tab="result" data-user="danwilson" class="codepen">See the Pen <a href="http://codepen.io/danwilson/pen/ZGmeRO/">CSS Motion Path Spiral</a> by Dan Wilson (<a href="http://codepen.io/danwilson">@danwilson</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

The final set of examples are part of the Web Animation API Polyfill [Github repository](http://web-animations.github.io/web-animations-demos/). They show examples with both new and older versions of the API.
