---
title: Installing manual dependecies in Homebrew
date: 2024-09-04
tags:
  - Homebrew
  - macOS package management
  - Reference
---

In macOS we have a few disadvantages when it comes to software version management.

The good thing is that macOS developer tools do come with versions of Python and other software bundled as part of the X-Code comand line tools.

The bad part is that those versions are not updated often and we can't update them manually. If you want to update Python, for example, you must do it manually, or use a package manager like [Homebrew](https://brew.sh/).

However, Homebrew presents a different set of problems.

The specific case is this:

I installed [Jupyter](https://jupyter.org/) via Homebrew. That worked without problems.

I wanted to install additional kernels but could not do it following the instructions the kernels' readme files. For example, when installing ZeroMQ's Python package I would get the following error:

```text
pip3 install zeromq
error: externally-managed-environment

× This environment is externally managed
╰─> To install Python packages system-wide, try brew install
xyz, where xyz is the package you are trying to
install.

If you wish to install a Python library that isn't in Homebrew,
use a virtual environment:

python3 -m venv path/to/venv
source path/to/venv/bin/activate
python3 -m pip install xyz

If you wish to install a Python application that isn't in Homebrew,
it may be easiest to use 'pipx install xyz', which will manage a
virtual environment for you. You can install pipx with

brew install pipx

You may restore the old behavior of pip by passing
the '--break-system-packages' flag to pip, or by adding
'break-system-packages = true' to your pip.conf file. The latter
will permanently disable this error.

If you disable this error, we STRONGLY recommend that you additionally
pass the '--user' flag to pip, or set 'user = true' in your pip.conf
file. Failure to do this can result in a broken Homebrew installation.

Read more about this behavior here: <https://peps.python.org/pep-0668/>
note: If you believe this is a mistake, please contact your Python installation or OS distribution provider. You can override this, at the risk of breaking your Python installation or OS, by passing --break-system-packages.
hint: See PEP 668 for the detailed specification.
```

So there is an alternative but, in my opinion, defeats the purpose of having Homebrew manage your Python packages by shifting the weight back to the user in managing virtual environments.

I found an explanation and an example on the README for Jupyter's [Bash Kernel](https://github.com/takluyver/bash_kernel/blob/master/README.rst)

The essence of the issue is this:

[PEP 668](https://peps.python.org/pep-0668/), since replaced by [Externally Managed Environments](https://packaging.python.org/en/latest/specifications/externally-managed-environments/), recommends that users install Python applications with pipx rather than global installs with pip.

To install kernels that are distributed as Python modules there are extra, and confusing steps.

As a prerequisite you must install [pipx](https://pipx.pypa.io/stable/) via Homebrew. This is kind of ironic to me, but that's how it works.

The second `pipx ensurepath` ensures that we can work with the `--global` flag.

```bash
brew install pipx
pipx ensurepath
pipx ensurepath --global
```

Then, as a first step, you must install the Jupyter ecosystem with pipx, and then inject bash_kernel (and any other bits of the jupyter ecosystem you use, like papermill) into the same pipx venv.

When we inject the `bash_kernel` module into our `Jupyter` virtual environment, the first parameter to `--include-deps` is the environment we want to insert into and the second is the module we want to insert.

You can inject multiple packages by specifying them all on the command line, or by listing them in a text file, with one package per line, or a combination.

```bash
pipx install --include-deps jupyter
pipx inject --include-apps --include-deps jupyter bash_kernel
```

Once everything is installed in the virual environment, you navigate to the corresponding venv, activate it (`source bin/activate`), run any necesary initialization commands (for the Bash kernel we need to run `python -m bash_kernel.install`) within that virtual env and then deactivate it (`deactivate`). If not done in the virtual environment this won't work; the application is not installed in the global environment.

```bash
cd ~/.local/pipx/venvs/jupyter/
source bin/activate
python -m bash_kernel.install
deactivate
```

Once you figure out how it works, the process is smooth, but it raises a question:

Since we can't rely on fully configuring applications like Jupyter, we should ask whether we want to use Homebrew's version of these tools, or any other apps that rely on users adding or configuring modules on top of what Homebrew offers when you install the app using it.

When installing the Bash kernel we had to install Jupyter locally so what would be the point of also having it available through Homebrew?

I am sure that I will find more situations like this when workign with Python apps. I guess it'll be a case-by-case decision.
