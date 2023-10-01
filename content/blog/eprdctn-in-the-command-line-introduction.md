---
title: "EPRDCTN in the command line: Introduction"
date: "2018-04-04"
---

This series of posts intends to walk you through some basic concepts, activities and shell commands to take the fear and pain away from working with a text-based interface that links directly to the Operating System.

In more formal terms:

> A command-line interface is a means of interacting with a computer program where the user (or client) issues commands to the program in the form of successive lines of text (command lines). A program which handles the interface is called a command language interpreter or shell. [Wikipedia](https://en.wikipedia.org/wiki/Command-line_interface)

So what does it mean?

It's like an old style terminal where you enter commands that make the computer do something.

All Operating Systems have a CLI. Yes, even Windows and MacOS.

![screenshot of a Bash shell in the GNOME windows manager for Linux](https://publishing-project.rivendellweb.net/wp-content/uploads/2018/03/600px-Linux_command-line._Bash._GNOME_Terminal._screenshot.png)

Screenshot of a Bash shell in the GNOME windows manager for Linux

![screenshot of Windows Powershell as it works in Windows Vista](https://publishing-project.rivendellweb.net/wp-content/uploads/2018/03/600px-Windows_PowerShell_1.0_PD.png)

Screenshot of Windows Powershell as it works in Windows Vista

This is important because sooner or later you will find tools that will only work from a command line interface. We'll explore some of these tools (Node, Daisy Ace) in later sections but it's important to make this clear.

## What command line tools will we use?

In Windows, the better tools are [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/powershell-scripting?view=powershell-6) a souped-up terminal shell with additional scripting capabilities, and [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about) a way to run Linux native applications from Windows. It uses a Ubuntu Linux image for Windows, not a modified version of Linux to run on Windows but a full version of Ubuntu Linux that will work together with Windows.

As far as terminals are concerned we'll use the [iTerm2](https://www.iterm2.com/) for the Mac and a standard Bash shell for WSL.

## Before we get started

Before we jump into further installations and customizations we need to do a few things that are dependent on the Operating System we're using.

### Mac Users: Install XCode Command Line Tools

Before we install Homebrew we need to install Xcode command line tools. These are part of the full Xcode download but I'd rather save you the 5GB+ download so we'll go the slim (but with more steps) route instead.

1. Go to the [Apple Developer's site](https://developer.apple.com/)
2. Click on the account link on the right side of the top navigation bar. You can use the same account that you use of iTunes or any Apple property.
    
    - If prompted verify your account. This mostly happens when logging in from a new location or with a new computer
3. Click on Download Tools
4. Scroll down the screen and click on **See more downloads**
5. On the search box (to the left of the list of items to download) enter **Command Line Tools**. This will reduce the number of entries
6. Download the version that matches your MacOS version
7. Install the package.

The version I downloaded was 173MB. I'm OK with the extra work :)

![Command Line Tools For Xcode download screen](https://publishing-project.rivendellweb.net/wp-content/uploads/2018/03/xcode-commandline-tool-download-1024x614.png)

Command Line Tools For Xcode download screen

### Windows Users: Make sure WSL and the Ubuntu Image are installed

Before we move forward with WSL and Linux on Windows we need to make sure we have the right version of WSL installed and that we downloaded Ubuntu from the Microsoft Store.

These instructions assume you're using the latest version of Windows 10.

1. Install the latest version of PowerShell
    
    - Download the MSI package from our GitHub releases page. The MSI file looks like this - PowerShell-6.0.0.`<buildversion>.<os -arch>`.msi
    - Once downloaded, double-click the installer and follow the prompts. There is a shortcut placed in the Start Menu upon installation.
    - By default the package is installed to `$env:ProgramFiles\PowerShell\`
    - You can launch PowerShell via the Start Menu or `$env:ProgramFiles\PowerShell\pwsh.exe`
2. Install WSL from PowerShell as Administrator
    
    - Type powershell in the Cortana search box
    - Right click on Windows PowerShell on the results and select Run as administrator
    - The UAC prompt will ask you for your consent. Click Yes, and the elevated PowerShell prompt will open
3. In the PowerShell window you just opened type: `Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux`
    
    - Reboot the system when prompted
4. Install your Linux Distribution
    
    - Open the Microsoft Store and choose your distribution. We'll be working with Ubuntu; other distributions are presented for reference.
        
        - [Ubuntu](https://www.microsoft.com/store/p/ubuntu/9nblggh4msv6)
        - [OpenSUSE](https://www.microsoft.com/store/apps/9njvjts82tjx)
        - [SLES](https://www.microsoft.com/store/apps/9p32mwbh6cns)
        - [Kali Linux](https://www.microsoft.com/store/apps/9PKR34TNCV07)
        - [Debian GNU/Linux](https://www.microsoft.com/store/apps/9MSVKQC78PK6)
5. Select "Get"
6. Once the download has completed, select "Launch".
    
    - This will open a console window. Wait for the installation to complete then you will be prompted to create your LINUX user account
7. Create your LINUX username and password. This user account has **_no relationship_** to your Windows username and password and hence can be different

## Installing a terminal on the Mac

Even though there is a terminal bundled with MacOS (hidden inside applications -> utilities) I like [iTerm 2](https://www.iterm2.com/) as a more feature complete replacement for the terminal that comes with MacOS. You can download it from the iTerm 2 [download site](https://www.iterm2.com/downloads.html) and, please, make sure you download the stable release.
