---
title: "Improving Font Performance: Subset fonts using Glyphhanger"
date: "2019-01-23"
---

[Glyphhanger](https://github.com/filamentgroup/glyphhanger) is a Node application that will help you reduce the size of your fonts by subsetting them.

There are times when we use just a few characters from a given font. For example, if we use a font just for headings there are many characters that you will not use, a subset will get rid of these unnecessary characters making the fonts smaller and providing a faster download. Another example is when the font supports multiple languages that you know you won't need for your project (like Cyrillic when you know you will be working with English, Spanish, and French)

We will generate four different items from our font:

- The list of glyphs to use
- A Latin characters subset
- A subset using only the characters in a given page
- A subset using the characters in all the local pages

### Generating a list of the glyphs to use

The first thing to look at is generating the list of glyphs you want to subset to. This is different than creating the subset fonts, it will only list the glyphs.

```bash
glyphhanger http://localhost:5000
```

You can also redirect the list to a file for later use

```bash
glyphhanger http://localhost:5000 > site-glyphs.txt
```

### Subsetting to the Latin Character set

The first experiment is to subset the font to use Latin characters only. Latin alphabets are used in the United States, Latin America, and Western European countries

```bash
glyphhanger --latin \
--subset=Roboto-min-VF.ttf  \
--formats=woff-zopfli,woff2
```

This command will generate larger but more flexible subsets that will work with all pages in your site or application. But they are larger files, we can probably do better.

The next version will subset the font to use only the characters in the specified page, in this case, the index page for the site.

### Subsetting to a page

```bash
glyphhanger http://localhost:5000 \
--subset=Roboto-min-VF.ttf  \
--formats=woff-zopfli,woff2
```

This will create subset fonts in the specified formats (WOFF and WOFF2) along with the CSS @font-face declaration that you can drop in your stylesheet to use. The fonts and CSS will only have the characters used in that page.

### Subsetting with the spider

The previous subset is good for a single page application but breaks in multi-page sites as characters in the page we subset from may not be in the other pages in the site.

We can handle multiple pages by using Glyphhanger's spidering capability by indicating that we want to use it (`--spider`) and the maximum number of URLs to capture (`--spider-limit`).

```bash
glyphhanger --spider --spider-limits-30 \
--formats=woff2,woff-zopfli \
--subset=*.ttf \
http://localhost:5000
```

The result will be closer to the Latin subset but it will only contain the characters that exist in your site in the language it was written in. This becomes important when you use fonts like Roboto, Fira or other fonts designed to support multiple languages.

### Looking at the sizes

Using Roboto Variable Font, [downloaded from Github](https://github.com/TypeNetwork/Roboto), as an example I got the following results when running the commands shown in prior sections.

| Format | File Name | Size |
| --- | --- | --- |
| TTF | Roboto-min-VF.ttf | 2.2MB |
| WOFF | Roboto-min-VF.woff | 1.3MB |
| **WOFF Subset** | Roboto-min-VF-subset.zopfli.woff | **104KB** |
| **WOFF Latin Subset** | Roboto-min-VF-latin-subset.zopfli.woff | **109KB** |
| **WOFF Site Subset** | Roboto-min-VF-site-subset.zopfli.woff | **1.3MB** |
| WOFF2 | Roboto-min-VF.woff2 | 976KB |
| **WOFF2 Subset** | Roboto-min-VF-subset.woff2 | **86KB** |
| **WOFF2 Latin Subset** | Roboto-min-VF-latin-subset.woff2 | **977KB** |
| **WOFF2 Site Subset** | Roboto-min-VF-site-subset.woff2 | **92KB** |

The sizes are larger than you may expect because this is a variable font. It has all different instances of Roboto built in a single file so it's all you would add to handle all of Roboto's instances and Open Type functionality.
