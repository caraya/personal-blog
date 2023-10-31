---
title: "Revisiting Gutenberg full site editing"
date: "2022-02-21"
---

Now that WordPress 5.9 is close to release, we can revisit the Gutenberg full site editing experience since more of it will be baked into core rather than the Gutenberg plugin.

I'm not a fan of full site editing just like I'm not completely sold on Gutenberg as an editor even after a few years. But, since the market is moving in this direction, I believe that developers should be aware of Gutenberg and the FSE to provide guidance on the optimal approach to the client's project.

I've been reading and researching the latest improvements to the FSE experience and I think it's time to write about them now that WordPress 5.9, where most of this changes will see the light of day, is around the corner.

## Understanding the Full Site Editing experience

I've set up a brand new WordPress site to work with Gutenberg. I've documented previous work with Gutenberg in the blog posts below:

* [Gutenberg full-site editing and Block-Based Themes](https://publishing-project.rivendellweb.net/gutenberg-full-site-editing-and-block-based-themes/)
* [A New Way to Create Block Plugins](https://publishing-project.rivendellweb.net/a-new-way-to-create-block-plugins/)
* [Gutenberg: A step forward or two steps back?](https://publishing-project.rivendellweb.net/gutenberg-a-step-forward-or-two-steps-back/)
* [Gutenberg: How do we work with older content?](https://publishing-project.rivendellweb.net/gutenberg-how-do-we-work-with-older-content/)
* [Gutenberg: Additional Thoughts and Conclusions](https://publishing-project.rivendellweb.net/gutenberg-random-thoughts-and-conclusions/)
* Building Gutenberg blocks
  * [Part 1](https://publishing-project.rivendellweb.net/building-gutenberg-blocks-part-1/)
  * [Part 2](https://publishing-project.rivendellweb.net/building-gutenberg-blocks-part-2/)
  * [Part 3](https://publishing-project.rivendellweb.net/building-gutenberg-blocks-part-3/)
  * [Part 4](https://publishing-project.rivendellweb.net/building-gutenberg-blocks-part-4/)

Linking to the above gives me a baseline for the content in this post.

If you're reading this, I'm assuming can:

* Build React-based Gutenberg blocks
* Pack Gutenberg blocks into a plugin
* Create style variations for a block
* Style blocks with CSS
* Create a theme.json global configuration file

There are still some questions to ask. Having the answers would make moving to a Gutenberg-based theme easier:

* How can you load prism scripts and styles into a theme.json file?
* How do you include third-party fonts and scripts into a Gutenberg theme? is enqueueing the font enough?

## Creating blocks versus the current system: React versus PHP

React blocks are the core of Gutenberg, both the ones that are bundled with WordPress Core, those that are built by third-party groups like StudioPress, and those that you build yourself as bespoke blocks that address your specific needs.

That said, Gutenberg doesn't fully eliminate the need for PHP. There are still places where PHP is necessary.

**Block Filters**

WordPress provides a series of [filters](https://developer.wordpress.org/block-editor/reference-guides/filters/block-filters/) that can be used to modify the block before it is rendered.

Some of the filters are written in PHP and the ones that seem to be written in Javascript, it is hard to tell from the examples and the prose surrounding them.

**Plugins**

[plugins](https://developer.wordpress.org/plugins/) are still the preferred way to package content for use in WordPress, whether it's in Gutenberg or outside.

Writing plugins is not complicated but it's not trivial either. It gets more complicated if you plan to share the plugin in the WordPress.org repository as there are more rules to follow.

That brings up what, to me, is the biggest problem with Gutenberg:

> **Not all WordPress developers are React developers, and they shouldn't be**.

I understand that there are tons of blocks available by default and that several theme framework makers like Elementor and Genesis have released block plugins. But just like with jQuery and any other framework, there is a time when your needs may grow beyond what's available, or beyond the price you're willing to pay, so you will have to build your own so yes, you will become a React developer.

A good starting point is the Node-based [create-block](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/) package. This tool will automate the creation of a basic block for you but that's all it does, it's still on you as the developer to create the block itself. It will also start you on what the WordPress team considers best practices for creating blocks.

There are some new things that replace techniques that we've taken for granted as WordPress developers but they mean that we have to move away from the PHP that we've used since the beginning and move to React.

We'll discuss some of these features (as I understand them) in future posts.
