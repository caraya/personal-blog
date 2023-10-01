---
title: "WordPress CMS CRUD (Part 3): Some additional thoughts and ideas"
date: "2020-06-01"
---

In the last posts we created a CRUD system for authenticated WordPress requests but it's not complete. It currently only deals with the post content, it doesn't provide an easy way to paginate content, and it doesn't provide for how to access other parts of a WordPress site or app.

This post will discuss solutions to these problems.

## Embedding content related to the post

When we load the data from the `posts` REST endpoint we get references to the post assets like featured image, author, and comments.

This is good when we're exploring the API but it becomes troublesome when we are building the content out for displaying it to the user. We would have to make additional requests for these assets and we're not guaranteed that they exist so these additional requests and delays may be for nothing.

Instead we can leverage the API and use the `_embed` query parameter to include the additional post resources when we fetch the posts. This makes the response larger but it guarantees that we will have all the data available to build post listings and individual posts.

TO make the embedded assets available to individual posts, we need to modify the `init()` function to add the `_embed: ""` parameter to the `get` Axios call

The modified code looks like this

```js
export function init(event) {
  if (event) {
    event.preventDefault();
  }

  .get(state.restUrl + "wp/v2/posts/", {
    params: {
      _embed: "",
      // Set number of posts to get
      per_page: 10,
    }
  })
}
```

This code will embed all associate assets to each post on the response, making it easier to create posts the match what we get with a WordPress theme.

## Paginating content for navigation

By default, the WordPress REST API will return ten items per request. We can change that using the `per_page` parameter to change the number of items that the API returns up to one hundred.

### Creating the pages

But in and of itself this is not enough. Using `per_page` will always return the same data. We need to tell WordPress what page of the content we want.

The way to do it is to combine `per_page`, that will give us the number of items that we want the API to return, and `page` that provides the offset where to start the count of items to return.

For example the following request will return the second page of 5 items from the site's REST API.

```html
/wp-json/wp/v2/posts/?per_page=5&page=2
```

Both parameters are optional.

### Leveraging X-WP-TotalPages

So we know how to create pages of content but how do we make sure that we don't go over the last page?

WordPress's REST API provides two custom headers: `X-WP-Total` that gives you the total number of the type's items (post, pages, etc) in the collection and `X-WP-TotalPages` that gives the total number of pages available given the number of items per page we specify.

Using `X-WP-TotalPages` we can build page navigation links and we can build links to each page.

## Accessing other elements of a WordPress site

So far we've only worked with posts and their embedded content but many other items make up a WordPress application.

The following table, taken from [REST API Handbook Reference](https://developer.wordpress.org/rest-api/reference/) shows you the default routes available through the API.

Default endpoints available on the WordPress REST API

| Resource | Base Route |
| --- | --- |
| [Posts](https://developer.wordpress.org/rest-api/reference/posts/) | `/wp/v2/posts` |
| [Post Revisions](https://developer.wordpress.org/rest-api/reference/post-revisions/) | `/wp/v2/posts/<id>/revisions` |
| [Categories](https://developer.wordpress.org/rest-api/reference/categories/) | `/wp/v2/categories` |
| [Tags](https://developer.wordpress.org/rest-api/reference/tags/) | `/wp/v2/tags` |
| [Pages](https://developer.wordpress.org/rest-api/reference/pages/) | `/wp/v2/pages` |
| [Page Revisions](https://developer.wordpress.org/rest-api/reference/page-revisions/) | `/wp/v2/pages/<id>/revisions` |
| [Comments](https://developer.wordpress.org/rest-api/reference/comments/) | `/wp/v2/comments` |
| [Taxonomies](https://developer.wordpress.org/rest-api/reference/taxonomies/) | `/wp/v2/taxonomies` |
| [Media](https://developer.wordpress.org/rest-api/reference/media/) | `/wp/v2/media` |
| [Users](https://developer.wordpress.org/rest-api/reference/users/) | `/wp/v2/users` |
| [Post Types](https://developer.wordpress.org/rest-api/reference/post-types/) | `/wp/v2/types` |
| [Post Statuses](https://developer.wordpress.org/rest-api/reference/post-statuses/) | `/wp/v2/statuses` |
| [Settings](https://developer.wordpress.org/rest-api/reference/settings/) | `/wp/v2/settings` |
| [Themes](https://developer.wordpress.org/rest-api/reference/themes/) | `/wp/v2/themes` |
| [Search](https://developer.wordpress.org/rest-api/reference/search-results/) | `/wp/v2/search` |

This table does not include API routes added by plugins or generated outside the core API. Your overall API route table will certainly look different.
