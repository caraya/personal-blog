---
title: "New Gutenberg Features: block and global configuration"
date: "2022-03-02"
---

Gutenberg provides additional ways to configure blocks and themes using JSON files one for block levels and one for global theme settings.

We'll look at each of these in more detail

## block.json as a block configuration point

The `block.json` file is both a configuration point (what it is and how it works) and a way to make the metadata in the JSON file available to both PHP and Javascript.

The code below provides metadata for a block that creates a message box for info, warning, and danger notices.

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 2,
  "name": "rivendellweb/notice",
  "title": "Notice",
  "category": "text",
  "parent": ["core/group"],
  "icon": "star",
  "description": "Shows info, warning or danger notices",
  "keywords": ["alert", "message", ],
  "version": "0.1.0",
  "textdomain": "rivendellweb",
  "attributes": {
    "message": {
      "type": "string",
      "source": "html",
      "selector": ".message"
    }
  },
  "providesContext": {
    "rivendellweb/message": "message"
  },
  "usesContext": ["groupId"],
  "supports": {
    "align": true
  },
  "styles": [
    { "name": "info", "label": "Info", "isDefault": true },
    { "name": "warning", "label":  "Warning" },
    { "name": "danger", "label": "Danger" },
    { "name": "other", "label": "Other" }
  ],
  "example": {
    "attributes": {
      "message": "This is a notice!"
    }
  },
  "editorScript": "file:./build/index.js",
  "script": "file:./build/script.js",
  "viewScript": "file:./build/view.js",
  "editorStyle": "file:./build/index.css",
  "style": "file:./build/style.css"
}
```

If your theme supports lazy loading assets, then the enqueuing of scripts and styles for your block will be optimized and will only be loaded when the block is actively used. We discussed this technique in a previous post.

The Block Type REST API Endpoint can only list blocks registered on the server, so _the WordPress team recommends registering blocks server-side_. Using the `block.json` configuration file simplifies this registration.

If you wish to [submit your block(s) to the Block Directory](https://developer.wordpress.org/block-editor/getting-started/tutorials/create-block/submitting-to-block-directory/) for inclusion, all blocks contained in your plugin must have a `block.json` file for the Block Directory to recognize them.

More information about the block directory can be found in this [support article about the block directory](https://wordpress.org/support/article/block-directory/).

If you choose not to submit your blocks to the block directory, the WordPress Plugins Directory can detect `block.json` files, highlight blocks included in plugins, and extract their metadata to show the users a list of the blocks bundled with your theme.

The `blocks.json` file follows a schema definition which makes development easier and allows other tools like text and code editors to provide validation, autocomplete, and other support tools.

To use the schema, add the following to the top of the block.json.

```json
"$schema": "https://schemas.wp.org/trunk/block.json"
```

For more information, check [Block Metadata](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/) page in the Block Editor Handbook.

## Block registration

One of the ways in which we can take advantage

### PHP (server-side)

The register\_block\_type function that aims to simplify the block type registration on the server, can read metadata stored in the block.json file.

This function takes two params relevant in this context ($block\_type accepts more types and variants):

- `$block_type (string)` – path to the folder where the block.json file is located or full path to the metadata file if named differently.
- `$args (array)` – an optional array of block type arguments. Default value: \[\]. Any arguments may be defined. However, the one described below is supported by default:
    
    - **$render\_callback (callable)**: callback used to render blocks of this block type.

It returns the registered block type (WP\_Block\_Type) on success or false on failure.

```php
<?php
register_block_type(
    __DIR__ . '/notice',
    array(
        'render_callback' => 'render_block_core_notice',
    )
);
```

### JavaScript (client-side)

Because the block is registered on the server, you only need to register the client-side settings on the client using the same block’s name.

```js
registerBlockType( 'my-plugin/notice', {
    edit: Edit,
    // ...other client-side settings
} );
```

Registering the block on the server with PHP is still the recommended way to register the block, however, you can also register the block on the client using the `registerBlockType` method from the `@wordpress/blocks` package using the metadata loaded from `block.json`.

The function takes two parameters:

- **$blockNameOrMetadata (string|Object)** – block type name (supported previously) or the metadata object loaded from the block.json file with a bundler (e.g., Webpack) or a custom Babel plugin.
- **$settings (Object)** – client-side block settings.

It returns the registered block type (WPBlock) on success or undefined on failure.

## theme.json as a central configuration point

[theme.json](https://developer.wordpress.org/block-editor/how-to-guides/themes/theme-json/) provides a means to configure a theme for use with Gutenberg that doesn't require editing `functions.php` or `style.css`.

The code below is a working theme.json and combines elements of the [Armando](https://wordpress.org/themes/armando/) theme by [Carolina Nymark](https://wordpress.org/themes/author/poena/) and a theme I'm working on to replace my existing [Rivendellweb](https://github.com/caraya/rivendellweb-wptheme) theme that runs my [Publishing Project](https://publishing-project.rivendellweb.net/) blog.

The first part of the block defines the schema location and version. I choose to use the `$schema` property to define the location of the schema so it's easier to work with the schema, having the URL present adds validation and syntax checking to the workflow in most editors.

Version 2 is the newest version of the schema. Version 1 is still available but won't be receiving any further changes as far as I'm aware.

```json
{
  "$schema": "https://schemas.wp.org/trunk/theme.json",
  "version": 2,
```

The next section is the largest one and it configures all the settings for the theme. We will be able to override these default values in later definitions, otherwise, these are the value that the theme will use throughout.

If a property has a boolean (true/false) value it indicates if the theme will support the property, otherwise, the property will have one or more values attached to it.

Most of the properties will use three basci parameters:

- **slug** — the slug (computer-readable name) of the property
- **value / gradient** — the value of the property (it may also be an array of values)
- **name** — the human-readable name of the property

```json
  "settings": {
    "appearanceTools": true,
    "border": {
      "color": true,
      "radius": true,
      "style": true,
      "width": true
    },
    "color": {
      "background": true,
      "custom": true,
      "customDuotone": true,
      "customGradient": true,
      "defaultGradients": true,
      "defaultPalette": true,
      "link": false,
      "text": true,
      "duotone": [
        {
          "colors": [
            "#000",
            "#FFF"
          ],
          "slug": "black-and-white",
          "name": "Black and White"
        }
      ],
      "gradients": [
        {
          "slug": "blush-bordeaux",
          "gradient": "linear-gradient(135deg,rgb(254,205,165) 0%,rgb(254,45,45) 50%,rgb(107,0,62) 100%)",
          "name": "Blush bordeaux"
        },
        {
          "slug": "blush-light-purple",
          "gradient": "linear-gradient(135deg,rgb(255,206,236) 0%,rgb(152,150,240) 100%)",
          "name": "Blush light purple"
        }
      ],
      "palette": [
        {
          "slug": "strong-magenta",
          "color": "#a156b4",
          "name": "Strong magenta"
        },
        {
          "slug": "very-dark-grey",
          "color": "rgb(131, 12, 8)",
          "name": "Very dark grey"
        }
      ]
    },
```

Properties under “custom” create new CSS Custom Properties that we can use in other parts of the `theme.json` file and elsewhere in our CSS

The algorithm to create CSS Variables out of the settings under the “custom” key works this way:

We want a mechanism to parse back a variable name such `--wp--custom--line-height--body` to its object form in theme.json. We use the same separation for presets.

A few notes about this process:

- camelCased keys are transformed into its kebab-case form, as to follow the CSS property naming schema. lineHeight is transformed into line-height
- Keys at different depth levels are separated by --
- Don't use -- in the names of the keys within the custom object

```json
    "layout": {
      "contentSize": "800px",
      "wideSize": "1000px"
    },
    "spacing": {
      "blockGap": null,
      "padding": true,
      "margin": true,
      "units": [
        "px",
        "em",
        "rem",
        "vh",
        "vw"
      ]
    },
```

Typography controls typographical and font-related settings. This is where you define the font stacks for your theme. One outstanding item that I'm not sure how to handle is using web fonts you own rather than fonts from Google Fonts or other providers.

```json
    "typography": {
      "customFontSize": true,
      "dropCap": true,
      "fontStyle": true,
      "fontWeight": true,
      "letterSpacing": true,
      "lineHeight": false,
      "textDecoration": true,
      "textTransform": true,
      "fontFamilies": [
        {
          "fontFamily": "-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif",
          "slug": "system-fonts",
          "name": "System Fonts"
        },
        {
          "fontFamily": "Geneva, Tahoma, Verdana, sans-serif",
          "slug": "geneva-verdana"
        },
        {
          "fontFamily": "Cambria, Georgia, serif",
          "slug": "cambria-georgia"
        }
      ],
      "fontSizes": [
        {
          "slug": "extra-small",
          "size": "16px",
          "name": "Extra small"
        },
        {
          "slug": "small",
          "size": "18px",
          "name": "Small"
        },
        {
          "slug": "normal",
          "size": "20px",
          "name": "Normal"
        },
        {
          "slug": "large",
          "size": "24px",
          "name": "Large"
        },
        {
          "slug": "extra-large",
          "size": "40px",
          "name": "Extra large"
        },
        {
          "slug": "huge",
          "size": "96px",
          "name": "Huge"
        }
      ]
    }
  },
```

The declarations inside the `styles` object are applied to the body of the pages on the theme. Note that is uses CSS variables with the `--` separator as required for WordPress-created CSS variables.

```json
  "styles": {
    "color": {
      "background": "var(--wp--preset--color--white)",
      "text": "var(--wp--preset--color--black)"
    },
    "typography": {
      "fontSize": "20px",
      "fontFamily": "var(--wp--preset--font-family--system-fonts)",
      "lineHeight": "1.7"
    },
    "spacing": {
      "margin": {
        "top": "0px",
        "right": "0px",
        "bottom": "0px",
        "left": "0px"
      }
    },
```

Styles specified in the `elements` sectioon apply to HTML elements.

```json
    "elements": {
      "link": {
        "color": {
          "text": "var(--wp--preset--color--dark-blue)"
        }
      },
      "h1": {
        "color": {
          "text": "var(--wp--preset--color--dark-blue)"
        },
        "typography": {
          "fontSize": "var(--wp--preset--font-size--x-large)"
        }
      },
      "h2": {
        "color": {
          "text": "var(--wp--preset--color--dark-blue)"
        },
        "typography": {
          "fontSize": "var(--wp--preset--font-size--large)"
        }
      },
      "h3": {
        "color": {
          "text": "var(--wp--preset--color--dark-blue)"
        }
      },
      "h4": {
        "color": {
          "text": "var(--wp--preset--color--dark-blue)"
        }
      },
      "h5": {
        "color": {
          "text": "var(--wp--preset--color--dark-blue)"
        }
      },
      "h6": {
        "color": {
          "text": "var(--wp--preset--color--dark-blue)"
        }
      }
    },
```

Individual blocks, whether part of the core package, or added by a user, can provide their own styles. These are different than the styles provided on each individual block configuration.

Where they use custom properties, these properties also use the `--` separator.

```json
    "blocks": {
      "core/post-title": {
        "typography": {
          "fontSize": "var(--wp--preset--font-size--x-large)"
        }
      },
      "core/paragraph": {
        "typography": {
          "fontSize": "var(--wp--preset--font-size--medium)"
        }
      },
      "core/post-date": {
        "typography": {
          "fontSize": "var(--wp--preset--font-size--small)"
        }
      },
    }
  },
```

We can also define the template parts that we want to make available for theme development by adding them to the `templateParts` section. Where we know in advance (like headers and footers, we can specify the area as well).

```json
  "templateParts": [
    {
      "name": "footer",
      "title": "Footer",
      "area": "footer"
    },
    {
      "name": "header",
      "title": "Header",
      "area": "header"
    },
  ],
```

We can also define custom templates that we will use on our theme. We can also specify the types of content the template applies to.

```json
  "customTemplates": [
    {
      "name": "page-sidebar-left",
      "title": "Two columns, left sidebar",
      "postTypes": [
        "page"
      ]
    },
    {
      "name": "page-template-patterns",
      "title": "Template for block pattern layouts",
      "postTypes": [
        "page",
        "post"
      ]
    }
  ]
}
```

With the code we've discussed in this post we have the basis of a working theme. We can edit the theme in the Full Site Editor or create the templates manually.
