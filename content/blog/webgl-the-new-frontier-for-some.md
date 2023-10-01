---
title: "WebGL: The New Frontier (for some)"
date: "2014-02-11"
categories: 
  - "technology"
  - "tutorials"
---

Not too long ago there was a demo of the [Epic Citadel](http://www.unrealengine.com/html5/) OpenGL demo translated to JavaScript and played inside a web browser. The code was ported from C++ to [ASM](http://asmjs.org/), a subset of JavaScript optimized for performance using and then fed into a web browser for rendering and display.

Even if we leave the conversion from C++ to JavaScript aside for the moment. You're running a high end game inside a web browser... without plugins!

Think about it. We can now do 3D animations that take advantage of your computer's GPU to render high quality 3D objects, animations and transitions that rival work done with professional 3D software (and you can even import files from Maya, Blender and others into a WebGL environment).

## What is WebGL

> WebGL is a cross-platform, royalty-free web standard for a low-level 3D graphics API based on OpenGL ES 2.0, exposed through the HTML5 Canvas element as Document Object Model interfaces. Developers familiar with OpenGL ES 2.0 will recognize WebGL as a Shader-based API using GLSL, with constructs that are semantically similar to those of the underlying OpenGL ES 2.0 API. It stays very close to the OpenGL ES 2.0 specification, with some concessions made for what developers expect out of memory-managed languages such as JavaScript. From: [http://www.khronos.org/webgl/](http://www.khronos.org/webgl/) WebGL is a JavaScript API that allows us to implement interactive 3D graphics, straight in the browser. For an example of what WebGL can do, take a look at this [WebGL demo video](http://www.youtube.com/embed/KDQbXLXM_l4) (viewable in all browsers!) WebGL runs as a specific context for the HTML `<canvas>` element, which gives you access to hardware-accelerated 3D rendering in JavaScript. Because it runs in the `<canvas>` element, WebGL also has full integration with all DOM interfaces. The API is based on [OpenGL ES 2.0](http://www.khronos.org/opengles/2_X/), which means that it is possible to run WebGL on many different devices, such as desktop computers, mobile phones and TVs. From: [http://dev.opera.com/articles/view/an-introduction-to-webgl/](http://dev.opera.com/articles/view/an-introduction-to-webgl/)

## Why should we care?

Besides the obvious implications of having 3D graphics online without having to use plugins imagine how much more expressive we can make our content if we can mix 2d and 3d content. WebGL means that we're no longer tied to plugins to create AAA-game type experiences for the web platform (look at the [Epic Citadel](http://www.unrealengine.com/html5/) for a refresher), incorporate 3D rendered content into your 2D web content (product configurators like the [+360 Car Visualizer](http://carvisualizer.plus360degrees.com/threejs/) come to mind), web native [architectural](http://www.youtube.com/watch?v=TPvfcWDBh_E&list=PLX6SK-VOc5IOvuze5_Jkv2dc5OsUo9ArB) or [anatomical](http://www.zygotebody.com/) visualizations or just awesome animation work like [thisway.js](http://kile.stravaganza.org/lab/thiswayjs/#) a WebGL remale of an older flash based demo or Mr. Doob's [extensive libraries of demos and examples](http://www.mrdoob.com/).

As the WebGL techology stack matures we'll see more and more examples and creative uses of the technology. I hope we'll see more editors and tools that will make it easuer for non-experts to create interactive content.

## Before we start

Before you try creating your own WebGL It's a good idea to go to [http://analyticalgraphicsinc.github.io/webglreport/](http://analyticalgraphicsinc.github.io/webglreport/) to test whether your browser and computer support WebGL.

## Building WebGL content

There are two ways to create WebGL content. They each hve their advantages and drawbacks that will be pointed out as we progress through the diffrent creation processes.

### The hard way

The hard way is to create content using WebGL primitives and coding everything ourselves as show in [https://developer.mozilla.org/en-US/docs/Web/WebGL/Adding\_2D\_content\_to\_a\_WebGL\_context](https://developer.mozilla.org/en-US/docs/Web/WebGL/Adding_2D_content_to_a_WebGL_context) and [https://developer.mozilla.org/en-US/docs/Web/WebGL/Animating\_objects\_with\_WebGL](https://developer.mozilla.org/en-US/docs/Web/WebGL/Animating_objects_with_WebGL). You can see the ammount of code and specialized items we need to build in order to create the content.

Take a look at the [Mozilla WebGL tutorial](https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL) as an illustration of the complexities involved in creating WebGL with the raw libraries and interfaces.

If interested in the full complexities of writing raw WebGL code, look at the source code for [https://developer.mozilla.org/samples/webgl/sample7/index.html](https://developer.mozilla.org/samples/webgl/sample7/index.html) to see WebGL code and the additional complexities. We'll revisit part of the examples above when we talk about custom CSS filters.

The pen below also illustrates the complexities of writing bare WebGL

<p data-height="529" data-theme-id="2039" data-slug-hash="HLxbB" data-default-tab="js" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/HLxbB">HLxbB</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//codepen.io/assets/embed/ei.js"></script>

For a more complete look at the workings of WebGL look at Mike Bostock's WebGL Tutorial series:

- [WebGL](http://bl.ocks.org/mbostock/5440492)
- [WebGL II](http://bl.ocks.org/mbostock/5445238)
- [WebGL III](http://bl.ocks.org/mbostock/5445604)
- [WebGL IV](http://bl.ocks.org/mbostock/5445849)

If you are a game programmer or a game developer this will be the level you'll be working at and other platforms, libraries and frameworks will not be necessary for your work. If you're someone who is not familiar with coding to the bare metal or who is not familiar with matrix algebra there are solutions for us.

### The easy way

Fortunately there are libraries that hide the complexities of WebGL and give you a more user friendly interface to work with. I've chosen to work with [Three.JS](http://threejs.org), a library developed by [Ricardo Cabello](http://ricardocabello.com/blog) also known as [Mr Doob](http://www.mrdoob.com).

The following code uses Three.js to create a wireframe animated cube:

\[codepen\_embed height="516" theme\_id="2039" slug\_hash="JlEfG" default\_tab="js"\] var camera, scene, renderer; var geometry, material, mesh;

init(); animate();

function init() {

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000); camera.position.z = 800;

scene = new THREE.Scene();

geometry = new THREE.CubeGeometry(200, 200, 200); // We have to use MeshBasicMaterial so we can see the color // Otherwise it's all black and waits for the light to hit it material = new THREE.MeshBasicMaterial({ color: 0xAA00AA, wireframe: true });

mesh = new THREE.Mesh(geometry, material); scene.add(mesh);

renderer = new THREE.CanvasRenderer(); renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

}

function animate() { // note: three.js includes requestAnimationFrame shim requestAnimationFrame(animate);

// Play with the rotation values mesh.rotation.x += 0.01; mesh.rotation.y -= 0.002;

renderer.render(scene, camera); }

See the Pen [Basic WebGL example using Three.js](http://codepen.io/caraya/pen/JlEfG) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io). \[/codepen\_embed\]

As you can see, Three.js abstracts all the matrix/linear algebra and all the shader programming giving you just the elements that ou need to create content. This has both advantages and drawbacks.

Mike Bostock writes in his [introduction to WebGL tutorial](http://bl.ocks.org/mbostock/5440492):

> Every introductory WebGL tutorial I could find uses utility libraries (e.g., Sylvester) in efforts to make the examples easier to understand. While encapsulating common patterns is desirable when writing production code, I find this practice highly counterproductive to learning because it forces me to learn the utility library first (another layer of abstraction) before I can understand the underlying standard. Even worse when accompanying examples use minified JavaScript.

On the other hand many people, myself included, just want something that works. I am less interested in the underlying structure (that may come in time as I become more proficient with the library way of doing WebGL) than I am in seeing results happen.

See the section [WebGL resources](#resources) for a partial list of other WebGL libraries.

## Building a 3D scene

For this example we will use Three.js to build an interactive scene where we will be able to use the keyboard to move a cube around the screen. We will break the scripts in sections to make it easier to explain and work with.

The script is at the end of the <body> tag so we don't ensure that the body is loaded.

### Basic setup

The first thing we do is define the element where our WebGL content is going to live. We follow that with linking to the scripts we will use in the project:

- `three.min.r58.js` is the minimized version of Three.js. In developmnet I normally use the uncompressed version
- `OrbitControls.js` controls the movement of the camera used in the scene
- `Detector.js` is the WebGL detection library
- `threex.keyboardstate.js` will help with key down event detection
- `threex.windowresize.js` automatically redraws the rendering when the window is resized

```
<!-- This is the element that will host our WebGL content -->
  <div id="display"></div>

<!-- Script links -->
<script src="lib/three.min.r58.js"></script>
<script src="lib/OrbitControls.js"></script>
<script src="lib/Detector.js"></script>
<script src="lib/threex.keyboardstate.js"></script>
<script src="lib/threex.windowresize.js"></script>
```

### Variables, scene and camera setup

Now tht we setup the links to the scripts that we'll use in this application we can declare variables and call the functions that will actually do the heavy lifting for us: init() and animate

```

// General three.js variables
var camera, scene, renderer;
// Model specific variables
// Floor
var floor, floorGeometry, floorTexture;
// light sources
var light, light2;
// Space for additional material
var movingCubeTexture, movingCubeGeometry, movingCubeTexture;
// Window measurement
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
// additional variables
var controls = new THREE.OrbitControls();
var clock = new THREE.Clock();
var keyboard = new THREEx.KeyboardState();

init();
animate();
```

### Initializing our scene

The first step in rendering our scene is to set everything up. In the code below:

Step 1 does two things. It sets up the scene, the root element for our model and it sets the camera, the object that will act as our eyes into the rendered model.

For this particular example I've chosen a [perspective camera](http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera) which is the one used most often. [This tutorial](http://games.greggman.com/game/webgl-3d-cameras/) covers perspective as used in WebGL and Three.js; it is a technical article but I believe it provides a good overview of what is a complex subject.

Once the camera is created, we set its position (`camera.position.set`)and where the camera is pointing to (`camera.lookAt`)

```
function init()
{
// Step 1: Add Scene
scene = new THREE.Scene();
// Now we can set the camera using the elements defined above
// We can also reduce the number of variables by putting the values directly into the camera variable below
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 10000);
scene.add(camera);
// The position.set value for the camera will setup the initial field of vision for the model
camera.position.set(0, -450, 150);
camera.lookAt(scene.position);
```

Step 2 sets up the renderer for our model. Using `Detector.js` we test if the browser supports WebGL. If it does then we setup Three.js `CanvasRenderer`, one of the many renderers available through Three.js.

Also note that even a modern browser can fail to support WebGL if it's running on older hardware or if the browser is not configured properly (older versions of Chrome required you to enable WebGL support through flags in order to display WebGL content and versions of Internet Explorer before 11 did not support WebGL at all).

At this point we also set up the `THREEx.WindowResize` using both the renderer and the camera. Behind the scenes, WindowResize will recompute values to resize our rendered model without us having to write code.

```
// Step 2: Set up the renderer
// We use the WebGL detector library we referenced in our scripts  to test if WebGL is supported or not
// If it is supported then we use the WebGL renderer with antialiasing
// If there is no WebGL support we fall back to the canvas renderer
if ( Detector.webgl ) {
  renderer = new THREE.WebGLRenderer( {antialias:true} );
 }  else {
     renderer = new THREE.CanvasRenderer();
}
// Set the size of the renderer to the full size of the screen
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
// Set up the contaier element in Javascript
var container = document.getElementById( 'display' );
THREEx.WindowResize(renderer, camera);
// CONTROLS
controls = new THREE.OrbitControls( camera, renderer.domElement );
// Add the child renderer as the container's child element
container.appendChild( renderer.domElement );
```

Step 3 is where we actually add the objects to our rendering process. They all follow the same basic process:

1. We define a material (texture) for the object
2. We Define a geometry (shape) it will take
3. We combine the material and the geometry to create a mesh
4. We add the mesh to the scene

The texture floor has some additional characteristics:

1. We load an image to use as the texture
2. We set the texture to repeat 10 times on each plane.

The sphere mesh on step 3b is positioned on the Z coordinates.

```
// Step 3 : Add  objects
// Step 3a: Add the textured floor
floorTexture = new THREE.ImageUtils.loadTexture( 'images/checkerboard.jpg' );
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 10, 10 );
floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture } );
floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
floor = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floor);

// Step 3b: Add model specific objects
movingCubeGeometry = new THREE.CubeGeometry( 50, 50, 50, 50);
movingCubeMaterial = new THREE.MeshBasicMaterial( {color: 0xff00ff} );
movingCube = new THREE.Mesh(movingCubeGeometry, movingCubeMaterial);
movingCube.position.z = 35;
movingCube.position.x = 0

scene.add(movingCube);
```

In step 4, we add lights to the model in a way very similar to how we added the objects in step 3.

1. Create the light and assign a color upon creation
2. Set the position of the light using an X, Y, Z coordinate system
3. Add the lights to the scene

```
// Step 4: Add light sources
// Add 2 light sources.
light = new THREE.DirectionalLight( 0xffffff );
light.position.set( 0, 90 ,450 ).normalize();
light2 = new THREE.DirectionalLight( 0xffffff);
light2.position.set( 0, 90, 450 ).normalize();
scene.add(light);
scene.add(light2);
}
```

### Keyboard Interactivity

Right now we've built a cube over a checkered background plane... but we can't move it. That's what the animate function will do... it will setup the keyboard bindings.

Animate is a wrapper around 2 additional functions; render and update. The render() function just call our renderer to draw the frame of our application. The update function is where the heavy duty work happens.

```
function animate() {
  requestAnimationFrame( animate );
  render();
  update();
}

function render() {
  renderer.render( scene, camera );
}
```

The update() function sets up 2 variables: delta is a time-based value that will be used to calculate the distance of any movement that happens later in the function. The variable moveDistance uses delta to calculate the exact distance of each movement (200 \* the delta value)

Now that we've set up the value for the distance moved we test which key was pressed and change the coordinate values (x, y or z coordinates) and then prepare for the next update cycle.

The reset value is simpler. We reset all coordinates to 0.

```
function update() {
  var delta = clock.getDelta(); // seconds.
  var moveDistance = 200 * delta; // 200 pixels per second
  //var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second

  // global coordinates
  if ( keyboard.pressed("left") )
    movingCube.position.x -= moveDistance;
  if ( keyboard.pressed("right") )
    movingCube.position.x += moveDistance;
  if ( keyboard.pressed("up") )
    movingCube.position.y += moveDistance;
  if ( keyboard.pressed("down") )
    movingCube.position.y -= moveDistance;
  if ( keyboard.pressed ("w"))
    movingCube.position.z += moveDistance;
  if ( keyboard.pressed ("s"))
    movingCube.position.z -= moveDistance;
  // reset (let's see if this works)
  if ( keyboard.pressed ("z")) {
    movingCube.position.x = 0;
    movingCube.position.y = 0;
    movingCube.position.z = 50;
  }
  controls.update();
}
```

## Adding audio

In a future project I want to experiment with adding audio to our models. The best audio API I've found is the WebAudio API submitted by Google to the World Wide Web Consortium

[Getting started with the WebAudio API](http://publishing-project.rivendelweb.net/getting-stated-with-webaudio-api) discusses my experiments with the WebAudio API.

## Playing with editors

Three.js editors and authoring tools are just starting to appear. From my perspective some of the most promising are:

- [Three.js Editor](http://mrdoob.github.io/three.js/editor/)
- [ThreeScene](http://errolschwartz.com/projects/threescene/)
- [ThreeNodes](http://idflood.github.com/ThreeNodes.js/)
- [ThreeInspector](http://zz85.github.com/zz85-bookmarklets/)
- [ThreeFabs](http://blackjk3.github.com/threefab/)

## Examples

- [http://aleksandarrodic.com/p/jellyfish/](http://aleksandarrodic.com/p/jellyfish/)
- [Find your way to OZ](http://www.chromeexperiments.com/detail/find-your-way-to-oz/)
- [Journey through Middle Earth](http://www.chromeexperiments.com/detail/a-journey-through-middle-earth/?f=)
- [Animating a million letters](http://www.html5rocks.com/en/tutorials/webgl/million_letters/)
- [Case Study: Find your way to Oz](http://www.html5rocks.com/en/tutorials/casestudies/oz/)
- [Case Study: Journey through Middle Earth](http://www.html5rocks.com/en/tutorials/casestudies/hobbit/)
- [HTML5 Rocks WebGL Search Results](http://www.html5rocks.com/en/search?q=Three)
- [Khronos Group demo repository](http://www.khronos.org/webgl/wiki/Demo_Repository)
- [Khronos Group Wiki - User Contributions Examples](http://www.khronos.org/webgl/wiki/Demo_Repository)
- [Chrome WebGL Experiments](http://www.chromeexperiments.com/webgl/)
- [Three.JS Demo Repository](http://threejs.org/)
- [Mr Doob](http://www.mrdoob.com)
- [AlteredQualia](http://alteredqualia.com)

## WebGL Libraries and Frameworks

From: [Dev.Opera's Introduction to WebGL article](http://dev.opera.com/articles/view/an-introduction-to-webgl/) and [Tony Parisi's Introduction to WebGL at SFHTML5 Meetup](http://www.slideshare.net/auradeluxe/an-introduction-to-webgl-sfhtml5-talk-january-2014)

[Three.js](https://github.com/mrdoob/three.js#readme) ([Three Github repo](https://github.com/mrdoob/three.js))

Three.js is a lightweight 3D engine with a very low level of complexity — in a good way. The engine can render using <canvas>, <svg> and WebGL. This is some info on [how to get started](http://www.aerotwist.com/lab/getting-started-with-three-js/), which has a nice description of the elements in a scene. And here is the Three.js [API documentation](https://github.com/mrdoob/three.js/wiki/API-Reference). Three.js is also the most popular WebGL library in terms of number of users, so you can count on an enthusiastic community ([#three.js on irc.freenode.net](http://webchat.freenode.net/?channels=three.js)) to help you out if you get stuck with something.

[PhiloGL](http://senchalabs.github.com/philogl/) ([PhiloGL Github repo](https://github.com/senchalabs/philogl))

PhiloGL is built with a focus on JavaScript good practices and idioms. Its modules cover a number of categories from program and shader management to XHR, JSONP, effects, web workers and much more. There is an extensive set of [PhiloGL lessons](http://www.senchalabs.org/philogl/demos.html#lessons) that you can go through to get started. And the [PhiloGL documentation](http://senchalabs.github.com/philogl/doc/index.html) is pretty thorough too.

[GLGE](http://www.glge.org/) ([GLGE Github repo](https://github.com/supereggbert/GLGE))

GLGE has some more complex features, like skeletal animation and animated materials. You can find a list of GLGE features on their [project website](http://www.glge.org/about/). And here is a link to the [GLGE API documentation](http://www.glge.org/api-docs/).

[J3D](https://github.com/drojdjou/J3D#readme) ([J3D Github repo](https://github.com/drojdjou/J3D))

J3D allows you not only to create your own scenes but also to export scenes from [Unity](http://unity3d.com/) to WebGL. The [J3D "Hello cube" tutorial](https://github.com/drojdjou/J3D/wiki/How-to-create-a-cube) can help you get started. Also have a look at this [tutorial on how to export from Unity to J3D](https://github.com/drojdjou/J3D/wiki/Unity-exporter-tutorial).

[tQuery](http://jeromeetienne.github.io/tquery/) ([Github repo](https://github.com/jeromeetienne/tquery))

tQuery ( is a library that sits on top of Three.js and is meant as a lightweight content and extension creation tool. The author, Jerome Etienne has created several extensions to Three.js that are available on his Github repository ([https://github.com/jeromeetienne](https://github.com/jeromeetienne))

[SceneJS](http://scenejs.org/) ([Github repo](https://github.com/xeolabs/scenejs)

This library is an extensible WebGL-based engine for high-detail 3D visualisation using JavaScript.

[BabylonJS](http://www.babylonjs.com/) ([Github repo](https://github.com/BabylonJS/Babylon.js))

The library produces high quality animations. If your comfortable being limited to windows machines to create your libraries and customizations this may be the library for you.

[VoodooJS](http://www.voodoojs.com/) ([Github repo](https://github.com/brentongunning/voodoo))

Voodoo is designed to make it easier to intergrate 2D and 3D content in the same page.

Vizi ([Github repo](https://github.com/tparisi/Vizi))

The framework that got me interested in WebGL frameworks. Originally developed by Tony Parisi in conjunction with his book [Programming web 3D web applications with HTML5 and WebGL](http://shop.oreilly.com/product/0636920029205.do) it presents a component based view of WebGL development. It suffers from a lack of documentation (it has yet to hit a 1.0 release) but otherwise it's worth the learning curve.
