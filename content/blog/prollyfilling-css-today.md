---
title: "Prollyfilling CSS today"
date: "2016-04-25"
categories: 
  - "technology"
---

One of the most frustrating things from doing CSS development is all the cool things that appear on the horizon that we can't really use right now and won't be able to until browser vendors decide that they can implement in a performant manner and one which will not "break the web". The result is that while there are tens of CSS modules available it is still problematic to polyfill forward (or prollyfill for probably fill) CSS as much as it is to create custom elements with Web Components.

## hitch.js

<iframe width="420" height="315" src="https://www.youtube.com/embed/w6A46iy7wbw?rel=0" frameborder="0" allowfullscreen></iframe>

Hitch.js sounds like an interesting promise. A Javascript library that allows developers to create extensions to CSS (called hitches) and HTML hitches with additional functionality. I like the CSS hitches better than the HTML snippets. The later can be better served with custom elements.It's one polyfill or another, there is no universal support for custom elements... yet

Hitch opens new avenues to experiment with CSS. Take for example the`-media-time` hitch, discussed in the [Hitch's blog](https://hitchjs.wordpress.com/) and dcoumented in this [explainer and spec document](https://docs.google.com/document/d/11UCIy5NmaZsAluWfcwBw7H-m2MWdQjkyna15rMDH3LI/edit). The specification proposes many interesting use cases but it doesn't stop at the proposal, it provides working examples of what the author wants this feature to accomplish so that people deciding on spec inclusion can decide where to add it and if it should be added.

### Basic example

The example below does the following:

- Includes hitch.js
- Uses the custom `data-hitch-interpret` attribute to tell
- Hitch that the styles inside need to be parsed
- Uses `@-hitch-requires` inside the style tag to import the hitch definitions for the tasks we want to accomplish
- The stylesheet contains two elements with the class `car`
- These elements also have a `data-price` attribute
- Two rules use elements from the imported hitch
    
    - The first one selects all `.car` elements where the `data-price`attribute is less than 100,000
    - The second selects the `.car` with the greatest price (the biggest value in the `data-price` attribute)

```markup
< !doctype html>
<html>
<head>
  <title>Hitch Demo</title>
  <meta charset="utf-8"/>
  <script src="https://hitchjs.com/dist/hitch-0.6.3.js"></script>
  <style type="text/css" data-hitch-interpret>
    @-hitch-requires https://www.hitchjs.com/use/bkardell.math/1;

    .car:-math-lessthan(data-price, 200000){
      color: lightseagreen;
    }

    .car:-math-greatest(data-price){
      color: rgb(250, 250, 0);
      font-size: 125%;
    }
  </style>
</head>
<body>

<div>
  <ul>
    <li class="car" data-price='100000'>Porsche 911</li>
    <li class="car" data-price='450000'>Ferrari F40</li>
  </ul>
</div>

</body>
</html>
```

Hitch provides a series of prebuilt libraries or hiteches to accomplish specific tasks. As show above we can target attributes other than the one we are testing. There are also hitches to simmulate element queries and many other functions (see the [Hitch repository](http://www.hitchjs.com/repo/)

But the most interesting thing, from my perspective, is that we can create hitches for specific elements and specific behaviors. Take for example this [external link hitch](http://codepen.io/chriscoyier/pen/vuLlf) from Chris Coyier to accompany his [CSS Tricks article](https://css-tricks.com/an-intro-to-hitch-js-and-the-extensible-web/)

One thing to note in the article is the relationship that Brian Kradell, creator of Hitch, sees between Hitch and Web Components:

> It has some stuff about Web Components, but those were based on an earlier draft. It pre-dates Mozilla’s X-Tags or Google’s Polymer and we have no real interest in competing with them.

```
Hitch.add([{

  type: 'selector',
  name: '-links-external',
  base: '[href]',
  filter: function (match, argsString, o) {
    if (!match.hostname) {
      return false;
    }
    return match.hostname !== window.location.hostname;
  }

}]);
```

The beauty of this hitch is that we don't need to create confusing selectors to indicate external links or create special selectors for them. We just include the hitch on a script on the page, add the corresponding class and we're done.

```
<style data-hitch-interpret>
        a:-links-external() {
            background-color: yellow;
        }
</style>

<p>These should be unstyled because they are not external
        <a href="/">/</a>
        <a href="/index.html">/index.html</a>
        <a href="/sale.html">/sale.html</a>
        <a href="foo/bar.html">foo/bar.html</a>
        <a href="#test">#test</a>
</p>

<p>
        These should be yellow because they are external
        <a href="http://google.com">http://google.com/</a>
        <a href="http://hitchjs.com">http://hitchjs.com</a>
</p>

<p>CodePen link (varies depending on view)
  <a href="http://codepen.io">http://codepen.io</a>
</p>
```

See the full working pen below:

<p data-height="300" data-theme-id="2039" data-slug-hash="vuLlf" data-default-tab="html,result" data-user="chriscoyier" data-embed-version="2" data-editable="true" class="codepen">See the Pen <a href="http://codepen.io/chriscoyier/pen/vuLlf/">Simple Example of Hitch.js</a> by Chris Coyier (<a href="http://codepen.io/chriscoyier">@chriscoyier</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

We could further refine the hitch by adding an external link icon as a background to the link so users can identify internal and external links beyond the background color; or we could further differentiate the links according to file extension... the possibilities are endless.

## Houdini: CSS web components

I first heard of [TAG-CSS Task Force Houdini](https://wiki.css-houdini.org/) at the Chrome Dev Summit last year. By exposing how the CSS parser works and interacts with content it allows potentially limitless expansions to CSS. Houdini takes a longer view approach to new CSS features by going through the W3C standardization process.

If you're familiar with how the W3C and the WHATWG move you'll see something  
similar to the image below:

![](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2016/03/01-standards-process-opt.png "The Standards Process")

It can take years for a feature to move from porposal to generalized use! Vendors tried to use flags to shorten the process and make features available before a proposal was finished so developers could implement it and provide feedback.

We all know how that that turned out... a disaster. The flags were never removed to make sure that functionality would not be broken and, in the end, we ended we end up with several, not always compatbile, implementations of the same property.

Instead of flags Houdini asks what if we could give developers ways see into the CSS pipeline and create functions and selectors that would affect the rendering as it happens. How would functions that tie into the paint, layout and rendering processes.

There are not browsers supporting Houdini APIs yet but the scripts may look like this (Taken from [CSS Script API Level 1](http://bfgeek.com/css-houdini-drafts/css-script-api/Overview.html))

```
window.paintWorker.importScripts('paint.js').then(function(justABool) {
    // May want to notify UI that this is ready.
    // Actually display the content.
});
```

and

```
Promise.all([
    window.styleWorker.importScripts('style.js'),
    window.layoutWorker.importScripts('layout.js')
]).then(function() {
    // Display content, relies on two scripts properly loading.
});
```

> The two scripts above represent ideas of what Houdini APIs may look like. Don't take them for anything other than that.

None of the Houdini proposed APIs are in browsers yet but I am really looking forward to see what they do and whether they will work on environments other than browsers.

## elementqueries.com

[Element queries](#)(http://elementqueries.com/) are the most intriguing of the future facing polyfills. We all have worked with media queries at some point. But it wasn't until recently that I realized some it their shortcomings.

Jason Grisgby's [CSS Media Query for Mobile is Fool’s Gold](http://blog.cloudfour.com/css-media-query-for-mobile-is-fools-gold/) first articulated these issues in 2010. But the case didn't really crystalize for me until I read [Media Queries are a Hack](http://ianstormtaylor.com/media-queries-are-a-hack/) that expanding media queries actually made sense

Media queries work when changing overal dimensions of a layout. In this case, if the width is less than 800px then the font size for the contact element is 0.8em, **regardless of the actual width of the screen**.

```
@media screen and (max-width: 800px) {
  .contact {
    font-size: .8em
  }
}
```

Rather than write ten or more queries to accommodate possible values it would be much nice if we could do this. If the element has 10em to work with then code to that instead of the full width of the parent container:

```
.contact (max-width: 10em) {
  font-size: 0.8em;
}
```

Elementqueries provides a prollyfill to address these type of situations. It also provides a large variety of prebuilt element queries that can enhance your css experience, there is a fuller list with examples at [http://elementqueries.com/](http://elementqueries.com/).

One of the examples that I found the most intriguing was styles for [alternate blockquotes](http://elementqueries.com/demos/blockquote-style.html) which shows a fairly straightforward way of creating alternate styles for something that would be terribly boring otherwise.

The example below uses two element queries, one for a fixed minimum-width in pixels and the other uses percentages with maximum width.

```
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>EQCSS Demo</title>
  <style>

    .maxwidthpercents {
      max-width: 49%;
    }
    @element ".minwidthpixels" and (min-width: 500px) {
      .minwidthpixels {
        background: rebeccapurple;
      }
    }
    &nbsp;  @element ".maxwidthpercents" and (max-width: 50%) {
      .maxwidthpercents {
        background: lightskyblue;
      }
    }
  </style>
</head>
<body>
<article>
  <div class=minwidthpixels>class="minwidthpixels"</div>
</article>
<article>
  <div class=maxwidthpercents>class="maxwidthpercents"</div>
</article>
<script src=//cdnjs.cloudflare.com/ajax/libs/eqcss/1.1.0/EQCSS.min.js>
</script>
</body>
</html>
```

This example forced me to be more careful with how I structure my queries. For a second (actually for most than a day) I forgot that the a block container takes 100% of the width of the parent element (window in this case) so the second rule would never trigger... It was only when someone pointed it out to me after I filed an issue on Github and set the second element's `max-width` to 49% that both examples worked.

Even with this rethinking I like the idea of Element Queries as much if not more than Media Queries. I don't see them as competition but as complementary strategies to make CSS even more flexible than what it already is.

## Looking forward

While none of these technologies and polyfills are nateively supported in browsers Hitch and elementqueries can already be used to play and experiment. Because they polyfill layout I'd be careful in using in production but _who dares wins_ and, who knows, it may work for your bit project after all :-)

## Links and Resources

- [http://www.hitchjs.com/](http://www.hitchjs.com/)
- [hitchjs blog](https://hitchjs.wordpress.com/)
- [Houdini: Maybe The Most Exciting Development In CSS You’ve Never Heard Of](https://www.smashingmagazine.com/2016/03/houdini-maybe-the-most-exciting-development-in-css-youve-never-heard-of/)
- [http://elementqueries.com/](http://elementqueries.com/)
