---
title: "Getting Fancy: Animating text"
date: "2015-08-24"
categories: 
  - "technology"
---

Depending on the context and the type of text you're using animations can be useful. [CSS Animation Level 1](cssanimations) provides a way to animate CSS properties over time. It uses key frames to create the animations.

We will work through an example similar to the Mozilla Developer Network [basic animation example](https://developer.mozilla.org/samples/cssref/animations/cssanim1.html). The same or similar process can be used for other types of animations.

The first thing we do is work setting up the animations in the elements we want, in this case, `h1`. Also note that we have to set up each attribute twice and maybe 3 times: One with the Mozilla/Firefox prefix (-moz), one for Chrome, Opera and Safari (-webkit) and one without a prefix to prepare for when vendor prefixes are no longer needed.

The attributes we set up are:

- Duration: How long will the animation last
- Name: The name of the animation we will use. We'll define the animation below

```css
h1 {
  -moz-animation-duration: 3s;
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
  -moz-animation-name: slidein;
  -webkit-animation-name: slidein;
  animation-name: slidein;
}
    
```

Once we set up the animation parameters we need to define the animation. We also have to do this three times, One for Firefox, one for Webkit-based browsers and one without a prefix to future proof our code. Each keyframes selector defines a beginning and ending state for the chosen object. In this case we move h1 heading from left to right and decrease its width at the same time. All these tasks will be done in 3 seconds (as specified by the \*-animation-duration attribute of the h1 tag.)

```css
@-moz-keyframes slidein {
  0% { margin-left:100%; width:300%; }
  100% { margin-left:0%; width:100%; }
}

@-webkit-keyframes slidein {
  0% { margin-left:100%; width:300%; }
  100% { margin-left:0%; width:100%; }
}

@keyframes slidein {
  0% { margin-left:100%; width:300%; }
  100% { margin-left:0%; width:100%; }
}
```

> There is another syntax available online that uses keywords (from, to). They are equivalent but I recommend using percentages since they make more sense when inserting additional steps for an animation.

This is just the beginning. We can add additional frames to the key frames selector to make the animation smoother or to add additional steps and animation types to the process. We're also able to animate color transitions, like transforming the background color of an element through a series of steps.

There is also a [Web Animations API](https://w3c.github.io/web-animations/) editor's draft that allows developers to use JavaScript to create and control animations. I mention it here but wil not cover it as it's a Javascript API I'm still in the process of learning.

Just like with transformation: _Just because you can it doesn't mean you should._ As great as animations are they take time and may detract from your audience's attention. Animations can also cause [performance issues](http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/) that you need to consider.

### Links and resources

- [Keyframe Animation Syntax](https://css-tricks.com/snippets/css/keyframe-animation-syntax/)
- [Animation](https://css-tricks.com/almanac/properties/a/animation/)
- Web Animation API
- [Animation Using CSS Transforms](http://www.the-art-of-web.com/css/css-animation/) (The Art of Web)
