---
title: "Improving Font Performance: Work to control font loading"
date: "2019-02-04"
---

Because of their size fonts tend to be some of the largest components of any web pages. According to the HTTP Archive, the sum of the transfer size of all fonts (eot, ttf, woff, woff2, or otf requested by the page is 98KB for Desktop and 83.4KB for mobile.

There are several CSS and Javascript techniques to help browsers control and speed up font display and how it swaps when the web font is loaded.

The idea is to load the page as quickly as possible using fallback fonts and then swap the web font in when it's ready.

### Use font-dispay

The `font-display` property of the `@font-face` rule allows the developer to better control how/when/if web fonts change the way the text looks. It is part of the [CSS Fonts Module Level 4 specification](https://www.w3.org/TR/css-fonts-4/#font-display-desc) and currently supported in most major desktop browsers (except Edge) and in Chrome for Android (see [caniuse entry](https://caniuse.com/#feat=css-font-rendering-controls) for more details).

Using the property, `@font-face` declarations now look like this:

```css
@font-face {
  font-family: 'Open Sans';
  src:  url("opensans.woff2") format("woff2"),
        url("opensans.woff") format("woff");
  font-display: swap;
}
```

The font display timeline is based on a timer that begins the moment the user agent attempts to use a given downloaded font face. The timeline is divided into the three periods which dictate the rendering behavior of any element using the font face.

Font block period

If the font face is not loaded, any element attempting to use it must render an invisible fallback font face. If the font face successfully loads during this period, it is used normally.

Font swap period

If the font face is not loaded, any element attempting to use it must render a fallback font face. If the font face successfully loads during this period, it is used normally.

Font failure period

If the font face is not loaded, the user agent treats it as a failed load causing normal font fallback.

Using the timeline above, we can now understand the possible values for `display-font`.

auto

Whatever the user agent would normally do. This varies from browser to browser

block

Gives the font face a short block period and an infinite swap period.

swap

Gives the font face an extremely small block period and an infinite swap period.

fallback

Gives the font face an extremely small block period and a short swap period.

optional

Gives the font face an extremely small block period and no swap period.

I normally use `swap` as the value for `font-display` as it gives me a quick render of the page and the correct fonts once they have downloaded. As with many things in fonts, test it and make sure that it does what you want it to do, your mileage may vary.

### Use Font Face Observer

[Font Face Observer](https://fontfaceobserver.com/) is a font loader that allows you to work with fonts from multiple origins using a promise-based interface. It doesn’t matter where your fonts come from: host them yourself, or use a web font service such as Google Fonts, Typekit, Fonts.com, and Webtype.

Font Face Observer doesn't replace `@font-face` declarations. You still need to declare your fonts in your CSS and use `font-display` like so:

```css
@font-face {
  font-family: 'NeueMontreal';
  src:  url('/fonts/NeueMontreal-Bold.woff2') format('woff2'),
        url('/fonts/NeueMontreal-Bold.woff') format('woff');
  font-display: swap;
}

@font-face {
  font-family: 'Fuji';
  src:  url('/fonts/Fuji-Light.woff2') format('woff2'),
        url('/fonts/Fuji-Light.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Fuji';
  src:  url('/fonts/Fuji-Bold.woff2') format('woff2'),
        url('/fonts/Fuji-Bold.woff') format('woff');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

Then the page you want to use the fonts needs to load the Font Face Observer script, either locally:

```html
<script src="js/fontfaceobserver.js"></script>
```

Or from a CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/fontfaceobserver/2.0.13/fontfaceobserver.standalone.js"></script>
```

Then we create the script that will run the loader. It takes the following steps:

1. It creates new FontFaceObserver objects for each of the fonts that we want to load
2. It adds a class to the root element (`html`) to indicate that the fonts are loading
3. It uses `Promise.all` to load the fonts we defined in step 1
    
    - If all the fonts load successfully we add the `fonts-loaded` class to the root element
    - if any of the fonts fail to load then `Promise.all` will reject and the catch portion of the chain will add the `fonts-failed` class to the HTML element

```js
//1
const NeueMontreal = new FontFaceObserver("NeueMontreal");
const Fuji = new FontFaceObserver("Fuji");
const FujiBold = new FontFaceObserver("Fuji", {
  weight: "700"
});

let html = document.documentElement;

// 2
html.classList.add("fonts-loading");

// 3
Promise.all([
    NeueMontreal.load(),
    Fuji.load(),
    FujiBold.load()
  ]).then(() => {
    // 4 success
    html.classList.remove("fonts-loading");
    html.classList.add("fonts-loaded");
    console.log("All fonts have loaded.");
  })
  .catch(() => {
    // 4 failure
    html.classList.remove("fonts-loading");
    html.classList.add("fonts-failed");
    console.log("One or more fonts failed to load");
  });
```

Each class (`fonts-loaded` and `fonts-failed`) should match classes in your CSS that use web fonts and fallbacks as appropriate. Using different classes means that you don't have to wait for web font download to timeout.

### Evaluate using the CSS font loading API

The [CSS Font Loading Module Level 3](https://www.w3.org/TR/css-font-loading-3/) provides a programmatic way to handle font loading and handling of related events.

Even though the specification it's at the candidate recommendation stage, it's supported by most modern browsers (Edge is the exception) so I'm confident in suggesting you evaluate it.

The script runs the following tasks

1. We define a `logLoaded` function to log successful font loads to the console
2. For each font we want to process we:
    
    - Create a new `FontFace` object representing the font with the following attributes:
        
        - Name
        - URL
        - An optional style object representing the basic characteristics (style, weight, and stretch) of the font we're loading
    - Add the font to the fonts stack
    - Log the successful result using the `logLoaded` function
3. Using the `ready()` method as an example we make the element with class `.content` visible

```js
//1
function logLoaded(fontFace) {
  console.log(fontFace.family, "loaded successfully.");
}

//2
// These rules replace CSS @font-face declarations.
const NeueMontrealFontFace = new FontFace(
  "NeueMontreal",
  "url(/fonts/NeueMontreal-Bold.woff2)"
);
document.fonts.add(NeueMontrealFontFace);
NeueMontrealFontFace.loaded.then(logLoaded);

const fujiFontFace = new FontFace("Fuji",
      "url(/fonts/Fuji-Light.woff2)", {
  style: "normal",
  weight: "400"
});
document.fonts.add(fujiFontFace);
fujiFontFace.loaded.then(logLoaded);

const fujiBoldFontFace = new FontFace("Fuji",
      "url(/fonts/Fuji-Bold.woff2)", {
  style: "normal",
  weight: "700"
});
document.fonts.add(fujiBoldFontFace);
fujiBoldFontFace.loaded.then(logLoaded);

//3
document.fonts.ready.then(function() {
  const content = document.getElementById("content");
  content.style.visibility = "visible";
});
```

## Use variable fonts in browsers that support them

In order to use variable fonts on your operating system, you need to make sure that it is up to date. Linux OSes need the latest Freetype version, and macOS prior to 10.13 (High Sierra) will not work with variable fonts.

Variable fonts are an evolution of the OpenType font specification that enables multiple variations of a typeface to be incorporated into a single file, rather than having a separate font file for every width, weight, or style; reducing the number of requests and, potentially, the file sizes for the font assets by downloading a single file. The drawback is that it provides all the variations for the given font and downloading it means you get all the variations **_whether you plan on using them or not._**

Subsetting fonts will reduce the number of characters but will not remove unused instances or any data other than glyphs.

To make these variable fonts with our current CSS we need to make some modifications. Using Roboto and its values as an example, the `@font-face` declaration looks like this:

```css
@font-face: Roboto;
src:  url('/fonts/Roboto-min-VF.woff2') format('woff2'),
      url('/fonts/Roboto-min-VF.woff') format('woff');
font-weight:  250 900;
font-width: 75 100;
font-style: -12 0;
```

We can then use values within the defined boundaries in our style sheets.

```css
.my-class {
  font-weight: 450;
  font-style: -12;
}
```

We will not cover details about Variable Fonts, if you want a deeper reference, check MDN's [Variable Fonts Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide).

However, working with Variable fonts poses the following question:

**_When are variable fonts not the best option for your site/app?_**

Say, for example, that you're only using Roboto Regular and Bold in your application, and no Open Type features.

The variable font (compressed with WOFF2) is 978KB. Compressing individual weights of the font (regular and bold) using the same tool gives me a total of 135KB.

And even if you use the 4 basic font styles (regular, italic, bold and bold-italics), the WOFF2 fonts give you a combined weight of 270KB.

So, strictly from a performance point of view, variable fonts may not be your friend if you're not using the full feature set of a font.
