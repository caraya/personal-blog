---
title: Pointer Event Example
date: 2024-12-18
tags:
  - Javascript
  - Events
  - Reference
---

While we have touch and mouse events, pointer events, the pointer events API provides a unified interface for both mouse and touch devices.

This post will explore pointer events, paying special attention to how they will work across devices and how to leverage the features of pens and other types of devices.

## Basic Usage

The basic usage of pointer events work just like other events. We attach a listener to the desired event and act accordingly.

In the following example the `pointerdown` event we test the type of pointer device that you used. We can use this as a starting point when we want different actions based on the type of pointer that was used.

```js
const element = document.getElementById("target");

element.addEventListener("pointerdown", (event) => {
  switch (event.pointerType) {
    case "mouse":
      console.log("Mouse input");
      break;
    case "touch":
      console.log("Touch input");
      break;
    case "pen":
      console.log("Pen input");
      break;
		default:
			console.log("Unknown input");
  }
});
```

## Equivalency between pointer and mouse events

Since Pointer events work with all types of pointer devices we can use them instead of touch and mouse events. Since most of the code online only shows mouse events, I decided to work an equivalency table between pointer and mouse events.

| Pointer event | Equivalent mouse event |
| :---: | :---: |
| pointerdown | mousedown |
| pointerup | mouseup |
| pointermove | mousemove |
| pointerover | mouseover |
| pointerout | mouseout |
| pointerenter | mouseenter |
| pointerleave | mouseleave |
| pointercancel | &mdash; |
| gotpointercapture | &mdash; |
| lostpointercapture | &mdash; |

## A more elaborate example

This example uses pointer events to create a stylus/pen based drawing application to a canvas element.

1. Capture a reference to the `canvas` element
2. Create a 2D context using the [getContext](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext) method
   1. We wrap the context definition inside a feature query
3. For the three pointer events (`pointerdown`, `pointermove` and `pointerup`) we first check if the pointer type was a pen (which identifies pen and stylus devices) and then run code appropriate to the event
   1. When working with canvas code it's always important to close the path you're writing

```js
// 1
const canvas = document.getElementById('myCanvas');

// 2
if (canvas.getContext) {
  const ctx = canvas.getContext("2d");
} else {
	console.log('canvas 2d content is not supported');

// 3
canvas.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'pen') {
    ctx.beginPath();
    ctx.moveTo(event.clientX, event.clientY);
  }
});

// 3
canvas.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'pen') {
    ctx.lineTo(event.clientX, event.clientY);
    ctx.strokeStyle = 'black'; // Set line color
    ctx.lineWidth = event.pressure * 5; // Adjust line width based on pressure
    ctx.stroke();
  }
});

// 6
canvas.addEventListener('pointerup', (event) => {
  if (event.pointerType === 'pen') {
    ctx.closePath();
  }
})
};
```

There are other possible examples for pointer events. For example: most, if not all, touch screens will not handle hover states so we might want to do something different for those situations

Or you can let the system do it's thing and use the same code for all pointer types. Most of the time it will not make any difference.
