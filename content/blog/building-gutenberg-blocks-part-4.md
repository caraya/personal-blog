---
title: "Building Gutenberg Blocks (Part 4)"
date: "2020-04-13"
---

There are many other things we can do with blocks and things to explore. But for right now we'll move into enhancing the blocks we've built and add some flare to them.

## Making the editor match the front end

Before we look at some enhancements for the blocks, let's make sure that the editor matches the front end content.

The match will not be 100%; The way I've set up my theme is different than the way blocks are styled in Gutenberg, but it's close enough to make it not look very dissimilar.

The following commands are included in an init function and then attached to the `after_setup_theme` action.

The first block adds editor-specific styles and the default styles for the built-in blocks.

```php
<?php
add_theme_support('editor-styles');
add_editor_style( '/editor-styles.css' );
add_theme_support( 'wp-block-styles' );
```

The next block sets custom font sizes for the editor dialogues. Whenever Gutenberg presents you with a font-size selection dialogue, these are the values it will use.

I've truncated the list to make the post easier to read. The full list has three additional values.

```php
<?php
add_theme_support(
'editor-font-sizes',
array(
  array(
      'name' => __( 'Small', 'rivendellweb-blocks' ),
      'size' => 10,
      'slug' => 'small'
  ),
  array(
      'name' => __( 'Regular', 'rivendellweb-blocks' ),
      'size' => 16,
      'slug' => 'regular'
  )
  // truncated to save space
);
```

Like we did with the custom fonts sizes we do the same thing with a custom color palette.

```php
<?php
add_theme_support(
'editor-color-palette',
array(
  array(
      'name' => __( 'Magenta', 'rivendellweb-blocks' ),
      'slug' => 'magenta',
      'color' => '#a156b4',
  ),
  array(
      'name' => __( 'Light Magenta', 'rivendellweb-blocks' ),
      'slug' => 'light-magenta',
      'color' => '#d0a5db',
  ),
  // Truncated to save space
)
);
```

The idea is that the theme defines the colors we use and then Gutenberg picks them up automatically and uses them as if they were part of the default.

## Adding Custom Block Categories

In addition to preset categories for blocks, we can also create our categories to hold blocks.

We had the block class in PHP using the `block-categories` filter.

The blocks are meant for posts only so we first make sure that we are working with posts before we proceed if we're not then we return the existing categories

```php
<?php
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
```

See [Gutenberg: Creating Custom Block Categories](https://loomo.ca/gutenberg-creating-custom-block-categories/) for more information
