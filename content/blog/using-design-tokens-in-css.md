---
title: "Using Design Tokens in CSS"
date: "2023-03-13"
---

Design tokens provide a way to create representations of design assets like colors, fonts, spacing, animations, assets, etc., for styling and building cross-platform user interfaces.

<iframe width="560" height="315" src="https://www.youtube.com/embed/q5qIowMyVt8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

One of the challenges with cross-platform product development is that operating systems use different style properties and formats to represent the same data. For example, the following code represents the same colors on different platforms:

- HEX (CSS): FCC821
- RGB (CSS): rgb(252, 200, 33)
- RGBA (CSS): rgba(252, 200, 33, 1)
- LCH (CSS): lch(83.525%, 53.373%, 83.39%)
- Octal (Android/Flutter): 77144041

Instead of using these individual properties, designers and engineers reference a token like `color.palette.primary` representing all four color codes. The color will always be the same regardless of the platform or programming language.

Organizations use these design tokens to create a single point of truth for design-related assets and to create a file that can be shared across the organization so that everyone, whether working on a website or app or a micro front end for an enterprise module can use the same design vocabulary and creating a standard look for all.

## Creating the tokens

There is no standard way to create design tokens. The [Design Tokens Community Group](https://www.w3.org/community/design-tokens/) is as close to an industry consensus as there currently is in this space and the [Design Tokens Format Module](https://second-editors-draft.tr.designtokens.org/format/) community report is as close as a specification. That means that we'll have to select one of the current alternatives to create our tokens.

### Style Dictionary

[Style Dictionary](https://amzn.github.io/style-dictionary/#/examples) creates styles for multiple platforms from a single source document. It is also extensible enabling future customizations to work in the projects we are working on like inserting the converted tokens into a WordPress theme's `theme.json` file.

So, technically, we could build the design tokens by hand directly in CSS in a similar way to building CSS custom properties

The main reason why I chose Style Dictionary is that it's the only format supported by the PostCSS Design Tokens plugin.

To get a basic Style Dictionary example that we can then customize follow these steps.

Install Style Dictionary as a global Node module using the `-g` flag. This will make the `style-dictionary` command available on your shell.

```bash
npm install -g style-dictionary
```

Once you install style-dictionary:

1. Create a directory where you will store the design tokens
2. Switch to the directory
3. Run style-dictionary's initialization command with `complete` as the parameter
4. Install Node dependencies

```bash
mkdir styles #1
cd styles #2
style-dictionary init complete #3
npm install #4
```

These commands will generate the scaffold for style-dictionary along with examples of design tokens.

The result will look something like this. I've removed details about Android and iOS to make the layout cleaner and to concentrate on CSS design tokens.

```text
.
├── LICENSE
├── README.md
├── StyleDictionary.podspec
├── android
├── assets
│   └── fonts
│       ├── MaterialIcons-Regular.eot
│       ├── MaterialIcons-Regular.ttf
│       ├── MaterialIcons-Regular.woff
│       ├── MaterialIcons-Regular.woff2
│       ├── OpenSans-Regular.ttf
│       └── Roboto-Regular.ttf
├── config.json
├── ios
├── package.json
└── tokens
    ├── asset
    │   └── font.json
    ├── color
    │   ├── background.json
    │   ├── base.json
    │   ├── border.json
    │   ├── brand.json
    │   ├── chart.json
    │   └── font.json
    ├── content
    │   └── icon.json
    ├── font.json
    ├── size
    │   ├── font.json
    │   ├── icon.json
    │   └── padding.json
    └── time.json
```

The `style-dictionary init` command will also generate a `package.json` file that we can use to install dependencies and run updates for the tokens.

Every time that we make changes we need to run `npm run build` to update the tokens.

I don't use any of the settings in the default Style Dictionary configuration so I created a custom configuration to create CSS Custom Properties (CSS variables) and SCSS properties. The custom configuration looks like this:

```json
{
  "source": [
    "tokens/**/*.json"
  ],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [{
          "format": "css/variables",
          "destination": "variables.css"
      }]
    },
    "scss": {
      "transformGroup": "scss",
      "buildPath": "build/scss/",
      "files": [{
        "format": "scss/variables",
        "destination": "_variables.scss"
      }]
    }
  }
}
```

We can import the variables from either CSS or SCSS files.

The SCSS files use an underscore (`_`) to indicate it's a partial that should not generate a corresponding CSS file. See [SASS Basics](https://sass-lang.com/guide#topic-4) for an explanation.

## Becoming familiar with Style Dictionary

There is a [style-dictionary playground](https://www.style-dictionary-play.dev/) where you can learn about the tool, create your tokens and convert them to the format that you need for your work.

You can continue working in the playground or move to crafting the tokens by hand when you feel comfortable enough to do so.

## Consuming the tokens and creating the styles from them

Once we have generated the tokens we need to figure out how to use them.

Since I'm already using PostCSS, [Postcss design tokens plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-design-tokens) becomes the perfect tool to use.

As with many tools, we need Node and Gulp installed.

We first install the necessary plugins: `gulp-postcss` and `postcss-design-tokens`

```bash
npm install -D gulp-postcss \
@csstools/postcss-design-tokens
```

We then integrate the plugin into your PostCSS workflow. The example below shows a `gulpfile.js` Gulp configuration with only the tasks necessary to work with design tokens.

```css
const postcss = require('gulp-postcss');
const postcssDesignTokens = require('@csstools/postcss-design-tokens');

gulp.task('css', function () {
const plugins = [
  postcssDesignTokens()
];

return gulp.src('./src/*.css')
  .pipe(postcss(plugins))
  .pipe(gulp.dest('.'));
});
```

The CSS task only includes the design tokens plugin, it is likely that you have more plugins, at least Autoprefixer) and that you will want to do additional processing on your stylesheet.

Once we're happy with the way Gulp works, we can incorportate the design tokesn into our design.

Assuming that our `tokens.json` is in the same directory as our CSS, we use the `@design-tokens` at-rule to tell PostCSS where they are located and what format they are in. Currently, the plugin will online accept Style Dictionary version 3 files.

We then use `design-token` with the token value expressed in dot notation.

We also take advantage of Style Dictionary built-in conversion tools like `to rem` to make the work easier.

```css
@design-tokens url('./tokens.json') format('style-dictionary3');

.foo {
  color: design-token('color.background.primary');
  padding: design-token('size.spacing.small' to rem);
}

@media (min-width: design-token('viewport.medium')) {
  .foo {
    padding-bottom: design-token('size.spacing.medium-alias' to rem);
  }
}
```

The block will convert to the following CSS block.

```css
.foo {
  color: #fff;
  padding: 1rem;
}

@media (min-width: 35rem) {
  .foo {
    padding-bottom: 1.125rem;
  }
}
```

This is just scratching the surface but it offers interesting new possibilities.

With Design Tokens we can now create a central repository for our company or project styles.

In theory, we could also transform the Design Tokens files into other formats like WordPress `theme.json` configuration file. We'll research this in a future post.

## Links and Resources

- [Introduction to design tokens](https://specifyapp.com/blog/introduction-to-design-tokens)
- [What Are Design Tokens? A Design Systems Tool](https://xd.adobe.com/ideas/principles/design-systems/what-are-design-tokens/)
- [Style Dictionary](https://amzn.github.io/style-dictionary/#/examples)
- [Style Dictionary Playground](https://www.style-dictionary-play.dev/)
- [How to manage your Design Tokens with Style Dictionary](https://didoo.medium.com/how-to-manage-your-design-tokens-with-style-dictionary-98c795b938aa)
- [PostCSS design tokens plugin](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-design-tokens)
