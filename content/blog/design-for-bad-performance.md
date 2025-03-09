---
title: Design for bad performance
date: 2025-03-12
tags:
  - Performance
  - Javascript
  - Design
baseline: true
---

A somewhat contrarian view on designing websites is to design for bad performance.

This post will explore the idea of how designing for bad performance can lead to better user experiences.

Credit where credit is due: The ideas from this post are taken from [Designing websites for bad performance](https://calendar.perfplanet.com/2024/designing-websites-for-bad-performance/)

## Bad performance, what?

Bad performance is a reality for many users around the world. It's easy to forget that not everyone has access to high-speed internet connections or the latest devices.

This is not a problem exclusive to developing countries. Even in developed countries, there are areas with poor internet connectivity and plenty of users with low-powered devices that use asymmetric multicore architectures (not all cores on a low-end mobile device are the same).

It's for these connections and devices that we should design for. If we get good results for these users and devices, we will get better results for everyone.

## Patience is a virtue for a reason

There are many markets where people have skiped PCs altogether and use low-end mobile devices to connect to the Internet.

It's worth noting that these experiences will never match our experiences with high-end iPhone and Android devices in 5G networks in large US or European cities. For these users patience has become a virtue. The question is how much patience are they willing to show when accessing web content.

This may sound like a trivial question but it's not. Depending on the website it may turn into developers leaving money on the table as users abandon the site before it loads and move to a competitor that loads faster.

## The technologies are already available

The technologies to "design for bad performance" are already available. They are not new and have been around for a while. They are things that we should already be doing but we will look at the through the lens of designing for poor performance

### Resource preloading

<baseline-status featureid="link-rel-preload"></baseline-status>

Preloading resources is a way to tell the browser to fetch resources that will be needed in the future before the browser would normally do it. This can be used to load critical resources that are needed to render the page.

Preloading is done via the `rel="preload"` attribute of the link element. The `as` attribute is used to specify the type of resource being preloaded; if you don't specify the attribute then it'll be treated as a regular fetch so the browser will not know what priority to load the resource with.

We can preload the following elements:

* fetch: Resource to be accessed by a fetch or XHR request, such as an ArrayBuffer, WebAssembly binary, or JSON file. ***Must use the `crossorigin` attribute***
* font: Font file. ***Must use the `crossorigin` attribute***
* image: Image file
* script: JavaScript file
* style: CSS stylesheet
* track: WebVTT file

The first example preloads our main CSS stylesheet using the preload link element and then we use it right away to load the stylesheet. If you don't use them in a few seconds some browsers will notify you in the console that the resource was preloaded but not used.

```html
<link rel="preload"
  href="/css/index.css"
  as="style">
<link rel="stylesheet" href="/css/index.css">
```

Sam thing with scripts. We preload the script and then use it as soon as possible.

```html
<link rel="preload"
  as="script"
  href="critical.js">
<script type="module" src="critical.js"></script>
```

When preloading images, you can specify the type of image being preloaded. This can be especially useful if you use images in responsive images or `picture` elements.

```html
<link rel="preload"
  as="image"
  href="/images/hero.avif"
  type="image/avif">
<img src="/images/hero.avif" alt="Hero image">
```

You can use preloaded fonts either directly in your HTML page, or in your CSS files. You first preload the font file.

Fonts are one of the resource types that needs to be preloaded with the `crossorigin` attribute.

```html
<link rel="preload"
  href="/assets/Pacifico-Bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin>
```

You then use it in your CSS file. When using them in your CSS files, you need to make sure that the font is loaded before the CSS file is loaded.

```css
@font-face {
  font-family: 'Pacifico';
  src: url('/assets/Pacifico-Bold.woff2') format('woff2');
  font-display: swap;
  font-weight: bold;
  font-style: normal;
}
```

Preloading resources can help improve the loading speed of your website by fetching resources that are needed to render the page before the browser would normally do it. As with any short circuit of the browser's internal processes, too much preloading has the same as no preloading at all.

### HTTP Caching

Fetching resources can be slow and expensive so every time we don't have to download a resource we save time and potentially money. This is where HTTP caching comes in.

#### Request headers

There are a number of important headers that should be included in your web app's outgoing requests, but the browser almost always takes care of setting them on your behalf when it makes requests. Request headers that affect checking for freshness, like `If-None-Match` and `If-Modified-Since` appear based on the browser's understanding of the current values in the HTTP Cache.

This is good news—it means that you can continue including tags like `<img src="my-image.png">` in your HTML, and the browser automatically takes care of HTTP caching for you, without extra effort.

If you need more control over the HTTP Cache manually use the [Fetch API](https://developer.mozilla.org/docs/Web/API/Fetch_API), passing it [Request](https://developer.mozilla.org/docs/Web/API/Request) objects with specific [cache](https://developer.mozilla.org/docs/Web/API/Request/cache) overrides set. If you need to do that you're on your own :)

#### Response headers

The part of the HTTP caching setup that matters the most is the headers that your web server adds to each outgoing response. The following headers all factor into effective caching behavior:

| | Earliest Version Supported |||| |
| Header | Chrome | Edge | Firefox |Safari | Docs |
| --- | :---: | :---: | :---: | :---: | :---: |
| Cache-Control | 1 | 12 | 1 | 1 | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) |
| ETag | 1 | 12 | 1 | 1 | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) |
| Last-Modified | 1 | 12 | 1 | 1 | [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified) |


The `cache-control` header contains directives (instructions) in both requests and responses that control caching in browsers and shared caches (e.g., Proxies, CDNs).

The following table lists the standard Cache-Control directives for both request and response headers.

The `-` indicates that the directive is not applicable to the specific header.

| Request | Response |
| :---: | :---: |
| max-age | max-age |
| max-stale | - |
| min-fresh | - |
| -	| s-maxage |
| no-cache | no-cache |
| no-store | no-store |
| no-transform | no-transform |
| only-if-cached | - |
| - | must-revalidate |
| - | proxy-revalidate |
| - | must-understand |
| -	| private |
| -	| public |
| -	| immutable |
| -	| stale-while-revalidate |
| stale-if-error | stale-if-error |

The  ETag (entity tag) response header is an identifier for a specific version of a resource. It lets caches be more efficient and save bandwidth, as a web server does not need to resend a full response if the content has not changed. Additionally, ETags help to prevent [mid-air collisions](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag#avoiding_mid-air_collisions) (simultaneous updates of a resource overwriting each other).

If the resource at a given URL changes, a new Etag value must be generated. A comparison of them can determine whether two representations of a resource are the same and if it needs to be fetched again.

`If-Modified-Since` contains the date of the last modification and makes the request conditional. The server will only send a resource with the 200 status if it has been last modified after the date given in the `If-Modified-Since` header. If the resource has not been modified since, the server sends a 304 status without any body.

The most common use case is to update a cached entity that has no associated `ETag`.

A combination of these headers can help you control how resources are cached and when they should be fetched again. This will improve performance, especially for lower-end devices and poor network connectivity, improving our "design for bad performance" scenario.

### Service workers

<baseline-status featureid="service-workers"></baseline-status>

Service workers essentially act as proxy servers that sit between web applications, the browser, and the network (when available). They are intended, among other things, to enable the creation of effective offline experiences, intercept network requests, and take appropriate action based on whether the network is available.

For our bad performance scenario, Service workers can be used to cache resources beyond what we can do with HTTP caching. This will improve the loading performance of the site by providing cached resources where appropriate

The first step is to register the service worker on the root of your site or app.

The code is wrapped in a feature query to make sure the browser supports service workers before we try to register one.

We add a `load` event listener  to register the service worker when the page loads. The `navigator.serviceWorker.register()` method returns a promise that resolves to the registration object. We can use this object to check the scope of the service worker.

If the registration fails, we catch the error and log it to the console.

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((registration) => {
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}
```

We still install the default files during the `install` event. Cache all the files that are needed for the site to work offline.

To ensure the best performance possible, we can use the service worker to set up a cache-first strategy.

The cache-first strategy will first try to get a resource from the specified cache and, if it's not there, it will fetch the resource from the network and place a copy of the response in the cache We do this because the response object is a stream and the browser can only consume a stream once. See this [Stack Overflow](https://stackoverflow.com/questions/46742251/why-fetch-body-object-can-be-read-only-once) question for more information.

This way we will only take the performance hit on the first visit to the site (as long as the user doesn't wipe out the service worker cache).

```js
const addResourcesToCache = async (resources) => {
  const cache = await caches.open('v1');
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open('v1');
  await cache.put(request, response);
};

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    addResourcesToCache([
      "/",
      "/index.html",
      "/style.css",
      "/app.js",
      "/image-list.js",
      "/star-wars-logo.jpg",
      "/gallery/bountyHunters.jpg",
      "/gallery/myLittleVader.jpg",
      "/gallery/snowTroopers.jpg",
    ]),
  );
});

const cacheFirst = async ({
  request,
  preloadResponsePromise,
  fallbackUrl
}) => {
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  try {
    const responseFromNetwork = await fetch(request.clone());
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    return new Response('Network error happened', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
};

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: './gallery/myLittleVader.jpg',
    })
  );
});
```

### Lazy loading

<baseline-status featureid="loading-lazy"></baseline-status>

The idea behind lazy loading is to only load assets like images and iframes when the content is about to be displayed in the viewport.

All modern browsers support native lazy loading for images and iframes using the `loading="lazy"` attribute to the assets you want to lazy load.

```html
<img src="image.jpg" loading="lazy" alt="Image">
```

```html
<iframe src="https://google.com" loading="lazy"></iframe>
```

The `loading` attribute can take three values:

* `auto`: Default value. The browser decides when to load the resource
* `lazy`: The resource will be loaded when it's about to be displayed
* `eager`: The resource will be loaded immediately. This is the same as not lazy loading the asset

Don't lazy load your [above the fold](https://www.semrush.com/blog/above-the-fold/) content. This will make users wait for the content to load when they first visit the site and cause issues with perceived performance.

From our "design for bad performance" perspective, lazy loading can help improve the loading speed of the site by only loading the resources that are needed to render the page as they come into view.

### Resource optimization

The last area we will look at is resource optimization. This is not a new concept but it's worth mentioning as it can help improve the loading speed of the site.

In this context we'll talk about three areas of resource optimization:

* Image optimization
* `srcset` and `picture` elements
* Compressing text-based assets from the server

One of the oldest performance maxims is to optimize images and never send images larger than what is needed. This is still true today.

Images can be optimized in a number of ways:

* Use the correct image format for the image type
* Use the correct image size for the image type
* Use the correct image quality for the image type

we can compress images with Desktop tools like Photoshop or GIMP, or online tools like [Squoosh](https://squoosh.app/), [TinyPNG](https://tinypng.com/), or [ImageOptim](https://imageoptim.com/mac).

There are also online services like [Cloudinary](https://cloudinary.com) where the free tier provides enough space and resource credits for you to test if it's worth it for your site.

I normally recommend three formats for images: AVIF, WebP, and PNG. AVIF and WebP are modern image formats that provide better compression than JPEG and PNG. PNG is used for images with transparency. All these formats are supported across browsers.

As with all browsers I would strongly suggest you run compression tests on your images to see which format provides the best compression while maintaining image quality.

The `srcset` and `picture` elements can be used to provide different images based on the device's screen size and resolution. This can help improve the loading speed of the site by only loading the image that is needed for the device.

`srcset` is used to provide different images based on the device's screen size and resolution. The browser will choose the image that best fits the device's screen size and resolution.

The simples use case is to provide different images based on the device's screen size using the `w` descriptor.

This will tell the browser to pick the best image of those available based on the device's screen size.

```html
<img src="cat.jpg" alt="cat"
  srcset="cat-160.jpg 160w,
	cat-320.jpg 320w,
	cat-640.jpg 640w,
	cat-1280.jpg 1280w">
```

If you use the `w` descriptor you should also use the `sizes` attribute.

`sizes` defines a set of media conditions (e.g. screen widths) and indicates what image size would be best to choose, when certain media conditions are true. In this case, before each comma we write:

* A media condition that will be used.
* A space
* The width of the slot the image will fill when the media condition is true

So the full responsive image using `srcset` looks like this:

```html
<img src="cat.jpg" alt="cat"
  srcset="cat-160.jpg 160w,
		cat-320.jpg 320w,
		cat-640.jpg 640w,
		cat-1280.jpg 1280w"
  sizes="(max-width: 480px) 100vw,
	(max-width: 900px) 33vw,
	254px">
```

Using `srcset` and `sizes` can help improve the loading speed of the site by only loading the image that is needed for the device.

<baseline-status featureid="picture"></baseline-status>

The `picture` HTML element contains zero or more `source` elements and one mandatory `img` element to offer alternative versions of an image for different display/device scenarios.

The browser will loop through the `source` child elements and choose the best match among them. If none of the conditions match or if the browser doesn't support the `picture` element. the browser will use the `img` element. The selected image is then presented in the space occupied of the `img` element.

```html
<picture>
  <source
		media="(max-width: 799px)"
		srcset="elva-480w-close-portrait.jpg" />
  <source
		media="(min-width: 800px)"
		srcset="elva-800w.jpg" />
  <img
		src="elva-800w.jpg"
		alt="Elva" />
</picture>
```

The `picture` element provides other means to optimize image loading based on the device's screen size and resolution.

The last area of resource optimization is compressing text-based assets from the server. In our "design for bad performance" scenario, we can compress text-based assets like HTML, CSS, and JavaScript files to reduce the size of the files that are sent to the browser.

For these configuratios to work, browsers need to request the compression from the server. This is done by the server sending the `Content-Encoding` header with the value `gzip` or `br` (for Brotli compression).

This configuration is taken from this [HTTP5 Boilerplate Github issue](https://github.com/h5bp/html5-boilerplate/issues/1012#issuecomment-5973565).

Different versions of the Apache HTTP server have different ways of enabling compression. This configuration version will test for versions before 2.4 and provide its configuration and a different configuration for versions 2.4 and later.

```apacheconf
<IfModule filter_module.c>
<IfModule version.c>
	<IfVersion >= 2.4>
		FilterDeclare  COMPRESS
		FilterProvider COMPRESS DEFLATE "%{CONTENT_TYPE} =~ m#^text/(html|css|plain|xml|x-component)#i"
		FilterProvider COMPRESS DEFLATE "%{CONTENT_TYPE} =~ m#^application/(javascript|json|xml|xhtml+xml|rss+xml|atom+xml|vnd.ms-fontobject|x-font-ttf)#i"
		FilterProvider COMPRESS DEFLATE "%{CONTENT_TYPE} =~ m#^image/(svg+xml|x-icon)#i"
		FilterProvider COMPRESS DEFLATE "%{CONTENT_TYPE} = 'font/opentype'"
		FilterChain    COMPRESS
		FilterProtocol COMPRESS DEFLATE change=yes;byteranges=no
	</IfVersion>
	<IfVersion < 2.4>
		FilterDeclare COMPRESS
		FilterProvider COMPRESS DEFLATE resp=Content-Type $text/html
		FilterProvider COMPRESS DEFLATE resp=Content-Type $text/css
		FilterProvider COMPRESS DEFLATE resp=Content-Type $text/plain
		FilterProvider COMPRESS DEFLATE resp=Content-Type $text/xml
		FilterProvider COMPRESS DEFLATE resp=Content-Type $text/x-component
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/javascript
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/json
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/xml
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/xhtml+xml
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/rss+xml
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/atom+xml
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/vnd.ms-fontobject
		FilterProvider COMPRESS DEFLATE resp=Content-Type $image/svg+xml
		FilterProvider COMPRESS DEFLATE resp=Content-Type $image/x-icon
		FilterProvider COMPRESS DEFLATE resp=Content-Type $application/x-font-ttf
		FilterProvider COMPRESS DEFLATE resp=Content-Type $font/opentype
		FilterChain COMPRESS
		FilterProtocol COMPRESS DEFLATE change=yes;byteranges=no
	</IfVersion>
</IfModule>
<IfModule !version.c>
	FilterDeclare COMPRESS
	FilterProvider COMPRESS DEFLATE resp=Content-Type $text/html
	FilterProvider COMPRESS DEFLATE resp=Content-Type $text/css
	FilterProvider COMPRESS DEFLATE resp=Content-Type $text/plain
	FilterProvider COMPRESS DEFLATE resp=Content-Type $text/xml
	FilterProvider COMPRESS DEFLATE resp=Content-Type $text/x-component
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/javascript
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/json
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/xml
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/xhtml+xml
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/rss+xml
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/atom+xml
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/vnd.ms-fontobject
	FilterProvider COMPRESS DEFLATE resp=Content-Type $image/svg+xml
	FilterProvider COMPRESS DEFLATE resp=Content-Type $image/x-icon
	FilterProvider COMPRESS DEFLATE resp=Content-Type $application/x-font-ttf
	FilterProvider COMPRESS DEFLATE resp=Content-Type $font/opentype
	FilterChain COMPRESS
	FilterProtocol COMPRESS DEFLATE change=yes;byteranges=no
</IfModule>
</IfModule>
```

The NGINX block is taken from [How To Improve Website Performance Using gzip and Nginx on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-improve-website-performance-using-gzip-and-nginx-on-ubuntu-20-04) and should be included in your NGINX configuration file.

```nginx
gzip on;
gzip_disable "msie6";

gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_buffers 16 8k;
gzip_http_version 1.1;
gzip_min_length 256;
gzip_types
  application/atom+xml
  application/geo+json
  application/javascript
  application/x-javascript
  application/json
  application/ld+json
  application/manifest+json
  application/rdf+xml
  application/rss+xml
  application/xhtml+xml
  application/xml
  font/eot
  font/otf
  font/ttf
  image/svg+xml
  text/css
  text/javascript
  text/plain
  text/xml;
```

From our "design for bad performance" perspective, compressing text-based assets from the server can help improve the loading speed of the site by reducing the size of the files that are sent to the browser. This is particularly important for Javascript files that can be quite large.

## Links and resources

* Preloading
  * [Preload critical assets to improve loading speed](https://web.dev/articles/preload-critical-assets/)
  * [rel=preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload)
* Caching
  * [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
  * [Prevent unnecessary network requests with the HTTP Cache ](https://web.dev/articles/http-cache)
* ETag
  * [ETag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag)
* HTTP Caching
  * [Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
  * [If-Modified-Since](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/If-Modified-Since)
* Service worker
  * [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
  * [Service worker](https://web.dev/learn/pwa/service-workers/)
* Lazy loading
  * [Native lazy loading](https://web.dev/native-lazy-loading/)
  * [loading attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-loading)
* Resource optimization
  * Online compression tools
    * [Squoosh](https://squoosh.app/)
    * [TinyPNG](https://tinypng.com/)
    * [ImageOptim](https://imageoptim.com/mac)
  * Responsive images
    * [Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images)
    * Cloud 4 article series
      * [Responsive Images 101, Part 1: Definitions](https://cloudfour.com/thinks/responsive-images-101-definitions/)
      * [Responsive Images 101, Part 4: Srcset Width Descriptors](https://cloudfour.com/thinks/responsive-images-101-part-4-srcset-width-descriptors/)
      * [Responsive Images 101, Part 5: Sizes](https://cloudfour.com/thinks/responsive-images-101-part-5-sizes/)
      * [Responsive Images 101, Part 6: Picture Element](https://cloudfour.com/thinks/responsive-images-101-part-6-picture-element/)
