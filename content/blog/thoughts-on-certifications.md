---
title: "Thoughts on certifications"
date: "2023-01-16"
---

This post outlines my early thoughts on certifications as they relate to WordPress.

I'm coming into the conversation as an instructional designer and curriculum developer and someone who has worked building curricula for certifications.

I don't believe it matters if the product we're building a certification program for is open source or not. While there may be some idiosyncracies to open source products the certification should be the same as it is for commercial software in terms of rigor and how it is built.

## Overview: Why do we need certification

In most situations, being certified means that you've mastered a set of skills to the satisfaction of your examiners.

For example:

If you're certified as a Google Associate Cloud Engineer, you will not be evaluated on whether you have the certification or not, most employers will assume that you can perform the following tasks:

- Set up a cloud solution environment
- Plan and configure a cloud solution
- Deploy and implement a cloud solution
- Ensure successful operation of a cloud solution
- Configure access and security

For more details, see the [Associate Cloud Engineer Certification Exam Guide](https://cloud.google.com/certification/guides/cloud-engineer).

Yes, you can choose to attempt the certification exam without having the required knowledge and skills but you're not likely to succeed.

Likewise, thinking about prerequisites is also important. A certificate assumes a lot of things and only makes some of them explicit. The more prerequisites we make explicit and the more content we include in the certification training the better it will be.

In essence, we're asking: **what skills should a person wanting to complete a given certification already have already mastered**

### There are so many certifications out there, why another one?

In short: **Brand Recognition**.

There are plenty of WordPress certifications but none of them have been vetted by the WordPress Learning Theme or supported by WordPress or Automattic.

There is a level of trust between people using the software and the foundation or company making the software they use.

## Why are certifications important

The team developing the certification program decides what WordPress skills are important for each level of certification.

This provides uniformity to the skillsets of people who have completed the certification at a given level.

## What are we certifying

We are only certifying mastery of WordPress-specific skills necessary to accomplish tasks that the certification group deems important for a given certification level.

For example: If we're creating a junior developer position, we may want to concentrate on block and block theme development. If that's the case then the PHP they need to know is minimal and they wouldn't need to know about, much less master, load balancing, OOP programming, CI/CD, or treating WordPress as a SAS. They would have to be proficient with intermediate to advanced React, as the development language.

Breaking down the tasks for each potential level of certification is complicated as there is no standard skill pipeline for a WordPress developer... creating one is likely to cause pushback.

### Different types of certification

What levels of certification to offer is an interesting question. Is a Sr. Theme Developer different to a WordPress administrator?

Breaking down skill sets is important so as to not overwhelm students. Some ideas as to how to break :

- Jr. theme developer
    
    - Blocks
    - Plugins
    - Block themes
    - Basic PHP to cover the above
- Sr. theme developer
    
    - Assumes the skills of a Jr. Theme dev
    - Classic theme development
    - Headless WordPress
    - Collaborative development
- WordPress admin
    
    - Manage single and multisite WordPress installations
    - Interfaces with IT to acquire more resources (horizontal scaling or bandwidth)
    - Application Security as it relates to WordPress

### How long do certificates last

WordPress changes very quickly so certificates should not be permanent since the skills are likely to atrophy if not constantly refreshed and used.

This is an interesting discussion point but I believe 2 years (2 major releases) is a fair compromise.

## How are we certifying mastery?

Most technical certifications I'm aware of include theoretical and practical components.

The theoretical components are one or more multiple-choice or multiple-select exams.

Building these types of exams means you have to build a bank of statistically valid and reliable questions.

For more details on how to do this see: [How to Measure Test Validity and Reliability](https://examsoft.com/resources/how-to-measure-test-validity-reliability/) and [Improving the validity of objective assessment in higher education: Steps for building a best-in-class competency-based assessment program](https://onlinelibrary.wiley.com/doi/epdf/10.1002/cbe2.1058).

The practical component is usually a project to complete in a given period of time, usually in a proctored environment.

Deciding on specific assessments and how would they be graded is a team decision.

## How do we deliver?

Because it is impossible for the team to conduct all facets of training for all potential participants so it would make sense to partner with a center that already does this type of activities or that administers other proctored tests for both academic (GRE, GMAT, others) and for certification.

## Enhancing the experience

A good enchancement for certifications would be to build a community around them.

These certification communities would be voluntary and could serve both as extended learning places where the learning team first floats ideas to enchance the certification program.
