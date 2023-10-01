---
title: "Building Gutenberg Blocks (Part 3)"
date: "2020-04-08"
---

## Internationalization

We'll take a break from building actual blocks and talk about internationalization or i18n. Taking good care of i18n when you build your plugin will allow you or someone else to translate the text of your plugin so it's easier to use in languages other than the one it was written on

It works very close to how the PHP i18n functions work (and I believe this is deliberate), just different enough to take the Javascript needs into account.

First, we import the necessary functions. Most of the time it'll just be `__` but there are others.

```js
import { __ } from '@wordpress/i18n';
```

Now, whenever we have a string that we want to translate, we put inside the `__` command and indicate the text domain it's associated with.

This example tells translators that it's the string to translate is `Example 07` and the text domain is `rivendellweb-blocks`.

```js
title: __( 'Example  07', 'rivendellweb-blocks' )
```

Once we have all the strings ready for translation we need to generate a POT file to translate from and a PO file with the translated strings.

Translating plugins is similar to how you translate themes. I've documented the process in [Translating WordPress Themes](https://publishing-project.rivendellweb.net/translating-wordpress-themes/) so I won't go into too much detail about it here.

Using [Poedit](https://poedit.net/) the process is simple when using the Pro or Pro+ version.

1. Open Poedit and select Translate WordPress theme or plugin
2. Locate the plugin folder
3. Generate a POT file
4. Save the POT file to a `languages` folder inside your plugin. Create it if it doesn't exist
5. Use the POT file to generate your translation
6. Save the .po translation file to a `languages` folder inside your plugin

The last step is to load all available translations for our plugin from the languages directory by using [load\_plugin\_textdomain()](https://developer.wordpress.org/reference/functions/load_plugin_textdomain/) like the example below.

```php
<?php
function rivendellweb_blocks_example_07_load_textdomain() {
    load_plugin_textdomain(
        'rivendellweb-blocks',
    false,
    basename( __DIR__ ) . '/languages' );
}

add_action( 'init', 'rivendellweb_blocks_example_07_load_textdomain' );
```

So now we've made our plugins fully translatable and if we add new functionality or update the wording of the plugin text shown to the user we just need to update the template and the translations.
