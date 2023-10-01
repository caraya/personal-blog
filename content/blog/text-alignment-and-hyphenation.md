---
title: "Text Alignment and Hyphenation"
date: "2015-07-27"
categories: 
  - "typography"
---

Given the same font, alignment and hyphenation have a definitive impact on the way we read content and how it appears on-screen

\[codepen\_embed height="691" theme\_id="2039" slug\_hash="XbabOL" default\_tab="result" user="caraya"\]See the Pen Text Alignment Possibilities by Carlos Araya (@caraya) on CodePen.\[/codepen\_embed\]

None of the paragraphs above is hyphenated. Note in particular how the Justified paragraph leaves larger gaps between words to accommodate the justification. It is the same, although not so noticeable, in the other paragraphs.

Although CSS support hyphenation using the hyphens rule the support is inconsistent (it only works in Firefox.) A good alternative is to use libraries such as [hyphenator](http://mnater.github.io/Hyphenator/) to offer a consistent hyphenation experience.

Some of the Hyphenator's drawbacks (also from [http://mnater.github.io/Hyphenator/](http://mnater.github.io/Hyphenator/)):

- Hyphenator.js and the hyphenation patterns are quite large. Good compression and caching is vital.
- Automatic hyphenation can't be perfect: it may lead to misleading hyphenation like leg-ends (depends on the pattern quality)
- There's no support for special (aka non-standard) hyphenation (e.g. omaatje->oma-tje)
- There's no way for Javascript to influence the algorithm for laying out text in the browser. Thus we can't control how many hyphens occur on subsequent lines nor can we know which words have actually to be hyphenated. Hyphenator.js just hyphenated all of them.

\[codepen\_embed height="689" theme\_id="2039" slug\_hash="PqKPvV" default\_tab="result" user="caraya"\]See the Pen [Text Alignment Possibilities With Hyphenated Text.](http://codepen.io/caraya/pen/PqKPvV/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]
