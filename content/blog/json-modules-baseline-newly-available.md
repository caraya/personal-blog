---
title: JSON modules are baseline newly available
date: 2025-07-30
tags:
  - Javascript
  - JSON
baseline: true
---

<baseline-status featureId="json-modules"></baseline-status>

The idea behind JSON modules, and import attributes, is to allow developers to import JSON files directly into Javascript modules, making it easier to work with structured data directly on the script without adding loading steps.

This post will explore the JSON module feature, its benefits, and how to use it effectively in your projects.

## What are JSON modules?

JSON modules allow you to import JSON files directly into Javascript modules using the `import` statement with the `type: "json"` attribute.

When we import a JSON file in a module like this:

```js
import data from "https://example.com/data.json";
```

On the web, each import statement results in a HTTP request. The response is then prepared into a Javascript value and made available to the program by the runtime. For example, the response may look like this:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
...
{"name":"John"}
```

Modules are identified and parsed only according to their served MIME type — the file extension in the URL cannot be used to identify a file's type. In this case, the MIME type is application/json, which tells the browser that the file is JSON and must be parsed as JSON.

If the server is hijacked or bogus, the MIME type in the server response is set to text/javascript  then the file would be parsed and executed as code.

If the JSON file contains malicious code, the import declaration would unintentionally execute external code, posing a serious security threat.

Import attributes fix this problem by allowing the author to explicitly specify how a module should be validated. For example, the import statement above, which lacks an attribute, would actually fail with an error like this.

```text
Failed to load module script: Expected a Javascript module script but
the server responded with a MIME type of "application/json".
Strict MIME type checking is enforced for module scripts per HTML spec.
Instead, you must provide an attribute to tell the runtime that
this file must contain JSON. To validate the module's
type (via MIME type), you use the attribute key called type. To validate
that the module is a JSON module, the value is "json".
```

!!! note **Note**
The actual type attribute value does not correspond directly to the MIME type. It's separately specified by the HTML specification.
!!!


## How they work?

The code above should be re-written as:

```js
import data from "<https://example.com/data.json>" with { type: "json" };
```

The `type` attribute changes how the browser fetches the module (it adds the `Accept: application/json` header to the request), but does not change how it parses or evaluates the module. The browser already knows to parse the module as JSON given the response's MIME type. It only uses the attribute to check that the `data.json` module is, in fact, a JSON module. For example, if the response header changes to `Content-Type: text/javascript` instead, the program will fail with a similar error as above.

In a fuller example, we can import a JSON file and then use its contents in our code:

```html
<script type="module">
	import package from "./package.json" with { type: "json" };

	console.log(package.name); // Outputs the name from package.json

	const h1 = document.createElement("h1");
	h1.textContent = `name: ${package.name}`;
	document.body.appendChild(h1);
</script>
```

Note that there is no parsing step in the code above. The JSON file is fetched and the response is directly made available as a Javascript object.

## Links and resources

* [JSON module scripts are now Baseline Newly available](https://web.dev/blog/json-imports-baseline-newly-available)
* [Import attributes](https://developer.mozilla.org/en-US/docs/Web/Javascript/Reference/Statements/import/with)
