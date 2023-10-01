---
title: "ES6, Babel and You: Modules, the what and the how"
date: "2016-06-13"
---

> **_Thanks to [Ada Rose Edwards](https://twitter.com/Lady_Ada_King) for pointing me to rollup.js and providing examples of how to configure it._** 

I’ve always struggled to understand the differences between modules and classes and I’m still not 100% sure I understand the differences but I think I do well enough to write up about it.

Where a class has to be instantiated using the `new` constructor and is an all or nothing proposition, either you use the entire class or none of it, you cannot extend some methods of the class and not others.

With Modules you have to explicitly export the elements of your module that you want to make available and you have to explicitly tell the module what it is that you want to import from a given package.

A module representing the functions we created to work with promises looks like this:

```javascript
export function loadImage(url) {
  return new Promise( (resolve, reject) =>{
    var image = new Image();
    image.src = url;

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      reject(new Error('Could not load image at ' + url));
    };
  });
}

export function scaleToFit(width, height, image) {
    console.log('Scaling image to ' + width + ' x ' + height);
    return image;
}

export function watermark(text, image) {
    console.log('Watermarking image with ' + text);
    return image;
}

export function grayscale(image) {
    console.log('Converting image to grayscale');
    return image;
}
```

With ES6 modules we can import an entire module or import specific elements of the module, anything in the module that starts with the `export` keyword at the beginning.

We can also export variables and constants for our modules to use. In the following example we’ll create a export in module foo for our default value:

```javascript
export default 42;
```

Which we can then import

```javascript
import foo from './foo.js';
export default function () {
  console.log(foo); //logs 42 to the console
}
```

The complementary method to export is import which will import the specified methods from our module (duh). om import and use the exported module we can use something like the code below:

```javascript
// image-module.js
import { 
  loadImage, 
  scaleToFit, 
  watermark, 
  grayscale } from './image-module.js';

// Image processing pipeline
function processImage(image) {
  loadImage(image)
    .then((image)  => {
      document.body.appendChild(image);
      return scaleToFit(300, 450, image);
    })
    .then((image)  => {
      return watermark('The Real Estate Company', image);
    })
    .then((image)  => {
    return grayscale(image);
    })
    .catch((error) => {
      console.log('we had a problem in running processImage ' + error);
    });
}

processImage('js/banf.jpg');
```

This selective import allows developers to create internal APIs for modules. We only export user facing elements and keep all the internals of our API private by not allowing it to be exported.

Furthermore you can import from many different modules as long as they are available to you. Using an `example rollup-config-file.js` we’ll see how to leverage imports from multiple locations:

```javascript
'use strict';

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    entry: './es6/main.js',
    plugins: [
        nodeResolve({
            jsnext: true
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        json()
    ],
    dest: './bundle.js'
};
```

Modules give us a lot of flexibility. We can create a module for each type of functionality we are implementing (image manipulation, typography, etc) or we can create one module per type of content (a module for the same page and a module for the catalog) and, because we can selectively import elements from an ES6 module we can keep our code DRY by not reinventing the wheel.

## The problem

The problem with ES6 modules today is that no browser supports them natively. I spent a lot of time figuring out how to make it work in browsers without transpiling and I wasn’t able to figure out how to natively support modules across browsers and environments.

[Ada Edwards](https://twitter.com/@Lady_Ada_King) clued me into [Rollup.js](http://rollupjs.org/guide/#using-rollup-with-babel), a bundler for Javascript modules. When combined with Babel they give us the ability to write ES6 modules using other features of the specification, transpile them to ES5 and bundle them together in a way that will work with current browsers.

The best thing about Rollup is that it will only bundle the module imports that are needed for our project to work; thus reducing the size of the bundle and the number of bytes we have to push through the wire

As any Node application we need to install Node (which bundles with NPM) and initialize the project:

```bash
npm init
```

And follow the prompts to create the `package.json` file.

First we install Rollup as a global Node package:

```bash
npm install -g rollup
```

This will install the `rollup` binary in your path so you can just run `rollup`.

Next we install the necessary plugins:

```
npm install -D rollup babel-preset-es2015-rollup rollup-plugin-babel \
rollup-plugin-commonjs rollup-plugin-json rollup-plugin-node-resolve
```

`rollup-plugin-babel` and `babel-preset-es2015-rollup` together handle Babel transpilation. We sue a custom ES2015 so can be sure that Babel will not convert the modules to common.JS before Rollup has a chance to work with them.

`rollup-plugin-commonjs` and `rollup-plugin-node-resolve` do something similar for

`rollup-plugin-json`

The last stage is to build the `rollup.config.js` to make sure we run the tool the same way every time. Since we’re working with ES6 we can use import statements instead of require.

Part of the configuration is to configure the plugins. \* nodeResolve configures the version of Ecmascript we’re using \* commonjs includes the packages from node\_modules \* json lets you use data from the project’s package.json file

```javascript
'use strict';

import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
    entry: './es6/main.js',
    plugins: [
        nodeResolve({
            jsnext: true
        }),
        commonjs({
            include: 'node_modules/**'
        }),
        json()
    ],
    dest: './bundle.js'
};
```

The one thing I’m not too fond of in the Rollup configuration is that it hardcodes both the entry point for the conversion as well as the destination.

These are minor nitpicks that can be fixed by working rollup into your build process, something I deliberately chose not to do, with different tasks for different rollup configurations.

Using the module `image-module.js` and the `rollup-config.js` we just defined produces the following valid ES5 result:

\`\`\`language-javascript function loadImage(url) { return new Promise( (resolve, reject) =>{ var image = new Image(); image.src = url;

<pre><code> image.onload = () => { resolve(image); };

image.onerror = () => { reject(new Error('Could not load image at ' + url)); }; }); }

function scaleToFit(width, height, image) { console.log('Scaling image to ' + width + ' x ' + height); return image; }

function watermark(text, image) { console.log('Watermarking image with ' + text); return image; }

function grayscale(image) { console.log('Converting image to grayscale'); return image; }

// Image processing pipeline function processImage(image) { loadImage(image) .then((image) => { document.body.appendChild(image); return scaleToFit(300, 450, image); }) .then((image) => { return watermark('The Real Estate Company', image); }) .then((image) => { return grayscale(image); }) .catch((error) => { console.log('we had a problem in running processImage ' + error); }); }

processImage('js/banf.jpg'); </code></pre>

\`\`\`
