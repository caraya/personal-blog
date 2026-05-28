importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.1/workbox-sw.js');

const {matchPrecache, precacheAndRoute} = workbox.precaching;
const {Route, registerRoute, setDefaultHandler, setCatchHandler} = workbox.routing;
const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
const {ExpirationPlugin} = workbox.expiration;
const {CacheableResponsePlugin} = workbox.cacheableResponse;

// Inject precache manifest
precacheAndRoute([{"revision":"2166f2f2915ac72f1d38b52f0d67d3ae","url":"index.html"},{"revision":"aecfea5f38fb0509c412a248f4dd472a","url":"404.html"},{"revision":"e285eef654c6e75accfed1e89ab5c71a","url":"offline.html"},{"revision":"abcbe11d1f0d578a3abf5538241bc45a","url":"fonts/Recursive.woff2"},{"revision":"f252d35afcab50a6b3ad2440d9f06cdc","url":"css/index.css"},{"revision":"ed61dda927f58a50adbea133e8adeff0","url":"images/cropped-Long_Room_Interior_Trinity_College_Dublin_Ireland.webp"}]);

// Handle HTML documents
const contentRoute = new Route(({ request }) => {
  return request.destination === 'document';
}, new StaleWhileRevalidate({
  cacheName: 'content',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 120 * 24 * 60 * 60,
      purgeOnQuotaError: true,
    }),
  ],
}));

// Handle images
const imageRoute = new Route(({ request }) => {
  return request.destination === 'image';
}, new CacheFirst({
  cacheName: 'images',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 120 * 24 * 60 * 60,
      purgeOnQuotaError: true,
    }),
  ],
}));

// Handle scripts
const scriptsRoute = new Route(({ request }) => {
  return request.destination === 'script';
}, new CacheFirst({
  cacheName: 'scripts',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
      maxEntries: 30,
      purgeOnQuotaError: true,
    }),
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
}));

// Handle styles
const stylesRoute = new Route(({ request }) => {
  return request.destination === 'style';
}, new CacheFirst({
  cacheName: 'styles',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
      maxEntries: 30,
      purgeOnQuotaError: true,
    }),
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
}));

// Handle fonts
const fontRoute = new Route(({ request }) => {
  return request.destination === 'font';
}, new StaleWhileRevalidate({
  cacheName: 'fonts',
  plugins: [
    new ExpirationPlugin({
      maxAgeSeconds: 120 * 24 * 60 * 60,
      purgeOnQuotaError: true,
    }),
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
  ],
}));

// Register runtime routes
registerRoute(contentRoute);
registerRoute(imageRoute);
registerRoute(scriptsRoute);
registerRoute(stylesRoute);
registerRoute(fontRoute);

// Set default caching strategy for any unmatched routes
setDefaultHandler(new StaleWhileRevalidate());

// Global fallback handler for routing failures
setCatchHandler(({ event }) => {
  switch (event.request.destination) {
    case 'document':
      return matchPrecache('pages/offline.html');

    case 'image':
      // SVG minified to a single line prevents the workbox parser from breaking
      return new Response(
        '<svg role="img" aria-labelledby="offline-title" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><title id="offline-title">Offline</title><g fill="none" fill-rule="evenodd"><path fill="#D8D8D8" d="M0 0h400v300H0z"></path><text fill="#9B9B9B" font-family="Helvetica Neue,Arial,Helvetica,sans-serif" font-size="72" font-weight="bold"><tspan x="93" y="172">offline</tspan></text></g></svg>',
        {
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store',
          },
        }
      );

    default:
      return Response.error();
  }
});
