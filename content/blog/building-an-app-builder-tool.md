---
title: Building an App builder tool
date: 2025-06-09
tags:
  - Javascript
  - Typescript
  - Tools
  - Builder
---

Creating the same type of Vite-based applications is tedious and repetitive, even when it's the same Vite command.

This post will cover one way to create a builder tool for Vite-based applications. It will also cover how to add utilities like Prettier, ESLint, and Playwright to the project.

## How

The NPM [init](https://docs.npmjs.com/cli/v9/commands/npm-init) command allows you initialize remote packages, like a Vite project, either from an NPM package or a GitHub repository.

For eaxmple, the following command will create a new Vite project using the React template:

```bash
npm create vite@latest my-vite-app -- --template react
```

This command will create a new directory called `my-vite-app` and initialize it with the React template from Vite. This process has replaced the older `create-react-app` command.

The process to create this builder package is to create it just like any other Node project.  Because I'm using Typescript I will use `tsx` to run the code and `tsup` to transpile the code to Javascript that will be execute when we run the code through `npm init`.

### The script

The script will ask the user a series of questions and then create a Vite project based on the answers.

We will not include the templates for each project, but they will be included in the companion repository.

In the first part of the script, we import all required modules and write functions to emulate CommonJS's `__filename` and `__dirname` variables that are not available in ES modules.

```typescript
import {
  readdirSync,
  readFileSync,
  statSync,
  mkdirSync,
  writeFileSync
} from 'node:fs';
import {
  dirname,
  resolve,
  join
} from 'node:path';
import {
  fileURLToPath
} from 'url'
import {
  Package,
  DependencyCollection
} from "@manuth/package-json-editor";
import prompts from 'prompts';

// emulate CommonJS __filename & __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
```

In the main function we create the prompts and add packages based on the results.

We first select the framework: Vue, React, vanilla Typescript and vanilla Javascript.  Vanilla Typescript and Javascript are not frameworks but are treated like one for this script. We also check if we want to use a route with Vue and React.

We then ask the user if they want to install supporting libraries: Playwright for testing, Prettier for code formatting, and ESLint for code linting and fixing errors. The default is not to install any of them unless the user specifies otherwise.

```typescript
async function main() {
  const cwd = process.cwd();

  // 1. Select framework
  const { framework } = await prompts({
    type: 'select',
    name: 'framework',
    message: 'Select a framework:',
    choices: [
      { title: 'Vue', value: 'vue' },
      { title: 'React', value: 'react' },
      { title: 'Vanilla TS', value: 'ts' },
      { title: 'Vanilla JS', value: 'js' }
    ],
    initial: 0
  });

  let useRouter = false;
  if (framework === 'vue' || framework === 'react') {
    const res = await prompts({
      type: 'confirm',
      name: 'useRouter',
      message: `Install ${framework === 'vue' ? 'Vue Router' : 'React Router'}?`,
      initial: true
    });
    useRouter = res.useRouter;
  }

  // 2. Tooling
  const { playwright, prettier, eslint } = await prompts([
    {
      type: 'confirm',
      name: 'playwright',
      message: 'Install Playwright test?',
      initial: false
    },
    {
      type: 'confirm',
      name: 'prettier',
      message: 'Install Prettier?',
      initial: false
    },
    {
      type: 'confirm',
      name: 'eslint',
      message: 'Install ESLint?',
      initial: false
    }
  ]);
```

We create the `package.json` file using the `@manuth/package-json-editor` package. This package allows us to create a package.json file and add dependencies to it.

We set up the initial set of packages that will be installed by default: Vite (the build system), Typescript (for all projects), and @types/node (to provide Typescript types for Node.js).

We install the current version of the packages using the `>=` operator to install the latest version of each package to ensure that the project is always up to date, rather than pin to a specific version.

We also configure the scripts for the package. These will be run with `npm run <script>`.

```typescript
  // 3. Assemble package.json for the new project
 const pkg = new Package({
    name: 'my-app',
    version: '0.1.0',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview'
    },
    dependencies: {},
    devDependencies: {
      vite: '>=6.3.5',
      typescript: '>=5.3.8',
      '@types/node': '>=22.15.21'
    }
  });
```

Now that we have the package.json file we can add dependencies based on the framework selected.

When the user selects to install a router, we add the router package to the devDependencies.

```typescript
  // 4. Framework dependencies
  if (framework === 'vue') {
    pkg.Dependencies.Add('vue','>=3.15.14');
    pkg.DevelopmentDependencies.Add('@vitejs/plugin-vue', '>=5.2.4');
    if (useRouter) {
      pkg.DevelopmentDependencies.Add('vue-router', '>=4.5.1')
    }
  } else if (framework === 'react') {
    pkg.Dependencies.Add('react', '>=19.0.1');
    pkg.Dependencies.Add('react-dom', '>=19.0.1');
    pkg.DevelopmentDependencies.Add('@vitejs/plugin-react', '>=4.4.1');
    if (useRouter) {
      pkg.Dependencies.Add('react-router-dom', '>=7.6.0');
    }
  }
```

We install tooling dependencies based on user selection as `devDependencies`.

If installing ESLint, we also install the ESLint plugins for CSS, JS, JSON, Markdown, and Typescript. These plugins are used to lint the respective files in the project.

```typescript
if (playwright) {
    pkg.DevelopmentDependencies.Add('@playwright/test', '>=1.52.0');
  }
  if (prettier) {
    pkg.DevelopmentDependencies.Add('prettier', '>=3.5.3');
  }
  if (eslint) {
    pkg.DevelopmentDependencies.Add('eslint', '>=9.27.0');
    const eslintDependencies = new DependencyCollection(
    {
      devDependencies: {
        "@eslint/css": ">=0.8.1",
        "@eslint/js": ">=9.27.0",
        "@eslint/json": ">=0.12.0",
        "@eslint/markdown": ">=6.4.0",
        "typescript-eslint": ">=8.32.1"
      }
    });
    pkg.Register(eslintDependencies);
  }
```

Finally we copy the template files and config files to directory where we're installing the project.

The template files are located in the `templates` directory and the config files are located in the `template/configs` directory.

When copying the template files we create a new directory called `src` in the current working directory. This is where the template files will be copied.

```typescript
  // 6. Copy template files
  const templateDir = resolve(__dirname, '..', 'templates', framework);
  mkdirSync(join(cwd, 'src'), { recursive: true });
  copyDir(templateDir, cwd);
```

We copy the template files to the root directory. The config files are located in the `template/configs` directory.

We then ensure that we write the `package.json` file to the current working directory.

```typescript
  // 7. Copy common config files
  // Copy typescript config
  copyFile(resolve(__dirname, '..', 'templates', 'configs', 'tsconfig.json'), cwd);
  // conditionally copy prettier, eslint, and playwright config files
  if (prettier) copyFile(resolve(__dirname, '..', 'templates', 'configs', 'prettier.config.js'), cwd);
  if (eslint) copyFile(resolve(__dirname, '..', 'templates', 'configs', '.eslint.config.js'), cwd);
  if (playwright) copyDir(resolve(__dirname, '..', 'templates', 'configs', 'playwright.config.ts'), cwd);

  // 8. Write package.json to current working directory
  const packageJsonPath = join(cwd, 'package.json')
  writeFileSync(packageJsonPath, JSON.stringify(pkg.ToJSON(), null, 2), { encoding: 'utf-8' });

  console.log('Project scaffolded successfully!');
}
```

These are the functions used to copy files and directories.

```typescript
/**
 * Recursively copy a directory's contents into target.
 */
function copyDir(srcDir: string, destDir: string) {
  for (const name of readdirSync(srcDir)) {
    const src = join(srcDir, name);
    const dest = join(destDir, name);
    if (statSync(src).isDirectory()) {
      mkdirSync(dest, { recursive: true });
      copyDir(src, dest);
    } else {
      writeFileSync(dest, readFileSync(src));
    }
  }
}

function copyFile(src: string, cwd: string) {
  const name = resolve(src).split(/[/]/).pop()!;
  writeFileSync(join(cwd, name), readFileSync(src));
}
```

The last step is to call `main()` and catch any erros that occur.

```typescript
main().catch(err => {
  console.error(err);
  process.exit(1);
})
```

## Conclusion

The tool works for its intended purpose. It creates a Vite project with the selected framework and installs the appropriate dependencies for the framework and selected tools.

It could be improved by adding more tools to select from, such as Vitest, Cypress or Jest for test, Tailwind CSS for styling and others.

Another area of improvement is to add more template for each framework. For example, the Vue template could include Vuex and Pinia for state management. The React template could include Redux and Zustand for state management.

I'm also researching ESLint and a few issues:

* Google's shareable configuration will not work with ESLint 9.x
  * There is a PR to fix this, but it hasn't been merged yet
* How do the new configurations tackle working with Typescript
  * There are many different instructions online and they all appear different

Finally, we could make the code easier to read and maintain by moving functions outside main, possibly intro a separate file.
