---
title: "New CSS media queries"
date: "2023-09-18"
---

There is more to writing defensive CSS than what I thought.

This post will look at feature queries (the `@supports` at rule) and CSS support for OS-level accessibility rules.

## Feature queries

Before Feature Queries, we used to code multiple values for the same rules and relying on the order of the values to what will be rendered.

In this example the browser supports both color spaces so the last one defined is the one that the browser will use.

```css
.demo {
  background-color: #2632c2;
  background-color: oklch(0.42 0.22 269);
}
```

This works for a single element or a single set of rules. But we may have to adapt multiple elements to acommodate the lack of a feature.

For example. We may define a photo layout using Flexbox, more likely to be supported in older browsers, to create the layout.

```css
.photo-layout {
  display: flex;
  flex-flow: row wrap;
  gap: 1
}
```

We then use [@supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) to create a layout that uses grid but will only work on browsers that support grid, indicated by `display: grid`.

```css
@supports (display: grid) {
  .photo-layout {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 2rem;
    > div {
      margin: 0;
    }
  }
}
```

CSS feature support changes over time. Support for the `@support` at-rule itself used to be problematic but that's less of a problem now that IE and older versions of Safari in iOS are seeing less usage.

That said, `@support` is still necessary where styles for browsers that don't support the feature are significantly different than those that support it.

### Additional Features

There are other things that you can do with `@support`. You can test for:

- **selector()**: Test if the browser supports the specified selector syntax
- **font-format**: Checks if the browser supports a given font format such as SVG, Opentype, WOFF or WOFF2
- **font-tech()**: Tests if a browser supports the specified font technology

The one I find most use are `font-format()` and `font-tech()` since there are many font formats and technologies that are not always compatible between browsers.

For example, if we want to test if the browser supports WOFF2 variable fonts we can do something like this:

```css
@supports 
  font-format(woff2) 
  and
  font-tech(variations) {
  /* 
    Load the woff2 variable fonts here
  */
}
```

### Logical Operators

There are also the `and`, `or`, and `not` logical operator. These are standard boolean values that you can use to create more specific rules.

For example: If you need to support grid and flexbox, you can do it like this:

```css
@supports (display: grid) and (display: flex) {
  /* Go crazy */
}
```

If you need one or the other, swtich to an `or` query:

```css
@supports (display: grid) or (display: flex) {
  /* Go crazy */
}
```

If you want to provide styles for browsers that **don't support** flexbox, you can use `not` in the at-rule

```css
@supports not (display: flex) {
  /* 
    if this runs the browser 
    doesn't support flexbox
  */
}
```

For more information, check MDN's [@supports](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports) page.

### Accessibility

There are also a set of media queries that allow you to match the OS settings for some accessibility-related functions. This will prevent accessibility issues and unexpected design / color changes.

The list of accessibility-related media queries I was able to find through MDN is listed below:

- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries_for_accessibility)
- [prefers-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast)
- [prefers-reduced-transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-transparency)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [inverted-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors)

We'll discuss each of these features in turn.

### prefers-reduced-motion

Animations are awesome, most of the time. But some animations or several of them together can cause issue like vertigo and diziness for some users.

This media query interfaces with the operating system's motion accessibility preferences to provide a better experience for people who may have issues with animations.

Some of these potential issues include [vestibular disorders](https://www.webmd.com/brain/vestibular-disorders-facts), dizziness and nausea.

In the following example, the animation class runs the vibrate animation indefinitely every 0.3 seconds.

```css
.animation {
  animation: vibrate 0.3s linear infinite both;
}
```

Inside the `prefers-reduce-motion` media query we disable the animation altogether. If the use has set their operating system to reduce motion we want to honor that request.

```css
@media (prefers-reduced-motion: reduce) {
  .animation {
    animation: none;
  }
}
```

As Mozilla points out in their documentation page: The value of `prefers-reduced-motion` is `reduce`, not `none`. Users expect non-essential motion animation triggered by interaction to be disabled, and only essential animation to continue to work.

For an explanation of why this is important, see WCAG: [Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html).

**References**.

- [Designing Safer Web Animation For Motion Sensitivity](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/)
- [Vestibular Issues in Parallax Design](https://www.webaxe.org/vestibular-issues-parallax-design/)
- [Your Interactive Makes Me Sick](https://source.opennews.org/articles/motion-sick/)
- [Animation from Interactions](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html) — WCAG 2.1 Understanding Docs
- [How the parallax effect is used in web design](http://www.techrepublic.com/blog/web-designer/how-the-parallax-effect-is-used-in-web-design/) — TechRepublic
- [A Primer To Vestibular Disorders](http://a11yproject.com/posts/understanding-vestibular-disorders/) — The Accessibility Project
- [Animation for Attention and Comprehension](http://www.nngroup.com/articles/animation-usability/) — Nielsen Norman Group
- Infinite Canvas 6: [Vestibular Disorders and Accessible Animation](https://youtu.be/QhnIZh0xwk0) — (YouTube)
- [Accessibility for Vestibular Disorders: How My Temporary Disability Changed My Perspective](https://alistapart.com/article/accessibility-for-vestibular/)
- [Accessible Web Animation: The WCAG on Animation Explained](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/)
- [Designing With Reduced Motion For Motion Sensitivities](https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities/)
- [Why Motion on Websites and Digital Content Is a Problem](https://equalentry.com/why-motion-on-websites-and-digital-content-is-a-problem/)

### prefers-contrast

This media query will check if the user has requested special contrast accommodations. The possible values are:

no-preference

The user has made no preference known to the system. Evaluates as false in a Boolean context.

- **more**: The user has notified the system that they prefer an interface that has a higher level of contrast
- **less**: The user has told the OS they prefer an interface a lower level of contrast
- **custom**: The user wants to use a specific set of colors, and the contrast of these colors doesn't match `more` or `less`
    
    - This value will match the color palette specified by users of `forced-colors: active`.

This media query would benefit people in multiple situations as mentioned in the [`prefers-contrast` media queries specification](https://drafts.csswg.org/mediaqueries-5/#prefers-contrast):

- Many users have difficulty reading low-contrast text and would prefer a larger contrast
- People suffering from migraine may find high-contrast pages to be visually painful and would prefer lower contrast
- Some people with dyslexia find high contrast text hard to read, as they feel that the letters shine / sparkle as if backlit by too bright a light, and find low contrast to be more comfortable
- Environmental factors may also lead a user to prefer more or less contrast

In the following example we set the weight of the `.content` element to 400.

```css
.content {
  font-weight: 400;
}
```

For a higher contrast setting we may want to ensure that the color is black and increase the weight of the font.

```css
@media (prefers-contrast: more) {
  .content {
    color: black;
    font-weight: 600;
  }
}
```

Be mindful with the defaults that you use and that you provide sensible overrides for the opposite theme.

### prefers-reduced-transparency

This is an experimenta query only available in Chrome Canary behind the `#enable-experimental-web-platform-features` flag.

This features matches the OS setting for reduced transparency or translucent layer effects used on the device. This may help with readability for some users.

The two possible values are:

- **no-preference** indicates that the user has not set a preference. This evaluate to false
- **reduce** indicates that the user has set a preference to reduce transparency

In the example below, the default for the `translucent` class is fairly transparent.

```css
.translucent {
  opacity: 0.4;
}
```

If the user has enabled reduced transparency, we want to make the translucent elements more opaque, possibly removing opacity altogether.

```css
@media (prefers-reduced-transparency: reduce) {
  .translucent {
    opacity: 0.8;
  }
}
```

### prefers-color-scheme

This media query detects if they user has selected a light or a dark theme in the OS preferences.

The two values are:

- **light**
- **dark**

In macOS, the default value is `automatic`, meaning that the user has delegated the theme selection to the OS.

This example provides two themes: a light theme (`theme-a`) and a dark one (`theme-b`).

```css
.theme-a {
  background: #dca;
  color: #731;
}

.theme-b {
  background: #447;
  color: #bbd;
}
```

We can then query if the user has requested a dark theme and can create an adaptation of the light class that converts it to a darker version of the same design.

```css
@media (prefers-color-scheme: dark) {
  .theme-a.adaptive {
    background: #753;
    color: #dcb;
    outline: 5px dashed #000;
  }
}
```

Likewise with the dark class. If the user has requested a light theme, we adapt the theme by making the theme darker.

```css
@media (prefers-color-scheme: light) {
  .theme-b.adaptive {
    background: #bcd;
    color: #334;
    outline: 5px dotted #000;
  }
}
```

### inverted-colors

The `inverted-colors` query tests if the user agent or the underlying operating system has inverted all colors.

The possible values are:

- **none**: colors are not inverted and displayed normally
- **Inverted**: colors are inverted. This evaluates as true

Inversion of colors can have unpleasant side effects, such as shadows turning into highlights, which can reduce the readability of the content. Using this media feature, you can detect if inversion is happening and style the content accordingly while respecting user preference.

The example presents a default color for text

```css
p {
  color: gray;
}
```

If the user has requested inverted colors, we can use the `inverted-colors` query to change the colors

```css
@media (inverted-colors: inverted) {
  p {
    background: black;
    color: white;

  }
}
```

### forced-colors

The `forced-colors` query detects if the user has enabled a forced high-contrast mode like Windows' High Contrast mode at the OS level.

The two possible values for this query are:

- **none**: Forced colors mode is not active
- **active**: Forced colors mode is active
    
    - The browser provides the color palette to authors through the CSS system color keywords and, if appropriate, triggers the appropriate value of `prefers-color-scheme` so that authors can adapt the page

Unlike the other media queries we've discussed, developers should not be working with `forced-colors` directly. As Mozilla indicates in their MDN documentation:

> In general, web authors should not be using the forced-colors media feature to create a separate design for users with this feature enabled. Instead, its intended usage is to make small tweaks to improve usability or legibility when the default application of forced colors does not work well for a given portion of a page Source: [forced-colors](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors)

For a list of the elements that are changed while `forced-colors` are enabled see [properties affected by forced-colors mode](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors#properties_affected_by_forced-color_mode) in MDN.
