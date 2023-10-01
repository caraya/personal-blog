---
title: "Import Maps Everywhere"
date: "2023-05-10"
---

Javascript import maps provide a mapping between local names and external modules.

Using Import Maps is a two-step process. First, you create a script with a `type="importmap"` attribute to create the mappings.

```html
<script type="importmap">
  {
    "imports": {
      "browser-fs-access": "https://unpkg.com/browser-fs-access@0.33.0/dist/index.modern.js"
    }
  }
</script>
```

You can also reference files in the project's node\_modules folder.

```html
<script type="importmap">
{
  "imports": {
    "lodash": "/node_modules/lodash-es/lodash.js"
  }
}
</script>
```

Furthermore, we can map multiple modules inside the path that we're mapping to.

For example, lodash has many modules living under the lodash module. We can use a slash after the map to indicate that we also want the content inside the module.

```html
<script type="importmaps">
{
  "imports": {
    "lodash": "/node_modules/lodash/lodash.js",
    "lodash/": "/node_modules/lodash/"
  }
}
</script>
```

This enables us to import the full package directly.

```js
import _lodash from "lodash";
```

Or to import a component module from the package.

```js
import _shuffle from "lodash/shuffle.js";
```

The second step is to use the module we specified in the import map on our scripts by referencing the mapped specifier rather than the URL.

```html
<button>Select a text file</button>
<script type="module">
  import { fileOpen } from 'browser-fs-access';

  const button = document.querySelector('button');
  button.addEventListener('click', async () => {
    const file = await fileOpen({
      mimeTypes: ['text/plain'],
    });
    console.log(await file.text());
  });
</script>
```

This is the basic usage of import maps. The specification [README](https://github.com/WICG/import-maps#readme) outlines additional uses for the API, including scoping the imports.

The important element (and why I revisited the API now) is that the API is now supported in all browsers so it's worth revisiting it and testing if suits your needs.

 ![Data on support for the import-maps feature across the major browsers from caniuse.com](https://caniuse.bitsofco.de/static/v1/import-maps-1682201143288.jpg) 

## Links and Resources

- [Import maps spec README](https://github.com/WICG/import-maps#readme)
- [JavaScript import maps are now supported cross-browser](https://web.dev/import-maps-in-all-modern-browsers/)
- [Using ES modules in browsers with import-maps](https://blog.logrocket.com/es-modules-in-browsers-with-import-maps/)
- [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)
