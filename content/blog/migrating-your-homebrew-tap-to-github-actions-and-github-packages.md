---
title: "Migrating Your Homebrew Tap to GitHub Actions and GitHub Packages"
date: 2026-05-08
tags:
  - Homebrew
  - GitHub Actions
  - GitHub Packages
---

I've maintained a public Hombrew tap for several years, initially to distribute custom builds of packages that were not available in the main Hombrew repositories. Over time the tap evolved to include a mix of my custom tools and scripts and my own builds of tools I wanted to customize. But the build process and infrastructure have changed significantly since I first set it up, and I recently migrated the tap to use GitHub Actions and GitHub Packages for building and distributing bottles.

Distributing your custom Homebrew formulas with pre-compiled binaries (bottles) ensures fast, frictionless installations for your users. If you maintain a public Homebrew tap, migrating your build infrastructure to use GitHub Actions and GitHub Packages (ghcr.io) is the modern best practice.

Keeping your repository public (rather than making it private) provides several key benefits for non-sensitive code:

* **Frictionless installation**: Users can install your tools instantly with `brew install org/repo/formula` without configuring SSH keys or personal access tokens.
* **Free CI/CD and storage**: GitHub provides unlimited Action minutes and free ghcr.io package storage for public repositories.
* **Simplified navigation**: Newly published bottles default to public visibility automatically, eliminating manual permission management.

This post explains how to update an existing public tap to take advantage of the current Homebrew GitHub Actions workflows, upgrading your builds from legacy macOS versions (like Catalina) to modern, supported environments like Tahoe.

## How the modern workflow operates

When you configure a public tap to use GitHub Packages, Homebrew divides the automation into two separate GitHub Actions workflow files.

* `The Build Workflow (tests.yml)`: Triggers on pull requests. It runs syntax checks (`brew style` and `brew audit`), compiles the software (`brew install --build-bot`), packages the binary (`brew bottle`), and uploads the bottle as a temporary artifact.
* `The Publish Workflow (publish.yml)`: Triggers when you merge a PR. It downloads the artifacts, uploads them to ghcr.io, and commits the new package hashes back to the formula file in your repository.

### Important: Directory Requirements and Workspace Linking

Homebrew enforces a rigid directory structure for all taps. To be recognized by the brew CLI, your repository must reside in a specific location within the Homebrew installation tree. By default, this is:

```bash
$(brew --repo)/Library/Taps/<YOUR_GITHUB_ORG>/homebrew-<YOUR_TAP_NAME>
```

### Linking the Homebrew tap to your workspace

If you prefer to work in a specific projects directory (e.g., ~/projects/homebrew-rivendellweb) but want the files to stay managed by Homebrew in their default location, you can link the Homebrew directory into your workspace.

In this scenario, the Homebrew-managed folder is the source and your projects folder is the destination link.

Ensure the tap exists in the Homebrew directory.

Create a symlink in your projects folder pointing back to the Homebrew directory. The syntax for ln -s is `ln -s <source> <link_destination>`:

```bash
ln -s $(brew --repo)/Library/Taps/caraya/homebrew-rivendellweb ~/projects/homebrew-rivendellweb
```

**Warning**: Be extremely careful when removing symbolic links. Use `rm <link_name>` and never include a trailing slash (e.g., `rm ~/projects/homebrew-rivendellweb/`). Including a slash tells the shell to look inside the link at the actual directory, which can cause `rm` or `unlink` to delete the original source files managed by Homebrew instead of just the pointer in your projects folder.

Now you can run git and edit files in your preferred directory, and those changes are reflected directly in the Homebrew Tap directory. Note that `brew create` or `brew edit` will continue to modify the files in the Homebrew source directory, which you will see immediately in your linked workspace.

## Running Tests Locally

To avoid "random" GitHub Action failures, you can run the exact same test suite locally that the GitHub runners use. Homebrew uses a tool called test-bot for this.

### Install the Test Bot

If you haven't used it before, you may need to tap the Homebrew test-bot repository:

```bash
brew tap homebrew/test-bot
```

### Run Style and Audit Checks

This command replicates the brew style and brew audit steps. Remember that this often checks the entire tap unless specified otherwise:

```bash
brew test-bot --only-cleanup-before
brew test-bot --only-setup
brew test-bot --only-tap-syntax
```

### Test a Specific Formula

To simulate the actual build process for a specific formula (including bottle creation), run:

```bash
brew test-bot --only-formulae caraya/rivendellweb/esbuild-rw
```

## Homebrew Tap PR and Publish Process

This repository publishes bottles through the pr-pull workflow. Follow these steps to move from local development to a live published bottle.

### Create a branch

```bash
git checkout main
git pull --ff-only
git checkout -b <branch-name>
```

### Create or update formula files

Edit files in Formula/ as needed. Recommended local checks:

```bash
brew style Formula/<formula>.rb
brew test --verbose caraya/rivendellweb/<formula>
```

### Commit and push

```bash
git add Formula/<formula>.rb
git commit -m "<message>"
git push -u origin <branch-name>
```

### Open a pull request

Create PR with:

* base: main
* compare: `<branch-name>`

### Wait for GitHub tests

Wait until PR checks are green (the brew test-bot workflow).

### Trigger publish

Add the PR label: pr-pull. This triggers the publish workflow (`brew pr-pull`), which cherry-picks the commit to main and publishes bottles/packages to GitHub Packages.

### Wait for publish to finish

Wait for `brew pr-pull` workflow completion.

**Expected behavior**: The PR may show as Closed (not Merged) even when successful. Commits and bottle updates still appear on main.

### If publish does not retrigger

If pr-pull is already present but the workflow stalled, remove and re-add it using the GitHub CLI:

```bash
gh pr edit <pr-number> --remove-label pr-pull
gh pr edit <pr-number> --add-label pr-pull
```

Then monitor the status:

```bash
gh run list --workflow "brew pr-pull" --limit 5
gh run view <run-id> --log-failed
```

## Maintenance Checklists

Updating an Existing Formula (The "Clean Break" Method)

* Delete local stale data: `rm` the old `.rb` file from your `Formula/` directory.
* Fetch new metadata: Run `brew create "<URL>"` for the new version.
* Update your tap file: Copy new `url` and `sha256`. Ensure class name matches filename.
* Verify local build: `brew install --build-from-source ./Formula/your-formula.rb.`
* Sync with Git: Push to a new branch and manually create a PR.

Adding a Brand New Formula

* Identify type: Source (Go/Rust/C++) or Package (Node/Python).
* Generate scaffold: `brew create --node --tap caraya/rivendellweb "<URL>"`.
* Implement logic: Add `desc`, `homepage`, `license`, `depends_on`, and `install` block.
* Implement Tests: Complete the test block with a version or command check.

### CI Caveats: Style Audits

A significant challenge when migrating an existing tap is that the tests.yml workflow runs `brew style` and `brew audit` against the entire tap, not just the formula you are currently updating.

If unrelated formulas have style issues, your build will fail. You must either run `brew style --fix` on the whole tap or temporarily disable the style check in the workflow file.

## Source vs. Package Distributions

### Building from Source (Standard)

* **Logic**: Uses language-specific build tools (e.g., `go build`).
* **Pros**: Optimized binary, no runtime dependency on language environments.
* **Best for**: High-performance CLI tools.

### Building from a Package (Language-Specific)

* **Logic**: Uses `std_npm_args` or `std_pip_args`.
* **Pros**: Easier to manage for ecosystem-specific tools.
* **Best for**: Tools intended for web/app development workflows.

## Python Formulas and Pipx

* **System behavior**: Homebrew's Python follows PEP 668; `pip install` globally is blocked.
* **Formula behavior**: Formulas use `virtualenv_install_with_resources` to create isolated environments inside the `libexec` folder, bypassing global restrictions.

## Support development builds with --HEAD

To allow users to install the latest development version of your tool, add a `head` block to your formula that points to the Git repository and branch:

```ruby
class MyTool < Formula
  # ...
  head "https://github.com/your-username/my-tool.git", branch: "main"
  # ...
end
```

## Available brew create Options

| Option | Description |
| --- | --- |
| --autotools | Use a template for a software package using Autotools. |
| --cmake | Use a template for a software package using CMake. |
| --go | Use a template for a Go-based software package. |
| --node | Use a template for a Node.js-based software package. |
| --python | Use a template for a Python-based software package. |
| --rust | Use a template for a Rust-based software package. |
| --tap <user/repo> | Create the formula in the specified tap. |
