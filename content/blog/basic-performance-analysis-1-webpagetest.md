---
title: Basic Performance Analysis (1) - WebPageTest
date: 2025-02-12
tags:
  - Web
  - Performance Optimization
  - User Experience
youtube: true
---

Performance has become a very important part of the development process. It is not always easy to do and it's even harder to do it right.

This post will cover some basics of performance as I understand it with different techniques and tools that can be used to measure performance.

## Assumptions

Before we look at the tools and techniques, let's look at some assumptions that we can make about performance:

Performance is location and time dependent
: Running the same tool at different times may produce different results. This is because the network conditions may change, the server may be under load, or the browser may be busy with other tasks.

The browser may be the bottleneck
: Just like time and location, the browser may become the performance bottleneck. Number of tabs and extensions, the amount of memory available, and the CPU speed can all affect the performance of the browser. This, in turn may affect performance testing. A good solution is to create a separate browser profile for testing.

Webpage Test is a commercial product
: While it is free to use, the free tier is limited in functionality and may not provide all the functionality you want. Keep this in mind when running tests

Mobile and Desktop will produce different results
: Mobile devices have different capabilities than desktop devices. This will affect the performance of the site. It is important to test on both platforms.

Even in mobile, the capabilities will vary significantly between devices.
: Mobile devices have asymmetric multi-core architectures, where different cores use different amounts of energy and will have different performance profiles. This will be more evident in lower end devices.
: It is important to test on a variety of devices to get a good idea of how the site will perform.

## Generating reports with Webpage Test

[Webpage Test](https://webpagetest.org) is a tool that can be used to generate reports on the performance of a website. It can be used to test the performance of a website on different devices and networks from different locations around the world.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/v1737311941/c_scale,w_500/f_auto,q_auto/webpage-test-01' alt="Webpage Test Homepage">
	<figcaption>Webpage Test Homepage</figcaption>
</figure>

In the homepage, the default is to run a site performance test with the specified URL. Other options are showin in figure 2: Lighthouse, Core Web Vitals and a visual comparison test (that I still can't figure out what it would be useful for).

In all cases the test would be used from a default location using a default configuration.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/v1737311941/c_scale,w_500/f_auto,q_auto/webpage-test-03' alt='Webpage Test Kinds of Test Pulldown'>
	<figcaption>Webpage Test Kinds of Test Pulldown</figcaption>
</figure>

You can customize the settings for your test by clicking on the "Advanced Settings" link.

In this settings block you can change following settings as shown in figure 3:

* The location you're testing from
* The browser used, either desktop or mobile emulations for specific devices
* The connection speed you want to test
* The number of tests to run, either a single test or a test, plus a repeat

There are other options that you can configure in other tabs in the advanced options, but we will not discus them in this post.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/v1737311941/c_scale,w_500/f_auto,q_auto/webpage-test-02' alt='Webpage Test Advanced Settings'>
	<figcaption>Webpage Test Advanced Settings</figcaption>
</figure>

Figures 4 and 5 show the list of locations and browsers that you can test from.

Locations are important because when we test we should account for potential network conditions that may impact performance.

Browsers, either physical or mobile emulations, will have different capabilities that may impact peformance.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/v1737311941/c_scale,w_500/f_auto,q_auto/webpage-test-04' alt='List of Custom Locations in Advanced Settings'>
	<figcaption>List of Custom Locations in Advanced Settings</figcaption>
</figure>

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/v1737311941/c_scale,w_500/f_auto,q_auto/webpage-test-05' alt='List of Custom Browsers and Mobile Emulations in the Advanced Settings'>
	<figcaption>List of Custom Browsers and Mobile Emulations in the Advanced Settings</figcaption>
</figure>

The way I normally run performance audits is to run the tests from multiple locations to establish a baseline for performance.

Every time we introduce a new feature or make changes to the site we run the same tests to see if there's been any impact on performance.

For the examples in the following sections I will use this blog ([The Publishing Project](https://publishing-project.rivendellweb.net)) as the test site.

I will also run with the following default connection settings:

* Mobile device to emulate: motog4
* Chrome version: 131
* Connection speed: 4G
* Testing location: Dulles, Virginia USA
* Network connectivity: 9000/9000
* How many tests to run: 1
* How many views for each test: 3

It is also important to notice that the device I chose to test with, the [Moto G4](https://www.gsmarena.com/motorola_moto_g4-8103.php), is a low-end device from 2016 and it has been discontinued; however, I would rather use this low-end device than risk using a high-end device that may not be representative of the majority of my users (not all users will have access to the high-end iPhone I do).

You should build your testing farm based on the devices your users use. You can gather this data from your analytics or your server logs.

### Fixing the reported issues

When I ran the tests the first time, I got several errors and warnings. I will go through the process of fixing them and retesting the site.

The results are presented in three areas:

* **Is it quick**
* **Is it usable**
* **Is it resilient**

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/v1737848562/webpage-test-06.png' alt='Results of performance tests'>
	<figcaption>Results of WebPageTest performance tests</figcaption>
</figure>

We will go through each of these areas and try to fix the problems that are reported.

Problem: **2 JavaScript files are blocking page rendering**.

There are two ways to fix this problem:

* **Defer the loading of the JavaScript files**. This will load the JavaScript files after the page has loaded. This will prevent the JavaScript files from blocking the rendering of the page
* **Inline the scripts**. This will not defer the load of the scripts but will reduce the number

I chose the first option and use the `defer` attribute in the script tag.

Instead of this:

```html
<script src="/js/prism.js"></script>
<script src="/js/algoliasearchNetlify.js"></script>
```

Change it to this:

```html
<script defer src="/js/prism.js"></script>
<script defer src="/js/algoliasearchNetlify.js"></script>
```

Problem: **3 externally-referenced CSS files are blocking page rendering.**.

This is more complex since the link element we use to load external CSS files does not have a `defer` attribute.

Like with scripts, there are two possible solutions:

* Use the `link rel="preload"` attribute to load the CSS files asynchronously
* Inline the CSS files

The preload value of the `link` element's rel attribute lets you declare fetch requests in the HTML's `head`, specifying resources that your page will need very soon, which you want to start loading early in the page lifecycle, before browsers' main rendering machinery kicks in. This ensures they are available earlier and are less likely to block the page's render, improving performance. Even though the name contains the term load, it doesn't load and execute the script but only schedules it to be downloaded and cached with a higher priority. (source: [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload))

Instead of these links to resources that we're using in every page of the site:

```html
<link rel="stylesheet" href="/css/algoliasearchNetlify.css" />
<link rel="stylesheet" href="/css/index.css"/>
<link rel="stylesheet" href="/css/prism.css"/>
```

Switch to using preload and the existing stylesheet link to make them less likely to block rendering:

```html
<link rel="preload" href="/css/algoliasearchNetlify.css"  as="style"/>
<link rel="stylesheet" href="/css/algoliasearchNetlify.css" />

<link rel="preload" href="/css/index.css" as="style"/>
<link rel="stylesheet" href="/css/index.css"/>

<link rel="preload" href="/css/prism.css" as="style"/>
<link rel="stylesheet" href="/css/prism.css"/>
```

Problem: **1 font is hosted on 3rd-party hosts**.

Bootstrap fonts are loaded from a CDN and are not hosted on the local site. This potentially slows down the site because the browser has to make an additional request to the CDN to get the font files.

The solution is to download the font files and host them locally.

The code currently imports the font remotely and attaches it to the `icons` layer. It is this CSS that imports the actual font files:

```css
@import url("bootstrap-icons.css")
layer(icons);
```

The first change we make is to download `bootstrap-icons.css` and the font file and host them locally.

in `bootstrap-icons.css` change the import font to the local file:

```css
@font-face {
  font-display: block;
  font-family: "bootstrap-icons";
  src: url("/fonts/bootstrap-icons.woff2") format("woff2")
}
```

I've used the absolute path to the font file to make sure that the browser can find it when the content is copied over to the server.

Problem: **Several fonts are loaded with settings that hide text while they are loading**.

This is usually a serious problem since we want users to interact with the text as quickly as possible. But this is an icon font so the problem is less serious.

The only solution is to change the font-display property in the CSS file to `swap`:

```css
@font-face {
  font-display: swap;
  font-family: "bootstrap-icons";
  src: url("/fonts/bootstrap-icons.woff2") format("woff2");
}
```

I've also chosen to only use the `woff2` format for the font file. This is because it is the most efficient format for the web and is baseline widely available.

Problem: **The main thread was blocked for 765 ms**

Due to it's single threaded nature, Javascript is sensitive to longer scripts that block the main thread.

The two main culprits are shown in the table below:

| script | duration |
| --- | :---: |
| prism.js | 673 ms |
| algoliasearchNetlify.js | 237 ms |

I will address the prism.js script. Because of laziness, I've chosen to load all potential languages and plugins in one script that will be loaded in every page of the site.

the first step is to look at the [autoloader](https://prismjs.com/plugins/autoloader/) plugin. According to its documentation:

> The plugin will automatically handle missing grammars and load them for you. To do this, you need to provide a URL to a directory of all the grammars you want. This can be the path to a local directory with all grammars or a CDN URL.

The idea is that the grammars that are not bundled with Prism core, will be loaded on demand. This will reduce the size of the script and the time it blocks the main thread.

We first load the core Prism script and the autoloader plugin. This should take care of loading most grammars on demand.

```html
<script src="js/prism/components/prism-core.js"></script>
<script src="js/prism/plugins/autoloader/prism-autoloader.js"></script>
```

Another thing we can do is to conditionally load Prism only on pages that need it. This will further improve performance by no loading the script everywhere by default.

We do this by introducing conditional Handlebars logic in the page template to only load Handlebars assets when needed.

{{ raw }}
```html
{% if prism %}
	<script src="/js/prism/components/prism-core.js"></script>
	<script src="/js/prism/plugins/autoloader/prism-autoloader.js"></script>
	<link rel="preload" href="/css/prism.css" as="style"/>
	<link rel="stylesheet" href="/css/prism.css"/>
{% endif %}
```
{{ endraw}}

This way we can load Prism only on pages that need it. For example, we can enable it by default for all or blog posts we can add it to the configuration for the blog posts (`blog.11tydata.js`).

I've edited the file to only include the relevant portion.

```js
module.exports = {
	prism: true,
	youtube: false,
	vimeo: false,
	mermaid: false,
	mavo: false,
};
```

All these fixes should improve the performance of the site. However, WebPageTest keeps telling me that fonts are using `font-display: block` and that a font is hosted in an external CDN instead of locally. Neither of these are true.

In the next post we'll look at Core Web Vitals, what they are, how to measure them and what they mean for your site.

## Links and resources

* Webpage Test
  * [WebPageTest](https://webpagetest.org)
  * [A Complete Guide to Using WebPageTest (and Interpreting the Results)](https://kinsta.com/blog/webpagetest/)
  * [WebPageTest Tutorials](https://product.webpagetest.org/tutorials/)
* Potential Performance Fixes
  * [The Simplest Way to Load CSS Asynchronously](https://www.filamentgroup.com/lab/load-css-simpler/)
  * [rel=preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) &mdash; MDN
  * [Preload: What Is It Good For?](https://www.smashingmagazine.com/2016/02/preload-what-is-it-good-for/)
  * [script defer property](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/defer)
