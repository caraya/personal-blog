---
title: "Exploring Typescript(2): The Language"
date: "2023-09-11"
---

In the previous post we looked the tools we need to get Typescript transformed into Javascript to use in the browser.

In this post we'll take a first look at the language itself and will discuss some features I've found particularly useful as I'm learning the language.

## Things to know about Typescript

What do we mean when we say that Typescript is a superset of Javascript?

Typescript is a syntactic superset of Javascript, meaning that any valid Javascript file with no errors is also a valid Typescript file. The Typescript compiler may output errors and warnings but will still compile into working code.

This is useful when you're migrating to Typescript since the code will work without changes on either language.

However, the reverse is not true. If you want to bring Typescript code into a Javascript codebase without transpiling it first you can expect to do significant work to make it work.

Typescript is good to use but at times it can be really infuriating to learn how to use it and to use it properly.

### When to add types and when not to

The Typescript compiler is really good at inferring (guessing) the type of your parameters, variables or return values so it's usually OK to let it do its thing.

It is only when we get an unexpected value or when the compiler gives an error that we should explicitly add types to your code.

Pay particular attention when the compiler tells you that there's a type mismatch. An error like `Type '1234' is not assignable to type 'string'` may indicate that we need to be explicit about types, even if it's just to remind whoever looks at the code about our original intentions.

Take for example the following function signature in Javascript.

```js
function setRootVar(
  name,
  otname,
  value
) {}
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
function setRootVar(
  name: string,
  value: string,
  otname?: string) {}
```

Using an optional parameter also forced me to change the order of parameters. Optional parameters must be the last ones on the list.

### Declare your types first, then build around them

Typescript checks are concerned with the shape of an object and will use that shape to check if we're doing the right thing.

As we start working with code either from scratch or modifying an existing codebase we may want to start by defining the types that we want to use in an interface.

Let's assume that we defined a `person` interface with three values, two strings and an optional string.

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

The next example is an administrator. In this example we'll [extend](https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types) the `Person` interface with additional information that is only relevant for administrators.

```typescript
interface Administrator extends Person {
  signedRelease: boolean;
  accountEnabled: boolean;
}
```

Because the `Administrator` interface extends `Person`, we get everything from `Person` in addition to what we get from `Administrator`. We're saying an administrator is a person.

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

We can instantiate both `Person` and `Admin` at the same time.

```ts
const employee: Administrator = {
  firstName: "Peter",
  lastName: "Quill",
  userName: "starlord",
  signedRelease: true,
  accountEnabled: true,
};
```

And then we can call `createAdmin` with the employee as a parameter. Since we know that `employee` matches the shape of the `Admin` interface we should get no errors.

### Types and Interfaces

I first learned about Types and Interfaces in Typescript from [Types vs. interfaces in TypeScript](https://blog.logrocket.com/types-vs-interfaces-typescript/). I still use it as a reference.

#### Types

`type` is a keyword in TypeScript that we use to define the shape of data. In essence we tell Typescript what each type represents and make it easier for developers to reason through our code.

#### Primitive Types

- String
- Boolean
- Number
- Array
- Any

There are other types worth noting:

- [Tuple](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
- [Enum](https://www.typescriptlang.org/docs/handbook/enums.html#handbook-content)

There are more types available. You can consult the [Typescript Type Docs](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

#### Type Aliases

The next type to look at are type aliases where we basically assign a name to a primitive or a union type.

In this example the `age` type references a number.

```typescript
type age = number;
```

So now whenever we want to reference an `age` number we use the alias type.

```typescript
function calculateAnswer(answer: age) {
  console.log(answer)
}
```

We will revisit type aliases and union types when we discuss guard rails.

#### Union Types

There are times when we want a type to have more than one possible type. Let's say that we want our answers to be a string or a number.

We can do so in Typescript, using a command like this:

```typescript
type answer = string | number;
```

So whenever we use answer, we can use either a string or a number.

We can also create custom types for our union.

```typescript
type transportation = 
  'Car' |
  'Bus' |
  'Walk' |
  'Bicyle' |
  'Uber';
```

However, we may still get warnings from Typescript regarding type assignments. That's where safeguards come in handy.

#### Interfaces

An interface defines a the shape of an object. Typescript only cares about the shape of the object we define and that any object defined by the inreface has the expected properties.

#### Differences Between Types and Interfaces

Types and interfaces share most features. The key difference is that you can't reopen a type definition to add new properties, which is something you can do with an interface.

The following code is legal. We can add multiple items to the `Car` interface after it has been defined.

```typescript
interface Car {
  brand: string,
  model: string,
  year?: number
}

interface Car {
  doors: number
  hatchbak?: boolean
  automatic?: boolean
}

// This is equivalent to

interface Car {
  brand: string,
  model: string,
  doors: number,
  year?: number,
  hatchbak?: boolean
  automatic?: boolean
}
```

We can then assign the interface to a parameter. In `buyCar` we're telling Typescript that the `myCar` parameter is of type `Car` with all the parameters we've built into the interface.

```typescript
function buyCar(myCar: Car) {
console.log(`You're buying a ${myCar.doors}-door ${myCar.brand} ${myCar.model}`)
}
```

Now, when we instantiate the buyCar function we must pass all required parameters from the `Car` interface.

```typescript
buyCar({
  brand: 'Honda',
  model: 'Civic',
  doors: 4
})
```

#### Narrowing

[Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) is a way to handle when we define parameters to have multiple possible types.

The `padLeft` function takes Two attributes:

1. A padding that can be either a string or a number
    
    1. The function will work differently if the padding is a string or a number
2. An input that indicates the character to display after the padding.

If we write it in Javascript the function would look like this:

```js
function padLeft(padding, input) {
  return " ".repeat(padding) + input;
}
```

Unless you've documented the function or you're the author (and remember what your intent was) it's impossible to tell what values should we pass to the parameters.

If you pass an unexpected parameter to the function it'll produce undefined as a result or it will do something equally unexpected.

Typescript makes this easier. In this version we indicate the types for each of the parameters.

```typescript
function padLeft(padding: number | string, input: string): string {
  return " ".repeat(padding) + input;
}
```

Typescript will complain about assignments to each parameter.

- A union of string and number cannot be assigned to a string
- A string cannot be assigned to a number

```text
Argument of type 'string | number' is not assignable to parameter of type 'number'.
  Type 'string' is not assignable to type 'number'.
```

This is where narrowing comes in handy. I've modified the last example to include a typeof type guard inside the function.

We check if the value of the `padding` parameter is a number. If it is then Typescript will treat `padding` as a number for the rest of the code inside the if block.

If it's not a number then Typescript will treat the value as a string.

```typescript
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

There are other types of narrowing options described in the [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). This is the one that I used most often.
