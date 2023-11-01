---
title: "Migrating from WordPress to Eleventy (part 4)"
date: "2023-12-31"
youtube: false
vimeo: false
mermaid: false
mavo: false
draft: true
---

The last two items I want to discuss from the migration to Eleventy are integrations: Cloudinary and Algolia (search)

## Algolia

### Adding search functionality

The WordPress version of the blog uses Algolia as the search provider. There is no reason we can't use the same service with Eleventy

We will use [Building server-rendered search for static sites with 11ty Serverless, Netlify, and Algolia](https://www.algolia.com/blog/engineering/building-server-rendered-search-for-static-sites-with-11ty-serverless-netlify-and-algolia/) as the starting point. This will tie us to Netlify since it uses Netlify functions as the serverless infrastructure, but I had already decided to use Netlify for the Netlify CMS so it's less of a roadblock.

## Search
