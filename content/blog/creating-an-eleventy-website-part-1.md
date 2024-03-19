---
title: "Creating an Eleventy Website (Part 1)"
date: 2024-03-25
tags:
  - Eleventy
  - Design
  - Build
---

I used WordPress until 2023 when I became disappointed as to the direction the project was going and how much harder blocks make it to create bespoke designs the way I'm used to.

So I decided to move to [Eleventy](https://www.11ty.dev/) because most of the sites I build are static and have no server-rendered components.

My first project was to move my web technology blog to Eleventy. There are still some issues I have to address, like auto-posting to Twitter/X when new posts are published but, on average, it has been really good.

So now I'm thinking of a new project to replace my old personal blog that was removed from the old host and hasn't been updated in a while.

This post will outline the process of creating the new site, the mistakes I made on the WordPress site and the creation and population process of the new Eleventy site.

## Installing Eleventy

Basic installation is no different from any other application. We first initialize an empty Node project using default values like so:

```bash
npm init --yes
```

The next step is to install Eleventy. I've chosen to install the latest Canary version (3.0.0-alpha5 as of this writing) to futureproof the project.

```bash
npm install -D @11ty/eleventy@canary
```

To test it we run Eleventy using NPX.

```bash
npx @11ty/eleventy

# Should return something like:
# [11ty] Wrote 0 files in 0.02 seconds (v3.0.0-alpha.5)
```

So now we're ready to start building

We'll see what additional packages we need and how to install them later.

## Configuring Eleventy

I usually configure Eleventy first and then build the templates that I want to use.  We'll talk about templates later in the post.

We first require all the packages we will use. Note that this doesn't include PostCSS modules. We'll do that separately in a later section

```js
const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItDefList = require("markdown-it-deflist");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFigures = require("markdown-it-image-figures");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const markdownItAttrs = require('markdown-it-attrs');

const pluginRss = require("@11ty/eleventy-plugin-rss");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const posthtml = require('posthtml');
const { posthtml: automaticNoopener, parser } = require('eleventy-plugin-automatic-noopener');
const NoOpOptions = parser({ noreferrer: true });
const metagen = require('eleventy-plugin-metagen');
```

Next, we initialize the configuration file and copy static files from their source directories.

```js
module.exports = function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./assets/manifest.json": "/manifest.json",
		"./node_modules/lite-youtube-embed/src/lite-yt-embed.css": "/css/lite-yt-embed.css",
		"./node_modules/lite-youtube-embed/src/lite-yt-embed.js": "/js/lite-yt-embed.js",
	});
```

In the next section, we add plugins. Note that these plugins will enhance Eleventy, not the Markdown parser.

```js
	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

	eleventyConfig.addPlugin(emojiReadTime, {
		showEmoji: false,
	});
	eleventyConfig.addPlugin(metagen);
```

Transforms modify the contents of a template that has already been rendered by its engine. They are permitted to operate asynchronously, making them the ideal place in Eleventy’s lifecycle to convert placeholder data into rendered content or to insert.

In this example, we use a transform function to insert the result of the `automaticNoopener` function and return the modified HTML.

For more information on transform functions, see [Using Eleventy transforms to render asynchronous content inside Nunjucks macros](https://multiline.co/mment/2022/08/eleventy-transforms-nunjucks-macros/)

```js
	eleventyConfig.addTransform('posthtml', function (HTMLString, outputPath) {
		if (outputPath && outputPath.endsWith('.html')) {
			return posthtml([
				automaticNoopener(NoOpOptions),
			])
				.process(HTMLString)
				.then(result => result.html);
		} else {
			return HTMLString;
		}
	});
```

The last step is to add Eleventy filters related to date manipulation. Most of the examples use the [Luxon](https://moment.github.io/luxon/#/). I'm debating whether to use the [Temporal](https://github.com/js-temporal/temporal-polyfill) polyfill even with all its current limitations.

We can add other necessary filters later.

```js
  eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "LLLL dd yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
	});
```

The project runs a customized version of Markdown-it where we can add Markdown options for the parser and plugins to enhance functionality.

```js
	// MARKDOWN CUSTOMIZATIONS
	// 1. Markdown Options
	let options = {
		html: true,
		breaks: false,
		linkify: false,
	};

	// 2. Use the custom library
	eleventyConfig.setLibrary("md", markdownIt(options));

	// 3. Configure Markdown-It plugins
	eleventyConfig.amendLibrary("md", mdLib => {
		mdLib.use(markdownItDefList),
		mdLib.use(markdownItFigures, {
			figcaption: 'alt',
			lazy: true,
			async: true,
			classes: 'lazy'
		});
		mdLib.use(markdownItAttrs, {
			// Default options
			leftDelimiter: '{',
			rightDelimiter: '}',
			// All attributes are allowed
			allowedAttributes: []
		});
	});
```

The final step is to configure items that directly affect Eleventy output.

* **templateFormats**: contains the extensions for the supported template formats.
* **markdownTemplateEngine**: The default global template engine to pre-process markdown files. Use false to avoid pre-processing and only transform markdown.
* **htmlTemplateEngine**: The default global template engine to pre-process HTML files. Use false to avoid pre-processing and passthrough copy the content (HTML is not transformed, so technically this could be any plaintext).

The `dir` array

```js
	return {
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		markdownTemplateEngine: "njk",
		htmlTemplateEngine: "njk",

		dir: {
			input: "content",
			includes: "../_includes",
			data: "../_data",
			output: "_site"
		},

		// Optional items:
		// pathPrefix: "/",
	};
};
```

Right now the configuration works but we have no templates to work with, so we'll tackle that next.

## Creating The Site Structure and Templates

Before we create content and templates we need to decide on a site structure to build the site on.

This feature will match the directory structure we defined in our configuration:

_includes
: Templates and partials

_data
: Any JSON file or data source to work

assets
: Additional files to be copied into the production folder

public
: Static assets

content
: Where all user content will be added

_site
: The converted site ready to publish

```text
.
├── _data
├── _includes
├── assets
├── content
├── _site
├── eleventy.config.js
├── package-lock.json
├── package.json
└── public
```

With the structure in place, the next step is to look at a basic template that will wrap around more specific template partials and Markdown content.

The template looks messy (and in a way, it is) but it does everything we want it to.

All the content enclosed in double mustaches or curly brackets `{{` and `}}` are [Nunjucks variables](https://mozilla.github.io/nunjucks/) that will be populated with data from each page.

For example, the following HTML declaration

```html
<html lang="\{\{ language or metadata.language }}">
```

Will use either the `language` or `metadata.language` attributes from the metadata on the page or the metadata hierarchy for the site.

Another trick is to conditionally load assets.

For example, the following block will only be added to the page if we include `youtube: true` in the front matter.

We also provide conditional loading for [Mavo](https://mavo.io/), [lite-vimeo](https://github.com/slightlyoff/lite-vimeo/blob/master/README.md) (a Vimeo player web component) and [lite-youtube](https://github.com/paulirish/lite-youtube-embed) (a YouTube player web component).

```html
{% raw %}
{% if youtube %}
	<link rel="stylesheet" href="/css/lite-yt-embed.css"/>
	<script defer src="/js/lite-yt-embed.js"></script>
{% endif %}
{% endraw %}
```

The body is where most of the work happens.

We use a combination of HTML, Nunjucks [import](https://mozilla.github.io/nunjucks/templating.html#import) and [include](https://mozilla.github.io/nunjucks/templating.html#import) tags to build the content.

This is similar to how we used PHP in classic WordPress, but with a different language and a different syntax (Nunjucks is based on the [Jinja templating engine](https://jinja.palletsprojects.com/en/3.1.x/)).

It is also important to note that Eleventy doesn't sanitize its output so you need to be careful. I can get away with using markup as-is because I write all the content that gets transformed into HTML. If you cannot guarantee that your content is safe, you should always escape the content to prevent [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/) attacks.

```html
	{% raw %}
  <body>
    {% import "_nav.njk" as nav with context %}
    <a href="#skip" class="visually-hidden">Skip to main content</a>
    <div class="grid-container">
      <img
        class="full-bleed-header"
        fetchpriority="high"
        decoding="async"
        src="<url for the image>"
        alt="Dublin Library"
        width="1564"
        height="389"/>
      <header>
        <h1>
          <a href="/" class="home-link">{{ site_name or metadata.site_name }}</a>
        </h1>
      </header>
      <nav id="nav-top-menu-container" class="nav-container">
        <ul class="nav-top-menu">
          {{ nav.render(nav_links, "nav-top-menu-container") }}
        </ul>
      </nav>
      <main id="skip">
        {{ content | safe }}
      </main>
      <footer>
        <div class="left-footer">
          <section class="social">
            <h4>Social Me</h4>
            {%- include "_social.njk" -%}
          </section>

          <section classs="latest">
            <h4>Latest Posts</h4>
            {%- include "_latest.njk" -%}
          </section>
        </div>

        <div class="right-footer">
          <h4>Search</h4>
            <div id="search"></div>

          <nav id="nav">
            <h4>Links</h4>
            <div class="nav-container">
              <ul class="nav-footer-menu">
                {{ nav.render(nav_links, "footer") }}
              </ul>
            </div>
          </nav>
        </div>
      </footer>
    </div>
  </body>
</html>
{% endraw %}
```

The templates work and they render a page. We have more work to do with creating content and additional layouts.
