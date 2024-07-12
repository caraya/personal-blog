---
title: Import Maps Are Ready For Use
date: 2024-07-15
tags:
  - Javascript
  - Modules
  - Imports
---

Import maps allow developers to instead specify arbitrary text in the module specifier when importing a module; the map provides a corresponding value that will replace the text when the module URL is resolved.

An import map lives in a script element with a `type="importmap"` attribute and it should be the first script element on the page. You have to define the import map before you can use it.

Let's assume that we have a set of modules to do operations in three different geometrical modules: squares, circles and triangles. The modules live in a modules directory at the root of the application. We could create an import map like this.

Each shape module defines the following methods:

* reportArea:  logs the shape's area to the console
* reportPermiter: logs the shape's perimeter to the console

```html
<script type="importmap">
  {
    "imports": {
      "squares": "./modules/shapes/square.js",
      "circles": "./modules/shapes/circle.js",
      "triangles": "./modules/shapes/triangle.js",
      "shapes/": "./module/shapes/"
    }
  }
</script>
```

With these import mape in place, we can use bare imports in our scripts that match the imports we created.

To prevent name collisions, we'll rename the imports from each component.

```js
console.log('Module script started');

import {
  squareArea,
  squarePerimeter,
} from "square";

import {
  triangleArea,
  trianglePerimeter,
} from "triangle";

import {
  circleArea,
  circlePerimeter,
} from "circle";
```

And then we can call the methods we imported from the different modules. For this example, we're logging the results to the console. In production

```js
try {
  console.log('Imports successful');

  console.log('Square Area:', squareArea(2));
  console.log('Square Perimeter:', squarePerimeter(4));

  console.log('Triangle Area:', triangleArea(4, 9));
  console.log('Triangle Perimeter:', trianglePerimeter(4, 8, 7));

  console.log('Circle Area:', circleArea(4));
  console.log('Circle Perimeter:', circlePerimeter(7));
} catch (error) {
  console.error('Error during imports or calculations:', error);
}
```

We can also work with external modules. The following example maps colorjs' color components in a remote location to local components.

```html
<script type="importmap">
  {
    "imports": {
      "colorjs": "https://elements.colorjs.io/index.js",
      "colorjs/": "https://elements.colorjs.io/src/"
    }
  }
</script>
```

The first reference (`colorjs`) maps to the full package script which is good for development since you won't have to import each individual package.

```js
import 'colorjs'
```

is equivalent to

```bash
import 'https://elements.colorjs.io/index.js'
```

The second referene (`colorjs/`) maps to a partial URL. This way we can import specific components using the short reference, for example:

```js
import 'colorjs/color-picker/color-picker.js';
```

maps to:

```bash
import 'https://elements.colorjs.io/src/color-picker/color-picker.js'
```

With either version, we can import the package and use in our pages.

```html
<color-picker space="oklch" color="oklch(50% 50% 180)"
  oncolorchange="this.firstElementChild.textContent = this.color.oklch.join(' ')">
	<div class="coords"></div>
</color-picker>
```

Since this is baseline newly available you should be careful how you implement it and provide an alternative way to import your scripts.

## Links and Resources

* <https://html.spec.whatwg.org/multipage/webappapis.html#import-maps>
* <https://github.com/WICG/import-maps?tab=readme-ov-file>

