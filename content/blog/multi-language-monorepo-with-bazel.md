---
title: Multi Language Monorepo with Bazel
date: 2024-07-18
tag:
  - Build
  - Go
  - Javascript
  - Typescript
draft: true
---

This post will discuss how to keep a mono repo with projects written in three languages using Bazel as the common build tool for all three. The languages are:

* Go
* Typescript
* Javascript

I chose these three languages because they are what I'm most familiar with. I also chose to make a distinction between Javascript and Typescript since they require different toolchains and they are written differently.

I chose Bazel because

<https://github.com/bazelbuild/rules_go>

<https://earthly.dev/blog/build-golang-bazel-gazelle/>

<https://bazel.build/docs/bazel-and-javascript>

<https://github.com/aspect-build/rules_js>

<https://github.com/aspect-build/rules_ts>

<https://github.com/aspect-build/rules_rollup>
