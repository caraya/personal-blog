---
title: "Unicode and multilingual support"
date: "2015-08-05"
categories:
  - "typography"
---

[Unicode](http://unicode.org/standard/WhatIsUnicode.html) is an ISO international standard (ISO/IEC 10646) for the consistent encoding, representation, and handling of text in most of the world's writing systems. It answers the question: **How do I combine multiple languages in a single document?**

In the past we had different encodings for different language codified in the ISO/IEC 8859 series of standards. English, for example, uses ISO/IEC 8859-1 which is mostly ASCII. This is not sufficient to work with eastern European languages that use additional symbols accents and punctuation to fully express the language. See the [Wikipedia entry for ISO 8859](https://www.wikiwand.com/en/ISO/IEC_8859) for more details regarding what languages are supported on each section of the standard.

HTML and XHTML both come with a [predefined set of entities](http://dev.w3.org/html5/html-author/charref) to handle unicode characters using a name (for example using &Upsilon; for the uppercase Upsilon greek letter.) But that is still no guarantee that your chosen font will have the glyphs matching the character you need.

I've had a discussion in the XML Content/InDesign Publishing Linked in Group and, as part of my research, discovered that:

* The level of unicode glyph support depends on the fonts available in the OS
* Specific Unicode glyphs may not be available in all platforms

In my opinion he best solution is still to use web fonts you know have all the characters your text uses and you have tested with your content. This is doubly important when looking at the glyphs that appear on your document... we need to make doubly sure that whatever glyphs you use are available in the typeface you've selected.

To make things easier on yourself, you can also subset the fonts you're using so that only the characters you need will be added to your font; This is particularly useful in multibyte characters like Japanese, (traditional) Chinese or Korean where there are at least several hundreds, if not thousands, of glyphs.

When I want to use font subsets my favorite tool is Font Squirrel's [Webfont generator](http://www.fontsquirrel.com/tools/webfont-generator). I've [documented](http://wp.me/p3KUjB-1glp) how I use the generator and other possible subsetting solutions so I won't go into too much detail of the mechanics... but I will cover the basics just to be sure.

Font Squirrel has three options for subsetting fonts. We will work with custom options because they provide the most flexible approach

![Font Squirrel Font Subset Options when using custom subsetting](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/fontsquirrel-subset-e1435901123984)

You can subset by character type, language, unicode table, single characters or, if you know what you're doing by Unicode Ranges. The last option is only good if you know the exact range or ranges of characters that you need to support and the preview may show you that your chose font doesn't support the characters you need.
