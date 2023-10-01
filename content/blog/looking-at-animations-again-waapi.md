---
title: "Looking at animations again... WAAPI"
date: "2017-02-15"
---

The [Web Animation API](https://www.w3.org/TR/web-animations-1/) seeks to unify CSS transitions and animations with SMIL-based SVG animations under one API making it easier to implement on the browser side and easier to learn for designers and developers.

The first thing to notice, this is a Javascript API that manipulates animations' timings and controls. As such we need to make sure that the browser has scripting enabled and the browser supports WAAPI. If it doesn't there's a good [polyfill](https://github.com/web-animations/web-animations-js) maintained by Google that will bring older browser up to part with supporting browsers.

For this example we'll brake the code into three sections, the first one is the html we'll animate. It's a simple div with a number inside.

```html
<div class='boxes box1'>1</div>
```

I've added CSS to center the number 1 in the box both vertically and horizontally (yay for Flexbox) and provide size and initial background color for the box.

```css
.boxes {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  height: 100px;
  width: 100px;
  background-color: rebeccapurple;
}
```

In the Javascript I use `querySelector` to select the element I want to animate. I'm animating a single object. If I want to select more than one I would use `querySelectorAll` instead.

Then I apply the `animate` method and pass it two arrays:

- An array of one or more object containing the properties we want to animate
- An array with the properties of the animation (duration, count and direction in this case)

```language-javascript
var elem = document.querySelector('.boxes');
var animation = elem.animate({
  transform: [
    'translateX(500px)',
    'translateY(500px)',
    'translateX(500px)',
    'translateY(500px)'
  ], 
  color: [
    'rebeccapurple',
    'red',
    'blue',
    'white'
  ],
  opacity: [
    1,
    0.5,
    0.75,
    1
  ],
}, {
  direction: 'alternate',
  duration: 4000,
  iterations: 10,
});
```

We can shorten the code by creating arrays inside the animation call. Instead of using different arrays for each set of properties (transform, color and opacity) we take one element of each array and populate an array with them.

The resulting code looks like the code below and the result of the the two versions is identical (at least when I tested both versions in Codepen). Note that you animation step arrays don't need to have the same number of items.

```language-javascript
var elem = document.querySelector('.boxes');
var animation = elem.animate([
  { transform: 'translateX(500px)', color: 'rebeccapurple', opacity: '1'  },
  { transform: 'translateY(500px)', color: 'red', opacity: '0.5' },
  { transform: 'translateX(500px)', color: 'blue', opacity: '0.75' },
  { transform: 'translateY(500px)', color: 'white', opacity: '1' }
], {
    duration: 4000, //milliseconds
    easing: 'ease-in-out', //'linear', a bezier curve, etc.
    // delay: 10, //milliseconds
    iterations: Infinity, //or a number
    direction: 'alternate', //'normal', 'reverse', etc.
    fill: 'none'
    // fill: 'forwards' //'backwards', 'both', 'none', 'auto'
});
```

You can animate the same set of properties than you can in CSS animations (although this may change in the future) in a more concise and fuller API. We'll explore some of these additional features and how we'll make it work in a similar way to CSS animations.

### Player controls

One of the things I find most frustrating about CSS animations is that there is no way to pause or reset an animation after it has started. Using WAAPI we can programmatically control the play status of an animation.

First modification to our animation is to add buttons to control the playback status. I was lazy and chose not to do a toggle button for play and pause and keep them as separate buttons. In a real application I would take the extra time and code a toggle play/pause button.

```html
<div class='boxes box1'>1</div>

<div class="nav">
  <button id="play">Play</button>
  <button id="pause">Pause</button>
  <button id="cancel">Cancel</button>

</div>
```

In the script we add variables to represent the buttons and event listeners that will cause the animation to do something (play, pause or reset the animation). We also start the animation paused to give the user the option of when to start it, if they want to start it at all.

```language-javascript
// animation starts paused
animation.pause();

// add event listener to control animation playback
var play = document.getElementById("play");
var pause = document.getElementById("pause");
var cancel = document.getElementById("cancel");


play.addEventListener("click", () => {
    animation.play()
}, false);

pause.addEventListener("click", () => {
    animation.pause()
}, false);

cancel.addEventListener("click", () => {
    animation.cancel()
}, false);
```

### controlling animation speed

We can also control the speed of the animation programmatically using the `playbackRate` method of WAAPI. There may be cases like animations explaining a procedure in an educational site or the relationship between two concepts where it would be awesome if you coulld slow down and/or speed up the animation.

We had three new nuttons to the page.

```html
<h2>playback speed</h2>
  <button id="slower">0.5x</button>
  <button id="normal">1x</button>
  <button id="faster">2x</button>
```

And then add the associated click event handlers to make it play at half speed, normal speed and double speed. These values are hardcoded in, we can't change how fast is the fast animation or how slow is the slow. We'll address this in the next iteration.

```language-javascript
var slower = document.getElementById("slower");
var normal = document.getElementById("normal");
var faster = document.getElementById("faster");

slower.addEventListener("click", () => {
  animation.playbackRate = 0.5; 
}, false);

normal.addEventListener("click", () => {
  animation.playbackRate = 1; 
}, false);

faster.addEventListener("click", () => {
  animation.playbackRate = 2; 
}, false);
```

In the previous example we hardcoded the values for the slower and faster speeds. It wold be cool if the values were customizable. One way to do so is to use [assignment operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Assignment_Operators) to change the values by a small step every time the button is clicked.

We modify the event listeners so that, instead of assigning a specific value to the `playbackRate` attribute we increase it or decrease it by 0.1 every time the corresponding button is clicked. The code now looks like this:

```language-javascript
var slower = document.getElementById("slower");
var normal = document.getElementById("normal");
var faster = document.getElementById("faster");

slower.addEventListener("click", () => {
  animation.playbackRate -=0.1; 
}, false);

normal.addEventListener("click", () => {
  animation.playbackRate = 1; 
}, false);

faster.addEventListener("click", () => {
  animation.playbackRate += 0.1; 
}, false);
```

If you use a negative value for `playbackRate` the animation will play backwards. The code below creates a button to play the animation in reverse.

```language-javascript
var reverse = document.getElementById("reverse");

reverse.addEventListener("click", () => {
  animation.playbackRate =-1;
}, false);
```

One last thing to note. The code to slow the animation will eventually stop it since decreasing the playback rate will eventually makes it 0. This may be ok for some cases and not for others. If this is not ok for a specific use case we can put an if statement in the slower function to make the lowest value something we can control, something like this:

```language-javascript
slower.addEventListener("click", () => {
  animation.playbackRate -=0.1;
  // don't let the animation stop
  if (animation.playbackRate == 0) {
    animation.playbackRate = 0.1;
  }
}, false);
```

We also need to make sure that users can distinguish the difference between the steps of animation speed. Perhaps 0.1 is too subtle a speed increase or decrease. It all depends on your project and your users.

## motion paths

> Work in this section is adapted with many thanks from work by Dan Wilson presented in [his blog](http://danielcwilson.com/blog/2015/09/animations-part-5/) and modified as I finally start to learn how this works.

I've always the idea of animating objects on a path, a predefined set of coordinates. I've seen this a lot in Flash and SVG/SMIL based animations but SMIL has been retired or at least deprecated in most browsers (if it was ever implemented at all) so developers were left with hacks and using SVG to create the animation (and hope that browsers will not remove SMIL for a while yet).

Motion is important and the W3C acknowledges that. They've put together a [Motion Pat Module, level 1](https://drafts.fxtf.org/motion-1/) that addresses how to use motion paths in CSS. WAAPI leverages this module when working with motion on a path.

We first create the HTML elements for the example. The content of the support class div will be populated from the script later in the process.

```html
<h1>Motion Path Exercise</h1>

<div class="support"></div>

<div class="circle"><i>1</i></div>
<div class="circle"><i>2</i></div>
<div class="circle"><i>3</i></div>
<div class="circle"><i>4</i></div>
<div class="circle"><i>5</i></div>
<div class="circle"><i>6</i></div>
<div class="circle"><i>7</i></div>
<div class="circle"><i>8</i></div>
<div class="circle"><i>9</i></div>
<div class="circle"><i>10</i></div>
```

In the CSS area we define and format the HTML as circles with numbers within them. We use Flexbox to center the number inside the circle and use the [will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change) property. The descriptions and caveats from MDN are very important... if you abuse the property it will stop working so use it sparingly and with as few properties as possible.

```css
.circle {
  z-index: 1;
  position: absolute;
  top: 6rem;
  left: 0;
  width: 3rem;
  height: 3rem;
  margin: 0 auto;
  display: none;
  justify-content: center;
  align-items: center;
}

.circle i {
  display: flex;
  justify-content: center;
  align-items: center; 
  width: 3rem;
  height: 3rem;  
  border-radius: 50%;
  border: 1px solid #000;
  background: #fff;
  color: #00f;
  transform-origin: 50% 50%;
  will-change: transform;
}
```

We use feature queries to detect the syntax that we need to use in a given version of a browser. If the browser doesn't support Motion Paths at all neither of these queries will be added to the document and it's left up to the developer to provide an alternative... we don't want to exclude people from our project so we use motion path as a progressive enhancement and work with a different animation technique or library (possibly GSAP) is motion path is not supported in your target browsers.

The CSS below tells the browser what path to animate on. The Javascript will actually execute the animation.

> I created the path in Illustrator, export the `.ai` file as svg, open it with my text editor and extract the path element and copied it to the CSS.

```css
/* implemented in Chrome 46+ */
@supports (motion-offset: 0) {
  .circle {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    motion-offset: 100%;
    motion-path: path("M73.6462,149.5409c42.5436-42.5436,137.2421-16.8221,211.515,57.4508s99.9944,168.9713,57.4508,211.515s-137.2421,16.8221-211.515-57.4508S31.1026,192.0845,73.6462,149.5409z");
    will-change: motion-offset;
  }
}

/* This is the latest spec as of September 2016 */
@supports (offset-distance: 0) {
  .circle {
    display: block;
    offset-distance: 100%;
    offset-path: path("M73.6462,149.5409c42.5436-42.5436,137.2421-16.8221,211.515,57.4508s99.9944,168.9713,57.4508,211.515s-137.2421,16.8221-211.515-57.4508S31.1026,192.0845,73.6462,149.5409z");
    will-change: offset-distance;
  }
}
```

We're almost there, promise. There are a few things to go in the script that we haven't discussed before and we need to unpack.

As always we first capture all the elements we want to animate (all elements with class circle) using [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) and assign them to a variable (m).

We then use the [CSS Support Javascript API](https://developer.mozilla.org/en-US/docs/Web/API/CSS/supports) to test what version of the Motion Path API we support.

The last step in this section is to define the keyframes object.

```language-javascript
var m = document.querySelectorAll('.circle');

//This is the latest spec as of September 2016
var supportsOffsetDistance = CSS && CSS.supports && CSS.supports('offset-distance', 0);

// What's implemented in Chrome 46+
var supportsMotionOffset = CSS && CSS.supports && CSS.supports('motion-offset', 0);

//motion properties are the old spec
var keyframes = [{
  offsetDistance: '100%',
  motionOffset: '100%'
}, {
  offsetDistance: 0,
  motionOffset: 0
}];
```

This is the meat of the script. We only run this part of the script if we support Motion paths, otherwise it makes no sense to busy the browser with something we won't be able to use anyways.

If we support either method of Motion Path, then create a [for loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration#for_statement) to animate each object in our 'objects to be animated' array.

The only other funky thing is the delay parameter. We set it to the value of the time variable times the element's index divided by the length of our 'objects to animate' list (querySelectorAll doesn't create an array).

```language-javascript
if (supportsOffsetDistance || supportsMotionOffset) {
  var time = 9000;
  for (var i = 0, len = m.length; i < len; ++i) {
    var player = m[i].animate(keyframes, {
      duration: time,
      iterations: Infinity,
      fill: 'both',
      easing: 'ease-in',
      delay: time * (i / m.length)
    });
 }
```

After all the work is done and since this is a learning experience we tell the user if their browser supports motion path or not and, if it does, which version of the API works on their browser.

```language-javascript
  document.querySelector('.support').innerHTML = 'This browser supports it via the <code>' + (supportsOffsetDistance ? 'offset' : 'motion') + '</code> properties';
} else {
  document.querySelector('.support').textContent = 'This browser does not support it';
}
```

## Keyframe Constructor and KeyframeEffects

So far we've only used the animate style of buidling animations. To recap, this is the way we build an animation using animate.

```language-javascript
var elem = document.getElementById('myAnimation');
var timings = {
  duration: 1000,
  fill: 'both'
}
var keyframes = [
  { opacity: 1 }.
  { opacity: 0 }
];

elem.animate(keyframes, timings);
```

### KeyframeEffect

A KeyframeEffect takes three parameters: the element to animate, an array of keyframes, and our timing options. We've seen all these attributes before when using animate. The difference is that the effect will not play automatically and serve as the base for the other effectss we'll discuss in this section.

```language-javascript
var effect = new KeyframeEffect(elem, keyframes, timings);
```

### KeyframeConstructor

Using the same timings and keyframes as the example above we can use a constructor-style approach to build an animation. We first build a keyframeEffect

The primary difference here is that the animation does not start playing immediately, so this will be useful when creating animations in advance to be played later.

We then create a new Animation object and pass it two parameters, the animation (in this case the keyframeEffect we created) and a timeline object (in this case we use `ownerDocument` to get the root document element and use its timeline).

When creating animations this way the animation will not play until we actually tell it to by calling the play method. This way we can build all the animations before playing them.

```language-javascript
var kEffect = new KeyframeEffect(elem, keyframes, timings);
var player = new Animation(kEffect, elem.ownerDocument.timeline);
player.play();
```

## The future: GroupEffects & SequenceEffects

Neither groupEffect or SequenceEffect made it to browsers or the level 1 specification, they are part of the level 2 spec drafts. They provide programmatic ways to group and sequence animations.

While these features haven't made it to the browsers there is an [experimental version](https://github.com/web-animations/web-animations-js/blob/dev/docs/experimental.md) of the Polyfill that supports these upcoming features.

### GroupEffect

The GroupEffect groups one or more KeyframeEffects to play simultaneously.

We create an array of keyframeEffects and pass it to the groupEffect constructor. We can then play the entire group simultaneously in our default document timeline whenever we're ready to do so.

In this example we create the following HTML. It's important to remember that we are using forward-looking features so we must include the `next` polyfill to make this work. This will be required until native implementations of the level 2 specification start hitting browsers.

```html
<div id="i0">1</div>
<div id="i1">2</div>
<div>
    <div id="o0">A</div>
    <div id="o1">B</div>
</div>
<button id="player">Play</button>

<script src="scripts/web-animations-next.min.js"></script>
```

We add some CSS to make it look pretty. The only special thing here is the use of [attribute selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to match the items we want to animate.

```css
body {
    background: #3d6644;
    text-align: center;
}

[id^="i"],
[id^="o"] {
    border-radius: 50%;
    margin-top: 1rem;
    font-size: 2rem;
    color: #f9f7fb;
    display: inline-block;
}

#player {
    margin-top: 3rem;
    font-size: 1rem;
    background: transparent;
    border: 2px solid #f9f7fb;
    color: #f9f7fb;
    padding: .6rem;
    border-radius: .6rem;
}

#player:active {
    transform: scale(.9);
}
#player:disabled {
    opacity: .2;
}
```

Again, because this is a Javascript API, this will be the largest part of the project.

We create two arrays using `slice.call` to convert a list of nodes returned by `querySelectorAll`. Rach array contains elements starting with a different letter (i and o). We also initialize two objects to hold our keyframe effects.

```language-javascript
let ms = Array.prototype.slice.call(document.querySelectorAll('[id^=i]'));
let ts = Array.prototype.slice.call(document.querySelectorAll('[id^=o]'));
let keyframeEffects = [];
let keyframeEffects2 = [];
```

We then define our animation effects. The only thing to notice is the offset attribute for each step: it is a 0-to-1 equivalent to setting the percentages when working with CSS based keyframes. The objective is the same.

The last part of this section initializes the timings for the animations. We'll use the same timing for both our animations so we keep a single array for the timings of the animations.

```language-javascript
let effects = {
  translations1: [
      { transform: 'translateX(0px)', offset: 0 },
      { transform: 'translateX(500px)', offset: .7 },
      { transform: 'translateX(0px)', offset: 1 }
  ],
  translations2: [
      { transform: 'translateX(0px)', offset: 0 },
      { transform: 'translateX(-500px)', offset: .7 },
      { transform: 'translateX(0px)', offset: 1 }
  ]
};
let timing = {
  duration: 1000,
  easing: 'ease-in',
  fill: 'both',
  iterations: 1
};
```

Next we create keyframe effects and push them to our empty keyframeEffects array. This is how you create multiple objects with the same animation and timing functions. Also be aware that we are using keyframe effects rather than calling animate directly because we want to have more control regarding when we start the animations.

```language-javascript
//Create a KeyframeEffect for each element (this will not kick off any animation)
ms.forEach((el) => {
  let effect = new KeyframeEffect(el, effects.translations1, timing);
  keyframeEffects.push(effect);
});
ts.forEach((el) => {
  let effect = new KeyframeEffect(el, effects.translations2, timing);
  keyframeEffects2.push(effect);
});
```

Using the keyframe effects we just create we create two group effects, one for each set of animations and a group effect to play them together. We only play the last effect we define

```language-javascript
//add the six KeyframeEffects to a GroupEffect, and play it on the doucment timeline
let groupEffectA = new GroupEffect(keyframeEffects);
let anim = document.timeline.play(groupEffectA);

let groupEffectB = new GroupEffect(keyframeEffects2);
let anim2 = document.timeline.play(groupEffectB);
```

The last thing we do is create a button to play/pause the animations. We could create a separate button to control each animation independently but for the purpose of the dmeo one size controls all will be enough.

```language-javascript
let btn = document.getElementById('player');

btn.addEventListener('click', function(e) {
    if (anim.playState !== 'running') {
        anim.play();
    } else {
        anim.pause();
    }
    if (anim2.playState !== 'running') {
        anim2.play();
    } else {
        anim2.pause();
    }
});
```

## SequenceEffects

SequenceEffects, as the name implies, plays a group of animations one after the other. As defined in the polyfill, you can use GroupEffect and SequenceEffect together, having a grouping of multiple sequences without using delays or other tricks.

Using the code for our grouping example we'll change it illustrate how sequences work. We first create two sequences, one for each group of animations, then we create a third sequence containing the two individual sequences.

We change the button to play/pause to only work with the third sequence, the one containing all the keyframe effects we built.

```language-javascript
let sequenceEffectA = new SequenceEffect(keyframeEffects);
let sequenceEffectB = new SequenceEffect(keyframeEffects2);

let sequenceEffectC = new SequenceEffect([sequenceEffectA, sequenceEffectB]);
let anim3 = document.timeline.play(sequenceEffectC);

let btn = document.getElementById('player');

btn.addEventListener('click', () => {
    if (anim3.playState !== 'running') {
        anim3.play();
    } else {
        anim3.pause();
    }
});
```

## Examples and demos

- [Spiral](http://codepen.io/danwilson/pen/ZGmeRO)
- [Heart](http://codepen.io/yisi/pen/zGzJYd)
- [Triangle](http://codepen.io/ericwilligers/pen/zGRdxQ)
- [Scissors](http://codepen.io/ericwilligers/pen/pJarJO)
- [Eyes](http://jsfiddle.net/ericwilligers/v79bdL3p/)
