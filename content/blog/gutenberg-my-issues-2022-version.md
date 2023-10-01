---
title: "Gutenberg: My Issues (2022 version)"
date: "2022-03-28"
---

This is a place to document issues I'm finding as I build my theme. A lot of these issues may be caused by my lack of experience with Gutenberg and the way the full site editor works.

I will file issues about these items in the Gutenberg repo where I feel it's necessary.

## Adjusting Expectations

One of the things I'm not sure works as intended or that I'm not understanding correctly is how the full site editor works.

If I'm understanding this correctly, the changes on the editor should be reflected in the corresponding file I'm editing and vice-versa, right?

This is not the case. I've made extensive changes to the theme I'm working on and none of those changes are reflected in the file I'm working with. Likewise, I've made significant changes in template files and they are not reflected in the editor.

I asked the question in WordPress Slack and the answer I got was it was working as designed.

> That's actually deliberate, even if it's initially confusing. The customizations that you use within the site editor are saved as CPTs. You can export the templates to get the HTML version if you want to put them into the code, but this way the user's changes are non-destructive and you can safely update the theme or even change themes and keep your templates. You can't export the theme.json file yet, but that's coming. (edited) From: [Make WordPress Slack — core-editor discussion](https://wordpress.slack.com/archives/C02QB2JS7/p1644781268400009)

It appears that if I want to continue creating block themes, I will have to use the full site editor as the source of truth and remember to export the files periodically and to update the editor to match the layout if I'm making changes directly to the template.

See these Github Issues for context and discussion on the issue:

- [How to sync edits made within a theme's HTML files to the Block Editor (Full-site editing)](https://github.com/WordPress/gutenberg/issues/22469)
- See [this comment](https://github.com/WordPress/gutenberg/issues/22469#issuecomment-669210648) in particular for a way to potentially edit the content on the file system and have it automatically reflect on the editor and the front end
- [On Locking and TemplateLocking](https://github.com/WordPress/gutenberg/issues/29864).

## Poor or non-existent block documentation

Documentation for the blocks API is sparse and, almost, non-existent.

I thought the Storybook section of the Gutenberg repo may help but I found out that it is for Gutenberg's low-level components, not the blocks that we use in the editor.

I believe the only way to get a good idea of what the core blocks can do is to create a layout that you like and then copy it or export it into your favorite editor to see how it works and if there are any attributes worth documenting for future use.

## Mixing HTML with template content

I'm trying to get something like this in the full site editor:

```html
<p>Posted by: <a href="link/to/author/archive">Carlos</a></p>
<p>Posted on: <a href="link/to/date/archive">February 22, 2021</a></p>
```

The current layout is a nested column layout. The label is a paragraph element, and the author name and date posted are Gutenberg elements inside a `div` element so we can make it into a flexbox layout.

```html
<!-- wp:column {"width":"100%"} -->
<div class="wp-block-column" style="flex-basis:100%">
  <!-- wp:columns -->
  <div class="wp-block-columns">
    <!-- wp:column {"width":"50%"} -->
    <div class="wp-block-column" style="flex-basis:50%">
      <!-- wp:paragraph {"fontSize":"small"} -->
        <p class="has-small-font-size">Posted by:</p>
      <!-- /wp:paragraph -->
      <!-- wp:post-author-name {"fontSize":"small"} /-->
    </div>
    <!-- /wp:column -->

    <!-- wp:column {"width":"50%"} -->
    <div class="wp-block-column" style="flex-basis:50%">
      <!-- wp:paragraph {"fontSize":"small"} -->
      <p class="has-small-font-size">posted on:</p>
      <!-- /wp:paragraph -->
      <!-- wp:post-date {"isLink":true,"fontSize":"small"} /-->
    </div>
    <!-- /wp:column -->
  </div>
  <!-- /wp:columns -->
</div>
<!-- /wp:column -->
```

I can't seem to figure out if there is a pattern similar to what we do for `wp:post-navigation` links where there is a label available (even though we can't edit its content) inserted as a span that we can tweak with CSS.

Again, I'm not sure if this is something I'm doing wrong or if it's something that is just not available in Gutenberg at all.

## Navigation issues

If there is no previous or next post, the remaining content will move. However when both previous and next links are present the links are squished together and it doesn't look like the design I intended, regardless of the code I use.

When both previous and next links are present the links break down into two lines and they only take the width of the query-loop block.

I came around with a CSS solution that kind of does what I need it to. The negative margin is a hack to make the navigation stay centered and match the footer below it.

```css
div[class*="wp-container"].wp-block-query-pagination {
  width: 80vw;
  margin-left: -250px;  
}
```

There is more research I need to do to make sure this won't break on desktop screens with different resolutions.

## How many sources for blocks are enough?

In an ideal world, installing all the block libraries that we want wouldn't be a problem, right?

Unfortunately, installing multiple block collections can be problematic and may cause performance issues and confuse users when a given block breaks because the package it was installed from hasn't been installed in the new WordPress installation.

So how do we plan for the number of block plugins that we install? Do we need to install external packages for added functionality?

## Creating header navigation menus

Surprisingly one of the hardest parts of building a theme was adding navigation for the header element.

At the most basic, the `wp:navigation` has a single attribute that links the menu to the underlying navigation post using the post's ID attribute.

```html
<!-- wp:navigation {"ref":295} /-->
```

The problem I've had is that I can't figure out how to build the navigation page so until I figure out how to build the menu page, I've built a static menu with hardcoded links. The modified link looks like this:

```html
<!-- wp:navigation {
  "className":"main-navigation",
  "layout":{
    "type":"flex",
    "setCascadingProperties":true,
    "justifyContent":"right",
    "alignItems":"center"
    }
  } -->

  <!-- wp:navigation-link {
    "label":"About",
    "title":"about",
    "type":"page",
    "url":"/about/"
  } /-->

  <!-- wp:navigation-link {
    "label":"Privacy",
    "title":"Privacy",
    "type":"page",
    url":"/privacy"
  } /-->

  <!-- wp:navigation-link {
    "label":"Codepen",
    "title":"Codepen",
    "type":"link",
    "url":"https://codepen.io/caraya"
  } /-->

  <!-- wp:navigation-link {
    "label":"Projects",
    "title":"Projects",
    "type":"link",
    "url":"https://caraya.github.io/mprojects/"
  } /-->

  <!-- wp:navigation-link {
    "label":"Patterns",
    "title":"Patterns",
    "type":"link",
    "url":"https://rivendellweb-patterns.netlify.app/"
  } /-->

  <!-- wp:navigation-link {
    "label":"Layouts",
    "title":"Layouts",
    "type":"link",
    "url":"https://rivendellweb-layout-experiments.netlify.app/"
  } /-->
<!-- /wp:navigation -->
```

The information available about the[navigation block](https://make.wordpress.org/core/2022/01/07/the-new-navigation-block/) doesn't cover how to build the navigation pages. Until I do then I'll have to keep the static link around, perhaps as a separate pattern.
