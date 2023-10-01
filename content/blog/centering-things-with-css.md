---
title: "Centering things with CSS"
date: "2023-08-21"
---

Centering content, particularly vertical centering, has always been very challenging to me.

## The old way

These are some techniques to center content using CSS before Flexbox.

### Aligning text

Aligning text is easy. We use something like this to center align all paragraphs:

```css
p {
  text-align: center;
}
```

or a class to center specified content:

```css
.center {
  text-align: center;
}
```

### Centering Content

My favorite trick to center larger blocks of content is to use `margin` attributes with the `auto` value.

If you use the two-value margin declaration then you need to remember that the first value is for the top **and** bottom margins, and the second value is for the right **and** left margins.

```css
/* These are equivalent */

.center {
  margin-left: auto;
  margin-right: auto;
  width: 100px
}

.center {
  margin-inline: auto;
  width: 100px;
}

.center {
  margin: 0 auto;
  width: 100px;
}
```

### Vertical Centering Text or Objects

Vertical centering is much more complex and would require more code to accomplish the same effect.

For this content:

```html
<div class="container">
  <div class="center">
    <p>This is an example</p>
  </div>
</div>
```

Use the following CSS to center the \`\` element vertically on the screen.

```css
.container {
  position: relative;
  text-align: center;
  display: block;
  height: 100%;

  &::before,
  .center {
    display: inline-block;
    vertical-align: middle;
  }

  &::before {
    content: "";
    width: 0;
    height: 100%;
  }
}
```

## Using Flexbox

[Flexbox](https://www.w3.org/TR/css-flexbox-1/) has simplified things considerably.

For the Flexbox examples we will use the following HTML code.

```html
<div class="flexer-container">
  class="item one"></div>
  class="item two"></div>
  class="item three"></div>
</div>
```

horizontal centering with Flexbox assumes the following

- We're working with rows
- We don't have enough items for the layout to wrap
- We didn't set up the layout to wrap

The individual items (elements with class `.item`) need to have dimensions or they won't lay out properly.

```css
.flexer-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0px;
}

.item {
  align-self: auto;
  height: 150px;
  width: 150px;
  border: 4px solid oklch(0 0 0);
}
```

Centering content vertically uses almost identical code than the one we use for inline centering.

The difference is that, instead of using `justify-content: center;` we use `align-items: center;` to handle vertical centering.

The container element must have a `height` descriptor for vertical alignment to work.

```css
.flexer-container {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 800px
}

.item {
  height: 150px;
  width: 150px;
  border: 2px solid oklch(0 0 0);
}
```

The final centering technique is to both center vertically and horizontally.

Using both `justify-content` and `align-items` to place the content at the center of the screen both vertically and horizontally.

```css
.flexer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 800px;
}

.item {
  height: 150px;
  width: 150px;
  border: 2px solid oklch(0 0 0);
}
```
