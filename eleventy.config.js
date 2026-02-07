// External libraries (converted to import)
import filters from './assets/filters.js';

// Custom markdown-it installation to customize it
import markdownIt from "markdown-it";
// Markdownit plugins
import markdownItAnchor from "markdown-it-anchor";
import markdownItDefList from 'markdown-it-deflist';
import markdownItFigures from "markdown-it-image-figures";
import pluginMermaid from "@kevingimbel/eleventy-plugin-mermaid";
import emojiReadTime from "@11tyrocks/eleventy-plugin-emoji-readtime";
import markdownItFootnotes from "markdown-it-footnote";
import admonitions from "markdown-it-admonition";
import markdownItKbd from 'markdown-it-kbd-better';
import markdownItAttrs from 'markdown-it-attrs';
import multiMDTable from 'markdown-it-multimd-table';

// 11ty plugins
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

// Added by Carlos
import posthtml from 'posthtml';
import { posthtml as automaticNoopener, parser } from 'eleventy-plugin-automatic-noopener';
const NoOpOptions = parser({ noreferrer: true });
import editOnGithub from 'eleventy-plugin-edit-on-github';
import metagen from 'eleventy-plugin-metagen';

// Experimental plugins
import publishingCalendar from './assets/eleventy-plugin-publishing-calendar.js';
import pluginTOC from '@elrond25/eleventy-plugin-toc';

// Replace module.exports with export default
export default function (eleventyConfig) {
  // Copy the contents of the `public` folder to the output folder
  eleventyConfig.addPassthroughCopy({
    "./public/": "/",
  });

  eleventyConfig.addPassthroughCopy({
    "./assets/manifest.json": "/manifest.json",
    "./node_modules/lite-youtube-embed/src/lite-yt-embed.css": "/css/lite-yt-embed.css",
    "./node_modules/lite-youtube-embed/src/lite-yt-embed.js": "/js/lite-yt-embed.js",
    "./assets/prism.css": "/css/prism.css",
    "./assets/prism.js": "/js/prism.js",
    "./assets/site-search-form.js": "/js/site-search-form.js",
    "./assets/site-search-page.js": "/js/site-search-page.js",
  });

  // Watch content images for the image pipeline.
  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Official plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Local additions
  eleventyConfig.addPlugin(pluginMermaid, {
    // load mermaid from local assets directory
    mermaid_js_src: 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs',
  });

  eleventyConfig.addPlugin(emojiReadTime, {
    showEmoji: false,
  });

  eleventyConfig.addPlugin(pluginTOC, {
    tags: [ 'h2', 'h3', 'h4' ],
    ul: true,
    ol: false,
  });

  eleventyConfig.addPlugin(editOnGithub, {
    github_edit_repo: 'https://github.com/caraya/personal-blog',
    github_edit_branch: 'main',
    github_edit_attributes: 'target="_blank"',
  });

  eleventyConfig.addPlugin(metagen);

  eleventyConfig.addPlugin(publishingCalendar, {});

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
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'UTC',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(dateObj);
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || array.length === 0) {
      return [];
    }
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

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

  // MARKDOWN CUSTOMIZATIONS
  let options = {
    html: true,
    breaks: false,
    linkify: false,
  };

  eleventyConfig.setLibrary("md", markdownIt(options));

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
      leftDelimiter: '{',
      rightDelimiter: '}',
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
    pathPrefix: "/",
  };
};
