---
title: "Running a specific version of Node"
date: "2023-05-15"
---

One of the biggest pains of working with Node is when either a library you're working with is pinned to a specific version of Node or you must pin your project to a specific version because one or more dependencies will not work in versions after the specified one (or so the developers of the library say).

This can happen in one of two ways.

* The supported versions are included in the `engines` section of the `package.json` file as an advisory
* are included in a `.nvmrc` file

Even though neither of these options will stop you from running the package with an unsupported version, then it's on you to fix any potential problems.

## The solution

Out of laziness, I use [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md), as my Node Version Manager.

NVM helps me keep from having to manually install each version of Node that I want to keep around and makes sure that the packages of each version will not conflict with another

When researching possible solutions, I came across this code, taken from [this stack overflow answer](https://stackoverflow.com/questions/23556330/run-nvm-use-automatically-every-time-theres-a-nvmrc-file-on-the-directory).

The idea is simple:

If there is a `.nvmrc` file in the directory we change to then do the following:

1. Run the specified version
2. If the version is not installed, then install it

If the `.nvmrc` file is not present then the script will switch to the Node version indicated by the Node variable in NVM.

The script will do the following:

1. Capture local variables
    * Capture the current version of Node running in nvm
    * Capture the path to the `.nvmrc` file if one exists
2. If there is a `.nvmrc` file in the current directory, set the local `nvmrc_node_version` to the Node version specified in `.nvmrc`
3. If the required version is not installed, then use nvm to install it
4. If it is installed then use `nvm use` to run that specific version
5. If there is no `.nvmrc` file in the current directory then use the default installed Node version
6. Add the `load-nvmrc` function to the `chpwd` hook
7. Run the function to initialize it

{.custom-ordered}

The script looks like this:

```bash
load-nvmrc() {
  # 1
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  # 2
  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    # 3
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    # 4
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  # 5
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}

# 6
add-zsh-hook chpwd load-nvmrc
# 7
load-nvmrc
```

If we put this script in the account's `.zshrc` file, the script will be available
