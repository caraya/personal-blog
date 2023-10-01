---
title: "Gulp Workflow: Polymer Specific Tasks"
date: "2016-03-28"
categories: 
  - "technology"
---

Vulcanize and Crisper are Polymer specific tasks that deal with the way web component works (and make puns on the name Polymer too :) )

Vulcanize will combine all elements in elements.html and produce a single file. This is the same as a concatenate task except that it understands Polymer way of doing things

We run crisper in the vulcanized output to extract scripts so we comply with the [Content Security Policy](https://www.w3.org/TR/CSP2/) specification that bans all inline scripts as a way to make sure we’re not getting malicious code on our pages. See the inline scripts section of this [HTML5 Rocks article](http://www.html5rocks.com/en/tutorials/security/content-security-policy/) for this and other restrictions imposed by CSP.

Install the plugins, as normal

```bash
npm install --save-dev gulp-crisper gulp-vulcanize
```

The task below integrates both plugins:

```js
gulp.task('polymerBuild', function () {
  return gulp.src('app/elements/elements.html')
    .pipe($.vulcanize({
      stripComments: false,
      inlineCss: true,
      inlineScripts: true
    }))

    .pipe($.crisper({
      scriptInHead: false, // true is default 
      onlySplit: false
    }))
    .pipe(gulp.dest('dist/elements'))
    .pipe($.size({title: 'vulcanize'}));
});
```
