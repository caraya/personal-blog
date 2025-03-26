---
title: Using CSS Wisely
date: 2024-06-05
tags:
  - CSS
  - Opinion
youtube: true
draft: true
---

CSS has progressed enormously in the last few years.

This is both good and bad.

The good
: CSS has become very powerful and it has gained many new features that make design and development work easier.
: You can now use CSS to achieve tasks that previously required JavaScript or were impossible to do on the web.

The bad
: It has become hard to keep all of CSS in your head and, even to know what you're looking for in references like [MDN](https://developer.mozilla.org/), [web.dev](https://web.dev/) or your favorite resource
: CSS has also evolved in both the length of the specification and the content it covers. CSS 1 was 68 pages long while CSS 2, released 2 years later, was 300 pages. After version 2 was released, the CSS Working Group (CSSWG) decided to split features into their own standalone specifications to reduce the time it would take for a feature to be part of a recommendation rather than slow down the entire specification because some features are not ready

This post will try to create a blueprint for people starting up with CSS today. It will also advocate for a less-than-pixel-perfect approach to using CSS.

## What can we do with CSS?

I know that this sounds like a weird question but bear with me for a section or two.

CSS (Cascading Style Sheets) is used to style and layout web pages. Even at this most basic level, there are a lot of things to learn

Here's a partial list of things you can do with CSS.

* **Animations and Transitions**: Create smooth transitions between states and complex animations for elements
* **Responsive Design**: Adapt the layout to different screen sizes and orientations using media queries
* **Pseudo-classes and Pseudo-elements**: Style elements based on their state (`:hover`, and `:focus`) or parts of an element (`::before` and `::after`)
* **Custom Properties (Variables)**: Define reusable values for properties to maintain consistency and simplify updates
* **Transformations**: Apply transformations such as scaling, rotating, and skewing to elements
* **Clipping and Masking**: Create complex shapes and control the visibility of parts of an element
* **Filters**: Apply graphical effects like blur, brightness, and contrast to elements
* **Blend Modes**: Define how an element's content should blend with its background
* **Custom Fonts and Typography**: Use web fonts, control typographic details, and implement responsive typography
* **Shapes**: Wrap text around complex shapes and **elements**
* **Variables and Calculation**: Perform calculations directly within CSS using the `calc()` function
* **Multicolumn Layouts**: Create and style text in multiple columns
* **Container Queries**: Changes the size of elements based on their parent's dimensions
* **Backdrops and Overlays**: Use `backdrop-filter` to apply effects to the background of elements
* **Scroll Snap**: Create smooth, snappable scrolling experiences for users
* **Paged Media Styles**: Define styles specifically for printed versions of webpages.

The trick is not to get overwhelmed with how many things are available, what to learn, or how to use them.

## So where do we start?

Once we understand some basic concepts, the cascade, specificity, and importance, we can build a mental model of how CSS works.

The easiest way to start is to learn how to style elements and how to layout a page. This is the most basic use of CSS and it's what most people think of when they think of CSS. Once you've mastered this, you can move on to more advanced topics as needed.

I always keep [MDN](https://developer.mozilla.org/) open when working with CSS as both a searchable reference and a learning resource. The flipside is that you have to have a basic understanding of what you're looking for to find it in the documentation.

If you're a beginner, I recommend CSS tutorials like MDN's learning resources [Getting Started with CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps) and web.dev's [Learn CSS](https://web.dev/learn/css).

## Be The Browser's Mentor, Not Its Micromanager

<lite-youtube videoid="5uhIiI9Ld5M"></lite-youtube>

We don't have to create exactly the same layout for all browsers on all platforms and all operating systems. Instead, provide guidance and let the browser build the site in a way that if a browser doesn't support a given technology it will still work just not the same way as it would if everything was supported.

These designs rely on four principles:

Modern CSS with Methodologies
: Instead of brute-forcing your designs together with a CSS framework, consider opting for a CSS methodology like CUBE CSS, SMACSS or BEM that empowers you to write flexible, portable CSS, rather than rigid, inflexible and overly-specific CSS.

Fluid type & Space
: Creating type scales that respond to the viewport, rather than setting explicit values for typography and space allows you to set rules once and forget about them, knowing that whatever device, regardless of its available size will be presented with appropriate sizes.

Flexible Layouts
: Using flexible, flexbox-based layouts, like the ones we provide in Every Layout, ensures that regardless of conditions — be it content or available screen size: your front-end will be able to respond in the most appropriate way. Giving browsers hints and space to do what they do best, helps your front-end handle tricky scenarios where breakpoint-based layouts consistently fail.

Progressive Enhancement
: Build with the lowest possible technological solution and enhance it where device capability, connection speeds and context conditions allow.
: If you do the opposite you will likely build an experience that’s excludes a lot of people.

It was in 2010 when Ethan Marcotte published the legendary [Responsive Web Design](https://alistapart.com/article/responsive-web-design/) article. It completely changed how we built websites for an ever-growing variety of device types and sizes.

The article has aged really well, but the practice of web design has not. We're still getting stuck into pixel-pushing a design into shape with rigid methods to ensure absolute fidelity to our digital wireframes, as we've done since the early days of the web. Jeremy Keith touched on this issue in [Resilient Web Design](https://resilientwebdesign.com/):

> It was as though the web design community were participating in a shared consensual hallucination. Rather than acknowledge the flexible nature of the browser window, they chose to settle on one set width as the ideal… even if that meant changing the ideal every few years.
>
> Jeremy Keith - Resilient Web Design

device/screen sizes, connection speed, whether they have a fully working browser (or are using web views) and even if they have an HDR screen or not are totally unknown to us at design/development time. We are all guilty of micromanaging the browser in some aspects like using absolute units when sizing content, and in turn, are creating an inflexible and fragile user experience.

When the web first came out we only had to deal with 640x480 displays so our normal was easy, then came 800x600 and 1024x768, so our normal got more complicated. Today we should also factor much larger desktop displays, multiple monitors that work as one and the multiple brands and kinds of devices available to users, and you can see how problematic building websites in a rigid, specific manner can be.

It makes sense to lose a bit of perceived control and instead, get even greater control by being the browser’s mentor and not its micromanger, right?

The website for the presentation is [Be The Browser’s Mentor, Not Its Micromanager.](https://buildexcellentwebsit.es/)


## Peeking at Intrinsic Web Design

Another concept that you've probably heard of is Intrinsic Web Design, coined by Jen Simmons in 2018.

<lite-youtube videoid="20QKda7IhJQ"></lite-youtube>

Intrinsic Web Design starts with the Flexbox and CSS Grid modules as a way to move away from floats + positioning or hacky frameworks.

<lite-youtube videoid="dQHtT47eH0M"></lite-youtube>

These purpose-built layout systems allow us to create layouts that are more flexible and responsive by default. They are also baked into the CSS engines so you don't need third-party libraries.

## Scoping CSS

This is one of the more controversial topics in CSS.

There are three basic concepts to understand:

* [The Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade),
* [Specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)
* [Importance](https://developer.mozilla.org/en-US/docs/Web/CSS/important)

And APIs that shortcircuit the cascade like:

* [Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
* [@scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope)

The scoping rules for CSS are complicated:

1. **Relevance**: The CSS parser first filters all the rules from the different sources to keep only the rules that apply to a given element. That means rules whose selector matches the given element and which are part of an appropriate media at-rule
2. **Origin and importance**: Then it sorts these rules according to their importance, that is, whether or not they are followed by [!important](https://developer.mozilla.org/en-US/docs/Web/CSS/important), and by their origin (see below for the full order of precedence)
3. **Specificity**: In case of equality with an origin, the specificity of a rule is considered to choose one value or another. The specificity of the selectors are compared, and the declaration with the highest specificity wins
4. **Scoping proximity**: When two selectors in the origin layer with precedence have the same specificity, the property value within scoped rules with the smallest number of hops up the DOM hierarchy to the scope root wins
5. **Order of appearance**: In the origin with precedence, if there are competing values for a property that are in style block matching selectors of equal specificity and scoping proximity, the last declaration in the style order is applied

!!! info **Detalis about origins and user agents**:
The different origins used in step 2 are:

User-agent stylesheets
: User-agents, or browsers, have basic stylesheets that give default styles to any document. These stylesheets are named user-agent stylesheets. Most browsers use actual stylesheets for this purpose, while others simulate them in code. The end result is the same.

Author stylesheets
: Author stylesheets are the most common type of stylesheet; these are the styles written by web developers. These styles can reset user-agent styles, as noted above, and define the styles for the design of a given web page or application. The author, or web developer, defines the styles for the document using one or more linked or imported stylesheets, `style` blocks, and inline styles defined with the style attribute.

User stylesheets
: In most browsers, the user (or reader) of the website can choose to override styles using a custom user stylesheet designed to tailor the experience to the user's wishes. Depending on the user agent, user styles can be configured directly or added via browser extensions

The full precedence order is described in the table below:

| Precedence Order<br>(low to high)	| Origin | Importance |
| :---: | :---: | --- |
| 1 | user-agent | normal |
| 2 | user | normal |
| 3 | author | normal |
| 4 | CSS keyframe animations | |
| 5 | author | !important |
| 6 | user | !important |
| 7 | user-agent | !important |
| 8 | CSS transitions | |

!!!

The cascade is a powerful tool but it can be hard to manage.

Since rules from multiple sources, both created locally and from third-party libraries, can apply to the same element, the results can be different from what you expect.

The best way to manage this is to use a methodology like BEM, SMACSS, or CUBE CSS to keep your CSS organized and to use the cascade and specificity to your advantage but that requires discipline and coordination between team members.

Newer APIs like [Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) and [@scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) help developers better manage the cascade and make it easier.

Cascade Layers Large help deal with precedence and specificity issues. Large code bases can have styles coming from multiple teams, component libraries, frameworks, and third parties. No matter how many stylesheets are included, all these styles cascade together in a single origin: the author style sheet.

Different teams in a larger project may have different methodologies and systems that may not work well for other teams. Because these teams don't work together and, likely, don't communnicate, specificity conflicts can escalate quickly. The `!important` rule can solve these specificity conflict but it's not a good or long term solution, it just moves the problem somewhere else.

Layers provide an additional, scoped and isolated, way to cope content together. A layer can be created for each team, component, and third party, with style precedence based on layer order.

Layer precedence always beats selector specificity. Specificity still matters for competing property values within a layer, but only the highest-priority layer for each property is considered.

The `@scope` at-rule is a way to scope CSS to a specific element. It's a way to create a new scope for CSS rules, so that they only apply to a specific element and its children.

Combined together these rules can help you manage the cascade and specificity in your CSS.

Do you need to use them all the time? No, but they are good to know about and have in your toolbox.

That, to me, is the key to using CSS wisely. Know when to use it to control 100% of the design and when to let the browser do the heavy lifting.

## Links and Resources

* [What You Need to Know about Modern CSS (2024 Edition)](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-spring-2024-edition/)
* [CSS: Cascading Style Sheets](https://developer.mozilla.org/en-US/docs/Web/CSS)
* [A Simple Introduction to Intrinsic Web Design](https://webdesignerdepot.com/a-simple-introduction-to-intrinsic-web-design/)
* [CSS Object Model (CSSOM)](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model)
* [An Introduction and Guide to the CSS Object Model (CSSOM)](https://css-tricks.com/an-introduction-and-guide-to-the-css-object-model-cssom/)
