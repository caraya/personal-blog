---
title: "Font stacks and other explorations on typography on the web, Part 1"
date: "2018-03-12"
---

I have dealt with some of these topics before in different places but now want to weave a more coherent narrative around these topics and try to find a way how to tie them together so it makes sense.

## What is a font-stack and why it matters

It wasn't until I started reading blogs and books by [Jason Pamental](http://rwt.io/), [Bram Stein](https://www.bramstein.com/*), and [Tim Brown](http://tbrown.org/) among others that I realized that web typography is a lot more than choosing the right fonts.

The font stack is the set of fonts that we use for our site or application. The browser's rendering engine will pick the first font on the stack that is installed and available.

To install the font we use CSS's `@font-face` declaration like this:

```css
@font-face {
  font-family: 'Ubuntu'; /* regular */
  src: url('Ubuntu-R-webfont.woff2') format('woff2'), url('Ubuntu-R-webfont.woff')
      format('woff'), url('Ubuntu-R-webfont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Ubuntu'; /* italic */
  src: url('Ubuntu-RI-webfont.woff2') format('woff2'), url('Ubuntu-RI-webfont.woff')
      format('woff'), url('Ubuntu-RI-webfont.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
}
@font-face {
  font-family: 'Ubuntu'; /* bold */
  src: url('Ubuntu-B-webfont.woff2') format('woff2'), url('Ubuntu-B-webfont.woff')
      format('woff'), url('Ubuntu-B-webfont.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}
@font-face {
  font-family: 'Ubuntu'; /* bold italic */
  src: url('Ubuntu-BI-webfont.woff2') format('woff2'), url('Ubuntu-BI-webfont.woff')
      format('woff'), url('Ubuntu-BI-webfont.ttf') format('truetype');
  font-weight: bold;
  font-style: italic;
}
```

To prevent faux bold and italics we load four fonts, one each for normal, italics, bold and bolditalics.

But in this `@font-face` demo we can already see one of the performance pitfalls of using web fonts: The size of the files.

Each of these font files can range from just a few tens of kilobytes to 400 kilobytes or more for a single weight of the font and 1.2 **mega bytes** for the four weights that we're using.

So try to find smaller sizes or subset the fonts.

Subsetting fonts will make the files smaller by only adding the glyphs (character, punctuations and others) that are needed to render the page. You must be careful when doing this as any glyph missing will be rendered in a backup font, either one you designate or one of the defaults for serif, sanserif and monospace.

I've discussed subsetting fonts in two posts: [subsetting fonts](https://publishing-project.rivendellweb.net/subsetting-fonts/) and [more on font subsetting](https://publishing-project.rivendellweb.net/more-on-font-subsetting/).

This is what a font stack looks like:;

```css
/* Times New Roman-based stack */
font-family: Cambria, 'Hoefler Text', Utopia,
  'Liberation Serif' 'Nimbus Roman No9 L Regular', Times, 'Times New Roman', serif;

/* Modern Georgia-based serif stack */
font-family: Constantia, 'Lucida Bright', Lucidabright, 'Lucida Serif', Lucida,
  'DejaVu Serif', 'Bitstream Vera Serif', 'Liberation Serif', Georgia, serif;

/* Traditional Garamond-based serif stack */
font-family: 'Palatino Linotype', Palatino, Palladio, 'URW Palladio L',
  'Book Antiqua', Baskerville, 'Bookman Old Style', 'Bitstream Charter',
  'Nimbus Roman No9 L', Garamond, 'Apple Garamond', 'ITC Garamond Narrow',
  'New Century Schoolbook', 'Century Schoolbook', 'Century Schoolbook L',
  Georgia, serif;

/* Helvetica/Arial-based sans serif stack */
font-family: Frutiger, 'Frutiger Linotype', Univers, Calibri, 'Gill Sans',
  'Gill Sans MT', 'Myriad Pro', Myriad, 'DejaVu Sans Condensed',
  'Liberation Sans', 'Nimbus Sans L', Tahoma, Geneva, 'Helvetica Neue',
  Helvetica, Arial, sans-serif;

/* Verdana-based sans serif stack */
font-family: Corbel, 'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans',
  'DejaVu Sans', 'Bitstream Vera Sans', 'Liberation Sans', Verdana,
  'Verdana Ref', sans-serif;

/* Monospace stack */
font-family: Consolas, 'Andale Mono WT', 'Andale Mono', 'Lucida Console',
  'Lucida Sans Typewriter', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono',
  'Liberation Mono', 'Nimbus Mono L', Monaco, 'Courier New', Courier, monospace;
```

These are fairly complex stacks and the closer you move to the right the more likley you are to find an equivalent until you get to the final font of the stack, one of five generic fonts: [serif](https://drafts.csswg.org/css-fonts-3/#serif), [sans-serif](https://drafts.csswg.org/css-fonts-3/#sans-serif), [cursive](https://drafts.csswg.org/css-fonts-3/#cursive), [fantasy](https://drafts.csswg.org/css-fonts-3/#fantasy), and [monospace](https://drafts.csswg.org/css-fonts-3/#monospace). The generic fonts are different than the other fonts in the stack, rather than trying match a specific font, they ask the browser to provide a default fallback.

According to the [CSS Fonts Level 3 Specification](https://drafts.csswg.org/css-fonts-3/#generic-font-families) generic fonts section:

> All five generic font families must always result in at least one matched font face, for all CSS implementations. However, the generics may be composite faces (with different typefaces based on such things as the Unicode range of the character, the language of the containing element, user preferences and system settings, among others). They are also not guaranteed to always be different from each other. User agents should provide reasonable default choices for the generic font families, which express the characteristics of each family as well as possible, within the limits allowed by the underlying technology. User agents are encouraged to allow users to select alternative choices for the generic fonts.

### Making sure your fallback fonts work well

One problem with fallback fonts is that they may not match the web font they replace 100%... and this will definitely become a problem when working on how will the layout look in your fallback font and whether it'll work at all or not.

Monica Dinculescu created a [Font Style Matcher](https://meowni.ca/font-style-matcher/) to work around this issue. We match the fonts as close as possible as show in the figure below and then copy the two CSS blocks.

![Font Matcher Demo of Work In Progress](/images/2018/03/font-matcher-935x1024.png)

Font Matcher Demo of Work In Progress

What we get when we copy the CSS is one block for the fallback font (Georgia) and one for the web font (Merriweather). Since CSS will apply both sequences in order it'll jump from Georgia to Merriweather but, since we took care that the fonts would match, the jarring change will be minimized.

```css
font-family: Georgia
font-size: 16px
line-height: 1.6;

font-family: Merriweather
font-size: 16px
line-height: 1.6;
```

## System Fonts: Use what's given to you

OK, we have our font stack, we understand what it is and we can customize it, after a fashion, to reduce any jarring text change between fallback fonts and the web fonts we've downloaded.

Another way provide a better experience is to use system fonts; the same fonts that the Operating System uses on your machine. We use the following CSS to load system specific fonts across platforms, knowing that the CSS parser will stop when it hits the first match.

Also note that we use the long form, with different attributes for each of `font-family`, `font-size` and `line-height` to work around a bug that may cause the `-apple-system` font (used in Safari) to be considered a named prefixed and cause the rest of the declaration (fonts for all other systems) to be ignored.

```css
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
    'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
    'Helvetica Neue', sans-serif;
  font-size: 16px;
  line-height: 1.2;
}
```

[CSS fonts module Level 4](https://drafts.csswg.org/css-fonts-4/) introduces a new generic font family. The [system-ui](https://drafts.csswg.org/css-fonts-4/#system-ui-def) generic font family will always map to the default user-interface font on all platforms.

There is no browser support for system-ui yet, when it arrives on browsers, you’ll be able to reduce the above font stack to a single item:

```css
html {
  font-family: system-ui;
}
```

**This is cool but what's the use case for system fonts?**

System fonts are best used for the UI of your application. This will give users a familiar feell by using the same fonts throughout the Operating System.

## Variable Fonts: New Swiss Army Knife?

Opentype 1.8 introduced the concept of variable fonts. In these variable fonts we get multiple axes representing six predefined axes: weight, width, optical size, italic, slant; plus an unlimited numbers of custom axes to define your own properties in the font. This is all packaged together in one file rather than have multiple files to represent the different font faces we use.

If you have variable fonts avaialble you can use [Axis Praxis](https://www.axis-praxis.org) a preview and experimentation tool. You can work with any of the available fonts or upload your own variable font to play with, all available axes will appear in the tool to play with.

<iframe src="https://player.vimeo.com/video/189350146" width="640" height="400" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

One thing to notice about Variable Fonts is that there are only six pre-defined axes (duiscussed above) and no limit to the number of custom axes a font can have. This means that we can have a single font that works for body copy, heaadings, and text-decorations if needed.

For examples of what you can do with variable fonts check out [Variable Fonts Demo and Explainer](https://caraya.github.io/vfonts-demo/) for work with early versions of variable fonts.

Another idea worth exploring is whether we can use a single variable font for our site. This will depend on what Axes the variable font makes available and how complex is the typography for your site. It should be possible but requires careful planning and font selection.

## Choosing Fonts

Choosing your font stack is a tricky balancing act of many conflicting and, sometimes, contradictory priorities. We'll look at what I consider the most important design and non-design considerations.

### Design Considerations

These are some of the design consideratons that go into my font selection process.

If you think I missed anything, ping me on twitter ([@elrond25](https://twitter.com/elrond25))

#### Font Selection

Display faces are designed to be used large, such as in headlines and are usually less readable at smaller sizes and should not be used for body copy. These are called display fonts or faces.

Other typefaces are designed specifically to be used in large areas of smaller body copy. These are called text, body, or copy fonts.

Identifying fonts for your specific needs is the first step but then comes the big question: **Serif or Sans-Serif?**

![Sans Serif Font](/images/2018/02/418px-Serif_and_sans-serif_03.svg_.png) ![Serif font with serif lines show in red](/images/2018/02/418px-Serif_and_sans-serif_02.svg_.png)

Comparison of sans-serif font (left) and serif font showing serif lines in red (right)

I normally work with whatever font I think will work best for the project I'm working on either on its own if I'm using it for both headings and copy or paired with another font.

So which is more legible: serif or sans-serif typefaces? In print it appears that serif fonts are considered more legible. Serif fonts allow the eye to flow more easily over the text, improving reading speed and decreasing eye fatigue.

For the web the situation is somewhat different. We will never set as much text on the web as we would in a book or magazine and there are sans-serif fonts that work just as well as serif for the amount of text that we use on the web.

This is one subject that is debated whenever typography people talk about fonts – some people argue that serif typefaces make text harder to read in smaller screens. Others believe that there’s no difference. My position is to test the fonts and then have people read it.

#### Font Sizes

We need to make sure that the text is not too small or too large for the device users are viewing the content on. The default size in browsers is 16px. I like using that as my base and then working with Modular Scales.

> A modular scale, like a musical scale, is a prearranged set of harmonious proportions. Robert Bringhurst

I use Tim Brown and Scott Kellum's [modular scale builder](http://www.modularscale.com/) where we can play with a base value (for example 16px, the default for most browsers) and a set of predefined ratios (I normally use the golden ratio, 1.618) to create a series of values that are ratios of the base number.

For the values of 16px and 1:1.618 ratios the scale looks like this:

2206.258em
1363.571em
842.751em
520.86em
321.916em
198.959em
122.966em
75.999em
46.971em
29.03em
17.942em
11.089em
6.854em
4.236em
2.618em
1.618em
1em
0.618em
0.382em
0.236em
0.146em
0.09em
0.056em

So you can take these values and plug them (up or down) to your CSS. If the Golden Ratio doesn't work you can experiment with different ratios available on the tool; they will each produce different values you can plug in to your stylesheets.

This is how I like to define the basic font size for the document. I rely on the fact that most browsers have a default font size of 16px; so I set the default value to 16px and then use `em` or `rem` units in other selectors to make sure that the sizing is relative to the parent element (when using em) and to the root element (with rem).

I've also chosen not to support IE6 and 7. If you do need to support those or older browsers, then Richard Rutter's [How to Size Text in CSS](http://alistapart.com/article/howtosizetextincss) provides additional guidance for your work.

```css
body {
  font-size: 16px;
  line-height: 1.2em;
}
.bodytext p {
  font-size: 1em;
}
.sidenote {
  font-size: 0.75em;
}
```

#### Measure

Sometimes we allow the lines of text to become to wide; that makes them harder to read as the eye looses sight of where the line ends and when should the user return to the left edge of the screen. The horizontal distance is referred to as [measure](https://www.wikiwand.com/en/Line_length) (also called line length).

So what should the maximum width a text block be? Well, it all depends on the size of the font. The larger the font size, the longer the line can be; that said you don't want to go beyond 80 characters or 40ems (since block width is easier to measure than counting characters). We can ensure the text grows no wider than our specified width using the `max-width` css attribute. It looks like this:

```css
body {
  max-width: 40em;
}
```

#### Leading

Leading (pronounced “ledding”) is so called because, in mechanical presses, strips of lead are placed between lines of type to space the lines apart. CSS handles leading through the `line-height` property.

Line-height is unique among CSS properties in that it doesn't require a unit attached to its value, like in the example below the line-height is 1.25 times the value of the font size (18px in this case):

```css
p {
  font-family: 'Minion Pro', 'Minion Web', serif;
  font-size: 16px;
  line-height: 1.25;
}
```

I prefer to use the long hand syntax for my CSS and explictly write all attributes separately. You could write the declaration above as:

```css
p {
  font: 16px/1.25 'Minion Pro', 'Minion Web', serif;
}
```

**Spacing/Line Height**

One of the most common typographic “mistakes” I see on the web today is improper type spacing. What I’m referring to here is instances where a block text isn’t given enough margin, subheads and correlated body text which aren’t visually grouped together, and so on. Proper spacing (combined with hierarchy) allows the reader to scan the text and access it at the desired points.

It seems to me that the relationship of paragraph spacing (additional spacing placed before or after a paragraph), the space around a block of type, and letter spacing can be related proportionally to the line height of a paragraph. Line height is defined as the vertical distance between lines of text. So for instance, if the line height of one paragraph is set to 2em and a paragraph with the same size text is set to 1.5em, the first paragraph will require more paragraph spacing and probably more margin around it.

Much of this is done by eye rather than an exact formula, but I do use a good rule of thumb when it comes to the relationship of paragraph spacing to line height. When working with web content we need to make sure that we do equal spacing on both the top and the bottom margins, otherwise the first and last paragraphs will look weird and your content will not flush to the top, as you probably intended.

```css
p {
  line-height: 1.5;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}
```

We can modify the styles for the first and last paragraphs to remove the top or bottom margin as needed using `:first-child` and `last-child` [pseudo-classes](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Pseudo-classes_and_pseudo-elements). The code look lie this.

```css
p:first-child {
  margin-top: 0;
}

p:last-child {
  margin-bottom: 0;
}
```

The final part of spacing that I consider is paragraph indentation. I don't intend the first paragraph, either I'm using a [drop cap](http://www.magazinedesigning.com/drop-caps-and-initial-letters/) or want to follow convention and not indent.

The code uses and [adjacent sibling selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_selectors) to indent paragraphs that are next to each other. This will fail for the first and last paragraphs since there is no paragraph before/after it.

```css
p {
  font-size: 1em;
}

p + p {
  text-indent: 2em;
}
```

#### Contrast

It may sound obvious that good type contrast is essential for readability but we always try to push the boundaries of contrast.

We forget that even sighted users may have problems with our "clever" light gray text on white background design assuming that what's good for us is good for everyone or that everyone will understand the message.

The [Web Content Accessibility Guidelines](https://www.w3.org/TR/2008/REC-WCAG20-20081211/) have the following to say about color and contrast.

Don't use color as the only way to procide information or eliciting a response (Rule 1.4.1)

> Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. (Level A) [Rule 1.4.1](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-without-color)

Use high contrast between text and background color, with few exception indicated in the rule.

> The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following: (Level AA)
>
> - Large Text: Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;
> - Incidental: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.
> - Logotypes: Text that is part of a logo or brand name has no minimum contrast requirement.
>
> [Rule 1.4.3](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast)

When planning your site's color pallete (font, links, headers, additional text colors) you can use tools like Lea Verou's [Contrast Ratio](http://leaverou.github.io/contrast-ratio/) tool.

The other aspect is a matter of cultural awareness. In addition to avoiding using color as the only way to convey meaning we have to be mindful about conveying the right meaning. Colors have different meanings for different cultures.

The table below (From [Creating Culturally Customized Content](http://blog.globalizationpartners.com/culturally-customized-website.aspx)) shows what different colors mean in 5 different countries with vastly different cultures. It is obvious you're conveying a very different message to each of those audiences, even if they live in the same country.

| COLOR | USA | China | India | Egypt | Japan |
| --- | --- | --- | --- | --- | --- |
| Red | Danger
Love
Stop | Good fortune
Luck
Joy | Luck
Fury
Masculine | Death | Anger
Danger |
| Orange | Confident
Dependable
Corporate | Fortune
Luck
Joy | Sacred (the Color Saffron) | Virtue
Faith
Truth | Future
Youth
Energy |
| Yellow | Coward
Joy
Hope | Wealth
Earth
Royal | Celebration | Mourning | Grace
Nobility |
| Green | Spring
Money
New | Health
Prosperity
Harmony | Romance
New
Harvest | Happiness
Prosperity | Eternal life |
| Blue | Confident
Dependability
Corporate | Heavenly
Clouds | Mourning
Disgust
Chilling | Virtue
Faith
Truth | Villainy |
| Purple | Royalty
Imagination | Royalty | Unhappiness | Virtue | Wealth |
| White | Purity
Peace
Holy | Mourning | Fun
Serenity
Harmony | Joy | Purity
Holiness |
| Black | Funeral
Death
Evil | Heaven
Neutral
High Quality | Evil | Death
Evil |   |

#### Same font for all text or combined?

Does the font you're using work well for body and headings or will you have to combine it with another font that works better for headings and larger text. Not all fonts lend themselves to this dual usage so you'll have to be careful in your research to test the font or fots work as intended.

If you use specimens, particularly those that live in the web, use them to test visually if your font or fonts work well for your design.

#### Media queries are your friend

When we work with media queries we can change every detail of our content, including text layout and attributes. This way when you change the layout for smaller screens. You may also consider adjusting size, leading and other typography items to better suit the smaller size.

### Non Design Considerations

There are other considerations outside design that must be taken into account when selecting fonts... as much as I hate to admit it sometimes licensing or cost will drive me away from a font that, otherwise, would be awesome for the project.

These are some of the non-design things that come to mind.

#### Have you set your viewport correctly?

The [viewport meta tag](https://css-tricks.com/snippets/html/responsive-meta-tag/) tells the browser how to render the page. This is required for responsive sites (and I'm assuming you're working on responsive sites, right?!)

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

This will likely render the width of the page at the width of its own screen. So if that screen is 320px wide, the browser window will be 320px wide, rather than way zoomed out and showing 960px or whatever that device does by default.

Do not, I repeat, **do not** use this meta tag if your site is not responsive. The results are unpredictable but ugly. You've been warned.

#### Are you subsetting your fonts? Pros and cons.

One way to make your fonts files smaller is to subset them. When you subset a font you take out all the characters you're not using for your content. Depending on the font this may reducen the file size significantly at the risk of having to redo the work every time you add content to your site.

I will not discuss subsetting in detail. I've written about it in [Subsetting Fonts](https://publishing-project.rivendellweb.net/subsetting-fonts/) and [More on Font Subsetting](https://publishing-project.rivendellweb.net/more-on-font-subsetting/).

To load Roboto Regular with only the Basic Latin character range look like this.

```css
@font-face {
  font-family: 'Ubuntu'; /* regular */
  src: url('Ubuntu-R-webfont.woff2') format('woff2'), url('Ubuntu-R-webfont.woff')
      format('woff'), url('Ubuntu-R-webfont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  unicode-range: U+0020-007f;
}
```

One thing that you need to be mindfult of when/if you subset your fonts is to make sure that you keep all the characters you will need for your content to render with the chosen font.

In the case of English using the first 127 characters (equivalent to the ASCII encoding standard) this is usually not a problem. However, if you're working with more than one language (like English and Spanish or English and Swedish) you will have to make sure that you subset the additional characters that you will need, like opening question (¿) and exclamation mark (¡) or some of the Diacritics and accents needed (like ñ in Spanish or ö in Swedish). These additional characters are distinct Unicode codepoints and need to be included in your subset for it to work.

#### Does the font have all the weights and styles that you need?

Related to the necessary glyphs are the necessary weights for each font that you use in your page. Ideally we'd use 4 files representing regular, bold, italic and bold italic. We want to avoid the browser creating "faux" synthetic styles that will adversely impact the way your content look.

In [Say No to Faux Bold](http://alistapart.com/article/say-no-to-faux-bold) Alan Stearns shows what the impact of faux styles (bold in particular) can have in your content.

If you want more in depth information, check [How to use @font-face to avoid faux-italic and bold browser styles](https://spaceninja.com/2010/11/29/font-face-faux-styles/). It goes deeper into the technical details than Alan's article and it's geared for a more technical audience.

#### Creating speciments of the fonts you use

An interesting idea is to start building specimen libraries for the fonts you have used in projects or plan to use in projects. If you have a good specimen template wil;l definitely help you in your design process.

In [Real Web Type in Real Web Context](http://alistapart.com/article/real-web-type-in-real-web-context) Tim Brown states the neeed explicitly: "I need to know how my type renders on screens, in web browsers".

Depending on your needs you could use the W3C's [element sampler](https://www.w3.org/StyleSheets/Core/stylebot.html?family=9doc=Sampler) and style the bare content with your styles and fonts.

Another option is to use Tim Brown's \[http://webfontspecimen.com/\](Web Font Specimen) to create more advanced specimens. I've created specimens for fonts with open sources licenses at [Font Specimen Archive](https://caraya.github.io/font-specimen-archive/)

#### Have you tested how will your fallback fonts affect your design?

So far we've made the assumption that our fonts will load and everything works well out of the box. But this is not always the case and we shouldn't assume it is.

This begs the question: **_How well will the fallback fonts work with your design_**

If the fallback has a higher or lower x-height or thicker strokes than your web font, the layout will look different. This is why you must test your stack during development and make sure that your web fonts match as close as possible with the fallbacks. Monica Dinculescu's [Font Style Matcher](https://meowni.ca/font-style-matcher/) can help

#### Hosting locally or using a font service?

Are you hosting your fonts with a service like [Google Fonts](https://fonts.google.com/), [Adobe Typekit](https://fonts.google.com/) or other font hosting providers or are you hosting your fonts in your own site?

If you choose to host fonts in your own site you will have to contend with network congestions and having your server become a bottleneck for your users. Yet it may be the only way to comply with some fonts restrictive licensing terms and conditions; as we'll discuss in the next section be very careful about the licensing of your font.

These are some of the font services I've used in the past.

- [Google Fonts](https://fonts.google.com/)
- [Adobe Typekit](https://fonts.google.com/)
- [Fonts.com Web Fonts](http://webfonts.fonts.com/)
- [Typotheque](http://www.typotheque.com/webfonts)

As with anything else on the web, your milleage may vary.

#### Do you have the right license to use the font on the web?

The last, and perhaps most important, non-design aspect of selecting and using fonts on the web is the licensing. Rightly or not some foundries are very restrictive in the terms of their license and some will release their fonts under open source licenses like the [SIL OFL](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&item_id=OFL) or [Apache](https://www.apache.org/licenses/LICENSE-2.0) (seen in some early fonts from Google and other companies for whom liability may be an issue).

For most foundries, fonts are software users license rather than a product you can own. This has implications if you want to modify the fonts or want to convert them to other formats. Some foundries will go as far as block usage of Font Squirrel's [Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator) with their fonts.

These problems with Foundries lead me to prefer comissioning fonts specifically for a project. If that is not possible my next option is to choose Open Source Fonts and, only if I have no choice, I will work with foundries based on past experience or expressed instructions from the client.

This is a step we often overlook but is essential to cover yourself from liability.
