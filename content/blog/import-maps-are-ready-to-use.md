---
title: Import Maps Are Ready For Use
date: 2024-07-15
tags:
  - Javascript
  - Modules
  - Imports
---

Import maps present

> An import map is a JSON object that allows developers to control how the browser resolves module specifiers when importing JavaScript modules. It provides a mapping between the text used as the module specifier in an import statement or import() operator, and the corresponding value that will replace the text when resolving the specifier. The JSON object must conform to the Import map JSON representation format.


>
> An import map is used to resolve module specifiers in static and dynamic imports, and therefore must be declared and processed before any &lt;script> elements that import modules using specifiers declared in the map. Note that the import map applies only to module specifiers in the import statement or import() operator for modules loaded into documents; it does not apply to the path specified in the src attribute of a &lt;script> element or to modules loaded into workers or worklets.

<https://github.com/WICG/import-maps?tab=readme-ov-file>

<https://html.spec.whatwg.org/multipage/webappapis.html#import-maps>
