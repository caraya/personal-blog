---
title: What's Going On With WordPress
date: 2024-12-04
tags:
  - WordPress
  - CMS
  - Development
  - Opinion
---

!!! tip **Full Disclosure**
I worked with WordPress for 18 years until 2023 when the direction it was moving to didn't align with what I wanted to do.

I've also strongly disagreed with Matt Mullenweg's policies in the past.

I'm working hard to keep the biases in check, but want to put them up front, just in case.
!!!


I have to admit that this caught me by surprise. I've never been a fan of Matt Mullenweg and his heavy handed approach to managing WordPress, its partners and ecosystem but this is getting out of hand and will have serious impact on the community as a whole.

It started when Matt used his speech at [WordCamp US 2024](https://us.wordcamp.org/2024/about/) to severly attack WP Engine, its lack of support for the WordPress ecosystem and the fact that they are backed by venture capital.

Some of the content of the presentation was recently published in Matt's personal blog ([WordCamp US & Ecosystem Thinking](https://ma.tt/2024/09/ecosystem-thinking/)), where he points to the distinct [five for the future](https://wordpress.org/five-for-the-future/) investment pledges made by Automattic and WP Engine, with Automattic contributing 3,900 hours per week, and WP Engine contributing just 40 hours.

While he acknowledged that these figures are just a “proxy,” and might not be perfectly accurate, Mullenweg said that this disparity in contributions is notable, as both Automattic and WP Engine “are roughly the same size, and similar revenue.”

Mullenweg has levelled criticism at at least one other big-name web host (GoDaddy) in the past, and has taken ridiculous legal actions against other people who don't conform to his vision of WordPress and the GPL, so the accusation themselves are not a big departure from previous actions against people and companies he thinks go against the spirit of WordPress and the GPL. But this one escalated beyond any sane proportion.

As a response to the WordCamp presentation, WP Engine sent [a cease-and-desist letter](https://techcrunch.com/2024/09/23/wp-engine-sends-cease-and-desist-letter-to-automattic-over-mullenwegs-comments/) to Mullenweg and Automattic, asking them to withdraw their comments. The letter alleged that Mullenweg and Automattic had threatened to adopt a “scorched earth nuclear approach” if WP Engine did not comply and pay Automattic a percentage of its gross revenue.

In reply, Automattic sent its own cease-and-desist letter to WP Engine, [alleging infringement of the WordPress and WooCommerce trademarks](https://techcrunch.com/2024/09/25/legal-ping-pong-in-the-wordpress-world-continues-automattic-now-sends-wp-engine-a-cease-and-desist-letter-alleging-trademark-infringement/).

The WordPress Foundation, a non profit created by Mullenweg to maintain WordPress as an open source project, told TechCrunch that WP Engine has violated its trademarks.

Why does a foundation controlled by one person hold the trademarks for an open source project? In a way, this gives Matt control over who can use the WordPress trademark and under what circumnstances. Will the owner of the WordPress trademarks go after other companies and users that Matt doesn't approve of?

Then, WordPress.org (essentially owned by Matt Mullenweg) [blocked WP Engine from accessing its resources](https://techcrunch.com/2024/09/25/wordpress-org-bans-wp-engine-blocks-it-from-accessing-its-resources/) and stopped WP Engine customers from updating content from their WordPress administration screen.

WP Engine is officially pursuing a series of legal complaints against Matt Mullenweg:

* [The announcement](https://x.com/wpengine/status/1841633469685723292?t=Zc5MrODFXpYHhFVC_nJNwQ), and
* [A direct link to the legal document](https://wpengine.com/wp-content/uploads/2024/10/Complaint-WP-Engine-v-Automattic-et-al-with-Exhibit.pdf).

And then there's the nuclear option. Matt can always try to acquire WP Engine, or come up with some other equally dangerous alternative.

## What's the problem?

So why does one person's opinion matter? Can this be resolved by the community itself?

Matt Mullenweg wields too much unchecked power over the WordPress ecosystem and community.

* He's the leader of the WordPress development team so he has been directing the future of WordPress for better or worse
* He owns Automattic and the WordPress adjacent products they own or run: WordPress.com, WooCommerce, Jetpack, WordPress VIP, WPScan, Akismet, Gravatar, and Newspack
* Through the foundation, he runs Wordpress.org
* He directly owns the wordpress.org domain, see the
* His Audrey Capital Fund provides funding for many WordPress developers
* He sits in the board of directors of the WordPress Foundation

<figure>
	<img src='https://joshcollinsworth.com/images/post_images/fire-matt/dotorg.png' alt='Twitter question about wordpress.org ownership'>
	<figcaption>Twitter question about wordpress.org ownership</figcaption>
</figure>


So this one person holds an insane amount of power over the community and has many conflict of interest in dealing with competitors and members of the community that he disagrees with.

It is also about his scorched earth policies and how far will he push things to get his way.

When he had issues with dual licenses in the Thesis WordPress theme, he bought the thesis.com domain and redirected it to themeshaper.com, Chris appealed the purchase and lost, and as retaliation Mullenweg directed his lawyers to go after Chris Pearson's trademarks, [they eventually lost the case](https://wptavern.com/trademark-trial-and-appeal-board-dismisses-automattics-trademark-dispute-against-chris-pearson).

Although this point has been rendered moot by including React in WordPress core as part of the block editor, setting dual licenses as the default for the project, at the time, this was a serious issue (see [There is No Such Thing as a Split License](https://ma.tt/2015/07/licenses-going-dutch/))

While the Free Software Foundation would prefer you use the GPL, they also have a list of approved licenses that they deem compatible with the GPL; See [Various Licenses and Comments about Them](https://www.gnu.org/licenses/license-list.en.html#GPLCompatibleLicenses) for the list of licenses and [What does it mean to say a license is “compatible with the GPL?”](https://www.gnu.org/licenses/gpl-faq.html#WhatDoesCompatMean), in particular:

> It means that the other license and the GNU GPL are compatible; you can combine code released under the other license with code released under the GNU GPL in one larger program.

So what makes WordPress so special that dual licensing doesn't apply? Does it matter that the non WordPress code is released under a non-free or non GPL license?

Later he purchased the thesis.com domain for $100k as a relatiatory measure, it now directs to themeshaper.com, redirecting potential customers for his competitor into a domain he owns.

There are other instances where Matt has attacked companies that contribute to the WordPress community like GoDaddy and now WP Engine.

In a series of Tweets from 2022, Matt accused GoDaddy of being
"an existential threat to WordPress’ future". [Matt Mullenweg Identifies GoDaddy as a “Parasitic Company” and an “Existential Threat to WordPress’ Future”](https://wptavern.com/matt-mullenweg-identifies-godaddy-as-a-parasitic-company-and-an-existential-threat-to-wordpress-future). The tweets he posted were deleted shortly after but the article contains screenshots of them along with a more in-depth commentary.

And now his actions against WP Engine.

The WP Engine [term sheet](https://automattic.com/wp-content/uploads/2024/09/term-sheet-wp-engine-inc.-automattic-trademark-license_09.19.2024-1.pdf) is onerous. It basically demands that a competitor pays license fees in order to keep using the WordPress trademarks and not be harased by any of the companies or resources that Matt has available to him.

The latest salvo is that now logging in to Wordpress.org requires you to check a box indicating that you have no affiliation with WPEngine before the login is allowed. Therefore, if you have any relationship to WPEngine you're not allowed to contribute or participate into any of the WordPress.org communities or tools.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/v1733318290/wp-org-login_stgzvp.png' alt='Current wordpress.org login screen indicating the WPEngine affiliation checkbox' width='400'>
	<figcaption>Current wordpress.org login screen indicating the WPEngine affiliation checkbox</figcaption>
</figure>

## My opinion

I've tried to stay factual with

Problems like these will continue as long as Matt Mullenweg continues to wield such unlimited and unchecked power over the WordPress world.

With the power that he wields, Mr. Mullenweg can take any number of actions against people who he disagrees with.

Some of these actions show clear conflict of interest between his businesses and his role as community leader.

As long as these conflicts of interests remain, WordPress as a community and as a product are in danger. Whether its loss of market share or the loss of contributor to the open source project.

## Links and Resources

* [If WordPress is to survive, Matt Mullenweg must be removed](https://joshcollinsworth.com/blog/fire-matt)
* [Automattic is doing open source dirty](https://world.hey.com/dhh/automattic-is-doing-open-source-dirty-b95cf128)
* [The Face of WordPress should not be a Source of Drama](https://web.archive.org/web/20240923020348/https://natehoffelder.com/blog/the-face-of-wordpress-should-not-be-a-source-of-drama/)
* [Why WordPress founder Matt Mullenweg has gone ‘nuclear’ against tech investing giant Silver Lake](https://www.cnbc.com/2024/10/05/wordpress-ceo-matt-mullenweg-goes-nuclear-on-silver-lake-wp-engine-.html)
* [159 employees are leaving Automattic as CEO’s fight with WP Engine escalates](https://techcrunch.com/2024/10/04/159-employees-are-leaving-automattic-as-ceos-fight-with-wp-engine-escalates/)
* [Automattic Alignment](https://ma.tt/2024/10/alignment/)
* [WordPress.org bans WP Engine, blocks it from accessing its resources](https://techcrunch.com/2024/09/25/wordpress-org-bans-wp-engine-blocks-it-from-accessing-its-resources/)
* [Whose WordPress is it anyway?](https://www.wpwatercooler.com/wpwatercooler/ep484-whose-wordpress-is-it-anyway/) &mdash; WPwatercooler
* Twitter
  * [Matt Pritchett](https://x.com/mrpritchett/status/1839136059386405177)
  * [Shawn DeWolfe - Cascadian](https://x.com/dewolfe001/status/1839172656312234472)
  * [Kaelon](https://x.com/Kaelon/status/1843013559980003682)
