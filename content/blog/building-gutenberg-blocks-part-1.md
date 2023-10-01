---
title: "Building Gutenberg Blocks (Part 1)"
date: "2020-04-01"
---

Whether we like it or use it, the Gutenberg editor is here to stay. While I don't use it for my own content and have developed themes that rely on the classic editor plugins, I realize that any WordPress shop moving forward needs to at least be aware of how to build blocks.

It's unlikely that the Classic Editor plugin or other means to disable Gutenberg will remain available past 2022 (when the Classic Editor plugin is supposed to stop being fully supported).

So this post will cover the creation of Gutenberg blocks and some basic setup in both PHP and Javascript

## Creating the build system

The following block examples are meant to be built inside a plugin. They won't work if installed inside a theme, which is also not recommended and will result in your theme being rejected for inclusion in the plugin directory.

### PHP setup

On the root of the plugin folder, we'll add the main PHP file to be the driver for all the blocks that we will create.

The first part is the plugin metadata. The information here will allow WordPress to use the plugin.

The name is required, everything else is optional.

```php
<?php
/*
Plugin Name: rivendellweb-blocks
Description: Collection of blocks based
  on work done on the Rivendellweb
  theme
Version: 0.0.1
Author: Carlos Araya
Author URI: https://example.org
*/
```

The second part block is the actual code.

Exit the page unless there is a defined `ABSPATH` constant.

If we haven't exited then require the `index.php` for each block that we want to work with. This allows us to keep the code for each block separately and the code inside the plugin

```php
<?php
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

include 'rivendellweb-static/index.php';
```

## Setting up the build environment

Because I've chosen to write my blocks in ESNext I have to set up a Node-based build system.

The first thing to do is to create a `package.json` file to store the plugins.

```bash
npm init --yes
```

This will create the package file and populate it automatically with all my configured preferences.

Next, we need to create a `.gitignore` file so that we won't push unnecessary files and folders to git. To do this we run the following command

```bash
npx gitignore node
```

This will run `npx`, part of Node as of 5.2, and run the [gitignore package](https://www.npmjs.com/package/gitignore) for Node projects.

Instead of configuring WebPack to build and bundle the code directly, I will use `@wordpress/scripts` as the tooling for the project.

```bash
npm i -D @wordpress/scripts
```

Once we have the package installed, we need to replace the scripts block with one configured to use the scripts in the package. Modify the `scripts` portion of package.json to use the following scripts:

```js
`"scripts": {
  "build": "wp-scripts build",
  "check-engines": "wp-scripts check-engines",
  "check-licenses": "wp-scripts check-licenses",
  "format:js": "wp-scripts format-js",
  "lint:css": "wp-scripts lint-style",
  "lint:js": "wp-scripts lint-js",
  "lint:md:docs": "wp-scripts lint-md-docs",
  "lint:md:js": "wp-scripts lint-md-js",
  "lint:pkg-json": "wp-scripts lint-pkg-json",
  "packages-update": "wp-scripts packages-update",
  "start": "wp-scripts start",
  "test:e2e": "wp-scripts test-e2e",
  "test:unit": "wp-scripts test-unit-js"
}`
```

## Building Blocks

With the basic building tools in place, we'll concentrate on building the blocks themselves inside a plugin.

We'll build a base block and then enhance it with additional functionality.

Each block has two main files: `index.php` that manages the communication with WordPress core and `index.js` that runs the react code we need to make the block display in Gutenberg and render on the page.

All the block examples require you to build them using the process outlined in the previous section. They will not work otherwise.

You can check a finished version of the blocks in the Github repository at [https://github.com/caraya/rivendellweb-blocks](https://github.com/caraya/rivendellweb-blocks)

### Base

The first block will display static content as we might do for a call to action or other static content.

### PHP

In the PHP side, the first part makes sure that we're not trying to access the script directly by checking if the constant `ABSPATH` is defined. If not, we exit and do nothing.

```php
<?php
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
```

If we pass the check then we start working with internationalization.

We use the [load\_plugin\_textdomain](https://developer.wordpress.org/reference/functions/load_plugin_textdomain/) to load a plugin's translated `.mo` files.

We then add the function to the [init hook](https://developer.wordpress.org/reference/hooks/init/).

```php
function rivendellweb_blocks_example_01_load_textdomain() {
    load_plugin_textdomain( 'rivendellweb-blocks', false, basename( __DIR__ ) . '/languages' );
}
add_action( 'init', 'rivendellweb_blocks_example_01_load_textdomain' );
```

The second part is a little more complex.

We first test to see if Gutenberg is supported by checking if `register_block_type` is supported. If it's not then we return as there is nothing for us to do.

It uses `index.asset.php`, a file generated during the build process, to reference pre-requisites and other assets to set them to a variable.

`wp_register_script` will register a script and its dependencies to be enqueued at a later time. It is different than using `wp_enqueue_script`.

`register_block_type` does the bulk of the work, it registers the block type and makes it available to the block editor.

The last part of this function is to check if `wp_set_script_translations` is available, meaning that we have translation tools available. If it is then we use it to load all the translated scripts for the plugin.

We also hook this function to the [init hook](https://developer.wordpress.org/reference/hooks/init/) to make sure that it's available when Wordpress first starts.

```php
function rivendellweb_blocks_example_01_register_block() {

  if ( ! function_exists( 'register_block_type' ) ) {
    // Gutenberg is not active.
    return;
  }

    // automatically load dependencies and version
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');

    wp_register_script(
        'rivendellweb-blocks-example-01',
        plugins_url( 'build/index.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version']
    );

    register_block_type( 'rivendellweb-blocks/example-01', array(
        'editor_script' => 'rivendellweb-blocks-example-01',
    ) );

  if ( function_exists('wp_set_script_translations' ) ) {
    wp_set_script_translations( 'rivendellweb-blocks-example-01', 'rivendellweb-blocks' );
  }

}
add_action( 'init', 'rivendellweb_blocks_example_01_register_block' );
```

### Javascript / React

The Javascript portion of the block uses the `i18n` and `blocks` packages from WordPress to build the block.

If you've done work with internationalization you may recognize the `__()` command as the command you use to internationalize strings.

We first import the components that we want to use.

For this block, we'll define the styles inside a constant, `blockStyle`, that will be used for both the editor and the rendered content.

The block title uses a localized string to indicate that translators can work with it.

The icon is one of those available in the WordPress dashicon library.

The part that surprised me the most is the need for two statements with the same content. The `edit()` creates the content specific to the editor while `save()` works with content specific to what will render on the client.

The block will use the same style in the editor and the front end.

```js
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

const blockStyle = {
    backgroundColor: '#639',
    color: '#fff',
    padding: '20px',
};

registerBlockType( 'rivendellweb-blocks/example-01', {
    title: __( 'Example 01', 'rivendellweb-blocks' ),
    icon: 'universal-access-alt',
    category: 'layout',
    example: {},
    edit() {
        return (
            <div style={ blockStyle }>
                <h2>Notice</h2>
                <p>Hello World, step 1 (from the editor).</p>
            </div>
        );
    },
    save() {
        return (
            <div style={ blockStyle }>
                <h2>Notice</h2>
                <p>Hello World, step 1 (from the front end).</p>
            </div>
        );
    },
} );
```

We could create different constants holding different styles and then use them to produce different results for the editor block versus what appears in the front end.

### External Styles

SO far all the styles have been hardcoded to the block. In this example, we'll make the block use an external stylesheet for styling the block.

To use external style sheets we first have to remove the constant containing the styles for the element.

We then add one or more calls to `wp_register_style` to add the stylesheets.

We also have to modify the call to `register_block_type` to accommodate the styles

- **`style`** is used for the default styles
- **`editor_style`** is used for editor styles if they are different than the default. This loads after the default styles so they will override the basic styles if they are different.

```php
<?php
// The editor styles override the default styles set below
wp_register_style(
  'rivendellweb-blocks-example-02-editor-stylesheets',
  plugins_url( 'editor.css', __FILE__ ),
  array( 'wp-edit-blocks' ),
  filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
);

// Default styles
wp_register_style(
  'rivendellweb-blocks-example-02',
  plugins_url( 'style.css', __FILE__ ),
  array( ),
  filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
);

register_block_type( 'rivendellweb-blocks/example-02-stylesheets', array(
  'style' => 'rivendellweb-blocks-example-02',
  'editor_style' => 'rivendellweb-blocks-example-02-editor-stylesheets',
  'editor_script' => 'rivendellweb-blocks-example-02',
) );
```
