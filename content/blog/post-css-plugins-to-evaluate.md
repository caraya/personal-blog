---
title: PostCSS plugins I want to look at
date: 2023-11-20
draft: true
---

* Management
  * [postcss-nested](https://github.com/postcss/postcss-nested) to cover until we can be certain that all browsers can handle nesting
  * [postcss-sorting](https://github.com/hudochenkov/postcss-sorting) sorts the properties in a rule
  * [postcss-easy-import](https://github.com/TrySound/postcss-easy-import) inlines the content of imported files
  * [postcss-fail-on-warn](https://github.com/postcss/postcss-fail-on-warn)
* Conditionals
  * [postcss-conditionals](https://www.npmjs.com/package/postcss-conditionals) offers an if/else statement equivalent to SASS @if
  * [postcss-for](https://github.com/antyakushev/postcss-for) allow writing conditional logic in a way that mostly mirror SASS.
  * [postcss-each](https://www.npmjs.com/package/postcss-each) gives you the ability to loop over an array of values and act on each one
* Others
  * [postcss-simple-vars](https://www.npmjs.com/package/postcss-simple-vars) allows us to use SASS variables (beginning with $) in our CSS.
  * [postcss-define-property](https://www.npmjs.com/package/postcss-define-property) allows us to use CSS Custom Properties as defined in [CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/), a Houdini specification.
