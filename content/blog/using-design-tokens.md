---
title: Using design tokens
date: 2025-01-15
tags:
  - CSS
  - Design Systems
  - PostCSS
  - Style Dictionary
  - Design Tokens
---

Style tokens, also known as design tokens, are named, reusable values that represent design elements like colors, fonts, spacing, and other visual attributes within a design system, allowing for consistent application of styles across different platforms and codebases by replacing static values with descriptive names; essentially, they act as a centralized repository for design decisions, ensuring uniformity throughout a product.

This post will look at whether design tokens are still relevant, how to generate them with [Style Dictionary](https://amzn.github.io/style-dictionary/#/) and how to use design tokens in a PostCSS workflow.

## Why use design tokens?

For smaller bespoke projects, design tokens may seem like overkill, but for larger projects or projects that require consistency across multiple platforms, design tokens can be a powerful tool for maintaining a consistent design language for your target platforms.

Depending on the tool you use to generate the design tokens, you can generate tokens for different platforms like web (css and scss), iOS, Android, and even Sketch, Figma, and Adobe XD.

When looking at whether design systems are relevant we should look at things to consider when working with design tokens:

Consistency
: By using tokens instead of hardcoded values, designers and developers can easily update a single token to change the style across the entire application

Semantic Naming
: Tokens have descriptive names that clearly indicate their purpose, making code more readable and maintainable

Platform Agnostic
: Tokens can be used across different platforms like web, mobile, and desktop applications and across multiple devices and platforms.

This is a basic example of a design token file in JSON format.

The prefered method to name components is CTI (Category > Type > Item > State) naming convention (e.g. color > background > input > disabled) format.

Structuring tokens in this manner gives us consistent and hierarchical naming of these properties. Each token starts broad and gets more specific.

* **Category**: The category of the token's output
  * **Examples**: "color" for hex values, "size" for pixels, or "duration" for seconds
* **Type**: A property descriptor of the category
  * **Examples**: "background", "text", or "border"
* **Item**: The element or abstracted element group that's targeted by the token
  * **Examples**: "dropdown", "control", "container", or "panel"
* **Sub-item**: Any differentiating aspect of the token or item that isn't state, often could be component variants.
  * **Examples**: "secondary", "primary", or "success"
* **State**: State-dependent aspects
  * **Examples**: "default", "focused", "selected", or "disabled"

This example shows a basic structure of a design token file in JSON format

```json
{
  "color": {
    "background": {
      "primary": { "value": "#fff" },
      "secondary": { "value": "#c6c6c6" },
      "inverse": { "value": "#000" }
    },
    "text": {
      "primary": { "value": "#000" },
      "secondary": { "value": "#333" },
      "inverse": { "value": "#fff" }
    }
  }
}
```

This is a more complex example taken from the Style Dictionary repository. Note how it leverages the CTI naming convention to handle multiple elements.

In most production code I would have tokens for separate objects in different files and let Style Dictionary merge them together.


```json
{
  "color": {
    "background": {
      "primary": { "value": "#fff" }
    }
  },
  "size": {
    "spacing": {
      "small": { "value": "16px" },
      "medium": { "value": "18px" },
      "medium-alias": { "value": "{size.spacing.medium}" }
    }
  },
  "viewport": {
    "medium": { "value": "35rem" }
  }
}
```

## Using Style Dictionary

The first step is to create a configuration file to tell Style Dictionary what formats to transform the tokens to.

This example will take all the tokens under the `tokens` directory and all directories underneath.

```json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [
        {
          "destination": "_variables.css",
          "format": "css/variables"
        }
      ]
    }
  }
}
```

We then run the following command from the terminal:

```bash
style-dictionary build
```

## Using design tokens in PostCSS and Gulp

Another way to use design tokens is to use them in a PostCSS workflow using the `@csstools/postcss-design-tokens` plugin.

This will allow us to use the design tokens directly in CSS files, bypassing the need to generate a separate CSS file.

This section assumes you have a basic understanding of PostCSS and Gulp, and a working gulpfile already in place.

### Install the plugin

The first step is to install the plugin using npm.

```bash
npm install @csstools/postcss-design-tokens
```

We configure PostCSS to use the plugin in. This is an example of a basic configuration file.

In the gulpfile, we add the following code to use the plugin.

```js
const postcss = require('gulp-postcss');
const postcssDesignTokens = require('@csstools/postcss-design-tokens');
```

We then add the plugin to the PostCSS plugins array and run the task:

* Specify the source file or files to process
* Pipe the source files through the PostCSS plugins
* Specify the destination folder for the processed files

```js
gulp.task('css', function () {
  const plugins = [
    postcssDesignTokens(/* options */)
  ];

  return gulp.src('./src/*.css')
    .pipe(postcss(plugins))
    .pipe(gulp.dest('.'));
});
```

### Usage

To use the design tokens in CSS we first use the `@design-tokens` at-rule to specify the location of the design tokens file and the format the file uses. Currently, the plugin only supports the Style Dictionary version 3 format so you'll have to be careful if you're using the newer version 4.

```css
@design-tokens url('./tokens.json') format('style-dictionary3');
```

You can then use the `design-token` function to access the tokens in your CSS file and specify the full path to the token you want to use. You can also convert the token to different units based on the type of units that you're working with.

```css
.foo {
  color: design-token('color.background.primary');
  padding-top: design-token('size.spacing.small');
  padding-left: design-token('size.spacing.small' to px);
  padding-bottom: design-token('size.spacing.small' to rem);
}

@media (min-width: design-token('viewport.medium')) {
  .foo {
    padding-bottom: design-token('size.spacing.medium-alias' to rem);
  }
}
```

The above code will output the following CSS with all the design tokens functions replaced with their values.

```css
.foo {
  color: #fff;
  padding-top: 16px;
  padding-left: 16px;
  padding-bottom: 1rem;
}

@media (min-width: 35rem) {
  .foo {
    padding-bottom: 1.125rem;
  }
}
```

## Conclusion

Design tokens can be used to create a single source of truth for all versions of your application, ensuring that the design is consistent across all platforms and devices.

For bespoke projects, design tokens may seem like overkill, but for larger projects or projects that require consistency across multiple platforms, design tokens can be a powerful tool for maintaining a consistent design language for your target platforms.

## Links and Resources

* [Introduction to design tokens](https://specifyapp.com/blog/introduction-to-design-tokens/)
* [Smashing Podcast Episode 3 With Jina Anne: What Are Design Tokens?](https://smashingmagazine.com/2019/11/smashing-podcast-episode-3/)
* [Style Dictionary](https://amzn.github.io/style-dictionary/#/)
* [PostCSS Design Tokens](https://www.npmjs.com/package/@csstools/postcss-design-tokens) &mdash; PostCSS plugin
