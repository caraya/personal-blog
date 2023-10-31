---
title: "Accessibility: Test your content"
date: "2018-01-10"
youtube: true
---

Now that we've created accessible components. Now we get to test them.

To test accessible components we'll use 3 tools:

* The Accessibility Audit built into Chrome Dev Tools
* aXe and aXe Coconut from [Deque Systems](https://www.deque.com/)
* Screen Readers

### Lighthouse Accessibility Test

In recent versions of Google Chrome, there is a new **Audits** panel in Dev Tools. I start here because it uses Lighthouse to run the test and aXe Core under the hood so, unless you have specific requirements why aXe Core or Coconut are required, this may be the only tool you need outside of a screen reader.

To get started open Dev Tools (`Control+Shift+I` in Windows, `Command+option+i` on Mac). You will see something similar to the image below. Click on `Audits`.

![Audit Panel in Chrome Dev Tools](/images/2017/12/audits-panel-devtool.png)

This will present you with a list of possible audits to run. In this case, we want to uncheck all audits except accessibility. Then we click `Run Audit`.

![Available Audits in Chrome Dev Tools](/images/2017/12/devtools-avilable-audits.png)

Chrome will run its tests and give you a score and a list of items to change shown below.

![Accessibility Audits Results](/images/2017/12/devtools-accessibility-audit-result.png)

It's important to realize that, while automated testing is good and will get you most of the way there, manual testing and decision making are still important.

In the results shown in figure 3, I know that the contrast issues are the colors that I use for syntax highlighting (using Prism.js against the theme background). It's up to me to decide if I want to change the theme to provide better contrast or keep the theme and the score of 91.

### aXe and aXe Coconut Browser Extensions

aXe browser extension for [Chrome](https://chrome.google.com/webstore/detail/aXe/lhdoppojpmngadmnindnejefpokejbdd)and [Firefox](https://github.com/dequelabs/aXe-firefox-devtools) automates testing and evaluation of your page's accessibility.

if you're using Firefox, be aware that the Firefox Extension may not work with the latest vesions. Deque provudes an [explanation](https://www.deque.com/blog/understanding-axe-attest-extension-compatibility-firefox/) about what version of aXe supports what version of the browser.

<lite-youtube videoid="FW1giWW5M9I"></lite-youtube>

If you need the latest functionality, for example, you're working with ShadowDOM and Custom Elements you can use [aXe Coconut Chrome Extension](https://chrome.google.com/webstore/detail/aXe-coconut/iobddmbdndbbbfjopjdgadphaoihpojp) to use the latest aXe features and tests. The instructions are the same for both and they can be installed concurrently; think of Coconut as the aXe version of Chrome Canary.

For Chrome the process is simple:

* Download the appropriate extension from the Chrome Web Store
* Install the extension when prompted
* Open DevTools and select aXe or aXe Coconut (Figure 4 is open with aXe)

![aXe ready to run](/images/2017/12/axe-after-install.png)

* Click Analyze on the left-hand frame
* Axe will produce a report with all accessibility violations (figure 5 shows aXe Coconut)

![aXe Coconut report](/images/2017/12/axe-coconut-report.png)

As with the Lighthouse report, there are things that we'll have to manually decide if there are errors or not and whether we need to change the code to fix the problems aXe reported.

### Testing With A Screenreader

The last part of the accessibility evaluation is to use a screen reader to read the page back to you. This will not catch accessibility violations like Lighthouse or aXe do but it'll give you an idea of easy it is for screen readers to understand the content of your page or app.

Rather than try to walk you through using a screen reader I'll link to two awesome introductory tutorials from Rob Dodson, part of his [A11ycasts series](https://www.youtube.com/playlist?list=PLNYkxOF6rcICWx0C9LVWWVqvHlYJyqw7g) in Youtube: one for Voice Over (built into macOS) and NVDA (free for Windows).

<lite-youtube videoid="Jao3s_CwdRU"></lite-youtube>

<lite-youtube videoid="5R-6WvAihms"></lite-youtube>

It has been an eye-opening experience to hear my content read back to me as an editor would; someone who doesn't understand the content as well as I do and who doesn't read what he meant to write rather than what's actually written.
