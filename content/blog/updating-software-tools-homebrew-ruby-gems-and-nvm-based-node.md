---
title: "Updating software tools: Homebrew, Ruby Gems and NVM-based Node"
date: "2023-08-30"
---

Doing software updates outside of what Apple offers with macOS is tedious and easy to forget. I also have at least three different systems to update: [Homebrew](https://brew.sh/), [Ruby Gems](https://guides.rubygems.org/rubygems-basics/) and Node.js installed with [NVM](https://github.com/nvm-sh/nvm#readme)

After the last time I forgot to update my Ruby gems, I decided that there had to be a way to, at least, group them all together to reduce typing.

What I came up with was a zsh function that would group together Homebrew, Ruby Gems and Node (via nvm) updates.

The post will discuss the rationale for the script, what it does and how to run it.

## Homebrew

Homebrew provides a lot of tools that are not part of the standard Apple-provided software tools and chains.

For Homebrew I choose to run two chained commands.

The first one runs `brew update`, followed by a [logical and](https://linuxhint.com/bash-logical-and-operator/) operator and `brew outdated`.

The idea behind using the logical operator is that the second command (`brew outdated`) will only run if the first command (`brew update`) is successful. It makes no sense to show what's outdated if the update was not successful.

The second command upgrade the files that can be upgraded, a logical and operator and the cleanup command. Like in the previous command, Homebrew will not clean up files that haven't been upgraded to their latest available version.

```bash
brew update && brew outdated
brew upgrade && brew cleanup
```

## Ruby Gems

I keep Ruby Gems around mostly because of Rails. SASS was originally provided as a Ruby gem but that version has been deprecated in favor of Dart SASS so it's no longer necessary.

The thre commands will do the following:

Show a list of the outdated gems.

Update the gem application itself and update other gems if the first update was successful.

Lastly, we cleanup older versions of the gem that are still installed.

```bash
gem outdated
gem update --system && gem update
gem cleanup
```

## Node with NVM

Node with NVM is the hardest one to work through than the three systems.

I currently have three versions of Node installed: 16, 18 and 20 so I'll take advantage of NVM by installing each of the major versions I work with.

Using just the major version will install the latest available version in NVM (which may not be the latest available version). If it's already installed, it will say so and use the indicated version (equivalent to using `nvm use` and the version we just installed). Otherwise, It will install it

To make sure that we revert back to our default version, we run `nvm use default`.

```bash
nvm install 16
nvm install 18
nvm install 20

nvm use default
```

There are a couple caveats:

This will not uninstall older versions of Node. You must do this manually

It will not copy installed packages to the version that was just installed. You must do this manually too.

## The result

The `weekly-updates` function wraps all the code we've discussed so far.

There is still some actions that you have to complete manually when using NVM, but the bulk of the work is done.

```bash
function weekly-updates {
  ## Homebrew
  brew update && brew outdated
  brew upgrade && brew cleanup

  ## Ruby gems
  gem outdated
  gem update --system && gem update
  gem cleanup

  ## Node
  nvm install 16
  nvm install 18
  nvm install 20
  # Revert to the default version
  nvm use default
}
```

## Further refinements

As it stands, the script has to be run manually. To automate Unix scripts and commands, we need to use the cron family of commands.

As I was researching how to use Cron with this script I found out many difficulties, so I'm going to save the Cron conversion for a separate post
