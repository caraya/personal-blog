---
title: Copying Homebrew to a new Mac
date: 2025-08-27
tags:
  - Homebrew
  - macOS
  - Migration
---

Homebrew is a powerful package manager for macOS that simplifies the installation and management of software.  Migrating your Homebrew setup to a new Mac can be an easy process if you follow the right steps.

This post will cover the steps to migrate your Homebrew setup from an old Mac to a new one, including how to create a Brewfile, and how to use it to restore your setup on the new machine.

## Migrating Homebrew to a New Mac: A Seamless Transition

You can seamlessly transfer your entire Homebrew environment &mdash; from command-line utilities like git and node to GUI applications like Visual Studio Code and iTerm2 &mdash; to your new machine.

### Where Homebrew Lives: Intel vs. Apple Silicon

Homebrew installs its files in different locations depending on your Mac's processor.

On older Intel-based Macs, Homebrew and its packages reside in the `/usr/local` directory tree.

On newer Apple Silicon Macs (without Intel chips), you'll find Homebrew in `/opt/homebrew`.

You generally won't need to interact with these directories directly, as the brew command handles all the path management for you. However, knowing the location can be useful for debugging.

If you've added custom paths on your shell configuration files (like `.bash_profile` or `.zshrc`), you might need to update them to reflect the new Homebrew location.

**Why the change?** The primary reason for the change is to cleanly support the two different processor architectures. Apple Silicon Macs can run older software built for Intel processors through a translation layer called Rosetta 2. By using a separate directory, a user can have two parallel Homebrew installations: a native Apple Silicon version in `/opt/homebrew` and an Intel-based version (running via Rosetta 2) in `/usr/local` for any tools that haven't been updated yet. This prevents the two versions from conflicting. This new location also aligns better with Unix conventions, where `/opt` is a standard directory for optional, third-party software, avoiding potential conflicts with other tools or system updates in `/usr/local`.

### The Brewfile

The main tool for this migration is a simple text file called a Brewfile.  It catalogues all your installed packages (or "formulae"), GUI applications (or "casks"), and even Mac App Store apps that you've installed via Homebrew.

To create this file on your old Mac, open your terminal and run this command:

```bash
brew bundle dump
```

This command will generate a file named `Brewfile` in your current directory. If you open it, you'll see a clean, readable list of your setup. It will look something like this:

```bash
tap "homebrew/bundle"
tap "homebrew/cask"
brew "git"
brew "node"
brew "python@3.12"
cask "visual-studio-code"
cask "iterm2"
cask "spotify"
mas "Xcode", id: 497799835
```

Once you have your Brewfile, move it to your new Mac in any way you prefer. The important thing is to have the Brewfile acessible on your new machine.

### Unpacking on Your New Machine

Now, let's configure the new Mac.

**Install Homebrew**: If you haven't already, you'll need to install Homebrew on the new machine. The official installation command is the safest and easiest way to do this. It automatically detects your Mac's architecture (Intel or Apple Silicon) and installs Homebrew in the correct location. Open your terminal and run:

```bash
/bin/bash -c "$(curl -fsSL <https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh>)"
```

The script will guide you through the installation and may require you to enter your password.

**Restore Your Packages**: In your terminal, navigate to the directory where you saved your Brewfile. Then, run the following command:

```bash
brew bundle install
```

Homebrew will now read your Brewfile and begin installing everything on the list. It will download all your command-line tools and GUI applications. For Mac App Store apps (listed as mas), it may prompt you to sign in to the App Store.

Depending on the number of items on your list and your internet speed, this might be a good time to grab a coffee. ☕️

## Beyond Migration: Standardizing Setups for Teams

The power of a Brewfile extends beyond personal machine migrations. It's a great tool for creating consistent, reproducible development environments for teams and projects.

1. **Create a Base Configuration**: A team can define a canonical Brewfile that lists all the essential tools required for a specific project. This could include a particular version of a programming language (like python@3.10), a database (postgresql), command-line utilities (jq), and even required GUI apps (docker).
2. **Version Control It**: This Brewfile is then checked into the project's source control repository (e.g., Git), right alongside the code.
3. **Easy Onboarding**: When a new developer joins the team or an existing member starts on the project, they simply clone the repository, navigate to the project folder, and run brew bundle install. This single command automatically installs all the specified dependencies, ensuring their machine is configured identically to everyone else's.

This practice eliminates "it works on my machine" issues, dramatically speeds up the onboarding process, and makes maintaining project dependencies a breeze.

## Verifying the Move and Troubleshooting

After you complete the installation, you'll want to make sure everything is in order.

A great first step is to run Homebrew's built-in health check command:

```bash
brew doctor
```

If you see the message "Your system is ready to brew," you're good to go!

You can also get a list of all your installed packages to double-check against your old setup:

For command-line tools: `brew list --formula`

For GUI apps: `brew list --cask`

If you run into any issues, here are a couple of quick troubleshooting steps:

* **Update and Upgrade**: Run `brew update && brew upgrade`. This fetches the latest version of Homebrew and upgrades all your packages, which can resolve many common issues.
* **Reinstall a Specific Package**: If a particular tool isn't working correctly, you can try reinstalling it with `brew reinstall <package_name>`.

By using the power of the Brewfile, you can make setting up a new Mac—or a new team member—significantly faster and more efficient. Happy brewing!
