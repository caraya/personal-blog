---
title: "Web Animations: Web Animation API examples"
date: "2016-02-24"
categories: 
  - "technology"
---

Let’s get started with a single animation. It is similar to the example form our introductory section but it does move the object (in this case a div) in a straight line in increments of 100 pixels and then moves the object back using the same animation.

<p data-height="481" data-theme-id="2039" data-slug-hash="gPyMNy" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/gPyMNy/">Web Animations API</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

We can also move multiple elements and control them individually like in the pen below where control each object independently from the other.

The Pen below creates two animation players, one for each object being animated. We can add multiple animations and transitions or we can attach multiple players to the objects.

To dissect a more complex example.

In the example below two objects move independently from each other one in a straight line from left to right and the other one diagonally.

The HTML looks like this

```markup
<div id="square1"></div>
<div id="square2"></div>
```

In our CSS we’ll just set dimensions and a color for each object.

```
#square1 {
  height: 100px;
  width: 100px;
  background-color: #f0f;
}

#square2 {
  height: 100px;
  width: 100px;
  background-color: #ff0;
}
```

In the Javascript we first define 2 variables for the object we’ll animate. We then set a default ser of values for our timings (things like duration, fill, direction, easing and number of iterations.) Unless we change them these are the values we’ll use for the animations.

```javascript
var sq1 = document.querySelector('#square1');
var sq2 = document.querySelector('#square2');

var timings = {
  duration: 2000,
  fill: 'forwards',
  direction: 'normal',
  easing: 'linear',
  iterations: 3
};
```

The first object will animate the `sq1` object moving it from left to right in 100 pixel increments (by increasing margin left by 100 pixels each time) and using the default values for the timings object.

```javascript
var animation1 = sq1.animate([
  { marginLeft: '0' },
  { marginLeft: '100px' }, 
  { marginLeft: '200px' },
  { marginLeft: '400px' },
  { marginLeft: '500px' },
  { marginLeft: '600px' },
  { marginLeft: '700px' },
  { marginLeft: '800px' }
], timings);
```

We override the duration and direction on our timings object by redefining the items before we launch the animation we’ll then animate the `sq2` object by changing `margin-top` and `margin-left`.

One important thing to notice is that WAAPI uses javascript syntax for the properties to be animated. Rather than `margin-left` you should use the camel cased`marginLeft` property.

```javascript
timings.duration = 3000;
timings.direction = 'both';

var animation2 = sq2.animate ([
  { marginLeft: '25px', marginTop: '50px'},
  { marginLeft: '75px', marginTop: '0'},
  { marginLeft: '125px', marginTop: '50px'},
  { marginLeft: '175px', marginTop: '0'},
  { marginLeft: '225px', marginTop: '50px'},
  { marginLeft: '275px', marginTop: '0'},
], timings );
```

We’ve already began to DRY our code by moving the timing object to a separate variable that we can either use as is or modify as needed.

The full example is in the pen below

<p data-height="325" data-theme-id="2039" data-slug-hash="vLwmgO" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/vLwmgO/">2 parallel animations</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

These two examples give us an idea of what we can do with the WAAPI as a replacement for what’s already out in the wild for animations and transitions.
