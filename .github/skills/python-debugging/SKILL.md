---
name: python-debugging
description: "Python debugging skill for pdb/debugpy setup, GIL and async debugging, and import/traceback analysis. Trigger phrases: Python debug, pdb breakpoint, GIL contention, asyncio hang, import error, traceback, memory profile, debugpy."
---

# Python Debugging

## Use When

- Debugging Python code with pdb or debugpy.
- Investigating GIL contention and threading issues.
- Analyzing asyncio hangs and event loop problems.
- Resolving import errors and circular dependencies.

## Setup and Tools

1. Interactive debugging
- **pdb**: Built-in; use `breakpoint()` (Python 3.7+) or `import pdb; pdb.set_trace()`.
- **debugpy**: Remote debugging for complex setups; integrate with VS Code.
- **ipdb**: Enhanced pdb with better UI; drop-in replacement for pdb.

2. Profiling and inspection
- **cProfile**: `python -m cProfile -s cumulative script.py` for CPU profiling.
- **memory_profiler**: `@profile` decorator and `python -m memory_profiler script.py` for line-by-line memory.
- **py-spy**: Sampling profiler; attach to running process without instrumentation.
- **objgraph**: Visualize object references and detect leaks.

3. Async debugging
- Enable asyncio debug mode: `asyncio.run(..., debug=True)` or `PYTHONASYNCDEBUG=1`.
- Use `asyncio.Event.wait()` with timeouts to detect hangs.
- Check for lost tasks: `asyncio.all_tasks()` to list live coroutines.

## Checklist

1. Exception handling and tracebacks
- Read the full traceback: start at the bottom (where the error happened).
- Look for import errors early in the chain; they often mask the real issue.
- Check if an exception is being caught and re-raised with different context.

2. GIL and threading
- GIL-bound operations (CPU-heavy, NumPy) cannot parallelize with threads; use processes instead.
- Use `threading.Lock()` or `multiprocessing.Lock()` correctly; deadlocks if not released.
- Monitor thread count with `threading.enumerate()` to detect leaked threads.

3. Asyncio debugging
- Look for `gather()` or `create_task()` without proper cancellation.
- Ensure all tasks are awaited before program exit; orphans cause "Task was destroyed but it is pending" warnings.
- Use `debug=True` to get backtraces for long-running tasks.

4. Import and module issues
- Use `python -v` to trace import resolution and detect circular dependencies.
- Check if `__init__.py` is present in package folders.
- Verify `sys.path` includes the expected directories: `import sys; print(sys.path)`.

## Output Requirements

For each finding provide:
- Issue summary
- Traceback or profiling evidence
- Root cause (threading, async, import, GIL)
- Steps to debug with pdb or profiler
- Fix strategy
