---
title: "Working with Service Workers"
date: "2017-06-28"
---

Service Workers are awesome and they are very powerful. They are also very hard to debug. DevTools has supported service workers for a while and has reorganized things around to produce the application panel.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/sw-devtools-application-panel.png)

Devtools application panel

From here you can work with several different technologies that make (Progressive) Web Applications:

- Service Workers
- Local and Session Storage
- IndexedDB
- WebSQL
- Cookies

In this section we'll work with Service Workers. The other sections of the panel are left as an exercise for the reader.

In the application panel the service worker section is the second one from the top on the left-side of the application panel (and highlighted in figure 17)

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/sw-devtools-application-panel-sw-highlight.png)

Service workers option in application panel

The panel will show the service workers active for the site or, if you select the `show all` checkbox at the top of the screen it will show all service workers active in the browser.

The other options include:

- **Offline** takes the browser offline and allows you to test if the offline caching functionality works. For this to work you must have a service worker for your site
- **Update on reload** forces the service worker to update when the page is reloaded. This saves you from having to unregister the service worker every time you make changes to it
- **Bypass for network** ignores the service worker and fetches resources from the network

Each service worker will the source file and when it was received, show its status (active or stopped) and how many clients (windows or browser tabs) are using that particular service worker.

This is important because, unless you've configured the worker to do automatically claim all clients, you must close all the clients before a new version of the service worker will take over.

Each service worker also gives you the following options

- **update** updates the service worker
- **push** simulates a push event
- **sync** simulates a background sync event
- **unregister** removes the service worker from the list

This panel gives you a good starting point for debugging your service workers.
