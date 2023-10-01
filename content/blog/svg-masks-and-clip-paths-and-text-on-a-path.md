---
title: "SVG Masks and Clip Paths"
date: "2019-03-25"
---

One of the fun things to explore is how we can mask and clip SVG elements and how we can do "text on a path" effects. As we explore these new elements we'll visit additional elements that make part of the mask and path functionality and how CSS interacts with SVG (TL, DR: It doesn't use the same elements).

## Masks

`mask` Defines an alpha mask for [compositing](https://en.wikipedia.org/wiki/Digital_compositing) the current object into the background. It will 'bleed' the background into the foreground element

The `pattern` element defines a graphics object which you can tile (repeat at x and y coordinate intervals) to cover an area. This is similar to what we can do with blend modes in CSS

The [`patternUnits`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/patternUnits) attribute defines the coordinate system in use for `x`, `y`, `width` and `height` properties of the element.

The [`image`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image) SVG element includes images inside SVG documents. **It can display raster image files (JPG or PNG) or other SVG files. The behavior for animated GIFs is undefined.**

The SVG [`text`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text) element defines a graphics element consisting of text. It's possible to apply a gradient, pattern, clipping path, mask, or filter to `text`, just like any other SVG graphics element.

If you include text within SVG outside a `text` element, it is not rendered. **This is different from being hidden by default, as setting the display property will not show the text.**

The SVG portion of the example includes the image pattern and the text that we want to use as the mask.

```svg
<svg>
  <defs>
    <pattern  id="wood"
              patternUnits="userSpaceOnUse"
              width="400" height="400">
    <image
            xlink:href="http://subtlepatterns.com/patterns/purty_wood.png"
            width="400" height="400" />
    </pattern>
  </defs>
  <!-- 
    The text below will have the background image of the pattern
  -->
  <text y="1.2em">SVG rocks!</text>
</svg>
```

The CSS sets the dimensions of the SVG element and the text fill, the color inside the element, to use the wood pattern we've defined in the SVG.

When we use CSS to style SVG elements we need to be aware that SVG doesn't use the same selectors, attributes, and values than regular CSS.

```css
svg {
  width: 8em;
  height: 2em;
  font-weight: 900;
  font-size: 5em;
  line-height: 1.2;
  font-family: 'Arial Black', sans-serif;
}

text {
  fill: url(#wood);
}
```

## Clip Path

[`clipPath`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath) defines a clipping path.

The idea is that whatever changes we make to the image will not go larger than the clipping path. In this example, we create to elements inside the SVG a circle and a path with the shape of a heart.

We use the clipping path with the `clip-path` property.

```svg
<svg viewBox="0 0 100 100">
  <clipPath id="myClip">
    <circle cx="40" cy="35" r="35" />
  </clipPath>
 
  <path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" />
 
  <use clip-path="url(#myClip)" xlink:href="#heart" fill="red" />
</svg>
```

The CSS handles the animation using keyframes. We're animating the `r` attribute from CSS. We want the circle to grow into the full size of the clipping element and ignore anything falling outside.

Unfortunately, this example doesn't work in Firefox (tested with 67 nightly in a Mac) because it doesn't support geometry properties in CSS. [Bug 1383650](https://bugzilla.mozilla.org/show_bug.cgi?id=1383650) is tracking the issue but it doesn't appear to be a high priority.

The workaround is to remove the `clip-path="url(#myClip)"` from the use element . We lose the animation but at least we get the color we want to display the clipped element in.

I'm also researching if it's possible to do this with JavaScript or with CSS `@support` techniques.

```css
html,body,svg {
  height:100%;
}

@keyframes animateHeart {
  from {
    r: 0
  }

  to {
    r: 60px
  }
}

#myClip circle {
  animation: animateHeart 15s infinite;
}
```

## Conclusion

SVG can be as simple or as complicated as you need it to be. There are other areas that I want to further explore as I move deeper into the things you can and cannot do with SVG as a vector graphic format.
