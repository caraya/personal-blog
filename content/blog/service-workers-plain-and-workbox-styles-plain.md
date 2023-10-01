---
title: "Service Workers: plain and workbox styles: Plain"
date: "2018-10-15"
---

The idea is to create the service worker using only native APIs and seeing how much of the Workbox functionality I can duplicate without having to use a library.

### Constants and common items

Individual constants for each of the caches. We store them separately so we can change the names to make cleanup easier without having to change the array we define later.

```js
const PRECACHE = 'precache-v1';
const CONTENT = 'content-cache-v1';
const CSS = 'css-cache-v1';
const JS = 'scripts-cache-v1';
const IMAGES = 'image-cache-v1';
const FONTS = 'fonts-cache-v1';
```

expectedCaches is the array of cache names we expect to exists in the client.

If they don't we're fine, we fetch from the network; If they do, we're fine, we fetch from the cache and if they exist with a different version then we delete the old one

```js
const expectedCaches = [
  PRECACHE,
  CONTENT,
  CSS,
  JS,
  IMAGES,
  FONTS,
];
```

`urlsToPrecache` is the list of URLs that we want to cache on install. The `/` URL indicates the root file, in this case, index.html

```js
const urlsToPrecache = [
  '/index.html',
  '/css/index.css',
  '/js/zenscroll.js',
  '/404.html',
  '/offline.html',
];
```

### Install Event

The install event will take all the URLs in the `urlsToPrecache` array

```js
self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('install event fired');
  event.waitUntil(caches.open(PRECACHE).then((precache) => {
    return precache.addAll(urlsToPrecache);
  })); // ends wait until
}); // ends install event
```

### Activate Event

Activate will perform cleanup on the caches.

If there is a cache that doesn't exist in the Array that we pass to the event then it's deleted This is the reason why we went through such a convoluted way to define the caches. We can change the names individually and then they'll get deleted the next time the user visits the site.

```js
self.addEventListener('activate', (event) => {
  clients.claim();
  event.waitUntil(
  caches.keys().then((keys) => {
    Promise.all(keys.map((key) => {
      // if the cache is not one in the list
      if (!expectedCaches.includes(key)) {
        // delete it
        return caches.delete(key);
      }
    }))
    .then(() => {
      console.log('Everything cleaned up');
    });
  }));
});
```

### Fetch Event

The fetch event is where most of the work will happen. Unlike the work in Workbox service worker, we don't break the routes into different blocks in the vanilla service worker.

There are some aspects where the vanilla service worker still doesn't match the Workbox implementation. I'm working on expiration d

All the following sections are inside the fetch event listener. I've broken them down for ease of reading.

This is an important item to remember for all fetch handlers that put resources in caches using the cache API:

_**Put a copy of the response in the cache, otherwise the code will throw an exception because the response is a stream that can only be consumed once**_

When we define the event we do two things right away:

We define a constant to hold the values of the event's request object.

If the request doesn't match the `GET` HTTP method we return without doing anything. The service worker will only work with GET requests.

```js
self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }
```

The first handler is for fonts. Since the fonts are requested from the `typography-*.css` stylesheets I have to make sure that the font is loaded from the stylesheet or that the file ends in one of the four font formats I work with.

```js
  if (request.url.match(/\.(ttf|otf|woff|woff2)$/) ||
    (request.referrer.includes('typography'))) {
    event.waitUntil(
      // Open the fonts cache
      caches.open(FONTS)
        .then((cache) => {
          // return the font to the user
          return cache.match(request);
        })
        .then((response) => {
          // Open the cache
          caches.open(FONTS)
          .then((cache) => {
            // Fetch the resource from the network
            return fetch(request)
            .then((response) => {
              // Put a copy of the resource in the cache
              return cache.put(request, response.clone())
              .then(() => {
                return response;
              });
            });
          });
        })
    );
  }
```

Caching Javascript resources has a different objective: To cache all the Javascript files that are not in the install precache. The match query means to include all files with a `.js` extension except one that includes `zenscroller` in the URL (Zenscroller is cached at install).

```js
  if (request.url.match(/\.(js)$/) && (!request.url.includes('zenscroll'))) {
    event.waitUntil(
      caches.open(JS)
      .then((cache) => {
        return cache.match(request);
      })
      .then((response) => {
        caches.open(JS)
        .then((cache) => {
          fetch(request)
          .then((response) => {
            return cache.put(request, response.clone())
              .then(() => {
                // Return the response
                return response;
              });
          });
        });
      })
    );
    return;
  }
```

For CSS we want to make sure we cache all files with a `.css` extension and that are not fonts (denoted by a `.woff2` extension).

```js
  // two places. Working on figuring out a solution
  if (request.url.match(/\.(css)$/) &&
    !request.url.includes('woff2')) {
    event.waitUntil(
      // Open the content cache
      caches.open(CSS)
        .then((cache) => {
          // return the CSS to the user
          return cache.match(request);
        })
        .then((response) => {
          // Open the cache
          return caches.open(CSS)
          .then((cache) => {
            // Fetch the resource from the network
            fetch(request).then((response) => {
              // Put a copy of the response in the cache
              return cache.put(request, response.clone())
              .then(() => {
                // Return the response
                return response;
              });
            });
          });
        })
    );
    return;
  }
```

In the cache for images, we want to make sure that we add only images only (those that match `jpeg`, `jpg`, `png`, `gif` and `svg`) and not the assets that reference the images (HTML and CSS).

If the image is not in the cache and we can't retrieve it from the network we provide a local fallback as a new response using an SVG image.

```js
  if (request.url.match(/\.(jpe?g|png|gif|svg)$/) &&
    (!request.url.match('/\.(html|css)$/'))) {
    event.waitUntil(
      caches.open(IMAGES)
      .then((cache) => {
        // return the IMAGES to the user
        return caches.match(request);
      })
      .then((response) => {
        // Open the cache
        return caches.open(IMAGES)
        .then((cache) => {
          // Fetch the resource from the network
          fetch(request)
          .then((response) => {
            // Put a copy of the response in the cache
            return cache.put(request, response.clone())
            .then(() => {
              // Return the response
              return response;
            });
          })
          .catch((error) => {
            return new Response(OFFLINESVG, {
              headers: {
                'Content-Type': 'image/svg+xml',
              },
            });
          });
        });
      })
    );
    return; // If we get to here, bail out
  }
```

The final handler for assets is for HTML content by using a 'stale while revalidate' strategy, we return the resource in the cache, if it's not in the cache then we fetch it from the network, store a copy of the response in the cache and return the resource to the user.

In this cache we could be more sophisticated and return different responses based on whether we're offline, the resource was not found or any other network failure. But for an MVP, this is enough.

```js
  if (event.request.headers.get('Accept')
    .includes('text/html')) {
    // Open the content cache
    caches.open(CONTENT)
    .then((cache) => {
      // return the content to the user
      return caches.match(request);
    })
    .then((response) => {
      // Open the cache
      caches.open(CONTENT)
      .then((cache) => {
        // Fetch the resource from the network
        fetch(request)
        .then((response) => {
          // Put a copy of the response in the cache
          cache.put(request, response.clone())
          .then(() => {
            // Return the response
            return response;
          });
        });
      });
    });
  }
});
```
