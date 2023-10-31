---
title: "@wordpress/create-block"
date: "2022-03-16"
---

`@wordpress/create-block` (`create-block` for short) is a Node package that provides the officially supported way to create blocks.

The basic structure the script provides is as follows:

```tree
.
├── build
│  ├── block.json
│  ├── index.asset.php
│  ├── index.css
│  ├── index.css.map
│  ├── index.js
│  ├── index.js.map
│  ├── style-index.css
│  └── style-index.css.map
├── node_modules
├── demo-block.php
├── package-lock.json
├── package.json
├── readme.txt
└── src
    ├── block.json
    ├── edit.js
    ├── editor.scss
    ├── index.js
    ├── save.js
    └── style.scss
```

The script also installs the `@wordpress/scripts` package, which is a set of tools to make working with WordPress easier.

You can run the package with the following command inside your server's **plugins** directory:

```bash
npx @wordpress/create-block rw-demo-block \
    --template @wordpress/create-block-tutorial-template \
    --title "Demo Block" \
    --namespace rivendellweb \
    --short-description "Another awesome block" \
    --category "widgets"
```

This command will give you all the tools you need to create a block along with a pre-filled plugin to start working from.

The command **will not** install the plugin on your server. You have to do the installation and activation manually.

You can also create your own base templates and use them with `create-block` and host them in Github so you can run them with the `create-block` command.

The template contains at minimum the following files:

* An `index.js` file to run the template creation
* One or more `mustache` templates that will be processed when we create a block based on the template. These templates include SCSS style
* Optional `package.json` with the template metadata. We are not installing any modules from the template.

Once you have the template ready to go you can run the code locally

```bash
npx @wordpress/create-block --template ~/path/to/my-template/
```

or from NPM

```bash
npx @wordpress/create-block --template my-template
```

For a good example of how custom templates work, see [Marcus Kazmierczak's](https://twitter.com/mkaz) overview of the process in [Make your own create-block templates](https://mkaz.blog/wordpress/make-your-own-create-block-templates/). You can also see the code from his tutorial on [Github](https://github.com/mkaz/mkaz-block-template) and use it on your projects by running:

```bash
npx  @wordpress/create-block --template mkaz-block-template
```

The `create-block` script automates a lot of the tedious tasks of creating a block. There are other ways to do it, but this is the way the WordPress team recommends.
