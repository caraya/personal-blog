---
title: "AMP: Hope and Fears (Part 2)"
date: "2018-07-16"
---

## Technical questions

There are technical questions that came up when researching AMP and writing this post a few more technical questions

### Converting your content?

In talking to people at the Roadshow I now understand that AMP is a testbed to make things better and then bring it back to the wider web community; this is an important goal. I just have issues with the way AMP is doing this.

The example below is a basic sample HTML document conforming to the AMP HTML specification.

```html
<!doctype html>
<html amp>
  <head>
    <meta charset="utf-8">
    <title>Sample document</title>
    <link rel="canonical" href="./regular-html-version.html">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    <style amp-custom>
      h1 {color: red}
    </style>
    <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "NewsArticle",
      "headline": "Article headline",
      "image": [
        "thumbnail1.jpg"
      ],
      "datePublished": "2015-02-05T08:00:00+08:00"
    }
    </script>
    <script async custom-element="amp-carousel" src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"></script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
  </head>
  <body>
    <!-- Your amp-approved content goes here -->
  </body>
</html>
```

Some of the requirements and limitations of AMP are not evident. According to [AMP HTML Specification](https://www.ampproject.org/docs/fundamentals/spec) an AMP document must:

- start with the doctype < !doctype html>
- contain a top-level `<html &#x26a1;>` tag (`</html><html amp>` is accepted as well)
- contain `<head>` and `<body>` tags (They are optional in HTML)
- contain a `<link rel="canonical" href="$SOME_URL"/>` tag inside their head that points to the regular HTML version of the AMP HTML document or to itself if no such HTML version exists
- contain a `<meta charset="utf-8"/>` tag as the first child of their head tag
- contain a `<meta name="viewport" content="width=device-width,minimum-scale=1"/>` tag inside their head tag. It's also recommended to include initial-scale=1
- contain a `<script async src="https://cdn.ampproject.org/v0.js"></script>` tag inside their head tag
- contain the AMP boilerplate code (`head > style[amp-boilerplate]` and `noscript > style[amp-boilerplate]`) in their head tag

If this was all that AMP required for compliance I'd be ok. I've always been a gung-ho fan of proper page structure and including the appropriate elements where they should be. Death to tagsoup markup!

I love the idea of having metadata inlined in the document. This makes it easier to enforce (it's part of the AMP HTML spec) but it may make it harder to support in the long run as any change to the doc would require.

I may even forgive the extra attribute (other than class) in the HTML element.

But this is just the beginning.

Amp not only requires a certain structure from your HTML page but it changes some elements for AMP-specific ones and completely disallows others. I'm mostly OK with the tag it forbids as they are mostly legacy elements that have been kept on the specifications for compatibility (don't break the web) reasons. I mean, seriously, frameset and frames? It's 2018 people... we have better ways of doing that!

The table below (also from the [AMP HTML Specification](https://www.ampproject.org/docs/fundamentals/spec)) explains the limitations and changes that AMP makes to standard HTML elements. Some of these changes help explain the structure of the example page seen earlier.

| Tag | Status in AMP HTML |
| --- | --- |
| script | Prohibited unless the type is `application/ld+json`. (Other non-executable values may be added as needed.) Exception is the mandatory script tag to load the AMP runtime and the script tags to load extended components. |
| noscript | Allowed. Can be used anywhere in the document. If specified, the content inside the `<noscript>` element displays if JavaScript is disabled by the user. |
| base | Prohibited. |
| img | Replaced with `amp-img`.
Please note: `<img>` is a [Void Element according to HTML5](https://www.w3.org/TR/html5/syntax.html#void-elements), so it does not have an end tag. However, `<amp-img>` does have an end tag `</amp-img>`. |
| video | Replaced with `amp-video`. |
| audio | Replaced with `amp-audio`. |
| iframe | Replaced with `amp-iframe`. |
| frame | Prohibited. |
| frameset | Prohibited. |
| object | Prohibited. |
| param | Prohibited. |
| applet | Prohibited. |
| embed | Prohibited. |
| form | Allowed. Require including [amp-form](https://www.ampproject.org/docs/reference/components/amp-form) extension. |
| input elements | Mostly allowed with [exception of some input types](https://www.ampproject.org/docs/reference/components/amp-form#inputs-and-fields), namely, `<input[type=image]>`, `<input[type=button]>`, `<input[type=password]>`, `<input[type=file]>` are invalid. Related tags are also allowed: `<fieldset>`, `<label>` |
| button | Allowed. |
| style | [Required style tag for amp-boilerplate](#boilerplate). One additional style tag is allowed in head tag for the purpose of custom styling. This style tag must have the attribute `amp-custom`. |
| link | `rel` values registered on [microformats.org](http://microformats.org/wiki/existing-rel-values) are allowed. If a `rel` value is missing from our whitelist, [please submit an issue](https://github.com/ampproject/amphtml/issues/new). `stylesheet` and other values like `preconnect`, `prerender` and `prefetch` that have side effects in the browser are disallowed. There is a special case for fetching stylesheets from whitelisted font providers. |
| meta | The `http-equiv` attribute may be used for specific allowable values; see the [AMP validator specification](https://github.com/ampproject/amphtml/blob/master/validator/validator-main.protoascii) for details. |
| a | The `href` attribute value must not begin with `javascript:`. If set, the `target` attribute value must be `_blank`. Otherwise allowed. |
| svg | Most SVG elements are allowed. |

But it's the changes that they make to standard HTML elements that worry me. Do we really need an image custom element? video? audio?

The docs say it's ok to use `link rel=manfiest` but there are no references in the specification that \`link rel="manifest" is allowed.

I don't think this solves the underlying problems of the web. It doesn't change the fact that loading speed and payload size numbers are getting slower and bigger, not faster and smaller for the mobile web.

See the HTTP Archive [comparison data between January 1, 2017, and March 15, 2018](https://httparchive.org/reports/loading-speed?start=2017_01_01&end=latest) for an idea of what I'm talking about.

Granted, the HTTPArchive crawl may not catch AMP pages in its mobile results and that the pages in the crawl may not have a link to the AMP version of the page so the numbers may not reflect the actual improvements (if any) that AMP has made on the web. That said, I expect the numbers to change, one way or another, in future HTTP Archive crawls as they incorporate [Wappalyzer](https://www.wappalyzer.com/) as a tool in future crawls.

But AMP doesn't change the fact that we still have megabytes of images, even if they are compressed (if we get more space we'll just load more of them) huge bundles of JavaScript that will take tens of seconds to load and unblock page rendering on the web.

Even though people, companies and doc sites have been promoting best practices for years there has been no real improvement on how we work on the web and AMP, by hiding all the implementation details of lazy loading,

There are many more solutions outside of AMP that will give you performant web content. I think the biggest issue is that people may not know or may not care about these new technologies and smaller libraries that will take care of some performance bottlenecks.

### Generating AMP?

Handwriting AMP is different than writing HTML but how do we generate AMP when working with CMS other than Wordpress? How much do we need to retool our systems based on the restrictions imposed by AMP?

Condé Nast has published information on [how they generate the AMP content](https://technology.condenast.com/story/evolving-google-amp-at-conde-nast) for each of their publications: Allure, Architectural Digest, Ars Technica, Backchannel, Bon Appétit, Brides, Condé Nast Traveler, Epicurious, Glamour, Golf Digest, GQ, Pitchfork, Self, Teen Vogue, The New Yorker, Vanity Fair, Vogue, W and Wired.

Their system is fairly intricate as the image below illustrates:

![](/images/2018/07/AMP-Arch.png)

AMP Generation Process at Condé Nast. From [The Why and How of Google AMP at Condé Nast](https://technology.condenast.com/story/the-why-and-how-of-google-amp-at-conde-nast)

And the AMP generation process itself looks like it's rather complex, running from Markdown to React that then converts the Markdown content into valid AMP HTML:

![](/images/2018/07/AMP-Pipeline.png)

Condé Nast AMP Service Pipeline. From [The Why and How of Google AMP at Condé Nast](https://technology.condenast.com/story/the-why-and-how-of-google-amp-at-conde-nast)

So now we have to insert a way to identify when we want our CMS to serve AMP content and an AMP conversion process into our pipeline... but only for our AMP optimized content, right? I go back to the question I asked earlier about creating AMP only sites: Are they necessary?

Furthermore, I'm concerned about the amount of work needed to get AMP into a CMS. If you're not using a commercially available platform, how do you build AMP in addition to the standard content? As we saw in Converting your content? the restrictions of an AMP page are different than those of normal HTML (even if some of the restrictions are sensible and make sense). Sure we have WordPress and several other CMS platforms from AMP's [Supported Platforms, Vendors, and Partners](https://www.ampproject.org/support/faqs/supported-platforms) page:

- [AMPize.me](https://www.ampize.me)
- [Arc Publishing](https://www.arcpublishing.com)
- [Canvas](https://www.roya.com/blog/roya-announces-addition-of-amp-to-canvas-cms-amp.html)
- [Drupal](https://www.drupal.org/project/amp)
- [Fastcommerce](https://www.fastcommerce.com.br/accelerated-mobile-pages-amp)
- [Hatena](http://help.hatenablog.com/entry/amp)
- [Kentico](https://github.com/Kentico/kentico-amp)
- [Marfeel](https://atenea.marfeel.com/atn/product/marfeel-press/360-platform/google-amp/marfeel-s-accelerated-mobile-pages-google-amp-solution)
- [Rabbit](https://gomobile.jp/rabbit/)
- [Squarespace](https://support.squarespace.com/hc/en-us/articles/223766868-Using-AMP-with-Squarespace)
- [Textpattern](https://textpattern.com/weblog/401/textpattern-website-redesign/amp)
- [TownNews](https://www.townnews365.com/)
- [Tumblr](https://www.tumblr.com/about)
- [WordPress.com](https://en.support.wordpress.com/google-amp-accelerated-mobile-pages/)
- [WordPress.org](https://wordpress.org/plugins/amp/)

Another thing that comes to mind when it comes to generating AMP programmatically is how much of the CSS we use in our normal site can we use with AMP?

The AMP specification requires developers to use no more than 50kb of CSS and, on its face, it's a sensible requirement. That is until we realize that CSS animations and any extra prefixing we need to accommodate browser idiosyncrasies would also fall under that limitation and we need to decide early on how will we make the CSS fit into the 50KB requirements or how much to take out to make the CSS fit the size restriction and still keep branding folks happy.

This is not to say we should dump hundred and hundreds of lines of useless CSS into our pages but we should be the ones who decide how much CSS we use and how the CSS we use interacts with the existing content of the page. If we need to create one stylesheet for all our pages we can run them through UNCSS or similar tool to only serve the CSS the page actually uses and we also have the choice to inline it on the page.

Same thing with JavaScript.

### How many AMP tags are too many?

There is a growing number of purpose-specific custom AMP elements. I can understand the need for `amp-img` and `amp-video` but I become more skeptic when I see `amp-vimeo`, `amp-youtube`,`amp-brid-player` or `amp-kaltura-player`. There may be specialized features that require the special elements but I don't think that's the case for all of them.

Below is the list of custom media elements that are part of the AMP ecosystem (`amp-img` is also part of the list but I removed it because it's built into the AMP library):

- amp-3d-gltf
- amp-3q-player
- amp-anim
- amp-apester-media
- amp-audio
- amp-bodymovin-animation
- amp-brid-player
- amp-brightcove
- amp-dailymotion
- amp-google-vrview-image
- amp-hulu
- amp-ima-video
- amp-imgur
- amp-izlesene
- amp-jwplayer
- amp-kaltura-player
- amp-nexxtv-player
- amp-o2-player
- amp-ooyala-player
- amp-playbuzz
- amp-reach-player
- amp-soundcloud
- amp-springboard-player
- amp-video
- amp-vimeo
- amp-wistia-player
- amp-youtube

It's interesting that there is an AMP-specific Vimeo and element when the project itself describes how you can use `amp-iframe` to create the same experience:

```html
<amp-iframe width="500"
  title="Netflix House of Cards branding: The Stack"
  height="281"
  layout="responsive"
  sandbox="allow-scripts allow-same-origin allow-popups"
  allowfullscreen
  frameborder="0"
  src="https://player.vimeo.com/video/140261016">
</amp-iframe>
```

Same for the Youtube element (although it doesn't appear in the `amp-iframe` docs. All that we do is change the tag name to `amp-iframe` and add `layout="responsive"` and `sandbox= allow-scripts allow-same-origin allow-popups`.

```html
<amp-iframe
  layout="responsive"
  sandbox="allow-scripts allow-same-origin allow-popups"
  width="560"
  height="315"
  src="https://www.youtube.com/embed/3vcGsrMdiUA?rel=0"
  frameborder="0"
  allow="autoplay; encrypted-media"
  allowfullscreen
  playsinline></amp-iframe>
```

There is nothing you can do in the `amp-youtube` that you can't do using an `amp-iframe` element. So why the difference? Are the optimizations needed for a given player enough reason to create another custom element, another script to load and another item to prerender and, pontentially, slow the user experience for people in slower connections?

### Specific Use Cases

My specific cases of what AMP doesn't allow are [Codepen](https://codepen.io/) embeds and [Prism.js](http://prismjs.com/) code syntax highlighting.

The typical expected Codepen emebd looks like this:

```html
<p data-height="438" data-theme-id="dark" data-slug-hash="MGWazx" data-default-tab="html,result" data-user="caraya" data-embed-version="2" data-pen-title="Card Grid Component for Themeable Design System" class="codepen">See the Pen <a href="https://codepen.io/caraya/pen/MGWazx/">Card Grid Component for Themeable Design System</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>
```

As far as I understand AMP, this would not work in an AMP page. AMP will not let you use script tags in a page, and even if AMP allows data-\* attributes on elements they are useless because there's nothing to process them with.

Same thing with Prism. It works by adding a script and a style sheet to the page and then expects properly coded blocks of preformatted text for the content to be highlighted. To validate AMP content I am not allowed to have additional script tags on the head or before the end of my document. In theory, I should be able to merge Prism's CSS with the AMP required CSS and my site's CSS but would that work in 50KB of CSS that we're allowed to add?

And yes, I know that Codepen also provides `iframes` for embedding pens but it's not the recommended form to do so.

The problem with Prism is more involved and something that I'm still trying to figure out. It requires workers but I'm still trying to figure out how to make them talk to each other.

### CORS for my own site?

One of the biggest issues is hosting the content in a Google-based and supported CDN. This causes the large, ugly URLs (like `https://www-gq-com.cdn.ampproject.org/c/s/www.gq.com/story/gq-eye-exclusive-fatherhood-style-series---todd-snyder` or `https://www-gq-com.cdn.ampproject.org/c/s/www.gq.com/`) but also has an interesting side effect that makes CORS necessary for your own content.

When you go to a site, for example: `https://www.gq.com/story/gq-eye-exclusive-fatherhood-style-series---todd-snyder` in a mobile device it'll redirect you to the version hosted in the AMP CDN which turns into `https://www-gq-com.cdn.ampproject.org/c/s/www.gq.com/story/gq-eye-exclusive-fatherhood-style-series---todd-snyder` and caches it to guarantee preloads and seemingly instant first load experiences.

But what happens if you need to load data for your application? Say you want to load product data for your shopping cart, or a tour date list for your favorite band? Those are stored on your server, not the cache and for them to work properly you need to set CORS headers on them so they will work for origins other than yours.

On a side note, if you hit the AMP cache URL from a desktop browser it will redirect you to the desktop, however, if you hit an AMP link using an activation script like `https://www.gq.com/story/gq-eye-exclusive-fatherhood-style-series---todd-snyder/amp` it will take you to the AMP version, regardless of platform or form factor. I find this even more interesting, why restrict some ways to access the content from some form factors and not others? Am I missing the point of the URLs?

### Performance

People have been working with webperformance for years. The early work Ilia Grigorik and Addy Osmani did and continue to do at Google, tools like UNCSS, the fact that we can precache and preload content (but not provide automatic preloading like Google does with AMP search results), the fact that we have PWA and its component technologiestechnologiies available within and outside PWAs really makes me wonder how lazy we've become as developers.

I'll take three examples of things we can do now to make experiences outside of an AMP environment: Image Optimization, Resource PrioritizationPioritization, and Service Workers.

We know that images make up for a large fraction of what gets pushed into a web page, we don't evangelize tools like [Imagemin](https://github.com/imagemin/imagemin) and workflows that use these tools to generate smaller images.

Does `amp-img` really reduce the bloat problem? If you make the images smaller that means people will put even more images in a page because the size of each individual image is smaller so we can use more of them, we don't need to worry about the individual image, AMP will take care of that.

It is not hard to create a good [resource prioritization](https://developers.google.com/web/fundamentals/performance/resource-prioritization) strategy using a combination of H2 Push, link preload, prefetch, prerender and dns-prefetch to load resources the way we want them to. If we compare this with lazy loading content so they will only load when needed, we have a much better web experience.

There is no current 100% foolproof way to get H/2 push to work consistently in all browsers as discussed in Jake Archibald's [HTTP2 is tougher than I thought](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/). As Jake points out in the article's conclusion:

> There are some pretty gnarly bugs around HTTP/2 push right now, but once those are fixed I think it becomes ideal for the kinds of assets we currently inline, especially render-critical CSS. Once cache digests land, we'll hopefully get the benefit of inlining, but also the benefit of caching. Getting this right will depend on smarter servers which allow us to correctly prioritize the streaming of content. Eg, I want to be able to stream my critical CSS in parallel with the head of the page, but then give full priority to the CSS, as it's a waste spending bandwidth on body content that the user can't yet render.

We're not there yet, but we can do something to make the whole load faster with a little help from the server. We create server-side user agent sniffing strings based on case-insensitive matching with [BrowserMatchNoCase](https://httpd.apache.org/docs/2.4/mod/mod_setenvif.html#browsermatchnocase) directive, part of the [mod\_setenvif](mod_setenvif) module.

```apacheconf
# Windows 10-based PC using Edge browser
BrowserMatchNoCase edge browser=Edge

# Chrome OS-based laptop using Chrome browser (Chromebook)
BrowserMatchNoCase CrOS browser=ChromeOS

# Mac OS X-based computer using a Safari browser
BrowserMatchNoCase safari browser=Safari

# Windows 7-based PC using a Chrome browser
BrowserMatchNoCase chrome browser=chrome

# Linux-based PC using a Firefox browser
BrowserMatchNoCase firefox browser=firefox
```

We can then test if the content has been pushed to the client using cookies as described in [Web Performance Improvement](https://publishing-project.rivendellweb.net/web-performance-improvement/) and serve resources based on the client browser and its current limitations.

We need to be aware that the cookie we set from the server as we push the resources is not completely reliable after the first time we push resources; that may cause us to miss resources or to load them more than once.

Service workers can also help improve the performance of your web content after the initial visit. We can use it to keep a persistent cache of content for our site or application that can be populated and expired as needed; we can also modify the requests as needed and ameliorate the problems from h/2 push alone.

Libraries like [Workbox](https://developers.google.com/web/tools/workbox/) can help us make this process easier.

A more radical solution is to server-side render your application. This will take care of perceived performance issues at the cost of potentially longer initial load times. Since the server has to process all the Javascript to render the content on the page. Eric Bidelman presents a way to use Puppeteer to [SSR an Express Node application](https://developers.google.com/web/tools/puppeteer/articles/ssr). Other frameworks like [React](https://hackernoon.com/whats-new-with-server-side-rendering-in-react-16-9b0d78585d67) and [Vue](https://vuejs.org/v2/guide/ssr.html) have their own systems to server-side render applications. It is up to you to decide if the extra work and the extra time it'll take for your application to render on the server is worth it.

One of the ways AMP makes content load faster is by pre-rendering content from the Google Search Result Page. Note how the pre-render only works for valid AMP pages. Malte Ubl, the tech lead for AMP, wrote a [Medium post](https://medium.com/@cramforce/why-amp-html-does-not-take-full-advantage-of-the-preload-scanner-7e7f788aa94e#.eeiqzkmzj) outlining why they chose to do so. While it's nice that they can be so aggressive in their prerendering of their custom elements it still raises some questions about implementation and presents some interesting questions when talking about prerendering resources outside the AMP environment.

If you have more than one resource that the `amp-img` element is supposed to load, will it prerender all of them? For example in the following element, how will the AMP runtime know which image to prerender for browsers that may or may not support WebP?

```html
<amp-img alt="Mountains"
  width="550"
  height="368"
  src="images/mountains.webp">
  <amp-img alt="Mountains"
    fallback
    width="550"
    height="368"
    src="images/mountains.jpg"></amp-img>
</amp-img>
```

Similar but even more worrisome is the case of responsive images. The example below offers ten different options for this one single image (not counting 2x and 3x images for retina displays). Will the browser download all of them if the image is above the fold? Are images subject to the restriction of placement from the top of the page?

```html
<amp-img src="/img/amp.jpg"
  srcset="  /img/amp.jpg 1080w,
            /img/amp-900.jpg 900w,
            /img/amp-800.jpg 800w,
            /img/amp-700.jpg 700w,
            /img/amp-600.jpg 600w,
            /img/amp-500.jpg 500w,
            /img/amp-400.jpg 400w,
            /img/amp-300.jpg 300w,
            /img/amp-200.jpg 200w,
            /img/amp-100.jpg 100w"
  width="1080"
  height="610"
  layout="responsive"
  alt="AMP"></amp-img>
```

We do have the options of prerendering content outside of the AMP ecosystem but the question becomes: How much? Is it worth taking what Steve Souders calls "the nuclear option" of preloading your content? How do you pick what content to prerender? Do we prerender all the links in our page? All the internal links? External?

Google has the resources to proactively prerender the AMP pages it serves from the AMP cache and that's the only way we can take full advantage of AMP, using their technology and their delivery mechanism. This doesn't mean that AMP's prerender mechanism is the best way to go as it trades speed for bandwidth.

I recently came across Tim Kadlec's [How Fast Is Amp Really?](https://timkadlec.com/remembers/2018-03-19-how-fast-is-amp-really/) performance analysis of AMP content served in different ways:

1. How well does AMP perform in the context of Google search?
2. How well does the AMP library perform when used as a standalone framework?
3. How well does AMP perform when the library is served using the AMP cache?
4. How well does AMP perform compared to the canonical article?

His findings mirror my opinion about AMP not doing anything that we can't do in the open web. To me, the most, important section of Tim's article is when he talks about page weight reduction:

> The 90th percentile weight for the canonical version is 5,229kb. The 90th percentile weight for AMP documents served from the same origin is 1,553kb— a savings of around 70% in page weight. The 90th percentile request count for the canonical version is 647, for AMP documents it's 151. That's a reduction of nearly 77%. AMP's restrictions mean less stuff. It's a concession publishers are willing to make in exchange for the enhanced distribution Google provides, but that they hesitate to make for their canonical versions. If we're grading AMP on the goal of making the web faster, the evidence isn't particularly compelling. Every single one of these publishers has an AMP version of these articles in addition to a non-AMP version. From: [How Fast Is Amp Really?](https://timkadlec.com/remembers/2018-03-19-how-fast-is-amp-really/)

AMP restricts what you can do with JavaScript and what you can do with custom AMP elements restricts what you can do on your pages and, regardless of the reasons why you put the restrictions in place, it shouldn't be up to a library or framework to dictate how much stuff you put in a page but it's up to the designers and developers to slim down their content... easier said than done, I know, but AMP hasn't sold me as the solution or even a good solution to this problem and neither do publishers, otherwise AMP would be the only version of all published web content.

The other interesting aspect of this conversation is what happens to search engines like Bing or other platforms that don't support canonical links?

The final, technical, question I have is how well AMP works in low-end and feature phones or for people using Proxy browsers such as Opera Mini, UC browser or Chrome for Android in their most aggressive data saving modes? How do publishers in those markets address the needs of their users while still remaining compliant with AMP requirements?
