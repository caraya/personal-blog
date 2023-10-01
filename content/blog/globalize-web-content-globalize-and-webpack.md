---
title: "Globalize Web Content: Globalize and Webpack"
date: "2017-12-13"
templateEngineOverride: false
---

### Adding Webpack to the mix

The second example is more complex and uses Globalize, the CLDR data files, IANA timezone data and Webpack specific tools, including a custom `globalize-webpack-plugin`.

The first component is the `package.json` file that will tell NPM what packages and versions to install and what commands to run. If you're familiar with Webpack the commands in the script commands should look familiar.

```javascript
{% raw %}
{
  "private": true,
  "devDependencies": {
    "cldr-data": ">=25",
    "globalize": "^1.3.0",
    "globalize-webpack-plugin": "0.4.x",
    "html-webpack-plugin": "^1.1.0",
    "iana-tz-data": "^2017.1.0",
    "nopt": "^3.0.3",
    "webpack": "^1.9.0",
    "webpack-dev-server": "^1.9.0"
  },
  "scripts": {
    "start": "webpack-dev-server --config webpack-config.js \
    --hot --progress --colors --inline",
    "build": "webpack --production --config webpack-config.js"
  },
  "cldr-data-urls-filter": "(core|dates|numbers|units)"
}
{% endraw %}
```

`webpack-config.js` build the Webpack side of the equation. It requires the packages needed, configures Webpack and specifies the bunldes to build:

1. `vendor`, which holds Globalize Runtime modules and other third-party libraries
2. `i18n precompiled data`, which means the minimum yet sufficient set of precompiled i18n data that your application needs (one file for each supported locale)
3. `app`, which means your application code. Also, note that all the production code is already minified using UglifyJS.

The configuration uses **[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)** to populate links and names for our HTML template file (discussed later) and **[globalize-webpack-plugin](https://github.com/rxaviers/globalize-webpack-plugin)** to handle generating the Globalize bundles.

In a later section, we'll add another plugin to this Webpack configuration. You can also add more to it based on your build system requirements.

```javascript
{% raw %}
var webpack = require( "webpack" );
var CommonsChunkPlugin = require( "webpack/lib/optimize/CommonsChunkPlugin" );
var HtmlWebpackPlugin = require( "html-webpack-plugin" );
var GlobalizePlugin = require( "globalize-webpack-plugin" );
var nopt = require( "nopt" );

var options = nopt({
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
    })
  ].concat( options.production ? [
    new webpack.optimize.DedupePlugin(),
    new CommonsChunkPlugin( "vendor", "vendor.[hash].js" ),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ] : [] )
};
{% endraw %}
```

`index.js` runs the globalization tasks that we want the user to see. This is a contrived example meant to exercise the library and show what it can do. That said it gives you an idea of the power of GLobalize and what we can use it for.

This looks like a prime use of ES6 String Literals to make them easier to read and reason through. A lot of it will depend on your target browsers and what your team is comfortable with.

These tasks work on the localization tasks for our application. We're capable of changing all the localized elements in the page by only changing the locale we are working with. We can also change the language programmatically based on user interaction.

The first two examples work with number formatting, one for numbers (where the locale indicates how to format decimals and number separators) and one for currency.

```javascript
{% raw %}
var Globalize = require( "globalize" );
var startTime = new Date();

// Standalone table.
var numberFormatter = Globalize.numberFormatter({ maximumFractionDigits: 2 });
document.getElementById( "number" ).textContent = numberFormatter( 12345.6789 );

var currencyFormatter = Globalize.currencyFormatter( "USD" );
document.getElementById( "currency" ).textContent = currencyFormatter( 69900 );
{% endraw %}
```

Dates are more complicated. The first example formats a date using the default formatting rules for the locale we are using.

The second data example uses an array to indicate the format for the date (`datetime`) and a full IANA time zone like `America/Sao_Paulo` or `America/Los_Angeles` to indicate the offset to use and the name of the Time Zone that corresponds to the location. It then uses the array we created to display the date.

```javascript
{% raw %}
var dateFormatter = Globalize.dateFormatter({ datetime: "medium" });
document.getElementById( "date" ).textContent = dateFormatter( new Date() );

var dateWithTimeZoneFormatter = Globalize.dateFormatter({
    datetime: "full",
    timeZone: "America/Sao_Paulo"
});

document.getElementById( "date-time-zone" ).textContent =
  dateWithTimeZoneFormatter(new Date());
{% endraw %}
```

Another way to parse dates according to locale is to break it into its constituent parts. In this example we break it down into parts and, for illustrative purposes, it makes the month part bold.

```javascript
{% raw %}
var _dateToPartsFormatter =
  Globalize.dateToPartsFormatter({ datetime: "medium" });
var dateToPartsFormatter = function( value ) {
  return _dateToPartsFormatter( value, {
    datetime: "medium"
  }).map(function( part ) {
    switch(part.type) {
      case "month": return "<strong>" + part.value + "</strong>";
      default: return part.value;
    }
  }).reduce(function( memo, value ) {
    return memo + value;
  });
  };
document.getElementById( "date-to-parts" ).innerHTML =
  dateToPartsFormatter( new Date() );
{% endraw %}
```

Next, we test relative time formatting (`10 minutes ago` type) and unit type (`60 MPH`) type formatting.

```javascript
{% raw %}
var relativeTimeFormatter = Globalize.relativeTimeFormatter( "second" );
document.getElementById( "relative-time" ).textContent =
  relativeTimeFormatter( 0 );

var unitFormatter = Globalize.unitFormatter( "mile/hour", { form: "short" } );
document.getElementById( "unit" ).textContent =
  unitFormatter( 60 );
{% endraw %}
```

The variables in the section below have been cut for formatting. Each `document.getElementById` and `Globalize.formatMessage` should be in the same line.

These examples work with `formatMessage` for different strings. These will be used and localized in the HTML file described in the next section

```javascript
{% raw %}
// Messages.
document.getElementById( "intro-1" ).textContent =
 Globalize.formatMessage( "intro-1" );
document.getElementById( "number-label" ).textContent =
 Globalize.formatMessage( "number-label" );
document.getElementById( "currency-label" ).textContent =
 Globalize.formatMessage( "currency-label" );
document.getElementById( "date-label" ).textContent =
 Globalize.formatMessage( "date-label" );
document.getElementById( "date-time-zone-label" ).textContent =
 Globalize.formatMessage( "date-time-zone-label" );
document.getElementById( "date-to-parts-label" ).textContent =
 Globalize.formatMessage( "date-to-parts-label" );
document.getElementById( "relative-time-label" ).textContent =
 Globalize.formatMessage( "relative-time-label" );
document.getElementById( "unit-label" ).textContent =
 Globalize.formatMessage( "unit-label" );
document.getElementById( "message-1" ).textContent =
 Globalize.formatMessage( "message-1", {
    currency: currencyFormatter( 69900 ),
    date: dateFormatter( new Date() ),
    number: numberFormatter( 12345.6789 ),
    relativeTime: relativeTimeFormatter( 0 ),
    unit: unitFormatter( 60 )
});

document.getElementById( "message-2" ).textContent =
  Globalize.formatMessage( "message-2", {
      count: 3
});

// Display demo.
document.getElementById( "requirements" ).style.display = "none";
document.getElementById( "demo" ).style.display = "block";
{% endraw %}
```

The final bin in the script is a timing function that will update the valies in the timer once every 1000 milliseconds.

```javascript
{% raw %}
// Refresh elapsed time
setInterval(function() {
    var elapsedTime = +( ( startTime - new Date() ) / 1000 ).toFixed( 0 );
    document.getElementById( "date" ).textContent =
    dateFormatter( new Date() );
  document.getElementById( "date-time-zone" ).textContent =
    dateWithTimeZoneFormatter( new Date() );
  document.getElementById( "date-to-parts" ).innerHTML =
    dateToPartsFormatter( new Date() );
  document.getElementById( "relative-time" ).textContent =
    relativeTimeFormatter( elapsedTime );
  document.getElementById( "message-1" ).textContent =
    Globalize.formatMessage( "message-1", {
      currency: currencyFormatter( 69900 ),
      date: dateFormatter( new Date() ),
      number: numberFormatter( 12345.6789 ),
      relativeTime: relativeTimeFormatter( elapsedTime ),
      unit: unitFormatter( 60 )
    });
}, 1000);
{% endraw %}
```

The final piece is the HTML documebnt that will hold all the localized messages generated during the build process and also links to the Webpack generated bundles as well.

```html
< !doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>Globalize App example using Webpack</title>
</head>
<body>
  <h1>Globalize App example using Webpack</h1>
  <div id="requirements">
    <h2>Requirements</h2>
    <ul>
      <li>Read README.md for instructions on how to run the demo.
      </li>
    </ul>
  </div>
  <div id="demo" style="display: none">
    <p id="intro-1">Use Globalize to internationalize your application.</p>
  <table border="1" style="marginBottom: 1em;">
    <tbody>
      <tr>
        <td><span id="number-label">Standalone Number</span></td>
        <td>"<span id="number"></span>"</td>
      </tr>
      <tr>
        <td><span id="currency-label">Standalone Currency</span></td>
        <td>"<span id="currency"></span>"</td>
      </tr>
      <tr>
        <td><span id="date-label">Standalone Date</span></td>
        <td>"<span id="date"></span>"</td>
      </tr>
      <tr>
        <td><span id="date-time-zone-label">Standalone Date
          (in a specific IANA time zone, e.g.,
          America/Los_Angeles)</span></td>
        <td>"<span id="date-time-zone"></span>"</td>
      </tr>
      <tr>
        <td><span id="date-to-parts-label">Standalone Date (note the highlighted month, the markup was added using formatDateToParts)</span></td>
        <td>"<span id="date-to-parts"></span>"</td>
      </tr>
      <tr>
        <td><span id="relative-time-label">Standalone Relative Time</span></td>
        <td>"<span id="relative-time"></span>"</td>
      </tr>
      <tr>
        <td><span id="unit-label">Standalone Unit</span></td>
        <td>"<span id="unit"></span>"</td>
      </tr>
      </tbody>
    </table>
    <p id="message-1">An example of a message using mixed number "{number}", currency "{currency}", date "{date}", relative time "{relativeTime}", and unit "{unit}".
    </p>
    <p id="message-2">
        An example of a message with pluralization support:
        {count, plural,
            one {You have one remaining task}
            other {You have # remaining tasks}
        }.
    </p>
</div>
{%
var hasShownLocaleHelp;
for ( var chunk in o.htmlWebpackPlugin.files.chunks ) {
  if ( /globalize-compiled-data-/.test( chunk ) &&
    chunk !== "globalize-compiled-data-en" ) {
    if ( !hasShownLocaleHelp ) {
      hasShownLocaleHelp = true;
%}
<!--
Load support for the `en` (English) locale.
For displaying the application in a different locale, replace `en` with
whatever other supported locales you want, e.g., `pt` (Portuguese).
For supporting additional locales simultaneously and then having your
application to change it dynamically, load the multiple files here. Then,
use `Globalize.locale( <locale> )` in your application to dynamically set
it.
-->
{%      } %}
<!-- <script src="{%=o.htmlWebpackPlugin.files.chunks[chunk].entry %}"> -->
{%  } else { %}
<script src="{%=o.htmlWebpackPlugin.files.chunks[chunk].entry %}"></script>
{%
    }
}
%}
{% endraw %}
</body>
</html>
```
