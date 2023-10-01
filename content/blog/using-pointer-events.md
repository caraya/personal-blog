---
title: "Using Pointer Events"
date: "2020-05-06"
---

In May 2019 I wrote a post about [Pointer Events](https://publishing-project.rivendellweb.net/pointer-events/) as an introduction to Pointer Events and how they could be polyfilled for browsers (Safari) that didn't support them natively.

Almost a year later things have progressed. Safari supports the feature so there's no need for a polyfill and it's now practical to use in production.

As a refresher, these are the events, the onEvent handlers and a brief explanation of when they trigger, taken from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)

| Event | On Event Handler | Description |
| --- | --- | --- |
| `[pointerover](https://developer.mozilla.org//en-US/docs/Web/Events/pointerover)` | [`onpointerover`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointerover) | Fired when a pointer is moved into an element's hit test boundaries. |
| `[pointerenter](https://developer.mozilla.org//en-US/docs/Web/Events/pointerenter)` | [`onpointerenter`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointerenter) | Fired when a pointer is moved into the hit test boundaries of an element or one of its descendants, including as a result of a pointerdown event from a device that does not support hover (see `pointerdown`). |
| `[pointerdown](https://developer.mozilla.org//en-US/docs/Web/Events/pointerdown)` | [`onpointerdown`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointerdown) | Fired when a pointer becomes _active buttons state_. |
| `[pointermove](https://developer.mozilla.org//en-US/docs/Web/Events/pointermove)` | [`onpointermove`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointermove) | Fired when a pointer changes coordinates. This event is also used if the change in pointer state can not be reported by other events. |
| `[pointerup](https://developer.mozilla.org//en-US/docs/Web/Events/pointerup)` | [`onpointerup`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointerup) | Fired when a pointer is no longer _active buttons state_. |
| `[pointercancel](https://developer.mozilla.org//en-US/docs/Web/Events/pointercancel)` | [`onpointercancel`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointercancel) | A browser fires this event if it concludes the pointer will no longer be able to generate events (for example the related device is deactived). |
| `[pointerout](https://developer.mozilla.org//en-US/docs/Web/Events/pointerout)` | [`onpointerout`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointerout) | Fired for several reasons including: pointer is moved out of the hit test boundaries of an element; firing the pointerup event for a device that does not support hover (see pointerup); after firing the `pointercancel` event (see `pointercancel`); when a pen stylus leaves the hover range detectable by the digitizer. |
| `[pointerleave](https://developer.mozilla.org//en-US/docs/Web/Events/pointerleave)` | [`onpointerleave`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onpointerleave) | Fired when a pointer is moved out of the hit test boundaries of an element. For pen devices, this event is fired when the stylus leaves the hover range detectable by the digitizer. |
| `[gotpointercapture](https://developer.mozilla.org//en-US/docs/Web/Events/gotpointercapture)` | [`ongotpointercapture`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/ongotpointercapture) | Fired when an element receives pointer capture. |
| `[lostpointercapture](https://developer.mozilla.org//en-US/docs/Web/Events/lostpointercapture)` | [`onlostpointercapture`](https://developer.mozilla.org//en-US/docs/Web/API/GlobalEventHandlers/onlostpointercapture) | Fired after pointer capture is released for a pointer. |

The idea is to recreate two basic event handlers so they'll work across devices: click and hover.

## First, and naive implementation

Using the following HTML code.

```html
<div class="box">
  <h1>Click Me!</h2>
</div>
```

We can use the following Javascript code to listen for `pointerdown` and `pointerover`.

```js
if (window.PointerEvent) {
  const box = document.querySelector(".box");

  box.addEventListener("pointerdown", (evt) => {
    console.log("Pointer click equivalent");
  });

  box.addEventListener("pointerover", (evt) => {
    console.log("Pointer moved in");
  });
}
```

We wrap our code on a basic feature detection block to make sure we only use the feature in browsers that support it.

Next, we capture a reference to the HTML object that we want to work with and add the two event listeners.

Most of the time this will be OK as the behavior we want is similar across pointing devices

## Take two

But there are times when we may want to do things differently based on what type of device is accessing the element and how it's doing it.

For example, it's different to click on a button with your finger than with a pen.

The `pointerover` event remains the same as that one doesn't need to know the type of pointing device that we used.

We change `pointerdown` to a switch statement where we test for different types of pointer devices and take appropriate action based on the type of device.

We use a [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement to match the type of pointer in use: mouse, pen, or touch.

```js
const box = document.querySelector(".box");

if (window.PointerEvent) {
  box.addEventListener("pointerover", (evt) => {
    console.log("Pointer moved in");
  });

  box.addEventListener("pointerdown", (evt) => {
    switch(evt.pointerType) {
      case "mouse":
        console.log('mouse input detected');
        break;
      case "pen":
        console.log('pen/stylus input detected');
        break;
      case "touch":
        console.log('touch input detected');
        break;
      default:
        console.log('pointerType is empty or could not be detected');
    }
  });
}
```

## Refining the code

The last portion of this post will cover some refinements that we can do to the script to improve performance.

First, we create external functions for each of the events that we want to handle.

```js
function handlePointerOver(evt) {
  console.log("Pointer moved in");
}

function handlePenInput(evt) {
  console.log("pen/stylus input detected");
}

function handleTouchInput(evt) {
  console.log("touch input detected");
}

function handleMouseInput(evt) {
  console.log("mouse input detected");
}
```

Then we reference the functions from inside the event handlers. This way we make the code more modular.

```js
if (window.PointerEvent) {
  box.addEventListener("pointerover", (evt) => {
    handlePointerEvent(evt);
  });

  box.addEventListener("pointerdown", (evt) => {
    console.log("Pointer is down");
    switch (evt.pointerType) {
      case "mouse":
        handleMouseInput(evt);
        break;
      case "pen":
        handlePenInput(evt);
        break;
      case "touch":
        handleTouchInput(evt);
        break;
      default:
        console.log("pointerType could not be detected");
    }
  });
}
```

We can further refine the touch event handler by using multi-touch interactions as explained in MDN's [Multi-touch interaction](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Multi-touch_interaction)
