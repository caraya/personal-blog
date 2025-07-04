---
title: Exploring Decorators in Typescript and Javascript
date: 2025-07-09
tags:
  - Typescript
  - Javascript
  - Decorators
  - Metaprogramming
---

Typescript, a superset of Javascript that adds static typing, offers a powerful feature known as decorators. These provide a way to add annotations and meta-programming syntax for classes and their members.

As of Typescript 5.8, the language supports two distinct decorator implementations:

* The modern, ECMAScript decorators (TC39 Stage 3 as of this writing)
* The original, experimental decorators

This duality reflects the evolution of the decorator proposal within TC39 (the group that defines the Javascript standard).

This post will cover how decorators work, how to create and use them, and clarify the distinctions between these two versions and their relationship with the official TC39 proposal.

## Modern ECMAScript Decorators (The New Standard)

With the release of Typescript 5.0, the compiler introduced support for the then-Stage 3 TC39 proposal for decorators. This is the future-facing and recommended approach for using decorators in your projects.

### How to Enable and Use Modern Decorators

To use modern decorators, you do not need to enable the `experimentalDecorators` compiler option in your `tsconfig.json`. In fact, it should be disabled or absent.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    // "experimentalDecorators": false, // or simply not present
    "emitDecoratorMetadata": true // Still useful for metadata reflection
  }
}
```

Modern decorators can be applied to:

* Classes
* Class Methods
* Class Accessors (getters and setters)
* Class Fields (properties)
* A new construct called accessor fields

### Creating Modern Decorators

A modern decorator is a function that receives two arguments: the target being decorated and a context object containing metadata about the decoration.

A Simple Logging Decorator for a Method

```ts
function logged(target: Function, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function replacementMethod(this: any, ...args: any[]) {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = target.apply(this, args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }

  return replacementMethod;
}

class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @logged
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const p = new Person('Alice');
p.greet();

// Output:
// LOG: Entering method 'greet'.
// Hello, my name is Alice.
// LOG: Exiting method 'greet'.
```

In this example, the logged decorator replaces the original greet method with a new function that adds logging before and after its execution.

## Legacy Experimental Decorators

Prior to Typescript 5.0, the only way to use decorators was through an experimental implementation that was based on the stage 2 version of the TC39 proposal. While still supported for backward compatibility, new projects should avoid using it.

### How to Enable and Use Legacy Decorators

To use legacy decorators, you must enable the `experimentalDecorators` flag in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Legacy decorators could be applied to:

* Classes
* Methods
* Accessors
* Properties
* Parameters

### Creating Legacy Decorators

Legacy decorator functions receive different arguments depending on what they are decorating.

#### Example: A Legacy Logging Decorator for a Method

```ts
function legacyLogged(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function(...args: any[]) {
    console.log(`LOG: Entering method '${propertyKey}'.`);
    const result = originalMethod.apply(this, args);
    console.log(`LOG: Exiting method '${propertyKey}'.`);
    return result;
  };

  return descriptor;
}

class LegacyPerson {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @legacyLogged
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const lp = new LegacyPerson('Bob');
lp.greet();
```

### Key Differences: Modern vs. Legacy Decorators

The two decorator systems have significant differences in their capabilities, syntax, and runtime behavior.

| Feature               | Modern Decorators                                                                                            | Experimental Decorators                                                                 |
|-----------------------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| Enabling Flag         | experimentalDecorators: false (or absent)                                                                    | experimentalDecorators: true                                                            |
| Parameter Decorators  | Not supported.<br>This is a major departure.                                                                 | Supported.                                                                              |
| Decorator Arguments   | (target, context) where context is a rich metadata object.                                                   | Varies by decorator type (e.g., (target, propertyKey, descriptor) for methods).         |
| Return Value          | For methods, you return a new function. For classes, a new class.                                            | You often mutate the descriptor for methods and can optionally return a new descriptor. |
| Decorator Composition | Applied in reverse order of their appearance in code (bottom-up).                                            | Also applied in reverse order.                                                          |
| Metadata              | The context object provides metadata. The emitDecoratorMetadata flag can still be used for type information. | Heavily relies on the reflect-metadata library and the emitDecoratorMetadata flag.      |
| accessor Keyword      | Introduces the accessor keyword for creating decorated properties with get and set logic.                    | Not available.                                                                          |

## Typescript's Implementation vs. the TC39 Stage 3 Proposal

Typescript's implementation of modern decorators is designed to be a strict superset of the TC39 Stage 3 proposal. This means that any valid decorator according to the TC39 specification is also a valid Typescript decorator. However, Typescript adds its own layer of static type checking on top.

The core differences are not in the runtime behavior but in the design-time experience:

* **Type Safety**: Typescript provides strong type checking for decorators and their arguments. The `context` object in modern decorators, for instance, has a well-defined type (`ClassMethodDecoratorContext`, `ClassFieldDecoratorContext`, etc.) that ensures you are using it correctly
  * The TC39 proposal defines the Javascript behavior but doesn't enforce static types
* **Metadata Emission**: Typescript's `emitDecoratorMetadata` compiler option allows you to emit design-time type information into the generated Javascript
  * This is useful for frameworks that rely on metadata for dependency injection or other purposes
  * The TC39 proposal has a [separate metadata proposal](https://github.com/tc39/proposal-decorator-metadata/blob/main/README.md), but Typescript's implementation has been around longer and is widely used
* **emitDecoratorMetadata**: This Typescript-specific compiler option, when enabled, emits design-time type information into the generated Javascript. This is particularly useful for dependency injection frameworks that need to know the types of constructor parameters or properties at runtime
  * While the TC39 proposal has a separate, but related, metadata proposal, Typescript's `emitDecoratorMetadata` is a long-standing feature that works with both legacy and modern decorators

Typescript takes the standardized Javascript feature of decorators and enhances it with the static analysis and type safety. When writing modern decorators in Typescript, you are writing code that will be compatible with future Javascript runtimes that natively support decorators, while benefiting from Typescript's powerful development-time tooling.

## What feature of legacy decorators is missing in the modern version?

The most significant feature of legacy (experimental) decorators that is intentionally missing in the modern, TC39 Stage 3 version is Parameter Decorators.

### What Were Parameter Decorators?

In the legacy implementation, you can apply a decorator directly to a method or constructor parameter. Their primary purpose was to gather metadata about the parameters, a feature heavily used by dependency injection frameworks.

A parameter decorator function receives three arguments:

* **target**: The class constructor (for constructor parameters) or the prototype of the class (for method parameters).
* **propertyKey**: The name of the method the parameter belongs to (or undefined for constructor parameters).
* **parameterIndex**: The zero-based index of the parameter in the parameter list.

A common use case is to associate a "token" or key with a constructor parameter, telling a dependency injection container what to inject.

```ts
import "reflect-metadata";

function Inject(token: string) {
  return function(target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingInjections = Reflect.getOwnMetadata("custom:injections", target) || [];
    existingInjections[parameterIndex] = token;
    Reflect.defineMetadata("custom:injections", existingInjections, target);
  }
}

class ApiService { /* ... */ }
class LoggerService { /* ... */ }

class MyComponent {
  // @Inject is a parameter decorator
  constructor(
    @Inject("ApiService") private api: ApiService,
    @Inject("Logger") private logger: LoggerService
  ) {}
}

const injections = Reflect.getMetadata("custom:injections", MyComponent);
console.log(injections);
```

### Why Are They Missing in Modern Decorators?

TC39 made a deliberate decision to exclude parameter decorators from the official specification for several reasons:

* **Lack of a Clear Runtime Modification**: Unlike other decorators that can wrap, replace, or modify the decorated item (e.g., a method decorator can replace the method), parameter decorators had no direct way to change the parameter's behavior at runtime. Their role was purely reflective—for metadata.
* **Separation of Concerns**: The committee felt that the act of decorating a piece of code should be separate from the act of creating metadata for it. The new standard focuses on decorators as functions that can wrap and modify, while a separate (but related) decorator metadata proposal is being developed to handle the metadata aspect in a more explicit and robust way.
* **Complexity**: Supporting parameter decorators added significant complexity to the specification and implementation for a use case that could be handled by other means.
* **Complexity**: Supporting parameter decorators added significant complexity to the specification and implementation for a use case that could be handled by other means.

### The Modern Alternative: Metadata on the Class or Method

The primary use case of parameter decorators—obtaining type information for dependency injection—is still supported in modern Typescript, just through a different mechanism.

The `emitDecoratorMetadata: true` compiler option still works. However, instead of being consumed by a parameter decorator, the parameter type metadata (e.g., `design:paramtypes`) is now attached to the class decorator or the method decorator's context.

Frameworks are adapting to this new pattern. Instead of decorating the parameter, you would decorate the class, and the class decorator would be responsible for inspecting the constructor's metadata.

In short, while the feature of directly decorating a parameter is gone, its most important outcome &mdash; reflecting on parameter types for dependency injection &mdash; is still achievable by using class decorators in combination with Typescript's metadata emission.

