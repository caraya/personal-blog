---
title: "My CSS Starter Kit: Font loading and usage"
date: "2016-12-09"
---

Rather than let font loading remain at the mercy of the network we'll use Font Face Observer to dynamically load the fonts and swap them when ready. This may cause a little user cognitive dissonance but it's better than the alternatives of browsers taking forever or not loading the font.

## setting up fonts

We'll use the following mixin to create our `@font-face` declarations

```scss
@mixin font-declaration(  $font-family,
                          $font-file-name,
                          $weight:normal, 
                          $style:normal) {
  @font-face {
    font-family: '#{$font-family}';
    src: url('#{$font-file-name}.eot');
    src: url('#{$font-file-name}.eot?#iefix') format('embedded-opentype'),
    url('#{$font-file-name}.woff2') format('woff2'),
    url('#{$font-file-name}.woff') format('woff'),
    url('#{$font-file-name}.ttf') format('truetype'),
      // working with myFonts requires the svg file 
      // to be formated like this
      // url('#{$font-file-name}.svg#wf') format('svg');
    url('#{$font-file-name}.svg##{$font-family}') format('svg');
    font-weight: $weight;
    font-style: $style;
  }
}
```

And use them as follows:

```scss
@include font-declaration('notomono_regular', 
  '../fonts/notomono-regular-webfont',   normal,   normal);
@include font-declaration('notosans_regular', 
  '../fonts/notosans-regular-webfont', normal,  normal);
@include font-declaration('notosans_bold', 
  '../fonts/notosans-bold-webfont',  700,   normal);
@include font-declaration('notosans_italic', 
  '../fonts/notosans-italic-webfont',   normal, italic);
@include font-declaration('notosans_bolditalic', 
  '../fonts/notosans-bolditalic-webfont', 700,  italic);
```

to create the`@font-face` declarations.

Note that we create 4 `@font-face` declarations for our notosans: \* One for regular \* One for bold \* One for italics \* One for bolditalics

We do this to prevent faux bold and faux italics that we'll discuss in more details later.

## Loading fonts with Font Face Observer

Once we have our `@font-face` declarations done we need to actually load the fonts. We will use [Font Face Observer](https://fontfaceobserver.com/) to automate the process and to ensure that we don't get flashes of unstyled text.

The first thing to do is to modify our SCSS file to add a plain body tag with our backup fonts. We also add a `.fonts-loaded` class to the body declaration that uses the web fonts for the body tag.

We also need to add a `fonts-failed` class to take into account that the fonts may fail to load for a variety of reasons

```css
/* Basic font stack*/
body {
  font-family: Verdana, sans-serif;
}

/* Font stack when fonts are loaded */
.fonts-loaded body {
  font-family: "notosans_regular", Verdana, sans-serif;
}

/* Same font stack as basic but for when font loading fails*/
.fonts-failed body {
  font-family: Verdana, sans-serif;
} 
```

In Javascript we'll create add a script tag linking to `fontfaceobserver.js`

```markup
<script src="fontfaceobserver.js"></script> 
```

To load a single font we create variables to hold a `FontFaceObserve` with the name of the fonts we defined in the `@font-face declaration` and a reference to `document.documentElement`.

We add a class to the document to indicate tht fonts are loading.

We load the font and that creates a promise. If the promise succeeds then we remove the `font-loading` class and replace it with `fonts-loaded`.

If the font fails to load the promise will reject and jump to the catch statement. This will replace the `font-loading` class with `font-failed`. We can use this failed class to create a backup font stack to use when web fonts are not available.

```javascript
var font = new FontFaceObserver('notosans-regular');
var html = document.documentElement;

html.classList.add('fonts-loading');

font.load().then(() => {
  html.classList.remove('fonts-loading');
  html.classList.add('fonts-loaded');
}).catch(() => {
  html.classList.remove('fonts-loading');
  html.classList.add('fonts-failed');
});
```

We can work loading multiple fonts simultaneously by defining multiple `FontFaceObserver` declaration and then using `promise.all` to make sure that all the fonts are loaded before proceeding to change the classes as appropriate depending on success or failure.

```javascript
var mono = new FontFaceObserver('notomono_regular');
var sans = new FontFaceObserver('notosans_regular');
var italic = new FontFaceObserver('notosans_italic');
var bold = new FontFaceObserver('notosans_bold');
var bolditalic = new FontFaceObserver('notosans_bolditalic');

var html = document.documentElement;

html.classList.add('fonts-loading');

Promise.all([
  mono.load(), sans.load(), bold.load(), italic.load(), bolditalic.load()
]).then(() => {
  html.classList.remove('fonts-loading');
  html.classList.add('fonts-loaded');
  console.log('All fonts have loaded.');
}).catch(() =>{
  html.classList.remove('fonts-loading');
  html.classList.add('fonts-failed');
  console.log('One or more fonts failed to load')
});
```

One important note. In this example we've chosen an all or nothing approach. Either all fonts load successfully or we'll use none of them. I want to make sure that if we use web fonts we remain consistent in the usage. It would look ugly if we were to mix and match the web font stack with the backup.

## Preventing faux fonts

In all our previous examples we've loaded 4 fonts for our Noto Sans font. We do this to prevent faux italic and faux fonts. When the browser finds italic or bold fonts it'll look to see if if a corresponding font (for example notosans\_bold) is available either as a system font or as a loaded web font.

If it is then the browser will use it and everything is fine. If it's not available the browser will synthesize an equivalent to the font we need.

Needless to say synthetic fonts are not the best for any serious typographic work. They may look different in each browser and they generally look different than the main font.

To prevent any of these problems we associate the font with the correct font (bold, italic or bold italic) to make sure that the content is displayed with the correct font.

```css
strong, b {
  font-family: "noto_sansbold";
}

em, i {
  font-family: "noto_italic";
}

strong em,
strong, i,
b em,
b i {
  font-family: "noto_sansbold_italic";
}
```
