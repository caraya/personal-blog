---
title: Solving Dependency Vulnerabilities With Overrides
date: 2025-08-11
tags:
  - Web Development
  - Node
  - Security
---

One of the biggest pain in working with Node.js is dealing with dependency vulnerabilities that you can't fix because they are in a transitive dependency (a dependency of your direct dependencies). This is where the [overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides) feature in npm comes to the rescue.

This post will look at overrides, how they work, how you can use them to fix security audit issues, and

## What Are Overrides?

Overrides allow you to install a specific version of a transitive dependency, providing a temporary fix for security audit issues, that you have no control over.

You could brute force a fix by running `npm audit fix --force`, but this can lead to breaking changes in your direct dependencies, which is risky and can break the application.

When you run `npm audit`, it often flags vulnerabilities in packages you don't directly control and running the fix, `npm audit fix`, can't automatically resolve these because it would require a breaking change in one of your main dependencies.

The overrides feature gives you the power to manually fix it.

## How It Works

The overrides feature lets you specify an exact version of a nested dependency that npm must use, overriding the version specified by other packages in your dependency tree.

## Example: Fixing a Vulnerability

Let's say you `run npm audit` and get the following report:

```bash
semver  <7.5.2
Severity: moderate
Arbitrary Code Execution - <https://github.com/advisories/GHSA-c2qf-rxjj-qqgw>
fix available via `npm audit fix --force`
Will install webpack@5.76.0, which is a breaking change
node_modules/semver
  less-loader  *
  Depends on vulnerable versions of semver
  node_modules/less-loader
    webpack  >=2
    Depends on vulnerable versions of less-loader
    node_modules/webpack
```

Here, the `semver` package is vulnerable. The report suggests a fix that involves a breaking change in webpack, which might be risky.

Instead, you can directly override `semver` to the patched version (e.g., 7.5.2 or higher).

Add the overrides block to your package.json:

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "dependencies": {
    "webpack": "5.75.0"
  },
  "overrides": {
    "semver": "7.5.2"
  }
}
```

Run `npm install` for the override to take effect. NPM will now ensure that every package requiring semver gets version 7.5.2.

Overrides may also help solve conflicts when multiple packages depend on different versions of the same package.

For example: if you have two packages that depend on different versions of React, the override will ensure that both packages use the same version, which can help avoid some issues but may also introduce new ones if the override version is significantly different than the versions in the plugins.

Run `npm audit` again to verify the fix. The vulnerability should now be resolved.

## Important Considerations

* **Compatibility**: Forcing a package version can sometimes cause compatibility issues if the parent dependency is not designed to work with the new version. Always test your application thoroughly after applying an override.
* **It may not always work**: Not all advisories provide a version that solves the problem either because all available versions are vulnerable or because a version that fixes the issue has not been released yet.
* **Temporary Solution**: An override is a temporary fix. The best long-term solution is for your direct dependency to update its own dependency list. You should periodically check if the overrides are still necessary.
