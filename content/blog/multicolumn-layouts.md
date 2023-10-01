---
title: "Multicolumn layouts"
date: "2015-08-17"
categories: 
  - "typography"
---

CSS 3 allows you to create multi column layouts without cheating. According to caniuse.com the feature is [supported to some degree](http://caniuse.com/#feat=multicolumn) by all browser vendors. We'll explore some of the things you can do with columns and where the limitations are.

Please note that these examples use -moz and -webkit prefixes (for Chrome). To make sure the column examples work when you make changes you have to change all three values (prefixed and unprefixed.) This PITA makes columns another great candidate for autoprefixer or a SASS mixin.

Finally, because this is still a work in progress, some aspects of the spec is not implemented in all browsers. If this is an issue for you please consider using polyfills.

### Creating multi column text: counting columns

The easiest way to work with columns is to tell CSS how many columns you want using the (prefixed) column-count property. This will tell the bowser how many columns to use. It will stick to that number of columns no matter what. They will be as wide or narrow as they need to be but the browser will always honor the number of clumns you tell it to use.

\[codepen\_embed height="665" theme\_id="2039" slug\_hash="oXexXr" default\_tab="result" user="caraya"\]See the Pen [Counting Columns](http://codepen.io/caraya/pen/oXexXr/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Creating multi column text: counting width

The opposite effect is to use the (also prefixed) column-width property. Where column count takes a single integer without unit as its value, column-width takes a value with unit (like the 150px used in CSS Example 12-2) and will create as many columns of that width as there is space available. Contrast CSS Example 12-1 and 12-2. Where 12-1 sticks to the two columns, 12-2 creates as many 150px columns as it can with the space available. Try narrowing the window and see what happens in example 12-2... the number of columns will shrink a the space available decreases.

\[codepen\_embed height="671" theme\_id="2039" slug\_hash="NqvNGj" default\_tab="result" user="caraya"\]See the Pen [Measuring Columns Width](http://codepen.io/caraya/pen/NqvNGj/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Creating multi column text: the shorthand method

Some times I'm lazy and I want to just make columns work. Fortunately there is a shorthand syntax for column-width and column-count. It's just columns. Examples of legal values taken from the CSS3 colmn module specification:

```css
body {
  columns: 12em;      /* column-width: 12em; column-count: auto */
  columns: auto 12em; /* column-width: 12em; column-count: auto */
  columns: 2;         /* column-width: auto; column-count: 2 */
  columns: 2 auto;    /* column-width: auto; column-count: 2 */
}
```

As we can see it's either a column-count or column-width, not both.

### Column Gap

In both examples, the browser took it upon itself to create a gap between columns. In this case it was OK but it is not always the case. Fortunately the multi column spec gives you the ability of specifying a gap between the columns of your text.

\[codepen\_embed height="675" theme\_id="2039" slug\_hash="RPZarP" default\_tab="result" user="caraya"\]See the Pen [CSS Column Gap](http://codepen.io/caraya/pen/RPZarP/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

As you can see in the examples, the further apart we put the columns the easier each column it is to read but we get a smaller space to work with the overall text content.

\[codepen\_embed height="640" theme\_id="2039" slug\_hash="gpxrMM" default\_tab="result" user="caraya"\]See the Pen [CSS Column Gap - 4em](http://codepen.io/caraya/pen/gpxrMM/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Column Rules

In this context, rules are vertical lines between the columns to help differentiate the columns and prevent runon text. We can combine this with gutter/gap as in example 12-4 to create a more pleasing reading experience.

\[codepen\_embed height="527" theme\_id="2039" slug\_hash="pJryEa" default\_tab="result" user="caraya"\]See the Pen [Columns with rules between columns](http://codepen.io/caraya/pen/pJryEa/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Spanning Columns

There are times when it's nice to have an element (a div that holds byline information, for example) span the full width of our content area without regard to the number of columns. CSS Columns module provides the column-span rule to do just that.

This is where we see the first deviation from the specification. According to [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/column-span), Firefox does not support column-span at all, it displays the content in its own column regardless of the settings authors choose.At least the result is not too bad...

\[codepen\_embed height="527" theme\_id="2039" slug\_hash="mJMPOP" default\_tab="result" user="caraya"\]See the Pen [Spanning Columns with CSS](http://codepen.io/caraya/pen/mJMPOP/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Filling Columns

So far columns are filled unevenly in all our examples. The right most column is shorter (sometimes considerably so.) The column-fill property will, when supported, make all the columns even in length. Currently only firefox will support the column-fill property.

\[codepen\_embed height="675" theme\_id="2039" slug\_hash="XbadMo" default\_tab="result" user="caraya"\]See the Pen [Column Fill](http://codepen.io/caraya/pen/XbadMo/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Column Breaks

One of the most complex aspects of working with multi column content is how to prevent breaks inside, before or after a given piece of text. It gets even more complex when we factor columns into the mix. We'll explore how to make sure that breaks work and that they actually do what we want them to:

In this case we'll make the title h2 element stand alone in its own column and move the body text to the right and keep in the two column format. In the older days you'd accomplish this with table-based layouts but now it can be done using only CSS in bowsers that support it.

\[codepen\_embed height="675" theme\_id="2039" slug\_hash="pJryPV" default\_tab="result" user="caraya"\]See the Pen [CSS Column Break - Take 1](http://codepen.io/caraya/pen/pJryPV/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

This is easy but it gets more complicated when we look at other values for `break-before`, `break-after` and `break-inside` that describe whether we should break before the element, after the element or inside the element. We'll try another example where we'll tell the browser to explicitly break after a paragraph... the results may not be what you'd expect.

I assumed, incorrectly as it turns out, that the break would still keep the content inside the parent's container but as you can see it did not. In order to get the effect I wanted I had to provide smaller gap between columns and give different break styles to even and odd paragraphs. The second try looks better but it is brittle... although my tests have worked consistently I keep thinking there may be a combination of browser width where this will break.

\[codepen\_embed height="521" theme\_id="2039" slug\_hash="aOyNwx" default\_tab="result" user="caraya"\]See the Pen [CSS Column Break - Take 3](http://codepen.io/caraya/pen/aOyNwx/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

### Mixins and Autoprefixer

If you're a SASS monkey then you can use a mixin like the one below to work with columns. The mixing makes it easier for you to work with prefixes by abstracting the prefixes and, where it makes sense, providing sensible defaults.

```scss
@mixin column-attribs ($cols, $gap, $fill: balance, $span: none){
  /* How many columns? */
  -moz-column-count: $cols;
  -webkit-column-count: $cols;
  column-count: $cols;
  /* Space between columns */
  -moz-column-gap: $gap;
  -webkit-column-gap: $gap;
  column-gap: $gap;
  /* How do we fill the content of our columns, default is to balance */
  -moz-column-fill: $fill;
  -webkit-column-fill: $fill;
  column-fill: $fill;
  /* Column span, defaul is not to span columns */
  -moz-column-span: $span;
  -webkit-column-span: $span;
  column-span: $span;
}
```

```scss
.col2 {
  width: 100%;
  @include column-attribs (2, 20px);
}
```

And the result looks like this:

```css
.col2 {
  width: 100%;
  /* How many columns? */
  -moz-column-count: 2;
  -webkit-column-count: 2;
  column-count: 2;
  /* Space between columns */
  -moz-column-gap: 20px;
  -webkit-column-gap: 20px;
  column-gap: 20px;
  /* How do we fill the content of our columns, default is to balance */
  -moz-column-fill: balance;
  -webkit-column-fill: balance;
  column-fill: balance;
  /* Column span, defaul is not to span columns */
  -moz-column-span: none;
  -webkit-column-span: none;
  column-span: none;
}
```

I understand that there are designers who are not comfortable with SASS/SCSS. For those people I think the best solution is to use automatic prefixer tools, either directly or as part of an automated workflow. I've chosen to use [autoprefixer](https://github.com/postcss/autoprefixer) in a [Grunt](http://gruntjs.com/) workflow.

I won't go into details about the Grunt workflow but if you're familiar with Grunt it shouldn't be too hard to add Autoprefixer to the process. If you want to look at a (somewhat disorganized) reference you can look at the [Gruntfile](https://github.com/caraya/books-as-apps/blob/master/Gruntfile.js) I created for this project.

### Links and Resources

From MDN

- [break-before](https://developer.mozilla.org/en-US/docs/Web/CSS/break-before)
- [break-after](https://developer.mozilla.org/en-US/docs/Web/CSS/break-after)
- [break-inside](https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside)
- [orphans](https://developer.mozilla.org/en-US/docs/Web/CSS/orphans)
- [widows](https://developer.mozilla.org/en-US/docs/Web/CSS/widows)
