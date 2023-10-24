---
title: "Migrating from WordPress to Eleventy (part 2)"
date: "2023-10-26"
youtube: true
vimeo: true
mermaid: false
mavo: false
---

# Migrating from WordPress to Eleventy (part 2)

Once I got a basic migration working how I want to, I can look at details that go beyond content and deal with styling and layout.

## Typography And Other CSS Work

As much work as I've done in typography to make the Eleventy site look like the WordPress version, there is work still to do.

### Typography

The first thing to do is to create a more apealing typograhical experience. I created a major third typographical scale using [Type Scale](https://typescale.com/). I increased the base font size slightly (from 1.125 to 1.25) to make the text easier to read.

We first define our default values. We'll play with these values later in the typographical portion of the stylesheet.

```css
:root {
  --base-font-size: 1.25;
  --base-line-height: 1.5;
  --base-font-weight: 400;
  --h1-size: 3.052;
  --h2-size: 2.441;
  --h3-size: 1.953;
  --h4-size: 1.563;
  --h5-size: 1.25;
  --heading-weight: 700;
  --heading-line-height: 1.3;
  --small-size: 0.8;
}
```

Next, we set the default font size. The formulas will use [calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) to take the variables and convert them to the necessary units

```css
html {
  font-size: calc(var(--base-font-size) * 1rem)
}
```

Next we set the default values for the font family, font weight and line height for all 6 heading levels.

```css
h1, h2, h3, h4, h5, h6 {
  margin: 3rem 0 1.38rem;
  font-family: var(--font-family);
  font-weight: var(--heading-font-weight);
  line-height: var(--heading-line-height);
}
```

Finally, we set the sizes for the individual headings and the small text.

```css
h1 {
  margin-top: 0;
  font-size: calc(var(--h1-size) * 1rem);
}

h2 {
  font-size: calc(var(--h2-size) * 1rem);
}

h3 {
  font-size: calc(var(--h3-size) * 1rem);
}

h4 {
  font-size: calc(var(--h4-size) * 1rem);
}

h5 {
  font-size: calc(var(--h5-size) * 1rem);
}

h6 {
  text-transform: uppercase;
}

small,
.text_small {
  font-size: calc(var(--small-size) * 1rem);
}
```

I may want to change this later, but for now, I think it looks OK.

### Reorganize the content in @layers

I'm finding myself adding `!important` declarations to make the CSS work as I want it. When I get into that situation, it may be time to move to a [@layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)-based stylesheet.

CSS layers provide a way to encapsulate our styles without having to use things like Shadow DOM, insanely specific classes or the `!important` property.

Rules within a cascade layer cascade together, giving more control over the cascade to web developers. Any styles not in a layer are gathered together and placed into a single anonymous layer that comes after all the declared layers, named and anonymous. This means that any styles declared outside of a layer will override styles declared in a layer, regardless of specificity.

Based on the content currently in the stylesheet, I will start with the following layers

```css
@layer  base,
        layout,
        images,
        tables,
        lists,
        dark-mode,
```

We can then define the styles by creating a new `@layer` with the content inside it.

```css
@layer base {
  /*
    Content for base layer
    goes here
  */
}
```

### Styling the post pagination elements

I duplicated the layout and styles of the WordPress post navigation to previous and last post.

```html
  <nav class="navigation post-navigation" aria-label="Posts">
    <h2 class="visually-hidden">Post navigation</h2>
    <div class="nav-links">
      {%- if previousPost %}
      <div class="nav-previous">
        <a rel="prev" href="{{ previousPost.url }}">{{ previousPost.data.title }}</a>
      </div>
      {% endif %}
      {%- if nextPost %}
      <div class="nav-next">
        <a rel="next" href="{{ nextPost.url }}">{{ nextPost.data.title }}</a>
      </div>
      {% endif %}
    </div>
  </nav>
```

I've leveraged Eleventy's if statements to only insert a previous and next link when they are necessary.

The styling produce a large button-like block where clicking anywhere in the area triggers the link

```css
.post-navigation {
  padding: 2em 0;
  text-align: left;
  overflow: hidden;
}

.post-navigation a {
  display: block;
  width: 100%;
  text-decoration: none;
  padding: 1em;
  border: 1px solid black;
}

.nav-links {
  margin: 0 auto;
  padding: 0 0.4em;
}

.nav-previous {
  padding-bottom: 1em;
}

.post-navigation .nav-previous a::before {
  content: 'Previous Post: \A\A';
  font-size: 1.25em;
  font-weight: 700;
  margin-right: 1em;
  white-space: pre;
  color: var(--text-color);
}

.post-navigation .nav-next a::before {
  content: 'Next Post: \A\A';
  font-size: 1.25em;
  font-weight: 700;
  margin-right: 1em;
  white-space: pre;
  color: var(--text-color);
}

.nav-previous a,
.nav-next a
.nav-previous a:hover,
.nav-next a:hover {
  color: var(--link-color)
}
```

## Implement Archive Pagination

The way I want the blog structured, the index page only has the last 10 published posts and a link to the archive.

In the first iteration, I want the archive to be paginated on 10-item blocks.

The archive required changing the entire structure of the blog template.

The front matter content has both the pagination and the permalink schema that Eleventy will use to generate the archive pages.

```yaml
---
layout: layouts/home.njk
eleventyNavigation:
  key: Archive
  order: 2
  url: http://localhost:8080/blog/page-1/
pagination:
  data: collections.posts
  size: 10
  reverse: true
permalink: "blog/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber }}/{% endif %}index.html"
---
```

The archive display is similar to the blog front page but it splits the content from the pagination object we defined in the front matter.

We also leverage the `excerpt` plugin that we created for the front page

```html
<div class="postlist">
  {%- for post in pagination.items -%}
  <article class="postlist-item">
    <h3>
      <a href="{{ post.url }}" class="postlist-link">
        {% if post.data.title %}
          {{ post.data.title }}
        {% else %}
          <code>{{ post.url }}</code>
        {% endif %}
      </a>
    </h3>
    <time class="postlist-date" datetime="{{ post.date | htmlDateString }}">{{ post.date | readableDate("LLLL dd yyyy") }}</time>
    <p>{{ post.templateContent | excerpt }}
      <div class="continue-reading">
        <a href="{{ post.url }}">Read More...</a>
      </div>
  </article>
  {%- endfor -%}
</div>
```

The pagination element of the page is the most complex since it does a lot of conditional rendering.

The first Nunjucks `if` statement checks if we have more than one page of archives. If we have more than one page then we move forward, otherwise we will not print anything to the resulting page.

The second `if` sttement checks if we're in the first page. If we are then we add a paragraph with a non-breaking space (`nbsp`) entity to make sure that the styles work as intended.

If we're not on the first page then we check if there's a previous URL for the site and add a link to it.

We print a static link to the index page. This link will not change, regardless of where in the archive we are.

Unless we're in the last page, meaning there's no link to the next page, we print the link.

```handlebars
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

The CSS to style the archive navigation is a single rule that makes the container into a flexbox and the spreads the content using the `space-between` justification.

```css
nav.archive-pagination {
  margin-block-start: 6rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
```

We may do further styling later.

### Additional Plugins I'm Considering for an Eleventy Site

I'm considering the following Eleventy and Markdown-It plugins. I will add my notes next to them.

Unlike WordPress plugins, we don't need to worry about runtime performance since we're rebuilding the content whenever we add new posts.

[eleventy-plugin-mermaid](https://github.com/KevinGimbel/eleventy-plugin-mermaid)
: Allows you to create diagrams using a Markdown-like syntax
: It works out of the box

[eleventy-plugin-emoji-readtime](https://www.npmjs.com/package/@11tyrocks/eleventy-plugin-emoji-readtime)
: Provides an estimate of how long would it take someone to read the post.
: Optionally, it can add emoji to the time estimate, one for each bucket of time that it takes to read the post

[eleventy-plugin-pwa-v2](https://www.npmjs.com/package/eleventy-plugin-pwa-v2)
: Build a service worker using Google's [Workbox](https://developer.chrome.com/docs/workbox/).
: This will not build a PWA. We're missing the manifest file and other features. Since the manifest file doesn't change once it's published, I've built it manually and integrated it to the site before I add the service worker.
: It adds all 800+ HTML files. This may or may not be what we want so I need to review the Workbox configuration to make sure it does what I want it to.
: Be careful when using this plugin during development. Caching all the HTML pages may prevent you from seeing the changes your code produces
: After consideration of the pros and cons, I decided to skip this plugin and generate the service worker manually using Workbox. This will also allow me to implement individual post caching, rather than an all-or-nothing solution.

[eleventy-plugin-automatic-noopener](https://www.npmjs.com/package/eleventy-plugin-automatic-noopener)
: Adds `noopener` or `noreferrer` attributes to links on the page
: It needs a second plugin ([PostHTML](https://posthtml.org/)) to actually insert the attributes into the links

[eleventy-plugin-metagen](https://www.npmjs.com/package/eleventy-plugin-metagen)
: This will generate all the metatags that I need to be able to post on social media. I'm still not 100% sure that this is an immediate need or a "nice to have"

[eleventy-plugin-schema](https://www.npmjs.com/package/@quasibit/eleventy-plugin-schema)
: This plugin will generate [JSON-LD](https://json-ld.org/) structured data for different content items, theoretically making it easier for search engines to discover the content and providing richer search experiences for people who land on our site.
: In the demos I see a lot of manually entered data. I'm concerned that I will have to backtrack to all 900 posts in order to get this working and I'm not keen on it.

[eleventy-plugin-sitemap](https://github.com/quasibit/eleventy-plugin-sitemap)
: This is another search engine discoverability tool that will build an [XML Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) for the site.
: Can wait until we're closer to going into production
