---
title: Different views of masonry layout
date: 2024-05-22
tags:
  - CSS
  - Layout
  - Design
youtube: true
---

There is an interesting discussion going on about masonry layouts and how they should be added to the web platform.

This post will analyze the different proposals and then express an opinion as to which one I think would work best.

## Expressing the problem

!!! note Note:
I'm not going deep into each proposal. You can read the posts and the current Grid Level 3 specification. It is important to understand the differences.
!!!

In [Help us invent CSS Grid Level 3, aka “Masonry” layout](https://webkit.org/blog/15269/help-us-invent-masonry-layouts-for-css-grid-level-3/), Jen Simmons (now from the Safari team) presents their view of what masonry should look like and how it's specified by the W3C (currently an [editor's draft](https://drafts.csswg.org/css-grid-3/)) and implemented in Safari and Firefox.

The syntax for this proposed version of masonry (taken from the [WebKit photo demo](https://webkit.org/demos/grid3/photos/)) looks like this

```css
main {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(8rem, 1fr)
    minmax(14rem, 2fr))
    minmax(8rem, 1fr);
  grid-template-rows: masonry;
  gap: 1rem;
}
```

However, the Chrome team, through Rachel Andrew, came up with an alternative proposal for masonry style layouts in [An alternative proposal for CSS masonry](https://developer.chrome.com/blog/masonry).

It addresses performance and specification issues that have not been fully developed or discussed.

Their two primary concerns are performance and what to do with features that are supported in one display type but not others.

As far as performance they describe it in terms of layout complexity and the differences between masonry and traditional grid layouts.

> Grid and masonry are opposite in terms of how the browser deals with sizing and placement. When a grid is laid out, all items are placed before layout and the browser knows exactly what is in each track. This enables the complex intrinsic sizing that's so useful in grid. With masonry, the items are placed as they are laid out, and the browser doesn't know how many are in each track. This isn't a problem with all intrinsic sized tracks or all fixed sized tracks but is if you mix fixed and intrinsic tracks. To get round the problem, the browser needs to do a pre-layout step of laying out every item in every possible way to get measurements, with a large grid this would contribute to layout performance issues.
>
> Therefore, if you had a masonry layout with a track definition of grid-template-columns: 200px auto 200px — a very common thing to do in grid — you start to run into problems. [These problems become exponential once you add subgrids](https://github.com/w3c/csswg-drafts/issues/10053).
>
> There is an argument that most people won't run into this, however we already know that people [do have very large grids](https://issues.chromium.org/issues/40225429). We don't want to ship something that has limits to how it can be used, when there is an alternative approach.

When they talk about the difference in requirements for grid and masonry explanations

> Bundling masonry into grid breaks this clear link between formatting context and availability of things like alignment properties, which are defined in the Box Alignment specification per formatting context.
>
> If we decide to deal with the performance issue outlined previously by making mixed intrinsic and fixed track definitions illegal in masonry, then you will have to remember that a very common pattern for grid layouts doesn't work for masonry.
>
> There are also patterns that would make sense in masonry, for example grid-template-columns: repeat(auto-fill, max-content), because you don't have cross constraints, but need to remain invalid in grid. The following is a list of properties that [we expect to behave differently](https://github.com/w3c/csswg-drafts/issues/9041#issuecomment-2075501616) or have different valid values.
>
> * grid-template-areas: In masonry you can only specify the initial row in the non-masonry direction.
> * grid-template: The shorthand would need to account for all differences.
> * Track sizing values for grid-template-columns and grid-template-rows due to differences in legal values.
> * grid-auto-flow doesn't apply to masonry and masonry-auto-flow doesn't apply to grid. Merging them would create problems of things that are invalid due to the layout method you are in.
> * Grid has four placement properties (grid-column-start and so on), masonry only has two.
> * Grid can use all six of the justify-* and align-* properties, but Masonry uses only a subset like flexbox.
>
> There will also be a requirement to specify what happens in all of the new error cases caused by developers using a value that isn't valid in grid-with-masonry or grid-without-masonry. For example, it's valid to use grid-template-columns: masonry or grid-template-rows: masonry but not both at once. What happens if you do use both at once? These details have to be specified so that all browsers do the same thing.

The alternative syntax looks like this:

```css
.masonry {
  display: masonry;
  masonry-template-tracks: repeat(
    auto-fill,
    minmax(14rem, 1fr)
  );
  gap: 1rem;
}
```

The [Alternate masonry path forward #9041](https://github.com/w3c/csswg-drafts/issues/9041) GitHub issue and in particular [Tab Atkin's comment](https://github.com/w3c/csswg-drafts/issues/90as41#issuecomment-2075210820) present a more technical explanation of the Chrome Team's opposition to the existing 'masonry-in-grid' as specified.

## My opinion

**Make masonry a separate display value**.

Grid is complicated enough as it is. It is hard to remember all the little tricks and best practices to make the best use of grid layouts. For example the difference between using `auto-fill` and `auto-fit` or how `minmax` works in grid.

Adding masonry to the existing grid layout adds more complications to the grid specification and, in my opinion, makes it harder to learn and reason through the entire masonry creation process.

Even if we agree that masonry is a type of grid, it doesn't mean that things will work the same on both and it may fail in unpredictable ways if we use the wrong attributes or the wrong values for the type of layout we're working on.

Learning the masonry additions to existing grid attributes means an additional cognitive load when using masonry layouts since we not only have to know how to work with grids but we also have to learn how to work with masonry, and how the commands differ between grid and masonry (they are not always identical).

Using `display: masonry` means that we have only one set of rules to worry about when working with masonry. Yes, we could nest masonry inside grids if we need to, but they would be independent of each other, just like we can do with flexbox and grid.

There are [31 open issues](https://github.com/w3c/csswg-drafts/issues?q=is%3Aissue+is%3Aopen+%5Bcss-grid-3%5D%5Bmasonry%5D) for CSS Grid Level 3 and Masonry on the CSS Working Group GitHub Issue Tracker so saying that `display: masonry` only applies to one type of layout, or that either specification is complete, is premature at best.

Even in [the earliest proposals](https://github.com/w3c/csswg-drafts/issues/4650) that led to the Grid Level 3 specification, there is already discussion of using a different methodology to create these layouts. See these comments from:

* [AmeliaBR](https://github.com/w3c/csswg-drafts/issues/4650#issuecomment-577322744)
* [mrego](https://github.com/w3c/csswg-drafts/issues/4650#issuecomment-577723782)
* [rachelandrew](https://github.com/w3c/csswg-drafts/issues/4650#issuecomment-623908272)
* [JoshuaLindquist](https://github.com/w3c/csswg-drafts/issues/4650#issuecomment-624283331)

Even though Grid Level 3 is written and has been implemented in two browsers, the specification is still an editor's draft from November 2013. It wouldn't be the first time that CSS implementations change after they are released in browsers.

## Links and resources

* [WebKit Masonry Demos](https://webkit.org/demos/grid3/) &mdash; Only work in Safari and Firefox (after enabling in `about:config`)
* Other feedback
  * [Feedback on masonry layout](https://frontendmasters.com/blog/feedback-on-masonry-layout/) &mdash; Chris Coyier
  * [What would you call this layout?](https://www.youtube.com/watch?v=azs0xtt_tJc) (YouTube) &mdash; Kevin Powell
