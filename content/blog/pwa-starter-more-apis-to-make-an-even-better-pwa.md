---
title: "PWA Starter: More APIs to make an even better PWA"
date: "2017-11-15"
---

Before we jump into the PWA checklist we'll talk about APIs we can use in PWAs to enhance performance beyond the basic functionality of PWAs we've discussed so far.

## Background Sync

The background sync API provides tools to create one-of and periodic data synchronization after the content was initially fetched for the application. It accomplishes these tasks by adding events for the service worker and additional functions for the service worker.

In the code below we register a service worker and, when we're ready, we register a sync event; The name we register here is important; we'll use it as the name of the event when we actually do the sync.

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// Register a one-off sync event
navigator.serviceWorker.ready.then(function(swRegistration) {
  return swRegistration.sync.register('image-fetch');
});
```

When we do the actual sync event we use the name of the tag we registered at sync registration time. In this case, we wait until the function executes. This function is a wrapper for fetching the image. If we're working with more complex content the function can build more elaborated content.

```javascript
self.addEventListener('sync', function (event) {
  if (event.tag === 'image-fetch') {
    event.waitUntil(fetchDogImage());
  }
});

function fetchDogImage () {
  fetch('./doge.png')
    .then(function (response) {
      return response;
    })
    .then(function (text) {
      console.log('Request successful', text);
    })
    .catch(function (error) {
      console.log('Request failed', error);
    });
}
```

### Links and Resources: Backkground Sync

- [Background Sync Explainer](https://github.com/WICG/BackgroundSync/blob/master/explainer.md)
- [Background Sync (Ponyfoo)](https://ponyfoo.com/articles/backgroundsync)
- [Background Sync (Google Developers)](https://developers.google.com/web/updates/2015/12/background-sync)

## Push Notifications

Push notifications allow the server hosting your application to push information to be displayed even when the tab with your application is in the background or the entire browser is closed.

This is a complex topic and requires several moving pieces. Rather than try and condense the topic here I'll refer you to Matt Gaunt [Web Push Book](https://web-push-book.gauntface.com/), a thorough discussion of Web Push and Push Notifications.

### Links and Resources: Push notifications

- [Web Push Notifications: Timely, Relevant, and Precise](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/) = [Web Push Book](https://web-push-book.gauntface.com/)
- Matt Gaunt's Notification Presentation at SFHTML5
    
    - Presentation: [https://gauntface.github.io/presentations/2017/sfhtml5/#](https://gauntface.github.io/presentations/2017/sfhtml5/#)
    - Video: [https://www.youtube.com/watch?v=lteJlP3Xbt4](https://www.youtube.com/watch?v=lteJlP3Xbt4)

## Credential Management API

The Credential Management API lets websites interact with a user agent’s password system so that websites can deal in a uniform way with site credentials and user agents can provide better assistance with the management of their credentials. For example, user agents have a particularly hard time dealing with federated identity providers or esoteric sign-in mechanisms that use more than just a username and password. To address these problems, the Credential Management API provides ways for a website to store and retrieve different types of password credentials. This gives users capabilities such as seeing the federated account they used to sign on to a site, or resuming a session without the explicit sign-in flow of an expired session.

There is a [working example](https://codelabs.developers.google.com/codelabs/credential-management-api/#0) as part of Google Codelabs

### Links and Resources: Credential Management

- [Credential Management API (Google)](https://developers.google.com/web/updates/2016/04/credential-management-api)
- [Credential Management API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Credential_Management_API)
- [Enabling auto sign-in with the Credential Management API Codelab](https://codelabs.developers.google.com/codelabs/credential-management-api/#0)
- https://developers.google.com/web/fundamentals/security/credential-management/

## Payment Request API

Many problems related to online purchase abandonment can be traced to checkout forms, which are user-intensive, difficult to use, slow to load and refresh, and require multiple steps to complete. The Payment Request API is a system that is meant to eliminate checkout forms. It vastly improves user workflow during the purchase process, providing a more consistent user experience and enabling web merchants to easily leverage disparate payment methods.

### Links and Resources: Payment Request API

- [Payment Request API (Google)](https://developers.google.com/web/fundamentals/discovery-and-monetization/payment-request/)
- [Payment Request API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API)

## Offline Analytics

When working with offline analytics we need to make sure that whatever events happen offline are captured to replay later when the user has regained connectivity. Both Google Offline Analytics libraries discussed below work the same way: They set up a new fetch event handler in your service worker, which response to requests made only to the Google Analytics domain.

The analytics fetch event uses a network fetch strategy to send analytics events to Google Analytics servers. If the user is online this network request will succeed and the analytics servers will store the data; everything is fine.

If the network request fails, the library will store information about the request to IndexedDB, along with a timestamp indicating when the request was initially made. Each time your service worker starts up, the library will check for queued requests and attempt to resend them, along with some additional Google Analytics parameters:

- A qt parameter, set to the amount of time that has passed since the request was initially attempted, to ensure that the original time is properly attributed
- Any additional parameters and values supplied in the parameterOverrides property of the configuration object passed to goog.offlineGoogleAnalytics.initialize(). For example, you could include a custom dimension to distinguish requests that were resent from the service worker from those that were sent immediately.

If the service worker succeeds, then the request is uploaded to the analytics servers and removed from IndexedDB.

If the retry fails, and the initial request was made less than 24 hours ago, it will be kept in IndexedDB to be retried the next time the service worker starts. Note that Google Analytics hits older than four hours are not guaranteed to be processed, but resending these older hits "just in case" shouldn't hurt.

### Standalone Offline Analytics

There is a standalone library for offline analytics and you're writing your service worker by hand. To use it import the plugin using npm

```
npm install --save-dev sw-offline-google-analytics
```

And then use the following code in your service worker, before any fetch event:

```javascript
// Import the library into the service worker global scope:
importScripts('path/to/offline-google-analytics-import.js');

// Then, call goog.offlineGoogleAnalytics.initialize():
goog.offlineGoogleAnalytics.initialize();

// At this point, implement any other service worker caching strategies
// appropriate for your web app.
```

### Workbox Offline Analytics

If you're using workbox.js you can use the [following code](https://workboxjs.org/reference-docs/latest/module-workbox-google-analytics.html):

```javascript
// This code should be placed before 'fetch' event handlers are defined.
// Import the library into the service worker global scope:
importScripts('path/to/offline-google-analytics-import.js');

// Then, call workbox.googleAnalytics.initialize():
workbox.googleAnalytics.initialize();
```

### Links and Resources: Offline Analytics

- [Offline Google Analytics](https://developers.google.com/web/updates/2016/07/offline-google-analytics)
- [Workbox Analytics](https://workboxjs.org/reference-docs/latest/module-workbox-google-analytics.html)

## Online and offline events

The last API I wanted to discuss is online/offline. We need a way to communicate the online status to our users. Online/Offline events provide a solution to this communication need.

Browsers implement this property differently.

In Chrome and Safari, if the browser is not able to connect to a local area network (LAN) or a router, it is offline; all other conditions return true. So while you can assume that the browser is offline when it returns a false value, **you cannot assume that a true value necessarily means that the browser has a working internet connection**. You could be getting false positives, such as in cases where the computer is running a virtualization software that has virtual ethernet adapters that are always "connected."

In Firefox and Internet Explorer, switching the browser to offline mode sends a false value. Until Firefox 41, all other conditions return a true value; since Firefox 41, in OS X and Windows, the value will follow the actual network connectivity.

An example script, taken from MDN, looks like this:

```javascript
window.addEventListener('load', function() {
  var status = document.getElementById("status");
  var log = document.getElementById("log");

  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";

    status.className = condition;
    status.innerHTML = condition.toUpperCase();

    log.insertAdjacentHTML("beforeend", "Event: " + event.type + "; Status: " + condition);
  }

  window.addEventListener('online',  updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});
```

The full example is available in [Codepen](https://codepen.io/caraya/pen/YrpjjE)

### Links and Resources: Online/Offline Detection

- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine)
- [The initial definition in the HTML specification](https://html.spec.whatwg.org/multipage/offline.html#navigator.online)
- [navigator.onLine in Chrome Dev channel](https://developers.google.com/web/updates/2011/06/navigator-onLine-in-Chrome-Dev-channel)
