---
title: "Digital Storytelling:  Full, Immersive VR"
date: "2017-08-28"
---

We've looked at using beacons and we've began our discussion of digital storytelling using Augmented Reality. Now we'll look at a fully immersive experience using Virtual Reality Gear. This section is less about code and more about the possibilities inherent in telling stories in this medium using a small set of technologies:

* Leap Motion to provide a set of interaction gestures
* WebGL 3D environments to build the world we'll be interacting in
  * A-Frame
* Possible voice interfaces to add further interfaces to the stories we tell
  * Speech Synthesis API
* Unity 3D environment

As we explore these tools we'll also look at:

* Navigation and travel through digital worlds
* Bots and other clues for the virtual tourist

We'll start working with [A-Frame](https://aframe.io/), from Mozilla. It does an excelent job of abstracting the underlying [Three.js](https://threejs.org/) and [WebGL](https://www.khronos.org/webgl/) code into a tag-based language, similar to HTML. At its simplest an A-Frame scene looks like the code below. We link to the A-Frame library and then write tags to create the content we want:

* A scene to hold our content
* A box
* A sphere
* A cylinder
* A plane to put the content in
* A sky element with a set color

A-Frame does it all in less than 10 lines of HTML-like tags. The creator doesn't need to know what goes on "under the hood" to see the results of the code.

```html
<html>
  <head>
    <title>Hello, WebVR! - A-Frame</title>
    <meta name="description" content="Hello, WebVR! - A-Frame">
    <script src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
  </head>
  <body>
    <a-scene>
      <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  </body>
</html>
```

We can get as complex as we want to. The example below shows how to do animation in A-Frame. The example below from the [A-Frame site](https://aframe.io) provides a much richer experience without increasing the lines of code.

The example introduces additional elements like [entities](https://aframe.io/docs/0.5.0/core/entity.html), [light](https://aframe.io/docs/0.5.0/components/light.html) and [camera](https://aframe.io/docs/0.5.0/components/camera.html).

The full working example can be found in the [A-Frame Examples library](https://aframe.io/examples/showcase/animation/)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>lazerGlazer_Viz</title>
    <style>
      html, body { margin: 0; padding: 0; overflow: hidden; }
    </style>
    <script src="https://aframe.io/releases/0.4.0/aframe.min.js"></script>
    <script src="https://rawgit.com/ngokevin/aframe-animation-component/master/dist/aframe-animation-component.min.js"></script>
    <script src="https://rawgit.com/protyze/aframe-alongpath-component/master/dist/aframe-alongpath-component.min.js"></script>
  </head>
  <body>
    <a-scene>
      <a-camera position="0 0 0"></a-camera>
      <a-sky></a-sky>
      <a-entity id="object-container" position="0 1.6 -2" scale=".4 .4 .4"></a-entity>
      <a-light type="ambient" intensity="0.7" color="#ffffff"></a-light>
      <a-light intensity="3" color="#00ffff" position="-5.72 6.65 0.80"
          animation__color="property:color; dir:alternate; dur:2000; easing:easeInOutSine; loop:true; to:#ff0000"
          alongpath="path:10,10,-10 -20,10,-10 10,0,-10; closed:true; dur:12000"></a-light>
      <a-light intensity="5" color="#ff0000" position="8.60 6.65 0.80"
          animation__color="property:color; dir:alternate; dur:2000; easing:easeInOutSine; loop:true; to:#0000ff"
          alongpath="path:-2,-2,5 2,-1,5 0,-1,5; closed:true; dur:3000;"></a-light>
    </a-scene>
  <script type="text/javascript" src="scripts/app.js"></script>
  </body>
</html>
```

Starting with code like this we can build any type of structure that we can in Three.js. We can also use lower level constructs like [WebGL shaders](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html), the low level scripts that make WebGL elements change and do things beyond what stock WebGL allows for.

A-Frame's discussion of materials (one of the two components for objects in WebGL) discuses how to [add custom Shaders](https://aframe.io/docs/0.5.0/components/material.html#register-a-custom-material) to enhance the materials we use in our content.

We can also drop directly to Three.js code and use it within the A-Frame code. The A-Frame project also provides instructions on [using Three.js from within A-Frame](https://aframe.io/docs/0.5.0/guides/using-with-threejs.html).

A-Frame gives you a declarative way to create 3D content and scenes without loosing the flexibility of Three.js and Shaders when we need to use them. We'll see whether using declarative markup or procedural code works better.

Creating these environments presents another question. ***How do we navigate from one scene to another***. For example, if our story takes place in a house, how do we navigate from one room to another and how do we restrict what places we can and cannot go to?

In an ideal world we'd load all the assets we need as a large application and then transition seamlessly between areas that works but puts a lot of assets in the user's computer that might or might not be neecessaary.

The simplest possibility is to tie the movement across sectors or boundaries. For example If we set the story in a house we can trigger movement from the house to a different location by loading the destination's assets when the user touches the door or waslk near it; similar to the way in which World of Warcraft and other MMORPGs load assets for a new section of the world.

Another way to do load assets is to load an initial set of assets, where the user begins the experience, and then stream new assets to the user's machine as needed and with a large splash screen to separate major areas of the world.

The final example I want to show is what a Leap Motion integration looks like in an A-Frame application. I've take the example from the [aframe-leap-hands](https://github.com/openleap/aframe-leap-hands) Github repository. Technologies like Leap, Oculus Touch and the Valve controllers help give a fuller virtual experience by allowing hand getstures and other haptic feed back for the user.

The new entities create a right and left hands for the Leap Motion controller and, once again, hides all the complexity of setting up the Three.js environment

```html
<html>
  <head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,user-scalable=no,maximum-scale=1">
    <title>Examples • Leap Hands</title>
    <script src="../budo.js"></script>
  </head>
  <body>
    <a-scene>
      <!-- Player -->
      <a-entity camera="near: 0.01" look-controls>
        <a-entity leap-hand="hand: left"></a-entity>
        <a-entity leap-hand="hand: right"></a-entity>
      </a-entity>

      <!-- Terrain -->
      <a-grid></a-grid>

      <!-- Lighting -->
      <a-light type="ambient" color="#ccc"></a-light>
      <a-light color="#ddf" distance="100" intensity="0.4" type="point"></a-light>
      <a-light color="#ddf" position="3 10 -10" distance="50" intensity="0.4" type="point"></a-light>
    </a-scene>
  </body>
</html>
```

A-Frame has an audio component that is affected by the position of the object it's attached to. Combined with events this opens a wide variety of additional possibilities for the stories we tell... More research is needed.

Some of the devices I want to explore with require Unity as the development engine and provide additional code and libraries to make the experience easier. At first I was a little concerned on the requirement, yet another language to learn for uncertain return, but as I've started looking at the code it's become less scary than I expected.

I'm still trying to figure out C Sharp and how to best learn it and, because I'm lazy, how much of the code is actually hidden by the Unity Editor and how much code I have to write.

Below is an example video taken from Unity's [Roll A Ball Tutorial](https://unity3d.com/learn/tutorials/projects/roll-ball-tutorial/moving-camera)

<iframe width="560" height="315" src="https://www.youtube.com/embed/Xcm5H2J95iI?rel=0" frameborder="0" allowfullscreen></iframe>

The code described in the video appears below:

```csharp
using UnityEngine;
using System.Collections;

public class CameraController : MonoBehaviour {

    public GameObject player;

    private Vector3 offset;

    void Start () {
        offset = transform.position - player.transform.position;
    }

    void LateUpdate ()
    {
        transform.position = player.transform.position + offset;
    }
}
```

The final piece of software I want to discuss is AR.js by Jerome Etienne and team. It uses existing open source software and mobile phones to create AR models.

<iframe width="560" height="315" src="https://www.youtube.com/embed/v_Uj0C8sMi4?rel=0" frameborder="0" allowfullscreen></iframe>

The example in the video (code below) extends A-Frame with AR specific information. The AR tools for AR.js extend [AR Toolkit](https://artoolkit.org/) an open source AR tracking toolkit.

The idea is that we create the code to go with each marker and then when a mobile camera, like the one on a mobile phone, looks at the marker the corresponding AR model (in this case a rotating sphere of the world) will show up and rotate as an animation on your phone.

The code to display an image over the marker looks like this:

```html
<script
  src="https://aframe.io/releases/0.5.0/aframe.min.js"></script>
<script
  src="https://rawgit.com/jeromeetienne/ar.js/master/aframe/build/aframe-ar.js"></script>
<script>
  THREEx.ArToolkitContext.baseURL = 'https://rawgit.com/jeromeetienne/ar.js/master/three.js/'
</script>
<body style='margin : 0px; overflow: hidden;'>
    <a-scene embedded artoolkit='sourceType: webcam;'>
    <a-sphere
    src="https://raw.githubusercontent.com/aframevr/sample-assets/master/assets/images/space/earth_atmos_4096.jpg"
      radius="0.5" position="0 0.5 0" segments-height="53">
         <a-animation attribute="scale"
              dur="1000"
              from= "1 1 1"
              to="2 2 2"
              direction='alternate-reverse'
              easing= "ease-in-out-circ"
              repeat="indefinite"></a-animation>
     </a-sphere>
        <a-marker-camera preset='kanji'></a-marker-camera>
    </a-scene>
</body>
```
