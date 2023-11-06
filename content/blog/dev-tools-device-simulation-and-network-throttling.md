---
title: "Dev Tools Device Simulation and Network throttling"
date: "2017-06-21"
youtube: true
---

![Device simulation in dev tools, also allows to create custom presets and modify existing ones](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/network-throttle-1)

The network throttling options inside dev tools give you a good starting point for testing what your users' experiences will be like in the devices you're targeting.

![Available network condition presets and the option to add custom ones](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/throttle-index)

At the top of the list you have the option to add new presets and customize existing ones. I've created one customization to the 3G preset by adding latency to, in my opinion, provide a better representation of network conditions outside urban areas.

![Configuring a custom network condition preset using Dev Tools dark theme](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/custom-network-condition-preset)

Be aware that, while the Network Condition emulator is a good starting point for testing your design under different network conditions, it is not a replacement for testing using actual devices. There are things that a desktop machine cannot simulate including:

* Mobile device startup time
* How many low power cores are started versus how many high powered cores are started in a multi-core devices (not all cores in a multi-core mobile phone are made equally)
* How long it takes for a device to start the wifi receiver

More information about network conditions available at the [Google Developers site](https://developers.google.com/web/tools/chrome-devtools/network-performance/network-conditions)

Related video about mobile performance from Alex Russell at the Chrome Developer Summit 2016.


<lite-youtube videoid="4bZvq3nodf4"></lite-youtube>
