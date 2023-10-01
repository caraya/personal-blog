---
title: "New in the CSS horizon: CSS Flexbox"
date: "2016-01-27"
categories: 
  - "technology"
---

> This is an update of sorts for [Flexboxes and the holy grail](https://publishing-project.rivendellweb.net/flex-boxes-and-the-holy-grail/) with better code and better explanations

 

> Note: All code examples in this section use [autoprefixer](https://css-tricks.com/autoprefixer/) to avoid writing vendor prefixes by hand and future proofing the code. Codepen allows you to automatically use autoprefixer in all your pens.

I was surprised that [Flexbox](http://www.w3.org/TR/css3-flexbox/) is only at the candidate recommendation level as it's been around for a while. It is supported across all modern desktop and mobile browsers ([according to caniuse.com](http://caniuse.com/#search=flex)) and even older broser support means we need to use different prefixes and, ocassionally, a different syntax without droping flexbox altogether.

One of the first things that attracted me to flexbox was using it to make an even navigation bar. The full example looks like this

<p data-height="392" data-theme-id="2039" data-slug-hash="zvygLR" data-default-tab="result" data-user="caraya" data-preview="true" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/zvygLR/">Example of Flex Navigation Layout</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

If you pay attention to the CSS, the only extra thing we did was add to attributes to nav ul: `display: flex;` and `justify-content: space-between;`.

> Granted, we've abused some of Flexbox's default behavior and assumed that the flexbox items would be laid out in rows. This may not always be the case so wherever possile I strongly suggest not relying on default like I did in the examples above.

Once that is working, we can start playing with different ways to use `justify-content` . Legal values for the property are:

- flex-start
- flex-end
- center
- space-around
- space-between

Because we can use flexbox when aligning both rows (the default) and columns the values for justify content change based on the value of the `flex-direction` property.

If we use `space-around` as the value for justify content we get something like the code below (edit in Codepen to see the full efect):

<p data-height="235" data-theme-id="2039" data-slug-hash="QjYLpq" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/QjYLpq/">Example of Flex Navigation Layout - space-between</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

The values for flex-direction are:

- row
- row-reverse
- column
- column-reverse

The use for row and column are self explainatory. The uses for `row-reverse` and `column-reverse` deserve a little explanation.

Reverse values will display the content of the flex items in reverse without changing the document order for the items. This means we can change the way flex items are displayed on the screen withoug changing the way they read using assistive technology devices or having to change the HTML we write.

One last thing to do with the navigation is to make sure the items actually fill the space they take. Otherwise the layout works but looks ugly. The additional code looks like this:

<p data-height="245" data-theme-id="2039" data-slug-hash="VvgZVa" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/VvgZVa/">Example of Flex Navigation Layout - Media Query &amp; Elemen Fill</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

OK, we got a navigation bar. Now let's see what more we can do with Flexbox

## Axis and how they work with Flexbox

Before we move further there's something we need to learn about to be effective at working with Flexbox, the concept of axes.

The main axis is the direction (vertical/row or horizontal/column) in which you're laying your content. According to the Flexbox specification:

> The main axis of a flex container is the primary axis along which flex items are laid out. It extends in the main dimension

The cross axis is the one perpendicular to the primary axis. The specification states that:

> The axis perpendicular to the main axis is called the cross axis . It extends in the cross dimension

This gives us a lot more flexibility when working in more complex projects. As we saw in the navigation menu we are able to handle responsiveness as part of the core stylesheet or, if we need media queries for something else, include flexbox as part of the design. We'll see more about axes when we work through the image gallery example.

## Image Gallery

The idea behind the image gallery is simple. I have the following objectives:

- I want to show a series of images with associated text
- All image containers will be the same height
- The images will wrap around if there are more images than the available width of the window
- Images are responsive and will resize based on the available size for their box container

The HTML structure looks like this:

```
<div class="boxes">
  <div class="box box1">
    <img src="architecture.jpg" alt="" />
    <h3>The architecture rocks</h3><p>&amp;nbsp;</p>
  </div>
  <div class="box box2">
    <img src="sunset.jpg" alt="sunset in amsterdam" />
    <h3>Amsterdam Sunset</h3>
    <p> ... </p>
  </div>
  <div class="box box3">
    <img src="pdx-signpost.jpg" alt="Bird Balloon" />
    <h3>Portland Signpost</h3>
    <p> ... </p>
 </div>
</div>
```

\\`boxes\` is the outer wrapper of our flex layout. We use the \\`flex-flow\` shorthand syntax to tell it what the values are for \\`flex-direction\` and \\`flex-wrap\`. We also set the items to stretch so they take all available space in the new column.

```
.boxes {
  padding: .5vw;
  flex-flow: row wrap;
  display: flex;
  align-items: stretch;
}
```

Each individual image box has a \\`flex\` attribute set to auto and a specific width in pixels. If we don't set the width explicitly the content will not wrap.

```
.box {
  margin: .5vw;
  border: 1px solid #444;
  padding: .5vw;
  flex: auto;
  width: 200px;
}
```

For each image we set the \\`width\` to be 100% of the available space and the \\`height\` to auto.

```
.box img {
  width: 100%;
  height: auto;
}
```

The full result can be seen in the pen below (Edit in Codepen to see the complete example):

<p data-height="308" data-theme-id="2039" data-slug-hash="NGoWKM" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/NGoWKM/">Flexbox Image Gallery Experiment</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## Holly Grail Layout

Just like with the gallery we'll create a responsive [holy grail layout](http://www.wikiwand.com/en/Holy_Grail_(web_design))using only flexbox CSS.

In the HTML layout below,

- `header` and `footer` are static and will take the full width of the page.
- `main` is the container for our flex layout.
- `article` will hold our main content.
- `nav`is the navigation container
- `aside` is for the sidebar content\\

The document order is important; we'll use in a media query to change the structure to acomodate smaller screens.

```
<header>
 <h1>This is my awesome title</h1>
</header>
<div id="main">
 <article>
   <h1>Main</h1>
   <p>Leave dead animals as gifts unwrap toilet paper</p>
   <p>Use lap as chair eat grass, throw it back up yet destroy the blinds but wake up human for food at 4am so meow my left donut is missing, as is  my right, favor packaging over toy. The dog smells bad caticus cuteicus  for claw drapes meow for human give me attention meow sit in box  stare at ceiling. Find something else more interesting human give me  attention meow. Eat from dog's food refuse to leave cardboard box. </p>
   <p>Scratch the furniture hide head under blanket so no one can see and sleep in the bathroom sink destroy couch as revenge scratch the  furniture sweet beast, for have secret plans. Eat grass, throw it back up get video  posted to internet for chasing red dot but eat and than sleep on your face.  Sweet beast i like big cats and i can not lie, or loves cheeseburgers get video  posted to internet for chasing red dot swat at dog, for cat slap dog in face but  burrow under covers. Instantly break out into full speed gallop across the house  for no reason the dog smells bad lick arm hair. Chase red laser dot lounge in  doorway or under the bed. Kitty loves pigs hide head under blanket so no one  can see. Swat at dog chase laser hiss at vacuum cleaner lounge in doorway  behind the couch, or lick arm hair stretch. Sleep in the bathroom sink hopped  up on catnip then cats take over the world for have secret plans vommit food and eat it again.</p>
 </article>
 <nav>
   <h1>Nav</h1>
 </nav>
 <aside>
   <h1>Sidebar</h1>
 </aside>
</div>
<footer>
 <h1>Footer content</h1>
</footer>
```

The CSS should look familiar from previous examples. I will highlight the differences in the code.

We assign a little padding to the \\`body\` so we can see the border and the content.

```
body {
 padding: 2vw;
}
```

Since `#main` contains our flex layout we set its display to flex.

```
#main { 
 display: flex;
}
```

We add a red solid border to all the elements on the page so the layout is easier to see. I would definitely remove this for production :-)

```
header, 
footer,
#main > article,
#main >  nav,
#main > aside {
 border: 1px solid red;
 padding: 2vw;
}
```

We use `ordeer` to reorganize our content without having to change the document. We move the navigation (the `nav` element) to the left by setting its order attribute to 1. We ensure that the main content (`article` element) stays in the middle by setting its order attribute to 2 and we leave the sidebar (`aside` element) to the right by setting the order attribute to 3.

Because the `header` and `footer` elements are not part of the flex layout they will still be read and acted upon in the order they appear in the document which is exactly what we want.

We also set a fixed width for the navigation and the sidebar but not for the main content. We do this to allow the main content to be fluid and grow or shrink as we resize the window.

```
#main > article { 
  order: 2; 
  min-width: 12em; 
 flex:1;
}

#main > nav { 
  order: 1; 
  width: 200px; 
}

#main &gt; aside {
  order: 3; 
  width: 200px;
}
```

Just because I can I made the first paragraph in the main content slightly larger and italicized.

```
article p:first-of-type {
  font-size: 1.25em;
  font-style: italic;
}
```

To make sure that the content still looks good in smaller devices, we use a media query to make the content flow in its original order. This is why the order of the content in the document is important. When reverting the changes we made to the three column layout, it will display in this order:

- Header
- Main
- Nav
- Sidebar
- Footer

We also make sure that the content will span the width of the window by making `width: auto&nbsp;`.

```
@media all and (max-width: 800px) {
  #main {
    flex-flow: column;
 }

 #main > article, 
 #main > nav, 
 #main > aside {
       /* Return them to document order */
   order: 0;
    padding: 5vw;
    width: auto;
 }
}
```

The full working code is in the pen below (edit in Codepen to see the full example):

<p data-height="266" data-theme-id="2039" data-slug-hash="ojmgEP" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/ojmgEP/">Holy Grail Layout using Flexbox</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

### Where to from here?

These examples barely scratch the surface of what you can do with Flexbox layouts. Some areas for further exploration:

- Nested Flexbox layouts: Can you use multiple flexbox layouts inside each other?
- Using Flexbox with regular layouts: Making only part of the page use Flexbox
- Play with rearranging the visual display order of the content without changing the document order itself\\

### Links and resources

- [Using Bootstrap 4 Flexbox](http://designmodo.com/bootstrap-4-flexbox/)
- [Solved by Flexbox](http://philipwalton.github.io/solved-by-flexbox/) provides code examples for common flexbox use cases
- [Flexbugs](https://github.com/philipwalton/flexbugs) is a community-curated list of flexbox issues and cross-browser workarounds for them
- [Flexexplorer](http://bennettfeely.com/flexplorer/) is a visual tool to create flex layouts
