---
title: Digging Deeper into WebGPU
date: 2025-10-10
tags:
  - WebGPU
  - Graphics
  - Javascript
---

[WebGPU](https://www.w3.org/TR/webgpu/) is a new, modern API that exposes the capabilities of graphics hardware for the web. It is the successor to WebGL and is designed from the ground up to provide better performance, more predictable behavior, and access to advanced features of modern GPUs.

This post will look at WebGPU, what it is, how it fundamentally differs from WebGL, and provide practical examples of usage, both directly and through the [Three.js](https://threejs.org/) library.

## What is WebGPU?

WebGPU is a low-level API developed by the W3C [GPU for the Web Community Group](https://www.w3.org/community/gpu/), which includes major browser vendors like Apple, Google, Mozilla, and Microsoft. Its primary goal is to provide a safe, performant, and portable way to perform rendering and computation on a user's GPU directly from a web browser.

Unlike its predecessor, [WebGL](https://registry.khronos.org/webgl/specs/latest/1.0/), which was based on the [OpenGL ES](https://www.khronos.org/opengles/) 2.0/3.0 specifications, WebGPU is designed to be a better fit for modern GPU architectures. It takes inspiration from newer, lower-level graphics APIs like Vulkan, Metal, and Direct3D 12.

The key goals of WebGPU are:

* **Performance**: By reducing driver overhead and allowing for more work to be prepared on the CPU in parallel, WebGPU enables applications to better utilize the GPU, leading to higher frame rates and more complex scenes.
* **Modern Features**: It provides access to modern GPU features that are not available in WebGL, most notably GPU compute, which allows for general-purpose calculations to be run on the GPU.
* **Predictability**: WebGPU's design minimizes "surprise" performance costs. Much of the state validation and object preparation happens upfront, rather than at draw time, leading to more consistent performance.
* **Portability**: It is designed to run consistently across different operating systems (Windows, macOS, Linux, ChromeOS, Android) and browsers.

## WebGPU vs. WebGL: A Fundamental Shift

The move from WebGL to WebGPU is not just an incremental update; it's a paradigm shift.

| Feature | WebGL 1 & 2 | WebGPU |
| --- |--- | --- |
| API Style | A large, global state machine. You change states (e.g., bindBuffer, enable) that affect subsequent draw calls. | A stateless, object-oriented API. You pre-compile state into pipeline objects and then record command buffers. |
| Performance | Higher CPU overhead. The browser's graphics driver has to do more work at draw time to translate calls into what the GPU understands. | Lower CPU overhead. Much of the state validation and preparation is done upfront, leading to more efficient command submission. |
| Multithreading | Limited. Primarily single-threaded rendering, with some work possible in Web Workers with difficulty. | Designed for multithreading. Command buffers can be created in parallel across multiple Web Workers, which is ideal for complex scenes. |
| Shaders | GLSL (OpenGL Shading Language). | WGSL (WebGPU Shading Language). A new language with a well-defined, portable specification. |
| GPU Compute | Not a first-class citizen. Available in WebGL 2, but with limitations. | A core feature. Compute shaders are fully integrated, allowing for general-purpose GPU (GPGPU) tasks like physics simulations, machine learning, and complex image processing. |
| Error Handling | Errors are checked after calls using getError(), which can be slow and cumbersome. | Errors are reported asynchronously and do not block the rendering thread. The API provides robust validation upfront. |
| Developer Experience | Can be difficult to debug due to the global state. A small state change in one place can break rendering elsewhere. | More explicit and verbose, but easier to debug. Objects are immutable after creation, reducing unexpected side effects. |

## Core Concepts of WebGPU

WebGPU's API is more structured and explicit than WebGL's. Here are the core building blocks you'll interact with.

* **Adapter (`GPUAdapter`)**: Represents a specific physical GPU in the system.
* **Device (`GPUDevice`)**: Your primary logical interface to the GPU.
* **Command Encoder (`GPUCommandEncoder`) & Command Buffer (`GPUCommandBuffer`)**: Used to record and submit commands to the GPU queue.
* **Shaders & WGSL**: WebGPU's dedicated shading language, WGSL.
* **Pipeline State Object (`GPURenderPipeline` / `GPUComputePipeline`)**: A pre-compiled object that bundles rendering or compute state.
* **Bind Groups (`GPUBindGroup`)**: Defines a set of resources (buffers, textures) to be used by shaders.
* **Buffers (`GPUBuffer`)**: Memory storage on the GPU for vertex data, uniform data, etc.

## An Introduction to WGSL (WebGPU Shading Language)

At the heart of any GPU application are the shaders—small programs that run directly on the GPU. WebGPU introduces a brand new shading language: WGSL.

### What is WGSL and Why is it Important?

[WGSL](https://www.w3.org/TR/WGSL/) (pronounced "wig-sal") is a shading language specifically designed for WebGPU. Unlike WebGL, which used a web-friendly variant of GLSL, WGSL was created from scratch to be a core part of the WebGPU standard. This is crucial for several reasons:

* **Portability and Predictability**: WGSL has a single, well-defined specification. When you write WGSL code, you can be highly confident it will work identically across all browsers and platforms that support WebGPU. This eliminates the "write once, debug everywhere" problem that sometimes occurred with GLSL due to minor differences in driver implementations.
* **Security**: It's designed with the web's security model in mind, preventing access to out-of-bounds memory and other potential vulnerabilities.
* **Modern Syntax**: Its syntax is explicit and clear, mapping directly to modern GPU concepts and the WebGPU API itself.

### How is WGSL Different from GLSL?

If you're coming from WebGL, WGSL will look familiar but has key differences that make it more robust.

| Feature | GLSL (for WebGL) | WGSL |
| --- | --- | --- |
| Syntax | C-like syntax. Can be somewhat terse. | More modern syntax, inspired by languages like Rust and Swift. It is more verbose but also more explicit. |
| Type System | Loosely typed. Allows for implicit type conversions (`float(1)`). | Strongly and explicitly typed. `vec4<f32>(1.0, 1.0, 1.0, 1.0)` instead of `vec4(1.0)`. No implicit conversions, reducing bugs. |
| Resource Bindings | Bindings are managed via opaque location integers. `layout(location = 0) uniform mat4 view;` | Explicit resource binding model using attributes that map directly to the API. `@group(0) @binding(0) var<uniform> view: mat4x4<f32>;` |
| Entry Points | Functions are designated as entry points by convention (void main()). | Entry points for each stage are declared with an attribute: `@vertex`, `@fragment`, or `@compute`. |
| Built-in Variables | Special global variables like `gl_Position` and `gl_FragColor`. | Standardized, structured built-in variables accessed with an attribute: `@builtin(position)`. |
| Specification | Based on OpenGL ES, possible variations between browsers. | A single, formal W3C specification ensures consistency. |

WGSL's design makes shader code safer, more predictable, and easier to validate, which is a perfect fit for a modern, cross-platform web API.

## A Basic Render Shader Example

This simple shader draws a triangle where the color of each corner is passed in from a vertex buffer.

```glsl
// A struct to define the data we'll pass from the vertex
// shader to the fragment shader.
struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) color: vec4<f32>,
};

// The VERTEX SHADER entry point.
// It runs once for each vertex in the triangle.
@vertex
fn vs_main(
  @location(0) position: vec2<f32>,
  @location(1) color: vec4<f32>
) -> VertexOutput {
  var out: VertexOutput;
  out.clip_position = vec4<f32>(position, 0.0, 1.0);
  out.color = color;
  return out;
}

// The FRAGMENT SHADER entry point.
// It runs once for every pixel inside the triangle.
@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
  return in.color;
}
```

Explanation:

* `struct VertexOutput`: We explicitly define a struct to pass data between shader stages. This is clearer than GLSL's varying variables.
* `@builtin(position)`: This attribute marks the clip_position field as the special output that determines the vertex's final position on the screen.
* `@location(0)`: This attribute connects shader inputs/outputs. The vertex buffer providing color data at location(1) in the JavaScript API will feed into the color parameter here. The color output from the vertex shader at location(0) becomes the input for the fragment shader at the same location.
* `@vertex` and `@fragment`: These attributes clearly mark the entry point functions for each shader stage.
* `vec4<f32>`: Note the explicit type. WGSL requires you to specify the data type (f32 for 32-bit float) for vectors and matrices.

### A Basic Compute Shader Example

This shader takes an array of numbers and calculates the square of each number, writing the result to an output array.

```glsl
// Define a structure for our data.
struct Numbers {
  data: array<f32>,
};

// Define the resource bindings.
@group(0) @binding(0) var<storage, read> input_numbers: Numbers;
@group(0) @binding(1) var<storage, read_write> output_numbers: Numbers;

// The COMPUTE SHADER entry point.
@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
  let index = global_id.x;

  let value = input_numbers.data[index];
  output_numbers.data[index] = value * value;
}
```

Explanation:

* `var<storage, read>`: Declares a buffer (input_numbers) that is read-only.
* `var<storage, read_write>`: Declares a buffer (output_numbers) that the shader can write to.
* `@group(0) @binding(0)`: These attributes specify the exact binding point for each resource, matching what you define in the GPUBindGroup in your JavaScript code. This explicit binding is a core feature of modern graphics APIs.
* `@compute @workgroup_size(64)`: Marks the function as a compute shader entry point and specifies that the GPU should run this shader in groups of 64 invocations (threads).
* `@builtin(global_invocation_id)`: This provides a unique ID for each invocation. We use its x component as the index to ensure that each thread processes a different number from the arrays.

## High-Performance Parallelism: WebGPU and Web Workers

One of WebGPU's design goals was to excel at multithreading. In complex applications, performing all CPU-side logic for rendering on the main thread can lead to stuttering and a frozen UI. Web Workers provide a solution by allowing you to run scripts in background threads.

### The Multi-threaded Rendering Pattern

WebGPU is designed to work seamlessly with Web Workers. The key is that most WebGPU objects are transferable, meaning they can be passed between the main thread and a worker thread with near-zero cost.

However, there's one critical exception: the canvas context. The object that lets you draw to the screen can only be accessed from the main thread. This leads to a powerful and common pattern:

Main Thread:

1. Initializes WebGPU and gets the GPUDevice.
2. Gets the GPUCanvasContext from an on-screen &lt;canvas&gt;.
3. Creates one or more Web Workers.
4. Transfers a handle to the GPUDevice to the worker(s) using postMessage.

Worker Thread(s):

1. Receives the GPUDevice handle.
2. Performs all the heavy lifting: creates pipelines, manages buffers and textures, builds bind groups, and, most importantly, encodes all rendering commands into a GPUCommandBuffer.
3. Transfers the completed GPUCommandBuffer back to the main thread.

Main Thread (again):

1. Receives the command buffer from the worker.
2. Submits it to the `GPUDevice.queue`.

This architecture keeps the main thread free to handle user input and other UI tasks, resulting in a smooth, responsive application, even when the rendering work is complex.

Code Snippet (Conceptual):

```js
// main.js
const worker = new Worker('renderer.js');
const device = await adapter.requestDevice();
// GPUDevice is NOT transferable, but its underlying handle is.
// The browser handles this automatically.
worker.postMessage({ type: 'init', device });

worker.onmessage = (e) => {
    // 4. Receive command buffer and submit
    const { commandBuffer } = e.data;
    device.queue.submit([commandBuffer]);
};
```

renderer.js in a Web Worker

```js
onmessage = (e) => {
    if (e.data.type === 'init') {
        const { device } = e.data;
        // 2. Do all heavy work here...
        const commandEncoder = device.createCommandEncoder();
        // ...record render passes...
        const commandBuffer = commandEncoder.finish();

        // 3. Transfer command buffer back
        postMessage({ commandBuffer }, [commandBuffer]);
    }
};
```

## Unlocking the GPU: An Introduction to Compute Shaders

One of the most powerful features of WebGPU is its first-class support for compute shaders. While graphics pipelines (vertex and fragment shaders) are designed to draw pixels to a screen, compute shaders are for general-purpose computation. They allow you to run highly parallel calculations on the GPU for tasks that have nothing to do with rendering triangles.

### How Do They Work?

A compute shader runs independently of the rendering pipeline. Instead of processing vertices and pixels, it processes a generic "work grid." You tell the GPU to dispatch a certain number of workgroups, and each workgroup runs in parallel, executing the same code. This is perfect for problems that can be broken down into many small, identical, and independent tasks.

* **Input/Output**: Instead of outputting a color to a pixel, compute shaders typically read from and write to arbitrary data in GPU buffers (GPUBuffer). This allows them to transform large datasets efficiently.
* **Use Cases**: The possibilities are vast: physics simulations, complex image processing, scientific computing, and, notably, machine learning.

## WebGPU for Machine Learning: High-Speed Inference in the Browser

WebGPU is poised to revolutionize machine learning in the browser. Modern AI models, especially deep neural networks, rely on a massive number of matrix and vector calculations. These are exactly the kinds of highly parallel tasks that GPUs are designed to accelerate.

### Why WebGPU is a Game-Changer for Browser AI

* **Performance**: By leveraging the GPU directly with a modern, low-overhead API, WebGPU allows for ML model inference (the process of making predictions) to run many times faster than on the CPU with traditional JavaScript. This enables real-time applications like object detection in video streams, live style transfer, and complex natural language processing.
* **Privacy & Accessibility**: Running models directly in the browser means user data never has to be sent to a server, which is a major win for privacy. It also lowers the barrier to entry, as no complex server-side infrastructure is needed.
* **Efficiency**: Compute shaders are the perfect tool for the job. Operations at the core of neural networks, like matrix multiplications, can be mapped directly to compute shader workgroups.

### The Core Operation: Matrix Multiplication

The foundation of most neural network layers is the matrix multiplication (MatMul). To build an ML application, you first need an efficient way to compute `C = A * B`, where A, B, and C are large matrices.

Here's how we can implement this with a WebGPU compute shader:

* **Store Data**: We represent the matrices as Float32Arrays and store them in GPUBuffers.
* **Write a WGSL Shader**: The compute shader will have one thread (or "invocation") responsible for calculating a single cell in the output matrix C.
* **Dispatch Work**: We'll dispatch a grid of workgroups that matches the dimensions of the output matrix. For a M x N output matrix, we'd dispatch M * N total threads.

The following example demonstrates this foundational operation. While real-world ML libraries like TensorFlow.js (with its WebGPU backend) abstract this away, understanding this core concept is key to grasping how in-browser AI works at a low level.

### How ML Libraries Use WebGPU: The TensorFlow.js Backend

While writing raw WGSL and WebGPU code gives you maximum control, it's also very verbose. This is where high-level libraries like TensorFlow.js come in. TensorFlow.js provides a simple, declarative API for building and running ML models, and it uses different "backends" to execute the actual computations.

A backend is the underlying engine that performs the calculations. TensorFlow.js has several:

* **cpu**: Runs operations on the CPU using standard JavaScript. It's the most compatible but also the slowest.
* **webgl**: Uses the WebGL API to run operations on the GPU. For a long time, this was the standard for high-performance browser ML.
* **webgpu**: The newest and most performant backend, which leverages WebGPU for computation.

When you write code like `tf.matMul(a, b)`, you aren't writing the matrix multiplication logic yourself. Instead, TensorFlow.js takes this high-level command and translates it into an optimized routine for the currently active backend.

If the WebGPU backend is active, here's what happens under the hood:

* **Operation to Shader Mapping**: TensorFlow.js has a pre-written, highly optimized WGSL compute shader specifically for matrix multiplication (and hundreds of other operations like convolutions, activations, etc.).
* **Data Management**: It automatically manages GPUBuffer creation. Your input tensors (a and b) are uploaded to storage buffers. An output buffer is created for the result.
* **Pipeline & Dispatch**: It configures and caches a GPUComputePipeline for the operation. It then creates the necessary bind groups, records a command buffer with the correct dispatchWorkgroups call, and submits it to the GPU queue.
* **Result Retrieval**: When you need the result back on the CPU (e.g., to print it), TensorFlow.js handles the asynchronous process of reading the data back from the GPU buffer.

Essentially, libraries like TensorFlow.js act as a powerful abstraction layer, giving you the ease-of-use of a high-level API with the near-native performance of WebGPU, without you ever having to write a single line of WGSL or manually create a GPU pipeline.

## Examples

The following files provide examples for a high-level library (Three.js), a raw graphics pipeline, a raw compute pipeline, and a machine learning application.

The examples are included as full HTML files that can be run directly in a browser that supports WebGPU (like the latest versions of Chrome or Edge). If WebGPU is not available, an error message will be displayed.

The examples include only the relevant code for WebGPU usage along with links to the full working example and source code.

### Raw WebGPU: The "Hello Triangle"

The first example shows how to render a simple triangle using raw WebGPU API calls. It includes shader code written in WGSL and demonstrates the fundamental steps of setting up a WebGPU rendering pipeline.

Even for people coming from a WebGL background, the verbosity and explicitness of WebGPU can be surprising. However, this example covers all the essential steps: initializing WebGPU, creating buffers, writing shaders, setting up a pipeline, and issuing draw calls.

```js
async function main() {
  if (!navigator.gpu) {
    document.getElementById('error').style.display = 'block';
    throw new Error("WebGPU not supported on this browser.");
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) { throw new Error("No appropriate GPUAdapter found."); }
  const device = await adapter.requestDevice();
  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('webgpu');
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format: presentationFormat, alphaMode: 'premultiplied' });
  const positions = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);
  const colors = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);
  const positionBuffer = device.createBuffer({
    size: positions.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(positionBuffer.getMappedRange()).set(positions);
  positionBuffer.unmap();
  const colorBuffer = device.createBuffer({
    size: colors.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Float32Array(colorBuffer.getMappedRange()).set(colors);
  colorBuffer.unmap();
  const shaderModule = device.createShaderModule({
    code: `
      struct VertexOutput { @builtin(position) position : vec4<f32>, @location(0) color : vec3<f32> };
      @vertex fn vs_main(@location(0) in_pos : vec2<f32>, @location(1) in_color : vec3<f32>) -> VertexOutput {
        var out : VertexOutput;
        out.position = vec4<f32>(in_pos, 0.0, 1.0);
        out.color = in_color;
        return out;
      }
      @fragment fn fs_main(in : VertexOutput) -> @location(0) vec4<f32> { return vec4<f32>(in.color, 1.0); }
    `,
  });
  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module: shaderModule,
      entryPoint: 'vs_main',
      buffers: [
        { arrayStride: 2 * 4, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }] },
        { arrayStride: 3 * 4, attributes: [{ shaderLocation: 1, offset: 0, format: 'float32x3' }] },
      ],
    },
    fragment: { module: shaderModule, entryPoint: 'fs_main', targets: [{ format: presentationFormat }] },
    primitive: { topology: 'triangle-list' },
  });
  function frame() {
    const textureView = context.getCurrentTexture().createView();
    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [{ view: textureView, clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1.0 }, loadOp: 'clear', storeOp: 'store' }],
    });
    passEncoder.setPipeline(pipeline);
    passEncoder.setVertexBuffer(0, positionBuffer);
    passEncoder.setVertexBuffer(1, colorBuffer);
    passEncoder.draw(3, 1, 0, 0);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }
  frame();
}
main().catch(err => {
  console.error(err);
  document.getElementById('error').style.display = 'block';
  document.querySelector('#error p').textContent = err.message;
});
```

* Source code: [https://github.com/caraya/webgpu-demos/blob/main/webgl/index.html](https://github.com/caraya/webgpu-demos/blob/main/webgl/index.html)
* Working Example: [https://webgpu-demos.rivendellweb.net/webgl/](https://webgpu-demos.rivendellweb.net/webgl/)

### WebGPU with Three.js

Rather than writing raw WebGPU code, you can also use high-level libraries like [Babylon.js](https://www.babylonjs.com/) or [Three.js](https://threejs.org/) that abstract away much of the boilerplate.

The following example uses Three.js's WebGPU renderer to display a rotating cube.

```js
import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu';

// --- Core Scene Setup ---
let camera, scene, renderer, mesh;

async function init() {
  // 1. Check for WebGPU availability.
  if (!navigator.gpu) {
    document.getElementById('error').style.display = 'block';
    console.error("WebGPU not supported on this browser.");
    return;
  }

  // 2. Scene and Camera (Standard Three.js setup)
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
  camera.position.z = 3;

  // 3. Geometry and Material (Standard Three.js setup)
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // Use a standard material. Three.js automatically converts it to a WGSL shader.
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.5, roughness: 0.5 });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Add some lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(2, 3, 4);
  scene.add(pointLight);

  // 4. The WebGPU Renderer
  // Instead of new THREE.WebGLRenderer(), we use new WebGPURenderer().
  renderer = new WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // The init() method on the renderer is asynchronous because setting up
  // a WebGPU device can take time. We must wait for it to complete.
  await renderer.init();

  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', onWindowResize);

  // Start the animation loop
  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  // The renderer's animation loop manages the render calls internally.
  renderer.setAnimationLoop(render);
}

function render() {
  // Simple animation
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.01;

  // The renderer handles the command encoding and submission to the GPU queue.
  renderer.render(scene, camera);
}

// Start the application
init();
```

* Source code: [https://github.com/caraya/webgpu-demos/blob/main/threejs/cube.html](https://github.com/caraya/webgpu-demos/blob/main/threejs/cube.html)
* Working Example: [https://webgpu-demos.rivendellweb.net/threejs/cube.html](https://webgpu-demos.rivendellweb.net/threejs/cube.html)

### Compute Shader Example: Particle Simulation

This example showcases the power of WebGPU's compute shaders to simulate and render a large number of particles efficiently. The key idea is to do all the heavy lifting on the GPU.

This version uses a "ping-pong" or double-buffering technique to avoid synchronization hazards. We use two particle buffers; in each frame, the compute shader reads from one and writes the updated positions to the other. The render pass then reads from the buffer that was just written to.

1. COMPUTE STAGE:
    1. A compute shader (`compute_main`) is dispatched.
    2. It reads particle data from an input buffer (`particlesIn`).
    3. It calculates the new position and writes it to an output buffer (`particlesOut`).
2. RENDER STAGE:
    1. A standard render pipeline is dispatched.
    2. Its vertex buffer is set to the buffer that was the *output* of the compute stage.
    3. By swapping which buffer is the input and which is the output each frame, we ensure the render
    stage always has a complete, stable set of data to draw from.

```js
async function main() {
    if (!navigator.gpu) {
        document.getElementById('error').style.display = 'block';
        throw new Error("WebGPU not supported");
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("No adapter found");
    const device = await adapter.requestDevice();
    const canvas = document.querySelector("canvas");
    const context = canvas.getContext("webgpu");
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            const { width, height } = entry.contentRect;
            canvas.width = Math.max(1, Math.min(width, device.limits.maxTextureDimension2D));
            canvas.height = Math.max(1, Math.min(height, device.limits.maxTextureDimension2D));
        }
    });
    observer.observe(canvas);
    context.configure({ device, format: canvasFormat, alphaMode: 'premultiplied' });
    const NUM_PARTICLES = 500000;
    const particleData = new Float32Array(NUM_PARTICLES * 4);
    for (let i = 0; i < NUM_PARTICLES; i++) {
        const idx = i * 4;
        particleData[idx] = Math.random() * 2 - 1; // position x
        particleData[idx + 1] = Math.random() * 2 - 1; // position y
        particleData[idx + 2] = (Math.random() - 0.5) * 0.01; // velocity x
        particleData[idx + 3] = (Math.random() - 0.5) * 0.01; // velocity y
    }

    const particleBuffers = new Array(2);
    for (let i = 0; i < 2; i++) {
        particleBuffers[i] = device.createBuffer({
            size: particleData.byteLength,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });
    }
    device.queue.writeBuffer(particleBuffers[0], 0, particleData);

    const uniforms = new Float32Array([canvas.width, canvas.height]);
    const uniformBuffer = device.createBuffer({
        size: uniforms.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(uniformBuffer, 0, uniforms);

    const wgslShaders = `
        struct Particle { pos: vec2<f32>, vel: vec2<f32> };
        struct Uniforms { screen_dim: vec2<f32> };

        @group(0) @binding(0) var<storage, read> particlesIn: array<Particle>;
        @group(0) @binding(1) var<storage, read_write> particlesOut: array<Particle>;

        @group(1) @binding(0) var<uniform> uniforms: Uniforms;

        @compute @workgroup_size(64)
        fn compute_main(@builtin(global_invocation_id) global_id: vec3<u32>) {
            let index = global_id.x;
            var p = particlesIn[index];
            p.pos += p.vel;
            if (p.pos.x > 1.0) { p.pos.x = -1.0; } else if (p.pos.x < -1.0) { p.pos.x = 1.0; }
            if (p.pos.y > 1.0) { p.pos.y = -1.0; } else if (p.pos.y < -1.0) { p.pos.y = 1.0; }
            particlesOut[index] = p;
        }
        @vertex fn vs_main(@location(0) in_pos: vec2<f32>) -> @builtin(position) vec4<f32> {
            let ratio = uniforms.screen_dim.x / uniforms.screen_dim.y;
            return vec4<f32>(in_pos.x / ratio, in_pos.y, 0.0, 1.0);
        }
        @fragment fn fs_main() -> @location(0) vec4<f32> { return vec4<f32>(0.1, 0.4, 1.0, 0.5); }
    `;
    const shaderModule = device.createShaderModule({ code: wgslShaders });

    // --- SEPARATE LAYOUTS AND BIND GROUPS ---
    const computeBindGroupLayout = device.createBindGroupLayout({
        entries: [
            { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
            { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
        ]
    });

    const renderBindGroupLayout = device.createBindGroupLayout({
        entries: [
            { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' } }
        ]
    });

    const computePipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [computeBindGroupLayout] });
    const renderPipelineLayout = device.createPipelineLayout({ bindGroupLayouts: [ , renderBindGroupLayout] }); // The comma creates an empty slot at index 0

    const computeBindGroups = new Array(2);
    for (let i = 0; i < 2; i++) {
        computeBindGroups[i] = device.createBindGroup({
            layout: computeBindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: particleBuffers[i] } },
                { binding: 1, resource: { buffer: particleBuffers[(i + 1) % 2] } },
            ],
        });
    }

    const renderBindGroup = device.createBindGroup({
        layout: renderBindGroupLayout,
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    const computePipeline = device.createComputePipeline({
        layout: computePipelineLayout,
        compute: { module: shaderModule, entryPoint: 'compute_main' },
    });

    const renderPipeline = device.createRenderPipeline({
        layout: renderPipelineLayout,
        vertex: {
            module: shaderModule,
            entryPoint: 'vs_main',
            buffers: [{ arrayStride: 4 * 4, attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }] }],
        },
        fragment: {
            module: shaderModule, entryPoint: 'fs_main',
            targets: [{ format: canvasFormat, blend: { color: { operation: 'add', srcFactor: 'one', dstFactor: 'one' }, alpha: { operation: 'add', srcFactor: 'one', dstFactor: 'one' } } }],
        },
        primitive: { topology: 'point-list' },
    });

    let frameCount = 0;
    function frame() {
        device.queue.writeBuffer(uniformBuffer, 0, new Float32Array([canvas.width, canvas.height]));
        const commandEncoder = device.createCommandEncoder();

        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, computeBindGroups[frameCount % 2]);
        computePass.dispatchWorkgroups(Math.ceil(NUM_PARTICLES / 64));
        computePass.end();

        const textureView = context.getCurrentTexture().createView();
        const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{ view: textureView, loadOp: 'clear', clearValue: { r: 0, g: 0, b: 0, a: 1 }, storeOp: 'store' }],
        });
        renderPass.setPipeline(renderPipeline);
        renderPass.setBindGroup(1, renderBindGroup); // Set the bind group at index 1 to match the shader
        renderPass.setVertexBuffer(0, particleBuffers[(frameCount + 1) % 2]); // Use the output buffer from the compute pass
        renderPass.draw(NUM_PARTICLES);
        renderPass.end();

        device.queue.submit([commandEncoder.finish()]);

        frameCount++;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
main().catch(err => console.error(err));
```

* Source code: [https://github.com/caraya/webgpu-demos/blob/main/webgpu-raw-compute/particles.html](https://github.com/caraya/webgpu-demos/blob/main/webgpu-raw-compute/particles.html)
* Working Example: [https://webgpu-demos.rivendellweb.net/webgpu-raw-compute/particles.html](https://webgpu-demos.rivendellweb.net/webgpu-raw-compute/particles.html)

### Machine Learning Example: Matrix Multiplication

You can also use compute shaders for machine learning tasks. The following example demonstrates a simple matrix multiplication operation using a WebGPU compute shader.

```js
async function main() {
  // 1. Setup
  if (!navigator.gpu) {
      document.getElementById('error').style.display = 'block';
      throw new Error("WebGPU not supported");
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error("No adapter found");
  const device = await adapter.requestDevice();

  // 2. Data and Buffers
  const matrixA = new Float32Array([ 1, 2, 3, 4, 5, 6 ]);
  const dimsA = new Int32Array([2, 3]);
  const matrixB = new Float32Array([ 7, 8, 9, 10, 11, 12 ]);
  const dimsB = new Int32Array([3, 2]);

  const bufferA = device.createBuffer({
      size: matrixA.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
  });
  new Float32Array(bufferA.getMappedRange()).set(matrixA);
  bufferA.unmap();

  const bufferB = device.createBuffer({
      size: matrixB.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
  });
  new Float32Array(bufferB.getMappedRange()).set(matrixB);
  bufferB.unmap();

  const resultMatrixBufferSize = dimsA[0] * dimsB[1] * Float32Array.BYTES_PER_ELEMENT;
  const resultBuffer = device.createBuffer({
      size: resultMatrixBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  });

  const dimsBuffer = device.createBuffer({
    size: (2 + 2) * Int32Array.BYTES_PER_ELEMENT,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  });
  new Int32Array(dimsBuffer.getMappedRange()).set([...dimsA, ...dimsB]);
  dimsBuffer.unmap();

  // 3. WGSL Compute Shader
  const wgslCode = `
    struct Matrix { data: array<f32>, };
    @group(0) @binding(0) var<storage, read> matrixA: Matrix;
    @group(0) @binding(1) var<storage, read> matrixB: Matrix;
    @group(0) @binding(2) var<storage, read_write> matrixC: Matrix;
    struct Dims { m: i32, k: i32, k_b: i32, n: i32, };
    @group(0) @binding(3) var<uniform> dims: Dims;

    @compute @workgroup_size(8, 8)
    fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
      let row = global_id.x;
      let col = global_id.y;
      if (row >= u32(dims.m) || col >= u32(dims.n)) { return; }
      var sum = 0.0;
      for (var i = 0u; i < u32(dims.k); i = i + 1u) {
        let a_index = row * u32(dims.k) + i;
        let b_index = i * u32(dims.n) + col;
        sum = sum + matrixA.data[a_index] * matrixB.data[b_index];
      }
      matrixC.data[row * u32(dims.n) + col] = sum;
    }
  `;
  const shaderModule = device.createShaderModule({ code: wgslCode });

  // 4. Pipeline and Bind Group
  const computePipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: shaderModule, entryPoint: 'main' },
  });

  const bindGroup = device.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
          { binding: 0, resource: { buffer: bufferA } },
          { binding: 1, resource: { buffer: bufferB } },
          { binding: 2, resource: { buffer: resultBuffer } },
          { binding: 3, resource: { buffer: dimsBuffer } },
      ],
  });

  // 5. Command Execution
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(computePipeline);
  passEncoder.setBindGroup(0, bindGroup);
  const workgroupCountX = Math.ceil(dimsA[0] / 8);
  const workgroupCountY = Math.ceil(dimsB[1] / 8);
  passEncoder.dispatchWorkgroups(workgroupCountX, workgroupCountY);
  passEncoder.end();

  // 6. Readback result
  const readbackBuffer = device.createBuffer({
      size: resultMatrixBufferSize,
      usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  });
  commandEncoder.copyBufferToBuffer(resultBuffer, 0, readbackBuffer, 0, resultMatrixBufferSize);
  device.queue.submit([commandEncoder.finish()]);
  await readbackBuffer.mapAsync(GPUMapMode.READ);
  const result = new Float32Array(readbackBuffer.getMappedRange());

  // 7. Display Results
  document.getElementById('matrixA').textContent = `[${matrixA.slice(0, 3).join(', ')}]\n[${matrixA.slice(3, 6).join(', ')}]`;
  document.getElementById('matrixB').textContent = `[${matrixB[0]}, ${matrixB[1]}]\n[${matrixB[2]}, ${matrixB[3]}]\n[${matrixB[4]}, ${matrixB[5]}]`;
  document.getElementById('matrixC').textContent = `[${result[0]}, ${result[1]}]\n[${result[2]}, ${result[3]}]`;

  readbackBuffer.unmap();
}

main().catch(err => {
    console.error(err);
    document.getElementById('error').style.display = 'block';
});
```

* Source code: [https://github.com/caraya/webgpu-demos/blob/main/webgpu-raw-compute/matrices.html](https://github.com/caraya/webgpu-demos/blob/main/webgpu-raw-compute/matrices.html)
* Working Example: [https://webgpu-demos.rivendellweb.net/webgpu-raw-compute/matrices.html](https://webgpu-demos.rivendellweb.net/webgpu-raw-compute/matrices.html)

## Conclusion

WebGPU represents a major improvement in high-performance graphics and computation on the web. While its API is more verbose and lower-level than WebGL, it provides the power, predictability, and performance that modern web applications demand. Whether you're building complex 3D games, data visualizations, running physics simulations with compute shaders, or creating in-browser machine learning applications, WebGPU unlocks a new frontier of possibilities. As libraries like Three.js continue to build robust support for it, we expect its adoption to grow rapidly, making it a cornerstone of the modern web platform.
