---
title: PostCSS plugins I want to look at
date: 2023-11-13
---

Since I decided to move to a PostCSS workflow from SASS, there are a few other plugins that I want to look at to consider adding them to the workflow.

I'm not 100% sure that any of these plugins will make it to the PostCSS process. I'm documenting them here to keep a record of what the thought process was.

* **Management**: These plugins will control behavior and results of using PostCSS
  * [postcss-nested](https://github.com/postcss/postcss-nested) will cover nesting until we can be certain that all browsers can handle nesting
  * [postcss-sorting](https://github.com/hudochenkov/postcss-sorting) sorts the properties in a rule
  * [postcss-easy-import](https://github.com/TrySound/postcss-easy-import) inlines the content of imported files
  * [postcss-fail-on-warn](https://github.com/postcss/postcss-fail-on-warn) will fail where a warning would have continued the process
* **Conditionals**: Will provide equivalents to SASS programatic controls: @if, @for, @each
  * [postcss-conditionals](https://www.npmjs.com/package/postcss-conditionals) offers an if/else statement equivalent to SASS @if
  * [postcss-for](https://github.com/antyakushev/postcss-for) allow writing conditional logic in a way that mostly mirror SASS.
  * [postcss-each](https://www.npmjs.com/package/postcss-each) gives you the ability to loop over an array of values and act on each one
* **Others**: Add the ability to use custom elements defined with `@property`
  * [postcss-define-property](https://www.npmjs.com/package/postcss-define-property) allows us to use CSS Custom Properties as defined in [CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/)
