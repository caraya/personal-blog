---
title: "Application Shells and Service Workers: sw-toolbox and Polymer"
date: "2016-05-18"
categories: 
  - "technology"
---

## Building a ServiceWorker using Google libraries

Google provides an abstraction layer over Service Workers called `sw-toolbox` that hides a lot of the complexities of a Service Worker without sacrificing functionality.

The example below uses `sw-toolbox` to create a serviceworker that precaches the application shell and treats everything else as a default with a `network-first&nbsp;` strategy.

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
      event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate',
      event => event.waitUntil(global.clients.claim()));
})(self);
```

## Building a ServiceWorker using Polymer Platinum Elements

> This is not an article about Polymer or the `platinum-sw` element. It is mentioned just for completeness sake.

Polymer provides elements to create Service Workers and cache sitting on top of sw-toolbox. The [partial example](https://elements.polymer-project.org/elements/platinum-sw?view=demo:demo/index.html&active=platinum-sw-cache) below, taken from the `platinum-sw` [distribution](https://elements.polymer-project.org/elements/platinum-sw) shows how to configure the Polymer Service Worker element .

We can also choose to incorporate the `platinum-sw` element inside other elements like we do for our Ajax calls.

```
    <template is="dom-bind" id="page-template">
      <platinum -sw-register skip-waiting
                            clients-claim
                            reload-on-install
                            state="{{state}}">
        </platinum><platinum -sw-cache default-cache-strategy="networkFirst"
                           precache="{{precacheList}}"></platinum>
```

The `precacheList` element can be created manually or automated as part of a build process.
