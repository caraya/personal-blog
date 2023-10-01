---
title: "Looking at animations again… GSAP"
date: "2017-02-20"
---

[Green Sock Animation Platform (GSAP)](https://greensock.com/) is an animation powerhouse. It's a Javascript based library designed to animate most CSS and SVG properties.

GSAP components are (Taken from [Getting Started with GSAP](https://greensock.com/get-started-js)):

- [TweenLite](https://greensock.com/docs/#/HTML5/GSAP/TweenLite/): the core of the engine which handles animating just about any property of any object. It is relatively lightweight yet full-featured and can be expanded using optional plugins (like CSSPlugin for animating DOM element styles in the browser, or ScrollToPlugin scrolling to a specific location on a page or div, etc.)
- [TweenMax](https://greensock.com/docs/#/HTML5/GSAP/TweenMax/): TweenLite's beefy big brother; it does everything TweenLite can do plus non-essentials like repeat, yoyo, repeatDelay, etc. It includes many common plugins too like CSSPlugin so that you don't need to load as many files. The focus is on being full-featured rather than lightweight.
- [TimelineLite](https://greensock.com/docs/#/HTML5/GSAP/TimelineLite/): a powerful, lightweight sequencing tool that acts like a container for tweens, making it simple to control them as a whole and precisely manage their timing in relation to each other. You can even nest timelines inside other timelines as deeply as you want. This allows you to modularize your animation workflow easily.
- [TimelineMax](https://greensock.com/docs/#/HTML5/GSAP/TimelineMax/): extends TimelineLite, offering exactly the same functionality plus useful (but non-essential) features like repeat, repeatDelay, yoyo, currentLabel(), and many more. Again, just like TweenMax does for TweenLite, TimelineMax aims to be the ultimate full-featured tool rather than lightweight.

The platform provides additional tools such as easing, plugins, utilities like Draggable, and others. Check the [GSAP/JS documentation](https://greensock.com/gsap) for more information.

I see two downsides to libraries like GSAP. You're loading additional libraries that may impact application performance. The other downside is now much of the library do you need to know in order to accomplish what you want. I'll explore this in more detail as I go through this demos with the understanding that this is not a full tutorial... there is no way I can (or want to) learn everything there is about GSAP. As with most of these posts, it's meant as a starting point for current and future research.

## Loading the library

> Place any of these scripts at the bottom of the page, before the closing `body` tag and before any scripts that use the GSAP library. If you want to use a CDN use the links below instead of local references.

We have three options to load the library, all depending on the level of complexity you need for your application. The first one is to load `TweenLite.js` and `TimelineLite.min` to work with a minimal set of functionality at a small file size.

```markup
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TweenLite.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.1/TimelineLite.min.js"></script>
```

TweenMax and TimelineMax include the lite version of each plugins with additional functionality (discussed in the description of the platform) that it's meant as a single resource to load (with less HTTP requests).

```markup
<!--CDN link for  TweenMax-->
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TimelineMax.min.js"></script>
```

If you're working on an HTTP2 server or are more concerned with the size of the download you can pick and choose which core components and plugins to load (a common lightweight choice is TweenLite, CSSPlugin, and EasePack). For example:

```markup
<!--CDN links for TweenLite, CSSPlugin, and EasePack-->
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/plugins/CSSPlugin.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/easing/EasePack.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenLite.min.js"></script>
```

## Basic effects

Now that we've covered how to load the scripts we'll work on some basic [tweening](http://www.dictionary.com/browse/tweening). We'll use the following HTML to define the element we want to animte and load the scripts at the bottom of the page before the closing `body` tag.

```markup
<div class="boxes" id="box1"></div>

<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js"></script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TimelineMax.min.js"></script>
<script src="scripts/gsap1.js"></script>
```

I prefer to give the element we'll animate an initial state using CSS. It's important to remember that if you don't give explicit dimensions to your elements they will not appear on screen. This little issue bit me several time when devloping these examples... this is why we set a height and width.

```css
.boxes {
  background-color: #3d6644;
  border: 1px solid black;
  height: 50px;
  width: 50px;
}
```

The content of the `gsap1.js` script is listed below. I chose to use `TweenLite.to` because i've already configured the intial size of the animation. There are other values like `TweenLite.from()` and `TweenLite.fromTo()`

```javascript
let box1 = document.getElementById('box1');

TweenLite.to("#box1", 4, 
  { backgroundColor:"#ff00ff", width:"50%", height:"250px", ease:Power2.easeInOut }
);
```

Note that since we use `TweenLite.to()` the values we provide will be treated as the final values for the animation. The color we defined in the CSS (#3d66644) and width and height at their default values (0% and 0px).

We can also create animations that have a starting and ending position. In this example we'll animate a circle (actually a div with border radius of 50%) when the user clicks a button.

we begin with our styles that will define the starting properties of the object to animate and will be the values of the object when animations don't work.

```css
body {
    background: #eee;
    text-align: center;
}

#o1 {
    border-radius: 50%;
    border: 1px solid crimson;
    background-color: indianred;
    margin: 0 auto;
}

div > #player {
    display: block;
}
```

We then define the HTML. A button and the div container we will animate; we give IDs to both of them to reference them from the script

```markup
<div>
    <button id="player">Play</button>
</div>

<div id="o1"></div>
```

The script does two things:

- it sets up the animation, including the easing we'll use and the initial state for the animation. We override the default of starting the animation immediately and defer to the user clicking the button to begin the animation work
- it creates a click handler for the button where we test if the animation is working using the `isTweening` property of the TweenMax object and toggles the status of the animation (play if it's paused and paused if it's playing) and the text of the button using `innerText`.

```javascript
let o1 = document.getElementById('o1');
let player = document.getElementById('player');

// animates width and height from 0 to 200
anim = TweenLite.fromTo(o1, 10,
// Initial state
{width:0, height:0},
// Final state plus options
{width:200, height:200, ease: linear.easeNone, paused: true }

);

player.addEventListener('click', () => {
    if (TweenMax.isTweening(o1) === false) {
        anim.play();
        player.innerText="Pause";
    } else {
        anim.pause();
        player.innerText='Play';
    }
});
```

### Easing

GSAP provides an extensive easing library. TweenLite comes with a default set of easing functions and TweenMax provides an additional set. Check the [easing visualizer](https://greensock.com/get-started-js#easing) to get an idea of what's available and how you can use those functions in your animations.

## special properties

There is an additional set of properties for `TweenLite` that provide additional control over the animation. Rather than try to explain them, I've adapted their description from the [TweenLite documentation](https://greensock.com/docs/#/HTML5/GSAP/TweenLite/TweenLite/)

- **delay**: Number - Amount of delay in seconds (or frames for frames-based tweens) before the animation should begin
- **ease**: Ease (or Function or String) - You can choose from various eases to control the rate of change during the animation, giving it a specific "feel". You can also define an ease by name (string) like `Strong.easeOut` or reverse style (like jQuery uses) `easeOutStrong`. The default is `Quad.easeOut`
- **paused**: Boolean - If true, the tween will pause itself immediately upon creation.
- **immediateRender**: Boolean - Normally when you create a tween, it begins rendering on the very next frame (update cycle) unless you specify a delay. However, if you prefer to force the tween to render immediately when it is created, setimmediateRender to true. Or to prevent a from() from rendering immediately, set immediateRender to false. By default, from() tweens set immediateRender to true
- **overwrite**: String (or integer) - Controls how (and if) other tweens of the same target are overwritten. There are several modes to choose from, but "auto" is the default:
    
    - "none" (0) (or false) - no overwriting will occur.
    - "all" (1) (or true) - immediately overwrites all existing tweens of the same target even if they haven't started yet or don't have conflicting properties.
    - "auto" (2) - when the tween renders for the first time, it will analyze tweens of the same target that are currently active/running and only overwrite individual tweening properties that overlap/conflict. Tweens that haven't begun yet are ignored. For example, if another active tween is found that is tweening 3 properties, only 1 of which it shares in common with the new tween, the other 2 properties will be left alone. Only the conflicting property gets overwritten/killed. This is the default mode and typically the most intuitive for developers.
    - "concurrent" (3) - when the tween renders for the first time, it kills only the active (in-progress) tweens of the same target regardless of whether or not they contain conflicting properties. Like a mix of "all" and "auto". Good for situations where you only want one tween controlling the target at a time.
    - "allOnStart" (4) - Identical to "all" but waits to run the overwrite logic until the tween begins (after any delay). Kills tweens of the same target even if they don't contain conflicting properties or haven't started yet.
    - "preexisting" (5) - when the tween renders for the first time, it kills only the tweens of the same target that existed BEFORE this tween was created regardless of their scheduled start times. So, for example, if you create a tween with a delay of 10 and then a tween with a delay of 1 and then a tween with a delay of 2 (all of the same target), the 2nd tween would overwrite the first but not the second even though scheduling might seem to dictate otherwise. "preexisting" only cares about the order in which the instances were actually created. This can be useful when the order in which your code runs plays a critical role
- **onComplete**: Function - A function that should be called when the animation has completed
    
    - **onCompleteParams**: Array - An Array of parameters to pass the onComplete function. For example,TweenLite.to(element, 1, {left:"100px", `onComplete:myFunction, onCompleteParams: [element, "param2"]});` To self-reference the tween instance itself in one of the parameters, use "`{self}`", like: `onCompleteParams:["{self}", "param2"]`
    - **onCompleteScope**: Object - Defines the scope of the onComplete function (what "this" refers to inside that function).
- **onReverseComplete**: Function - A function that should be called when the tween has reached its beginning again from the reverse direction. For example, if reverse() is called the tween will move back towards its beginning and when itstime reaches 0, onReverseComplete will be called. This can also happen if the tween is placed in a TimelineLite or TimelineMax instance that gets reversed and plays the tween backwards to (or past) the beginning.
    
    - **onReverseCompleteParams**: Array - An Array of parameters to pass the onReverseComplete function. For example, `TweenLite.to(element, 1, {left:"100px", onReverseComplete:myFunction, onReverseCompleteParams:[mc, "param2"]});` To self-reference the tween instance itself in one of the parameters, use "`{self}`", like: `onReverseCompleteParams:["{self}", "param2"]`
    - **onReverseCompleteScope**: Object - Defines the scope of the onReverseComplete function (what "this" refers to inside that function)
- **onStart**: Function - A function that should be called when the tween begins (when its time changes from 0 to some other value which can happen more than once if the tween is restarted multiple times)
    
    - **onStartParams**: Array - An Array of parameters to pass the onStart function. For example, TweenLite.to(element, 1, {left:"100px", delay:1, onStart:myFunction, onStartParams:\[mc, "param2"\]}); To self-reference the tween instance itself in one of the parameters, use "{self}", like: onStartParams:\["{self}", "param2"\]
    - **onStartScope**: Object - Defines the scope of the onStart function (what "this" refers to inside that function)
- **onUpdate**: Function - A function that should be called every time the animation updates (on every frame while the animation is active)
    
    - **onUpdateParams**: Array - An Array of parameters to pass the onUpdate function. For example, TweenLite.to(element, 1, {left:"100px", onUpdate:myFunction, onUpdateParams:\[mc, "param2"\]}); To self-reference the tween instance itself in one of the parameters, use "{self}", like: onUpdateParams:\["{self}", "param2"\]
    - **onUpdateScope**: Object - Defines the scope of the onUpdate function (what "this" refers to inside that function)
- **useFrames**: Boolean - If useFrames is true, the tweens's timing will be based on frames instead of seconds because it is initially added to the root frames-based timeline. This causes both its duration and delay to be based on frames. An animations's timing mode is always determined by its parent timeline
- **lazy**: Boolean - When a tween renders for the very first time and reads its starting values, GSAP will automatically "lazy render" that particular tick by default, meaning it will try to delay the rendering (writing of values) until the very end of the "tick" cycle which can improve performance because it avoids the read/write/read/write layout thrashing that some browsers do. If you would like to disable lazy rendering for a particular tween, you can set lazy:false. Or, since zero-duration tweens do not lazy-render by default, you can specifically give it permission to lazy-render by setting lazy:true like TweenLite.set(element, {opacity:0, lazy:true});
- **onOverwrite**: Function - A function that should be called when the tween gets overwritten by another tween. The following parameters will be passed to that function:
    
    1. **overwrittenTween**: Animation - the tween that was just overwritten
    2. **overwritingTween**: Animation - the tween did the overwriting
    3. **target**: Object \[only passed if the overwrite mode was "auto" because that's the only case when portions of a tween can be overwritten rather than the entire thing\] - the target object whose properties were overwritten. This is usually the same as overwrittenTween.target unless that's an array and the overwriting targeted a sub-element of that array. For example, TweenLite.to(\[obj1, obj2\], 1, {x:100}) and then TweenLite.to(obj2, 1, {x:50}), the target would be obj2
    4. **overwrittenProperties**: Array \[only passed if the overwrite mode was "auto" because that's the only case when portions of a tween can be overwritten rather than the entire thing\] - an array of property names that were overwritten, like \["x","y","opacity"\]. Note: there is also a static TweenLite.onOverwrite that you can use if you want a quick and easy way to be notified when any tween is overwritten (great for debugging). This saves you the hassle of defining an onOverwrite on a tween-by-tween basis
- **autoCSS**: Boolean - Animating css-related properties of DOM elements requires the CSSPlugin which means that normally you'd need to wrap css-related properties in a css:{} object like TweenLite.to(element, 2, {css:{left:"200px", top:"100px"}, ease:Linear.easeNone}); to indicate your intent (and to tell GSAP to feed those values to the CSSPlugin), but since animating css-related properties is so common, GSAP implements some logic internally that allows you to omit the css:{} wrapper (meaning you could rewrite the above tween as TweenLite.to(element, 2, {left:"200px", top:"100px", ease:Linear.easeNone});)
- **callbackScope**: Object - The scope to be used for all of the callbacks (onStart, onUpdate, onComplete, etc.). The scope is what "this" refers to inside any of the callbacks. The older callback-specific scope properties (onStartScope, onUpdateScope, onCompleteScope, onReverseComplete, etc.) are deprecated but still work.

## Animating multiple elements with the same animation

Before we jump into working with time lines we'll look at one last case. How to animate multiple object using the same animation parameters. We'll use 2 small circles defined using HTML div elements and CSS for styling.

```css
body {
    background: #eee;
    text-align: center;
}

.circles {
    border-radius: 50%;
    border: 1px solid crimson;
    background-color: indianred;
    height: 50px;
    width: 50px;
}

div > #player {
    display: block;
}

#o1 {
    margin-bottom: 1rem;
}
```

This time we define two circles and a play button. We also add a script tag pointing to the CDN version of TweenMax. We'll have to play with this to make sure that the script is also available when offline.

```markup
<div>
  <button id="player">Play</button>
</div>

<div class="circles" id="o1"></div>
<div class="circles" id="o2"></div>

<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js"></script>
```

The script is not too different than what we've used before. The main difference is that instead of capturing a single element by its ID we use `getElementsByClassName` to get all the elements matching the given class.

We then use `TweenLite.to` to control the final position of the element and a linear easing function.

We reuse the player button code from earlier examples to check if the tween is running. If it is we pause it and if it's not then we play it.

```javascript
let circles = document.getElementsByClassName('circles');
let player = document.getElementById('player');

// creates a tween for margin-left from 0 to 800
anim = TweenLite.to(circles, 10, { marginLeft: 800, ease: Linear.easeNone });

player.addEventListener('click', function() {
    if (TweenMax.isTweening(circles) === false) {
        anim.play();
        player.innerText="Pause";
    } else {
        anim.pause();
        player.innerText='Play';
    }
});
```

## Timelines

Timelines give us finer control and additional features over the tween animations offered by `TweenMax`.

Timeline parameters:

You can use the constructor's vars parameter to define any of the special properties below (syntax example: new TimelineLite({onComplete:myFunction, delay:2});

- **delay**: Number - Amount of delay in seconds (or frames for frames-based tweens) before the animation should begin
- **paused**: Boolean - If true, the tween will pause itself immediately upon creation
- **onComplete**: Function - A function that should be called when the animation has completed. onCompleteScope : Object - Defines the scope of the onComplete function (what "this" refers to inside that function)
- **useFrames**: Boolean - If useFrames is true, the tweens's timing will be based on frames instead of seconds because it is intially added to the root frames-based timeline. This causes both its duration and delay to be based on frames. An animations's timing mode is always determined by its parent timeline
- **tweens**: Array - To immediately insert several tweens into the timeline, use the tweens special property to pass in an Array of TweenLite/TweenMax/TimelineLite/TimelineMax instances. You can use this in conjunction with the align and stagger special properties to set up complex sequences with minimal code. These values simply get passed to the add() method
- **align**: String - Only used in conjunction with the tweens special property when multiple tweens are to be inserted immediately. The value simply gets passed to the add() method. The default is "normal". Options are:
    
    1. "sequence" : aligns the tweens one-after-the-other in a sequence
    2. "start" : aligns the start times of all of the tweens (ignores delays)
    3. "normal" : aligns the start times of all the tweens (honors delays)
    
    - The align special property does not force all child tweens/timelines to maintain relative positioning, so for example, if you use "sequence" and then later change the duration of one of the nested tweens, it does not force all subsequent timelines to change their position. The align special property only affects the alignment of the tweens that are initially placed into the timeline through the tweens special property of the vars object.
- **stagger**: Number - Only used in conjunction with the tweens special property when multiple tweens are to be inserted immediately. It staggers the tweens by a set amount of time in seconds (or in frames if useFrames is true). For example, if the stagger value is 0.5 and the "align" property is set to "start", the second tween will start 0.5 seconds after the first one starts, then 0.5 seconds later the third one will start, etc. If the align property is "sequence", there would be 0.5 seconds added between each tween. This value simply gets passed to the add() method. Default is 0.
- **onStart**: Function - A function that should be called when the tween begins (when its time changes from 0 to some other value which can happen more than once if the tween is restarted multiple times).
    
    - **onStartScope**: Object - Defines the scope of the onStart function (what "this" refers to inside that function).
- **onReverseComplete**: Function - A function that should be called when the tween has reached its beginning again from the reverse direction. For example, if reverse() is called the tween will move back towards its beginning and when itstime reaches 0, onReverseComplete will be called. This can also happen if the tween is placed in a TimelineLite or TimelineMax instance that gets reversed and plays the tween backwards to (or past) the beginning.
    
    - **onReverseCompleteScope**: Object - Defines the scope of the onReverseComplete function (what "this" refers to inside that function).
- **onUpdate**: Function - A function that should be called every time the animation updates (on every frame while the animation is active).
    
    - **onUpdateScope**: Object - Defines the scope of the onUpdate function (what "this" refers to inside that function).
- **autoRemoveChildren**: Boolean - If autoRemoveChildren is set to true, as soon as child tweens/timelines complete, they will automatically get killed/removed. This is normally undesireable because it prevents going backwards in time (like if you want to reverse() or set the progress lower, etc.). It can, however, improve speed and memory management. The root timelines use autoRemoveChildren:true.
- **smoothChildTiming**: Boolean - Controls whether or not child tweens/timelines are repositioned automatically (changing their startTime) in order to maintain smooth playback when properties are changed on-the-fly. For example, imagine that the timeline's playhead is on a child tween that is 75% complete, moving element's left from 0 to 100 and then that tween's reverse() method is called. If smoothChildTiming is false (the default except for the root timelines), the tween would flip in place, keeping its startTime consistent. Therefore the playhead of the timeline would now be at the tween's 25% completion point instead of 75%. Remember, the timeline's playhead position and direction are unaffected by child tween/timeline changes. element's left would jump from 75 to 25, but the tween's position in the timeline would remain consistent. However, if smoothChildTiming is true, that child tween's startTime would be adjusted so that the timeline's playhead intersects with the same spot on the tween (75% complete) as it had immediately before reverse() was called, thus playback appears perfectly smooth. element's left would still be 75 and it would continue from there as the playhead moves on, but since the tween is reversed now element's left will travel back towards 0 instead of 100. Ultimately it's a decision between prioritizing smooth on-the-fly playback (true) or consistent position(s) of child tweens/timelines (false). Some examples of on-the-fly changes to child tweens/timelines that could cause their startTime to change when smoothChildTiming is true are: reversed, timeScale, progress, totalProgress, time, totalTime, delay, pause, resume, duration, and totalDuration.
- **onCompleteParams**: Array - An Array of parameters to pass the onComplete function. For example, new TimelineLite({onComplete:myFunction, onCompleteParams:\["param1", "param2"\]}); To self-reference the timeline instance itself in one of the parameters, use "{self}", like: onCompleteParams:\["{self}", "param2"\]
- **onStartParams**: Array - An Array of parameters to pass the onStart function. For example, new TimelineLite({onStart:myFunction, onStartParams:\["param1", "param2"\]}); To self-reference the timeline instance itself in one of the parameters, use "{self}", like: onStartParams:\["{self}", "param2"\]
- **onUpdateParams**: Array - An Array of parameters to pass the onUpdate function. For example, new TimelineLite({onUpdate:myFunction, onUpdateParams:\["param1", "param2"\]}); To self-reference the timeline instance itself in one of the parameters, use "{self}", like: onUpdateParams:\["{self}", "param2"\]
- **onReverseCompleteParams**: Array - An Array of parameters to pass the onReverseComplete function. For example, new TimelineLite({onReverseComplete:myFunction, onReverseCompleteParams:\["param1", "param2"\]}); To self-reference the timeline instance itself in one of the parameters, use "{self}", like: onReverseCompleteParams:\["{self}", "param2"\]
    
    - **callbackScope**: Object - The scope to be used for all of the callbacks (onStart, onUpdate, onComplete, etc.). The scope is what "this" refers to inside any of the callbacks. The older callback-specific scope properties (onStartScope, onUpdateScope, onCompleteScope, onReverseComplete, etc.) are deprecated but still work.

The HTML and CSS are the same as the prior example animating multiple objects with the same animation. The script will change as we'll leverage several features available on GSAP:

1. We create a timeline to sequence the events
2. We capture the objects to animate into variables that will be used later in the script
3. We animate the objects in sequence
    
    1. We animate the objects as a group with the same animation
    2. We then animate each object individually with a different easing function
4. We play the timeline

```javascript
// captures the timeline
let timeline = new TimelineLite(); // 1
// all animatable elements
let circles = document.getElementsByClassName('circles'); // 2
// Individual animatable elements
let elem1 = document.getElementById('o1');
let elem2 = document.getElementById('o2');
// Play button
let play = document.getElementById('play');

// With a timeline we can work with multiple tweens
timeline.add(TweenLite.to(circles, 4, { // 3 - 1 
    marginLeft: 400, ease: Linear.easeNone }));
timeline.add(TweenLite.to(elem1, 2.5, { // 3 - 2
    ease: SlowMo.ease.config(0.7, 0.7, false), y: 500
}));
timeline.add(TweenLite.to(elem2, 2.5, {
    ease: RoughEase.ease.config({
        template:  Power0.easeNone, strength: 1, points: 20, 
        taper: "none", randomize:  true, clamp: false}), y: 500 }));
timeline.add(TweenLite.to(circles, 10, { 
    marginLeft: 800, ease: Linear.easeNone }));

timeline.play(); // 4
```

## What we're not covering about GSAP

Because it's such a big and feature rich library there is no way that I can cover all of GSAP and still have time to do what I need to do and still have a life. It is meant as a starting point for future work and most of the code can definitely be improved.

There is a whole other area of using GSAP that I will not cover: animating SVG. There are some thing that are better done with SVG than PNG; see the animations for Jake Archibald's [Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/) as an example.

Animating infographics and illustration will be covered in later posts.

To get an idea what you can do with SVG and GSAP, see the presentation below by Sarah Drasner who covers SVG and GSAP very well and in enough detail to make it a good starting point.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZNukcHhpSXg?rel=0" frameborder="0" allowfullscreen></iframe>

# Links and resources

## Books about animation

| Title | Author | Publisher |
| --- | --- | --- |
| [Transitions and Animations in CSS](http://shop.oreilly.com/product/0636920041658.do) | Estelle Weyl | O'Reilly |
| [Designing Interface Animation](http://rosenfeldmedia.com/books/designing-interface-animation/) | Val Head | Rosenfeld Media |
| [Learning CSS3 Animations and Transitions](https://www.amazon.com/gp/product/0321839609/) | Alexis Goldstein | Addison-Wesley |

## Articles and Tutorials

| Title | Appears in |
| --- | --- |
| [What Disney's Classic Animation Principles Could Teach Web Designers](http://www.fastcodesign.com/3055811/what-disneys-classic-animation-principles-can-teach-us-about-great-web-design) | Fast Company |
| [Safer Web Animation for Motion Sensitivity](http://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity) | A List Apart |
| [UI Animation & UX: A not-so-secret friendship](http://alistapart.com/article/ui-animation-and-ux-a-not-so-secret-friendship) | A List Apart |
| [Sketching Interface Animations – An Interview with Eva-Lotta Lamm](http://valhead.com/2016/12/08/sketching-interface-animations-an-interview-with-eva-lotta-lamm/) | Val Head's Blog |
| [Animation in Design Systems](https://24ways.org/2016/animation-in-design-systems/) | 24 ways |
| [A Comparison of Animation Technologies](https://css-tricks.com/comparison-animation-technologies/) | CSS Tricks |
| [12 basic principles of animation](https://www.wikiwand.com/en/12_basic_principles_of_animation) | Article at Wikipedia |
| [Nerding Out With Bezier Curves](https://medium.freecodecamp.com/nerding-out-with-bezier-curves-6e3c0bc48e2f#.ynv9pl62w) | Medium |
| [Using CSS to animate border-radius](https://chrisruppel.com/blog/css-animation-border-radius/) | chrisruppel.com |
| [Let the Web move you](http://www.webdirections.org/blog/let-the-web-move-you-css3-animations-and-transitions/) | Web Directions |
| [A better tool for cubic bezier easing](http://lea.verou.me/2011/09/a-better-tool-for-cubic-bezier-easing/) | lea.verou.me |
| [Steps CSS Animations](https://designmodo.com/steps-css-animations/) | Designmodo |
| [Web Animation Tutorial Roundup](http://valhead.com/2016/12/16/web-animation-tutorials-roundup/) | Val Head |
| [Getting started with GSAP](https://greensock.com/get-started-js) | gsap.com |
| [Greenson.com](https://ihatetomatoes.net/get-greensock-101/) | ihatetomatoes.net |
| [GSAP + SVG for Power Users: Motion Along A Path](https://davidwalsh.name/gsap-svg) | davidwalsh.name |
| [GSAP HTML5 documentation](https://greensock.com/docs/#/HTML5/) | greensock.com |

## Mailing Lists

- [UI Animation Newsletter](http://uianimationnewsletter.us2.list-manage.com/subscribe?u=6fbaddc8c1fce7588d1a35cb2&id=8f4de2c2e5)
- [Web Animation Weekly](http://webanimationweekly.us1.list-manage.com/subscribe?u=0a8f219cf8284562f91a26ee9&id=d60f6683d2)
