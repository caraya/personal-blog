---
title: "Creating an Eleventy Website (Part 2)"
date: 2024-03-27
tags:
  - Eleventy
  - Design
  - Build
---

In the last post, we looked at building and configuring an Eleventy website.

This post will look at creating content for the site including: Migrating old content from WordPress, creating additional templates, creating partials, creating short codes and other types of Eleventy content.

## Expanding the work

We created a default template for the application and have a working site. There is more we can do and we'll explore some of these areas.

### Creating Additional Templates

We can have multiple templates for different layout designs. Using this strategy we can inline CSS specific to a theme and set up the correct HTML/CSS structure to accomplish the target design.

In this example, we've created a template that will display the content of the page in two columns, with the header and footer covering the full width of the page.

We can reference the layout that we want to use in the page front matter:

```yaml
---
title:
date: 2024-03-27
tags:
  - Eleventy
  - Design
  - Build
layout: layouts/two-col.njk
---
```

After adding the appropriate IDs or classes to the template then we style it with CSS like we do with normal web content.

```html
<!doctype html>
<html lang="{% raw %}{{ language or metadata.language }}{% endraw %}">
  <head>
    <title>{% raw %}{{ language or metadata.language }}{% endraw %} </title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link
    rel="stylesheet" media="screen" href="/css/index.css"/>
  </head>
  <body>
    {% raw %}{% import "_nav.njk" as nav with context %}{% endraw %}
    <a href="#skip" class="visually-hidden">Skip to main content</a>
    <header>
      <h1>{% raw %}{{ title or metadata.title }}{% endraw %}</h1>
    </header>
    <main id="skip">
    <div class="twocol-container">
      {% raw %}{{ content }}{% endraw %}
    </div>
    <footer>
      <div class="left-footer">
        <section class="social">
        <h4>Social Me</h4>
        {% raw %}{%- include "_social.njk" -%}{% endraw %}
        </section>
      </div>

      <div class="right-footer">
        <h4>Search</h4>
          <div id="search"></div>

        <nav id="nav">
          <h4>Links</h4>
          <div class="nav-container">
            <ul class="nav-footer-menu">
              {% raw %}{{ nav.render(nav_links, "footer") }}{% endraw %}
            </ul>
          </div>
        </nav>
      </div>
    </footer>
  </body>
</html>
```

Using this strategy we could create as many specialized templates and layouts as we need.

### Creating Partials

Sometimes creating a full layout is overkill. For example, displaying blocks like navigation or social media links doesn't need a full layout every time we use it.

We create partial templates to render these specific units of content instead.

These partials are smaller, reusable pieces of code that we can then place in different places on the page.

The first example will pull data from a JSON file formatted like this:

```json
{
  "github": {
    "name": "GitHub",
    "url": "https://github.com/caraya",
    "icon": "github",
    "color": "#333"
  }
}
```

It will loop through the content of the JSON file using a [for loop](https://mozilla.github.io/nunjucks/templating.html#for) and produce a list of links to different social media sites along with their corresponding icons and preferred colors.

```html
<section class="social-container">
  {% raw %}{% for id, service in social %}
    <a class="{{ id }}"
    href="{{ service.url }}"
    target="_blank" rel="me"
    aria-label="{{ service.name }}"
    style="--color: {{ service.color }}"><i class="bi bi-{{ service.icon }}"></i></a>
  {% endfor %}{% endraw %}
</section>
```

We can also manipulate existing content collections to produce the desired results.

In the following example, we take our collection of posts, reverse it and take the first five items in the collection, meaning the last five posts since we reversed the collection, and display them as links in a list using a `for` loop.

```html
<ul>
  {% raw %}{% set posts = collections.posts | reverse | head(5) %}
  {% for post in posts %}
    <li><a href="{{ post.url }}">
      {% if post.data.title %}
        {{ post.data.title }}
      {% else %}
        <code>{{ post.url }}</code>
      {% endif %}
    </a></li>
  {% endfor %}{% endraw %}
</ul>
```

You can also create programmatic function-like partials using the [macro](https://mozilla.github.io/nunjucks/templating.html#macro) tag.

This macro also uses data from an external file:

```json
[
  {
    "title": "Home",
    "path": ""
  },
  {
    "title": "About",
    "path": "about"
  },
  {
    "title": "Patterns",
    "url": "https://patterns.rivendellweb.net/"
  }
]
```

The macro takes two parameters: the list of links from the JSON file and the location on the page we want to place it in.

We use a `for` loop to iterate over the links.

Set the link to the value of the URL or the `/` string if there's no URL available.

Then build the `li` element with the link as its children.

```liquid
{% raw %}{% macro render(links, location) %}
  {% for link in links %}
    {% set url = link.url or ("/" + (link.path or ".") + "/") %}
    <li class="nav-item"><a href="{{ url }}"{{ ' target="_blank"' if link.url }}>{{ link.title }}</a></li>
  {% endfor %}
{% endmacro %}
{% endraw %}
```

We can then call the macro in the location we want to render the partial at with the correct parameters.

```html
<nav id="nav-top-menu-container" class="nav-container">
  <ul class="nav-top-menu">
    {% raw %}{{ nav.render(nav_links, "nav-top-menu-container") }}{% endraw %}
  </ul>
</nav>
```

With partials, we can make the code reusable and easier to read but we can't use them everywhere. That's where shortcodes come in.

### Creating Shortcodes

[Shortcodes](https://www.11ty.dev/docs/shortcodes/) are similar to partials but they can be used in front-matter content and Markdown text.

The shortcodes can be added to the Eleventy configuration file or they can be added to a separate file that then gets loaded from the configuration file.

We can create a one-tag shortcode with code like this:

```js
module.exports = function(eleventyConfig) {
  // Universal Shortcode
  eleventyConfig.addShortcode("user", function(name, twitterUsername) {
    return `<div class="user">
<div class="user_name">${name}</div>
<div class="user_twitter">@${twitterUsername}</div>
</div>`;
  });
};
```

That then gets called with the following shortcode anywhere in a template or Markdown file.

```md
{% raw%}{% user "Twitter User", "twitteruser" %}{% endraw %}
```

For some types of content, the single-tag approach may not work. In this case, we may want paired tags for our shortcode. We'll modify the user shortcode into a paired-tag version.

We use the `addPairedShortcode` method instead of `addShortcode`. The inside of the function adds another line to add the content.

```js
module.exports = function(eleventyConfig) {
  // Universal Shortcodes
  eleventyConfig.addPairedShortcode("user", function(bioContent, name, twitterUsername) {
    return `<div class="user">
<div class="user_name">${name}</div>
<div class="user_twitter">@${twitterUsername}</div>
<div class="user_bio">${bioContent}</div>
</div>`;
  });
};
```

The way we call the shortcode also changes.

Because we chose to make this a paired shortcode now we have to use both an opening tag with the name and the parameters we chose, and a closing tag using end + the tag name as a single word.

```md
{% raw %}{% user "Twitter User", "twitteruser" %}
  Twitter user likes sushi and beer.
{% enduser %}{% endraw %}
```

Which version of a shortcode you use will depend on the content that you want to insert

## Content

We can create as many templates and shortcodes as we want for the project but we have no content yet.

We'll explore different strategies to generate content: migrating content from a WordPress backup file and creating content in Markdown files.

### Migrating Existing Content

To handle the migration from WordPress I created a WordPress converter to Markdown in Go.

Rather than discuss the code here, I've put it in a [GitHub repository](https://github.com/caraya/wp-converter).

The result is not perfect and will require a lot of work on individual posts, but less than if we had to do manual conversions. It is also important to point out that I will not use all the migrated content, I chose not to be selective in what I converted since it would have required me to edit the XML file.

### Creating Content

Creating is easy. The main source of content is Markdown files with special YAML front matter.

A minimum content file looks like this

```md
---
title: WebGPU
date: 2024-06-30
---

the content goes here
```

We can incorporate shortcodes and raw HTML. Because I write all the content going in, sanitizing the content is not necessary. If you accept third-party content sanitization is a must as it'll prevent XSS attacks.

Another tool in the arsenal is adding plugins that will create new Markdown structures to accommodate our desired HTML output.

For example, if we have the `defList` plugin installed, we can write our dl > dt > dd lists as such:

```md
Fluent Readability for primary content that is not body text
: * Up to two and a half lines of continuous text
```

and after implementing the `Figures` plugin, we can build our figures like this:

```md
![Examples of CSS Shapes](https://example.com/shape-outside-example.jpg)
```

It will use the alt text as the caption content and will produce the full `figure` element with its children.

For information about plugins to extend Markdown-it, see the [Markdown-it plugin list](https://www.npmjs.com/search?q=markdown-it%20plugins) in NPM.

## Configuring Collections

When you have groups of similar content, like postings, essays, or stories, it may be a good idea to configure them together.

For example, for an essay collection we can name the file `essays.11tydata.js` and populate with data that we want to use in all files.

In this example, taken from my blog, we do the following:

Configures permalinks
: If we're in production mode and one of the two conditionsm are true, we skip the post:
: * The `draft` value is set to true
: * The date of the post is in the future
: Otherwise, we create the permalink by using the built-in `fileSlug`

Excluding posts from a collection
: If we're in production mode and the conditions described above are true, we exclude the post from the `essays` collection

Default tags for collection items
: Tags that we want the essays to have in common

Default layout for the content
: The default layout for these posts. This can be overriden in individual items

Conditional load items
: The base template defines a series of items: `mavo`, `youtube`, and `vimeo` that will load the necessary assets if the corresponding item is true.
: We set them to `false` by default and override in posts where the content is necessary.
: This will prevent unnecessary loading of assets unless they are used.

```js
module.exports = {
  eleventyComputed: {
    permalink: data => {
      if (process.env.NODE_ENV === "production"
      && (data.draft || data.page.date >= new Date())) {
        return false;
      }
      return `/${data.page.fileSlug}/`;
    },
    eleventyExcludeFromCollections: data => {
      if (process.env.NODE_ENV === "production"
      &&  (data.draft || data.page.date >= new Date())) {
        return true;
      }
      return false;
    }
  },
  tags: [
    "essays"
  ],
  // What layout to use
  layout: "layouts/post.njk",
	// conditional
  youtube: false,
  vimeo: false,
  mavo: false,
};
```

## Conclusion

These posts give an idea of what I did to build an Eleventy website. It's a starting point and there are many areas to explore and play with.

As a static site generator, Eleventy gives you a lot of flexibility. It will come a point when you will have to decide how much is too much.
