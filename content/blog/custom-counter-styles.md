---
title: "Custom Counter styles"
date: "2021-08-02"
---

[Ready-made Counter Styles](https://www.w3.org/TR/predefined-counter-styles/) provides a collection of predefined counter styles you can just drop into a stylesheet.

These pre-defined custom counters are great to work in international documents since many non-Latin languages define their own numbering systems and the characters they use on their systems. They also provide several Arabic and Roman predefined number styles.

The following example creates fifty Arabic numbers with a circle around them (it uses Unicode codepoints to make the numbers).

```css
@counter-style circled-decimal {
  system: fixed 0;
  symbols: "\24EA""\2460""\2461""\2462""\2463""\2464""\2465""\2466""\2467""\2468""\2469""\246A""\246B""\246C""\246D""\246E""\246F""\2470""\2471""\2472""\2473""\3251""\3252""\3253""\3254""\3255""\3256""\3257""\3258""\3259""\325a""\325b""\325c""\325d""\325e""\325f""\32b1""\32b2""\32b3""\32b4""\32b5""\32b6""\32b7""\32b8""\32b9""\32ba""\32bb""\32bc""\32bd""\32be""\32bf";
  suffix: " ";
}
```

Once we have the style, we can reference it in our definition for a list item. In this case, we use the default numbered list.

```css
ol {
  list-style-type: circled-decimal;
}
```

We could also create multiple counter styles and reference them by class or ID.

If we define a `filled-circle-decimal` counter style, we can use it to create a list that uses it.

```css
.filled-list {
  list-style-type: filled-circled-decimal;
}
```

One big caveat with custom counter styles is defining all the numbers you intend to use. That's why the `circled-decimal` style defined fifty numbers. I doubt I would ever use that many, but numbers above fifty will not get the circled style if I ever do.

Same with `filled-circle-decimal`. It will only display the first ten items with the style and everything after that will be displayed with the default style. We can define more numbers in the style declaration to avoid this problem.

Another consideration is Safari and WebKit browsers. They don't support custom counter styles so we'll have to work around that using a feature query or perhaps using Unicode directly.

A working example can be found in this [codepen](https://codepen.io/caraya/pen/YzVQNMG)

<iframe height="300" style="width: 100%;" scrolling="no" title="Custom List Styles" src="https://codepen.io/caraya/embed/YzVQNMG?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/YzVQNMG">
  Custom List Styles</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
