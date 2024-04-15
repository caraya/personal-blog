---
title: Figures As Universal Containers
date: 2024-04-17
tags:
  - Figures
  - Design
  - Experiments
---

When I see figures, this is what I think about and what I see the most often, maybe with [srcset and sizes](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/srcset) attributes to handle responsive images.


<iframe
	height="385.94232177734375" style="width: 100%;" scrolling="no" title="figure and image" src="https://codepen.io/caraya/embed/OJGZzLL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/OJGZzLL">
  figure and image</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

According to the [HTML specification](https://html.spec.whatwg.org/multipage/grouping-content.html#the-figure-element) (emphasis mine):

> The figure element represents some flow content, optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document.
>
> ...
>
> **The element can thus be used to annotate illustrations, diagrams, photos, code listings, etc.**

In this post, we'll explore how to use the figure element with different types of content. We will also discuss how to add captions, how to number groups of images, the accessibility implications of doing it, and how to reference them in the main document text.

## Annotating Elements In A Figure

Using the `figure` element to wrap content is not always required but, when used with the `figcaption` element you can annotate what the element inside is about in addition to what you would do in the main body of the document.

Using captions (with the `figcaption` element) also allows authors to reference the figure in other parts of the document. We'll discuss this in more detail later in the post.

These examples have minimal styling

### Picture Elements

The first example uses the [picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) element. To the user it wouldn't appear any different but under the hood, it would display the best format from those provided by the developer.

<iframe height="374.60968017578125" style="width: 100%;" scrolling="no" title="figure and picture" src="https://codepen.io/caraya/embed/yLrjpBg?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/yLrjpBg">
  figure and picture</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Code Listings With Syntax Highlight

When working with code listings I always like to use [Prism.js](https://prismjs.com/) for syntax highlighting.

<iframe height="507.592041015625" style="width: 100%;" scrolling="no" title="figure and code listings" src="https://codepen.io/caraya/embed/oNOdpNa?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/oNOdpNa">
  figure and code listings</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Table

Tables have always been difficult for me to create. Figures don't add complexity, they just remind me how hard it is to style them properly.

We could annotate the table using the [caption](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption) element. However, we should keep in mind two things:

* If we include a `caption` element it must be the first child of its parent table element
* When we nest a `table` inside a `figure`, we should caption using figcaption inside the figure rather than caption the table directly.

<iframe height="363.55084228515625" style="width: 100%;" scrolling="no" title="figure and table" src="https://codepen.io/caraya/embed/VwNxQMK?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/VwNxQMK">
  figure and table</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Video With Video Element

The [video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) element is similar to what we saw in the picture element, except that the structure is different.

<iframe height="500.7801513671875" style="width: 100%;" scrolling="no" title="figure with video using video element" src="https://codepen.io/caraya/embed/RwOyXBw?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/RwOyXBw">
  figure with video using video element</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Videos With YouTube Embeds

We can embed streaming videos inside figures. These are different than using the `video` elements shown in the previous section but the result would be identical if the video was also available for download.

<iframe height="466.44940185546875" style="width: 100%;" scrolling="no" title="figure with YouTube embed" src="https://codepen.io/caraya/embed/jORxgoG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/jORxgoG">
  figure with YouTube embed</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Lists

There are three types of lists that I usually work with. Ordered, unordered and definition lists.

All lists should work the same as far as being inside figures go, the display will be different.

The first example below shows and unordered or bulleted list.

<iframe height="531.554443359375" style="width: 100%;" scrolling="no" title="Figure with unordered list" src="https://codepen.io/caraya/embed/MWRXopg?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/MWRXopg">
  Figure with unordered list</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The next example shows a definition list (`dl` and its `dt` and `dd` children).

<iframe height="597.1358642578125" style="width: 100%;" scrolling="no" title="figure with definition list" src="https://codepen.io/caraya/embed/zYXadYz?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/zYXadYz">
  figure with definition list</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Captioning figures

So far we've covered a variety of elements that can be placed inside the `figure` element.

Now we'll look at different strategies for captioning figures using the `figcaption` element.

According to the HTML Living Standard:

> The first figcaption element child of the element, if any, represents the caption of the figure element's contents. If there is no child figcaption element, then there is no caption.

We can control whether a figure has captions witht he `figcaption` element. If we omit it then there will be no caption shown to the user.

### Numbering Figures

The `figcaption` element on its own will not number the figures. We have two options to get `{type of figure} {number}: ` before the text of the caption and each of these options has advantages and disadvantages.

The first way is to manually include the reference in the caption for each type of figure. Using images as examples, it coulld look like this:

```html
<figure>
	<img src="path/to/image.avif" alt="">
	<figcaption><span class="fignumber">Figure 1: </span>Example figure caption</figcaption>
</figure>
```

The advantage is that we get full control over the text of the caption.

The disadvantage is that whenever we need to insert or remove figures we must renumber all existing figures of that type.

The second way to number figures is to use CSS [counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters) and [generated content](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_generated_content) to insert the numbering, and any associated text, before the caption text.

The CSS code below will do the following:

1. Reset the image counter whenever a new article starts
2. Increase the figure counter for every new figure element
3. Use the [:before](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) pseudo-element to create a string
   1. The string uses the figure counter in the value of the [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) property

This will create a string like `Figure {number}: `.

```css
article {
	counter-reset: figures;
}

figure {
  counter-increment: figures;
  width: fit-content;
  inline-size: fit-content;

  img {
    display: block;
		width: 600px;
		inline-size: 600px;
  }

	figcaption {
    margin-block: 1rem;
    margin-inline: 2rem;
    font-family: Raleway, sans-serif;
  }

  figcaption:before {
    content: "Figure " counter(figures) ": ";
  }
}
```

The advantage is that we no longer have to worry about renumbering if we insert or remove figures from the document.

The disadvantage is that this is not a completely accessible solution. Not all screen readers and operating system combinations can read generated content so make sure you test generated content for figures in your target browsers.

If you have multiple types of figures, you can add type-specific classes to the figures and then work for each type of figure.

When we reset the counters we can reset more than one counter separating them with spaces.

We then increase the corresponding figure counter independently from each other where appropriate.

<iframe height="503.121826171875" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/caraya/embed/MWRBpye?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/MWRBpye">
  Untitled</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Referencing Figures

The final aspect I want to cover is how to reference figures in the body of the page and where to place the images relative to the text that references them.

The HTML specification talks figure placement:

> When a figure is referred to from the main content of the document by identifying it by its caption (e.g., by figure number), it enables such content to be easily moved away from that primary content, e.g., to the side of the page, to dedicated pages, or to an appendix, without affecting the flow of the document.
>
> If a figure element is referenced by its relative position, e.g., "in the photograph above" or "as the next figure shows", then moving the figure would disrupt the page's meaning. Authors are encouraged to consider using labels to refer to figures, rather than using such relative references, so that the page can easily be restyled without affecting the page's meaning.

Be careful with the placement of the images in the document, how you reference them in the document and, where possible, label the captions to make referencing figures easier.

