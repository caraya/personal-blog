importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

const {precacheAndRoute} = workbox.precaching;
const {Route, registerRoute, setDefaultHandler, setCatchHandler} = workbox.routing;
const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
const {CacheableResponsePlugin} = workbox.cacheableResponse;
const {ExpirationPlugin} = workbox.expiration;

precacheAndRoute([{"revision":"a76aa635a669c7605cb9b75c5d25132e","url":"index.html"},{"revision":"f3f8960aa1c15a670c3df60826bf7cc1","url":"404.html"},{"revision":"9bc14ec24f8b9c263f0b7240d89c59ef","url":"offline.html"},{"revision":"abcbe11d1f0d578a3abf5538241bc45a","url":"fonts/Recursive.woff2"},{"revision":"e6141d69c681308d0448719b7bd5252f","url":"css/index.css"},{"revision":"ed61dda927f58a50adbea133e8adeff0","url":"images/cropped-Long_Room_Interior_Trinity_College_Dublin_Ireland.webp"}]);

const contentRoute = new Route(({ request }) => {
	return request.destination === 'document'
}, new StaleWhileRevalidate({
	cacheName: 'Content',
	plugins: [
		new ExpirationPlugin({
			maxAgeSeconds: 120 * 24 * 60 * 60,
			purgeOnQuotaError: true,
		}),
	],
}));

// handle images
const imageRoute = new Route(({ request }) => {
  return request.destination === 'image'
}, new CacheFirst({
  cacheName: 'images',
	plugins: [
		new ExpirationPlugin({
			maxAgeSeconds: 120 * 24 * 60 * 60,
			purgeOnQuotaError: true,
		}),
	],
}));

// Handle scripts:
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
      statuses: [0, 200]
    }),
	],
}));

const fontRoute = new Route(({ request }) => {
	return request.destination === 'image'
}, new StaleWhileRevalidate({
	cacheName: 'Images',
	plugins: [
		new ExpirationPlugin({
			maxAgeSeconds: 120 * 24 * 60 * 60,
			purgeOnQuotaError: true,
		}),
    new CacheableResponsePlugin({
      statuses: [0, 200]
    }),
	],
}));

// Set default caching strategy for everything else.
setDefaultHandler(new StaleWhileRevalidate());

setCatchHandler(({event}) => {
  switch (event.request.destination) {
    case 'document':
      return matchPrecache('pages/offline.html');
    break;

    case 'image':
      return new Response(`<svg role="img"
        aria-labelledby="offline-title"
        viewBox="0 0 400 300"
        xmlns="http://www.w3.org/2000/svg">
        <title id="offline-title">Offline</title>
        <g fill="none" fill-rule="evenodd">
        <path fill="#D8D8D8" d="M0 0h400v300H0z"></path>
        <text fill="#9B9B9B"
            font-family="Helvetica Neue,Arial,Helvetica,sans-serif"
            font-size="72" font-weight="bold">
        <tspan x="93" y="172">offline</tspan></text></g>
      </svg>`,
    {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store',
      },
    });
    break;

    default:
      return Response.error();
  }
});
