---
title: "Hiding content on the page for advanced users"
date: "2019-09-04"
---

I was browsing through [Brad Neuberg's blog](http://codinginparadise.org/) I came across [stretchtext.js](http://codinginparadise.org/ebooks/html/blog/stretchtext.html) and I found it interesting enough to take a deeper look.

Stretchtext is a Javascript implementation of a hypertext going back to the work of Ted Nelson in 1967. Taken from Neuberg's article:

> Stretchtext consists of ordinary continuous text which can be "stretched", or made longer and more detailed. By pointing at specific areas and pulling the throttle in the "magnify" direction, the reader may obtain greater detail on a specific subject, or area of the text. The text stretches, becoming longer, with replacement phrases, new details, and additional clauses popping into place. The good of this structure should be evident. The reader remains oriented. If he loses track of where he is, he "shrinks" the text to a higher, shorter level; if he wants to study a topic in more detail, he magnifies it. An important editorial constraint on stretchtext, then, is that details and narrative arrangements must remain fixed in their relative order through different levels of stretchtext. However, in one respect it appears to be easier to write than ordinary text: rather than deciding what details to "put in" and "leave out," the author merely assigns altitudes (or "fineness"?) to topics and details, thus determining at how great a magnification they will be seen. \[…\] Editorially, the stretchtext is (1) always the same unit, and (2) always a continuous narrative. Thus it is unlike hypertexts with discrete chunks and breaks.

So, the idea is that we begin with our basic text or text for our beginner audience and then we can create additional material that we can "stretch" to allow for more advanced content at deeper levels or we can have multiple sections of stretched content at the same level.

The tool adds complexity to the writing process. If the result is 15 pages how do we create the content? Do we write all 15 and then insert the markup to create the stretch points? Do we create an initial five pages and then expand the content as needed?

In the [Codepen Example](https://codepen.io/caraya/pen/RwbVMzX) I'm using to validate the usefulness of Stretchtext as a writing tool, I hid the quote from Ted Nelson to demonstrate how it works and to show that you can hide arbitrarily large portions of the content.

How I envision this tool working is to write the full content and then hide more advanced content using Stretchtext and let the user decide if they want the additional material or not.
