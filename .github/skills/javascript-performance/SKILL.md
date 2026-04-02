---
name: javascript-performance
description: "JavaScript performance skill for event loop optimization, memory profiling, and runtime efficiency in Node.js and browsers. Trigger phrases: JavaScript performance, event loop stall, memory heap, GC pause, async performance, CPU profile, throughput."
---

# JavaScript Performance

## Use When

- Profiling Node.js or browser JavaScript for CPU, memory, or responsiveness issues.
- Investigating event loop stalls, GC pauses, or memory leaks.
- Optimizing async control flow and concurrency.

## Profiling Tools

1. **Node.js profiling**
- CPU: `node --prof` then `node --prof-process --preprocess` for flame graphs.
- Memory: Start with `node --inspect` and Chrome DevTools heap snapshots.
- Real-time: Use `clinic.js` or `0x` for interactive profiles.

2. **Event loop and async analysis**
- Trace event loop: Use `--trace-events` flag and analyze in Chrome DevTools.
- Async hooks: Use `async_hooks` module to detect blocking or slow async operations.
- Benchmark libraries: `benchmark.js` for micro-benchmarks, custom timers for macro.

3. **Memory profiling**
- Heap snapshots: Chrome DevTools or `heapdump` package.
- Allocation timeline: See where memory is allocated over time.
- GC statistics: Use `--trace-gc` to see pause times and frequency.

## Checklist

1. Event loop efficiency
- Are any operations blocking the event loop (synchronous I/O, tight loops)?
- Is work properly chunked with `setImmediate` when needed?
- Are there unnecessary await points or promise chains?

2. Concurrency and throughput
- Is concurrency limited by connection/resource pools?
- Are operations properly parallelized (Promise.all) or sequenced incorrectly?
- Check for lock contention in shared state or database pools.

3. Memory management
- Are objects retained longer than needed (circular references, forgotten listeners)?
- Is memory growing unbounded or within expected bounds?
- Are timers, listeners, or streams properly cleaned up?

4. Garbage collection
- Is GC pause time acceptable for your workload?
- Are large objects or frequent allocations causing GC pressure?
- Consider using `--max-old-space-size` if running large workloads.

## Output Requirements

For each finding provide:
- Measurement (baseline throughput, latency, memory).
- Profiling evidence (flame graph, trace, heap snapshot).
- Root cause and impact.
- Optimization strategy and expected improvement.
