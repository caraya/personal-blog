---
title: "EPRDCTN in the command line: Basic shell commands, pipes, globes and others"
date: "2018-04-16"
---

Since we're working on the command line we also need to learn about what makes the Unix/Linux command line work.

### Globes

There are times when we need to match commands against one or more files. It can be as simple as listing only files of a certain type or having the command run only on some files, not others.

Unix-like shells (like those on MacOS and WSL) provide globs (global or pattern matching) to help you with the searches. I could go on for pages and pages about globs, but rather than do that I will give you some examples and let you explore further on your own.

The two most often used patterns are `*` and `?`.

\*

Matches any string, including the null string.

?

Matches any single character.

The following command will search the current directory for files that end with `.xhtml`. This can be useful to get a listing of all files of a given type in a directory.

```
# Search for all XHTML files in the current directory
# We define XHTML files as any file that ends with .xhtml
ls -al *.xhtml
```

The `?` pattern matcher matches a single character. This is useful when you have a sequential list of files that are different by a single character. The example below would match all files that start with the word index, a single character and then end with .html. It Would match index1.html but not index10.html or index.html

```
# Search for all files that start with the word index,
# a single character and then end with .html
# Would match index1.html
# but not index10.html or index.html
ls -al index?.html
```

Newer versions of Bash will let you recursively match using the `**` pattern. This is not guaranteed to work everywhere so it's offered here for you to try it.

```
# sets the recursive match option
shopt -s globstar
# Recursive search the current and all children directories
# for python files (anything that ends with .py)
ls **/*.py
```

For more information check this [wiki page](http://mywiki.wooledge.org/glob). It contains much more in-depth and detailed information about glob patterns.

### Pipes

A pipe pipeline is a sequence of one or more commands separated by the control operators `|`. The idea is that we run the first command then process the output of the next command (left to right) until we've run all the commands on the pipe.

The following command will create a listing of all the files in a directory and look for the word index in the result

```
ls -al | grep index
```

### Redirection

Another type of pipe is used to redirect the output of a file into another, usually a text file or some kind. The most typical example is piping the output of a command, in this case `ls -al` to a text file.

```
ls -al > content.txt
```

### Creating aliases: What, Why and How?

There are times when typing the same command, particularly if it's a long command or one with many parameters, can be tedious and cause more errors than we care for. The bash shell provides ways to create shortcuts in the way of aliases.

You can create aliases for the current session using the alias command in the current shell. For example, if you paste the following command on your terminal:

```
alias ll="ls -lhA"
```

It will create the `ll` command which will list all files and directories in long format skipping the current and parent directories.

The problem with this approach is that the command will only last as your logged in to the shell where you entered it. When you log in the commands are gone.

There is a way to create aliases that will persist through different shells. This works in Mac and, somewhat, in Windows though WSL.

First, make sure that the Nano package is installed on your Mac via Homebrew

```
brew install nano
```

The following steps are the same for Mac and Windows

```
# Makes sure you're in your home directory
cd
# Opens or creates the file .bash_profile
nano .aliases
```

![Nano editor working on aliases file](/images/2018/04/nano-editing-aliases-1024x697.png)

Nano editor working on aliases file

When in the editor opens the file you will see an empty file or the result of your prior work.

Enter the new alias that you want to keep at the bottom of the file. If you're entering multiple aliases the order in which you do is not important.

Bash will read the entire file before starting and will flag any syntax errors.

There are two ways to get Bash to pick up the changes to your `.aliases` files. One is to open a new shell. The second one is to source the aliases files. The command is:

```
source .aliases
```

This command will force Bash to read the `.aliases` file and make all the aliases you created available to the shell.

The last thing to do is to make sure `.aliases` is loaded when we log in. Add the following to the `.bash_profile` file

```
source .aliases
```

### The path

In the Unix world, the path is the list of directories the shell follows when trying to find your applications. If the location of the application (expressed as a Unix path) is not on your path, then you will get a `command not found` error.

As with aliases, you can set them one of two ways:

For the current shell (and only for the current shell) you can export the path. For example, if I wanted to add the program `foo` to my sell path for the current shell, I can do:

```
export PATH="$PATH:/usr/local/bin/foo"
```

The export command is used to export a variable or function to the environment of all the child processes running in the current shell.

`$PATH` represents the current value of the path variable. We add it first to make sure we can still run all the system's built-in commands. We use a colon, `:` as the separator.

The last item is the path to the command we want to use.

Doing this every single time we want to run the command is tedious. Like we did with the aliases we can do the same thing with path commands by editing the `.bashrc` file.

The example below shows multiple instances of adding to the path. These are all additive; they will append to the path, not overwrite it.

The example below shows how to add multiple programs to the path one at a time using multiple export commands where there is more than one path (like between $PATH and the first item) they are separated by a colon (`:`). This makes it easier to change individual components if needed.

```
# Path to depot tool to work with Google code and other stuff
export PATH="$PATH:/Users/carlos/code/depot_tools"
# Shaka Packager
export PATH="$PATH:/Users/carlos/code/shaka-packager"
# Homebrew
export PATH="/usr/local/sbin:/usr/local/bin:/usr/local/texlive/2017/bin:$PATH"
# AV1 from source
export PATH="$PATH:/Users/carlos/code/aom-deploy/aom-build:/Users/carlos/code/aom-deploy/aom/test"
```

To add the export commands to your `.bashrc` file use the following commands using the Nano editor.

```
# to make sure we're in the home directory
cd
# open the file with the nano editor
nano .bashrc
```

The syntax of the command is the same as if you were adding it to the individual shell.

One final thing is to make sure `.bashrc` is loaded when we log in. Add the following to the `.bash_profile` file

```
source .bashrc
```
