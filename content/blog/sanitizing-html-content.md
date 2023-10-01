---
title: "Sanitizing HTML content"
date: "2022-11-02"
---

One of the biggest security issues with web applications is Cross Site Scripting (XSS). In an XSS attack, malicious code is added to HTML that we expect the browser to parse, thus rendering and executing the malicious code on the page.

Let's assume that we have the following template.

```js
foreach(review in reviews) {
    <div class="review">
      <h4>${review.title}</h4>
      <p>${review.text}</p>
    </div>
}
```

And then we feed it the following data:

```text
// Review 1
Title: Friendly and delicious!
Text: The Restaurant is right in the center of town. It has top food en it's a very nice place with a friendly and professional staff

//Review 2
Title: Kitchen nightmares
Text: Fine location, lots of parking. But those are the only good things.<img src="none" onerror="console.log('Running malicious code :o')">
```

Without any protection the template will render the HTML:

```html
<div class="review">
  <h4>Friendly and delicious!</h4>
  <p>The restaurant is right in the center of town...</p>
</div>
<div class="review">
  <h4>Kitchen nightmares</h4>
  <p>Fine location, ... things.<img src="none" onerror="console.log('Running malicious code :o')"></p>
</div>
```

The second template will produce an error and the `onerror` event handle will fire, alerting us that we're running malicious code.

In this example, we're just using an alert. In really malicious code this could be used to exfiltrate sensitive data or other malicious activity. The browser will not do anything to prevent it because we haven't told it to.

We will look at three different ways to sanitize external content that we feed to our templates and APIs, in essence, telling the browser to filter potentially malicious content from templates.

The idea behind all these techniques is to sanitize the content and remove all tags and script elements from the content.

## third-party libraries: DOMPurify

The first option is to use sanitizer libraries like [DOMPurify](https://github.com/cure53/DOMPurify#readme).

The idea is that you import the DOMPurify library and then call the `sanitize` method on the text that we want to "clean up".

Using the default settings, the code to sanitize text would look like this:

```js
const dirty = '<p>HELLO<iframe/\/src=JavScript:alert&lpar;1)></ifrAMe><br>goodbye</p>';

const clean = DOMPurify.sanitize(dirty);

document.getElementById('sanitized').innerHTML = clean;
```

You can also create a configuration object to let some elements through the sanitizer.

The example does the following:

1. Defines the dirty text
2. Specify a configuration directive, only <p> elements allowed
    
    - Note: We want to also keep <p>'s text content, so we add #text too
3. Sanitize the input
4. place the sanitized input in the document

```js
// 1 
const dirty = '<p>HELLO</p><style>*{x:expression(alert(1))}</style>\
<iframe/\/src=JavScript:alert&lpar;1)></ifrAMe><br>goodbye</p><h1>not me!</h1>';

// 2
const config = { ALLOWED_TAGS: ['p', '#text'], KEEP_CONTENT: false };

// 3
const clean = DOMPurify.sanitize(dirty, config);

// 4
document.getElementById('sanitized').innerHTML = clean;
```

This is as simple an example as we can create, we can use this library with any framework or with vanilla Javascript.

## Sanitizer API

There is a proposed Sanitizer browser API that provides a similar service to DOMPurify without having to install another dependency to your project.

In [Safe DOM manipulation with the Sanitizer API](https://web.dev/sanitizer/) the author discusses the API and how to use it.

The most basic usage for the API does the following:

1. Captures the element with the input
2. Captures the user input. In this example the input is a string; in a production setting this could fetch the content from a remote source
3. Sanitizes the content using the [setHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/setHTML) method
    
    - The `setHTML` method takes two arguments:
        
        - The user input
        - An optional sanitizer settings object

```js
// 1
const myDiv = document.querySelector('div')

// 2
const user_input = `<em>hello world</em><img src="" onerror=alert(0)/>`

// 3
myDiv.setHTML(user_input, { sanitizer: new Sanitizer() })
```

This example assumes that we want to sanitize and add to the containing element at the same time. There are other methods that you can use in other situations. See [String Handling](https://wicg.github.io/sanitizer-api/#api-string-handling) in the Sanitizer API for more information.

You can also customize the sanitizer

```js
// 1
const myDiv = document.querySelector('div')

// 2
const user_input = `<b><em>hello world</em></b><img src="" onerror=alert(0)/>`

// 3
myDiv.setHTML(user_input, {
  sanitizer: new Sanitizer({
    allowElements: [
      "b"
    ]
  })
})
```

The sanitizer configuration has the following attributes.

**allowElements**

The element allow list is a sequence of strings with elements that the sanitizer should retain in the input.

**blockElements**

The element block list is a sequence of strings with elements where the sanitizer should remove the elements from the input, but retain their children.

**dropElements**

The element drop list is a sequence of strings with elements that the sanitizer should remove from the input, including its children.

**allowAttributes**

The attribute allow list is an attribute match list, which determines whether an attribute (on a given element) should be allowed.

**dropAttributes**

The attribute drop list is an attribute match list, which determines whether an attribute (on a given element) should be dropped.

**allowCustomElements**

The allow custom elements option determines whether custom elements are to be considered. The default is to drop them. If this option is true, custom elements will still be checked against all other built-in or configured checks.

**allowUnknownMarkup**

The allowUnknownMarkup option determines whether unknown HTML elements are to be considered. The default is to drop them. If this option is true, unkown HTML elements will still be checked against all other built-in or configured checks.

**allowComments**

The allow comments option determines whether HTML comments are allowed.

It is important to note the differences, like the differences between `blockElements` and `dropElements` regarding whether to keep the children elements.

Another thing to consider is that working with [custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) or comments require their own permissions, separate from regular elements and attributes.

The issue with the API is browser support. It is supported in Chrome and Edge, with support behind a flag in Firefox. Support in Safari is unknown at this time.

## Trusted types

Another way to sanitize content is to use Trusted Types. When an application enables Trusted Types, the browser refuses to accept text-based assignments to dangerous sinks, such as: [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML), [outerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/outerHTML), [document.write](https://developer.mozilla.org/en-US/docs/Web/API/Document/write), and [document.writeln](https://developer.mozilla.org/en-US/docs/Web/API/Document/writeln)\`.

Unlike the sanitizer API, Trusted Types require more setup before you can use them.

You can use Trusted Types by enabling them with HTTP header.

The `trusted-types` header enables trusted types in general or specific trusted types when you pass one ore more values with the header.

`requires-trusted-types-for` controls the data passed to DOM XSS sink functions, like Element.innerHTML setter.

```apache
Content-Security-Policy: trusted-types; 
  require-trusted-types-for 'script';
```

When testing, or if you don't have access to the server to set up HTTP headers you can use a `meta` element with equivalent values. In this case, it's enough to set up the `require-trusted-type-for` equivalent.

```html
<meta 
  http-equiv="Content-Security-Policy" 
  content="require-trusted-types-for 'script'">
```

This tells the browser that we want to buy into using Trusted Types, but we're not done configuring them.

At the most basic level, we need to configure one or more trusted type policies. These policies will restrict the text that can be used in Trusted Types.

We use feature detection for Trusted Types (`window.trustedTypes`) and Trusted Type policy creation (`trustedTypes.createPolicy`).

The `createPolicy` takes two parameters: the name of the policy and one or more methods for filtering content. The available methods are:

[TrustedTypePolicy.createHTML()](https://developer.mozilla.org/en-US/docs/Web/API/TrustedTypePolicy/createHTML)

Creates a [TrustedHTML](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) object.

[TrustedTypePolicy.createScript()](https://developer.mozilla.org/en-US/docs/Web/API/TrustedTypePolicy/createScript)

Creates a [TrustedScript](https://developer.mozilla.org/en-US/docs/Web/API/TrustedScript) object

[TrustedTypePolicy.createScriptURL()](https://developer.mozilla.org/en-US/docs/Web/API/TrustedTypePolicy/createScriptURL)

Creates a [TrustedScriptURL](https://developer.mozilla.org/en-US/docs/Web/API/TrustedScriptURL) object

In this example, we create a custom Trusted Type policy and set up the type of filter that we want to use when creating HTML.

```js
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '<')
  });
}
```

We then use the policy we created when adding new HTML content. Using the policy will create new [trustedHTML](https://developer.mozilla.org/en-US/docs/Web/API/TrustedHTML) that can be safely inserted into the document using [createHTML](https://developer.mozilla.org/en-US/docs/Web/API/TrustedTypePolicy/createHTML).

```js
let el = document.getElementById("myDiv");

const escaped = myEscapePolicy.createHTML("<img src=x onerror=alert(1)>");

el.innerHTML = escaped;
```

You can also create a default policy to be used everywhere we use `createHTML`.

The example default policy uses DOMPurify as the sanitizer. This makes the job of creating policies easier.

```js
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true})
  });
}
```

## Links and Resources

- [Trusted Types](https://web.dev/trusted-types/)
- [Securing SPAs with Trusted Types](https://auth0.com/blog/securing-spa-with-trusted-types/)
- [Trusted Types API](https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API) — MDN
