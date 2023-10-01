---
title: "Gutenberg: How do we work with older content?"
date: "2018-02-28"
---

To validate my assumptions about Gutenberg I cloned my technical blog ([The Publishing Project](https://publishing-project.rivendellweb.net/)) and installed the Gutenberg plugin. My blog is not too sophisticated, it uses the two PHP functions below to customize behavior and CSS to add or modify the way things look on the blog.

The first function works around a bug in some versions of Chrome where Prism, my syntax highlighter, stopped working when using the clipboard add-on (that allows for one-click copy of the highlighted content). It enqueues Prism and clipboard.js and the prism.css style sheet.

```php
// Function to add prism.css and prism.js to the site
function add_prism() {
    wp_register_style('prismCSS', // handle name for the style so we can register, de-register, etc.
    get_stylesheet_directory_uri() . '/prism/css/prism.css' // location of the prism.css file
  );
  // Register clipboard.js file
  wp_register_script(
    'clipboardJS', // handle name for the script so we can register, de-register, etc.
    get_stylesheet_directory_uri() . '/prism/js/clipboard.min.js' // location of the prism.js file
  );
  // Register prism.js file
  wp_register_script(
    'prismJS', // handle name for the script so we can register, de-register, etc.
    get_stylesheet_directory_uri() . '/prism/js/prism.js' // location of the prism.js file
  );

  // Enqueue the registered style and script files
  wp_enqueue_style( 'prismCSS' );
  wp_enqueue_script( 'clipboardJS' );
  wp_enqueue_script( 'prismJS' );
}

add_action('wp_enqueue_scripts', 'add_prism');
```

This is what is driving me nuts. I'm trying to figure out how to do something like `add_prism` in a Gutenberg environment. Do I need to add the scripts and stylesheets every time that I enqueue the scripts for the block? or do I only need to do it once?

This is also part of my trying to understand React and WordPress abstraction on top of it. How do you add classes beyond name or classes that are part a fixed string and part dynamic based on a value in the editor?

The second function changes the way WordPress insert images by using a figure element, removing the https/http in the URL and replacing it with a protocol relative URL (using `//`) and adding a caption to the figure if there is one present

```php
function html5_insert_image($html, $id, $caption, $title, $align, $url, $size, $alt) {
  $src  = wp_get_attachment_image_src( $id, $size, false );
  $url = str_replace(array('http://','https://'), '//', $src[0]);
  $html = get_image_tag($id, '', $title, $align, $size);
  $html5 = "<figure>";
  $html5 .= "<img src='$url' alt='$alt' class='size-$size' />";
  if ($caption) {
    $html5 .= "<figcaption class='wp-caption-text'>$caption</figcaption>";
  }
  $html5 .= "</figure>";
  return $html5;
}
add_filter( 'image_send_to_editor', 'html5_insert_image', 10, 9 );
```

But neither of them work. I can't tell if it's the migration to a new host, the Gutenberg plugin, any other existing plugin or something else. Some of the things that I've observed:

The `html5_insert_image` function becomes redundant with the image block. It doesn't matter that you've customized the way the image works, either you use the block and get the image the way WordPress wants you to use it or you create a custom block and embed both the desired HTML result and the CSS styles in your custom element.

I was able to install and use the [Prism for WP](https://wordpress.org/plugins/ank-prism-for-wp/) and get it to work by eliminating the ability to do a one-button copy of the highlighted code blocks. But the question still remains... how do I move the code from `functions.php` to a block? Is it necessary?

## Is HTML that terrible?

> Content in WordPress is stored as HTML-like text in post\_content. HTML is a robust document markup format and has been used to describe content as simple as unformatted paragraphs of text and as complex as entire application interfaces. Understanding HTML is not trivial; a significant number of existing documents and tools deal with technically invalid or ambiguous code. This code, even when valid, can be incredibly tricky and complicated to parse – and to understand. From [The Language of Gutenberg](https://wordpress.org/gutenberg/handbook/language/)

This is, perhaps, my biggest issue with Gutenberg and its associated views of development and content creation: **How does HTML factor in the equation?**

Understanding HTML should be the first requirement for people working on creating front-end interfaces or authoring content for use on the web. That should be non-negotiable, regardless of how trivial or non-trivial it appears to be.

Wordpress doesn't carry the baggage of having to support HTML 1.0 from the early 1990s like browsers do. It's true that browsers and, to a lesser degree, authoring tools have to deal with [tag soup](https://www.w3.org/People/Bos/DesignGuide/compatibility.html) markup to provide backward compatibility with documents that did not enforce good authoring practices.

> "Tag soup" encompasses many common authoring mistakes, such as malformed HTML tags, improperly nested HTML elements, and unescaped character entities (especially ampersands (&) and less-than signs (< )). From Wikipedia's [Tag Soup Entry](https://www.wikiwand.com/en/Tag_soup)

The fact that browsers have to take tag soup markup doesn't mean that Wordpress should do so as well. Wordpress HTML parsers should not accept malformed HTML and it should complain loudly when you feed it crap, although modern editors and Markdown parsers should not create bad HTML at all anymore.

So I don't really see the need to drop HTML as an authoring language and replace it with a visual editor. The reasoning is not only flawed but also dangerous and restrictive for people who are comfortable weaving HTML with Markdown to create richer content.

And, if you really need to generate HTML programatically you can use a templating engine like the following:

- [Handlebars](http://handlebarsjs.com/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Mustache](https://mustache.github.io/)
- [doT](https://olado.github.io/doT/)
- [Dust](http://www.dustjs.com/)
- [EJS](http://ejs.co/)
- [Pug (formerly Jadde)](https://pugjs.org/)

Another option is to work with [Web Components](https://www.webcomponents.org/introduction), a set of open specifications to build reusable components with open standards rather than proprietary tool that was later open sourced. To me this is no different than [WebKit](https://webkit.org/) and [Chromium](https://www.chromium.org/)... yes, they are open source but it's also true that Apple and Google decide what happens with the project as a whole.

As with many other situations, **a one size solution does not fit all cases**.

## Building a Gutenberg block

Because I don't think building blocks is the easiest way to create authoring experiences for Wordpress the best way to prove if this is the case, or not, I will work on creating a simple text block that will take Markdown as its input and produce well-formed HTML.

I'm particularly interested in the following questions

- Will the custom block be able to handle long text with embedded video and fenced code blocks (supported by Jetpack's current Markdown parser)? If not, what's the alternative for older content written in that format?
- How do we apply page-wide scripts and styles (can I use my two functions outlined earlier in a Gutenberg-based system)? Can we?
- How do we ensure that older content created before Gutenberg still works in the new editor?

### Why are React, JSX and Babel required?

> At the risk of igniting debate surrounding any single "best" front-end framework, the choice to use any tool should be motivated specifically to serve the requirements of the system. In modeling the concept of a block, we observe the following technical requirements:
> 
> - An understanding of a block in terms of its underlying values (in the random image example, a category)
> - A means to describe the UI of a block given these values
> 
> At its most basic, React provides a simple input/output mechanism. Given a set of inputs ("props"), a developer describes the output to be shown on the page. This is most elegantly observed in its functional components. React serves the role of reconciling the desired output with the current state of the page. The offerings of any framework necessarily become more complex as these requirements increase; many front-end frameworks prescribe ideas around page routing, retrieving and updating data, and managing layout. React is not immune to this, but the introduced complexity is rarely caused by React itself, but instead managing an arrangement of supporting tools. By moving these concerns out of sight to the internals of the system (WordPress core code), we can minimize the responsibilities of plugin authors to a small, clear set of touch points. From: [Gutenberg Element](https://github.com/WordPress/gutenberg/tree/master/element#element)

For a while, Wordpress Core has been steering all projects that touch it towards a React/JSX architecture. It wasn't a problem when working themes, plugins and shortcodes added content to the TinyMCE editor or produced markup that was inserted directly into the editor. That meant that, as a good developer, you had to know PHP, HTML, CSS and JavaScript... The basic tools for most front-end development.

But now, because the underlying structure of the editor lives in core, Wordpress developers must learn Wordpress' version of the React ecosystem (React, Redux and the custom Wordpress layers over React), at least until something better comes up and we have to rip out all the React plumbing and start over from scratch once again.

One big question is **who chose React and its ecosystem for Wordpress and where was that communicated (if it was) to people outside the core Wordpress team?**

### Onto building the block

To create a plugin with Gutenberg blocks we need at least the following files:

- An `index.php` at the root of the plugin directory that we'll use to register the blocks in subdirectories
- Inside each subdirectory containing a block
    
    - `.babelrc` Babel configuration files
    - `.gitignore` to choose what files to ignore when pushing to Git
    - `block.js` Block configuration
    - `editor.css`
    - `index.php`
    - `package.json`
    - `style.css`
    - `webpack.config.js`

`index.php` will point to the `index.php` file in each directory that will, in turn load the assets for each block we include. This is how we can incorporate more than one block per plugin.

```php
<?php
/**
 * Plugin Name: Gutenberg Examples
 * Plugin URI: https://github.com/WordPress/gutenberg-examples
 * Description: This is a plugin demonstrating how to
 * register new blocks for the Gutenberg editor.
 * Version: 0.1.0
 * Author: the Gutenberg Team
 *
 * @package gutenberg-examples
 */
defined( 'ABSPATH' ) || exit;
include '03-editable-esnext/index.php';
include '04-controls-esnext/index.php';
include '05-recipe-card-esnext/index.php';
```

For the rest of the examples, I will use code from the [Gutenberg Examples](https://github.com/WordPress/gutenberg-examples) Github repository, specifically the `03-editable-esnext` block.

The first file is the `package.json` file to install babel and webpack dependencies. It also installs `cross-env` to use a single command across platforms, accounting for Windows differences to how Posix systems (OS X and Linux) work.

```json
{
  "name": "03-editable-esnext",
  "version": "1.0.0",
  "license": "GPL-2.0-or-later",
  "main": "block.js",
  "devDependencies": {
    "babel-core": "^6.25.0",
    "babel-loader": "^7.1.1",
    "babel-plugin-transform-react-jsx": "^6.24.1",
    "babel-preset-env": "^1.6.0",
    "cross-env": "^5.0.1",
    "webpack": "^3.1.0"
  },
  "scripts": {
    "build": "cross-env BABEL_ENV=default NODE_ENV=production webpack",
    "dev": "cross-env BABEL_ENV=default webpack --watch"
  }
}
```

Next we use `.babelrc` to configure Babel's behavior. We do two things:

- Configure `babel-preset-env` to go back 2 versions for most desktop and iOS browsers, last version for Android and Chrome for Android, plus IE11
- Use `wp.element.createElement` to create elements instead of the default `React.createElement`. The `wp.element.createElement` function is part of Wordpress element abstractio layer that sits on top of React/JSX.

```json
{
  "presets": [
    [
      "env",
      {
        "modules": false,
        "targets": {
          "browsers": [
            "last 2 Chrome versions",
            "last 2 Firefox versions",
            "last 2 Safari versions",
            "last 2 iOS versions",
            "last 1 Android version",
            "last 1 ChromeAndroid version",
            "ie 11"
          ]
        }
      }
    ]
  ],
  "plugins": [
    [
      "transform-react-jsx",
      {
        "pragma": "wp.element.createElement"
      }
    ]
  ]
}
```

After configuring Babel we need to configure [Webpack](https://webpack.js.org/). As far as configurations go, it's a simple one. We specify a single entry point, an output path, and a single module loader for JS and JSX files... We also ignore `node_modules` :D.

```javascript
module.exports = {
  entry: './block.js',
  output: {
    path: __dirname,
    filename: 'block.build.js'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};
```

The other big file in a modules is `index.php`. It uses `wp_enqueue_script()` and `add_action` to enqueue scripts and `wp_enqueue_style()` and `add_action` to load stylesheets.

The reason why we do it this way it to make sure that dependencies for both scripts and stylesheets are handled properly.

```php
<?php

defined( 'ABSPATH' ) || exit;

add_action( 'enqueue_block_editor_assets', 'gutenberg_examples_03_esnext_enqueue_block_editor_assets' );

function gutenberg_examples_03_esnext_enqueue_block_editor_assets() {
  wp_enqueue_script(
    'gutenberg-examples-03_esnext',
    plugins_url( 'block.build.js', __FILE__ ),
    array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
    filemtime( plugin_dir_path( __FILE__ ) . 'block.build.js' )
  );

  wp_enqueue_style(
    'gutenberg-examples-03_esnext-editor',
    plugins_url( 'editor.css', __FILE__ ),
    array( 'wp-edit-blocks' ),
    filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
  );
}

add_action( 'enqueue_block_assets', 'gutenberg_examples_03_esnext_enqueue_block_assets' );

function gutenberg_examples_03_esnext_enqueue_block_assets() {
  wp_enqueue_style(
    'gutenberg-examples-03_esnext',
    plugins_url( 'style.css', __FILE__ ),
    array( 'wp-blocks' ),
    filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
  );
}
```

The final file we'll discuss is `block.js`. The core of the block and what tells Gutenberg how the block works, what to show in the editor and how to style the component.

The problem I have with this is that it makes it hard to reason and figure out how to make the code work. This is not helped by the fact that different tutorials and code examples use different (and contradictory) methods to create and load Gutenberg blocks.

The example below uses (almost complete) ES6 syntax. It still uses `const` instead of `import`. This is a Babel issue; Babel doesn't support `import` out of the box; if we want to use import in the code we'll transpile with babel we need to install the [babel-plugin-syntax-dynamic-import](https://www.npmjs.com/package/babel-plugin-syntax-dynamic-import) plugin and add it our Babel configuration.

```javascript
const { __ } = wp.i18n;
const { registerBlockType, Editable, source: { children } } = wp.blocks;

registerBlockType('gutenberg-examples/example-03-editable-esnext', {
  title: __('Example: Editable (esnext)'),
  icon: 'universal-access-alt',
  category: 'layout',
  attributes: {
    content: {
      type: 'array',
      source: 'children',
      selector: 'p'
    }
  },
  edit: props => {
    const { attributes: { content }, focus, className, setFocus } = props;
    const onChangeContent = newContent => {
      props.setAttributes({ content: newContent });
    };
    return (
      <Editable
        className={className}
        onChange={onChangeContent}
        value={content}
        focus={focus}
        onFocus={setFocus}
      />
    );
  },
  save: props => <p>{props.attributes.content}</p>
});
```

The CSS has two stylesheets, one that will style the editor (`editor.css`) and one that will style the frontend, what the user will see (`style.css`) The names for the classes appear to be automatically generated based on the name of the block and other details.

```css
/**
 * Note that these styles are loaded *after* common styles, so that
 * editor-specific styles using the same selectors will take precedence.
 */
/* editor styles: editor.css*/
.wp-block-gutenberg-examples-example-03-editable-esnext {
  color: green;
  background: #cfc;
  border: 2px solid #9c9;
  padding: 20px;
}

/**
 * Note that these styles are loaded *before* editor styles, so that
 * editor-specific styles using the same selectors will take precedence.
 */
/* front end styles: style.css*/
.wp-block-gutenberg-examples-example-03-editable-esnext {
  color: darkred;
  background: #fcc;
  border: 2px solid #c99;
  padding: 20px;
}
```

The fact that the names for the classes are automatically generated can be problematic if you need a specific class for your code to work. For example, Prism Highlight needs a class value of `language-` plus the name of the language to highlight (`language-css` or `language-javascript`). How do you generate those class names for Gutenberg? Will that be something that I have to add by hand? Do I add it to the comment that Gutenberg generates or do I need to generate classic blocks and then add the special content there?
