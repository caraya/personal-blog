---
name: typescript-performance
description: "TypeScript performance skill for profiling, bundle size optimization, type-checking overhead, and runtime efficiency. Trigger phrases: TypeScript performance, bundle size, sourcemap impact, type checking speed, memory leak, CPU profile."
---

# TypeScript Performance

## Use When

- Profiling TypeScript applications for CPU, memory, or bundle size issues.
- Analyzing type-checking and build time performance.
- Optimizing bundle size and startup time.

## Profiling Tools

1. **Node.js profiling**
- CPU: `node --prof app.js` then `node --prof-process` to analyze.
- Memory: Use Chrome DevTools heap snapshots or `--inspect`.
- Flame graphs: Use `0x` package or native `--prof` + tools.

2. **Build and bundle analysis**
- Type-checking: `tsc --diagnostics` or `tsc --listFiles` to trace performance.
- Bundle: Use `webpack-bundle-analyzer`, `rollup-plugin-visualizer`, or `esbuild --metafile`.
- Sourcemap impact: Check `.map` file sizes; consider source-map-loader overhead.

3. **Type-checking overhead**
- Profile `tsc` compilation: `time tsc --noEmit`.
- Check for expensive patterns: deeply nested generics, complex type unions, circular type references.

## Checklist

1. Type-checking and build performance
- Are expensive type operations (deep generics, complex unions) unavoidable, or can they be simplified?
- Is type-checking parallelizable? Use `project references` for large monorepos.
- Are sourcemaps necessary for production? Remove them for speed/size.

2. Runtime performance
- Identify hot paths with CPU profiling; focus optimization there.
- Check for unnecessary object allocations in loops.
- Verify async operations are not blocking the event loop.

3. Bundle and startup
- Analyze bundle composition: what is the largest and most-imported module?
- Check for dead code; use tree-shaking rules in tsconfig and bundler.
- Consider code splitting and lazy loading for large features.

4. Memory efficiency
- Look for large object retention or circular references in heap dumps.
- Check for memory leaks from event listeners or timers not cleaned up.

## Output Requirements

For each finding provide:
- Measurement (current baseline, profiling evidence).
- Root cause and impact.
- Optimization strategy with expected improvement.
- Effort and risk assessment.
