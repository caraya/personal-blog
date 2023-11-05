---
title: "Designing a service worker"
date: "2016-07-13"
---

Since I decided to do an app shell architecture for the project we'll have to split the way we cache content with service worker. We'll use both [sw-precache](https://github.com/GoogleChrome/sw-precache) to cache the app shell and [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox) to cache the other pages of the application and any associated resources.

Yes, we could build the service worker manually but updating becomes more and more complex. You have to remember to update the worker whenever you make a change and that makes it error prone.

I don't particularly like using third party libraries to build my code but in this case the advantages far surpass the potential problems that I may experience moving forward.

Jeff Posnick presented about App Shell architecture, sw-precache and sw-toolbox libraries and how to make them work together which I think is a good starting point for our work.

<iframe width="560" height="315" src="https://www.youtube.com/embed/jCKZDTtUA2A?rel=0" frameborder="0" allowfullscreen></iframe>

## Gulp based build system

We could use sw-precache and sw-toolbox from the command line but why go through the hassle when we're already using Gulp for other optimization tasks on the project?

The code for this project uses a Gulp-based build system to programmatically build the service worker. At a later time we may explore what it takes to write the same code manually. It shouldn't be that different.

## sw-precache and the application shell

To cache the shell of the application we'll use sw-precache. This will also generate cache busting and the logic we need to get a fully functioning service worker for our reader.

Right now the task used to generate the service worker is a greedy blog that takes everything in. We definitely want to shrink the amount of files the blog consumes to only the basic elements we need for fast first render.

We also import two scripts into the service worker we are creating.

`sw-toolbox.js` is the main file for sw-toolbox, which will make our life much easier when it comes to caching dynamic content.

The second file, `toolbox-script.js` will be discussed in more detail in the next section.

```javascript
/*jshint esversion: 6*/
/*jshint -W097*/
'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins({lazy: true})';

// Imports required for sw-precache
import path from 'path';
import swPrecache from 'sw-precache';

// Aliases $ to the gulp-load-plugins entry point
// so that $.function will work
const $ = gulpLoadPlugins();

const paths = {
  src: 'app/',
  dest: 'dest/'
};

gulp.task('generate-service-worker', (callback) => {
  swPrecache.write(path.join(paths.src, 'service-worker.js'), {
    staticFileGlobs: [
      paths.src + '/**/*.{js,html,css,png,jpg,gif}'
    ],
    importScripts: [
      paths.src + '/js/sw-toolbox.js',
      paths.src + '/js/toolbox-scripts.js'
    ],
    stripPrefix: paths.src
  }, callback);
});
```

`toolbox-scripts.js` is our implementation of dynamic caching using sw-toolbox. The content the shell of our application, is not supposed to change often and, when it does, it's just a matter of adding new files to the Gulp task and running the task again to pick up the changes.

Active content, on the other hand, needs different handling. It is impossible for me to predict how often content will change or how many new files we will add to the reader at a given time. So instead of manually typing the names of the files we want to cache, we use sw-toolbox to help us with the task.

We've defined 6 routes:

* The first one matches anything from any origins containing **googleapis** and ending with **.com**. The route uses the cacheFirst strategy (check the cache first and only go to the network if the item is not found on the cache) and will store up to 20 items in a cache called **googleapis**
* The second route will match anyting in the `/images/` path and using the cacheFirst strategy will store its items in the **images-cache** cache without limit
* The third route will match anything in the `/pages/` path and using the networkFirst strategy store the content in the **content-cache** cache. We use network first because we want to get the freshest content possible and only if the network is not available go to cache
* The fourth route will match anything in the `/videos/` path and will use a networkOnly strategy. If we're not online we don't want to store potentially very large files on the cache
* The fifth route will match anything coming from youtube.com or vimeo.com and only do something with it if the network is active. Same rationale as before. We don't want to store potential hundreds of megabytes of vide on our caches
* The last route is the default. For anything that doesn't matches the previous routes use a cacheFirst strategy.

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

  // We want no more than 50 images in the cache. We check using a cache first strategy
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
  global.toolbox.router.get('/video/(.+)', global.toolbox.networkOnly);
  // If the video comes from youtube or vimeo still use networkOnly
  global.toolbox.router.get('(.+)', global.toolbox.networkOnly, {
    origin: /\.(?:youtube|vimeo)\.com$/
  });

  // the default route is global and uses cacheFirst
  global.toolbox.router.get('/*', global.toolbox.cacheFirst);
})(self);
```

## What's next

There is still a little bit more research to do before declaring this code production ready.

* How do we add a fallback to the video routes so that, when we are offline, we display a placeholder SVG image?
* How do we create a timeout for a request, similar to what we can do with `promise.race`?
* can we mix toolbox and non-toolbox in the same service worker?
