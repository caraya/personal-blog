---
title: "Migrating from WordPress to Eleventy"
date: "2023-10-25"
youtube: true
vimeo: true
mermaid: false
mavo: false
---

# Migrating from WordPress to Eleventy

For a while I've been thinking about moving my blog out of WordPress and into a static site.

There are a number of reasons why I want to do this but the main one relates to the block editor

The block editor makes it harder for me to create custom content the way that I want to do it.

Rather than use blocks, I prefer to use HTML and CSS to create layouts. With every new release, WordPress becomes more block-oriented and less acommodating to other design and development patterns.

You have to use plugins to re-enable the traditional editor and widget areas and those plugins will not be supported indefinitely

At some point I thought about moving the blog to [Hugo](https://gohugo.io/) but I lost interest and decided to stay in WordPress for a while longer and give the block editor the benefit of the doubt. in 2019 I looked at Eleventy but at the time I wasn't ready for a change and I didn't feel Eleventy was ready for what I wanted.

I think it's time to test again and deploy the new site to test both the deployment system, any design changes, and any performance gains out of the box.

## How: The Basics

Moving a WordPress blog to an Eleventy site involves the following steps:

1. Export Your WordPress data
2. Convert the data into a format suitable for Eleventy
3. Move the data to the Eleventy site
4. Cleanup any problems with the migrated data
   * Understand that there will be a lot of manual work to do in the conversion
   * Some of this work will require copy and paste from Markdown files stored locally
5. Make any changes to the UI
6. Publish

I've used the [Eleventy Base Blog](https://github.com/11ty/eleventy-base-blog) template as my starting point because it allows me to concentrate on data migration and, later, on the site's design.

### Installing the Eleventy template site

Installing an Eleventy site is easy.

1. Clone the repository with the template you want to use
2. Install the Node.js dependencies with `npm install`
3. Run Eleventy to build the site `npx @11ty/eleventy`
4. Serve the site locally `npx @11ty/eleventy --serve`

Now we have a basic Eleventy website up and running. The next step is to export the data from WordPress to move into the Eleventy site.

### Export the data from WordPress

To export the data from WordPress, follow the standard export process. Make sure you export everything.

I will use [Wordpress export to Markdown](https://github.com/lonekorean/wordpress-export-to-markdown) to export the XML backup to individual Markdown files.

The export will create a good set of Markdown files with front matter for each individual file.

If you have a lot of inline HTML, like I do, the HTML will be lost in the translation so you'll have to manually review the posts and either copy from your original Markdown sources, or retype the HTML by hand.

We can copy the files to the Eleventy's source folder, content, and start Eleventy.

Eleventy will abort on error so if there is an error processing any of the converted Markdown files, you'll have to take action before proceeding.

In my case, with almost 900 entries, I just changed the extension to `.txt` so the file wouldn't be processed. I had 14 files with issues out of 880... not bad.

#### Note on images

WordPress exporter to Markdown can optionally download images attached to a post and images scrapped from the content.

In my case, this is tricky since some of the images are stored locally in WordPress and some are served via Cloudinary so it becomes hard to decide what system to use and whether to download all the images knowing that not all of them will be usable.

Cloudinary also presents another interesting challenge. Most of the time we upload images to Cloudinary and then get the URLs. We need to figure out a way to upload the images and get the correspondding URL.

In [Integrating Cloudinary into Eleventy](https://www.raymondcamden.com/2022/10/20/integrating-cloudinary-into-eleventy) the author presents a way to run Cloudinary in an Eleventy site that addresses the upload problem.

Another option is to download all the images and then run a custom script on the Markdown files to change the WordPress URL to a local URL to the new `images` directory.

### Adding Excerpts

In WordPress the homepage lists the 10 more recent post with Excerpts. Right now, the basic Eleventy theme does not.

I chose to follow Stephany Eckel's [Excerpt filter](https://11ty.rocks/eleventyjs/content/#excerpt-filter) solution in [Filters for 11th content](https://11ty.rocks/eleventyjs/content/).

The first iteration of the code looks like this:

```js
eleventyConfig.addFilter("excerpt", (post) => {
  const content = post.replace(/(<([^>]+)>)/gi, "");
  return content.substr(0, content.lastIndexOf(" ", 200)) + "...";
});
```

Since it strips tags and gives me the first 200 characters of the post as the excerpt, it does exactly what I wanted it to.

### Using custom CSS, JS and Fonts

Now that we have content in the blog, we need to create the styles and scripts and add them, along with the necessary fonts, to the website.

Eleventy provides [Passthrough File Copy](https://www.11ty.dev/docs/copy/) functionality so we can just put them in the `public` directory and let Eleventy move things around and put them in the right place.

The CSS that we place in our stylesheet is just like any other. For example, I've changed the layout to a grid-based layout to give me flexibility moving forward with new layouts in the future.

### Changing the Prism.js theme

When I use Prism.js, I use a lighter theme than the one provided in the template site I'm using.

Changing the template to use is easy.

First we need to change the name of the template we want to use in our configuration file, under `eleventyConfig.addPassthroughCopy()`.

It now looks like this:

```js
eleventyConfig.addPassthroughCopy({
  "./public/": "/",
  "./node_modules/prismjs/themes/prism-solarizedlight.css": "/css/prism-solarizedlight.css"
});
```

This commands copies the content of the `public` directory into the root of the static site. It also copies the Solarized Light Prism.js theme from the Prism NPM package to the static site's CSS directory.

### Adding Custom MarkdownIt Plugins

Since Eleventy uses [MarkdownIt](https://github.com/markdown-it/markdown-it) to convert Markdown files to HTML, we can add MarkdownIt plugins to add functionality to the conversion process that is available in WordPress Markdown parser (written in PHP).

The first such plugin adds definition lists support in Markdown. The second plugin converts Markdown image tags into HTML figures with captions.

The blog template I started with already uses a MarkdownIt plugin so I don't have to start from scratch. The complete modification, so far, looks like this:

```js
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
});
```

### Drawbacks

I expected the conversion to preserve tags that it didn't support but it did not so, even with the MarkdownIt plugin in place.

It stripped all definition lists from the converted Markdown so now I'm trying to decide how to address the problem. The content is still readable but, semantically, it's not what I created.

The options are:

* Leave it as is, since the content is still readable
* Review individual posts and paste from my original Markdown files

Even if I take the later option, I expect to have differences since the WordPress posts may have changed from the original source.

## Next Steps

I have a basic Eleventy blog working on my local machine. So what's next? The items below are in no particular order and some may affect the final decision whether to move away from WordPress or not.

### Fix Posts With Errors

Out of 880 posts, 14 produced errors when importing them to Eleventy.

In the intial import, I changed the file extension to one that Eleventy wouldn't process and decided to defer solving the problem until I had a working prototype.

Most of these "problem posts" had Vue, Nunjucks or Handlebars templates inside Markdown fenced code blocks.

The problem is caused by Eleventy's parsing the template with Nunjucks or Liquid before converting the Markdown file with MarkdownIt, so if it sees anything that either Nunjucks or Liquid would normally process, they will attempt to do so if they can and throw an error if they cannot.

If we don't care about using Nunjucks or Liquid templates in our pages we can disable them globally by using `markdownTemplateEngine: false` in the global Eleventy configuration file. This will disable pre-processing of all Markdown files.

I don't know if I will want to use templates in my files later so, instead of disabling pre-processing globally, I did in individual files using `templateEngineOverride: false` in the front matter declaration of the problematic files. That solved the problem at the cost of being unable to use templates on those files.

### Fix Image Sizes

Right now, the images in posts that use them are too large compared to the width of the text.

Part of the problem is that the conversion process also removed figure elements that I had manually entered into the Markdown documents so there is no `figure` and no `figcaption` elements in the converted pages

We may be able to fix this with Eleventy and CSS.

The Eleventy part consists of adding a MarkdownIt plugin to convert Markdown images into figure HTML elements with figcaption.

We can then use CSS Generated content to insert a figure counter before each image caption.

We initialize the counter in the `article` element using [counter-reset](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-reset)

```css
article {
  counter-reset: figures;
}
```

In each figure, we increase the counter using [counter-increment](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment)

```css
figure {
  counter-increment: figures;
}
```

And then for each figcaption that is the direct child of a figure element we use the [::before](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) pseudo element to insert content using the [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) property. The `counter` property mixes a string and the current value of the counter.

```css
figure > figcaption::before {
  margin-block-start: 0.5em;
  content: "Figure " counter(figures) ": "
}
```

The only drawback with this method is that CSS generated content is not accessible.

### Review the content

Figures are not the only place where the convertion lost markup.

Definition lists and custom message boxes also lost style so I'll have to evaluate what's the most time eficient way to restore the content. I can copy and paste from the original Markdown files on my computer or I can edit the files from the CMS I will lay on top of Eleventy.

