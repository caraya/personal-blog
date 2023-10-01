---
title: "Caching DASH Video"
date: "2017-06-12"
---

When we last discussed encoding DASH adaptive streaming we saw that Shaka Packager creates the master file and a series of segments. We left them in the browser's cache which may force downloads and will not work when offline or with poor connectivity.

Using a service worker we can create a cache for media segments so they can be stored locally for offline use. For this to work, we need to do some modifications to our standard service worker to accommodate the special requirements of DASH chunked video.

The first step is to create a variable to hold the name of the cache. We then create a function to determine if we should cache the resource... for this particular case we want to cache files ending in `mp4` and `m4s` (MP4 files and MP4 segments)

```
var CACHE_NAME = 'segment-cache-v1';

function shouldCache(url) {
  return url.endsWith('.mp4') || url.endsWith('.m4s');
}
```

the `loadFromCacheOrFetch` function is the core of this service worker. It will open the specified cache and try to match the request.

If the request matches an item in the cache then it will return that item. The fragment will have an additional header that we add when we cache the item.

If the request doesn't match then we take a clone of the request and fetch it. This is where another peculiarity of working with DASH video comes in. A service worker cannot cache partial responses ([HTTP 206](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/206)) so we have to check if the response is ok, **did not** return a status code 206 and is one of the items we should cache. Only if the three conditions are met we fetch the resource and store it in the cache using the `cacheResponse` function.

```
function loadFromCacheOrFetch(request) {
  return caches.open(CACHE_NAME)
  .then(cache => {
    return cache.match(request)
    .then(response => {
      if (response) {
        console.log('Handling cached request', request.url);
        return response;
      }

      return fetch(request.clone())
      .then(response => {
        if (
          response.ok && 
          response.status != 206 && 
          shouldCache(request.url)) {
          console.log('Caching MP4 segment', request.url);
          cacheResponse(cache, request, response);
        }

        return response;
      });
    });
  })
}
```

The `cacheResponse` function modifiess the response object before putting it in the cache. Because the response is read onl we have to recreate it if we'll make any changes.

We create an array of the data we want to pass to the response object when we actually cache it, that's why the response has uses two parameters, an `arrayBuffer` and the array that we creted with response data and header.

Response objects are single use. This means we need to call clone() so we can both store the ArrayBuffer and give the response to the page.

```
function cacheResponse(cache, request, response) {
  var init = {
    status: response.status,
    statusText: response.statusText,
    headers: {'X-Shaka-From-Cache': true}
  };

  response.headers.forEach((value, key) => {
    init.headers[key] = value;
  });

  return response.clone().arrayBuffer()
  .then(ab => {
    cache.put(request, new Response(ab, init));
  });
}
```

The final piece is the `fetch` event itself which responds using the `loadFromCacheOrFetch` function.

```
self.addEventListener('fetch', (event) => {
  event.respondWith(loadFromCacheOrFetch(event.request));
});
```

In a larger service worker we could use a different way to write how we call our `loadFromCacheOrFetch` function. We use the video tests inside an if statement and if it matches one of the two kinds of MP4 DASH content then we fetch the element into its own cache.

```
self.addEventListener('fetch', (event) => {
  if (event.request.url.endsWith('.mp4') || event.request.url.endsWith('.m4s')) {
    event.respondWith(loadFromCacheOrFetch(event.request));
  }
});
```
