---
title: The Anchor Positioning API
date: 2024-06-10
tags:
  - CSS
  - Popover
---

A complementary API to Popovers is the [anchor positioning API](https://developer.chrome.com/blog/anchor-positioning-api)

Where the popover attribute controls the popover behavior, the anchor positioning allows us to control where will the popover appear.

We've already covered popovers so this post will look at the anchor positioning API and how it interacts with popovers.

## Non-popover

The most basic use of the anchor is to place content positioned relative to the anchor point. These anchor points can be any HTML element.

In the example below, we use an anchor use a `div` element as the anchor and a second `div` as the content to be anchored.

```html
<div class="anchor">1</div>
<div class="anchored-note">
  <p>This is the anchor that we want to display.</p>
</div>
```

The CSS to create the anchor is fairly straightforward.

The `.anchor` class defines an `anchor-name` attribute with a value that uses CSS variable syntax, starting with two dashes (`--`).

The `.anchored-note` class is where we do the bulk of the work
: We use `position: absolute` to ensure the position of the anchored content.
: `position-anchor: --anchor-el` associates the anchored content to the anchor. Uses the same name as `anchor-name`
: `left: anchor(right)` places the anchored content relative to the anchor. The syntax is a little complicated so it's worth an explanation. The left of the anchored content is placed relative to the right of the anchor (referenced as `anchor(right)`).

```css
/* The demo */
.anchor {
  anchor-name: --anchor-el;
}

.anchored-note {
  position: absolute;
  /* anchor reference */
  position-anchor: --anchor-el;
  /* Position the left of the anchored elem at the right of the anchor */
  left: anchor(right);
  inline-size: 20rem;
  margin-inline-start: 1rem;
}
```

The example looks like this:

<iframe height="354.78802490234375" style="width: 100%;" scrolling="no" title="basic anchor positioning example" src="https://codepen.io/caraya/embed/PovzXqX?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/PovzXqX">
  basic anchor positioning example</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Popovers

To work with popovers or dialogues, we need to adopt a different strategy to make them work.

The first change we make is in the HTML code. We set the anchor-related properties (`anchor-name` and `position-anchor`) as `style` attributes in the corresponding elements rather than adding them to the CSS.

```html
<button style="anchor-name: --anchor-btn-1" popovertarget="my-tooltip-1">
    <p>1</p>
</button>

<div id="my-tooltip-1" class="tooltip" style="position-anchor: --anchor-btn-1" popover>
	<p>The sun dipped, fiery orange melting into buttery yellow. Maya mirrored the hues on canvas, each stroke bittersweet – fleeting beauty, a day gone. Yet, she painted on, for in those streaks lay the promise of a new dawn.</p>
</div>
```

Since we defined the anchor-related styles inline for each element, the CSS concentrates on the positioning side of the API.

Instead of specific commands (`top`, `right`, `bottom` and `left`) to specify where we want to place the anchored content, we use [inset-area to position the content](https://developer.chrome.com/blog/anchor-positioning-api#position_with_inset-area). You can also use logical properties to define the position of the anchored content.

This example uses `inline-end` (the right side in top to bottom, left to right languages) and takes all the available space.

```css
/* The demo */
.anchored-note {
  /*  POSITIONING  */
  inset-area: inline-end span-all;
  margin-inline-start: 1rem;
  max-width: 60rem;

}
```

## Adjusting Position

The Anchor Position API provides a way to give fallbacks for when space would render the tooltip invisible.

As we did with `anchor-name` and `position-anchor`, this is a two-step process:

1. Specify the attribute `position-try-options` in the anchored content
2. Add a new `@position-try` rule with the same name and the fallback location where you want to place the anchored content.

```css
.anchored-note {
  position: absolute;
  /* anchor reference */
  position-anchor: --anchor-el;
  /* initial position */
  inset-area: inline-end span-all;
  inline-size: 20rem;
  margin-inline-start: 1rem;
	/* fallback position */
  position-try-options: --bottom;
}

/* @position-try fallback */
@position-try --bottom {
  margin: 2rem;
  inset-area: block-end span-all;
}
```

There is an [anchor tool](https://anchor-tool.com/) that illustrates the different values for `inset-area`.


### Autoflip

for basic adjustments like flipping from top to bottom or left to right (or both), you can skip creating custom `@position-try` declarations and use the built-in browser-supported [`flip` keywords](https://developer.chrome.com/blog/anchor-positioning-api#anchor_position_auto-flip_keywords): `flip-block` and `flip-inline` either on their own or combined. These work as stand-ins for custom @position-try declarations.

Anchor positioning simplifies the creation of anchored content, either as standalone elements or in combination with popovers and dialogues. The possibilities are worth exploring and promise fun and creative ways to display content.
