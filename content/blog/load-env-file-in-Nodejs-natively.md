---
title: load .env file in Node.js natively
date: 2026-03-25
tags:
  - Node.js
  - Environment Variables
  - Configuration
---

Node.js 20.12.0 introduced a native way to load environment variables from a .env file using the loadEnvFile() function from the node:process module. This is a great addition because it eliminates the need for third-party libraries like dotenv for this common task.This post will discuss how to use the loadEnvFile() function to load environment variables from a .env file in your Node.js applications. It will also cover some limitations and workarounds for the function.

## Using loadEnvFile()

The basic usage is simple. Use the `loadEnvFile()` function to load environment variables. The function takes an optional parameter that specifies the path to the `.env` file. If you don't provide a path, it defaults to `./.env`.

```ts
import { loadEnvFile } from 'node:process';

// Load .env file with default path ('./.env')
loadEnvFile();

// Load .env file with a custom path
loadEnvFile('../../.env');
```

## Using Absolute Paths

You can also pass absolute paths to the function. This requires slightly more work since we need to manually construct the absolute path.One way to do this is to use import.meta.dirname (available in Node.js 20.11+) to get the directory of the current file and then use path.join() to construct the absolute path to the .env file.

```ts
import { loadEnvFile } from 'node:process';
import { join } from 'node:path';

// 1. Get the directory of the current file
const currentDir = import.meta.dirname;

// 2. Construct the absolute path
const envPath = join(currentDir, '../../.env');

// 3. Load it
loadEnvFile(envPath);
```

## Comparison: Native vs. dotenv

If you are migrating from the dotenv library, loadEnvFile() covers about 90% of the use cases, but there are distinct behavioral differences.

| Feature | Node.js loadEnvFile() | dotenv (Library) |
| :---: | :---: | :---: |
| **Setup** | Native (No install) | npm install dotenv |
| **Variable Expansion** | ❌ No | ✅ Yes (via dotenv-expand) |
| **Multiline Values** | ✅ Yes | ✅ Yes |
| **Comments (#)** | ✅ Yes | ✅ Yes |
| **Missing File** | ⚠️ Throws Error | ℹ️ Fails Silently |
| **Overwrite Existing** | ❌ No | ✅ Yes (via config) |

### Variable Expansion

The biggest limitation of the native function is the lack of variable expansion (interpolation). dotenv allows you to reference other variables inside your values, but loadEnvFile treats them as literal strings.

* **dotenv**: URL=http://${HOST}:3000 resolves to <http://localhost:3000>.
* **Native**: URL=http://${HOST}:3000 remains the literal string "http://${HOST}:3000".

### Overwriting Variables

Both tools respect the "Environment Wins" rule by default—if a variable is set in the shell (e.g., **PORT=8000 node app.js**), the `.env` file will not overwrite it.

However, while dotenv offers an override option (`override: true`), the native function does not. If you absolutely need to overwrite existing variables, you must manually parse the file using `util.parseEnv`.

### Missing Files

When dotenv cannot find a `.env` file, it silently does nothing. This is often desirable in production where secrets are injected by the platform. Conversely, `loadEnvFile()` throws an error immediately if the file is missing.

Because `loadEnvFile()` throws when a file is missing, you must wrap it in a try-catch block for production safety.The pattern below checks the error code. It safely ignores "file not found" (ENOENT) errors &mdash; mimicking dotenv's behavior &mdash; while still allowing other critical errors (like permission issues) to crash the app.

```ts
import { loadEnvFile } from 'node:process';

export function safeLoadEnvFile(): void {
  try {
    loadEnvFile();
  } catch (error) {
    // In prod environments there's usually no `.env` file.
    // We suppress the error specifically if the file is missing (ENOENT).
    // This allows other errors (like permission issues) to still crash the app.
    const isMissingFile =
      error instanceof Error &&
      'code' in error &&
      (error as NodeJS.ErrnoException).code === 'ENOENT';

    if (!isMissingFile) {
      throw error;
    }
  }
}
```

## Conclusion

The loadEnvFile() function in Node.js 20.12.0 provides a native way to load environment variables from a .env file, simplifying configuration management in Node.js applications. By understanding the differences from dotenv &mdash; specifically regarding variable expansion and error handling &mdash; you can easily integrate this functionality into your projects and reduce your dependency tree.
