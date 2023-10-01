---
title: "abstractions versus underlying structures"
date: "2016-05-25"
categories: 
  - "technology"
---

Maximiliano Firtman wrote [Service Workers replacing AppCache: a sledgehammer to crack a nut](https://medium.com/@firt/service-workers-replacing-appcache-a-sledgehammer-to-crack-a-nut-5db6f473cc9b#.l9dpx76am) where he makes a case for Service Workers not being ready to replace AppCache, regardless of how broken it is.

I happen to disagree with it for the same reasons Jake Archibald listed in [Application Cache is a Douchebag](http://alistapart.com/article/application-cache-is-a-douchebag) and for reasons having to do with the extensible web.

I tried to create an Application Cache for making some of my content offline. I’ll kindly say I failed because App Cache did not deliver on what it promised. What good is it to have an offline experience that doesn’t work consistently or at all?

The second, and most worrisome, point is the question Maximiliano was asked:

> My second alarm sign appeared a couple of weeks ago during a training in San Francisco. One of my students, after creating our first Service Worker with the basic AppCache code, he asked me: **“Ok, now tell me where is the jQuery of Service Workers?”**

Don’t get me wrong, I’ve grown to like jQuery and I’ve used it to add functionality like on my projects. But we shouldn’t be teaching the abstraction before we teach the basics.

Yes, as you’ve seen before creating Service Workers is tedious but the code is highly reusable. Yes, **you will find that most of the samples out there on the Web are the same code!** but in my opinion as long as you understand what the code is doing is ok to have multiple copies of the same code.

When jQuery first came out there was a group of developers and users who thought jQuery was the perfect solution and never bothered to move from there. For some of them it might be enough but for others it isn’t and, worst of all, it hurts when people try to learn what’s underneath the abstraction.

This is a minimum viable replacement for App Cache using Service Workers (taken from [HTML5 Rocks](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)):

```
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
  '/styles/main.css',
  '/script/main.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

And this is a barebones `sw-toolbox` based implementation of the same script (adapted from the sw-toolbox demo) with, as Maximiliano puts it, jQuery for Service Workers.

```
(global => {
  'use strict';

  // Load the sw-toolbox library.
  importScripts('bower_components/sw-toolbox/sw-toolbox.js');

  // List of files to precache. This should be automated.
  const FILES_TO_PRECACHE = [
    'index.html',
    'js/app.js',
    'css/main.css',
    'images/logo.svg',
    'offline.html'
  ];

  // Turn on debug logging, visible in the Developer Tools' console.
  global.toolbox.options.debug = true;

  // precache the files in FILES_TO_PRECACHE
  global.toolbox.precache(FILES_TO_PRECACHE);

  // By default, all requests will use the toolbox.networkFirst cache
  // strategy, and their responses will be stored in the default cache.
  global.toolbox.router.default = global.toolbox.networkFirst;

  // Boilerplate to ensure our service worker takes control of the page 
  // as soon as possible.
  global.addEventListener('install',
    (event) => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate',
    (event) => event.waitUntil(global.clients.claim()));
})(self);
```

Just like with jQuery I am not against using the abstraction but I’m very leery of people who only learn the abstraction without learning or understanding the underlying code .

Sure, the abstraction looks nice but how different is it really from the raw Service Worker? Sure, the actual process of learning how Service Workers and the Cache API work is more tedious and error prone but it helps with whatever is coming next.

sw-toolbox will not necessarily help when people move from basic caching to push notifications and background sync so we do need to learn how the basics work before we need to move to more advanced features.

If we don’t need the bells and whistles then sw-toolbox is the better solution. If we want to move to more advanced features it’s on our best interest to learn the basics so we don’t struggle with the more complex concepts later.
