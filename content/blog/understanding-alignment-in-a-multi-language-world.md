---
title: "Understanding alignment in a multi-language world"
date: "2017-01-25"
---

We're living in a progressively more diverse and more multilingual world. When the language works the same as English we have no problem.

We start having issue becomes when we work with languages other than English in the same document. It gets more complicated when our primary language uses a different writing mode than the one we're used to. Think about vertical Kanji or right-to-left Hebrew or Arabic text.

## Why is this important? People

<iframe src="https://player.vimeo.com/video/194968584?byline=0&amp;portrait=0" width="560" height="315" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

Towards the end of his presentation at Fronteers 2016 Bruce Lawson states that _lack of awareness and locally relevant content_ is the most common barrier to Internet adoption in Asia.

Later in Bruce's presentation states that _50% of websites are in English, a language spoken by 10% of speakers in the survey countries. By way of contrast, only 2% of websites worldwide are in Mandarin and less than 0.1% in Hindi._ (Data verified with information from: [w3techs](https://w3techs.com/technologies/overview/content_language/all))

While English is the predominant language of the web it is not a universal language, particularly in emerging markets and rural areas of developed nations. There is also an assumption that the rules of western communication, possession of high end hardware and even cultural norms will be equally applicable across the world.

That is not true.

> WWW is the World Wide Web not Wealthy Western Web — Bruce Lawson

What would the web look in their language? What changes would we have to make if we want our content to be understood on countries where people don't read English? Again, where are your customers coming from? is it where we expect them from?

## Why is this important? Development

While talking to people in their language is important I'm lazy enough to admit that I don't want to have 5 different stylesheets based on the language I have to support. Using technology to minimize the impact of having to support different reading modes and directions and combinations to account for different languages is a starting point (if you want a good overview of writing modes check Jen Simmons [article](https://24ways.org/2016/css-writing-modes/) in 24 ways).

I agree. There has to be a better way to do this.

## A solution? New ways to indicate alignment in CSS

If you've seen any of the new CSS specs (Flexbox, Grid and Alignment) use start and end instead of left and right. When defined using these new values we create CSS that defines everything based on the writing systems.

For example the following CSS:

```css
.foo {
  text-align: start;
}
```

Will work as `text-alight: left` in western, left to right, systems and as `text-align: right` in right to left systems. The idea is that it'll align the text to the start of the content, which is defined by the direction we've set for the document or for specific elements.

There is still a place for left, right and center in our CSS. Center in particular doesn't change regardless of the direction of the text.
