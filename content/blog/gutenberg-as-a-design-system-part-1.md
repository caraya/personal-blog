---
title: "Gutenberg as a design system (part 1)"
date: "2020-04-20"
---

One of the things I've found the most intriguing about Gutenberg is the ability to create variations of a given element and build the basic components of design systems.

From there we can also build what Brad Frost calls molecules, compositions of one or more elements that are used together.

This post will explore how to create variations of existing blocks and how to create composite blocks for our end users.

The examples below will only work when Gutenberg is in visual mode and will not work in the classic editor or when Gutenberg is in HTML mode.

## Block Variations

Variations are different styles or variations for a given component. The idea is that we don't need to create custom blocks and then style them, we can use CSS to change the appearance of default blocks to suit our needs.

### Client Side

The quickest way to create block variations is to use client-side techniques and let the browser do all the work.

This takes the following steps:

1. Define the block variations in the Javascript file we enqueued, `block-variations.js`
    
    - If necessary we remove existing custom styles from the elements we're working on
2. Enqueue the script in `index.php`
3. Create the variations in `block-variations.js`
4. Enqueue `block-variations.css`
    
    - Add styles for the variations in `block-variations.css`

Enqueueing the script uses the `enqueue_block_editor_assets` action and a callback function as shown below.

Note that the enqueue script also list dependencies that must be loaded before the script we're enqueueing. This makes sure we have no errors down the line.

```php
<?php
function rivendellweb_enqueue_variatons() {
  wp_enqueue_script(
    'myguten-script',
    plugins_url( '/lib/block-variations.js', __FILE__ ),
    array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
    filemtime( plugin_dir_path( __FILE__ ) . '/lib/block-variations.js' )
  );
}
add_action( 'enqueue_block_editor_assets', 'rivendellweb_enqueue_variatons' );
```

The variations script, `block-variations.js` has two parts. The first one removes any prior definitions of our blocks so that our definition will be the one that works.

```js
// Unregister existing styles
wp.domReady( function() {
  wp.blocks.unregisterBlockStyle( 'core/quote', 'large' );
  wp.blocks.unregisterBlockStyle( 'core/quote', 'fancy' );
} );
```

The second part registers variations for different elements. In this example, we've done one for paragraphs and three for blockquotes.

`wp.blocks` is the ES5 version of this code. I chose it because using it I don't have to use WebPack with it.

Each declaration uses `registerBlockStyle` and has two parameters:

1. The namespace and name of the block we're customizing
2. An object with the properties for the variation. The attributes we've used are
    
    - **name**: the short name for the variation
    - **label**: the user-visible name

```js
// Paragraph variations
wp.blocks.registerBlockStyle( 'core/paragraph', {
  name: 'lede-paragraph',
  label: 'First Paragraph',
} );

// Blockquote variations
wp.blocks.registerBlockStyle( 'core/quote', {
  name: 'fancy-quote',
  label: 'Fancy Quote',
} );

wp.blocks.registerBlockStyle( 'core/quote', {
  name: 'top-bottom-quote',
  label: 'Top and Bottom',
})

wp.blocks.registerBlockStyle( 'core/quote', {
  name: 'red-quote',
  label: 'Red Quote',
})
```

Next, add the styles for each of the variations, we wrap the styles on a `:root` rule to avoid some specificity problems. Even then there are conflicts with custom font sizes, so I'm either having to use !important (ugh), figure out a way to increase specificity or let the cascade do its thing.

```css
:root {
  .is-style-lede-paragraph {
    font-size: 125%;
  }

  .is-style-fancy-quote {
    border-left: 4px solid red;
  }

  .is-style-top-bottom-quote {
    border-top: 4px solid black;
    border-bottom: 4px solid black;
    border-left: none;
  }

  .is-style-red-quote {
    color: red;
  }
}
```

the final step is to enqueue the stylesheet to use in the front-end of the site. Because this is not for the editor, we need a different action to enqueue the styles.

```php
<?php
function rivendellweb_variation_styles() {
    wp_enqueue_style( 'myguten-style', plugins_url( 'style.css', __FILE__ ) );
}
add_action( 'enqueue_block_assets', 'rivendellweb_variation_styles' );
```

### Server Side

We can also create all the variations on the server and add the styles from an external style sheet.

```php
<?php
wp_register_style(
  'variations-style',
  get_template_directory_uri() . '/variations/variation-styles.css' );
```

```php
<?php
register_block_style(
    register_block_style( 
      'core/paragraph', 
      array( 
        'name' => 'lede-paragraph',
        'label' => 'First Paragraph', 
        'style_handle' => 'variations-style',
      )
    ),

    // Blockquote variations
  register_block_style( 
    'core/quote', 
    array(
      'name' => 'fancy-quote',
      'label' => 'Fancy Quote',
      'style_handle' => 'variations-style',
    )
  ),
  register_block_style( 
    'core/quote',
    array(
      'name' => 'top-bottom-quote',
      'label' => 'Top and Bottom',
      'style_handle' => 'variations-style',      
    )
  ),
  register_block_style( 
    'core/quote', 
    array(
      'name' => 'red-quote',
      'label' => 'Red Quote',
      'style_handle' => 'variations-style',
    )
  )
);
```

These types of customizations give us a full-powered design system on top of whatever custom blocks we create. In the next post, we'll discuss templating using blocks and what new custom post types may look like
