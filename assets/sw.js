importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.4.1/workbox-sw.js');

const {matchPrecache, precacheAndRoute} = workbox.precaching;
const {Route, registerRoute, setDefaultHandler, setCatchHandler} = workbox.routing;
const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
const {ExpirationPlugin} = workbox.expiration;
const {CacheableResponsePlugin} = workbox.cacheableResponse;

// Inject precache manifest
precacheAndRoute(self.__WB_MANIFEST);

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
