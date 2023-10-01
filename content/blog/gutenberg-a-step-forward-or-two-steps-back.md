---
title: "Gutenberg: A step forward or two steps back?"
date: "2018-02-26"
---

I got into the discussion for [an issue](https://github.com/Automattic/_s/issues/1248) in the \_s theme repository regarding [Gutenberg](https://wordpress.org/gutenberg/) code blocks. It seems that after the first phase where they will be optional, meaning that if you don't want them or have content that relies on the traditional editor's layout you can choose not to use them or disable them via another plugin, you will be forced to use Gutenberg and its blocks regardless of what you needs are.

The assumption that making it easier for everyone to create Wordpress content using Gutenberg blocks is not just misguided but dangerous too without providing an alternative way to create the content we'll display to our users.

Over the past ten years I've built workflows and blogs with Wordpress that do pretty much everything and anything I need them to without having to largely modify themes or templates. For example: I use Jetpack's Markdown with a customized local installation of the Prism highlighter (rather than a plugin) for content creation (including working around a bug in Jetpack's Markdown implementation that seems to be too low priority for the Jetpack team to fix). Rather than use shortcodes I've become used to writing straight HTML that is styled to display the way I want it.

Gutenberg uses the concept of blocks, smaller self-contained units that allow for discrete portions of rich, visual content as part of your Wordpress posts and pages.

> The ship, like Theseus’, needs to continue sailing while we upgrade the materials that make it. It needs to adapt to welcome new people, those that find it too rough to climb on board, too slippery a surface, too unwelcoming a sight, while retaining its essence of liberty. This is not an easy challenge—not in the slightest. Indeed, we called it Gutenberg for a reason, for both its challenges and opportunities, for what it can represent in terms of continuity and change. It is an ambitious project and it needs the whole WordPress community to succeed. I’d like to start examining some of the decisions made along the way, and the ones that are still to come. From [Gutenberg, or the Ship of Theseus](https://matiasventura.com/post/gutenberg-or-the-ship-of-theseus/)

The goals are admirable but the execution is where I'm having issues. I don't think that forcing everyone into a new paradigm that doesn't include what has been done in the past is a good long-term solution.

What worries me the most is that there is no real migration path for existing themes and content because, in my opinion, the emphasis has been made on new users and ease of authoring for them. There is no consideration to what it'll take to update existing content and how much work it'll take to migrate the older projects.

As with everything in Wordpress, the trend seems to be that we need to make everything as simple as possible without regard for people who may not want that level of simplicity, you're stuck with it regardless. Other than the issue discussed below there has been no mention about a plan not to break customized installations of Wordpress or existing workflows that don't use (or need) visual editing.

In the earlier stages (I believe it'll start with the 5.0 release) you will be able to disable Gutenberg through another plugin but as the project moves forward the Gutenberg will become so baked into Wordpress core and the Wordpress "way of doing things" that disabling it will become impossible.

I've tried using my existing workflow in a Gutenberg-enabled clone of my existing site and I've encountered many problems that make me not want to use Gutenberg at all. I'll detail some of the issues later.

There is an issue in the Github repository that discusses [Viable Migration Plan for Minimum Viable Product](https://github.com/WordPress/gutenberg/issues/4981) that began the discussion of what it would take to keep the current editor and Gutenberg so that existing installations will not break if Gutenberg is active.

## Target Audience and Expected Expertise

> On Guides and Placeholders. It is true that WordPress is capable of creating sophisticated sites and layouts. The issue is you need to know how to do it. And getting there requires a level of commitment and expertise that should be unnecessary. Why do users have to bear the weight of convoluted setups to work around the lack of a solid and intuitive visual experience? This question is what brought us to the concept of blocks in the first place. The simplified nature of blocks, which optimizes for the direct manipulation of content and a single way to insert it, proposes an evolution of the WordPress model. It also comes with interesting opportunities. For example: how many themes have remarkable presentation in their demo sites but require Herculean efforts to replicate? A core ingredient of blocks is that, by their nature, they have a defined “empty state” that works as a placeholder describing how someone can interact with it. Blocks can guide a user as they craft their content intuitively. From [Gutenberg, or the Ship of Theseus](https://matiasventura.com/post/gutenberg-or-the-ship-of-theseus/)

The same argument can be made for the reverse case. We've been using customized versions of TinyMCE as far back as I've been using Wordpress (since version 2.6 in 2006) and people have learned to use it, code and work around its (many) limitations and have produced awesome content... only for Wordpress to come and tell you to start over both as a developer, a designer and a user.

Biggest question, so far, is this: **Who is Gutenberg really for?**

I ask because in reading posts and documentation for Gutenberg seems to confuse who will use and benefit the most of Gutenberg and its functionality.

If I understand it correctly the idea behind Gutenberg is that it'll take over from plugins and shortcodes and you'll get a series of boxes that are purpose built for a single function and that users will compose posts and pages for.

But then the idea of building custom blocks is where I'm getting confused. Are the blocks part of core, part of of a theme, both or neither? How will they work with [Wordpress Child Themes](https://codex.wordpress.org/Child_Themes)?

They seem to be part of core, at least the default blocks, themes and plugins (in the sense that themes can add and restrict what blocks you have available to use)

So, if I'm understanding this correctly, blocks take the place of plugins and shortcodes but there is no clear or easy way to figure out what will be supported through blocks or what older pieces of content will work as they are and what will we need to migrate or create new blocks for.

## Markdown as structure or content authoring?

> Markdown can often be great for writing, but it’s not necessarily the best environment for working with rich media and embeds. With the granularity afforded by blocks you could intermix markdown blocks with any other block, adapting to whatever is the most convenient way to express a specific kind of content. Whenever a block cannot be interpreted, we can also handle it as a plain HTML block. In future releases, you’d be able to edit individual blocks as HTML without having to switch the entire editor mode. Individual HTML blocks can also be previewed in place and immediately. From [Gutenberg, or the Ship of Theseus](https://matiasventura.com/post/gutenberg-or-the-ship-of-theseus/)

When working with Markdwon we can make two different assumptions: Markdown is used exclusively for writing content or Markdown is used to write an entire page (both content and structure). I've always advocated the first approach. If we have to add structure to the content of a post or page I've grown used to adding HTML directly to the page rather than use a plugin or shortcode to provide the same functionality.

If we need to support new ways to add content using Markdown it's fairly easy to work at the parser level and create extensions to Markdown. The ones that come to mind the most are tables and fenced code blocks but others are possible too.

I've never been a fan of shortcodes. I'd rather take the embed code and add it directly to the page, maybe surrounded by a `div` that will help me style the content or maybe do something else related to accessibility rather than let a shortcode dictate how that works. That said I want to retain the option of doing it my way as it may change for individual instances and I don't want to customize a block to do something that may or may not change.

## The future of Child Themes

Another thing I'm not clear is what will happen with child themes and how will the concept of theme change with blocks, particularly for older content (as we'll discuss in a later section).

TO reduce the workload for users of a child theme we use a function similar to the one below to load the parent's stylesheet before we load the child theme's. This way we get all the styles from the parent theme and can make changes to the child without affecting the parent.

```php
function my_enqueue_styles() {

    /* If using a child theme, auto-load the parent theme style. */
    if ( is_child_theme() ) {
        wp_enqueue_style( 'parent-style', trailingslashit( get_template_directory_uri() ) . 'style.css' );
    }

    /* Always load active theme's style.css. */
    wp_enqueue_style( 'style', get_stylesheet_uri() );
}
add_action( 'wp_enqueue_scripts', 'my_enqueue_styles' );
```

Since themes will restrict what blocks you make available to your content creators, is something like this still necessary? How do global styles work and how do children elements and blocks inherit from the parent theme (assuming there is one)?

For years Wordpress has stated that working with Child Themes and parent frameworks is the way forward. How has this changed and what will Gutenberg's impact be in the Wordpress theme industry? Part of me hopes it's a good impact in reducing the number of developers creating garbage themes and driving prices down for the rest of the development community. But the other part hopes that not many good developers will drop oout because of the new development requirements.

**How will this impact existing theme frameworks like Thesis and Genesis?**

### How do blocks help craft an intuitive interface?

One of the things that fly on the face of logic is that blocks will help craft intuitive interfaces. I don't think that's the case, at least not as they are currently built. They each require a selection and you have to accept the values and names of the people who created the blocks rather than taking the flexibility of being able to craft your own content in a way that is comfortable to you.

For me personally the current iteration of Gutenberg is far from intuitive. Searching for blocks and trying to use the new block search feature make authoring content much slower than traditional working flows, particularly considering that I write content outside of Wordpress and just paste it into the editor to validate and publish.

Right now there is no keyboard shortcuts that will make navigation more intuitive and less of a hassle. **This is also an accessibility issue**.
