---
title: A Deep Dive into Modern Fonts
date: 2025-11-10
tags:
  - CSS
  - Fonts
---

In modern web design, we treat fonts as a cornerstone of user experience. They convey brand identity, improve readability, and define a site's aesthetic. However, the methods we use to load these critical assets can dramatically impact performance. As web performance expert Jono Alderson has highlighted, many common font-loading practices actively harm site speed and user perception. This article explores the evolution of web fonts, dives deep into a complete strategy for mastering the @font-face rule, and looks toward the future of this essential technology.

## The Evolution from "Bulletproof" to WOFF2

The ability to use custom fonts on the web comes from the @font-face CSS at-rule. Its history is one of evolving standards and formats, all aimed at balancing creative freedom with performance.

Not long ago, ensuring a font worked across all browsers required a cumbersome, multi-format approach. A typical @font-face declaration from that era looked something like this:

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('mywebfont.eot'); /* IE9 Compat Modes */
  src: url('mywebfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('mywebfont.woff') format('woff'), /* Modern Browsers */
       url('mywebfont.ttf')  format('truetype'), /* Safari, Android, iOS */
       url('mywebfont.svg#svgFontName') format('svg'); /* Legacy iOS */
}
```

This "bulletproof" syntax was a necessary hack to navigate a fragmented browser landscape. It was also inefficient, forcing developers to generate and store multiple large font files.

Over time, the Web Open Font Format (WOFF) emerged as a superior standard, offering better compression. But the real breakthrough was WOFF2. Developed by Google, WOFF2 uses Brotli compression to offer significantly smaller file sizes than its predecessor. Today, with near-universal browser support, WOFF2 is the only font format you need for modern web development.

### When to Consider a WOFF Fallback

While WOFF2 is the clear winner for modern browsers, there is one specific edge case where its predecessor, WOFF, is still useful: supporting legacy browsers.

WOFF has excellent support in older browsers that do not support WOFF2, most notably Internet Explorer 9-11 and older versions of the Android stock browser. If your site analytics show a meaningful percentage of users on these platforms (common for government, large enterprise, or certain international audiences), providing a WOFF file as a fallback is a sound strategy for progressive enhancement.

You can do this by listing the WOFF2 source first, followed by the WOFF source. Modern browsers will see the format('woff2') hint, download that file, and ignore the rest of the src list. Older browsers that don't recognize format('woff2') will skip it and move on to the WOFF file, which they do support.

```css
@font-face {
  font-family: 'MyWebFont';
  /* Modern browsers will download this and stop. */
  src: url('mywebfont.woff2') format('woff2'),
       /* Legacy browsers will skip the above and download this. */
       url('mywebfont.woff') format('woff');
  font-display: swap;
}
```

For the vast majority of websites, the user base on these legacy browsers is negligible, and the added complexity and extra file weight are not worth the effort. However, if you must support them, this is the clean, modern way to do it.

### Mastering the @font-face Rule for Peak Performance

To truly optimize font loading, we must move beyond just the file format and master the @font-face rule itself. Each descriptor within this rule is a powerful lever for controlling performance and user experience.

Here is a complete modern @font-face declaration, which we will break down descriptor by descriptor:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2');
  font-display: swap;
  font-weight: 100 900;
  font-style: normal;
  font-stretch: 75% 125%;
  unicode-range: U+0020-007E; /* Basic Latin */
  size-adjust: 104%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 120%;
}
```

#### Core Descriptors

* **font-family**: This assigns a name to the font, which you'll use in other CSS rules (`body { font-family: 'Inter', sans-serif; }`).
* **src**: This is the most critical descriptor. It points to the font file. The `format()` hint helps the browser quickly identify the font type and skip downloading unsupported formats. You can also use `local('Font Name')` to check if the user already has the font installed, potentially saving a download, but this can be unreliable due to varying font names.

#### Performance & Experience Descriptors

* **font-display**: This property is your most powerful tool for controlling what the user sees while web fonts are loading. It lets you manage the trade-off between the "Flash of Invisible Text" (FOIT) and the "Flash of Unstyled Text" (FOUT).
  * **block**: Hides the text for a short period (~3s). This causes a jarring FOIT and is generally bad for user experience.
  * **swap**: Shows the fallback font immediately, then swaps in the web font once it loads. This causes a FOUT but ensures content is always readable. This is the best default for most websites.
  * **fallback**: A compromise. Hides text for a tiny period (~100ms) then shows the fallback. It gives the web font a limited time to load; if it's too slow, the browser sticks with the fallback.
  * **optional**: The most performance-focused. If the font isn't available almost instantly (e.g., from cache), the browser uses the fallback and may download the font in the background for the next visit. Ideal for non-essential fonts.
* **font-weight**, **font-style**, **font-stretch**: These descriptors define which specific font file to use when a style like `font-weight: bold` is applied. Their power is fully realized with variable fonts, where they can accept a range of values.
* **unicode-range**: This is a powerful optimization tool that works in tandem with font subsetting. It tells the browser that a specific font file should only be downloaded if the page contains characters within that specified Unicode range.

#### Layout Shift Mitigation Descriptors

When you use font-display: swap, the swap from a fallback font to your web font can cause a jarring shift in layout, known as Cumulative Layout Shift (CLS), which is a core web vital. These new descriptors allow you to "pre-adjust" the fallback font's metrics to closely match the web font, minimizing or eliminating CLS.

* **size-adjust**: Scales the glyphs of the fallback font to better match the x-height and general size of the web font.
* **ascent-override**, **descent-override**: Adjusts the space above and below the baseline of the fallback font.
* **line-gap-override**: Controls the line spacing (leading) 	of the fallback font.

By carefully tuning these values, you can make the fallback font occupy the exact same space as the web font, resulting in a seamless swap with zero layout shift.

### Calculating Metric Overrides: The Easy Way

Calculating these override values requires comparing the internal metrics of your web font against your chosen fallback font (e.g., Arial). While you could do this manually by digging into font files with a font editor and doing some math, this is tedious and error-prone.

Thankfully, there are excellent tools that automate this entire process. You do not need to build your own.

A great tool for the job is this [Font Style Matcher](https://meowni.ca/font-style-matcher/).

Here's how to use it:

1. **Select Your Fonts**:
      * **Fallback Font**: This is the font that will be displayed while your web font is loading. Choose a font that is commonly available on most computers, like Arial, Georgia, or Times New Roman.
      * **Web Font**: This is the font you want to use on your website. You have two options:
          * **Download from Google Fonts**: If your font is available on Google Fonts, you can select it from the dropdown menu.
          * **Upload a Font File**: If you have the font file on your computer, you can upload it directly.
2. **Adjust Font Properties**:
      * Use the sliders and input fields to adjust the following properties for both the fallback and web fonts:
          * Font Size: Adjust the size of the font.
          * Line Height: Change the spacing between lines of text.
          * Font Weight: Control the thickness of the font.
          * Letter Spacing: Modify the space between letters.
          * Word Spacing: Adjust the space between words.
3. **Compare the Fonts**:
      * Click the "Overlapped" view to see how well the fallback font matches the web font. This will show the two fonts layered on top of each other, making it easy to see any differences.
4. **Fine-Tune and Implement**:
      * Continue to adjust the properties of the fallback font until it is a close match to the web font.
      * Once you are satisfied with the result, the tool will provide you with the CSS code to implement the styled fallback font on your website.
      * You may have to adjust both the web font and fallback font properties to get a good match.

For developers who want to integrate this logic into their build process, the underlying library is [fontkit](https://www.npmjs.com/package/fontkit) or [opentype.js](https://www.npmjs.com/package/opentype.js?activeTab=readme), which can programmatically generate this data. For most use cases, a visual online tool is all you need to get the values.

By using these tools, you can eliminate font-swap CLS in minutes, a task that would have previously been a major technical challenge.

## Aggressive Optimization: Font Subsetting

While choosing the right format is important, the biggest factor in font performance is file size. A complete font file can be hundreds of kilobytes if it supports many languages and symbols. And for static fonts, you often need multiple files for different weights and styles. For Regular weight fonts you need:

* A regular (normal) style
* An italic style
* A bold style
* A bold italic style

Although Variable Fonts can reduce the number of necessary files, they can still be large if they support many axes of variation and languages.

Font subsetting is the process of creating smaller, specialized font files by removing the glyphs (characters, symbols, etc.) that you don't use, reducing the font file size and improving load times.

### How to Create Subsets with Glyphhanger

Manually figuring out which characters your site uses is impossible. This is where automated tools are essential. [Glyphhanger](https://www.zachleat.com/web/glyphhanger/) is a powerful command-line tool that crawls your website, analyzes its content, and automatically generates lean, subsetted font files.

Here’s a practical workflow:

1. **Install Glyphhanger**: You'll need Node.js installed. Then, run the following command in your terminal:
    `npm install -g glyphhanger`
2. **Run it on your site**: Navigate to your project folder and run Glyphhanger, pointing it to your live site or local files and your original font files.

    `glyphhanger https://www.yourwebsite.com --formats=woff2 --subset=./fonts/*.woff2`

      * `https://www.yourwebsite.com`: The URL to crawl.
      * `--formats=woff2`: Tells it to only output the modern WOFF2 format.
      * `--subset=./fonts/*.woff2`: Specifies the original font files you want to create subsets from.

3. **Use the Output**: Glyphhanger will do two crucial things:
    * It will create new, much smaller font files (e.g., `Inter-subset.woff2`).
    * It will output the exact `unicode-range` value that corresponds to the characters included in the new subset file.

### Connecting Subsets with unicode-range

The `unicode-range` descriptor is the magic that makes subsetting work. You create multiple `@font-face` rules for the same font-family, each pointing to a different subset file with its unique unicode-range.

The browser then becomes a smart font loader. It will parse your CSS and only download the font file that contains the characters it actually needs to render the page.

Here’s a complete example for a site that uses both English and Russian:

```css
/*
  Latin subset - Loads for most users
*/
@font-face {
  font-family: 'MyWebFont';
  src: url('/fonts/my-web-font-latin.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/*
  Cyrillic subset - Only loads if needed
*/
@font-face {
  font-family: 'MyWebFont';
  src: url('/fonts/my-web-font-cyrillic.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
```

With this setup, a user visiting an English page will only download the tiny `latin.woff2` file. If they navigate to a page with Russian text, the browser will see a character from the Cyrillic range and then, and only then, will it fetch the `cyrillic.woff2` file. This is a massive performance win.

See the next section for when subsetting fonts in in sites that use multiple languages may not be the best strategy.

### When Subsetting Is Not a Good Strategy

While powerful, subsetting is not a silver bullet. There are important scenarios where it can cause problems:

* **Highly Dynamic or User-Generated Content**: If your site displays content that you can't predict—such as user comments, forum posts, or articles from a CMS where authors might use any character—subsetting is risky. Your carefully created subset will inevitably be missing glyphs, resulting in missing characters being rendered as boxes or tofu (□). In these cases, loading a more complete font file is safer.
* **Complex Multilingual Pages**: For sites where multiple languages can appear on the same page (a language-learning app or an international community forum), the `unicode-range` strategy can backfire. The browser might end up downloading many small subset files, and the overhead from these multiple network requests could be slower than downloading one larger, comprehensive font file.
* **Font Licensing Restrictions**: Always check your font's End-User License Agreement (EULA). Some licenses explicitly forbid modifying the font file in any way, which includes subsetting. Violating the license could lead to legal issues.
* **Negligible Gains**: If your full font file is already quite small (e.g., under 20KB), the performance gain from subsetting might be minimal and not worth the added complexity in your build process.

## The Game Changer: Variable Fonts

One of the most significant advancements in web typography is the variable font. Instead of having separate files for every weight, width, and style of a typeface, a variable font packages all of those variations into a single, highly efficient file.

### How They Work

Think of a variable font as a master font file with a set of "sliders" or "axes of variation." These axes control different attributes of the font. Common registered axes include:

* **Weight (`wght`)**: Controls the thickness of the strokes, from light to black.
* **Width (`wdth`)**: Controls how condensed or expanded the characters are.
* **Slant (`slnt`)**: Controls the degree of slant, similar to an oblique style.
* **Italic (`ital`)**: A simple toggle (0 for off, 1 for on) to switch to a true italic style.
* **Optical Size (`opsz`)**: Optimizes the character shapes for readability at different font sizes.

A font can have any number of custom axes that are exclusive to that typeface, allowing for incredible flexibility

### The Performance Advantage

The primary benefit of variable fonts is performance. Imagine a design that requires Regular, Medium, Bold, and Bold Italic weights. With traditional static fonts, you would need to load four separate WOFF2 files. With a variable font, you load just one file. This single file is often smaller than the combined size of just two static fonts, leading to:

* **Fewer HTTP Requests**: The browser makes only one request for the font, reducing network overhead.
* **Smaller Total Download Size**: The clever way variable fonts store data means the total file size is significantly reduced.

### Variable Fonts and @font-face

Variable fonts change how we use descriptors like font-weight. Instead of defining a single value for a single file, you tell the browser that one file covers a whole range.

Look back at our example: `font-weight: 100 900;`

This tells the browser that the `inter-variable.woff2` file can produce any font weight between 100 (Thin) and 900 (Black). Now, when you use `font-weight: 700`; or even an intermediate value like `font-weight: 550;` in your CSS, the browser knows to use this single file to generate that style. You don't need a separate `@font-face` rule for each weight.

This approach not only improves performance but also unlocks new creative possibilities, such as smoothly animating font weights or creating responsive typography that subtly adjusts its width or weight based on screen size.

## The Future: Incremental Font Transfer (IFT)

While the techniques above can significantly improve font loading, a new technology on the horizon promises even greater efficiency: [Incremental Font Transfer (IFT)](https://www.w3.org/TR/IFT/).

IFT is a proposed web standard that would allow browsers to download only the parts of a font needed to render the text on the current page. For example, if a page only uses the characters "A," "B," and "C," the browser would download only the data for those three glyphs. As the user navigates, the browser would incrementally download additional data as needed. This would be a game-changer for languages with large character sets, like Chinese, Japanese, and Korean, where font files can be several megabytes.

However, IFT is complex and requires significant changes to both browsers and servers, so widespread implementation is still some time away.

## Conclusion: A Strategic Approach to Fonts

Loading fonts on the web is no longer a simple matter of pointing to a file. A modern, performant strategy requires a multi-faceted approach. By embracing the efficient WOFF2 format, strategically subsetting fonts where appropriate, leveraging the power of variable fonts to reduce requests, and meticulously configuring every descriptor in the `@font-face` at-rule you can ensure your websites are both only beautiful and fast.

