---
title: "Digital Storytelling: Place-based stories"
date: "2017-08-23"
---

One of the things that has really caught my attention is place-based story telling. How can a place tell a story that is different depending on the occasion or the type of story we want to tell. The two biggest technologies for this type of story telling are augmented reality and beacons/Physical web.

## Using beacons to tell a story

Beacons, iBeacons or the Physical Web all refer to the same group of technologies that use Bluetooth Low Energy to broadcast information to devices and apps that are ready to use them. In this section I will concentrate in the [Physical Web](https://google.github.io/physical-web/) technologies because they are what I'm most familiar with. Other beacon technologies should work in a similar fashion.

In "Coffee With a Googler" Laurence Moroney discusses the Physical Web with Scott Jenson. This is the best introduction to the technology for non-technical audiences.

<iframe width="560" height="315" src="https://www.youtube.com/embed/w8zkLGwzP_4" frameborder="0" allowfullscreen></iframe>

The idea behind the physical web is that we can incorporate beacons to everyday objects and places and give these objects and places an online presence and interaction capability. I first saw Physical Web devices demonstrated at the Chrome Developer Summit in 2015 with a vending machine taking input from your mobile phone to "sell" you candy.

We will use the URL capabilities of the beacons to build experiences.

<iframe width="560" height="315" src="https://www.youtube.com/embed/s-4J7cijPAo" frameborder="0" allowfullscreen></iframe>

We can place different pieces of the story in multiple beacons and leave it up to the player to fully construct his version of the story, realizing that the reader may not work on the story linearly or complete it altogether at which point it'll be up to the reader to complete the story to their satisfaction.

## AR: Augmented Reality Worlds

> Augmented reality (AR) is a live direct or indirect view of a physical, real-world environment whose elements are augmented (or supplemented) by computer-generated sensory input such as sound, video, graphics or GPS data. It is related to a more general concept called mediated reality, in which a view of reality is modified (possibly even diminished rather than augmented) by a computer. As a result, the technology functions by enhancing one’s current perception of reality.\[1\] By contrast, virtual reality replaces the real world with a simulated one.\[2\]\[3\] Augmentation is conventionally in real time and in semantic context with environmental elements, such as sports scores on TV during a match. With the help of advanced AR technology (e.g. adding computer vision and object recognition) the information about the surrounding real world of the user becomes interactive and digitally manipulable. Information about the environment and its objects is overlaid on the real world. This information can be virtual\[4\]\[5\]\[6\]\[7\]\[8\] or real, e.g. seeing other real sensed or measured information such as electromagnetic radio waves overlaid in exact alignment with where they actually are in space.\[9\]\[10\] Augmented reality brings out the components of the digital world into a person's perceived real world. One example is an AR Helmet for construction workers which displays information about the construction sites. The first functional AR systems that provided immersive mixed reality experiences for users were invented in the early 1990s, starting with the Virtual Fixtures system developed at the U.S. Air Force's Armstrong Labs in 1992.\[11\]\[12\]\[13\] — [Wikipedia](https://www.wikiwand.com/en/Augmented_reality)

If you've seen [Niantic's](https://nianticlabs.com/) AR games [Ingress](https://www.ingress.com/) and [Pokemon Go](http://www.pokemongo.com/en-us/) you have played an Augmented Reality game. In the images below different Pokemon from the first generation of the Pokemon Go game appear around Embarcadero in San Francisco

![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/02/pokemon-go-1.png) ![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/02/pokemon-go-2.png) ![](//publishing-project.rivendellweb.net/wp-content/uploads/2017/02/pokemon-go-3.png)

Different images from Pokemon Go in San Francisco, CA. Images from [http://www.pokemongo.com/en-us/photos/)](http://www.pokemongo.com/en-us/photos/)

Sadly when Google terminated their Google Glass Explorer program it also terminated any posibility of development outside [Google Glass at Work](https://developers.google.com/glass/distribute/glass-at-work) they left [Microsoft Hololens](https://www.microsoft.com/microsoft-hololens/en-us) as the main commercially available augmented reality development tool set (both hardware and software).

### Some of the players in this market

the list keeps growing larger so I probably won't update it often:

**[Microsoft Hololens](https://www.microsoft.com/en-us/hololens)**

- Untethered
- Full PC running Windows 10, can take advantage of desktop applications as well as AR specific
- Requires Unity to develop
- Windows Only, will use Mac or Linux as a development platform
- Expensive (3 to 5 thousand dollars per unit, current developer price)

<iframe width="560" height="315" src="https://www.youtube.com/embed/2MqGrF6JaOM" frameborder="0" allowfullscreen></iframe>

**[Meta 2](https://buy.metavision.com/products/meta2)**

- Available for presale ($950)
- Tethered

<iframe width="560" height="315" src="https://www.youtube.com/embed/_cmPFsBOquk?rel=0" frameborder="0" allowfullscreen></iframe>

**[Magic Leap](https://www.magicleap.com/)**

- No one knows what the device or the technology looks like
- Adaptive focus
- Cheaper than Hololens but still in the 1 thousand dollar range

<iframe width="560" height="315" src="https://www.youtube.com/embed/BLkFWq_ipCc?rel=0" frameborder="0" allowfullscreen></iframe>

**[CastAR](http://castar.com/)**

- Under Development

<iframe width="560" height="315" src="https://www.youtube.com/embed/GpmKq_qg3Tk?rel=0" frameborder="0" allowfullscreen></iframe>

**AR Toolkit**

- Toolkit to create AR without devices
- Uses device's built in camera and requires WebGL and WebRTC to work
- Doesn't work in iOS yet (no WebRTC)
- Open source Github project

<iframe width="560" height="315" src="https://www.youtube.com/embed/0MtvjFg7tik?rel=0" frameborder="0" allowfullscreen></iframe>

Since I started writing this the Meta 2 went on sale for developers and I've discovered many AR devices targeted to business and sports (Recon Jet) markets. The problem with having so many vendors in the market is that you need to decide what devices to target and how many versions of your experience you want to create.

I'm afraid that it won't be long before we go back to the bad old web days where we had to develop content that would work well on each different browser and not at all in others. Even when using a common development platform (Unity code written in Microsoft's C# language) the code will still be different across platform to make a common development platform still a dream.

For this exploration I've chosen to plan a reading experience for Microsoft Hololens. The device is the best for the way I want to tell stories and for the type of stories that I want to tell.

Building AR experiences with the Hololens presents different challenges than just placing beacons in a place. It needs at least one desktop/laptop machine to create the content, one device to build the world and a way to share the experience with other people wearing the device.

The big advantage of AR over beacons or VR is that we can leverage the world around us to place our content. Augmented Reality or Mixed reality as it's also known allows creators to superimpose virtual object into the real world for users to interact with.

One of the disadvantages that I see for AR storytelling is the size of the device and the adverse public reaction people have had to public use of earlier AR devices like [Google Glass](https://www.google.com/glass/start/) and how people saw them as a threat to privacy and as a way to break the law without people realizing it. We'll talk more about this when we talk about if we are ready for the technology.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ihKUoZxNClA" frameborder="0" allowfullscreen></iframe>
