---
name: python-performance
description: "Python performance skill for GIL analysis, profiling, and optimization including async patterns and algorithmic efficiency. Trigger phrases: Python performance, GIL contention, CPU profile, memory leak, import time, asyncio performance, slow algorithm."
---

# Python Performance

## Use When

- Profiling Python applications for CPU, memory, or I/O bottlenecks.
- Analyzing GIL contention and threading/async alternatives.
- Optimizing import time, algorithmic complexity, or memory usage.

## Profiling Tools

1. **CPU profiling**
- `cProfile`: `python -m cProfile -s cumulative script.py` for deterministic profiling.
- `py-spy`: Sampling profiler; attach to running process without instrumentation.
- `pyflame`: Statistical profiler; good for production use.

2. **Memory profiling**
- `memory_profiler`: Line-by-line memory with `@profile` decorator.
- `objgraph`: Detect memory leaks by visualizing object references.
- `tracemalloc`: Built-in; track allocations over time.

3. **Async and I/O analysis**
- `asyncio` debug mode: Set `asyncio.run(..., debug=True)` or `PYTHONASYNCDEBUG=1`.
- `py-spy` with `--idle`: See where time is spent (I/O wait vs. CPU).

## Checklist

1. GIL and threading
- Is the bottleneck CPU-bound (GIL-limited) or I/O-bound?
- For CPU-bound: use `multiprocessing` or Cython, not threading.
- For I/O-bound: use async/await (`asyncio`) or thread pools, not `threading.Thread`.

2. Import and startup performance
- Measure import time: `python -X importtime script.py | head -50`.
- Identify slow imports; move to lazy loading if not needed at startup.
- Check for circular dependencies or expensive module initialization.

3. Algorithmic and data structure efficiency
- Profile CPU usage per function to find algorithm bottlenecks.
- Check for O(n²) operations when O(n log n) alternatives exist.
- Verify data structures are appropriate (dict vs. list, set vs. list for membership).

4. Memory and garbage collection
- Monitor memory growth over time; unexpected growth suggests leaks.
- Use `objgraph` to find retained objects and circular references.
- Check for large object retention or unbounded caches.

## Output Requirements

For each finding provide:
- Measurement (baseline throughput, latency, memory).
- Profiling evidence (call graph, timeline, memory snapshot).
- Root cause (GIL, algorithm, I/O, import, memory).
- Optimization strategy and expected improvement.
- Effort and risk assessment.
