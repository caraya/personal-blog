---
title: "DevTools Audits: powered by Lighthouse"
date: "2017-07-05"
---

This feature is only available in Chrome 60 and later

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is a tool to test if your web content (app or site) meets the criteria for Progressive Web Applications and other tests to make sure your application performs well and is accessible.

As of Chrome 60 you can run the lighthouse tests within DevTools Audits menu. This menu is located on the far right of the DevTools menu bar.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/audit-menu.png)

DevTools Audits Menu

When you access the menu you will see the Lighthouse logo and a button to begin the tests.. When you click on that button you will be presented with a menu of options representing the tests you can run.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/audit-test-options.png)

The 4 types of test you can run from DevTools

The available tests are:

- **Progressive Web Application** Does the oage meet the requirements of a PWA?
- **Performance** How long does it take for the app to load and become responsive?
- **Best Practices** Does the app follow best practices in application development?
- **Accessibility** How accessible is your application?

Once you've chosen what test to run and have clicked the `perform an audit` button you will be see results similar to the ones shown in the image below.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/06/audit-results.png)

Audit results

The circles at the top of the report show passing percentages for each of the tests you ran. Individual results and suggestions appear as you scroll down the report. The left window will have a list of all the reports you've run on this browser. You can run additional tests and remove tests when you need to run them again.

As with many things in DevTools, these reports are advisory in nature and will not implement any changes on your code. It is up to you as developer to make the changes you need to make.
