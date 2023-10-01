---
title: "Building Gutenberg Blocks (Part 2)"
date: "2020-04-06"
---

We've only worked with static content so far. But the idea behind Gutenberg is to let you work with your own content.

This section will also introduce the `RichText` block components as opposed to the plain text elements we've been working with.

### Editable Blocks

The first part of this process is to create an editable block where we can enter arbitrary data that will be saved when we save or publish the post.

IN addition to i18n and blocks imports we import the RichText component from the block-editor package. This will do the heavy load in the code below.

```js
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText } from '@wordpress/block-editor';
```

The first difference is that we've now added an [`attributes` attribute](https://developer.wordpress.org/block-editor/developers/block-api/block-registration/#attributes-optional) that will hold the structured data needs of a block. Wordpress will also use this to validate the content of the block.

In this example, the `content` child of the attribute is an array of children that paragraphs (the children match the `p` selector).

```js
registerBlockType( 'rivendellweb-blocks/example-03', {
    title: __( 'Example 03', 'rivendellweb-blocks' ),
    icon: 'universal-access-alt',
    category: 'layout',
    attributes: {
        content: {
            type: 'array',
            source: 'children',
            selector: 'p',
        },
    },
```

The edit and save methods get a little more complicated when we use custom data.

The `save()` method now takes props as an attribute.

We assign the content attribute, the setAttribute and className to props.

Next, we create an `onChangeContent` function that will trigger when we add or remove content from the element.

Finally, we return a `RichText` element that returns `p` elements with the `className` class and the `content` as the value of the element.

The `onChange` event firest with the `onChangeContent` every time the element changes.

```js
    example: {},
    edit: ( props ) => {
        const {
            attributes: { content },
            setAttributes,
            className,
        } = props;

        const onChangeContent = ( newContent ) => {
            setAttributes( { content: newContent } );
        };

    return (
            <RichText
                tagName="p"
                className={ className }
                onChange={ onChangeContent }
                value={ content }
            />
        );
    },
```

The `save()` method also takes `props` as a parameter and uses `props.attributes.content` as the value of the `value` parameter.

```js
    save: ( props ) => {
        return (
            <RichText.Content
                tagName="p"
                value={
                  props.attributes.content
        } />
        );
    },
} );
```

### Inner blocks

The next idea is to see if we have any way to automate the content of the block. Right now our block is limited to whatever tag we use as the value of `tagName`.

We can create a single block with a list of default blocks using inner blocks.

We import `InnerBlocks` from `@wordpress/block-editor` and then use it as the child of our content div.

```js
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

// Register block
registerBlockType( 'rivendellweb-blocks/example-04', {
    title: 'Example 04',
    category: 'rivendellweb-blocks',
    icon: 'translation',
    edit: ( { className } ) => {
        return (
            <div className={ className }>
                <InnerBlocks />
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

The idea is that using Inner Blocks we get a set of blocks available without any additional code.

### Blocks with customized content content

Inner blocks give us a set of sensible default set of blocks to use but it may or may not be enough to suit our needs. Fortunately, we don't have to stick with the defaults if we need specific blocks to accomplish our goals.

First we run all our imports as usual, `__` for i18n, `registerBlockType` and `InnerBlocks`

```js
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
```

The first difference is the inclusion of an `ALLOWED_BLOCKS` constant that we'll use later to tell Gutenberg what blocks to allow in our inner blocks.

```js
const ALLOWED_BLOCKS = [
  'core/image',
  'core/heading',
  'core/paragraph'
];
```

The final change is in the `edit` method of registerBlockType where we add an `allowedBlock` attribute and use the `ALLOWED_BLOCKS` constant as the value.

```js
registerBlockType( 'rivendellweb-blocks/example-05', {
  title: __('Example 05', 'rivendellweb-blocks'),
    category: 'rivendellweb-blocks',
    icon: 'translation',

  edit: ( { className } ) => {
    return (
      <div className={ className }>
        <InnerBlocks
          allowedBlocks = { ALLOWED_BLOCKS }/>
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

The idea is that we restrict the content of the InnerBlock element to whatever elements we want to use. This way we can be sure that users don't modify the content in ways we don't expect.

### Block Templates

We can go even further and define a complete template for the block, not only limiting the blocks but providing a ready-to-complete template

The import elements don't change. We import `__`, `registerBlockType` and `InnerBlocks` as before.

```js
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';
```

Instead of an allowed blocks section, we create a `BLOCK_TEMPLATE` variable that lists the blocks we want to use, the order of the blocks and, where appropriate, placeholder text.

```js
const BLOCK_TEMPLATE = [
  [ 'core/image', {} ],
  [ 'core/heading', { placeholder: 'Book Title' } ],
  [ 'core/heading', { placeholder: 'Book Author' } ],
  [ 'core/paragraph', { placeholder: 'Summary' } ],
];
```

The template attribute uses our `BLOCK_TEMPLATE` constant as the layout of the blocks we're building

`templateLocks` allows locking the InnerBlocks area for the current template. It takes one of the following values:

- `all` — prevents all operations. It is not possible to insert new blocks. Move existing blocks or delete them.
- `insert` — prevents inserting or removing blocks, but allows moving existing ones.
- `false` — prevents locking from being applied to an InnerBlocks area even if a parent block contains locking.

For example, our book block may want to do more than one paragraph summary or we may want to add more images. Or maybe not, the choice is up to the designer.

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
        templateLock="false" />
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

We can build multicolumn blocks using core blocks and place them in a template. The following example creates a two-column layout with an image in the first column and one or more paragraphs in the second.

```js
const TEMPLATE = [ 
  [ 'core/columns', {}, [
    [ 'core/column', {}, [
        [ 'core/image' ],
    ] ],
    [ 'core/column', {}, [
        [ 'core/paragraph', { placeholder: 'Enter side content...' } ],
    ] ],
  ] ] 
];
```

So now we have the flexibility of building composite blocks with pre-defined structure and content flow.
