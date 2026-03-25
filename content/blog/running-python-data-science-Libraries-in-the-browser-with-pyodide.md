---
title: "Running Python Data Science Libraries in the Browser with Pyodide"
date: 2026-05-13
tags:
  - Python
  - Webassembly
  - Pyodide
mermaid: true
---

Python has always been the lingua franca of data science. Its rich ecosystem of libraries: [NumPy](https://numpy.org/) for numerical computing, [Pandas](https://pandas.pydata.org/) for data manipulation, [Matplotlib](https://matplotlib.org/) for visualization, and [Scikit-learn](https://scikit-learn.org/) for machine learning—has made it the go-to language for analysts and researchers worldwide. Traditionally, these libraries run on a server or local machine, with users interacting through [Jupyter notebooks](https://jupyter.org/) or command-line interfaces.

Recent advancements in WebAssembly (WASM) have opened the door to a new paradigm: running Python directly in the browser. [Pyodide](https://pyodide.org/), a project initiated by Mozilla, has ported the CPython interpreter to WebAssembly, allowing you to execute Python code and leverage its data science libraries without leaving the browser environment.

This post will cover the process of architecting a Pyodide-based data science dashboard, including performance considerations, the Web Worker pattern for non-blocking execution, and advanced features like file system access and memory management.

## What is Pyodide?

Pyodide ports CPython to WebAssembly (Wasm). It enables you to run a full Python data science stack—including NumPy, Pandas, Matplotlib, and Scikit-learn—entirely inside the browser.

This architecture shifts the web development paradigm. Instead of sending data to a Python backend for processing, you bring the Python runtime to the data. This approach provides several key benefits:

* **Local Data Privacy**: Sensitive datasets (such as healthcare or finance data) never leave the user's device.
* **Zero-Latency Interactivity**: After the browser loads the runtime, calculations happen instantly without network round-trips.
* **Reduced Server Costs**: The client's CPU handles heavy computational lifting.

### The numpy-ts Alternative

You might consider libraries like [numpy-ts](https://numpyts.dev/) to perform mathematical operations in the browser. However, when you use Pyodide, incorporating these libraries wastes resources and creates redundancy:

* **Redundant Runtimes**: Pyodide loads the entire CPython runtime and the official Python numpy package via WebAssembly. Libraries like numpy-ts provide their own mathematical engines. Using both simultaneously loads redundant code and wastes the browser's limited memory.
* **Different Execution Models**: Pyodide requires you to write and execute actual Python code (using pyodide.runPythonAsync) to manipulate your data. You pass raw arrays into the Python environment, let Python process them, and extract the results. Conversely, numpy-ts dictates writing mathematical operations natively in TypeScript.
* **Native TypeScript Interoperability**: To interact with Pyodide's NumPy from TypeScript, you do not need an intermediate wrapper library. You use native JavaScript TypedArray objects (such as Float64Array). Pyodide reads and writes these native browser arrays directly using pyodide.toPy() or zero-copy transfers with a SharedArrayBuffer.

## Performance and Library Compatibility

Before you implement this architecture, you must understand the performance profile of running these libraries in WebAssembly. The primary bottleneck is the initial download size, while execution speed remains generally near-native for numerical operations.

### Library Impact Analysis

| Library | Approx. Download Size | Execution Speed | Usage Context |
| --- | --- | --- | --- |
| NumPy | ~7 MB | Near-Native (1x-2x) | The essential foundation. Pyodide compiles LAPACK/BLAS to heavily optimize vectorized operations. |
| Pandas | ~20 MB | Fast | Performs well for datasets under 50MB. Object wrapping consumes more memory than native Python. |
| Matplotlib | ~10 MB | Moderate | Renders static plots (PNG/SVG) quickly. Interactive resizing can lag because every frame requires a Python-to-JavaScript bridge call. |
| Scikit-learn | ~15 MB | Good | Delivers instant inference (prediction). Training remains viable for small-to-medium datasets (e.g., <10k rows). |
| SciPy | ~160 MB | Slower Load | The Heavyweight. Contains extensive Fortran code. Expect 10-20s load times on slow connections. Use only if strictly necessary. |

### Cold Start vs. Warm Start

**Cold Start**: During the first visit, the browser downloads the Pyodide runtime (~10MB) and all requested packages. This process takes 5 to 30 seconds, depending on network speed.

**Warm Start**: On subsequent visits, the browser caches the compiled .wasm binaries. Initialization time drops to 2 to 4 seconds, restricted only by disk speed and CPU compilation.

### The 32-bit Architecture and Memory Limit

Pyodide currently targets the wasm32 architecture (32-bit WebAssembly). This design imposes critical constraints for data-intensive applications:

* **4GB Hard Memory Limit**: The Python runtime cannot address more than 4GB of memory (2^32 bytes). If you load a dataset larger than this limit (or if processing expands memory usage beyond it), the browser tab crashes with an "Out of Memory" error.
* **Pointer Size**: All C/C++ pointers in the underlying libraries (NumPy, Pandas) compile as 32-bit integers.
* **Package Compatibility**: You must compile binary wheels specifically for emscripten-32. Standard 64-bit Linux wheels from PyPI do not work.

Note: Although developers are actively building wasm64 (Memory64), the stable Pyodide runtime does not yet support it.

### The "Deep Learning" Limitation

Pyodide does not officially support or recommend TensorFlow and PyTorch.

* **Reason**: These libraries rely on complex C++ build chains, custom threading models, and GPU acceleration (CUDA) that do not translate well to the current WebAssembly standard.
* **Alternative**: Use TensorFlow.js or ONNX Runtime Web for deep learning.
* **Workflow**: Clean and preprocess data with Pyodide and Pandas &rightarrow; Convert to Float32Array &rightarrow; Pass the array to TensorFlow.js for GPU-accelerated inference.

```mermaid
graph LR
  A[Pyodide and Pandas<br/>Clean and Preprocess Data] -->|Convert to| B(Float32Array)
  B --> C[TensorFlow.js / ONNX Web<br/>GPU-Accelerated Inference]
```

## Architecture: The Web Worker Pattern

Running Python on the browser's main thread represents a critical anti-pattern. Because JavaScript runs on a single thread, heavy Python computation blocks the Event Loop, freezing the UI completely (buttons stop working, animations halt).

To prevent this, you must run Pyodide within a Web Worker.

Main Thread (UI)
: Handles user interaction, renders components, and maintains application state. It communicates with Python exclusively via asynchronous messages.

Worker Thread (Python)
: 1. Downloads the Pyodide runtime.
: 2. Installs packages via micropip or loadPackage.
: 3. Executes Python code in an isolated scope.
: 4. Returns results as serializable JSON or binary buffers.

```mermaid
sequenceDiagram
  autonumber
  participant UI as Main Thread (UI)
  participant Worker as Web Worker (Python)

  UI->>Worker: Spawn Worker
  activate Worker
  Worker->>Worker: Download Pyodide & Wasm binaries
  Worker->>Worker: Load Python packages
  Worker-->>UI: postMessage({ status: 'ready' })
  deactivate Worker

  Note over UI,Worker: User clicks "Run Analysis"

  UI->>Worker: postMessage({ pythonCode, data })
  activate Worker
  Worker->>Worker: Convert JS data to Python Proxy
  Worker->>Worker: Execute runPythonAsync()
  Worker->>Worker: Extract results and serialize
  Worker-->>UI: postMessage({ results, plotImage })
  deactivate Worker

  UI->>UI: Render results to DOM
```

## Implementation

### Step 1: Installation

Install the Pyodide package to acquire the runtime and type definitions.

```bash
npm install pyodide
```

### Step 2: The Web Worker (`pyodide.worker.ts`)

This background script initializes the environment, handles incoming analysis requests, and translates plots to images.

```ts
// Pyodide worker that loads the runtime from CDN and reports lifecycle events.
// Designed to avoid Vite pre-bundling and to make failures observable.

interface PyodideModule {
  loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  default?: {
    loadPyodide?: (config: { indexURL: string }) => Promise<PyodideInterface>;
  };
}

interface PyodideInterface {
  loadPackage: (packages: string[]) => Promise<void>;
  runPythonAsync: (code: string) => Promise<unknown>;
  toPy?: (obj: unknown) => unknown;
  globals: {
    set: (key: string, value: unknown) => void;
    get: (key: string) => unknown;
  };
  mountNativeFS: (mountPoint: string, dirHandle: unknown) => Promise<void>;
  FS: {
    mkdirTree: (path: string) => void;
  };
}

type WorkerMessage =
  | { type: 'INIT'; indexURL?: string; packages?: string[] }
  | { type: 'MOUNT_OPFS'; handle: unknown }
  | { type: 'SAVE_CSV'; filename: string; b64: string }
  | { type: 'RUN'; pythonCode: string; inputData?: unknown }
  | { type: 'PING' }

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs';

let pyodideInstance: PyodideInterface | null = null;
let packagesLoaded = false;

async function importPyodideModule(): Promise<PyodideModule> {
  try {
    self.postMessage({ type: 'lifecycle', stage: 'import-start', url: PYODIDE_CDN });
    const mod = await import(/* @vite-ignore */ PYODIDE_CDN);
    self.postMessage({ type: 'lifecycle', stage: 'import-complete' });
    return mod as PyodideModule;
  } catch (err) {
    self.postMessage({ type: 'lifecycle', stage: 'import-failed', error: String(err) });
    try {
      self.postMessage({ type: 'lifecycle', stage: 'import-fallback-start' });
      const resp = await fetch(PYODIDE_CDN, { mode: 'cors' });
      if (!resp.ok) throw new Error(`fetch failed ${resp.status}`);
      const text = await resp.text();
      const blob = new Blob([text], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      try {
        const mod = await import(/* @vite-ignore */ url);
        self.postMessage({ type: 'lifecycle', stage: 'import-fallback-complete' });
        return mod as PyodideModule;
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (e2) {
      self.postMessage({ type: 'ERROR', error: 'All import attempts failed: ' + String(e2) });
      throw e2;
    }
  }
}

async function initPyodide(indexURL = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/') {
  if (pyodideInstance) return pyodideInstance;
  self.postMessage({ type: 'status', status: 'loading', message: 'Initializing Pyodide module' });
  const mod = await importPyodideModule();
  const loadFn = mod?.loadPyodide ?? mod?.default?.loadPyodide;
  if (!loadFn) {
    const msg = 'loadPyodide function not found on module';
    self.postMessage({ type: 'ERROR', error: msg });
    throw new Error(msg);
  }

  self.postMessage({ type: 'lifecycle', stage: 'loadpyodide-start' });
  pyodideInstance = await loadFn({ indexURL });
  self.postMessage({ type: 'lifecycle', stage: 'loadpyodide-complete' });
  self.postMessage({ type: 'status', status: 'ready' });
  return pyodideInstance;
}

async function ensurePackages(pkgs: string[] = ['numpy', 'pandas', 'matplotlib']) {
  const py = await initPyodide();
  if (packagesLoaded) return;
  for (const p of pkgs) {
    try {
      self.postMessage({ type: 'lifecycle', stage: 'load-package-start', package: p });
      await py.loadPackage([p]);
      self.postMessage({ type: 'lifecycle', stage: 'load-package-complete', package: p });
    } catch (e) {
      self.postMessage({ type: 'ERROR', error: `Failed to load package ${p}: ${String(e)}` });
      throw e;
    }
  }
  packagesLoaded = true;
  try {
    await py.runPythonAsync(`
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def get_plot_base64():
    buf = BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    img = base64.b64encode(buf.read()).decode('utf-8')
    plt.clf()
    plt.close()
    return img
    `);
  } catch (e) {
    self.postMessage({ type: 'lifecycle', stage: 'plot-helper-failed', error: String(e) });
  }
}

async function mountOPFS(handle: unknown) {
  const py = await initPyodide();
  try {
    self.postMessage({ type: 'lifecycle', stage: 'mount-opfs-start' });
    if (typeof py.mountNativeFS === 'function') {
      try { py.FS.mkdirTree('/mnt/opfs'); } catch { /* ignore */ }
      await py.mountNativeFS('/mnt/opfs', handle);
      self.postMessage({ type: 'lifecycle', stage: 'mount-opfs-complete' });
      self.postMessage({ type: 'opfs', status: 'mounted' });
    } else {
      self.postMessage({ type: 'opfs', status: 'unsupported' });
    }
  } catch (e) {
    self.postMessage({ type: 'opfs', status: 'error', error: String(e) });
    self.postMessage({ type: 'ERROR', error: 'OPFS mount failed: ' + String(e) });
  }
}

self.onmessage = async (ev: MessageEvent) => {
  const msg = ev.data as WorkerMessage & Record<string, unknown>;
  try {
    if (msg.type === 'SAVE_CSV') {
      try {
        const py = await initPyodide();
        try { py.FS.mkdirTree('/mnt/opfs'); } catch { /* ignore */ }
        py.globals.set('___b64_csv', msg.b64);
        const target = `/mnt/opfs/${msg.filename}`;
        const pyCode = `import base64\nopen('${target}','wb').write(base64.b64decode(___b64_csv))`;
        await py.runPythonAsync(pyCode);
        self.postMessage({ type: 'SAVED', filename: msg.filename, path: target });
      } catch (e) {
        self.postMessage({ type: 'ERROR', error: 'SAVE_FAILED: ' + String(e) });
      }
      return;
    }

    if (msg.type === 'PING') {
      self.postMessage({ type: 'PONG' });
      return;
    }

    if (msg.type === 'INIT') {
      await initPyodide(msg.indexURL);
      if (msg.packages) await ensurePackages(msg.packages);
      return;
    }

    if (msg.type === 'MOUNT_OPFS') {
      await mountOPFS(msg.handle);
      return;
    }

    if (msg.type === 'RUN') {
      try {
        const py = await initPyodide();
        await ensurePackages();

        if (msg.inputData !== undefined) {
          try {
            const pyData = py.toPy ? py.toPy(msg.inputData) : msg.inputData;
            py.globals.set('input_data', pyData);
          } catch (e) {
            self.postMessage({ type: 'lifecycle', stage: 'data-inject-failed', error: String(e) });
          }
        }

        self.postMessage({ type: 'lifecycle', stage: 'execution-start' });
        await py.runPythonAsync(msg.pythonCode);
        self.postMessage({ type: 'lifecycle', stage: 'execution-complete' });

        let results = null;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const r = py.globals.get('result') as any;
          if (r && typeof r.toJs === 'function') {
            results = r.toJs({ dict_converter: Object.fromEntries });
          } else {
            results = r;
          }
        } catch {
          // ignore
        }

        let plotBase64 = null;
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const f = py.globals.get('get_plot_base64') as any;
          if (f && typeof f === 'function') {
            plotBase64 = f();
          }
        } catch {
          // ignore
        }

        self.postMessage({ type: 'RESULT', results, plotBase64 });
      } catch (e) {
        self.postMessage({ type: 'ERROR', error: String(e) });
      }
    }
  } catch (err) {
    self.postMessage({ type: 'ERROR', error: 'Worker error: ' + String(err) });
  }
};

```

### Step 3: The Main Application (`App.tsx`)

The React component manages the worker lifecycle. It handles the asynchronous nature of the worker and provides feedback during the initial load phase.

```tsx
import { useEffect, useRef, useState } from 'react'
import './App.css'
import requestAndSendOPFS from './opfs'

function App() {
  const [status, setStatus] = useState('idle')
  const [output, setOutput] = useState<string | null>(null)
  const [plotSrc, setPlotSrc] = useState<string | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const [csvName, setCsvName] = useState<string | null>(null)
  const [csvText, setCsvText] = useState<string | null>(null)
  const [opfsMounted, setOpfsMounted] = useState(false)
  const [isMounting, setIsMounting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lifecycleLog, setLifecycleLog] = useState<string[]>([])

  useEffect(() => {
    const w = new Worker(new URL('./pyodide.worker.ts', import.meta.url), { type: 'module' })
    workerRef.current = w

    w.onmessage = (ev: MessageEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const msg = ev.data as any
      if (msg.type === 'status') {
        setStatus(msg.status ?? msg.message ?? 'status')
      } else if (msg.type === 'opfs') {
        if (msg.status === 'mounted') {
          setOpfsMounted(true)
          setStatus('OPFS mounted')
        } else if (msg.status === 'unsupported') {
          setStatus('OPFS unsupported')
        } else {
          setStatus('OPFS error: ' + (msg.error ?? String(msg)))
        }
      } else if (msg.type === 'lifecycle') {
        const stage = String(msg.stage)
        setStatus(stage)
        setLifecycleLog((l) => [stage, ...l].slice(0, 20))
        if (stage === 'mount-opfs-start') setIsMounting(true)
        if (stage === 'mount-opfs-complete') setIsMounting(false)
      } else if (msg.type === 'RESULT') {
        setStatus('complete')
        setOutput(msg.results ? JSON.stringify(msg.results, null, 2) : 'No results')
        if (msg.plotBase64) setPlotSrc(`data:image/png;base64,${msg.plotBase64}`)
      } else if (msg.type === 'ERROR') {
        setStatus('error: ' + (msg.error ?? String(msg)))
      } else if (msg.type === 'PONG') {
        setStatus('worker:pong')
      } else if (msg.type === 'SAVED') {
        // after saving to OPFS, trigger analysis reading from the saved path
        const path = msg.path as string
        const runScript = `
import pandas as pd
import matplotlib.pyplot as plt

# read from OPFS path
df = pd.read_csv('${path}')
summary = df.describe(include='all').fillna('')
result = {'columns': df.columns.tolist(), 'summary': summary.to_dict()}

plt.figure(figsize=(4,2))
if 'value' in df:
    plt.plot(df['value'], marker='o')
plt.title('CSV Analysis (from OPFS)')
plt.grid(True, alpha=0.3)
`
        setStatus('running-from-opfs')
        setIsSaving(false)
        workerRef.current?.postMessage({ type: 'RUN', pythonCode: runScript })
      }
    }

    w.onerror = (e) => {
      console.error('worker error', e)
      setStatus('worker-error')
    }

    // initialize worker (lazy loading inside worker)
    w.postMessage({ type: 'INIT' })

    return () => {
      w.terminate()
      workerRef.current = null
    }
  }, [])

  const mountOPFS = async () => {
    const w = workerRef.current
    if (!w) return setStatus('no-worker')
    try {
      await requestAndSendOPFS(w)
      setStatus('mounting-opfs')
    } catch (e: unknown) {
      setStatus('opfs-error: ' + (e instanceof Error ? e.message : String(e)))
    }
  }

  const runDemo = () => {
    const w = workerRef.current
    if (!w) return setStatus('no-worker')
    setStatus('running')
    setOutput(null)
    setPlotSrc(null)

    const script = `
import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame(input_data)
summary = df.describe(include='all')
result = summary.to_dict()

plt.figure(figsize=(4,2))
if 'value' in df:
    plt.plot(df['value'], marker='o')
plt.title('Demo')
plt.grid(True, alpha=0.3)
`;

    const dummy = { id: [1,2,3,4,5], value: [10,25,15,30,45] }
    w.postMessage({ type: 'RUN', pythonCode: script, inputData: dummy })
  }

  const handleFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setCsvName(file.name)
    setCsvText(text)
    setStatus('file-loaded')
    // Auto-mount OPFS when a file is uploaded (if available)
    const w = workerRef.current
    if (!w) return
    if (!opfsMounted) {
      try {
        await requestAndSendOPFS(w)
        setStatus('requesting-opfs')
      } catch (e: unknown) {
        setStatus('opfs-request-failed: ' + (e instanceof Error ? e.message : String(e)))
      }
    }
  }

  const runCsv = () => {
    const w = workerRef.current
    if (!w) return setStatus('no-worker')
    if (!csvText) return setStatus('no-file')
    setStatus('running-csv')
    setOutput(null)
    setPlotSrc(null)

    // save CSV to OPFS first, then worker will emit SAVED and trigger analysis
    const name = csvName ?? 'upload.csv'
    const b64 = btoa(unescape(encodeURIComponent(csvText)))
    setIsSaving(true)
    w.postMessage({ type: 'SAVE_CSV', filename: name, b64 })
  }

  const ping = () => {
    workerRef.current?.postMessage({ type: 'PING' })
    setStatus('ping-sent')
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto' }}>
      <h1>Pyodide Worker Demo</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button onClick={mountOPFS}>Mount OPFS</button>
        <button onClick={runDemo}>Run Demo</button>
        <button onClick={ping}>Ping</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center' }}>
        <input type="file" accept="text/csv" onChange={handleFile} />
        <button onClick={runCsv} disabled={!csvText}>Run CSV</button>
        <div style={{ fontSize: 12, color: '#666' }}>{csvName ?? 'No file'}</div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <strong>Status:</strong> {status}
      </div>

      <div style={{ marginBottom: 12 }}>
        {(isMounting || isSaving) && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span>⏳</span>
            <span>{isMounting ? 'Mounting OPFS...' : isSaving ? 'Saving CSV to OPFS...' : ''}</span>
          </div>
        )}
        {lifecycleLog.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
            <strong>Recent events:</strong>
            <div style={{ maxHeight: 120, overflow: 'auto' }}>
              {lifecycleLog.map((ev, i) => (
                <div key={i}>{ev}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <h3>Results</h3>
          <pre style={{ background: '#0b1220', color: '#e6eef8', padding: 12, height: 300, overflow: 'auto' }}>{output ?? 'No results yet'}</pre>
        </div>
        <div style={{ width: 360 }}>
          <h3>Plot</h3>
          {plotSrc ? (
            <img src={plotSrc} alt="plot" style={{ width: '100%', border: '1px solid #ddd' }} />
          ) : (
            <div style={{ height: 300, border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No plot</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

```

## Advanced Features and Optimization

### The Virtual File System (VFS)

Pyodide runs within a sandboxed environment containing a virtual file system (VFS). By default, Pyodide creates files in memory (MEMFS). These files vanish when the page refreshes.

Modern Web APIs enable you to bridge the gap between the browser sandbox and the user's actual device.

#### The File System Access API (Mount Local Folders)

This API lets users grant your app access to a specific local directory. It works perfectly for data science applications where users "Open Project Folder" to analyze local CSV files.

* **Capability**: Read and write access to a physical folder on the user's disk.
* **Permissions**: Requires an explicit user gesture (button click) and permission prompt.
* **Pyodide Support**: Mounts natively via `pyodide.mountNativeFS`.

```tsx
// In your React Component (Main Thread)
const handleOpenFolder = async () => {
  // 1. Prompt the user to select a directory
  const dirHandle = await window.showDirectoryPicker();

  // 2. Send the handle to the worker
  worker.postMessage({ type: 'MOUNT_DIR', handle: dirHandle });
};

// In your Pyodide Worker
self.onmessage = async (event: MessageEvent) => {
  if (event.data.type === 'MOUNT_DIR') {
    const dirHandle = event.data.handle;

    // 3. Mount the native directory to a Python path
    await pyodide.mountNativeFS("/mnt/local_data", dirHandle);

    // Python can now read files directly from the user's disk
    await pyodide.runPythonAsync(`
      import os
      print(os.listdir('/mnt/local_data'))
    `);
  }
};
```

#### The Origin Private File System (OPFS)

The OPFS provisions a special file system local to your origin (domain), which standard file explorers cannot see. Browsers optimize it for high performance and random access.

* **Best For**: Databases (SQLite), temporary scratch space, or caching large datasets invisibly.
* **Performance**: Much faster than IDBFS or standard LocalStorage.
* **Implementation**: Access the root via `navigator.storage.getDirectory()` and mount it exactly like a local folder.

```ts
// In your Pyodide Worker
async function mountPrivateStorage() {
  // Retrieve the root of the private file system
  const opfsRoot = await navigator.storage.getDirectory();

  // Mount it to '/mnt/private'
  await pyodide.mountNativeFS("/mnt/private", opfsRoot);

  console.log("OPFS mounted at /mnt/private");
}
```

#### IDBFS (Legacy Persistence)

For older browsers or simple use cases, Pyodide supports the IndexedDB File System (IDBFS). It syncs the in-memory file system to IndexedDB.

* **Pros**: Offers wide browser support.
* **Cons**: Requires explicit syncfs calls to save or load data; slower than OPFS.
* **Implementation**: Handle mounting in TypeScript to ensure the environment is ready before Python executes.

```ts
// In your Pyodide Worker
async function mountIDBFS() {
  // 1. Create the mount point in the virtual filesystem
  pyodide.FS.mkdir('/mnt/persistence');

  // 2. Mount IDBFS
  pyodide.FS.mount(pyodide.FS.filesystems.IDBFS, {}, '/mnt/persistence');

  // 3. Sync from IndexedDB to Memory (Populate)
  await new Promise<void>((resolve, reject) => {
    pyodide.FS.syncfs(true, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });

  console.log("IDBFS ready at /mnt/persistence");
}

// To save data later (e.g., after analysis), you must sync back:
async function saveToIDBFS() {
  await new Promise<void>((resolve, reject) => {
    // false = populate from Memory to DB
    pyodide.FS.syncfs(false, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
```

## Optimization Strategies

### Zero-Copy Data Transfer with `SharedArrayBuffer`

For massive datasets (e.g., 100MB+ CSVs), standard postMessage creates a deep copy of the data. This process doubles memory usage and introduces significant latency. A `SharedArrayBuffer` allows JavaScript and Python to read and write to the same memory block without copying.

Requirement: Your server must send the following headers to enable `SharedArrayBuffer` (preventing Spectre/Meltdown attacks):

```http
Cross-Origin-Opener-Policy: same-origin

Cross-Origin-Embedder-Policy: require-corp
```

Example: Shared Memory Implementation

```ts
// 1. Main Thread: Create the buffer
// Allocate 8MB (1 million float64s)
const length = 1_000_000;
const sharedBuffer = new SharedArrayBuffer(length * 8);
const sharedArray = new Float64Array(sharedBuffer);

// Populate the buffer with data
for (let i = 0; i < length; i++) {
  sharedArray[i] = Math.random();
}

// Send reference to the worker (no copy involves)
worker.postMessage({ buffer: sharedBuffer });

// ---------------------------------------------------------

// 2. Worker Thread: Receive and process
self.onmessage = async (event: MessageEvent) => {
  const sharedArray = new Float64Array(event.data.buffer);

  // Mount the array into Python's global scope
  pyodide.globals.set("shared_data", sharedArray);

  await pyodide.runPythonAsync(`
    import numpy as np

    # Create a NumPy array backed by the same memory
    # 'copy=False' is crucial here
    np_arr = np.array(shared_data, copy=False)

    # Modifications here instantly reflect in JavaScript
    np_arr *= 2
  `);

  console.log(sharedArray[0]); // The value doubled!
};
```

## Manage Dependencies with Micropip

The [micropip](https://micropip.pyodide.org/en/stable/) tool installs packages from PyPI directly within the browser. However, it enforces strict limitations regarding binary compatibility.

* **Pure Python Wheels**: micropip flawlessly handles packages containing only Python code (e.g., faker, requests, tqdm).
* **Binary Extensions (C/C++/Rust)**: If a package relies on compiled code (such as lxml or pydantic), standard PyPI wheels will fail. You must compile these packages specifically for the emscripten-32 architecture.

### Correct Usage Example

```ts
import micropip from "micropip";

await pyodide.loadPackage("micropip");
const micropip = pyodide.pyimport("micropip");

try {
  // Install a pure Python package
  await micropip.install("faker");
  console.log("Faker installed successfully");

  // Installing a non-Wasm binary library will trigger an error:
  // await micropip.install("some-binary-lib");
} catch (e) {
  console.error("Installation failed:", e);
}
```

## Manual Memory Management (destroy)

The JavaScript engine does not automatically garbage-collect Python objects that your code creates in WebAssembly. A PyProxy (the JavaScript object pointing to a Python object) keeps the Python object alive in memory indefinitely until you explicitly release it. In long-running Single Page Applications (SPAs), failing to destroy proxies introduces memory leaks.

### Best Practice: The finally Pattern

```ts
async function processHeavyData(pyodide: PyodideInterface) {
  await pyodide.runPythonAsync(`
    class HeavyData:
        def __init__(self):
            # Allocate 50MB of data
            self.payload = [i for i in range(10000000)]
        def analyze(self):
            return sum(self.payload)
    heavy_instance = HeavyData()
  `);

  // Create a JS Proxy to the Python object
  const heavyProxy = pyodide.globals.get("heavy_instance");

  try {
    const sum = heavyProxy.analyze();
    console.log("Sum:", sum);
  } catch (err) {
    console.error("Analysis failed:", err);
  } finally {
    // CRITICAL: Explicitly destroy the proxy
    if (heavyProxy) {
      heavyProxy.destroy();
    }
  }
}
```

## Caching Strategies: Service Workers vs. HTTP Cache

A common misconception implies that a Service Worker speeds up the initial load of Pyodide.

* **First Visit**: Service Workers do not improve download speeds. The browser still needs to download approximately 30MB of Wasm binaries. Installing the worker may actually delay the "Time to Interactive" slightly.
* **Wasm Compilation Caching**: Modern browsers automatically cache the compiled machine code of .wasm files if the server provides the correct HTTP headers. If you serve .wasm files from a Service Worker's CacheStorage without careful handling, you might break this optimization and force a complete re-compilation during every visit.

### Recommendation

Rely on standard HTTP caching first. Configure your server to send immutable headers for your artifacts:

```http
Cache-Control: public, max-age=31536000, immutable
```

Use a Service Worker only if:

* You require a full Offline Mode.
* You need robust resilience against CDN failures.
