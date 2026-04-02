---
name: rust-performance
description: "Rust performance skill for profiling, benchmarking, allocation analysis, and optimization using criterion, perf, flamegraph, and cargo tools. Trigger phrases: Rust performance, benchmark, criterion, allocation, flamegraph, perf, slow compilation, SIMD, zero-cost abstraction."
---

# Rust Performance

## Use When

- Profiling Rust applications for CPU, memory, or latency bottlenecks.
- Benchmarking hot paths with criterion.
- Analyzing allocation patterns and reducing heap usage.
- Optimizing compilation time in large workspaces.

## Profiling Tools

1. **Benchmarking**
- `criterion`: Statistical benchmarking library.
  - Add to `Cargo.toml`: `criterion = { version = "0.5", features = ["html_reports"] }`.
  - Run: `cargo bench`.
- `cargo bench` (built-in): Simple benchmarks via `#[bench]` (nightly only).

2. **CPU profiling**
- **perf** (Linux): `perf record -g cargo run --release && perf report`.
- **Instruments** (macOS): Use with `cargo build --release` and attach to process.
- **flamegraph**: `cargo flamegraph` generates SVG flame graphs.

3. **Memory and allocation analysis**
- **heaptrack** (Linux): Tracks heap allocations with call stacks.
- **dhat** (via valgrind): Detailed heap profiling.
- **jemalloc with stats**: Use `tikv-jemallocator` for allocation statistics.

4. **Compilation performance**
- `cargo build --timings`: Generates HTML report of crate build times.
- `cargo llvm-lines`: Shows which functions generate the most LLVM IR lines.

## Checklist

1. Benchmarking and baselines
- Use `criterion` for reliable, statistically valid micro-benchmarks.
- Always benchmark release builds (`cargo bench` uses release by default).
- Establish a baseline before and after optimizations.

2. CPU and hot paths
- Profile with flamegraph to find high-CPU functions.
- Avoid unnecessary clones, allocations, and copies in hot paths.
- Use iterators with zero-cost abstractions; prefer `iter()` over manual indexing.

3. Memory and allocations
- Use `cargo bench` with `--features dhat-heap` to count allocations per operation.
- Preallocate `Vec` and `HashMap` with `with_capacity()` when size is known.
- Use `Box`, `Rc`, or `Arc` only at ownership boundaries, not for routine values.
- Consider stack allocation or arena allocators for high-frequency short-lived objects.

4. Compilation time
- Use `cargo build --timings` to find slow-compiling crates.
- Reduce generic monomorphization: avoid deeply nested generics in hot paths.
- Split large modules into smaller crates to enable parallel compilation.
- Use `dylib` for frequently rebuilt dev dependencies when appropriate.

5. Async performance
- Avoid blocking calls inside async tasks; use `spawn_blocking` for CPU-heavy work.
- Minimize `Arc<Mutex<T>>` contention; prefer message-passing via channels.
- Check task scheduling with `tokio-console` for stalls or starvation.

## Output Requirements

For each finding provide:
- Measurement (criterion output, flamegraph, allocation count).
- Root cause (CPU, allocation, clone, async contention, compile time).
- Optimization strategy with expected improvement.
- Effort and risk assessment (safe vs. unsafe optimization).
