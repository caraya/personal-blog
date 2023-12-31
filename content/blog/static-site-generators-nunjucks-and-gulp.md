---
title: "Static Site Generators: Nunjucks and Gulp"
date: "2019-04-24"
---

A next step is to build our own templating solution using Gulp. I've spent longer than I wanted in crafting this solution and it's still, like the idea I based this from, has a lot of things I'm working on understanding and changing.

The idea of using a templating engine is to have options when creating content. We can create partial content blocks and define different layouts for our content.

Granted, this moves away from our simple model when using templates but we gain more flexibility in what we can do with the templated content.

We need to install the NPM packages that we need to make this work.

```bash
npm i -D nunjucks-markdown \
marked \
gulp-rename \
nunjucks\
gulp-nunjucks
```

We then require the packages we installed.

```js
// Nunjucks and Markdown
const nunjucks = require('nunjucks');
const markdown = require('nunjucks-markdown');
const marked = require('marked');
const gulpnunjucks = require('gulp-nunjucks');
```

Rather than copying our directory paths in multiple places, we write them down one and then reference them wherever we need them.

```js
// Nunjucks consts for file location
const dist = 'docs';
const src = 'src';
const templates = src + '/partials';
```

Here is also the first difference with our template copy. Rather than separate our partials (files with `.njk` as the extension) and our pages (`.html` files) we put them all in one place. The partials directory I used while developing this project looks like this.

```bash
partials
├── about.html
├── base.njk
├── css-containment.html
├── footer-scripts.njk
├── from-markdown-to-html.html
├── head.njk
├── index.html
├── javascript-dom.html
├── latex-to-web.html
└── voice-ui-agent.html
```

Next, we use the [Environment](https://mozilla.github.io/nunjucks/api.html#environment) class and the [FileSystemLoader](https://mozilla.github.io/nunjucks/api.html#filesystemloader) to load templates from the specified directory; the one we defined in the `template` variable.

```js
// Where to pull files from?
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(templates));
```

The next step is optional and configures the [Marked](https://github.com/markedjs/marked) Markdown parser. Because all assets are compiled at build time there is not as much worry about sanitizing the output of Marked.

**Do not change the `sanitize` setting if you will accept user templates or if you're using third-party code.**

Once the configuration is complete we register the `marked` instance to work with `nunjucks-markdown`.

```js
// Markdown options
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true,
});

markdown.register(env, marked);
```

Now that configuration is complete we can work with Gulp to create the rendering task.

We use all the HTML files in our `partials` directories and them compile them. This will take care of creating the fully templated HTML and converting any Markdown inside the pages to HTML. It will place the resulting pages inside the `docs` directory. I chose `docs` because it's one of the default directories that Github Pages allows you to use when documenting a repository.

```js
gulp.task('pages', function() {
  return gulp.src([templates + '/*.html', templates + '/**/*.html'])
      // Renders template with nunjucks and marked
      .pipe(gulpnunjucks.compile('', {env: env}))
      .pipe(gulp.dest(dist));
});
```

That's it. We have a far more flexible structure to build from and we can create our own [design system](https://www.designbetter.co/design-systems-handbook) components to make out lives easier in the long run.

As with the templating solution, we can create additional tasks to enhance the resulting HTML pages. I've created a [proof of concept project](https://github.com/caraya/static-gen-njk) that illustrates how this works.
