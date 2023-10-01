---
title: "Kerning"
date: "2015-07-29"
categories: 
  - "typography"
---

[![kerning](https://publishing-project.rivendellweb.net/wp-content/uploads/2015/07/kerning.png)](http://xkcd.com/1015/)

> Kerning can refer to one of two things: spacing instructions that type designers put into font files to mitigate awkward character combinations, or spacing adjustments that graphic designers make as they typeset

In this section we will only discuss the second definition of Kerning. We will cover both the built-in CSS kerning features and [Lettering.js](http://letteringjs.com/), a Javascript library that provides enhanced support for kerning and other formatting using CSS. The idea is to adjust the kerning without having to do any refactoring of the content.

Automatic kerning in CSS depends on [Open Type Features](#open-type-features), particularly in the kerning attribute being enabled. This will change from font to font and is embedded in the font when created.

\[codepen\_embed height="618" theme\_id="2039" slug\_hash="RPZrKv" default\_tab="result" user="caraya"\]See the Pen [Automatic Kerning](http://codepen.io/caraya/pen/RPZrKv/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

There may situations where you want a less uniform kerning based on specific attributes. We can control the kerning between letters, as in example 8-2, below. The first paragraph has normal kerning; the second paragraph has letters spaced 0.25em; and the third one has a negative kerning of 0.25em.

\[codepen\_embed height="618" theme\_id="2039" slug\_hash="rVzxyz" default\_tab="result" user="caraya"\]See the Pen [Kerning using word spacing](http://codepen.io/caraya/pen/rVzxyz/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

Another way to work with kerning is to change letter spacing within words as in example 8-3. Notice the difference between the example above using word spacing and the one below using letter spacing: When we kern letters the text looks significantly different than when we work with words.

\[codepen\_embed height="475" theme\_id="2039" slug\_hash="ZGJQjX" default\_tab="result" user="caraya"\]See the Pen [Kerning using letter spacing](http://codepen.io/caraya/pen/ZGJQjX/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

As with many other things in the web, different browsers have different levels of support for kerning. This makes the feature another prime candidate for Autoprefixer. If you're not inclined to automate, you can do something like this:

```css
div#kerningExample {
  border: 1px solid #cc092f;
  padding: 1em;
  width: 100%;
  text-rendering: optimizeLegibility;
  -moz-font-feature-settings: "kern";
  -moz-font-feature-settings: "kern=1";
  -ms-font-feature-settings: "kern";
  -o-font-feature-settings: "kern";
  -webkit-font-feature-settings: "kern";
  font-feature-settings: "kern";
}
```

There are multiple entries for Firefox (indicated as -moz-font-feature-settings) indicating that the format for the feature changed in an incompatible way.

The version for Opera (-o-font-feature-settings) is for older versions before adopting Blink.

### Using Lettering.js

One of the biggest drawbacks of using CSS Kerning is that it only work with all letters and all words in a document. If you want to work at a finer level you have to work with libraries like [Lettering.js](http://letteringjs.com/).

Lettering.js is a jQuery plugin that will automatically add tags (span) and class names to letters, words or lines depending on how we call the plugin. We can then style each individual class as we see fit.

You can wrap spans around characters, words, lines and combination of the three to get as tight a control over the text style as you need or want. Because it insert classes, designers must be careful to use it in headings or small chunks of text or it will affect performance.

Working with Lettering.js is a three step process.

Following the [Lettering.js Wiki Example](https://github.com/davatron5000/Lettering.js/wiki/Wrapping-letters-with-lettering()) we will use this as our example text:

```
<h1 class="fancy_title">Some Title
```

First, we need to load and initialize the plugin as you would any other plugin:

```markup
<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.lettering.min.js"></script>
<script>
$(document).ready(function() {
  $(".fancy_title").lettering();
});
</script>
```

Contrary to what most people tell you, I put all my script initializers and loaders at the bottom of my file to make sure that there is content loaded before I initialize code that will change it. It's always been a catch 22.

If you let your content load before scripts and stylesheets are loaded then the content will flash and change as the stles modify the way the content looks and behaves. But if you put the scripts and style sheets first then they will all have to load before the content is displayed and that may take significantly long (at least in web terms) up to several seconds.

> Web performance patterns advise that you put Javascripts at the bottom of your page before your `</body>` tag. There is an unfortunate side effect where you may experiences a [FOUT (Flash of Unstyled Text)](http://paulirish.com/2009/fighting-the-font-face-fout/) when you're manipulating your text after the DOM has loaded. Unfortunately, we found the best solution to avoid/minimize the FOUT caused by this plugin is to put your scripts (jQuery, Lettering.js) in the document `<head>`. On the one hand, your page will load slower. On the other hand, a flash/restyling makes your site feel slow. Users might ultimately feel the site is faster if they don't see the FOUT.
> 
> Dave Rupert. Lettering.js [Readme](https://github.com/davatron5000/Lettering.js/blob/master/README.md)

The result will appear like this:

```markup
<h1 class="fancy_title">
  <span class="char1">S</span>
  <span class="char2">o</span>
  <span class="char3">m</span>
  <span class="char4">e</span>
  
  <span class="char6">T</span>
  <span class="char7">i</span>
  <span class="char8">t</span>
  <span class="char9">l</span>
  <span class="char10">e</span>
```

Which then we can style with CSS looking something like this:

```css
.fancy_title .ch2 {
         margin-left: -.0125em;
         color: purple;
}
```

We can be even more detailed in how we break our content out and how much we style it. In the example below:

```
<h1>My Three Sons</h1>
```

```markup
<script>
  $("h1").lettering('words').children('span').lettering();
</script>
```

The lettering invocation will create spans for words and then it will split each word into its component characters, producing HTML like the one below:

```markup
<h1>
  <span class="word1">
    <span class="char1">M</span>
    <span class="char2">y</span>
  </span>
  <span class="word2">
    <span class="char1">T</span>
    <span class="char2">h</span>
    <span class="char3">r</span>
    <span class="char4">e</span>
    <span class="char5">e</span>
  </span>
  <span class="word3">
    <span class="char1">S</span>
    <span class="char2">o</span>
    <span class="char3">n</span>
    <span class="char4">s</span>
  </span>
</h1>
```

Although, as mentioned earlier, this is not good for larger chunks of text the posibilities for headings and smaller pieces of text are only limited by your imagination.

### Links and resources

From MDN

- [https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing)
- [https://developer.mozilla.org/en-US/docs/Web/CSS/word-spacing](https://developer.mozilla.org/en-US/docs/Web/CSS/word-spacing)

Other resources

- [http://www.elliotjaystocks.com/blog/kerning/](http://www.elliotjaystocks.com/blog/kerning/)
- [Kerning on the web](http://blog.typekit.com/2014/02/05/kerning-on-the-web/)
- [Type Study: and example of Lettering.js](http://blog.typekit.com/2011/01/06/type-study-an-example-of-lettering-js/)
- [Type study: A better kerning experience with Kern.js](http://blog.typekit.com/2011/06/03/type-study-a-better-kerning-experience-with-kern-js/)
- [Torture Kerning](http://ilovetypography.com/2007/09/15/type-torture-kerning/)

\[caption width="357" align="aligncenter"\][![If you really hate someone, teach them to recognize bad kerning](//imgs.xkcd.com/comics/kerning.png)](http://xkcd.com/1015/) If you really hate someone, teach them to recognize bad kerning\[/caption\]
