---
title: "Font synthesis in CSS"
date: "2021-03-17"
---

One of my biggest peeves in the typography side of web development is that browsers try to be too helpful when there is no bold or italics version of a font.

The [font-synthesis](https://developer.mozilla.org/en-US/docs/Web/CSS/font-synthesis) descriptor allows authors to control whether supporting browsers will synthesize boldface, italics, or both when there are no fonts available.

The possible values for the descriptor are:

`none`

Neither bold nor italic typeface may be synthesized.

`weight`

A bold typeface may be synthesized.

`style`

An italic typeface may be synthesized.

The default value for the descriptor is `style weight` meaning that both boldface and italics will be synthesized if needed.

If the value `none` is chosen then there will be no italics and boldface styles applied to the document. This may significantly change the looks and the semantics of the document so be careful when and how you use it.
