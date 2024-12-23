---
title: Multi-language Monorepo with Bazel
date: 2024-07-18
tag:
  - Bazel
  - Go
  - Javascript
  - Typescript
  - PostCSS
draft: true
---

This post will discuss how to keep a mono repo with projects written in multiple languages using Bazel as the common build tool for all four. The languages are:

* Go
* Typescript
* Javascript
* PostCSS

I chose these three languages because they are what I'm most familiar with. I also chose to make a distinction between Javascript and Typescript since they require different toolchains and are written differently.

I chose Bazel because it allows developers to use a single tool across a variety of languages.

Bazel has specific characteristics that I find appealing:

Reproducibility
: Bazel produces pure functional builds where your output files are strictly dependent on your inputs. This gives two important characteristics to your builds.
: Your builds are hermetic, which means only the inputs that you explicitly mention are readable by your build steps.
: Your builds are reproducible. If you’re using a constant set of inputs, Bazel will produce the same build each time.

Scalability
: Bazel’s invention arose from one of Google’s internal build tools, Blaze. Within Google itself, Bazel handles builds for projects containing more than 100K source files
: While it advocates the monorepo pattern, it handles microservices architecture just as easily. Dropbox used Bazel to scale their CI/CD pipelines to mitigate the number of tests executed on their commits. Uber also adopted Bazel to scale their Go monorepo. They leveraged Bazel’s hermetic builds to support incremental build generation that supports their distributed infrastructure.

Declarative programming
: Writing build configurations for projects should be as simple as possible. Bazel is built using Starlark, a high-level language derived from Python. Thus it gives developers a more convenient way to write build configurations and properties that are easily readable. Additionally, the abstraction in Bazel saves developers from dealing with complicated stuff like compilers and linkers.

Parallelism and caching: Build tools at scale have to be high performant. Bazel speeds up your builds using a caching mechanism. It intelligently compares your subsequent builds with your previous cached builds and only builds those files which the developers updated. This ensures that Bazel only spends your CPU resources on building those pieces of your project that need to be re-built. Bazel also allows you to generate concurrent builds in a parallel fashion to save time across your distributed codebase. You can generate parallel builds on both a single machine as well as across multiple machines remotely.

## Building a project with Bazel

### Backend in Go

<https://medium.com/@simontoth/golang-with-bazel-2b5310d4ce48>

<https://bazel-contrib.github.io/SIG-rules-authors/go-tutorial.html>

#### Cross-compiling Go to WASM

### Front-end in Javascript

<https://github.com/aspect-build/rules_js>

<https://github.com/aspect-build/rules_ts>

<https://github.com/aspect-build/rules_rollup>

<https://github.com/aspect-build/rules_terser>

<https://github.com/aspect-build/rules_jest>

## Styling: PostCSS

<https://github.com/bazelbuild/rules_postcss>


## Extending Bazel

<https://github.com/bazelbuild/starlark/>

## The full workspace file
