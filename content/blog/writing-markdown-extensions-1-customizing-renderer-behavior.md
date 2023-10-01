---
title: "Writing Markdown extensions (1): Customizing renderer behavior"
date: "2021-05-17"
---

Markdown gives you two options to work with specialized content: You can write it as HTML directly or you can use plugins for your Markdown tools that will produce the same result from some specific combination of text symbols.

Until now I've always used HTML for things like figures and video embeds from YouTube or Codepen. It's easier, I've created snippets in VSCode to handle them and my muscle memory already knows the shortcuts and how to write the code by hand.

For security reasons this may not always be a good idea, especially if you accept third-party contributions. There's nothing stopping a malicious author from inserting scripts into the HTML that would run when a reader views the page.

I've chosen to experiment with Markdown-it as a standalone editor and see how easy it is to write plugins for them (or not, see [Markdown to HTML standalone converter tool](https://publishing-project.rivendellweb.net/markdown-to-html-standalone-converter-tool/) for my reservations about the project leadership).

## Modifying existing renderer rules

The easiest way to create Markdown-it plugins is to customize the way that the Markdown renderer works. The following example will add `loading="lazy"` to all images so they will lazy load in Chromium-based browsers.

```js
const imageDefaultRender =
  md.renderer.rules.image ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const loadingIndex = tokens[idx].attrIndex('loading');

  if (loadingIndex < 0) {
    tokens[idx].attrPush(['loading', 'lazy']);
  } else {
    tokens[idx].attrs[loadingIndex][1] = 'lazy';
  }

  return defaultRender(tokens, idx, options, env, self);
};
```

This is an all-or-nothing deal. Either all the images get it or you have to manually edit the resulting HTML code. For native lazy loading, this is not bad since browsers will not lazy load the images that are on the viewport when the page initially loads but it may be an issue for other applications.

It also presents the issue that, if you change one attribute, any other attribute will have its value reset. This happened with the `alt` attribute. To fix it we had to add a second if/then/else block to handle the `alt` attribute. I'm not 100% sure if you'd have to do the same for other existing attributes.

```js
const imageDefaultRender =
  md.renderer.rules.image ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const loadingIndex = tokens[idx].attrIndex('loading');
  const altIndex = tokens[idx].attrIndex('alt');

  if (loadingIndex < 0) {
    tokens[idx].attrPush(['loading', 'lazy']);
  } else {
    tokens[idx].attrs[loadingIndex][1] = 'lazy';
  }

  // We test for presence and length
  // to prevent a crash if the 
  // attribute is empty (lenght = 0)
  if (altIndex < 0 && altIndex.length > 0) {
    tokens[idx].attrPush(['alt', tokens[0].children[0].content]);
  } else {
    tokens[idx].attrs[altIndex][1] = tokens[0].children[0].content;
  }

  return imageDefaultRender(tokens, idx, options, env, self);
};
```

Another example is to add `noopener`, `nofollow` and `noreferrer` attributes to external links.

```js
var defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  var aIndex = tokens[idx].attrIndex('rel');

  if (aIndex < 0) {
    tokens[idx].attrPush(['rel', 'noopener noreferrer nofollow']);
  } else {
    tokens[idx].attrs[aIndex][1] = 'noopener noreferrer nofollow';
  }

  return defaultRender(tokens, idx, options, env, self);
};
```

Again, this is an all-or-nothing proposition but this time, it's not harmless. We don't want to add the attributes to internal links so we have to code around the problem.

First, we create two functions that will define if a link is internal or not.

The first one gets the domain for the site (the domain is defined as everything between the `//` and the first `/` in the URL, assuming that external links will look like this `https://example.com/demo.html`)

The second function defines an internal link as one without a domain.

```js
function getDomain(href) {
  let domain = href.split('//')[1];
  if (domain) {
    domain = domain.split('/')[0].toLowerCase();
    return domain || null;
  }
  return null;
}

function isInternalLink(href) {
  let domain = getDomain(href);
  return domain === null;
}
```

We then modify our link\_open renderer so it will only add the attributes to links that are **not** internal.

```js
// Remember old renderer, if overridden, or proxy to default renderer
var defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  var linkIndex = tokens[idx].attrIndex('rel');
  var href = tokens[idx].attrGet('href');

  // Only do it if the link is not internal
  if (!isInternalLink(href)) {
    if (linkIndex < 0) {
      tokens[idx].attrPush(['rel', 'noopener noreferrer nofollow']);
    } else {
      tokens[idx].attrs[linkIndex][1] = 'noopener noreferrer nofollow';
    }
  }
  // pass token to default renderer.
  return defaultRender(tokens, idx, options, env, self);
};
```

## Further improvements

Right now our code is very rigid. It adds the attributes we tell it to and requires further work to add the customizations. Based on my limited knowledge of how the parser internals work I don't know if it's possible to further customize the rules customizations with customizations that fall outside the Markdown parser or if this would fall under creating new Markdown elements
