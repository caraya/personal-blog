---
title: "Orphans and Widows"
date: "2015-08-12"
categories: 
  - "technology"
---

The orphans CSS property refers to the minimum number of lines of text in a container that must be left at the bottom of the page. This property is normally used to control how page breaks occur.

In typography, a widow is the last line of a paragraph appearing alone at the top of a page. The widows CSS property defines how many lines must be left on top of a new page.

In browsers that support the properties, widows and orphans allow us to control how content is displayed on multi column layouts and/or printed media. It is a complement to `break-*` in that widows and orphans provide an alternative way to break content, just set the values high enough and the content will break (although it may become harder to read.)

\[codepen\_embed height="593" theme\_id="2039" slug\_hash="RPeyNy" default\_tab="result" user="caraya"\]See the Pen [CSS Columns Fill](http://codepen.io/caraya/pen/RPeyNy/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

Compare the exaple above (CSS Columns Fill) with the one below (Widows and Orphans.)

In the balanced columns example, how can you tell whether 1 or 2 lines at the bottom of the div are part of the paragraph in the next column versus a standalone paragraph?

CSS orphans and widows resolve the issue by moving all the text to the next column (the 2 lines are smaller than the value we set for orphans in the CSS)

\[codepen\_embed height="653" theme\_id="2039" slug\_hash="xGLLPW" default\_tab="result" user="caraya"\]See the Pen [Widows and Orphans](http://codepen.io/caraya/pen/xGLLPW/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]
