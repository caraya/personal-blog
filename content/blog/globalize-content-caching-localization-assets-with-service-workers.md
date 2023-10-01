---
title: "Globalize Content: Caching localization assets with service workers"
date: "2017-12-18"
---

Since we've already used Webpack to build our localization assets it's easy to use [Workbox.js](https://developers.google.com/web/tools/workbox/) to precache assets using a service worker.

```javascript
const webpack = require( "webpack" );
const CommonsChunkPlugin = require( "webpack/lib/optimize/CommonsChunkPlugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const GlobalizePlugin = require( "globalize-webpack-plugin" );
const nopt = require( "nopt" );
const path = require('path');
const workboxPlugin = require('workbox-webpack-plugin');

const DIST_DIR = 'dist';

const options = nopt({
  production: Boolean
});

module.exports = {
  entry: options.production ?  {
    main: "./app/index.js",
    vendor: [
      "globalize",
      "globalize/dist/globalize-runtime/number",
      "globalize/dist/globalize-runtime/currency",
      "globalize/dist/globalize-runtime/date",
      "globalize/dist/globalize-runtime/message",
      "globalize/dist/globalize-runtime/plural",
      "globalize/dist/globalize-runtime/relative-time",
      "globalize/dist/globalize-runtime/unit"
    ]
  } : "./app/index.js",
  debug: !options.production,
  output: {
    path: options.production ? "./dist" : "./tmp",
    publicPath: options.production ? "" : "http://localhost:8080/",
    filename: options.production ? "app.[hash].js" : "app.js"
  },
  resolve: {
    extensions: [ "", ".js" ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      production: options.production,
      template: "./index-template.html"
    }),
    new GlobalizePlugin({
      production: options.production,
      developmentLocale: "en",
      supportedLocales: [ "ar", "de", "en", "es", "pt", "ru", "zh" ],
      messages: "messages/[locale].json",
      output: "i18n/[locale].[hash].js"
    }),
    new webpack.optimize.DedupePlugin(),
    new CommonsChunkPlugin( "vendor", "vendor.[hash].js" ),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
    }
    new workboxPlugin({
      globDirectory: dist,
      globPatterns: ['**/*.{html,css,js}'],
      swDest: path.join(dist, 'sw.js'),
      clientsClaim: true,
      skipWaiting: true,
    })
  ] : [] )
};
```

Because Workbox will cache all the assets for our application we want to make sure it's the last plugin to run as part of the build process. Otherwise, we may not get the assets we've processed in the way we want them.

Also, because we're caching assets in the service worker cache we've eliminated the concatenation step; this way if we make changes we only invalidate single files rather than entire bundles.

If you serve your content with HTTP2 it may work better if you serve smaller files rather than a few big ones.

Last Detail. If you want finer control over what assets get precached, adjust the values in the `globPatterns` attribute of the `workboxPlugin` to match what you need to cache.

## Handling content for multiple languages

The Google Search Console Help article: [Multi-regional and multilingual sites](https://support.google.com/webmasters/answer/182192?hl=en) defines multilingual and multi-regional websites as follows:

A **multilingual website** is any website that offers content in more than one language. Examples of multilingual websites might include a Canadian business with an English and a French version of its site, or a blog on Latin American soccer available in both Spanish and Portuguese.

A **multi-regional** website is one that explicitly targets users in different countries. Some sites are both multi-regional and multilingual (for example, a site might have different versions for the USA and for Canada, and both French and English versions of the Canadian content).

They go on to explain support strategies for both sites and how to best leverage your content and Google's crawler to serve multiple languages.

## Links and Resources

- Globalize
    
    - [Github Repo](https://github.com/globalizejs/globalize)
    - [CLDR](http://cldr.unicode.org/)
    - [ICU](http://site.icu-project.org/)
- Messageformat
    
    - [Github Repo](https://messageformat.github.io/)
- [Google Internationalization (i18n)](https://developers.google.com/international/)
- Noto Fonts
    
    - [Noto Fonts Download](https://www.google.com/get/noto/)
    - [Github Repository](https://github.com/googlei18n/noto-fonts)
    - [Guidelines for Using Noto](https://www.google.com/get/noto/help/guidelines/)
- [i18n vs l10n — what’s the diff?](https://blog.mozilla.org/l10n/2011/12/14/i18n-vs-l10n-whats-the-diff/)
- [W3C i18n Activity](https://www.w3.org/International)
