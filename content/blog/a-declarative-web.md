---
title: A declarative web?
date: 2024-02-14
tags:
  - CSS
  - Design
  - Web
youtube: true
---

Jeremy Keith recently published [Declarative design](https://adactio.com/journal/18982) on his blog.

The premise of the post is that there are two divergent ways to think about web design and building web content, encapsulated by these two opposed statements:

**CSS is broken and I want my tools to work around the way CSS has been designed**.

and

**CSS is awesome and I want my tools to amplify the way that CSS has been designed**.

Which of these statements resonates with you will influence the tools that you choose and the comfort you feel when you use tools that don't fit your paradigm.

This post will explore the idea of declarative web design and how it can be used to build web content and contrast it with a more imperative design paradigm represented by CSS in JS and Tailwind CSS in particular.

## Where we are now

CSS is not easy to learn well. We can write CSS that looks good but it's hard to write CSS that looks good, doesn't break when we make changes to other parts of the stylesheet and performs well at scale.

### One solution: CSS in JS

For people who want to "simplify" work with Javascript, the solution may be to use solutions like CSS in JS.

CSS in JS uses Javascript to generate CSS that will be inserted into your document, usually in an inline `<style>` element.

One of the perceived advantages is control.

> Primarily, CSS-in-JS boosts my confidence. I can add, change and delete CSS without any unexpected consequences. My changes to the styling of a component will not affect anything else. If I delete a component, I delete its CSS too. No more append-only stylesheets! ✨
>
> [Why I Write CSS in JavaScript](https://mxstbr.com/thoughts/css-in-js/)

CSS is not an easy language to master... I agree. Until recently it was hard to control the cascade and style only our target elements without running afoul of specificity or having to use `!important` rules everywhere.

If we run CSS in JS as part of a build process then we should be OK.

But if we want to run these components on the client then we have performance to consider. Like all Javascript, it goes through three phases

Download
: The browser must first download the script

Parse
: Once it's downloaded, the browser must parse the script and figure out what needs to be done. The script will not be executed yet

Execute
: All that is left is for the browser to execute the parsed scripts. Because we're inserting CSS into the page, there may be layout shifts

According to the [Styled Components](https://styled-components.com/docs/basics) documentation:

> styled-components is the result of wondering how we could enhance CSS for styling React component systems. By focusing on a single use case we managed to optimize the experience for developers as well as the output for end users.
>
> Apart from the improved experience for developers, styled-components provides:
>
> * Automatic critical CSS: styled-components keeps track of which components are rendered on a page and injects their styles and nothing else, fully automatically. Combined with code splitting, this means your users load the least amount of code necessary.
> * No class name bugs: styled-components generates unique class names for your styles. You never have to worry about duplication, overlap or misspellings.
> * Easier deletion of CSS: it can be hard to know whether a class name is used somewhere in your codebase. styled-components makes it obvious, as every bit of styling is tied to a specific component. If the component is unused (which tooling can detect) and gets deleted, all its styles get deleted with it.
> * Simple dynamic styling: adapting the styling of a component based on its props or a global theme is simple and intuitive without having to manually manage dozens of classes.
> * Painless maintenance: you never have to hunt across different files to find the styling affecting your component, so maintenance is a piece of cake no matter how big your codebase is.
> * Automatic vendor prefixing: write your CSS to the current standard and let styled-components handle the rest.

The following example is tied to React and the Styled Component library but it illustrates the basics of CSS in JS.

```js
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props => props.primary ? '#333' : '#fafafa'};
  color: ${props => props.primary ? '#fafafa' : '#333'};
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.primary ? '#222' : '#eee'};
  }
`;
```

Looking at this without knowing how the technology works raised a lot of questions for me.

* How do you customize the styles? Can you make it work with more than one style?
* Does it load the styles for every instance of the component rather than once and reuse the styles for all instances of the component?

### Tailwind CSS

One of the most popular CSS libraries is [Tailwind CSS](https://tailwindcss.com/). It has replaced older Frameworks like [Foundation](https://get.foundation/) and [Bootstrap](https://getbootstrap.com) but, from my perspective, it doesn't really resolve the problems that it tries to address.

Tailwind has a steep learning curve and, regardless of editor support, not all classes are easy to understand if you're not familiar with the way Tailwind works.

It is also result-focused. You tell it the exact results you want and Tailwind will produce them for you. I can see no way to customize these specific classes, no way to use fractional values or values between multiples of 100 working with Variable Fonts or use OpenType features available to the font. You still need to create custom CSS.

Take the following example. 

Can you tell what the styles do? Is the `items-center` class in the parent div for horizontal, vertical alignment or both? How large are the values of `rounded-xl`, `max-w-sm` or `shadow-lg`?

```html
<div class="p-6
            max-w-sm
            mx-auto
            bg-white
            rounded-xl
            shadow-lg
            flex
            items-center
            space-x-4">
  <div class="shrink-0">
    <img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo">
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-slate-500">You have a new message!</p>
  </div>
</div>
```

Tailwind CSS encourages you to style each element individually by applying multiple utility classes to it. However, this leads to duplication and inconsistency in your code, as you have to repeat the same classes for similar elements or change them slightly for different variations.

Yes, you can [extract components and partials](https://tailwindcss.com/docs/reusing-styles#extracting-components-and-partials) using Tailwind, but it doesn't change things much. The styles are still component-specific and it would require a new component if you want to create a slightly different style.

## The alternative: Use the web as intended

CSS has improved a lot in recent years. From Flexbox and Grid, better scoping, new ways to create CSS Custom properties, and new ways to control specificity. This has made creating robust and reusable styles easier. But it's hard to work against inertia.

For each of the reasons people developed Styled Components, I can think of several rebuttals using a PostCSS build system with a PostCSS Preset Env.

Automatic critical CSS
: Since we're already using a build system, there would be no problem in using tools like [Critical](https://github.com/addyosmani/critical) to extract and inline the critical CSS for multiple resolutions and then load the remaining CSS as we would normally do.

No class name bugs
: Having a strict naming scheme would prevent this class of bugs in regular CSS code.
: We may use naming schemes and code organization like [CUBE CSS](https://cube.fyi/), [BEM](https://getbem.com/introduction/), [SUIT CSS](https://suitcss.github.io/) or [OOCSS](http://oocss.org/) to prevent naming conflicts.

Easier deletion of CSS
: Since we already use a build system, there's no reason why we can't keep our styles along with the HTML and Javascript and @import it into a main stylesheet.
: If properly documented there shouldn't be any problem in deleting blocks of CSS in a main stylesheet.

Simple dynamic styling
: CSS Custom Properties (CSS Variables) can solve this issue. You can define the theme in the `:root` or `html` elements and then override them where it's necessary.
: Furthermore, if you use the more modern Houdini version of CSS variables, defined with the [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) at-rule, you get more control over the definition, including default values and control over inheritance.

Painless maintenance
: This is a documentation issue more than a strictly CSS one. Do you document how you style your components and what classes?
: Reusability and composability can be resolved using custom elements without Shadow DOM. Then we can use standard CSS for our documents.

Automatic vendor prefixing
: This may have been an issue with vendor prefixing when styled components were first released but it will continue to shrink in importance over the years, but never be fully eliminated.
: Using PostCSS you get the same behavior as using Babel for Javascript. You can choose what new features to implement write your CSS to the current standard and let the build system handle the rest.
: [Autoprefixer](https://github.com/postcss/autoprefixer) can also be used as a PostCSS plugin so we can add the plugin to our PostCSS workflow and let the build process handle it.

## New thinking about design?

But this is more than just how we think about our CSS and how we write it.
In this presentation, Andy Bell suggests that we look at building front-end web experiences as being the browser's mentor, not its micromanager. We don't need pixel-perfect layouts, instead, we can use a combination of these tools and methodologies

* Modern CSS with (Any) Methodology
* Fluid type & Space
* Flexible Layouts
* Progressive Enhancement

Many methodologies advocate for a more browser-centric approach. One that would work better with a more lenient usage of the component technologies of the web.

Some of these methodologies:

* [Intrinsic web design](https://www.youtube.com/watch?v=AMPKmh98XLY) &mdash; Jenn Simmons
* [Every Layout](https://every-layout.dev/) &mdash; Heydon Pickering &amp; Andy Bell
* [Utopia](https://utopia.fyi/) &mdash; James Gilyead &amp; Trys Mudford

I've chosen to work with [Every Layout](https://every-layout.dev/) to see how it's more declarative; it tries to work with the technologies of the web and it gives up some level of control to get the designs that we want.

* Progressive Enhancement
* Modern CSS with (Any) Methodology
* Flexible Layouts
* Fluid type & Space

<lite-youtube videoid="5uhIiI9Ld5M"></lite-youtube>

### Progressive Enhancement

Rather than create a pixel-perfect experience and let it degrade for less capable browsers (known as [graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation)) I prefer the opposite process of [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) where we create the basic functionality of the site first and then, where necessary, we enhance the functionality with Javascript and advanced CSS features. If these enhancements are not present the site won't break and will continue working.

The debate between progressive enhancement and graceful degradation is almost as old as the web and I don't expect to resolve it here. I'm just pointing out the way I prefer to work.

### Modern CSS with (Any) Methodology

Some tools that have made CSS easier for me to work with are:

* @scope
* [Functional pseudo-classes](https://publishing-project.rivendellweb.net/playing-with-css-selectors/) (`:is()`, `:has` and `:where` in particular)
* `var()`, `pow()`, `calc()` and `clamp()`
* Simplified nesting
* The OKLCH color space
* Relative colors

We will only cover some of these features in this post. We will explore them further in future posts.

#### @scope

@scope limits the reach of the selectors in your stylesheet. You first set up the `scoping root` to determine the upper boundary of the subtree you want to target.

With a scoping root set, the contained style rules (`scoped style rules`) can only be applied to the limited subtree of the DOM.

In this example, `img` elements and the elements with class `.img` will only match if they are inside an aside.

This would be particularly useful if we had different styles for elements based on their position in the document. It would also reduce the need for random class names and inline styles.

```css
@scope (aside) {
	img, .img {
		background: lightblue;
		border-color: navy;
	}
}
```

The `:scope` selector would match the root scope element.

This example adds a 5-pixel solid red border to all aside elements.

```css
@scope (aside) {
	:scope {
    border: 5px solid red;
	}
}
```

You can use the `to` keyword to set the lower boundary of a scope.

For example, we can style all images inside an `aside` element that are not part of the aside `.content` child.

```css
@scope (aside) to (.content) {
  img, .img {
    border-radius: 50%;
  }
}
```

For more information see [Limit the reach of your selectors with the CSS @scope at-rule](https://developer.chrome.com/docs/css-ui/at-scope#closing_note_selector_isolation_not_style_isolation)

#### calc(), var(), clamp(), and pow()

Mathematical functions make it easier to write rules that would normally require Javascript to run.

This section will concentrate on a few of these functions:

`var()`
: Let's you use an existing CSS Custom Property, regardless of how it was defined

`calc()`
: Performs calculations on their parameters.
: The parameters can be of different types and require coercion to the type we want to use

`clamp()`
: Given a lower and upper boundaries `clamp()` will calculate and use a value between the boundaries

`pow()`
: Allows exponents on CSS calculations

In this example, we set the base value to 1rem by multiplying 1 by 1rem and the factor to be 1.5

For each heading variable (`h1` to `h6`) we multiply the base value (`--base`) times the factor (`--factor`) raised to a given power.

```css
:root {
  --base: calc(1 * 1rem);
  --factor: 1.5;

  --h6: calc((var(--base)) * pow((var(--factor)), -1));
  --h5: calc((var(--base)) * pow((var(--factor)), 0));
  --h4: calc((var(--base)) * pow((var(--factor)), 1));
  --h3: calc((var(--base)) * pow((var(--factor)), 2));
  --h2: calc((var(--base)) * pow((var(--factor)), 3));
  --h1: calc((var(--base)) * pow((var(--factor)), 4));
}
```

We also use `clamp()` to constrain the value of the paragraph font size. Here we tell the browser to make the font size 2% of the browser width but no smaller than our base variable and no larger than 2.5 times the value of our base variable.

```css
p {
  width: 60ch;
  font-size: clamp((var(--base)), 2vw, (calc(var(--base) * 2.5)));;
}
```

With combinations like these, we have fluid typography and we can handle other areas of design with far fewer styles than we used to.

#### Simplified nesting

Nesting in native CSS always seemed like a mess to me compared to SASS nesting rules. Things have improved since the relaxation of the nesting rules.

You still need to add the `&` selector before the nested rules so the browser will know what you mean.

In the example below, we create a generic `.notice` class that holds all common aspects of the notices we want to use.

We then nest more specific classes with information that is specific to them like the background color.

```css
.notice {
  width: 600px;
  height: 200px;
  justify-content: center;
  border-radius: 50%;
  border: black solid 2px;
  color: black;
  padding: 1rem;

.notice .danger {
    background: red;
  }

.notice .warning {
    background-color: lightyellow;
  }

.notice .success {
    background-color: lightgreen;
  }
}
```

This is equivalent to:

```css
.notice {
  width: 600px;
  height: 200px;
  justify-content: center;
  border-radius: 50%;
  border: black solid 2px;
  color: black;
  padding: 1rem;
}

.notice .danger {
	background: red;
}

.notice .warning {
	background-color: lightyellow;
}

.notice .success {
	background-color: lightgreen;
}
```

Which one you use depends on your preferences. I prefer nesting as it makes it clear to me what I meant to do with the code.

#### The OKLCH color space and relative colors

Unlike RGB(A) colors, has different components to the color that make it better represent colors we can see and it makes it easier to manipulate with CSS or Javascript.

The four components of an LCH color are:

L (Perceived Lightness)
: A number between 0 and 1, a percentage between 0% and 100%, or the keyword none. It specifies the perceived lightness.
: 0 corresponds to 0% (black) and 1 corresponds to 100% (white).

C (Chroma)
: A number, a percentage, or the keyword none, where 0% is 0 and 100% is the number 0.4. It is a measure of the chroma (roughly representing the "amount of color").
: Its minimum useful value is 0, while the maximum is theoretically unbounded (but in practice does not exceed 0.5).

H (Hue)
: A `<number>`, an `<angle>`, or the keyword none, which represents the hue angle.

A (Alpha) (Optional)
: An `<alpha-value>` or the keyword none, where the number 1 corresponds to 100% (full opacity).

We can build a color palette by changing the lightness of a base color using [relative color syntax](https://developer.chrome.com/blog/css-relative-color-syntax) to create a nine-step progression of colors.

```css
:root {
  --theme-primary: #663399;
  --theme-primary-900: oklch(from var(--theme-primary) 10% c h);
  --theme-primary-800: oklch(from var(--theme-primary) 20% c h);
  --theme-primary-700: oklch(from var(--theme-primary) 30% c h);
  --theme-primary-600: oklch(from var(--theme-primary) 40% c h);
  --theme-primary-500: oklch(from var(--theme-primary) 50% c h);
  --theme-primary-400: oklch(from var(--theme-primary) 60% c h);
  --theme-primary-300: oklch(from var(--theme-primary) 70% c h);
  --theme-primary-200: oklch(from var(--theme-primary) 80% c h);
  --theme-primary-100: oklch(from var(--theme-primary) 90% c h);
}
```

Then we can reference these variables anywhere we need or want a color.

This class also uses the [color-contrast function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-contrast) to decide if the text color will be black or white.

```css
.theme-900 {
  background: var(--theme-primary-900);
  color: color-contrast(var(--theme-primary-900) vs white, black);
}
```

There is a lot more than we can do with these functions and other math and math-related functions, particularly when it comes to animations and transitions.

### Fluid type & Space

I've separated Fluid type and space from the other uses of CSS math and math-related functions to make it easier to read.

Fluid typography relies primarily on the `clamp()` function. Rather than using media queries, we can use `clamp()` and control the size of the content within preset boundaries.

```css
p {
  width: 60ch;
  font-size: clamp((var(--base)), 2vw, (calc(var(--base) * 2.5)));
}
```

We can also handle spacing with clamp, by setting boundaries beyond which the values cannot change.

```css
div {
	inline-size: clamp(25rem, 30vw, 50rem)
}
```

### Flexible Layouts

## Towards a declarative web?

<lite-youtube videoid="yn6wgDSgDmk"></lite-youtube>

## Links and resources

* CSS in JS
  * [An Introduction to CSS-in-JS: Examples, Pros, and Cons](https://webdesign.tutsplus.com/articles/an-introduction-to-css-in-js-examples-pros-and-cons--cms-33574)
  * [A Thorough Analysis of CSS-in-JS](https://css-tricks.com/a-thorough-analysis-of-css-in-js/)
* Examples of imperative design
  * [Bootstrap](https://getbootstrap.com/)
  * [Foundation](https://get.foundation/)
  * [Tailwind CSS](https://tailwindcss.com/)
* New design thinking or is it new thinking about design?
  * [Intrinsic web design](https://www.youtube.com/watch?v=AMPKmh98XLY) &mdash; Jenn Simmons
  * [Every Layout](https://every-layout.dev/) &mdash; Heydon Pickering &amp; Andy Bell
  * [Utopia](https://utopia.fyi/) &mdash; James Gilyead &amp; Trys Mudford
* Standing on the shoulders of giants
  * [The Dao of Web Design](https://alistapart.com/article/dao/) &mdash; John Allsopp
  * [Responsive Web Design](https://alistapart.com/article/responsive-web-design/) &mdash; Ethan Marcotte
  * [The Web’s Grain](https://frankchimero.com/blog/2015/the-webs-grain/) &mdash; Frank Chimero
  * [What Screens Want](https://frankchimero.com/blog/2013/what-screens-want/) &mdash; Frank Chimero
  * [Declarative design](https://adactio.com/journal/18982)
  * [Be The Browser’s Mentor, Not Its Micromanager](https://andy-bell.co.uk/be-the-browsers-mentor-not-its-micromanager/)

