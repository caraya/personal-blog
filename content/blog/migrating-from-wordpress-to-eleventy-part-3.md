---
title: "Migrating from WordPress to Eleventy (part 3)"
date: "2023-11-22"
draft: false
---

These are more random, miscelaneous, items that I'm working on to make the site look as close as possible to the WordPress version of the site.

## Implement Archive Pagination

The way I want the blog structured, the index page only has the last 10 published posts and a link to the archive.

In the first iteration, I want the archive to be paginated on 10-item blocks.

```yaml
---
layout: layouts/home.njk
pagination:
  data: collections.posts
  size: 10
  reverse: true
permalink: "{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber }}/{% endif %}index.html"
---
```

The content of the post itself doesn't change. It remains the same.

We add a new template that will handle the pagination.

{# provide explanation for the code here #}

{% raw %}
```liquid
  {% if pagination.pageLinks.length > 1 %}
    <h2 class="visually-hidden">Archive Navigation</h2>
    <nav class="archive-pagination">
      {% if pagination.pageNumber + 1 < 2 %}
        <p>&nbsp;</p>
      {% else %}
        {% if pagination.href.previous %}
          <a class="archive-pagination__item" href="{{ pagination.previousPageHref | url }}">Newer Articles</a>
        {% endif %}
      {% endif %}
      <a class="archive-pagination__item" href="/">Home</a>
      {% if pagination.href.next %}
        <a class="archive-pagination__item" href="{{ pagination.nextPageHref | url }}">Older Articles</a>
      {% endif %}
    </nav>
  {% endif %}
```
{% endraw %}

In future iterations we'll improve the layout and the usability for the navigation.

## Maintaining the same structure than WordPress

One important thing is to keep the existing flat structure of the blog in Eleventy.

Rather than use a date-based structure like

```text
/year/month/day/post-slug
```

I chose to use a flat, website-like structure

```text
/post-slug/
```

This has proved more challenging than I expected. The default is to push the individual posts to a blog directory,  then use the slug as the directory name and name the file as `index.html`:

```text
/blog/post-slug/index.html
```

In order to fix this, we'd have to insert a permalink attribute to all the posts that already exist and those we create in the future.

Eleventy provides a [directory data file](https://www.11ty.dev/docs/data-template-dir/) that will propagate to all the files in the directory. This means we don't have to add this data to each individual file.

If there is no permalink, look for a slug in the data. If there is no slug, just use the slugify filter on the title

```js
module.exports = {
  permalink: function (data) {
    const slug = data.slug ?? this.slugify(data.title);

    return `/${slug}/index.html`;
  },
    tags: [
    "posts"
  ],
  "layout": "layouts/post.njk",
  "youtube": true,
  "vimeo": true,
  "mermaid": false,
  "mavo": false,
  };
  ```

## Handling drafts and future postings

One thing that has been very frustrating is to figure out how to handle drafts and future posts (posts that are complete but will not be published for a while).

This snippet will handle both situations.

If a page has `draft: true` in its YAML frontmatter or the date is in the future from the time you publish the site, then this snippet will set its permalink to false and exclude it from all collections.

For dev builds (where we don't set `NODE_ENV=production`) we will always render the full site with all drafts and future posts.

Taken from [Eleventy issue #26](https://github.com/11ty/eleventy/issues/26)

In order to do this we have to change the permalink that we set in the previous section and make it a computed variable to handle the conditions for execution.

```js
	eleventyComputed: {
     permalink: data => {
      if (process.env.NODE_ENV === 'production' && (data.draft || data.page.date >= new Date())) {
        return false;
      }

      return data.permalink;
    },

		eleventyExcludeFromCollections: data => {
      if (process.env.NODE_ENV === 'production' &&  (data.draft || data.page.date >= new Date())) {
        return true;
      }

      return false;
    }
  },
```

## Conditionally loading assets

Rather than load every asset in every page, whether needed, or not, I decided to load assets only on the posts they are needed. Just like with draft posts, this requires adding items to the post's frontmatter.

We have four types of assets we want to conditionally load:

* mavo (for the Mavo library)
* vimeo (for lite-vimeo)
* youtube (for lite-youtube)
* mermaid (for mermaid)

If you set any of these values to true in the frontmatter, like so,

```yaml
---
youtube: true
mermaid: true
---
```

It will load the assets for that particular type of content.

In our base template (`includes/base.njk` for my site) I've added the following combination of Nunjuck templates and HTML code.

They use different ways to load the content:

* mavo and lite-youtube load content from the same site using HTML `script` and `link` tags.
* lite-vimeo loads its content from a CDN.
* mermaid loads content using an Eleventy shortcode.

{% raw %}
```html
{% if mavo %}
	<link rel="stylesheet" href="https://get.mavo.io/mavo.css"/>
	<script src="https://get.mavo.io/mavo.js"></script>
{% endif %}
{% if vimeo %}
	<script defer type="module" src="https://cdn.jsdelivr.net/npm/@slightlyoff/lite-vimeo@0.1.1/lite-vimeo.js"></script>
{% endif %}
{% if youtube %}
	<link rel="stylesheet" href="/css/lite-yt-embed.css"/>
	<script defer src="/js/lite-yt-embed.js"></script>
{% endif %}
{% if mermaid %}
	{% mermaid_js %}
{% endif %}
```
{% endraw %}

## Adding a service worker

Adding a service worker to an Eleventy site is less straightforward than I thought it would be.

There are Eleventy plugins that will add a service worker, but they will precache every asset on the site. Obviously that's not what I wanted to I left that idea on the side and decided to handcraft my own.

For the first iteration of the service worker, I decided to use [Workbox](https://developer.chrome.com/docs/workbox/) to make my life easier.

The service worker, as currently designed, is broken into two parts:

1. The Workbox configuration file
2. The service worker

### The Workbox configuration file

The Workbox configuration file gives Workbox information about the service worker and files we want to precache.

`globDirectory` is the directory relative to use as the base.

`globPattern` is a list of one or more files we want to precache, relative to the `globDirectory`

`swSrc` is the location of the original service worker file and `swDest` is the location where we want to place the service worker when processing.

```js
module.exports = {
  'globDirectory': '_site',
  'globPatterns': [
		// code removed for brevity
  ],
  'swSrc': 'assets/sw.js',
  'swDest': '_site/sw.js',
};
```

### The service worker

The service worker file presented below is the source for processing. I've broken the file in sections to make commenting it easier.

The first part is to import the scripts that we'll use. We import the Workbox library using [importScripts](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts) and then require the specific modules using constants.

```js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js');

const {precacheAndRoute} = workbox.precaching;
const {Route, registerRoute, setDefaultHandler, setCatchHandler} = workbox.routing;
const {StaleWhileRevalidate, CacheFirst} = workbox.strategies;
const {ExpirationPlugin} = workbox.expiration;
```

The most important part of the service worker is `precacheAndRoute(self.__WB_MANIFEST);`, This is where Workbox will insert the files we specified in the configuration file.

```js
precacheAndRoute(self.__WB_MANIFEST);
```

I chose to create multiple routes for different types of content rather than create a single route that would cache everything.

There are multiple reasons why to do this:

* The caches are likely to be smaller so we have less worries about caches filling up and purging content
* Different content may have different expiration times
* Having separate caches makes it easier to limit the number of items of a certain category.

```js
// Handle HTML documents
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
	],
}));

// Handle styles:
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
	],
}));

// handle fonts
const fontRoute = new Route(({ request }) => {
	return request.destination === 'font'
}, new StaleWhileRevalidate({
	cacheName: 'Content',
	plugins: [
		new ExpirationPlugin({
			maxAgeSeconds: 120 * 24 * 60 * 60,
			purgeOnQuotaError: true,
		}),
	],
}));
```

We now set a default handler using [setDefaultHandler](https://developer.chrome.com/docs/workbox/reference/workbox-routing/#method-setDefaultHandler) to handle when no routes match the request, and a catch handler using [setCatchHandler](https://developer.chrome.com/docs/workbox/reference/workbox-routing/#method-setCatchHandler) to provide fallbacks in case the request fails.

```js
// Set default caching strategy for everything else.
setDefaultHandler(new StaleWhileRevalidate());

setCatchHandler(({event}) => {
  switch (event.request.destination) {
    case 'document':
      return matchPrecache('offline.html');
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
```

The last step in the service worker code is to register the routes using [registerRoute](https://developer.chrome.com/docs/workbox/reference/workbox-routing/#method-registerRoute) so Workbox is aware of them and uses them to match incoming requests.

```js
registerRoute(contentRoute);
registerRoute(imageRoute);
registerRoute(scriptsRoute);
registerRoute(stylesRoute);
registerRoute(fontRoute);
```

### Building the full service worker

To inject the precache files into the service worker, I use [workbox-cli](https://developer.chrome.com/docs/workbox/modules/workbox-cli/) NPM package.

First, the installation:

```bash
npm i -D workbox-cli
```

then we just need to run it passing the command you want to run, `injectManifest`, and the location of the Workbox configuration file `workbox-config.js` as parameters:

```bash
npx workbox-cli injectManifest ./workbox-config.js
```

This will produce a ready to use service worker.
