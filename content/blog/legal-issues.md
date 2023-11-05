---
title: "Legal Issues"
date: "2015-08-10"
categories:
  - "typography"
---

Unless you own the typeface or it is licensed through Google Fonts or another free service, you will have to pay for the font and be subject to whatever restrictions the EULA (End User License Agreement) specifies. This may be a problem when the foundry decides that you don't need a TTF format for the font you just purchased or when you're not allowed to generate an SVG version of your font to use with older iOS devices.

I do not mean to say or imply that you should break your license agreement. Quite the opposite; we should be thankful that foundries and font creators have decided that the bennefits outweigh the risks when it comes to online fonts. It is not a perfect solution and we need to keep working at making it better.

I recently asked a foundry on twitter why didn't they offer certain font formats (the font purchase for web includes EOT and WOFF with TTF as a mockup font) there was no TTF, OTF, SVG or WOFF2 available for me to use. The exchange turned ugly and, from my perspective, ignored completely the fact that I had purchased a license to the font and was in my right to request additional font types to accommodate my user base... they indicated that they could do it in a special (as in more expensive) license and that they know best what formats of their fonts I will need for my clients based on general usage or that none of his big clients have made the request for TTF so it must mean that there is no need for the format anywhere.

Font Licensing is like DRM encumbered music. You have the medium but do not own the actual font. As far as I understand it the foundry can end your license for any reason and you're not allowed to make changes to suit the fonts to our needs rather than believe the foundries have the answers for everything. Things changed for music files and I can only hope that the same changes will happen with fonts and font licensing.

### Open Source fonts

So, if proprietary fonts can become such a nightmare will open source fonts work any better?

The answer, as usual, is it depends.

There are awesome fonts with open source licenses. Fonts like [Raleway](http://www.fontsquirrel.com/fonts/raleway), [Roboto](http://www.fontsquirrel.com/fonts/roboto), [Gentium](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=gentium) and [Fira Sans](http://www.fontsquirrel.com/fonts/fira-sans) are good open source solutions that have liberal open source licenses (either SIL font license or Mozilla Public License) but, as with everything else related to type, you need to test your chosen fonts with your content and make sure that it works for your particular project and the (human) languages your document has to support.

There are also purpose specific fonts like [Adobe Source Code Pro](http://adobe-fonts.github.io/source-code-pro/) or [Deja Vu Mono](http://dejavu-fonts.org/wiki/Main_Page) that you can use in user interfaces or code heavy environments. I use Source Code Pro for all code examples in this project.

A good starting point, if you're looking for free/open source fonts is the [free font list](http://www.fontsquirrel.com/fonts/list/find_fonts) from Font Squirrel. You can look at the fonts and download them to test on your local system before you decide if you want to use the font. You can also check sites like [Fonts in Use](http://fontsinuse.com/) to see other uses of the fonts you're evaluating.

![Example screenshot from fontsinuse.com with samples of sites/apps using Roboto as their font](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/fonts-in-use-example)

Example from [Fonts in Use](fontsinuse.com) with samples of sites/apps using Roboto as their font

For the most part the free fonts in Font Squirrel can be used with the [Webfont Generator](http://www.fontsquirrel.com/tools/webfont-generator). This tool allows you to upload fonts (for which you have license and/or permission) to generate the formats needed to support all browsers (including SVG for all iOS and TTF for older versions of browsers.)
