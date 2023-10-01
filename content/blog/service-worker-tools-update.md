---
title: "Service Worker tools update"
date: "2017-05-31"
---

I haven't looked at Service Workers in a while and wondered how much the SW libraries have changed since I last looked at them.

SW-precache and SW-toolbox made creating Service Workers with dynamic caching much easier but there were two separate libraries and SW-precache required a separate file with all the SW-toolbox libraries routes in it. This made it very error prone to edit and update.

[Workbox.js](https://workboxjs.org/) is the evolution of Google's Service Worker Libraries. It consolidates all Service Worker build steps into one task (Gulp, Webpack and NPM Script versions available) and abstracts a lot of the writing and configuration behind the scenes so developers don't need to see the process, only the result.

Workbox is a Node package so I always install it as a development dependency with the command below

```bash
npm install workbox-build --save-dev
```

At the top of the `gulpfile.js` file place the following constant declaration to bring workbox-build into scope of the file.

```javascript
const wbBuild = require('workbox-build');
```

Copy the task below to your gulpfile. Note that this task uses ES6 arrow functions and promises so it'll only work on newer versions of Node (5.x and newer).

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

The tasks tells `workbox-build`:

1. Where to search for content
2. Where to write the resulting Service Worker
3. What files to add to the Service Worker (all HTML, CSS and Javascript files)
4. What files to ignore. In this example we don't want to cache the service worker itself as caching would defeat the purpose

If it succeeds then we log a success message to console and if we fail we log the error to console as well.

The last bit that I need to research is how to add routes to handle the cases that are not handled in the task as currently written. SW-toolbox provided multiple ways to configure caching strategies for multiple items in the same application.

There is a portion of workbox, `workbox-routing` that handles the routing portion of the Service Worker but I haven't quite figured out how to integrate it to the gulp file using `workbox-build` to generate the manifest and the pre-caching of assets. I've asked the developers who created the tools and they've pointed to examples where the routes are configured manually... There has to be a way to do it programmatically.

In static or content heavy sites we may want to further constraint the values for step 3 as the default value may cache too many files and make the initial cache and subsequent retrievals take longer than we'd like.
