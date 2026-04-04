---
title: Typed Arrays
date: 2026-05-25
tags:
  - Javascript
  - Web Development
baseline: true
---

There's a special kind of array in JavaScript called a typed array. Typed arrays are not the same as normal arrays, and they are not intended to replace them. Instead, they provide a way to work with binary data in a more efficient manner.

This post will cover the basics of typed arrays, including what they are, how they relate to buffers, how they work, and when to use them.

## What are Typed Arrays?

Typed arrays are array-like objects that provide a mechanism for reading and writing raw binary data in memory buffers.

Typed arrays are not intended to replace arrays for any kind of functionality. Instead, they provide developers with a familiar interface for manipulating binary data, such as audio and video manipulation, access to raw data using WebSockets, among others. Each entry in a JavaScript typed array is a raw binary value in one of a number of supported formats, from 8-bit integers to 64-bit floating-point numbers.

Typed array objects are similar to arrays with similar semantics but should not be confused with normal arrays.

* Calling [Array.isArray()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) on a typed array returns false
* Not all methods available for normal arrays are supported by typed arrays (e.g., push and pop).

To achieve maximum flexibility and efficiency, JavaScript typed arrays split the implementation into buffers and views.

## Buffers

<baseline-status featureid="shared-memory"></baseline-status>

There are two types of buffers: [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) and [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer). Both are low-level representations of a memory span. They have "array" in their names, but they don't have much in common with arrays.

To create a new buffer, we can use the `ArrayBuffer` constructor. The constructor takes a single argument, which is the size of the buffer in bytes. The size must be a non-negative integer, and 0 is allowed.

```typescript
const buffer: ArrayBuffer = new ArrayBuffer(8);
```

If we want to create a Shared Buffer, we can use the `SharedArrayBuffer` constructor. The constructor takes a single argument, which is the size of the buffer in bytes. The size must be a non-negative integer, and 0 is allowed.

```typescript
const sharedBuffer: SharedArrayBuffer = new SharedArrayBuffer(1024);
```

We'll look at what to do with the buffer when we look at views.

## Typed array views

<baseline-status featureid="typed-arrays"></baseline-status>

<baseline-status featureid="float16array"></baseline-status>

Typed arrays are array-like objects that provide a mechanism to handle binary data with specific types. These arrays represent a view of an underlying ArrayBuffer, which stores the raw binary data. Typed arrays are designed for working with raw binary data directly in a memory-efficient way and allow for operations on specific types of data, such as integers, floats, etc.

| Type | Value Range | Size in bytes |
| :---: | :---: | :---: |
| Int8Array | -128 to 127 | 1 |
| Uint8Array | 0 to 255 | 1 |
| Int8Array | -128 to 127 | 1 |
| Uint8ClampedArray | 0 to 255 | 1 |
| Int16Array | -32768 to 32767 | 2 |
| Uint16Array | 0 to 65535 | 2 |
| Int32Array | -2147483648 to 2147483647 | 4 |
| Uint32Array | 0 to 4294967295 | 4 |
| Float16Array | -65504 to 65504 | 2 |
| Float32Array | -3.4e38 to 3.4e38 | 4 |
| Float64Array | -1.8e308 to 1.8e308 | 8 |
| BigInt64Array | -(2^63) to 2^63 - 1 | 8 |
| BigUint64Array | 0 to 2^64 - 1 | 8 |

In addition to typed arrays, there is one more item to consider. `DataView` provides a low-level interface for reading and writing multiple number types from an ArrayBuffer.

```typescript
const buffer: ArrayBuffer = new ArrayBuffer(64);

// Create views on the ArrayBuffer with typed arrays
const uint8Array: Uint8Array = new Uint8Array(buffer);
const int32Array: Int32Array = new Int32Array(buffer);

// You can assign values to the typed arrays
uint8Array[0] = 255;
uint8Array[1] = 128;

int32Array[0] = 42;
int32Array[1] = -10;

console.log(uint8Array[0]); // Output: 255
console.log(int32Array[0]); // Output: 42
```

### Creating Typed Arrays

At the most basic level you can create a typed array using the constructor of the desired type.

The first example shows how to create a typed array from an `ArrayBuffer`:

```typescript
const ab = new ArrayBuffer(256);
const faFull = new Uint8Array(ab);
```

The typed array constructor takes the following parameters:

typedArray (one of the TypedArray subclasses)
: When called with an instance of a `TypedArray` subclass, the `typedArray` gets copied into a new typed array. For a non-bigint `TypedArray` constructor, the `typedArray` parameter can only be of one of the non-bigint types (such as `Int32Array`). Similarly, for a bigint `TypedArray` constructor (`BigInt64Array` or `BigUint64Array`), the `typedArray` parameter can only be of one of the bigint types. Each value in `typedArray` is converted to the corresponding type of the constructor before being copied into the new array. The length of the new typed array will be same as the length of the `typedArray` argument.

ByteOffset (Optional)
: When called with an `ArrayBuffer` or `SharedArrayBuffer` instance, the parameter will be treated as a number specifying the byte offset in the buffer. The byte offset must be a multiple of `BYTES_PER_ELEMENT` bytes. If the byte offset is not specified, it defaults to 0.

length (Optional)
: When called with a non-object, the parameter will be treated as a number specifying the length of the typed array. An internal array buffer is created in memory, of size length multiplied by `BYTES_PER_ELEMENT` bytes, filled with zeros. Omitting all parameters is equivalent to using 0 as length.

The example below shows how Typed Arrays work. It illustrates some basic concepts like how to use multiple Typed Arrays referencing the same underlying Bufferand how to modify the underlying buffer from a Typed Array.

The example performs the following steps:

1. Allocate a raw buffer of 32 bytes
2. Fill the buffer with some example byte values using a Uint8Array view
3. Create a Float32Array view starting at byte offset 8, with length 4 elements
4. Inspect the values in the Float32Array

```typescript
const buffer = new ArrayBuffer(32);

const byteView = new Uint8Array(buffer);
for (let i = 0; i < byteView.length; i++) {
  byteView[i] = i;
}

const floatView = new Float32Array(buffer, 8, 4);

console.log("Float32Array length:", floatView.length);
floatView.forEach((value, i) => {
  console.log(`element ${i}:`, value);
});
```

You can also create a typed array from an existing array or another typed array. The new typed array will be a copy of the original, and any changes made to one will not affect the other.

```typescript
const originalArray = [1, 2, 3, 4, 5];
const typedArray = new Int32Array(originalArray);
console.log(typedArray);
```

As mentioned earlier, you can create multiple Typed Arrays that reference the same data.

```typescript
// Create a buffer of 256 bytes
const ab = new ArrayBuffer(256);
// Create a Uint8Array view of the full buffer
const faFull = new Uint8Array(ab);
// Create a Uint8Array view of the first half of the buffer
const faFirstHalf = new Uint8Array(ab, 0, 128);
// Create a Uint8Array view of buffer starting at byte 128 and 64 bytes long
const faThirdQuarter = new Uint8Array(ab, 128, 64);
// Create a Uint8Array view of buffer starting at byte 192
const faRest = new Uint8Array(ab, 192);
```

The `offsetBuffer` and `length` parameters (second and third parameters) are optional.

If you specify an `offsetBuffer`, the Typed Array will reference the buffer starting at that byte offset, otherwise it starts at offset 0, the beginning of the buffer.

If there is a `length` parameter, the Typed Array will include `length` elements (of `BYTES_PER_ELEMENT` size) in the Typed Array. The length is specified in terms of the number of elements, not bytes.

### Value encoding and normalization

All typed arrays operate on ArrayBuffers, where you can observe the exact byte representation of each element, so how the numbers are encoded in binary format is significant.

* Unsigned integer arrays (`Uint8Array`, `Uint16Array`, `Uint32Array`, and `BigUint64Array`) store the number directly in binary
* Signed integer arrays (`Int8Array`, `Int16Array`, `Int32Array`, and `BigInt64Array`) store the number using [two's complement](https://en.wikipedia.org/wiki/Two's_complement)
* Floating-point arrays (`Float16Array`, `Float32Array`, and `Float64Array`) store the number using [IEEE 754](https://en.wikipedia.org/wiki/IEEE_754) floating-point format. Note that the spec requires all `NaN` values to use the same bit encoding, but the exact bit pattern is implementation-dependent
* `Uint8ClampedArray` is a special case. It stores the number in binary like `Uint8Array` does, but when you store a number outside the range, it clamps the number to the range 0 to 255 by mathematical value, instead of truncating the most significant bits
* All typed arrays except `Int8Array`, `Uint8Array`, and `Uint8ClampedArray` store each element using multiple bytes. These bytes can either be ordered in either little endian or big endian byte order. See the [endianness](https://en.wikipedia.org/wiki/Endianness) Wikipedia article for more information
  * **Typed arrays always use the platform's native byte order**
* If you want to specify the endianness when writing and reading from buffers, use a [DataView](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) instead.

When writing to these typed arrays, values that are outside the representable range are normalized. The normalization process will depend on the type of typed array:

* All integer arrays (except `Uint8ClampedArray`) use fixed-width number conversion, which first truncates the decimal part of the number and then takes the lowest bits
* `Uint8ClampedArray` first clamps the number to the range 0 to 255 (values greater than 255 become 255 and values less than 0 become 0). It then rounds (instead of flooring) the result to the nearest integer, with [half to even rounding](https://en.wikipedia.org/wiki/Rounding#Rounding_half_to_even)
* `Float16Array` and `Float32Array` perform a "round to even" to convert 64-bit floating point numbers to 32-bit and 16-bit. This is the same algorithm as provided by [Math.fround()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/fround) and [Math.f16round()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/f16round)

### Common Operations

Typed arrays support many of the same iteration and transformation methods as normal arrays.
They also include binary-data-specific APIs and do not support length-changing methods.

| Method | Normal arrays | Typed arrays | Notes |
| :---: | :---: | :---: | --- |
| [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) | Yes | Yes | Creates a new array-like result by calling a provided function on each element. |
| [sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) | Yes | Yes | Sorts elements in place and returns the sorted array. |
| [forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) | Yes | Yes | Executes a provided function once per element. |
| [reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) | Yes | Yes | Reduces elements to a single output value. |
| reverse() | Yes | Yes | Reverses elements in place and returns the reversed array. |
| filter() | Yes | Yes | Creates a new collection with elements that pass the test. |
| slice() | Yes | Yes | Returns a shallow copy of a selected portion. |
| [subarray()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) | No | Yes | Returns a typed array view into a section of the original array. |
| [set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/set) | No | Yes | Copies elements from an array or typed array into the current typed array at an offset. |
| [buffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/buffer) | No | Yes | Property that returns the underlying ArrayBuffer. |
| pop(), push(), shift(), splice(), unshift() | Yes | No | Not available for typed arrays because length is fixed. |
| flat(), flatMap(), concat() | Yes | No | Not directly supported by typed arrays. |

### Behavior when viewing a resizable buffer

When a TypedArray is created as a view of a [resizable buffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer#resizing_arraybuffers), resizing the underlying buffer will have different effects on the size of the `TypedArray` depending on whether it is constructed as length-tracking.

If a typed array is created without a specific size by omitting the third parameter or passing undefined, the typed array will become length-tracking, and will automatically resize to fit the underlying buffer as the latter is resized:

```typescript
const buffer: ArrayBuffer = new ArrayBuffer(8, { maxByteLength: 16 });
const float32 = new Float32Array(buffer);

console.log(float32.byteLength); // 8
console.log(float32.length); // 2

buffer.resize(12);

console.log(float32.byteLength); // 12
console.log(float32.length); // 3
```

If a typed array is created with a specific size using the third length parameter, it won't resize to contain the buffer as the latter is grown:

```typescript
const buffer: ArrayBuffer = new ArrayBuffer(8, { maxByteLength: 16 });
const float32: Float32Array = new Float32Array(buffer, 0, 2);

console.log(float32.byteLength); // 8
console.log(float32.length); // 2
console.log(float32[0]); // 0, the initial value

buffer.resize(12);

console.log(float32.byteLength); // 8
console.log(float32.length); // 2
console.log(float32[0]); // 0, the initial value
```

When a buffer is shrunk, the viewing typed array may become out of bounds, in which case the typed array's observed size will decrease to 0. This is the only case where a non-length-tracking typed array's length may change.

```typescript
const buffer: ArrayBuffer = new ArrayBuffer(8, { maxByteLength: 16 });
const float32: Float32Array = new Float32Array(buffer, 0, 2);

buffer.resize(7);

console.log(float32.byteLength); // 0
console.log(float32.length); // 0
console.log(float32[0]); // undefined
```

If you then grow the buffer again to bring the typed array back in bounds, the typed array's size will be restored to its original value.

```typescript
buffer.resize(8);

console.log(float32.byteLength); // 8
console.log(float32.length); // 2
console.log(float32[0]); // 0 - back in bounds again!
```

The same can happen for length-tracking typed arrays as well, if the buffer is shrunk beyond the byteOffset.

### Exceptions

All TypeArray subclass constructors operate in the same way. They would all throw the following exceptions:

TypeError
: Thrown in one of the following cases:
: * A typedArray is passed but it is a bigint type while the current constructor is not, or vice versa.
: * A typedArray is passed but the buffer it's viewing is detached, or a detached buffer is directly passed.

RangeError
: Thrown in one of the following cases:
: * The new typed array's length is too large.
: * The length of buffer (if the length parameter is not specified) or byteOffset is not an integral multiple of the new typed array's element size.
: * byteOffset is not a valid array index (an integer between 0 and 2^53 - 1).
: * When creating a view from a buffer, the bounds are outside the buffer. In other words, `byteOffset + length * TypedArray.BYTES_PER_ELEMENT > buffer.byteLength`.

## What APIs use Typed Arrays?

Typed Arrays are powerful but it is not something that you'd use directly in your code unless you're working with an API that handles binary data. They are not intended to be used as a replacement for normal arrays, but rather as a way to work with binary data in a more efficient manner.

Several Web APIs utilize Typed Arrays for efficient handling of binary data, including WebGL, Canvas, Web Audio API, FileReader, XMLHttpRequest 2, WebSockets, Web Workers, and Media Source API.

Here some Web APIs that use Typed Arrays:

WebGL
: WebGL uses Typed Arrays (like `Float32Array` and `Uint16Array`) to represent vertex data, drawing indices, and other data used in 3D rendering.

Canvas
: The `ImageData.data` property, which holds pixel data for a canvas, is a Uint8ClampedArray.

Web Audio API
: Web Audio uses Typed Arrays to represent audio data.

FileReader
: The `readAsArrayBuffer()` method in FileReader can be used to read a file's contents as a typed array.

XMLHttpRequest
: The `send()` method in XMLHttpRequest supports sending typed arrays and ArrayBuffer objects as part of a request.

Fetch
: Like XMLHttpRequest, the Fetch API lets you send resources.

WebSockets
: WebSockets can be used to send and receive binary data using Typed Arrays.

Web Workers
: Typed Arrays can be transferred between the main thread and Web Workers, facilitating data processing in the background.

Media Source API
: This API uses Typed Arrays for handling media data, like audio and video streams.

File APIs
: Files can be accessed and manipulated using Typed Arrays, offering fine-grained control over binary data.

## Links and Resources

* [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) &mdash; MDN
* [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) &mdash; MDN
* [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) &mdash; MDN
* [Typed Arrays Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Typed_arrays) &mdash; MDN
* [Where to use ArrayBuffer vs typed array in JavaScript?](https://stackoverflow.com/questions/42416783/where-to-use-arraybuffer-vs-typed-array-in-javascript)
* Exploring JS [Typed Arrays](https://exploringjs.com/es6/ch_typed-arrays.html)
* [ArrayBuffer and TypedArray](https://dev.to/kshitij978/arraybuffer-and-typedarray-3ege)
* [Typed arrays - Binary data in the browser](https://web.dev/articles/webgl-typed-arrays/)
* [Typed Arrays and ArrayBuffers](https://observablehq.com/@julesblm/typed-arrays-and-arraybuffers-too)
* [Typed Arrays in JavaScript](https://www.freecodecamp.org/news/typed-arrays-in-javascript/)
