---
title: Web AR in the wild -- City Games and Communities
date: 2023-12-31
youtube: true
draft: true
---

I thought that perhaps picking a project to conceptualize around rather than code would be easier for me as a way to get back into AR/VR and WebGL than (re)learning WebGL and the WebXR Device API at the same time.

Something that has been in my mind a lot when thinking about AR is Daniel Suarez books: Daemon and [Freedom<sup>tm</sup>](https://www.wikiwand.com/en/Freedom%E2%84%A2) and how can we leverage our modern technologies to build a next-generation networked community.

The idea of the "Darknet" as a communication hub and online community has always intrigued me. Think of it as an AR version of Lucasfilm's [Habitat](https://www.wikiwand.com/en/Habitat_(video_game)), a free-form unscripted  version of our current MMORPG worlds.

The idea of making a Daemon-like networked environment using current AR technologies present several challenges, both social and technical that I hope to walk through in essay. We'll begin with the technical challenges, those are easier to articulate and present a lower barrier to understanding what they are:

1. How to get consistent outdoors AR?
    * Does WebXR help with the placement of augmented elements in the real world?
2. Can we get things other than markers to display out AR content from?
    * Are beacons (like [Physical Web](https://google.github.io/physical-web/) beacons, iBeacons or [Nearby](https://developers.google.com/nearby/) proximity API) a good way to introduce AR experiences
3. How do we translate 2D content to a 3D environment?
4. Can we move from 2D to 3D and back?
5. Can we generate multi user AR experiences?

For more details, watch Brandon Jones' presentation at Google I/O 2018 for more details on WebXR.

<lite-youtube videoid="1t1gBVykneA"></lite-youtube>

Before we jump to far let's talk about WebXR.

## What is WebXR

In this context, I'll use WebXR to mean the [WebXR Device API](https://immersive-web.github.io/webxr-reference/webxr-device-api/).

WebXR is a group of standards which are used together to support rendering 3D scenes to hardware designed for presenting virtual worlds (virtual reality, or VR), or for adding graphical imagery to the real world, (augmented reality, or AR).

The WebXR Device API implements the core of the WebXR feature set, managing the selection of output devices, render the 3D scene to the chosen device at the appropriate frame rate, and manage motion vectors created using input controllers.

To accomplish these things, the WebXR Device API provides the following key capabilities:

* Find compatible VR or AR output devices
* Render a 3D scene to the device at an appropriate frame rate
* (Optionally) mirror the output to a 2D display
* Create vectors representing the movements of input controls

For more information, check [Fundamentals of WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Fundamentals) for a theoretical foundation and [Movement, orientation, and motion: A WebXR example](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Movement_and_motion) for a code example of WebXR.

## How to get consistent outdoors AR?

If you're using phones or other devices to work with AR experiences the issue becomes how to seed the environment. We're not using devices like DayDream, Oculus or Vibe so we can't have a full on VR experience, and that wouldn't be the objective anyways.

Using the WebXR Device API we can now place virtual items in physical spaces so users have access to them either through dedicated devices or through their WebXR enabled browsers using Magic Windows. The beacons could work presenting notifications to users that will then use browsers in ARCore/ARKit powered devices or with the right applications to experience the content as designed.


## Can we get things other than markers to display out AR content from?

## How do we translate 2D content to a 3D environment?

## How do we move from 2D to 3D and back?

## Can we generate multi player AR experiences?



## Links and resources

* Inspiration
  * [Daemon by Daniel Suarez](https://amzn.to/2Kr6SCp)
  * [Freedom (TM) by Daniel Suarez](https://amzn.to/2Kf2RF7)
  * [Understanding the Daemon](https://web.archive.org/web/20211205205841/https://www.faz.net/aktuell/feuilleton/medien/english-version-understanding-the-daemon-1621404.html?printPagedArticle=true#pageIndex_0)
* Groups
  * [Google AR](https://github.com/google-ar)
  * [Mozilla Mixed Reality Blog](https://blog.mozvr.com/)
  * [Progressive WebXR](https://blog.mozvr.com/progressive-webxr-ar-store/)
* Development Tools
  * [three.ar.js](https://github.com/google-ar/three.ar.js)
  * [Playcanvas AR](https://github.com/playcanvas/playcanvas-ar)
  * [three.xr.js](https://github.com/mozilla/three.xr.js/)
* Beacons and Placement Technologies
  * [Physical Web](https://google.github.io/physical-web/)
* Examples and Demos
  * [WebXR Device API](https://www.w3.org/TR/webxr/)
  * [WebXR examples](https://immersive-web.github.io/webxr-samples/)
* Hardware Devices:
  * [Oculus Rift](https://www.oculus.com/rift-s/)
  * [Meta Quest 2](https://en.wikipedia.org/wiki/Quest_2)
  * [Samsung Gear VR](http://www.samsung.com/global/galaxy/gear-vr/)
  * [HTC Vive](https://www.htcvive.com/)
  * [Windows Mixed Reality headsets](https://developer.microsoft.com/en-us/windows/mixed-reality)
