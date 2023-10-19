---
title: "My Markdown cheatsheet"
date: "2023-10-15"
---

One of the reasons to move my blog from WordPress to Eleventy was the flexibility of convert the Markdown I write into proper HTML without using raw HTML in the Markdown files.

column1 | column2
--- | --- |
Read | Write

{.special}

1. 22354
2. 54252
3. 1231231542

{.custom-ordered}

But adding Markdown-it plugins mean additional syntax to remember and different ways to use established Markdown-it syntax.

This document is my attempt at remembering all the things I've added so I can continue to use them.

This post is my attempt at a cheat sheet for the extra Markdown Elements that I use in this blog.

!!! warning This post is specific to this site
The commands, as explained in this post, are designed for this blog and will only work as explained here.

If you want to get them to work in your own site contact me and I'll try to help.
!!!

## Figures

Using the figure plugin. Eleventy will generate full `figure` elements with a caption using the `figcaption` element.

The following Markdown code:

```markdown
![caption and alt text](url/or/path/to/the/image.ext)
```

Will produce this HTML:

```html
<figure>
  <img src="url/or/path/to/the/image.ext"
    alt="caption and alt text"
    loading="lazy"
    decoding="async"
    class="lazy">
  <figcaption>caption and alt text</figcaption>
</figure>
```

This will handle both native lazy loading and third-party lazy-loading scripts that require a class attribute to be present for them to work.

Also note the use of the [decoding](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding) property to load the image in prallel with the rest of the page so text may render before images have finished loading... score!

One drawback is that, as configured, the plugin will use the same text for both the `alt` attribute and the content of the `figcaption` element. This is likely not a good idea but I'm still working on possible solutions

## Definition lists

Definition lists consist of two parts wrapped in a list definition (`dl`), the term (using the `dt` element) and one or more definitions (using the `dd` element).

The Markdown version looks like this:

```markdown
term1
: First paragraph of the definition
: Second paragraph of the definition

term2
: First paragraph of the definition
: Second paragraph of the definition
```

It will produce the following HTML code:

```html
<dl>
  <dt>Term1</dt>
  <dd>First paragraph of the definition</dd>
  <dd>Second paragraph of the definition<dd>

<dt>Term2</dt>
  <dd>First paragraph of the definition</dd>
  <dd>Second paragraph of the definition<dd>
</dl>
```

You can have group two or more definitions together (like for British and American spelling of a word), you can have multiple definitions for a term and there is no length limit for each definition

## kbd elements

[kbd](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd) represents keyboard input, for example key combinations to run a command.

```markdown
Run [[cmd]] + [[shift]] + [[R]] on macOS

Run [[ctrl]] + [[shift]] + [[R]] on Windows.
```

Will produce the following HTML

```html
<p>Run <kbd>⌘</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> on macOS</p>

<p>Run <kbd>⌃</kbd> + <kbd>⇧</kbd> + <kbd>R</kbd> on Windows to reload the browser window.</p>
```

The `kbd` plugin will convert some words into symbols. `cmd` is transofrmed to `⌘`, shift to `⇧` and ctrl to `^`.

I'll evaluate if this is still what I want after I've had the chance to run it for a while.

## Footnotes

Footnotes are made of two parts, the callout in the text and the footnote text.

The callout is surrounded by square brakets with a `^` and the marker that we want to use. For example `[^1]` is a valid marker

The footnote text begins with the same callout that we used in the text followed by a colon, like this `[^1]:`, followed by one or more paragraphs of text.

It doesn't matter where we put the foonote, it will be moved to the end of the document and displayed in sequential oder.

```markdown
The text that needs a footnote goes here. [^1]

[^1]: This is the text of the footnote.
```

The punctuation is important. If you miss the colon on the footer text then the footnote will be displayed as is. This is definitely not what you want.

## Admonitions

Admonitions are asides with relevant information that are not essential to the body of the text.

The following types of admonitions are supported:

* info
* note
* tip
* warning
* bug
* danger
* failure
* success

The structure is the same:

1. Three exclamation marks, `!!!` followed by the `type` of admonition and an optional title
   1. If you don't provide a title, then the type of admonition will be used
2. The body of the admonition
3. Three exclamation marks, `!!!` on a line of their own

A `warning` admonition would look like this

```markdown
!!! warning
You never know who'll get to read it :)
!!!
```

```html
<div class="admonition warning">
  <p class="admonition-title">warning</p>
  <p>It works so much better when you do your research before engaging in arguments</p>
</div>
```

You can also add a title to the admonition by adding the title after the type of admonition.

To add a title to the warning example, the modified code will look like this:

```markdown
!!! warning Do your research
You never know who'll get to read it :)
!!!
```

And the resulting HTML will look like this:

```html
<div class="admonition warning">
  <p class="admonition-title">Do your research</p>
  <p>It works so much better when you do your research before engaging in arguments</p>
</div>
```

## lite-youtube and lite-vimeo

`lite-youtube` and `lite-vimeo` are not Markdown and require Javascript to run, but they will improve the performance of pages.

Each of these custom elements reduce the number of HTTP requests the browser makes to render the video.

Because I'm adding the scrips to the rendered pages, I've followed the suggestions in [Efficiently load Javascript with defer and async](https://flaviocopes.com/javascript-async-defer/) and place the scripts in the `head` of the page and add the `defer` attribute.

### YouTube

The `lite-youtube` custom element embeds a YouTube embedded iframe.

It takes `videoid` attribute with the ID of the video we want to play and a `params` attribute indicating any custom iframe attribute that we want to pass. In this case we want to override the default autoplay behavior and have it **not** autoplay at all.

```html
<lite-youtube videoid="Gv0Az2HvEDs"
params="autoplay=0"></lite-youtube>
```

### Vimeo

The `lite-vimeo` custom element will embed a Vimeo video player.

It takes a single `videoid` attribute representing the ID of the video we want to play.

```html
<lite-vimeo
  videoid="364402896">
</lite-vimeo>
```

Unlike `lite-youtube`, `lite-vimeo` requires CSS to size the video to what we want.

I've chosen to style the custom element directly rathe than create a container class for it.

```css
lite-vimeo {
  width: 720px;
  max-width: 720px;
  height: auto;
}
```
