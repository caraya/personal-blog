---
title: "Loading Fonts"
date: "2015-07-08"
categories: 
  - "typography"
---

Now that we have a better idea of what fonts we want to use and the font stack we'll see how to load them into the page. We'll explore 3 ways: local loading using the _@font-face syntax_, loading fonts using the [Google font API](https://developers.google.com/fonts/docs/getting_started), using Google's [Web Font Loader](https://github.com/typekit/webfontloader/blob/master/README.md) and a new tool called [Font Face Observer](https://github.com/bramstein/fontfaceobserver/blob/master/README.md)

### @font-face

We have been able to use fonts on our web content since the days of IE 3 (3.5 for Macintosh if I remember correctly) but we've always had to contend with font creators and foundries fear of piracy. It's only recently that they have relented and allowed their fonts to be used. The basic syntax, covering all modern browsers, looks like this:

```css
@font-face {
    font-family: 'stone-sans-webfont';
    src: url('../path-to-font-file.eot');
    src: url('../path-to-font-file.eot?#iefix') format('embedded-opentype'),
         url('../path-to-font-file.woff2') format('woff2'),
         url('../path-to-font-file.woff') format('woff'),
         url('../path-to-font-file.ttf') format('truetype'),
         url('../path-to-font-file.svg#stone-sans-webfont') format('svg');
    font-weight: normal;
    font-style: normal;
}
```

And then we associate the font with CSS like we normally would matching the font-family attribute in the @font-face declaration with the font-family attribute of the element where we want to use it:

```css
html {
        font-family: 'stone-sans-webfont', arial, sans-serif;
}
        
```

Since we want to avoid faux bold and faux italics in our content, we add the bold and italics versions of our font to the page and then match them to the correct attributes with selectors similar to this:

```css
strong {
  font-family: 'Stone-Humanist-Semi';
}

em {
  font-family: 'Stone-Humanist-Ita';
}

/*
  When using both we don't care what order they are used in
*/
strong em,
em strong {
  font-family: 'Stone-Humanist-SemiItalic';
}
```

Where _Stone-Humanist-Semi_ is our (semi)bold font, _Stone-Humanist-Ita_ is italics and _Stone-Humanist-SemiItalic_ is the semibold italics combination. Since `<b>` and `<i>` have different semantic meaning in HTML5 I've chosen not to style them.

#### Some things to keep in mind

Adding the font to your site/book/app adds to the overall file size. Depending on the font this may increase the size of your project considerably. Taking [Gentium](http://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=gentium) as an example, the font supports Latin, Greek and Cyrillic character sets but it weighs a hefty 500k for the regular font (in one format out of the 5 formats needed to support multiple browsers/devices). Add Bold, Italic and you get 1.5 Megabytes just for the font! And it may not be the only font you use in the project.

The flipside to this issue of size is that embedding the fonts means they are always available to desktop and mobile browsers readers that support embedding (and it should be all of them.) Choosing what browsers and what versions to support is a different story.

### Google Fonts API

Google has two ways of using web fonts, the first one is directly through their API. Using Google's font API is a two step process. First add the font to your html head element with the following syntax (using Tangerine as an example):

```
<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Tangerine">
```

The link produces a CSS @font-face declaration that we can use in our CSS as normal. The version produced in Chrome and Firefox uses the [woff2](http://www.w3.org/TR/WOFF2/) format

```css
@font-face {
  font-family: 'Tangerine';
  font-style: normal;
  font-weight: 400;
  src: local('Tangerine'), url(http://fonts.gstatic.com/s/tangerine/v6/HGfsyCL5WASpHOFnouG-RJBw1xU1rKptJj_0jans920.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000;
}
```

While Safari uses True Type to render the font.

```css
@font-face {
  font-family: 'Tangerine';
  font-style: normal;
  font-weight: 400;
  src: local('Tangerine'), url(http://fonts.gstatic.com/s/tangerine/v6/HGfsyCL5WASpHOFnouG-RCZ2oysoEQEeKwjgmXLRnTc.ttf) format('truetype');
}
```

As you can see the advantage of using the APi is that we don't need to use multiple formats in our @font-face declaration. Google takes care of that for us.

The obvoius disadvantage is that this only works online. That's why a fallback option or options is even more important when working with the API. If we're offline or connectivity is limited we want a good fallback font.

### Google web font loader

One of the things neither the font API or directly downloading the content doesn't address is the "flash of unstyled text." According to the [Typekit Help Center](http://help.typekit.com/customer/portal/articles/6852-Controlling-the-Flash-of-Unstyled-Text-or-FOUT-using-Font-Events):

> Fonts are loaded as assets into a web page—just like images or video. Depending on your browser or your connection speed, they can load quickly or lag behind the rest of the page. Different browsers handle font loading differently; for example, Safari and Chrome will refrain from displaying text set in a web font until the font has loaded, while Internet Explorer won’t show anything on the page until the font loads. Meanwhile, Firefox will display the site with the fallback fonts in the font stack, and then switch to the linked fonts after they’ve finished loading. This results in a flash of unstyled text, or FOUT.

Typekit, in collaboration with Google, has created loader library to make working with type easier. It works by adding scripts to the page that load the library and tell it what fonts to download and use. For example to load the Droid Sans font from Google you'd use code like this:

```markup
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js"></script>
<script>
  WebFont.load({
    typekit: {
      id: 'xxxxxx'
    },
    custom: {
      families: ['Droid Sans', 'Source Code Pro'],
    },
    google: {
      families: ['Droid Sans', 'Droid Serif'],
      text: 'abcdedfghijklmopqrstuvwxyz!'
    },
    fontdeck: {
      id: 'xxxxx'
    },
    monotype: {
      projectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      version: 12345 // (optional, flushes the CDN cache)
    }
  });
</script>
```

Or using asynchronous loading:

```javascript
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.5.10/webfont.js"></script>
<script>
  WebFontConfig = {
    google: { families: [ 'Lora:400,700,400italic,700italic:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

<noscript>
  <link href='http://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
</noscript>
```

For an explanation of the values for each foundry check the Font Loader's [readme file](https://github.com/typekit/webfontloader/blob/master/README.md) in Github.

The font loader creates a set of events, both CSS and Javascript, for developers to interact with. This is similar to the way Modernizr handles feature detection. The Javascript classes are:

- loading - This event is triggered when all fonts have been requested.
- active - This event is triggered when the fonts have rendered.
- inactive - This event is triggered when the browser does not support linked fonts or if none of the fonts could be loaded.
- fontloading - This event is triggered once for each font that's loaded.
- fontactive - This event is triggered once for each font that renders.
- fontinactive - This event is triggered if the font can't be loaded.

CSS events are implemented as classes on the html element. The following classes are set on the html element and correspond to the descriptions above:

- .wf-loading
- .wf-active
- .wf-inactive
- .wf-<familyname>-<fvd>-loading
- .wf-<familyname>-<fvd>-active
- .wf-<familyname>-<fvd>-inactive

The <familyname> placeholder will be replaced by a sanitized version of the name of each font family in lowercase with only alphanumeric characters. For example, Droid Sans becomes droidsans. The <fvd> placeholder is a [Font Variation Description,](http://typekit.github.io/fvd/) a shorthand for describing the style and weight of a particular font.

#### So why would we use the Font Loader?

In short: to make the user's experience less jarring. Since fonts are downloaded as any other resource in your web page. If we use the following font stack: `'stone-sans-webfont', arial, sans-serif`, we can then use the Font Loader Defined classes to make the transition to our fonts smoother and better looking. Let's look at one possibility:

```css
.wf-inactive body{
  font-family: arial, sans-serif;
  line-height: 1.4em;
}

.wf-active body {
  font-family: 'stone-sans-webfont', arial, sans-serif;
  line-height: 1.3
}
     
```

`.wf-inactive` indicates that loading the font or fonts (in this case we are using one) has not started. To make sure that the user doesn't see a system fault we provide a fallback option while the web font(s) are loading. This may be an instant or maybe several seconds in a slow or congested network connection (try Starbucks on a Sunday afternoon.)

Once the font(s) load, the class will switch to `.wf-active` where we put out web font stack and attributes related to font. In this case I only added a different line-height attribute to the selector but you can be as detailed as you want.

One last detail: **What happens if Javascript is disabled?**

If you're fonts are loaded from google you can revert back to using the Google API to load your fonts. You can do something like:

```markup
<noscript>
  <link href='http://fonts.googleapis.com/css?family=Roboto:700italic,300,700,300italic' rel='stylesheet' type='text/css'>
</noscript>
```

### Font Face Observer

As good as the Webfont Loader is good it causes some Flash of Invisible text when the fonts load and the browser switches from the system fonts to the webfonts it just loaded. The script for the Webfont Loader must be placed in the `head` of the document with all the performance pitfalls inherent to it.

Font Face Observer, a fairly new delivery mechanism developed by Adobe Typekit engineer Bram Stein, uses JavaScript’s scroll events to load and monitor web fonts. Unlike the Web Font Loader, the Font Face Observer can be referenced at the end of document to avoid the extra overhead. Scott Jehl's approach, as documented in the [Filament's Group blog](http://www.filamentgroup.com/lab/font-events.html) and is the system we'll discuss below. The full page is shown below and will be explained as we go along.

```markup
<!DOCTYPE html>
<!--#if expr="$HTTP_COOKIE=/fonts\-loaded\=true/" -->
<html lang="en" class="fonts-loaded">
<!--#else -->
<html lang="en">
<!--#endif -->
<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="viewport" content="width=device-width">
  <style>
  @font-face {
    font-family: 'Lora';
      src: url('lora-regular.woff2') format('woff2'),
           url('lora-regular.woff') format('woff'),
           url('lora-regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Lora';
      src: url('lora-italic.woff2') format('woff2'),
           url('lora-italic.woff') format('woff'),
           url('lora-italic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
    }
    body {
        font-family: serif;
  }
    .fonts-loaded body {
        font-family: Lora, serif;
  }
</style>
</head>
<body>
    <p><!-- paragraph text --></p>
    <script src="fontfaceobserver.js"></script>
    <script>
    (function( w ){
    if( w.document.documentElement.className.indexOf( "fonts-loaded" ) > -1 ){
        return;
    }
    var font1 = new w.FontFaceObserver( "Lora", {
        weight: 400
    });
    var font2 = new w.FontFaceObserver( "Lora", {
        weight: 400,
        style: "italic"
    });
    w.Promise
        .all([font1.check(), font2.check()])
        .then(function(){
            w.document.documentElement.className += " fonts-loaded";
        });
    }( this ));
    </script>
</body>
</html>
```

The first thing we do is to use Server Side Includes, a way to have the server generate pieces of content for the web, to add the `fonts-loaded` CSS class if the corresponding cookie has already been set. In this way the loader will only use the fonts if they've been already been loaded, otherwise it will not add the class and the process will continue.

```markup
<!--#if expr="$HTTP_COOKIE=/fonts\-loaded\=true/" -->
<html lang="en" class="fonts-loaded">
<!--#else -->
<html lang="en">
```

While still in the head of the document we load our fonts using the @font-face syntax we discussed earlier and associate the fonts with the css needed. Note that we have two classes for the body, a plain one where only system fonts are used and a version with the fonts-loaded class where the webfont is the primary and the system font is our backup.

```markup
  <style>
  @font-face {
    font-family: 'Lora';
      src: url('lora-regular.woff2') format('woff2'),
       url('lora-regular.woff') format('woff'),
       url('lora-regular.ttf') format('truetype');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'Lora';
      src: url('lora-italic.woff2') format('woff2'),
       url('lora-italic.woff') format('woff'),
       url('lora-italic.ttf') format('truetype');
    font-weight: 400;
    font-style: italic;
  }

  body {
    font-family: serif;
  }
  .fonts-loaded body {
    font-family: Lora, serif;
  }
</style>
```

At the bottom of our pages, along with all the other scripts, we add a link to the fontfaceobserver library. The second script begins with a conditional check to see if the `class-loaded` class hs been added to the root element (html); if it has been then quit, there is nothing left to do.

We next define variables for each of the fonts we will use in our document. This will be used in the last part of the script, discussed below.

```markup
<script src="fontfaceobserver.js"></script>
<script>
(function( w ){
  if( w.document.documentElement.className.indexOf( "fonts-loaded" ) > -1 ){
      return;
  }
  var font1 = new w.FontFaceObserver( "Lora", {
      weight: 400
  });
  var font2 = new w.FontFaceObserver( "Lora", {
      weight: 400,
      style: "italic"
  });
    
```

The last part of the script uses a JavaScript [promise](http://www.html5rocks.com/en/tutorials/es6/promises/). Once both promises fulfill it will add the `fonts-loaded` class to the document (root) element, in this case, html.

```markup
w.Promise
  .all([font1.check(), font2.check()])
  .then(function(){
      w.document.documentElement.className += " fonts-loaded";
  });
}( this ));
    </script>
```

The next result is that the fonts will be loaded asynchronously and that the system font assigned to an element will only change after the font has loaded. This prevents flashes of unstyled content and flashes of invisible content. But in the end which font loading strategy you use is up to you.

### Links and Resources

- [Delivering Web Fonts](https://prowebtype.com/delivering-web-fonts/#observer) chapter from Professional Web Typography
- [Font Loading Revisited with Font Events](http://www.filamentgroup.com/lab/font-events.html)
- SSI instructions for [Apache HTTPD](http://httpd.apache.org/docs/current/howto/ssi.html)
- SSI instructions for [Nginx](http://nginx.org/en/docs/http/ngx_http_ssi_module.html)
