---
title: "Gulp Workflow: Custom Tasks and Auxiliary Functions"
date: "2016-04-06"
categories: 
  - "technology"
---

> The custom tasks use Gulp 3 syntax. You will have to change them to work with Gulp 4

After we’ve created the tasks we need for our project, we can define custom tasks to run one or more of these tasks. In the task below we run the targets in square brackets (clean, copy, fonts and processImages) in parallel when we call `gulp prep`.

This example runs copy, fonts and processImages in parallel. Gulp will launch all the tasks at the same time and will let them take as long as they need before notifying you that it’s complete.

Because there are times when I need things to run in a given order, something that is hard to do in an asynchronous environment, I use `run-sequence` to specify the order to run the tasks. In the example below:

- `clean` will run first
- `copyAssets`, `copyBower` and `copyFonts` will run next in parallel
- `processImages` will only run when the three copy tasks have completed. This makes sure we have images to process; they are copied as part of `copyAssets`

```javascript
// COMBINED TASKS
gulp.task('default', function () {
  runSequence('clean', 
  ['copyAssets', 'copyBower', 'copyFonts'], 
  'processImages');
});
```

We can also set up a default tasks that will run when we run gulp without any arguments. In this case it will run `sass`.

```
gulp.task('default', ['sass']);
```

## Auxiliary functions

Although this is possible with Gulp 3 it wasn’t until I was comfortable with Gulp and had all the tasks working that I looked at writing functions outside the tasks to help make things DRYer and cleaner.

The first function is a log module that will work across all tasks without having to rewrite the code every time we want to use it.

```
function log(msg) {
  var item;
  if (typeof (msg) === 'object') {
    for (item in msg) {
      if (msg.hasOwnProperty(item)) {
        $.util.log($.util.colors.inverse(msg[item]));
      }
    }
  } else {
    $.util.log($.util.colors.inverse(msg));
  }
}
```

The second utility function is a generic cleanup function. We pass a path and the function will delete it.

We use it to create specific cleanup functions so we don’t have to delete everything every time we need specific portions of the content.

```
function clean(path, done) {
  log('Cleaning ' + $.util.colors.red(path));
  del(path, done);
}
```

The last function highlight errors when executing tasks. It uses the `log` function with additional logging to highlight the error.

```
function errorLogger(error) {
  log('*** Error Start ***');
  log(error);
  log('*** Error End ***');
  this.emit('end');
}
```

These are by no means all the functions we can run but an example of how we can extend gulp with
