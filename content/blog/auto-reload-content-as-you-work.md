---
title: "Auto reload content as you work"
date: "2023-02-27"
---

One of the coolest things I see in tutorials and demos is the automatic reload when files change.

This post will explore three ways of setting auto-reload for your front-end projects.

These three projects will start from scratch. Integrating tooling into an existing project is not trivial and will depend a lot on your skills and the type of project you're working on.

## Vite

[Vite](https://vitejs.dev/) created by Evan Yu, the creator of Vue.js, Vite provides a fast and consistent experience:

To start a new project with Vite, the command will depend on the version of NPM you're using.

If you're using NPM 6.x, run the following command to install a basic Typescript project without a framework.

```bash
npm create vite@latest \
my-new-app \
--template vanilla-ts
```

If you're using NPM 7 or later, run the following command. The extra double-dash is required:

```bash
npm create vite@latest \
my-new-app -- \
--template vanilla-ts
```

Follow the prompts on the screen after Vite finishes installing the required packages.

```bash
cd my-new-app
npm install
npm run dev --open
```

This will open your default browser to the index.html document at the root of the project.

To further automate the process, add the following `scripts` block to your `package.json` file.

```js
{
  "scripts": {
    "dev": "npm run dev --open",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Note that `npm run dev --open` or `vite dev --open` will not create a production-ready build. You must run `npm run build`.

## Gulp-based solution

If you're using Gulp as your build system, you can leverage it to also provide hot reloading of your content.

This sample task defines a `serve` task that is dependent on the hypothetical `postcss` task to transpile CSS to something that current browsers support, and a `babel` task to transpile Javascript using Babel.

The tasks will initialize a [Browsersync](https://browsersync.io/) server and then watches content and takes action based on the type of content that has changed on the server.

```js
var gulp = require('gulp');
var browserSync = require('browser-sync').create(),

postcss = require('gulp-postcss');
babel = require('gulp-babel');

gulp.task('serve', ['postcss', 'js'], function() {
  browserSync.init({
      server: "./app"
  });

  gulp.watch("app/**/*.css".on('change', ['postcss']));

  gulp.watch("app/**/*.js".on('change', ['babel']));

  gulp.watch("app/**/*.html").on('change', browserSync.reload);
});


gulp.task('default', ['serve']);
```

## Prepros

Yet another option is to use applications that will abstract all the code and processes for you.

[Prepros](https://prepros.io/) (cross-platform) and its alternatives like [Codekit](https://codekitapp.com/) (macOS only) automate several different development activities. For the purpose of this post, we'll look at reloading when files change.

![Prepros showing dialogue and instructions for loading preview. Command / Control + L will open the default browser to the site's index page](/images/2023/01/prepros-browser-sync-01.png)

Command / Control + l will open the default browser to the site's index page (usually `index.html`)

You can add more browsers to work with your site by pointing the new browsers to `localhost:8848`.

## Conclusion: Which one to use?

I've used all three alternatives offered here, which one to use for a specific project depends on what you need to do and what type of project you're working on.

If I'm starting a project from scratch I will use Vite. I prefer the command line to an app to run the code.

Larger projects where I need to do things other than compile SASS to CSS and Typescript to Javascript would work better with Gulp. I leverage an existing project template that does image compression, transpilation, and content auto-refresh when things change

Finally, if I'm handing over a project to a client or someone who is not technically proficient I may recommend Prepros or a similar alternative. Yes, it is a paid product but it will reduce the friction of having the user update their content and may, hopefully, reduce incidences of me having to do support, and that's always a good thing :)
