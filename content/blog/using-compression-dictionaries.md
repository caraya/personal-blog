---
title: Using Compression Dictionaries
date: 2025-06-23
tags:
  - Compression
  - Web
youtube: true
---

Compression dictionaries are a new, and intriguing, way to reduce the size of compressed data by using a shared dictionary that is known to both the compressor and decompressor. This can lead to significant savings in bandwidth and storage, especially for repetitive or predictable data patterns.

This post explores what are compression dictionaries, how they work, and how they can be used effectively in web applications.

## What Are Compression Dictionaries?

GZip provides a way to compress data between a client and server, it has been around for a long time and is widely used.

Newer compression algorithms, like Brotli and Zstandard, have improved compression ratios and speeds. However, they can still be improved upon and that's where compression dictionaries come in.

Compression dictionaries are pre-defined sets of data that can be used to improve the efficiency of compression algorithms. They work by providing a shared context that both the compressor and decompressor can use, allowing for better compression ratios and faster decompression times.

For example, we can use an earlier version of a file as a dictionary for a later version. This is particularly useful for files that change incrementally, such as HTML, CSS, WASM and JavaScript files in web applications.

Patrick Meenan's 2024 Performance.Now() presentation on compression dictionaries highlights how they can be used to significantly reduce the size of web assets, leading to faster load times and improved performance.

<lite-youtube videoid="Gt0H2DxdAPY"></lite-youtube>

## How they work?

We can use a previous version of a file as a dictionary for a new version of the same file. This provides additional context to the compression algorithm, providing better compression ratios over standard Brotli compression.

We will look at how compression dictionaries work in the context of web application static assets, such as HTML, CSS, JavaScript, and WASM files using a compression dictionary for jQuery both on Netlify and the Apache HTTP server.

The browser needs:

* A way to map a resource to a shared dictionary (`Use-As-Dictionary` header)
* Brotli dictionary encoding (`Content-Encoding: br-dictionary`)
* A way to associate them (via `Link:` headers or Dictionary: headers)

In order to to use compression dictionaries we must use HTTP headers to inform the browser about the shared dictionary and how to use it.

### Compiling Brotli and the Dictionary Generator

Until dictionary compression tools are widely available, we will need to build them from source. this is not a difficult process but it does require some setup.

First we need to install the necessary tools and libraries to build Brotli and the dictionary generator:

1. Git (to fetch the Brotli repository)
2. Compiler toolchain (Xcode for macOS, GCC for Linux, or Visual Studio for Windows)
3. CMake (for building Brotli)
4. Bazel (for building the dictionary generator)

Clone the Brotli repository from Github and move to the `brotli` directory under the root of the project:

```bash
git clone https://github.com/google/brotli.git
cd brotli
```

If there's an `out` directory exists from a previous attempt, remove it for a clean build

```bash
rm -rf out
mkdir out && cd out
```

Configure Brotli and the build tools with [CMake](https://cmake.org/):

```bash
cmake .. -DCMAKE_BUILD_TYPE=Release -DBROTLI_BUILD_TOOLS=ON
```

Check cmake output carefully: Look for errors, warnings, or missing dependencies. If cmake fails, resolve the issues before proceeding.

Then we use [make](https://www.gnu.org/software/make/) to build Brotli. Building the :

```bash
make brotli
```

If the compilation was successful, the brotli executable should now be in the `out` directory where you ran make.


Return to the root of the brotli repository for the next step:

```bash
cd ..
```

The `dictionary_generator` is located in the research subdirectory and is built using Bazel.

From the root of the Brotly repository switch to the `research` directory

```bash
cd research
```

Assuming you've installed [Bazel](https://bazel.build/) on your system, you can now build the `dictionary_generator` tool.
If you haven't installed Bazel yet, follow the [Bazel installation instructions](https://bazel.build/install) for your operating system.

```bash
bazel build dictionary_generator
```

The `dictionary_generator` executable will be located in the bazel-bin directory within the current research directory.

For easier access, you can copy the built tools to a location in your system's PATH, or note their full paths for the next steps.

### Compressing jQuery with a Compression Dictionary

After we've built Brotli and the dictionary generator, we download the jQuery files we will use for compression testing

* jQuery 3.7.1 (unminified): [https://code.jquery.com/jquery-3.7.1.js](https://code.jquery.com/jquery-3.7.1.js)
* jQuery 4.0.0-beta (unminified): [https://code.jquery.com/jquery-4.0.0-beta.js](https://code.jquery.com/jquery-4.0.0-beta.js)

Save these files into the `js/` directory outside the brotli repository structure. For these instructions, we'll assume your project structure is:

```bash
your-project/
├── brotli/ # The cloned brotli repository
└── js/
    ├── jquery-3.7.1.js
    └── jquery-4.0.0-beta.js
```

The following commands should be run from the root directory.

!!! note **Important Note for macOS users**
Encountering dyld errors (like "Library not loaded"):

If you haven't already, export `DYLD_LIBRARY_PATH` in your current shell session before running the brotli commands:

```bash
export DYLD_LIBRARY_PATH=brotli/out/
```

This tells the dynamic linker where to find the Brotli libraries. This path assumes you are in your-project/ and brotli/out/ is the correct relative path to the libraries.

Create the Shared Brotli Dictionary using  jquery-3.7.1.js as the source material.

```bash
brotli/research/bazel-bin/dictionary_generator -o js/jquery.dict js/jquery-3.7.1.js
```

This creates js/jquery.dict.

Compress jQuery 4.0.0-beta WITH the Dictionary:

```bash
brotli/out/brotli --dictionary=js/jquery.dict js/jquery-4.0.0-beta.js -o js/jquery-4.0.0-beta.js.br -q 11 -f
```

This creates `js/jquery-4.0.0-beta.js.br`.

We will also compress jQuery 4.0.0-beta without the Dictionary to get a baseline for comparison:

```bash
brotli/out/brotli js/jquery-4.0.0-beta.js -o js/jquery-4.0.0-beta.js.no-dict.br -q 11 -f
```

This creates `js/jquery-4.0.0-beta.js.no-dict.br`.

### Netlify

To configure Netlify to use compression dictionaries, we need to set up the appropriate headers in the `_headers` file placed at the root of the site.

```text
# Link the jQuery 4.0.0-beta.js file to the dictionary
/js/jquery-4.0.0-beta.js
  Link: </js/jquery.dict>; rel="dictionary"
  Content-Type: application/javascript; charset=utf-8

# The dictionary file is cached for a long time
/js/jquery.dict
  Cache-Control: public, max-age=31536000, immutable

# No dictionary compression for jquery 4.0.0-beta.js
/js/jquery-4.0.0-beta.js.no-dict.br
  Content-Encoding: br
  Content-Type: application/javascript; charset=utf-8
```

This configuration does the following:

1. Specifies `jquery-4.0.0-beta.js` as a dictionary using the `Link` header to the dictionary file (`jquery.dict`)
2. Provides headers for the dictionary file, ensuring it is cached for a long time
3. Specifies the `Content-Encoding` for the compressed file without the dictionary, allowing the browser to decompress it correctly

## The HTML and JavaScript that run the tests

Rather than show the full HTML code, I chose to focus on the JavaScript that fetches the file sizes and checks if jQuery is loaded correctly. The HTML is minimal and is [available on Github](https://github.com/caraya/compression-dictionary-demo/blob/main/index.html).

The JavaScript code below fetches the sizes of the jQuery files and displays them in the HTML. It also checks if jQuery is loaded correctly and provides a button to test its functionality.

`fetchAndDisplaySize` is an asynchronous function that fetches a file from the server, retrieves its size, and displays it in the specified HTML element. It handles errors gracefully and updates the UI accordingly.

```js
async function fetchAndDisplaySize(url, elementId) {
	const element = document.getElementById(elementId);
	try {
		const response = await fetch(url, { cache: 'no-store' });
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status} for ${url}`);
		}
		const blob = await response.blob();
		element.textContent = blob.size.toLocaleString() + ' B';
	} catch (error) {
		console.error('Error fetching size for', url, error);
		element.textContent = 'Error';
		element.classList.add('text-red-500');
	}
}
```

We add an event listener to the `DOMContentLoaded` event to ensure the DOM is fully loaded before running our JavaScript code. This function calls `fetchAndDisplaySize` for each jQuery file we want to check, passing the URL and the ID of the HTML element where the size will be displayed.

```js
document.addEventListener('DOMContentLoaded', () => {
	fetchAndDisplaySize('/js/jquery-3.7.1.js', 'size-jq371');
	fetchAndDisplaySize('/js/jquery-4.0.0-beta.js', 'size-jq4beta');
	fetchAndDisplaySize('/js/jquery-4.0.0-beta.js.no-dict.br', 'size-jq4beta-br-nodict');
	fetchAndDisplaySize('/js/jquery-4.0.0-beta.js.br', 'size-jq4beta-br-dict');

	// jQuery test
	const statusElement = document.getElementById('jquery-status');
	const statusDot = statusElement.querySelector('.status-dot');

	if (typeof jQuery !== 'undefined') {
		statusDot.classList.add('loaded');
		statusElement.childNodes[ 1 ].nodeValue = ' jQuery successfully loaded!';
		$('#testButton').on('click', function () {
			$('#testResult').text('jQuery is working! Button clicked at ' + new Date().toLocaleTimeString());
		});
	} else {
		statusDot.classList.add('error');
		statusElement.childNodes[ 1 ].nodeValue = ' jQuery failed to load.';
		console.error('jQuery is not loaded!');
		document.getElementById('testButton').disabled = true;
		document.getElementById('testButton').classList.add('opacity-50', 'cursor-not-allowed');
	}
});
```

## Browser Support

As of the date of writing, compression dictionaries are only supported in Chrome 127 and later (and I would assume other Chromium-based browsers). Firefox and Safari do not yet support compression dictionaries.

I expect this to change in the future as WebKit (Safari) and Firefox implement support for compression dictionaries but, until it does, be careful when deploying this beyond testing.

## Working Example

You can see a working example of this setup on the demo site: [https://compression-dictionary-demo.netlify.app/](https://compression-dictionary-demo.netlify.app/).

In Chrome the difference between the compressed file with the dictionary and the one without is significant. Other browsers may not work at all or may not show the same results.

## Links and resources

* Compression dictionaries
  * [Compression Dictionary Transport](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Compression_dictionary_transport)
  * [Getting Real Small with Compression Dictionaries](https://calendar.perfplanet.com/2024/getting-real-small-with-compression-dictionaries/)
  * [Shared Dictionary Compression](https://developer.chrome.com/blog/shared-dictionary-compression)
  * [Use as dictionary](https://use-as-dictionary.com/)
