---
title: "Responsive SVG graphics"
date: "2015-06-27"
categories: 
  - "technology"
---

One of the most intriguing things I've learned about SVG over the last few months is that we can run CSS, including media queries, inside the SVG file itself so the queries will modify the internal content of the files will change based on the queries inside the svg.

## Getting started

\[codepen\_embed height="564" theme\_id="2039" slug\_hash="MwrgJp" default\_tab="html" user="caraya"\]See the Pen [SVG basic example](http://codepen.io/caraya/pen/MwrgJp/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

The CSS for the SVG graphic is embedded in the SVG file itself. We copied the SVG file's XML content directly in the pen, but there's no reason why the content cannot be saved in a text file with a `.svg` extension.

Because SVG is an XML vocabulary we need to take some protective measures, particularly with our CSS. You will see `< ![CDATA[]]>` element surrounding the CSS inside our tag. This is an XML artifact that renders all its content as character data instead of markup. We do this to prevent any possibility of illegal XML characters inside our CSS from messing up the content.

## Simple changes

\[codepen\_embed height="482" theme\_id="2039" slug\_hash="qdpWoJ" default\_tab="result" user="caraya"\]See the Pen [SVG with Media Queries](http://codepen.io/caraya/pen/qdpWoJ/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

For our example, we'll add ID attributes to all elements. Since we are working in an individual SVG file we don't need to worry about weight or specificity, we can just do it.

After we add color to our content we create two media queries.

1. The first one will trigger when the width is smaller than 600px and it will hide the circle by setting its display property to none.
2. The second one will trigger when the screen becomes smaller than 320px and it will hide the rectangle by setting its display property to none, leaving only the start visible in our SVG image.

```css
@media (max-width: 600px) { /* 1 */
  #circle1 {
    display: none;
  }
}

@media (max-width: 320px { /* 2 */
  #rectangle1: {
    display: none;
  }
}
```

We can get more sophisticated by performing multiple actions within each media query. This allows to play with with both animations, different media query types that I wouldn't normally use and animations where they are appropriate.

```markup
<div class='container'>
  <?xml version="1.0" encoding="iso-8859-1" ?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 300 300" style="enable-background:new 0 0 300 300;" xml:space="preserve">

    <defs>
      <style>
              #rectangle1 {
                fill: #f00;
              }

              #circle1 {
                fill: #00f;
              }

              #star1 {
                fill: #0f0;
                transform:  rotate(0deg);
              }

              /* Media Queries */
              @media (max-width: 1000px) { /* 1 */
                #circle1 {
                  display: none;
                }
              }

              @media (max-width: 800px) { /* 2 */
                #circle1 {
                  display: block;
                  fill: #f0f;
                }

                #rectangle1: {
                  display: none;
                }

                #star1 {
                    display: #663399; /* rebeccapurple */
                    animation: animationFrames ease-out 2s;
                    animation-iteration-count: 2;
                    transform-origin: 0 0 ;
                  }

                  @keyframes animationFrames{
                    0% {
                      transform:  rotate(0deg);
                    }
                    99% {
                      transform:  rotate(180deg);
                    }
                    100% {
                      transform: roatete(0deg);
                    }
                  }
                }
      </style>
    </defs>

    <rect x="61.768" y="61.768" transform="matrix(0.7071 0.7071 -0.7071 0.7071 150 -62.1321)" width="176.464" height="176.464" id='rectangle1' />

    <circle cx="150" cy="148" r="96" id='circle1' />

    <polygon points="150, 16.914 176.961, 99.892 264.208, 99.892 193.624, 151.174 220.585, 234.151 150, 182.869 79.415, 234.151 106.376, 151.174 35.792, 99.892 123.039, 99.892 " id='star1' />

  </svg>

</div>
```

We'll take the same image as we used in the example before and both change colors and perhaps move them around when we hit the different breakpoints. In the Codepen above we do the following things:

1. In addition to the color for the #star1 element's fill we make sure that we rotate it to 0 degrees by default
2. When the browser is 1000 pixels or smaller we hide the circle element
3. When the browser is 800 pixels or smaller we do the following:
4. We display `#circle1` again (it was hidden in the previous query) and we change its color to #f0f
5. We take the `#star1` element, change its color to #663399 and set up animation attributes: animation tells the user agent what animation, what animation type and for how long we want to use the animation
6. Definition for the animation steps references in step 5. We define each frame as what percentage of the animation we want that specific action to work on. In this case we defined 3 frames but we can define additional frames to make the animation smoother

```css
#star1 { /* 1 */
  fill: #0f0;
  transform:  rotate(0deg);
}

/* Media Queries */
@media (max-width: 1000px) { /* 2 */
  #circle1 {
    display: none;
  }
}

@media (max-width: 800px) { /* 3 */
  #circle1 { /* 4 */
    display: block;
    fill: #f0f;
  }

  #rectangle1: {
    display: none;
  }

  #star1 { /* 5 */
    display: #663399; /* rebeccapurple */
    animation: animationFrames ease-out 2s;
    transform-origin: 50% 50% ;
  }

  @keyframes animationFrames{ /* 6 */
    0% {
      transform:  rotate(0deg);
    }
    99% {
      transform:  rotate(180deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
}
```

The one shortcoming of our image as currently implemented is that there are not enough steps for a smooth 360 degree transition. We could add more steps and make each step more gradual, something like this:

```css
  @keyframes animationFrames{ /* 6 */
    0% {
      transform:  rotate(0deg);
    }
    25% {
      transform:  rotate(90deg);
    }
    50% {
      transform:  rotate(180deg);
    }
    75% {
      transform:  rotate(270deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
```

You can use the same techniques to completely change the appearance of your SVG graphic based on size or any query type you can use Media Queries with. The good news is that [Media Queries Level 4](http://dev.w3.org/csswg/mediaqueries-4/) provides a much larger feature set for you to work with.

For example, we can modify our SVG content based on whether we're working with monochrome displays by using a query like this:

```css
@media (monochrome) {
  /* Rules for monochrome displays go here */
}

```

## Support in browsers or readers

CSS animations should work in all modern browsers that support SVG ([all modern browsers from IE9 onwards](http://caniuse.com/#feat=svg) according to caniuse.com).

When I first looked at CSS animations in e-readers I got scared that epub3 didn't support SVG animations but then I realized that it's SVG-only animations not CSS animations applied to SVG.

As with all the techniques I've discussed here **test all your content in your target devices**

## Conclusion

We can leverage a lot of the CSS tools and specifications inside of SVG files. This is not the only way to do it... We can take the CSS outside of the SVG and incorporate it with the CSS selectors and rules in the rest of our document. This adds our SVG CSS to the list of potential problems of specificity and you'll have to do a lot more work to make sure the cascade works for your design.

Either way it's a very interesting technique to add interactivity to your content in the open web.
