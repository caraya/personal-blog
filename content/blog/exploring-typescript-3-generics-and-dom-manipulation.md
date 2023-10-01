---
title: "Exploring Typescript (3): Generics and DOM manipulation"
date: "2023-09-13"
---

There are a couple of additional items that I though were important enough to cover: generics and DOM manipulation.

## Generics

One of the things I find most interesting about Typescript is the idea of generic types.

There are times when we don't know the type of the parameters we want to use, whether the kind of parameters we want to use wil change over time, or whether we want to use the same function in different contexts.

For example, we may want the ID to be a string, or a number but we won't know which one it is until we run the code.

Yes, we could create a union type of string and number but it is brittle, if we need add another valid type, either primitive or custom.

```typescript
function id<T>(arg: T): T {
  return arg;
}
```

The id can be a string or a number. Rather than hardcode the type we can use the generic function and decide when we instantiate it what type will it have.

This is legal:

```typescript
let outputString = id<string>("string");
// outputString: string;
```

So is this:

```typescript
let outputNumber = id<number>(98);
// outputNumber: number;
```

And this is legal too by using type inference.

```typescript
let outputNumber = id(32);
```

This gives us additional flexibility when writing code that will grow along with our project.

For more information, check the [generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) Typescript documentation.

## Working with HTML

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

So now the compiler knows what type of HTML element weight references and that it has a value attribtue. Problem solved.

Typescript provides several interfaces for DOM manipulation.

The interfaces are:

- [Document](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html#the-document-interface)
- [Node](https://www.typescriptlang.org/docs/handbook/dom-manipulation.html#the-node-interface)

If you really want to dig deeper into the DOM types available, you can check the [DOM type definitions](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) that are part of the default Typescript installation.

For more information, you can check the MDN pages for DOM APIs, starting with [HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement).

I'm still learning Typescript. This is what I've used so far but there's still a lot more to explore
