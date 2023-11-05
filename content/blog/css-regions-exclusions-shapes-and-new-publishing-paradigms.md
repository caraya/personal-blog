---
title: "CSS regions, exclusions, shapes and new publishing paradigms"
date: "2013-10-22"
categories:
  - "design"
  - "technology"
  - "tools-projects"
---

## Introduction

Smashing Magazine [Newspaper Designs](http://www.smashingmagazine.com/2008/02/11/award-winning-newspaper-designs/) article shows examples of what printed media can do. Having learned to use InDesign for ePub-based ebooks I've come to respect the power and flexibility of printed media… working primarily in web environments I've always wondered what it would take to do similar layouts.

Over the last year at the two [HTML5 Developer Conferences](http://html5devconf.com/) I've heard more and more about new CSS technologies that would make print-like layouts possible:Regions, Shapes and Exclusions.

[Adobe](http://html.adobe.com/) has been championing these technologies, not surprising since they also create DTP and Layout programs.

While these technologies (Exclusions, Shapes and Regions) are still experimental and supported by a limited number of browsers, it is still an exciting possibility for designers and developers. We can match print layouts (almost) in our web content.

## Supported browsers

These technologies are still experimental and subject to change. Best place to keep up to date with the development of these CSS specs is the W3C site. Adobe may also have updated articles and tutorials.

**The following browser supports the standard:**

- IE, IE Mobile (-ms- flag)
- Webkit nightly (-webkit-flag)
- iOS (-webkit- flag)
- Fully supported on iOS 7
- Chrome Canary

    - Enable with Enable CSS Regions flag
    - For Chrome 23 and later enable with: Enable experimental WebKit features)
    - Latest Chrome Nightly uses Enable Experimental Web Platform Features to enable regions


## Can we use this for publishing projects now?

While the technology is available and work to reach full recommendation status continues on the W3C's [CSS working group](http://www.w3.org/Style/CSS/) we can still play with the technology and crete prototypes.

It may be a while, if ever, before ebook readers' rendering engines catch up wit the standard but let's remember that we can build web applications that will run on both Kindle Fire and iOS devices. These applications can use [polyfills](http://remysharp.com/2010/10/08/what-is-a-polyfill/) to accomplish the same or similar functionality using something like [Modernizr.load](http://modernizr.com/docs/#load) or similar loader libraries. How to do polyfill work will be explained later.

## Regions

Regions allow you to create flows of content inside your web content.

For those familiar with InDesign think of regions as threaded text frames that can then be laid out and changed as needed without having to change the layout of all spreads just to make one change.

For those not familiar with InDesign, regions and flows look something like this:

![](images/flow-example.png)

### Getting Started

In supported browsers the code for something like the example above is fairly simple. Code First, explanation later

CSS code:

```

#source {
    -webkit-flow-into: main-content;
    -ms-flow-into: main-content;
}

.region {
    -webkit-flow-from: main-content;
    -ms-flow-from: main-content;
  height:300px;
  border: 1px solid #f00
}
```

The `#source` element creates the flow for our regions. This text will disappear from the regular flow of text and will be placed in our regions.

Every container with the class `.region` will be used to flow the text into. We can position the regions any way we want and use other CSS tools such as flexible boxes layouts, animations and transitions to place our content.

Combining the HTML below:

```
<div id="source">Some long chunk of text goes here</div>

<div class="region"></div>
<div class="region"></div>
<div class="region"></div>
<div class="region"></div>
```

with the CSS that we looked at earlier will produce a result like the one in the [Codepen](http://codepen.io/) below:

<p data-height="492" data-theme-id="2039" data-slug-hash="staCu" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/staCu">CSS Regions Example #1</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

One thing to notice is that the `#source` disappears from the flow of your page's content and only appears once, on our regions. This will be interesting later when we start working with multiple flows in the same layout.

### Moving the regions around

We have our basic regions layout... it's nothing to write home about, is it? Let's do something about it.

We will change the regions on our HTML to add an `ID` attribute to each. Our HTML code now looks like this:

```

<h1>Positioned Regions</h1>

<p>Each of the 4 regions (marked with a 1px red border) below has been positioned using CSS attributes (top and left)</p>

<div id="reflowing-content">
  <div class="region" id='region1'></div>
  <div class="region" id='region2'></div>
  <div class="region" id='region3'></div>
  <div class="region" id='region4'></div>
</div>

<div id="source">Some long chunk of text goes here</div>
```

I have added a wrapper div to the regions called reflowing-content. This allowed me to use absolute positioning on the regions inside.

I also added individual ID attributes to each region so we can style them independent from each other. In the first version of our code, all regions got the same style... simple but not really useful.

Now that we've identified each region on our content we will play with style. We will change the size of the region and play with their positions.

```

#source {
    -webkit-flow-into: main-content;
    -ms-flow-into: main-content;
}

#reflowing-content {
  position: absolute;
}
.region {
    -webkit-flow-from: main-content;
    -ms-flow-from: main-content;
  position:absolute;
  width: 300px;
    height: 400px;
  border: 1px solid red;
}

#region1 {
    left: 10px;
}

#region2 {
  left: 320px;
}

#region3 {
  top: 420px;
    left: 10px;
}

#region4 {
    top: 420px;
    left: 320px;
}
```

The resulting modifications produce the result below:

<p data-height="257" data-theme-id="2039" data-slug-hash="CLFEk" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/CLFEk">CSS Regions Example2: Positioned flow</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

### Making it more flexible

Now we get to what, for me, is one of the hardest parts of working with CSS across browsers and sometimes even within versions of a browser: relative positioning. Whenever I get confused or need a refresher for the different positioning values and the resulting layout, I go to [CSS Positioning 101](http://alistapart.com/article/css-positioning-101/), a 2010 article in [A List Apart](http://alistapart.com/) that still helps me make sense of the mess in the positioning game (or my head, haven't quite decided where the problem really lies).

The example in the previous section uses absolute positioning to layout the content. It works but it lacks flexibility or responsiveness

So we'll change the CSS to make the code more responsive while keeping the HTML the same. The new CSS looks like the one below:

```
html, body {
  width: 100%;
}

#source {
    -webkit-flow-into: main-content;
    -ms-flow-into: main-content;
    flow-into: main-content;
}

.region {
    -webkit-flow-from: main-content;
    -ms-flow-from: main-content;
    flow-from: main-content;
  position:relative;
  width: 300px;
    height: 400px;
  border: 1px solid red;
}

#region1, #region3 {
    left: 10px;
}

#region2, #region4 {
  left: 320px;
}
```

Changing the regions' positioning to relative allows us more flexibility. While we can keep the order of the elements, we can now position them anywhere in the screen we want. In developing the example below I also played with negative values for the top element to move content up from its original position.

<p data-height="517" data-theme-id="2039" data-slug-hash="cCqnD" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/cCqnD/">CSS Regions Example3: Positioned flow with relative elements</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

### Will this work with older browsers?

As mentioned earlier, the technology is still experimental and supported wither through css vendor prefixes (Webkit and Microsoft) or behind a flag (Chrome Canary and, I believe, release).

So how do we make it work?

This is where polyfills and resource loaders come into play. While no browser supports regions out of the box, Adobe has provided a polyfill for regions that levels the playing field while the technology is in development.

[Modernizr.load](http://modernizr.com/docs/#load) (also know as [yepnope.js](yepnopejs.com)) allows you to conditionally load javascript based on Modernizr tests. The example below makes sure we supports both columns, shapes and regions before we do anything:

```
Modernizr.load([
  {
    // List of things we need
    test :
            Modernizr.regions
            && Modernizr.shapes
            && Modernizr.columns,
    // Modernizr.load loads css and javascript as needed
    nope : ['css-regions-polyfill.js', 'css-regions-polyfill.css']
  }
]);
```

In the code above we test to see if the browser supports regions, shapes and columns. If it does then we do nothing, everything is good, we have a cool browser and we move on.

For browsers who do not support the technologies we are using, we load a JavaScript polyfill and the corresponding CSS file; while older browsers will not have the exact same experience as newer browsers, they will get enough of the experience for it to work.

Adobe has created a [CSS regions polyfill](https://github.com/adobe-webplatform/css-regions-polyfill) as a research platform while the standard is finalized. The polyfill introduces the -adobe prefix as a way to avoid collisions with other vendor prefixes and the un-prefixed recommendation.

### Final Example

We will take one of our example images from the top newspapers and convert it into a fluid web layout that uses regions and shapes to layout multiple flows of content in the same page.

![dmn7](11/dmn7.jpg)

I know that you can do some of the same things that you use regions for. It is true that the CSS uses a combination of flexbox and regions. The looks of the example are a limitation of my skills with CSS and not necessarily a reflection of the recomendations and their implementations.

I will continue working on this final example in Codepen. Comments and feedback asked for and encouraged.

<p data-height="257" data-theme-id="2039" data-slug-hash="apnou" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/apnou">apnou</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

#### Outstanding Issues and Questions

As seen in the examples above, learning how to work with regions can be a big challenge but it's one that I think it's going to be worth it in the long run; that said there are still some questions I haven't been able to figure out and that I'm throwing out there for comments and possible solutions :)

1. **How do you deal with scroll overflow?**

## Shapes

The CSS shapes recommendations are like Drop Caps or floated images on steroids.

For the unintiated drop caps are the large letters used in the first paragraph of a chapter or a page. The CSS code for a drop cap may look something like this:

```
p:first-child:first-letter {
    float: left;
    color: #903;
    font-size: 75px;
    line-height: 60px;
    padding-top: 4px;
    padding-right: 8px;
    padding-left: 3px;
    font-family: Georgia;
}
```

The code above will take the first letter (using the first letter pseudo class) of the first paragraph child (using the first-child pseudo class) and apply the style above.

### Why use them

Even when we use the float CSS property we can't float content fully around an image; you can only float the text to one side of the image and, as far as I know, you are limited to floating block objects.

Shapes give you control of the shape (duh) that the content is floated.

Furthermore, shapes allow to float text both inside and outside the shape you've defined. Once again we get close to professional print layouts for our web content.

### Supported browsers

Support for shapes is in a much larger flux than regions as no single browser supports the complete recommendation. That said Adobe maintains an up to date compatibility table for the different shape attributes.

### How to use shapes?

The simplest example is to use them alongside floated content. In the example below we've taken the [Dunetocat image from Github](http://octodex.github.com/dunetocat/) and floated it both left and right and used CSS shapes and float attributes.

```
<div id="container">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Cras feugiat est et turpis scelerisque auctor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Etiam vehicula lectus   vel leo pharetra malesuada. Nulla risus magna, vulputate id elit quis, luctus ullamcorper ligula. Nam at faucibus massa, sed elementum tellus. Proin et dictum ligula. </div>
```

```
#container{
  border: 1px solid blue;
}

.float-left {
  float: left;
  shape-outside: rectangle(0, 0, 100%, 100%, 60%, 50%);
}

.float-right {
  float: right;
  shape-outside: rectangle(0, 0, 100%, 100%, 40%, 50%);
}
```

In the codepen below notice the way in which the text wraps around the text around the image and how it is wrapped differently depending on where the object is placed. You can play with the values for the rectangle **shape-outside** CSS property to see how the wrapping changes.

<p data-height="511" data-theme-id="2039" data-slug-hash="JuBeF" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/JuBeF">Shape example 2: Shape Inside</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

The next easiest example is to use shape inside to put our text inside a shape. We are flowing the content using regions like we did above and then shape the area we are flowing our content to and use the CSS **shape-inside** property to define the shape we are flowing our content into... in this case a circle.

```
<div id="region1"></div>

<div id="content" align="justify">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Etiam vehicula lectus vel leo pharetra malesuada. Nulla risus magna, vulputate id elit quis, luctus ullamcorper ligula. Nam at faucibus massa, sed elementum tellus. Proin et dictum ligula. Nulla rutrum bibendum mauris et porttitor. Donec luctus, ante vitae tincidunt ultricies, mi leo ultrices lacus, ac elementum urna metus in lorem. Suspendisse non feugiat risus. Nullam congue a est nec consequat. Aliquam gravida sem sit amet tellus vulputate sollicitudin. Cras feugiat est et turpis scelerisque auctor.
<div>
```

```
#content {
  flow-into: flow;
  font-size: 11pt;
  hyphens: auto;
}
#region1 {
  flow-from: flow;
  width: 200px;
  height: 200px;
  background-color: #9BBCE3;
  shape-inside: circle(50%, 50%, 50%);
```

As usual you can play with the CSS definitions on the Codepen below to test what would happen if you make changes in the shape you're flowing your content into.

<p data-height="629" data-theme-id="2039" data-slug-hash="JuBeF" data-user="caraya" data-default-tab="result" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/JuBeF">Shape example 2: Shape Inside</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a></p>

### Getting fancy

There are areas of the regions specification that I will touch on briefly because they are just the "nitpicky" aspects or regions. To check if a property is support in any of the supported browsers (if it's supported at all) check Adobe's [shapes support matrix](http://html.adobe.com/webplatform/layout/shapes/browser-support/)

If the browser supports the techniques they are cool to play with and, when they work, they lend a more precise and professional look to our web content.

### Defining Complex Shapes

Defining anything beyond simple circles and rectangles is a pain in the butt, isn't it? Wouldn't it be nice to have a **visual** tool available to help us plot all the points on the image? Adobe's [Bear Travis](https://twitter.com/bear_travis), has made available a collection of tools that can help you when working with complex CSS shapes. The tools are hosted on github at<http://betravis.github.io/shape-tools"> and they are very useful unless you want to learn how to calculate shapes on your own.

## Exclusions

Exclusions are a complement to shapes that will tell the browser engine how to float the content. and will let you exercise a much finer level of control regarding how the content is floated.

### What they are

Exclusions allow you to float arbitrarily shaped objects using values created using CSS shapes and attach additional properties that will allow you to float the content in different ways.

Exclusions are expressed using CSS attributes wrap-around and wrap-through.

### Browser support

Surprisingly, at least for me, exclusions are only supported on IE 10+ (I imagine IE 11 will support them too). If in doubt, please test with Chrome Canary, WebKit Nightly and IE10 or IE11 Developer's preview.

### How to use them

The first example we'll look at is text wrapping around a straight image. We will use the same code that we used on our first shape example and modify it slightly:

```
Big Example Title

      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Cras feugiat est et turpis scelerisque auctor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Etiam vehicula lectus vel leo pharetra malesuada. Nulla risus magna, vulputate id elit quis, luctus ullamcorper ligula. Nam at faucibus massa, sed elementum tellus. Proin et dictum ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Cras feugiat est et turpis scelerisque auctor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Etiam vehicula lectus

        This is a test
```

```
    <p>This is a major quote for this document and we'll have to offset it from the rest of the text</p>
  </div>
```

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Cras feugiat est et turpis scelerisque auctor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Etiam vehicula lectus vel leo pharetra malesuada. Nulla risus magna, vulputate id elit quis, luctus ullamcorper ligula. Nam at faucibus massa, sed elementum tellus. Proin et dictum ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Cras feugiat est et turpis scelerisque auctor.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae tempor ipsum, tempor placerat nisi. Etiam vehicula lectus

With the following CSS:

```
#container {
  position: relative;
  padding: 20px;
  border: 1px solid red;
  width: 90%;
  text-align: justify;
  column-count: 2;
}
```

.excluded { background: #0ff; opacity: 0.6; padding: 10px; width: 150px; height: 150px; left: 45%; **position: absolute;** shape-outside: rectangle(0, 0, 100%, 100%); float:left; wrap-flow: both; }

## **Currently the example above Only works in IE 10 using the -ms vendor prefix**

### The final example

Larger and more complex example, including both regions and shapes is forthcoming
