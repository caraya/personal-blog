---
title: "Punycode and IDN: URLs in your language"
date: 2026-05-27
tags:
  - URLs
  - Punycode
  - Web
  - Internationalization
---

The DNS originally handled only a small subset of characters: letters (a-z), digits (0-9), and hyphens. This constraint is known as the LDH rule (Letters, Digits, Hyphens).

As the web globalized, users required domain names in native scripts, such as Arabic, Chinese, or Cyrillic. However, changing the global DNS infrastructure to support Unicode would have made millions of legacy systems non-functional. Punycode resolves this by translating Unicode strings into LDH-compliant ASCII strings.

Punycode represents Unicode strings using the limited ASCII character set. This technical standard enables internationalized domain names (IDNs) to function within the legacy domain name system (DNS) infrastructure.

This post will explore Punycode and how it works together with other technologies to enable internationalized domain names. It also covers security implications and provides a bare-bones, non-production ready implementation of the Punycode algorithm as defined in [RFC 3492](https://www.rfc-editor.org/rfc/rfc3492.html).

## The mechanics: How it works

Punycode uses a system called Bootstring. The algorithm transforms strings in a unique, reversible, and efficient manner.

### The `xn--` prefix

Every Punycode domain uses the `xn--` prefix. This ASCII-compatible encoding (ACE) prefix signals to browsers and DNS servers that the following string is an encoded Unicode address rather than literal text.

### The transformation steps

1. **Separation**: The algorithm extracts all standard ASCII characters from the original string.
2. **The base**: The algorithm places these ASCII characters at the beginning of the new string.
3. **The delimiter**: A hyphen (-) separates the literal ASCII base from the encoded section.
4. **The encoding**: The algorithm converts non-ASCII Unicode characters into numerical "deltas" based on their position in the Unicode table and appends them to the end.

## Translation examples

| Context | Unicode domain | Punycode equivalent (ASCII) |
| :---: | --- | --- |
| French | liberté.fr | xn--libert-gva.fr |
| Korean | 아이티.com | xn--2e0b808b.com |
| Thai | ไทย.or.th | xn--o3cw4h.or.th |
| Emoji | ☕.com | xn--n28h.com |
| Japanese | 日本語.jp | xn--54qv48g.jp |

## Security: The IDN homograph attack

The IDN homograph attack represents the most significant security challenge for Punycode. In this attack, a malicious actor uses visually similar characters from different scripts to deceive users.

### Types of spoofing

* **Mixed-script spoofing**: Combining characters from two or more scripts, such as replacing a Latin "a" with a Cyrillic "а" in apple.com.
* **Whole-script spoofing**: Creating a domain using characters entirely from a single non-Latin script that mirrors a Latin domain, such as using Cyrillic characters to render аррӏе.com.
* **Skeleton attacks**: Using "confusable" characters, such as the digit "1" instead of the lowercase "l".

### Browser mitigation strategies

Modern browsers like Chrome, Firefox, and Safari implement several defense layers:

* **Punycode fallback**: Browsers display the raw `xn--` string in the address bar if they detect suspicious character combinations.
* **Restriction profiles**: Browsers follow Unicode Technical Standard #39 to determine which scripts can safely mix.
* **TLD policies**: Many registrars for top-level domains (TLDs) like .de or .jp enforce strict rules regarding which Unicode characters users can register.

## Third-party libraries

For production environments, use established libraries that handle edge cases, normalization, and IDNA2008 standards.

### Standard libraries

* [punycode.js](https://github.com/bestiejs/punycode.js): The most widely used library for RFC 3492. Although Node.js deprecated the bundled version in favor of native APIs, it remains popular for browser applications.
* [tr46](https://github.com/jsdom/tr46): An implementation of [Unicode Technical Standard #46](https://www.unicode.org/reports/tr46/) (UTS #46). Browsers use this standard to process domain names because it manages complex mapping and transitional processing.
* [idna-uts46-hx](https://github.com/hexonet/idna-uts46): A lightweight, high-performance library for IDNA conversion adhering to UTS #46.

### Native APIs in Node.js

The Node.js `url` module provides native methods for domain conversion.

```ts
import { domainToASCII, domainToUnicode } from 'node:url';

// Unicode to ASCII
const ascii = domainToASCII('münchen.de'); // xn--mnchen-3ya.de

// ASCII to Unicode
const unicode = domainToUnicode('xn--mnchen-3ya.de'); // münchen.de
```

## Implementation: RFC 3492 parser

The following implementation provides the core Punycode encoding algorithm as defined in RFC 3492. It is a simplified version intended for educational purposes and should not be used in production environments.

!!!note  Note on implementation source:
This reference implementation derives directly from the technical specifications defined in RFC 3492. It is an original adaptation designed to translate the mathematical pseudocode of the RFC into modern, idiomatic TypeScript. Modifications include simplifying the adaptation logic for clarity and utilizing the array spread operator to handle Unicode surrogate pairs without the complexity of manual high/low surrogate detection.

The code was generated with Gemini Pro.
!!!

### Why this is not production-ready

While the following scripts are algorithmically correct, they are not suitable for production environments for several reasons:

* **Incomplete validation**: Production IDN software must implement the full [IDNA2008 framework](https://www.rfc-editor.org/rfc/rfc5891.html) (RFC 5891), which includes complex "PVALID" character lookup tables and bidirectional (Bidi) rules from [RFC 5893](https://www.rfc-editor.org/rfc/rfc5893.html).
* **Missing mapping rules**: Modern browsers follow UTS #46, which includes a mapping phase to handle user errors (like uppercase to lowercase conversion) before Punycode processing begins. This implementation assumes the input is already perfectly normalized.
* **Performance overhead**: We use high-level abstractions like `splice()` and spread operators ([...]) for clarity. Production libraries typically use lower-level buffers or pre-allocated `Uint32Array` objects to reduce garbage collection and improve processing speed.

### Code logic and implementation details

The parser relies on the Bootstring algorithm, which efficiently maps a large character set to a smaller one through state-based bias adaptation.

1. **Bias adaptation (`adapt` function)**: The algorithm uses a "bias" value to determine how to encode the distance (delta) between characters. The `adapt` function increases or decreases this bias based on how far apart characters are. This keeps the resulting ASCII string as short as possible.
2. **Encoding loop (`encode` function)**: The encode function first pulls out all basic ASCII characters. It then finds the next lowest Unicode codepoint and calculates the "delta" from the previous one. This delta is converted into a base-36 representation using letters and numbers.
3. **Decoding loop (`decode` function)**: The decode function reverses this process. It reads the base-36 digits, uses the current bias to reconstruct the numerical delta, and inserts the resulting Unicode character into the correct position in the string.

### Implementation: TypeScript Parser

The following implementation provides the core Punycode encoding and decoding algorithms as defined in RFC 3492. It utilizes TypeScript for type safety and clarity, using the spread operator ([...input]) to convert strings into arrays, which correctly handles 32-bit characters (like emojis) that standard string indexing might split.

```ts
// Bootstring parameters from RFC 3492 (Punycode profile)
const BASE = 36;
// Minimum threshold for variable-length integer encoding
const TMIN = 1;
// Maximum threshold for variable-length integer encoding
const TMAX = 26;
// Bias adaptation skew factor (controls how quickly bias changes)
const SKEW = 38;
// Damping factor applied during the first bias adaptation step
const DAMP = 700;
// Initial bias value before any code points are processed
const INITIAL_BIAS = 72;
// Initial code point value (start of non-ASCII range)
const INITIAL_N = 128;

/**
 * Bias adaptation function
 */
function adapt(delta: number, numPoints: number, firstTime: boolean): number {
  delta = firstTime ? Math.floor(delta / DAMP) : Math.floor(delta / 2);
  delta += Math.floor(delta / numPoints);
  let k = 0;
  while (delta > Math.floor(((BASE - TMIN) * TMAX) / 2)) {
    delta = Math.floor(delta / (BASE - TMIN));
    k += BASE;
  }
  return k + Math.floor(((BASE - TMIN + 1) * delta) / (delta + SKEW));
}

/**
 * Converts a digit into a basic code point
 */
function digitToBasic(digit: number): number {
  return digit < 26 ? digit + 97 : digit + 22;
}

/**
 * Encodes a Unicode string to Punycode
 */
function encode(input: string): string {
  const output: string[] = [];
  const inputChars = [...input];
  const nChars = inputChars.length;

  for (const char of inputChars) {
    if (char.charCodeAt(0) < 128) {
      output.push(char);
    }
  }

  const basicCount = output.length;
  let h = basicCount;
  if (basicCount > 0) {
    output.push('-');
  }

  let n = INITIAL_N;
  let delta = 0;
  let bias = INITIAL_BIAS;

  while (h < nChars) {
    let m = Math.min(...inputChars.map(c => c.codePointAt(0)!).filter(cp => cp >= n));
    delta += (m - n) * (h + 1);
    n = m;

    for (const char of inputChars) {
      const c = char.codePointAt(0)!;
      if (c < n) delta++;
      if (c === n) {
        let q = delta;
        for (let k = BASE; ; k += BASE) {
          const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
          if (q < t) break;
          output.push(String.fromCharCode(digitToBasic(t + (q - t) % (BASE - t))));
          q = Math.floor((q - t) / (BASE - t));
        }
        output.push(String.fromCharCode(digitToBasic(q)));
        bias = adapt(delta, h + 1, h === basicCount);
        delta = 0;
        h++;
      }
    }
    delta++;
    n++;
  }
  return output.join('');
}

/**
 * Decodes a Punycode string to Unicode
 */
function decode(input: string): string {
  let n = INITIAL_N;
  let i = 0;
  let bias = INITIAL_BIAS;
  let output: string[] = [];
  const delimiterIndex = input.lastIndexOf('-');

  let remainingInput = input;
  if (delimiterIndex > 0) {
    output = [...input.slice(0, delimiterIndex)];
    remainingInput = input.slice(delimiterIndex + 1);
  }

  let pos = 0;
  while (pos < remainingInput.length) {
    const oldI = i;
    let w = 1;
    for (let k = BASE; ; k += BASE) {
      const charCode = remainingInput.charCodeAt(pos++);
      const digit = charCode - 48 < 10 ? charCode - 22 : charCode - 97 < 26 ? charCode - 97 : BASE;
      i += digit * w;
      const t = k <= bias ? TMIN : k >= bias + TMAX ? TMAX : k - bias;
      if (digit < t) break;
      w *= BASE - t;
    }
    bias = adapt(i - oldI, output.length + 1, oldI === 0);
    n += Math.floor(i / (output.length + 1));
    i %= output.length + 1;
    output.splice(i++, 0, String.fromCodePoint(n));
  }
  return output.join('');
}
```

### Encoding and decoding IDNs

These examples use the `encode` and `decode` functions from the previous parser section, not Node.js URL module APIs.

Using those functions, you can convert a Unicode domain name to an IDN label and decode it back to Unicode.

To encode a Unicode domain name:

1. Encode the Unicode domain string using the `encode` function. You don't need to pass the full domain (`München.de`), just the part that needs encoding (`München`).
2. Prepend the `xn--` prefix to the encoded string and append the TLD (e.g., .de).

This gives you the Punycode form of the domain host label. To build a full URL, replace only the host portion and keep path, query, and fragment handling separate.

```ts
// Encoding Process
const stringToEncode = 'München'
const encodedString = encode(stringToEncode);
console.log(`Encoded String: ${encodedString}`);
// Result -> Mnchen-3ya
console.log(`Encoded URL: https://xn--${encodedString}.de`)
// Encoded URL: https://xn--Mnchen-3ya.de
```

To decode a Punycode domain name:

1. Decode the Punycode domain string (`Mnchen-3ya`) using the `decode` function.
2. Build the full URL by prepending the `https://` scheme and appending the TLD (.de) to the decoded string.

```ts
// Decoding Process
const stringToDecode = 'Mnchen-3ya'
const decodedString = decode(stringToDecode)
console.log(`Decoded String: ${decodedString}`)
// Result -> München
console.log(`Decoded URL: https://${decodedString}.de`)
// Decoded URL: https://München.de
```

## Summary and key takeaways

Punycode serves as a critical bridge between the historical constraints of the LDH rule and the modern requirements of a global, multilingual internet. By utilizing the Bootstring algorithm defined in RFC 3492, systems can represent complex Unicode characters within the legacy DNS infrastructure using the `xn--` prefix.

While the algorithm provides the mechanism for internationalized domain names (IDNs), you must also remain vigilant regarding the security implications of homograph attacks. Implementing IDNA2008 standards and utilizing robust, third-party libraries or native APIs ensures that your applications handle these conversions securely and efficiently. For production-ready software, prioritize audited libraries like punycode, tr46 or native Node.js modules over manual implementations.
