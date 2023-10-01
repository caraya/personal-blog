---
title: "Progressive Subcompact Publications: Beyond Offline"
date: "2016-11-25"
---

The service worker script we discussed in the prior section is the core of a PSP but there’s way more we can do to make our reading experiences behave more like native applications. Some of these features are

- Push notifications
- Background sync

While not directly related to service workers this feature may help get better re-engagement from your users:

- Installation on mobile home screens

Also not directly related to progressive web applications, we can also preserve data, not just content on our web applications using

- IndexedDB

We’ll discuss them in the sections below.

### Push notifications

Using Push notifications we can communicate events and new information to the user through the Operating System’s push notification system and UI.

![](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/images/cc-good.png)

Detailed instructions for setting up Push Notifications using Chrome and Firebase Cloud Messaging (the successor to Google Cloud Messaging) can be found in [Push Notifications on the Open Web](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web?hl=en).

[Push Notifications: Timely, Relevant, and Precise](https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/) provide a context for how and when to use push notifications.

### Background Sync

If you write an email, instant message, or simply favourite a tweet, the application needs to communicate that data to the server. If that fails, either due to user connectivity, service availability or anything in-between, the app can store that action in some kind of 'outbox' for retry later.

Unfortunately, on the web, that outbox can only be processed while the site is displayed in a browsing context. This is particularly problematic on mobile, where browsing contexts are frequently shut down to free memory.

This API provides a web equivalent to native application platforms’ [job scheduling APIs](https://developer.android.com/reference/android/app/job/JobScheduler.html) that enable developers to collaborate with the system to ensure low power usage and background-driven processing. The web platform needs capabilities like this too. In the future we'll be able to do periodic synchronizations.

A more detailed explanation can be found in the [explainer document for background sync](https://github.com/WICG/BackgroundSync/blob/master/explainer.md).

### Install in mobile home screens

Using the [W3C App Manifest specification](https://www.w3.org/TR/appmanifest/) and the existing metatags for adding an app to the homescreen in mobile devices we enable our users to add our web content to the homescreen of mobile devices to foster a higher level of interaction and reengagement with the content.

It's next to impossible to remember all the items you can include in your manifest. Rather than go through tutorials for the reduced set required for Android's add to homescreen (documented in [Google's web fundamentals](https://developers.google.com/web/updates/2014/11/Support-for-installable-web-apps-with-webapp-manifest-in-chrome-38-for-Android) we can use tools like Manifestation (either as a [Node Package](https://www.npmjs.com/package/manifestation) or [web based](https://webmanife.st/)) to generate a complete manifest for our applicaiton. The Node version can also be used as part of a Gulp/Grunt build system.

[HTML5 Doctor](http://html5doctor.com/web-manifest-specification/) has a good an up to date reference on App Manifest. Another source of information is the Mozilla Developer Network article on [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest).

Expect a deeper dive on Web Application Manifest some time in December.

### IndexedDB

We've had client-side storage solutions for a while now. Sessions Storage, WebSQL and IndexedDB. Until recently they had no uniform support among brosers and one (WebSQL) is no longer being developed because all the implementations relied on [SQLite](https://sqlite.org/) as the backend and this was considered to violate the "two interoperable implementations" requirements for W3C specs.

I've chosen IndexedDB as the engine to store data for my offline applications because, as complicated as the API is work with, there are wrapper libraries that make the work easier and will work across browsers, even Safari (which has a deserved reputation for shitty IndexDB implementations).

Knowing how much of a pain it can be to write bare IndexedDB code, I've picked [Dexie](http://dexie.org/) as my wrapper library. It is easy to use and, for browsers who have issues with indexedDB like Safari, provide a transparent fallback to WebSQL. It also uses promises rather than callbacks and, once you start working with promises, you will never go back to callbacks :-)

The example below shows how to create a database and a store for the a theoretical friends datastore.

```javascript
var db = new Dexie("friends");

// Define a schema
db.version(1).stores({
  friends: 'name, age'
});
```

We then open the database

```javascript
// Open the database
db.open().catch(function(error) {
  alert('Uh oh : ', error);
});
```

We can then insert records into the datastore one at a time or using a transaction.

Transactions group one or more actions into an atomic unit. If any of the actions composing a transaction fails then the entire transaction fails and the datasore is rolled back to the state before the transaction began.

````javascript
// Insert data into the database
db.friends.add({
  name: 'Camilla', age: 25
});

// Insert data into database using transactions
function populateSomeData() {
  return db.transaction("rw", db.friends, function () {
    db.friends.clear();
    db.friends.add({ name: "David", age: 48 });
    db.friends.add({ name: "Ylva", age: 21 });
    db.friends.add({ name: "Jon", age: 76 });
    db.friends.add({ name: "Måns", age: 56 });
    db.friends.add({ name: "Daniel", age: 55 });
    db.friends.add({ name: "Nils", age: 42 });
    db.friends.add({ name: "Zlatan", age: 21 });

    // Log data from DB:
    db.friends.orderBy('name').each(function (friend) {
        log(JSON.stringify(friend));
    });
  })
  .catch(function (e) {
    log(e, "error");
  });
}
 ```
We can then retrieve data from the store usning queries similar to the SQL syntax. An example of this query retrieves all the names from the data store where the age is over (above) 35 and then display the names.  

```language-javascript
// Query friends datastore
db.friends
  .where('age')
  .above(35)
  .each (function (friend) {
    console.log (friend.name);
  });
````

There may be occasions when we need to delete the database, maybe because we don't need it again or maybe because we screwed up and want to start over.

```javascript
db.delete().then(function() {
    console.log("Database successfully deleted");
}).catch(function (err) {
    console.error("Could not delete database");
}).finally(function() {
    // Do what should be done next...
});
```

This is a very broad and quick overview of Dexie. If you want more information check [the Dexie.js Tutorial](https://github.com/dfahlander/Dexie.js/wiki/Tutorial) to get started.

There are other wrapper libraries for IndexedDB but Dexie is the most flexible and forgiving one for me.
