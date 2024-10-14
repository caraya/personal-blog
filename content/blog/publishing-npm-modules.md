---
title: Publishing NPM modules
date: 2024-10-23
tags:
  - Javascript
  - Bundling
  - CommonJS
  - ESM
  - Reference
---

Publishing NPM modules has become progessively more complex over time (go figure). We now have to contend with ESM versus Common JS, Typescript versus Javascript, setting a default module type, and other considerations.

The first decision is to use Typescript as my development language to ensure type safety.

There is additional items that need to be added to package.json in order for it to work with common.js and ESM.

Finally, we'll discuss different tools available to make the process easier.

## Setting Up And Writing The Code

The first step is to initialize an empty `package.json` file:

```bash
npm init --yes
```

Next we install the necessary packages. It's a two-step process. One to install regular packages and another to install developer dependencies.

```bash
npm i lit
npm i -D typescsript tsup
```

Nex, we handle the Typescript configuration in a JSON file (`tsconfig.json`). We can either create one from scratch or run `tsc --init` and then edit it to make sure the values below are included.

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
  }
}
```

`tsup.config.js`

```js
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts'
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
})
```

`lit` component example

```typescript
import {
  LitElement,
  css,
  html
} from 'lit';

import {
  customElement,
  property
} from 'lit/decorators.js';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  // Define scoped styles right with your component, in plain CSS
  static styles = css`
    :host {
      color: blue;
    }
  `;

  // Declare reactive properties
  @property()
  name?: string = 'World';

  // Render the UI as a function of component state
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
```

Instead of using the Typescript compiler, we'll use [Tsup](https://tsup.egoist.dev/)

```bash
 npx tsup src/index.mts --format cjs,esm --dts --clean --sourcemap
```

## Updating and Linting package.json

The hardest part is making sure that we set up the `package.json` correctly to handle both CJS and ESM modules at the same time.

This is the correct `package.json` block with a `src/index.ts` root file that supports both ESM and CJS modules.

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    "import": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "require": {
      "types": "./dist/index.d.cts",
      "require": "./dist/index.cjs"
    }
  }
}
```

This gets complicated so we'll break it down in sections

* The `type` (singular) field indicates that the package supports ESM modules
* The `main` field shows the entry point for CJS modules
* The `module` field indicates the entry point for ESM modules
* The `types` (plural) field points to the type definitions file for ESM modules

We then set up the `exports` field to support both ESM and CJS modules. The `import` field is set up to support ESM modules and the `require` field is set up to support CJS modules. In each, the `types` field is set to the relevant type definitions file &mdash; the types comes first.

This is complicated so we'll use a third-party linter, [Are the Types Wrong](https://arethetypeswrong.github.io/) to lint the `package.json` file. This tool checks your `package.json` file to ensure that it's set up correctly for publishing a package that supports both ESM and CJS modules.

 ```bash
 npx --yes @arethetypeswrong/cli --pack .
 ```

## Setting a Git Repo

I normally leave the Github repository creation and pushing content to it

Initialize the Git repository.

```bash
git init
```

Run the following command to create a `.gitignore` file and append `node_modules` to it.

```bash
echo "node_modules" >> .gitignore
```

Add all files to the repository and commit the files to the new repository with a message.

```bash
git add .
git commit -m "Initial commit"
```

Use the [Github CLI](https://cli.github.com/) to create the remote repository under your Github account.

```bash
gh repo create rw-greeting --source=. --public
```

Lastly we push the local repo to Github making sure we set the remote repository using `--set-upstream`.

```bash
git push --set-upstream origin main
```

I will not cover how to publish to NPM. We can also [install Node packages from github](https://www.pluralsight.com/resources/blog/guides/install-npm-packages-from-gitgithub) or download it and link to it locally.

## Links and References

* [Dual Publishing ESM and CJS Modules with tsup and Are the Types Wrong?](https://johnnyreilly.com/dual-publishing-esm-cjs-modules-with-tsup-and-are-the-types-wrong)
* [How To Create An NPM Package](https://www.totaltypescript.com/how-to-create-an-npm-package)
