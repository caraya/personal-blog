---
title: Playing with Writing Modes
date: 2026-02-23
tags:
  - Design
  - Layout
  - CSS
  - Web
baseline: true
---

Writing modes have a significant impact on how text is displayed on a webpage. By manipulating writing modes, designers can create unique and engaging layouts that enhance the user experience. Below are some examples of different writing modes and their effects.

Until recently, not all browser could use sideways text, they could only display vertical text in the upright orientation. This woulld work well for languages like Chinese, Japanese, and Korean, but not so well for Latin-based languages. Now, with better support for the `text-orientation` property, we can create more versatile designs in all languages.

This post will explore the use of text-orientation attribute in CSS.

## What It is?

<baseline-status
  featureId="text-orientation">
</baseline-status>

The `text-orientation` CSS property defines the orientation of the text in a line. It is used in conjunction with the `writing-mode` property to control how text is displayed in vertical writing modes. `text-orientation` will only work when writing-mode is set to a vertical value, such as `vertical-rl` or `vertical-lr`.

It can take the following values:

- `mixed`: The default value. Characters are oriented according to their natural orientation.
- `upright`: All characters are oriented upright, regardless of their natural orientation.
- `sideways`: All characters are rotated 90 degrees clockwise.

It provides a fallback for displaying text sideways, different from the sideways-rl and sideways-lr values of the `writing-mode` property,.

This example uses Kanji as the base language and includes some Arabic numerals.

```html
<div class="event-poster">
  <h1 class="event-title">春の桜祭り開催</h1>

  <p>今年の桜は例年より早く満開を迎える見込みです。美しい夜桜をお楽しみください。</p>

  <p class="event-date">
    日時：<span class="rotate">2025</span>年<span class="rotate">4</span>月<span class="rotate">12</span>日（土）
  </p>
</div>
```

The relevant CSS is the rotate class. It uses `text-orientation: sideways` to rotate the numerals. In a more professional design, you'd likely use the tate chū yoko (縦中横) technique to keep the numerals aligned horizontally within the vertical text flow.

```css
.rotate {
  text-orientation: sideways;
  font-feature-settings: "hwid";
}
```

The full live example is available in this CodePen:

<iframe height="598" style="width: 100%;" scrolling="no" title="Contrived text-orientation example" src="https://codepen.io/caraya/embed/VYaoMVE?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">
      See the Pen <a href="https://codepen.io/caraya/pen/VYaoMVE">
  Contrived text-orientation example</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The same example using tatu chū yoko would look like this. Note how the 2025 numerals were shrunk to fit vertically within the text flow:

<iframe height="608" style="width: 100%;" scrolling="no" title="(less) contrived text-orientation example" src="https://codepen.io/caraya/embed/JoXgOzQ?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">
      See the Pen <a href="https://codepen.io/caraya/pen/JoXgOzQ">
  (less) contrived text-orientation example</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### Why do we need it

There are several reasons why `text-orientation` is a valuable addition to CSS:

1. **Better control over text orientation**: With `text-orientation`, designers can specify how individual characters should be displayed in vertical writing modes, allowing for more precise control over the layout and appearance of text.
2. **Improved readability**: By orienting text appropriately, especially in vertical layouts, `text-orientation` can enhance readability and make content more accessible to users.
3. **Enhanced design flexibility**: The ability to control text orientation at a granular level opens up new possibilities for creative and functional design in web layouts.
4. **Fallback for unsupported browsers**: `writing-mode: sideways-lr` and `sideways-rl` have only recently gained support in all browsers. Using `text-orientation: sideways` provides a way to achieve similar effects in browsers that do not yet support these writing modes.

## Differences with sideways writing modes

Visually, the end result of using `text-orientation: sideways` in a vertical writing mode can be similar to using `writing-mode: sideways-lr` or `sideways-rl`. However, there are some key differences:

Character Rotation
: `text-orientation: sideways` rotates individual characters 90 degrees clockwise, while `writing-mode: sideways-lr` and `sideways-rl` rotate the entire line of text. This means that with `text-orientation`, each character maintains its own orientation, whereas with `writing-mode`, the entire text block is rotated.
: When using `text-orientation: sideways`, you have no control over the direction or amount of the rotation. It is fixed by the specification and cannot be changed.

Layout Behavior
: `text-orientation` allows for more granular control over individual characters, while `writing-mode` affects the entire text block, which can lead to different spacing and alignment.

Compatibility
: `text-orientation: sideways` can be used as a fallback for browsers that do not support `writing-mode: sideways-lr` and `sideways-rl`, making it a more versatile option for ensuring consistent text orientation across different browsers.

This example shows both techniques side by side:

<iframe height="1255" style="width: 100%;" scrolling="no" title="writing-mode: sideways-* vs wrtiting-mode: vertical-* + text-orientation: sideways" src="https://codepen.io/caraya/embed/dPMxEyz?default-tab=result&editable=true" frameborder="no" loading="lazy" allowtransparency="true">
      See the Pen <a href="https://codepen.io/caraya/pen/dPMxEyz">
  writing-mode: sideways-* vs wrtiting-mode: vertical-* + text-orientation: sideways</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Conclusion

text-orientation allows developers more control over how text is displayed on screen.  We can rotate full lines of text, just like with writing-mode: sideways-lr/sideways-rl, but we can also rotate individual characters within a vertical text flow. This opens up new possibilities for creative and functional design in web layouts.

