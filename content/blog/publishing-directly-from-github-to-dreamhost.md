---
title: "Publishing directly from Github to DreamHost"
date: "2023-06-12"
---

After a while, I finally pulled the plug from Media Temple / Go Daddy and moved to a different host (if you want to know why I moved, ping me on social media, won't discuss it in this post).

I currently host smaller projects on Netlify and they are a good host but it's another server I have to worry about and I made publishing unnecessarily hard (and I don't know how to change it).

So I decided to consolidate everything into my domain. This post will document the process, both in the command line and an automated version using [Github Actions](https://github.com/features/actions).

The first step is to identify a good tool to use to perform the task. The tools that we use must be able to:

- Run through SSH
- Push the content of a directory in one command
- Run in Github Actions

## Evaluating Rsync

[Rsync](https://rsync.samba.com) seems to be tailor-made for this purpose.

It provides secure, incremental copying from client to server.

I tested it in one of the repositories that I want to use with the following command:

```bash
rsync -avz \
build/ \ 
<user>@<host>:<directory>
```

Where `<user>` is the user account on the DreamHost VPS, `<host>` is the VPS host address, and `<directory>` is the destination directory **on the server** where you want to place the files.

Rsync has one more potential benefit. It will only upload files that have changed, potentially speeding up transfer speeds.

## Automating the process

Now that I've selected Rsync and have tested that it works with DreamHost VPS, I would like to integrate it with GitHub Actions, if possible.

From what I see, it is a multi-step process:

1. Create the keys we will use
2. Add the key to the server's known\_hosts file
3. Configure the GitHub repository
4. Create the GitHub Action file to build the site and transfer the files

Note that these steps assume that you already have access to your VPS server and have already created the GitHub repo.

### Generating the keys

The first step is done on the VPS server.

```bash
ssh <username>@<host>
```

This will ask you for your VPS user password. Once you enter it, you'll be logged into the remote system where you want to upload your files to.

Next, use the `cd` command to go to the `.ssh` directory

```bash
cd ~/.ssh
```

If you get a message similar to this:

```bash
-bash: cd: /home/<username>/.ssh: No such file or directory
```

Then the directory doesn't exist and you should create it.

```bash
mkdir -p ~/.ssh
```

This is the command that we use to generate the key pair:

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Next we need to name the SSH Key file. Rather than using the default file name (`id_rsa`) we will use `github-actions` instead, just so we know this key is used for GitHub Actions. You in six months will thank you for being explicit now.

You’ll also be asked to provide a passphrase. Leave this empty since we can’t enter passwords when Github Actions run the SSH command for us.

The public key contains a .pub extension while the private key doesn’t.

We need to add the public key (`github-actions.pub`) to `authorized_keys` so machines using the private key (github-actions) can access the server.

To do this, we use the `cat` command to append the content of `github-actions.pub` into `authorized_keys`. It looks like this:

```bash
cat github-actions.pub >> ~/.ssh/authorized_keys
```

### Configuring Github Actions

Now that we generated the keys we need to add the public key and other information about the key to the Github repository.

- SSH\_PRIVATE\_KEY
- SSH\_USER
- SSH\_HOST
- SSH\_USER

The process to add the keys is as follows:

Go to your repository's settings section.

![](https://res.cloudinary.com/dfh6ihzvj/images/v1683328089/publishing-project.rivendellweb.net/github-create-secret-01-2/github-create-secret-01-2.png?_i=AA)

Repository settings link

Select actions from the menu on the left.

![](https://res.cloudinary.com/dfh6ihzvj/images/v1683327570/publishing-project.rivendellweb.net/github-create-secret-02/github-create-secret-02.png?_i=AA)

Actions secrets and variables

Select `new secret`

![](https://res.cloudinary.com/dfh6ihzvj/images/v1683327564/publishing-project.rivendellweb.net/github-create-secret-03/github-create-secret-03.png?_i=AA)

Create new secrets. One for each variable that we need to use.

Enter a name and a value for the secret

Note that you won't be able to see the content of the secret. You will only find out there is an error when you use the secret.

### The action workflow file

Once you've configured the secrets on Github, we need to create the action workflow.

I've used [Deploying to a server via SSH and Rsync in a Github Action](https://zellwk.com/blog/github-actions-deploy/) as a model with certain modifications.

I've broken the YAML file into sections to make it easier to write about different parts of the process.

We specify what to trigger the workflow whenever we push into the main branch or when we receive a pull request.

```yaml
name: Checkout and Build
on:
  push:
    branches: [
      main
    ]
  pull_request:
    branches: [
      main
    ]
```

The first set of steps is Node-related and does the following:

1. Sets up the version of Node that we want to use
2. Checks out the repository
3. Runs npm to install the packages in package.json
4. Builds the Fractal static site

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    # 1
    - name: Use Node.js 16.x
      uses: actions/setup-node@v3
      with: 
        node-version: 16.x 
    # 2
    - uses: actions/checkout@v3

    - name: Build
      run: |
        # 3
        npm install
        # 4
        npm run prepub
```

The second block of steps will set up SSH and related tools to enable the workflow to RSync the repository to the host.

The specific tasks that will run are:

1. Configure SSH known-hosts
2. Install the SSH key from the repository secrets
3. Run Rsync to ppublish the content we just built to the web host.

```yaml
    - name: Adding Known Hosts
      run: |
        mkdir ~/.ssh/
        ssh-keyscan -H ${{ secrets.SSH_HOST }}  >> ~/.ssh/known_hosts

    - name: Install SSH Key
      uses: shimataro/ssh-key-action@v2
      with:
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        known_hosts: unnecessary

    - name: Deploy with rsync
      run: rsync -avz build/ ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}
```

With this workflow, we accomplish a few things:

- We reduce the number of user names and passwords we have to remember
- We leverage the action we created to build the site, we no longer need to remember to do so
- We ensure that the content on the site reflects the latest changes to the codebase
