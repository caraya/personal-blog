---
title: "EPRDCTN in the command line: WSL Interoperability"
date: "2018-04-18"
---

One important thing that Windows users should know. There is a reason why we went through all the work of installing PowerShell and WSL: Interoperability.

WSL and Powershell were designed to work together and are continuously improved on the interoperability front. This can take one the following ways:

You can run Linux commands from Windows prepending the `wsl` command to the command you want to run. The example below runs Ace installed via NPM on Linux.

If this meets your needs, then you don't need to install Node on Windows. Running `wsl node` will take care of it when working on PowerShell and `node` will work when running on WSL.

```
wsl ace --help
```

You can mix commands too. The example below shows how to run a Windows command (`dir`) and pipe it to a Linux command with `wsl` (`wsl grep foo`).

```
dir | wsl grep foo
```

You can also do it the other way around and use Windows applications from the Linux shell. For example if you wanted to use Java to run Epubcheck from within a Linux shell you could run:

```
java.exe -jar epubcheck.jar
```

The `.exe` suffix to the application is important. It is what tells WSL that it's a Windows application; it also means that you don't have to install applications in both places, installing them in Windows should be enough.

Note that these commands don not work with aliases. As far as I know I can't create an alias in WSL's Bash shell and run it using `wsl` + alias.

## Links and Resources

- WSL
    
    - [WSL Documentation](https://docs.microsoft.com/en-us/windows/wsl/about)
    - [WSL interoperability with Windows](https://docs.microsoft.com/en-us/windows/wsl/interop)
- Homebrew
    
    - [Homebrew Website](https://brew.sh/)
- APT-GET Guide
    
    - [Using apt-get Commands In Linux](https://itsfoss.com/apt-get-linux-guide/)
- Lynda.com Courses
    
    - [Workflow Tools for Web Developers](https://www.lynda.com/Web-Design-tutorials/Workflow-Tools-Web-Development/533305-2.html)
    - [Unix for MacOS X Users](https://www.lynda.com/Mac-OS-X-10-6-tutorials/Unix-for-Mac-OS-X-Users/78546-2.html)
