---
title: "Styling Gutenberg blocks"
date: "2022-03-09"
---

Block Styles allow alternative styles to be applied to existing blocks whether they are defined in core or via third-party plugins. They add a `className` attribute matching the style name to the block’s wrapper.The attribute applies alternative styles for the block if the style is selected.

The example registers a _narrow-paragraph_ style for the core/paragraph block. When the user selects the narrow-paragraph style from the styles selector, an `is-style-narrow-paragraph` className attribute will be added to the block’s wrapper.

```js
wp.blocks.registerBlockStyle(
  'core/paragraph', {
    "name": "narrow-paragraph",
    "label": "Narrow Paragraph",
  }
)
```

By adding `isDefault: true` you can mark the registered block style as the one that is recognized as active when no custom class name is provided. It also means that there will be no custom class name added to the HTML output for the style that is marked as default.

To remove a block style use `wp.blocks.unregisterBlockStyle()`.

```js
wp.blocks.unregisterBlockStyle(
  'core/quote',
  'large'
);
```

The above removes the block style named large from the core/quote block.

**When unregistering a block style, there can be a race condition on which code runs first: registering the style, or unregistering the style. You want your unregister code to run last.**

Do this by specifying the component that is registering the style as a dependency, in this case, wp-edit-post. Additionally, using `wp.domReady()` ensures the unregister code runs once the dom is loaded.\*\*

Enqueue your JavaScript with the following PHP code:

```php
<?php
function rivendellweb_blocks_enqueue() {
    wp_enqueue_script(
        'rivendellweb-blocks-script',
        plugins_url( 'rivendellweb-blocks.js', __FILE__ ),
        array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
        filemtime( plugin_dir_path( __FILE__ ) . '/rivendellweb-blocks.js' )
    );
}
add_action( 'enqueue_block_editor_assets', 'rivendellweb_blocks_enqueue' );
```

The JavaScript code in `rivendellweb-blocks.js`:

```js
wp.domReady( function () {
    wp.blocks.unregisterBlockStyle( 'core/quote', 'large' );
} );
```

## Server-side registration helpers

While the samples provided do allow full control of block styles, they do require a considerable amount of code.

To simplify the process of registering and unregistering block styles, two server-side functions are available: `register_block_style`, and `unregister_block_style`.

## register\_block\_style

The `register_block_style` function receives the name of the block as the first argument and an array describing properties of the style as the second argument.

The properties of the style array must include name and label:

- **name**: The identifier of the style used to compute a CSS class.
- **label**: A human-readable label for the style.

Besides the two mandatory properties, the styles properties array should also include an inline\_style or a style\_handle property:

- **inline\_style**: Contains inline CSS code that registers the CSS class required for the style
- **style\_handle**: Contains the handle to an already registered style that should be enqueued in places where block styles are needed

It is also possible to set the `is_default` property to true to mark one of the block styles as the default one.

The following code sample registers a style for the quote block named “Blue Quote”, and provides an inline style that makes quote blocks with the `Blue Quote` style have blue color:

```php
<?php
register_block_style(
    'core/quote',
    array(
        'name'         => 'blue-quote',
        'label'        => __( 'Blue Quote', 'textdomain' ),
        'inline_style' => '.wp-block-quote.is-style-blue-quote { color: blue; }',
    )
);
```

Alternatively, you can register a stylesheet that contains all your block-related styles and just pass the stylesheet’s handle so `register_block_style` function will make sure it is enqueued.

```php
<?php
wp_register_style( 'myguten-style', get_template_directory_uri() . '/custom-style.css' );

register_block_style(
    'core/quote',
    array(
        'name'         => 'fancy-quote',
        'label'        => __( 'Fancy Quote', 'textdomain' ),
        'style_handle' => 'rivendellweb-block-styles',
    )
);
```

## unregister\_block\_style

`unregister_block_style` allows developers to unregister a block style previously registered **on the server** using `register_block_style`.

The function has two arguments:

- The registered name of the block
- The name of the style

The following example unregisters the style named `fancy-quote` from the quote block:

```php
<?php
unregister_block_style( 'core/quote', 'fancy-quote' );
```

**The function unregister\_block\_style will only unregister styles that were registered on the server using register\_block\_style.** The function does not unregister a style registered using client-side code.

We'll revisit styling blocks when we talk about Gutenberg as a design system.
