---
title: "Gutenberg as design systems (part 3)"
date: "2020-04-27"
---

Blocks are awesome and provide a graphical way to create content but sharing them is not as intuitive as I would like to be, at least not yet.

This post will discuss how to use plugins to share both custom blocks, variations, and combined blocks and variations.

## Custom Blocks

In the plugin's `index.php` we create a block category where we can place all our blocks.

The comment at the top of the page contains the information that will appear on the plugins page.

The first functions `rivendellweb_blocks_block_category` defines a callback function that creates a category for the blocks we create. We then use the `block_categories` filter with the `rivendellweb_blocks_block_category` callback function.

Next, we include the blocks that we have created using `require example-0x/index.php` where the x represents a different directory containing a custom block.

```php
<?php

/**
 * Plugin Name: Rivendellweb Blocks
 * Plugin URI: https://github.com/WordPress/rivendellweb-blocks
 * Description: Rivendellweb blocks collection.
 * Version: 0.0.1
 * Author: Carlos Araya
 *
 * @package rivendellweb-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

function rivendellweb_blocks_block_category( $categories, $post ) {
  if ( $post->post_type !== 'post' ) {
      return $categories;
  }
  return array_merge(
    $categories,
    array(
      array(
        'slug' => 'rivendellweb-blocks',
        'title' => __( 'Rivendellweb Blocks', 'rivendellweb-blocks' ),
        'icon'  => 'wordpress',
      ),
    )
  );
}
add_filter( 'block_categories', 'rivendellweb_blocks_block_category', 10, 2);


include 'example-01/index.php';
include 'example-02/index.php';
include 'example-03/index.php';
include 'example-04/index.php';
include 'example-05/index.php';
include 'example-06/index.php';
include 'example-07/index.php';
```

If the blocks are valid and the individual build processes succeeded, then the plugin will add seven blocks to Gutenberg running on the server.

The full example is on GitHub at [rivendellweb-blocks](https://github.com/caraya/rivendellweb-blocks) and has been tested with Gutenberg 7.9.1 and with Github Gutenberg.

## Block Variations

As discussed earlier, variations allow you to change the look of a block without having to code a brand new version. The plugin that holds these variations has three files:

- A PHP file that makes the package into a plugin and links to scripts and styles
- A Javascript files with the variation definitions
- A CSS files containing the variations' styles

The plugin's `index.php` has the plugin boilerplate comment and two action + callback instances: one to enqueue the scrip and one to enqueue the stylesheet.

```php
<?php

/**
 * Plugin Name: Rivendellweb variations
 * Plugin URI: https://github.com/WordPress/rivendellweb-variations
 * Description: Rivendellweb blocks variations.
 * Version: 0.0.1
 * Author: Carlos Araya
 *
 * @package rivendellweb-blocks
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

function rivendellweb_enqueue_variations() {
    wp_enqueue_script(
        'rivendellweb-script',
        plugins_url( './src/block-variations.js', __FILE__ ),
        array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/block-variations.js' )
    );
}
add_action( 'enqueue_block_editor_assets', 'rivendellweb_enqueue_variations' );

function rivendellweb_variation_styles() {
    wp_enqueue_style(
        'rivendellweb_variations_css',
        plugins_url( './src/block-variations.css', __FILE__ ) );
}
add_action( 'enqueue_block_assets', 'rivendellweb_variation_styles' );
```

The full example is on GitHub at [rivendellweb-variations](https://github.com/caraya/rivendellweb-variations) and has been tested with Gutenberg 7.9.1 and with Github Gutenberg.

## Both Together

Whether to combine the two plugins discussed in this post into a single plugin is the reader's choice. I chose not to because I believe that each plugin should do one thing only and do it well.
