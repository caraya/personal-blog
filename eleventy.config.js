// External libraries
// const { DateTime } = require("luxon");
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
const multiMDTable = require('markdown-it-multimd-table');

// 11ty plugins
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
// const pluginBundle = require("@11ty/eleventy-plugin-bundle");
const pluginNavigation = require("@11ty/eleventy-navigation");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");

// const pluginDrafts = require("./eleventy.config.drafts.js");
// const pluginImages = require("./eleventy.config.images.js");

// Added by Carlos
const posthtml = require('posthtml');
const { posthtml: automaticNoopener, parser } = require('eleventy-plugin-automatic-noopener');
const NoOpOptions = parser({ noreferrer: true });
const pluginTOC = require('eleventy-plugin-toc');
const editOnGithub = require('eleventy-plugin-edit-on-github');
const metagen = require('eleventy-plugin-metagen');

// Upgrade helper
// const UpgradeHelper = require("@11ty/eleventy-upgrade-help");

module.exports = function (eleventyConfig) {
  // Copy the contents of the `public` folder to the output folder
  // For example, `./public/css/` ends up in `_site/css/`
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
    "./assets/manifest.json": "/manifest.json",
    "./node_modules/lite-youtube-embed/src/lite-yt-embed.css": "/css/lite-yt-embed.css",
    "./node_modules/lite-youtube-embed/src/lite-yt-embed.js": "/js/lite-yt-embed.js",
    "./assets/prism.css": "/css/prism.css",
    "./assets/prism.js": "/js/prism.js",
		"./assets/site-search-form.js": "/js/site-search-form.js",
		"./assets/site-search-page.js": "/js/site-search-page.js",
  });

  // Run Eleventy when these files change:
  // https://www.11ty.dev/docs/watch-serve/#add-your-own-watch-targets

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // App plugins
  // eleventyConfig.addPlugin(pluginDrafts);
  // eleventyConfig.addPlugin(pluginImages);

  // Official plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  // eleventyConfig.addPlugin(pluginBundle);

  // Local additions
  eleventyConfig.addPlugin(pluginMermaid);
  eleventyConfig.addPlugin(emojiReadTime, {
    showEmoji: false,
  });
  eleventyConfig.addPlugin(pluginTOC, {
    tags: [ 'h2', 'h3', 'h4' ],
    ul: true,
    ol: false,
  });
  eleventyConfig.addPlugin(editOnGithub, {
    // required
    github_edit_repo: 'https://github.com/caraya/personal-blog',
    // optional: defaults
    github_edit_class: '',
    github_edit_branch: 'main',
    github_edit_attributes: 'target="_blank"',
  });
  eleventyConfig.addPlugin(metagen);
	// eleventyConfig.addPlugin(UpgradeHelper);


	// Transforms
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

	// Filters
	// Credit: https://11ty.rocks/eleventyjs/content/#excerpt-filter
	eleventyConfig.addFilter("excerpt", (post) => {
		const content = post.replace(/(<([^>]+)>)/gi, "");
		return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
	});

	eleventyConfig.addFilter('readableDate',
		(dateObj, options, zone) => {
			const defaultOptions = {
				month: "long",
				day: "2-digit",
				year: "numeric",
				timeZone: zone || "UTC"
			};

			const finalOptions = {
				...defaultOptions,
				...options,
				timeZone: zone || options?.timeZone || "UTC"
			};

			return new Intl.DateTimeFormat("en-US", finalOptions).format(dateObj);
		}
	);

	eleventyConfig.addFilter('htmlDateString', (dateObj) => {
		// Using the en-CA locale ensures the date is formatted as YYYY-MM-DD.
		const formatter = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'UTC',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		return formatter.format(dateObj);
	});

	eleventyConfig.addFilter('timeSince', (dateObj, locale = 'en') => {
		// Calculate the difference in milliseconds between the provided date and now.
		const diffMs = dateObj.getTime() - Date.now();

		// Only interested in past dates; if the date is in the future, return an empty string.
		if (diffMs > 0) {
			return "";
		}

		// Use the absolute difference since it's a past date.
		let remaining = Math.abs(diffMs);

		// Define time units for years, months, weeks, and days.
		const units = [
			{ unit: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
			{ unit: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
			{ unit: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
			{ unit: 'day', ms: 1000 * 60 * 60 * 24 },
		];

		const parts = [];
		// Iterate over each unit and calculate the non-zero difference.
		for (const { unit, ms } of units) {
			const value = Math.floor(remaining / ms);
			if (value > 0) {
				parts.push(`${value} ${unit}${value !== 1 ? 's' : ''}`);
				remaining -= value * ms;
			}
		}

		// If no unit was non-zero, return "just now"
		if (parts.length === 0) {
			return "just now";
		}

		return parts.join(', ') + ' ago';
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
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
		for (let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => [ "all", "nav", "post", "posts" ].indexOf(tag) === -1);
	});

	// Add all the filters in assets/filters.js
	for (let name in filters) {
		eleventyConfig.addFilter(name, filters[ name ]);
	}

	// COLLECTIONS


	// COMPUTED PROPERTIES

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
			level: [ 1, 2, 3, 4 ],
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
			presets: [ {
				name: 'icons'
			} ]
		});
		mdLib.use(markdownItAttrs, {
			// Default options
			leftDelimiter: '{',
			rightDelimiter: '}',
			// All attributes are allowed
			allowedAttributes: []
		});
		mdLib.use(multiMDTable, {
			multiline: true,
			rowspan: true,
			headerless: false,
			multibody: true,
			autolabel: true,
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
