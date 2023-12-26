---
title: "Syndicating content to Twitter/X"
date: 2024-06-30
desc: "The process of configuring an Eleventy site to syndicate content to Twitter/X"
tags:
  - Javascript
  - Netlify
  - Eleventy
---

One of the things I miss from my WordPress days is the ability to automatically post links to new content to Twitter/X once the content is published.

You can get equivalent functionality in an Eleventy site but it's more complicated and it takes many steps to accomplish.

This post will document the process and the results.

Before we start working with the code to post to Twitter, we need to set up the Twitter Card entries.

Rather than do it manually, we will use the [Metagen](https://github.com/tannerdolby/eleventy-plugin-metagen) Eleventy plugin.

The plugin is not perfect. We still have to do some manual work on posts, meaning that we won't be able to update older posts (at least not easily), but it's worth the effort anyway.

The plugin will pull data from different locations:

* A global metadata file located (`_data/metadata.js`)
* Metadata specific to each post
* Hard-coded values in the Metagen declaration

As with many other plugins, using it takes three steps:

1. Install the plugin using NPM (`npm i eleventy-plugin-metagen`)
2. Set up the plugin in the `eleventy.config.js` configuration file
3. Configure the data for the metagen in the template where you want to place the content. I placed them inside the `head` element of the base template

The Metagen configuration looks like this:

{% raw %}
```text
{%- metagen
	comments=true,
	title=title or metadata.title,
	desc=desc or metadata.desc,
	url=url,
	img="/images/Thumbnail_Trinity_College_Dublin_Ireland.webp",
	img_alt="Trinity College Library, Dublin",
	twitter_card_type=summary,
	twitter_handle=elrond25
-%}
```
{% endraw %}

<https://mxb.dev/blog/syndicating-content-to-twitter-with-netlify-functions/>

<https://gist.github.com/maxboeck/77c3c8e244f190147cca2f7383d5f183>
