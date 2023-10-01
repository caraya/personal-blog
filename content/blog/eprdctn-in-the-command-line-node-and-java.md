---
title: "EPRDCTN in the command line: Node and Java"
date: "2018-04-11"
---

## Node

[Node.js](https://nodejs.org/en/) (or just Node) is a cross-platform Javascript interpreter built on the [V8](https://developers.google.com/v8/), the same Javascript interpreter that powers Google Chrome. Initially, Node was created to run Javascript on the server but it has also been used to create a lot of tools for use on personal computers. This is the side of Node that we'll concentrate on.

In this section we'll look at the following aspects of Node:

- Installing Node with NVM
    
    - Why I chose this method
- Installing, removing and updating packages
    
    - Global install
- Some examples of what you can do with Node

### Installing Node with NVM

[NVM](https://github.com/creationix/nvm) is a set of shell scripts that allow you to download, configure and use multiple versions of Node without conflict. It installs and configures the Node binaries to run from your home directory, avoiding potential permission issues.

To install NVM open your terminal (or WLS through PowerShell) and paste the following command:

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash
```

This will download NVM, configure your directory and set permissions appropriately.

The next step is to actually install Node. We'll install an LTS (Long Term Support Version) 8. I'm installing an LTS version to make sure we have the best chance of our packages being supported. The latest version (9.x) may have changes that will not work with our software.

To install the latest release of Node 8.x run the following command:

```
nvm install 8
```

This will install the latest version that matches the major number you chose to install. As of this writing, the latest version is `8.11.1`. To activate the version you just installed type:

```
# Replace 8.11.1 with the version you installed
nvm alias default 8.11.1
# Use the default version you just configured
nvm use default
```

**Note:** Installing newer versions of Node with NVM will not delete older versions. For example, you can install Node 8.12 and still switch back and forth between versions using `node use` and the version you want to use for a specific project.

If you've already installed packages for a version of Node you can migrate the packages to the new installation. To do so run the following command (using a hypothetical version 8.12)

```
nvm install 8.12 --reinstall-packages-from=8.11
```

Installing packages from an older version requires you to specify the version you're installing from. It is not enough to say version 8... you're installing the latest release from that version, right?

### Installing Node Modules

Installing Node also installs [NPM](https://www.npmjs.com/), the Node Package Manager. This is the name of the tool and the ecosystem and repository that has evolved around it. _We'll use NPM to refer to the command line tool we use to install modules_.

Node packages are called modules and can be installed in one of two ways:

- **_globally_** meaning that they are available everywhere and usually provide a command line tool for you to work with
- **_project-based_** meaning that they are only available for the package they are installed under

Most of the tools that we'll use in an #eprdctn workflow fall into the first category so I'll concentrate on global installation and package management. If you think this is a mistake open an issue on Github or contact me on Twitter ([@elrond25](https://twitter.com/elrond25)).

For these examples, we'll use the [Ace](https://daisy.github.io/ace/) accessibility checker from the [Daisy Consortium](http://www.daisy.org/)

```
npm install -g @daisy/ace
```

This will install the module and produce a command binary for you to run: `ace`. To check the version of the tool you're using run the following command:

```
ace --version
```

This installation introduces another concept worth paying attention to; [scoped packages](https://docs.npmjs.com/misc/scope) as a way to keep your group related packages together/ It also affects a few things about the way npm treats the package.

### Removing Modules

There are times when we need to remove modules. The command is:

```
npm uninstall -g @daisy/ace
```

This will clean up the command executables and all related configuration.

### Upgrading Node Modules

Node lets you update all packages you've installed globally that have a version different from the latest. The command is:

```
npm update -g
```

Unlike installing and uninstalling modules, you can run the update command without a specific file name and it'll work with all packages you've installed globally.

## Java: JRE vs JDK, oh my!

We still use Java for some applications like [Epubcheck](https://github.com/IDPF/epubcheck/releases). The advantage of working with Java applications is that you run the same application on all platforms (Windows, Mac, and Linux) without customizing for each operating system.

### Different versions of Java: JDK and JRE

You may hear the words Java, JDK, JRE thrown out when people talk about Java software. Let's try to clear some of the confusion.

- **Java** is the language
- **JDK** is the Java Development Kit. It contains all the tools that you need to compile and run applications written in the Java language
- **JRE** is the Java Runtime Environment. It allows you to run Java applications but **not** compile or build them

To run applications either the JRE or JDK will work. For simplicity sake, we'll install the JDK in the examples below.

### Installing and Managing Java on the Mac: Use Cask

As discussed earlier in the Package Management Homebrew has a software management script called Cask. We'll expand on that section to cover installing, uninstalling and removing older versions of software using Java as an example.

Cask will accept ULAs and other legal agreements for you. If these type of agreements are important **do not use Cask** and install software the old-fashioned way.

#### Installing Cask

Install Cask with the following Homebrew command.

```
brew tap caskroom/cask
```

This will make the `cask` command available. To verify the installation run:

```
cask --version
```

If the command is successful it should print something like the content below to the screen.

```
Homebrew-Cask 1.5.13
caskroom/homebrew-cask (git revision 63231; last commit 2018-03-30)
```

#### Installing software

To install Java use the following command.

```
cask install java
```

This will download the software, install it (accepting any required EULA or license) and make the software available to you.

#### Updating Software

Java is notorious for quick updates and security fixes. It appears that, along with Adobe Acrobat, Java is a favorite target of hackers and malware writers.

You should get into the habit of periodically updating your version of Java and testing your applications against the new version.

The command:

```
cask upgrade Java
```

#### Reinstalling Software

There are times when things break. Configuration files may get corrupted or you may accidentally delete something on a package that you didn't mean to.

Rather than uninstall and reinstall cask gives you the option of reinstall. This command reinstalls the application and leaves it as if you just installed it for the first time.

```
cask reinstall java
```

### Installing Java on Windows

Rather than automate the installation on Windows, I think the best way to go in Windows is to manually install Java as a Windows application and run that version from either Windows or Linux by taking advantage of the interoperability WSL provides (the subject of a later section).

To install Java on Windows:

- Go to the Java [Manual download](https://www.java.com/en/download/manual.jsp) page
- Click on Windows Offline
    
    - The File Download dialog box appears prompting you to run or save the download file
    - Click Save to download the file to a known location on your local system, for example, your desktop
- Close all applications including the browser
- Double-click on the saved file to start the installation process
- The installation process starts. Click the Install button to accept the license terms and to continue with the installation
- Oracle offers various products to install alongside Java. You are not required to install any of these partner products and their installation (or lack thereof) should not affect Java at all
- A few dialogs confirm the last steps of the installation process
    
    - Click Close on the last dialog. This will complete Java installation process.
