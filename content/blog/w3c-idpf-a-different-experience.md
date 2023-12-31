---
title: "W3C + IDPF = a different experience"
date: "2016-06-16"
---

I’ve been reading the different positions in the debate started when the International Digital Publishing Forum and the W3C started talking about merging. I’ve also purposefully stayed quiet as I digest the conversations and try to understand the rationale of such a merger. This is my understanding of and position regarding the whole situation.

IDPF is moving towards an HTML experience for their users. Looking at the [EPUB 3.1 changes from EPUB 3.0.1](http://www.idpf.org/epub/31/spec/epub-changes.html) shows a move away from what has been traditionally part of the EPUB specification.

From the W3C side we can see their interest in publishing by how much traction (if any) the new Digital Publication spec gains among both publishers and web developers.

One problem I see right off the bat is that the primary audience of the W3C, browser makers, have competing interests... Let's not forget that it was mobile performance what caused regions to be removed from the blink rendering engine and it's been philosophical purity debates that have grounded the specification to a standstill in the CSS working group.

With so many different audiences to please I find it hard to believe that publishers will be able to influence the W3C’s working groups strongly enough to get the necessary specifications and changes to existing specifications to reach recommendation status. How many more do we need? How much longer do we have to wait?

Baldur Bjarnason ([@fakebaldur](https://twitter.com/@fakebaldur) on Twitter) wrote an [interesting piece](https://www.baldurbjarnason.com/notes/thoughts-on-standardisation/) where he outlines the problems he sees in both the IDPF and W3C way of creating specifications. He is highly critical of the processes and closed nature of the specifications. Even though the specifications are publicly accessible until the decision making was actually made by member organizations through their representatives in the organizations and the cost of membership is prohibitively expensive for individuals to cover (see the [W3C membership costs for a US organization starting in October, 2016](https://www.w3.org/Consortium/fees?countryCode=US&quarter=10-01&year=2016#results) and the [IDPF Membership Dues](http://idpf.org/membership/member-dues))

He then argues for an open development model using the WICG incubating methodology which is modeled after Chrome's intent to implement and ship templates I’ve seen used on Blink-dev. Unlike Blink-dev I fail to see how an open development process for some of the existing APIs (take [CSS Regions](https://www.w3.org/TR/css-regions-1/) for example) will not get deadlocked in the open rather than in the working group where it was born and where it’s still sitting waiting for someone to change their minds about it. Would putting the [Portable Web Publications](https://www.w3.org/TR/2015/WD-pwp-20151015/) specification under the Web Incubator Community Group actually improve the specification? I have my doubts that such a move would accomplish much unless we can be guaranteed at it will go into a recommendation track.

Baldur further compares PWP to [XHTML2](https://www.w3.org/TR/xhtml2/), W3C’s failed attempt at recasting HTML as an XML vocabulary. I find this assertion particularly troublesome because it fails to take a few things into account. There are no competing proposals for something other than Portable Web Publications in the open web; there was at least [one proposal](https://www.w3.org/2004/04/webapps-cdf-ws/papers/opera.html) from Opera and Mozilla to further develop web applications… it was rejected and the rejection resulted in [HTML5](https://html.spec.whatwg.org/) which was later adopted by the W3C as the starting point for their own work in May, 2007. Tzviya Ziegman and Dave Cramer have made good efforts in trying to engage production folks (those in the #eprdctn group in Twitter) regarding these standards and specifications. I haven't seen much engagement for the community.

One of my strongest reasons to support a merger is consolidation. The market for ereaders is incredibly fragmented ranging from e-ink Kindle readers to Kindle Fire in all their incarnations to iBooks and none of them support the full specification in a consistent manner. Jimmy Panoz has [documented](https://medium.com/@jiminypan/the-missing-eprdctn-specs-fcdc78038a90#.g5yasn5cn) some of these discrepancies and some of the issue he has found when researching the differences in rendering a cross readers and it just makes me sad to see the number and type of discrepancies.

Perhaps what we're missing is how to best construct books and reading content for the web. Perhaps the future of books is in a merged organization where the people who have already worked on performance, layouts and typography can show the publishing world what they've done and the publishing world can tell the web community what they've done before and we can come to an agreement on what’s the best way to move forward. If you’ve done any web-related work in the past 10 years you know how bad the fragmentation and the design compromises we had to do as a result. Yet, somehow, browser makers and other interested parties managed to solve their differences and work together. That’s why the web is where it is today (and as bad as you think it is, it’s light years ahead of where it used to.)

The web can compete with native experiences better than it ever has ever done. Progressive web applications leverage the technologies proposed for portable web publications without the need of launching yet another specification to an uncertain future. What's most important to me is that we can polyfill those features still in limbo (regions is the one that comes to mind.)

So we may have a solution in PWPs. Is it a perfect solution? No, it isn't. But it's something we can start testing right now and improve throw iteration until it gets closer to what we really want.

## other posts to read

- [Books, in a browser](https://medium.com/@naypinya/books-in-a-browser-375df76207ce#.f5f62kban)
- [W3C and IDPF: Better Together?](https://medium.com/@dauwhe/w3c-and-idpf-better-together-c92988674444#.ki83ghnmx)
- [An optimistic view](https://medium.com/@tzviyasiegman/an-optimistic-view-a4958a10cf58#.9vs38zrxm)
