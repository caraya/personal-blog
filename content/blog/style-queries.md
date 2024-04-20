---
title: Style Queries
date: 2024-06-30
tags:
  - CSS
---

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
