---
title: "Migrating from WordPress to Eleventy (part 3)"
date: "2023-10-27"
youtube: false
vimeo: false
mermaid: false
mavo: false
---

# Migrating from WordPress to Eleventy (part 3)



## Conditionally loading assets

## Implement Archive Pagination

The way I want the blog structured, the index page only has the last 10 published posts and a link to the archive.

In the first iteration, I want the archive to be paginated on 10-item blocks.

```yaml
---
layout: layouts/home.njk
pagination:
  data: collections.posts
  size: 10
  reverse: true
permalink: "{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber }}/{% endif %}index.html"
---
```

{% raw %}
```liquid
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
      </article> <!-- End Post article-->
    {%- endfor -%}
  </div> <!-- End post list -->
```
{% endraw %}

{% raw %}
```liquid
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
{% endraw %}

In future iterations we'll improve the layout and the usability for the navigation.

### Adding search functionality

The WordPress version of the blog uses Algolia as the search provider. There is no reason we can't use the same service with Eleventy

We will use [Building server-rendered search for static sites with 11ty Serverless, Netlify, and Algolia](https://www.algolia.com/blog/engineering/building-server-rendered-search-for-static-sites-with-11ty-serverless-netlify-and-algolia/) as the starting point. This will tie us to Netlify since it uses Netlify functions as the serverless infrastructure, but I had already decided to use Netlify for the Netlify CMS so it's less of a roadblock.



## Maintaining the same structure than WordPress

One important thing is to keep the existing flar structure of the blog in Eleventy.

Rather than use a date-based structure like

```text
/year/month/day/post-slug
```

I chose to use a flat, website-like structure

```text
/post-slug/
```

This has proved more challenging than I expected. The default is to push the individual posts to a blog directory,  then use the slug as the directory name and name the file as `index.html`:

```text
/blog/post-slug/index.html
```

In order to fix this, we'd have to insert a permalink attribute to all the posts that already exist and those we create in the future.

Eleventy provides a [directory data file](https://www.11ty.dev/docs/data-template-dir/) that will propagate to all the files in the directory. This means we don't have to add this data to each individual file.

```js
module.exports = {
  permalink: function (data) {
    // If there is no permalink, look for a slug in the data.
    // If there is no slug, just use the slugify filter on the title
    const slug = data.slug ?? this.slugify(data.title);

    return `/${slug}/index.html`;
  },
    tags: [
    "posts"
  ],
  "layout": "layouts/post.njk",
  "youtube": true,
  "vimeo": true,
  "mermaid": false,
  "mavo": false,
  };
  ```

## Evaluate Hosting

Now that I've moved to a static site generator it makes sense to re-evaluate my hosting situation.
