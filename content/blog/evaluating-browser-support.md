---
title: Evaluating browser support
date: 2025-03-05
tags:
  - Web browser
  - Support Evaluation
baseline: true
---

Talking about web browser support for a given CSS or Javascript is deceptively simple. This post will explore a definition of browser support, different strategies to support a feature accross browsers, the concepts of graceful degradation and progressive enhancement, and how to handle features that can't be polyfilled.

## How to evaluate browser support

When talking about browser support, we are actually asking three related questions:

1. How essential is the feature to the application?
2. Is the feature supported in all browsers?
3. Is there a way to polyfill or provide an alternative for the feature?

For most CSS and Javascript features support is pretty good, but we can't rely on that alone.

For example, even though a feature is in a specification, it doesn't mean that all browsers have implemented it or that they have implemented it correctly.

Furthermore, there are features supported in Chromium browsers (most of these features are part of Chromium's [Capabilities Project)](https://developer.chrome.com/docs/capabilities) or Project Fugu) that are not supported in Firefox and Safari.

The feature I'll use for this example is [WebUSB](Building a device for WebUSB), which allows web applications to communicate directly with USB devices.

The example application is a web-based app that interacts with medical devices through USB. The app is used by doctors to monitor patients in real-time.

So the answer to question 1 is that the feature is essential to the application.

As discussed earlier, the feature is not available in Safari and Firefox. We can either say "Sorry, the app will only work in Chromium browsers" or we can try to provide an equivalent experience in other browsers either with a polyfill or an alternative.

The hardest question to answer is the third one. There is no way to polyfill WebUSB because it interacts with hardware.

It may be possible to port a [generic USB library](https://web.dev/articles/porting-libusb-to-webusb) to the web using [Emscripten](https://emscripten.org/), but that would be a significant effort that would be ongoing as you add new USB devices to the app, you also have to maintain multiple paths to accomplish the same task.

Based on the answers to these three questions, we may still have an approach to support USB on the web and to still create a compelling user experience but we're aware of the additional costs involved in dealing with non-standard features.

## Strategies to support a feature across browsers

If we decide that we need to support a given feature we have multiple strategies to do so. Some of these strategies are structural (like progressive enhancement and graceful degradation) and some are technical (like using multiple declarations in CSS or using feature detection in Javascript).

### Graceful degradation or progressive enhancement?

One of the oldest debates in web development is whether to use [graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation) or [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

In a graceful degradation scenario, we build the full application and we let features stop working, without loosing the core functionality of the app.

In a progressive enhancement scenario, we build the core functionality of the app and we add features that may not be supported in all browsers.

Which strategy to approach depends on the app and what your goal is: In our medical device USB application example, we could use progressive enhancement to create the basic application and work the alternative for browsers that don't support the feature we need.

### Measuring Usage

If you use analytics in your app, you can measure what browsers and versions your users are using. This can help you decide what features to implement and what fallbacks to make available.

You can look at tools like [Can I Use](https://caniuse.com/) to see what features are supported in what browsers and versions.

### CSS

CSS is forgiving, it will ignore declarations it doesn't understand. This will provide a basic level of support for most features.

#### Using multiple declarations

You can use multiple declarations to provide support for different browsers.

When using multiple declarations, the browser will use the last one it understands. This means **the order of declaration matters**.

For example, you can use different color spaces for different browsers. All declarations point to the same color but not all browsers .

```css
.example {
	color: rebeccapurple;
	color: #663399;
	color: oklch(44.03% 0.1603 303.37);
}
```

This means you have to write more code in your CSS, but it's a simple way to provide support for different browsers and versions.

#### Using @supports

<baseline-status featureid="supports"></baseline-status>

A more complex way to provide support for different browsers is to use the [@supports at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports). This is also known as feature queries.

You can use feature queries to test either single or compound properties with logical operators.

In this example, we provide a default set of styles using `display: block` and then we use a feature query to test if the browser supports `display: grid`.

```css
.example {
	display: block;
}

@supports (display: grid) {
	.example {
		display: grid;
	}
}
```

Using the `and` operator, we can test for multiple properties. This is inclusive, so both features have to be supported for the query to match.

In this example, the browser must support both `display: table-cell` **and** `display: list-item` for the feature query to match.

```css
@supports (display: table-cell) and
	(display: list-item) {}
```

One of the most useful features of feature queries is to test for a property that (still) uses vendor prefixes in some browsers.

This example test if the browser supports the `transform-style` property with the `preserve` value or any of the equivalent prefixed properties for Firefox and Safari.

```css
@supports (transform-style: preserve) or
	(-moz-transform-style: preserve) or
	(-webkit-transform-style: preserve) {}
```

This will give you more flexibility in providing support for different browsers and will work even if Safari and Firefox later unprefix the property.

### Javascript

Javascript is more (and less) forgiving than CSS. New features are added to the language annually, but not all browsers support all features so we need to transpile or convert our code to something that will work on the version of Javascript we're targeting.

We will look at tools like Babel and Typescript that will both transpile your code to older version of Javascript and, in the case of Typescript, provide type checking.

#### Babel

When using Babel, create a `babel.config.json` file in the root of your project. Different sections of the configuration files include:

* Any presets you want to use, like [@babel/preset-env](https://babeljs.io/docs/babel-preset-env)
* A list of the target browsers and versions
* The `useBuiltIns` option, which will add polyfills for features that are not supported in the target browsers
* The version of corejs to use when adding polyfills

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

For more information on how to configure Babel, check the [official documentation](https://babeljs.io/docs/en/configuration).

#### Typescript

Typescript is a superset of Javascript that adds type checking to the language. This can help you catch errors before they happen.

To properly configure typescript, create a `tsconfig.json` file in the root of your project.

Instead of using the init option of the tsc package (created with `npx tsc --init`), you can create a `tsconfig.json` file from scratch.

My simple configuration targets ES2019 and uses strict mode. I also use the bundler module resolution strategy so it can resolve JSON modules.

```json
{
  "compilerOptions": {
    "target": "es2019",
    "moduleResolution": "bundler",
    "strict": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": false
  },
  "exclude": ["templates", "dist"]
}
```

#### Using feature detection in Javascript

Javascript features provide a way to do feature detection to test if a browser supports a given feature.

For example, we can test if the browser supports service workers by testing if the navigator object has a `serviceWorker` property. If it does, we run service worker related code. If it doesn't then we either throw an error or provide alternative functionality

```js
async function loadServiceWorker() {
  if ("serviceWorker" in navigator) {
		try {
      const registration = await navigator.serviceWorker.register(
				"/sw.js", {
        	scope: "/",
      	}
			);
      if (registration.installing) {
        console.log("Service worker installing");
      } else if (registration.waiting) {
        console.log("Service worker installed");
      } else if (registration.active) {
        console.log("Service worker active");
      }
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
	}
}
```
