---
title: "A New Way to Create Block Plugins"
date: "2021-09-29"
---

As the Gutenberg ecosystem matures, we get new tools and features to support the creating plugins.

One of the newest tools to create block plugins leverages [npx](https://www.npmjs.com/package/npx) command to scaffold a new block plugin.

The command is:

```text
npx @wordpress/create-block
```

The script will ask the following questions:

- The block slug used for identification (also the plugin and output folder name)
- The internal namespace for the block name (something unique for your block)
- The display title for your block
- The short description for your block (optional)
- The dashicon to make it easier to identify your block (optional)
- The category name to help users browse and discover your block (use arrow keys)
- The name of the plugin author (optional). Multiple authors may be listed using commas
- The short name of the plugin’s license (optional) A link to the full text of the license (optional) The current version number of the plugin

The script will create a new folder with the following content:

- A `package.json` package configuration file
- A `block.json` block configuration file
- All the basic dependencies for the block
- The `@wordpress/scripts` package to automate block-related tasks
- Access to the following commands
    
    - `npm start`: starts the build for development
    - `npm run build`: builds the code for production
    - `npm run format`: formats files
    - `npm run lint:css`: lints CSS files.
    - `npm run lint:js`: lints Javascript files
    - `npm run packages-update`: updates WordPress packages to the latest version

The next step is to change to the directory the plugin just created and run `npm-start` to being working on the plugin.

**Note:** If you didn't run the command in your develoment server's plugin directory, you will have to move the folder to the correct location before starting the development command. You can also choose to use [@wordpress/env](https://www.npmjs.com/package/@wordpress/env) to create a new development environment for your plugin.

You can now activate the plugin in your WordPress site and start working on your block.
