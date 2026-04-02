---
name: go-performance
description: "Go performance skill for profiling, benchmarking, optimization including goroutine efficiency, lock contention, and allocation patterns. Trigger phrases: Go performance, goroutine leak, CPU profile, memory allocation, lock contention, benchmarking, pprof, -bench."
---

# Go Performance

## Use When

- Profiling Go applications for CPU, memory, goroutine, or allocation issues.
- Analyzing lock contention and goroutine efficiency.
- Benchmarking and optimizing hot paths.

## Profiling Tools

1. **Benchmarking**
- `go test -bench=. -benchmem` to run benchmarks and show memory allocations.
- `go test -bench=. -cpuprofile=cpu.prof` to profile benchmark execution.
- `go tool pprof cpu.prof` to analyze the profile interactively.

2. **Runtime profiling (pprof)**
- Add `import _ "net/http/pprof"` to enable profiling endpoint.
- Access profiles at `http://localhost:6060/debug/pprof/`.
- CPU profile: `go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30`.
- Heap: `go tool pprof http://localhost:6060/debug/pprof/heap`.
- Goroutines: `curl http://localhost:6060/debug/pprof/goroutine`.

3. **Memory and allocation analysis**
- `go test -bench=. -memprofile=mem.prof` then `go tool pprof mem.prof`.
- Look for alloc bytes vs. bytes in use; high alloc suggests GC pressure.

## Checklist

1. CPU and hot paths
- Profile to identify bottleneck functions (top of call graph).
- Check for unnecessary allocations or repeated computations in hot paths.
- Verify algorithm complexity is appropriate (avoid O(n²) operations).

2. Memory and allocation
- High allocation count in benchmarks suggests unnecessary allocations.
- Use sync.Pool for frequently allocated/freed objects.
- Preallocate slices and maps when size is known.

3. Goroutine efficiency
- Check goroutine count at rest vs. under load; look for leaks.
- Use `-race` flag to detect concurrent access to shared memory.
- Verify goroutine cleanup on application shutdown.

4. Lock contention
- Profile with mutex contention tracking: use `pprof` and look for `sync.Mutex.Lock` in call graph.
- If high contention, consider finer-grained locking or lock-free data structures.
- Use `RWMutex` if read-heavy; `sync.Map` for concurrent map access.

5. Channel and concurrency patterns
- Avoid goroutine-per-request at scale; use worker pools.
- Ensure channels are properly closed; leaking goroutines waits on closed channels.

## Output Requirements

For each finding provide:
- Measurement (benchmark results, baseline latency/memory).
- Profiling evidence (goroutine count, CPU profile, allocation trace).
- Root cause (algorithm, allocation, lock, goroutine leak).
- Optimization strategy and expected improvement (e.g., "Reduce allocations by X%").
- Effort and risk assessment.
