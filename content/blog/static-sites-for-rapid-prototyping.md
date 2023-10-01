---
title: "Static sites for Rapid Prototyping"
date: "2017-05-29"
templateEngineOverride: false
---

Now that we have a way to create components and preview them using Fractal we can look at how we can use the same handlebars templates to build a static web site.

Because I've used Gulp to build the rest of the site it's important to me that whatever site generator I work with also uses Gulp. [Assemble](http://assemble.io/) does enough of the work that it's worth putting up with its idiosyncrasies.

First the bad. There used to be a Gulp plugin that would make Assembly work with Gulp. The plugin has been deprecated and people cautioned to work directly with Assemble.

This would be all well and good except for the fact that documentation sucks. That would be a minimal issue if there were Gulp examples that people (developers or users) shared with the community or if the documented best practices were illustrated with code.

That said I got it to work in Gulp 3.9 and I'll document the process and why I think this is a good way to build static sites.

## Why Static?

Rather than spin up a new server or write a whole new app every time we want to test a layout or do a lot of complex things when prototyping layouts I've chosen to build the prototypes as static sites. With static sites I still use HTML, CSS and ES6 but don't need to fireup a full server to make the demos work.

Because I'm using Handlebars templates I can reuse as many templates as I need or use them to create specialized versions. For exampe, if I have a template for a header element, I can copy it and make it into an inverse header by just adding a CSS class and swapping the foreground and background color.

I can also build pages with data without having to use a database. Using JSON and Handlebars we can build data-driven content without a database. It doesn't work as well as PHP and other dynamic languages but we're not serving the site as a dynamic application, I'm just using the data to build the files that will be statically served.

The last part is easy of serving the content. I can serve them locally from a laptop for a presentation, I can upload them and serve them from my DVS where I also host my Wordpress installations and, the most intriguing option, I can serve them from buckets in AWS and Google cloud.

We'll explore these options as we progress through creating the content. But first let's look at what we need to do to get Assemble up and running.

## Building an Assemble Gulp workflow

Installing Assemble is fairly easy. We install 3 Gulp plugins: `assemble`, `gulp-extname` and `helper-markdown`.

`assemble` is the core Assemble toolkit.

`gulp-extname` provides a quick way to replace file extensions based on predetermined mappings.

`helper-markdown` converts Markdown to HTML using the Marked library create by the same author who created Assemble.

```bash
npm i --save-dev assemble gulp-extname helper-markdown
```

Once we've installed the plugins we can create the Gulp task. This is what will take the pages, build them using layouts which in turn will use one or more partials to build the resulting HTML page.

The Assemble purists may complain that the task we defined should be broken down into two tasks, one to load configuration and the other to actually run Assemble. They are correct, that's the right way to do it... but I'd rather keep most or all the configuration in the task that uses it and this has worked so far.

So let's configure Assemble to create our content.

We first configure Assemble by assigning it to a constant. I'm doing this outside the task because I may want to break this single task into multiple Assemble tasks that reuse the app and some of the elements we define below.

The first action we do inside the task is to tell assemble where to find [partials](http://assemble.io/docs/Partials.html), [layouts](http://assemble.io/docs/Layouts.html) and [pages](http://assemble.io/docs/Pages.html) to build the content.

Next I provide a default layout. I do this to make sure the content will build even if I forget to specify the layout to use. Better to have the wrong layout than no layout at all.

Because I write all my content in Markdown I need to be sure that I use Asssemble's Markdown helper. It uses [Marked.js](https://github.com/chjj/marked) under the hood so the result is the same whether I run it through assemble or run it through my starter kit.

There are times when I want to use JSON to populate data in the templates rather than have to type it all by hand; `app.helper` tells Assemble where to find the JSON or YAML files to populate data with.

I then push the pages to the processing stream, render each file, run then through `extname` to change the extension from `hbs` to `html` and then save them in the destination file specified in `app.dest` (in this case the `_site` directory).

```javascript
// 1. Setup Assemble
const app = assemble()

gulp.task('build', () => {
  // 2. sets the locations of partials, layouts and pages
  app.partials('src/templates/partials/**/*.hbs')
  app.layouts('src/templates/layouts/*.hbs')
  app.pages('src/templates/pages/**/*.hbs')
  // 3. Sets the default layout
  app.option('layout', 'base')
  // 4. Tells Assemble to use the Markdown helper
  app.helper('markdown', require('helper-markdown'))
  // 5. Sets the locations for data files
  app.data('src/templates/{pages,partials,data}/**/*.{json,yaml}')

  // 6. Pushes "pages" collection into stream
  return app.toStream('pages')
    // 7. Render pages with default engine (handlebars)
    .pipe(app.renderFile())
    // 8. Map the source extension to the desired output
    .pipe(extname())
    // 9. specify your output location
    .pipe(app.dest('_site'))
})
```

So now we have a working task that will convert all Handlebars template into HTML. Now we can worry about creating the content.

### Partials, pages and layouts

When we built the Assemble Gulp task we mentioned three different types of Handlebars content: `partials`, `pages` and `layouts`. We'll look at them in more detail.

If you're not familiar with the concepts we'll look at them in more detail.

**Partials** are small reusable components for your page. These can be as small as a header or a list of links and as large as a card component. We make them partials to make sure we can reuse them in different pages.

An example of a partial Handlebars template:

```handlebars
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,minimum-scale=1,maximum-scale=1">
```

Another type of partial holds smaller pieces of content like the header content we defined above:

```handlebars
<head>
  {{> head-content}}
</head>
```

We can go as granular as we need to with our partials. The basic question I ask when I build a partial is how many pages will I use it on, if it's a single page then I'd rather keep it as part of the layout, otherwise I'll create it as a partial.

**Layouts** are the structure of the page we want to build. It is also one of the places where we can add partials to build our content.

In the example below we use several Handlebars techniques to make our template do what we want.

```handlebars
<html lang="en" dir="ltr">

<head>
    <title>
        {{#if title}}
            {{!-- If the page has a title then use it--}}
            {{title}} | Essays
        {{else}}
             Essay
        {{/if}}
    </title>

    <link rel="stylesheet" href="styles/main.css">
    {{#> head-block}}
      {{!-- default conten goes here --}}
    {{/head-block}}
</head>

<body>

{{#markdown}}
  {{> body}}
{{/markdown}}


<!-- scripts used throughout most pages -->
{{#> bottom-scripts}}
    {{!-- Default content if partial is not found --}}
{{/bottom-scripts}}

</body>
</html>
```

In the head of the document we use the `if` [builtin helper](http://handlebarsjs.com/builtin_helpers.html) to customize the title of the page if the title attribute is present and provide a generic title otherwise.

The `head-block` and `bottom-script` partials use the block partial technique. According to the handlebar documentation:

> The normal behavior when attempting to render a partial that is not found is for the implementation to throw an error. If failover is desired instead, partials may be called using the block syntax.
>
		```handlebars
		{{#myPartial }}
		Failover content
		{{/myPartial}}
		```
>
> Which will render Failover content if the myPartial partial is not registered.

When only one person is working on the project it's ok to use regular templates but even then it might be good idea to code defensively and provide failover content in case you give things the wrong name or put them in the same directory. I've done that many times and got frustrated because the pages were not rendering as intended.

**Pages** hold the content and additional content related partials. This is the content counterpar to the layout structure. In this case we use several techniques to make the content work with the layout and be performant.

Be aware that this is not the full content.

```handlebars
---
title: Ghost in the shell review and analysis
author: Carlos Araya
layout: base
---

{{#>title-block--inverse}}{{/title-block--inverse}}

<div class="essay container">

**WARNING: Fanboy hat firmly on. We may disagree on specifics
but this is my vision.**

## In World General notes

In this video play special attention to the director's interview.

<div class="youtube-player" data-id="GpsfXLa2g-s"></div>

Kuze, his story and his relationship with the Major is  modified from Stand Alone Complex 2nd Gig. I have to admit, I  prefer the story as told in the TV show (2nd Gig, Episode 11:  Affection) but it's not quite the same story and it blends  itself well with the story and ideas as told in the film.

The story of why the Major become a cyborg is original to the movie, even though it has similarities with 2nd Gig and Arise even if the movie shows an entirely different story of her parents being killed  by terrorists. 2nd Gig has the major and Kuze being severely injured in an accident as children and receiving some of the first fully  prosthetic bodies, Arise has the major being fully cyberized at birth because of a chemical spill accident that killed her parents.
</div>
```

The page uses YAML Front Matter to indicate the title and the author as well as the layout to use.

The page uses a block partial for displaying the author and title in a way that will render it in inverse text (white text over black background rather than the default black over white).

I also write special tags for video using a lazy loader script that is defained in the layout of the page. One of the beauties of using Markdown is that we can write HTML where Markdown itself is not enough.

### Using data to populate content

The last bit I want to discuss on this post is how to use JSON to populate content in a page. **This is no dynamic content**, every time we make changes to the data we need to recreate the page that uses it. This approach is particularly good for pages where the content doesn't change frequently like menus or big project lists like the one I've done below.

The page template is fairly simple. It (re)uses `head-content`, `title-block`, `footer-block` and `bottom-scripts` to create the oage structure.

The new item is the use of the `#each` helper to loop over content. In this case it will look for `project.json` and for every item in that file it will call the `project-single` partial

```handlebars
{% raw %}
---
title: Project Archive
author: Carlos Araya
layout: base
---
<!-- projects.hbs -->
<html>
  <head>
    {{#>head-content}}{{/head-content}}
  </head>
  <body>
    {{#>title-block}}{{/title-block}}

    <div id="card-container">
      {{#each projects}}
        {{> project-single}}
      {{/each}}
    </div>

    {{#>footer-block}}{{/footer-block}}
    {{#>botttom-scripts}}{{/botttom-scripts}}
  </body>
</html>
{% endraw %}
```

`project-single` on its own doesn't do anything, it doesn't have a context to work from. But when it runs inside the projects page it will take the data from each item to populate that run of the template. Think of it as a Javascript For loop.

The CSS is already defined in an external file.

```handlebars
{% raw %}
  <!-- project-single.hbs -->
  <div class="card">
    <div class="title">{{name}}</div>
    <div class="content">
      <div class="description">
        <p>{{description}}</p>
      </div>
      <div class="metadata">
        <p>Project Status: <strong>{{stage}}</strong></p>
        <p>Project Type: <strong>{{type}}</strong></p>
      </div>
      <div class="title">Project Notes</div>
      <div class="notes">
        <p>{{notes}}</p>
      </div>
      <div class="notes-title">Project Links</div>
      <div class="action">
        {{#if url.code}}
         <a href="{{url.code}}">Code</a>
        {{/if}}
        {{#if url.writeup}}
          <a href="{{url.writeup}}">Writing</a>
        {{/if}}
        {{#if url.other}}
          <a href="{{url.other}}">Other</a>
        {{/if}}
      </div>
    </div>
  </div>
{% endraw %}
```

## What's next?

I work in a parallel process. I create the content first (partials, layout and pages) with a thought about styles and creative uses of CSS, animations and Javascript.

Some of my challenges with static websites is how much modularization we need versus how many CSS and Handlebaras files do we create? Right now my SASS process creates one monolithic stylesheet from multiple partials. In a static site I might want to break the styles in the same way that I break the pages.

Working on converting the site into a PWA. You can can create service workers ([Gulp and workbox-sw](https://developers.google.com/web/tools/workbox/)) and web app manifests ([Web App Manifest Generator](https://brucelawson.github.io/manifest/)) or you can bite the bullet and do everything manually. That's your call.

Hosting the content will be the next problem to tackle. I'm inclined to look at Google Cloud or Firebase hosting to host the content. I love Google Cloud and I have the way to programmatically upload the content, the only downside is that it doesn't support TLS and HTTPS.
