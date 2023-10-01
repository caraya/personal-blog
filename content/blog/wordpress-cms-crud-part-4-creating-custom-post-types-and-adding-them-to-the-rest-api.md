---
title: "WordPress CMS CRUD (part 4): Creating custom post types and adding them to the REST API"
date: "2020-06-03"
---

One of the things I've always liked about WordPress is its flexibility. We can extend WordPress and create pretty much any type of content that we need for specific projects.

We can choose whether to build it inside a theme or a plugin. For the most part I would recommend building it in a plugin so that we will retain the capability even if we switch themes.

Like all plugins we first declare a preamble that looks like this. This is the block that makes it a plugin that we can load and use.

```php
<?php
   /*
   Plugin Name: Awesomeness Creator
   Plugin URI: https://example.com
   description: a plugin to create awesomeness and spread joy
   Version: 1.0
   Author: Mr. Awesome
   Author URI: https://site.com
   License: GPL2
   */
?>
```

The actual meat of the plugin is the custom post type registration. As with all WordPress related code, it has two parts: a callback function and a hook that tells WordPress what to do with the callback.

```php
<?php
function rivendellweb_custom_book_type() {
    $args = array(
      'public'       => true,
      'show_in_rest' => true,
      'rest_base'    => 'books',
      'label'        => 'Books'
    );
    register_post_type( 'book', $args );
}
add_action( 'init', 'rivendellweb_custom_book_type' );
?>
```

There are two arguments that are important when working with REST API routes.

`show_in_rest` tells WordPress that we want this custom post type to show in the REST API. When I activate the plugin it adds 4 additional books-related routes to the list of APIs available

`rest_base` allows us to rewrite the name of the route in the REST API. The default is the same name as the custom type but there may be cases where we want a different name. In our example I chose books instead of book (singular) for the name of the route.

We can also create one or more taxonomies for our custom post types and, with the `show_in_rest` attribute, we can use it from the REST API.

Because we've used a custom name in the route with `base_rest` we have to rewrite the taxonomy to match using the `rewrite` attribute in the custom taxonomy arguments.

The custom taxonomy declaration looks like this

```php
<?php
function rivendellweb_custom_book_genre_taxonomy() {
  $labels => array(
    'name'          => __x('Genres'),
    'singular_name' => __x('Genre', 'taxonomy singular name'),
    'search_items'  => __('Search Genres'),
    'edit_item'     => __('Edit Genre'),
    'add_new_item'  => __('Add New Genre')
  );

  $args = array(
    'labels'       => $labels,
    'show_in_rest' => true,
    'hierarchical' => true,
    'query_var'    => true,
    'rewrite'      => array(
      'slug' => 'books/genre',
      'with_front' => false
    )
  );
  register_taxonomy( 'genre', 'book', $args );
}
add_action( 'init',
  'rivendellweb_custom_book_genre_taxonomy', 0 );
```

With this functionality plugin installed we've created a new custom post type, added an interface to it on the admin UI, and made sure we can access it through the REST API.
