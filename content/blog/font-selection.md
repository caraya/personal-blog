---
title: "Font Selection"
date: "2015-07-06"
categories: 
  - "typography"
---

All type shares characteristics. We'll look at some of them before we dive into selecting font stacks and other type related element. As we move along we'll discover that these elements are all interrelated and that changing one of these elements will force changes in others too.

![Visual representation of type related terms](//publishing-project.rivendellweb.net/wp-content/uploads/2015/06/font-terms.png)

Visual representation of type related terms

#### X-height

When you look at your text what is the size of the lowercase glyphs/letters to uppercase? In different fonts the height of lowercase glyphs (measured by the x-height) can be different, some of them being barely half the uppercase height and in others being as tall as two-thirds of the uppercase height.

When looking at type, particularly when you're testing your content in your chosen typeface and size, make sure that the size is not too small to read. When the height of the lowercase gets too small for the size you chose it gets too hard to read.

#### Glyph Apertures

Aperture refers to the spacing between open points in letters like 'c', 'e' or 'a'. If these apertures are too close the letter can be confused with a lowercase 'o' and make the reader's experience harder than it needs to be

#### Even Spacing

Make sure that the space between the glyphs and the width of the glyphs in the font you choose are constant and not too far or to close to each other. This constant spacing will make your text easier to read or scan online

#### Clear Terminals

Terminals are the flourishes at the end of the letters a, c, f, j, r, and y. They can be classified according to the shape: ball (circular), beak (spur), and teardrop (globular).

In long-form text, letters with clear terminals (distinguishable shapes of ball, beak, or teardrop) are easier to spot; therefore, they are more readable than letters with lacking terminals.

#### Distinguishable Ascenders & Descenders

Ascenders (the lines above the main body of a glyph) and descender (the line below) help make characters easier to read. When you're choosing typefaces, contrast sans-serif versus serif type to see the difference in how the ascenders and descenders look. For a bad example look at Helvetica.

#### Styles & Weights

When we see bold and italics on the web, we usually see the browser's interpretation of bold and italics not the actual italic and bold versions of the chosen typeface.

To make sure that this doesn't happen to you, make sure that the typefaces you work with have at least 4 versions:

- Regular
- Bold
- Italic
- Bold Italic

If one of the style fonts are not available then you're at the browsers' mercy regarding how bold and italics will render for your page.

#### Contrast

In this context, contrast refers to the differences between thick and thin strokes of the font. When working with body copy the thin strokes may disappear or the think strokes may overwhelm the rest of the text.

To make sure none of these situations happen pick a font with low or no contrast.

#### Context

Until now we've looked at the technical aspects of type where we will use the typeface is also important. Context has more to do with how the type feels. If you're developing responsive sites, does the type feel too tight or constrained in larger screens? Does it feel too loose in smaller displays? The goal is to find typeface that works consistently across your target devices.

### Font stacks

Unless you're using one of the universal fonts, those available everywhere, you will most likely have to plan for what happens if your browser cannot load the font because your internet connection just died or you got caught using a font that you were not licensed to use. That's where you use the font stack.

```css
html {
  font-family: 'Museo Sans', Verdana, sans-serif;
}
```

The browser will use Museo Sans, if is available in a format that the browser can read, if it isn't then the browser will use Verdana and... in the unlikely event that verdana is not available the browser will use the system's default sans serif font.

Why is this important, you may be asking. Because not all fonts are the same. Even fonts that look very similar may be different enough to cause problems with your layout. Let's look at the same Lorem Ipsum text in two different fonts.

The first example will use Stone Humanist, the font I chose for the body text in this document.

<p class="codepen" data-height="505" data-theme-id="2039" data-slug-hash="doRvwx" data-default-tab="result" data-user="caraya">See the Pen <a href="http://codepen.io/caraya/pen/doRvwx/">Example using Stone Humanist</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script src="//assets.codepen.io/assets/embed/ei.js" async></script>

The second example uses [Verdana](https://www.wikiwand.com/en/Verdana), a font created for and released by Microsoft in 1996.

See the Pen [Font Example Using Verdana](http://codepen.io/caraya/pen/GJEWaZ/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).

<script src="//assets.codepen.io/assets/embed/ei.js" async></script>

Notice, in particular, how Verdana's characters are wider and therefore make the line have less content when compared with Stone Humanist. As a further experiment change the front in Example 2-2 from Verdana to Arial and see the difference.

### "Web Safe" Fonts

Ever since browsers started using fonts they've been able to use fonts available on the user's system. These are the "web safe" fonts.

[CSS Font Stack](http://www.cssfontstack.com/) presents a list of some of the most common desktop fonts that are installed in Macintosh and Windows operating systems. As you can see there are a few fonts that are really safe to use across platforms.

This is yet another consideration when building our font stack. If we build backups other than generic fonts we need to be careful to pick fonts that are wide used or pick 2 or more options to cover both Windows and Macintosh cases.

### Generic font families

Most of the time we have a certain font selected for our project and most of the time they will work ok. But what happens when they don't?

As we saw in the earlier examples the typeface you choose will affect number of words you can fit in a line of text and the way the font writes on screen may look different with the same line height

CSS defines a number of generic font families for use with your content. These families are (with definitions taken from the [CSS 2.1](http://www.w3.org/TR/CSS21/) specification):

**serif**

Glyphs of serif fonts, as the term is used in CSS, tend to have finishing strokes, flared or tapering ends, or have actual serifed (including slab serifs). Serif fonts are typically proportionately-spaced. They often display a greater variation between thick and thin strokes than fonts from the 'sans-serif' generic font family. CSS uses the term 'serif' to apply to a font for any script, although other names may be more familiar for particular scripts, such as Mincho (Japanese), Sung or Song (Chinese), Totum or Kodig (Korean). Any font that is so described may be used to represent the generic 'serif' family.

**sans-serif**

Glyphs in sans-serif fonts, as the term is used in CSS, tend to have stroke endings that are plain -- with little or no flaring, cross stroke, or other ornamentation. Sans-serif fonts are typically proportionately-spaced. They often have little variation between thick and thin strokes, compared to fonts from the 'serif' family. CSS uses the term 'sans-serif' to apply to a font for any script, although other names may be more familiar for particular scripts, such as Gothic (Japanese), Kai (Chinese), or Pathang (Korean). Any font that is so described may be used to represent the generic 'sans-serif' family.

**cursive**

Glyphs in cursive fonts, as the term is used in CSS, generally have either joining strokes or other cursive characteristics beyond those of italic typefaces. The glyphs are partially or completely connected, and the result looks more like handwritten pen or brush writing than printed letterwork. Fonts for some scripts, such as Arabic, are almost always cursive. CSS uses the term 'cursive' to apply to a font for any script, although other names such as Chancery, Brush, Swing and Script are also used in font names.

**fantasy**

Fantasy fonts, as used in CSS, are primarily decorative while still containing representations of characters (as opposed to Pi or Picture fonts, which do not represent characters).

**monospace**

The sole criterion of a monospace font is that all glyphs have the same fixed width. (This can make some scripts, such as Arabic, look most peculiar.) The effect is similar to a manual typewriter, and is often used to set samples of computer code.

Using a generic family as the last item in your font stack is essential. The system is guaranteed to be available and you can style your content with this in mind. It also makes your CSS less susceptible to slow connections or network failures.

### Additional Considerations

There are a couple more elements to consider when selecting a font. They may not seem as important but when put together with everything else we'll discuss in this page, it's a lot more important than we give it credit for.

#### Font size

Even when working with Desktop Operating Systems alone a font may look very different. It doesn't necessarily have anything to do with the design and all with how the operating system renders fonts and it may not even happen but this is something to consider when testing.

Smaller sizes may cause font details to disappear as the font grows smaller. This may affect the typeface you use for your body text, particularly in smaller devices.

Fonts have become more interesting when particularly since Apple released 'Retina' iPhones and iPads and Android phones have been released with even higher pixel density. While the higher density allows you to use more typefaces, your design must still consider browsers with lower pixel density in your design.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2015/06/font-in-chrome-mac.png)

This page displayed during development in Chrome for OSX

![](//publishing-project.rivendellweb.net/wp-content/uploads/2015/06/font-in-spartan-win-vm.png)

Content displayed in Microsoft Edge running in a Windows 10 virtual machine

#### Line height

In CSS line-height control the vertical space between lines. It can help readability and make it easier for people with disabilities to engage with your content.

```css
p {
  font: 1em/1.5 arial, helvetica, sans-serif;
}
```

Which is equivalent to this, much more verbose, syntax:

```css
p {
  font-family: arial, helvetica, sans-serif;
  font-size: 1em;
  line-height: 1.5;
}
```

I personally prefer the second syntax. It's explicit in telling you what each attribute controls and it saves you from having to remember what does each part of the expression means. That said you're more than welcome to use either syntax.

So why do we care about line height. In the example below change the line height attribute, play with values from 1 to 2 or even 3 and see the difference. Which one is more comfortable to read?

<p class="codepen" data-height="564" data-theme-id="2039" data-slug-hash="PqjprG" data-default-tab="result" data-user="caraya">See the Pen <a href="http://codepen.io/caraya/pen/PqjprG/">Line Height Example</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script src="//assets.codepen.io/assets/embed/ei.js" async></script>

### Line width

 

> Anything from 45 to 75 characters is widely regarded as a satisfactory length of line for a single-column page set in a serifed text face in a text size. The 66-character line (counting both letters and spaces) is widely regarded as ideal. For multiple-column work, a better average is 40 to 50 characters. Robert Bringhurst’s The Elements of Typographic Style, (p.26)

Until I started working with web type I had never considered line length as an element when building content. But it makes sense, the longer a line of text is the more we need to be mindful when working with it. In the example below, the text at the same width looks significantly different when we adjust the line height.

See the Pen [Line Length Example](http://codepen.io/caraya/pen/xGrqoB/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).

<script src="//assets.codepen.io/assets/embed/ei.js" async></script>

### So what should the stack look like?

So, after all these conversations about different types of typefaces, fonts, availability and when to use and not to use them, what should a good font stack look like?

As with many thing in the web it depends. If you were given fonts as part of your design brief then you should follup up with the designer regarding fall back fonts.

If this is your design then I'd suggest sites like [Fonts in use](http://fontsinuse.com/) or [Typewolf](http://www.typewolf.com/) to see how other people are using fonts. Another way is to identify a font you like (like I did with the body font for this page), research whether it's available as a web font and how much would it cost to license.

Once you know what font you want to use, there are services like [Typecast](http://typecast.com/) to see what the font will look like in an actuall web page... you can even add chunks of your own content to get a more acurate picture of what the typeface will look like with _your_ content.

My default font stack for this project looks like this:

```css
html {
  font-family: 'Stone-Humanist', arial, sans-serif;
}
        
```

I use a different stack for headings and this will be discussed when we talk about headings in more detail.
