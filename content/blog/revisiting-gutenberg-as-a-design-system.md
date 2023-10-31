---
title: "Revisiting Gutenberg as a design system"
date: "2022-03-21"
vimeo: true
---

Gutenberg presents an interesting way to create and use design systems and present them to the user.

I use the following definition of a design system:

> A design system is a complete set of standards intended to manage design at scale using reusable components and patterns.
>
> [Design Systems 101](https://www.nngroup.com/articles/design-systems-101/) — Nielsen Norman Group

I wrote a series of posts on the topic of using Gutenberg as a design system and variations of those design items.

* Gutenberg as a design system
  * [Part 1](https://publishing-project.rivendellweb.net/gutenberg-as-a-design-system-part-1/)
  * [Part 2](https://publishing-project.rivendellweb.net/gutenberg-as-design-systems-part-2/)
  * [Part 3](https://publishing-project.rivendellweb.net/gutenberg-as-design-systems-part-3/)

This post is a review and further exploration of Gutenberg-based design systems. This post will borrow some concepts from Brad Frost's [atomic design](https://bradfrost.com/blog/post/atomic-web-design/).

Below is Brad's Presentation about Atomic Design, given at Beyond Tellerand in 2013

<lite-vimeo videoid="67476280"></lite-vimeo>

## Start from the beginning: Building Atoms

Atoms are the smallest building blocks of an Atomic Design System. In Gutenberg, atoms are the individual components and variations thereof.

The default blocks are well documented so we won't discuss them here.

### Defining a color palette

One of the first things I look at is how to define a color palette. I will use the different palettes in my [full-color palette](https://rivendellweb-patterns.netlify.app/components/detail/colors--default.html) created for a different design system experiment.

Taking advantage of the `theme.json` file, we can define a color palette based on the list of colors available to use.

Usually, the client will give you a list of colors that match their brand or you can create your own list.

Inside your `theme.json` file you can define your own colors inside the `palette` section. Each color has three attributes: `slug`, `color`, and `name`.

```json
"palette": [
  {
    "slug": "plum-crazy-purple",
    "color": "#6600CC",
    "name": "Plum Crazy Purple"
  },
  {
    "slug": "rebecca-purple",
    "color": "#663399",
    "name": "Rebecca Purple"
  },
  {
    "slug": "butterscotch",
    "color": "#D48827",
    "name": "Butterscotch"
  },
  {
    "slug": "cherry",
    "color": "#D2042D",
    "name": "Cherry"
  },
  {
    "slug": "black-cherry",
    "color": "#52253A",
    "name": "Black Cherry"
  }
]
```

Because of the way colors are displayed in the editor, we need to be mindful of the number of colors we use on our themes.

We also need to be careful with color contrast between foreground and background colors. The last thing we want is for our text to be illegible because of poor cotrast with the background color.

### Loading web fonts

One of the most contentious things in working with WordPress overall is how to use web-fonts.

Ideally, this would be a matter of using fonts from CDNs like [Google Fonts](https://fonts.google.com/) or [Adobe Fonts](https://fonts.adobe.com/) but it's not so easy... we need to be mindful of the following:

* [German Court Rules Websites Embedding Google Fonts Violates GDPR](https://thehackernews.com/2022/01/german-court-rules-websites-embedding.html)
* [Website fined by German court for leaking visitor's IP address via Google Fonts](https://www.theregister.com/2022/01/31/website_fine_google_fonts_gdpr/)

So we might have to use locally hosted web fonts or use system fonts.

Since I'm trying to recreate an existing theme as an example, I will try to use the same local web font that I used in the original.

[Recursive](https://recursive.design) is a variable font that I've been working with since it was in beta. It provides pretty much everything that you may need:

* A monospace code axis for pre-formatted and code blocks
* Sans-serif, and casual axes for typographical work
* Variable weight axis from light to extra black (300 to 1000 in numeric values)
* Slant and cursive axes to control italics behavior
* A set of presets that combine the different values from the available axes to give you control without having to drop to the low level value adjustment
* Support for 200 Latin languages out of the box

TO get started we add the `@font-face` declaration to our stylesheet.

Variable fonts make some changes to the `@font-face` syntax we are used to.

`font-weight` now takes two values representing the lowest and highest boundaries for the attribute. In this case, the font support weights between 300 and 1000.

I am using a subset of the full Recursive font that only includes latin languages. The `Unicode-range` attribute indicates the specific Unicode codepoints that the font subset supports.

```css
@font-face {
  font-family: "Recursive";
  src: url("path/to/Recursive.woff2");
  font-weight: 300 1000;
  unicode-range: U+000D, U+0020-007E, U+00A0-00FF, U+0131, U+0152-0153,
      U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2007-200B, U+2010, U+2012-2015,
      U+2018-201A, U+201C-201E, U+2020-2022, U+2026, U+2030, U+2032-2033,
      U+2039-203A, U+203E, U+2044, U+2052, U+2074, U+20AC, U+2122, U+2191,
      U+2193, U+2212, U+2215;
}
```

Next, we add the following default values to the `:root` element. We add them as CSS custom properties/variables so we can override them later without having to worry about specificity later.

```css
:root {
  --mono: "MONO" 0;
  --casl: "CASL" 0;
  --wght: "wght" 400;
  --slnt: "slnt" 0;
  --crsv: "CRSV" 0.5;
}
```

We can then apply the properties to the `html` or `body` elements to set the default.

This command will set the default font for the document (the body element and all its children) to Recursive with a system sans-serif backup. It will also change the parameters of the font to what we specify or to the values in the `:root`

```css
body {
  font-family: "Recursive", sans-serif;
  font-variation-settings:
    var(--mono),
    var(--casl),
    var(--wght),
    var(--slnt),
    var(--crsv);
```

Using CSS variables allows us to override the default values by reassigning them.

In the following example, we change the value of the casual axis from 0 (normal) to 1 (casual). This will make all `h2` elements appear in a more casual and playful font.

```css
h2 {
  --casl: "CASL" 1;

  font-variation-settings:
    var(--mono),
    var(--casl),
    var(--wght),
    var(--slnt),
    var(--crsv);
}
```

The axes described in this post only work with the Recursive variable font.

Using the `font-variation-settings` syntax is not recommended. However, support for the recommended `font-variant-*` properties is uneven and depends on the feature we're using

### Block variations

Another way we can create our atoms and other design elements is to use [block variations](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-variations/).

The variations API allows the creation of new variants of a block that share a common structure. This reduces the potential number of blocks we need to create and provides for a more consistent design system.

The following example shows how to create block variations **for default blocks** and package them as a plugin. The same thing can be done in a theme if we want to tie the variations to a specific theme.

The first step is to create the PHP file that will make the plugin work. Without the comment, the package will not be recognized as a plugin.

We then make sure that the plugin cannot be accessed directly.

The core of the PHP file is the functions that enqueue the Javascript file containing our variations and the stylesheet that implements the variations' CSS styles.

`rivendellweb_enqueue_variations` enqueues and loads the script that holds the variations of the core blocks.

`rivendellweb_variation_styles` enqueues the styles associated with the variations.

```php
<?php
function rivendellweb_enqueue_variations() {
    wp_enqueue_script(
        'rivendellweb-script',
        plugins_url( './src/block-variations.js', __FILE__ ),
        array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
        filemtime( plugin_dir_path( __FILE__ ) . './src/block-variations.js' )
    );
}
add_action( 'enqueue_block_editor_assets', 'rivendellweb_enqueue_variations' );

function rivendellweb_variation_styles() {
  wp_enqueue_style(
    'rivendellweb_variations_css',
    plugins_url(
      './src/block-variations.css',
      __FILE__ ) );
}
add_action(
  'enqueue_block_assets',
  'rivendellweb_variation_styles' );
```

In `block-variations.js` we defined the variations we want to create. We use [regusterBlockStyle](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/) to define these variations.

`registerBlockStyle` has three basic parameters:

1. The name of the block we are creating the variation for
2. The computer-readable name used to compute the class name of the variation
3. The human-readable label

```js
wp.blocks.registerBlockStyle( 'core/paragraph', {
  name: 'lede-paragraph',
  label: 'Lede (first) Paragraph',
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

The final piece is the CSS necessary to style the variations.

The classes use the following syntax: **.is-style-{class-name}**

```css
.is-style-lede-paragraph {
  font-size: 1.5em !important;
}

.is-style-fancy-quote {
  border-left: 4px solid red;
}

.is-style-top-bottom-quote {
  border-top: 4px solid black;
  border-bottom: 4px solid black;
  border-left: 0;
}

.is-style-red-quote {
  border-left: 0;
  color: red;
  font-size: 5vmax;
}
```

So far the variations work, but they require a lot of code and three different files to be successful.

Registering the variations on the server reduces the amount of complexity we need to maintain.

The idea is to use PHP's [register\_block\_style](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-styles/#register_block_style) function to consolidate all the information for the variations into one file.

The function takes two parameters:

1. The name of the block we are creating the variations for
2. An array of properties for the style
   1. **Name**: The name of the variation used to compute the class name (**required**)
   2. **Label**: The human-readable label (**required**)
   3. inline\_style: Contains inline CSS code that registers the CSS class required for the style (**optional**)
   4. **style\_handle**: Contains the handle to an already registered style that should be enqueued in places where block styles are needed (**optional**)
   5. **is\_default**: Boolean value. If set to true it indicates that this variation is the default variation for the block (**optional**)

This example adds a blue quote varation to the `core/quote` block.

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

`unregister_block_style` unregisters a block style previously registered on the server using `register_block_style`.

The function’s first argument is the registered name of the block, and the name of the style is the second argument.

The following example unregisters the blue quote variation.

```php
<?php
unregister_block_style(
  'core/quote',
  'blue-quote'
);
```

**Important** The function `unregister_block_style` only unregisters styles that were registered using `register_block_style` on the server. The function does not unregister a style registered using client-side code.

## Block Patterns: Molecules, Organisms, and Templates

In the Gutenberg-world Block Patterns are predefined block layouts, available from the patterns tab of the block inserter.

### Register block categories

Before defining the block patterns I'll make available via the plugin, I like to define one or more categories to collect the patterns under.

Just like with blocks, the categories help organize the content in our own categories. A block or pattern can belong to more than one category.

```php
<?php
function rw_custom_register_my_pattern_categories() {
  register_block_pattern_category(
      'rivendellweb',
      array( 'label' => __( 'Rivendellweb', 'rw-custom' ) )
  );
}

add_action( 'init', 'rw_custom_register_my_pattern_categories' );
```

### Registering block patterns

Once we install them we can then further customize and expand them

The register\_block\_pattern helper function receives two arguments.

* **title**: A machine-readable title with a naming convention of namespace/title
* **properties**: An array describing properties of the pattern.

The properties available for block patterns are:

* **title**: A human-readable title for the pattern (**required**)
* **content**: Block HTML Markup for the pattern (**required**)
* **description**: A visually hidden text used to describe the pattern in the inserter (**optional**) categories: An array of registered pattern categories used to group block patterns. Categories are registered using `register_block_pattern_category` (**optional**)
* **keywords**: An array of aliases or keywords that help users discover the pattern while searching (**optional**)
* **viewportWidth**: An integer specifying the intended width of the pattern to allow for a scaled preview of the pattern in the inserter (**optional**)

Make sure that you add the blocks in the init hook as shown in the example.

```php
<?php
register_block_pattern(
  'rivendellweb-patterns/demo-pattern',
  array(
    'title'       => __( 'Two buttons', 'my-plugin' ),
    'description' => _x( 'Two horizontal buttons, the left button is filled in, and the right button is outlined.', 'Block pattern description', 'my-plugin' ),
    'content'     => "<!-- wp:buttons {\"align\":\"center\"} -->\n<div class=\"wp-block-buttons aligncenter\"><!-- wp:button {\"backgroundColor\":\"very-dark-gray\",\"borderRadius\":0} -->\n<div class=\"wp-block-button\"><a class=\"wp-block-button__link has-background has-very-dark-gray-background-color no-border-radius\">" . esc_html__( 'Button One', 'my-plugin' ) . "</a></div>\n<!-- /wp:button -->\n\n<!-- wp:button {\"textColor\":\"very-dark-gray\",\"borderRadius\":0,\"className\":\"is-style-outline\"} -->\n<div class=\"wp-block-button is-style-outline\"><a class=\"wp-block-button__link has-text-color has-very-dark-gray-color no-border-radius\">" . esc_html__( 'Button Two', 'my-plugin' ) . "</a></div>\n<!-- /wp:button --></div>\n<!-- /wp:buttons -->",
  )
);

add_action( 'init', 'my_plugin_register_my_patterns' );
```

The syntax for the pattern context takes a while to learn and it's not intuitive. The best way to learn the syntax is to look at existing patterns that match what you want to do and use them as a starting point. You can build the pattern in the Gutenberg Editor and then copy it into `content` parameter of the pattern you want to create.

Because we're working with PHP, we need to escape the HTML we use in the patterns to prevent misuse.

For each registration method, there is a corresponding unregistration method.

## Further extensions: Custom Post Types

Another way to create elements for a design system is to use [custom post types](https://developer.wordpress.org/plugins/post-types/)

We can use them with limited templates and patterns or we can create custom patterns for the CPTs or we can use CPTs as an authoring tool for content templates.

### Content templates

[Using Block Patterns as content templates](https://mkaz.blog/wordpress/using-block-patterns-as-content-templates/) is an interesting way to create content patterns.

These patterns can be as simple as the following example that describes an incident report.

```html
<!-- wp:heading -->
<h2>Summary</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>What happened?</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Timeline</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>When did it happen?</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Impact</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Who was effected?</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Process</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Why did this happen?</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Improvement</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>What we are doing to prevent happening again</p>
<!-- /wp:paragraph -->
```

If we write this pattern in the Gutenberg Editor then we get a visual experience of the pattern we're creating and a visual approximation to what it will look like when the pattern is used.

The article also presents a tool to create patterns from posts of a custom post type.

### More information

* WordPress CLI
  * [wp scaffold post-type](https://developer.wordpress.org/cli/commands/scaffold/post-type/)
* The Traditional Way
  * [Registering Custom Post Types](https://developer.wordpress.org/plugins/post-types/registering-custom-post-types/)
* The Gutenberg Way
  * [How to Use Gutenberg with WordPress Custom Post Types](https://knowthecode.io/how-enable-gutenberg-editor-custom-post-type)
  * [Using Block Patterns as content templates](https://mkaz.blog/wordpress/using-block-patterns-as-content-templates/)
  * [How to Build Block Patterns for the WordPress Block Editor](https://richtabor.com/build-block-patterns/)
