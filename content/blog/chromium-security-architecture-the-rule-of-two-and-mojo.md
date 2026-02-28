---
title: Chromium Security Architecture - Rule of Two & Mojo
date: 2026-04-06
tags:
  - Security
  - Chromium
  - Browser Architecture
---

In researching Chromium's security architecture and how it mitigates risks associated with unsafe languages and untrustworthy input, two key concepts stand out: the Rule of Two and Mojo, Chromium's IPC system.

This blog post explores how these concepts work together to create a robust security model.

## The Rule of Two

The Rule of Two is a strategic framework used by the Chromium security team to evaluate the risk of any new feature. It identifies three major risk factors and establishes rules for combining them safely.

### The risk factors

* **Untrustworthy Input**: Handling data from the internet (e.g., HTML, JavaScript, images, network packets).
* **Unsafe Language**: Using a language that is not memory-safe (primarily C++).
* **High Privilege**: Running with access to the operating system, user files, or hardware.

### The Rule

Developers can pick only two of these factors at any given time. If a design requires all three, the engineering team must re-architect it.

## What is Mojo?

Mojo is Chromium’s Inter-Process Communication (IPC) system. It allows different processes (like the Browser, Renderer, and GPU processes) to communicate safely. It replaced the "Legacy IPC" stack, which was a macro-heavy C++ system that proved difficult to secure and verify.

How it works:

* **IDL (Interface Definition Language)**: Developers define interfaces in .mojom files.
* **Language Agnostic**: Mojo generates bindings for C++, JavaScript/TypeScript, and Java.
* **Message Pipes**: These asynchronous, bidirectional channels send structured messages rather than raw bytes.
* **Strong Typing**: Mojo validates data at the boundary. If a process sends a "Bad Message" (e.g., an out-of-bounds index), the receiving process kills the sender immediately.

## Handling the three combinations with Mojo

### Combination 1: The sandbox (Untrustworthy Input + Unsafe Language)

**The Concept**: Chromium accepts that C++ is prone to memory errors and that internet data is malicious by default. To mitigate this, the architecture strips the code of its power by running the "Unsafe" code in a "Low Privilege" environment.

**How it works**: This is the most common pattern in Chromium. The browser moves complex parsers (images, ZIP files, PDFs) into a utility process. Even if an attacker achieves code execution by exploiting a C++ bug, the OS-level sandbox blocks system calls, preventing them from reading local files or accessing the microphone.

**Mojo's Role**: Mojo acts as the "airlock." Developers define a Mojo interface that accepts the raw data and returns a safe, parsed result.

**File: `//services/data_decoder/public/mojom/image_parser.mojom`**

```idl
module data_decoder.mojom;

// Define the interface for a sandboxed parser
interface ImageParser {
  // Receive the untrusted bytes and return a safe bitmap
  DecodeImage(array<uint8> data) => (skia.mojom.BitmapN32? bitmap);
};
```

`C++ Implementation (Sandboxed Utility Process):`

```cpp
// LOCATION: //services/data_decoder/image_parser_impl.cc
// This process runs with restricted OS privileges.
void ImageParserImpl::DecodeImage(const std::vector<uint8_t>& data,
                                  DecodeImageCallback callback) {
  // This code handles UNTRUSTED input in an UNSAFE language.
  // It is safe because the process operates with LOW PRIVILEGE.
  std::move(callback).Run(DecodeDangerousPNG(data));
}
```

### Combination 2: Memory safety (Untrustworthy Input + High Privilege)

**The Concept**: Sometimes a feature requires high privilege (like interacting directly with the network stack or filesystem) while also handling data from the web. To accomplish this safely, developers eliminate the "Unsafe Language" factor.

**How it works**: Chromium uses memory-safe languages like Rust, TypeScript, or JavaScript. Because these languages prevent buffer overflows and use-after-free bugs at the compiler or runtime level, the process does not require a strict OS sandbox. The language itself serves as the security boundary.

**Mojo's Role**: Mojo allows these safe components to expose interfaces to the rest of the C++ browser safely.

**TypeScript and JavaScript solution**

Chromium uses WebUI (`chrome://` pages) to handle user input securely within the highly privileged Browser process.

**TypeScript**

```ts
// LOCATION: //chrome/browser/resources/settings/privacy_page.ts
import {PrivacyBridge} from './mojom_webui/privacy_bridge.mojom-webui.js';

async function updatePrivacySetting(enabled: boolean) {
  const bridge = PrivacyBridge.getRemote();
  // TypeScript handles UNTRUSTED input in a HIGH PRIVILEGE process.
  // It is safe because TypeScript compiles to a SAFE language runtime (V8).
  await bridge.setPrivacyEnabled(enabled);
}
```

**JavaScript**

```js
// LOCATION: //chrome/browser/resources/settings/privacy_page.js
import {PrivacyBridge} from './mojom_webui/privacy_bridge.mojom-webui.js';

async function updatePrivacySetting(enabled) {
  const bridge = PrivacyBridge.getRemote();
  // JavaScript handles UNTRUSTED input in a HIGH PRIVILEGE process.
  // It is safe because JavaScript is a SAFE language runtime (V8).
  await bridge.setPrivacyEnabled(enabled);
}
```

**Rust example**

Chromium increasingly utilizes Rust for high-performance, privileged tasks like QR code generation or network header parsing.

```rust
// LOCATION: //components/qr_code_generator/qr_code_generator.rs
pub fn generate_qr_code(input_text: &str) -> Vec<u8> {
  // Handle UNTRUSTED text in a HIGH PRIVILEGE process.
  // This is safe because Rust is a SAFE language.
  let code = qrcode::QrCode::new(input_text).unwrap();
  code.render::<Luma<u8>>().build().to_vec()
}
```

### Combination 3: Trustworthy data (Unsafe Language + High Privilege)

**The Concept**: If the browser must use C++ in a privileged process, it ensures the data it processes is completely trustworthy. This eliminates the "Untrustworthy Input" factor.

**How it works**: Chromium strictly limits the input to data that the browser itself created or data that is cryptographically signed and verified (e.g., a component update directly from Google). Because an attacker cannot manipulate this data, they cannot trigger a latent memory bug in the C++ code.

**Mojo's Role**: The privileged process uses Mojo to receive data, but it performs a "Verification" check immediately at the IPC boundary.

**C++ Example:**

```cpp
// LOCATION: //chrome/browser/component_updater/config_loader.cc
void ConfigLoader::OnConfigReceived(const std::string& signed_data) {
  // Use an UNSAFE language with HIGH PRIVILEGE.
  // This is only allowed because the input is verified as TRUSTWORTHY.

  if (!VerifyGoogleSignature(signed_data)) {
    // If the data is untrusted, kill the sender immediately.
    mojo::ReportBadMessage("Unverified component update received!");
    return;
  }

  // Now that the data is verified as TRUSTWORTHY, C++ can safely parse it.
  ParseComplexJson(signed_data);
}
```

## Why this is an effective mitigation

* **Isolation**: If a malicious script exploits the Renderer (Combination 1), Mojo ensures the attacker cannot reach the filesystem because the process lacks OS-level privileges.
* **Validation**: Mojo's generated code performs automatic bounds-checking. A sender cannot transmit 100 bytes if the interface expects exactly 50 bytes.
* **Zero-Trust**: Privileged processes treat all incoming Mojo messages as malicious by default. If a message violates the .mojom contract, the receiver terminates the sender immediately (mojo::ReportBadMessage).

## Source of examples & verification

The examples provided in this guide represent actual architectural patterns used in the Chromium Open Source Project.

### How to find the code

You can verify and explore the real-world versions of these patterns using [Chromium Code Search](https://source.chromium.org/chromium/chromium/src).

For Combination 1 (Sandbox):

* Search for `//services/data_decoder/`. This directory contains various sandboxed utilities for parsing images, XML, and JSON safely.

For Combination 2 (Rust/WebUI):

* Search for `//components/qr_code_generator/` to see how Rust integrates with the browser.
* Search for `//chrome/browser/resources/settings/` to view TypeScript WebUI implementations.

For Combination 3 (Verification):

* Search for `//components/component_updater/` to see how the browser securely downloads and verifies signed binary components before passing them to C++.

## Appendix: Mojo IDL vs. Web IDL

Because Chromium operates at the intersection of internal systems and web standards, developers often encounter two different types of IDL. While they share a similar name, they serve entirely different layers of the browser:

| Feature | Mojo IDL (.mojom) | Web IDL (.idl) |
| --- | --- | --- |
| Purpose | Internal IPC: Communication between Chromium processes. | Public Web API: Communication between the browser engine and JavaScript. |
| Standard | Proprietary to the Chromium project. | Standardized by W3C / WHATWG. See [webidl.spec.whatwg.org](https://webidl.spec.whatwg.org). |
| Usage | Connects the Renderer to the Browser or Utility processes. | Defines the APIs web developers use (e.g., DOM, Fetch). |

In a typical feature pipeline, a web developer calls a JavaScript API defined in Web IDL. That call is handled by the Blink rendering engine, which then uses a Mojo IDL interface to request privileged actions (like accessing the camera) from the Browser process.

## Appendix: Memory safety in TypeScript and JavaScript

Developers might wonder why TypeScript and JavaScript are considered "memory-safe" languages for the Rule of Two, especially since TypeScript allows developers to ignore errors and generate JavaScript regardless. The answer lies entirely in the execution environment.

### The runtime is the guardian

In Chromium, TypeScript eventually runs as JavaScript inside the V8 Engine. Unlike C++, where the programmer manages memory manually (using pointers, malloc, and free), V8 provides a strictly sealed environment:

* **Automatic Garbage Collection**: Developers do not manually free memory, which inherently eliminates use-after-free bugs.
* **No Raw Pointers**: JavaScript possesses no concept of a memory address. An attacker cannot cast an integer to a pointer to read arbitrary memory.
* **Strict Bounds Checking**: If code accesses an index outside of an array's bounds, V8 safely returns undefined or throws an error rather than reading raw data from the heap.

### Logic safety vs. memory safety

The errors presented in TypeScript are primarily about type safety and business logic. If a developer ignores a TypeScript error and ships buggy code:

* The program might crash with a TypeError.
* It might perform an incorrect calculation.
* **It will not allow an attacker to read the browser's memory or execute arbitrary shellcode**.

In the context of the Rule of Two, a crash (Denial of Service) is acceptable because it does not compromise the underlying operating system. Memory safety means the language runtime actively prevents an attacker from breaking the rules of the memory heap, and V8 guarantees this for every line of JavaScript it executes.
