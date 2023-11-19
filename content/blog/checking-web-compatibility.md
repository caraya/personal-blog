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

[caniuse-cmd](https://github.com/sgentle/caniuse-cmd) gives you one tool to do this.

You can choose two methods of using the caniuse CLI.

You can install it globally using the following command:

```bash
npm i -g caniuse-cmd
```

You can also choose to install it as a development dependency. This will pin the version of caniuse to a specific point in time.

```bash
npm i -D caniuse-cmd
```

Once it's installed you can run it using a command like this:

```bash
caniuse nesting
```

and you'll get a result like this (broken into multiple lines for readability):

```bash
CSS Nesting ✔ 2.16% ◒ 78.26%
  IE ✘  Edge ✘ 12+ ✘ 109+¹ ◒ 112+³ Firefox ✘ 2+ ✘ 115+² ✔ 117+
  Chrome ✘ 4+ ✘ 109+¹ ◒ 112+³ Safari ✘ 3.1+ ◒ 16.5+³
  Opera ✘ 9+ ✘ 95+¹ ◒ 98+³
```

While this is not a perfect solution, it doesn't help with syntax, it helps to keep your hands on the keyboard as you work and gives you the minimal necessary information about support for a technology on y our target browsers.
