---
title: "Installing plugins and themes using github-updater"
date: "2021-04-28"
---

As far as I know, unless you put your themes and plugins in the directories, you can't update themes and plugins through the admin interface, you'll have to delete them and upload them again.

[git-updater](https://github.com/caraya/rivendellweb-wptheme) provides a mechanism to update plugins and themes from a Git repository (Github, GitLab or BitBucket) without having to publish them.

Download the plugin and upload it to your WordPress installation or install it directly from your WordPress admin plugin interface.

Before we can install our code using the plugin we need to add a header in the `style.css` header or in the plugin's header denoting the location on GitHub

For a plugin choose one of the two options below:

```php
GitHub Plugin URI: caraya/rivendellweb-plugin
GitHub Plugin URI: https://github.com/caraya/rivendellweb-plugin
```

For a theme the two options to choose from are:

```php
GitHub Theme URI: caraya/rivendellweb-wptheme
GitHub Theme URI: https://github.com/caraya/rivendellweb-wptheme
```

Only one of these options is necessary.

To install a new item (plugin or theme) from its Git repository fill out the forms and press the installation button.

![](https://publishing-project.rivendellweb.net/wp-content/uploads/2021/04/github-updater-theme-update.png)

Github Updated Install Theme Dialogue

Both installations require the URI for the project, the branch of code you want to install from and the remote repository host and optionally, a GitHub access token.

![](https://publishing-project.rivendellweb.net/wp-content/uploads/2021/04/github-updater-plugin-update.png)

Github Updater Install Plugins Dialogue

This tool will make installations and updates easier; we can keep themes and plugins in their respective directories throughout their life.
