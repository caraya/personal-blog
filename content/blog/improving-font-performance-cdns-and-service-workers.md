---
title: "Improving Font Performance: CDNs and Service Workers"
date: "2019-01-28"
---

## Serve through a Specialized CDN

Serving content through a CDN has always been a key to improve performance. The edge servers are in diverse geographical locations and they will route users to the closest server to their location.

Serving fonts through a CDN is no different. Sites like [Adobe Fonts](https://fonts.adobe.com/) (formally known as Typekit) and [Google Fonts](https://fonts.google.com/) provide a faster experience downloading the fonts to your devices.

Combine the CDN service with preconnect or dns-fetch resource hints for an even faster experience.

## Cache fonts using a service worker

Most of the time when we hear about Service Workers we hear about them in the context of Progressive Web Applications (PWAs) but they can also be used to improve your site's performance by caching assets in the browser.

Fonts will be the largest assets we cache with the service worker so we want to keep a few locally hosted fonts around and keep them for a while so we don't have to download them too often.

Using [Workbox.js](https://developers.google.com/web/tools/workbox/) we can simplify the process of creating a font cache or even multiple caches for local and external fonts.

```js
const fontHandler = workbox.strategies.cacheFirst({
  cacheName: "fonts-cache",
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
      maxEntries: 10
    })
  ]
});
```

When caching external fonts we want to do three things:

- Cache them for a long time (30 days in this case)
- Make sure we cache opaque responses
- Allow the browser to purge the cache if the origin's quota is exceeded

We do the last step because opaque responses are usually padded by browsers to prevent user information from leaking across domains and we want to make sure that browsers will handle full caches for the origin (your site) before the browser decides what to delete instead of asking you.

```js
const extFontHandler = workbox.strategies.staleWhileRevalidate({
  cacheName: "external-fonts",
  plugins: [
    new workbox.expiration.Plugin({
      maxAgeSeconds: 30 * 24 * 60 * 60
    }),
    new workbox.cacheableResponse.Plugin({
      statuses: [0, 200],
      // Automatically cleanup if quota is exceeded.
      purgeOnQuotaError: true
    })
  ]
});
```

The second part is to register the routes that will use our handlers. The first route defines a route for external fonts from Google fonts (from googleapis or gstatic) and uses the `extFontHandler` handler.

```js
// Third party fonts
workbox.routing.registerRoute(
  /https:\/\/fonts\.(googleapis|gstatic)\.com/,
  args => {
    return extFontHandler.handle(args);
  }
);
```

The second route matches local fonts by extension for TTF, OTF, WOFF, and WOFF2. This route uses the `fontHandler` handler.

```js
// Fonts
workbox.routing.registerRoute(/.*\.(?:woff|woff2|ttf|otf)/, args => {
  return fontHandler.handle(args);
});
```
