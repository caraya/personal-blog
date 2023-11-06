---
title: "DevTools Code coverage"
date: "2017-07-03"
---

This feature is only available in Chrome 59 and later

I use [Critical](https://github.com/addyosmani/critical) to create and inline the CSS for [above the fold](https://www.optimizely.com/optimization-glossary/above-the-fold/) content of a page and [UNCSS](https://github.com/giakki/uncss) to remove any unnecessary CSS for these web pages.

This is important because in large or long-lasting projects there may be CSS that is no longer needed in a page or the whole site and it hasn't been removed out of laziness or because the people who oringally created the CSS are no longer available and sometims developers, myself included, think that if we don't use the content it won't be downloaded.

Since Chrome 59 DevTools offers a coverage tool that will tell you how much of your CSS is used in a given page. This may help you decide if you should use Critical to inline that CSS on the page or UnCSS to remove the unused CSS rules and selectors from your CSS stylesheets.

![Where is the coverage panel item](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/coverage-menu-location)

To use the coverage tool, open DevTools open the tools menu in the far right corner of the DevTools GUI, select `More Tools` and from the submenu select `Coverage`.

The one decision that the coverage panel doesn't help with is how to work on the coverage of external scripts. We can still tell how much of the script is unused you can't really integrate it to your own bundled script without risk of loosing any updates the vendor makes.
