---
title: "Reading on the Web"
date: 2025-04-02
tags:
  - CSS
  - Typography
draft: true
---

This post will look at two areas related to reading online:

* How people read online
* How to determine optimal font sizes? Is there such a thing?

If people scan the content of your page, what font size will make it easier to scan and what font sizes will drive people away?


## How do people read online?

Starting in 1997 with his report [How Users Read on the Web](https://www.nngroup.com/articles/how-users-read-on-the-web/), [Jakob Nielsen](https://www.nngroup.com/people/jakob-nielsen/), and later his team at the [Nielsen Norman Group](https://www.nngroup.com/), have researched how people read, or don't read, online.

Their latest research blog post: [How People Read Online: New and Old Findings](https://www.nngroup.com/articles/how-people-read-online/) confirms their past results of how people read online... they don't.

> People still primarily scan, rather than read. Scanning all of the text on a page, or even a majority, is still extremely rare. Even when users do scan content in its entirety, they never scan it perfectly linearly. They still jump around pages, skipping some content, backtracking to scan what they skipped, and rescanning content they’ve already scanned.

However, they also point out that user interest in reading will vary based on a variety of factors. Most of these are outside our control as content creators but it's worth keeping them in mind as we write content.

> Though light scanning is the primary method used to process information online, the amount of time any individual user is willing to spend reading depends on four factors:
>
> * Level of motivation: How important is this information to the user?
> * Type of task: Is the user looking for a specific fact, browsing for new or interesting information, or researching a topic?
> * Level of focus: How focused (or unfocused) a user is on the task at hand?
> * Personal characteristics: Does this individual show a proclivity for scanning and tend to scan even when highly motivated? Or is she very detail-oriented in her general approach to reading online?

The post also contains guidelines on how to structure the content to support their scanning of your page.

> As in 2006, content creators need to accept this fact: People are not likely to read your content completely or linearly. They just want to pick out the information that is most pertinent to their current needs. We can design content that supports scanning by:
>
> * **Using clear, noticeable headings and subheadings** to break up content and label sections so that people can scan to find only what they’re most interested in
> * **Placing information up front** (in other words, “front-loading”) in the structure of our content, as well as in subheadings and links, to allow people to understand the message quickly while scanning
> * **Employing formatting techniques like bulleted lists and bold text** to allow the eye to focus on the most important information
> * **Using plain language** to keep content concise and clear

## Is one-size-fits-all good enough when it comes to font sizes for web content

We've seen how people read online. Now let's look at how large we need to make the font size to help with readability.

There is no universal font size for our content since we now live in a world of responsive design, multiple form factors, and screen resolutions while we have to respect users' preferences set in their browsers.

Here are some aspects to consider:

Screen size
: It’s impossible to predict what form factor users will access your content from.
: It is also impossible to predict if the user has changed the default font size on their browser settings.
: Responsive Design aims to accommodate these different dimensions but there is a big difference between an iPhone, an HDR Laptop and a Gaming monitor in a Desktop machine.

Screen density
: Pixel density plays a big part in text legibility. Technological advances have made hi-res screens more accessible to the masses.
: 16px (the default font size for browsers) will look different on a phone than on a tablet or a large display.
: Designers should keep in mind both the outliers with older tech and the different densities available across devices.

Dynamic Range
: **A monitor's dynamic range is the range of luminosity it can reproduce, from its black level to its peak brightness**. It's measured in bits per color channel, and a higher number means a more vivid and accurate image can be rendered.
: Dynamic range determines how close to reality images can appear on a monitor, as well as **what levels of brightness are best suited for different tasks**.
: High-dynamic range (HDR) is a specification that determines whether a display can render an image that has deeper contrast, a wider color gamut, and generally a better representation of brightness than that of a standard-dynamic range (SDR) display.

Accessibility
: Surprisingly, only the APCA contrast guidelines have specific font size and weight combinations to address contrast readability. Sadly, these combinations do not address pixel density or screen size.

Character similarity
: Does font size affect the way we read similar characters like O (capital `o`) and 0 (the number `0`) or l (lowercase `l`) and 1 (the number).
: The similarity depends on the font and whether the font provides support to differentiate the similar numbers.
: Some fonts may implement the [slashed zero](https://www.preusstype.com/techdata/otf_zero.php) open type feature to differentiate between 0 and O when they are used in the same document. As far as I'm aware there is no open type feature to differentiate between l and 1.

## Working with typography in CSS

!!! note **Note:**
This is not always the right thing to do since it may override the user's desired font size configured in the browser settings.

You need to consider the multiple devices that can access your site or app. The font size on a small mobile device may be different than the font size on a large monitor.
!!!

The easiest way to control text size with CSS is to set a size in the root element, either `html` or `:root` and use that as the base for all relative calculations.

```html
:root {
	font-size:18px;
}

h1 {
	2.5rem;
}
```

Again, we need to remember not to micromanage the browser and let it do its work.

This may be as simple as not doing anything and let the system settings (with any additional user settings as additional stylesheet) or as complicated as using tools like [Utopia](https://utopia.fyi/) or [Modular Scale](https://www.modularscale.com/?1&em&1.618) or [Typescale](https://typescale.com/).

Font selection matters. Even fonts of the same type (sans-serif, serif or cursive) will look different on screen at the same size.

The measure of a line should also be considered. In typography, the emasyre is the width of a text block. Typical values are between 65 and 80 characters wide... the [ch](https://help.webflow.com/hc/en-us/articles/33961301828243-Legible-paragraphs-using-the-CH-unit) to establish the measure of a text block based on character count.

> In web typography, the "ch" unit in CSS refers to the width of the character "0" (zero) in the current font, and it's useful for setting widths or paddings based on character count, particularly for text elements like paragraphs or input fields.
>
> Source: [What is the CSS ‘ch’ Unit?](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/)

You should be careful with the `ch` unit since the width of a `0` character is not the same in all characters in all fonts. This is less of a problem with monospaced fonts where all fonts are the same width; in serif and sans-serif characters are not the same width so even if we keep the same measure, the width of the text may be different.

Line height is also important. The distance between the line may contribute to the readability of the text. You may need to adjust it based on the font and the content.

```css

## Links and Resources

* [How People Read Online: New and Old Findings](https://www.nngroup.com/articles/how-people-read-online/)
* [Designing for Readability: A Guide to Web Typography (With Infographic)](https://toptal.com/designers/typography/web-typography-infographic)
* [Towards Individuated Reading Experiences: Different Fonts Increase Reading Speed for Different Individuals](https://dl.acm.org/doi/pdf/10.1145/3502222)
* [Does print size matter for reading? A review of findings from Vision Science and Typography](https://jov.arvojournals.org/article.aspx?articleid=2191906)
* [Oh, oh, zero!](https://tug.org/TUGboat/tb34-2/tb107bigelow-zero.pdf)
* [Designing for Readability: A Guide to Web Typography (With Infographic)](https://www.toptal.com/designers/typography/web-typography-infographic)
* [What is the CSS ‘ch’ Unit?](https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/)
