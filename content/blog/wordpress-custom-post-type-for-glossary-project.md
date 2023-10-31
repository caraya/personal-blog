---
title: "WordPress Custom Post Type for Glossary Project"
date: "2021-07-05"
---

I've been playing with the idea of creating a technical glossary for referring to technical terms on my posts. After a lot of research I came back to a simple tool: WordPress custom post types (CPT).

The idea is as follows:

1. Create a custom post type plugin for glossary entries
   * Create the post type
   * Change the labels as appropriate
   * Ensure that it will appear in the REST API and use Gutenberg if desired
2. Create a corresponding taxonomy
   * Change the labels as appropriate
   * Ensure that it will appear in the REST API
3. Explore how to incorporate the CPT and taxonomy into an existing theme
   * Ensure that it will appear on the home page if needed or desired
   * Create additional templates to work with the custom post type
   * Flush the cache on plugin activation (and only on activation)

## Create Glossary Entry Custom Post Type

Creating the Custom Post Type is not hard, it's just somewhat cumbersome.

I first created an array of names and internationalized values for the different labels that I want to change from the default. I put the array in a separate variable to make the code easier to read.

```php
<?php
function rivendellweb_custom_glossary_type() {
  $labels = array(
    'name' => __( 'Glossary Entries', RWPDOMAIN ),
    'singular_name' => __( 'Glossary Entry', RWPDOMAIN ),
    'featured_image' => __( 'Entry Image', RWPDOMAIN ),
    'set_featured_image' => __( 'Set Entry Image', RWPDOMAIN ),
    'remove_featured_image' => __( 'Remove Entry Image', RWPDOMAIN ),
    'use_featured_image' => __( 'Use Glosary Entry Image', RWPDOMAIN ),
    'archives' => __( 'Glossary', RWPDOMAIN ),
    'add_new' => __( 'Add Glosary Entry', RWPDOMAIN ),
    'add_new_item' => __( 'Add Glosary Entry', RWPDOMAIN ),
  );
```

The second variable holds an array of the arguments for the CPT that we will use when registering the post

The two important attributes in the array are:

* `supports` tells WordPress what areas of the editor are available in this Custom Post Type
* `show_in_rest` makes the CPT available through the REST API and activates the Gutenberg editor for this CPT when set to true

```php
<?php
  $args = array(
    'labels'       => $labels,
    'public'       => true,
    'has_archive'  => 'glossary',
    'rewrite'      => array(
      'has_front' => true ),
    'menu_icon'    => 'dashicons-book',
    'supports'     => array(
      'title',
      'editor',
      'thumbnail',
     ),
    // Line below makes CPT available in rest
    // Line below makes CPT available to
    //Gutenberg/Block editor
    'show_in_rest' => true,
  );
```

We need to run the `register_post_type` function. It takes two parameters: the name of the CPT and an array of arguments we defined in the `$args` variable.

```php
<?php
  register_post_type( 'glossary', $args );
}
```

The final step is to add our Custom Post Type to WordPress. We do this by adding the function we created to the init hook using `add_action`.

```php
<?php
add_action( 'init',
 'rivendellweb_custom_glossary_type' );
```

We have a custom post type. We will next look at creating a taxonomy for the CPT and how to integrate them.

For more information, check the reference page for [register\_post\_type](https://developer.wordpress.org/reference/functions/register_post_type/)

## Create Taxonomy for Glossary Entries

In WordPress, a taxonomy is a way of grouping posts together based on a select number of relationships. WordPress ships with two default taxonomies, categories, and tags but these are not enough for customized or highly specialized post types.

WordPress allows you to create custom taxonomies to go along with your CPTs. In this case, we'll create a taxonomy for the book CPT. For this example, we will create a genre taxonomy for our books.

Just like with the CPT, we first register the labels that we want to update. This is a basic subset, there are more labels we can customize.

```php
<?php
function rivendellweb_custom_book_genre_tax() {
  $tax_labels = array(
    'name'          => 'Genres',
    'singular_name' => 'Genre',
    'search_items'  => 'Search Genres',
    'edit_item'     => 'Edit Genre',
    'add_new_item'  => 'Add New Genre'
  );
```

Next, we define an array of arguments. The biggest difference between this array and the one we used to define the book CPT is that we are making the taxonomy hierarchical. This will allow to create parent-child relationships like **non-fiction -> technology** or **fiction -> science fiction**

```php
<?php
  $args = array(
    'labels' => $tax_labels,
    'show_in_rest' => true,
    'hierarchical' => true,
    'query_var'    => true,
    'rewrite' => array(
      'has_front' => true ),
    'supports' => array(
      'title',
      'editor',
      'thumbnail'
    ),
  );
```

The `register_taxonomy` function takes three parameters: the name of the taxonomy, the name of the post type it's associated with and an array of arguments for the taxonomy (that we defined in the `$args` variable)

```php
<?php
  register_taxonomy('genre', 'book', $args);
}
```

like we did with the CPT, we need to tell WordPress to register the taxonomy so it can use it. We do this with the `add_action` function. The first parameter is the action we want to attach the code to and the second one is the function that we want to attach to the init event, in this case, `rivendellweb_custom_book_genre_tax`

```php
<?php
add_action( 'init',
  'rivendellweb_custom_book_genre_tax'
);
```

This process did two things, it created the `genre` taxonomy and associated it with the book post type. We can also associate our custom taxonomies to post and pages.

See [register\_taxonomy](https://developer.wordpress.org/reference/functions/register_taxonomy/) for more information

## Flush the cache on plugin activation

```php
<?php
function my_rewrite_flush() {
    // initialize the custom post type
    rivendellweb_custom_glossary_type();

    flush_rewrite_rules();
}

register_activation_hook( __FILE__,
 'my_rewrite_flush' );
```

## Use the Taxonomy in the CPT

When you register the taxonomy you've already associated it with the CPT you want to use it with. To make sure all functionality works properly, you must also register the association from the CPT arguments by adding the following element to the CPT `$args` array:

```php
<?php
  'taxonomies' => array(
    'genre',
  ),
```

The array contains all the custom taxonomies that we want to use with the CPT. For books, we could also add authors and publishers taxonomies.
