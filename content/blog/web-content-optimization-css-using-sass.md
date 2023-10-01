---
title: "Web Content Optimization: CSS Using SASS"
date: "2015-10-14"
categories: 
  - "technology"
---

CSS can become very large and very convoluted if we're not careful. This is particularly important when using third party libraries like Bootstrap or Zurb Foundation where most users download the full framework with large chunks of the library that they will never use but still load and push over the wire bloating the application and slowing everything down.

When you work with your own code it's easier to slim down but it still makes sense to build a default set of CSS stylesheets for our applications and then selectively choose which ones to use based on the page or pages I'm currently working on.

I've chosen to address these size issues in the following ways:

- Use SASS/SCSS as my CSS pre-processor to be able to compress the resulting CSS if needed
- Autoprefixer to eliminate the need to prefix elements if not needed
- UnCSS will remove CSS selectors that are not used in your HTML documents
- Creating stylesheets inline to render a page's critical path as fast as possible will also reduce the size of the CSS we bring from the network

## Using SASS

SASS (syntactically awesome style sheets) is a superset of CSS 2 and 3 with added scripting features such as:

- Program flow control (@if/@then/@else, @for, @while)
- Convenience functions to automate CSS work (lighten/darken, saturate/desaturate colors)
- Ability to nest selectors to keep our code DRY
- Use of variables and placeholder variables
- Mixins
- The ability to work with partial files that we can import into our main SASS

For purposes of performance optimization we'll worry about SASS output. Out of the box SASS provides multiple formats for the transformed CSS:

- :nested
- :compact
- :expanded
- :compressed

To understand the difference let's look at the following example:

```scss
.widget-social {
  text-align: right;

  a,
  a:visited {
    padding: 0 3px;
    color: #222222;
    color: rgba(34, 34, 34, 0.77);
   }

  a:hover {
      color: #B00909;
  }
}
```

## :nested

```scss
.widget-social {
  text-align: right; }
  .widget-social a,
  .widget-social a:visited {
    padding: 0 3px;
    color: #222222;
    color: rgba(34, 34, 34, 0.77); }
  .widget-social a:hover {
    color: #B00909; }
```

## :expanded

```scss
.widget-social {
  text-align: right;
}
.widget-social a,
.widget-social a:visited {
  padding: 0 3px;
  color: #222222;
  color: rgba(34, 34, 34, 0.77);
}
.widget-social a:hover {
  color: #B00909;
}
```

## :compact

```scss
.widget-social { text-align: right; }
.widget-social a, .widget-social a:visited { padding: 0 3px; color: #222222; color: rgba(34, 34, 34, 0.77); }
.widget-social a:hover { color: #B00909; }
```

## :compressed

> Note that the compressed stylesheep appears in one line. It's wrapped here for display purposes

```scss
.widget-social{text-align:right}.widget-social a,.widget-social a:visited{padding:0 3px;color:#222222;color:rgba(34,34,34,0.77)}.widget-social a:hover{color:#B00909}
```

Which one you use will depend on the situation. My build process has two versions of the SASS conversion task: One will create an expanded version to use during development and the other will create a compressed version suitable for development. Because I use partials for most of the styles the local content will be one stylesheet, we only need to worry about external resources such as `normalize.css` stored in separate stylesheets. Since there are versions of normalize written in SCSS so we should be able to convert it to a partial (by prepending an underscore to the name) and import it so we only have one stylesheet to work with.

See [Different SASS output styles](https://web-design-weekly.com/2014/06/15/different-sass-output-styles/) for more information.
