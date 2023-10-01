---
title: "EME, DRM and The Web Platform"
date: "2016-07-24"
---

The EME controversy rears its ugly head again but this time it seems like it's going to end poorly for users and rather well for content creators. EME as currently implemented would enable closed source DRM on web browsers for movies and tv series through vendors like Hulu and Netflix among others.

EME is based HTML5 [Media Source Extensions](https://www.wikiwand.com/en/Media_Source_Extensions), which enables adaptive bitrate streaming in HTML5 using e.g. MPEG-DASH with MPEG-CENC protected content.

These forms of protected contents are protected by legislation pieces like Section 1201 of the [The Digital Millenium Copyright Act](https://www.wikiwand.com/en/Digital_Millennium_Copyright_Act) in the US; European laws that implement Article 6 of the EUCD; and Canada's Bill C-11 and similar legislation that the [US Trade Representative](https://www.wikiwand.com/en/Office_of_the_United_States_Trade_Representative) made a requirement in trade negotiations with the United States. so countries will not be in the [Special 301 Report](https://www.wikiwand.com/en/Special_301_Report) that uses data provided by private organizations to qualify how well a country respects intellectual property rights.

The short version is that whatever people do to circumvent copy protections can open them to legal iabilities. The reason for the circumvention doesn’t matter: it could be a security researcher working on CDM vulnerabilities or people who need unencrypted versions of the videos for accessibility purposes.

The Electronic Fronteer Foundation hs proposed covenants not to sue security researches as an exit condition for EME to become a recommendation ([the most mature W3C specification level](https://www.w3.org/2015/Process-20150901/#maturity-levels) and what is usually endorsed by its director.) It has been turned down at every level and the recommendation has moved to Candidate Recommendation on July 5, 2016.

## Technical TL;DR

> EME is a JavaScript API that is part of a larger system for playing DRMed content in HTML `<video>`/`<audio>`. EME doesn’t define the whole system. EME only specifies the JS API that implies some things about the overall system. A DRM component called a Content Decryption Module (CDM) decrypts, likely decodes and perhaps also displays the video. A JavaScript program coordinating the process uses the EME API to pass messages between the CDM and a server that provides decryption keys. EME assumes the existence of one or more CDMs on the client system but it doesn’t define any or even their exact nature (e.g. software vs. hardware). That is, the interesting part is left undefined. From [https://hsivonen.fi/eme/](https://hsivonen.fi/eme/)

## Technical Context

> Major Hollywood studios require that companies that license movies from them for streaming use DRM between the streaming company and the end user. Traditionally, in the Web context, this has been done by using the Microsoft PlayReady DRM component inside the Silverlight plug-in or the Adobe Access DRM component inside Flash Player. As the HTML/CSS/JS platform gains more and more capabilities, the general need to use Silverlight or Flash becomes smaller and smaller, such that soon the video DRM capability will be the only thing that Silverlight and Flash have but the HTML/CSS/JS platform doesn’t. Proposals have been written to augment the video element with features that enable the Netflix player to be ported from Silverlight to HTML5 video without a loss of features. The additions are split across two specifications: Media Source Extensions (MSE) and Encrypted Media Extensions (EME). The noncontroversial parts (giving JS precise control over media-related networking) are in MSE and the controversial parts (DRM interface) are in EME. From [https://hsivonen.fi/eme/](https://hsivonen.fi/eme/)

## Who is affected

Potentially everyone using EME is open to vulnerabilities and the DCMA cloud may prevent resesarchers from disclosing the vulenrabilities in any form. Anyone who may be interested in using raw video from an EME encrypted source is liable to prosecution under DCMA .

Problem is that because of the restrictive natue of DCMA and similar laws we may never really know who is affected until it’s too late.

## Why is this important?

I’ve adapted some of the following items are taken from the Electronic Fronteer Foundation’s [Interoperability and the W3C: Defending the Future from the Present](https://www.eff.org/deeplinks/2016/03/interoperability-and-w3c-defending-future-present).

The core of the issues I see with EME is that it provides a false sense of security at too high a risk. Because the CDMs and most DRM-related software is propietary and covered under DCMA legislation it is hard to know when something is wrong or there is a vulnerability in the software you use.

Recently there have been [reports of vulnerabilities](http://www.cvedetails.com/cve/CVE-2015-6647/) in Google’s Widevine CDM on all platforms whickh leaves users of the CDM wide open to potential vulnerabilities. We currently know that is possible to view the unprotected and unencrypted version of a video encrypted with Widevine. What else may happen?

### Accessibility

Most vendors make accessible version of their products or make their products acccessible (some because of their intended audiences but most because of legal oblications such as Section 508 and the full ADA legislation.) But it’s impossible to cover all different types of disabilities. HTML5's unencrypted media not only provide built-in accessibility features, they also offer the possibility of third-party programs that can modify the media (video, audio, captions or any combination of them) to make it accessible to an audience that can't accept the default presentation methods.

Some ideas of how this can work:

- Better work with captions creation and on the fly insertion. There are large banks of community generated captions that can be added to unencrypted movies using a standard video player. To implement functionality that inserts captions from one of these banks into a movie automatically
- One in four thousand people rely on video passing "the Harding test," a method for determining whether movies contain flashing imagery that may cause harm to those suffering from photosensitive epilepsy. But the Harding test doesn't catch footage for every person with epilepsy, and not every video source is checked against it. Implementing this functionality as a third party module may break DCMA copyright

### Implementations in free/open source code and New Browsers

To implement open source EME-capable video we need to have all 4 elements of the EME spec available as open source tools:

- Key System: A content protection (DRM) mechanism
- Content Decryption Module (CDM): A client-side software or hardware mechanism that enables playback of encrypted media
- License (Key) server: Interacts with a CDM to provide keys to decrypt media
- Packaging service: Encodes and encrypts media for distribution/consumption.

All available Content Decryption Modules are presently implemented in closed, proprietary code. The Open Source Community has reverse engineered serveral technologies to implement in Open Source products, we know it’s possible and we know we can create high quality products.

However, reverse engineering an EME-CDM system has DMCA implications, anyone attempting to make a free/open equivalent would face potential lawsuits simply for undertaking this common activity.

### Public domain videos, Creative Commons, Crown and Parliamentary copyrights

What do we do with video that is not copyrighted but where the distributor has encrypted the video with EME-based encryption? In some cases, the copyright on these videos has expired. In others, the videos are produced by governments that cannot assert copyright in their productions (this is the case for the US government). The same or similar rules may apply in other countries (in the UK and Commonwealth countries Crown copyright or Parliamentary Copyright applies different rules than regular copyright.)

Then there are works that are licensed under free/open content licenses, such as Creative Commons and the GNU Free Documentation License. More than a billion works have been licensed under Creative Commons alone, and all of those works allow viewers to record and share them, and moreover, many of them prohibit the use of digital locks like EME-CDM systems.

Despite the fact that the public is entitled to make use of these works, the companies that distribute them -- broadcasters, cable operators, webcasters, etc -- often lock them up with digital locks Even though you have the legal right to record and re-use these videos, EME and DRM will prevent you from doing so, and anti circumvention laws will prevent anyone else from making a tool to enable you to do so.

### Bandwidth arbitrage

The next billion users will come from countries where bandwidth is expensive and most where most phones come with SD cards that can be swapped between phones to save on bandwith. This "bandwidth arbitrage" enables the poorest Internet users to approximate the kind of access to rich media assets that the rest of us take for granted.

A tool to allow for offline storage and playback of EME-locked videos would fall afoul of many countries' equivalents to DMCA -- the US Trade Representative having made the adoption of these laws a condition of trade with the USA.

## The mozilla case

The situation that I find most troubling is the one Mozilla finds itself in with their CDM implementation in Firefox.

Firefox is a completely open system. To implement EME they have to have at least one CDM module built into the browser, Mozilla has chosen Adobe Primetime CDM. This CDM implements a DRM system called Adobe Primetime, which was previously available via the Adobe Flash plugin. Firefox desktop also supports the Google Widevine CDM.

In order for the open source Firefox to communicate with the proprietary CDM there is a wrapper that interfaces the two systems. If there are issues in the EME implementation how do we debug past the boundary between open source and proprietary systems? Do we fall victim of the DCMA's circumvention provisions? How will that question affect bug reporting and resolution on the Mozilla codebase? How do we report vulnerabilities?

## Some links

- [https://www.w3.org/blog/2016/06/perspectives-on-security-research-consensus-and-w3c-process/](https://www.w3.org/blog/2016/06/perspectives-on-security-research-consensus-and-w3c-process/) 
- [http://www.html5rocks.com/en/tutorials/eme/basics/](http://www.html5rocks.com/en/tutorials/eme/basics/) 
- [https://www.w3.org/2016/03/EME-factsheet.html](https://www.w3.org/2016/03/EME-factsheet.html)
- [https://www.eff.org/deeplinks/2016/06/w3c-eme-and-eff-frequently-asked-questions](https://www.eff.org/deeplinks/2016/06/w3c-eme-and-eff-frequently-asked-questions)
- [https://hsivonen.fi/eme/](https://hsivonen.fi/eme/)
- [http://fsfe.org/activities/drm/open-letter-ec-drm-html.en.html](http://fsfe.org/activities/drm/open-letter-ec-drm-html.en.html)
