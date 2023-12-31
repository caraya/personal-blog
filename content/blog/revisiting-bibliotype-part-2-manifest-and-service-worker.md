---
title: "Revisiting Bibliotype Part 2: Manifest and Service Worker"
date: "2018-09-03"
---

The rest of the project deals with additional "nice to have" items that will make this into a full-fledged PWA.

### Remaining issues with (S)CSS and Javascript

The function that makes the font size smaller doesn't check if the font has reached a minimal size. It can be made small enough to be unreadable. We should put a check to make sure that the font size doesn't get below a certain value.

My first pass at a fix modifies the smaller event listener to restrict the minimum font size. The idea is that if the value is smaller than a value we set (0.75 in this case) we force the value to be the value we set.

This will prevent the font from growing too small to read.

```javascript
smaller.addEventListener('click', function(e) {
  const style = window.getComputedStyle(document.documentElement);
  const fontSize = style.getPropertyValue('--body-font-size');
  const calcFont = parseFloat(fontSize);
  if (fontSize > 0.75) {
    setRootVar('body-font-size', calcFont - 0.1);
  } else {
    setRootVar('body-font-size', 0.75);
  }
});
```

Right now the menu button is setup to show the menu and do nothing if it's already showing. We need a toggle to show and hide the menu accordingly.

```javascript
const menuButton = document.getElementById('menuButton');
  menuButton.addEventListener('click', function(e) {
  const style = window.getComputedStyle(document.documentElement);
  const menuStatus = style.getPropertyValue('--menu-visibility');
  if (menuStatus == 'hidden') {
    setRootVar('menu-visibility', 'show');
  } else {
    setRootVar('menu-visibility', 'hidden');
  }
});
```

### Store settings in the user's browser

Rather than force the user to set their settings on every visit is to store the settings on the user's browsers using [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage). It will save the last item clicked on each category and will then store those settings in the user's browser for retrieval on the next visit.

Getting this to work is a two-step proocess.

The first step is to modify our event listeners to create/set a key/value pair in our local storage box.

Taking the justify click event handler definition, it now looks like this.

```javascript
  justify.addEventListener('click', function(e) {
    setRootVar('content-justify', 'justify');
    localStorage.setItem('content-justify', 'justify');
  });
```

We've added the call to `localStorage.setItem` and pass the names of the key and value as string.

The second step is more tedious. For each of the event listeners we created and each key/value pair we stored in local storage we do the following:

1. Test if the value exists by making sure it's not null. The spec says that if a we use `localStorage.getItem` in a non-existing value, the return value is null
2. Set the CSS variable using `setRootVar` with the name of the property and the return of `localStorage.getItem`

We then execute the function to make sure that it runs as soon as possible.

The example below has been stripped down to only show `content-justify` as an example, the same event listener that we looked at earlier in the section.

```javascript
function loadSettings() {
  // content removed for brevity

  if (localStorage.getItem('content-justify') !== null) {
    setRootVar('content-justify',
      localStorage.getItem('content-justify'));
  }

  // More content removed
}

loadSettings();
```

What I like about this method of setting and saving preferences is the flexibility it gives us.

We don't have to modify all the settings between visits, whatever items changed since your last visit will be reflected in localStorage and will be reflected in subsequent visits, the items that have not changed will fail their respective test and not change.

One last thing that we may need is a reset button to acommodate the need for all settings to be wiped out from the user's browser.

### Adding Metadata

The first thing in this section is not strictly related to PWAs but it has more to do with search engines and discoverability.

We'll mark up the code with \[JSON-LD(https://json-ld.org/) based on the [article](https://developers.google.com/search/docs/data-types/article) and [example](https://search.google.com/structured-data/testing-tool)

```html
<script type="application/ld+json"> {
  "@context": "http://schema.org",
  "@type": "Article",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://caraya.github.io/bibliotype2/"
  },
  "headline": "Monsters of Mars",
  "alternativeHeadline": "TA Complete Novelette robots and stuff",
  "image": "https://www.gutenberg.org/files/30452/30452-h/images/image_003.jpg",
  "author": {
    "@type": "Person",
    "name": "Edmond Hamilton"
  },
  "editor": {
    "@type": "Person",
    "name": "John Campbell"
  },
  "genre": "science Fiction",
  "keywords": "scifi astounding campbell",
  "wordcount": "13155",
  "publisher": {
    "@type": "Organization",
    "name": "Readers Guild, Inc",
    "logo": {
      "@type": "ImageObject",
      "url": "http://central.gutenberg.org/img/ProjectGutenberg.jpg"
    }
  },
  "url": "https://caraya.github.io/bibliotype2/",
  "datePublished": "1931-04-01",
  "dateCreated": "2018-08-25",
  "dateModified": "2018-08-25",
  "description": "Story from the April 1931 issue of Astounding Stories"
  }
  </script>
```

When the Google crawler (and any other crawler that understands JSON-LD) crawls the document it will get the additional information listed in the JSON-LD script and provide additional features for the page in the results page.

## The Gravy (V3): Making a PWA Out of You

The final active development stage is to generate assets to turn the application into a PWA

#### Create a Web Manifest

Using a [manifest generator](https://app-manifest.firebaseapp.com/) I was able tp generate the JSON manifest itself as well as the icons necessary for the manifest.

The JSON file is simple, it's listed below.

```json
{
  "name": "Monsters from Mars",
  "short_name": "monsters",
  "theme_color": "#2196f3",
  "background_color": "#2196f3",
  "display": "standalone",
  "Scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "images/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "images/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    }
  ],
  "splash_pages": null
}
```

#### Create a Service Worker

A service worker will provide a better experience for users. The idea behind our service worker is simple:

It will precache the minimum set of assets (HTML, CSS and Javascript) to display the content.

It will then cache additional assets like fonts and images using a cache first strategy; check if the resource is in the cache and if it is serve it from there but, if it's not, then fetch it from the network.

The first step is to register the service worker. This step is the same regardless of how you create the worker. It is important to notice that the script you reference here must live at the root of your app/site for it to work effectively.

```javascript
// Check that service workers are registered
if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}
```

For the rest of the steps, we'll use [workbox.js](https://developers.google.com/web/tools/workbox/), a set of libraries from Google that makes it easier to work with service workers.

Install the package globally to make the commands available on your terminal.

```bash
npm i -g workbox-build
```

I've chosen the longer route that involves my creating a pre-caching service worker with additional routes to handle special cases.

Based on the tutorials on the workbox.js site I created the following service worker:

```javascript
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

  // point where we'll mount the precache manifest files
  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    // Cache CSS files
    /.*\.css/,
    // Use cache but update in the background ASAP
    workbox.strategies.staleWhileRevalidate({
      // Use a custom cache name
      cacheName: 'css-cache',
    })
  );

  workbox.routing.registerRoute(
    /.*\.(?:otf|ttf|woff|woff2)/,
    workbox.strategies.cacheFirst({
      cacheName: 'fonts-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 4,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    // Cache image files
    /.*\.(?:png|jpg|jpeg|svg|gif)/,
    // Use the cache if it's available
    workbox.strategies.cacheFirst({
      // Use a custom cache name
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.Plugin({
          // Cache only 20 images
          maxEntries: 20,
          // Cache for a maximum of 30 days
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
      ],
    })
  );
```

`workbox.precaching.precacheAndRoute([]);` is where we'll inject the assets we want to precache so it's ok that it's empty for now.

The other three routes are for additional resources matched by regular expressions.

The first one will match all CSS files that were not precached using the `/.*\.css/` regular expression. This route uses the stale while revalidate caching strategy: It's ok to use resources in the cache while the browser goes fetch an updated version in the background for the next visit.

The second route matches all major font formats (TTF, OTF, WOFF, and WOFF2), puts them in a separate cache for fonts (`fonts-cache`) and restricts the number of items in the cache. This route uses a cache first strategy: Check if the resource is in the cache and, if it is, use it. If it's not in the cache then fetch it from the network and put it in the cache for later visits.

The last route matches images (PNG, JPG, SVG, and GIF), puts them on an `image-cache`, restricts the number of items to 20 and expires the items after 30 days (measured in seconds). This cache also uses cache first as the images once added are not likely to change.

To generate the files to precache we run the command below from the terminal.

```bash
workbox wizard --injectManifest
```

The wizard will ask you questions about where you store the code that will run the application and, based on your answer, what assets you want to precache.

For this particular version, I told it I only wanted to precache CSS, Javascript, and HTML. We need to be careful with what we precache and what we cache after the first load.

The command will generate a `workbox.config` file that we can tweak later. The file looks like this:

```javascript
module.exports = {
  'globDirectory': '.',
  'globPatterns': [
    '**/*.{css,html,js}',
  ],
  'globIgnores': [
    '**/node_modules/**/*',
    '**/sw.js',
    'workbox-config.js',
  ],
  'swDest': 'sw.js',
  'swSrc': 'js/sw.js',
};
```

The last step is to have Workbox insert the files that match the manifest using the following command:

```bash
workbox injectManifest workbox-config.js
```

This will insert code like the one below into the service worker. This is the minimal setup to render the page's above the fold content (and in this case the entire page).

We cache fonts the first time the user changes them or interacts with them and they will be available locally without requiring network resources.

```javascript
// point where we'll mount the precache manifest files
workbox.precaching.precacheAndRoute([
  {
    'url': 'css/master.css',
    'revision': '588aa989df5b9bb1f59aa6d22cba0cb6',
  },
  {
    'url': 'index.html',
    'revision': '708da8295998f6e46d9a4ecd13ae9dad',
  },
  {
    'url': 'js/bibliotype.js',
    'revision': '37efaf4d7f4bb690833bd11f0449c4af',
  },
]);
```

And that's it, we now have a service worker doing most of the work to provide better and faster user experiences for our users.
