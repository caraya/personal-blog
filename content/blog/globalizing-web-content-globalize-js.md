---
title: "Globalizing web content: Globalize.js"
date: "2017-12-11"
---

GLobalize is the heavy gun in the i18n world. It'll automate most of the i18n work and integrate ICU and CLDR into one application.

```
npm install --save globalize 
```

or build from the [Github development branch](https://github.com/globalizejs/)

```
git clone https://github.com/globalizejs/globalize.git
bower install && npm install
grunt
```

If you choose to build globalize from source please make sure you run Bower install command before NPM. It took me a while to figure out that this was causing installation errors when building from GIT source. Depending on your needs it may be better to start with a pre-built distribution of the libraries.

Globalize makes heavy use of the CLDR data set and, in the examples below, the installation process through NPM will take care of installing the CLDR data. To illustrate how this works we'll look at two examples from the Globalize repository, one running NPM to create text-based responses and one using NPM and WebPack to generate bundles for each of our target languages.

### NPM

The first example we'll look at it is a Node-based app that will output all the results to the console. The `package.json` file, as with any Node-based project, tells NPM what packages and versions to install.

```javascript
{
  "name": "globalize-hello-world-node-npm",
  "private": true,
  "dependencies": {
    "cldr-data": "latest",
    "globalize": "^1.3.0",
    "iana-tz-data": ">=2017.0.0"
  },
  "cldr-data-urls-filter": "(core|dates|numbers|units)"
}
```

`main.js` has all the code that will load and run Globalize tools. I've commented the code to illustrate what it does.

```javascript
const Globalize = require( "globalize" );

let like;

// Before we can use Globalize, we need to feed it on
// the appropriate I18n content (Unicode CLDR).
Globalize.load(
    require( "cldr-data/main/en/ca-gregorian" ),
    require( "cldr-data/main/en/currencies" ),
    require( "cldr-data/main/en/dateFields" ),
    require( "cldr-data/main/en/numbers" ),
    require( "cldr-data/main/en/timeZoneNames" ),
    require( "cldr-data/main/en/units" ),
    require( "cldr-data/supplemental/currencyData" ),
    require( "cldr-data/supplemental/likelySubtags" ),
    require( "cldr-data/supplemental/metaZones" ),
    require( "cldr-data/supplemental/plurals" ),
    require( "cldr-data/supplemental/timeData" ),
    require( "cldr-data/supplemental/weekData" )
);
// Load messages for our default language
Globalize.loadMessages( require( "./messages/en" ) );
// Load time zone data
Globalize.loadTimeZone( require( "iana-tz-data" ) );

// Set "en" as our default locale.
Globalize.locale( "en" );

// Use Globalize to format dates.
console.log( Globalize.formatDate( new Date(), { datetime: "medium" } ) );

// Use Globalize to format dates in specific time zones.
console.log( Globalize.formatDate( new Date(), {
    datetime: "full",
    timeZone: "America/Sao_Paulo"
}));

// Use Globalize to format dates to parts.
console.log( Globalize.formatDateToParts( new Date(), { datetime: "medium" } ) );

// Use Globalize to format numbers.
console.log( Globalize.formatNumber( 12345.6789 ) );

// Use Globalize to format currencies.
console.log( Globalize.formatCurrency( 69900, "USD" ) );

// Use Globalize to get the plural form of a numeric value.
console.log( Globalize.plural( 12345.6789 ) );

// Use Globalize to format a message with plural inflection.
like = Globalize.messageFormatter( "like" );
console.log( like( 0 ) ); // Be the first to like this
console.log( like( 1 ) ); // You liked this
console.log( like( 2 ) ); // You and someone else liked this
console.log( like( 3 ) ); // You and 2 others liked this

// Use Globalize to format relative time.
console.log( Globalize.formatRelativeTime( -35, "second" ) );

// Use Globalize to format unit.
console.log( Globalize.formatUnit( 60, "mile/hour", { form: "short" } ) );
```

Run the program from a terminal by running `node main.js`.
