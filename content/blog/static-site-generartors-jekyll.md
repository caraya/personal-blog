---
title: "Static Site Generartos: Jekyll"
date: "2016-02-15"
categories:
  - "technology"
templateEngineOverride: false
---

[Jekyll](https://jekyllrb.com/) is the best known static site generator. It is written in [Ruby](https://www.ruby-lang.org/en/) and distributed as a [Ruby Gem](https://rubygems.org/).

## Installing and running Jekyll

At its most basic creating and running a local Jekyll site is as simple as running the following commands:

```
$ gem install jekyll
# Jekyll requires ruby 2.0 or higher to install
$ jekyll new my-awesome-site
# replace my-awesome-site with the name of your site
$ cd my-awesome-site
$ jekyll serve
# Now browse to http://localhost:4000
```

The steps above make the following assumptions:

- You have Ruby 2.0 or higher installed. It will not work with ruby 1.9.3
- You are installing the Jekyll gem for the first time

After installing Jekyll, creating a new site and running the local server you will get a result like the image below which uses the default Jekyll theme (more on themes later.)

![](//publishing-project.rivendellweb.net/wp-content/uploads/2016/01/Jekyll-Basic-Site.png)

Additional commands that can be useful during the initial build and development process:

```
$ jekyll build
# => The current folder will be generated into ./_site

$ jekyll server
# => Serves the site on localhost at port 4000

$ jekyll server --incremental
# => Performs an incremental build
#      (experimental and new in 3.0)

$ jekyll server  --profile
# => Profiles the liquid code in your Jekyll site
#      (experimental and new in 3.0)

$ jekyll build --destination <destination>
# => The current folder will be generated
#    into </destination><destination>

$ jekyll build --source <source /> \
   --destination </destination><destination>
# => The <source /> folder will be
#    generated into </destination><destination>
```

Once the site has been generated you can move it with SFTP or SCP to your server or you can push it into a Github Pages branch and server it from there using a secure HTTPS server.

## Adding content to the site

Getting the basic site up and running is one thing. Getting **our** site up and running is something completely different.

**_Keep the server running, it’ll be needed to see new and changed content._**

Content for Jekyll is nothing more than Github Flavored Markdown with an optional front matter section enclosed in three dashes. A sample page looks like the one below:

```
---
layout: post
title:  "Sample Post #2"
date:   2016-01-31 15:15:15 -0800
categories: example update
---

# File heading

{% highlight javascript %}
function myJSFunction() {
   code goes here
}
{% endhighlight %}
```

At first I thought I could do the date as just `2106-01-31` but the format for the date should follow this format: `2016-01-31 15:15:15 -0800`.

Filenames should be in this format `2011-12-31-new-years-eve-is-awesome.md` and posted inside the `_posts` folder/directory

## Enhancing the site and its content

Jekkyll’s primary authoring languages are SCSS/SASS and Markdown but there are several plugins and Ruby Gems we can use to enhance the content.

What I’ve used on the demo site

- category archive plugin (automatically creates category archive pages)
- emoji for jekyll (allows use of emoji on posts)
- sitemap generator (generates a sitemap.xml of your site)

There are many more plugins. They are listed in the [plugins section of the Jekyll website](http://jekyllrb.com/docs/plugins/).

Jekyl plugins require knowledge of Ruby. If you don’t know or are not comfortable with the language Google the type of functionality you’re looking for to see if it’s already been done and, if it’s not available, file an issue in the Jekyll Github repository

## New content types

Jekyll default to using post and pages as the primary content types, the difference being that posts are stored in `_posts`and have the date as part of the file name as in: `2016-01-31-sample-post-2.markdown`.

But there are times when these two are not enough. That’s where collections come in. They allow us create custom content types and treat them differently than we do our posts and pages.

When thinking about posts, pages and collections the following flow may help:

![](//publishing-project.rivendellweb.net/wp-content/uploads/2016/02/collections-workflow.png)

Following Ben Balter’s [post on collections](http://ben.balter.com/2015/02/20/jekyll-collections/) we’ll build a component content type in these steps. We will add the collection to the site by following these steps:

1. Define the collection in the `_config.yaml` configuration file
2. Create a `_components&nbsp;` directory at the root of the site
3. Create one or more layouts for the component type

#### 1\. Define the collection in the configuration file

Add the following section of code to your `_config.yaml` configuration file.

```
collections:
  - components
    output: true
         permalink: /components/:path/
```

`collections` tells Jekyll that we are creating new collections of related items.

We name our collection `components` and inside the components collection we do the following:

- Set `output` to true so that it’ll generate a separate document for each individual file in the directory
- Create a custom permalink under using `/components/` as the root of the URL and then using whatever path we’ve made available

#### 2\. Create a directory at the root of the site

For this to work we need to make sure there is a directory matching the name of the collection. I named mine `_components` and placed it at the root of the site. This will hold all the component related posts.

#### 3\. Create one or more layouts for the component type

If Jekyll finds no layouts matching the default indicated in the document’s front matter it will either error out or use the default template.

We can have as many layouts as we want and use them with specifica pieces of content. For example we could create a flexbox-based layout for gallery-type content or a (CSS) based grid layout for more challenging content.

The possibilities are only limited by browser support. To give you an idea this is the basic template for a post in Jekyll’s default theme.

```
---
layout: default
---
<article class="post" itemscope itemtype="http://schema.org/BlogPosting">

  <header class="post-header">
    <h1 class="post-title" itemprop="name headline">{{ page.title }}</h1>
    <p class="post-meta"><time datetime="{{ page.date | date_to_xmlschema }}"
    itemprop="datePublished">{{ page.date | date: "%b %-d, %Y" }}</time>
    {% if page.author %} • <span itemprop="author" itemscope
    itemtype="http://schema.org/Person">
    <span itemprop="name">{{ page.author }}</span></span>{% endif %}</p>
  </header>

  <div class="post-content" itemprop="articleBody">
    {{ content }}
  </div>

</article>
```

## Using data to generate content

Let’s say that I want to create posts with my projects. Rather than manually type the data for the projects I can use YAML and Jekyll templates. The `_data` directory contains the directory structyre for the data files you will use to populate templates.

We can do a single file at the root of the `_data` directory like so in `_data/projects.yaml`:

```
- name:  Athena
  description: Athena is a set of web components designed to builld content
  url: http://athena-project.org/

- name: Polymer
  description: Library to create and use web components
  url: https://www.polymer-project.org/1.0/
```

Then we can refer to the data in `projects.yaml` with something similar to this:

```
<ul>
{% for project in site.data.projects %}
  <h1>{{ project.name }}</h1>

  <p>URL: <a href="{{ project.url }}">{{ project.url }}</a></p>

{% endfor %}
</ul>
```

You can create files and templates for data that is not directly related to the post types you’ve created. You can use YAML, CSV or JSON for these data files and any liquid template tags to populate the content with (starting with `site.data`.)

## Dependency Management

Jekyll is based on Ruby and its ecosystem which, if you’re not careful, can cause all sorts of headaches like the theme you use requiring an earlier version of Jekyll than the one you’ve installed on your system

One way to deal with the headaches is to install all the gems and dependencis manually but it’s a less than optimal solution.

> In some cases, running executables without bundle exec may work, if the executable happens to be installed in your system and does not pull in any gems that conflict with your bundle. However, this is unreliable and is the source of considerable pain. Even if it looks like it works, it may not work in the future or on another machine.

[Bundler](http://bundler.io/v1.5/gemfile.html) manages dependency versioning and configuration by creating a Gemfile that stores names and configurations for gems your Jekyll installation depends on.

Make sure than bundler is installed. Run the following command from your terminal/shell

```
$ gem install bundler
```

To create a blank Gemfile run:

```
$  bundle init
```

You can then add dependencies to the Gemfile by editing it and adding the data manually.

Using Bundler you can lock specific versions or minimal versions of the gems you’re using. In the example below there are a few matching rules to check.

```
source "https://rubygems.org"

gem 'jekyll', '3.1.1' # will match 3.1.1 only
gem 'jekyll-sitemap' # wil match the latest version
gem 'octopress', '~> 3.0' # will match versions greater than 3.0
```

Check [Pessimistic version constraint](http://guides.rubygems.org/patterns/#pessimistic-version-constraint) in the Rubygems guide for more information

When you’ve added all the dependencies you need for your project you can install them all at once by running:

```
$ bundle install
```

Then add the following block to you `_config.yaml` file and list all the gems you’ve added in your Gemfile:

```
gems:
  - jekyll-sitemap
```

## Octopress

Some themes also come bundled with [Octopress](http://octopress.org/), a framework that sits on top of Jekyll developed by [Brandon Mathis](http://brandonmathis.me/) to make working with Jekyll easier.

The main command that convinced me to install Octopress is the new post command. it makes creating new posts as easy as:

```
octopress new post "This is my shiny new post"
```

Will automatically create the post with the right time format in the `_post` directory for you. You can then edit it in your favorite Markdown editor.

## Themes

Using themes in Jekyll is different than using them in Wordpress. Rather than create the content and then assign the theme, we download the theme first and the build the content in the new theme or, if we have existing content (posts, custom data or others) you have to copy the content into your theme.

Most, if not all, themes come with Gemfiles installed and preconfigured. All you need to do to get the theme up and running is to run the following commands:

```
$ bundle install

$ bundle exec jekyll serve #if you want to preview your site

$ bundle exec jekyll build #if you want to build your site
```

Some of the themes I’ve chosen to test are:

**Skinny Bones** ([Code](http://mmistakes.github.io/skinny-bones-jekyll/getting-started/) | [Demo Site](http://mmistakes.github.io/skinny-bones-jekyll/))

![made-mistakes](/images/2016/02/made-mistakes-1024x373.jpeg)

 **Mediator** ([Code](https://github.com/dirkfabisch/mediator/blob/master/README.md) | [Demo Site](http://blog.base68.com/))

![screenshot1](/images/2016/02/screenshot1.jpg)

**Solarized Theme** ([Code](https://github.com/mattvh/solar-theme-jekyll/blob/master/README.md) | [Demo Site](http://mattvh.github.io/solar-theme-jekyll/))

![solarized](/images/2016/02/solarized.png)

Jekyll themes are not like Wordpress themes where you create a child theme in order to make changes and do further development. You work directly in the

## Conclusion

Jekyll presents a different set of challenges than Wordpress. Where Wordpress has to deal with PHP and MySQL Jekyll has to concern itself with version of the Jekyll tool and any associated plugins and pieces of Ruby code.

The Ruby community has mostly solved those issues with tools like Bundler but, as with many of these tools, it assumes intermediate or advnaced knowledge of the tool and a fairly advanced knowledge and comfort with the command line.

Is this a tool for beginners? No, I don’t think it is. There are no graphical tools to install and configure a Jekyll instance and Themes are, basically, prepackaged installations of Jekyll configured the way the theme author wants.

If you can get past these command line hurdles, Jekyll and its ecosystem are very interesting to use.

## Managing a site with Jekyll and Github

## Technical introduction to Jekyll 3
