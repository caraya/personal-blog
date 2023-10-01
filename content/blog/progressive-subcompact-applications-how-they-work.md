---
title: "Progressive Subcompact Applications: How they work"
date: "2016-11-23"
---

## How does this all work?

At the core of our progressive subcompact publications is a service worker. This woker is a type of shared worker and it also works as a network proxy for your requests, you can cache responses, provide new responses based on the request you make, provide the basic mechanism to do push notifications and content synchronization in the background.

We’ll break down the service worker in two sections: the script and the installation script you add to your entry point (usually `index.html`)

### Service worker: The script

This is a fairly common pattern to build a service worker that will perform the following tasks:

- Caches the content of our application shell
- Automatically cleans up old cached content when the service worker is updated
- Fetches app resources using a ‘cache first strategy’. If the content requested is in the cache then serve it from there. If it’s not on the cache then make a network request for the resource, serve it to the user and put it in the cache for later requests

```javascript
var CACHE_NAME = 'my-site-cache-v1';
var cacheWhitelist = [CACHE_NAME];
var urlsToCache = [
    '/',
    '/styles/main.css',
    '/script/main.js',
    'images/banner.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
          })
        );
      })
    );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
  caches.match(event.request)
  .then(function(response) {
    if (response) {
      return response;
    }

    return fetch(event.request)
      .then(function(response) {
        // Check if we received a valid response
        if (!(response)) {
          throw Error('unable to retrieve file');
        }

      var responseToCache = response.clone();
      caches.open(CACHE_NAME)
        .then(function (cache) {
            cache.put(event.request, responseToCache);
          });
        return response;
      })

      .catch(function(error) {
        console.log('[Service Worker] unable to complete the request: ', error);
      });
    })
  );
});
```

There are things that we are not covering on purpose for the sake of keeping the code short. Some of these things include:

- For this example we’ve assumed a minimal set of elements to cache for the application shell. We can be more detailed and add fonts and other static resources. We may also assign the array of items to cache on install to a variable to make it easier to work with
- Providing a solution for when the content is not in the cache and the network is not available. We can cache default feedback for text-based content or programmatically generate an svg image for fallback
- Putting content in different caches so deleting one group of resources doesn’t delete all of them
- We make no effort to add hashes to the resources we cache so we can do proper HTTP cache busting when needed

But at 60 lines of Javascript that will work in 3 of the 5 major browsers (and soon in all of them) I think it does a pretty good job.

### Service worker: The registration

Assuming that we saved the service worker as `sw.js` we can write the code below inside a script tag on our entry page (`index.html`).

```javascript
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function(reg) {
    console.log('Yay!', reg);
  }).catch(function(err) {
    console.log('boo!', err);
  });
}
```

This script checks for service worker support by testing if the string `serviceWorker` exists in the navigator object. If it does then service workers are supported, we log a message to the console and then register the serviceworker.

If the serviceWorker string doesn’t exist in the navigator object then service workers are not supported. The catch statement will trigger and we log something to the console.

That’s it. The combination of those two scripts gives us consistent performance across devices and the possibility of work offline after accessing the content once while online.

## Service Worker: Next step

Doing it by hand is fun and teaches you a lot about the inner workings of service workers but having to update the files you want to cache and how to define the routes you want to use to cache your content.

[sw-precache](https://github.com/GoogleChrome/sw-precache/blob/master/GettingStarted.md) is a Google tool developed to atuomate creation of service workers with application shell caching on installation. The tool can be used from command line or as part of a build system (Grunt, Gulp and others).

It will also take care of importing additional scripts to use sw-toolbox (described in the next section).

A gulpfile.js using sw-precache looks like this:

```javascript
// Assigning modules to local constants
var gulp = require('gulp');
// Required for sw-precache
var path = require('path');
var swPrecache = require('sw-precache');
// Array of paths. Currently only uses the src to represent the path to source
var paths = {
    src: './'
};

gulp.task('service-worker', function(callback) {
  swPrecache.write(path.join(paths.src, 'service-worker.js'), {
  staticFileGlobs: [
    paths.src + 'index.html',
    paths.src + 'js/main.js',
    paths.src + 'css/main.css',
    paths.src + 'images/**/*'

    ],
    importScripts: [
      'node_modules/sw-toolbox/sw-toolbox.js',
      paths.src + 'js/toolbox-scripts.js'
    ],
    stripPrefix: paths.src
  }, callback);
});
```

[sw-toolbox](https://googlechrome.github.io/sw-toolbox/docs/master/tutorial-usage) automates dynamic caching for your service worker. It creates customizable routes for your caching and provides for express-like or regular-expression-based routes to match routes and resources.

In the gulpfile.js abov the `importScripts` section imports two files:

- sw-toolbox.js is the library that will run the custom routes
- toolbox-scripts contains our custom toolbox routing

The script itself is wrapped in an immediately-invoked function expression (IIFE) to keep our code from polluting the global namespace. Inside the IIFE we work with different routes.

All these routes use the get HTTP verb to represent the action the router will take.

The toolkbox then takes a pattern to match the route against and a cache strategy.

There is an optional cache object that contains additional parameters for the cache like (cache) name, maximum number of entries (maxEntries) and maximum duration of the cache in seconds.

The `toolbox-scripts.js` looks like this:

```javascript
(function(global) {
    'use strict';

    // The route for any requests from the googleapis origin
    global.toolbox.router.get('/(.*)', global.toolbox.cacheFirst, {
        cache: {
            name: 'googleapis',
            maxEntries: 20,
        },
        origin: /\.googleapis\.com$/
    });

// We want no more than 50 images in the cache. 
// We use a cache first strategy
    global.toolbox.router.get(/\.(?:png|gif|jpg)$/, global.toolbox.cacheFirst, {
      cache: {
        name: 'images-cache',
        maxEntries: 50
      }
    });

    // pull html content using network first
    global.addEventListner('fetch', function(event) {
      if (event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(toolbox.networkFirst(event.request));
      }

      // you can add additional synchronous checks based on event.request.
    });

    // pull video using network only. We don't want such large files in the cache
    global.toolbox.router.get('(.+)', global.toolbox.networkOnly, {
      origin: /\.(?:youtube|vimeo)\.com$/
    });

    // the default route is global and uses cacheFirst
    global.toolbox.router.get('/*', global.toolbox.cacheFirst);
})(self);
```

Registering the automatically generated service worker is no different than registering the manually generated script. Assuming that we saved the service worker as `service-worker.js`the registration code in our entry page (`index.html`) looks like this:

```javascript
if ('serviceWorker' in navigator) {
 console.log('Service Worker is supported');
 navigator.serviceWorker.register('sw.js').then(function(reg) {
   console.log('Yay!', reg);
 }).catch(function(err) {
   console.log('boo!', err);
 });
}
```
