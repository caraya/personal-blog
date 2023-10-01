---
title: "The Physical web: I have 3 beacons"
date: "2016-02-17"
categories: 
  - "technology"
---

The title of this post comes from the fact that I own three physical web beacons that I got at the Chrome Dev Summit last year. I hadn’t had much time to think about what I wanted to do with it and late last year I did a [moon idea post](https://publishing-project.rivendellweb.net/conected-city/) about what a large scale deployment may look like. This is a scaled down more realistic and easier to implement (I hope) idea.

I heard about the [Physical Web](https://google.github.io/physical-web/) last year during the Chrome developer summit. It presents a different take on IoT and it involves the web and it promises to be opt in rather than forced down your throat with notification after notification appearing without you knowing why it happened or where it really came from.

<iframe width="560" height="315" src="https://www.youtube.com/embed/1yaLPRgtlR0?rel=0" frameborder="0" allowfullscreen></iframe>

It also gives web presence to objects that we would never think of being web enabled. Let’s think about this for a minute… we can use the web to interact with physical objects using configurable [Bluetooth Low Energy](https://en.wikipedia.org/wiki/Bluetooth_low_energy) signals and without needing to go through the app process (find, download, install, register, use.) Physical web enabled devices send a signal with a URL… whatever URL we want to post so we can craft the beacon’s web presence to match a corporate site, to provide an application related to the beacon location, provide a static information page. The possibilities are only limited by what the web can do.

There is a related technology called [Web Bluetooth](https://www.w3.org/community/web-bluetooth/) that will, when implemented, allow direct contact between enabled phones and devices, eliminating the need for an Internet connection… stay tuned for this one.

<iframe width="560" height="315" src="https://www.youtube.com/embed/_BUwOBdLjzQ?rel=0" frameborder="0" allowfullscreen></iframe>

## Ideas

The physical web sits at the intersection of the web and the physical world. What can we do with the technology right now?

Because I’m primarily interested in publishing most of the examples below use static web content as the content of the beacon URL. This doesn’t always have to be the case and we’ll discuss this later in the essay.

### The cookbook

In the [Physical Web Cookbook](http://google.github.io/physical-web/cookbook/) the Physical Web community presents use cases for how we can implement the technology.

## Some ideas of my own

Using the three beacons I own in different situations and for different scenarios. Because I’m primarily interested in publishing, the majority of these sites the beacons point to are static and will have no, or very little, app-like interactivity. Exceptions will be noted in the corresponding section.

### I have 3 beacons at home

While at home I want to be able to do three things:

- Keep a reading list of all technical and non technical books I’m interested in
- Keep a task list for all my personal projects
- Keep a list of recipes and the ingredients needed for each recipe

Rather than have to write down things in a whiteboard or keep a recipe book online I thought it would be a good idea to use the beacons as a way to explore location-based content by using proximity to the devices.

A devicce installed in the kitchen to list the recipe list points to a Jekyll page that lists the recipes along with the ingredients that we need for each recipe.

The content is static, we can’t add recipes or ingredients to individual recipe but it shouldn’t be hard to update the Jekyll site we use

The ToDo list uses the [Polymer implementation](http://todomvc.com/examples/polymer/index.html#/) of the ToDo application from [todomvc.com](http://todomvc.com/examples/polymer/index.html#/)

The reading list is a static page so it shouldn’t be hard to add and remove content or to extend the functionality of this page.

The examples are contrived, but they run without requiring you to have additional IoT devices at home. If we did we could convert one of the beacons listed below to a list of devices with a link to theri admin interfaces so we can control all devices from a central point using their REST APIs… because they all have REST APIs and don’t require you to download an app, RIGHT?!

### I have 3 beacons at a coffee shop, as an art gallery

As a display gallery space we can add beacons to each particular space with links to either the artists web presence or to static content with information about the specific pieces or whatever else the author wants to share with the audience.

Static doesn’t mean boring. We can incorporate multimedia, animations and pretty much anything we can think of.

### I have 3 beacons at my office

Office spaces are harder to track but I can think of a few things we can use beacons for:

- A central repository for HR information that doesn’t change or is not specific to individual employees
- News and events repository
- Team calendar

In an office space it may be tempting to put everything in beacons with time sensitive information. Don’t do this! Remember that people have to know the beacon exists and have to opt in to view the content we need to be extra careful with the content we advertise behind physical web beacons.

## Other ideas

### Promotional scavenger hunt type activities

The local chamber of commerce has approached your team to implement a scavenger hunt for the downtown district. The idea is to promote downtown restaurants and stores without being intrusive.

The marketing team has given you a list of 20 places that they want highlighted and a list of prices each individual place will give participants when they hit that particular location.

In addition to information about the venue, a way to redeem the price and more information about the venue, each page can verify the visit and provide an identifying string that the user can enter in a final page to verify completion of the hunt or the page could connect to a server to indicate success of the activity.

This hits in an interesting issue of privacy versus tracking results. The page the beacon points to can do the tracking regardless of what the Physical web does…. Let’s

### Museum exhibits

Rather than put 100 beacons per floor in a museum like the [Tech Museum of Innovation](http://www.thetech.org/) in San José a more reasonable solution would be to put the beacons 1 to an exhibit with additional beacons for things we want to highlight.

The exhibit beacons can provide additional information about the exhibit, the technology being described or any other relevant information.

In an non technology museum we could describe the period of the exhibit, the author(s) of the pieces being shown and links to other exhibits in the museum.

As someone who loves museums it would be tempting to go overboard and saturate the phones with hundreds of beacons for the items in a given collection it can quickly become overwhelming and hard to manage for the end user. That’s why I suggest doing it per exhibit and only adding beacons to individuall items where it makes sense.

### Public art exhibits

There may be situations where the art is not in a private space where we can easily place the beacons we may find ourselves in public exhibits or in open spaces where the signal of the beacon has to be stronger than what’s recommended.

An alternative would be to build a small [arduino based server](http://www.instructables.com/id/ServDuino-Arduino-Webserver/?ALLSTEPS) to handle all the traffic so we won’t have to deal with latency for the exhibits’ content. Another thing I’m not 100% certain about is how well beacons work outdoors.

### House sales information

### Restaurant menus

# Dreaming through the noise: Challenges and Possibilities

**_Standardizing the protocol_**

The physical web, as presented here, uses the [Eddystone](https://github.com/google/eddystone) URL protocol, also developed by Google, to publish our chosen URL to the world. I totally understand that there is a lot of aprehension when Google produces something… It ties us to the whims of a vendor who will close projects when they are not profitable or the audience drops below a certain threshold that no longer merits engineering resources.

While this concept and the original protocols originated from Google, this is not a Google project. It’s a beginning meant to show the potential of a technology to attract other vendors, companies and developers to use the technology and see how far it can go. If it takes off it won’t matter (too much) whether one company or another drops out of the development race… the protocol will be open and will be available for you to build your experiences with.

<iframe width="560" height="315" src="https://www.youtube.com/embed/QfNQnVc7xRM?rel=0" frameborder="0" allowfullscreen></iframe>

**_Discoverability_** How do we advertize physical web devices?

Because it is an opt-in technology it’s difficult to think of ways to advertize the beacon itself. The beacons are not in-your-face pushing content to your device which is good but the downside of privacy is that you can’t advertise the beacon and its content.

If we remember the old web most search engines started as manually curated collections of links. Granted, there were not many URLs to curate but they were all reviewed by a human before being incorporated into the directory.

**_What kind of content can we push into the physical web?_** Because I’m primarily interested in publishing content I’ve stuck to static sites built with Jekyll to display the content linked to a beacon’s URL.

This is not the only option.

We have to remember that the payload for our beacons is just a URL and once we click on it the user is interacting with a regular web site. We can use whatever technology we’re comfortable implementing for a mobile audience. Bandwidth considerations have also convinced me that it’s better to keep it simple and provide basic functionality without going crazy with features.

 **_When a beacons is not a beacon but it still works like a beacon_** I’ve stayed with the beacons I got at the Dev Summit as my delivery mechanism. They are not the only way we can shape the beacons.

In the videos below the beacons have been embedded in different objects, from a parking meter to a vending machine to maybe a plant in the restaurant’s lobby. The point is that the physical web becomes ubiquitous

<iframe width="560" height="315" src="https://www.youtube.com/embed/BL6djal9mqY?rel=0" frameborder="0" allowfullscreen></iframe>

I was able to interact with the vending machine and the parking meter while at the Chrome Dev Summit. The vending machine even had my favorite candy :-)

The parking meter demo presents an interesting conundrum. What happens when there are 50 or 100 or even 1000 devices surrounding you?

Depending on how the devices are configured in terms of signal strength we will only get the ones closest to the phone we’re searching with.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ysxB_PXFImE?rel=0" frameborder="0" allowfullscreen></iframe>

The buzzer is an interesting concept. When you open the page associated with the beacon’s URL it’ll open a web application that will take care of notifying users when their table is read. No more pucks with loud alarms and bright red led lights telling you, and the world around you, that your table is ready.

<iframe width="560" height="315" src="https://www.youtube.com/embed/b0GDk-53fTo?rel=0" frameborder="0" allowfullscreen></iframe>

We can push the concept even further.

The toy in the video below communicates with the device using Web Bluetooth so the communication is safer and more reliable because the network has been eliminated as a point of failure.

<iframe width="560" height="315" src="https://www.youtube.com/embed/PwK3ccOJ6EY?rel=0" frameborder="0" allowfullscreen></iframe>

In the video from Beyon Tellerand 2015, [Stephanie Rieger](https://stephanierieger.com/) explores some of the ideas in this essay from the perspective of a UX designer and sheds more light into this world we are just starting to walk in.

<iframe src="https://player.vimeo.com/video/144771656?color=ffffff&amp;byline=0&amp;portrait=0" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

## What’s next?

I think the next thing is to stop and think about the impact of the technologies on the people using it. We’re not designing airplanes or hospital equipment, true, but the Physical web and IoT technologies in general have a much higher impact than our standard web experience… there are much larger privacy implications, people may be afraid of the “always on” IoT experience.

Even with a beacon approach like the Physical Web there may be an expectation (real or not) that whenever they access a beacon they will be tracked and spamed with marketing messages and emails from places similar to the ones we visited.

We’re starting a new experience… whether it’ll be a good one or will turn into another Google Glass is yet to be seen.

Stephanie Rieger first articulated some of the ideas in this essay in an interview with Jen Simmons on ￼The Web Ahead￼ ([episode 112](http://thewebahead.net/112).)

I think the most important thing I took from Stephanie’s interview is this bit from Jen:

> I don't know if it's going to be better. We should be thoughtful about the choices we make. We should be skeptical about just assuming technology will be better just because it's technology

Stephanie then goes on to remind the audience that:

> Before, if you designed a web page and it wasn't thoughtfully designed, there were always implications, there were implications on your business, on maybe your conversion, on how many people accessed yours site, all this stuff, there were impacts. But the impacts were pretty mild compared to some of the stuff with some of these new products. And I think we're just maybe not yet used to thinking at that scale yet, right? People who design things like airplanes and things that could kill people, so to speak, they're used to thinking about impact all the time, but often, as again, whether it's visual or a UX designer, or product people or engineers who design software, we haven't necessarily always been exposed to that level of, "Ok, well this is actually a thing that will impact somebody's life every single day. They could actually sometimes maybe cause harm, that could also be always there, always on, always watching them. There's issues of privacy, there's issues of just how people feel about having this thing in their house." There's all these new things, basically, to think about. And again, I'm not trying to make it sound like we haven't been thinking about it or that it's all bad, it really isn't, but it's an awful lot more stuff to think about, is I guess what I'm saying.
