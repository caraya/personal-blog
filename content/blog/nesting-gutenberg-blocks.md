---
title: "Nesting Gutenberg blocks"
date: "2022-03-14"
---

Often we want to create a block with multiple child blocks. For example, block quotes may have lists and other elements nested inside them.

Container blocks like the columns blocks also support templates. This is achieved by assigning a nested template to the block.

This PHP example creates a block with two items, one of them with additional nested children:

- A root level paragraph with a placeholder
- A columns block that will contain one or more children
- A column
    
    - An image
- A column
    
    - A paragraph

```php
<?php
$template = array(
  array( 'core/paragraph', array(
    'placeholder' => 'Add a root-level paragraph',
  ) ),
  array( 'core/columns', array(), array(
    array( 'core/column', array(), array(
        array( 'core/image', array() ),
    ) ),
    array( 'core/column', array(), array(
      array( 'core/paragraph', array(
        'placeholder' => 'Add a inner paragraph'
      ) ),
    ) ),
  ) )
);
```

We can also use Javascript / JSX block will create a blog and allow for child blocks to be added to it with the `InnerBlocks` property.

It also shows how we can constrain the content of the block children to a specific list; In this example, we only allow paragraphs and images to the `demo-01` block.

```js
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const ALLOWED_BLOCKS = [
  'core/image',
  'core/paragraph'
];

registerBlockType( 'rivendellweb-blocks/demo-01', {

  edit: () => {
    const blockProps = useBlockProps();

    return (
      <div { ...blockProps }>
          <InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />;
      </div>
    );
  },

  save: () => {
    const blockProps = useBlockProps.save();

    return (
      <div { ...blockProps }>
          <InnerBlocks.Content />
      </div>
    );
  },
} );
```

One of the earliest problems I had with Gutenberg was that I couldn't create a blockquote if the text had bulleted lists in it. The issue appears to have been fixed but having this as a backup is always a good idea even though it requires more work to implement.
