---
title: "Test the hell out of everything"
date: "2015-09-07"
categories: 
  - "typography"
---

Testing on web applications is usually a pain and testing for our typographical work is no exception. We'll discuss how to build a cross-platform arsenal with a single laptop, Open box and 2 virtual machines and how to use that arsenal to test our content, do screen shots and even start adding ebook apps on all of them. Here we go:

## What do we need to test with?

I'm a Mac user so that's my primary platform for testing and development. In my Mac I have the following browsers and applications:

### Desktop

- Chrome [release](http://www.google.com/chrome/browser/desktop/index.html) and [Canary](https://www.google.com/chrome/browser/canary.html) The Canary channel has the latest and greatest additions to Chrome and it will not overwrite your standard Chrome installation
- Firefox [release](https://download.mozilla.org/?product=firefox-stub&os=win&lang=en-US) and [developer edition](https://www.mozilla.org/en-US/firefox/developer/)
- Safari comes installed with OS X
- I used to include Opera as an option but since they moved to WebKit and then to Blink, they are too close to an existing browser to merit download. If you still want it, you can download it [directly from Opera](http://www.opera.com/computer/)

### Open box Virtual Machines

I'd rather not have to get a brand new computer to download the browsers

- Download Virtual Box from [its website](https://www.virtualbox.org/)
- Microsoft makes [virtual machines available](http://dev.modern.ie/tools/vms/) for all the versions of IE and Edge in different versions of Windows
- If you're planning on working with MS Edge and IE 11 in a windows 10 environment you can join the [Windows Insider program](https://insider.windows.com/) and get an ISO image that you can install as a Virtual Machine
- You can download an ISO of your favorite Linux Distribution (I favor [Ubuntu LTS](http://www.ubuntu.com/download/desktop)) and install it as a virtual machine. There are also [alternative installation methods](http://www.ubuntu.com/download/alternative-downloads) you can use if the default doesn't work for you

The Windows virtual machines you get from Microsoft have one version of IE and one version only. I'd always stay with IE 10 on Windows 8.1 in one machine and IE 9 on Windows 7. To the default IE browser you can then add the same browsers as listed under Desktop (if supported by your Linux distribution)

### Mobile devices

Most browsers available for mobile devices come bundled with phones and tables which make testing in the actual devices a little more complex. We need the following:

- Table and/or Phone running Android to run WebView, Chrome, Firefox and, optionally, Opera Mini
- iPhone/iPod Touch running different versions of iOS (7, 8 and 9) using Safari Mobile. Even though there are

### Optional e-readers

Since proofing ebooks usually entails building epub and multiple versions of Kindle format packages they will take a second rung in our testing but you can download apps for the following ebook vendors. Note that the apps do not replace testing the books in the devices themselves because the experience in the apps can be radically different than reading the same book in the devices themselves.

If you can, get at least one iPad (retina would work best), one iPhone, one Android phone and one Android tablet. If you can't then get the following applications:

- [iBooks](https://www.apple.com/ibooks/) is a Mac only application that comes installed in later versions of Yosemite and El Capitan or can be downloaded from the App Store
- [Kindlegen](http://www.amazon.com/gp/feature.html?docId=1000765211) is both a previewer and a generator for Kindle files. It requires Java 6 so it may or may not work on your system
- [Kindle Previewer](http://www.amazon.com/gp/feature.html/ref=amb_link_359603402_5?ie=UTF8&docId=1000765261) let's you preview your content using simulations of multiple Kindle devices
- [Nook](http://www.barnesandnoble.com/u/nook-mobile-app/379003593)
- [Kobo](https://www.kobo.com/apps)

## Actually testing your content

If we're working with mostly static content then all you need to do is make sure that it looks close to the design brief in all browsers you test with. We are not talking about unit test or Test Driven Development (TDD)

## External (paid) services

If you don't want to bother with installing virtual machines and operating systems that take gigs out of your hard drive you have alternatives. Paid alternatives but alternatives none the less.

[Browserstack](Browsertack) provides testing support in a comprehensive [list of supported browsers and platforms](https://www.browserstack.com/list-of-browsers-and-platforms?product=live). It is paid but the prices are reasonable for the services it gives you.

Quirktools [Screenfly](http://quirktools.com/screenfly/) provides a simpler way to test your design on multiple browsers. The price is better (free) but the support doesn't seem to be as complete as Browserstack's
