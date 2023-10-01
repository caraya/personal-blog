---
title: "Resource Hints in WordPress"
date: "2020-03-25"
---

Resource hints are a relationship used to indicates that a given origin or resource should be acted upon before they are loaded.

Doing this in WordPress is more complicated. While we could add the resources directly to the templates it would require changing the templates whenever we change fonts or any detail of the type of resource hint.

The code below is taken from the [Twenty Seventeen](https://wordpress.org/support/article/twenty-seventeen/) theme and with some modifications will work on any theme running on recent versions of WordPress.

It requires enqueuing the fonts generated through `twentyseventeen_fonts_url()`, which is outside the scope of this post but is available on their [Subversion repository](https://themes.svn.wordpress.org/twentyseventeen/2.2/functions.php)

The enqueuing script is similar to how we normally enqueue scripts and fonts to use with WordPress but the second parameter calls a theme function rather than a static asset. The modified code looks like this.

```php
<?php
function twentyseventeen_scripts() {
    // Add custom fonts, used in the main stylesheet.
  wp_enqueue_style( 'twentyseventeen-fonts', twentyseventeen_fonts_url(), array(), null );

add_action( 'wp_enqueue_scripts', 'twentyseventeen_scripts' );

?>
```

We then create resource hints in `twentyseventeen_resource_hints()`. It takes two parameters:

- **@param array _$urls_** URLs to print for resource hints.
- **@param string _$relation\_type_** The relation type the URLs are printed.

And returns an array of URLs of resource hints to print.

```php
<?php
 function twentyseventeen_resource_hints( $urls, $relation_type ) {
  if ( wp_style_is( 'twentyseventeen-fonts', 'queue' ) && 'preconnect' === $relation_type ) {
    $urls[] = array(
      'href' => 'https://fonts.gstatic.com',
      'crossorigin',
    );
  }

    return $urls;
}
add_filter( 'wp_resource_hints', 'twentyseventeen_resource_hints', 10, 2 );
?>
```

We choose what URL to create by checking if the style has been enqueued and if the type of relation (indicated in the `$relation_type` variable) is preconnect.

Finally, we add the `wp_resource_hint` filter with the function we just defined.
