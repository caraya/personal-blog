---
title: Partial List of Events
date: 2024-11-13
tags:
  - Javascript
  - Events
---

This post is a continuation of the last post about Javascript events. It will give a partial list of events available to Javascript browsers, whether they bubble up to parent chain and a brief description.

Knowing whether an even bubbles or not is important since it may change the way you write code.

The first block of events are triggered in the window or document objects.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Window/Document Events** |||
| load | No | Fired when the whole page (including external resources) is fully loaded. |
| unload | No | Fired when the page is unloading from the browser. |
| beforeunload | No | Fired when the user is about to leave the page (e.g., closing tab, navigating away). |
| resize | No | Fired when the window is resized. |
| scroll | Yes | Fired when the window or an element is scrolled. |
| hashchange | No | Fired when the URL hash (fragment identifier) changes. |
| popstate | No | Fired when the active history entry changes (for single-page applications using history API). |
| online | No | Fired when the browser goes online. |
| offline | No | Fired when the browser goes offline. |
| orientationchange | No | Fired when the device orientation changes. |

Focus events are fired when an element gains or loses focus. The difference between the two pairs of events (focus/blur and focusin/focusout) is that the latter pair bubble and the other one doesn't.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Focus Events** |||
| focus | No | Fired when an element (e.g. input) gains focus (does not bubble). |
| blur | No | Fired when an element loses focus (does not bubble). |
| focusin | Yes | Similar to focus, but bubbles. |
| focusout | Yes | Similar to blur, but bubbles. |

Form events are specific to forms and their children. Some of these inputs are specific to some types of form children elements.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Form Events** |||
| input | Yes | Fired when the value of an input or textarea changes. |
| change | Yes | Fired when an element's value is changed and the element loses focus (for select/radio/checkbox). |
| submit | No | Fired when a form is submitted. |
| reset | No | Fired when a form is reset. |
| select | No | Fired when text in a text field is selected. |

Keyboard events deal with keyboard changes and updates.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Keyboard Events** |||
| keydown<br>**deprecated** | Yes | Fired when a key is pressed down. |
| keypress | Yes* | Fired when a character-producing key is pressed down. |
| keyup | Yes | Fired when a key is released. |

There are set of mouse specific events... You should be careful when using these events since you have no way to predict what type of device your users will use to access your content. See also the touch and pointer events.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Mouse Events** |||
| click | Yes | Fired when a pointing device button (usually the primary button) is clicked. |
| dblclick | Yes | Fired when a pointing device button is double-clicked. |
| mousedown | Yes | Fired when a pointing device button is pressed down on an element. |
| mouseup | Yes | Fired when a pointing device button is released over an element. |
| mousemove | Yes | Fired when a pointing device is moved inside an element. |
| mouseover | Yes | Fired when a pointing device is moved onto an element or one of its children. |
| mouseout | Yes | Fired when a pointing device is moved off an element and its children. |
| mouseenter | No | Similar to mouseover, but does not bubble; only fires when the pointer enters the element itself. |
| mouseleave | No | Similar to mouseout, but does not bubble; only fires when the pointer leaves the element itself. |
| contextmenu | Yes | Fired when the right mouse button is clicked (or a context menu key is pressed). |

Pointer events are a combination of touch and mouse events designed to support a wider variety of devices used to access web content.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Pointer Events** |||
| pointerdown | Yes | Fired when a pointer (mouse, pen, touch) is pressed down. |
| pointerup | Yes | Fired when a pointer is released. |
| pointermove | Yes | Fired when a pointer changes coordinates. |
| pointerover | Yes | Fired when a pointing device moves onto an element or its descendants. |
| pointerout | Yes | Fired when a pointing device moves away from an element and its descendants. |
| pointerenter | No | Fired when a pointing device moves onto the element (no bubbling). |
| pointerleave | No | Fired when a pointing device moves out of the element (no bubbling). |
| pointercancel | Yes | Fired when a pointer is canceled, often due to a hardware event. |
| gotpointercapture | Yes | Fired when an element receives pointer capture. |
| lostpointercapture | Yes | Fired when an element loses pointer capture. |

Both the [drag and drop](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) and [clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) APIs generate their own events.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Drag & Clipboard Events** |||
| drag | Yes | Fired when an element is being dragged. |
| dragstart | Yes | Fired when the user starts dragging an element. |
| dragend | Yes | Fired when a drag operation ends. |
| dragenter | Yes | Fired when a dragged element enters a drop target. |
| dragleave | Yes | Fired when a dragged element leaves a drop target. |
| dragover | Yes | Fired when a dragged element is over a drop target. |
| drop | Yes | Fired when a dragged element is dropped on a valid drop target. |
| copy | Yes | Fired when the user copies content to the clipboard. |
| cut | Yes | Fired when the user cuts content to the clipboard. |
| cut | Yes | Fired when the user cuts content to the clipboard. |
| paste | Yes | Fired when the user pastes content from the clipboard. |

Media Events are fired when the status of a media element changes.

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Media Events** |||
| play | No | Fired when playback of media starts or resumes. |
| pause | No | Fired when playback of media is paused. |
| ended | No | Fired when media has reached the end. |
| volumechange | No | Fired when the volume or mute state of the media changes. |
| timeupdate | No | Fired when the playing position of the media changes (e.g., due to user seeking). |
| canplay | No | Fired when the browser can start playing media (but may still need buffering). |
| canplaythrough | No | Fired when the browser estimates it can play media to the end without buffering. |
| seeking | No | Fired when the user starts moving the play position indicator. |
| seeked | No | Fired when the user finishes moving the play position indicator. |

Animation and transition-related events. These animations can be triggered either from CSS or Javascript using the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Animation & Transition Events** |||
| animationstart | Yes | Fired when a CSS animation starts. |
| animationend | Yes | Fired when a CSS animation ends. |
| animationiteration | Yes | Fired when a CSS animation repeats. |
| transitionstart | Yes | Fired when a CSS transition starts. |
| transitionend | Yes | Fired when a CSS transition completes. |
| transitionrun | Yes | Fired when a CSS transition is created. |
| transitioncancel | Yes | Fired when a CSS transition is canceled. |

All the following events fall outside the previous categories

| Event | Bubbles | Description |
|:---: |:---: | --- |
| **Miscellaneous Events** |||
| wheel | Yes | Fired when the wheel button of a pointing device is rotated. |
| message | No | Fired when a message is received through a MessagePort or a Web Worker. |
| error | No | Fired when an error occurs (varies by context, e.g. script load error or media error).             |
| abort | No | Fired when a resource loading is aborted. |
| toggle | Yes | Fired when the open/closed state of a `<details>` element changes. |
