---
title: Baseline Web Components
date: 2024-11-20
tags:
  - Design
  - Web Components
baseline: true
---

Baseline is an interesting initiative

The Web Platform Developer Experience group created the [baseline-status](https://github.com/web-platform-dx/baseline-status) web component to display data regarding the baseline status of a given feature.

This could be useful when discussing a feature in a post since it provides a visual cue as to what major browsers supports the feature.

The structure of the component is simple. It has one parameter, the feature ID for the desired feature as it's found in the [web features explorer](https://web-platform-dx.github.io/web-features-explorer/) site.

The component requires one attribute, the name of the feature in the `featureId` attribute.

The following examples show how the component works.

This is what it looks like when the feature is not widely available:

<baseline-status featureId="abs-sign"></baseline-status>

This feature is newly available on baseline:

<baseline-status featureId="request-video-frame-callback"></baseline-status>

And this feature is widely available:

<baseline-status featureId="appearance"></baseline-status>

## Adding the component

In our root template we add the following block to load the script conditionally if the feature is enabled in the post's frontmatter.

{% raw %}
```handlebars
{% if baseline %}
<script
	src="https://cdn.jsdelivr.net/npm/baseline-status@1.0.8/baseline-status.min.js"
	type="module"></script>
{% endif %}
```
{% endraw %}

Then, for every post that we want to use the component in, we add the following snipet to the front matter section.

```yaml
baseline: true
```
