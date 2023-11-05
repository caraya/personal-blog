---
title: "Application Shells and Service Workers: Building Manually"
date: "2016-05-11"
categories:
  - "technology"
---

The first way to build a ServiceWorker is to manually write Javascript to accomplish the task. We’ll look at the basics of a service worker and different strategies to cache the content basd on our needs.

Before we get started there are some things to consider:

## This is an enhancement

Reliable network access is something we take for granted. We expect desktop and mobile bandwidth to remain available and constant and get really disappointed about the network and applications when the network fails.

But we’ve all been in sitautions where the network is not available at all or when the mobile 4G network drops to an Edge connection or worst.

> Frequently not having any data connection in even the wealthiest and most developed cities of the world has led us to conclude that no, the mobile connectivity/bandwidth issue isn’t just going to solve itself on a global level anywhere in the near future.
>
> [Say hello to offline first](http://hood.ie/blog/say-hello-to-offline-first.html)

When I first arrive to my coffee shop to do work for the day I usually get the dinosaur in Chrome and a no network message from my Operating System. Can you imagine what type of experience people have in countries where 3G is considered fast and 2G or slower is the norm?

Can you imagine how different things would be if we could provide alternatives to the dinosaur or loosing connectivity when your train goes into a tunnel? Offline is not an error but a situation that we can handle. As long as we are online at least once we, as developers, can choose what parts of an application will be available when the user is offline for whatever reason.

It won’t be perfect as we won’t be able to cache every aspect of an application. API calls are harder to change because the data will most likely be different but we can provide a snapshot of the data and then update the content when the user is online again. Old data is always better than no data.

Before you say connection speed doesn’t affect you do the following experiment.

1. In Chrome open your website and let it load as normal. This is what you normally expect it to be.
2. Open Devtools (command + option + i on a Mac, Ctrl + Shift+ I or F12 on Windows) and select the network tab.
3. Clicke on the network throttle pull down menu
4. Select Regular 2G and reload the page
5. Repeat with as many different throttle settings as you want to test with

What is the experience like? Now imagine that’s the normal connection speed for your users.

Enter Service Workers.

By providing a caching service for offline access we also improve the overall speed and performance for the site. Granted, it won’t be better from first access but will definitely improve after content is cached when the use first visits.

## HTTPS is required

Service Workers are powerful… too powerful to run in unprotected systems. Imagine if someone intercepts your ServiceWorker and changes it so it sends you to a malware site or starts a keylogger to steal your credit card information.

Most specifications coming out of standards organizations require HTTPS to run and browser vendors (Mozilla and Google for sure, others unknwon) are considering deprecating and, eventually, removing access to what they consider “powerful features” from sites served with regular HTTP.

Don’t freak out. Regular SSL certificates are expensive but there are cheaper and free alternatives.

My biggest issue with upgrading to SSL is that I have a ton of subdomains that would require a wildcard certificate which is expensive enough not to be an option right now.

If you’re looking to enable SSL in a single domain [letsencrypt](https://letsencrypt.org/) may be a good option. Just remember, you get what you pay for. The technology behind Letsencrypt entered public beta on December, 2015 and it may not be ready for primetime or supported by your hosting provider. The service finished its public beta in April, 2016. It’ll be interesting to see how much quicker people adopt it now that the beta flag has been removed

If letsencrypt is not an option you can google for SSL certificates and shop at your convenience.

Until you get your site in HTTPS you can use [Github Pages](https://pages.github.com/) to host your content. How to create content to host in GH-Pages is beyond the scope of this article. You can follow the tutorial on [how to manually push content to gh-pages](https://help.github.com/articles/creating-project-pages-manually/) or use a plugin for your favorite task runner or build system.

## ES6 Playground

The browsers that support Service Workers natively also support large subsets of ECMAScript 2015 so it’s OK if we use features like [Promises](http://www.html5rocks.com/en/tutorials/es6/promises/), [Arrow Functions](http://www.sitepoint.com/es6-arrow-functions-new-fat-concise-syntax-javascript/), [constants](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) and others.

Don’t fret. if you know ES5 (the current version of the language) learning the new features will not be as hard as you think. At least it hasn’t beem for me ;-)

## Service Workers Can’t Access the DOM

ServiceWorker doesn’t have DOM access. Because it’s a type of web worker it runs outside of the scope of any one page.

You can use `postMessage` to cause the ServiceWorker to communicate with the pages it controls. See this [article from MDN](https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage) and this [example from Chrome](https://googlechrome.github.io/samples/service-worker/post-message/) to get an idea of how this works.

## Let’s get started

Matt Gaunt describes the workflow of a ServiceWorker in the image below:

![Service Worker Lifecyle](//www.html5rocks.com/en/tutorials/service-worker/introductionsw-lifecycle.png)

Older versions of Chrome (M43) require the [serviceworker-cache-polyfill](https://github.com/coonsta/cache-polyfill) to cache content since that particular version of Chrome doesn’t support the API natively. Even newer versions of Chrome may not support the full cache specification so it may still be a good idea to use the script. If you use the cache polyfill use this at the top of your ServiceWorker script.

```sw
importScripts('js/serviceworker-cache-polyfill.js');
```

The ServiceWorker will automatically cache the scripts imported this way.

Since Chrome is a self-updating evergreen browser this is not normally a problem but it’s always a good to be aware of this.

### Setting up and registration

I will use two different caches in this demo. One whill host the content of our application shell and the other one will host the content. My shell will not change as much as the content that is hosted inside.

The first thing we do is import `serviceworker-cache-polyfill` to add functionality to the browsers’ cache implementation. Even in browsers that support cache the support may not be complete so the polyfill augments the native functionality.

To accomplish this goal we set up two constant for each cache: a name and a version. This way whenever we need to update the content I can increate the value of the version and that will automatically trigger the ServiceWorker update process.

We also setup a constant for the contents of our shell. These are all the files (CSS, Javascript and images)

```js
'use strict';
 // Chrome's currently missing some useful cache methods, this polyfill adds them.
 importScripts('js/lib/serviceworker-cache-polyfill.js');

 // Define constants for cache names and versions
 const SHELL_CACHE = 'shell_cache';
 const SHELL_VERSION = 1;
 const CONTENT_CACHE = 'content_cache';
 const CONTENT_VERSION = 1;

// Content to  cache when the ServiceWorker is installed
// Change to match the files you need for your app shell. Please do not add
// anything outside of your shell to this object
 const SHELL_CONTENT = [
   '/path/to/javascript.js',
   '/path/to/stylesheet.css',
   '/path/to/someimage.png',
   '/path/to/someotherimage.png',
   '/',
   '/offline.html'
 ];
```

We then register our service worker and, optionally, we tell it the scope we want it to manage. By default it’ll take over the root of the application at its root.

The command is simple. We test if the browser supports service worker by testing if the navigator object has a serviceWorker property (`if (serviceWorker in navigator`.) If ServiceWorkers are supported we then register our ServiceWoeker by passin the name of the worker to the registration method (`navigator.serviceWorker.register('sw.js')`); we then log success to the console.

If registration fails, either because registration itself failed or the feature is not supported we also log it to the console. It may be a good idea to also show something to the user so they know that the ServiceWorker was not installed.

```js
  // 1. Register Service Worker
  // If the user agent has a serviceWorker property in navigator then we
  // install the service worker. If it's not supported then we fail silently.
  // We may want to do something else like pop up an alert or something like
  // that to make sure the user knows whether it succeeded or not
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
    // It worked, SW registered
    console.log('ServiceWorker successfully registered');
  } else {
    // something happened, SW didn't register
    console.log('ServiceWorker Barfed, did not register: ' + error);
  }
```

### Installing the Service Worker

Now that the service worker is registered we need to install it and start using it.

We first define a lit of the files we’ll cache as part of our application shell. These may include the index.html page any associate assets and any other resources that will help the shell load as quickly as possible.

```js
  // 2. Install the Service Worker and cache the shell content. This is only
  // the shell content, not the content inside.
  self.addEventListener('install',  (event) => {
    event.waitUntil(
      caches.open(SHELL_CACHE + ' - v' + SHELL_VERSION)
        .then( (cache) => {
          return cache.addAll(SHELL_CONTENT);
      })
        .then(() => {
            return self.skipWaiting();
        })
      );
  });
```

The install event will begin the process of getting the ServiceWorker ready. The first step is to install the worker.

First step is to open the shell cache (by concatenating the name and version of the cache) and add all the files listed in our `SHELL_CONTENT` constant.

Using promises we then run skipWaiting as `return self.skipWaiting()` to make sure the new ServiceWorker becomes active right away. It’s important to use return with skipWaiting() to make sure that iw till execute at the end of the then statement.

Together with `Clients.claim()` skipWaiting() allows a worker to take effect immediately in the client(s).

### Activate

We next activate the ServiceWorker and automatically claim all the clients associated with it to make sure that the changes to the worker propagate to the clients associated with them.

```js
 // 3. Activate event
self.addEventListener('activate', function(event) {
  // TODO: Write cache cleaning logic
  return self.clients.claim();
});
```

### Fetch

Fetching content is the most important part of the ServiceWorker. It’s in this event handler that we decide what to do with different aspects of a request.

I’ve broken the fetch event into three types of requests.

If the request is not a GET request (meaning it’s a PUT, DELETE, HEAD or PROPFIND request) we go to the network to get the data and, if we can’t do that, we provide the offline notification page.

```js
  // 4. Fetch resources
  self.addEventListener('fetch', function (event) {
    let request = event.request;

    if (request.method !== 'GET') {
      event.respondWith(fetch(request)
        .catch(function () {
          // if the fetch request fails return the offline page
          return caches.match('/offline.html');
        })
      );
      return;
    } // Ends Response 1
```

Response 2: Generic Response, fetch content from the network and put it in the cache, then return it.

```js
    event.respondWith(
      caches.match(request).then(() => {
        return fetch(request)
          .then((response) => {
            return caches.open(CONTENT_CACHE + '-v' + CONTENT_VERSION)
              .then((cache) => {
                cache.put(event.request, response.clone());
                return response;
              });
          })
      })
    ); // closes response 2
```

Response 3: Return response from cache or fetch from network using a cache first strategy if not in cache. If they both fail provide an SVG fallback placeholder, using offlineResponse defined below.

```js
    event.respondWith(
      caches.match(request)
        .then((response) => {
          return response || fetch(request)
              .catch(() => {
                if (request.headers.get('Accept').indexOf('image') !== -1) {
                  event.respondsWith(offlineResponse(event));
                }

                // TODO: Add additional content cases we want to highlight: video?
             });
        })
    ); // Ends response 3
```

The image is fully contained in our `offlineResponse` function. We use a function to make it easier to reuse the same response for other content. The image include the full XML code for

```js
    function offlineResponse(event) {
      return new Response('<svg width="400" height="300"' +
        ' role="img" aria-labelledby="offline-title"' +
        '  viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
        '<title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd">' +
        '<path fill="#D8D8D8" d="M0 0h400v300H0z"></path><text fill="#9B9B9B"' +
        ' font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72"' +
        ' font-weight="bold">' +
        '<tspan x="93" y="172">offline</tspan></text></g></svg>', {
        headers: {
          'Content-Type': 'image/svg+xml'
        }
      });
    }
```

In this small JavaScript file we’ve been able to do the following:

* Register and install a ServiceWorker
* Load a set of resources on ServiceWorker install
* Load content from the network and cache it to ServiceWorker Cache
* Check if an image is in the cache and if it isn’t then fetch it from the network
* If an image is not in the cache and cannot be pulled from the network then display a placeholder SVG image

It’s not complete. Some of the things I’d like to add:

* Write cache cleaning logic to delete old caches or caches that are not in use
* Figure out which response is triggered if multiple respondWith match. Do all responses that match activate?
* Add additional content cases we want to special case
  * Videos are potentially too large to cache so we may want to do a network only strategy where we ping the network and provide the offline fallback if not available
