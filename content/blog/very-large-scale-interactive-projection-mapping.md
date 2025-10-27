---
title: Very Large-Scale Interactive Projection Mapping
date: 2025-12-15
tags:
  - Projection Mapping
  - Three.js
  - WebGL
youtube: true
---

The Unnumebered Sparks project is a landmark in large-scale interactive art installations. It demonstrated how web technologies could be harnessed to create immersive experiences that engage audiences in new ways.

The project is a combination of a large sculpture, and a web-based interactive system that allows users to add visual elements to the sculpture using their mobile devices. The entire system is built around the web browser as the rendering engine, showcasing the power and flexibility of web technologies.

This guide details how to build an immersive, interactive art piece where many people can use their phones to "paint with light" on a large physical object. We will build a system that closely emulates the architecture of the "Unnumbered Sparks" project, keeping the core principle of using a web browser as the rendering engine.

## Inspiration: Unnumbered Sparks

These videos provide the context for the project's scale, interactivity, and the underlying technology philosophy that we will follow.

The Making of Unnumbered Sparks:

<lite-youtube videoid="npjTmG-TBHQ"></lite-youtube>

The Technology Behind Unnumbered Sparks:

<lite-youtube videoid="6JGzPLZrVFU"></lite-youtube>

## The Complete Open-Source Stack

We will use a modular stack where each component is a robust, open-source tool perfectly suited for its task.

* **Rendering Engine**: Google Chrome running a JavaScript/TypeScript application with Three.js to create the visuals.
* **Backend Server**: Node.js with the ws library for real-time WebSocket communication.
* **Interaction Layer**: A simple HTML/JavaScript mobile-friendly website that acts as a controller.
* **Mapping & Compositing**: OBS Studio, a free and open-source broadcasting software, extended with a mapping plugin.
* **Hardware**: A powerful computer, a dedicated graphics card that can drive multiple displays, and two or more projectors.

The architecture hasn't been validated yet in a real-world installation, but it is based on well-known technologies and should be feasible for small to medium-scale projects.

### Step 1: The Visual Core (The Generative Web App)

This is the heart of your project. It's a web page that renders your visuals and listens for commands from the server.

Create a folder called `renderer-app`.

`renderer-app/index.html` sets up the canvas for our Three.js application.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Generative Renderer</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { margin: 0; overflow: hidden; background-color: #000; }
      canvas { display: block; }
    </style>
  </head>
  <body>
    <!-- Use renderer.js for the JavaScript version -->
    <script type="module" src="renderer.js"></script>

    <!-- For TypeScript, you would first compile renderer.ts to renderer.js -->
    <!-- <script type="module" src="dist/renderer.js"></script> -->

    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js"
        }
      }
    </script>
  </body>
</html>
```

The `renderer.ts` script creates a particle system and connects to our server to listen for interactive data. The Typescript example is provided below. You will need to compile it to JavaScript using a TypeScript compiler or bundler like Vite.

```ts
import * as THREE from 'three';

// -- SCENE SETUP --
const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 5;

// -- PARTICLE SYSTEM --
const particleCount: number = 5000;
const particles: THREE.BufferGeometry = new THREE.BufferGeometry();
const positions: Float32Array = new Float32Array(particleCount * 3);
const colors: Float32Array = new Float32Array(particleCount * 3);
const color: THREE.Color = new THREE.Color();

for (let i = 0; i < particleCount; i++) {
  const i3 = i * 3;
  positions[i3] = (Math.random() - 0.5) * 10;
  positions[i3 + 1] = (Math.random() - 0.5) * 10;
  positions[i3 + 2] = (Math.random() - 0.5) * 10;
  color.setHSL(Math.random(), 0.7, 0.5);
  colors[i3] = color.r;
  colors[i3 + 1] = color.g;
  colors[i3 + 2] = color.b;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial: THREE.PointsMaterial = new THREE.PointsMaterial({
  size: 0.1,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  transparent: true,
});

const particleSystem: THREE.Points = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

// -- ANIMATION LOOP --
function animate() {
  requestAnimationFrame(animate);
  particleSystem.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();

// -- WEBSOCKET CONNECTION --
const socket: WebSocket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  console.log('Connected to WebSocket server.');
  socket.send(JSON.stringify({ type: 'identify', role: 'renderer' }));
};

socket.onmessage = (event: MessageEvent) => {
  const data = JSON.parse(event.data);
  if (data.x) {
    particleSystem.rotation.y += data.x * 0.01;
    particleSystem.rotation.x += data.y * 0.01;
  }
};

socket.onclose = () => {
  console.log('Disconnected from WebSocket server. Retrying...');
  setTimeout(() => window.location.reload(), 2000);
};

// -- RESIZE HANDLER --
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### Step 2: The Backend Server (The Conductor)

This server is the central hub. It listens for connections from all the mobile controllers and the single renderer, and it forwards messages from the controllers to the renderer.

Create a new folder for the server. Inside, run npm init -y and then npm install `ws`. Create a file named server.js.

server/server.js

```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let rendererSocket = null;
const controllers = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    // Identify clients based on their role
    if (data.type === 'identify' && data.role === 'renderer') {
      console.log('Renderer identified');
      rendererSocket = ws;
      // Remove from controller list if it was there
      controllers.delete(ws);
    } else if (data.type === 'identify' && data.role === 'controller') {
      console.log('Controller identified');
      controllers.add(ws);
    } else {
      // If a renderer is connected, forward controller messages to it
      if (rendererSocket && controllers.has(ws)) {
        rendererSocket.send(JSON.stringify(data));
      }
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (ws === rendererSocket) {
      rendererSocket = null;
      console.log('Renderer disconnected');
    }
    controllers.delete(ws);
  });
});

console.log('WebSocket server started on port 8080');
```

### Step 3: The Interaction Layer (The Mobile Controller)

This is the simple webpage users will visit on their phones. It captures touch or mouse movement and sends it to the server.

Create a new folder named controller-app and place these two files inside.

controller-app/index.html

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Controller</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <style>
      body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; font-family: sans-serif; }
      #touch-area {
        width: 100%;
        height: 100%;
        background-color: #222;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 24px;
        text-align: center;
      }
      #status {
        position: absolute;
        top: 10px;
        left: 10px;
        color: #fff;
        background: rgba(0,0,0,0.5);
        padding: 5px;
        border-radius: 3px;
      }
    </style>
  </head>
  <body>
    <div id="touch-area">
      <p>Touch and Drag to Interact</p>
    </div>
    <div id="status">Connecting...</div>
    <script src="controller.js"></script>
  </body>
</html>
```

The `controller.js` handles touch and mosue events and sends normalized data to the server.

```js
const touchArea = document.getElementById('touch-area');
const statusDiv = document.getElementById('status');
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = () => {
  statusDiv.textContent = 'Connected';
  statusDiv.style.color = '#4CAF50';
  socket.send(JSON.stringify({ type: 'identify', role: 'controller' }));
};

socket.onclose = () => {
  statusDiv.textContent = 'Disconnected';
  statusDiv.style.color = '#F44336';
};

let lastX = 0;
let lastY = 0;
let isDragging = false;

function handleMove(clientX, clientY) {
  if (!isDragging) return;

  const deltaX = clientX - lastX;
  const deltaY = clientY - lastY;

  // Normalize data slightly
  const data = {
    x: deltaX / window.innerWidth * 2,
    y: deltaY / window.innerHeight * 2,
  };

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }

  lastX = clientX;
  lastY = clientY;
}

function handleStart(clientX, clientY) {
  isDragging = true;
  lastX = clientX;
  lastY = clientY;
}

function handleEnd() {
  isDragging = false;
}

// Mouse events
touchArea.addEventListener('mousedown', (e) => handleStart(e.clientX, e.clientY));
touchArea.addEventListener('mousemove', (e) => handleMove(e.clientX, e.clientY));
touchArea.addEventListener('mouseup', handleEnd);
touchArea.addEventListener('mouseleave', handleEnd);

// Touch events
touchArea.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY), { passive: false });
touchArea.addEventListener('touchmove', (e) => {
  e.preventDefault();
  handleMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: false });
touchArea.addEventListener('touchend', handleEnd);
```

### Step 4: The Physical Setup & Display Stitching

1. Hardware: You need a computer with a powerful graphics card (e.g., NVIDIA RTX or AMD Radeon series) that has enough video outputs for all your projectors.
2. Connect Projectors: Connect two or more projectors to your graphics card.
3. Stitch the Displays: Use your graphics card's driver software to create one single, large virtual display from all the projectors.
   - NVIDIA: Use "NVIDIA Surround" or "Mosaic."
   - AMD: Use "AMD Eyefinity."

The goal is for your operating system to see one giant monitor, not multiple separate ones.

### Step 5: Projection Mapping with OBS Studio

This is where we take the flat output from our Chrome browser and warp it to fit the contours of a real-world object.

Install OBS Studio: Download and install it from obsproject.com. It's free and open-source.

Install a Mapping Plugin: You need a plugin to handle the warping. A great open-source option is the OBS-Mesh-Warp-Filter. Download the latest release from its GitHub page and follow the installation instructions.

Set up OBS:

1. Open OBS and create a new Scene.
2. In the "Sources" panel, click the + button and add a "Browser" source.
   - In the properties for the Browser source, set the URL to the local file path of your renderer-app/index.html. Set the Width and Height to the total resolution of your stitched projector display.
3. Apply the Warp Filter:
   - Right-click on your new Browser source and select "Filters."
   - Click the + button under "Effect Filters" and add the "Mesh Warp" filter you installed.
   - A grid will appear. Click the "Edit Mesh" button. You can now drag the points of this grid.
4. Map Your Object:
   - Point your projectors at your physical object.
   - Drag the points of the mesh in the OBS filter until the output from your browser perfectly aligns with the shape of the object.
5. Project the Final Output:
   - Once you are happy with the map, right-click on the preview canvas in OBS and select "Fullscreen Projector (Source)" or "Fullscreen Projector (Preview)" and choose your stitched projector display.

### Variation: Projecting onto a Flat Surface (e.g., a Wall)

The guide above details how to map onto a complex, 3D object. However, if your target is a flat surface like a building facade or an indoor wall, the process becomes significantly simpler.

The core goal changes from complex 3D warping to simple keystone correction. Keystone correction is the process of adjusting the projected image to be a perfect rectangle, even if the projectors are angled up, down, or to the side of the surface.

Here’s what changes in the workflow:

* **No Code Changes Required**: Your renderer-app, server, and controller-app remain exactly the same. The simplification happens entirely within OBS.
* **Simpler Mapping in OBS**: While the Mesh Warp filter works, it's often overkill. You have simpler options:
  * Use the Four Corners: With the Mesh Warp filter, you only need to adjust the four main corner points of the grid. Drag each corner until the projected image forms a perfect rectangle on your wall.
  * Use OBS's Transform Tools: For basic keystone, you can right-click the Browser Source, go to Transform -> Edit Transform, and manually adjust the "Corner Pin" values. This gives you direct control over the four corners of the source.

Physical Placement is Key: With flat surfaces, spending extra time on the physical placement of your projectors can save you a lot of digital correction work. Try to get them as level and perpendicular to the wall as possible.

In short, projecting onto a flat surface simplifies Step 5 significantly, but the rest of the architecture for creating a large-scale interactive piece remains the same.

### Step 6: Running the Full System

These are the steps to get everything up and running:

1. Start the Server: Navigate to your server folder and run node server.js.
2. Start the Renderer: Open the renderer-app/index.html file in a fullscreen Google Chrome window on the display that OBS will be capturing.
3. Start OBS: Open your OBS project. It will capture the Chrome window and apply the warp map you created.
4. Go Fullscreen: Use the OBS "Fullscreen Projector" to send the final image to your projectors.
5. Connect Controllers: Have users navigate to the controller-app/index.html page on their mobile devices (hosted on a local network server).

You should now see the generative visuals from your browser, perfectly mapped onto your object, and reacting in real-time to input from multiple mobile phones.

## Conclusions And Future Enhancements

Creating large-scale interactive projection mapping installations is now more accessible using web technologies and open-source tools. With some creativity and technical know-how, you can build immersive experiences that engage audiences in new and exciting ways.

There are a few ways you could expand on this basic setup:

1. Rewrite the servers in steps 1 and 2 in Go for better performance and scalability.
2. Add more complex interactions, such as multi-touch gestures or accelerometer data from phones.
3. Add generative audio that reacts to the visuals and interactions.
