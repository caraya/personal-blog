---
title: "How many people actually browse your site without Javascript?"
date: "2018-04-30"
---

In reading [Measuring the Hard-to-Measure](https://csswizardry.com/2018/03/measuring-the-hard-to-measure/) I found his idea to track how many people are actually browsing your site without Javascript. It's this little image inside a `noscript` element.

```markup
<noscript>
  <img src="/pixels/no-js.gif" alt="" />
</noscript>
```

The idea behind it is that this will only trigger if Javascript is not enabled in the browser visiting the page and then you can use your analytics and server logs to track how many people got the no-script pixel beacon and customize your content accordingly.
