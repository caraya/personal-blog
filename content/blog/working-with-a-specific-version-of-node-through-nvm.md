---
title: "Working with a specific version of node through NVM"
date: "2023-03-06"
---

I love NVM. It allows me to keep multiple versions of Node installed and available to run as needed for testing and development.

However, it is not free of problems and footguns. Some packages are version specific and will crash if you're running a different version (looking at you, SASS) and others are compiled against specific Node versions.

I saw this happen with a package from libsquoosh, my image manipulation tool of choice, so I decided to take a look at how to switch versions to a specific one when changing directories.

The first step is to create a `.nvmrc` file and fill it with the version of Node that you want to use for that project.

You can be as specific as you need to be. In this case, I want to use any Node 16 that is available on my laptop. If there are multiple versions, it will use the latest version that matches the version in `.nvmrc`

```bash
v16
```

Once we have told NVM what version to use in `.nvmrc` we can do some shell scripting to load the version when there is a `.nvmrc` file present in the directory.

This [zsh](https://zsh.org) function, taken from [stack overflow](https://stackoverflow.com/questions/23556330/run-nvm-use-automatically-every-time-theres-a-nvmrc-file-on-the-directory), does the following tasks:

Checks if a `.nvmrc` file exists. If it does then it sets the value of the `nvmrc_node_version` variable to the version of Node.

if the version of Node is not installed, appears as `N/A` when listed in the available versions of Node installed in NVM, then install it. If it is installed, then use it.

If there is no `.nvmrc` file in the directory, then revert to using the default version of Node configured in NVM.

```zsh
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
```
