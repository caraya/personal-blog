---
title: "Revisiting Bibliotype: Version 1"
date: "2018-08-29"
---

I've been meaning to update Bibliotype to more modern technologies and document the process.

## The original

In 2011 [Craig Mod](https://craigmod.com/) published [Bibliotype](https://craigmod.com/bibliotype/), a [demo](https://craigmod.com/bibliotype/) and an [article](https://alistapart.com/article/a-simpler-page) in a List Apart.

The article explores the nature of physical pages and how they may translate into the digital world, making references to epub3 and iBooks (an encrypted wrapper around the WebKit rendering engine).

Craig also talks about how the notion of a page changes on the web. The content as large as the content in it.

> On the other hand, the physicality of these devices doesn’t represent the full potential of content space. The screen becomes a small portal to an infinite content plane, or “infinite canvas,” as so well [illustrated by Scott McCloud](http://scottmccloud.com/4-inventions/canvas/index.html). Craig Mod -- [A Simpler Page](https://alistapart.com/article/a-simpler-page)

Bibliotype is one of the first attempts at taking advantage of that infinite canvas to publish content.

I love epub... I've created content for it and I keep in touch with people who've done massive amounts of work in the community but the fact that publishers are still creating epub2 content (as opposed to the current epub3 spec) and new specifications at W3C seems to have stalled.

But the web gives you so many more possibilities and so many ways to innovate the reading experience. That's one of the things I want to explore with Bibliotype 2: How much can we leverage new(er) web technologies to enrich the user experience without becoming burdensome to develop.

## The new ideas

These are some of the ideas that I have for the new iteration:

- Clean up the structure of the file
    
    - Recreate the menu so it doesn't depend on positioning to make things look good
- Use [Pointer Events](https://www.w3.org/TR/pointerevents/#the-primary-pointer)
    
    - [PEP](https://github.com/jquery/PEP) as an alternative
- Store settings in the user's browser using [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Storage/LocalStorage)
- Change the CSS to use variables and a `:root` element
    
    - This should make the menu easier to handle
    - Use variable fonts as defaults
    - Roboto for sans-serif
    - Source Serif for serif
    - Decide on what fallbacks to provide for each
    - For browsers that don't support Variable Fonts
    - For browsers that don't support woff2
- Adding Metadata
    
    - Adding JSON-LD for SEO and discoverability
- Adding PWA features
    
    - Create a Web Manifest
    - Create a Service Worker
- Looking forward to what's next
    
    - Background Sync
    - Push Notifications

## Clean up the structure of the content file

Rather than take the existing Bibliotype file I've decided to start from scratch and create a brand new structure that will allow for experimentation and additional work as we start working on the project.

The structure of the project looks like this (content removed for brevity)

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="css/master.css">
  <script defer src="js/bibliotype.js"></script>
</head>

<body>
  <button id="menuButton">Menu</button>
  <div id="menu">
    <h1>Menu</h1>

    <p class="desc">Size</p>
    <button id="bed">bed</button>
    <button id="knee">knee</button>
    <button id="breakfast">breakfast</button>

    <p class="desc">Justification</p>
    <button id="rag">Ragged</button>
    <button id="just">Justified</button>

    <p class="desc">Font Family</p>
    <button id="roboto">Roboto</button>
    <button id="source">Source Serif</button>

    <p class="desc">Contrast</p>
    <button class="lowc">Low</button>
    <button class="highc">High</button>

  </div>


  <div class="content">

    <div class="centered">
      <h1>Monsters of Mars</h1>
      <h2>A Complete Novelette</h2>
      <h3><em>By Edmond Hamemlton</em></h3>
    </div>

    <p>Rest of the content goes here</p>

  </div>

</body>
</html>
```

## Remove dependency on jQuery and jQueryDoubleTap

In the first version of the project, I'm more concerned with removing the jQuery dependency. It would probably be easier to work with jQuery but part of the challenge is to make this work with as few dependencies as possible.

A portion of the Javascript file looks like this:

```javascript
function setRootVar(name, value) {
  let rootStyles = document.styleSheets[0].cssRules[3].style;
  rootStyles.setProperty('--' + name, value);
};

 document.addEventListener('DOMContentLoaded', function(e) {
   const menuButton = document.getElementById('menuButton');
   menuButton.addEventListener('click', function(e) {
     setRootVar('menu-visibility', 'show');
   }, false);

   const roboto = document.getElementById('roboto');
   roboto.addEventListener('click', function(e) {
     setRootVar('body-font', 'roboto');
     setRootVar('body-backup', 'Open Sans');
     setRootVar('body-default', 'sans-serif');
   });

   const source = document.getElementById('source');
   source.addEventListener('click', function(e) {
     setRootVar('body-font', 'Source Serif');
     setRootVar('body-backup', 'Georgia');
     setRootVar('body-default', 'serif');
   });
 });
```

Because we're working with CSS Variables I created a little function that will insert them into the correct rule in the stylesheet. `document.styleSheets[0].cssRules[3].style;` represents the style of the 3rd rule in the first stylesheet of the document. We'll look at that third rule in the SASS/CSS section.

In a future iteration, I'm thinking about replacing the click events with [Pointer Events](https://www.w3.org/TR/pointerevents/) to provide a unified interface for both touch events like those in tablets and the mouse events from our desktop environments.

## Change the CSS to use variables and a :root element

Rather than change each individual item for each individual combination of attributes I have set up a [:root](https://css-tricks.com/almanac/selectors/r/root/) pseudo element with sets of different variables.

The first set (starting with `--roboto`) define Open Type Features of the Roboto font. Combined with CSS classes (not shown) we can enable open type features as needed.

I got the CSS by running the variable font through [Wakamaifondue](https://wakamaifondue.com/).

```scss
:root {
  --roboto-c2sc: "c2sc" off;
  --roboto-dlig: "dlig" off;
  --roboto-dnom: "dnom" off;
  --roboto-frac: "frac" off;
  --roboto-lnum: "lnum" off;
  --roboto-numr: "numr" off;
  --roboto-onum: "onum" off;
  --roboto-pnum: "pnum" off;
  --roboto-salt: "salt" off;
  --roboto-smcp: "smcp" off;
  --roboto-ss01: "ss01" off;
  --roboto-ss02: "ss02" off;
  --roboto-ss03: "ss03" off;
  --roboto-ss04: "ss04" off;
  --roboto-ss05: "ss05" off;
  --roboto-ss06: "ss06" off;
  --roboto-ss07: "ss07" off;
  --roboto-tnum: "tnum" off;
  --roboto-unic: "unic" off;
  --roboto-cpsp: "cpsp" off;
```

The second block contains all the elements that we can manipulate through Javascript, either individually or in groups.

```scss
  // Default Colors
  --bright-bg-color: rgba(255, 255, 255, 1);
  --bright-txt-color: rgba(0, 0, 0, 1);
  // Font and Backup description
  --body-font: "Roboto";
  --body-backup: "Open Sans";
  --body-default: sans-serif;
  // Font and line-height related
  --font-size: 100%;
  --line-height: 1.25;
  --body-font-size: 1rem;
  // Font styling
  --font-weight: "wght" 400;
  --font-width: "wdth" 100;
  --font-italics: "slnt" 0;
  // Width container
  --body-width: 40rem;
  // Menu Visibil3ty
  --menu-visibility: hidden;
  // Justify?
  // in left to right languages, start is
  // equivalent to left
  --content-justify: start;
}
```

So how do we use the CSS variables we defined?

If you look at the body declaration below you'll see how we use the variables to set their values as the attributes.

The syntax is `var(--name-of-variable)` the two dashes (`--`) are required by the [specification](https://www.w3.org/TR/css-variables-1/) as a way to avoid conflict with built-in property declarations.

Font-family uses three properties defined earlier to control the font stack. One of the advantages of CSS variables that are not part of SASS or other pre-processors is that changing the value of the variable will immediately cascade down and change the value everywhere it appears in the document.

This is the full declaration in the SCSS file:

```scss
body {
  background-color: rgba(255, 255, 255, 1);
  color: rgba(0, 0, 0, 1);
  font-size: 1rem;
  line-height: 1.25;
  font-family: Roboto, 'Open Sans', sans-serif;
  text-align: left;
  -webkit-hyphens: manual;
  -ms-hyphens: manual;
  hyphens: manual;
  transition: all linear 0.2s;
  background-color: var(--background-color);
  color: var(--text-color);
  font-family:  var(--body-font),
                var(--body-backup),
                var(--body-default);
  font-size: 1rem;
  line-height: var(--line-height);
  text-align: var(--content-justify);
  -webkit-hyphens: var(--content-hyphenate);
  -ms-hyphens: var(--content-hyphenate);
  hyphens: var(--content-hyphenate);
}
```

I know it looks scary but it's simply the values hardcoded to default values followed by the same declarations using variables where appropriate. There are a couple items I want to highlight.

I've chosen to use a fixed `1rem` size for the body font so I can keep the size of the menu consistent. If I use the `--font-body-size` variable the menu size will grow along with the text.

If changes are going to be noticeable to the user I've used a short transition to make them less jarring. That's the `transition: all linear 0.2s;` item in the body declaration.

### Media Queries, Font Sizes, and Content Width

One of the few things I didn't like about Bibliotype is that it made the assumption that font size is directly related to reading distance.

I don't think this is the case.

In iBooks, for example, I like to set the font larger regardless of the distance I hold the device from my face as I read.

So how do we handle the combination of width and screen sizes?

The best solution I can come with is to split the problem into two areas. Content width and font sizes.

The content width part is easy and it involves setting the value of the `--body-width` to the desired value and hiding the menu, for now, so the text is easier to read. We will handle this via Javascript.

Media queries will handle device orientation. The basic queries look like this:

```css
@media screen and (orientation: landscape) {
  // Content for landscape mode
}

@media screen and (orientation: portrait) {
  // Content for portrait mode
}
```

Inside the queries, particularly the landscape query, we can make any adjustments we need to make to keep the reading experience a pleasant one.
