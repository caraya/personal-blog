---
title: Understanding Semantic Versioning (SemVer)
date: 2026-01-28
tags:
  - Versioning
  - SemVer
  - Development
---

When releasing software, there are two aspects that can ver very challenging: managing changes and communicating those changes to users. Semantic Versioning (SemVer) is a widely adopted system that addresses both of these challenges by providing a clear and consistent way to version software, both the one you write and the dependencies you consume.

This post will cover the fundamentals of SemVer, how to apply it in your projects and some tools to help automate the process

## What is SemVer?

Semantic Versioning, often abbreviated as SemVer, is a standardized versioning system for software. It provides a strict set of rules for how version numbers are assigned and incremented.

In modern software development, projects rely heavily on dependencies (external libraries and packages). This can lead to "dependency hell," where version mismatches break your application. SemVer solves this by communicating compatibility. When you see a SemVer number, it tells you exactly what kind of changes have occurred between releases.

## The Structure

A SemVer version number consists of three distinct numbers separated by dots:

```bash
MAJOR.MINOR.PATCH
```

Example: 2.14.3

* `2` is the Major version.
* `14` is the Minor version.
* `3` is the Patch version.

How it Works: The Three Levels

The core of SemVer relies on active communication through these three numbers. You increment them based on the nature of the changes you make to your code.

### PATCH (x.x.1 -> x.x.2)

* **Definition**: Backward-compatible bug fixes.
* **When to use**: You fixed a bug, corrected a typo, or improved internal performance without changing how the API works.
* **Impact**: Safe to update. The consumer of your code does not need to change anything in their code.
* **Example**: You fix a calculation error in a calculateTax() function. The function name and arguments remain the same.

**Current**: 1.0.0 --> **New**: 1.0.1

### MINOR (x.1.x -> x.2.0)

* **Definition**: Backward-compatible new features.
* **When to use**: You added functionality in a backward-compatible manner. You might also mark old functionality as "deprecated" (but not removed yet).
* **Impact**: Safe to update. New features are available, but existing code continues to work exactly as before.
* **Note**: When you increment MINOR, you must reset PATCH to zero.
* **Example**: You add a new method calculateDiscount() to your library.

**Current**: 1.0.1 --> **New**: 1.1.0

### MAJOR (1.x.x -> 2.0.0)

* **Definition**: Incompatible API changes (Breaking Changes).
* **When to use**: You changed the public API in a way that will break existing implementations. This includes removing methods, renaming arguments, or changing return types.
* **Impact**: NOT safe to update automatically. Consumers must refactor their code to work with the new version.
* **Note**: When you increment MAJOR, you must reset MINOR and PATCH to zero.
* **Example**: You rename calculateTax() to getTaxValue() and require a new argument.

**Current**: 1.1.0 --> **New**: 2.0.0

### Advanced SemVer Concepts

#### Pre-release Labels

You can append a hyphen and an identifier to indicate a version is not yet stable.

**Format**: MAJOR.MINOR.PATCH-label
**Examples**: 1.0.0-alpha, 1.0.0-beta.1, 2.0.0-rc.3 (Release Candidate)
**Precedence**: 1.0.0-alpha < 1.0.0. A pre-release is considered "older" than the associated normal version.

#### Major Version 0 (Initial Development)

Anything starting with 0.y.z is for initial development.

**Rule**: The public API should be considered unstable.
**Implication**: Breaking changes can occur at any time without incrementing the MAJOR number. 0.1.0 to 0.2.0 might break everything.
**Transition**: Once your API is stable and being used in production, you should release 1.0.0.

## Practical Examples and Scenarios

Here is a timeline of a fictional library called ImageResizer to illustrate how versions evolve.

### Scenario 1: The Launch

You release the first stable version of ImageResizer. It includes a function resize(width, height).

* **Version**: 1.0.0

### Scenario 2: Security Fix

You discover a memory leak in the resize function. You fix the internal logic. The inputs and outputs remain identical.

* **Change Type**: Bug Fix (Backward Compatible)
* **Action**: Increment PATCH.

**New Version**: 1.0.1

### Scenario 3: Adding Crop Functionality

Users request a way to crop images. You add a new function `crop(x, y, w, h)`. The existing resize function works exactly as before.

* **Change Type**: New Feature (Backward Compatible)
* **Action**: Increment MINOR. Reset PATCH.

**New Version**: 1.1.0

### Scenario 4: Another Bug Fix

You find a typo in the documentation of the new crop function and a small bug in how it handles negative numbers.

* **Change Type**: Bug Fix.
* **Action**: Increment PATCH.

**New Version**: 1.1.1

### Scenario 5: Breaking Change

You decide that resize(width, height) is too limiting. You want to pass an options object instead: `resize({ w: 100, h: 200 })`.

If a user upgrades to this version but keeps calling resize(100, 200), their code will crash.

* **Change Type**: Breaking Change.
* **Action**: Increment MAJOR. Reset MINOR and PATCH.

**New Version**: 2.0.0

## SemVer in Package Managers (npm/yarn)

If you use Node.js, you will often see special characters in package.json that utilize SemVer logic to determine which updates are safe to install automatically.

| Symbol | Meaning           | Example (1.2.3) | Explanation                                                                 |
| :---: | :---: | :---: | --- |
| `^`      | Allow Minor & Patch | `^1.2.3` | Updates to 1.2.4 or 1.3.0, but stops at 2.0.0. This is the default behavior in npm, assuming you adhere to SemVer. |
| `~`      | Allow Patch Only   | `~1.2.3` | Updates to 1.2.4 or 1.2.9, but stops at 1.3.0. Use this if you are afraid new features might introduce bugs. |
| (None) | Exact Version | 1.2.3 | Only installs exactly 1.2.3. No updates allowed. |

## Tools for Automation & Enforcement

Maintaining SemVer manually relies on human discipline, which is prone to error. In the Node.js ecosystem, several tools help automate this process to keep your project honest.

### Semantic Release

semantic-release is a tool that fully automates the versioning and package publishing process. It determines the version number, generates the changelog, and publishes the release based entirely on your commit messages.

How it works: It analyzes your commit history since the last release.

* If it sees a `fix` commit &rightarrow; It releases a PATCH.
* If it sees a `feat` commit &rightarrow; It releases a MINOR.
* If it sees `BREAKING CHANGE` in the footer &rightarrow; It releases a MAJOR.

### Conventional Commits

To make tools like semantic-release work, you need a standard way of writing commit messages. Conventional Commits is the industry standard for this.

* `fix`: correct typo in dashboard &rightarrow; Triggers PATCH
* `feat`: add beta user list &rightarrow; Triggers MINOR
* `feat!`: drop support for Node 12 &rightarrow; Triggers MAJOR (The ! indicates a breaking change).

### npm version

Node.js comes with a built-in CLI command to manage versions if you prefer a semi-manual approach. It handles the "chore" of updating package.json and creating a Git tag for you.

* `npm version patch` &rightarrow; Updates 1.0.0 to 1.0.1
* `npm version minor` &rightarrow; Updates 1.0.0 to 1.1.0
* `npm version major` &rightarrow; Updates 1.0.0 to 2.0.0

## Summary Checklist

Breaking API change? &rightarrow; Bump MAJOR  And Reset MINOR and PATCH (2.0.0)

New feature, but existing code still works? &rightarrow; Bump MINOR (1.1.0)

Bug fix, internals changed, or docs update? &rightarrow; Bump PATCH (1.0.1)

Pre-release version? &rightarrow; Append a label (1.0.0-beta.1)

Initial development? &rightarrow; Use 0.y.z versions

**Never overwrite a version number**. Once 1.0.1 is released, it is immutable. If you made a mistake, release 1.0.2.
