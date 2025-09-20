---
title: CSS - what we are missing
date: 2025-11-15
tags:
  - CSS
  - Opinion
---

CSS has come a long way since its inception, evolving from a simple styling language to a powerful tool for creating complex layouts and animations.

I love playing with CSS and exploring its capabilities to create web pages that emulate magazine layouts while maintaining responsiveness and accessibility.

There are still some features that I believe would greatly enhance the capabilities of CSS and make it even more versatile for developers.

This post explores some of the features I think are missing in CSS and how they could enhance layout design, responsiveness, and overall user experience.

## Replacement for Regions

[CSS Regions](https://webkit.org/blog/3078/advanced-layout-made-easy-with-css-regions/) were an experimental feature that allowed content to flow through multiple non-adjacent containers, creating magazine-like layouts. However, they were never widely adopted and have since been removed from browsers that had implemented them.

As this [2013 article](https://webkit.org/blog/3078/advanced-layout-made-easy-with-css-regions/) explains, CSS Regions allowed developers to define "regions" in their layouts where content could flow seamlessly. This was particularly useful for creating complex layouts like multi-column articles or magazine-style designs.

Using an example from the article, this CSS snippet demonstrates how CSS Regions worked:

In the CSS we define one or more region flows using `-webkit-flow-from` and the name of the flow.

We also style the individual regions using standard CSS properties

```css
  /* === Content Sources === */
  /* Content flow regions */
  .content-flow {
    -webkit-flow-into: content-flow;
  }

  /* Image flow */
  .image-flow {
    -webkit-flow-into: image-flow;
  }

  /* === Destinations === */
  /* Text flow */
  .text-region {
    -webkit-flow-from: content-flow;
  }

  /* Image flow */
  .image-region {
    -webkit-flow-from: image-flow;
  }

  /* The destination regions */
  .regionBox {
    width: 700px;
    height: 90px;
  }

  #region-2 {
    height:375px;
  }


  #region-4 {
    float: left;
    width: 340px;
  }

  #region-5 {
    float: left;
    width: 340px;
  }

  #region-6 {
    position:absolute;
    top: 0px;
    left:724px;
    width: 360px;
    height: auto;
  }

  img {
    display: block;
    width: 512px;
    height: 342px;
    margin: auto;
  }
```

In the HTML document, we do two things:

1. Define the source for the text that will flow into regions using `-webkit-flow-from` and the class we gave the source element.
2. Define one or more regions using `-webkit-flow-into` and the name of the flow. These regions can be nested, like the image region in the example below.

```html
<div class="content-source">
  <h1>Pizza is Amazing</h1>
  <p>Is there any food better than pizza? I don't think so. Its simplest form is really my favorite - a perfect thin crust, a barely-altered tomato sauce, fresh mozzarella, and a light sprinkling of basil.</p>

  <img class="image-source" src="yellow-pizza.jpg">

  <p>But I like all of the less pure interpretations of pizza too. From a mushroom-and-sausage-filled Chicago-style deep dish to a California sourdough crust with fresh corn, feta cheese, and cilantro, to an almost sweet Hawaiian pie (don't tell Enrica about that one), I just love it all. Is there anyone who doesn't love pizza? I pity the fool who does not love pizza. So until then, I will continue to believe that pizza the most universally-loved food. (I know what you're thinking. You're thinking, "What about chocolate?" Well, I have met people who don't like chocolate. I know, they cray, but they do exist.)</p>
</div>

<div id="regionContainer">
  <div id="region-1" class="text-region"></div>

  <div id="region-2" class="image-region"></div>

  <div id="region-3" class="text-region"></div>
  <div id="region-4" class="text-region"></div>
  <div id="region-5" class="text-region"></div>
  <div id="region-6" class="text-region"></div>
</div>
```

I created a proof of concept to emulate CSS Regions using Javascript and CSS Grid. You can check it out here: [CSS Regions Emulator](https://github.com/caraya/regions-emulator). **This is not production-ready code and it will never be.** I built it to play with in Codepen.

A modern replacement for CSS Regions could involve a combination of existing CSS features, such as CSS Grid and Flexbox, along with new properties that allow for more dynamic content flow. For example, a new property could be introduced to define "flow areas" where content can automatically adjust and reflow based on the available space.

## Better control over column gaps and gutters

While CSS Grid and Flexbox have improved layout capabilities, there is still a lack of fine-grained control over column gaps and gutters, especially in multi-column layouts.

The issue that I see is that the current column separation properties are all or nothing, all column gaps have the same characteristics, and that may not always be desirable we might want to set narrower margin for some columns than others.

Right now this is a designer's choice. We need to keep in mind the tradeofs we make when using multi column versus grid or flexbox:

Multi-column Layout (column-count) is like pouring water. 🌊
: The content (water) flows into one or more pre-defined columns. The content automatically fills the first first, overflows into the second, then the third, until there is no more content or all the columns have been filled. You control the number and width of the columns, but the gap between them is always the same.

Grid and Flexbox are like arranging bricks. 🧱
: You have a set of individual  `&lt;div&gt;` elements that you can place precisely. You can adjust the gap between the div elements but the contents of one brick will never flow into an adjacent brick.

A potential solution could involve a pseudo-selector like `::column-gap(2n)` or a new property that allows defining an array of gap sizes, giving developers the granular control they need.

Regions may also help with this issue but, as we've discussed earlier, the limitations of any polyfill are too significant to put the code in production projects.

## Exclusions

CSS Exclusions allow you to define arbitrary regions on a web page, typically occupied by an element, and have inline content flow around them. This is similar to how text wraps around a floated image, but Exclusions offer much more power and flexibility, as the element creating the exclusion doesn't need to be floated. It can be positioned anywhere. 😮

The core idea is to "exclude" an element's area from the normal content flow, forcing surrounding content to wrap around its boundaries.

### How Exclusions work

CSS Exclusions work by using the wrap-flow property on an element that is positioned absolutely, relatively, or fixed. This element then becomes an "exclusion area." Any content that would normally overlap with this element will instead wrap around it.

The main property is wrap-flow, which can take several values:

* `start`: Content flows on the start side of the exclusion (left side in LTR languages).
* `end`: Content flows on the end side of the exclusion (right side in LTR languages).
* `both`: Content flows on both sides of the exclusion.
* `maximum`: The content flows on the side of the exclusion with the most available space.
* `clear`: Content does not wrap on either side. It begins after the exclusion area ends.

Here is a simple example:

```css
.container {
  width: 400px;
  height: 300px;
  border: 1px solid #ccc;
  font-family: sans-serif;
}

.exclusion-element {
  position: absolute;
  width: 150px;
  height: 150px;
  margin-left: 125px; /* Center it */
  margin-top: 50px;
  background-color: dodgerblue;
  /* The key property */
  wrap-flow: both;
  /* Don't forget vendor prefixes for older browsers */
  -ms-wrap-flow: both;
}
```

```html
<div class="container">
  <div class="exclusion-element"></div>
  <p>
    This text will flow around the blue square in the middle. CSS Exclusions allow inline content to wrap around an element, which can be absolutely positioned. This provides a level of layout control that is difficult to achieve with traditional floats, enabling more magazine-like and dynamic designs directly in the browser without complex hacks or Javascript calculations for text placement.
  </p>
</div>
```

### Exclusions vs. Shapes

CSS Exclusions and CSS Shapes are often discussed together because they both affect text flow, but they do different things.

Similarities ✅

* Both can create non-rectangular text wrapping effects.
* They can be used together. For instance, you can have an exclusion element and then use shape-outside on it to define a circular or polygonal boundary for the text to wrap around instead of its default box.

Differences ❌

* Target Element:
  * **Shapes (`shape-outside`)** are applied to floated elements. They define the boundary of the float that content will wrap around. Content is pushed away from the float.
  * **Exclusions (`wrap-flow`)** are applied to positioned elements (absolute, relative, etc.). They create a space that content is excluded from. The element doesn't need to be part of the regular document flow like a float.

Core Function:

* Shapes define how content wraps around a floated element.
* Exclusions define an area that content should avoid entirely.

Think of it this way: Shapes modify the "safe area" around a float, while Exclusions punch a hole in the content area for other content to flow around.

### Browser Support

This is the most significant limitation of CSS Exclusions. There is no modern browser support, only IE and old versions of Edge that are currently not supported.

* **Supported**: Internet Explorer (10+) and Edge (pre-Chromium versions) with the -ms- prefix.
* **Not Supported**: Chrome, Firefox, Safari, and all modern browsers.

CSS Exclusions were proposed as a W3C specification but never gained traction among browser vendors, who favored improving and extending CSS Shapes and Floats instead. For this reason, you should not use CSS Exclusions in production today.

### Fallbacks and Alternatives

Since Exclusions are not a viable option, here are the best modern alternatives to achieve similar effects.

CSS Fallbacks

1. Floats (The Classic)
The simplest way to wrap text around an element is with float. This is the most widely supported and reliable method.
2. Floats with CSS Shapes
To achieve non-rectangular wrapping (the promise of Exclusions), combine float with shape-outside. This is the modern, recommended approach.

## Expand CSS Shapes

As specified in CSS Shapes Module Level 1 and its current browser implementations, CSS Shapes have several significant limitations that impact their use in production. They are primarily used for wrapping content outside an element rather than creating complex visual shapes.

The [CSS Shapes Module Level 2](https://drafts.csswg.org/css-shapes-2/) specification is a working draft and is not supported in any browser yet.

Its primary goal is to introduce the shape-inside property, which would constrain content within a custom shape. This opens the door for truly unique typographic layouts.

### The shape-inside Property

The [shape-inside](https://drafts.csswg.org/css-shapes-2/#shape-inside-property) property defines a shape for the "float area," and content would be laid out entirely inside it.

Here are the values defined in the Level 2 spec:

`auto`
: The default value. The shape is a rectangle defined by the element's dimensions, just like normal block layout.
&lt;basic-shape&gt;: The same functions as shape-outside (`circle()`, `ellipse()`, `polygon()`, `inset()`). Content would be forced to render only within the boundaries of this shape. For example, text inside a div with `shape-inside: circle(50%)` would fill that circle, with lines of text becoming shorter near the top and bottom edges.
&lt;shape-box&gt;
: Defines the reference box for the shape. This is similar to background-clip. Values include `margin-box`, `border-box`, `padding-box`, and `content-box`.

`display`
: This is a unique value. The shape is defined by the rendered content of the element itself, including any list markers, ::before/::after pseudo-elements, etc.

`outside-shape`
: This powerful proposed value tells the element to use the same shape defined by its shape-outside property for its shape-inside. This would allow you to create a "donut" or "ring" effect, where content flows in the area between the shape-outside boundary and the shape-inside boundary.

### Javascript Fallbacks for shape-inside

Since no browsers support `shape-inside`, achieving this effect today requires Javascript. These techniques are complex and have significant performance costs, but they can be used for specific design elements where the effect is critical.

The primary technique involves manually calculating the line breaks of the text. A script would perform the following steps:

1. **Split Text**: Break the target text content into individual words.
2. **Calculate Constraints**: For each potential line of text (based on line height), the script mathematically calculates the maximum allowed width according to the desired shape. For a circle, this involves using the circle's equation to find the horizontal chord length at a given vertical position.
3. **Measure and Wrap**: The script creates a temporary element to measure the width of words. It adds one word at a time to a line until it exceeds the calculated maximum width for that vertical position.
4. **Render Line**: Once a line is full, the script appends it to the DOM and starts a new line with the next word.
5. **Repeat**: This process continues until all words have been placed within the shape.

This approach is essentially a manual implementation of a browser's text layout engine, but constrained to a shape.

### Limitations of Javascript Fallbacks

1. **Performance**: This is the biggest issue. The process requires hundreds or thousands of DOM measurements and manipulations, which is very slow and can easily cause stuttering, especially with large amounts of text. Running this logic on window resize is also computationally expensive.
2. **Complexity**: The math for calculating the boundaries of a complex polygon() is non-trivial.
3. **Fragility**: This approach can break standard browser features like text selection, search (Ctrl/Cmd+F), and hyphenation.
4. **Accessibility**: If not implemented carefully, the resulting text may not be accessible to screen readers, or copy-pasting could produce jumbled results.

Because of these drawbacks, use Javascript fallbacks for shape-inside sparingly &mdash; perhaps for a heading or a small, decorative block of text &mdash; but avoid them for long-form content.

General Limitations and Considerations
Browser Support: Level 1 (shape-outside) has good support, but Level 2 (shape-inside) has zero support.

Float Requirement: shape-outside only works on floated elements, which can be limiting in modern layouts that favor Flexbox or Grid.

Performance: Very complex polygons with hundreds of points can impact rendering performance, even in native CSS.

Content Accessibility: Be careful! Flowing text into unusual shapes can sometimes make it harder to read. Ensure line lengths don't become too short or awkward.

Tooling is Essential: Creating complex polygons by hand is difficult. Browser developer tools (like the shape editor in Chrome or Firefox) or online tools like Clippy are essential for creating and debugging them.

## Conclusion

The evolution of CSS has been remarkable, with Flexbox and Grid revolutionizing how we build layouts. However, as we've explored, there's still a gap between the capabilities of web design and the intricate, fluid layouts found in print media. The features discussed here—a modern successor to CSS Regions, finer control over column gaps, the powerful potential of CSS Exclusions, and the much-needed expansion of CSS Shapes with shape-inside—all point to a common desire: to break free from the rigid box model.

These missing pieces would empower developers and designers to create more dynamic, expressive, and magazine-like layouts natively, without resorting to complex and often fragile JavaScript workarounds. They represent the next logical step in giving us the tools to manage content flow in a truly two-dimensional space, wrapping text around and even within complex shapes.

While some of these features, like Exclusions, may never see modern implementation, the ongoing development of specifications like CSS Shapes Module Level 2 gives us hope. As the web continues to mature as a design medium, embracing these capabilities will be crucial for pushing creative boundaries and delivering richer, more engaging user experiences. The future of web layout isn't just about arranging boxes; it's about artfully directing the flow of content itself.
