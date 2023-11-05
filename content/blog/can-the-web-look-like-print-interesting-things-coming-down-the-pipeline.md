---
title: "Can the web look like print? Interesting things coming down the pipeline"
date: "2016-05-04"
categories:
  - "technology"
---

Out of the many things in the CSS working group universe I’ve picked 3 to highlight because I think they have the most potential to make our web layouts look closer to a printed experience.

### Exclusions

[CSS Exclusions Module Level 1](https://www.w3.org/TR/css3-exclusions/) provides a way to create exclusions in our CSS-based layouts. *Exclusions define arbitrary areas around which inline content can flow and extend the notion of content wrapping previously limited to floats.*


We can use exclusions to create effects like those in magazines. From using it to highlight pullquotes with extra white space around or use shape inside to lay text in shapes other than boxes.

![Example of using exclusions in print layouts](https://galjot.si/_blog/img/2012/exclusions-in-print_v6.jpg)

### CSS page floats and overflow

[CSS Overflow Module Level 3](https://drafts.csswg.org/css-overflow-3/) is another attempt to do content fragmentation on the web, similar to what [CSS Regions](https://www.w3.org/TR/css-regions-1/) did except that unlike regions it is not implemented on any current browser. It can create different layouts by changing the way content flows within a page.

![Example of CSS Regions](https://corlan.org/wp-content/uploads/2013/02/cssregions2.png)

[CSS Page Floats](https://www.w3.org/TR/css-page-floats-3/) takes care of floats that move to the top or bottom of content passages. This draft is the web equivalent to what print publications use to move which figures and photos to the top or bottom of columns or pages, along with their captions.

![Floating content as shown in the CSS Page Floats specification](https://drafts.csswg.org/css-page-floats/images/7.png)

## Ways to enrich our web layouts

I guess I could reverse the question and ask what the web do that print can’t but I’ll be nice and ask how can we enrich our web content.

The primary way is to add motion and interactivity. Best way to do this is with the Web Animation API.

[The web animation API](http://danielcwilson.com/blog/2015/07/animations-intro/) (WAAPI) is an attempt to unify all animation libraries available for the open web (SVG, CSS animations and CSS Transitions) using the same Javascript syntax.

WAAPI makes complex animations easier to handle and provides additional functionality that not part of the component specifications. It also allows developers to do animations without requiring heavy libraries like GSAP (although there is still a place for GSAP in the animation ecosystem.)

## Keeping things in perspective

We can make our web content take some of the metaphors and conventions of printed media ***where it makes sense to do so.***

While I’ve always advocated for us to take advantage of the types of things we can do in print for our web content I’ll be the first one to to insist that we do not go overboard with the fancy.

I’m not advocating for the web to turn into a digital version of our favorite magazines but to stop thinking that the holy grail layout is the only way we should be designing our contents and limiting the work of designers to just variations on a theme.

## Examples

* [http://codepen.io/chriscoyier/full/YyxKea/](http://codepen.io/chriscoyier/full/YyxKea/)
* [http://helenvholmes.com/the-future-of-wearables/](http://helenvholmes.com/the-future-of-wearables/)
* [http://codepen.io/sturobson/full/gaGzKw/](http://codepen.io/sturobson/full/gaGzKw/)
* [http://thegreatdiscontent.com/](http://thegreatdiscontent.com/)
* [http://codepen.io/bartveneman/full/JGNmde/](http://codepen.io/bartveneman/full/JGNmde/)
* [http://read.artspacetokyo.com/](http://read.artspacetokyo.com/)
* [http://read.shapeofdesignbook.com/](http://read.shapeofdesignbook.com/)
