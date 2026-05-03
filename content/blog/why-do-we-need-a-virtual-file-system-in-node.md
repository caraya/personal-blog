---
title: "Why do we need a virtual file system in Node.js?"
date: 2026-06-15
tags:
  - Node.js
  - Virtual File System
  - File System
  - Javascript
---

Node.js developers frequently encounter situations where working with the real filesystem creates friction:

* **Testing**: Unit tests that manipulate files need cleanup, deal with disk I/O latency, and struggle with isolation. Tests often stub the `fs` module entirely, losing the ability to test file-system-dependent logic realistically.
* **Development**: Building tools like bundlers, code generators, and template engines often need to generate files temporarily. Managing temporary directories becomes boilerplate.
* **Filesystem isolation**: Applications sometimes need to isolate filesystem operations by scoping accessible paths so user-provided workflows cannot freely access the host filesystem.
* **In-memory workflows**: Dynamic environments (like browsers with WebAssembly or serverless platforms) may have no persistent filesystem, yet need to load and execute modules dynamically.

Each of these scenarios works around the filesystem constraint rather than solving it properly. A **Virtual File System (VFS)** is the elegant solution: an in-memory, `fs`-compatible API that behaves like the real filesystem but lives entirely in memory.

This post covers the Platformatic Virtual File System (VFS), how it addresses common filesystem challenges in Node.js development and how it compares to the proposed Node.js core VFS implementation.

## What is a Virtual File System?

A Virtual File System provides:

1. **API compatibility** with Node.js `fs` module—drop-in behavior using the same methods developers already know
2. **In-memory storage** by default, with optional persistent backends (SQLite, real filesystem with scoped paths)
3. **Module loading integration**—transparently patch `require()` and `import` so code loads directly from the VFS
4. **Mount points**—segment virtual filesystems and overlay them on top of the real filesystem
5. **Watch support**—file watchers work across real and virtual files

## Why Node.js Core Needs This

For years, JavaScript/Node.js has lagged behind other ecosystems in standardized virtual filesystem capability. Consider:

* **JavaScript bundlers** (Webpack, Vite, Rollup) all implement their own custom in-memory filesystems internally. They reinvent wheels instead of using a standard abstraction.
* **Build tools and generators** manually manage temporary directories and cleanup logic.
* **Testing frameworks** mock the entire `fs` module rather than providing a realistic isolated filesystem environment.
* **Monorepo tools** struggle with path resolution across virtual and real filesystems without a unified interface.

By bringing a VFS into Node.js core, the platform gains:

* **Reduced duplication** across tooling ecosystems
* **Standard semantics** for filesystem behavior (what happens with symlinks? permissions? special files?)
* **Foundation for future features** like stronger filesystem isolation primitives and capability-oriented tooling

## Platformatic's VFS: Proposal vs. Implementation

Platformatic is actively contributing this feature to Node.js core ([nodejs/node#61478](https://github.com/nodejs/node/pull/61478)). However, there's an important distinction between what's in Node.js core and what's in the standalone package:

### Node.js Core Proposal (What's Coming)

The core implementation focuses on:

* **Minimal, focused API**—synchronous primitives sufficient for all higher-level operations
* **Module loading hooks**—patches to `require()` and `import()` resolution
* **Filesystem operations**—directory traversal, file I/O, symlinks, watching
* **Backward compatibility**—integrates cleanly with existing Node.js APIs

This is under active development in Node core, and you can use `@platformatic/vfs` today.

### @platformatic/vfs Package (What You Can Use Today)

[`@platformatic/vfs`](https://github.com/platformatic/vfs) is a complete, production-ready implementation that:

**Works on Node.js 22+** (while the core PR is still reviewed), so you can use `@platformatic/vfs` today.

**Adds practical providers beyond the core**:

* **MemoryProvider** — stores everything in RAM (default)
* **SqliteProvider** — persists to a SQLite database, backed by Node's built-in `node:sqlite` (new in Node 22)
* **RealFSProvider** — scopes real filesystem access under a root directory to constrain path traversal outside that boundary
* **Custom providers** — extend `VirtualProvider` for specialized backends (e.g., S3, Azure Blob Storage, Git-backed filesystem)

**Full callback, Promise, and stream support**—not just synchronous APIs. You get `promises.readFile()`, `createReadStream()`, and all the async patterns developers expect.

**Overlay mode**—mount the VFS such that only virtual files are intercepted, while everything else falls through to the real filesystem. Perfect for hybrid scenarios.

**Virtual working directory**—patch `process.cwd()` and `process.chdir()` to work with the virtual filesystem.

**Comprehensive event support**—`vfs-mount`, `vfs-unmount` events, and file watchers via `watch()` and `watchFile()`.

## Quick Start: Using @platformatic/vfs

All examples in this post have been verified and are available at [caraya/vfs-examples](https://github.com/caraya/vfs-examples).

If you want to run the examples below locally:

```bash
npm install @platformatic/vfs
```

Node.js 22+ is required.
All code samples below use ESM syntax and top-level `await`.

Do not assume `.js` files are ESM modules by default. In many setups they are treated as CommonJS unless a `package.json` sets `"type": "module"`. To avoid ambiguity in these examples, we use `.mjs`; if you prefer `.js`, create a `package.json` with the correct module type.

Before the first example, it helps to clarify mounted view vs provider view:

The VFS has its own internal root, and `mount('/app')` projects that root into the process namespace at `/app`.

So:

Internal provider path: `/index.mjs`
Exposed mounted path: `/app/index.mjs`

`mount('/app')` is not moving files. It is adding a prefix translation layer.

When code asks for `/app/index.mjs`, the VFS resolves it as:

```js
providerPath = requestedPath - mountPoint
```

So:

`/app/index.mjs - /app = /index.mjs`

And the reverse is also true conceptually:

```js
mountedPath = mountPoint + providerPath
```

So:

`/app + /index.mjs = /app/index.mjs`

That is why writing `/index.mjs` before mounting is correct if you plan to mount at `/app`.

Here's a runnable quick start:

```javascript
import { create } from '@platformatic/vfs';

// Create an in-memory VFS
const vfs = create();

// Write files relative to the provider root. After mounting at /app,
// this file becomes visible at /app/index.mjs.
vfs.writeFileSync('/index.mjs', 'export default "hello world";');

// Mount at /app — now import sees virtual files
vfs.mount('/app');

// This loads from the VFS, not disk
const mod = await import('/app/index.mjs');
console.log(mod.default); // 'hello world'

// Inspect with fs functions
console.log(vfs.existsSync('/app/index.mjs')); // true
console.log(vfs.readdirSync('/app')); // ['index.mjs']

// Unmount to restore normal behavior
vfs.unmount();
```

## Real Use Cases

### 1. Filesystem Isolation with Path Scoping

Constrain filesystem access to a scoped root directory:

This use case is about limiting where file reads and writes can occur on the host machine. It is common in plugin systems, code runners, and multi-tenant platforms. With a VFS provider such as `RealFSProvider`, you can enforce a root boundary and keep filesystem effects constrained to a controlled area while still letting code use familiar `fs` APIs. This is filesystem isolation, not a full security sandbox for arbitrary code execution.

```javascript
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { RealFSProvider, create } from '@platformatic/vfs';

const sandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'vfs-sandbox-'));
const sandboxFS = create(new RealFSProvider(sandboxRoot));

// Since RealFSProvider writes to the host filesystem
// under sandboxRoot, parent directories must exist
// before writing nested files.
sandboxFS.mkdirSync('/notes', { recursive: true });
sandboxFS.writeFileSync('/notes/hello.txt', 'inside sandbox');
sandboxFS.mount('/app');

const virtualText = fs.readFileSync('/app/notes/hello.txt', 'utf8');
console.log(virtualText); // 'inside sandbox'

try {
  sandboxFS.readFileSync('/../../etc/passwd', 'utf8');
} catch (err) {
  console.log(err.code); // 'EINVAL' or 'EPERM' depending on platform
}

sandboxFS.unmount();
```

### 2. Testing with Realistic Filesystem Behavior

Use Playwright Test to write tests that don't mock the entire `fs` module:

This use case is about integration-style tests that exercise real file behavior without touching your machine's actual project files. Instead of stubbing every `fs` call, VFS gives you an isolated, disposable filesystem per test, so you can validate parsing, missing-file handling, and edge cases with realistic semantics and deterministic cleanup.

In this project, place the test file under the `tests/` directory and name it with either `.test.js` or `.spec.js` (for example, `tests/vfs-filesystem.test.js`).

```javascript
import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { create } from '@platformatic/vfs';

test.describe('file handler', () => {
  let vfs;

  test.beforeEach(() => {
    vfs = create();
    vfs.writeFileSync('/config.json', JSON.stringify({ debug: true }));
    vfs.mount('/data');
  });

  test.afterEach(() => {
    vfs.unmount();
  });

  test('reads and parses config', () => {
    const config = JSON.parse(fs.readFileSync('/data/config.json', 'utf8'));
    expect(config.debug).toBe(true);
  });

  test('handles missing files gracefully', () => {
    expect(() => {
      fs.readFileSync('/data/missing.json');
    }).toThrow(/ENOENT/);
  });
});
```

### 3. Dynamic Module Generation

Generate and load modules on the fly:

Dynamic module generation appears in build tools, templating engines, and runtime code composition systems where modules are created from user or pipeline input. VFS helps by turning generated source into immediately loadable modules via mount hooks, so you can avoid temporary files and still use Node's normal `import` workflow.

```javascript
import { create } from '@platformatic/vfs';

const vfs = create();

// Generate a module dynamically
const moduleName = 'helpers';
const moduleCode = `
  export const greet = (name) => \`Hello, \${name}!\`;
`;

vfs.writeFileSync(`/${moduleName}.mjs`, moduleCode);
vfs.mount('/lib');

// Load it like a real module
const helpers = await import(`/lib/${moduleName}.mjs`);
console.log(helpers.greet('World')); // 'Hello, World!'

vfs.unmount();
```

### 4. SQLite-Backed Persistence

Keep your virtual filesystem across restarts:

Some workflows need virtual filesystem ergonomics and persistence at the same time, such as caching generated artifacts, storing snapshots, or keeping ephemeral app state between runs. With `SqliteProvider`, VFS keeps the same file-oriented API while persisting data to SQLite, giving you durable storage without redesigning your code around a separate database interface.

Treat this as two separate executions (two files or two processes):

1. A writer process that creates the database and stores files.
2. A reader process started later that reopens the same database and reads persisted data.

`writer.mjs` (process 1):

```javascript
import { SqliteProvider, create } from '@platformatic/vfs';

// File-backed database
const provider = new SqliteProvider('/tmp/myfs.db');
const vfs = create(provider);

vfs.writeFileSync('/config/app.json', JSON.stringify({ port: 3000 }));
provider.close();
```

`reader.mjs` (process 2, run later):

```javascript
import { SqliteProvider, create } from '@platformatic/vfs';

const provider2 = new SqliteProvider('/tmp/myfs.db');
const vfs2 = create(provider2);

console.log(vfs2.readFileSync('/config/app.json', 'utf8'));
// '{"port":3000}'

provider2.close();
```

### 5. Environments Without a Writable Filesystem

Use VFS when your runtime cannot rely on local disk writes, such as constrained containers, read-only deployments, or edge-style execution environments. In these systems, code still expects file paths, module loading, and config reads, but the host filesystem is unavailable or ephemeral. VFS gives you an in-memory filesystem surface that keeps those workflows working without changing application code to a completely different storage model.

```javascript
import fs from 'node:fs';
import { create } from '@platformatic/vfs';

// Simulate a runtime with no writable disk by keeping everything in memory.
const vfs = create();
vfs.writeFileSync('/config.json', JSON.stringify({
  apiBaseUrl: 'https://api.example.com',
  featureFlag: true,
}));
vfs.writeFileSync('/bootstrap.mjs', `
  import fs from 'node:fs';
  const cfg = JSON.parse(fs.readFileSync('/runtime/config.json', 'utf8'));
  export default () => cfg;
`);

vfs.mount('/runtime');

// App code still uses normal fs and import semantics.
const { default: readConfig } = await import('/runtime/bootstrap.mjs');
console.log(readConfig());
// { apiBaseUrl: 'https://api.example.com', featureFlag: true }

vfs.unmount();
```

## VFS Cleanup: What to Tear Down and When

Always clean up explicitly. Do not rely on process exit for test isolation or predictable behavior.

* `MemoryProvider` (default): call `vfs.unmount()` after each test or script run.
* `SqliteProvider`: call `vfs.unmount()` and then `provider.close()` to release the database handle.
* `RealFSProvider`: call `vfs.unmount()` and remove any temporary scoped root directory you created for the test.
* Custom providers: call `vfs.unmount()` and invoke any provider-specific `close()` or `dispose()` hooks if your provider exposes them.

Use a `try/finally` pattern so cleanup runs even when assertions fail:

```javascript
import { create, SqliteProvider } from '@platformatic/vfs';

const provider = new SqliteProvider('/tmp/test-vfs.db');
const vfs = create(provider);
let isMounted = false;

try {
  vfs.mount('/app');
  isMounted = true;
  // test or script logic
  console.log('/app mounted successfully');
} finally {
  if (isMounted) vfs.unmount();
  provider.close();
  console.log('VFS closed');
}
```

## How It Relates to the Node.js Core VFS PR

The standalone `@platformatic/vfs` package is best understood as:

1. **Production implementation available today** — you can ship real workloads on Node.js 22+ right now
2. **Early alignment with core direction** — the package informs and tracks the Node core proposal as it evolves
3. **Forward-compatibility path** — if and when core VFS lands, this package can bridge older Node versions
4. **Practical extension layer** — core focuses on primitives, while `@platformatic/vfs` adds providers and operational ergonomics

The core PR focuses on the *primitives*—the synchronous operations and module-loading hooks. Platformatic's package wraps those with:

* Higher-level promises and streaming APIs
* Production-grade providers (SQLite, real FS path scoping)
* Stability and backward compatibility guarantees

## When to Use a Virtual File System

Use a VFS when you need to:

* ✅ Test filesystem-dependent code without mocking all of `fs`
* ✅ Isolate filesystem access for plugin or user-driven workflows with strict path scoping
* ✅ Generate and load modules dynamically at runtime
* ✅ Persist in-memory structures as a filesystem (for tools, snapshots, caches)
* ✅ Work in environments without a real persistent filesystem

Don't use a VFS when:

* ❌ You're just reading/writing regular files (use the real filesystem)
* ❌ You need high performance with large files (memory is expensive)
* ❌ You require special filesystem features (POSIX permissions, hardlinks, ACLs beyond what VFS emulates)

## Conclusion

Virtual File Systems are a missing primitive in Node.js. By standardizing VFS behavior at the platform level, we reduce duplication across bundlers, test frameworks, and build tools. Platformatic's implementation provides both a clear path for adoption *today* (via `@platformatic/vfs`) and a foundation for Node.js core *tomorrow*.

Whether you're running tests, isolating filesystem access with scoped paths, or building dynamic tooling, a VFS makes filesystem operations predictable, fast, and testable—without the overhead of temporary directories and cleanup logic.

## Further Reading

* [Platformatic VFS GitHub](https://github.com/platformatic/vfs)
* [Verified Example Code (caraya/vfs-examples)](https://github.com/caraya/vfs-examples)
* [Node.js Core PR #61478](https://github.com/nodejs/node/pull/61478)
* [Node.js fs Documentation](https://nodejs.org/api/fs.html)
