---
name: go-debugging
description: "Go debugging skill for delve setup, race condition detection, goroutine tracking, and panic diagnosis. Trigger phrases: Go debug, delve, race condition, goroutine leak, panic recovery, context leak, deadlock, -race flag."
---

# Go Debugging

## Use When

- Debugging Go code with delve or gdb.
- Investigating goroutine leaks and race conditions.
- Analyzing panics and recovering stack context.
- Diagnosing context abortion and cancellation issues.

## Setup and Tools

1. Delve debugging
- **Installation**: `go install github.com/go-delve/delve/cmd/dlv@latest`.
- **Starting**: `dlv debug` (current package) or `dlv debug ./cmd/app`.
- **Breakpoints**: `break main.main`, `break package.Function:line`.
- **VS Code**: Use the official Go extension; it integrates delve automatically.

2. Race detector
- **Build with `-race`**: `go build -race` or `go test -race`.
- **Run**: `./app` or `go test -race ./...`.
- Detects data races on goroutine access to shared memory.

3. Profiling and inspection
- **pprof**: `import _ "net/http/pprof"` and visit `http://localhost:6060/debug/pprof/`.
- **goroutine dump**: `curl http://localhost:6060/debug/pprof/goroutine` for live goroutine list.
- **CPU and memory profiling**: Built into pprof; analyze with `go tool pprof`.

## Checklist

1. Goroutine leaks
- Use `-race` flag to detect unexpected concurrent access.
- Count goroutines at startup vs. after operations: `runtime.NumGoroutine()`.
- Check that all spawned goroutines have clean exit paths.
- Verify channels are closed by the sender; stuck receivers leak goroutines.

2. Context and cancellation
- Propagate context through all I/O operations and goroutines.
- Use `context.WithCancel()` or `context.WithTimeout()` appropriately.
- Check that cancellation handlers (deferred cleanup) run even if context is cancelled.

3. Deadlocks and locks
- Ensure mutexes are unlocked in all code paths (use `defer unlock()`).
- Avoid nested locks or ensure consistent lock ordering.
- Use `RWMutex` for read-heavy workloads instead of `Mutex`.

4. Panic and recovery
- Catch panics at goroutine entry points (not in library code).
- Log panic stack with `debug.Stack()` for troubleshooting.
- Distinguish panics (bugs) from errors (expected failures).

5. Memory and heap
- Be cautious with large allocations in loops; move out of loop if possible.
- Release resources (close files, connections) with `defer`.
- Use pointers for large structs passed to functions to avoid unnecessary copies.

## Output Requirements

For each finding provide:
- Issue description
- Evidence (race condition output, goroutine dump, panic stack)
- Root cause (goroutine leak, context issue, deadlock, panic)
- Steps to reproduce with delve or -race flag
- Fix strategy
