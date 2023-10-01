---
title: "OOCSS: What it is and how do you apply it to CSS creation"
date: "2014-03-05"
categories: 
  - "technology"
  - "tools-projects"
---

Looking at my own CSS over the years I've come to realize how messy it is and how much (extra) work you have to do when it comes time to clean it up. It has come to light again when trying to work on a default set of stylesheets for Sunshine and I had to do some serious refactoring... It was a real pain in the ass.

An intriguing concept that I've been following for a few months is [Object Oriented CSS](https://github.com/stubbornella/oocss/wiki) and it refers to how to structure your CSS around objects and breaking common properties into generic classes so we can reuse them rather than have to code the same thing over and over.

The OOCSS project provides a framework: HTML, CSS, Javascript and related assets to give developers a common starting point for large scale web development. While ebooks, with few exceptions, will never fall into the large scale development model suggested by OOCSS the clean separation of CSS functionality into objects makes creation of format specific styles (ePub, Kindle, others) easier and it keeps you DRY (Don't Repeat Yourself)

Take for example the following set of CSS declarations:

\[css\] h1 { font-family: "Helvetica Neue", Helvetica, Arial; sans-serif; font-size: 2.5em; /\* 40px if the default font size is 16 \*/ font-color: #ccc; }

.header h1 { font-family: "Helvetica Neue", Helvetica, Arial; sans-serif; font-size: 2.5em; /\* 40px if the default font size is 16 \*/ font-color: #ccc; }

.footer h1 { font-family: "Helvetica Neue", Helvetica, Arial; sans-serif; font-size: 2.5em; /\* 40px if the default font size is 16 \*/ font-color: #ccc; } \[/css\]

I see the following issues with the code above:

- If the development team decides to change any of the parameters we need to change it in every iteration of the h1 tag
- Adding a class to define semantic elements (like all the h1 tags that belong in a header) only makes sense if we are making each othe h1 tags different, which we are not in this case.
- Avoiding duplication makes the CSS file smaller in size and therefore faster to download

Consider the following corrected CSS that is equivalent to the one above

\[css\] html { font-family: "Helvetica Neue", Helvetica, Arial; sans-serif; }

h1 { font-size: 2.5em; /\* 40px if the default font size is 16 \*/ font-color: #ccc; }

.header h1{ /\* Define styles that apply only to h1 that are part of the header Delete if not needed \*/ }

.footer h1{ /\* Define styles that apply only to h1 that are part of the footer Delete if not needed \*/ }\[/css\]

The code above is structured in such a way that the following happens:

- All the text in the page has the same font (and we don't need to declare the font for every element unless we're making a change from the default)
- All h1 elements look the same throughout the document
- We only make changes where we need to and can delete the empty style declarations where we con't need them.

Because ebooks can vary so much in the CSS they support and how designers must tweak we can create device specific classes and then select only the classes that are relevant, either by grouping them in multiple files or using SASS as described in [SASS, SCSS, CSS and Modular Design](https://publishing-project.rivendellweb.net/sass-scss-css-and-modular-design/)
