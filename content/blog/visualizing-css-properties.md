---
title: "Visualizing CSS properties"
date: "2014-03-25"
categories: 
  - "technology"
---

One of my earliest experiments in data visualization was to create visualization of the [CSS properties](http://labs.rivendellweb.net/css-vis/css-tree3.html) as they are documented in the [Web Platform Documentation](http://docs.webplatform.org/wiki/Main_Page) project. Now that it's in a shape where I'm willing to let it out in the wild it's time to write about it and explain the rationale and the technology.

## Rationale

I'm a visual person. Rather than search for something that I may or may not know exactly what it is, I'd rather look at something that, I hope, will make it easier for me to find what I'm looking for.

I'm also lazy. Instead of looking for a property in one place and then manually typing the full URL of the Web Platform Documentation project I'd rather add the URLs for all properties directly to the visualization so that, when the I find the property he's looking for, I can go directly to it from the visualization tree.

## Building the visualization

### The data

The first thing I did was to pull the data from the Web Platform Documentation project using their [API](http://docs.webplatform.org/w/index.php?title=Special:Ask) to generate an initial JSON file. I then had to edit the file manually to produce something closer to the JSON format that I was looking for:

\[javascript\] { "name": "CSS", "children": \[ { "name": "Alignment", "children": \[ { "size": 1000, "name": "align-content", "url": "http://docs.webplatform.org/wiki/css/properties/align-content" }, { "size": 1000, "name": "align-items", "url": "http://docs.webplatform.org/wiki/css/properties/align-items" }, { "size": 1000, "name": "align-self", "url": "http://docs.webplatform.org/wiki/css/properties/align-self" }, { "size": 1000, "name": "alignment-adjust", "url": "http://docs.webplatform.org/wiki/css/properties/alignment-adjust" }, { "size": 1000, "name": "alignment-baseline", "url": "http://docs.webplatform.org/wiki/css/properties/alignment-baseline" } \] } \] } \[/javascript\]

Every time I edited or made a change to the JSON file (the resulting full JSON file is about 2500 lines of code) I ran it through [JSON lint](http://jsonlint.com/) to make sure that the resulting content was valid JSON. I haven't always done this and it has been a constant source of problems: The page appears blank, only part of the content is displayed and other anoyances that took forever to correct.

Once we have the JSON file working, we can move into the D3 code.

### The technology

> D3.js is a JavaScript library for manipulating documents based on data. D3 helps you bring data to life using HTML, SVG and CSS. D3’s emphasis on web standards gives you the full capabilities of modern browsers without tying yourself to a proprietary framework, combining powerful visualization components and a data-driven approach to DOM manipulation. From [http://d3js.org](http://d3js.org/)

What this means is that we can build visual content based on data have collected or arbitrary data we have available. In this case we are visualizing an arbitrary grouping of [CSS](http://www.w3.org/Style/CSS/) properties from the [Web Platform Documentation](http://docs.webplatform.org/wiki/Main_Page) project; all properties are listed but the grouping may change as the group comes to a consensus regarding the groups.

D3 follows a fairly straightforward process. We start by defining all our variables at the top of the script to prevent [Javascrp variable hoisting](http://code.tutsplus.com/tutorials/javascript-hoisting-explained--net-15092). The code looks like this:

\[javascript\] // Starting values were: // width: 2140 - margin.right - margin.left // height : 1640 - margin.top - margin.bottom var margin = {top: 20, right: 120, bottom: 20, left: 120}, width = 1070 - margin.right - margin.left, height = 820 - margin.top - margin.bottom;

var i = 0, duration = 750, root

var tree = d3.layout.tree() .size(\[height, width\]);

var diagonal = d3.svg.diagonal() .projection(function(d) { return \[d.y, d.x\]; }); \[/javascript\]

We create the SVG-related elements that we need in order to display the visualization data. The steps in the code below are:

- Select the body of the document
- Append the svg element
- Set up width and heigh attributes with default values
- Create a [SVG group](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g) (indicated by the `<g>` tag) and translate it (move it by the ammount indicated by the top and left margin)

\[javascript\] var svg = d3.select("body") .append("svg") .attr("width", width + margin.right + margin.left) .attr("height", height + margin.top + margin.bottom) .append("g") .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); \[/javascript\]

We load the JSON file using D3's JSON loader and set up the root element and its position.

The function collapse makes sure tha elements without children are collapsed when we first open the visualization page. I wanted to make sure that users would not be overwhelmed with all the information available in the visualization and had a choice as to what items they would click and what information they'd access.

Preventing children from automatically displaying also prevents the clutter of the tree. If there are too many children open the vertical space gets reduced and it becomes hard to distinguish which item we are clicking in.

I've also set a default height for all elements... 100px sounds good at this stage.

\[javascript\] d3.json("json/css-data.json", function(error, css) { root = css; root.x0 = height / 2; root.y0 = 0;

function collapse(d) { if (d.children) { d.\_children = d.children; d.\_children.forEach(collapse); d.children = null; } } root.children.forEach(collapse); update(root); });

d3.select(self.frameElement).style("height", "100px"); \[/javascript\]

Because the click will change the nature of the layout and the number of visible elements we need to update the layout everytime the user clicks on a valid element. This wil involve hidding old elements,showing showing new nodes in the tree.

\[javascript\] function update(source) {

// Compute the new tree layout. var nodes = tree.nodes(root).reverse(), links = tree.links(nodes);

// Normalize for fixed-depth. nodes.forEach(function(d) { d.y = d.depth \* 200; });

// Update the nodes… var node = svg.selectAll("g.node") .data(nodes, function(d) { return d.id || (d.id = ++i); });

// Enter any new nodes at the parent's previous position. var nodeEnter = node.enter().append("g") .attr("class", "node") .attr("class", function(d) { if (d.children) { return "inner node" } else { return "leaf node" } }) .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; }) .on("click", click); \[/javascript\]

Using D3's Enter/Append/Exist system we go back into the nodes we created, we append a new circle and set its radius and color (lines 1 - 3 in the code below).

Next I add the text for each node, set up their X (line 5) and Y (line 6) coordinates for the text node. I've aligned the text usin a D3 trick where setting the Y value to .35em centers the text vertically.

For each leaf node I set up a link as only elements without children have URL attributes. We do this in two steps:

- Append a SVG anchor element (svg:a) which is different than our regular HTML anchor (line 7)
- Add an [Xlink](http://www.w3.org/XML/Linking), the XML vocabulary for defining links between resources (line 8) using the xlink:href syntax

Finally, we setup and place the linkend attribute for each node in such a way that nodes with children will display their text to the left of the assigned circle and nodes without children will display the text to the right of the circle (line 11)

\[javascript\] nodeEnter.append("circle") .attr("r", 1e-6) .style("fill", function(d) { return d.\_children ? "lightsteelblue" : "#fff"; }); nodeEnter.append("text") .attr("x", function(d) { return d.children || d.\_children ? -10 : 10; }) .attr("dy", ".35em") .append("svg:a") .attr("xlink:href", function(d){return d.url;}) .style("fill-opacity", 1) .text(function(d) { return d.name; }) .attr("text-anchor", function(d) { return d.children || d.\_children ? "end" : "start"; }); \[/javascript\]

Most of the remaining work is to transition elements to and from their current position. This would be so much easier if we were using a library such as jQuery or Dojo but the result is worth the additional code.

The duration for all transitions is hardcoded to 750 miliseconds. Whether duration affects the user experiecne is an area to look further into.

\[javascript\] // Transition nodes to their new position. var nodeUpdate = node.transition() .duration(duration) .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

nodeUpdate.select("circle") .attr("r", 4.5) .style("fill", function(d) { return d.\_children ? "lightsteelblue" : "#fff"; });

nodeUpdate.select("text") .style("fill-opacity", 1);

// Transition exiting nodes to the parent's new position. var nodeExit = node.exit().transition() .duration(duration) .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; }) .remove();

nodeExit.select("circle") .attr("r", 1e-6);

nodeExit.select("text") .style("fill-opacity", 1e-6);

// Update the links… var link = svg.selectAll("path.link") .data(links, function(d) { return d.target.id; });

// Enter any new links at the parent's previous position. link.enter().insert("path", "g") .attr("class", "link") .attr("d", function(d) { var o = {x: source.x0, y: source.y0}; return diagonal({source: o, target: o}); });

// Transition links to their new position. link.transition() .duration(duration) .attr("d", diagonal);

// Transition exiting nodes to the parent's new position. link.exit().transition() .duration(duration) .attr("d", function(d) { var o = {x: source.x, y: source.y}; return diagonal({source: o, target: o}); }) .remove();

// Stash the old positions for transition. nodes.forEach(function(d) { d.x0 = d.x; d.y0 = d.y; }); \[/javascript\]

The final bit of magic is to use D3's onClick event to toggle the display of our content.

\[javascript\] var svg // Toggle children on click. function click(d) { if (d.children) { d.\_children = d.children; d.children = null; } else { d.children = d.\_children; d.\_children = null; } update(d); } \[/javascript\]

## Where to go next?

There are some areas I want to further explore as I move forward with the visualization and learn more about how to visualize data:

- Does the length of the transitions change the way people react to the data?
- How can we control the space between items when they are too many open?

I will post the answers to these questions as I find the answers :-)
