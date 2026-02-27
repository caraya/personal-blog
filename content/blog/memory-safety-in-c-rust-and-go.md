---
title: Memory Safety In C, Rust And Go
date: 2026-04-01
tags:
  - Memory Safety
  - Security
  - Programming Languages
---

Memory safety has become a critical concern in modern software development. The Cybersecurity and Infrastructure Security Agency (CISA) has published two advisories underlining the urgency of addressing memory safety vulnerabilities in widely used software components. In 2023, they published [The Urgent Need for Memory Safety in Software Products](https://www.cisa.gov/news-events/news/urgent-need-memory-safety-software-products), followed by [Memory Safe Languages: Reducing Vulnerabilities in Modern Software Development](https://media.defense.gov/2025/Jun/23/2003742198/-1/-1/0/CSI_MEMORY_SAFE_LANGUAGES_REDUCING_VULNERABILITIES_IN_MODERN_SOFTWARE_DEVELOPMENT.PDF) in 2025.

Languages like C, while powerful and performant, leave memory management entirely in the hands of the programmer. This manual control frequently leads to vulnerabilities such as buffer overflows, memory leaks, and use-after-free errors. In contrast, modern languages like Go and Rust introduce mechanisms to ensure memory safety, either through automated garbage collection or strict compile-time checks.

This post explores the spectrum of memory management, from the manual control of C to the automated safety of Go and Rust.

## Memory Issues in the C Language

In C and C++, the programmer is responsible for the entire lifecycle of memory on the heap. While this manual control provides exceptional performance, it introduces several critical security risks.

### Memory Leaks

A memory leak occurs when an application allocates memory but loses the pointer to it before calling free().

```c
void create_leak() {
  int *ptr = (int *)malloc(10 * sizeof(int));
  // If the function returns without calling free(ptr), the memory is lost.
  return;
}
```

### Is the memory lost permanently?

When an application loses a pointer, the memory is lost to the running process, but not permanently to the computer's hardware.

* **Process Scope**: While the program runs, the operating system marks that memory as "in use." Because the application no longer holds the address (the pointer), the code cannot access, use, or free it. It becomes "dead weight" that consumes available RAM.
* **OS Reclamation**: Once the program terminates (whether it exits normally or crashes), the operating system reclaims all memory associated with that process, including any leaked blocks.
* **The Danger**: Leaks are catastrophic for long-running programs like web servers or operating system kernels. If a server leaks memory slowly over weeks, it eventually exhausts all system RAM, causing the OS to trigger an OOM (Out of Memory) Killer to force-terminate the process.

### Buffer Overflows and Underflows

C does not perform bounds checking. This omission leads to two symmetrical but distinct dangers:

#### Buffer Overflow

An overflow occurs when an application writes data past the end of an allocated buffer.

```c
void overflow() {
  char buffer[8];
  // Entering a 16-character string into an 8-character buffer.
  // Note: gets() is inherently unsafe and deprecated for this exact reason.
  gets(buffer);
}
```

* **Stack Smashing**: If the buffer resides on the stack, an attacker can overwrite the function's "return address." This allows the attacker to redirect the CPU to execute their own malicious code (shellcode).
* **Data Corruption**: Overflows can overwrite adjacent variables, altering program logic (e.g., flipping an is_authenticated boolean from false to true).

#### Buffer Underflow

An underflow occurs when an application accesses memory before the beginning of a buffer. This often happens due to "off-by-one" errors in loops or improper pointer arithmetic.

```c
void underflow() {
  int arr[5] = {1, 2, 3, 4, 5};
  int *ptr = arr;
  ptr--;        // Pointing to memory BEFORE the array
  int x = *ptr; // Reading "garbage" or sensitive stack data
}
```

* **Information Leakage**: Attackers frequently use underflows to read sensitive data (like encryption keys or passwords) stored in memory addresses located just before the targeted buffer.
* **System Instability**: Writing to memory before a buffer can corrupt the metadata used by malloc (the heap header), leading to a "double free" crash or arbitrary code execution.

#### Use-After-Free and Dangling Pointers

A Use-After-Free (UAF) vulnerability occurs when an application continues to use a pointer after explicitly freeing the associated memory. The pointer becomes a "dangling pointer" because it points to memory that the system may have already reallocated for a different purpose.

```c
int *ptr = malloc(sizeof(int));
*ptr = 100;
free(ptr);
// ... some other code runs ...
printf("%d", *ptr); // DANGER: Accessing a dangling pointer
```

#### The Security Risks

UAF vulnerabilities are among the most exploited bugs in modern software because they provide attackers with high-level control over program execution:

* **Arbitrary Code Execution**: If the memory previously occupied by an object is reallocated to store a new object—specifically one containing function pointers or a "vtable"—an attacker can carefully craft data to overwrite those pointers. When the original code attempts to use the dangling pointer to call a function, it executes the attacker's code instead.
* **Information Disclosure**: If the memory is reallocated to store sensitive data (like a private key or a password), accessing the dangling pointer allows an attacker to read that data from a different context.
* **Privilege Escalation**: By corrupting kernel-level objects through UAF bugs, attackers can gain administrative or "root" access to an entire system.

Because the behavior of a UAF bug depends entirely on what the system reallocates the memory for, these bugs often appear non-deterministic and are notoriously difficult to debug without specialized tools like AddressSanitizer (ASan).

## Do These Problems Exist in C++?

Yes. Because C++ is compatible with C, it permits "C-style" manual memory management (using raw pointers, new, and delete).

C++11 and later standards mitigate these risks with:

* **Smart Pointers**: std::unique_ptr and std::shared_ptr automate deallocation.
* **RAII**: Resource Acquisition Is Initialization ensures objects reliably manage their own cleanup.

However, C++ remains fundamentally memory-unsafe because it allows developers to opt into the unsafe memory management techniques inherited from C.

## How Memory-Safe Languages Solve the Problem

### Go: The Garbage Collection (GC) Approach

Go achieves memory safety by removing manual deallocation entirely.

* **Automatic Cleanup**: A Garbage Collector periodically identifies and frees unreachable memory.
* **Safety**: Applications cannot trigger a "use-after-free" error because the GC only deletes memory that is no longer referenced by the program.
* **Runtime Checking**: Go evaluates array indices at runtime and stops the program (panics) if code attempts to read or write out of bounds.

### Rust: The Ownership and Borrowing Approach

Rust provides memory safety without a garbage collector by enforcing a strict set of ownership rules at compile time.

* **Ownership**: Every piece of data has a single designated "owner" variable. When that owner goes out of scope, the compiler automatically inserts the code to free the memory.
* **Borrowing**: Developers can temporarily "borrow" access to data using references. The compiler ensures these references never outlive the original data, making dangling pointers impossible.
* **Compile-Time Checking**: The Rust compiler strictly enforces these rules before the program runs. If the code violates memory safety, it simply refuses to compile.
* **Zero-Cost Abstractions**: Because memory management resolves entirely during compilation, Rust applications experience no runtime overhead or garbage collection pauses.

## Deep Dive: Go and "Stop-The-World" (STW)

In garbage-collected languages, "Stop-The-World" (STW) refers to the period where the runtime pauses all execution threads to safely perform memory cleanup.

### How Go Minimizes STW

Historically, garbage collectors paused the application for the entire duration of the cleanup process, causing noticeable lag. Go mitigates this by utilizing a Concurrent Mark-and-Sweep collector. It breaks the collection process into distinct phases to keep STW pauses consistently under 1 millisecond.

1. **Phase 1: Sweep Termination (STW)**: The runtime briefly pauses the application to ensure all previous sweep work is finished and to enable the "Write Barrier."
2. **Phase 2: Marking (Concurrent)**: The GC identifies reachable memory alongside executing application code. The active Write Barrier ensures that if the application creates any new pointers during this phase, the GC records them for scanning.
3. **Phase 3: Mark Termination (STW)**: The GC pauses the application a second time to process any remaining pointers caught by the Write Barrier, finalize the marking phase, and turn the barrier off.
4. **Phase 4: Sweeping (Concurrent)**: The GC safely releases unused memory back to the operating system while the application continues running.

### The Trade-off: Latency vs. Throughput

To achieve sub-millisecond pauses, Go prioritizes low latency over overall throughput.

During the concurrent marking phase (Phase 2), the Go garbage collector consumes roughly 25% of the available CPU capacity. If a web server handles heavy traffic, giving up a quarter of its processing power to the GC can momentarily reduce the total number of requests it can handle per second. While the application never visually "freezes," it actively competes with its own garbage collector for CPU cycles.

### Tuning the Go GC

Developers can manage this latency-throughput trade-off by instructing the Go runtime on how aggressive the garbage collector should be:

* **`GOGC` Variable**: This environment variable controls the GC target percentage. The default is 100, meaning the GC triggers when the heap size doubles. Increasing this number delays the GC, using more memory but freeing up CPU.
* **`GOMEMLIMIT` Variable (Go 1.19+)**: This variable sets a soft memory limit. It allows developers to configure a highly relaxed GOGC for maximum CPU throughput, while still guaranteeing the GC will step in aggressively before the application hits a container's hard memory limit.

### Can STW Events Cause Crashes?

While STW events typically only cause "jitter" (latency spikes), they can lead to application failure or system-level "crashes" in highly specific scenarios:

* **Heartbeat Failures**: In distributed systems, if an STW pause outlasts the heartbeat timeout, the cluster may incorrectly declare the node "dead."
* **OOM (Out of Memory) Killers**: If memory pressure spikes dramatically during an STW pause, the OS might kill the process before the GC has a chance to reclaim space.
* **Buffer Overruns in Drivers**: An STW pause might cause a hardware buffer to overflow because the application pauses and cannot "drain" the incoming data fast enough.

## Deep Dive: The Rust Borrow Checker

The Borrow Checker is a static analysis tool built into the Rust compiler that enforces the "Aliasing XOR Mutability" rule (data can either be aliased or mutated, but never both at the same time).

### How it Works

* **Ownership**: Every value has exactly one owner. When the owner goes out of scope, the compiler automatically inserts code to free the memory.
* **Lifetime Analysis**: The compiler ensures a reference never outlives the data it points to, completely eliminating dangling pointers.
* **Non-Lexical Lifetimes (NLL)**: The compiler is smart enough to end a "borrow" as soon as the reference is used for the final time, rather than waiting for the end of the code block.

**Example: Prevented at Compile-Time**

```rust
fn main() {
  let mut data = vec![1, 2, 3];
  let reference = &data[0];

  // ERROR: Cannot mutate the vector while an active reference exists!
  data.push(4);

  println!("{}", reference);
}
```

### Impact on Compilation Time

* **Analysis Overhead**: The compiler performs complex data-flow analysis on every possible execution path.
* **Relative Cost**: Borrow Checking usually accounts for 10–20% of total compilation time.
* **Bottleneck**: LLVM Optimization (which accounts for 60–80% of total compilation time) remains the primary reason for slow Rust builds, rather than the borrow checker itself.

Summary Comparison

| Feature | C / C++ (Raw) | Go | Rust |
| --- | --- | --- | --- |
| Allocation | Manual | Automatic (GC) | Automatic (Ownership) |
| Safety Check | None | Runtime | Compile-time |
| Performance | Highest | High (Concurrent GC) | Highest (Zero-cost abstractions) |
| Build Speed | Fast | Very Fast | Slower |
| Primary Risk | Memory Corruption | STW Latency / Jitter | Compile-time Errors |

## Industry Adoption: Go in Large Codebases

Organizations managing high-throughput, concurrent systems frequently migrate legacy C and C++ services to Go. Go's automated memory safety, robust concurrency model, and developer velocity make it an ideal choice for network-bound infrastructure. Notably, the migrations highlighted below represent full system replacements rather than maintaining an ongoing interface with existing C/C++ code. Companies often choose complete rewrites to avoid the significant performance penalty associated with cross-language cgo calls and to fully isolate their services from legacy memory vulnerabilities.

### Cockroach Labs

CockroachDB originally relied on RocksDB, a highly optimized C++ key-value store, for its underlying storage engine. The team eventually rewrote the engine entirely in Go to create a new storage engine named Pebble.

* **Why Go?** A native Go implementation prevented C++ memory management issues from crashing the primary Go application.
* **Interfacing**: Full replacement. This complete migration explicitly eliminated the performance overhead of cross-language cgo calls.

### SendGrid

SendGrid completely rewrote its core email delivery engine—originally written in a mix of C and Perl—into native Go.

* **Why Go?** The shift allowed SendGrid to handle millions of concurrent socket connections safely, completely eliminating the constant risk of buffer overflows and manual memory management bugs inherent in the legacy C codebase.
* **Interfacing**: Full replacement. The engineering team entirely retired the legacy C engine to run the new microservice independently.

### Dropbox

Dropbox migrated major portions of its performance-critical backend infrastructure from a mix of Python and C++ to Go.

* **Why Go?** Go provided the low-latency performance required for heavy file synchronization while significantly reducing the memory corruption vulnerabilities associated with maintaining older C++ services.
* **Interfacing**: Full replacement. Dropbox isolated these new services natively in Go rather than writing wrappers around legacy C++ code.

### Uber

Uber migrated many of its highest-throughput routing and geofencing systems, previously written in C++ and Node.js, to Go.

* **Why Go?** Go's native garbage collection and goroutines allowed Uber engineers to handle hundreds of thousands of concurrent geographic queries safely, making the systems dramatically easier for product teams to maintain.
* **Interfacing**: Full replacement. Uber rewrote these specific microservices entirely in Go to utilize its native concurrency capabilities to the fullest.

## Industry Adoption: Rust in Large Codebases

Because memory safety bugs account for approximately 70% of high-severity security vulnerabilities in large C/C++ projects, several industry giants are actively migrating critical components to Rust.

### Android (Google)

Android has increasingly moved toward Rust for system components, including the DNS-over-TLS resolver and the Bluetooth stack.

* **Why Rust?** Google's internal research found that memory safety vulnerabilities were the leading cause of security patches in the Android OS.
* **Interfacing**: Android utilizes Bindgen to automatically generate safe Rust wrappers for existing C headers.

### Chromium (Google)

The engine behind Google Chrome now permits Rust for specific high-risk components to satisfy the project's internal [Rule of Two](https://chromium.googlesource.com/chromium/src/+/master/docs/security/rule-of-2.md) &mdash; a security principle dictating that a software component may possess no more than two of the following three traits: handling untrusted input, running without a sandbox (high privilege), and being written in an unsafe language like C/C++.

* **Why Rust?**
  * **Memory Safety at Source**: Chrome's security team noted that while sandboxing C++ code is effective, it carries high performance and complexity overhead. Rust provides the same safety within a single process, eliminating the need for expensive IPC (Inter-Process Communication) sandboxes for smaller utilities.
  * **Developer Velocity**: Rust empowers developers to write complex parsing logic (like image decoders) without the constant fear of introducing a critical security vulnerability that requires an emergency "zero-day" patch.
  * **The "Rule of Two" Compliance**: By migrating to a memory-safe language like Rust, developers eliminate the "unsafe language" trait. This allows them to securely handle untrusted input at high privilege levels (without a sandbox) while remaining fully compliant with the security rule.
* **High-Risk Examples:**
  * **QR Code Generator**: One of the first production uses of Rust in Chrome.
  * **V8 Temporal API**: Implements highly complex date and time logic.
  * **AVIF Decoding**: Decodes complex image files using the crabbyavif crate.
* **Interfacing**: Chromium uses cxx to create a secure, safe bridge between C++ and Rust.

### The Linux Kernel

In 2022, the Linux Kernel officially merged support for Rust, making it the second "first-class" language for kernel development.

* **Why Rust?** Kernel panics resulting from memory bugs are catastrophic for system stability.
* **Interfacing**: The kernel team built a "veneer" system of thin C wrappers and safe Rust abstractions to communicate securely.

### Windows (Microsoft)

Microsoft is currently rewriting core parts of the Windows kernel—specifically the GDI and portions of the kernel's win32k subsystem—in Rust.

* **Why Rust?** Microsoft's primary goal is to eliminate entire classes of "zero-day" vulnerabilities at the source level.
* **Interfacing**: They use the windows-rs crate to call Windows APIs natively and safely from within Rust.

### AWS (Amazon Web Services)

AWS relies on Rust for its high-performance infrastructure, notably in products like Firecracker (the microVM engine powering AWS Lambda).

* **Why Rust?** AWS requires the raw performance of C to maintain minimal overhead, but cannot risk guest-to-host "breakout" vulnerabilities in a multi-tenant cloud environment.
* **Interfacing**: Firecracker interfaces directly with the Linux KVM (Kernel Virtual Machine) via standard ioctl system calls.
