---
title: "An Interesting Image CSS Reset"
date: 2023-12-18
youtube: true
tags:
  - CSS
  - Notes
  - Video
---

I came accross reset from Harry Roberts (from [Twitter/X](https://twitter.com/csswizardry/status/1717841334462005661)) via (Kevin Powell's [YouTube video](https://www.youtube.com/watch?v=345V2MU3E_w)).

I've adapted the reset by eliminating the low quality image resource. I don't need the low quality images (at least I don't think I do).

The initial image styles look like this:

```css
img {
  max-width: 100%; 							/* 1 */
  height: auto;								/* 1 */
  vertical-align: middle;			  		/* 2 */
  font-style: italic;						/* 3 */
  font-size: .75rem;						/* 4 */
}
```

Each line performs a specific task:

1. Allow for fluid image sizing while maintaining the image aspect ratio
2. Remove ‘phantom’ whitespace. Softer way to get the same effect as `display: block`
3. Italicises alt text to visually offset it from surrounding copy
4. Set up for shape outside. Stays inert until you use `shape-outside`

Below is the video where Kevin explain his analysis of the image reset tag.

<lite-youtube videoid="345V2MU3E_w"></lite-youtube>

This prompts a bigger question: How much of a reset do we really need and how much should we set our own defaults?
