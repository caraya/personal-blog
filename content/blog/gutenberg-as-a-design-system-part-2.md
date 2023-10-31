---
title: "Gutenberg as a design system (part 2)"
date: "2020-04-22"
---

In [part 1](https://publishing-project.rivendellweb.net/?p=790075&preview=true) we discussed how to build variations for specific components.

We'll now see how we can create templates ready for the user to fill and either use as-is or modify it when needed.

## Block Templates

The first type of template is at the block level. This allows the creation of complex blocks without having to do much on the PHP side.

We first import our tools like normal, the i18n utilities, registerBlockType and [InnerBlocks](https://github.com/WordPress/gutenberg/tree/master/packages/block-editor/src/components/inner-blocks#README.md)

```js
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
```

We then define our template in a constant. This is the structure of the block that we want to have.

We can use attributes of the blocks in the template like the placeholder attribute that we use in the example to tell the user what we expect her to enter in each block.

```js
const BLOCK_TEMPLATE = [
  [ 'core/image', {} ],
  [ 'core/heading', { placeholder: 'Book Title' } ],
  [ 'core/heading', { placeholder: 'Book Author' } ],
  [ 'core/paragraph', { placeholder: 'Summary' } ],
];
```

The block registration is no different than a custom block. The only difference is that our `InnerBlocks` declaration uses a template attribute with our `BLOCK_TEMPLATE` definition as the parameter.

In this example, we've chosen to lock the template so the user cannot move the inner blocks nor they can add any new block to the template.

The "save" methods remains the same.

```js
registerBlockType( 'rivendellweb-blocks/example-06', {
  title: __('Example 06', 'rivendellweb-blocks'),
    category: 'rivendellweb-blocks',
    icon: 'translation',

  edit: ( { className } ) => {
    return (
      <div className={ className }>
        <InnerBlocks
        template={ BLOCK_TEMPLATE }
        templateLock="all" />
      </div>
    );
  },

  save: ( { className } ) => {
    return (
      <div className={ className }>
        <InnerBlocks.Content />
      </div>
    );
  },
} );
```

## Thing To Watch Out For

Out of the box, the styles in the editor will not necessarily match the styles when published. You need to be careful and make sure that the editor styles match the front-end styles or are close enough that you won't be surprised by what the published content looks like.

## Thing To Watch Out For

Be careful when following Gutenberg examples out in the wild as they are very inconsistent. Some will use ES5 rather than ES6+ and some will use JSX while others will use React's create element syntax. I'm not saying either version is bad, I'm just warning readers that this the case so they are prepared, particularly if, like me, they are not fluent in React and how it works.

## Looking forward: Block Patterns and Block Pattern Libraries

Block Patterns API is an API currently under development that would make custom blocks and variations available to users in similar ways to what other sites like Wix, Squarespace, and Weebly and even page builders in WordPress like [Elementor](https://elementor.com/) already do.

![sections in the SquareSpace editor](https://cdn.richtabor.com/wp-content/uploads/2020/03/ss.jpg)

Sections as they apper in SquareSpace (from [Gutenberg Block Patterns: The Future of Page Building in WordPress](https://richtabor.com/block-patterns/))

Variations already give us a way to create custom styles for our existing blocks so the next logical step, to me, is to package the variations and present them to the user in a way that is more coherent to them.

Figure 2 shows a mockup of how the patterns may be surfaced to the user.

![Mockup of patterns within the Gutenberg block library](https://cdn.richtabor.com/wp-content/uploads/2020/03/patterns.jpg)

Mockup of patterns within the Gutenberg block library (from [Gutenberg Block Patterns: The Future of Page Building in WordPress](https://richtabor.com/block-patterns/))

Current work in patterns uses a very low-level Gutenberg syntax. For example, a hero section becomes this combination of WordPress-specific commands and HTML styled with WordPress-provided classes:

```html
<!-- wp:group {"backgroundColor":"very-light-gray","align":"full"} -->
<div class="wp-block-group alignfull has-very-light-gray-background-color has-background"><div class="wp-block-group__inner-container"><!-- wp:spacer -->
<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><!-- wp:column -->
<div class="wp-block-column"><!-- wp:heading {"textColor":"very-dark-gray"} -->
<h2 class="has-very-dark-gray-color has-text-color">Lorem ipsum sit amet, consectetur adipiscing elit</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"textColor":"very-dark-gray","fontSize":"medium"} -->
<p class="has-text-color has-medium-font-size has-very-dark-gray-color">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"strong-blue","borderRadius":2} -->
<div class="wp-block-button"><a class="wp-block-button__link has-background has-strong-blue-background-color" style="border-radius:2px">Call to action</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:column -->

<!-- wp:column -->
<div class="wp-block-column"><!-- wp:image {"id":306,"width":512,"height":384,"sizeSlug":"large","className":"is-style-default"} -->
<figure class="wp-block-image size-large is-resized is-style-default"><img src="https://nrqsnchztest.blog/wp-content/uploads/2020/02/swinging-1024x768.png" alt="" class="wp-image-306" width="512" height="384"/></figure>
<!-- /wp:image --></div>
<!-- /wp:column --></div>
<!-- /wp:columns -->

<!-- wp:spacer -->
<div style="height:100px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer --></div></div>
<!-- /wp:group -->
```

and looks like this:

![Hero Pattern for use with Gutenberg](/images/2020/04/hero01-gutenberg-pattern.png)

Hero Pattern for use with Gutenberg

Right now, designing patterns is not as easy or intuitive as it can be. I expect it to change when the code for patterns lands in the plugin and then in WordPress core. I also expect to be able to author the content visually using the built-in editor.

- [Block patterns: create patterns to start populating the library #20345](https://github.com/WordPress/gutenberg/issues/20345)
- [Variations (formerly patterns) API for blocks #16283](https://github.com/WordPress/gutenberg/issues/16283)
- [Block Patterns: Add ability for predefined block layouts to be added to a document #17335](https://github.com/WordPress/gutenberg/issues/17335)
- [Docs: Add docs for variations in the block registration section #20145](https://github.com/WordPress/gutenberg/pull/20145)
