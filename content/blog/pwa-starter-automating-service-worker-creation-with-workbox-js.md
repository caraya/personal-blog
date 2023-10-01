---
title: "PWA Starter: Automating Service Worker Creation with Workbox.js"
date: "2017-11-13"
---

SW-precache and SW-toolbox made creating Service Workers with dynamic caching much easier but there were two separate libraries and SW-precache required a separate file with all the SW-toolbox libraries routes in it. This made it very error prone to edit and update.

[Workbox.js](https://workboxjs.org/) is the evolution of Google's Service Worker Libraries. It consolidates all Service Worker build steps into one task (Gulp, Webpack and NPM Script versions available) and abstracts a lot of the writing and configuration behind the scenes so developers don't need to see the process, only the result.

If you want to create specialized routes manually, Workbox will help you there too.

Workbox is a Node package so I always install it as a development dependency with the command below

```
npm install workbox-build --save-dev
```

At the top of the `gulpfile.js` file place the following constant declaration to bring workbox-build into scope of the file.

```javascript
const wbBuild = require('workbox-build');
```

Copy the task below to your gulpfile. Note that this task uses ES6 arrow functions and promises so it'll work on newer versions of Node (5.x and newer).

```javascript
gulp.task('bundle-sw', () => {
  return wbBuild.generateSW({
   globDirectory: './_site/', // 1
    swDest: './_site/sw.js', // 2
    staticFileGlobs: ['**\/*.{html,js,css}'], // 3
    globIgnores: ['sw.js'], // 4
    skipWaiting: true, // optional
    clientsClaim: true, // optional

  })
  .then(() => {
    console.log('Service worker generated.');
  })
  .catch((err) => {
    console.log('[ERROR] ', err);
  });
})
```

The tasks tell `workbox-build`:

1. Where to search for content
2. Where to write the resulting Service Worker
3. What files to add to the Service Worker (all HTML, CSS and Javascript files)
4. What files to ignore. In this example, we don't want to cache the service worker itself as caching would defeat the purpose
5. **_Optionally_** set `skipWaiting` and `clientsClaim` to true. This will take over clients immediately after installing the service worker regardless of having tabs/windows open to the site

If it succeeds then we log a success message to console and if we fail we log the error to console as well. It'as important to note that this task runs after all your other build steps to make sure it will pick up all the changes made during the build process.

The default Workbox task described above produces a basic precaching service worker where we indicate the files that we want to precache. But it does not provide routing or special cases for specific routes. This would be good in most cases but sometimes it's not enough.

Jeff Posnick pointed me to a [solution](https://mobile.twitter.com/jeffposnick/status/865248099068923904) to integrate `workbox-routing` and `workbox-build` on the same Service Worker and still use the Gulp task to populate the data.

```javascript
importScripts('scripts/workbox-sw.dev.v2.1.0.js');
// const workboxSW = new self.SWLib();
const workboxSW = new self.WorkboxSW();

// Pass in an empty array for our dev environment service worker.
// As part of the production build process, the `service-worker`
// gulp task will automatically replace the empty array with the
// current precache manifest.
workboxSW.precache([]);

// Use a cache first strategy for files from googleapis.com
workboxSW.router.registerRoute(
  new RegExp('https://ajax.googleapis.com/ajax/libs'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'googleapis',
    cacheExpiration: {
      // Expire after 30 days (expressed in seconds)
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
  })
);

// Note to self, woff regexp will also match woff2 :P
workboxSW.router.registerRoute(
  new RegExp('.(?:ttf|otf|woff)$'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'fonts',
    cacheExpiration: {
      // Expire after 24 hours (expressed in seconds)
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

workboxSW.router.registerRoute(
  new RegExp('.(css)$'),
  workboxSW.strategies.networkFirst({
    cacheName: 'css',
    cacheExpiration: {
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

// Use a cache-first strategy for the images
workboxSW.router.registerRoute(
  new RegExp('.(?:png|gif|jpg|svg)$'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'images',
    cacheExpiration: {
      // maximum 50 entries
      maxEntries: 50,
      // Expire after 30 days (expressed in seconds)
      maxAgeSeconds: 30 * 24 * 60 * 60,
    },
    // The images are returned as opaque responses, with a status of 0.
    // Normally these wouldn't be cached; here we opt-in to caching them.
    // If the image returns a satus 200 we cache it too
    cacheableResponse: {statuses: [0, 200]},
  })
);

// Match all .htm and .html files use cacheFirst
workboxSW.router.registerRoute(
  new RegExp('(.htm)$'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'content',
    cacheExpiration: {
      maxAgeSeconds: 1 * 24 * 60 * 60,
    },
  })
);

// For video we use a network only strategy. We don't want to log
// the cache with large video files
workboxSW.router.registerRoute(
  new RegExp('.(?:youtube|vimeo).com$'),
  workboxSW.strategies.networkOnly()
);

// Local videos get the same treatment, only pull from the network
workboxSW.router.registerRoute(
  new RegExp('/.(?:mp4|webm|ogg)$/'),
  workboxSW.strategies.networkOnly()
);

// The default route uses a cache first strategy
workboxSW.router.setDefaultHandler({
  handler: workboxSW.strategies.cacheFirst()
});
```

The solution is a two-step process. We first write our Service Worker as shown below. We pass an empty array as the parameter to `workboxSW.precache` and we populate the empty array from the `bundle-sw` task in Gulp.

We've also created custom routes using `workboxSW.router.registerRoute` to register the route and `workboxSW.strategies` to use one of the following strategies:

- CacheFirst
- CacheOnly
- NetworkFirst
- NetworkOnly
- StaleWhileRevalidate

We can further customize each caching strategy. Let's take the route below as an example. We register a route using a regular expression that will match all png, jpg and gif images and use the cache first strategy.

We refine the caching strategy by giving the cache a name and expiration parameters. In the expiration, we add a maximum number of entries (after which the oldest images will be purged from the cache) and a duration in seconds equal to 30 days.

The images are returned as opaque responses, with a status of 0. Normally these wouldn't be cached; here we opt-in to caching them. If the image returns a status 200 we cache it too.

If you want more details about the parameters we can pass to cacheExpiration look at the [source code](https://github.com/GoogleChrome/workbox/blob/master/packages/workbox-cache-expiration/src/lib/cache-expiration.js) in Github.

```javascript
workboxSW.router.registerRoute(
  new RegExp('/.(?:png|gif|jpg)$/'),
  workboxSW.strategies.cacheFirst({
    cacheName: 'images',
    cacheExpiration: {
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);
```

The routes we define in the service worker will not change or will not change too frequently so doing it this way makes sure we get the best of both worlds.

The modified service worker takes a different approach than what we saw before using `workbox-build`. Instead of building the manifest directly, it injects the list of files in the manifest into the service worker. Remember that we put an empty array on the precache section of the service worker. This is the task that will populate the empty array with the files we need to precache.

```javascript
gulp.task('service-worker', () => {
  return workboxBuild.injectManifest({
    swSrc: 'src/service-worker.js',
    swDest: '_site/service-worker.js',
    globDirectory: '_site',
    globIgnores: ['sw.js'],
    staticFileGlobs: [
      'scripts/**/*.js',
      'styles/main.css',
      'images/logo.png',
      'index.html'
    ]
  });
});
```

And the best part is that, if we missed anything, the files will be cached at runtime and we make sure that we still cache the content.

In static or content heavy sites we may want to change the values for `staticFileGlobs` to specific file names that we should cache rather than wildcard paths. The default value may cache too many files and make the initial caching and subsequent loading take longer than we'd like.
