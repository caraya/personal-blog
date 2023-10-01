---
title: "GPL and Wordpress: Developer beware"
date: "2015-11-23"
categories: 
  - "technology"
---

> **_Full Disclosure:_** I own a Thesis Developer License and used it for several years on my personal blog. I stopped using Thesis when they moved to 2.0 with a paradigm change that I didn't like. I still have the skin I developed and may consider doing development with Thesis again in the future. I also own a license for the Genesis Framework

## Background

A few years ago [Chris Pearson](http://www.pearsonified.com/) the creator of the [Thesis Wordpress Theme](http://diythemes.com/) became embroiled in a very public dispute with [Matt Mullenweg](http://ma.tt/) and [Automattic.com](http://automattic.com), the company Mullenweg created to support [Wordpress.com](https://wordpress.com)and the open source [Wordpress software](http://www.wordpress.org/) about the license he had released his premium Thesis team under.

The argument was in the open and recorded in the video below from [Mixergy](http://mixergy.com)

[Chris Pearson and Matt Mullenweg at Mixergy](http://mixergy.com/interviews/chris-pearson-matt-mullenweg/)

Chris has admitted that he wasn't as good as he could have been when he did this interview. I agree that he wasn't but he and several other developers have made the point that they don't like 2 things about GPL

1. You have to license your code under GPL if it uses any GPL licensed code
2. Your code is automatically available for inspection and change

More on this later as it becomes central to my issue with the GPL as a license, why I don't use it and why I haven't released any of the Wordpress code I've created.

Chris relented and changed the license to accommodate Automattic's wishes and split the license between GPL for the Wordpress-related code and a proprietary license for all things specific to the theme. And, besides Chris loosing a large chunk of his business and getting a ton of bad rep within the community, we all thought that this was a done deal..

It was a done deal until a few weeks ago when the thesis.com domain became available for sale. The seller contacted both Chris Pearson and Automattic for the domain. As far as I know and understand Chris thought that the 200k selling price was too much and offered a smaller amount... only to find out that Matt Mullenweg bought the domain for 100k.

Chris filed a procedure for getting the domain back and that's where it got ugly. Automattic not only fought against the [Uniform Domain-Name Dispute-Resolution Policy (UDRP)](https://www.icann.org/resources/pages/help/dndr/udrp-en) case and won, they also filed a [petition for cancellation](http://ttabvue.uspto.gov/ttabvue/v?pno=92061714&pty=CAN&eno=1) against Pearson with the United States Patent and Trademark Office. In their petition, Automattic argues that the three trademarks owned by Pearson should be cancelled.

Two different points of view over the issue:

- [WP Tavern](http://wptavern.com/automattic-wins-cybersquatting-case-against-chris-pearson) (the comments are particularly revealing)
- [Chris Pearson](http://www.pearsonified.com/2015/07/truth-about-thesis-com.php)

But let's leave aside, for now, that the fight is far from over and that Mullenweg and Automattic (a place I've considered working at) have lost a lot of the good faith the community had in them. Let's go back to the issues I raised earlier:

1. You have to license your code under GPL if it uses any GPL licensed code
2. Your code is automatically available for inspection and change (unless you choose to charge for your code in which case it's only available after you receive the money)
3. If you release your code under a license that is more permissive than GPL, are you still covered by GPL?

A few days ago (from when this was originally written) Mullenweg wrote a very harsh post about [split license themes](http://ma.tt/2015/07/licenses-going-dutch/) and quoted the software freedom law center's evaluation of themes as Wordpress [derivative works](https://wordpress.org/news/2009/07/themes-are-gpl-too/) and decreed that Wordpress.com would only host 100% GPL themes...

Interestingly enough none of the "100% GPL" themes make the code available for review without a log in and, most likely, without paying a license fee for the themes. According to the [Free Software Definition](http://www.gnu.org/philosophy/free-sw.en.html) **_The freedom to study how the program works, and change it so it does your computing as you wish (freedom 1). Access to the source code is a precondition for this._**

Furthermore, what happens if I choose not to release my code under GPL? Apparently I'm liable to be sued because of non-compliance, as VMWare is finding out in Europe due to a lawsuit from a [Linux Kernel Developer](https://sfconservancy.org/linux-compliance/vmware-lawsuit-faq.html) so it's damned if you do release your code and lose any sort of competitive market advantage you may have and damned if you don't because you'll get the sued by a developer who takes the GPL to heart and won't let anyone profit from their code (ever wonder how many big corporations get scrutinized like VMWare did and what's BusyBox's beef in the matter)

When researching this post I found a [blog post](https://noordering.wordpress.com/2009/01/20/why-the-gpl-is-not-free/) that outlines some of the concerns I've listed. It states that:

> To do that, I’m going to concentrate on the last freedom that it claims to offer – “The freedom to improve the program, and release your improvements (and modified versions in general) to the public, so that the community benefits (freedom 3).” Suppose that I am a company, and I am building a product to release. I would like to use your library in my program, I would even like to improve your library, and release the improvements to the public so that the community benefits. Unfortunately, at the end of the day, I need to ship a product, so I’d like to keep the core of my project closed source. Unfortunately, the GPL outlaws this kind of interaction. So, we have a good citizen, a company that wants to release their patches to your library back to the community, and yet, the GPL is banning them from doing so! It is not giving them freedom at all! Instead, the GPL is a different set of restrictions.

And the saddest part is that it doesn't have to be a company. I may have my reasons why I don't want to release the changes I make to a theme or the child theme I developed for my blog. If we take a strict interpretation of GPL's viral nature the developer of the theme I based my work on or Automattic, or any Wordpress Developer, can sue me to enforce compliance with the GPL and to release my code.

According to Matt Mullenweg's [post about split licensing](http://ma.tt/2015/07/licenses-going-dutch/), he asked the [Software Freedom Law Center](https://softwarefreedom.org/) whether themes and plugins are derivative works from Wordpress and therefore falling under Wordpress' GPL license. Their one sentence summary: **_PHP in WordPress themes must be GPL, artwork and CSS may be but are not required._**

While SFLC agrees the PHP code is indeed a derivative of Wordpress they also indicate that:

> In conclusion, the WordPress themes supplied contain elements that are derivative of WordPress’s copyrighted code. These themes, being collections of distinct works (images, CSS files, PHP files), need not be GPL-licensed as a whole. Rather, the PHP files are subject to the requirements of the GPL while the images and CSS are not. Third-party developers of such themes may apply restrictive copyrights to these elements if they wish. From: [Themes are GPL too](https://wordpress.org/news/2009/07/themes-are-gpl-too/)

What they briefly glance at when working with Wordpress theme is that the only way they will host your product in wordpress.org or publicize your work is for you to cave in and publish **all** your code under GPL. This may prevent confusion but such heavy handed approach flies in the face of the freedoms they claim to be defending. There is no mention about GPL compatible licenses or any sort of compromise, it's their way or no way.

This is why I don't use GPL for any of my code. If someone wants to use my code for their own projects then that's fine, all I ask is that they tell me about it, but I'm not going to require people to release their code under the same license as mine.

Since Wordpress uses a license that I'm philosophically opposed to and, as an organization, has such an arrogant position both in the licensing terms and in what they do with people who disagree with them, I can not develop extensions to such a platform and, for what I already have, will not release it for public use.

## GPL Themes: Do as I say, not as I do

As a Wordpress user I should be able to go to any Premium Theme developer and ask for a copy of their theme free of charge and, if I'm correct in my interpretation of the GPL **_source code as prerequisite_**, they must provide it if they want to be GPL compliant. The software freedoms that FSF claim to defend make "access to the source code is a precondition for this", where this are the freedom that have source code as prerequisite, when referring to the freedoms.

Let's say that I purchase a theme and then decide that it won't work for my intended purpose I'm at their mercy for a refund... since in most cases I've also purchased (whether I want to or not) a 1-year support license without being able to look at the code or, what's worst, take refuge in the fact that they are selling digital products to deny a refund outright...

To make sure that I'm correct in the assumption that commercial Wordpress shops break GPL I've done the following:

- I've collected information about refund from FAQ's for theme shops that sell their products through [Wordpress.org](https://wordpress.org/themes/commercial/) regardless of the amount they charge.
- I've contacted the licensing group from the Free Software Foundation with questions about premium theme licensing, in particular if their non-release of source code prior to adoption or purchase breaks the GPL and the software freedoms

### Themes FAQs

Most, if not all, theme houses advertising in the Wordpress site have a no return policy. I can understand why if this was a comercial only endeavor but I'm still struggling to understand

**_From [elegant themes](http://www.elegantthemes.com/gallery/)_**

> Refund Policy: We offer refunds to any unsatisfied customer up to thirty (30) days after the purchase was made. If you would like your money back, simply send us an email at support@elegantthemes.com with a description of your problem and request for a refund.

**_From [Pixel Theme Studio](http://pixelthemestudio.ca/membership-faqs/)_**

> Because you are purchasing a “digital non-tangible product or service”, there are NO REFUNDS. You will find that almost (if not all) theme sites have this policy. Our suggestion is to make sure you know what you are about to purchase and to ready and understand the terms of use because by proceeding, you are accepting this policy as it states on the payment page. Only with certain circumstances, a refund is granted at the discretion of Pixel Theme Studio. For more, see our [Terms of Service](http://pixelthemestudio.ca/terms-and-conditions/).

**_From [WPCasa](http://wpcasa.com/terms/)_**

> Refund Policy
> 
> Please keep in mind that wpCasa themes are non-tangible and irrevocable digital goods. Theme purchases are generally not refundable. So before you buy, please ensure that the desired theme fits your needs. If you're in doubt, please contact us with your pre-purchase questions.

**_From [My Theme Shop](https://mythemeshop.com/)_**

> Please note that there is a difference between a broken item, and simply receiving an error message or having trouble configuring the Product to your desired result.
> 
> Error messages are often related to improper setup, hosting, configuration, or software which causes the item to not work.
> 
> Before you request a refund from MyThemeShop you must do the following: Read the extensive documentation that we provide with each Product. Check the support forums for existing threads about the issue you’re receiving.
> 
> Open a new support ticket with our support staff if you are still experiencing problems.
> 
> Confirm that your server meets the specifications laid out in the requirements for the Product.
> 
> Please note that opening a dispute or initiating a chargeback will not speed up your refund request, and we reserve the right to refer any case to the PayPal fraud department which may result in your account being limited.
> 
> As you are buying a digital product, when you download the item, you have taken ownership and we can not offer refunds because you have changed your mind or found a different Product you prefer, or other similar reasons.
> 
> If you’re not sure whether a Product is the correct fit for you, please reach out to our sales team or create a forum account and ask, and our team will be happy to assist you.
> 
> If you’ve read the above, and taken the necessary steps, but your Product is still broken, malfunctioning or otherwise non-functional, please open a refund request.

### My conversation with FSF

I exchanged multiple emails with licensing@fsf.org in an effort to understand what options to do I have in answering the questions I've generated.

The first email was sent August 13 and is copied verbatim below:

> I have the following questions about using GPL software and was hoping you'd be able to assist in answering them. 
> 
> 1. If I'm working with a derivative paid product from Wordpress (a theme) can I request the source for the theme before purchasing it?
> 2. Is it correct to only provide the source to a paid GPL product after purchase or do I have the right to request it before hand?
> 3. How does section 4 of the GPL (You may charge any price or no price for each copy that you convey, and you may offer support or warranty protection for a fee.) work with the software freedoms? My main concern is that I'm not give the chance to try the software before purchasing it and that even if I don't purchase it I should still have access to the sourcecode according to the software freedoms.
> 4. Can people get on my case and force me to release changes I've made to wordpress if I choose not to do it because I don't want to support the software? Can I use modifications in my own system but not share them with others?
> 
> I'm trying to understand how GPL works with paid software and whether it makes sense for me to start commercial WP development. 

The reply was very terse. I received this email on August 18 from Yoni Rabkin via RT (licensing@fsf.org via gnu.org)

> Hello and thank you for writing in. The terms of the GNU GPL only apply when the software is distributed, and distributing the software for a fee is permitted. Therefore there is no requirement to provide you with an advance copy of the software or its source code. However, if the software is distributed at all, it can only be distributed under the terms of the GNU GPL.

This doesn't make any sense. If the software is distributed at all, it can only be distributed under the terms of the GNU GPL but we're already violating the terms because the source code is not available until after I made a purchase, not before so I can inspect it.

I wrote again to the licensing group with a further set of questions. The email was sent on August 29.

> It still doesn't make sense how buying a GPLd product sight unseen matches the "Access to the sourcode is a precondition to this" mentioned in 2 of the four software freedoms in your site, specifically:
> 
> - The freedom to study how the program works, and change it so it does your computing as you wish (freedom 1).Access to the source code is a precondition for this.
> - The freedom to distribute copies of your modified versions to others (freedom 3). By doing this you can give the whole community a chance to benefit from your changes. Access to the source code is a precondition for this.
> 
> Are you telling me that these freedoms only apply after someone gives me access to the software and I've paid for it? Isn't a sale a type of distribution? I did not get a satisfactory answer my question regarding obligatory release of my modifications back to the community if I choose not to release derivative software. Could you please address this scenario: I've made modifications to GPLd software for my personal use. A developer wants a copy of my software and I decide not to share it because it's not ready for distribution or because I don't want to maintain it for public distribution.  Can they force me to release my code? THanks for taking the time to anwer my questions

Their reply answers some of my questions but not all of them

> I've recapitulated my previous answers in the context of your questions below: It still doesn't make sense how buying a GPLd product sight unseen matches the "Access to the sourcode is a precondition to this" mentioned in 2 of the four software freedoms in your site, specifically:
> 
> - The freedom to study how the program works, and change it so it does your computing as you wish (freedom 1). **Access to the source code is a precondition for this.**
> - The freedom to distribute copies of your modified versions to others (freedom 3). By doing this you can give the whole community a chance to benefit from your changes. _Access to the source code is a precondition for this._
> 
> Are you telling me that these freedoms only apply after someone gives me access to the software and I've paid for it? Isn't a sale a type of distribution? **_The terms of the GNU GPL apply only when the work is distributed, regardless, and completely independent of whether it is being distributed for a fee or gratis. There is no "try before you buy" clause in the GPL._** I did not get a satisfactory answer my question regarding obligatory release of my modifications back to the community if I choose not to release derivative software. Could you please address this scenario: I've made modifications to GPLd software for my personal use. A developer wants a copy of my software and I decide not to share it because it's not ready for distribution or because I don't want to maintain it for public distribution. Can they force me to release my code? **_No, they cannot. Please see: [http://www.gnu.org/licenses/gpl-faq.html#GPLRequireSourcePostedPublic](http://www.gnu.org/licenses/gpl-faq.html#GPLRequireSourcePostedPublic)_**

### My conclusion

So if I'm understanding this correctly, the only difference between purchasing software licensed under GPL and other licenses like MIT, BSD or MPL (Mozilla Public License) is that if I make any derivative works from GPL software I'm required to release it under the same license or not at all. Depending on who you ask there may be [GPL compatible licenses](http://gplv3.fsf.org/wiki/index.php/Compatible_licenses)(both for version 2 and 3 of GPL) that are good enough to release GPL derived code under and some (like Wordpress) make no such distinction and force all Wordpress developers to release their code under GPL only.

The so called protections afforded by the GPL in all its forms are only to protect against comercial use of the software as is the case of the [vmware lawsuit](http://www.theregister.co.uk/2015/03/05/vmware_sued_for_gpl_violation_by_linux_kernel_developer/) but not to bennefit the users.

If I can not analyze the software before making a decision on purchase and, in addition, can not return the software because most theme vendors don't trust users enough for returns. I cannot learn from other people's code unless I buy their software whether it will be useful to me or not.

**How are GPL themes any different than buying comercial software?**

FSF tells me I'm not required to release my code. Well, VMWare didn't and see where that got them. Because of its viral nature, it not just the modifications that need to be released under GPL, it's **all. the . code.** So for VMWare to be GPL compliant they'd have to release all products that touch the Linux Kernel under GPL because they are derivatives of a GPL product.

Wordpress may be an even more delicate case for developers because they have a zealot (Matt Mullenweg) with deep pockets (deep enough to spend 100k in a domain that was of little or no use to them) and little regard for the damage that he causes in his crusade as a "GPL protector and deffender" whether we need to be deffended or not.

So as much as I like Wordpress I can't in good conscience and good faith release plugins or modifications I've made. I don't need the headache and I don't need the philosophical arguments in a space where there are none to have. The people who decide what the license means decided in a way I don't agree with.

# Links and Licenses in question

- [PHP License](http://www.php.net/license/3_01.txt)
- [GPL 2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)
- [GPL 3](http://www.gnu.org/licenses/gpl-3.0.en.html)
- [GPL History](http://www.free-soft.org/gpl_history/)
- [Wordpress License](https://wordpress.org/about/license/)
- Matt Mullenweg's [Licenses going dutch](http://ma.tt/2015/07/licenses-going-dutch/)
- [Why Wordpress themes are derivative of Wordpress](https://markjaquith.wordpress.com/2010/07/17/why-wordpress-themes-are-derivative-of-wordpress/)
- [Themes are GPL too](https://wordpress.org/news/2009/07/themes-are-gpl-too/)
