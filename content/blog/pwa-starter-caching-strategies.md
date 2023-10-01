---
title: "PWA Starter: Caching Strategies"
date: "2017-11-08"
---

Jake Archibald's [Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/#the-cache-machine-when-to-store-resources) provides additional ideas of [when to cache data](https://jakearchibald.com/2014/offline-cookbook/#the-cache-machine-when-to-store-resources) and different [caching strategies](https://jakearchibald.com/2014/offline-cookbook/#serving-suggestions-responding-to-requests). We'll concentrate in the later and talk about caching strategies.

### Cache only

Use this strategy for resources that are static to the site and that were cached during installation.

```javascript
self.addEventListener('fetch', event => {
  // If a match isn't found in the cache, the response
  // will look like a connection error
  event.respondWith(caches.match(event.request));
});
```

### Network Only

I use this strategy for resources that I don't want in the cache like videos, non-GET requests, and others.

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behaviour
});
```

### Cache, falling back to network (or Cache First)

Check if the resource is in the cache; if it then respond with it. If it's not in the cache then fetch it from the network, store a copy in the cache and serve it to the client. This is, most likely, the default case. Everything else is special cased

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      return response || fetch(event.request);
    })
  );
});
```

This is a simplified version of the fetch event example provided earlier.

### Cache & network race

There are few situations, particularly with older mobile devices and slow hard drives, where network connectivity will be faster than cache access. In that case, we can race the network request and the cache access and return whatever response comes back first.

```javascript
// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map(p => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach(p => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error("All failed")));
  });
};

self.addEventListener('fetch', event => {
  event.respondWith(
    promiseAny([
      caches.match(event.request),
      fetch(event.request)
    ])
  );
});
```

### Network falling back to cache

If the fetch request succeeds users get the newest content and if it doesn't then they get the latest version of the content available in the cache. Remember that if the fetch request succeeds you should update the cached content.

There is one thing to consider. If the user has an intermittent or slow connection they'll have to wait for the network to fail before they get any content already on their device. This is a very bad user experience.

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(function() {
        return caches.match(event.request);
      })
  );
});
```

### Cache falling back to network

This is an alternative to network falling back to cache and it requires the page to make two requests, one to the cache, one to the network. The idea is to show the cached data first, then update the page when/if the network data arrives.

Sometimes you can just replace the current data when new data arrives (e.g. game leaderboard), but that can be disruptive with larger pieces of content. Basically, don't "disappear" something the user may be reading or interacting with.

Code in the page:

```javascript
var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/data.json')
.then(function(response) {
  return response.json();
}).then(function(data) {
  networkDataReceived = true;
  updatePage();
});

// fetch cached data
caches.match('/data.json').then(function(response) {
  if (!response) throw Error("No data");
  return response.json();
}).then(function(data) {
  // don't overwrite newer network data
  if (!networkDataReceived) {
    updatePage(data);
  }
}).catch(function() {
  // we didn't get cached data, the network is our last hope:
  return networkUpdate;
}).catch(showErrorMessage).then(stopSpinner);
```

**Code in the ServiceWorker:**

We always go to the network & update a cache as we go.

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function(cache) {
      return fetch(event.request).then(function(response) {
        cache.put(event.request, response.clone());
        return response;
      });
    })
  );
});
```

### Generic Response

If the content is not in the cache and you're not online to fetch it or the fetch request times our, it would be nice to have a fallback to show the user. It can be as simple as returning a cached offline page like Jake does in the example below; Make sure you cache offline.html when you install the service worker.

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
      // Fall back to network
      return response || fetch(event.request);
    }).catch(function() {
      // If both fail, show a generic fallback:
      return caches.match('/offline.html');
    })
  );
});
```

Or returning an inline SVG image for images that can't be displayed because they are not cached and not available online.

This example from Jeremy Keith's [Adactio](https://adactio.com/) runs a cache falling back to network strategy and then, if the resource is an image, stores a cloned copy on the cache and returns the image to the user.

If both the cache and fetch fail to return the image the catch portion of the promise is triggered and, if the request was for an image, we return a new Response object containing data to make an inline SVG image rather than provide a broken image and a suboptimal user experience.

```javascript
self.addEventListener('fetch', event => {
let request = event.request;
let url = new URL(request.url);

// For non-HTML requests, look in the cache first, fall back to the network
event.respondWith(
  caches.match(request)
    .then(response => {
      // CACHE
      return response || fetch(request)
    .then( response => {
        // NETWORK
        if (request.headers.get('Accept').includes('image')) {
            let copy = response.clone();
            stashInCache(imagesCacheName, request, copy);
        }
        return response;
    })
    .catch( () => {
        // OFFLINE
        if (request.headers.get('Accept').includes('image')) {
          return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', {headers: {'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store'}});
        }
      });
    })
  );
});
```

Jeremy does it for images and Jake does it for HTML, there is no reason why we can't combine the catch statements from both service workers into one that looks like this:

```javascript
self.addEventListener('fetch', function(event) {
  event.respondWith(
    // Try the cache
    caches.match(event.request).then(function(response) {
      // Fall back to network
      return response || fetch(event.request);
    }).catch(function() {
      if (request.headers.get('Accept').includes('html')) {
        return caches.match('/offline.html');
      }
      if (request.headers.get('Accept').includes('image')) {
      return new Response('<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"/><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>', {headers: {'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store'}});
      }

    })
  );
});
```

We could add additional fallbacks matching the content type we want to test and provide different types of fallbacks based on the content.

## Handling multiple content types in a fetch request

So far we've used a single strategy for fetching the content of our pages. We can combine these strategies to create a flexible service worker that will cache different types of content differently based on the headers it accepts.

For each special case we want to create check that the Accept header includes the type we want to use (for example HTML); we test using `if (request.headers.get('Accept').includes('html'))`. If the headers include the content type then we carry on with caching and providing offline fallbacks.

If the request doesn't match any of our special cases it'll fall through to a default cache first strategy.

```javascript
  if (request.headers.get('Accept').includes('html')) {
    event.respondWith(() => {
      caches.match(event.request)
      .then(response => {
        // Fall back to network
        return response || fetch(event.request);
      })
          .then(response => {
            return caches.open('RUNTIME')
              .then(cache => {
                cache.put(event.request, response.clone());
                return response;
              });
          })
      .catch(() => {
        return caches.match('/offline.html');
      });
    });
  }
```

This service worker is simple and provides a core set of functionality to work with Service Worker. We can do other things like providing an offline page if the content is not in the cache and the network is down and many other things that we explicitly code.

The service worker script is available in [this Gist](https://gist.github.com/caraya/1c800bd6950ee68710dd2f0b04a0e60c).

## Headers

The Headers interface of the Fetch API allows you to perform various actions on HTTP request and response headers. These actions include retrieving, setting, adding to, and removing elements and values. A Headers object has an associated header list, which is initially empty and consists of zero or more name and value pairs. You can add to this using methods like `append()`. In all methods of this interface, we match header names by case-insensitive byte sequence.

For security reasons, only the user agent can control some headers. These headers include the [forbidden header names](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name) and [forbidden response header names](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_response_header_name).

You can retrieve a Headers object via the `Request.headers` and `Response.headers` properties, and create a new Headers object using the `Headers.Headers()` constructor.

We've seen examples of headers when we test to see if a request if of a given mime type. This will test if the request is for an HTML document (mime type `text/html`) and return a document to notify the application is offline.

```javascript
if (request.headers.get('Accept').includes('html')) {
  return caches.match('/offline.html');
}
```

The Response constructor takes two arguments, the first being the body of the response (the content we get back from fetch). An optional second argument is an object specifying the status code, status text, and headers of the response. We can use these elements to modify the response we return to the client.

In the following example, we add a header to include in the returned content. You'll notice a few tricks:

- The response is read-only so we have to make the request again in order to process the changes
- We use the technique discussed earlier to add a custom header that we can check if we need to

```javascript
self.addEventListener('fetch', function(event){
  console.log('Caught request for ' + event.request.url);
  event.respondWith(
    fetch(event.request).then(function(response){
      var init = {
        status:     response.status,
        statusText: response.statusText,
        headers:    {
          'X-Foo': 'My Custom Header'
        }
      };

      response.headers.forEach(function(v,k){
        init.headers[k] = v;
      });

      return response.text().then(function(body){
        return new Response(body, init);
      });
  })
  );
});
```

### CORS, NO-CORS and why it matters

One of the reasons why we discuss headers is to introduce the concept of CORS, what it is and how to use it to make requests to an origin different than where the application lives.

**Cross-Origin Resource Sharing (CORS)** is a W3C spec that allows cross-domain communication from the browser. By building on top of the XMLHttpRequest object, CORS allows developers to work with the same idioms as same-domain requests.

The use-case for CORS is simple. Imagine the site `a.com` has some data that the site `bob.com` wants to access. The web's [same origin policy](https://www.w3.org/Security/wiki/Same_Origin_Policy) forbids this type of request. However, by supporting CORS requests, the owner of a.com can add a few special response headers that allow b.com to access the data.

CORS is a two-step process. The server tells you which, domains other than the origin can access the resource and the client must make explicit that they are asking for a CORS resource.

Setting up CORS request varies by server and the type of request you're making. Note that the examples below use a wildcard pattern, meaning we don't care who access the resources. This is not a safe configuration. Make sure you only allow access to hosts you want and not everyone.

To set up blanket CORS permissions in an Apache HTTPS server use:

```
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>
```

To enable CORS in Nginx use the Headers core module which is compiled into the server by default. Then add the following line to your configuration file.

```
add_header Access-Control-Allow-Origin *;
```

When working with Express.js make sure you do the following to enable CORS:

```javascript
app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  next()
});
```

Information for other servers can be found in the [W3C wiki](https://www.w3.org/wiki/CORS_Enabled)

The client side of the equation means we have to make the fetch request a CORS request by adding custom headers to the request.

```javascript
var myHeaders = new Headers(); // 1

var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors', // 2
               cache: 'default' };

var myRequest = new Request('racecar.png', myInit);

fetch(myRequest)
  .then(function(response) {
    return response.blob();
  })
  .then(function(myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
});
```

The example works as follows:

1. Create a new `Headers()`
2. Create an init object that will be added to the request as its second parameter. The important part is the `mode` child that will tell fetch how to process the request. Some of the possible values are:
    
    - `same-origin` — If a request is made to another origin with this mode set, the result is simply an error. You could use this to ensure that a request is always being made to your origin
    - `no-cors` — Prevents the method from being anything other than `HEAD`, `GET` or `POST`. If any ServiceWorkers intercept these requests, they may not add or override any headers except for [these](https://fetch.spec.whatwg.org/#simple-header). In addition, JavaScript may not access any properties of the resulting [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response). This ensures that ServiceWorkers do not affect the semantics of the Web and prevents security and privacy issues arising from leaking data across domains
    - `cors` — Allows cross-origin requests, for example, to access various APIs offered by 3rd party vendors. These are expected to adhere to the [HTTP access control (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) protocol. Only a [limited set](https://fetch.spec.whatwg.org/#concept-filtered-response-cors) of headers are exposed in the [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response), but the body is readable

We then make a blob of the response and build a URL to display to the user.

If mode not defined in step 2, the default value of `no-cors` is assumed.

### Links and Resources: Headers

- [Modifying Service Worker Response](http://craig-russell.co.uk/2016/01/26/modifying-service-worker-responses.html#.WcxXlhNSy2f)
- [Fetch API (David Walsh)](https://davidwalsh.name/fetch)
- [enable CORS](https://enable-cors.org/resources.html)
- [HTML5 Rocks CORS Tutorial](https://www.html5rocks.com/en/tutorials/cors/)
- [`request.mode`](https://developer.mozilla.org/en-US/docs/Web/API/Request/mode)

## Intercepting Responses

Fetch events allows developers to intercept and replace responses with our own content. We've seen this before when we discussed offline fallbacks and providing alternative content when the user is offline.

But we can intercept requests while we are online. The example below shows how to provide a different response to a request if the URL to fetch include the string `cats.jpg` and replaces it with `dogs.png`

```javascript
self.addEventListener('fetch', function(event){
    console.log('Caught request for ' + event.request.url);
    if (event.request.url.includes('cat.jpg'){
      event.respondWith(new Response('dogs.png'));
    }
});
```
