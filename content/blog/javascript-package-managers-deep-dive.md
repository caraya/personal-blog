---
title: Javascript Package Managers Deep Dive
date: 2025-12-24
tags:
  - Javascript
  - Node.js
  - Package Managers
---

Ever since Node was introduced, it has always included a package manager to handle dependencies. For many years NPM was the only game in town, but over time several alternatives have emerged, each with its own strengths and weaknesses.

This analysis explores the four major players: NPM, Yarn (Classic), PNPM, and Yarn2 (Berry).

## Introduction: What is a Package Manager?

In the JavaScript ecosystem, a package manager is an essential tool that automates the process of installing, updating, configuring, and removing "packages"—reusable pieces of code (libraries, frameworks, tools) that projects depend on. It reads a manifest file (usually package.json) to understand a project's dependencies and manages them, ensuring the correct versions are installed and conflicts are resolved.

## NPM (Node Package Manager)

What It Is:

NPM is the original and default package manager for Node.js. It's the largest ecosystem of open-source packages in the world. When you install Node.js, NPM is installed with it.

When It Was Created:

NPM was first released in January 2010, created by Isaac Z. Schlueter.

How to Use It (Common Commands):

* Initialize a project: `npm init`
* Install dependencies from package.json: `npm install` (or `npm i`)
* Add a production dependency: `npm install <package-name>`
* Add a development dependency: `npm install <package-name> --save-dev` (or `-D`)
* Remove a dependency: `npm uninstall <package-name>`
* Run a script from package.json: `npm run <script-name>`
* Update packages: `npm update`

**Working with Workspaces**:

NPM introduced native support for workspaces in version 7 (released in 2020). Workspaces are a way to manage multiple packages within a single top-level root repository (a "monorepo").

Define workspaces in your root package.json:

```json
{
  "name": "my-monorepo",
  "workspaces": [
    "packages/app",
    "packages/library"
  ]
}
```

Common Workspace Commands:

* `npm install`: Installs all dependencies for all workspaces and links them.
* `npm run <script-name> --workspace=<workspace-name>`: Runs a script in a specific workspace (e.g., `npm run test --workspace=app`).
* `npm run <script-name> --workspaces`: Runs a script in all workspaces that have it.
* `npm install <package-name> --workspace=<workspace-name>`: Adds a dependency to a specific workspace.

Pros:

* **Ubiquity**: Bundled with Node.js, making it the universally available standard.
* **Largest Registry**: Provides access to the world's largest collection of software packages.
* **Simplicity**: Easy to understand and use for basic projects.
* **Vast Community**: Massive user base means extensive documentation, tutorials, and community support.
* **Native Workspaces**: Now has solid, built-in monorepo support.

Cons:

* **Historical Performance Issues**: Historically (pre-v5), NPM was slow and created non-deterministic builds (installs could vary between machines).
* **Disk Space**: The node_modules folder can become enormous and deeply nested, consuming significant disk space.
* **"Phantom Dependencies"**: The flat node_modules structure (introduced in v3) allows code to require() packages that aren't explicitly listed in package.json, as they are dependencies of dependencies. This creates fragile projects.

## Yarn (Classic - v1)

What It Is:

Yarn (often called "Yarn Classic" to distinguish it from v2+) was created by Facebook (now Meta) as a direct response to NPM's shortcomings in 2016. It aimed to provide faster, more reliable, and more secure dependency management.

When It Was Created:

Yarn was publicly released in October 2016.

How to Use It (Common Commands):

Yarn 1 adopted NPM's commands but with slightly different, often faster, syntax.

* Initialize a project: `yarn init`
* Install dependencies from package.json: `yarn install` (or just `yarn`)
* Add a production dependency: `yarn add <package-name>`
* Add a development dependency: `yarn add <package-name> --dev` (or `-D`)
* Remove a dependency: `yarn remove <package-name>`
* Run a script from package.json: `yarn <script-name>` (no run needed)
* Update packages: `yarn upgrade`

Working with Workspaces:

Yarn 1 was one of the first package managers to popularize monorepo support with its "Workspaces" feature.

Configuration: Define workspaces in your root package.json:

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

Common Commands:

* `yarn install`: Installs all dependencies for all workspaces.
* `yarn workspace <workspace-name> <script-name>`: Runs a script in a specific workspace (e.g., `yarn workspace app test`).
* `yarn workspaces run <script-name>`: Runs a script in all workspaces.
* `yarn workspace <workspace-name> add <package-name>`: Adds a dependency to a specific workspace.

**Pros**:

* **Performance**: Significantly faster than older NPM versions due to parallel package installation and a global cache.
* **Determinism**: Introduced the yarn.lock file, which "locks" the exact versions of all dependencies, ensuring that every install on any machine results in the exact same node_modules structure. (NPM later adopted this with package-lock.json).
* **Offline Mode**: Can install packages from its cache without an internet connection if they've been downloaded before.
* **Workspaces**: Excellent, built-in support for monorepos (managing multiple projects within a single repository).

**Cons**:

* **Added Tooling**: Requires a separate installation (it's not bundled with Node.js).
* **Fragmentation**: Its introduction split the community, forcing developers and CI/CD systems to support both NPM and Yarn.
* **Still node_modules**: While faster, it still uses the same flat node_modules structure as NPM, inheriting the "phantom dependency" problem.

## PNPM (Performant NPM)

What It Is

PNPM is a package manager that focuses on speed and, most importantly, disk space efficiency. Its primary innovation is how it structures the node_modules directory.

When It Was Created

The first version of PNPM was released in 2016, but it gained significant traction in more recent years as projects grew larger.

How to Use It (Common Commands)

PNPM's commands are very similar to NPM's.

* Initialize a project: `pnpm init`
* Install dependencies from package.json: `pnpm install` (or `pnpm i`)
* Add a production dependency: `pnpm add <package-name>`
* Add a development dependency: `pnpm add <package-name> --save-dev` (or `-D`)
* Remove a dependency: `pnpm remove <package-name>`
* Run a script from package.json: `pnpm <script-name>` (like Yarn) or `pnpm run <script-name>` (like NPM)
* Update packages: `pnpm update`

Working with Workspaces

PNPM has robust, first-class support for workspaces, which integrates perfectly with its symlinking storage model for maximum efficiency.

Configuration: Define workspaces in a `pnpm-workspace.yaml` file in your project root:

```yaml
packages:
  - 'packages/*'
  - 'shared/**'
```

Common Commands:

* `pnpm install`: Installs all dependencies for all workspaces.
* `pnpm --filter <workspace-name> <script-name>`: Runs a script in a specific workspace (e.g., `pnpm --filter app test`). PNPM has powerful filtering syntax.
* `pnpm --recursive <script-name>`: Runs a script in all workspaces (e.g., `pnpm -r test`).
* `pnpm --filter <workspace-name> add <package-name>`: Adds a dependency to a specific workspace.

Pros

* **Massive Disk Space Savings**: This is its key feature. PNPM stores all packages in a single, content-addressable store on your machine. In your project's node_modules, it only creates symbolic links (symlinks) to these packages. If 10 projects use lodash@4.17.21, it's only stored once on your disk.
* **Fast Installation**: Because packages are just linked, installs (especially subsequent ones) are extremely fast.
* **Solves "Phantom Dependencies"**: PNPM's node_modules structure is not flat. Your code can only access packages explicitly listed in package.json. This creates stricter, more reliable projects.
* **Excellent Monorepo Support**: Strong, built-in support for workspaces with advanced filtering.

Cons

* **Symlink Compatibility**: The symlink-based approach can, in rare cases, cause issues with tools that don't correctly resolve symbolic links. This is much less of a problem today than it was in the past.
* **Learning Curve**: The node_modules structure is non-standard and can be confusing to debug at first if you're used to NPM/Yarn's flat layout.

## Yarn2 (Berry)

What It Is

Yarn2 (codenamed "Berry") is a complete, ground-up rewrite of Yarn. It is not just "Yarn v2" but a fundamentally new tool with a new philosophy. Its most radical feature is Plug'n'Play (PnP).

When It Was Created

Yarn2 was released in January 2020.

How to Use It (Common Commands)

It maintains similar commands to Yarn 1, but its setup is different.

Enable in a project: `yarn set version berry` (This installs Yarn Berry into your project in a `.yarn/` folder).

* Install dependencies: `yarn install`
* Add a dependency: `yarn add <package-name>`
* Run a script: `yarn <script-name>`

Working with Workspaces

Workspaces are a core feature of Yarn Berry, designed to work seamlessly with Plug'n'Play.

Configuration: Define workspaces in your root package.json, just like Yarn 1:

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

Common Commands:

* `yarn install`: Installs all dependencies for all workspaces.
* `yarn workspace <workspace-name> <script-name>`: Runs a script in a specific workspace (e.g., yarn workspace app test).
* `yarn workspaces foreach run <script-name>`: Runs a script in all workspaces.
* `yarn workspace <workspace-name> add <package-name>`: Adds a dependency to a specific workspace.

Pros

* **No node_modules (with PnP)**: Plug'n'Play mode gets rid of the node_modules folder entirely. Instead, it generates a single .pnp.cjs file that tells Node.js exactly where to find every package (which are stored in a .yarn/cache folder as zip files).
* **Instantaneous Installs**: With PnP, "installs" are near-instant because it's just updating the .pnp.cjs mapping file, not copying thousands of files.
* Strictest Dependency Management: PnP makes "phantom dependencies" impossible. If it's not in package.json, your code cannot access it, period.
* **Faster Script Execution**: Project scripts (yarn test, yarn build) start faster because Node.js doesn't need to perform thousands of I/O operations to find files in node_modules.
* **Excellent Monorepo Support**: Workspaces are a first-class citizen.

Cons

* **Major Compatibility Issues**: This is the biggest hurdle. Any tool that makes assumptions about the node_modules folder (like older versions of TypeScript, ESLint, or React Native) will break. While many tools now support PnP, it's not universal and requires configuration.
* **Steep Learning Curve**: PnP is a completely new paradigm. Debugging it is unfamiliar, and it requires "patching" incompatible dependencies, which Yarn can sometimes do automatically (yarn pnpify).
* **"Node-Modules" Mode**: To mitigate compatibility issues, Yarn2 can be run in a node-modules mode, which works similarly to PNPM (using symlinks). However, this disables the primary PnP feature.

## Comparative Analysis

| Feature  | NPM (v7+) | Yarn 1 (Classic) | PNPM | Yarn2 (Berry) |
| --- | --- | --- | --- | --- |
| node_modules | Flat | Flat | Symlinked (Isolated) | None (Plug'n'Play) |
| Disk Space | High | High | Excellent (Lowest) | Very Good |
| Install Speed | Good | Good | Excellent (Fastest) | Excellent (Fastest) |
| Lockfile | package-lock.json | yarn.lock | pnpm-lock.yaml | yarn.lock |
| Determinism | Yes | Yes | Yes | Yes |
| Phantom Dependencies | Problem | Problem | Solved | Solved |
| Offline Mode | Yes (via cache) | Yes (via cache) | Yes (via store) | Yes (via cache) |
| Workspaces | Good | Good | Excellent | Excellent |

## Detailed Breakdown

### Performance and Disk Space

**NPM & Yarn 1**: Both are similar. They copy all package files into your project's `node_modules`. This is slow and uses a lot of disk space.

**PNPM**: The clear winner on disk space. By using a central store and symlinks, it's both fast and incredibly efficient.

**Yarn 2**: With PnP, it's a different beast. It stores packages as zip files in a project-local cache. This is very fast (no I/O bottleneck) but can use more space per-project than PNPM (though less than NPM/Yarn 1).

### Dependency Resolution (The node_modules Problem)

**Phantom Dependencies**: NPM and Yarn 1 create a flat node_modules, so if package-A depends on package-B, your code can require('package-B') even if you never added it. If package-A removes or changes its dependency on package-B, your project breaks.

**PNPM's Solution**: PNPM's symlink structure means your code can only see the packages you directly added. It solves the phantom dependency problem.

**Yarn 2's Solution**: PnP is the strictest. It generates a map of what's allowed. If you try to require something not in your package.json, Node.js will throw an error immediately.

### Other Package Managers to Consider

While this analysis focuses on the "big four," the landscape is always evolving. Another major player has recently emerged:

**Bun** is not just a package manager; it's an all-in-one JavaScript runtime, bundler, test runner, and package manager. Its package manager component (bun install, bun add) is designed to be an extremely fast, drop-in replacement for NPM/Yarn.

* **Pros**: Unbelievable speed (often 20-100x faster installs than NPM/Yarn), aims for full NPM compatibility, and provides a complete, integrated toolset.
* **Cons**: It's much newer (1.0 released in late 2023) and less battle-tested than the others. While it aims for compatibility, some edge cases or complex projects may still encounter issues.

## Conclusion: Which One Should You Use?

* **For Beginners or Small Projects**: NPM is perfectly fine. It's built-in, simple, and does the job.
* **For Legacy Projects**: Yarn 1 (Classic) is still a stable, reliable choice if your project is already using it.
* **For Most New Projects (Solo or Team)**: PNPM is arguably the best "all-around" choice today. It's extremely fast, saves massive amounts of disk space, and fixes the "phantom dependency" problem, leading to more robust projects. It's a "better NPM" without the radical changes of Yarn2.
* **For the "Bleeding Edge" or Large Monorepos**: Yarn2 (Berry) offers the most advanced features. If you can overcome the compatibility hurdles, its PnP mode provides the strictest guarantees and fastest script performance, which can be a huge benefit in large-scale monorepos.

Bun is an exciting and disruptive technology that merits continued attention. While perhaps not the safest bet for a critical production system today, its speed is undeniable and it's worth experimenting with for new projects.
