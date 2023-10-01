---
title: "Work with your content directly on DevTools"
date: "2017-06-26"
---

There are times when I'm working on a design and start tweaking the design in the browser by adding attributes or making changes to the content directly in the browser and wish I could make those changes permanents. Now you can :)

To make a local folder's source files editable in the Sources panel:

1. Right-click in the left-side panel
2. Select `Add Folder to Workspace`
3. Choose location of local folder that you want to map
4. Click Allow to give Chrome access to the folder

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/workspace-detached-dev-tools-window.png)

DevTools detached window

When I click on the left-side panel I'm show the prompt to add the folder to the workspace.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/workspaces-add-folder-to-workspace.png)

Add folder to workspace

The browser will then ask you for full permissions for the workspace.

Make sure you don't share any sensitive information. THis may not be a big problem but we better be sure we're not sharing anything we wouldn't want to share in public.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/workspace-full-access-request.png)

Full permission request

Furthermore you can inspect and edit the DOM and HTML of your page directly. Be careful as this assumes that you are at least familiar with HTML and how CSS classes and IDs affect the document's styling

To inspect a specific element on your page highlight the element, right click and select `inspect`.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/dom-inspect-mouse-inspect.png)

How to inspect an element on yoru page

You can also use keyboard shortcuts to open DevTools in Inspect Element mode: `Ctrl + Shift + C` (Windows) or `Cmd + Shift + C (Mac)` , then hover over an element. DevTools automatically highlights the element that you are hovering over in the Elements panel.

You can edit the elements by double clicking on the element or right clicking on the element and choose an option from the list it presents (shown below).

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/dom-inspect-right-click-options.png)

List of options presented when you right click an element in inspect mode

More in depth information about what you can do and how will it help your workflow is located in the [DevTools Documentation Pages](https://developers.google.com/web/tools/chrome-devtools/inspect-styles/edit-dom)
