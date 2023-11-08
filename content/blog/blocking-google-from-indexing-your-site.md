---
title: "Blocking Google from indexing your site"
date: "2022-12-14"
---

There are times when you don't want Google search to index specific pages on your site. It may be because these are private pages that, for some reason, are not password protected; or the site needs to be available to the client during development and you don't want to put it behind a password.

This post will present two ways of blocking Google crawlers from indexing your site: server response headers and client-side `meta` tags.

## Using Server Response Headers

The easiest way to add the headers is to do so in your server configuration. To disable search engine indexing globally you can add the following header to your server's configuration.

```text
X-Robots-Tag: noindex
```

The specific way of doing this will depend on what server you're running.

For Apache servers, make sure that `mod_headers` is installed.

Headers can be added in the following places:

* The default server configuration
  * Adding it here makes the header global
* Virtual host configuration
* Directory
* Location

The header that will prevent Google from indexing is:

```apache
Header set X-Robots-Tag: "noindex"
```

Nginx setup is a little more complex.

`add_header` adds the specified field to a response header provided that the response code equals one of the following codes:

* 200
* 201
* 204
* 206
* 301
* 302
* 303
* 304
* 307
* 308

`add_header` directives are inherited from the previous configuration level if and only if there are no add\_header directives defined on the current level.

If the optional `always` parameter is specified, the header field will be added regardless of the response code.

`add_header` can be added in the following contexts: http, server, location, if (when inside a location, but see [If is Evil… when used in location context](https://www.nginx.com/resources/wiki/start/topics/depth/ifisevil/))

```nginx
add_header X-Robots-Tag: "noindex";
```

## Using meta tags

If you have access to the server and are comfortable changing the configuration, then please use it. It's one less thing to remember and it'll work better in the long run.

But developers don't always have access to the server or are not comfortably changing the server's configuration.

We can still prevent indexing using `meta` tags in the head of the pages we want to crawlers to skip.

To prevent most search engines from indexing a page on your site, place the following meta tag into the `head` section of your page:

```html
<meta name="robots" content="noindex">
```

To prevent only Google web crawlers from indexing a page:

```html
<meta name="googlebot" content="noindex">
```

Note that `googlebot` is the name of the Google search engine crawler. It is not the only crawler that Google uses to crawl your content.

## So what Google crawler do we want to stop indexing our content?

Google uses multiple crawlers to navigate through your content. Most website developers and owners only deal with the [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot), the main Google crawler, and, usually, this is fine.

However, there may be times when there are specific kinds of items that you want to block without affecting the basic Googlebot settings.

| Name | User Agent Token | Full User Agent String | Notes |
| --- | --- | --- | --- | --- |
| [APIs-Google](https://developers.google.com/search/docs/crawling-indexing/apis-user-agent) | APIs-Google | APIs-Google (+https://developers.google.com/webmasters/APIs-Google.html) | |
| AdsBot Mobile Web Android | AdsBot-Google-Mobile| Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html) | **AdsBot Mobile Web Android ignores the `*` wildcard**.<br /><br />Checks Android web page ad quality.|
| AdsBot Mobile Web | AdsBot-Google-Mobile | Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1 (compatible; AdsBot-Google-Mobile; +http://www.google.com/mobile/adsbot.html) | **AdsBot Mobile Web ignores the * wildcard**.<br /><br />Checks iPhone web page ad quality.
| | AdsBot-Google | AdsBot-Google (+http://www.google.com/adsbot.html) | **AdsBot ignores the * wildcard**.<br /><br />Checks desktop web page ad quality. |
| [AdSense](https://support.google.com/adsense/answer/99376) | Mediapartners-Google | Mediapartners-Google | The AdSense crawler visits your site to determine its content in order to provide relevant ads. Ignores the global user agent (*) in robots.txt. |
| Googlebot Image | Googlebot-Image<br /><br />Googlebot |Googlebot-Image/1.0 | Used for crawling image bytes for Google Images and products dependent on images. |
| Googlebot News | Googlebot-News<br /><br />Googlebot | The Googlebot-News user agent uses the various Googlebot user agent strings. | Googlebot News uses Googlebot for crawling news articles, however it respects its historic user agent token Googlebot-News. |
| Googlebot Video | Googlebot-Video<br /><br />Googlebot |Googlebot-Video/1.0 | Used for crawling video bytes for Google Video and products dependent on videos. |
| [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot) Desktop | Googlebot | Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)<br /><br />Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36<br /><br />Googlebot/2.1 (+http://www.google.com/bot.html) | |
| [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot) Smartphone | Googlebot | Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/W.X.Y.Z Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html) | |
| [Mobile AdSense](https://support.google.com/adsense/answer/99376) | Mediapartners-Google | (Various mobile device types) (compatible; Mediapartners-Google/2.1; +http://www.google.com/bot.html) | |
| [Feedfetcher](https://developers.google.com/search/docs/crawling-indexing/feedfetcher) | FeedFetcher-Google | FeedFetcher-Google; (+http://www.google.com/feedfetcher.html) | **Caution: Feedfetcher doesn't respect robots.txt rules**.
| [Google Read Aloud](https://developers.google.com/search/docs/crawling-indexing/read-aloud-user-agent) | Google-Read-Aloud | Current agents:<br /><br /> Desktop agent:<br /><br />Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36 (compatible; Google-Read-Aloud; +https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)<br /><br />Mobile agent:<br /><br />Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36 (compatible; Google-Read-Aloud; +https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)<br /><br />Former agent (deprecated):<br /><br />google-speakr | **Caution: Google Read Aloud doesn't respect robots.txt rules.** |
| Google StoreBot | Storebot-Google | Desktop agent:<br /><br />Mozilla/5.0 (X11; Linux x86_64; Storebot-Google/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36<br /><br />Mobile agent:<br /><br />Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012; Storebot-Google/1.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36 | |
| Google Site Verifier | Google-Site-Verification |Mozilla/5.0 (compatible; Google-Site-Verification/1.0) | Caution: Google Site Verifier ignores robots.txt rules. |

In conclusion. Yes, it is possible to prevent crawlers in general and Google crawlers in particular from indexing your site and showing them in your results.

However, I'm not certain how long it'll take for the crawler to index your site after you remove the meta tag or the response header if it will do it at all.

## Links and Resources

* [Robots meta tag, data-nosnippet, and X-Robots-Tag specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
* [Block Search indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
* [Overview of Google crawlers (user agents)](https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)
* [Googlebot](https://developers.google.com/search/docs/crawling-indexing/googlebot). Google's main search crawler
