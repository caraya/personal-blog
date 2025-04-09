---
title: AR in the Wild -- City Games and Communities
date: 2024-06-30
youtube: true
tags:
  - Javascript
  - VR
  - AR
  - Immersive Technologies
draft: true
---

## Intro and explainer

This post spans several (four or five!) years from the time it was started to when it was published. It's still a theoretical exercise where I'm asking questions and providing what I believe are the answers to these questions as I continue to do research.

Technologies, like the [Google Maps Gaming API](https://developers.google.com/maps/documentation/gaming), have been deprecated but their documentation remains on their website, although it's unknown for how long.

Another set of technologies, like [WebVR](https://webvr.info/), has evolved into the [WebXR Device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API) that encompasses both VR and AR experiences. Most WebGL and WebVR libraries are moving to support The WebXR Device API.

There are also proprietary technologies like Niantic Lightship and Microsoft Mesh also present ways to create multi-user AR experiences.

Other technologies like [WebGPU](https://www.w3.org/TR/webgpu/) and [WGSL](https://www.w3.org/TR/WGSL/) are still in development. Their initial implementations in browsers can improve performance of WebXR applications.

I thought that perhaps picking a project to conceptualize around rather than code would be easier for me as a way to get back into AR/XR and learn WebXR Device API.

Something that has been in my mind a lot when thinking about AR is Daniel Suarez's books: Daemon and [Freedom<sup>tm</sup>](https://www.wikipedia.com/en/Freedom%E2%84%A2) and how can we leverage our modern technologies to build a next-generation networked community.

The idea of the "Darknet" as a communication hub and online community has always intrigued me. Think of it as an AR version of Lucasfilm's [Habitat](https://www.wikiwand.com/en/Habitat_(video_game)), a free-form, unscripted, version of our current MMORPG worlds.

The idea of making a Daemon-like networked environment using current AR technologies presents several challenges, both social and technical that I hope to walk through in this essay. We'll begin with the technical challenges, which are easier to articulate and present a lower barrier to understanding what they are:

1. How to get consistent outdoor AR?
2. Can we get things other than markers to display AR content?
3. Can we generate multi-user AR experiences?

## What is WebXR

In this context, I'll use WebXR to mean the [WebXR Device API](https://immersive-web.github.io/webxr-reference/webxr-device-api/).

WebXR is a group of standards that are used together to support rendering 3D scenes to hardware designed for presenting virtual worlds (virtual reality, or VR), or for adding graphical imagery to the real world, (augmented reality, or AR).

The WebXR Device API implements the core of the WebXR feature set, managing the selection of output devices, rendering the 3D scene to the chosen device at the appropriate frame rate, and managing motion vectors created using input controllers.

To accomplish these things, the WebXR Device API provides the following key capabilities:

* Find compatible VR or AR output devices
* Render a 3D scene to the device at an appropriate frame rate
* (Optionally) mirror the output to a 2D display
* Create vectors representing the movements of input controls

For more details, watch Brandon Jones' presentation at Google I/O 2018 for more details on WebXR.

<lite-youtube videoid="1t1gBVykneA"></lite-youtube>


You can also check [Fundamentals of WebXR](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Fundamentals) for a theoretical foundation and [Movement, orientation, and motion: A WebXR example](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Movement_and_motion) for a code example of WebXR.

## How can we generate interactive AR displays over a real-world location?

That is what AR and the AR portion of XR were designed to do. The hardest part is to figure out what set of technologies we want to use to place content and how to make it persist for people to enjoy the AR experiences

Using the WebXR Device API we can now place virtual items in physical spaces so users have access to them either through dedicated devices or through their WebXR-enabled browsers using Magic Windows. The issue is that WebXR users place content for their usage. There is no way I'm aware of to connect multiple players

[Ingress](https://ingress.fandom.com/wiki/Ingress) and [Pokemon Go](https://en.wikipedia.org/wiki/Pok%C3%A9mon_Go) presented a different interface to augmented reality. They seeded locations around the world with content for the game and let players (either individually or in groups) face the game-generated content either in 2-D or in AR on top of the actual environment the player is in.

Some of these AR hybrid games include (not all these games are live anymore):

* Ingress Prime
* Harry Potter: Wizards Unite
* The Witcher: Monster Slayer
* Sharks in the Park
* Ghost Busters World
* Jurassic World Alive
* Pokémon Sword And Shield
* Dragon Quest Walk
* The Walking Dead: Our World

Some of these games use the deprecated Google Maps Gaming API. This API allowed developers to leverage Google Maps to create interactive experiences similar to what Pokemon Go did with a proprietary API.


## Can we generate multi-user AR experiences?

There is an API proposal on the immersive web community group for a [WebXR Mesh Detection Module](https://immersive-web.github.io/real-world-meshing/). As I understand it, this module was superseeded by the [WebXR Augmented Reality Module - Level 1](https://www.w3.org/TR/webxr-ar-module-1/). This specification interfaces with native mesh detection APIs to provide a way to detect the real world enviroment and create a mesh of the environment for XR objects to interact with. This is similar to what the proprietary [ARKit](https://developer.apple.com/augmented-reality/arkit/) and [ARCore](https://developers.google.com/ar) APIs do.

Niantic Labs, the creators of Ingress and Pokemon Go, released the [Lightship platform](https://lightship.dev/).

<lite-youtube videoid="XLI-Ka_pmiw"></lite-youtube>

The Lightship platform provides everything that developers need to create AR worlds that can be shared by a group of users.

The platform provides the following features:

Depth, Occlusion, and Meshing
: Work on any device, regardless of lidar capability, at greater distance than lidar-based AR.

Semantic Segmentation
: There are 20 channels available for mask generation and scene queries for AI and gameplay.

Dynamic Navigation in AR using Navigation Mesh
: You can have AI creatures move around your scene as it is generated.

The Visual Positioning System (VPS)
: Provides a way to persistently anchor content to real world location with centimeter-level accuracy.

Shared AR
: Up to ten players can join a room and interact in a shared AR space through a process called co-localization.
: After co-localizing (using either VPS or a QR code), players can see positions of objects and each other in the same physical space!

The downside of Light Ship is that it only works with Unity, not necessarily a bad thing, but it does limit the number of developers who can use it. The platform is also not free, although there is a free tier for developers to get started.

[Microsoft Mesh](https://www.microsoft.com/en-us/mesh#Overview). This technology provides similar bennefits to the technologies we've previously discussed but it seems to be tied to specific Microsoft products (Microsoft Teams) so, unless you use that tool, the functionality is very limited.



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
  * [Meta Quest 3](https://en.wikipedia.org/wiki/Meta_Quest_3)
  * [Samsung Gear VR](http://www.samsung.com/global/galaxy/gear-vr/)
  * [HTC Vive](https://www.htcvive.com/)
  * [Microsoft Hololens 2](https://www.microsoft.com/en-us/hololens)
  * [Windows Mixed Reality headsets](https://developer.microsoft.com/en-us/windows/mixed-reality)
* Multi-user experiences
  * Niantic [Lightship platform](https://lightship.dev/)
  * [Microsoft Mesh](https://www.microsoft.com/en-us/mesh#Overview) Preview
  * [WebXR Mesh Detection Module](https://immersive-web.github.io/real-world-meshing/)

