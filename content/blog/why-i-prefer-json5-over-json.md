---
title: Why I prefer JSON5 over JSON
date: 2025-04-07
tags:
  - Javasacript
  - JSON
  - Web
---

JSON5 is a superset of JSON that allows for more flexible syntax and features. This post will disccus reasons why I prefer JSON5 over JSON.

What is JSON5

The JSON5 Data Interchange Format is a superset of JSON (so valid JSON files will always be valid JSON5 files) that expands its syntax to include some productions from ECMAScript 5.1 (ES5). It's also a subset of ES5, so valid JSON5 files will always be valid ES5 (and fully compaible with ES2019 and later).

The following ECMAScript 5.1 features, which are not supported in JSON, have been  in JSON5.

* Objects
  * Object keys may be an ECMAScript 5.1 Identifier Names as defined in the [ECMAScript 5.1 specification](https://www.ecma-international.org/ecma-262/5.1/#sec-7.6)
  * Objects may have a single trailing comma.
* Arrays
  * Arrays may have a single trailing comma
* Strings
  * Strings may be single quoted
  * Strings may span multiple lines by escaping new line characters
  * Strings may include character escapes
* Numbers
  * Numbers may be hexadecimal
  * Numbers may have a leading or trailing decimal point
  * Numbers may be IEEE 754 positive infinity, negative infinity, and NaN
  * Numbers may begin with an explicit plus sign
* Comments
  * Single and multi-line comments are allowed
* White Space
  * Additional white space characters are allowed

Out of these changes, the two that I find more useful is the ability to add trailing commas to arrays and objects and the ability to add comments.

The trailing commas are useful because, as in Javascript, it makes it easier to add new items to the end of an array or object or reorganize the array or object while refactoring.

The comments are useful because it allows you to document the JSON file without having to worry about breaking the syntax.

The other changes to the JSON5 grammar make it easier to work with as we don't have the cognitive load to switch between Javascript and JSON with its slight but fignificant differences.

I also understad that working with JSON5 requires additional libraries to be installed and used in the code. However, I find that the benefits of using JSON5 outweigh the costs of having to install and use additional libraries.

## Example

This is what a JSON5 file looks like:

```json5
{
  // single  line comments
  unquoted: 'and you can quote me on that',
  singleQuotes: 'I can use "double quotes" here',
  lineBreaks: "Look, Mom! \
No \\n's!",
  /*
   * I can use block comments that span
   * multiple lines in JSON5
   */
  backslashEscapes: 'And if you think \n is a newline, you should see \t this',
  // Trailing commas are allowed
  trailingCommas: [
    'in arrays',
    'and in objects',
  ],
  // Numbers can be hexadecimal
  */
  hexadecimal: 0xdecaf,
  leadingDecimalPoint: .8675309, andTrailing: 8675309.,
  positiveSign: +1,
  trailingComma: 'in objects', andIn: ['arrays',],
  "backwardsCompatible": "with JSON",
}
```

Then we could create a script that reads JSON5 data and outputs it to console.

```js
import fs from 'fs'
import path from 'path'
import JSON5 from 'json5'

function readJSON5File(filePath) {
  const absolutePath = path.resolve(filePath)
  const content = fs.readFileSync(absolutePath, 'utf-8')
  return JSON5.parse(content)
}

// Read and log JSON5 data
const data = readJSON5File('./config.json5')
console.log('Parsed JSON5 Data:', data)
```
