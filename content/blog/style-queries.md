---
title: Style Queries
date: 2024-04-24
tags:
  - CSS
---

In the previous article, we discussed `inline-size` container queries. There is another type of container query: style queries.

There are some significant differences

Unlike `inline-size` queries, every element is a style query container.

You can also use CSS conditional properties (AKA: CSS variables) as the condition in the style query.

We first define the condition in the parent element, in this case `article-wrapper`.

We then define the style query in the `.article` child element and include the styles we want to highight the featured article.

```css
.article-wrapper {
  --featured: true;
}

.article {
  @container style(--featured: true) {
    /* Custom CSS */
  }
}
```

You can include multiple style queries for the same element.

In the example below we create two feature flags by assigning them to CSS classes; one for featured articles and one for recently updated pieces.

The featured style query changes the background color for the story and inserts an `Featured Content` string before the heading.

The updated story query inserts a string (`Updated`) before the article title and changes the background to a different color.

```css
.featured-article {
  --featured: true;
}

.updated-article {
  --updated: true;
}

.article {
  inline-size: 70ch;
  line-height: 1.3;
  padding: 1rem;

  @container style(--featured: true) {
    background: oklch(0.73 0.16 238 / 0.25);

    h1:before {
      font-weight: 900;
      font-size: 110%;
      content: "(Featured Content) ";
    }
  }

  @container style(--updated: true) {
		background: oklch(1 1 270 / 0.25);

    h1:before {
      font-weight: 900;
      font-size: 110%;
      content: "(UPDATED!) ";
    }
  }
}
```

Combining them with size queries, style queries give us flexibility when building components for our applications. It's worth exploring these technologies further.
