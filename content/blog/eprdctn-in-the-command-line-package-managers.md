---
title: "EPRDCTN in the command line: Package Managers"
date: "2018-04-09"
---

Most Operating systems have ways to automate software installation, upgrade, management and configuration of the software on your computer with package managers.

Package managers are designed to eliminate the need for manual installs and updates. This can be particularly useful for Linux and other Unix-like systems, typically consisting of hundreds or even tens of thousands of distinct software packages.\[2\]

We'll look at [Homebrew](https://brew.sh/) and [apt-get](https://itsfoss.com/apt-get-linux-guide/), their requirements and ecosystems, along with some basic commands to get you started.

### Homebrew and Cask

Homebrew allows you access to a large ecosystem of Unix Software on your Mac. It is a [Ruby](https://www.ruby-lang.org/en/) application which is one of the reasons why we installed the Xcode command line tools; they include Ruby.

To install Homebrew paste the following command on your terminal. This will download, install and configure Homebrew.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Now that we have installed Homebrew we'll use it to install, upgrade and remove (uninstall) a package. Even though I've chosen to install a single package. The same would be applicable to single and multiple packages install.

This and the following sections will install the `akamai` package.

#### Installing the package

Installing packages is simple. The command is:

```
brew install akamai
```

The command will also install any dependencies needed for the package to run. Akamai has no dependencies.

![Screenshot showing the install process for a homebrew package](/images/2018/04/homebrew-install-1024x203.png)

Screenshot showing the install process for a homebrew package

#### Updating/Upgrading the package

We should periodically update our packages to make sure we're using the latest version and capture any/all packages. The upgrade process gives us two options, one is to upgrade individual packages with an example like the one below:

```
brew upgrade akamai
```

If the package you're upgrading individually is already up to date, Homebrew will present you with this 'error' message. It's not an error at all, just Homebrew's way of telling you it's not needed.

![alt-text](/images/2018/04/homebrew-upgrade-package-already-installed-1024x82.png)

alt-text

The other option is to upgrade all installed packages at the same time by just using

```
brew upgrade
```

![Homebrew upgrade process for all packages](/images/2018/04/homebrew-upgrade-all-1024x232.png)

Homebrew upgrade process for all packages

#### Uninstalling the package

When we're done, we can uninstall the package to free up space on the hard drive (always a concern for me). The command is

```
brew uninstall akamai
```

#### Cleaning up after your installed packages

OK, I'll admit it... I have packages in my Homebrew installation that I haven't used in ages but, sooner or later my hard drive will complain and force me to clean up old stuff. With homebrew this is simple, the command is:

```
brew cleanup
```

This will go through all installed packages and remove old versions. It will also report when it skips versions because the latest one is not installed and how much hard drive space it gave you back

![Homebrew cleanup showing a listing of removed packages and how much disk space was saved in the process.](//publishing-project.rivendellweb.net/wp-content/uploads/2018/04/homebrew-cleanup-1024x639.png)

Homebrew cleanup showing a listing of removed packages and how much disk space was saved in the process.

There are more commands to use when troubleshooting and building recipes for Homebrew but the ones we've covered are the basic ones you'll use most often.

#### Cask: Like Homebrew but for applications

I don't particularly care for the way you have to install some software for MacOS. You download the file, open it then drag the application to the applications folder in your Mac (usually aliased in the folder created by the installer) and only then you can actually use the program.

The creators of Homebrew put out Cask, a command line software installer. The installation is simple, paste the following command on your terminal:

```
brew tap caskroom/cask
```

Then you can use Cask to install software on your system. For example, to install Java, run the following command.

```
cask install java
```

Cask will accept ULAs and other legal agreements for you. If these type of agreements are important **do not use Cask** and install software the old-fashioned way.

### Apt-get and apt-cache for Windows

Linux is built around the concept of packages. Everything in a Linux distribution from the kernel, the core of the Operating System, and every application is built as a package. Ubuntu uses APT as the package manager for the distribution.

There are two commands under the `apt-get` umbrella: apt-get itself and apt-cache. apt-get is for installing, upgrading and cleaning packages while apt-cache is used for finding new packages. We'll look at the basic uses for both these commands in the next sections.

In the following sections, `ack` is the name of the package we'll be working with, not part of the commands.

#### Update package database with apt-get

apt-get works on a database of available packages. You must update the database before updating the system, otherwise, apt-get won’t know if there are newer packages available. This is the first command you need to run on any Linux system after a fresh install.

Updating the package database requires superuser privileges so you’ll need to use sudo.

```
sudo apt-get update
```

#### Upgrade installed packages with apt-get

Once you have updated the package database, you can upgrade the installed packages. Using `apt-get upgrade` will update all packages in the system for which an update is available. There is a way to work with individual packages that we'll discuss when installing new packages

```
# Upgrades all packages for which an update is available
sudo apt-get upgrade
```

You can also combine the update and upgrade command into a single command that looks like this:

```
# Combines both update and upgrade command
sudo apt-get update && sudo apt-get upgrade -y
```

The logical and will make sure that both commands run and will fail if either does. It is the same as running the commands individually.

#### Installing individual packages

After you update your system there is not much need to update it again. However, you may want to install new packages or update individual packages. The `install` command will do either.

```
sudo apt-get install ack
```

If the package is not installed, the command will install it, along with its dependencies and make the command available to you.

If you've already installed the package, either during an upgrade or manual install, the command will compare the installed version with the one you want to install, if the existing version is the same or newer the installer will skip and exit. If the version being installed is newer then the installer will execute the upgrade.

#### Uninstalling individual packages

There are a few times when a package breaks stuff somewhere else or you no longer need the functionality the package provides. In this case, you can do two things.

You can use the `remove` command to only remove the binaries, the applications themselves, and leave configuration and other auxiliary files in place. This will make it easier to keep your configuration without having to write it down.

```
# ONLY REMOVES BINARIES
sudo apt-get remove ack
```

The next, and more extreme, option is to use the `purge` command. This will get rid of all portions of the package, beyond what the `remove` command will do. Use sparingly if at all.

```
# REMOVES EVERYTHING, INCLUDING CONFIGURATION FILES
sudo apt-get purge ack
```

#### Cleaning up after yourself

Just like with Homebrew, apt-get will keep older versions of installed packages. Sooner or later your system will complain about being low on resources and will require you to clean up the system

The first option is to run the `clean` command. This will clean your local system of all downloaded package files.

```
sudo apt-get clean
```

The second options is the less extreme `autoclean` command. This will only remove those retrieved package files that have a newer version now and they won’t be used anymore.

```
sudo apt-get autoclean
```

#### apt-search to find packages

There are times when you're looking for something but are not sure exactly what. This is where the `apt-cache search` command comes in, if you enter a search term it'll find all related packages.

```
apt-cache search <search term>
```

If you know the exact package name you can use `apt-cache pkgnames` command that will return all package names that match your search criteria. The number of returned items will be smaller than the search return.

```
apt-cache pkgnames <search_term>
```
