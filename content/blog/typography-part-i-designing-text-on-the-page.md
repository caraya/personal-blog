---
title: "Typography Part I: Designing Text on the page"
date: "2014-01-04"
categories:
  - "design"
  - "technology"
---

When I first started working on web development I had absolutely no clue as to what typography was or how to make pages 'look' visually pleasing, easier to read and more engaging to the user.

Over the years I've developed a sensibility to the way text lies on the page, how it relates to the other elements on the page and how to make the text pleasing and easier to read. In more recent times I've learned the science to go along with the art along with the tools and resources to make it happen.

### Homework to do before starting the research process

* Read the text you'll be working with (if possible)
* What does the text tell you?
  * What is the text about?
* Make notes of the fonts you look at

Some questions that will guide the research process:

* Who is our target audience?
  * Demographics
  * Devices / Platforms
* What kind of content are we creating?
  * One page app
  * website
  * etc
* What is the purpose of the content we're creating
  * Kind of content
    * Persuasion
    * Informative
    * Entertainment
    * Other

## Getting Started: Research and select your font(s)

There are multiple ways to select what fonts you will use and there are multiple strategies to select the fonts. Some people will tell you to use a single font, some will tell you to use whatever will work best for the project at hand. I subscribe to this last philosophy: If a single font will do the work then by all means use a single font; however if more than one font will work better then mix the fonts as needed.

We can use words as well as images when developing our content. In searching for fonts look for trigger words and moods. What words resonate the strongest when reading or interacting with the text?

As Tim Brown suggests:

> "In much the same way as we gather visual inspiration at the outset of our process, we might also begin to consider gathering verbal inspiration when we embark on a project. These verbal palettes or wordboards can help us define a design’s tone and voice and, as we’ll see shortly, are every bit as important as look and feel".
>
> Tim Brown - [Combining Typefaces](http://www.fivesimplesteps.com/products/the-craft-of-words)

There are multiple sources on information when it comes to researching fonts. Designers may not always have the time to do all this but the more you can do the better your design will be for it.

* Check the publisher's site for the font
  * What does it tell you?
  * Does it give you the information you need to decide whether the font is good for what you want it for?
* See what the designer say about the font
  * Subscribe to newsletters like [Creative Characters](http://www.myfonts.com/newsletters/cc/) where type designers discuss their work and their inspiration
* See what other people are saying about the font
  * [Typographica](http://typographica.org/category/typeface-reviews/) reviews fonts and type face related books
  * [Typedia](http://typedia.com/)
* See how it's being used in the wild
  * [Fonts in Use](http://fontsinuse.com/) is a good resource to see how fonts are used in real life situations

Based on the answers and the questions above we can now go ahead and select the anchor font for your document. In my experience this has always been the main body font as it is the one that will appear the most often in your content.

You may have chose to use a single font for your entire project. Most likely you will find one or more additional fonts that will supplement and complement your original font.

The main question to ask about related fonts in how they relate to your primary anchor font. Creating specimens for each font by itself (see the section [specimens](#specimens) below for more information about specimens) and creating a sample of your content using the proposed font combinations may give you the answer regarding the usefulness of your font.

## Best Practices for Developing Font Stacks

Taken from [http://sixrevisions.com/css/css-typography-01/](http://sixrevisions.com/css/css-typography-01/) and expanded with examples and additional information.

All fonts in the same font stack should look similar to each other. Some fonts are wider or taller per letter than others are, giving them larger aspect ratios and the appearance of being different in size.

So, if we put Verdana (mostly Windows) with Helvetica (mostly Macs), we’ve met the above requirements. However, since Verdana is much wider than Helvetica and both fonts are available for both Windows and Macintosh computers, the text will look dramatically different on most Macs compared to most Windows computers. See below for a comparison:

<iframe height="401.36883544921875" style="width: 100%;" scrolling="no" title="Font comparison between Verdana and Helvetica" src="https://codepen.io/caraya/embed/nYgymK?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/nYgymK">
  Font comparison between Verdana and Helvetica</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

So when developing font stacks:

* Make sure you account for the different operating systems
  * The same font looks slightly different in Windows, Mac, and Linux
* Be consistent in the type of fonts you use throughout your document
  * Make sure that bold, italics and bold/italic fonts are available for all your selected fonts
* Make sure the fonts in the stack have similar aspect ratios, both your external fonts (downloaded using @font-face rules) and fonts local to your system
* Use appropriate generic fonts for the primary fonts you use

Here is a list of the most common fonts for various aspect ratio types:

* **Wide sans serif**: Verdana, Geneva
* **Narrow sans serif**: Tahoma, Arial, Helvetica
* **Wide serif**: Georgia, Utopia
* **Narrow serif**: Times, Times New Roman
* **Monospace**: Courier, Courier New, Lucida Console

### Generic Font Families

Generic Font Families are a last-resource fallback intended to work when no other font in the chosen stack is available.

According to the [Mozilla Documentation Project's Font Family page](https://developer.mozilla.org/en-US/docs/Web/CSS/font-family):

> Generic font families are a fallback mechanism, a means of preserving some of the style sheet author's intent in case when none of the specified fonts are available. Generic family names are keywords and must not be quoted. A generic font family should be the a last alternative in the list of font family names.
>
> **serif** Glyphs have finishing strokes, flared or tapering ends, or have actual serifed endings. E.g. Palatino, "Palatino Linotype", Palladio, "URW Palladio", serif
>
> **sans-serif** Glyphs have stroke endings that are plain. E.g. 'Trebuchet MS', 'Liberation Sans', 'Nimbus Sans L', sans-serif
>
> **monospace** All glyphs have the same fixed width. E.g. "DejaVu Sans Mono", Menlo, Consolas, "Liberation Mono", Monaco, "Lucida Console", monospace
>
> **cursive** Glyphs in cursive fonts generally have either joining strokes or other cursive characteristics beyond those of italic typefaces. The glyphs are partially or completely connected, and the result looks more like handwritten pen or brush writing than printed letterwork.
>
> **fantasy** Fantasy fonts are primarily decorative fonts that contain playful representations of characters.

### Getting started: Building the Rythm

Now that we have our scale, Let's start with the next obvious question. What impacts a page's vertical rhythm?

* Font size
* Line Height
* Margins
* Paddings

In order to achieve a good rhythm we have to calculate these three factors and apply them in our CSS. Here is an example of text without a good rhythm.

For the first image below, we have only set up a default font size:

![Text without vertical rhythm](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/no-rhythm)

As you can see, the rhythm is off. After the first line the baseline does not remain constant. The further down you go in the paragraph the harder it gets and, consciously or not, reading the text gets harder.

Before we can start working on the rhythm we need to pick a time signature, or base font-size to calculate our rhythm from. For this essay, and for most of my work, I've selected 16px to make things easier to do the math. A line height of 1.25 x the base font size is a great place to start, based on the font face and size.

The starting CSS will have set the body font-size: 16px and line-height: 1.25 (without a unit). We'll build from there.

The CSS looks like below:

<iframe height="300" style="width: 100%;" scrolling="no" title="Base CSS for typography examples" src="https://codepen.io/caraya/embed/DWmQVj?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/DWmQVj">
  Base CSS for typography examples</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The text now looks like this:

![Text in vertical rhythm](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/in-rhythm)

### Rhythm on a page

Based on thoughts and ideas from [Vertical Rhythm In Typography](https://web.archive.org/web/20220526165023/https://8thlight.com/blog/chris-peak/2012/12/30/vertical-rhythm.html), [R(a|ela)tional Design](https://web.archive.org/web/20220302224744/https://8thlight.com/blog/billy-whited/2011/10/28/r-a-ela-tional-design.html) and [Responsive Typography](https://web.archive.org/web/20180427105746/http://nicewebtype.com/notes/responsive-typography/)

Vertical Rhythm is simply when a body of text is aligned to evenly spaced horizontal lines (think of your lined paper from grade school), making it more cohesive and easier to read.

Compare the following two sections:

<p data-height="425" data-theme-id="2039" data-slug-hash="kejfJ" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/kejfJ">Example of text without explicit line height</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

<p data-height="428" data-theme-id="2039" data-slug-hash="kejfJ" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/kejfJ">Example of text without explicit line height</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

Which ones is easier to read and "flows" better?

We will look at what makes text flow with good rhythm, explore the typographical elements that make the flow and rhythm happen and, in the next part, we will build the SCSS, CSS and HTML elements that we need to flow our text successfully.

### Rhythm and modular scales

**What’s a Modular Scale?**

Robert Bringhurst defines this approach to typography is all about:

> A modular scale, like a musical scale, is a prearranged set of harmonious proportions.
>
> Robert Bringhurst - The Elements of Typographic Style

Tim Brown further clarifies:

> A modular scale is a sequence of numbers that relate to one another in a meaningful way. Using the golden ratio, for example, we can produce values for a modular scale by multiplying by 1.618 to arrive at the next highest number, or dividing by 1.618 to arrive at the next number down.
>
> Tim Brown - More Modern Typography

It's fairly easy but until I started looking more systematically at what typography it wasn't something that even crossed my mind. Yet it is one of the keys to making typography work online and use type as the basis of our online decisions.

### Why use a Modular Scale

As Tim Brown suggests:

> Recognizing type as the atomic element in web design affords us the opportunity to make better design decisions that resonate upward and outward into the experience. But it also challenges us to eschew conventions like the use of prefabricated frameworks and reusable templates, and to accept a new balance in our schedules—that we put forth greater investment and effort for the sake of more meaningful typography.
>
> [Tim Brown - More Meaningful Typography](http://alistapart.com/article/more-meaningful-typography)

### The modular scale: What I like working with

Before we get started with defining what our rhythm will look like let's define the scale that we'll use to create the rhythm. Unless I have a major design reason I always prefer to use 16 pixels as my default font size. It works as it is the default font sizes for most UAs

I picked 24 as my second value to apply to my modular scale generator and the Golden Ratio (1: 1.618) to build my scale. From what I've learned the second value is not as important but a secondary reference.

There is a a lot of information about the Golden Ratio as it applies to typography. For general information look at: [http://en.wikipedia.org/wiki/Golden\_ratio](http://en.wikipedia.org/wiki/Golden_ratio)

I built my 16/24 golden ratio scale using Tim Brown's [Modular Scale Generator](http://modularscale.com/). Clicking the link below will take you to the generated scale, which you can use on your own projects or modify as needed:

[http://modularscale.com/scale/?px1=16&px2=24&ra1=1.618&ra2=0](http://modularscale.com/scale/?px1=16&px2=24&ra1=1.618&ra2=0)

The advantage of using a scale like the one is that the values are already precalculated for you and most of the values are similar across the columns. This makes our calculations easier

## Getting started: Test your theories on a practice page

We have talked a lot about theory; now let's start putting the theory into practice. We'll start with creating web specimens that just test the font, we'll then create additional specimens based on our content and see if the font still holds. We'll then test our specimens and content on multiple devices (you'll be surprised at how different the same font looks in different browsers and operating systems and even in different browsers running on your same computer)

### Specimens

The web font specimen, discussed in this [A List Apart article](http://www.alistapart.com/articles/real-web-type-in-real-web-context/) and available from [http://webfontspecimen.com/](http://webfontspecimen.com/) allows you to create a professional font specimen of a font of your choice.

As your work with typefaces continues to grow, you'll find that you have a large list of specimens available. Don't delete them; put them somewhere on your testing web server (whether it's hosted online or living in your laptop) as a reference material for future projects.

Please do not reinvent the wheel.

The [Frontfriend](http://somadesign.ca/projects/fontfriend/) bookmarklet let you play with fonts without having to customize the page for every single font that you want to test. Using the web font speciment we discussed above we can test fonts without having a page using the actual fonts. We can test with Google web fonts and with our own local fonts.

### Samples of your content using the proposed fonts

Take the fonts you've chosen and build a portion of your website using them. This will give you one final opportunity to check the fonts in the layout and flow you've developed so far... if it doesn't work then this is a good point to look at alternatives.

![Example of a font specimen page](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/font-specimen-example-1024x530)

### Test on multiple devices

Now that we have specimens and our content built with the fonts we've chosen, we test... we test... and we test again and we test in as many devices as we can get our hands on to, either virtual (using tools such as [Type Rendering](http://typerendering.com/) or in actual devices.

In the article [Test on real mobile devices without breaking the bank](http://bradfrostweb.com/blog/mobile/test-on-real-mobile-devices-without-breaking-the-bank/) Brad Frost discusses what should be the minimal setup that we need to test in mobile devices in addition to the standard set of browser/operating system combinations for desktop browsers.

It sounds like a lot but it's a good view of what devices we need to test in but will also depend on your target devices and technologies. Even within the same family of devices, Android for example, look very different depending on the version so we need to test in appropriate devices and versions of the browsers we've selected.

## Next Steps

Now that we have decided on our fonts, our scale and complementary fonts, if any, we are ready to move into CSS action. We'll look at building our font stacks, and the different elements of building our typography for the web.

Feedback is always appreciated and encouraged. If you have any suggestions, please leave a comment below or via twitter ([@elrond25](http://twiter.com/elrond25))
