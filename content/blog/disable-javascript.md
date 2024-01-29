---
title: "Disable Javascript"
date: 2024-02-05
tags:
  - Javascript
  - Browsers
  - DevTools
---

I am not going to rehash the "people don't disable Javascript" debate. Most of the time Javascript is enabled and everything is good.

However, having Javascript enabled doesn't mean that Javascript will always work, as outlined in [Everyone has JavaScript, right?](https://www.kryogenix.org/code/browser/everyonehasjs.html)

There are times when we want to test how your page would work if Javascript is disabled or not present. This is the scenario we'll discuss in this post.

We will leverage browsers' devTools to disable Javascript for the current session so we can test whether Javascript is enabled or not.

## Chrome

The Chrome team provides a full explanation with images in [Disable JavaScript](https://developer.chrome.com/docs/devtools/javascript/disable).

I've summarized it below:

1. Open Chrome DevTools. Depending on your operating system, press one of the following:
     * On Windows or Linux, [[Control]]+ [[Shift]] + [[P]]
     * On MacOS, [[Command]] + [[Shift]] + [[P]]
2. Start typing javascript, select Disable JavaScript, and then press Enter to run the command. JavaScript is now disabled.

JavaScript will remain disabled in this tab so long as you have DevTools open.

To re-enable JavaScript:

1. Open the Command Menu again and run the Enable JavaScript command.
2. Close DevTools.

## Safari

Safari provides the ability to Disable Javascript from the Web Inspector, available in Safari's Develop menu.

If you don’t see the Develop menu in the menu bar, choose ***Safari > Settings***, click ***Advanced***, then select ***Show **features for **Web Developers” located at the bottom of the screen.

To disable Javascript follow these steps:

1. Make sure that the Develop menu is enabled
2. Open the web inspector by typing [[Command]] + [[Option]] + [[i]]
3. Click on the monitor icon on the top left side of the inspector window
4. Select **disable Javascript**

![Location of the disable Javascript Option in Safari Web Inspector](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/disable-javascript-in-safari.png)


## Firefox

Likewise, Firefox provides a way to temporarily disable Javascript for the current session.

1. Open Firefox DevTools. Depending on your operating system, press one of the following:
     * On Windows or Linux, [[Control]]+ [[Shift]] + [[i]]
     * On MacOS, [[Command]] + [[Option]] + [[i]]
2. Click on the customize button (three horizontal dots) to the left of the close button
3. Click Settings
4. The 'Disable Javascript' option is on the advanced options block, at the bottom right of the screen

![Location of the disable Javascript Option in Firefox DevTools](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/disable-javascript-in-firefox.png)

## Conclusion

All these methods will provide for temporary disabling Javascript so you can test how your application behaves when Javascript is not enabled.

This will save you from any potential surprises.
