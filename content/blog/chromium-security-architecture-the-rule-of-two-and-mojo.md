---
title: Chromium Security Architecture - Rule of Two & Mojo
date: 2026-04-06
tags:
  - Security
  - Chromium
  - Browser Architecture
---

In researching Chromium's security architecture and how it mitigates risks associated with unsafe languages and untrustworthy input, two key concepts stand out: the **Rule of Two** and **Mojo**, Chromium's IPC system.

This blog post explores how these concepts work together to create a robust security model.

## The Rule of Two

The Rule of Two is a strategic framework used by the Chromium security team to evaluate the risk of any new feature. It identifies three major risk factors and establises rules for combining them safely.

**The risk factors:**

1. **Untrustworthy Input:** Handling data from the internet (e.g., HTML, JS, images, network packets).
2. **Unsafe Language:** Using a language that is not memory-safe (primarily C++).
3. **High Privilege:** Running with access to the operating system, user files, or hardware.

**The Rule:**

You can pick only **two** of these factors at any given time. If your design requires all three, you must re-architect it.

## What is Mojo?

Mojo is Chromium’s **Inter-Process Communication (IPC)** system. It allows different processes (like the Browser, Renderer, and GPU processes) to talk to each other safely. It replaced the "Legacy IPC" stack, which was a macro-heavy C++ system that was difficult to secure and verify.

### How it Works:**

* **IDL (Interface Definition Language):** You define interfaces in .mojom files.
* **Language Agnostic:** Mojo generates bindings for C++, Javascript/Typescript, and Java.
* **Message Pipes:** Asynchronous, bidirectional channels that send structured messages rather than raw bytes.
* **Strong Typing:** Mojo validates data at the boundary. If a process sends a "Bad Message" (e.g., an out-of-bounds index), the receiving process kills the sender.

## Handling the Three Combinations with Mojo

### Combination 1: The Sandbox (Untrustworthy Input + Unsafe Language)

**The Concept:** We accept that C++ is prone to memory errors and that internet data is malicious. To mitigate this, we strip the code of its power by running the "Unsafe" code in a "Low Privilege" environment.

**How it works:** This is the most common pattern in Chromium. We move complex parsers (images, ZIP files, PDFs) into a utility process. Even if an attacker achieves code execution by exploiting a C++ bug, the OS-level sandbox blocks system calls, preventing them from reading your files or accessing your microphone.

**Mojo's Role:** It acts as the "airlock." You define a Mojo interface that accepts the raw data and returns a safe, parsed result.

**File:** //services/data_decoder/public/mojom/image_parser.mojom

```webidl
module data_decoder.mojom;

// Define the interface for a sandboxed parser
interface ImageParser {
  // We send the untrusted bytes and get back a safe bitmap
  DecodeImage(array\<uint8\> data) \=\> (skia.mojom.BitmapN32? bitmap);
};
```

**C++ Implementation (Sandboxed Utility Process):

```cpp
// LOCATION: //services/data_decoder/image_parser_impl.cc
// This process runs with restricted OS privileges.
void ImageParserImpl::DecodeImage(const std::vector\<uint8_t\>& data,
                                  DecodeImageCallback callback) {
  // This code handles UNTRUSTED input in an UNSAFE language.
  // It is safe because the process has LOW PRIVILEGE.
  std::move(callback).Run(DecodeDangerousPNG(data));
}
```

### Combination 2: Memory Safety (Untrustworthy Input + High Privilege)

**The Concept:** Sometimes a feature needs high privilege (like interacting directly with the network stack or filesystem) while also handling data from the web. To do this safely, we eliminate the "Unsafe Language" factor.

**How it works:** We use memory-safe languages like **Rust** or **Typescript**. Since these languages prevent buffer overflows and "use-after-free" bugs at the compiler level, we don't need a sandbox. The language itself serves as the security boundary.

**Mojo's Role:** Mojo allows these safe components to expose interfaces to the rest of the C++ browser.

**Typescript/Javascript Solution:**

Used for chrome:// pages (WebUI). These pages handle user input and run in the privileged Browser process.

```typescript
// LOCATION: //chrome/browser/resources/settings/privacy_page.ts
import {PrivacyBridge} from './mojom_webui/privacy_bridge.mojom-webui.js';

async function updatePrivacySetting(enabled: boolean) {
  const bridge \= PrivacyBridge.getRemote();
  // Typescript handles UNTRUSTED input in a HIGH PRIVILEGE process.
  // It is safe because Typescript is a SAFE language.
  await bridge.setPrivacyEnabled(enabled);
}
```

**Rust Example:**

Rust is increasingly used for high-performance, privileged tasks like QR code generation or network header parsing.

```rust
// LOCATION: //components/qr_code_generator/qr_code_generator.rs
pub fn generate_qr_code(input_text: \&str) \-\> Vec\<u8\> {
  // We handle UNTRUSTED text in a HIGH PRIVILEGE process.
  // This is safe because Rust is a SAFE language.
  let code \= qrcode::QrCode::new(input_text).unwrap();
  code.render::\<Luma\<u8\>\>().build().to_vec()
}
```

### Combination 3: Trustworthy Data (Unsafe Language + High Privilege)

**The Concept:** If we must use C++ in a privileged process, we must ensure the data it touches is not "Untrustworthy." We eliminate the "Untrustworthy Input" factor.

**How it works:** We strictly limit the input to data that the browser itself created or data that is cryptographically signed and verified (e.g., a component update from Google). Since an attacker cannot manipulate this data, they cannot trigger a latent memory bug in the C++ code.

**Mojo's Role:** The privileged process uses Mojo to receive data, but it performs a "Verification" check immediately at the IPC boundary.

**C++ Example:**

```cpp
// LOCATION: //chrome/browser/component_updater/config_loader.cc
void ConfigLoader::OnConfigReceived(const std::string& signed_data) {
  // We use an UNSAFE language with HIGH PRIVILEGE.
  // This is only allowed if the input is TRUSTWORTHY.

  if (!VerifyGoogleSignature(signed_data)) {
    // If the data is untrusted, we kill the sender immediately.
    mojo::ReportBadMessage("Unverified component update received!");
    return;
  }

  // Now that the data is verified as TRUSTWORTHY, C++ can safely parse it.
  ParseComplexJson(signed_data);
}
```

## Why this is an Effective Mitigation

* **Isolation:** If the Renderer (Combination 1) is hacked via a JS exploit, Mojo ensures the attacker cannot reach the filesystem because the process lacks OS-level privileges.
* **Validation:** Mojo's generated code performs automatic bounds-checking. You cannot send 100 bytes if the interface expects 50.
* **Zero-Trust:** Privileged processes treat all incoming Mojo messages as malicious by default. If a message violates the .mojom contract, the receiver terminates the sender immediately (mojo::ReportBadMessage).

## Source of Examples & Verification

The examples provided in this guide represent actual architectural patterns used in the **Chromium Open Source Project**.

### How to Find the Code

You can verify and explore the real-world versions of these patterns using [Chromium Code Search](https://source.chromium.org/chromium/chromium/src).

* **For Combination 1 (Sandbox):** Search for `//services/data_decoder/`. This directory contains various sandboxed utilities for parsing images, XML, and JSON.
* **For Combination 2 (Rust/WebUI):**
  * Search for `//components/qr_code_generator/` to see how Rust is integrated.
  * Search for `//chrome/browser/resources/settings/` to see Typescript WebUI implementations.
* **For Combination 3 (Verification):** Search for `//components/component_updater/` to see how the browser securely downloads and verifies signed binary components.

## Appendix: Mojo IDL vs. Web IDL

Because Chromium operates at the intersection of internal systems and web standards, developers often encounter two different types of IDL. While they share a similar name, they serve entirely different layers of the browser:

| Feature | Mojo IDL (.mojom) | Web IDL (.idl) |
| :----: | ---- | ---- |
| **Purpose** | **Internal IPC:** Communication between Chromium processes. | **Public Web API:** Communication between the browser engine and JS. |
| **Standard** | Proprietary to the Chromium project. | Standardized by W3C / WHATWG. See [webidl.spec.whatwg.org](https://webidl.spec.whatwg.org/) |
| **Usage** | Connects the Renderer to the Browser or Utility processes. | Defines the APIs web developers use (e.g., DOM, Fetch). |

In a typical feature, a web developer calls a Javascript API defined in **Web IDL**. That call is handled by the Blink engine, which then uses a **Mojo IDL** interface to request privileged actions (like accessing the camera) from the Browser process.

## Appendix: Memory Safety in Typescript and Javascript

One might wonder why Typescript is considered a "memory-safe" language for the Rule of Two, especially since it allows you to ignore errors and generate Javascript anyway. The answer lies in the execution environment.

### The Runtime is the Guardian

In Chromium, Typescript eventually runs as Javascript inside the **V8 Engine**. Unlike C++, where the programmer manages memory manually (using pointers, malloc, and free), V8 provides a "sealed" environment:

* **Automatic Garbage Collection:** You don't manually free memory, which eliminates "Use-After-Free" bugs.
* **No Raw Pointers:** Javascript has no concept of a memory address. You cannot "cast" an integer to a pointer to read arbitrary memory.
* **Strict Bounds Checking:** If you access an index outside of an array's bounds, V8 returns undefined or throws an error rather than reading raw data from the heap.

### Logic Safety vs. Memory Safety

The "errors" you see in Typescript are primarily about **type safety** and **logic**. If you ignore a Typescript error and ship buggy code:

1. The program might **crash** with a TypeError.
2. It might perform the wrong calculation.
3. **It will not allow an attacker to read the browser's memory or execute arbitrary shellcode**.

In the context of the Rule of Two, a **crash** (Denial of Service) is acceptable because it does not compromise the user's system. Memory safety means the language runtime prevents an attacker from breaking the rules of the memory heap, and V8 ensures this for every line of Javascript it executes.
