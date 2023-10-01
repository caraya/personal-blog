---
title: "The Wakelock API: worth it?"
date: "2023-02-20"
---

The Wakelock API presents a way to prevent devices from dimming or locking the screen when an application needs to keep running.

For example:

Applications like [Art Space Tokyo](https://read.artspacetokyo.com/) would benefit from the browser not going to sleep while using maps to reach the different art spaces and museums discussed in the book.

Recipe applications would benefit from the screen not going to sleep while you work on the recipe with dirty hands.

## Looking at the code

We first create a variable to hold the status of the wakeLock request. we default it to `null` since the request hasn't been made yet.

We use a function expression as the outermost container for our code.

Inside the function expression, we use an async arrow function where we use a try/catch block:

- The try block awaits for the navigator lock and adds an event listener to trigger the release before logging the success to console
- The catch block reports the error to the console

```js
let wakeLock = null;

const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request();
    wakeLock.addEventListener('release', () => {
      console.log('Screen Wake Lock released:', wakeLock.released);
    });
    console.log('Screen Wake Lock released:', wakeLock.released);
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};
```

We also want to handle to special events. When the page or tab becomes visible or invisible and when the browser goes into full-screen mode.

In `handleVisibilityChange` we create an async function that will check if `wakeLock` is not null (we requested and were given a wakeLock) and that the document is visible (we haven't tabbed away from the page or app). If both conditions are met then we call `requestWakeLock`.

We also add event listeners for [visibilitychange](https://developer.mozilla.org/en-US/docs/Web/API/Document/visibilitychange_event) and [fullscreenchange](https://developer.mozilla.org/en-US/docs/Web/API/Document/fullscreenchange_event) to call the `handleVisibilityChange` callback function. This would make sure that the application would not go to sleep when the page is visible, whether it's in full screen mode or not.

```js
const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

document. 
  addEventListener(
    'visibilitychange', 
    handleVisibilityChange
  );

document.
  addEventListener(
    'fullscreenchange',
    handleVisibilityChange
  );
```

In a real-world application, there is more wiring to do. We must give users a way to toggle the wake lock request. Perhaps using a checkbox in a settings panel would do the work... you then have to wire the checkbox to trigger the wakelock request when the checkbox is selected and to release the wake lock when it is not.

For a full working demo, see this [demo Glitch](https://wake-lock-demo.glitch.me/) and the [source code](https://glitch.com/edit/#!/wake-lock-demo?path=script.js:1:0), a part of [Stay awake with the Screen Wake Lock API](https://web.dev/wake-lock/)

To answer the question in the title of this post; Yes, I think the Wakelock API is worth it for a limited kind of application that prevents the system from going to sleep. There are not many applications on that list, but I still think it's worth checking out. You may come up with an example I didn't think about
