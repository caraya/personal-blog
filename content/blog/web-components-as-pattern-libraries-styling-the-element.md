---
title: "Web Components as pattern libraries: Styling the element"
date: "2017-01-18"
---

## Styling the element

Insert the following CSS in the style declaration for our `pattern-figure` element

```css
:host {
    display: block;
    clear: both;
}

:host > figure {
    max-width: min-content;
}

:host > figure > img {
    max-width: inherit
}

:host > figure > figcaption {
    color: #999;
    font-size: 80%;
    text-align: left;
}

:host([align="left"]) > figure  {
    clear: both;
    float: left;
    margin: 2em 0;
}

:host([align="center"]) > figure {
    clear: both;
    margin: 2em auto;
}

:host([align="right"]) > figure {
    clear: both;
    float: right;
    margin: 2em 0;
}

:host([align="left"]) > figure > figcaption,
:host([align="center"]) > figure > figcaption,
:host([align="right"]) > figure > figcaption {
    text-align: left
}

:host(.code-list) > figure > figcaption {
    border-top: 1px solid black;
    margin-top: 2em;
    color: #999;
    text-align: left;
}

:host([float = "left"]) {
    margin-right: 2rem;
    text-align: left
}

:host([float = "right"]) {
    margin-left: 2rem;
    text-align: left
}

```

The `:host()` pseudo element represents our element, `pattern-figure` in this case. It allow me to style the element from the element declaration itself and not loose the style encapsulation. It also allows me to create different versions of the element depending on what attributes we use.

All the styling is done inside the element itself. T

So what does this all mean in practice? We can create themes for our molecules and change them either with classes or attributes on our elements. For example each of the `pattern-figure` elements will be styles different, but all the captions will be styled the same way.

```markup
<pattern-figure class="figure" align="left">
    <figure>
        <img src="images/IMG_0212.PNG">
        <figcaption>Magazine spread to model after </figcaption>
    </figure>
</pattern-figure>

<pattern-figure class="figure" align="center">
    <figure>
        <img src="images/IMG_0212.PNG">
        <figcaption>Magazine spread to model after</figcaption>
    </figure>
</pattern-figure>

<pattern-figure class="figure" align="right">
    <figure>
        <img src="images/IMG_0212.PNG">
        <figcaption>Magazine spread to model after</figcaption>
    </figure>
</pattern-figure>
```

When we need to change the styles of our elements we need to change the definitions on the CSS portion of the element.

## Custom CSS mixins to create themes

Rther than define individual properties for each theme we want to implement for our pattern library it may be easier, less tedious and error prone to let a library author to define a mixin, a set of CSS properties as a single custom property

Using an extension to the shim that provides custom properties, we can then apply all properties in the mixin to a specific CSS rule in an element's local DOM. The capability is analogous to var and custom properties, but which allows an entire set of properties to be mixed in.

Defining a mixin is just like defining a custom property, but the value is an object that defines one or more rules.

```css
selector {
  --mixin-name: {
    /* rules */
  };
}
```

The extension adheres to the [CSS @apply rule](https://tabatkins.github.io/specs/css-apply-rule/) proposal. Use @apply to apply a mixin like this:

```css
@apply(--mixin-name);
```

Mixins can be as simple as defining a set of properties common to one or more versions of the same element or as a theme container in a master css-only element that gets imported and included in each element we want to use the common CSS in.

In the `pattern-message` element demo below we define a set of common attributes for all our message elements as the `--pattern-message-theme` mixin in the `:host` selector and then, for the more specific classes we add any additional rules that are specific to the subclass of the pattern we want to modify, mostly adding different background colors to the different types of messages available.

```markup
<link rel="import" href="../../bower_components/polymer/polymer.html">

<dom-module id="pattern-message">
    <style is="custom-style">
        /* Apply custom theme to messages */
        :host {
            --pattern-message-theme: {
                border-radius: 1em;
                border: 2px solid black;
                display: block;
                padding: 1em;
                width: 80%;
                margin: 2em auto;
            };
        }

        :host(.message) {
            @apply(--pattern-message-theme);
            background-color: lightgrey;
        }

        :host(.message-info) {
            @apply(--pattern-message-theme);
            background-color: lightblue;
        }

        :host(.message-warning) {
            @apply(--pattern-message-theme);
            background-color: lightyellow;
        }

        :host(.message-danger) {
            @apply(--pattern-message-theme);
            background-color: indianred;
        }
    </style>

    <template>
        <div>
            <div class="content-wrapper"><content></content></div>
        </div>
    </template>

    <script>
        Polymer({
            is: 'pattern-message',

            properties: {}
        });
    </script>

</dom-module>
```

# Templates and Pages

Another aspect of web components that I find very attractive is how easy it is to compose objects using the element's local DOM and the light DOM for the element as it is written in the host document.

```markup
<pattern-header></pattern-header>
```

This version of the element will display the object as defined in the template associated to the molecule. It works perfectly when we want to demonstrate what each smaller molecule looks like. We can further customize it by assining CSS classes

Depending on how detailed you want your template to be and how many patterns you want to support you can compose the patterns in the element with individual elements having their own customizations and styles.

```markup
<pattern-header>
    <pattern-logo small></pattern-logo>
    <pattern-menu size="6"></pattern-menu>
    <pattern-search></pattern-search>
</pattern-header>
```

It'll all depend on your comfort level with the technology. Remember that the templates inside the elements use the HTML atoms we are already comfortable with so further breaking it down is a matter of personal preference. We'll go with the more detailed model in the example repository

# Sample Repository

The sample repository [https://github.com/caraya/pattern-library](https://github.com/caraya/pattern-library) is a work in progress for a pattern library that plays with some elements discussed here and I'm using it as a laboratory to experiment with different ideas and concepts.

Ideas in issues, comments and PRs area always welcome :-)

# Links and Resources

## General Resources

- [Getting Started With Pattern Libraries](http://alistapart.com/blog/post/getting-started-with-pattern-libraries) -- A List Apart
- [Pattern Sharing](http://clearleft.com/thinks/165) -- Clearleft
- [Pattern Primer](https://adactio.com/journal/5028/) -- Jeremy Keith
- [Front end style guides](https://24ways.org/2011/front-end-style-guides/) -- 24 ways
- [Pattern Libraries: What They Are and Why You Need One](http://trydesignlab.com/blog/pattern-libraries-what-they-are-and-why-you-need-o/)
- [Responsive Deliverables](http://daverupert.com/2013/04/responsive-deliverables/) -- Dave Rupert
- [Modularity](https://www.w3.org/DesignIssues/Modularity.html) -- Tim Berners-Lee

## Atomic Web Design

- [Atomic Web Design](http://bradfrost.com/blog/post/atomic-web-design/)
- [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/)

## Web Components

- [Web Components: A Tectonic Shift for Web Development](https://www.youtube.com/watch?v=fqULJBBEVQE&ab_channel=GoogleDevelopers)
- [Custom Elements v1: Reusable Web Components](https://developers.google.com/web/fundamentals/getting-started/primers/customelements)
- [Shadow DOM v1: Self-Contained Web Components](https://developers.google.com/web/fundamentals/getting-started/primers/shadowdom)
- [HTML Imports: #include for the web](https://www.html5rocks.com/en/tutorials/webcomponents/imports/)
- [HTML Templates Specification](https://www.w3.org/TR/html5/scripting-1.html#the-template-element)
- HTML's New Template Tag: standardizing client-side templating
- [Styling local DOM in Polymer](https://www.polymer-project.org/1.0/docs/devguide/styling)
- [Using CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables)

## Pattern Libraries

- [A List Apart](http://patterns.alistapart.com/)
- [Mailchimp](http://ux.mailchimp.com/patterns)
- [Code for America](http://codeforamerica.clearleft.com/)
- [USPTO](http://uspto.github.io/designpatterns/docs/)
- [Yahoo](https://developer.yahoo.com/ypatterns/everything.html)
- [IBM Design Language](https://www.ibm.com/design/language/resources/animation-library/)
- [Microsoft](https://developer.microsoft.com/en-us/windows/apps/design)
