---
title: "New Gutenberg Features: Creating block and page templates"
date: "2022-02-23"
---

As part of the [Full Site Editing (FSE)](https://developer.wordpress.org/block-editor/getting-started/full-site-editing/) experience, templates and page templates give you a way to prepackage blocks (similar to what variations do) and full-page templates for the theme.

Templates and page templates currently require the [Gutenberg plugin](https://wordpress.org/plugins/gutenberg/) and will not run in WordPress Core right now, that will change sometime during the 5.9 development cycle.

To understand the block template and block template parts work let's look at the structure of a block-based theme.

```text
.
├── LICENSE
├── README.md
├── assets
│   ├── css
│   ├── images
│   └── js
├── block-template-parts
│   ├── footer.html
│   └── header.html
├── block-templates
│   ├── 404.html
│   ├── index.html
│   ├── page-home.html
│   ├── page.html
│   └── single.html
├── functions.php
├── inc
│   ├── block-patterns.php
│   └── block-styles.php
├── index.php
├── readme.txt
├── screenshot.png
├── style.css
└── theme.json
```

The themes reorganize the structure as well as the way we author the content.

For contrast, we'll look at the structure of Twenty Twentyone, an old default theme in WordPress.

The equivalent to the content in `template-parts` and its child directories in older themes like Twenty Twentyone is stored in a single `block-templates` directory.

The `block-template-parts` directory is a flattened version of the `template-parts` directory in Twenty Twentyone.

```text
.
├── 404.php
├── archive.php
├── assets
│   ├── css
│   ├── images
│   ├── js
│   └── sass
├── classes
│   ├── class-twenty-twenty-one-custom-colors.php
│   ├── class-twenty-twenty-one-customize-color-control.php
│   ├── class-twenty-twenty-one-customize-notice-control.php
│   ├── class-twenty-twenty-one-customize.php
│   ├── class-twenty-twenty-one-dark-mode.php
│   └── class-twenty-twenty-one-svg-icons.php
├── comments.php
├── footer.php
├── functions.php
├── header.php
├── image.php
├── inc
│   ├── back-compat.php
│   ├── block-patterns.php
│   ├── block-styles.php
│   ├── custom-css.php
│   ├── menu-functions.php
│   ├── starter-content.php
│   ├── template-functions.php
│   └── template-tags.php
├── index.php
├── package-lock.json
├── package.json
├── page.php
├── postcss.config.js
├── readme.txt
├── screenshot.png
├── search.php
├── searchform.php
├── single.php
├── style-rtl.css
├── style.css
└── template-parts
    ├── content
    ├── excerpt
    ├── footer
    ├── header
    └── post
```

The other major difference is how the templates are written. Rather than using PHP and HTML, block templates use special HTML comments.

You can build templates directly in Gutenberg using the block editor. To edit with the built-in editor, follow these steps:

Select the editor under the appearance menu. If you don't see the editor link then you don't have the latest version of the Gutenberg plugin as this is not part of WordPress Core.

![Gutenberg Editor Menu](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/gutenberg-editor-01)

Gutenberg Editor Link Location

Once you are in the editor, click on the WordPress logo on the top left of the screen and you will be shown the options to edit templates or template parts.

![Gutenberg Editor Menu](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/gutenberg-editor-02)

Gutenberg Editor Link Location

If you select the templates option you will see a list of available templates that you can already use on your page.

To create a new template click on `Add New` and give it a title. You can then edit the template as any other item in Gutenberg.

![Gutenberg Editor Menu](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/gutenberg-editor-03)

Add new page templates

Another way to edit templates is to manually write the code that Gutenberg uses to generate the code.

To do this first create a template that has all the elements and placeholders you want to use, then export the code by clicking the more options button on the top right of the screen and selecting 'export\`. This will save a zip file with all the code on the templates to your local file system.

![Export template dialogue](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/export-template-01)

Export and download template and template parts

### Warning

Some older material spoke about an edit option that would allow you to edit the template in place. I haven't been able to find it so I recommend the export method instead.

You can then copy the template files into your own templates or edit them to customize them. If you're customizing them it's important that you understand what the different parts of the templates do.

The templates use HTML comments and data with the `wp:` prefix to indicate Gutenberg-specific elements/blocks and curly brackets to indicate attributes.

The first example shows what a paragraph with attributes looks like. In this case, the attribute tells WordPress that the block is a paragraph and that it is aligned to the right. The content of the paragraph is the HTML and CSS necessary to render the right-aligned paragraph.

Note that for content that uses CSS, Gutenberg uses the has-{attribute name and value} convention for selector naming

```html
<!-- wp:paragraph {"align":"right"} -->
<p class="has-text-align-right">... like this one, which is right aligned.</p>
<!-- /wp:paragraph -->
```

You can also nest blocks inside other blocks.

The next example shows the tags used for a query loop block along with pagination inside the individual posts.

```html
<!-- wp:query -->
<div class="wp-block-query">
  <!-- wp:post-template -->
  <!-- wp:post-title /-->
  <!-- wp:post-date /-->
  <!-- wp:post-excerpt /-->
  <!-- /wp:post-template -->

  <!-- wp:query-pagination -->
  <div class="wp-block-query-pagination">
    <!-- wp:query-pagination-previous /-->
    <!-- wp:query-pagination-numbers /-->
    <!-- wp:query-pagination-next /-->
  </div>
  <!-- /wp:query-pagination -->
</div>
<!-- /wp:query -->
```

The learning curve may seem daunting at first but, starting from existing templates, it's not so daunting after all.
