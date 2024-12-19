---
title: Working with Javascript events
date: 2024-12-16
baseline: true
tags:
  - Javascript
  - Events
  - Event Listeners
---

Events are things that happen in the system you are programming &mdash; the system "fires" a signal of some kind when an event occurs, and provides a way to use the event in either the element that triggers it or with any parent element until you reach the window object.

This post will explore events. What they are how to use them with event listeners and how to create and use custom events for our apps and pages.

## How They Work

<baseline-status featureId="events"></baseline-status>

<baseline-status featureId="addEventListener"></baseline-status>

We first decide what element we will capture the event for.

In this case we create a button with an ID.

```html
<button id="thebutton">Change color</button>
```

In Javascript, we first capture a reference to the HTML element.

We then add the event listener with the type of event we want to capture (`click`) and the function that will be run when the event is triggered.

```js
// 1
const btn = document.querySelector("#thebutton");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

// 2
btn.addEventListener("click", () => {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
});
```

This example defines the function directly as the second parameter to the event listener, we could also create the function outside and pass the name of the function as the second parameter instead.

We can also write the event listener like this:

```js
const btn = document.querySelector("#thebutton");

function random(number) {
  return Math.floor(Math.random() * (number + 1));
}

function randomBackground() {
  const rndCol = `rgb(${random(255)} ${random(255)} ${random(255)})`;
  document.body.style.backgroundColor = rndCol;
};

btn.addEventListener("click", randomBackground);
```

## Creating Custom Events

<baseline-status featureId="CustomEvent"><baseline-status>

There are times when the built-in events are not enough to accomplish our tasks.  Javascript provides ways to create custom events and then dispatch or fire them when necessary.

```html
<form>
  <textarea></textarea>
</form>
```

1. Create a new event, allow bubbling, and provide any data you want to pass to the "detail" property
2. The form element listens for the custom "awesome" event and then consoles the output of the passed text() method
3. As the user types, the textarea inside the form dispatches/triggers the event to fire, and uses itself as the starting point

```js
const form = document.querySelector("form");
const textarea = document.querySelector("textarea");

// 1
const eventAwesome = new CustomEvent("awesome", {
  bubbles: true,
  detail: { text: () => textarea.value },
});

// 2
form.addEventListener("awesome", (e) => console.log(e.detail.text()));

// 3
textarea.addEventListener("input", (e) => e.target.dispatchEvent(eventAwesome));
```

We can also create custom events inside the event listeners as shown in the modified example below.

It's the same functionality but, in my opinion, in a wat that's more sucint and easier to read.

```js
const form = document.querySelector("form");
const textarea = document.querySelector("textarea");

form.addEventListener("awesome", (e) => console.log(e.detail.text())
);

textarea.addEventListener("input", function () {
  // Create and dispatch/trigger an event on the fly
  this.dispatchEvent(
    new CustomEvent("awesome", {
      bubbles: true,
      detail: { text: () => textarea.value },
    }),
  );
});
```

## Event Bubbling and Propagation

<baseline-status featureId="bubbles"><baseline-status>

<baseline-status featureId="dispatch-event"><baseline-status>

In the last example we also saw how events bubble up the parent chain and how you can fire custom events to propagate up the parent chain.

```html
<div id="parent">
  <button id="child">Click me</button>
</div>
```

In the script we do the following:

1. Capture references to the elements we'll use later
2. Create a custom event using the [CustomEvent Constructor](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
   1. The `bubbles` property indicates whether the custom event bubbles up the parent chain or not
   2. The `composed` property shows if the event will propagate outside a custom element's shadow root
   3. The `cancelable` property shows if the event can be cancelled or not
   4. The [detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail) property contains any data that we want to pass along with the event
3. The `childElement` element will dispatch the `customEvent` up the chain
4. We attach an event listener to the `parentElement` to listent to the custom event and perform its defined task (log the details text to the console).

```js
// 1
const parentElement = document.getElementById('parent');
const childElement = document.getElementById('child');

// 2
const myEvent = new CustomEvent('myCustomEvent', {
  bubbles: true,
  composed: true,
  cancelable: true,
  detail: {
    message: 'Hello from the child!'
  }
});

// 3
childElement.addEventListener('click', () => {
  childElement.dispatchEvent(myEvent);
});

// 4
parentElement.addEventListener('myCustomEvent', (event) => {
  console.log('Event received in parent:', event.detail.message);
});
```

## Links and Resources

* [Introduction to events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
* [Event: Event() constructor](https://developer.mozilla.org/en-US/docs/Web/API/Event/Event)
* [Event bubbling](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Event_bubbling)
* [Creating and triggering events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events)
* [CustomEvent: CustomEvent() constructor](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent)
* [CustomEvent: detail property](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
