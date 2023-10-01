---
title: "Revisiting Bibliotype Part 3: Future Enhancements"
date: "2018-09-05"
---

These are things that will take a while to work through either because the APIs are harder to work with or because I'm not certain of the status of the API and research plus implementation will take longer.

### (Periodic) Sync: Serialized content

[Periodic Sync](https://github.com/WICG/BackgroundSync/blob/master/explainer.md#periodic-synchronization-in-design) will allow us to periodically sync to the application for new or updated information.

One case that quickly comes to mind is serialized content. Rather than upload an entire book or story we can create chunks and offer the first few when the user first uploads and the remainder over a period of time.

### Push Notifications

At some point, we'll have to use notifications to let users know changes or give them chances to opt in to new content or to new additions to the app as they are implemented.

### Annotations

I've looked at [Hypothes.is](https://web.hypothes.is/) and [AnnotatorJS](http://annotatorjs.org/) but they present different sides of the same problem.

Hypothes.is offers a hosted solution that would be perfect but I'm not the one hosting it so there are privacy implications.

AnnotatorJS predates Hypothes.is but the backend situation is a little unclear from the documentation as to the storage requirements.

Once I figure out what the best backend storage solution is (maybe hosting the backed on an instance of Google App Engine and not worrying about the rest) will be a good solution.
