---
title: "Gutenberg Pagination and Post Navigation"
date: "2022-03-23"
---

Gutenberg gives you the tools to do pagination visually but, unfortunately, I haven't found a way to customize the pagination tool so that it works the way I want to.

There are two different types of pagination in a WordPress-based blog: One for index and archive pages and one for individual posts.

## Index Page Navigation

The pagination layout I ended up using on my site looks like this:

```html
<!-- wp:query-pagination {
  "layout":{"type":"flex" "justifyContent":"center"}} -->
  <!-- wp:query-pagination-previous /-->

  <!-- wp:query-pagination-numbers /-->

  <!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->
```

There are some issues with the default navigation.

* If there is no previous or next post, the remaining content will move. I would rather is remain static and the space be left empty so the navigation remains centered
* Because the page navigation is built inside the query-loop block, and we've styles the loop to be narrower so it looks acceptable the navigation is also constrained by the styles on the loop

I've made the conscious decision to let the previous and next post links overflow the parent element. However when both previous and next links are present the links are squished together and it doesn't look like the design I intended.

As a hack workaround, for now, I've added this CSS to the site's customizations:

```css
.wp-block-query-pagination {
    width: 80vw
    margin-left: -225px;
}
```

The negative margin will move the pagination container to the left to try and match the width of the footer below.

I also need to test in other desktop and mobile devices to make sure that the pagination still works as intended there.

## Post Navigation

Post navigation is different than the page navigation and it uses a lot more attributes in the Gutenberg comments.

Structurally, the layout is built around a two column layout and leverages a lot of built-in block attributes and parameters.

Each `post-navigation-link` element has three attributes that are relevant:

* `type`: This is the type of link. It can be `previous` or `next`
* `showTitle`: This is a boolean that determines if the title of the post should be shown
* `linkLabel`: Boolean that indicates if the link should have a label

```html
<!-- wp:columns {"style":{"spacing":{"margin":{"top":"2.38rem","bottom":"2.38rem"}}},"className":"post-nav"} -->
  <div class="wp-block-columns post-nav" style="margin-top:2.38rem;margin-bottom:2.38rem">
    <!-- wp:column {"verticalAlignment":"center"} -->
    <div class="wp-block-column is-vertically-aligned-center">
      <!-- wp:post-navigation-link {"type":"previous","showTitle":true,"linkLabel":true} /-->
    </div>
    <!-- /wp:column -->

    <!-- wp:column -->
    <div class="wp-block-column is-style-default">
      <!-- wp:post-navigation-link {"textAlign":"left","showTitle":true,"linkLabel":true} /-->
    </div>
    <!-- /wp:column -->
  </div>
<!-- /wp:columns -->
```

I like that the navigation links have attributes matching functionality, I just wish they were better documented.
