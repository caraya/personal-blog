---
title: "Adding CPT and Taxonomies to an existing theme"
date: "2021-07-07"
---

In the last post, we covered the technical part of creating Custom Post Types (CPTs) and Taxonomies. This post will cover integrating the CPT into a theme. We will also discuss issues regarding using CPTs as a plugin and modifying an existing theme or child theme versus incorporating the code for the CPT into a theme.

## Choosing deployment strategies

The most common way to deploy CPTs is to bundle the code in a plugin and deploy them independent of the theme you're using.

This means that you will have to customize whatever theme you choose by creating a child theme for each theme you want to add the CPT to.

Creating a child theme is beyond the scope of this post but it's well documented in the [theme handbook](https://developer.wordpress.org/themes/advanced-topics/child-themes/).

We'll leverage the [template hierarchy](https://developer.wordpress.org/themes/basics/template-hierarchy/) to create templates specific to the CPT and taxonomies we created.

The process is simple:

1. Create a new template and name it as appropriate or copy the existing template (`single.php` or `archive.php`) and rename it to match your CPT or taxonomy
2. Customize the template to suit your needs

For the CPT, we'll create two type-specific templates:

- `single-book.php` for single entries of type book
- `archive-book.php` for listings of books

We can start these files from the corresponding generic versions (`single.php` and `archive.php`) and then modify them to suit our needs. Using these customized templates we can leverage the whole set of tools available to WordPress templates.

This assumes that we want the book post type to have its own template. Another option is to use [conditional tags](https://developer.wordpress.org/themes/basics/conditional-tags/) to branch an existing template based on post type or any other criteria we want to use.

This process reduces the number of files at the cost of complexity and more difficulty in reading and understanding the files in question, particularly if you want to share your work.

### Adding the CPT to an existing theme's homepage

There may be times when you just want to add the custom post type to the home page without any type of customization; for example, you may want to add new business listings to the blog homepage or you may want to format your glossary the same way you format your regular content.

The sample function checks if we're home and if the query is the primary one. If the query matches the condition then we modify the query to add the CPT so it will appear on the home page. We could generalize this function to include all the CPTs that we want to add to the homepage.

Put the same function below on your theme's `functions.php` file.

```php
<?php
function rivendellweb_add_glossary_to_query( $query ) {
    if ( $query->is_home() && 
         $query->is_main_query() ) {
        $query->set( 'post_type', array( 
          'post',
          'glossary'
        ) );
    }
}

add_action( 'pre_get_posts',
            'rivendellweb_add_glossary_to_query' );
```
