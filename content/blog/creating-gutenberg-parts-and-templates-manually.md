---
title: "Creating Gutenberg parts and templates manually"
date: "2022-03-07"
---

When working with Gutenberg template parts and templates we have two options:

- Create them in the full site editor
- Create them manually using the appropriate markup

This post will cover the latter option and will serve as an overview of the markup we need to use to create the templates.

Gutenberg template markup is written inside HTML comment tags. This example shows a basic Gutenberg element and its attributes:

```html
<!-- wp:query-title {"type":"archive"} /-->
```

The components of the element are:

- The WordPress prefix, `wp:`
- The name of the element, `query-title`
- And any attributes as value pairs inside curly brackets, `{"type":"archive}`

The attributes are dependent on the element and not all attributes apply to all the available elements.

## Building template parts

The next example shows a template part built around a post query loop, a replacement for the traditional PHP loop.

Breaking up the template into smaller sections to walk through them.

`wp:query` runs a query against the WordPress database and returns the results as specified in the query parameters.

```html
<!-- wp:query-title {"type":"archive"} /-->
<!-- wp:term-description /-->
<!-- wp:query {
  "queryId":1,
  "query":{
    "pages":"100",
    "offset":0,
    "postType":"post",
    "categoryIds":[],
    "tagIds":[],
    "order":"desc",
    "orderBy":"date",
    "author":"",
    "search":"",
    "sticky":"",
    "exclude":[],
    "perPage":5,
    "inherit":true
    }
  } -->
```

After defining the query, we build the markup for the content of the query.

```html
<div class="wp-block-query">
<!-- wp:post-template -->
<!-- wp:post-title {"isLink":true} /-->
<!-- wp:post-featured-image /-->
<!-- wp:group {"className":"is-style-valinor-box-shadow post-meta","backgroundColor":"light-grey"} -->
<div class="wp-block-group is-style-valinor-box-shadow post-meta has-light-grey-background-color has-background">
  <!-- wp:post-date /-->
  <!-- wp:post-author /-->
  <!-- wp:post-terms {"term":"category"} /-->
  <!-- wp:post-terms {"term":"post_tag"} /-->
</div><!-- /wp:group -->
```

Most of the templates deal with post content.

`wp:title` displays the title of the block. Using the `isLink` attribute wraps the title generates a link to the post.

`wp-post-featured-image` shows the post featured image if one is available.

`wp:spacer` generates vertical space between blocks. The `height` parameter indicates how big the separator is.

The child of the `wp:spacer` element is a `div` element with an inline style attribute matching the specified height in pixels.

The `div` element also has an `[aria-hidden](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden)` attribute set to `true` so the document's accessibility tree will ignore it.

The `className` parameter is optional and, if used it must match one or more class names inside the child element's `style` attribute.

`wp:post-date` shows the data of the post was created.

`wp:post-author` contains the post author.

We then use the `wp:post-terms` elements twice: one to show the categories assigned to the post and the second one to show the tags assigned to the post (if any).

```html
<!-- wp:spacer {"height":30} -->
<div style="height:30px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
```

We add another spacer before we add the content.

```html
<!-- wp:post-excerpt {"moreText":"Continue reading"} /-->
<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:separator {"color":"beige","className":"is-style-wide"} -->
<hr class="wp-block-separator has-text-color has-background has-beige-background-color has-beige-color is-style-wide" />
<!-- /wp:separator -->
<!-- wp:spacer {"height":20} -->
<div style="height:20px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- /wp:post-template -->
```

`wp:excerpt` generates an except for the post or page. The `moreText` attribute provides the text for the link to read the rest of the content.

```html
<!-- wp:query-pagination -->
<div class="wp-block-query-pagination">
  <!-- wp:query-pagination-previous /--><!-- wp:query-pagination-next /-->
</div>
<!-- /wp:query-pagination --></div>
<!-- /wp:query -->
```

The final piece of the `wp:query` element is the `wp:query-pagination` element that will generate the pagination links for the post.

## Building templates

Building templates is simpler than building the parts for them. The next example shows a template to generate a page.

This template will use four template parts to generate a page.

We use `wp:template-part` to add the header, main and footer parts. We use a `wp:spacer` element to create a gap between the main and footer parts.

For each `wp:template-part` element we use, the `slug` attribute indicates the name of the part we want to use, the `tagName` attribute indicates the HTML tag we want to use to wrap the content we generate and `className` indicates the class name we want to add to the wrapping element.

```html
<!-- wp:template-part {
  "slug":"header",
  "tagName":"header",
  "align":"full",
  "className":"site-header"
} /-->
<!-- wp:template-part {
  "slug":"main",
  "tagName":"main",
  "className":"site-main",
  "layout":{
    "inherit":true
    }
  } /-->
<!-- wp:spacer {"height":30} -->
<div style="height:30px"
  aria-hidden="true" 
  class="wp-block-spacer"></div>
<!-- /wp:spacer -->
<!-- wp:template-part {
  "slug":"footer",
  "tagName":"footer",
  "align":"full",
  "className":"site-footer"
} /-->
```

Creating parts and templates by hand is not easy and it's not recommended. If you want to leverage the full site editor you should create your blocks and templates visually with the tools provided in the editor.

But sooner or later you will see the code for the template and it helps to understand how it works.
