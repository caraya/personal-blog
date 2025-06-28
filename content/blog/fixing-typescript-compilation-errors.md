---
title: Fixing Typescript compilation errors
date: 2025-07-21
tags:
  - Typescript
  - Programming
---

Unless you're familiar with Typescript, you might run into compilation errors that don't have immediately obvious fixes. In this post, I will share two common issues I've encountered while working with Typescript and how to resolve them.

## Module resolution errors

I was getting errors when trying to compile my Lit Typescript project with command line `tsc` commands with flags like `outDir`, `--module` and `--target`. The errors were related to module resolution and decorators. Here's how I fixed them.

When you run this command to compile a Lit project that uses Typescript:

```bash
tsc src/site-search.ts \
--outDir dist \
--module node \
--target esnext
```

you are telling the Typescript compiler (`tsc`) to ignore the configuration file (`tsconfig.json`) and only use the options you provided on the command line without merging the remaining settings in the project's `tsconfig.json`. Since the command line doesn't include the `"moduleResolution": "node"` setting from `tsconfig.json`, Typescript doesn't know how to find the lit library inside your `node_modules` folder, which causes the "Cannot find module" errors.

### The Solution

Run the compiler without any flags or arguments since everything is specified in the `tsconfig.json` file.

```bash
npx tsc
```

This command will tell the compiler to automatically find and use the `tsconfig.json` file, which has all the correct settings.

## Be smart about what you include and exclude

Occasionally, my Typescript projects would throw errors like this:

```text
Cannot write file '/site-search/dist/site-search.d.ts' because it would overwrite input file.ts
```

This is a Typescript configuration issue but one that puzzled me until recently.

The error `Cannot write file ... because it would overwrite input file` happens because your Typescript configuration is telling the compiler to both read from and write to the same location, which it won't allow to prevent accidental data loss.

The `"include": ["**/*.ts"]` setting in `tsconfig.json` tells the compiler to look for all `.ts` files in your project.

When you run the build, it creates new files in the `dist` folder. On a subsequent build, the compiler sees the files in `dist` as inputs and then gets confused when it tries to write the outputs to that same folder.

The fix is simple: explicitly tell the compiler to ignore the output directory.

To fix the issue, update the `exclude` property in your `tsconfig.json`.

In the following example, the `tsconfig.json` file the output directory is `dist`. We exclude the `node_modules` and `dist` directories to ensure that the compiler won't try to read from or write to the `dist` folder during the build process.

```json
{
	"compilerOptions": {
		"module": "esnext",
		"target": "esnext",
		"moduleResolution": "node",
		"outDir": "dist", // Output directory for compiled files
		"declaration": true,
		"strict": true,
	},
	"include": [
		"**/*.ts"
	],
	"exclude": [
		"node_modules",
		"dist" // Exclude the output directory to prevent conflicts
	]
}
```

These are trivial errors, but they can be frustrating if you're not familiar with Typescript's configuration and how it handles module resolution and file outputs.

So I'm documenting them here for future reference and to help others who might run into similar issues.
