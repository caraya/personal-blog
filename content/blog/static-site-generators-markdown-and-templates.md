---
title: "Static Site Generators:  Markdown and Templates"
date: "2019-04-22"
---

I've looked at static site generators like Hugo, Gatsby, and Jekyll among others. They all have their strengths and weaknesses but they are overkill if all you want to do is throw together a quick prototype with a few pages and stylesheets.

## Markdown, HTML and templates: Version 1

Before we start we'll take the following steps:

- Create our root directory (`static-gen`)
- Create two working directories (`public` and `src`)
- Initialize `package.json`

```bash
mkdir -p static-gen/src
mkdir -p static-gen/public
npm init --yes
```

The first version uses the wrap-around system that I use to generate content for my blog. I've described the process in detail in [Generating HTML and PDF from Markdown](https://publishing-project.rivendellweb.net/generating-html-and-pdf-from-markdown/).

Install the packages we need to run the conversion tasks:

```bash
npm i -D  gulp@3.9.1 gulp-remarkable gulp-newer gulp-wrap
```

The two tasks that run the conversion are shown below. The first task converts the Markdown into an HTML fragment using the Remarkable markdown parser.

```js
gulp.task('markdown', () => {
  return gulp.src('src/pages/*.md')
      .pipe(markdown({
        preset: 'commonmark',
        html: true,
        remarkableOptions: {
          html: true,
          typographer: true,
          linkify: true,
          breaks: false,
        },
      }))
      .pipe(gulp.dest('src/converted-md/'));
});
```

The second task inserts the resulting HTML into an HTML template that contains all the styles and scripts that we want to run on the pages.

```js
gulp.task('build-template', ['markdown'], () => {
  return gulp.src('./src/converted-md/*.md')
      .pipe(wrap({
        src: './src/templates/template.html',
      }))
      .pipe(extReplace('.html'))
      .pipe(gulp.dest('docs/'));
});
```

This version has a problem: It keeps escaping the code and presenting it as a preformatted code inside `pre` and `code` tags. for the templates to work with both Markdown and HTML we must handle template creation separately for each format. These are still not full HTML pages but are written in HTML rather than Markdown so using the HTML extension is important.

The new template looks very similar to the one we're using to handle Markdown:

```js
gulp.task('build-html-template', () => {
  return gulp.src('./src/pages/*.html')
      .pipe(wrap({
        src: './src/templates/template.html',
      }))
      .pipe(gulp.dest('docs/'));
});
```

We've only covered the HTML generation portions of the template-based static site generator but it does more. Out of the box, it will handle SCSS to CSS transpilation, ES2015+ to ES5 transpilation and image compression using Imagemin. Since it's Gulp-based you can integrate any other Gulp supported task into the process.

Because we're passing the results directly to the template we can add any type of HTML that we want, whether directly as HTML tags and attributes or Markdown to be interpreted.

### Future Evolutions

Right now all pages are converted using the same template. This works but it's inflexible. We could create additional templates and associated Gulp tasks to create different HTML based on the templates but it's not really productive. In the next post, we will look at using a templating engine to generate our content.
