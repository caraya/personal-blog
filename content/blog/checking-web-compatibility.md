---
title: Checking web compatibility
date: 2023-12-04
---

When working with web content, it is important to check what browsers your content is compatible with.

There are three ways to do this:

## Web UI

[caniuse](https://caniuse.com) provides a basic compatibility table for most major desktop and mobile browsers.

[MDN](https://developer.mozilla.org/) goes a step further than Caniuse, it also provides additional information about the property, how it works and the specification that the property belongs to.

Both Caniuse and MDN require you to have a browser open on the right site and actively search for the property or API you're looking for.

## Programmatic Tools

MDN provides its [browser compatibility data](https://www.npmjs.com/package/@mdn/browser-compat-data) as an NPM package and Can I use provides [node-caniuse](https://www.npmjs.com/package/caniuse)

You can use either of these packages as  the database for your own projects.

## Command Line Tools

Sometimes you just want to make sure that something will work on the browsers you are targetting but don't want to open a new browser tab to check it.

[caniuse-cmd](https://github.com/sgentle/caniuse-cmd)


