---
title: "WordPress CMS CRUD (Part 5): Adding attributes to a REST API endpoint"
date: "2020-06-08"
---

When working with APIs we should never, under any circumstance, remove elements from the endpoint. Even if you're the owner there is no real way to know who's consuming your data and how they are doing it so removing elements of the API can cause unexpected and unpleasant problems down the road.

However, there is no problem with adding attributes to your custom endpoints. This post will discuss how to do it using built-in WordPress functions and coding practices.

Before we jump into adding attributes we need to ask ourselves if we need a new attribute or if we can use a combination of existing attributes to accomplish our tasks.

For example, we can get the 3 latest posts by using `per_page` and a value of 3 rather than having to create a custom field for our application.

If we decide that we need a custom field in the REST API, then the process is a two-step one.

We first create the REST API field using the [register\_rest\_field](https://developer.wordpress.org/reference/functions/register_rest_field/) function.

The first parameter is the type of post that you're adding the attribute for.

The second parameter is the name of the attribute that we're adding.

The third parameter is an array of callbacks for the field. The callbacks are:

`get_callback` _Optional_.

The callback function used to retrieve the field value. Default is 'null', the field will not be returned in the response.

`update_callback` _Optional_.

The callback function used to set and update the field value. Default is 'null', the value cannot be set or updated.

`schema` _Optional_.

The callback function used to create the schema for this field.

In this particular case, we only need to retrieve the value of the field so we only define a `get_callback`.

```php
<?php
function rivendellweb_add_new_field() {
  register_rest_field( 
    'post',
    'catlinks',
      array(
        'get_callback'    => 'rivendellweb_get_category_links',
        'update_callback' => null,
        'schema'          => null,
    ) 
  );
}

add_action( 'rest_api_init', 'rivendellweb_add_new_field' );
```

We then define the functions for each of the callbacks that we want to implement. In this case, we only want to retrieve the value for this field, so we only need to define the `get_callback` function.

This function retrieves the categories from the current post, formats the categories, and returns the results the categories to use as the value for the REST field.

```php
<?php
function riivendellweb_get_category_links() {
  $categories = get_the_category();
  $separator = ', ';
  $output = '';
  if ( ! empty( $categories ) ) {
    foreach( $categories as $category ) {
      $output .= '<a href="' . esc_url( get_category_link( $category->term_id ) ) . '">' . esc_html( $category->name ) . '</a>' . $separator;
    }
    $output = trim( $output, $separator );
  }
  return $output;
}
?>
```
