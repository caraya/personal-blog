---
name: rust-debugging
description: "Rust debugging skill for diagnosing borrow checker errors, panics, undefined behavior in unsafe code, and runtime analysis using GDB, LLDB, and cargo tools. Trigger phrases: Rust debug, borrow checker error, panic, lifetime error, segfault, LLDB, GDB, cargo test failure, unsafe bug."
---

# Rust Debugging

## Use When

- Diagnosing borrow checker, lifetime, or type errors at compile time.
- Investigating runtime panics, segfaults, or logic errors.
- Debugging unsafe Rust or FFI boundaries.
- Tracing async Rust task failures.

## Setup and Tools

1. **Compiler messages**
- Read the full `rustc` error output; it includes explanations and fix suggestions.
- Use `rustc --explain E<code>` for detailed explanations of error codes.
- Enable `RUST_BACKTRACE=1` for panic backtraces at runtime.

2. **Debuggers**
- **LLDB** (macOS/Linux): `rust-lldb target/debug/<binary>` for interactive debugging.
- **GDB** (Linux): `rust-gdb target/debug/<binary>` with Rust pretty-printers.
- **VS Code**: Use the `CodeLLDB` extension with a `launch.json` configuration.

3. **Cargo tools**
- `cargo check`: Fast compile check without linking; catches most errors.
- `cargo clippy`: Linter with idiomatic suggestions and common pitfalls.
- `cargo test -- --nocapture`: Show `println!` output during test runs.
- `cargo expand`: Expand macros to inspect generated code.

4. **Async debugging**
- `tokio-console`: Real-time task inspection for Tokio async runtimes.
- Enable `TOKIO_CONSOLE=1` with the `console-subscriber` crate.

## Checklist

1. Compile-time errors
- Read the full error message, not just the first line.
- Follow the "help" and "note" hints from `rustc`; they often contain the fix.
- Check if a lifetime error is from a structural design issue (e.g., self-referential struct).

2. Runtime panics
- Set `RUST_BACKTRACE=1` (or `RUST_BACKTRACE=full`) to get a full trace.
- Look for index out of bounds, unwrap on None/Err, integer overflow in debug mode.
- Add `cargo test -- --nocapture` to see output during failing tests.

3. Unsafe and FFI
- Check that all invariants documented in safety comments are upheld.
- Use `cargo miri` to detect undefined behavior in unsafe code.
- Verify raw pointer lifetimes and aliasing rules.

4. Async task issues
- Check for tasks blocked on a mutex inside an async context (use `tokio::sync::Mutex`).
- Verify futures are not dropped before completion.
- Use `tokio-console` to inspect task state and identify deadlocks or stalls.

## Output Requirements

For each finding provide:
- Compile error code or runtime symptom
- Root cause (ownership, lifetime, panic, unsafe, async)
- Evidence (backtrace, error message, compiler note)
- Minimal fix with code example
