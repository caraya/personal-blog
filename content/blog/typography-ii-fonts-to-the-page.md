---
title: "Typography II: Fonts to the page"
date: "2014-01-29"
categories: 
  - "design"
  - "ebook-publishing"
  - "technology"
---

## We have typography on the web!

As John Allsopp points out in his blog [Happy 17th Birthday CSS](http://www.webdirections.org/blog/happy-17th-birthday-css/) we have come a long way but we still have very far to go.

When I first started playing with web design back in 1996 the web was just plain. It was meant as a way to exchange information, not produce the high-end, high-gloss content we see today.

Surprisingly enough we've had the ability to embed fonts for over a decade. CSS2 included the ability to embed fonts when it was first released but it wasn't highly used until CSS3 came out and fount foundries decided that there was money to be made online.

New elements in HTML5 and CSS3 (web fonts among them) allow some wonderful work to be done online without having to resort to images or overtly complicated CSS and Javascript tricks to make it look somewhat like what the designer had originally envisioned.

**Examples of good web typography**

- [http://ilovetypography.com/2007/09/19/15-excellent-examples-of-web-typography/](http://ilovetypography.com/2007/09/19/15-excellent-examples-of-web-typography/)
- [http://ilovetypography.com/2007/09/27/15-excellent-examples-of-web-typography-under-the-bonnet/](http://ilovetypography.com/2007/09/27/15-excellent-examples-of-web-typography-under-the-bonnet/)
- [http://ilovetypography.com/2008/01/02/good-web-typography/](http://ilovetypography.com/2008/01/02/good-web-typography/)

## Licensing: the big pain in the ass

Unfortunately every time we want to work with web fonts the ugly licensing monster raises its head. It's not just a matter of purchasing the font, converting it to the correct formats (see [How do we add fonts to the web?](#adding-fonts) for the actual formats and process involved) but it also involves making sure that the font license allows you to use the font with @font-face techniques (read the EULA that comes with your font to make sure).

> ### @font-face Embedding (Linking)
> 
> I didn’t include the @font-face font embedding method in the list above because it’s a different animal. @font-face doesn’t use PHP, JavaScript or Flash to embed the font. It solely relies on CSS and a compatible browser (see [@font-face and 15 Free Fonts You Can Use Today](http://blog.themeforest.net/tutorials/css-font-face-and-15-free-fonts-you-can-use-today/) for more information). Information around the web isn’t exactly clear on this but my opinion is that the @font-face method isn’t really “embedding” but instead linking because you’re simply telling the browser where the actua font file is via CSS. This means the font file is directly accessable to your visitors, making this method quite different than the ones listed above. Even if the font license permits font embedding, it may not permit embedding with @font-face because this method allows direct access to the font file. Microsoft uses the .eot font format (Embedded OpenType) as a solution to this problem. EOT is supposed to respect the flags in the font files for embedding and can be limited to specific domains. Non-IE browsers however, have not adopted this technology and don’t plan to. That means you’ll need to use a .ttf or .otf version of the font for non-IE browsers if you want true cross-browser compatibility. If you decide to use @font-face, be absolutely, positively sure that the font license allows it. It should specifically state the use of @font-face is permitted and if there are any additional restrictions (ie. give credit somewhere). From [http://blog.themeforest.net/general/font-licensing-for-the-web/](http://blog.themeforest.net/general/font-licensing-for-the-web/) **Can I use an Adobe font on the web?** Adobe’s current End-User License Agreement (EULA) for fonts does not permit font linking with @font-face using any font format, including, but not limited to, desktop (“raw”) fonts and the Web Open Font Format (WOFF). Adobe provides select Adobe Web Fonts for use on the web through the Adobe Typekit® web font service, where web font usage is governed by the Typekit service Terms of Use. A font’s usage permissions are specified in your EULA that accompanied the font when you acquired it. Refer to your EULA to determine the type of usage permitted. From: [http://www.adobe.com/products/type/font-licensing/licensing-faq.html](http://www.adobe.com/products/type/font-licensing/licensing-faq.html)

Typekit and other similar services provide an alternative licensing model. When you use Typekit-like services the fonts remain on the company's server and you link to them using special Javascript that is specific to a user's account.

> **What is Typekit?** The Adobe Typekit service provides secure, subscription-based web font hosting for web designers and developers, made possible by the @font-face rule. Typekit subscribers have access to a collection of fonts that can be used on basically any web site. You can view the Adobe Web Fonts available on the Typekit service on Adobe’s foundry page. Although Typekit relies on the @font-face rule to work, it is different from web fonts used by end users. Fonts remain protected on the Typekit servers and are dynamically delivered to browsers in the appropriate format to ensure an optimal and consistent typographic experience. Typekit offers user-friendly integration with CSS and HTML code, and other optimizations, like font subsetting. From: [http://www.adobe.com/products/type/font-licensing/licensing-faq.html](http://www.adobe.com/products/type/font-licensing/licensing-faq.html)

You can pick fonts where the license specifically allow unrestricted use of the software. For example the [Ubuntu font license](http://font.ubuntu.com/license) states that:

> This licence allows the licensed fonts to be used, studied, modified and redistributed freely. The fonts, including any derivative works, can be bundled, embedded, and redistributed provided the terms of this licence are met. The fonts and derivatives, however, cannot be released under any other licence. The requirement for fonts to remain under this licence does not require any document created using the fonts or their derivatives to be published under this licence, as long as the primary purpose of the document is not to be a vehicle for the distribution of the fonts. From [http://font.ubuntu.com/license](http://font.ubuntu.com/license)

A final alternative is a service like [Google fonts](http://www.google.com/fonts/) that provides easy access to a growing number of fonts. Like with the Typekit service, the fonts are still hosted on Google's servers and it provides you with links to use in your CSS or Javascript.

[http://nicewebtype.com/notes/2009/07/19/type-sellers-web-fonts-and-typekit/](http://nicewebtype.com/notes/2009/07/19/type-sellers-web-fonts-and-typekit/)

### Is cost an option? (my font pricing horror story)

I've loved Stone Sans Humanist ever since I first saw it used in an MIT Press book (The Second Self by Sherry Turkle, I belive). I loved the way that it flowed on the page and how it looked. I didn't know any better to know the technical aspects of the font. I only knew I really liked it.

Fast forward 12 years. I'm working on an eBook project and I decided I wanted to use my favorite font in my own project. Not only the font wasn't available for embedding at the time but the cost to license the font for embedding in an eBook was prohibitive at the time and it was very restrictive.

That is the primary reason why I've turned to free/open source fonts for most of my work. I've also subscribed to the full Typekit service to make sure that the fonts I want are available for the projects I work on even this will not solve the problem because not all fonts are available for all providers (sadly Stone Sans Humanist is not available through Typekit nor through the vendor's free font service; you).

### Where do I find fonts for embedding?

Below is a partial (and already outdated) list of fonts that are available for embedding. This small list does not include Google Fonts or Typekit (which provides a limited free service)

- [http://webfonts.info/fonts-available-font-face-embedding](http://webfonts.info/fonts-available-font-face-embedding)
- [http://webfonts.info/commercial-foundries-which-allow-font-face-embedding](http://webfonts.info/commercial-foundries-which-allow-font-face-embedding)
- [http://blog.typegirl.com/post/142912558/most-of-the-important-foundries-are-supporting-webfont](http://blog.typegirl.com/post/142912558/most-of-the-important-foundries-are-supporting-webfont)
- [Typekit full library](https://typekit.com/fonts) is a paid service on its own and it is also part of [Adobe Creative Cloud](https://creative.adobe.com)

### Where do we find good and free fonts?

The list below include fonts and font collections I've used in projects in the past

- Adobe [Source Sans Pro](https://github.com/adobe/source-sans-pro) explained in this [blog post](http://blogs.adobe.com/typblography/2012/08/source-sans-pro.html) by Adobe
- Adobe [Source Code Pro](https://github.com/adobe/source-code-pro) explained in this [blog post](http://blogs.adobe.com/typblography/2012/09/source-code-pro.html)
- [Ubuntu font](http://font.ubuntu.com)
- [Google Fonts](http://www.google.com/fonts)
- [TypeKit trial plan](https://typekit.com/fonts?collection=trial) provides a limited yet still useful set of fonts in a limited number of kits that you can use on your projects
- [exljbris](http://www.exljbris.com)
- [DejaVu](http://dejavu-fonts.org/wiki/Main_Page)
- [SIL](http://www.sil.org/resources/software_fonts) fonts are particularly useful if you're working on languages other than English

# Practice

## How do we add fonts to a web page?

One of the first things we need to realize is that there are multiple fonts for a given type. For most people making a font bold is just a matter of highlighting the text and pressing Command (or Control) + B but for graphic designers and other people who work with type (online and off) that is sacrilege. When you make a font bold you're actually assigning a bold font to the text.

- [http://nicewebtype.com/notes/2009/10/30/how-to-use-css-font-face/](http://nicewebtype.com/notes/2009/10/30/how-to-use-css-font-face/)
- [http://craigmod.com/journal/font-face/](http://craigmod.com/journal/font-face/)
- [https://coderwall.com/p/5vrdkg](https://coderwall.com/p/5vrdkg)
- [http://www.miltonbayer.com/font-face/](http://www.miltonbayer.com/font-face/)

### Font and CSS declarations

\[codepen\_embed height="689" theme\_id="2039" slug\_hash="DJsCB" default\_tab="css"\] @font-face { font-family: "Your typeface"; src: url("type/filename.eot"); src: local("☺"), url("type/filename.woff") format("woff"), url("type/filename.otf") format("opentype"), url("type/filename.svg#filename") format("svg"); }

@font-face { font-family: "Your bold typeface"; src: url("type/filename-bold.eot"); src: local("☺"), url("type/filename-bold.woff") format("woff"), url("type/filename-bold.otf") format("opentype"), url("type/filename-bold.svg#filename-bold") format("svg");

@font-face { font-family: "Your italic typeface"; src: url("type/filename-ital.eot"); src: local("☺"), url("type/filename-ital.woff") format("woff"), url("type/filename-ital.otf") format("opentype"), url("type/filename-ital.svg#filename-ital") format("svg"); }

h2 { font-family: "Your typeface", Georgia, serif; } h2 em { font-family: "Your italic typeface", Georgia, serif; } em { font-style: italic; }

See the Pen [Example font-face declaractions](http://codepen.io/caraya/pen/DJsCB) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

See Paul Irish's [@fontface gotchas/](http://www.paulirish.com/2010/font-face-gotchas/) for some early pitfalls of @fontface use

The different font formats used above are explained in the following table:

table, th, td { border: 1px solid black; }

| String | Font Format | Common extensions |
| --- | --- | --- |
| "woff" | [WOFF (Web Open Font Format)](http://www.w3.org/TR/WOFF/) | .woff |
| "truetype" | [TrueType](http://www.microsoft.com/typography/otspec/default.htm) | .ttf |
| "opentype" | [OpenType](http://www.microsoft.com/typography/otspec/default.htm) | .ttf, .otf |
| "embedded-opentype" | [Embedded OpenType](http://www.w3.org/Submission/2008/SUBM-EOT-20080305/) | .eot |
| "svg" | [SVG Font](http://www.w3.org/TR/SVG/fonts.html) | .svg, .svgz |

### Typekit

Typekit assigns each user's kit (one or more fonts packed together) a unique ID that is part of the script yuou are asked to use. The script looks something like this:

\[codepen\_embed height="257" theme\_id="2039" slug\_hash="uIypz" default\_tab="html"\] <script type="text/javascript" src="//use.typekit.net/pxl2jwi.js"></script> <script type="text/javascript">try{Typekit.load();}catch(e){}</script>

See the Pen [Typekit font import](http://codepen.io/caraya/pen/uIypz) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

The code above will only work for a single website, specified on the account where the kit was created from.

### Google Fonts

Google Fonts allow you to embed fonts in one of three ways:

**HTML Link** in the head of your document along with your style sheets and scripts.

\[codepen\_embed height="146" theme\_id="2039" slug\_hash="mdjnc" default\_tab="html"\] <link href='http://fonts.googleapis.com/css?family=Alegreya+Sans+SC:500,500italic|Exo+2:400,100,400italic' rel='stylesheet' type='text/css'>

See the Pen [Google Fonts HTML Link](http://codepen.io/caraya/pen/mdjnc) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

**CSS Import** from your CSS files.

\[codepen\_embed height="150" theme\_id="2039" slug\_hash="CKdlu" default\_tab="css"\] @import url(http://fonts.googleapis.com/css?family=Alegreya+Sans+SC:500,500italic|Exo+2:400,100,400italic);

<

p>See the Pen [Google Fonts CSS Import](http://codepen.io/caraya/pen/CKdlu) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

**Javascript** import from within your scripts.

\[codepen\_embed height="359" theme\_id="2039" slug\_hash="EtaHc" default\_tab="js"\] WebFontConfig = { google: { families: \[ 'Alegreya+Sans+SC:500,500italic:latin', 'Exo+2:400,100,400italic:latin' \] } }; (function() { var wf = document.createElement('script'); wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js'; wf.type = 'text/javascript'; wf.async = 'true'; var s = document.getElementsByTagName('script')\[0\]; s.parentNode.insertBefore(wf, s); })();

See the Pen [Javascript Google Font Loading](http://codepen.io/caraya/pen/EtaHc) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

# One font does not fit all: Formats, details and workarounds

Using the following @font-face declarations we have taken care of the defaults for each @font-face declaration by making the bold and italic fonts actualy be bold and italics and, unless the font is actually condensed or stretched, make it explicit that it's a normal font, not stretched or compressed (if we need to change this we can do it for specific elements).

Another issue to consider is that not all browsers support the same fonts (surprise, surprise). Internet Explorer supports Embedded Open Type fonts, Firefox prefers WOFF, Chrome, Safari and Opera prefer OTF (Open Type Font) or TTF (True Type Fonts) fonts and iOS prefers SVG (Scalable Vector Graphics) fonts.

I built the @font-face declarations below using [Paul Irish Bulletproof @font-face syntax](http://www.paulirish.com/2009/bulletproof-font-face-implementation-syntax/).

The original article is a little dated but it is still the best way to work with @font-face declarations on the web because it preserves the same font across all browsers and devices.

<div data-height="765" data-theme-id="2039" data-slug-hash="pzFKD" data-default-tab="css" class="codepen"><pre><code>@font-face {
  font-family: "Your typeface";
  src: url("type/filename.eot");
  src: local("☺"),
    url("type/filename.woff") format("woff"),
    url("type/filename.otf") format("opentype"),
    url("type/filename.svg#filename") format("svg");
  font-weight: normal;
  font-style: nomal;
  font-stretch: normal;
}
<div></div>
@font-face {
  font-family: "Your bold typeface";
  src: url("type/filename-bold.eot");
  src: local("☺"),
    url("type/filename-bold.woff") format("woff"),
    url("type/filename-bold.otf") format("opentype"),
    url("type/filename-bold.svg#filename-bold") format("svg");
  font-weight: bold;
  font-style: nomal;
  font-stretch: normal;
}
<div></div>
@font-face {
  font-family: "Your italic typeface";
  src: url("type/filename-ital.eot");
  src: local("☺"),
    url("type/filename-ital.woff") format("woff"),
    url("type/filename-ital.otf") format("opentype"),
    url("type/filename-ital.svg#filename-ital") format("svg");
  font-weight: normal;
  font-style: italic;
  font-stretch: normal;
  }</code></pre>See the Pen <a href="http://codepen.io/caraya/pen/pzFKD">Multiple @font-face assignments in a single CSS file</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</div>

<script async src="//codepen.io/assets/embed/ei.js"></script>

We can then fine tune our styles by setting properties for elements and selectors as needed. I usually start with setting up a default font and size/line height that will be carried throughout the document. I also provide a stack of backup fonts so that the browser will use the first font in the stack that is available to display the content, finally dalling back to one of the predefined font families (sans-serif, serif, fantasy, cursive, monospace)

\[codepen\_embed height="257" theme\_id="2039" slug\_hash="tuaGn" default\_tab="css"\] html { font-family: "Your typeface", Georgia, sans-serif; font-size: 62.5%; line-height: 1.5; }

See the Pen [Finetuning elemements with @font-face defined fonts](http://codepen.io/caraya/pen/tuaGn) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

### Fighting FOUT

The Flash of Unstyled Text is a phenomenon in Firefox and Opera that few web designers are fond of. When you apply a custom typeface via @font-face, there is a brief moment, when loading the page, where the font hasn't been downloaded and applied yet, and the next font in the font-family stack is used. This causes a flash of a different (typically less good looking) font, before it gets upgraded.

Unless you're designing for ancient browsers (Firefox 3.5 and 3.6 and Opera from th at same time period) FOUT shouldn't be that big an issue anymore.

If you still need to account for that, you can follow the [instructions fom Paul Irish](http://www.paulirish.com/2009/fighting-the-font-face-fout/)

# Styles and typographical elements

## Italics

Once we have decided on what font stack we will use, we can create our general styles. For example, to create an Italic level 1 heading (`<h1>`) we could code it like this:

\[codepen\_embed height="162" theme\_id="2039" slug\_hash="xyEwA" default\_tab="css"\] h1.italics { font-family: "Your italic typeface", Georgia, sans-serif; font-style: italic; }

See the Pen [Setting up italics fonts for H1 tag using @font-face defined fonts](http://codepen.io/caraya/pen/xyEwA) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

## Bold

If we need a bold text for some emphasis we can make our strong tags bolder by using something like:

\[codepen\_embed height="143" theme\_id="2039" slug\_hash="DAsLt" default\_tab="css"\] h1.strong: { font-weight: 700; }

See the Pen [Assiging bold weight with a @font-face defined font](http://codepen.io/caraya/pen/DAsLt) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

In addition to the standard bold value, CSS allows us to use the value bolder and numerical values from 100 to 700. The differences may be subtle but they are important as seen in the example below:

### Comparison between different font weights

<p data-height="368" data-theme-id="2039" data-slug-hash="mlgEF" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/mlgEF">Comparison between numeric values of the font-weight property</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//codepen.io/assets/embed/ei.js"></script>

The result of the rule above will depend either on available font faces within a font family or weights defined by the browser.

### Text-decoration

The text-decoration property has a set of predefined values that we can use deepnding on what visual result we want to accomplish. The valid values are:

- underline
- overline
- line-through
- none

One additional consideration is that we need to make sure to differentiate the page's hyperlinks from the content that we choose to underline. Otherwise it'll be confusing for our users when they try to click on underlined content and nothing happens. See the section on [hyperlinks related pseudoclasses](#links) for more information.

```
.underline {text-decoration: underline;}

.overline {text-decoration: overline;}

.strikethrough {text-decoration: line-through;}

.none {text-decoration: none;}
```

#### Different types of Underlines using the CSS above

\[codepen\_embed height="257" theme\_id="2039" slug\_hash="hylaK" default\_tab="result"\]See the Pen [Different styles of underline supported with the text-decoration CSS property](http://codepen.io/caraya/pen/hylaK) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Font-stretch

The font-stretch property, available in CSS3, selects a normal, condensed or expanded face from a font. In order to see the result of the selection, the font being used has to have a face that matches the value given.

The font-stretch property will not work on just any font, but only on fonts that are designed with different faces matching the defined sizes and that is available on the user's computer or loaded with a @face-font rule.

font-stretch accepts one of the following values:

- ultra-condensed
- extra-condensed
- condensed
- semi-condensed
- normal
- semi-expanded
- expanded
- extra-expanded
- ultra-expanded

#### Example of font-stretch

```
.expanded {
    font-stretch: expanded;
}
```

\[codepen\_embed height="145" theme\_id="2039" slug\_hash="fGDFw" default\_tab="result"\]See the Pen [Controlling front stretching using CSS](http://codepen.io/caraya/pen/fGDFw) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Font-variant

The `font-variant` property allows you to change the targeted text to small caps. It is available in CSS2 and CSS3 with the later assigning additional values to the property.

The values available in CSS2 are:

- normal (the default)
- small-caps

CSS3 introduced additional values for this property that are dependenant on features from Open Type being available on the font we are using.

- **all-small-caps** Enables display of small capitals for both upper and lowercase letters (OpenType features: c2sc, smcp)
- **petite-caps** Enables display of petite capitals (OpenType feature: pcap)
- **all-petite-caps** Enables display of petite capitals for both upper and lowercase letters (OpenType features: c2pc, pcap)
- **unicase** Enables display of mixture of small capitals for uppercase letters with normal lowercase letters (OpenType feature: unic)
- **titling-caps** Enables display of titling capitals (OpenType feature: titl). Uppercase letter glyphs are often designed for use with lowercase letters. When used in all uppercase titling sequences they can appear too strong. Titling capitals are designed specifically for this situation.
    

.allCaps { font-variant: small-caps; }

These are small caps

THESE ARE REGULAR CAPS

## Other attributes we can work with

### kerning and letter-spacing

> In typography, kerning (less commonly mortising) is the process of adjusting the spacing between characters in a proportional font, usually to achieve a visually pleasing result. Kerning adjusts the space between individual letter forms, while tracking (letter-spacing) adjusts spacing uniformly over a range of characters.[1](http://www.webdirections.org/blog/happy-17th-birthday-css/) In a well-kerned font, the two-dimensional blank spaces between each pair of characters all have similar area.
> 
> [http://en.wikipedia.org/wiki/Kerning](http://en.wikipedia.org/wiki/Kerning)

The font-kerning property is supposed to provide optical kerning for the font being used. It is not widely supported (if at all). I'd suggest using letter-spacing instead. It may not have the same fine grained control Kenrning does but it's better than nothing.

Letter spacing is more widely supported and allows you to control the spacing between letters in an element or class. Look at the example below.

```
<style>
p.narrow { letter-spacing: 0.4em }
p.wide {letter-spacing: 1.5em}
</style>
```

### text-align

As the name implies text align controls the horizontal placement of text on the screen. There are 8 possible values, they are:

- **start**: The same as left if direction is left-to-right and right if direction is right-to-left.
- **end**: The same as right if direction is left-to-right and left if direction is right-to-left.
- **left**: The inline contents are aligned to the left edge of the line box.
- **right**: The inline contents are aligned to the right edge of the line box.
- **center**: The inline contents are centered within the line box.
- : The first occurrence of the one-char string is the element used for alignment. the keyword that follows or precedes it indicates how it is aligned. This allows to align numeric values on the decimal point, for instance. This property is not currently supported in any major browser.
- **justify**: The text is justified. Text should line up their left and right edges to the left and right content edges of the paragraph.
- **match-parent**: Similar to inherit with the difference that the value start and end are calculated according the parent's direction and are replaced by the adequate left or right value. This is only supported in Chrome.

### text-indent

This property indicates hw far you push the first line of text from the starting border (depending on direction of the text). Additional values control whether the indent is a hanging indent and whether it applies to only the first line or the entire block of text.

- Fixed value (i.e: 2em): Indentation is specified as a fixed value. Negative values are allowed
- Percentage (i.e: 20%): Indentation is a percentage of the containing block width.
- each-line: Indentation affects the first line of the block container as well as each line after a forced line break , but does not affect lines after a soft wrap break . Introduced in the CSS3 Text Module and not currently implemented in any major browser.
- hanging: Inverts which lines are indented. All lines except the first line will be indented. Introduced in the CSS3 Text Module and not currently implemented in any major browser.

### color

See [Expressing Colors in CSS](#css-colors) below

## Some typography related pseudo classes

### Hyperlink related pseudo classes

Although I wouldn't recommend it we can make some drastic changes to the way links behave and look when they are clicked or after they are visited. The link seudo classes and what they control are:

- :link controls the link when it's not being used (there's no user interaction)
- :visited applies after the link has been clicked on
- :hover applies when the mouse is hovering over the link
- :active applies when the link is being clicked (the state after you over over the link but before it changes to visited)
    

<

p>In order to style appropriately links, you need to put the :hover rule after the :link and :visited rules but before the :active one, as defined by the LVHA-order: :link — :visited — :hover — :active.

```
a:link { color: #666666; text-decoration: none; } 
a:visited { color: #333333; } 
a:hover { text-decoration: underline; } 
a:active { color: #000000; }
```

\[codepen\_embed height="110" theme\_id="2039" slug\_hash="bdFKE" default\_tab="result"\]See the Pen [Styling links with CSS](http://codepen.io/caraya/pen/bdFKE) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### ::first-letter and ::first-line

The ::fisrt-letter pseudo class allows you to style the first letter of a paragraph or a chapter differently than the rest of the content. This is commonly used to create Drop Cap effects. We can limit what paragraphs get a drop cap by using the :first-child pseudo element like in the

```
div.dcexample p:first-child:first-letter {
  float: left;
  color: #903;
  font-size: 75px;
  line-height: 60px;
  padding-top: 4px;
  padding-right: 8px;
  padding-left: 3px;
  font-family: Georgia; }
```

\[codepen\_embed height="316" theme\_id="2039" slug\_hash="bihyn" default\_tab="result"\]See the Pen [Styling First Letter of a Chapter using CSS :first-letter pseudo class](http://codepen.io/caraya/pen/bihyn) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

::first-line does something similar but with the entire first line of the matching element. This matches when printed publiccations some times have a first line of a chapter in a slightly larger font than nthe rest of the text. In the example below we've set the text of the first line to 1.3 em.

```
div.flexample p:first-child:first-line {
  font-size: 1.3em;
  color: #666;
}
```

\[codepen\_embed height="320" theme\_id="2039" slug\_hash="DbnIk" default\_tab="result"\]See the Pen [DbnIk](http://codepen.io/caraya/pen/DbnIk) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

# Units of measuremet in CSS

[CSS Units of Measurement](https://publishing-project.rivendellweb.net/units-of-measure-in-css)

# Expression colors in CSS

[Expressing colors in CSS](https://publishing-project.rivendellweb.net/expressing-colors-in-css/)

# Regions, Shapes and Exclusions

[CSS regions, exclusions, shapes and new publishing paradigms](https://publishing-project.rivendellweb.net/css-regions-exclusions-shapes-and-new-publishing-paradigms/)

# More stuff to play with: CSS Paged Media

[paged media article](https://publishing-project.rivendellweb.net/css-paged-media/)

# Typography doesn't not replace the designer's judgment

# Links and Resources

- [http://practicaltypography.com/index.html](http://practicaltypography.com/index.html)
- [http://blog.8thlight.com/chris-peak/2012/12/30/vertical-rhythm.html](http://blog.8thlight.com/chris-peak/2012/12/30/vertical-rhythm.html)
- [More Meaningful Typography](http://alistapart.com/article/more-meaningful-typography)
- [Composing the new cannon](http://24ways.org/2011/composing-the-new-canon/)
- [Tips for choosing a scale](http://blog.8thlight.com/billy-whited/2011/10/28/r-a-ela-tional-design.html#tips)
- [http://modularscale.com/](http://modularscale.com/)
- [http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/products/type/pdfs/adobe-type-primer.pdf](http://wwwimages.adobe.com/www.adobe.com/content/dam/Adobe/en/products/type/pdfs/adobe-type-primer.pdf) \[PDF\]
- [Elements of Typographic Style applied to the web](http://webtypography.net/)
- [http://alistapart.com/article/whitespace](http://alistapart.com/article/whitespace)
