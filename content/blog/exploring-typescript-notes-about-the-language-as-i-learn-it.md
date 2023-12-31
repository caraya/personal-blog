---
title: "Exploring Typescript: Notes about the language as I learn it"
date: "2020-08-12"
---

Typescript is good to usee but at times it can be really infuriating to learn how to use it and to use it properly.

When you bring in Javascript files to convert to Typescript it will give you many surprises and not all of them are intuitive or easy to decipher.

It's important to remember that **_while Typescript will transpile to Javascript it's a superset of the ECMAScript specification, and you need to learn the differences_**.

These are not all the things I've learned but they are the most important to me.

### When to add types and when to let the compiler do its thing

The Typescript compiler is really good at inferring (guessing) the type of your parameters, variables or return values so it's usually OK to let it do its thing.

It is only when we get an unexpected value or when the compiler gives an error that we should explicitly add types to your code.

Pay particular attention when the compiler tells you that there's a type mismatch. For example, an error like `Type '1234' is not assignable to type 'string'` may indicate that we need to be explicit about types (or it may mean we made a mistake, it's always possible).

Take for example the following function signature in Javascript.

```js
function setRootVar(name, otname, value) {}
```

When I wrote it I instinctively knew that name and otname were strings and value was a number that would be cast as a string to accommodate CSS requirements.

But Typescript saw it as this:

```typescript
function setRootVar(name: any,
  otname: any,
  value: any) {}
```

The [any](https://www.typescriptlang.org/docs/handbook/basic-types.html#any) type tells the Typescript compiler to take any value you pass in and not check for validity; This defeats the purpose of type checking.

To make sure that the code works as we intended it to we have to explicitly add type declarations to the parameters.

As we said, the name is a string, otname is a string but it's optional and value will become a string so we'll define it as one from the beginning.

```typescript
function setRootVar(name: string,
  value: string,
  otname?: string) {
   // body of the function here
 }
```

Using an optional parameter also forced me to change the order of parameters. Optional parameters must be the last ones on the list.

### Declare your types first, then build around them

Typescript checks are concerned with the shape of an object and will use that shape to check if we're doing the right thing.

As we start working with code either from scratch or modifying an existing codebase we may want to start by defining the types that we want to use in an interface.

Let's assume that we defined a `person` interface with three values, two strings, and an optional string.

```typescript
interface Person {
  firstName: string;
  lastName: string;
  userName: string;
};
```

Then we can use the interface everywhere we need to identify a person. Below are some examples:

The first one is a person.

```typescript
function createPerson(person: Person): void {
  console.log(person.firstName);
  console.log(person.lastName);
  console.log(person.userName);
}
```

The next example is an administrator. In this example, we'll extend the Person interface with additional information that is only relevant for administrators.

```typescript
interface Administrator extends Person {
  signedRelease: boolean;
  accountEnabled: boolean;
}
```

Because the Administrator interface extends Person, we get everything from Person in addition to what we get from Administrator. We're saying an administrator is a person.

```typescript
function createAdmin(admin: Administrator): void {
  // These come from Person
  console.log(admin.firstName);
  console.log(admin.lastName);
  console.log(admin.userName);
  // These come from Administrator
  console.log(admin.signedRelease);
  console.log(admin.accountEnabled);
}
```

Another thing worth exploring is function overload. We can have multiple versions of a function with different parameters that perform different functions based on the type of the parameter.

This is different than generic types because we do know the type of the parameters ahead of time and we code the different functions to handle them.

### Generic types

One of the first things I saw and learned about Typescript was the idea of generic types.

There are times when we don't know what parameters we want to use, whether the kind of parameters we want to use will change over time, or whether we will want to use the same function in different contexts.

```typescript
function id<T>(arg: T): T {
  return arg;
}
```

The id can be a string or a number. Rather than hardcode the type we can use the generic function and decide when we instantiate it what type will it have.

This is legal:

```typescript
let outputString = id<string>("myString");
// outputString: string;
```

So is this:

```typescript
let outputNumber = id<number>(984323243);
// outputNumber: number;
```

This gives us additional flexibility when writing code that will grow along with our project.

### Declaration Files (yours and theirs)

Type declarations are ways of providing Type information about JavaScript codebase (which by their nature of being JavaScript lacks any type of information) to the TypeScript compiler. The type declarations are usually in external files with a `.d.ts` extension.

`npm` is the recommended tool for managing declaration files. When managing declaration files with `npm`, the TypeScript compiler would automatically find the declaration files.

If you want to generate declarations for your own projects you can use the `-d` flag for TSC. This will generate the declarations for you. It is not required but it may be good to have.

A final note about declarations. You're not guaranteed to find declaration files on NPM for all scripts and modules you use so you may have to create them yourself.

Most of the time the creation is simple and the error in your editor will tell you what to do. Other times you will have to create the complete declaration file; Use the [Declaration Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html) and the Declaration [Deep Dive](https://www.typescriptlang.org/docs/handbook/declaration-files/deep-dive.html) when building it.

### Documenting Typescript code

I documented Javascript code with [JSDoc](https://jsdoc.app/) in comments before the functions or the code.

Typescript supports a [subset](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) of JSDoc so I can leverage some Typescript functionality in my existing comments.

[typedoc](https://typedoc.org/) provides a Typescript-specific documentation system. I may try it in a Typescript-only project but I'm hesitant to throw away all the JSDoc documentation I've already written.

### Working with HTML

Working with HTML in Typescript is more complicated than the equivalent Javascript.

Because we need to add types to elements that are not strictly part of the script, we must use type assertions to make sure the compiler understands what we want to do.

Take the following code snippet as an example:

```js
const weight = document.getElementById('robotoWeight');
const weightSlider = document.querySelector('.weightSlider');
weightSlider.innerHTML = weight.value;
```

The compiler has no way of knowing what type of element `weight` or `weightSlider` reference because it lacks the context of the page the script will run in. The compiler throws an error on the last line of the example because HTMLElement doesn't have a value property.

One solution is to use [type assertions](https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions) to modify the code to specify what we mean and what type of HTML elements we're referencing to.

```typescript
const weight = document.getElementById('robotoWeight') as HTMLInputElement;
const weightSlider = document.querySelector('.weightSlider') as HTMLElement;
weightSlider.innerHTML = weight.value;
```

So now the compiler knows what type of HTML element weight references and that it has a value attribute. Problem solved.

The [HTMLElement Interface](https://html.spec.whatwg.org/multipage/semantics.html#htmlhtmlelement) and its children provide a comprehensive list of all the elements you can cast to when working with Typescript.

There's a lot more to learn about Typescript but so far it's boiled to this:

**Be disciplined in working with Typescript as it won't hesitate to fail the compilation and tell you where you were wrong, and stare at you while you try and figure out what the errors mean.**
