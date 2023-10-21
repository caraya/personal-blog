// External libraries
const { DateTime } = require("luxon");
// Custom filters from https://github.com/LeaVerou/lea.verou.me/blob/main/assets/filters.cjs
// Looking to trim the fat
const filters = require("./assets/filters");

// Custom markdown-it installation to customize it
const markdownIt = require("markdown-it");
// Markdownit plugins
const markdownItAnchor = require("markdown-it-anchor");
// added by Carlos
const markdownItDefList = require('markdown-it-deflist');
const markdownItFigures = require("markdown-it-image-figures");
const pluginMermaid = require("@kevingimbel/eleventy-plugin-mermaid");
const emojiReadTime = require("@11tyrocks/eleventy-plugin-emoji-readtime");
const markdownItFootnotes = require("markdown-it-footnote");
const admonitions = require("markdown-it-admonition");
const markdownItKbd = require('markdown-it-kbd-better');
const markdownItAttrs = require('markdown-it-attrs');

// 11ty plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

const pluginDrafts = require("./eleventy.config.drafts.js");
const pluginImages = require("./eleventy.config.images.js");

// Added by Carlos
// AutomaticNoOpener
const posthtml = require('posthtml');
const { posthtml: automaticNoopener, parser } = require('eleventy-plugin-automatic-noopener');
const NoOpOptions = parser({noreferrer: true});
const pluginTOC = require('eleventy-plugin-toc');

module.exports = function(eleventyConfig) {
	// Copy the contents of the `public` folder to the output folder
	// For example, `./public/css/` ends up in `_site/css/`
	eleventyConfig.addPassthroughCopy({
		"./public/": "/",
		"./content/admin/": "/admin",
		"./node_modules/lite-youtube-embed/src/lite-yt-embed.css": "/css/lite-yt-embed.css",
		"./node_modules/lite-youtube-embed/src/lite-yt-embed.js": "/js/lite-yt-embed.js",
		"./content/manifest.json": "/manifest.json",
		"./node_modules/prismjs/themes/prism-solarizedlight.css": "/css/prism-solarizedlight.css"
	});

	// Run Eleventy when these files change:
	// https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

	// App plugins
	eleventyConfig.addPlugin(pluginDrafts);
	eleventyConfig.addPlugin(pluginImages);

	// Official plugins
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginSyntaxHighlight);
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	// Local additions
	eleventyConfig.addPlugin(pluginMermaid);
	eleventyConfig.addPlugin(emojiReadTime, {
		showEmoji: false,
	});
	eleventyConfig.addPlugin(pluginTOC, {
		tags: ['h2', 'h3'],
		ul: true,
		ol: false,
	})

	// Transforms
	eleventyConfig.addTransform('posthtml', function(HTMLString, outputPath) {
		if(outputPath && outputPath.endsWith('.html')) {
			return posthtml([
				automaticNoopener(NoOpOptions),
			])
				.process(HTMLString)
				.then(result => result.html);
		} else {
			return HTMLString;
		}
	});

	// Filters
	// Credit: https://11ty.rocks/eleventyjs/content/#excerpt-filter
	eleventyConfig.addFilter("excerpt", (post) => {
		const content = post.replace(/(<([^>]+)>)/gi, "");
		return content.substr(0, content.lastIndexOf(" ", 300)) + "...";
	});

	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "LLLL dd yyyy");
	});

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if(!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if( n < 0 ) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return all the tags used in a collection
	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "nav", "post", "posts"].indexOf(tag) === -1);
	});

	// Add all the filters in assets/filters.js
	for (let name in filters) {
		eleventyConfig.addFilter(name, filters[name]);
	}

	// COLLECTIONS
	eleventyConfig.addCollection("postsByMonth", (collectionApi) => {
		const posts = collectionApi.getFilteredByTag("posts").reverse();
		const ret = {};

		for (let post of posts) {
			let key = filters.format_date(post.date, "iso").substring(0, 7); // YYYY-MM
			ret[key] ??= [];
			ret[key].push(post);
		}

		return ret;
	});

	eleventyConfig.addCollection("postsByYear", (collectionApi) => {
		const posts = collectionApi.getFilteredByTag("posts").reverse();
		const ret = {};

		for (let post of posts) {
			let key = post.date.getFullYear();
			ret[key] ??= [];
			ret[key].push(post);
		}

		return ret;
	});


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
		mdLib.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: "after",
				class: "header-anchor",
				symbol: "#",
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter("slugify")
		});
		mdLib.use(markdownItDefList);
		mdLib.use(markdownItFigures, {
			figcaption: 'alt',
			lazy: true,
			async: true,
			classes: 'lazy'
		});
		mdLib.use(markdownItFootnotes);
		mdLib.use(admonitions);
		mdLib.use(markdownItKbd, {
			presets: [{
					name: 'icons'
			}]
		});
		mdLib.use(markdownItAttrs, {
				// Default options
				leftDelimiter: '{',
				rightDelimiter: '}',
				// All attributes are allowed
				allowedAttributes: []
			});
	});

	// Features to make your build faster (when you need them)

	// If your passthrough copy gets heavy and cumbersome, add this line
	// to emulate the file copy on the dev server. Learn more:
	// https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve

	// eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

	return {
		// Control which files Eleventy will process
		// e.g.: *.md, *.njk, *.html, *.liquid
		templateFormats: [
			"md",
			"njk",
			"html",
			"liquid",
		],

		// Pre-process *.md files with: (default: `liquid`)
		markdownTemplateEngine: "njk",

		// Pre-process *.html files with: (default: `liquid`)
		htmlTemplateEngine: "njk",

		// These are all optional:
		dir: {
			input: "content",          // default: "."
			includes: "../_includes",  // default: "_includes"
			data: "../_data",          // default: "_data"
			output: "_site"
		},

		// -----------------------------------------------------------------
		// Optional items:
		// -----------------------------------------------------------------

		// If your site deploys to a subdirectory, change `pathPrefix`.
		// Read more: https://www.11ty.dev/docs/config/#deploy-to-a-subdirectory-with-a-path-prefix

		// When paired with the HTML <base> plugin https://www.11ty.dev/docs/plugins/html-base/
		// it will transform any absolute URLs in your HTML to include this
		// folder name and does **not** affect where things go in the output folder.
		pathPrefix: "/",
	};
};
