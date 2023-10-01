---
title: "Gulp Workflow: SASS Compilation and Linting"
date: "2016-03-14"
categories: 
  - "technology"
---

Ever since I saw it for the first time I’ve been in love with [SASS](http://sass-lang.com/). It’s a clever, elegant and powerful superset of CSS and CSS 3 that provides powerful programming features to create your styles.

The original version of SASS was written in Ruby and it requires the Ruby ecosystem (Ruby itself and the Rubygem dependency management system) installed in your computer.

The Ruby dependency may put a damper in your plans to use and enjoy SASS (particularly in Windows) so the folks who created SASS have implemented a C version and called it libSASS.

LibSASS is not as mature as the Ruby version. Sass Break published an article listing the [differences between Ruby Sass and LibSASS](http://sassbreak.com/ruby-sass-libsass-differences/).

There is also a [compatibility table](http://sass-compatibility.github.io/) listing feaatures and whether they compatible with Ruby SASS and Libsass and what version supports them (or doesn’t.)

There will soon be parity between the two versions of SASS (if there isn’t parity already) but until I have time to test libSASS, I’ll stick to the Ruby version. Changing the engine to LibSASS is easy but not quite in scope for this article.

I asked Hugo Giraudel, the author of the compatibility tables if there was parity between Ruby SASS and LibSASS. His answer tweet is quoted below:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/elrond25">@elrond25</a> Except a few minor bugs, there is: <a href="https://t.co/v041w6jqtB">https://t.co/v041w6jqtB</a>. Jump on LibSass.</p>— Hugo Giraudel (@HugoGiraudel) <a href="https://twitter.com/HugoGiraudel/status/703152779078963200">February 26, 2016</a></blockquote>

<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

Because we’re using Ruby we need to install 3 gems (one for SASS, one for SCSS-Lint and one for SCSS-Lint’s reporter.

```
gem install sass scss-lint scss_lint_reporter_checkstyle
```

To install the Ruby version of the gulp plugin run:

```
node install --save-dev gulp-ruby-sass
```

The task looks like this. Note that there are multiple styles for SASS. I’ve chosen to keep the resulting CSS expanded as we’ll process it further in a future task.

```
// SCSS conversion and CSS processing
gulp.task('sass:dev', function () {
  return sass('app/scss/**/*.scss', { sourcemap: true, style: 'expanded'})
    .pipe(gulp.dest('app/css/expanded'))
    .pipe($.size({
      pretty: true,
      title: 'SASS'
    }));
});
```

[SassDoc](http://sassdoc.com/) provides a way to document your SASS code, similar to what JSDoc does for Javascript. It generates a website with the documentation for your code. An example of the pages SASSDoc generates is my [SASS Typography](http://caraya.github.io/typography-sass/) repository on Github

The SASSDoc website contains a detailed [list of anotations](http://sassdoc.com/annotations/) you can use on your page.

To install the plugin:

```
npm install --save-dev sassdoc
```

The task looks like this:

```
gulp.task('sassdoc', function () {
  var options = {
    dest: 'app/sassdocs',
    verbose: true,
    display: {
      access: ['public', 'private'],
      alias: true
    }
  };

  return gulp.src('app/sass/**/*.scss')
    .pipe(sassdoc(options));
});
```

Even though SASS will report compilation and syntax errors it’s always a good idea to lint the resulting code. SCSS-Lint is a Ruby executable (discussed earlier when installing dependencies) so we need to make sure the gem is installed

Install the plugin:

```
npm install --save-dev gulp-scss-lint
```

The task is this:

```
gulp.task('scss-lint', function () {
  gulp.src(['app/scss/**/*.scss'])
    .pipe(scsslint({
      'reporterOutputFormat': 'Checkstyle'
    }));
});
```
