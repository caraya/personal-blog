---
title: Clean way to install NPM packages
date: 2025-08-18
tags:
  - NPM
  - Node
  - Javascript
  - Development
---

One of my biggest frustrations in Node.js development is when your project works on your machine but breaks somewhere else. A common cause is package inconsistency between environments, even with a `package.json` file. Updating, removing, or installing packages can lead to a `node_modules` directory that doesn't perfectly match what's defined.

The standard fix &mdash; deleting node_modules and `package-lock.json` before running `npm install` again &mdash; is cumbersome. This is the exact problem `npm ci` (for clean install) was designed to solve.

This post will explain what npm ci is, how it differs from npm install, and how to use it effectively in your workflow.

## What is npm ci?

The `npm ci` command provides a clean, reliable, and fast way to install dependencies. It's designed for automated environments like continuous integration (CI), testing platforms, and deployments, where predictable and repeatable builds are essential.

Instead of resolving dependencies based on `package.json`, `npm ci` installs packages directly from the `package-lock.json` file. This guarantees that you get the exact same version of every package, every single time. To ensure a truly clean slate, it automatically deletes any existing `node_modules` directory before starting the installation.

While it's perfect for automation, `npm ci` is also incredibly useful during development. A common workflow is:

1. Modify your `package.json` with new dependencies.
2. Run `npm install` to update your `package-lock.json`.
3. Commit both the `package.json` and `package-lock.json` files.
4. Run `npm ci` to ensure your local `node_modules` is a perfect mirror of your `package-lock.json`, just as it will be in production.

## npm ci vs. npm install

The key differences between `npm ci` and `npm install` are:

* **Source of Truth**: `npm ci` uses only `package-lock.json` or `npm-shrinkwrap.json` to install dependencies. `npm install` uses `package.json` and updates the lock file accordingly.
* **Lock File Requirement**: `npm ci` requires a `package-lock.json` to exist. If it's missing, `npm ci` will exit with an error. `npm install` will create one if it's not there.
* **Error Handling**: If your `package.json` and `package-lock.json` are out of sync, `npm ci` will exit with an error instead of trying to update the lock file.
* **Immutability**: `npm ci` never writes to `package.json` or `package-lock.json`. Your project files are never modified.
* **Clean Slate**: `npm ci` always deletes `node_modules` before installing to prevent any inconsistencies.
* **Package Management**: You cannot use `npm ci` to add, update, or remove individual packages (e.g., `npm ci express`). It only installs the entire project at once.

!!! note Note:
If you use special flags like `--legacy-peer-deps` when running `npm install`, you must use the same flags with `npm ci`. An easy way to enforce this is to create a `.npmrc` file in your project with these settings (e.g., `legacy-peer-deps=true`) and commit it to your repository.
!!!

## Using npm ci with Overrides

The overrides feature in package.json lets you enforce a specific version of a nested dependency, which is great for patching security vulnerabilities. However, `npm ci` introduces an important consideration.

Since `npm ci` relies exclusively on `package-lock.json` and never modifies it, the overrides must already be reflected in the lock file for `npm ci` to apply them. If the lock file is out of sync with the overrides in `package.json`, `npm ci` will fail.

To use overrides correctly with `npm ci`, follow these steps:

**Define Overrides in package.json**: Add or update the overrides field with the dependency versions you need.

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "dependencies": {
    "some-package": "^1.0.0"
  },
  "overrides": {
    "a-nested-dependency": "1.2.3"
  }
}
```

**Update the Lock File**: Run `npm install`. This command reads the overrides from `package.json` and updates `package-lock.json` to reflect the changes.

**Commit the Lock File**: Commit the updated `package-lock.json` to your version control system. It now serves as the single source of truth.

**Run npm ci**: Now, you and your CI/CD pipeline can run `npm ci`. It will read the updated lock file and install the exact overridden versions, ensuring a consistent and predictable installation.

The extra `npm install` step is necessary because it's the only command that can translate the intent from `package.json` into the concrete dependency tree stored in `package-lock.json`.
