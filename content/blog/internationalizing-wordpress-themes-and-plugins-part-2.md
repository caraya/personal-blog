---
title: "Internationalizing WordPress Themes and Plugins (part 2)"
date: "2020-06-17"
---

## Internationalizing a plugin

After setting up the text domain in your plugin metadata we need to load the translated files to use them.

For plugins we use the [load\_plugin\_textdomain](https://developer.wordpress.org/reference/functions/load_plugin_textdomain/) function; it takes 4 parameters:

1. The name of text domain
2. This parameter is deprecated so always use FALSE
3. The path to the directory where your plugin's translations are stored

Then add an action for the `plugins_loaded` hook and call the function we just created.

```php
<?
function rivendellweb_load_plugin_textdomain() {
  load_plugin_textdomain(
    'my-demo-plugin', // 1
    FALSE,  // 2
    basename(  // 3
      dirname( __FILE__ ) ) . '/languages/'
  );
}
add_action( 'plugins_loaded', 'rivendellweb_load_plugin_textdomain' );
```

See [How to Internationalize Your Plugin](https://developer.wordpress.org/plugins/internationalization/how-to-internationalize-your-plugin/) for more information about plugin internationalization.

## Internationalizing a theme

Internationalizing themes is slightly different than plugins. The function we call is [load\_theme\_textdomain](https://developer.wordpress.org/reference/functions/load_theme_textdomain/).

The function takes two parameters:

1. The text domain identifier for the theme we want to use
2. The location of the language file

```php
<?php
function rivendellweb_load_theme_textdomain() {
    load_theme_textdomain( 'my-demo-theme', get_template_directory() . '/languages' );
}
add_action(
  'after_setup_theme',
  'rivendellweb_load_theme_textdomain'
);
```

https://developer.wordpress.org/themes/functionality/internationalization/

## Internationalizing Javascript

### Note

We've already covered the basics of Javascript i18n in part 3 of my [Building Gutenberg Blocks](https://publishing-project.rivendellweb.net/building-gutenberg-blocks-part-3/) series.

We'll just revisit some of the most important details here.

At this time the only use I see for JavaScript internationalization in WordPress is for Gutenberg blocks.

[wp.i18n](https://developer.wordpress.org/block-editor/packages/packages-i18n/) provides a subset of the Gettext localization functions discussed earlier.

- `__( 'Hello World', 'my-text-domain' )` – Translate a string
- `_n( '%s Comment', '%s Comments', numberOfComments, 'my-text-domain' )` – Translate and retrieve the singular or plural form based on the supplied number.
- `_x( 'Default', 'block style', 'my-text-domain' )` – Translate a certain string with additional context.

This example provides a basic internationalize Gutenberg block. Since we're working with React, our process has a build system that will convert the import statements into something older browsers can use.

```js
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';

registerBlockType( 'myguten/simple', {
  title: __( 'Simple Block', 'myguten' ),
  category: 'widgets',

  edit: () => {
    return (
      <p style="color:red">
        { __( 'Hello World', 'myguten' ) }
      </p>
    );
  },

  save: () => {
    return (
      <p style="color:red">
        { __( 'Hello World', 'myguten' ) }
      </p>
    );
  },
} );
```

This will not work with external scripts. For that we need to use [wp\_localize\_script](https://developer.wordpress.org/reference/functions/wp_localize_script/)

The function will only work with scripts we've enqueued to the system using `wp-enqueue-script`.

```js
wp_enqueue_script(
  'rivendellweb-navigation',
  get_template_directory_uri() . '/js/navigation.js',
  array('jquery'), '20151215', true
);
```

`wp_localize_script` takes three attributes:

- The name of the enqueued script
- The name of the javascript object we want to work with
- An array of internationalized objects

```js
wp_localize_script( 'rivendellweb-navigation',
  'rivendellwebScreenReaderText',
  array(
    'expand' => __( 'Expand child menu', 'rivendellweb'),
    'collapse' => __( 'Collapse child menu', 'rivendellweb'),
  )
);
```

## Additional considerations: RTL languages

If you're planning on distributing your theme and plugin there's one final consideration that I want to mention on this post; right to left language and how much our designs need to change to accommodate those languages.

Compare the next two images. The first one is in English, left to right, top to bottom language. The second one is in Arabic, a right to left, top to bottom language.

![English version of the United Nations Websie](https://res.cloudinary.com/dfh6ihzvj/image/upload/v1587718299/publishing-project.rivendellweb.net/un-site-english.png)

 

![Arabic version of the United Nations Website](https://res.cloudinary.com/dfh6ihzvj/image/upload/v1587718292/publishing-project.rivendellweb.net/un-site-arabic.png)

English and Arabic versions of the United Nations Website [www.un.org](https://www.un.org/)

The content flows differently and we should take these languages into account when deciding on margin and padding for our content.

Because we don't know where our themes and plugins will be used we need to keep these differences in mind and provide some level of support for RTL languages.

You can convert your stylesheets to work with RTL languages manually or using tools like [gulp-rtlcss](https://github.com/jjlharrison/gulp-rtlcss#readme)
