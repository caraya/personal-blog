---
title: "Syndicating content to Twitter/X"
date: 2024-06-30
tags:
  - Javascript
  - Netlify
  - Eleventy
---

One of the things I miss from my WordPress days is the ability to automatically post links to new content to Twitter/X once the content is published.

You can get equivalent functionality in an Eleventy site but it's more complicated and it takes many steps to accomplish.

This post will document the process and the results.

Before we start working with the code to post to Twitter, we need to set up the Twitter Card entries.

Rather than do it manually, we will youse the [Metagen](https://github.com/tannerdolby/eleventy-plugin-metagen) Eleventy plugin.

We could add the necessary metadata to the templates but, instead, I will add them to the blog's directory data file. Doing it this way will automatically add them to all blog posts.

<https://mxb.dev/blog/syndicating-content-to-twitter-with-netlify-functions/>

<https://gist.github.com/maxboeck/77c3c8e244f190147cca2f7383d5f183>
