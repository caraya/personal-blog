---
title: Looping Through Nested JSON Objects
date: 2024-06-28
tags:
  - Javascript
  - JSON
  - Parsing
---

Looping through a flat JSON file is easy, doing the same through a nested JSON object, is not so easy.

There is no built-in way to loop through nested arrays of JSON properties so we have to develop our own strategies.

The solution is encapsulated in the `logJSON` function. It does the following:

1. Check if the JSON input is null or undefined. If it is, then return, there's nothing to do
2. Check the type of the incoming JSON object using the [typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof) operator. We will use this check later
3. If the object is a number, a string or a boolean value
4. If the items is not an object then we throw an error, it's not an array or an object
5. The final check is and if/else block for arrays and objects. In both these instances we recursively call `logJSON` to process the children elements

```js
function logJSON(json, indent = '') {
    // 1
    if (json === null || json === undefined) {
      console.log(`${indent}null`);
      return;
    }

    // 2
    const jsonType = typeof json;

    // 3
    if (jsonType === 'string' || jsonType === 'number' || jsonType === 'boolean') {
        console.log(`${indent}${JSON.stringify(json)}`);
        return;
    }

    // 4
    if (jsonType !== 'object') {
        console.error(`${indent}Error: Unsupported data type`);
        return;
    }

    // 5
    if (Array.isArray(json)) {
        console.log(`${indent}[`);
        json.forEach((value, index) => {
            console.log(`${indent}  [${index}]`);
            logJSON(value, indent + '    ');
        });
        console.log(`${indent}]`);
    } else {
        console.log(`${indent}{`);
        for (const [key, value] of Object.entries(json)) {
            console.log(`${indent}  "${key}":`);
            logJSON(value, indent + '    ');
        }
        console.log(`${indent}}`);
    }
}
```

The code should work well, but there's an unsolved issue with it.

As written, the code doesn't handle [circular references](https://www.geeksforgeeks.org/why-circular-reference-is-bad-in-javascript/) in the JSON file.

To handle detecting circular references, I've made the following changes.

create a new [set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) and call it `visited`. I chose to use a set because it will only store unique values, there can't be any duplicates.

For every element, we add it to the `visited` Set. Once we're done processing the node, we remove it from the set to make sure that we can process other instances of the same element later.

```js
function logJSON(json, indent = '', visited = new Set()) {
    if (json === null || json === undefined) {
        console.log(`${indent}null`);
        return;
    }

    const jsonType = typeof json;

    if (jsonType === 'string' || jsonType === 'number' || jsonType === 'boolean') {
        console.log(`${indent}${JSON.stringify(json)}`);
        return;
    }

    if (jsonType !== 'object') {
        console.error(`${indent}Error: Unsupported data type`);
        return;
    }

    // Handling circular references
    if (visited.has(json)) {
        console.log(`${indent}Circular reference detected`);
        return;
    }

    // Mark the current object as visited
    visited.add(json);

    if (Array.isArray(json)) {
        console.log(`${indent}Array: [`);
        json.forEach((value, index) => {
            console.log(`${indent}  [${index}]`);
            logJSON(value, indent + '    ', visited);
        });
        console.log(`${indent}]`);
    } else {
        console.log(`${indent}Object: {`);
        for (const [key, value] of Object.entries(json)) {
            console.log(`${indent}  "${key}":`);
            logJSON(value, indent + '    ', visited);
        }
        console.log(`${indent}}`);
    }

    // Unmark the current object after processing to allow re-visiting in other branches
    visited.delete(json);
}
```

There is a lot of code to do this but it should work for most nested JSON code.

For simplicity's sake, I chose to log the output to console. In production code we'll definitely want to do something more useful :).
