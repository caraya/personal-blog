---
title: "Expanding Teams and Roles in WordPress Using The Members Plugin"
date: "2020-10-26"
---

Built-in roles have been available in WordPress since I started working with it (at least version 2.9) if not from the very beginning... they work but they provide a limited toolset to work with.

This becomes an issue in the following situations:

- When you need to assign more specific permissions to a role than what's available in the default user hierarchy
- When you need to expand roles beyond what WordPress offers
- When you want to assign custom permissions to existing roles

Plugins like [Members](https://wordpress.org/plugins/members/) allow you to expand and customize the roles on your system. They also allow membership-based tailored access to parts of your site, but that's not the emphasis of this post. I may decide to do it at a later time.

For this post, we'll explore how to get Members (the basic version, not MemberPress, the paid product), how to add roles, and how to assign capabilities to these roles.

## Getting the Members plugin

Like we do with all plugins we have two options to download and install the Members plugin either directly from the administrator interface or uploading it from your local drive.

## Configuration

With the Members plugin we have two options: create a brand new role or customize an existing one.

The first example will be how to customize a role. We'll make the editor role better reflect a technical editor and not the bunch of things an editor can do that have no direct relation to what an editor should do.

![Screenshot showing the Members WordPress Plugin when you first click on Members on the side menu](https://res.cloudinary.com/dfh6ihzvj/images/v1602209871/publishing-project.rivendellweb.net/members-plugin-01/members-plugin-01.png)

Screenshot showing the Members WordPress Plugin when you first click on Members on the side menu

Once you select the role you want to edit you will see the groups you can select permissions from and the individual permissions for the role we are working with.

![Members WordPress plugin configuratioon screen showing the categories you can choose from](https://res.cloudinary.com/dfh6ihzvj/images/v1602209881/publishing-project.rivendellweb.net/members-plugin-02/members-plugin-02.png)

Members WordPress plugin configuratioon screen showing the categories you can choose from

For smaller sites or sites that are run by individuals or small teams, tailoring existing roles may be all that's required but, for larger sites, or sites where we need fine control over what different roles do, we may need to create new, specific roles.

Following up from the previous example we may want two separate roles for editors, one that works with text and one that works with photography and other media.

The way to do it is to create a new role and then assign the permissions we want to give to that role.

Instead of editing a role, look at the options on the left-side navigation pane, and select `add new role`.

![Members WordPress plugin showing new roles creation screen](https://res.cloudinary.com/dfh6ihzvj/images/v1602350884/publishing-project.rivendellweb.net/members-plugin-03/members-plugin-03.png)

Members WordPress plugin showing new roles creation screen

I created the role of `media editor`. The idea is that people in this role will be able to upload images after they run through their processing and approval, and edit posts to insert or modify these images.

To accomplish these goals the role needs the following permissions:

- From Media
    
    - Upload Files
- From Posts
    
    - Edit Others' Posts
    - Read

The role doesn't have the publish permission on purpose. Before we publish the post, I want a third person to review and approve the post for publication.

I believe in giving each role as few permissions as possible to accomplish their task. I can assign multiple roles to each user and having smaller roles means I can remove capabilities from a user without having to remember which permissions belong to which role.
