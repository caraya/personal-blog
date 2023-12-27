---
title: Housekeeping for Node projects
date: 2024-06-30
draft: true
---

There are a few housekeeping issues that always drive me nuts when working on a new project. This post will present the problems along with possible automation solutions.

## Dependency management

Because Node is package based and that means that you have to do one of the following:

* Periodically run `node upgrade` to update the packages and then `node audit` (and maybe `node audit --force`) to fix security issues that may require updates beyond what's specified in your project's `package.json`Use GitHub built-in tools like [Dependabot](https://docs.github.com/en/code-security/dependabot). This requires manual action to approve the pull requests Ddependabot generates
* Use third-party tools like [Renovate](https://docs.renovatebot.com/getting-started/) in a [Github action]
  * This allows you to set up auto-merging for updates that pass your tests and satisfy the auto-merge rules you define

I think that the third option is the best one to go with.

To install Renovate, go to the Renovate Application's [Github Marketplace Page](https://github.com/marketplace/renovate) and install the application from there.

<figure>
  <img src='https://res.cloudinary.com/dfh6ihzvj/images/v1688196547/publishing-project.rivendellweb.net/renovate-01/renovate-01.png?_i=AA' width="800">
  <figcaption>Renovate in the GitHub Marketplace</figcaption>
</figure>

Renovate depends both on Dependabot and having a CI pipeline enabled to automate the merges.

Once you've set up the organization you want to work from, each eligible project will receive a pull request to initialize Renovate with a basic configuration.

After the initial pull request is merged, you will get multiple pull requests, one for a dashboard and one for each module that needs to be updated.

Right now the requests must be processed manually. We can automate this using GitHub Actions to automate the process.

## Linting staged files

[Husky](https://www.npmjs.com/package/husky) and [lint-staged](lint-staged)

## Automating releases

[gulp recipe](https://gulpjs.com/docs/en/recipes/automate-releases)

[Your quick guide into Continuous Integration / Continuous Deployment (CI/CD) workflow with GitHub Actions.](https://birtony.medium.com/setting-up-automated-release-workflow-with-github-actions-628dbca2446e)
