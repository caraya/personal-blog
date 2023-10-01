---
title: "Gutenberg: Additional Thoughts and Conclusions"
date: "2018-03-05"
---

## Licensing the code

There is also a licensing question: How is Matt Mullenweg allowing this non-GPL code into Wordpress? He has been very vigorous in the past in going after people who sold themes that used split licenses (thesis, anyone?) So what changed now?

For the longest time Wordpress (at Matt Mullenweg's insistence) has not allowed dual licensed code to be published in the official Wordpress marketplaces ([wordpress.org/themes](https://wordpress.org/themes/) and [wordpress.org/plugins](https://wordpress.org/plugins/)). But React, at least since version 16, is released under the [MIT License](https://github.com/facebook/react/blob/master/LICENSE) which is much more permissive license than GPL yet fully compatible with it.

So what happens to the dual licensing of code outside core? Is it OK to break the dual licensing rule now that Wordpress Core does the same thing? If it's not then what's the rationale for this disparity? Are the concerns in [There is No Such Thing as a Split License](https://ma.tt/2015/07/licenses-going-dutch/) still valid or do they change now that Wordpress itself has gone Dutch?

I've opened [issue 5281](https://github.com/WordPress/gutenberg/issues/5281) in the Gutenberg repository to try and get some resolution on this issue. It seems that the guidelines now require plugins to be [GPL2+ compatible](https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/#1-plugins-must-be-compatible-with-the-gnu-general-public-license-v2). The wording is still vague but at least it's vague in the right direction. What compatible licenses? The ones listed on the FSF website? Others? Will I be able to publish mixed-code plugins to the Wordpress Marketplace?

For more information about dual licensing and the issues I have with Wordpress enforcement of the GPL, see my blog post: [GPL and Wordpress: Developer Beware]( ).

## Issues I'm experiencing

I've tried migrating my blog where the oldest post is 6.5 years old. I chose to use this blog rather my personal one where the oldest post is 12 years old because I want to validate the migration with a large number of posts but not large enough that it'll make problems hard to troubleshoot.

* * *

There are times when the update process for published posts will not work. The issue is related to [Guttenberg issue 2565](https://github.com/WordPress/gutenberg/issues/2565) as I am using Cloudflare as a CDN and it's challenging the post request to the Wordpress REST API as a JSON injection attack; when the API cannot respond then the request is blocked.

This is what causing posts not to update, publish or save; whish there was better error messages at least for developers and administrators. This has been a problem for me even when, in the same location, my laptop switched from an IPV4 address to an IPV6 one. Cloudflare saw it as two different computers so it blocked it.

I have a ticket open with Cloudflare to see if it's possible to solve the issue. If it isn't then I have to decide if performance is more important than a working site. In the meantime, I've configured a Cloudflare page rule to trigger when it hits the wp-json endpoints while I wait for a reply from Cloudflare Support. Neither Automattic or Cloudflare has provided a permanent solution other than whitelist IP addresses.

* * *

If I have the following code at the top of a block:

```html
<div class="message info">
<p>paragraph content.</p>
</div>
```

Gutenberg will not close the div tag and consider the following paragraph to also be a div with `class="message info"` whether that's what I wrote or not. The solution is to change the block to classic whenever using message type CSS classes.

* * *

The content looks different when previewing it than when it's published. The post is not respecting paragraph spacing or the additional CSS I added to the theme to attempt to compensate.

I believe this may be related to Jetpack's [not working with Gutenberg](https://github.com/Automattic/jetpack/issues/7786). Since Markdown is not honored the layout of the content goes down the drain

* * *

When updating a post to use Gutenberg blocks, the classes for all fenced code blocks the classes that indicate the language for Prism to use (`language-class=<name>`) disappear and have to be manually added back using the editor. You get an error if you try to add the class in the code editor (it doesn't validate) and, in the example I worked with, only some of the code blocks will highlight (this is likely a separate issue).

I've opened [issue 5392](https://github.com/WordPress/gutenberg/issues/5392) with Gutenberg to get some guidance on this issue. It has been marked as an enhancement, not sure why.

* * *

I'm having to redo a lot of changes over and over when revisiting a post I've edited with Gutenberg. If I edit a blockquote block, change the HTML code to properly format an unordered list that is part of the quote, and save it then the next time I visit the post I will be prompted to overwrite, edit as a classic block or edit HTML. If I overwrite the change to continue working in Gutenberg some, if not all, the code I changed manually, will disappear.

## Alternatives

When I first heard about Gutenberg and the future of the Wordpress editor I was in the middle of experimenting with [Hugo](https://gohugo.io/) as a way to build a static replacement for my labs website.

As part of that experiment, I moved the content from the Wordpress blog to Hugo and was pleasantly surprised with the result. To get the content in a format appropriate for Hugo I used the [Wordpress to Hugo exporter](https://github.com/SchumacherFM/wordpress-to-hugo-exporter) plugin for Wordpress; it creates drop-in content for Hugo consisting of YAML front matter and Markdown body.

This would allow me to integrate other technologies like Service Workers, Cloudinary for responsive images and Cloudflare without having to worry if it'll break my authoring experience and it will also give me much tighter control over the final result without having to worry about trying to fit what I want to do with the way the CMS wants them done.

## Conclusion: A step forward or two steps back?

In his post/tutorial [Introducing Gutenberg Boilerplate For Third Party Custom Blocks!](https://ahmadawais.com/gutenberg-boilerplate/), Ahmad Awais list what he sees the pros and cons of Gutenberg. I've quoted the aspects I consider most important from his pro/con evaluation below along with my comments about it.

How hard are we making it for new developers to create themes and plugins for Wordpress? Part of me is happy that this will reduce the amount of overtly cheap, it may turn developers away from Wordpress altogether.

> It’s way too hard for a beginner developer to understand let alone write this kind of code.

I don't contribute to core so I wouldn't know how many people are actively contributing to the development of core in general or Gutenberg in particular but statements like the one below worry me enormously.

> The fact is, there aren’t many who know the ropes around here. Let alone interested in contributing to this project. Which leaves us with scary conclusions?

How large is the Wordpress team working on Gutenberg? Is the number of contributors in Github a fair approximation of the size of the Gutenberg team?

Furthermore, how did Wordpress decide to work with React (licensing issues aside) and the plugins that they chose to work with?

How do they manage the dependency tree and outdated dependencies? This is particularly troublesome because they are using Babel 7 beta, how will this affect the work people do in Gutenberg as Babel moves through beta versions into final release?

> When using NPM Packages, who and how do we decide which package should be utilized?

I see Gutenberg as the culmination of a trend I saw starting with Calypso, [the new Wordpress.com](https://developer.wordpress.com/2015/11/23/the-story-behind-the-new-wordpress-com/), built as the new front end for [wordpress.com](https://developer.wordpress.com/calypso/) and desktop clients for Windows, Mac, and Linux. Using a React-based application when building a multiplatform his mean tool makes some kind of sense, in my opinion. It makes much less sense to use this stack when creating the content editor framework unless you can guarantee ease of use or a shallow and fast learning curve.

So, from my perspective as a developer and a user, **what does this mean for Wordpress moving forward?**

The majority of the code remains in PHP there are portions of the codebase now being written in React and Javascript. How much of the code will transition away from PHP to React/Redux/Abstraction Layer that we've seen in Calypso and Gutenberg?

I believe that moving portions of Wordpress to React is a step back as it reduces the number of developers that can work and contribute to the codebase and it raises the barrier of entry for new developers higher than it needs to be. This used to be less of an issue because themes and plugins only needed Javascript for additional functionality but it has become a real issue now that the equivalent of themes and plugins content is written in React with the Wordpress abstraction layer on top of it.

I also have an issue with turning everything into a block. One thing that Gutenberg hasn't addressed yet is inline content like inline code (using the `code` element or the \` character in Markdown). Right now that is not possible and I wonder what other inline elements are missing from the toolbar and from the current roadmap for the project.

I think that Gutenberg can be an awesome experience if handled properly.

I don't particularly care for React and think it's a mistake to move to it for Wordpress but if I'm going to work with Blocks then React it is. I'm just concerned about the process and how much work will I have to do to manually convert content to the new system.

My next task will be to try and build a block using [Prism.js](http://prismjs.com/) to use instead of my `functions.php` theme customization and the plugin that replaced it. This will be an important consideration on whether I stay with Gutenberg or not.

## Links and Resources

- General
    
    - [Gutenberg, or the Ship of Theseus](https://matiasventura.com/post/gutenberg-or-the-ship-of-theseus/)
    - [Editor Technical Overview](https://make.wordpress.org/core/2017/01/17/editor-technical-overview/)
    - [Design Principles](https://wordpress.org/gutenberg/handbook/reference/design-principles)
    - [With Gutenberg, what happens to my Custom Fields?](https://riad.blog/2017/12/11/with-gutenberg-what-happens-to-my-custom-fields/)
    - [Is Gutenberg built on top of TinyMCE?](https://wordpress.org/gutenberg/handbook/reference/faq/#is-gutenberg-built-on-top-of-tinymce)
    - [Wordpress Child Themes](https://codex.wordpress.org/Child_Themes)
    - [WP-Tonic 245: Does the Genesis Framework Have a Future in a World of Theme & Page Builders?](https://www.wpfangirl.com/2017/wp-tonic-245-genesis-framework-future-world-theme-page-builders/)
- Opinions and explanations
    
    - [How Existing Content Will Be Affected by Gutenberg WordPress Editor](https://webdevstudios.com/2018/01/02/existing-content-affected-wordpress-gutenberg/)
    - [Matt Mullenweg Addresses Concerns About Gutenberg, Confirms New Editor to Ship with WordPress 5.0](https://wptavern.com/matt-mullenweg-addresses-concerns-about-gutenberg-confirms-new-editor-to-ship-with-wordpress-5-0)
    - [Gutenberg Editor Review: Please Don’t Include This in WordPress Core](https://premium.wpmudev.org/blog/gutenberg-editor-wordpress/)
    - [Thoughts on Gutenberg](https://digwp.com/2017/11/thoughts-on-gutenberg/)
    - [Diving Into the New Gutenberg WordPress Editor (Pros and Cons)](https://kinsta.com/blog/gutenberg-wordpress-editor/)
- Tutorials
    
    - [Introducing Gutenberg Boilerplate For Third Party Custom Blocks!](https://ahmadawais.com/gutenberg-boilerplate/)
    - [Create Guten Block Toolkit: Launch, Introduction, Philosophy, & More!](https://ahmadawais.com/create-guten-block-toolkit/)
- Video Presentations
    
    - [Matt Mullenweg: State of the Word 2017](https://wordpress.tv/2017/12/04/matt-mullenweg-state-of-the-word-2017/)
    - [Morten Rand-Hendriksen: Gutenberg and the WordPress of Tomorrow](https://wordpress.tv/2017/12/10/morten-rand-hendriksen-gutenberg-and-the-wordpress-of-tomorrow/)
- Wordpress CLI
    
    - [Wordpress Scaffold and Gutenberg](https://github.com/wp-cli/scaffold-command/issues/88)
    - [Running WP-CLI commands remotely](https://make.wordpress.org/cli/handbook/running-commands-remotely/)
    - [WP-CLI commands cookbook](https://make.wordpress.org/cli/handbook/commands-cookbook/)
    - [WP-CLI external resources](https://make.wordpress.org/cli/handbook/external-resources/)
