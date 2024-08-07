// sw.js

self.addEventListener('install', () => {
  // Skip over the "waiting" lifecycle state, to ensure that our
  // new service worker is activated immediately, even if there's
  // another tab open controlled by our older service worker code.
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  // Optional: Get a list of all the current open windows/tabs under
  // our service worker's control, and force them to reload.
  // This can "unbreak" any open windows/tabs as soon as the new
  // service worker activates, rather than users having to manually reload.
  self.clients.matchAll({
    type: 'window'
  }).then(windowClients => {
    windowClients.forEach((windowClient) => {
      windowClient.navigate(windowClient.url);
    });
  });
});

// importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

// const {matchPrecache, precacheAndRoute} = workbox.precaching;
// const {Route, registerRoute, setDefaultHandler, setCatchHandler} = workbox.routing;
// const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
// const {ExpirationPlugin} = workbox.expiration;
// // Testing this plugin
// const {CacheableResponsePlugin} = workbox.cacheableResponse;

// precacheAndRoute([{"revision":"60a90cb5d546440a9ce235659bd215fe","url":"index.html"},{"revision":"ea37df846f4f136be3085f871ff2ea76","url":"404.html"},{"revision":"1669cbc438edcb107730e045ccf19edb","url":"offline.html"},{"revision":"abcbe11d1f0d578a3abf5538241bc45a","url":"fonts/Recursive.woff2"},{"revision":"e6141d69c681308d0448719b7bd5252f","url":"css/index.css"},{"revision":"ed61dda927f58a50adbea133e8adeff0","url":"images/cropped-Long_Room_Interior_Trinity_College_Dublin_Ireland.webp"}]);

// // Handle HTML documents
// const contentRoute = new Route(({ request }) => {
// 	return request.destination === 'document'
// }, new StaleWhileRevalidate({
// 	cacheName: 'Content',
// 	plugins: [
// 		new ExpirationPlugin({
// 			maxAgeSeconds: 120 * 24 * 60 * 60,
// 			purgeOnQuotaError: true,
// 		}),
// 	],
// }));

// // handle images
// const imageRoute = new Route(({ request }) => {
//   return request.destination === 'image'
// }, new CacheFirst({
//   cacheName: 'images',
// 	plugins: [
// 		new ExpirationPlugin({
// 			maxAgeSeconds: 120 * 24 * 60 * 60,
// 			purgeOnQuotaError: true,
// 		}),
// 	],
// }));

// // Handle scripts:
// const scriptsRoute = new Route(({ request }) => {
//   return request.destination === 'script';
// }, new CacheFirst({
//   cacheName: 'scripts',
// 	plugins: [
// 		new ExpirationPlugin({
// 			maxAgeSeconds: 30 * 24 * 60 * 60,
// 			maxEntries: 30,
// 			purgeOnQuotaError: true,
// 		}),
// 		new CacheableResponsePlugin({
//       statuses: [0, 200]
//     }),
// 	],
// }));

// // Handle styles:
// const stylesRoute = new Route(({ request }) => {
//   return request.destination === 'style';
// }, new CacheFirst({
//   cacheName: 'styles',
// 	plugins: [
// 		new ExpirationPlugin({
// 			maxAgeSeconds: 30 * 24 * 60 * 60,
// 			maxEntries: 30,
// 			purgeOnQuotaError: true,
// 		}),
// 		new CacheableResponsePlugin({
//       statuses: [0, 200]
//     }),
// 	],
// }));

// const fontRoute = new Route(({ request }) => {
// 	return request.destination === 'font'
// }, new StaleWhileRevalidate({
// 	cacheName: 'Content',
// 	plugins: [
// 		new ExpirationPlugin({
// 			maxAgeSeconds: 120 * 24 * 60 * 60,
// 			purgeOnQuotaError: true,
// 		}),
//     new CacheableResponsePlugin({
//       statuses: [0, 200]
//     }),
// 	],
// }));


// // Set default caching strategy for everything else.
// setDefaultHandler(new StaleWhileRevalidate());

// setCatchHandler(({event}) => {
//   switch (event.request.destination) {
//     case 'document':
//       return matchPrecache('pages/offline.html');
//     break;

//     case 'image':
//       return new Response(`<svg role="img"
//         aria-labelledby="offline-title"
//         viewBox="0 0 400 300"
//         xmlns="http://www.w3.org/2000/svg">
//         <title id="offline-title">Offline</title>
//         <g fill="none" fill-rule="evenodd">
//         <path fill="#D8D8D8" d="M0 0h400v300H0z"></path>
//         <text fill="#9B9B9B"
//             font-family="Helvetica Neue,Arial,Helvetica,sans-serif"
//             font-size="72" font-weight="bold">
//         <tspan x="93" y="172">offline</tspan></text></g>
//       </svg>`,
//     {
//       headers: {
//         'Content-Type': 'image/svg+xml',
//         'Cache-Control': 'no-store',
//       },
//     });
//     break;

//     default:
//       return Response.error();
//   }
// });


// // Register routes
// registerRoute(contentRoute);
// registerRoute(imageRoute);
// registerRoute(scriptsRoute);
// registerRoute(stylesRoute);
// registerRoute(fontRoute);
