---
title: "PWA Starter: Manifest"
date: "2017-11-01"
---

# Manifest

The first, and easier, aspect of a PWA is the manifest. This is a JSON file that holds information about the content and gives supporting browsers hints and instructions for installing the content in the user's homescreen.

```html
<link rel="manifest" href="/manifest.json" />
```

The manifest itself is a JSON file that contanins information about the application. The sample manifest below contains the following information:

- name: Full name of the application
- short name: Short name of the application
- description
- icons: An array of available icons to use for different aspects of the application
- (default) orientation
- start\_url: The entry point for the application
- display: how is the application UI presented to the user
- background\_color while the application is loading
- text direction: rtl, ltr
- lang: default language

```json
{
  "name": "BookReader",
  "short_name": "BookReader",
  "description": "An ebook reader application",
  "icons": [{
    "src": "images/touch/homescreen48.png",
    "sizes": "48x48",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen72.png",
    "sizes": "72x72",
    "type": "image/png"
  }, {
    "src": "images/touch/homescreen144.png",
    "sizes": "144x144",
    "type": "image/png"
  }],

  "orientation": "portrait",
  "start_url": "index.html?utm_source=homescreen",
  "display": "standalone",
  "background_color": "#fff",
  "dir": "ltr",
  "lang": "en-us",
}
```

Orientation may be one of the following values:

- any
- natural
- landscape
- portrait

There are additional values for orientation that I'm researching. I think they move the app to primary or secondary display but, as far as I understand them, only landscape and portrait are currently supported. The additional values are:

- landscape-primary
- landscape-secondary
- portrait-primary
- portrait-secondary

The display mode attribute controls how much of the browser's chrome and UI is show for your application. Each of the 4 modes in the table below falls back to the next one on the table, except for browser, which is the default.

| Display Mode | Description | Fallback Display Mode |
| --- | --- | --- |
| `fullscreen` | All of the available display area is used for content and none of the browser chrome is visible. | `standalone` |
| `standalone` | The application will look and feel like a standalone application. In this mode, the user agent will exclude UI elements for controlling navigation, but can include other UI elements such as a status bar. | `minimal-ui` |
| `minimal-ui` | The application will look and feel like a standalone application, but will have a minimal set of UI elements for controlling navigation. The included elements vary by browser. | `browser` |
| `browser` | This is the default mode. The application opens in a conventional browser tab or new window, depending on the browser and platform. | (None) |

 

## Splash Screen

Chrome 47 and later, display a splash screen for a web application launched from a home screen. This splashscreen is auto-generated using properties in the web app manifest, specifically: `name`, `background_color`, and the icon in the `icons` array that is closest to 128dpi for the device.

Even if it's not a PWA, the ability to save a web site or app to the homescreen greatly improves the user experience for the content.
