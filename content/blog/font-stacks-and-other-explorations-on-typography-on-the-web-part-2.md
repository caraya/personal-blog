---
title: "Font stacks and other explorations on typography on the web, Part 2"
date: "2018-03-15"
---

## Writing Modes and World Languages

Another thing that affects typography is the writing direction of your text. Either because the language requires it or because you're experimenting with new technologies like Jen Simmons does in this example from [Layout Land Youtube Channel](https://www.youtube.com/channel/UC7TizprGknbDalbHplROtag)

It leverages CSS Grid, Transforms, and other modern technologies to create really impressive layouts.

<iframe width="560" height="315" src="https://www.youtube.com/embed/OxrsO4aIjyc?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Going back to writing modes. Different languages use different writing modes. Some things to consider:

- Most Latin and Cyrillic languages run the text from left to right and top to bottom
- Arabic and Hebrew run the text from right to left and top to bottom
- Japanese is a special case

    - Japanese can run the text from right to left, top to bottom (tategaki (縦書き) style)
    - Japanese can also run from top to bottom **and** left to right (yokogaki (横書き) style)
    - Both writing modes for Japanese can be used in the same page

There are other languages and considerations but you get the idea.

But you can also use it for creative typographical effects that require CSS, not images or CSS translate, to accomplish the goal. A good, and subtle example is the "Rise To Success" text in the pen below:

<p data-height="511" data-theme-id="2039" data-slug-hash="ZBmwLo" data-default-tab="result" data-user="jensimmons" data-embed-version="2" data-pen-title="Writing Mode Demo — Article Subheadlines" class="codepen">See the Pen <a href="https://codepen.io/jensimmons/pen/ZBmwLo/">Writing Mode Demo — Article Subheadlines</a> by Jen Simmons (<a href="https://codepen.io/jensimmons">@jensimmons</a>) on <a href="https://codepen.io">CodePen</a>.</p>

<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

If you look at the CSS code in the embedded pen, you'll see the following code:

```css
h2 {
  writing-mode: vertical-rl;
  float: left;
  margin: 1.5rem 0 0 -3.8rem;
  font-size: 1.8em;
  background: #96e5fb;
  padding: 8px 0;
}
```

It's the `writing-mode: vertical-rl;` attribute that makes the text rotate while still allowing us to highlight it and keeping it in the document to be read by assistive technology.

![UN Website in Eglish](/images/2018/02/un-site-ar-1024x557.png) ![UN Website in Arabic](/images/2018/02/un-site-english-1024x541.png)

United Nations Website in English (top) and Arabic (bottom). Notice how they are mirrors of each other.

Jen wrote [an article](https://24ways.org/2016/css-writing-modes/) for 24 ways in 2016, where she provides a thorough explanation of writing modes and how to make them work on your projects, today.

## font-variant: Low Level Plumbing

CSS offers different levels of control over font features available from your font. The preferred way is to use individual `font-variant-*` attributes in a selector or use the shorthand `font-variant`.

Not all fonts provide all the features discussed in this section. As always research whether the chosen font or fonts have the features that you need.

This may be a good thing to include in your font specimen if you have one.

The code looks for the shorthand looks like this:

```css
body {
  font-variant: common-ligatures annotations() slashed-zero;
}
```

The different values for the property are:

normal

Specifies a normal font face; each of the longhand properties has an initial value of normal.

none

Sets the value of the [font-variant-ligatures](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-ligatures) to none and the values of the other longhand property as normal, their initial value.

<common-lig-values>, <discretionary-lig-values>, <historical-lig-values>, <contextual-alt-values>

Specifies the keywords related to the [font-variant-ligatures](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-ligatures) longhand property. The possible values are: common-ligatures, no-common-ligatures, discretionary-ligatures, no-discretionary-ligatures, historical-ligatures, no-historical-ligatures, contextual, and no-contextual.

stylistic(),  historical-forms, styleset(), character-variant(), swash(), ornaments(), annotation()

Specifies the keywords and functions related to the [font-variant-alternates](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates) longhand property.

small-caps, all-small-caps, petite-caps, all-petite-caps, unicase, titling-caps

Specifies the keywords and functions related to the [font-variant-caps](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-caps) longhand property.

<numeric-figure-values>, <numeric-spacing-values>, <numeric-fraction-values>, ordinal, slashed-zero

Specifies the keywords related to the [font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric) longhand property. The possible values are:  lining-nums, oldstyle-nums, proportional-nums, tabular-nums, diagonal-fractions, stacked-fractions, ordinal, and slashed-zero.

<east-asian-variant-values>, <east-asian-width-values>, ruby

Specifies the keywords related to the [font-variant-east-asian](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-east-asian) longhand property. The possible values are: jis78, jis83, jis90, jis04, simplified, traditional, full-width, proportional-width, ruby.

We can also use these variables individually. The individual names are:

- [font-variant-ligatures](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-ligatures)
- [font-variant-alternates](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates)
- [font-variant-caps](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-caps)
- [font-variant-numeric](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric)
- [font-variant-east-asian](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-east-asian)
- [font-variant-position](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-position)

The code using individual properties looks like this:

```css
body {
  font-variant-ligatures: common-ligatures;
  font-variant-alternates: historical-forms;
  font-variant-numeric: slashed-zero;
}

.japanese {
  font-variant-east-asian: ruby full-width jis83;
}

.small {
  font-variant-caps: small-caps;
}

.sup {
  font-variant-position: sub;
}

.super {
  font-variant-position: super;
}
```

## Performance: FontFace Observer and font-display

Whenever I need to make sure that a font has loaded before using it I work with [Fontface Observer](https://fontfaceobserver.com) to load the fonts with a good fallback and timeouts.

The process consists of the following sections:

- Font Loading
- Font Use
- Javascript Loader

We first define our fonts in CSS like normal. We use the same declarations as we do normally to load fonts.

```css
/* Regular font */
@font-face {
  font-family: 'notosans';
  src: url('../fonts/notosans-regular.woff2') format('woff2'), url('../fonts/notosans-regular.woff')
      format('woff'), url('../fonts/notosans-regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
/* Bold font */
@font-face {
  font-family: 'notosans';
  src: url('../fonts/notosans-bold.woff2') format('woff2'), url('../fonts/notosans-bold.woff')
      format('woff'), url('../fonts/notosans-bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
}
/* Italic Font */
@font-face {
  font-family: 'notosans';
  src: url('../fonts/notosans-italic.woff2') format('woff2'), url('../fonts/notosans-italic.woff')
      format('woff'), url('../fonts/notosans-italic.ttf') format('truetype');
  font-weight: normal;
  font-style: italic;
}
/* bold-italic font */
@font-face {
  font-family: 'notosans';
  src: url('../fonts/notosans-bolditalic.woff2') format('woff2'), url('../fonts/notosans-bolditalic.woff')
      format('woff'), url('../fonts/notosans-bolditalic.ttf') format('truetype');
  font-weight: 700;
  font-style: italic;
}
```

Next, we prepare three versions of the default element styles. One for when there is no Javascript (`body`), one for when the fonts fail to load (`.fonts-failed body`) and one for when the fonts load successfully (`.fonts-loaded body`). Only one of these body declarations will be used for the page.

```css
/* Default body style */
body {
  font-family: Verdana, sans-serif;
  font-size: 16px;
  line-height: 1.275;
  -webkit-text-decoration-skip: ink;
  -moz-text-decoration-skip: ink;
  -ms-text-decoration-skip: ink;
  text-decoration-skip: ink;
}

/*
    This will match if the fonts failed to load.
    It is identical to the default but doesn't
    have to be
*/
.fonts-failed body {
  font-family: Verdana, sans-serif;
  font-size: 16px;
  line-height: 1.375;
  -webkit-text-decoration-skip: ink;
  -moz-text-decoration-skip: ink;
  -ms-text-decoration-skip: ink;
  text-decoration-skip: ink;
}
/*
    This will match when fonts load successfully
*/
.fonts-loaded body {
  font-family: notosans-regular, verdana, sans-serif;
  font-size: 16px;
  line-height: 1.375;
  -webkit-text-decoration-skip: ink;
  -moz-text-decoration-skip: ink;
  -ms-text-decoration-skip: ink;
  text-decoration-skip: ink;
}
```

The final piece is the Javascript file that will actually load the fonts. This assumes that `fontfaceobserver.js` has already been loaded.

We first define a constant for each of the fonts we want to load. We use the same name but add a second attribute to the `FontFaceObserver` object to indicate additional information about the font (weight and style)

we assign `document.documentElement` to a variable that we will work with later in the script.

We add the class `fonts-loading` to document element as a temporary placeholder while we download the font.

Next, we use `promise.all` to create an array of promises with each font's load method. Promise.all is an atomic function, either they will all succeed or they will all fail. This will help us make sure that all fonts are available.

If the fonts are successful the `then` branch is followed. This branch will remove the `fonts-loading` class and replace it with `fonts-loaded`. This is the CSS class that uses the web font we just downloaded and it will only be used if the fonts loaded successfully.

If the fonts fail to load the script follows the `catch` path. This path replaces `fonts-loading` with `fonts-failed`. This CSS class doesn't use the web font and is essentially identical to the `body` element definition.

```javascript
const sans = new FontFaceObserver('notosans', {
  weight: normal,
  style: normal
});
const italic = new FontFaceObserver('notosans', {
  weight: normal,
  style: 'italic'
});
const bold = new FontFaceObserver('notosans', {
  weight: 700,
  style: 'normal'
});
const bolditalic = new FontFaceObserver('notosans', {
  weight: 700,
  style: 'italic'
});

let html = document.documentElement;

html.classList.add('fonts-loading');

Promise.all([sans.load(), bold.load(), italic.load() bolditalic.load()]).then(() => {
  html.classList.remove('fonts-loading');
  html.classList.add('fonts-loaded');
}).catch(() =>{
  html.classList.remove('fonts-loading');
  html.classList.add('fonts-failed');
});
```

Yes, this is more work but think about it. You're already loading the fonts and we could optimize the loader script to use only two elements (body and .fonts-loaded). The only new things we do is load `fontfaceobserver.js` and run our loader script.

Another thing we can add to `@font-face` declarations to speed up font loading resolution is the `font-display` rule. The rule tells browsers how would you like it to handle loading web fonts.

The possible values are:

- **auto**: The default. Typical browser font loading behavior will take place. This behavior may be FOIT or FOIT with a relatively long invisibility period. This may change as browser vendors decide on better default behaviors
- **swap**: Fallback text is immediately rendered in the next available system typeface in the font stack until the custom font loads, in which case the new typeface will be swapped in. This is what we want for stuff like body copy, where we want users to be able to read content immediately
- **block**: Like FOIT, but the invisibility period persists indefinitely. Use this value any time blocking rendering of text for a potentially indefinite period of time would be preferable. It's not very often that block would be preferable over any other value
- **fallback**: A compromise between **block** and **swap**. There will be a very short period of time (100ms [according to Google](https://developers.google.com/web/updates/2016/02/font-display?hl=en)) that text styled with custom fonts will be invisible. The unstyled text will then appear if the custom font hasn't loaded before the short blocking period has elapsed. Once the font loads, the text is styled appropriately. This is great when FOUT is undesirable, but accessibility is more important
- **optional**: Operates like **fallback** in that the affected text will initially be invisible for a short period of time, and then transition to a fallback if font assets haven't completed loading. The optional setting gives the browser freedom to decide whether or not a font should even be used, and this behavior depends on the user's connection speed. If you use this setting you should anticipate custom fonts may possibly not load at all

So, depending on the importance of the font to the layout and ease of reading of the site you can play with the different values for `font-display` to see how it affects your site. Since you're likely to have a high-speed connection and not throttle it, it's important to test the site in your target devices.

Loading a font using `@font-face` and `font-display` looks like this:

```css
@font-face {
  font-family: 'Ubuntu'; /* regular */
  src: url('Ubuntu-R-webfont.woff2') format('woff2'), url('Ubuntu-R-webfont.woff')
      format('woff'), url('Ubuntu-R-webfont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

I will not go into details on why testing on devices is important, I'll just leave you, again, with Alex Russell's video on web performance

<iframe width="560" height="315" src="https://www.youtube.com/embed/4bZvq3nodf4" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

One thing to keep in mind is that your fonts are subject to the web's [same origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy). This means that unless you configure your server with universal CORS access or you serve fonts from a CDN like Google Fonts or Typekit they will not load across different origin.

## HTTP2 and Preload

We can also tackle performance issues from the server side. I'm not talking about server-side rendering but to use HTTP/2.

HTTP2 allows several requests to use the same network connection, reducing the overhead of several individual requests significantly and makes inlining obsolete.

Browser support for HTTP/2 (and its predecessor SPDY) is excellent, so there’s no reason not to use HTTP/2.

We can preload resources from the server Using Apache as an example we preload assets when the browser loads index.html. We're preloading both **woff** and **woff2** fonts to make sure cover modern browsers that will support either version. If we must support older browsers we should also push the **ttf** version of the font.

```apacheconf
<If "%{DOCUMENT_URI} == '/index.html'">
  H2PushResource add css/site.css
  H2PushResource add js/site.js
  H2PushResource add font/font.woff2
  H2PushResource add font/font.woff
</If>
```

We can also customize what resources we push-based in the URI of the resource. In the following example each time we match a URI we will load specific assets for that file and nothing else. We could also have a wildcard match that will load assets needed by **all** pages and use the system below for page specific assets.

```apacheconf
<if "%{DOCUMENT_URI} == '/portfolio/index.html'">
  H2PushResource add /css/dist/critical-portfolio.css?01042017
</if>

<if "%{DOCUMENT_URI} == '/code/index.html'">
  H2PushResource add /css/dist/critical-code.css?01042017
</if>
```

Nginx also allows you to push resources to the browser. The same examples reworked for Nginx. The first one will preload a set of resources.

```nginx
server {
  location = /index.html {
    http2_push /css/style.css;
    http2_push /js/main.js;
    http2_push font/font.woff2;
    http2_push font/font.woff;
  }
}
```

And the second example pushing assets depending on the page we're trying to access:

```nginx
location = /portfolio/index.html {
  http2_push /css/dist/critical-portfolio.css?01042017;
}

location = /code/index.html {
  http2_push /css/dist/critical-code.css?01042017;
}
```

If you don't have access to your server's configuration, don't want to depend on manually updating the cache busting string you can do the preload from the client side using link elements with the `preload` attribute.

```html
<link rel="preload" href="https://example.com/fonts/font.woff2"
  as="font" crossorigin type="font/woff2">
<link rel="preload" href="https://example.com/fonts/font.woff"
  as="font" crossorigin type="font/woff">
<link rel="preload" href="https://example.com/css/main.css"
  as="style" crossorigin type="text/css">
<link rel="preload" href="https://fonts.example.com/js/site.js"
  as="script" crossorigin type="text/javascript">
```

The attributes of the link are:

- **rel** - the type of link it is. In this case, the value is `preload`
- **href** – the URL to preload
- **as** – the destination of the response. This means the browser can set the right headers and apply the correct CSP policies.
- **crossorigin** – Optional. Indicates that the request should be a CORS request. The CORS request will be sent without credentials unless you add `crossorigin="use-credentials"` to the link
- **type** – Optional. Allows the browser to ignore the preload if the provided MIME type is unsupported.

I discuss link preloading along with other HTTP2 resource pushing and preloading strategies in [HTTP/2 Server Push, Link Preload And Resource Hints](https://publishing-project.rivendellweb.net/http2-server-push-link-preload-and-resource-hints/)

## Service Worker Support

Service Workers are the core of progressive web applications. They work as a reverse network proxy that intercepts requests for your site and performs actions based on its configuration. I've written about service workers [on my blog](https://publishing-project.rivendellweb.net/?s=service+worker) before so I won't go into detail.

I will use [workbox.js](https://developers.google.com/web/tools/workbox/next/) version 3, currently in beta, to illustrate how to cache fonts. You will most definitely want to add additional routes and caching strategies for your site.

At the root of your site use the following snippet inside a script tag to register the service worker.

We test if the `navigator` object has a serviceWorker method. If it does it means that Service Workers are supported and we can register it. If it doesn't then Service Workers are not supported and we bail accordingly.

Registering the Service Worker means that it'll work for all pages under its scope but not above it (This is why we put the service worker at the root of the application).

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(function(registration) {
      console.log(
        'Service Worker registration successful with scope: ',
        registration.scope
      );
    })
    .catch(function(err) {
      console.log('Service Worker registration failed: ', err);
    });
}
```

The actual Service Worker script is fairly simple.

We import `workbox-sw`, the core of our Service Worker.

We check if Workbox loaded successfully and if it does then we register a route matching all possible font types and create a custom cache using a cache-first strategy (check the cache and if the resource is not there then fetch it from the network).

The cache will store 10 fonts for 30 days (as indicated in `maxEntries` and `maxAgeSeconds`). If more than 10 fonts are added the oldest will be removed first.

```javascript
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.0.0-beta.0/workbox-sw.js '
);

if (workbox) {
  workbox.routing.registerRoute(
    /.*\.(?:woff2,woff,ttf,otf,eot)/,
    workbox.strategies.cacheFirst({
      cacheName: 'font-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 10,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  );
} else {
  console.log(`Boo! Workbox didn't load`);
}
```

Using a Service Worker to cache fonts using this method means that fonts will be loaded from cache in second and subsequent visits and when the browser is offline or connectivity is unreliable.

We could have precached the fonts but that would remove the possibility of customizing the cache. The size of fonts may also impact how long does it take to precache resources and the whole idea of precaching is to make the first load of the page work fast.

For more information, check Workbox 3 [documentation](https://developers.google.com/web/tools/workbox/next/).

## Links and Resources

- General Information

    - [What Is Beautiful Typography](https://helenvholmes.com/writing/type-is-your-right)
    - [The Experimental Layout Lab of Jen Simmons](http://labs.jensimmons.com/)
    - [Fonts and Layout for Global Scripts](https://simoncozens.github.io/fonts-and-layout/)
- Typography

    - [How to use @font-face to avoid faux-italic and bold browser styles](https://spaceninja.com/2010/11/29/font-face-faux-styles/)
    - [Say No to Faux Bold](http://alistapart.com/article/say-no-to-faux-bold)
- System Fonts

    - [Shipping system fonts to GitHub.com](http://markdotto.com/2018/02/07/github-system-fonts/)
    - [Using UI System Fonts In Web Design: A Quick Practical Guide](https://www.smashingmagazine.com/2015/11/using-system-ui-fonts-practical-guide/)
    - [OS Specific Fonts in CSS](https://css-tricks.com/os-specific-fonts-css/)
    - [System Font Stack](https://css-tricks.com/snippets/css/system-font-stack/)
    - [Implementing system fonts on Booking.com — A lesson learned](https://booking.design/implementing-system-fonts-on-booking-com-a-lesson-learned-bdc984df627f)
- Choosing your font stack

    - [Choosing Web Fonts: A Beginner’s Guide](https://design.google/library/choosing-web-fonts-beginners-guide/?utm_source=frontendfocus&utm_medium=email)
    - [Font Family Reunion](http://fontfamily.io/)
    - [Font style matcher](https://meowni.ca/font-style-matcher/)
- `font-variant-*`

    - [font-variant-\* at MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant)
- Performance

    - [A Comprehensive Guide to Font Loading Strategies](https://www.zachleat.com/web/comprehensive-webfonts/)
    - [3 Tips for Faster Font Loading](https://calendar.perfplanet.com/2017/3-tips-for-faster-font-loading/)
    - [https://css-tricks.com/font-display-masses/](https://css-tricks.com/font-display-masses/)
- Media Queries

    - [Using Media Queries For Responsive Design In 2018](https://www.smashingmagazine.com/2018/02/media-queries-responsive-design-2018/)
- HTTP2

    - [Specification](http://http2.github.io/http2-spec/index.html)
    - [Wikipedia Entry](https://www.wikiwand.com/en/HTTP/2)
    - [Can I Use HTTP2](https://caniuse.com/#search=http2)
- Service Workers

    - [The offline cookbook](https://jakearchibald.com/2014/offline-cookbook/)
    - Jeremyt Keith's [My first Service Worker](https://adactio.com/journal/9775)
    - [Making Resilient Web Design work offline](https://adactio.com/journal/11730)
    - [Service Worker notes](https://adactio.com/journal/10186)
    - [Making A Service Worker: A Case Study](https://www.smashingmagazine.com/2016/02/making-a-service-worker/)
    - [Workbox 3 Beta](https://developers.google.com/web/tools/workbox/next/)
- Variable fonts

    - [How to use variable fonts in the real world](https://medium.com/clear-left-thinking/how-to-use-variable-fonts-in-the-real-world-e6d73065a604)
    - [Typographic Potential of Variable Fonts](http://www.alphabettes.org/responsive-variable-fonts/)
    - [Variable Fonts on the Web](https://webkit.org/blog/7051/variable-fonts-on-the-web/)
    - [Variable fonts for the win!](https://publishing-project.rivendellweb.net/variable-fonts-for-the-win/)
    - [Variable Fonts Demo and Explainer](https://caraya.github.io/vfonts-demo/)
    - [How to use variable fonts in the real world](https://css-tricks.com/use-variable-fonts-real-world/)
    - [How to use variable fonts in the real world](https://medium.com/clear-left-thinking/how-to-use-variable-fonts-in-the-real-world-e6d73065a604)
    - [One File, Many Options: Using Variable Fonts on the Web](https://css-tricks.com/one-file-many-options-using-variable-fonts-web/)
    - Variable fonts [Codepen demos](https://codepen.io/collection/DwgRyd/) by Jason Pamental
    - Variable fonts [Codepen demos](https://codepen.io/collection/XqRLMb/) by Mandy Michael
    - [New variable fonts from Adobe Originals](https://blog.typekit.com/2017/10/19/new-variable-fonts-from-adobe-originals/)
- Document Order and Visual Order

    - [HTML Source Order vs CSS Display Order](http://adrianroselli.com/2015/10/html-source-order-vs-css-display-order.html)
    - [WCAG C27: Making the DOM order match the visual order](https://www.w3.org/TR/WCAG20-TECHS/C27.html)
    - [A Few Different CSS Methods for Changing Display Order](https://webdesign.tutsplus.com/tutorials/a-few-different-css-methods-for-column-ordering--cms-27079)
- Font Subsetting

    - [unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range) CSS descriptor
    - [Unicode Character Ranges](http://jrgraphix.net/r/Unicode/)
    - [How to subset fonts with unicode-range](https://www.nccgroup.trust/uk/about-us/newsroom-and-events/blogs/2015/august/how-to-subset-fonts-with-unicode-range/)
    - [Creating Custom Font Stacks with Unicode-Range](https://24ways.org/2011/creating-custom-font-stacks-with-unicode-range/)
- Font Specimens

    - [Real Web Type in Real Web Context](http://alistapart.com/article/real-web-type-in-real-web-context)
- Books

    - Tim Brown, [Combining Typefaces](https://blog.typekit.com/2016/04/29/combining-typefaces-free-guide-to-great-typography/)
    - Cyrus Highsmith, [Inside Paragraphs](http://insideparagraphs.com/)
    - Jason Santa Maria, [On Web Typography](https://abookapart.com/products/on-web-typography)
    - Robert Bringhurst, [The Elements of Typographic Style](https://www.amazon.com/Elements-Typographic-Style-Version-Anniversary/dp/0881792128)
    - Bram Stein, [Webfont Handbook](https://abookapart.com/products/webfont-handbook)
    - Richard Rutter, [Web Typography](http://book.webtypography.net/)
    - Richard Rutter, [The Elements of Typographic Style Applied to the Web](http://webtypography.net/)
    - Donny Truong, [Professional Web Typography](https://prowebtype.com/)

## Credits

Some material is taken from MDN created by Mozilla Contributors and licensed under a Creative Commons [Attribution-ShareAlike 2.5 Generic](http://creativecommons.org/licenses/by-sa/2.5/) license.

Material taken from CSS-Tricks used according to their [license](https://css-tricks.com/license/).

Content in HTTP2 Push taken from Jake Archibald's site ([H2 Push is tougher than I thought](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/)), from Smashing Magazine ([A Comprehensive Guide To HTTP/2 Server Push](https://www.smashingmagazine.com/2017/04/guide-http2-server-push/)) and Filament Group's site ([Modernizing our Progressive Enhancement Delivery](https://www.filamentgroup.com/lab/modernizing-delivery.html)).

Content from [The Elements of Typographic Style Applied to the Web](http://webtypography.net/) by Richard Rutter used under a Creative Commons [Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/) License

Content from Google Web Fundamentals is licensed under a [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/). Code samples are licensed under the [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0) License.
