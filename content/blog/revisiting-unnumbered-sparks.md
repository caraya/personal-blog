---
title: "Revisiting Unnumbered Sparks"
date: "2016-04-18"
categories: 
  - "technology"
---

One of the earliest large scale interactions between man and technology I saw is [Unnumbered Sparks](http://www.unnumberedsparks.com/), an installation by [Janet Echelman](http://www.echelman.com/) and [Aaron Koblin](http://www.aaronkoblin.com/) produced for TED’s 30th anniversary in Vancouver, BC.

What I found most striking, even though I wasn’t there was the audience participation. people passing by the exhibit would use their phones to draw, change colors and add sounds to the piece.

> The sculpture spanned 745 feet between buildings in downtown Vancouver, Canada from March 15-22, 2014 ([map](https://www.google.com/maps/place/Vancouver+Convention+Centre/@49.2889178,-123.1146661,18z/data=!4m2!3m1!1s0x0:0x24cec96c28a4a2bd)). At night, it came alive with illumination. Visitors with smartphones and tablets were able to paint vibrant beams of light across the sculpture at a remarkable scale: small movements on their phones became hundred foot long trails evolving and combining with fellow participants. From: [http://www.unnumberedsparks.com/](http://www.unnumberedsparks.com/)

<iframe width="560" height="315" src="https://www.youtube.com/embed/npjTmG-TBHQ?rel=0" frameborder="0" allowfullscreen></iframe>

The technology stack is pretty awesome too:

- A 10 million pixels instance of Google Chrome
- Backend written in Go to handle all concurrent input and the output it generates
- WebGL for 3D GPU accelerated graphics
- Websockets for direct communication
- Web audio for synthetic audio
- Polymer for custom HTML elements

<iframe width="560" height="315" src="https://www.youtube.com/embed/6JGzPLZrVFU?rel=0" frameborder="0" allowfullscreen></iframe>

But this is all doe at large scale with a lot of experts and technologies that have been customized for this type of experience. Would it be possible to make the same experience easier to create and interact with?

Could we replicate the large scale experience of Unnumbered Sparks elsewhere? Can we skip the physical and move to the purely virtual? WebGL, Leap Motion and Oculus?
