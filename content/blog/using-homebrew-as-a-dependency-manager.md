---
title: Using Homebrew As A Dependency Manager
date: 2025-10-03
tags:
  - Dependecy Management
  - Homebrew
---


Homebrew is a great package manager for macOS and Linux, making package installation and management straighforward. A less known feature is its ability to use it as a dependency manager for your projects beyond NPM or other language-specific package managers.

This post will walk you through the steps to use Homebrew as a dependency manager for your project.

## Example Scenario

The example project we'll use is a Docbook-based documentation site that requires `docbook`, `docbook-xsl`, `saxon` and `openjdk` to build the HTML files from XML sources and `prince` to convert a flavor of the generated HTML into PDF using CSS. These packages are not available via NPM, so we'll use Homebrew to manage them.

The rest of this post assumes you have Homebrew installed so the `brew bundle` command is available. If you don't have Homebrew installed, you can find instructions at [https://brew.sh](https://brew.sh).

### Homebrew Bundle

Homebrew Bundle is a Homebrew extension that allows you to define your dependencies in a `Brewfile`, similar to how you would with a `package.json` for NPM or a `Gemfile` for Ruby.

The advantage of using [Homebrew Bundle](https://docs.brew.sh/Brew-Bundle-and-Brewfile) is that it can manage not only Homebrew packages but also casks (for macOS applications), taps (additional repositories), and even Mac App Store apps. In this post we'll focus on packages and casks.

#### Create the Brewfile

Rather than dump the entire list of dependencies, we'll use `brew bundle add` to create a Brewfile with only the sofware we need. Because we're using both packages and casks, we'll have to run two commands.

First we add the packages:

```bash
brew bundle add docbook docbook-xsl saxon openjdk
```

In theory, we could shorten this to:

```bash
brew bundle add docbook-xsl saxon
```

And let Homebrew handle the dependencies, but I prefer to be explicit about what the project needs to have installed.

Next, we install the cask for PrinceXML:

```bash
brew bundle add --cask prince
```

Once you've added all your dependencies, you should have a `Brewfile` that looks like this:

```text
brew "docbook-xsl"
brew "saxon"
brew "docbook"
brew "openjdk"
cask "prince"
```

`brew` specifies a Homebrew package, while `cask` specifies a macOS application.

You should commit the `Brewfile` to your project's version control system so that anyone working on the project can easily install the required dependencies.

## Installing The Bundle

To install the dependencies listed in the `Brewfile`, simply run:

```bash
brew bundle install
```

If Homebrew is installed, this command will read the `Brewfile` in the current directory and install all listed packages and casks.

## Additional Considerations

If you need to add dependencies that are not available via Homebrew, you have two options:

1. **Manual Installation**: You can manually install the required software and document the installation steps in your project's README or another documentation file.
2. **Custom Tap**: If you frequently need software that isn't available in the main Homebrew repositories, you can [create your own Homebrew tap](https://docs.brew.sh/How-to-Create-and-Maintain-a-Tap). This is a more advanced option and involves creating a GitHub repository with formulae for the software you need.

## Limitations

While Homebrew is a powerful tool, there are some limitations to consider when using it as a dependency manager:

- **Platform Specific**: Homebrew is primarily designed for macOS and Linux. If your project needs to support Windows, you'll need to run Homebrew for Linux inside WSL (Windows Subsystem for Linux) or use a Windows-specific package manager like [Chocolatey](https://chocolatey.org/).
- **Version Control**: Homebrew is a rolling release system and doesn't allow you to pin to specific versions of like NPM does, unless the recipe for the software indicates a specific version (like `postgresql@14`). If you need to ensure specific versions of packages are used, you'll need to manage that manually outside of Homebrew.
- **Environment Management**: Homebrew does not manage isolated environments like virtualenv for Python or nvm for Node.js. If your project requires isolated environments, you'll need to handle them separately.

## Conclusion

Using Homebrew as a dependency manager can be a great way to manage system-level dependencies for your projects, especially when those dependencies are not available through language-specific package managers. By leveraging Homebrew Bundle, you can easily define and install the required software for your project, making it easier for others to set up their development environment.

Just be aware of the limitations and consider whether Homebrew is the right tool for your specific use case.
