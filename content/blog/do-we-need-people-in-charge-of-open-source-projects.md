---
title: Do we need people in charge of open source projects?
date: 2024-09-09
tags:
  - Design Systems
  - Project Management
  - Community
draft: true
---

In episode 629 of [Shoptalk](https://shoptalkshow.com/629/) [Dave](https://x.com/davatron5000) and [Chris](https://x.com/chriscoyier) had an interesting discussion about [Design ain’t a democracy](https://robinrendle.com/notes/design-aint-a-democracy/) an article by Robin Rendle, published in July 2024 and Miriam Suzanne's [We don’t need a boss, we need a process](https://www.miriamsuzanne.com/2024/08/08/vision) repsponse.

Whenever I think of the concept of a dictator in a software development community I think about Guido van Rossum, the BDFL in the Python world (the fact that Guido [stepped down from his BDFL position](https://lwn.net/Articles/759654/) is irrelevant for the purpose of this post).

I think that the point missed in the Shoptalk discussion and in Miriam's article the definition of dictator. It is not the "***I have all the power to do whatever I want with the project***" but more of a "***Someone needs to have final say when there's no agreement over the results***" and, at least in the initial stages of a project, that "executive director" or "benevolent dictator for life" (BDFL) is the person who started the project.

Miriam writes:

> What we like about a dictator is that they have a vision, and set the process, and take the responsibility to be decisive when necessary. But it’s not impossible for us to do that together, if we learn how to hold a strong vision collectively.

I agree, it is not impossible but it is much harder. This shared design and vision are ideal when the project is started as a collaborative experience, there is no preconceived notion of what the project (or at least an MVP) should look like but it becomes problematic when the project was initiated by an individual and then becomes a community project. Who decides how to proceed when the software has already been built? What process do we have in place to solve differences when the community doesn't agree.

Again, thinking about Python and its community shows one possible model for this community building.

[PEP 1 – PEP Purpose and Guidelines](https://peps.python.org/pep-0001/) defines PEPs or  Python Enhancement Proposals. A PEP is a design document providing information to the Python community, or describing a new feature for Python, its processes or environment.

PEPs aim to be the primary mechanisms for proposing major new features, for collecting community input on an issue, and for documenting the design decisions that have gone into Python. The PEP author is responsible for building consensus within the community and documenting dissenting opinions.

The steering council, the group that replaced Guido van Rossum when [he stepped down from his leadership position](https://mail.python.org/pipermail/python-committers/2018-July/005664.html), has final say whether a PEP is approved for inclusion in the Python language or its processes.

Throughout the life of a PEP's development there is ample time and places for discussion and consensus building, but it also accounts for times when the developers cannot (or will not) reach consensus... it designates a specific role (members of the steering council) as the final decision maker.

As all the long, and some times contentious, threads in the [python-ideas](http://mail.python.org/mailman/listinfo/python-ideas) and [python-dev](https://mail.python.org/archives/list/python-dev@python.org/) mailing list and their Discourse equivalents: the [Core Development](https://discuss.python.org/c/core-dev/23) and [ideas](https://discuss.python.org/c/ideas/6) categories show, discussion are spirited and highly opinionated and don't always end in agreement.

I agree that:

> Creative collaboration requires effort, argument, trust, and play. The ability to fight for an idea, and then let it go. To be open, and then decisive. Knowing when to work together, and when to work apart. Cycles of action, reaction, reflection, etc.

Where I disagree is that this works for homogeneous groups of people who have worked together in a project since its inception.  What happens when we bring new developers into the project? What happens when new people don't know, or choose to ignore, the norms of the project and community built around it?

In collaborative projects the creative group is set at the beginning of a project.... But what are the expectations when someone joins a project in a technical capacity after the project (and the rules) have been set?

If a collaborative project depends on full consensus to release new features then what is to prevent a tyranny of the minority where individuals will block useful features that they don't agree with?

Open source projects are different, that's why they have different tools and rules in place.

The base of most code of conducts available in the Open Source world is the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Different projects tailor the base code to best suit their preferences.

By their very nature, these codes of conduct are reactive and can produce results that are not what the community would want. You hope that the community will respect them and can only enforce once it's broken... and the results will make some people unhappy (you can't please everyone all the time, you'll he happy if you make some people happy some time).

I think that making a project a collaborative experience is not enough. I don't think we can avoid competing interest where project features are concerned; if left to its own devices, will never go anywhere. Whether it's a single individual or a small group, there should always be someone who has final decision authority over a project, who having taken into consideration the different positions presented in the proposal and subsequent discussions can make a decision that is in the best interest of the project.

Yes, I know that Python is not the only open source community online. I picked it as an example of what I see most often in the open source world.
