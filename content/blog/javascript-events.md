---
title: Javascript events
date: 2023-10-23
---

When working on a demo for a different post, I realised that I don't really know how events work beyond how to add them to the page.

This post will look at events and events listeners, how to add them to the page and additional information that may be useful when working with events.

## What are events?

The [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) API represents an event that happens in the DOM.

See MDN's [Event reference](https://developer.mozilla.org/en-US/docs/Web/Events) page for a list of the different types of events that are available.

## Handling events

Browsers generate events all the time. When you move the mouse or tab in or out of an element, when you click on a link or a button, or when you type in a text area for example.

As a developer you can choose to interact with or handle these events to produce interactivity.

In older browsers, you would handle events using [onevent handler attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes#event_handler_attributes). In older code you may see something like this:

```js
<button onclick="console.log(event)">
  Click me!
</button>
```

When you click the button the `onclick` even will activate and the even will be logged to the console.

The first evolution of event handlers moved the code outside the HTML attribute and into a separate script. Because we no longer have a reference to the element triggering the event, we need to provide it.

```js
const myButton = document.querySelector("button")

myButton.onclick = console.log(myButton.innerText);
```

The next, and current, iteration of event handles use the [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/Event#:~:text=EventTarget.addEventListener()) function to handle events.

`addEventListener()` takes two parameters: the name of the event that we want to handle and a function that will handle the event.

```js
const myButton = document.querySelector("button")

myButton.addEventListener('click', (event) => {
  console.log(myButton.innerText);
})
```

We can also use [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) to attach the same event to multiple instances of an element.

This example, taken from [How to add an event listener to multiple elements in JavaScript](https://flaviocopes.com/how-to-add-event-listener-multiple-elements-javascript/), shows how we can add the same event handler to multiple elements.

```js
document.querySelectorAll('button').forEach(item => {
  item.addEventListener('click', (event) => {
    console.log(event)
  })
})
```

### Pointer events heads up

Note that in addition to [mouse](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) and [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) you have [pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events).

Pointer events provide an enhanced experience for pointer devices other than mice, however they may have some differences with mouse and touch events.

One way to handle these differences is to test for the type of pointer device being used.

`pointerType` is a read-only property of pointer events that detect the type of pointer device used. The three possible values are:

* mouse
* pen
* touch

If the type of pointer device can't be detected or doesn't match the three available values, it will return an empty string.

For the `pointerdown` event we use a switch statement to test the type of pointer device used. We then create a different function to handle each type of device and, if the device doesn't match our list, we let the user know in the console.

```js
myButton.addEventListener("pointerdown", (event) => {
  switch (event.pointerType) {
    case "mouse":
      process_mouse(event);
      break;
    case "pen":
      process_pen(event);
      break;
    case "touch":
      process_touch(event);
      break;
    default:
      console.log(`pointerType ${ev.pointerType} is not supported`);
  }
});
```

Pointer events are useful but require significant more work for limited functionality.

## Custom events

Most of the time we will work with browser generated events. There are times when we want to fire out own events and handle them appropriately.

[Creating and triggering events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events) shows how to create custom events. I've chosen to use the [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) interface to create custom events that can pass data to the handlers in the `details` attribute.

```js
const myEvent = new CustomEvent("myevent", {
  detail: {},
  bubbles: true,
  cancelable: true,
  composed: false,
});
```

After building event we call [dispatchEvent()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent) to send the event to be handled.

`dispatchEvent()` sends an Event to the object, invoking the affected event listeners in the appropriate order. The normal event processing rules (including the capturing and optional bubbling phase) also apply to events dispatched manually with dispatchEvent().

Calling `dispatchEvent()` is the last step to firing an event. You  should have already created and initialized the event you want to dispatch.

Using the example above we dispatch like this:

```js
const myButton = document.querySelector('#myButton')

myButton.dispatchEvent(myEvent);
```

With custom events we get additional flexibility to craft specific types of events.

### Event propagation, bubbling and capturing

Javascript has two different way to propagate events around the DOM.

`bubbling` travels from the target upto the root, and `capturing` travels from the root down to the target.

`root` is the highest-level parent of the target. This is usually the document, which is a parent of the , which is a (possibly distant) parent of your target element.

The target is the DOM node that triggered the event.

Capturing is not used nearly as commonly as bubbling. `addEventListener()` has an optional third parameter, `useCapture`, that controls the phase of the propagation. If the value is  true, it will cause the listener to be on the capturing phase. When the value is false, it will apply the to the bubbling phase.

Once you trigger the event, it will propagate up to the root, and it will trigger every event handler which is associated with the same type.

For example, if your button has a click event, during the bubbling phase, it will bubble up to the root, and trigger every click event along the way.

You also have means to prevent even bubbling and propagation.

[event.stopPropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) prevents further propagation of the current event in the capturing and bubbling phases. It will stop events events further up the bubbling chain but not the handler that calls `stopPropagation` any other handlers attached to the same element.

[stopImmediatePropagation()](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation) will stop all events up the chain from being triggered.

For a full working example, see the Codepen below:

<iframe height="300" style="width: 100%;" scrolling="no" title="event propagation" src="https://codepen.io/caraya/embed/zYyMzBW?default-tab=result&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/zYyMzBW">
  event propagation</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Make sure that you have a console, either the browser's or Codepen's, open since the results will be posted there.

The first time you run the Codepen, it will print 1 2 and 3.

Try adding `event.stopPropagation();` inside the `first` function and save it. It should print 1 and 2.

Now, change `event.stopPropagation()` to `event.stopImmediatePropagation();`. It should now print 1, the result of the function that stopped propagation, and nothing else.

There is a lot more to experiment with events. This is just the starting point.
