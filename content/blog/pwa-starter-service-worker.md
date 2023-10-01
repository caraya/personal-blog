---
title: "PWA Starter: Service Worker"
date: "2017-11-06"
---

# Service Worker

Note that this section will make heavy use of arrow functions, let and const, and other ES2015 and newer features.

I've chosen to do this because I treat PWAs as progressive enhancements for evergreen browsers. Older browsers will not support PWAs and their features so it's pointless to try and support them.

The service worker has to main components: the registration and the service worker itself. We place the registration in the index.html file (or whatever we've named our site's entry point) and it'll tell the browser whether the browser supports service workers, where to find it and what to do when it registers and when it fails.

I normally inline this code in my `index.html`. I'm not 100% sure if this will work in a concatenated and minified file; it should but I haven't tried it yet.

```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
```

If the registration is successful we now have a service worker installed for our site/app.

`sw.js` is the actual service worker script. Since the API is e vent based I've broken down the code by events. At the top of the script we do some housekeeping before getting started. We setup to caches (one for precached resources and one for resources we cache during the application's run).

Next we declare a list of resources to cache. In this list include the minimum necessaary for content to render when off line or in low connectivity but not too much so that it'll slow down the initial rendering of your content.

We will use the cache names troughout the service worker to reduce the amoount of typing we have to do. This example is simplified, for a production application you'd have to indicates additional style sheets and scripts to precache on the `PRECACHE_URLS` array.

```javascript
const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime-v1';

const PRECACHE_URLS = [
  './', // Alias for index.html
  'styles/main.css',
  'scripts/main.js'
];
```

The first event, `install`, sets up the caches and the list of URLs to cache when the user first access the Service Worker controlled site. This is the place where you update the names of your caches to trigger the automatic update process. We'll discuss this in more detail later.

In this event we precache the resources we defined in the `PRECACHE_URLS` constant. We then make the Service Worker take over the page and site immediately and not use the default behavior of waiting until the browser reloads the content.

```javascript
// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});
```

The activate handler is the maintenance and cleanup handler. Whenever we update the name of the cache constants at the top of the script, the activation process will delete those caches that are no longer need because the material has been updated.

The idea is that everytime we run through the `activate` event we check against our caches defined earlier in the service worker. If the existing cache names don't match the current names, the we delete the old caches.

Finally we tell the service wworker to take immediate control of the pages undeer it's scope. The normal behavior is to wait until all the pages visiting the site have either reloaded or closed before the service worker takes over.

```javascript
// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys()
    .then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    })
    .then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    })
    .then(() => self.clients.claim())
  );
});
```

The fetch event is the heart of the Service Worker. This is where we fetch resources for the application and interact with the user. In essence the fetch event does the following:

- If the request comes from a different domain skip it
- If the item is in the cache, then return it
- If the item is not in the cache, fetch it from the network and:
    
    - Store a copy of the object in the cache
    - Return the item to the use

It's important to note that response is a readbale stream that we can consume only once but, because we want to both store in the cache and return the content of the response to the user, we must clone the response (using `response.clone()`) and then return the original request to the user.

```javascript
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request)
          .then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone())
            .then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
```

The events above represent a basic service worker to cache the shell of an application on first load and then cache resources as the user access them
