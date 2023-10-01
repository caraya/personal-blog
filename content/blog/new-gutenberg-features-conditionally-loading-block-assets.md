---
title: "New Gutenberg Features: Conditionally loading block assets"
date: "2022-02-28"
---

One issue that I always found problematic with Gutenberg blocks is that it loads all assets all the time regardless of whether we use them in our projects or not.

As of WordPress 5.8, we can work around this to only load the blocks that are used.

We define our block as normal. When creating a block we can define separate scripts and stiles for the front and back end using code like the one below:

```php
<?php
register_block_type( 'rivendellweb/test-block',
  array(
    'editor_script' => 'rivendellweb-test-block-script',
    'editor_style'  => 'rivendellweb-test-block-editor-style',
    'style'         => 'rivendellweb-test-block-style',
    'script'        => 'rivendellweb-test-block-frontend'
  )
);
```

If you then also specify a filter that will only load the blocks assets when the block is actually used:

```php
<?php
add_filter( 'should_load_separate_core_block_assets', '__return_true' );
```

For more reference, see: [Conditionally Load Block Assets, Part 3](https://mkaz.blog/wordpress/conditionally-load-block-assets-part-3/) and [Block-styles loading enhancements in WordPress 5.8](https://make.wordpress.org/core/2021/07/01/block-styles-loading-enhancements-in-wordpress-5-8/)
