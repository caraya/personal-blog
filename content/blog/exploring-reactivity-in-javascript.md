---
title: Using Proxies for Reactivity in Javascript
date: 2024-06-30
draft: true
---

Reactivity seems to be an important concept to learn as you work in front-end development.

The idea is that your app's UI will reflect changes as soon as they happen without requiring a full page reload.

In this post, we'll look at What is reactivity, how it works using three different approaches, and an example of using reactivity in front-end projects

## What is reactivity

In the context of front-end development, reactivity programming deals with data streams and the propagation of change.

In reactive programming, data is modeled as a sequence of events, and the application reacts to these events by updating its state.

### Understanding Typescript proxies

### Understanding observables

### Understanding the pub/sub pattern

## Links and Resources

* [Proxy Global Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
* [How vanilla JS Proxies work](https://gomakethings.com/how-vanilla-js-proxies-work/)
* [Reactive Data With Modern JavaScript](https://infrequently.org/2021/03/reactive-data-modern-js/)
* [The Magic Behind Reactivity &ndash; Proxies](https://ryangjchandler.co.uk/posts/the-magic-behind-reactivity-proxies)
* [Build Your Own Reactive System like Vue.js](https://javascript.plainenglish.io/build-your-own-reactive-system-like-vue-js-33d02ce38bd2)
* [Looking at All 13 JavaScript Proxy Traps](https://www.digitalocean.com/community/tutorials/js-proxy-traps)
* [Build Reactive UI with Plain Javascript](https://varaprasadh.medium.com/build-reactive-ui-with-plain-javascript-180085998756)
* [Observer and PubSub Pattern](https://djaytechdiary.com/observer-and-pubsub-design-pattern)
* [How to Build Your Own Reactivity System](https://hackernoon.com/how-to-build-your-own-reactivity-system-fc48863a1b7c)
* [Reactive UI’s with VanillaJS – Part 1: Pure Functional Style](https://css-tricks.com/reactive-uis-vanillajs-part-1-pure-functional-style/)
* [Reactive Programming in Vanilla Javascript](https://tkssharma.com/programming-reactive-programming-frp/)
* [Building stateful web apps without React](https://blog.logrocket.com/building-stateful-web-apps-without-react/)
* [Simplifying Front-End State Management with Observable Store](https://blog.codewithdan.com/simplifying-front-end-state-management-with-observable-store/)
* [A high way to Observables](https://www.evangelia.me/a-high-way-to-observables/)
* Tools and libraries
  * [van.js](https://vanjs.org/)
  * [Causality](https://github.com/erobwen/causality#readme)
  * [Rx.js](https://rxjs.dev)
  * [Kefir.js](https://kefirjs.github.io/kefir/)

<!--
<https://gomakethings.com/how-to-create-a-state-based-ui-component-with-vanilla-js/>

<https://gomakethings.com/simple-reactive-data-stores-with-vanilla-javascript-and-proxies/>

<https://gomakethings.com/how-to-detect-changes-to-nested-arrays-and-objects-inside-a-proxy/>

<https://www.youtube.com/watch?v=nREQw5uKhkw>
-->

<!--
## Understanding how to add reactivity with Vanilla Javascript

```js
function store (data = {}, name = 'store') {

  /**
   * Emit a custom event
   * @param  {String} type   The event type
   * @param  {*}      detail Any details to pass along with the event
   */
  function emit (type, detail) {

    // Create a new event
    let event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail
    });

    // Dispatch the event
    return document.dispatchEvent(event);

  }

  function handler (name, data) {
    return {
      get: function (obj, prop) {
        if (prop === '_isProxy') return true;
        if (['object', 'array'].includes(Object.prototype.toString.call(obj[prop]).slice(8, -1).toLowerCase()) && !obj[prop]._isProxy) {
          obj[prop] = new Proxy(obj[prop], handler(name, data));
        }
        return obj[prop];
      },
      set: function (obj, prop, value) {
        if (obj[prop] === value) return true;
        obj[prop] = value;
        emit(name, data);
        return true;
      },
      deleteProperty: function (obj, prop) {
        delete obj[prop];
        emit(name, data);
        return true;
      }
    };
  }

  return new Proxy(data, handler(name, data));

}

// The element to inject our UI into
let app = document.querySelector('#app');

// Create reactive data store
let wizards = store(['Gandalf', 'Merlin'], 'wizards');

// The template
function template (props) {
  return `
    <ul>
      ${props.map(function (wizard) {
        return `<li>${wizard}</li>`;
      }).join('')}
    </ul>`;
}

// Render the UI
app.innerHTML = template(wizards);

// Reactively update the UI
document.addEventListener('wizards', function (event) {
  app.innerHTML = template(event.detail);
});

// This will automatically update the UI
setTimeout(function () {
  wizards.push('Ursula');
}, 3000);
```
-->

