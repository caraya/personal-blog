---
title: "Using cascade layers"
date: "2023-07-24"
---

The `@layer` at-rule manages CSS cascade layers, a way for authors to control specificity and order of appearance.

This is important because those are two determining factors a browser considers when applying an element's style.

Working with the cascade is one of the biggest pain points for developers so it would be awesome if we had a built-in way to manage it.

To understand cascade layers, we need to understand origins as browsers use the term. When the browser composites styles, there are three primary origins:

1. **User-Agent origin**: The default styles applied by the browser
2. **Author origin**: The stylesheets you add to your website.
3. **User origin**: Styles that browsers may allow providing as preferences such as default font, font size, and color

Additionally, both transitions and animations are considered origins due to the “virtual“ rules they create while running.

These origins are the first thing the browser uses to determine which rule in the cascade will be applied to a given element.

For each origin the browser also considers whether a definition uses the !important attribute, which changes the order of origins to check. When we add !important to the existing origins, their order changes to:

1. important User-Agent origin
2. important User origin
3. important Author origin
4. normal Author origin
5. normal User origin
6. normal User-Agent origin.

The cascade sorting order determines the styles that the browser will apply when looking at what rules to apply to an element. The order is based on a variety of items: The origin of the stylesheet and whether the origin uses the `!important` attribute.

| Order (high to low) | Origin | Importance |
| --- | --- | --- |
| 8 | CSS transitions |  |
| 7 | user-agent (browser) | !important |
| 6 | user | !important |
| 5 | author (developer) | !important |
| 4 | CSS @keyframe animations |  |
| 3 | author (developer) | normal |
| 2 | user | normal |
| 1 | user-agent (browser) | normal |

The browser will look for an applicable rule at each level and will stop looking when an usable rule is found so the lower levels will not be considered, even if they have matching rules.

If there are two or more rules in the same origin that affect the same element, the browser will look at the specificity of the rules. The more specific rule win.

For a good visual explainer of specificity see Estelle Weyl's [specifishity](https://specifishity.com/)

If there are two or more rules with the same specificity, we look at the order of appearance: "last declaration wins"

I know, it's a lot to retain, but it's important. Really.

With all the information about how the browser decides what styles to apply to your page, we can look at @layers, what they are and how they work

Cascade Layers provide a way to control the CSS cascade and the styles' precedence order to create more predictable results. You can add all your site's styles to layers or you can gradually add layers to your project as you refactor and test your stylesheets. All the styles outside a layer are grouped together in an anonymous layer that is "placed" last in document order, making it the most specific one.

The most basic way to use @layers is to create the layers and use them immediately.

```css
@layer design.system {
  /*
    design.system styles go here
  */
}

@layer demo.support {
  /*
    demo.support styles go here
  */
}

@layer demo.project {
  /*
    demo.project styles go here
  */
}

/* 
  There is a virtual @layer here 
  with all the content we didn't
  explicitly put on layers 
*/
```

Another way to use layers `@layer`s is a two-step process:

1. create the layers
2. use the layers you created

When we use this method, the order of the layers matters since the order we declare the layers in will be the order the browser willfor precedence of the layers

```css
/* 1 */
@layer design.system demo local.changes;

/* 2 */
@layer design.system {
  /*
    design.system styles go here
  */
}

@layer demo {
  /*
    demo styles go here
  */
}

@layer local.changes {
  /*
    local.changes styles go here
  */
}
```

You can also import styles directly into layers. These layers, taken from a Codepen by Adam Argyle show one possible way to organize your site using @layers for imported content.

The imports can be from local files or from remote CDNs like unpkg or jsDelivr.

```css
@import "https://unpkg.com/open-props" layer(design.system);
@import "https://unpkg.com/open-props/normalize.min.css" layer(demo.support);

@layer demo.support {
  /* 
    You can assign more styles to
    the layers you created at
    import time 
  */
}
```

As with many newer features, it may take a while to figure out how to make the best use of layers on your site. As more developers use the technology, best practices and recommended usage will emerge; we're just not there yet.

## Links and Resources

- [Introducing the CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)
- [Getting Started With CSS Cascade Layers](https://www.smashingmagazine.com/2022/01/introduction-css-cascade-layers/)
