---
title: Memory Safety In C, Rust And Go
date: 2026-04-01
---

Memory safety has become a critical concern in modern software development. The Cybersecurity and Infrastructure Security Agency (CISA) has published two advisories underlining the urgency of addressing memory safety vulnerabilities in widely used software components. In 2023 they published [The Urgent Need for Memory Safety in Software Products](https://www.cisa.gov/news-events/news/urgent-need-memory-safety-software-products) and in 2025 [](https://media.defense.gov/2025/Jun/23/2003742198/-1/-1/0/CSI_MEMORY_SAFE_LANGUAGES_REDUCING_VULNERABILITIES_IN_MODERN_SOFTWARE_DEVELOPMENT.PDF)

Languages like C, while powerful and performant, leave memory management in the hands of the programmer, leading to vulnerabilities such as buffer overflows, memory leaks, and use-after-free errors. In contrast, languages like Go and Rust have introduced mechanisms to ensure memory safety, either through garbage collection or strict compile-time checks.

This post explores memory management, from the manual control of C to the automated safety of Go and Rust.

## Memory Issues in the C Language

In C and C++, the programmer is responsible for the entire lifecycle of memory on the heap. This manual control provides performance but introduces several critical risks.

### **A. Memory Leaks**

A leak occurs when you allocate memory but lose the pointer to it before calling free().

```c
void create_leak() {
  int *ptr = (int *)malloc(10 * sizeof(int));
  // If we return without calling free(ptr), the memory is lost.
  return;
}
```

**Is the memory lost permanently?**

When you lose a pointer, the memory is lost to your **running process**, but not permanently to the computer's hardware.

* **Process Scope:** While your program is running, that memory remains marked as "in use." Since you no longer have the address (the pointer), your code cannot access, use, or free it. It becomes "dead weight" that reduces available RAM.
* **OS Reclamation:** Once your program terminates (whether it exits normally or crashes), the operating system reclaims all memory associated with that process, including any leaked blocks.
* **The Danger:** Leaks are catastrophic for **long-running programs** like web servers or operating system kernels. If a server leaks memory slowly over weeks, it will eventually exhaust all system RAM, causing the OS to trigger an **OOM (Out of Memory) Killer** to force-terminate the process.

### B. Buffer Overflows (and Underflows)

C does not perform bounds checking. This leads to two symmetrical but distinct dangers:

#### **Buffer Overflow**

This occurs when you write data **past the end** of an allocated buffer.

```c
void overflow() {
  char buffer[8];
  // Entering a 16-character string into an 8-character buffer
  gets(buffer);
}
```

* **Stack Smashing:** If the buffer is on the stack, an attacker can overwrite the "return address" of the function. This allows them to redirect the CPU to execute their own malicious code (shellcode).
* **Data Corruption:** Overflows can overwrite adjacent variables, changing program logic (e.g., flipping an `is_authenticated` boolean from false to true).

#### **Buffer Underflow**

This occurs when you access memory **before the beginning** of a buffer. This often happens due to "off-by-one" errors in loops or improper pointer arithmetic.

```c
void underflow() {
  int arr[5] = {1, 2, 3, 4, 5};
  int *ptr = arr;
  ptr--;      // Pointing to memory BEFORE the array
  int x = *ptr; // Reading "garbage" or sensitive stack data
}
```

* **Information Leakage:** Underflows are frequently used to read sensitive data (like encryption keys or passwords) that happens to be stored in memory addresses just before the targeted buffer.
* **System Instability:** Writing to memory before a buffer can corrupt the metadata used by malloc (the heap header), leading to a "double free" crash or arbitrary code execution.

### C. Use-After-Free & Dangling Pointers

A **Use-After-Free (UAF)** vulnerability occurs when an application continues to use a pointer after it has been explicitly freed. The pointer is now a "dangling pointer" because it points to memory that the system may have already reallocated for a different purpose.

```c
int *ptr = malloc(sizeof(int));
*ptr = 100;
free(ptr);
// ... some other code runs ...
printf("%d", *ptr); // DANGER: Accessing dangling pointer
```

#### The Security Risks

UAF vulnerabilities are among the most exploited bugs in modern software because they provide attackers with high-level control over program execution:

* **Arbitrary Code Execution:** If the memory previously occupied by an object is reallocated to store a new object &mdash; specifically one containing function pointers or a "vtable" &mdash; an attacker can carefully craft data to overwrite those pointers. When the original code attempts to use the dangling pointer to call a function, it executes the attacker's code instead.
* **Information Disclosure:** If the memory is reallocated to store sensitive data (like a private key or a password), accessing the dangling pointer allows an attacker to read that data from a different context.
* **Privilege Escalation:** By corrupting kernel-level objects through UAF bugs, attackers can gain administrative or "root" access to an entire system.

Because the behavior of a UAF bug depends on what the memory is reallocated for, these bugs often appear non-deterministic and are notoriously difficult to debug without specialized tools like AddressSanitizer (ASan).

## Do these problems exist in C++?

**Yes.** C++ is compatible with C and allows "C-style" manual memory management (raw pointers, new/delete).

C++11 and later mitigate these with:

* **Smart Pointers:** `std::unique_ptr` and `std::shared_ptr` automate deallocation.
* **RAII:** Resource Acquisition Is Initialization ensures objects manage their own cleanup.

However, C++ remains **memory-unsafe** because it still allows unsafe memory management inherited from C.

## 3. How Memory-Safe Languages Solve the Problem

### Go: The Garbage Collection (GC) Approach

Go solves safety by removing manual deallocation entirely.

* **Automatic Cleanup:** A Garbage Collector periodically identifies and frees unreachable memory.
* **Safety:** You cannot "use-after-free" because the GC only deletes memory that is no longer referenced.
* **Runtime Checking:** Go checks array indices at runtime and stops the program (panics) if you go out of bounds.

### Rust: The Ownership and Borrowing Approach

Rust provides safety **without** a garbage collector by using a set of rules enforced at compile time.

## 4. Deep Dive: Go and "Stop-The-World" (STW)

In garbage-collected languages, "Stop-The-World" refers to the period where the runtime pauses all execution threads to safely perform memory cleanup.

### How Go Minimizes STW

Go uses a **Concurrent Mark-and-Sweep** collector. It breaks the process into phases to keep STW pauses under 1 millisecond.

1. **Phase 1: Sweep Termination (STW):** The GC ensures all previous sweep work is finished.
2. **Phase 2: Marking (Concurrent):** The GC runs alongside your application code.
3. **Phase 3: Mark Termination (STW):** The GC pauses the app again to finalize marking and turn off write barriers.
4. **Phase 4: Sweeping (Concurrent):** The GC releases memory while the application runs.

### Can STW Events Cause Crashes?

While STW events usually only cause "jitter" (latency spikes), they can lead to application failure or system-level "crashes" in specific scenarios:

* **Heartbeat Failures:** In distributed systems, if an STW pause lasts longer than the heartbeat timeout, the cluster may declare the node "dead."
* **OOM Killers (Out of Memory):** If memory pressure spikes during an STW pause, the OS might kill the process before the GC can reclaim space.
* **Buffer Overruns in Drivers:** An STW pause might cause a hardware buffer to overflow because the application isn't "draining" data fast enough.

## Deep Dive: The Rust Borrow Checker

The Borrow Checker is a static analysis tool that enforces the "Aliasing XOR Mutability" rule.

### How it Works

1. **Ownership:** Every value has one owner. When the owner goes out of scope, the memory is freed.
2. **Lifetime Analysis:** The compiler ensures a reference never outlives the data it points to.
3. **Non-Lexical Lifetimes (NLL):** The compiler ends a "borrow" as soon as the reference is last used.

#### **Example: Prevented at Compile-Time**

```rust
fn main() {
  let mut data = vec![1, 2, 3];
  let reference = &data[0];

  data.push(4); // ERROR: Cannot mutate while borrowed!

  println!("{}", reference);
}
```

### Impact on Compilation Time

* **Analysis Overhead:** Complex data-flow analysis on every execution path.
* **Relative Cost:** Borrow Checking usually accounts for **10–20%** of total compilation time.
* **Bottleneck:** **LLVM Optimization** (accounting for 60–80% of total compilation time) remains the primary reason for slow builds.

## Summary Comparison

| Feature | C / C++ (Raw) | Go | Rust |
| :---- | :---- | :---- | :---- |
| **Allocation** | Manual | Automatic (GC) | Automatic (Ownership) |
| **Safety Check** | None | Runtime | Compile-time |
| **Performance** | Highest | High (Concurrent GC) | Highest (Zero-cost) |
| **Build Speed** | Fast | Very Fast | Slower |
| **Risk** | Memory Corrupt | STW Latency/Jitter | Compile-time Errors |

## Industry Adoption: Rust in Large Codebases

As memory safety bugs account for approximately 70% of high-severity security vulnerabilities in large C/C++ projects, several industry giants have begun migrating critical components to Rust.

### Android (Google)

Android has increasingly moved toward Rust for system components (like the DNS-over-TLS resolver and the Bluetooth stack).

* **Why Rust?** Google found that memory safety vulnerabilities were the leading cause of security patches.
* **Interfacing:** Android uses **Bindgen** to generate Rust wrappers for C headers.

### Chromium (Google)

The engine behind Chrome now allows Rust for specific high-risk components to satisfy the **"Rule of Two"**.

* **Why Rust?**
  * **Memory Safety at Source**: Chrome's security team noted that sandboxing C++ code is effective but carries high performance and complexity overhead. Rust provides the same safety within a single process, eliminating the need for expensive IPC (Inter-Process Communication) sandboxes for every small utility.
  * **Developer Velocity**: Rust allows developers to write complex parsing logic (like image decoders) without the constant fear of introducing a critical security vulnerability that would require an emergency "zero-day" patch.
  * **The "Rule of Two" Compliance**: Chromium follows a rule where a component can only have two of three properties: 1. Handles untrusted input, 2. Runs without a sandbox (high privilege), 3. Written in an unsafe language (C++). By using Rust, they can handle untrusted input at high privilege while remaining secure.
* **High-Risk Examples:**
  * **QR Code Generator:** One of the first production uses of Rust in Chrome.
  * **V8 Temporal API:** Implements complex date and time logic.
  * **AVIF Decoding:** Decodes complex image files using the **crabbyavif** crate.
* **Interfacing:** Chromium uses **cxx** to create a safe bridge between C++ and Rust.

### The Linux Kernel

In 2022, the Linux Kernel officially merged support for Rust as a second "first-class" language.

* **Why Rust?** Kernel panics from memory bugs are catastrophic.
* **Interfacing:** The kernel uses a "veneer" system of thin C wrappers and safe Rust abstractions.

### Windows (Microsoft)

Microsoft is rewriting core parts of the Windows kernel (specifically the GDI and parts of the kernel's win32k subsystem) in Rust.

* **Why Rust?** Aiming to eliminate entire classes of "zero-day" vulnerabilities.
* **Interfacing:** They use **windows-rs** to call Windows APIs natively in Rust.

### AWS (Amazon Web Services)

AWS uses Rust for its high-performance infrastructure, including Firecracker.

* **Why Rust?** AWS needs performance without the risk of guest-to-host "breakouts."
* **Interfacing:** Interfaces with the Linux **KVM** via standard ioctl system calls.
