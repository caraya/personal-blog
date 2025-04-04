---
title: WebGPU
date: 2025-04-09
tags:
  - Web
  - Graphics
  - API
  - Javascript
baseline: true
---

This post will cover my research on the WebGPU API.

WebGPU is a lower level API that will work with underlying native GPU APIs like Vulkan (Khronos Group), Metal (Apple), and Direct3D 12 (Microsoft), providing a unified and efficient way for web developers to utilize GPU capabilities.

There is no relationship between WebGPU and the previous WebGL APIs, which targeted different OpenGL specifications.

WebGPU provides access to non-graphical computation tasks through compute shaders, which can be used for general-purpose computing tasks that can benefit from parallel processing.

## Differences with WebGL

The following sections will compare WebGL and WebGPU in terms of API design, performance characteristics, support for compute shaders, and browser compatibility.

### API Design and Ease of Use

WebGL and WebGPU were designed with different goals in mind and were designed at different points of the history of the web.

WebGL API Design
: WebGL is essentially a JavaScript binding to [OpenGL ES](https://en.wikipedia.org/wiki/OpenGL_ES) (2.0 for WebGL1, 3.0 for WebGL2). It uses a stateful design inherited from OpenGL &mdash; a large internal global state machine that the developer manipulates through function calls. You create and bind GPU resources (buffers, textures, shaders) to this global state and issue draw calls. The order of calls is critical due to the global state, which can make complex applications harder to manage.
: WebGL shaders are written in [OpenGL Shading Language](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language) (GLSL), a C-like language. Overall, WebGL’s API is low-level and verbose, but it is a proven standard and well-supported by many frameworks (e.g., Three.js, Babylon.js) that simplify usage.

WebGPU API Design
: WebGPU is a modern explicit API inspired by [Vulkan](https://www.vulkan.org/), [Metal](https://developer.apple.com/metal/), and [Direct3D 12](https://learn.microsoft.com/en-us/windows/win32/direct3d12/what-is-directx-12-), with its own abstractions (adapters, devices, pipelines, bind groups, etc.) to provide a “web-friendly” layer over modern graphics backends
: WebGPU uses [WebGPU Shading Language](https://www.w3.org/TR/WGSL/) (WGSL) for its shader code, which has a syntax reminiscent of Rust and is designed for safety and portability​
: Unlike WebGL’s global state machine, WebGPU uses immutable objects (e.g., pipeline state objects) and command encoders, reducing hidden state. Many validations are done up-front (during pipeline creation or command encoding) rather than at draw time, catching errors early and potentially improving runtime performance.
: WebGPU’s design requires more boilerplate setup (creating a graphics pipeline object before drawing, explicitly configuring a canvas context), but it leads to a more structured and predictable development process. Developers now manage resources via bind groups and explicit passes, which can make it easier to reason about in large applications.

### Ease of Use

Out of the box, WebGL might feel simpler to get something on screen because its immediate-mode style lets you issue draw calls directly after setting state. However, as complexity grows, managing WebGL’s state can become cumbersome (order of operations, enabling/disabling states, etc.).

WebGPU’s explicit model has a higher learning curve initially (and the API is considered “verbose”), but it imposes a clean structure that can scale better for complex apps. Many developers find WebGPU’s approach more comfortable once learned. However, since WebGPU is newer, tooling and community examples are still catching up, whereas WebGL enjoys a decade of tutorials and libraries. Abstraction libraries (like Three.js and Babylon.js) will likely hide much of WebGPU’s boilerplate in the future.

### Performance Characteristics

WebGL Performance
: WebGL was revolutionary for bringing GPU rendering to the web, but it has some limitations by modern standards. It operates as a thin layer over older GPU APIs (OpenGL ES), which means it doesn’t natively utilize some newer GPU features. WebGL runs all rendering commands on a single thread (the main thread in JavaScript). While it allows thousands of draw calls and can achieve high frame rates, the CPU overhead of issuing draw calls and state changes can become a bottleneck for very large or complex scenes.

WebGPU Performance
: WebGPU is designed for efficiency and to take advantage of modern GPU architectures. It can significantly reduce CPU overhead by batching work. For example, with command encoders and GPU command buffers, you prepare a sequence of GPU operations and then submit them in one go, rather than many individual JavaScript calls. WebGPU also better leverages multi-core CPUs: in the future, multiple threads (e.g., Web Workers) could record commands or operate on different GPUDevice instances in parallel, since the API avoids global state and locking (WebGPU’s design explicitly considers multi-threading). Additionally, WebGPU’s pipeline objects encapsulate state, so switching between different rendering configurations is faster (less validation work at draw time). In practice, early demos have shown lower CPU usage for the same graphics workload in WebGPU compared to WebGL. For instance, a complex 3D scene that maxes out a CPU thread in WebGL might use far less CPU time in WebGPU, making it easier to maintain high frame rates
: On the GPU side, WebGPU can unlock performance features that WebGL can’t easily access: for example, explicit control over the swap chain format, more optimal memory barriers, and direct compute dispatch. This can translate to higher throughput if used properly. It’s worth noting that raw GPU rendering throughput (rasterizing triangles, etc.) might be similar between WebGL and WebGPU for simple content &mdash; after all, they ultimately use the same hardware. The gains from WebGPU come from better CPU-GPU coordination, ability to utilize parallelism, and doing more on the GPU (moving tasks from CPU to GPU via compute shaders, etc.)

## Parallelism and Efficiency

WebGPU supports more advanced parallelism patterns than WebGL. A WebGPU application can have multiple command buffers in flight and can utilize multiple CPU cores to prepare GPU work. Also, because WebGPU supports asynchronous shader compilation and pipeline creation (returning promises), apps can load and compile shaders in parallel with other work. WebGL, in contrast, tends to compile shaders synchronously on the main thread (which can cause jank if a shader is complex). Furthermore, WebGPU’s design encourages using bind groups to bind many resources at once, instead of many incremental gl.uniform or gl.bindTexture calls, reducing function call overhead.

Well-optimized WebGPU apps can reduce CPU overhead and better saturate the GPU. Real-world comparisons show that for scenes with heavy draw-call counts or lots of GPU computation, WebGPU can achieve higher or more stable frame rates by freeing up CPU time

Initial WebGPU implementations might not always outperform a highly optimized WebGL engine for every case. As WebGPU drivers and best practices improve, it is expected to outperform WebGL in virtually all GPU-intensive scenarios.

### Support for Compute Shaders

One of the biggest differences between WebGL and WebGPU is support for compute shaders (general-purpose GPU computing):

WebGL
: WebGL was originally built for graphics (vertex and fragment shaders only). It does not natively support compute shaders. The WebGL 2.0 spec added some features like transform feedback and multiple render targets that enable limited GPU-style computing (one can abuse fragment shaders to perform computations on textures, or use vertex shaders with transform feedback to compute results into a buffer). These are workarounds and lack the full flexibility of a true compute shader model (no shared thread group memory, no arbitrary data writes to buffers, etc.).

WebGPU
: WebGPU has first-class support for compute shaders and GPU compute pipelines. It allows dispatching compute tasks with `GPUComputePipeline` and `dispatchWorkgroups` calls, similar to technologies like CUDA or DirectX’s DirectCompute but in a web-safe API. This means a WebGPU application can perform general computations on the GPU without producing any graphics at all. The shading language WGSL includes the `@compute` attribute to define compute shader entry points, and it supports typical compute shader features like groups of parallel threads (workgroups), shared local memory, atomic operations, etc. WebGPU thus unlocks the GPU for a whole class of algorithms that were awkward or impossible with WebGL.

If your application needs GPU computing beyond drawing pixels (for example, training/running neural networks in the browser, or computing complex transformations on large datasets), WebGPU is the clear choice. WebGL simply wasn’t designed for this, and while it can be coaxed into doing some GPGPU work, it’s limited and inefficient for that purpose.

### What it matters and use cases

Both APIs enable rich visuals and GPU computing in the browser, but their typical use cases differ given their capabilities:

WebGL Use Cases: WebGL is used for virtually all kinds of interactive 2D and 3D graphics on the web today. Common examples include:

* **3D Graphics and Games**: WebGL can render 3D scenes with lighting, shadows, and textures, enabling browser games and VR/AR experiences (via WebXR)
  * Libraries like Three.js and Babylon.js have powered countless demos, games, and apps using WebGL
* **Data Visualization**: WebGL is used in scientific and financial visualization (e.g., WebGL-powered charting libraries, globe and map rendering like Cesium for 3D maps, point cloud viewers, etc.) where it can render large datasets efficiently
* **2D Rendering and Effects**: Even for 2D, WebGL is used under the hood in many cases (e.g., map rendering engines, creative coding on Canvas with shaders, image processing filters, video effects) because it can handle thousands of sprites or real-time shader effects far beyond the capability of Canvas2D
* **Video and Photo Editing**: Some in-browser video editors or photo editors use WebGL to apply filters (treating it as a GPU acceleration for pixel manipulation)
* **Machine Learning (Workaround)**: Before WebGPU, machine learning libraries like TensorFlow.js leveraged WebGL to run neural networks on the GPU by converting neural network operations into fragment shader programs. This was a clever hack to use GPU via WebGL, but it was limited in performance and features. Still, it enabled things like real-time pose detection or image classification in-browser using WebGL as the compute layer

WebGPU can handle everything WebGL does (rendering 3D graphics), and additionally enables new scenarios:

* **High-End 3D Graphics**: WebGPU’s feature set and performance make it suitable for next-gen web games or advanced rendering techniques. Developers can implement more complex rendering pipelines, use compute shaders for tasks like culling, particle systems, or post-processing, and generally get closer to "native" engine performance. For example, engines can do GPU-based texture compression, generate mipmaps or procedural content with compute, etc
* **Real-Time Rendering with Advanced Effects**: Techniques that are common in modern game engines &mdash; deferred rendering, physically-based rendering with many lights, GPU particle systems, etc. &mdash; will benefit from WebGPU. The ability to use many uniform buffers or storage buffers, and bigger textures, means more detailed scenes. WebGPU also supports more texture formats and features like indirect drawing, which can help with efficient multi-draw scenarios
* **Browser-based Machine Learning and Data Science**: WebGPU is a game-changer for web ML. Instead of mapping neural network ops onto WebGL fragment shaders, frameworks can write compute shaders that directly implement these ops. This yields better performance and access to more GPU features (like 16-bit or 8-bit tensor calculations, shared memory for optimizing data access, etc.). As noted, TensorFlow.js already has a WebGPU backend that outperforms its WebGL backend​. We can expect more libraries to follow, enabling things like larger models or even training in-browser using WebGPU (something quite impractical with WebGL)
* **General-Purpose GPU Computing GPGPU**: WebGPU opens the door for using the browser for parallel computations unrelated to graphics: physics simulations (fluid dynamics, cloth simulation entirely on GPU), real-time data analysis (e.g., processing large arrays or images with compute kernels), or even cryptocurrency hashing on GPU (though browsers might throttle this for safety). Essentially, any algorithm that can be parallelized on GPU can now be brought to the web without plugins, using WebGPU’s compute. Developers might incorporate WebGPU for heavy number-crunching while still using the DOM for UI
* **Emerging Technologies**: WebGPU may also facilitate things like real-time ray tracing in the future (if browsers expose GPU ray tracing cores through future WebGPU extensions), or advanced VR/AR rendering when paired with WebXR, taking advantage of multi-view rendering via compute
* **Hybrid Rendering Approaches**: With WebGPU, one could mix compute and graphics in novel ways. For example, generating a procedural 3D terrain on the fly using a compute shader, then rendering it &mdash; something much faster than doing the generation on the CPU. Or using compute for GPU-based particle physics and then rendering the result, which makes extremely large particle counts feasible.

## How it works

There are fundamental differences on how WebGL and WebGPU work, which are important to understand when transitioning from one to the other since you won't be able to reuse WebGL code in WebGPU applications

### Graphic apps

In WebGL, you need to get a WebGL context from a canvas, write GLSL shader source strings for vertex and fragment shaders, compile them, link them into a program, set up vertex buffers for geometry, and then issue a draw call. WebGL uses a stateful pipeline: you bind the current array buffer, current shader program, etc., and the state remains set until changed.

```typescript
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');  // Try WebGL2 context (falls back to WebGL1 if not available)
if (!gl) {
    console.error("WebGL not supported");
}

// Define shader source code in GLSL
const vertexSrc = `#version 300 es
in vec2 position;
void main() {
    // Convert 2D position to homogenous clip space (z=0, w=1)
    gl_Position = vec4(position, 0.0, 1.0);
}`;
const fragmentSrc = `#version 300 es
precision highp float;
out vec4 outColor;
void main() {
    outColor = vec4(1.0, 0.0, 0.0, 1.0);  // solid red color
}`;

// Compile vertex shader
const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vertexSrc);
gl.compileShader(vs);
if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(vs));
}
// Compile fragment shader
const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fragmentSrc);
gl.compileShader(fs);
if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(fs));
}
// Link shaders into a WebGL program
const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
}
gl.useProgram(program);

// Setup triangle vertex data (3 vertices, 2D positions)
const vertices = new Float32Array([
    0.0,  0.5,   // top center
   -0.5, -0.5,   // bottom left
    0.5, -0.5    // bottom right
]);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Bind vertex data to the shader's "position" attribute
const posLocation = gl.getAttribLocation(program, "position");
gl.enableVertexAttribArray(posLocation);
gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

// Set viewport and clear the screen
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the triangle (three vertices)
gl.drawArrays(gl.TRIANGLES, 0, 3);
```

In this WebGL code:

* We request a WebGL2 context (webgl2). If the browser doesn’t support WebGL2, fallback to `canvas.getContext('webgl')` for WebGL1 (and adjust shader code accordingly, since #version 300 es is WebGL2)
* Write shaders in GLSL. The vertex shader simply takes a 2D position and sets `gl_Position`. The fragment shader outputs a constant red color
* Create GPU buffers, uploaded our vertex array (vertices) to the GPU, and described to WebGL how to interpret the buffer (`vertexAttribPointer`)
* Clear the screen and call `gl.drawArrays` to draw the triangle.


The equivalent (and more verbose) code using WebGPU requires an asynchronous setup to get a GPU device, and uses WGSL for shaders. We also have to configure the canvas context’s format and create a render pipeline object before drawing.

```typescript
const canvas = document.querySelector('canvas')!;
// Request WebGPU adapter and device (promises)
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error("WebGPU is not supported on this device or browser.");
}
const device = await adapter.requestDevice();


// Configure the canvas context for WebGPU
const context = canvas.getContext('webgpu') as GPUCanvasContext;
const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device: device, format: presentationFormat });

// Write WGSL shaders for the triangle (vertex and fragment in one module)
const wgslShaders = `
  @vertex
  fn vs_main(@builtin(vertex_index) idx : u32) -> @builtin(position) vec4f {
    // Define an array of 3 positions in clip space (z=0, w=1 implicitly)
    var pos = array<vec2f, 3>(
      vec2f(0.0,  0.5),   // top center
      vec2f(-0.5, -0.5),  // bottom left
      vec2f( 0.5, -0.5)   // bottom right
    );
    // Return the position for the vertex with index idx
    return vec4f(pos[idx], 0.0, 1.0);
  }

  @fragment
  fn fs_main() -> @location(0) vec4f {
    return vec4f(1.0, 0.0, 0.0, 1.0);  // solid red color
  }
`;
const shaderModule = device.createShaderModule({ code: wgslShaders });

// Create a render pipeline with the above shaders
const pipeline = device.createRenderPipeline({
  layout: "auto",
  vertex: {
    module: shaderModule,
    entryPoint: "vs_main"
  },
  fragment: {
    module: shaderModule,
    entryPoint: "fs_main",
    targets: [{ format: presentationFormat }]
  },
  primitive: {
    topology: "triangle-list"
  }
});

// Encode commands to render the triangle
const commandEncoder = device.createCommandEncoder();
const renderPass = commandEncoder.beginRenderPass({
  colorAttachments: [{
    view: context.getCurrentTexture().createView(),
    clearValue: { r: 0, g: 0, b: 0, a: 1 },  // clear to black
    loadOp: 'clear',
    storeOp: 'store'
  }]
});
renderPass.setPipeline(pipeline);
renderPass.draw(3, 1, 0, 0);  // draw 3 vertices (one triangle)
renderPass.end();
device.queue.submit([commandEncoder.finish()]);

// necessary for Typescript not to complain
export { };
```

The WebGPU code does the following

* We get a GPUAdapter and GPUDevice via `navigator.gpu`. This is asynchronous (hence await).
* We obtain a WebGPU rendering context from the canvas and configure it with a pixel format
  * WebGPU doesn’t implicitly create a default framebuffer like WebGL does; we must specify the texture format for the canvas (using the browser’s `getPreferredCanvasFormat()` for optimal choice)
* The shaders are written in WGSL, embedded as a multi-line string
  * The vertex shader uses the built-in `vertex_index` to pick one of three hard-coded positions (same triangle geometry as before)
  * The fragment shader returns red. Notice the syntax differences (e.g., `vec4f` instead of `vec4` and the use of the `@location(0)` attribute to specify the render target)
* We create a render pipeline by providing the shader module and specifying which functions to use for the vertex and fragment stages, plus the output format
  * WebGPU’s pipeline creation encapsulates what in WebGL was many separate states (shaders, blending, primitive topology, etc.) into one object. We set primitive.topology to `"triangle-list"` to indicate how to interpret the vertices (WebGL defaulted to triangles in the draw call)
* To draw, we create a command encoder and begin a render pass. We must explicitly specify the render target (`context.getCurrentTexture().createView()`) and how to clear it. Inside the pass, we set the pipeline and call `draw(3)`. In WebGPU, drawing without explicit vertex buffers will implicitly use the `vertex_index` in the shader as we did (this is a “shader-only” triangle). Typically you’d set vertex buffers and bind groups here if needed.
* Finally, we end the pass, finish encoding, and submit the command buffer to the GPU queue.

While the WebGPU code is more verbose, it has a clear structure: configure context, create pipeline, record commands. There is no equivalent to WebGL’s `glEnable/glVertexAttribPointer` state manipulation; instead, everything needed is bound at draw time via the pipeline and the context configuration. Also note we didn’t need to write any code to compile or link shaders (the browser does that when creating the shader module and pipeline, possibly asynchronously or at pipeline creation).

Libraries like [Three.js](https://threejs.org/) are already working on WebGPU backend development, so developers can use them without worrying about the low-level details. This will help ease the transition from WebGL to WebGPU, as these libraries will abstract away the differences and provide a familiar API.

The following example uses Three.js's WebGPU renderer to create the same red triangle in a black background

```typescript
import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

async function init() {
  // Create scene
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x000000)

  // Create camera
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10)
  camera.position.z = 1

  // Create triangle geometry
  const geometry = new THREE.BufferGeometry()
  const vertices = new Float32Array([
    0.0,  0.5,  0.0,  // top
   -0.5, -0.5,  0.0,  // bottom left
    0.5, -0.5,  0.0   // bottom right
  ])
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  // Create red material
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide })

  // Create mesh and add to scene
  const triangle = new THREE.Mesh(geometry, material)
  scene.add(triangle)

  // Create WebGPU renderer
  const renderer = new WebGPURenderer()
  await renderer.init() // async init is required
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // Initial render only (no animation)
  renderer.render(scene, camera)
}

init()
```

### Compute shaders

While it is possible to hack WebGL to use fragment shaders to process data, it is cumbersome and inefficient since it's not what the API was designed for.

With WebGPU we can use a compute shader to process data on the GPU, with no workarounds. Here’s a WebGPU example in TypeScript that adds two arrays of numbers using a compute shader:

```typescript
// Request WebGPU adapter and device (promises)
const adapter = await navigator.gpu.requestAdapter();
if (!adapter) {
  throw new Error("WebGPU is not supported on this device or browser.");
}
const device = await adapter.requestDevice();

// Prepare input data
const inputA = new Float32Array([1, 2, 3, 4]);
const inputB = new Float32Array([10, 20, 30, 40]);
const count = inputA.length;  // number of elements (should match inputB.length)

// Create GPU buffers for input and output
const bufferA = device.createBuffer({
  size: inputA.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
});
const bufferB = device.createBuffer({
  size: inputB.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
});

// This buffer is used as the output of the compute shader
const bufferOutput = device.createBuffer({
  size: inputA.byteLength,
  usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC
});

// This buffer is used to read data back to the CPU
const bufferReadback = device.createBuffer({
  size: inputA.byteLength,
  usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST
});

// Upload data to GPU
device.queue.writeBuffer(bufferA, 0, inputA);
device.queue.writeBuffer(bufferB, 0, inputB);

// Create shader module
const shaderModule = device.createShaderModule({
  code: `
    @group(0) @binding(0) var<storage, read> inputA : array<f32>;
    @group(0) @binding(1) var<storage, read> inputB : array<f32>;
    @group(0) @binding(2) var<storage, read_write> result : array<f32>;

    @compute @workgroup_size(64)
    fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
      let index = GlobalInvocationID.x;
      result[index] = inputA[index] + inputB[index];
    }
  `
});

// Create bind group layout and bind group
const bindGroupLayout = device.createBindGroupLayout({
  entries: [
    { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
    { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: "read-only-storage" } },
    { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: "storage" } }
  ]
});

const pipeline = device.createComputePipeline({
  layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
  compute: {
    module: shaderModule,
    entryPoint: "main"
  }
});

const bindGroup = device.createBindGroup({
  layout: bindGroupLayout,
  entries: [
    { binding: 0, resource: { buffer: bufferA } },
    { binding: 1, resource: { buffer: bufferB } },
    { binding: 2, resource: { buffer: bufferOutput } }
  ]
});

// Encode compute pass
const commandEncoder = device.createCommandEncoder();
const passEncoder = commandEncoder.beginComputePass();
passEncoder.setPipeline(pipeline);
passEncoder.setBindGroup(0, bindGroup);
passEncoder.dispatchWorkgroups(count);
passEncoder.end();

// Copy result to the readable buffer
commandEncoder.copyBufferToBuffer(bufferOutput, 0, bufferReadback, 0, inputA.byteLength);

// Submit commands
const gpuCommands = commandEncoder.finish();
device.queue.submit([gpuCommands]);

// Read result back to CPU
await bufferReadback.mapAsync(GPUMapMode.READ);
const copyArrayBuffer = bufferReadback.getMappedRange();
const resultArray = new Float32Array(copyArrayBuffer.slice(0));
console.log("Result:", resultArray);
bufferReadback.unmap();
```

Key points in the WebGPU compute example:

* Create three buffers: two for inputs (A and B) and one for output
  * We give them the `STORAGE` usage because they will be accessed in a compute shader
  * We also give the result buffer `MAP_READ` so we can read it from JS later (and `COPY_SRC` since some platforms require it for `MAP_READ` buffers to use `copyBufferToBuffer`)
* Write a WGSL compute shader `computeMain` that uses `@builtin(global_invocation_id)` to get the global thread index
  * Specify `@workgroup_size(64)`, meaning each workgroup has 64 threads (this is an arbitrary choice; 64 is a typical workgroup size for such tasks)
  * The shader simply does `bufferOut[i] = bufferA[i] + bufferB[i]` for each index i
  * We also do a bounds check (`if (i < arrayLength(&bufferOut))`) to be safe in case the number of threads launched is a bit more than needed (common practice)
* Create a `GPUComputePipeline` with that shader
  * No need for a fragment shader or pipeline states like depth/stencil here
* Create a bind group, which is how WebGPU binds resources (buffers/textures) to shaders
  * The bind group layout is derived automatically (`layout: "auto"`) and we bind bufferA to binding 0, bufferB to 1, bufferResult to 2, matching the @binding(n) in the shader code
* We then encode a compute pass. We set the pipeline and bind group, and call `dispatchWorkgroups`
  * We dispatch `ceil(count/64)` workgroups of 64 threads each, which ensures at least count threads in total &mdash; enough to cover every index of our arrays. (If count were not a multiple of 64, the extra threads will just do the bounds-check and exit)
* After ending the pass, we submit the commands. The GPU will run the compute shader in the background, map the result buffer for reading and log the results

## Things to consider

When deciding between WebGL and WebGPU there are several factors to consider:

API Level and Abstraction
: WebGL is a binding of OpenGL ES and carries over a lot of legacy design (state machine, immediate mode style). WebGPU is a fresh API designed to resemble modern graphics APIs while fitting the web’s needs​.
: WebGPU is more verbose and requires understanding of GPU concepts but it provides a more structured approach with less implicit global state.
: **Trade-off**: WebGL might be easier for small tasks or quick prototypes (less setup), whereas WebGPU gives you more control and better architecture for large applications at the cost of complexity

Ease of Use vs. Power
: WebGL has a large ecosystem of examples and wrappers (and things like the WebGL debugging/DevTools are mature). WebGPU, being new, has fewer learning resources (though growing rapidly).
: WebGPU’s power is much greater: you can do things in WebGPU you simply can’t in WebGL (compute shaders, more advanced rendering techniques)
: **Trade-off**: If your app’s needs are met by WebGL’s capabilities, sticking with WebGL might result in less code and broader support. But if you need that extra power or want to build something future-proof, WebGPU might be worth the upfront effort

Performance
: In many scenarios, WebGPU can outperform WebGL due to lower CPU overhead and better GPU utilization (especially for lots of objects or heavy computation)​.
: WebGPU’s explicitness lets you avoid some hidden costs that WebGL incurs (for example, WebGPU won’t do redundant validation or state checks per draw that WebGL might do). Achieving optimal performance in WebGPU might require more careful planning (e.g., how to structure data and work for GPU).
: WebGL is quite optimized in browsers, and for simple scenes the difference might be small. Also, current WebGPU implementations are new and might have teething issues.
: **Trade-off**: WebGPU offers higher potential performance, especially as both content and hardware scale up, but developers will need to manage more details. WebGL is battle-tested and may have more consistent performance across a wide range of devices right now.

Compute and Advanced Features
: WebGPU supports compute shaders natively, plus it supports features like storage buffers, atomics, and more texture formats &mdash; enabling   General-purpose computing on graphics processing units (GPGPU) and advanced graphics algorithms. WebGL is limited to the graphics pipeline and lacks this capability.
: **Trade-off**: If you need GPGPU or modern graphics workloads (or think you might in the future), WebGPU is the way to go. WebGL will force you into workarounds or simply cannot do some tasks.

Browser and Platform Support
: WebGL is supported everywhere, and you can expect it to just work on almost any browser (desktop or mobile, even older ones)​.
: WebGPU is currently available in some browsers (latest Chrome/Edge, etc.) and not at all in others (or behind flags)​. It also might not run on older hardware that doesn’t support required APIs.
: **Trade-off**: Using WebGPU might restrict your audience to users with up-to-date browsers and systems. A safe strategy is to implement a fallback or gracefully detect lack of WebGPU and inform the user. Browser and hardware support will increase as time passes, but until then, choosing WebGPU means accepting some compatibility limitations.

Development Tools and Ecosystem
: WebGL has a decade’s worth of tools &mdash; debugging utilities, browser devtool extensions, stackoverflow answers, and established best practices.
: WebGPU is catching up: it has debugging API options and will get similar tooling. Framework support is emerging: Babylon.js has full WebGPU support; Three.js has an experimental WebGPU renderer. These will make WebGPU more accessible to developers who don’t want to write low-level code.
: **Trade-off**: At the moment, developing in raw WebGPU might require more low-level debugging (e.g., figuring out validation errors) compared to WebGL. But as libraries and tools grow, this gap will close.

Future Prospects
: WebGL is basically in maintenance mode with no major new features planned, aside from incremental improvements or extensions.
: WebGPU, on the other hand, is actively evolving along with the specifications.
: **Trade-off**: Building with WebGPU now positions you ahead of the curve and your app can leverage new GPU tech as it arrives; sticking with WebGL means you’re on a stable base but one that won’t get much richer over time.

## Browser support

<baseline-status featureid="webgl"></baseline-status>

<baseline-status featureid="webgpu"></baseline-status>

While not essential to understanding WebGPU, it's worth nothing the differences in browser support between WebGL and WebGPU.

WebGL 1.0 has been available in all major browsers (desktop and mobile) since 2011.The [Khronos Group](https://www.khronos.org/) announced WebGL 2.0 support in all major browsers as of early 2022​. This means that developers can use WebGL 2 features with reasonable confidence on modern browsers, while falling back to WebGL 1 if needed for older devices. WebGL is also pretty forgiving in terms of hardware &mdash; it can run on most integrated GPUs and older machines. Where GPU drivers are missing or buggy, browsers like Chrome and Firefox use the [ANGLE](https://chromium.googlesource.com/angle/angle/) translation layer to implement WebGL on top of Direct3D/Metal, improving compatibility. In short, WebGL is a mature and universally supported web standard for graphics.

WebGPU is new and still stabilizing. As of early 2025, it is considered an experimental or emerging feature in browsers. Here is the current status:

Chrome/Edge (Chromium)
: WebGPU shipped in stable versions of Chromium-based browsers starting with Chrome (May 2, 2023) and Edge 113 (May 5, 2023) on desktop platforms. Initially, WebGPU was available on Windows, macOS, and ChromeOS by default. Linux support lagged slightly (behind a flag until Chrome 118+ and fully enabled by Chrome 121).
: On Android, WebGPU also required a flag initially but is becoming available as testing continues. By Chrome 121, a broad range of platforms had WebGPU on by default. Google continues to improve WebGPU in Chrome with bug fixes and performance tweaks.
: All Chromium browsers have the same level of WebGPU support.

Firefox
: Firefox’s WebGPU implementation is in progress. WebGPU is enabled by default in Firefox Nightly builds as of late 2023. The Firefox team has been tracking WebGPU under a “WebGPU MVP” meta-bug and, tentatively, planned to ship WebGPU in a stable release by Firefox 141. (Firefox 141 corresponds to late 2024 timeline.) This suggests that by 2025, Firefox stable either has WebGPU or is very close to enabling it.
: Firefox users can experiment with WebGPU by using Nightly and ensuring the preference `dom.webgpu.enabled` is true.

Safari (WebKit)
: WebGPU is enabled by default in Safari Technology Preview (the experimental Safari builds) as of 2024. On macOS 14 “Sequoia” betas, there’s a feature flag in Safari’s settings to enable WebGPU.
: On iOS 17/18 and iPadOS, WebGPU is also behind an “Experimental Features” toggle in Safari settings.
: Apple will dictate the rythm for WebGPU support on iOS/iPadOS, as all browsers on iOS are skins on top of WebKit.
: Safari will officially possibly ship WebGPU in 2024 or 2025, once the spec and implementation are stable.

Other platforms
: WebGPU is also accessible in non-browser contexts like [Deno](https://docs.deno.com/api/web/~/GPU) and [Node](https://www.npmjs.com/package/webgpu) so the same API can be used in those environments.
: Chrome supports WebGPU in Android devices. Some older devices may not support WebGPU due to hardware limitations.
: WebGPU is also available in ChromeOS.

## Code repository

I've grouped the code samples into a repository with all the necessary tooling to work out of the box in this [Github repository](https://github.com/caraya/webgpu-example).

The code is organized into folders, one for each example: WebGL, WebGPU, WebGPU Compute, and WebGPU with Three.js.

Go into each folder and run the following commands:

```bash
npm install
npx vite
```

And point your browser to the URL shows in the terminal.

## Links and resources

* [WebGPU Specification](https://www.w3.org/TR/webgpu/)
* [WebGPU](https://en.wikipedia.org/wiki/WebGPU) &mdash; Wikipedia
* [WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API) &mdash; MDN
* [WebGPU — All of the cores, none of the canvas](https://surma.dev/things/webgpu/index.html)
* [WebGPU Samples](https://austin-eng.com/webgpu-samples)
* [WebGPU: Unlocking modern GPU access in the browser](https://developer.chrome.com/blog/webgpu-io2023/)
* Three.js [WebGPU examples](https://threejs.org/examples/?q=webgpu)
* [webgpu-utils](https://greggman.github.io/webgpu-utils/)
* [Raw WebGPU](https://alain.xyz/blog/raw-webgpu/)
* [Build an app with WebGPU](https://developer.chrome.com/docs/web-platform/webgpu/build-app?hl=en)
* [Reaction-Diffusion Compute Shader in WebGPU](https://tympanus.net/codrops/2024/05/01/reaction-diffusion-compute-shader-in-webgpu/)
* [Fast Fluid Dynamics Simulation on the GPU](https://developer.nvidia.com/gpugems/gpugems/part-vi-beyond-triangles/chapter-38-fast-fluid-dynamics-simulation-gpu)
