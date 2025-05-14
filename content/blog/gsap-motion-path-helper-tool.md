---
title: GSAP Motion Path Helper tool
date: 2025-06-04
tags:
  - Javascript
  - Animation
  - GSAP
---

Now that GSAP 3.11 has been released as a free product, the GSAP Motion Path Helper plugin is available for use free of charge.

This post will run through installing the GSAP MotionPathHelper plugin, and how to use it.

## Why a Javascript solution?

Creating SVG paths is very challenging, especially when you want to create complex paths for animations or to place text on them.

The MotionPathHelper GSAP plugin allows you to create complex animations with ease by providing a visual interface for defining motion paths.

While I'm normally not a fan of using Javascript for animations, I've come to appreciate the power of GSAP and especially the MotionPathHelper plugin. It used to be a paid plugin, but now it's free to use so there's a stronger incentive to use it.

## Installing GSAP Motion Path And Helper

Using GSAP plugins is a two-step process. First, you need to install the GSAP library itself, and then you need to install the MotionPath and MotionPathHelper plugins.

MotionPathHelper depends on MotionPath to work, so you need to install both.

The second step is to register the plugins using GSAP's `registerPlugin()` method.

```js
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MotionPathHelper } from "gsap/MotionPathHelper";

gsap.registerPlugin(MotionPathPlugin, MotionPathHelper);
```

You can add more plugins as needed using the same system. For this example, we will only use the `MotionPath` and `MotionPathHelper` plugins.

## Examples of how it works

We will look at two examples of how to use the `MotionPathHelper` plugin.

The first example is a simple animation of a ball moving along a path.

The second example is a more complex example that allows you to edit the path and copy it to the clipboard.

### The first, trivial, version

For the first example, we will create a simple animation of a ball moving along a path.

The first step is to create the path in SVG using the `path` element. The path is defined using the `d` attribute, which contains a series of commands and parameters that define the shape of the path.

We also define a circle that will move along the path using the `circle` element.

```xml
<svg id="demo" viewBox="0 0 600 400" width="600" height="400">

  <path
		id="path"
		d="M 100,300 C 200,100 400,100 500,300"
		stroke="#000"
		stroke-width="2"
		fill="none" />

  <circle id="ball" class="ball" cx="0" cy="0" r="10" />
</svg>
```

The GSAP animation is defined in the `initMotionPath` function. Inside the function there are two methods:

* `MotionPathHelper.create()` method creates the motion path and align the ball to the path
* `gsap.to()` [tween](https://gsap.com/docs/v3/GSAP/Tween/) animates the ball along the path.
  * It will run for 5 seconds and repeat indefinitely
  * With `ease` set to `none`, the animation will run at a constant speed.

Finally we run the `initMotionPath` function to start the animation.

```js
function initMotionPath() {
	const ball = document.getElementById("ball");

	MotionPathHelper.create(ball, {
		path: "#path",
		align: "#path",
		alignOrigin: [0.5, 0.5],
		autoRotate: true
	});

	gsap.to(ball, {
		duration: 5,
		repeat: -1,
		ease: "none",
		motionPath: {
			path: "#path",
			align: "#path",
			alignOrigin: [0.5, 0.5],
			autoRotate: true
		}
	});
}

initMotionPath();
```

The ball will move along the path but you cannot change the path.

But, as it stands, this example is static and the path is not editable. We'll address these issues in the next example.

### A more complex version

The second version is more complex. It allows you edit the path and copy it to the clipboard to use in other applications.

Like in the previous example, we first create the path in SVG using a `d` attribute in a `path` element. We also define the circle that will move along the path using a `circle` element.`

In addition we create two buttons to reset the path and copyr the path to the clipboard.

```html
<div class="container">
	<svg id="svg" width="600" height="400">
		<path
			id="motionPath"
			d="M100,200 C150,100 350,100 400,200"
			stroke="black"
			stroke-width="2"
			fill="none" />
		<circle id="ball" r="10" fill="red" />
	</svg>
	<div class="buttons">
		<button id="reset">Reset Path</button>
		<button id="copy">Copy Path</button>
	</div>
</div>
```

After we import the GSAP library and the plugins, we register the plugins using the `registerPlugin()` method.

We capture references to the path, ball and buttons. We also store the original `d` attribute of the path so we can reset it as needed.

```js
const pathEl   = document.querySelector("#motionPath");
const ball     = document.querySelector("#ball");
const resetBtn = document.querySelector("#reset");
const copyBtn  = document.querySelector("#copy");

const originalD = pathEl.getAttribute("d");
```

The `createTween` function creates the animation using the `to()` tween method. The animation will run for 5 seconds and repeat indefinitely at a constant speed.

The `motionPath` property is used to define the path and align the ball to the path.

The `autoRotate` property is set to `true` to make the ball rotate as it moves along the path. In the case of a circle this may not be necessary since you won't see the rotation, but it's useful for other shapes.

The `alignOrigin` property is set to `[0.5, 0.5]` to center the ball on the path.

Finally, we create the tween running the `createTween` function.

```js
function createTween() {
  return gsap.to(ball, {
    duration:    5,
    repeat:      -1,
    ease:        "none",
    motionPath: {
      path:       pathEl,
      align:      pathEl,
      autoRotate: true,
      alignOrigin:[0.5, 0.5],
    }
  });
}

let tween = createTween();
```

The editor function expression creates the editor using the `MotionPathHelper.editPath()` method. This will enable us to edit the path visually.

The first parameter is the path element to edit.

The `handleSize` property is set to `8` to make the handles larger and easier to grab.

The `draggable` property is set to `true` to make the path draggable.

The `selected` property is set to `true` to make the path selected by default.

The `onUpdate` property is set to a function that will be called when the path is updated. The function updates the tween by killing the current tween and recreating it. This will update the animation to use the new path.

```js
let editor = MotionPathHelper.editPath(pathEl, {
  handleSize: 8,
  draggable:  true,
  selected:   true,
  onUpdate: () => {
    tween.kill();
    tween = createTween();
  }
});
```

We attach a click event listener to the reset button. When the button is clicked, we kill the current editor UI and reset the path to its original `d` attribute we stored earlierl. Finally, we kill the current tween, recreate it and re-enable editing.

```js
// reset both the path and the animation
resetBtn.addEventListener("click", () => {
  editor.kill();                      // remove the current editor UI
  pathEl.setAttribute("d", originalD);
  tween.kill();
  tween = createTween();
  // re-enable editing
  editor = MotionPathHelper.editPath(pathEl, {
    handleSize: 8,
    draggable:  true,
    selected:   true,
    onUpdate: () => {
      tween.kill();
      tween = createTween();
    }
  });
});
```

We attach a click event handler to the copy button. The button copies the current `d` attribute of the path to the clipboard using the `navigator.clipboard.writeText()` method.

```js
// copy current `d` to clipboard
copyBtn.addEventListener("click", async () => {
  try {
    const d = pathEl.getAttribute("d");
    await navigator.clipboard.writeText(d);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy Path"), 1500);
  } catch {
    copyBtn.textContent = "Copy Failed";
    setTimeout(() => (copyBtn.textContent = "Copy Path"), 1500);
  }
});
```

## How and why to use the tool?

The idea is to create a path using the tool and then copy the path to the clipboard. You can then paste the path to your stylesheets or SVG files.

To me, this is an elegant solution to reduce the complexity of creating SVG paths.
