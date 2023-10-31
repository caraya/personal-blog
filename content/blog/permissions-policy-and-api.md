---
title: "Permissions policy and API"
date: "2023-08-28"
---

The [Permissions API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Permissions_API/Using_the_Permissions_API) gives use the ability to request permission from the user to use a given web API.

This is an update of the 2020 posts [Feature Policies](https://publishing-project.rivendellweb.net/feature-policies/) and [Working with Feature Policies in client-side Javascript](https://publishing-project.rivendellweb.net/working-with-feature-policies-in-client-side-javascript/).

Feature policies have been renamed to Permissions API and the API may have changed since the original articles were posted

In this post we'll look at the Permissions API, how it works, how it's different from other APIs like geolocation that provide their own permissions, how is this different than using Content Security Policies, and how to incorporate it into your projects.

## What is the Permissions API

The permissions policy allows you to request user permission to use a given Javascript API in your application.

Not all APIs are gated behing the permissions API. The list of available APIs and their corresponding policiesn are shown in the following table

| API | Policy |
| --- | --- |
| [Background Synchronization API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Background_Synchronization_API) (should always be granted) | `background-sync` |
| [Clipboard API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Clipboard_API) | `clipboard-read`, `clipboard-write` |
| [Geolocation API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Geolocation_API) | `geolocation` |
| [Local Font Access API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Local_Font_Access_API) | `local-fonts` |
| [Media Capture and Streams API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Media_Capture_and_Streams_API) | `microphone`, `camera` |
| [Notifications API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Notifications_API) | `notifications` |
| [Payment Handler API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Payment_Handler_API) | `payment-handler` |
| [Push API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Push_API) | `push` |
| [Sensor APIs](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Sensor_APIs) | `accelerometer`, <br>`gyroscope`,<br>`magnetometer`,<br>  `ambient-light-sensor` |
| [Storage Access API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Storage_Access_API) | `storage-access` |
| [Storage API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Storage_API) | `persistent-storage` |
| [Web Audio Output Devices API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Audio_Output_Devices_API) | `speaker-selection` |
| [Web MIDI API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Web_MIDI_API) | `midi` |

In the first example we use a button element in the HTML document to trigger permission request. All permissions for the APIs that use the Permissions API require user gesture, as I was researching this post, I discovered that you can't trigger the permission request programatically.

```js
async function requestPermissions() {
  const response = await navigator.permissions.request({name: "notifications"});
  const currentPermissions = response;

  console.log(`Current permissions:`, currentPermissions);
}

const activateBtn = document.getElementById("activate");

activateBtn.addEventListener("click", requestPermissions);
```

We can also query the permissions state whenever we want to do something about with the API.

The `navigator.permissions.query` method takes an array of one or more permissions and checks the status.

```js
navigator.permissions.query({
  name: "notifications"
}).then((result) => {
  if (result.state === "granted") {
    console.log("Permission granted")
  } else if (result.state === "prompt") {
    ("Browser will prompt for permission")
  } else {
    console.log('permission was not granted')
  }
});
```

Finally, we can query the status of one or more permissions. This example, taken from [A Tour of the JavaScript Permissions API](https://www.digitalocean.com/community/tutorials/js-permissions-api) shows how can query and display the status of the different permissions available through the Permissions API.

I chose to use [Promise.allSettled()](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/JavaScript/Reference/Global_Objects/Promise/allSettled) instead of [Promise.all()](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/JavaScript/Reference/Global_Objects/Promise/all) because I want to make sure that all promises resolve rather than have the promise return when one of the component promises rejects.

The `permissionsNames` constant holds the names of the permissions we want to check. In this case I've added all the permissions from the table in the earlier section of this post.

```js
const permissionsNames = [
  "geolocation",
  "notifications",
  "push",
  "midi",
  "camera",
  "microphone",
  "background-fetch",
  "background-sync",
  "persistent-storage",
  "ambient-light-sensor",
  "accelerometer",
  "gyroscope",
  "magnetometer",
  "display-capture",
  "clipboard-read",
  "clipboard-write",
  "local-fonts",
  "payment-handler",
  "storage-access",
  "speaker-selection",
]
```

Inside the `getAllPermissions` function we create an empty arra for the permissions. We'll populate this array later in the function.

The first wrapper is `Promise.allSettled()`. Inside the allSettled block we create a [map](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/JavaScript/Reference/Global_Objects/Array/map) from the permissionsName array we've defined earlier.

Then we use a [switch](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/JavaScript/Reference/Statements/switch) statement to special case the `push` permission to account for Chrome's idiosyncracies.

The `default` switch block will query each of the permissions to get its current status and push the result to the `allPermissions` array.

The final step is to return the `allPermissions` array.

We then call `getAllPermissions` to trigger the query process.

```js
async function getAllPermissions() {
  const allPermissions = []
  await Promise.allSettled(
    permissionsNames.map(async (permissionName) => {
      try {
        let permission
        switch (permissionName) {
          case 'push':
            permission = await navigator.permissions.query({name: permissionName, userVisibleOnly: true})
            break
          default:
            permission = await navigator.permissions.query({name: permissionName})
        }
        console.log(permission)
        allPermissions.push({
          permissionName, state:
          permission.state
        })
      }
      catch(e){
        allPermissions.push({
          permissionName,
          state: 'error',
          errorMessage: e.toString()
        })
      }
    })
  )
  return allPermissions
}

getAllPermissions()
```

### Older APIs and how they grant permission

You may see older APIs like geolocation and notifications use different ways to request permissions. The old ways will still work, but they also provide a more uniform way to request permissions.

This example uses the [geolocation API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Geolocation_API) to request the user's location.

The old way to request permission is to use `geolocation.getCurrentPosition`. Whenever we use this code, the browser will ask for permission.

```js
navigator.geolocation.getCurrentPosition(function(position) {
    console.log('Geolocation permissions granted');
    console.log('Latitude:' + position.coords.latitude);
    console.log('Longitude:' + position.coords.longitude);
});
```

Using the permissions API the code will query the `geolocation` permission and then print the status of the permission.

We also set up an `onchange` event to detect changes of the permission and we log any changes to the permission.

```js
navigator.permissions
  .query({ name: "geolocation" })
  .then(function (permissionStatus) {
    console.log("geolocation permission state is ", permissionStatus.state);

    permissionStatus.onchange = function () {
      console.log("geolocation permission state has changed to ", this.state);
    };
  });
```

### Relationship with Content Security Policy (CSP)

CSP and the Permissions API address different aspects web security.

CSP addresses the source of content for your website while the permissions API asks the user if the app can use a given web API.

So there's no real comparison as they perform different functions.

### Relationship with the Permissions-Policy

In addition to the client-side Permissions API there is also a Permissions Policy HTTP header system that allows you to set usage policies on the server before querying them on the client.

The list of available permission you can set via the HTTP headers is available in the [Directives section](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives) of MDN's [Permissions-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy) page.

In that page you'll see that many of the permissions available as HTTP headers are related to Chromium's [web capabilities project](https://developer.chrome.com/blog/capabilities/) (also known as Project Fugu). While these APIs will only work in Chromium browsers it is interesting that they get grouped with APIs that work cross browsers.

## Iframe allow syntax

`iframe` elements can have their own permissions that further restrict what developers can and cannot do with iframes.

You can configure iframes using the `allow` attribute to indicate one or more permissions that controls what the iframe can do.

These configuration are done on a per-iframe basis so you have to configure each iframe on its own.

The following example, taken from YouTube, shows how the `allow` attribute works.

```html
<iframe
  width="560" height="315"
  src="https://www.youtube.com/embed/rZJgedd2Fk4"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer;
    autoplay;
    clipboard-write;
    encrypted-media;
    gyroscope;
    picture-in-picture;
    web-share" allowfullscreen>
</iframe>
```

The iframe `allow` attribute controls whether you can use an API and is closer in intent to the HTTP headers approach.

Used in combination with the client-side API it gives developers a powerful way to ask for permission before using powerful APIs.

## Links and resources

- [Permissions Policy Specification](https://w3c.github.io/webappsec-permissions-policy/)
- [Permissions API for the Web](https://developer.chrome.com/blog/permissions-api-for-the-web/)
- [Permissions API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Permissions_API)
- [Using the Permissions API](https://developer.mozilla.orghttps://developer.mozilla.orgWeb/API/Permissions_API/Using_the_Permissions_API)
