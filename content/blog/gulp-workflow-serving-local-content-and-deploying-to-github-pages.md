---
title: "Gulp Workflow: Serving local content and deploying to Github Pages"
date: "2016-04-04"
categories: 
  - "technology"
---

## Serving content under development and watching for file changes

It’s nice to publish to gh-pages when we want but to do so after every change we make to our code (CSS, JS or HTML) gets old really quickly.

Instead we create two ways to serve content from a local web server

The first one serves content from our `app` source directory, most likely after we’ve processed the files beyond transpilation from ES6 to Javascript and SASS to CSS.

We also take care of watching for changes by specifying the following criteria and actions:

- If an HTML page gets added or changes, reload the page we’re in
- If a Javascript file gets added or changes, reload the page we’re in
- If a SASS file gets adaded or changes, run the SASS task, then run the processCSS task and then reload the page
- If we add or change, reload the page
    
    // Watch files for changes & reload // This version serves content from the app source directory gulp.task('serve', function () { browserSync({ port: 2509, notify: false, logPrefix: 'ATHENA', snippetOptions: { rule: { match: '', fn: function (snippet) { return snippet; } } }, // Run as https by uncommenting 'https: true' // Note: this uses an unsigned certificate which on first access // will present a certificate warning in the browser. // https: true, server: { baseDir: \['.tmp', 'app'\], middleware: \[historyApiFallback()\] } });
    
    gulp.watch(\['app/**/\*.html'\], reload); gulp.watch(\['app/**/\*.js'\], reload); gulp.watch(\['app/css/**/\*.scss'\], \['sass', 'processCSS', reload\]); gulp.watch(\['app/images/**/\*'\], reload); });

There is an inherent risk in the way we’re watching for changes to the SASS files. Because Gulp works asynchronously there may be times when the ProcessCSS task will run before the sass task has completed or even started.

One way to deal with this is changing the way we call tasks by making sass a prerequisite for processCSS and call only processCSS when watching for changes.

Starting with Gulp 4.0 (coming really soon now) this will no longer be an issue as we’ll be able to specify if the we want tasks to run sequentially or in parallel.

## Serving production-ready content

Once we are happy with the way they content looks we can start another server with content of our final dist server. It is similar to the development server we configured above except that we are not reloading the content when there are changes.

I use the production server to test that I’ve copied all the content properly and that any changes I’ve made to the source have carried over to the production code before deploying it.

```
// Build and serve the output from the dist build
gulp.task('serve:dist', function () {
  browserSync({
    port: 5001,
    notify: false,
    logPrefix: 'ATHENA',
    snippetOptions: {
      rule: {
        match: '<span id="browser-sync-binding"></span>',
        fn: function (snippet) {
          return snippet;
        }
      }
    },
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist/',
    middleware: [historyApiFallback()]
  });
});
```

## Deploying to Github Pages

Github offers a web publishing services as part of their accounts. It’s a fairly robust system; it offers SSL by default which makes it appealing for testing new technologies such as service workers, push notifications and many specifications coming from WHATWG and W3C.

With this plugin we can publish directly to the `gh-pages` branch of the repository without having to do the task manually.

Install the plugin:

```
npm install --save-dev gulp-gh-pages
```

And create a task like the one below:

```
gulp.task('deploy', function () {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages())
    .pipe($.size({
      title: 'deploy'
    }));
});
```
