---
title: "Design for the lower end of the spectrum: Part 3"
date: "2018-09-17"
---

## Ideas for client-side

So how do we address some problems of the web? There are aspects that go beyond PWAs and contribute to the bloat of the web and, I would imagine, the large size of apps.

For each of the problems listed in the _Developer Facing Problems_ there is a solution that will work whether we use a build system or not. I avoided build system-based solutions as I don't want to give the impression that a build system is required, just the extra effort of running the apps either locally or in the cloud.

### Image sizes and download times

A solution for image sizes passes through [responsive images](https://responsiveimages.org/) (either picture or srcset) and image compression with tools like `imagemin`.

We don't need to send the same high DPI retina image to all browser; we can choose what type of image to send and browsers are smart enough to know which one to use for each browser and screen size (if we set them up correctly).

This is what a responsive image looks like:

```html
<img src="small.jpg"
     srcset=" large.jpg 1024w,
              medium.jpg 640w,
              small.jpg 320w"
     alt="A rad wolf">
```

Both srcset, nd sizes (a related specification) are part of the [HTML specification](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-srcset) and is [supported in all major browsers](https://caniuse.com/#search=srcset) so there should be no problem in using it across devices. If a browser doesn't understand the `srcset` attribute it will just use `src` like any browser did until we got responsive images... they will get something, not just the optimized version of the image we wanted to give them.

[Cloudinary](https://cloudinary.com/) has made available a [Responsive Image Generator](http://www.responsivebreakpoints.com/) that allows you to create responsive images and their corresponding CSS styles in the cloud and then download it to use it on your project during development.

### Javascript issues

Problems with Javascript size and download time can be solved by bundling content and using tools like [Webpack](https://webpack.js.org/) or [Rollup](https://webpack.js.org/) to create and bundle, split into smaller pieces, tree shake the result so it'll only use what is actually needed, and load only assets for a specific page or route (lazy loading).

If we send large bundles down to the users, it'll take a while to parse the code we send. This will not hurt our high-end devices but it will be much longer for mid and lower-end phones we're likely to see in rural areas or for people who can't afford the latest and greatest.

[![](https://publishing-project.rivendellweb.net/wp-content/uploads/2018/09/time-to-download-1mb-js.jpg)](https://publishing-project.rivendellweb.net/wp-content/uploads/2018/09/time-to-download-1mb-js.jpg)

[Parse times](https://docs.google.com/spreadsheets/d/1wHcNNQea28LhwQ_amFamT33d5woVrJfJy53Z1k6V090/edit?usp=sharing) for a 1MB bundle of JavaScript across desktop & mobile devices of differing classes. From [JavaScript Start-up Performance](https://medium.com/reloading/javascript-start-up-performance-69200f43b201) by Addy Osmani.

Mid and Lower level devices in other countries may be different and have different specs, usually less powerful than what we normally see.

### Meeting users where they are: using their language

We can also provide content in the users' target language and take advantage of technologies that have been on the web for a while. Web fonts used responsibly and with proper fallbacks, give you a device independent way to give users content in the language they use every day without major changes to the structure of your CSS.

First declare the language in the root element of your page, usually `html`:

```html
<!-- provides a default language -->
<html lang="en-US" dir="ltr">
```

and later in the document, we add content in traditional Chinese, like this:

```html
<!-- Later in the document -->
<p lang="zh-Hans">朋消然，地正成信青約屋角來邊還部下賽清受光可，綠不女外！
權來星加智有花個費主母：機爭理陸行吃洋然答辦清大旅動節活性眼還起就情相蘭要運見……
都靜內率機足轉</p>
```

We can use the following CSS to indicate what fonts we want to use for each case. We can go further and indicate multiple language fonts for different versions or dialects of the language. In this case, we've indicated different fonts for traditional and simplified Chinese characters.

```css
body {
  font-family: "Times New Roman", serif;
}

:lang(zh-Hant) {
  font-family: Kai, KaiTi, serif;
}

:lang(zh-Hans) {
  font-family: DFKai-SB, BiauKai, serif;
}
```

You can also use attribute selectors that exactly match the value of a language attribute (`[lang = "..."]`) or one that only matches the beginning of the value of a language attribute (`lang |= "..."]`).

```html
<p lang="en-uk">Content written in British English</p>
<p lang="en-au">G'Day Mate</a>
<p lang="es">Buenos días</a>
<p lang="es-cl">Hola</a>
```

```css
*[lang="en-uk"] {
  color: white;
  background: black
}

*[lang="es-cl"] {
  color: white;
  background: rebeccapurple;
}

*[lang|="es"] {
  text-align: end;
}
```

Finally, you can always create classes for the languages that you want to use and add them to the elements using that language.

```css
.en-uk {
  color: white;
  background: black
}

.es-cl {
  color: white;
  background: rebeccapurple;
}

.es {
  text-align: end;
}
```

There's another aspect of working with non-latin, non-western languages: writing direction.

If you've seen Hebrew or Arabic text you'll notice that is written in the opposite direction than English: right to left, top to bottom.

There are other languages that write top to bottom, and either left to right or right to left.

There is CSS that will make vertical languages is not hard but it's not something that we're used to seeing in most western content.

```html
<div class="japanese-vertical">
  <p>こいけそ個課チクテャあえむ派たケトリネちたつよめ'
  ねかへゆと都ヌミニセメ無かカルウャ「ウつ巣根都阿瀬個そ」
  るるうほさフソメふ毛さ名ゃみゃ日シセウヒニウっれ根離名屋エコネヌ。
  こっつろてとねつぬなつさそやほっツカトル夜知め鵜舳屋遊夜鵜区せすの
  ぬ雲るきな屋素夜差っメケセア都毛阿模模派知ンカシけか瀬
  列野毛よいーソコ区屋ろぬゅき</p>
</div>
```

```css
.japanese-vertical {
  writing-mode: vertical-rl;
}
```

You can see an example combining Latin and Japanese text in this [demo page](https://caraya.github.io/grid-experiments/demo17.html)

Depending on your target audiences and the languages they use, this may be all you need to do. But there are other languages that use different directions and vertical alignments.

The first step, always, is to localize your UI but the localizing the content is not too far away.

## Conclusion: Where do we go from here?

Perhaps the hardest part is to move away from a one size fits all model and ask ourselves the question: "Does the web work well for what I'm trying to do?"

Think about it... the web has no app store and no install friction. All that your users need is visit the URL in a browser that supports the PWA technologies, and voila, they are using a PWA and using the technologies without having to do anything else but use their web browser. When they have engaged with the app enough times they can install it to the device (desktop or mobile) without having to follow the app store procedure and update the app with a large download every time the developer makes changes.

Once they are there the APIs that make up a PWA give you features that look like native but work on the browser and make the experience better for all your users, not just those on mobile connections.

And you're not required to use all the APIs that make a PWA. For example, in my [Layout experiments](https://caraya.github.io/grid-experiments/) I chose to implement a service worker to make sure that users get a consistent experience after their first visit without using a manifest or any other PWA API or technology.

I'm not saying not to implement native applications but to evaluate your target audience and requirements before deciding if web or native is better for your application and your objectives.

And, whether you decide the web is best for your project or not, you owe it to your users to optimize your content as much as possible.

## Links, References, Tools

- Mobile connectivity, devices, and chipsets
    
    - [The Mobile Economy 2018](https://www.gsma.com/mobileeconomy/)
    - [The all-mighty chipset](https://www.gsmarena.com/mobile_chipset_guide-review-1561p2.php)
    - [Chipset performance charts](https://www.gsmarena.com/mobile_chipset_guide-review-1561p4.php)
    - [What’s Inside My Smartphone? — An In-Depth Look At Different Components Of A Smartphone](https://fossbytes.com/whats-inside-smartphone-depth-look-parts-powering-everyday-gadget/)
    - [Why smartphones overheat, and how to stop it](https://www.androidpit.com/phone-overheating)
- Social aspects
    
    - [World Wide Web, Not Wealthy Western Web (Part 1)](https://www.smashingmagazine.com/2017/03/world-wide-web-not-wealthy-western-web-part-1/)
    - [World Wide Web, Not Wealthy Western Web (Part 2)](https://www.smashingmagazine.com/2017/03/world-wide-web-not-wealthy-western-web-part-2/)
    - [New Broadband Pricing Data: What does it cost to purchase 1GB of mobile data?](https://a4ai.org/broadband-pricing-data-2017/)
    - [Mobile Broadband Data Costs (2016)](https://a4ai.org/mobile-broadband-pricing-data/)
    - [Understanding Low Bandwidth and High Latency](https://developers.google.com/web/fundamentals/performance/poor-connectivity)
- Design
    
    - [Beyond Desktop Research: The Immersion Trip](https://design.google/library/beyond-desktop-research-immersion-trip/)
    - [Global UX Speaker Series](https://www.youtube.com/playlist?list=PLJ21zHI2TNh8UjaNYMR4BP98t26NBT2VL) Youtube playlist
    - [Why mobile page speed is a Visual Designer's problem](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/industry-perspectives/why-mobile-page-speed-is-visual-designers-problem/)
    - [Making websites that work well on Opera Mini](https://dev.opera.com/articles/making-sites-work-opera-mini/)
    - Internationalization
    - [Better together: Displaying Japanese and English text on the web](http://www.nobadmemories.com/blog/2017/04/better-together-displaying-japanese-and-english-text-on-the-web/)
    - [W3C Internationalization (I18n) Activity](https://www.w3.org/International/)
        
        - [Internationalization techniques: Authoring HTML & CSS](https://www.w3.org/International/techniques/authoring-html.en?open=style&open=langstyle)
        - [Text Layout Requirements for the Arabic Script](https://www.w3.org/TR/2018/WD-alreq-20180222/)
        - [Language tags in HTML and XML](https://www.w3.org/International/articles/language-tags/)
        - [Introducing Character Sets and Encodings](https://www.w3.org/International/getting-started/characters)
        - [Character encodings: Essential concepts](https://www.w3.org/International/articles/definitions-characters/)
- Tools
    
    - Code bundling and tree shaking
    - [Webpack](https://webpack.js.org/)
    - [Rollup](https://webpack.js.org/)
    - Trimming CSS
    - [UnCSS](https://github.com/uncss/uncss)
    - Responsive Images
    - [Responsive Image Breakpoints Generator](https://www.responsivebreakpoints.com/)
    - [Push-button Art Direction with Cloudinary’s Responsive Image Breakpoints Generator](https://cloudinary.com/blog/push_button_art_direction_with_cloudinary_s_responsive_image_breakpoints_generator#comment-2973863753)
    - Service Worker
    - [Workbox.js](https://developers.google.com/web/tools/workbox/)
- So what do we do?
    
    - [Why Performance Matters](https://developers.google.com/web/fundamentals/performance/why-performance-matters/)
    - Google [PWA Case Studies](https://developers.google.com/web/showcase/tags/progressive-web-apps)
    - Google PWA Checklist
    - [Baseline](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
    - [Exemplary](https://developers.google.com/web/progressive-web-apps/checklist#exemplary)
