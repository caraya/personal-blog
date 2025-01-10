---
title: Getting Started with Typescript
date: 2025-01-27
tags:
  - Typescript
  - Javascript
---

Typescript is a superset of Javascript.It provides type checking and object-oriented programming features on top of Javascript.

This post will explore Typescript and some basic areas:

* What it is
* How it works
* Installation
* Configuration

## Background

Typescript is a superset of Javascript that adds type checking and additional features to Javascript.

It is a statically typed language, the type of a variable is known at compile time. This allows for better error checking and code completion in an IDE and prevents many common runtime errors in Javascript front-end code.

All valid Javascript code is also valid Typescript code (but not all Typescript code is valid Javascript), so you can start using Typescript in your existing projects without having to rewrite everything. It also allows you to migrate your code to Typescript incrementally, by adding types to your existing Javascript code, typecheck your Javascript code and then gradually convert it to Typescript.

### Adding types

Most of the time you'll just leave your code as is and Typescript will infer the types for you.

Most of the time Typescript will correctly infer the types of your variables, functions, etc. without you having to explicitly declare them.

For example, in the following code snippet, Typescript will infer that the type of both variables is `number`.

```typescript
function add(a, b) {
  return a + b;
}
```

All the values in the function as defined are of the value `any`. This is the default type in Typescript.

Most of the time this will be OK, but there are times when you'll want to be explicit about the types of your variables, functions, etc.

For example, if you want to make sure that a variable is a number, you can explicitly declare its type like this:

```typescript
function add(a: number, b: number) {
  return a + b;
}
```

While may not be idiomatic Typescript, it helps to understand what the code is meant to do and it makes it easier for people reading the code to understand what it's meant to do.

You can also declare the return type of a function. In our previous example, we can add the return type like this:

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

This tells Typescript that the function takes two numbers as arguments and returns a number as the result.

### Types and Type Unions

Boolean
: True or False values

Number
: All numbers in TypeScript are either floating point values or BigIntegers. Floating point numbers get the type `number`, while BigIntegers get the type `bigint`
: In addition to hexadecimal and decimal literals, TypeScript also supports binary and octal literals introduced in ECMAScript 2015.

String
: Typescript uses the type `string` to refer to textual datatypes.
TypeScript also uses double quotes (`"`) or single quotes (`'`) to surround string data.

Array
: Array types can be written in one of two ways
: For the first way, you use the type of the elements followed by [] to denote an array of that element type: `let list: number[] = [1, 2, 3];`
: The second way uses a generic array type, Array&lt;elemType>: `let list: Array<number> = [1, 2, 3];`

Tuple
: Tuple types allow you to express an array with a fixed number of elements whose types are known, but need not be the same.
: This example defines a tuple of a string and a number `let x: [string, number];`
: The order you define the objects matters so `let x: [string, number] = [10, 'hello'];` will throw an error because the order of the elements in the tuple doesn't match its type definition.

Enum
: An enum is a way of giving more friendly names to sets of numeric values.
: By default, enums begin numbering their members starting at 0. You can change this by manually setting the value of one of its members. Or, even manually set all the values in the enum.

Unknown
: Describes the type of variables that we do not know when we are writing an application.
: These values may come from dynamic content &mdash; e.g. from the user &mdash; or we may want to intentionally accept all values in our API. In these cases, we want to provide a type that tells the compiler and future readers that this variable could be anything.

Any
: Represents cases where not all type information is available or its declaration would take an inappropriate amount of effort.
: These cases may occur for values from code that has been written without TypeScript or a 3rd party library. In these cases, the `any` type tells the compiler that we want to opt-out of type checking
: All the convenience of `any` comes at the cost of losing type safety. Type safety is one of the main motivations for using TypeScript and you should try to avoid using `any` when not necessary.

Void
: `void` is a little like the opposite of `any`: it represents the absence of having any type at all. You commonly see this as the return type of functions that do not return a value
: Declaring variables of type void is not useful because you can only assign null (only if `strictNullChecks` is not specified) or undefined to them

Null and Undefined
: In TypeScript, both `undefined` and `null` have their own types named `undefined` and `null`. Much like void, they’re not extremely useful on their own
: By default null and undefined are subtypes of all other types. That means you can assign null and undefined to something like number.
: However, when using the `strictNullChecks` flag (discussed later), `null` and `undefined` are only assignable to `unknown`, `any` and their own types (the one exception being that undefined is also assignable to void). This helps avoid many common errors.
: In cases where you want to pass in either a string or null or undefined, you can use the union type `string | null | undefined`.

Never
: The `never` type represents the type of values that never occur. For instance, `never` is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns. Variables also acquire the type `never` when narrowed by any type guards that can never be true.
: The never type is a subtype of, and assignable to, every type; however, no type is a subtype of, or assignable to, never (except never itself). Even any isn’t assignable to never

Object
: `object` is a type that represents the non-primitive type, i.e. anything that is not `number`, `string`, `boolean`, `bigint`, `symbol`, `null`, or `undefined`.
: With object type, APIs like `Object.create` can be better represented.

### Type assertions

Sometimes you’ll end up in a situation where you’ll know more about a value than TypeScript does. Usually, this will happen when you know the type of some entity could be more specific than its current type.

Type assertions are a way to tell the compiler “trust me, I know what I’m doing.” A type assertion is like a type cast in other languages, but it performs no special checking or restructuring of data. It has no runtime impact and is used purely by the compiler. TypeScript assumes that you, the programmer, have performed any special checks that you need.

One is the as-syntax:

```typescript
let someValue: unknown = "this is a string";

let strLength: number = (someValue as string).length;
```

The other version is the “angle-bracket” syntax:

```typescript
let someValue: unknown = "this is a string";

let strLength: number = (<string>someValue).length;
```

### Union types

TypeScript’s type system allows you to build new types out of existing ones using a large variety of operators. Now that we know how to write a few types, it’s time to start combining them in interesting ways.

The first way to combine types you might see is a union type. A union type is a type formed from two or more other types, representing values that may be any one of those types. We refer to each of these types as the union’s members.

Let’s write a function that can operate on strings or numbers:

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
// Error
printId({ myID: 22342 });
// Argument of type '{ myID: number; }' is not assignable
// to parameter of type 'string | number'.
```


It’s easy to provide a value matching a union type - simply provide a type matching any of the union’s members. If you have a value of a union type, how do you work with it?

**TypeScript will only allow an operation if it is valid for every member of the union.** For example, if you have the union `string | number`, you can’t use methods that are only available on strings or numbers but not both. This is were type narrowing comes in, it'll work around the restriction on union types by checking for the variable's specific type.

### Type Narrowing

There are times when an element may have more than one possible type. For example, the `getElementById` method of the `document` object can return either  `HTMLElement` or `null`. You can run different code based on the type of the element.

```typescript
const el = document.getElementById('foo');
// Type is HTMLElement | null
if (el) {
  el // Type is HTMLElement
  el.innerHTML = 'Party Time';
} else {
  el // Type is null
  alert('No element #foo');
}
```

The resulting Javascript code looks pretty similar but everything that is Typescript specific is removed from the resulting code.

```js
var el = document.getElementById('foo');
if (el) {
    el;
    el.innerHTML = 'Party Time';
}
else {
    el; // Type is null
    alert('No element #foo');
}
```

This is important to remember. **All Typescript code is removed from the resulting Javascript file**. This makes Typescript a development tool and not a runtime tool.

## Type Aliases

Type aliases create a new name for a type. This allows for reusing types and creating more descriptive names for types in your project.

```typescript
type Person = {
	name: string;
	age: number;
};
```

We can then use the `Person` type in our code like this:

```typescript
function showAuthor(author: Person) {
	console.log(author.name);
	console.log(author.age);
}

function talkAboutAuthor(author: Person) {
	console.log(`The author is ${author.name} and they are ${author.age} years old.`);
}
```

We didn't have to repeat the type definition for the `Person` type in both functions. We can just use the `Person` type in both places.

## Interfaces

Interfaces provide another way to define custom types. We could define our `Person` type as an interface like this:

```typescript
interface Person {
	name: string;
	age: number;
}
```

and then call `showAuthor` and `talkAboutAuthor` without making any changes to the code.

Most of the time, it really won't matter if you use a type alias or an interface. The only when you may want to use an interface instead of a type is if you want to reopen the type and extend it... only interfaces will let you do this

## Typescript installation

There are two ways to install Typescript:

You can install it globally so you can use it from the command line without having to specify the path to the Typescript compiler.

```bash
npm i -g typescript
```

You can then run the Typescript executable from the command line anywhere on your system.

```bash
tsc --version
```

You can also install Typescript locally in your project so you can use a specific version of Typescript for your project.

Assuming that you already have a `package.json` file in place you can run the following command to install Typescript locally.

```bash
npm i -D typescript
```

You can then run the Typescript compiler from the `node_modules` directory.

```bash
./node_modules/.bin/tsc --version
```

Which method you choose it will depend on your project and your needs.

For the projects I write for this blog, I use a global install and then configure it for each project if necessary, a lot of the time, working with default values will work fine.

For larger or cooperative projects it is better to install Typescript as a project dependency and store the Typescript configuration in the project's repository, this way, everyone will be using the same version of Typescript and the same configuration.

We'll discuss the configuration file (`tsconfig.json`) in the next section.

## Configuration

Typescript uses a configuration (`tsconfig.json`) file to specify how the Typescript compiler should behave. The configuration file should be placed in the root of your project.

To create a configuration file, run the following command:

```bash
tsc --init
```

This will create a `tsconfig.json` file in the directory you run the command from.

We will not go through all the options in the configuration file, but we will discuss a few of the most important ones.

### Declaration

Generating declaration files in TypeScript allows you to use JavaScript libraries or your own JavaScript code in TypeScript projects with proper type checking and IntelliSense. Here are a few ways to generate them:

#### Using the TypeScript Compiler (tsc)

THe first option is to enable the declaration in `tsconfig.json`.

```js
{
  "compilerOptions": {
    "declaration": true
  }
}
```

#### Using the --declaration flag directly

```bash
tsc --declaration myFile.ts
```

This generates a declaration file for the specified file.

#### Using Third-Party Libraries

Most popular JavaScript libraries have declaration files available in the [DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped). Install them using npm:

```bash
npm install --save-dev @types/library-name
```

Some libraries include their own declaration files. Check the library's documentation for instructions.

### Target

The `target` option specifies the ECMAScript target version for the compiled JavaScript files. You will want to ensure that your target will support all the language features that you need.

The dedault value is `es5`

Possible values are:

* es6/es2015
* es2016
* es2017
* es2018
* es2019
* es2020
* es2021
* es2022
* es2023
* es2024
* esnext

```js
{
	"compilerOptions": {
		"target": "ES5"
	}
}
```

### Strict

Enable all strict type-checking options.

Default: false.

```js
{
	"compilerOptions": {
		"strict": true
	}
}
```

### AllowJs and checkJs

`allowJs` allows JavaScript files to be a part of your program.

`checkJs` enables type checking in the included JavaScript files.

```js
{
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true
	}
}
```

### Modules

Specify what module code is generated. What module you choose will depend on your project, but there's no reason to choose anything other than `esnext` or `es2022` if you are working on a modern project.

The default value is `undefined`.

```js
{
	"compilerOptions": {
		"module": "es2022"
	}
}
```

Possible options:

* none
* commonjs
* amd
* umd
* system
* es6/es2015
* es2020
* es2022
* esnext
* node16
* nodenext
* preserve

### Bundled libraries

You can include bundled libraries in your project by adding them to the `lib` option.

You can choose the full libraries for each annual release of ECMAScript or you can choose individual feature from each version.

There are also additional libraries that you can include: DOM	(DOM definitions), WebWorker	(APIs available in WebWorkers) and ScriptHost	(APIs for the Windows Script Hosting System) and Intl (APIs that are part of the ECMA 402 internationalization specification).

* es5
* es6/es2015
* es7/es2016
* es2017
* es2018
* es2019
* es2020
* es2021
* es2022
* es2023
* es2024
* esnext
* dom
* dom.iterable
* dom.asynciterable
* webworker
* webworker.importscripts
* webworker.iterable
* webworker.asynciterable
* scripthost
* es2015.core
* es2015.collection
* es2015.generator
* es2015.iterable
* es2015.promise
* es2015.proxy
* es2015.reflect
* es2015.symbol
* es2015.symbol.wellknown
* es2016.array.include
* es2016.intl
* es2017.arraybuffer
* es2017.date
* es2017.object
* es2017.sharedmemory
* es2017.string
* es2017.intl
* es2017.typedarrays
* es2018.asyncgenerator
* es2018.asynciterable/esnext.asynciterable
* es2018.intl
* es2018.promise
* es2018.regexp
* es2019.array
* es2019.object
* es2019.string
* es2019.symbol/esnext.symbol
* es2019.intl
* es2020.bigint/esnext.bigint
* es2020.date
* es2020.promise
* es2020.sharedmemory
* es2020.string
* es2020.symbol.wellknown
* es2020.intl
* es2020.number
* es2021.promise
* es2021.string
* es2021.weakref/esnext.weakref
* es2021.intl
* es2022.array
* es2022.error
* es2022.intl
* es2022.object
* es2022.string
* es2022.regexp
* es2023.array
* es2023.collection
* es2023.intl
* es2024.arraybuffer
* es2024.collection
* es2024.object/esnext.object
* es2024.promise/esnext.promise
* es2024.regexp/esnext.regexp
* es2024.sharedmemory
* es2024.string/esnext.string
* esnext.array
* esnext.collection
* esnext.intl
* esnext.disposable
* esnext.decorators
* esnext.iterator
* decorators
* decorators.legacy

```js
{
	"compilerOptions": {
		"lib": [
			"es2024",
			"dom",
			"webworker"
		]
	}
}
```

New libraries will be added to Typescript will be added as new versions of ECMAScript are ratified and implemented in browsers.

## Final notes

This is a very basic introduction to Typescript, its installation and configuration. There are many more features in Typescript that we haven't covered here

The discussion about configuration is very basic and not complete. For a full reference, see the [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
