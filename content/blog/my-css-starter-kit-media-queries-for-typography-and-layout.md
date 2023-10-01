---
title: "My CSS Starter Kit:  Media Queries For Typography And Layout"
date: "2016-12-14"
---

# Media queries to control typography and layout

Media queries are awesome. They allow developers (us) to change elements of the design based on arbitrary criteria…. We finally can customize our designs to fit on the target devices rather than the other way around.

If we were to create a query for every device in the market we would be stuck in the process for a long, long time. Instead we'll build queries for device sizes using the following mixin. It’s broken in 2 sections:

- A nested map containing this information:
    
    - The names of the breakpoint
    - The minimum width
    - The maximum width
    - The DPI resolution
- A function that checks if the specified breakpoint exists in the nested table and, if it does, builds a query with the information for that breakpoint

```scss
@mixin media-queries( $qtype ) {
  $value: screen;
  $breakpoints: (
    // smartphones, portrait iPhone, portrait 480x320 phones (Android)
    ( phone-portrait,     20em,   30em,   1),
    // smartphones, portrait iPhone, portrait 480x320 phones (Android)
    ( phone-portrait-r,   20em,   30em,   2),
    // smartphones, Android phones, landscape iPhone
    ( phone-landscape,    30em,   37.5em, 1 ),
    // smartphones, Android phones, landscape iPhone
    ( phone-landscape-r,  30em,   37.5em, 2 ),
    // portrait tablets, portrait iPad, e-readers (Nook/Kindle), 
    // landscape 800x480 phones (Android)
    ( table-portrait,     37.5em, 50em,   1 ),
    // portrait tablets, portrait iPad, e-readers (Nook/Kindle), 
    // landscape 800x480 phones (Android)
    ( table-portrait-r,   37.5em, 50em,   2 ),
    // tablet, landscape iPad, lo-res laptops ands desktops
    ( table-landscape,    50em,   64em,   1),
    // tablet, landscape iPad, lo-res laptops ands desktops
    ( table-landscape-r,  50em,   64em,   2),
    // big landscape tablets, laptops, and desktops
    ( large,              50em,   80em,   1),
    // big landscape tablets, laptops, and desktops
    ( large-r,            50em,   80em,   2),
    // hi-res laptops and desktops
    ( xlarge,             80em,   100em,  1),
    // hi-res laptops and desktops
    ( xlarge-r,           80em,   100em,  2)
  );

  @each $item in $breakpoints {
    @if $qtype == nth($item, 1) {

    @media #{$value} and (min-width: nth($item, 2))
      and (max-width: nth($item, 3))
      and (-webkit-min-device-pixel-ratio: nth($item, 4)) {
        @content;
      }
    }
  }
}
```

We can then use the name for a specific family of devices, for example large (desktops) like this (using modular scale to calculate the size of the h1 element):

```scss
@include media-queries( large ) {
  h1 {
    font-size: ms(4);
  }
}
```

Which produces the following result:

```css
@media  screen and (min-width: 50em) and (max-width: 80em) 
        and (-webkit-min-device-pixel-ratio: 1) {
  h1 {
    font-size: 2.44141em;
  }
} 
```

The `@content` directive allow us to add data inside the mixin.

Because we've named our queries with devcie type and orientation the media queries will be easier to read and understand. Someone coming to our code should have no problem reasoning what devices the queries apply to.

TODO: Test if we can chain queries using our existing media-queries Mixin and what would it take to change it if it doesn't
