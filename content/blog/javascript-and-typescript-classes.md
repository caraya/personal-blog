---
title: Javascript and Typescript classes
date: 2025-07-07
tags:
  - Javascript
  - Typescript
  - Programming
  - Classes
---

Once merely syntactic sugar over prototype-based inheritance, JavaScript classes have matured into a powerful feature set, offering developers a more familiar and robust object-oriented programming paradigm. With the continuous evolution of the ECMAScript standard and the type-safe enhancements from Typescript, classes have become an indispensable tool for building modern, scalable applications.

This post will cover classes as they exist in the latest versions of Javascript, exploring their fundamental concepts and advanced features.

We will also cover the enhancements Typescript brings to classes.

## JavaScript Classes

Introduced in ECMAScript 2015 (ES6) and progressively enhanced in subsequent releases, JavaScript classes provide a clear and concise syntax for creating objects and managing inheritance.

### The Core Concepts: Declaration, Instantiation, and Constructors

At its heart, a class is a blueprint for creating objects. A class is defined using the `class` keyword.

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

const animal = new Animal('Generic Animal');
animal.speak();
```

The constructor is a special method for creating and initializing an object instance of a class. It is called automatically when a new instance of the class is created using the `new` keyword.

### Methods and Properties

Classes can contain methods, which are functions that belong to the class. In the `Animal` class above, `speak()` is a method.

Public instance fields are a more recent addition, allowing for the declaration of properties directly within the class body, outside of the constructor.

```js
class Car {
  make = 'Unknown';
  model;

  constructor(model) {
    this.model = model;
  }
}

const car = new Car('Civic');
console.log(car.make);
console.log(car.model);
```

### Inheritance: Extending Classes

JavaScript classes support single inheritance through the extends keyword, allowing a class to inherit properties and methods from another class. The `super` keyword is used to call the parent class's constructor and methods.

```js
class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    console.log(`${this.name} barks.`);
  }

  getBreed() {
    return this.breed;
  }
}

const dog = new Dog('Buddy', 'Golden Retriever');
dog.speak();
console.log(dog.getBreed());
```

### Static Members

Static members are properties and methods that are called on the class itself, rather than on an instance of the class. They are defined using the `static` keyword.

```js
class MathUtils {
  static PI = 3.14159;

  static add(x, y) {
    return x + y;
  }
}

console.log(MathUtils.PI);
console.log(MathUtils.add(5, 10));
```

### Private Members

Private class members, denoted by a hash prefix (`#`), were introduced in ES2022. These members are only accessible from within the class, providing true encapsulation.

In the `Counter` example below, you cannot use `#count` directly outside the class, you can use any class method that accesses it, such as `getCount()`.

```js
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }

  getCount() {
    return this.#count;
  }
}

const counter = new Counter();
counter.increment();
console.log(counter.getCount());
```

This includes private instance fields, private instance methods, private static fields, and private static methods.

### Getters and Setters

Getters and setters provide a way to define computed properties. They allow you to execute code when a property is accessed or modified.

```js
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  set fullName(newName) {
    [this.firstName, this.lastName] = newName.split(' ');
  }
}

const user = new User('John', 'Doe');
console.log(user.fullName);
user.fullName = 'Jane Smith';
console.log(user.firstName);
console.log(user.lastName);
```

## Typescript Class Enhancements

Typescript builds upon Javascript classes by adding powerful features, primarily centered around type safety and object-oriented programming principles.

### Access Modifiers

Typescript provides more granular control over member visibility beyond private fields (`#`), using access modifiers. The modifiers are:

* **`public`**: (Default) Members are accessible from anywhere.
* **`private`**: Members are only accessible within the same class.
* **`protected`**: Members are accessible within the same class and by subclasses.

```typescript
class Person {
  public name: string;
  private age: number;
  protected ssn: string;

  constructor(name: string, age: number, ssn: string) {
    this.name = name;
    this.age = age;
    this.ssn = ssn;
  }
}

class Employee extends Person {
  constructor(name: string, age: number, ssn: string) {
    super(name, age, ssn);
    console.log(this.ssn); // Accessible
  }
}

const person = new Person('Alice', 30, '123-45-678');
console.log(person.name); // Accessible

// console.log(person.age); // Error: 'age' is private...
// console.log(person.ssn); // Error: 'ssn' is protected...
```

Typescript's private and protected modifiers are enforced at compile-time and are not present at runtime in the generated JavaScript.

### Abstract Classes

Typescript introduces the concept of abstract classes. These classes cannot be instantiated directly and are meant to be subclassed. They can also have abstract members, which are method or property signatures that must be implemented by the subclasses.

```ts
abstract class Shape {
  abstract getArea(): number;

  getPerimeter(): string {
    return "Perimeter calculation not implemented";
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

If we create an instance of `Shape`, Typescript will throw an error because it is abstract:

```ts
const shape = new Shape();
```

However, we can create an instance of `Circle`, which extends `Shape` and implements the `getArea` method:

```ts
const circle = new Circle(10);
console.log(circle.getArea());
```

### Interfaces: Defining Contracts

Interfaces in Typescript are a powerful way to define contracts for the shape of an object. A class can implement an interface using the `implements` keyword, which enforces that the class adheres to the structure defined by the interface.

```ts
interface Printable {
  print(): void;
}

class Document implements Printable {
  print() {
    console.log("Printing document...");
  }
}
```

Typescript interfaces are purely a compile-time construct and do not exist in the generated JavaScript code.

Since interfaces are removed, you cannot use instanceof with an interface at runtime. If you need to check the "shape" of an object at runtime (for example, to validate data from an API response), you would need to use other methods, such as:

* **Writing a type guard function**: This is a user-defined function that performs checks on the object's properties at runtime.
* **Using a validation library**: Libraries like [Zod](https://zod.dev/), [Yup](https://github.com/jquense/yup), or [io-ts](https://github.com/gcanti/io-ts) are designed for this exact purpose, allowing you to define a schema and validate that an object conforms to it at runtime.

For example, for the following interface with required properties `id`, `name`, and `email`, and an optional property `bio`:

```ts
interface User {
  id: number;
  name: string;
  email: string;
  bio?: string; // The '?' character makes this property optional
}
```

We could write a type guard function like this:

```js
function isUser(obj) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const hasId = 'id' in obj && typeof obj.id === 'number';
  const hasName = 'name' in obj && typeof obj.name === 'string';
  const hasEmail = 'email' in obj && typeof obj.email === 'string';

  const hasValidBio = !('bio' in obj) || typeof obj.bio === 'string';

  return hasId && hasName && hasEmail && hasValidBio;
}
```

The `isUser` function does the following:

1. Check if the input is a non-null object
   1. If it is null or not an object, it returns false
2. Check for required properties and their types
3. Check that the optional exists and, if it does, ensure it's the correct type (string)
4. Return true if all checks pass

We would use the function to validate the object at runtime with various objects:

```ts
const validUser = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane.doe@example.com'
};

const validUserWithBio = {
  id: 2,
  name: 'John Smith',
  email: 'john.smith@example.com',
  bio: 'A software developer from New York.'
};

const invalidUser_missingKey = {
  id: 3,
  name: 'Incomplete Person'
  // Missing email
};

const invalidUser_wrongType = {
  id: '4', // Should be a number
  name: 'Wrong Type',
  email: 'wrong@example.com'
};

// Not even an object
const notAnObject = null;

console.log(
  `Is 'validUser' a User?`,
  isUser(validUser)
); // true

console.log(
  `Is 'validUserWithBio' a User?`,
  isUser(validUserWithBio)
); // true

console.log(
  `Is 'invalidUser_missingKey' a User?`, isUser(invalidUser_missingKey)
); // false

console.log(
  `Is 'invalidUser_wrongType' a User?`,
  isUser(invalidUser_wrongType)
); // false

console.log(
  `Is 'notAnObject' a User?`,
  isUser(notAnObject)
); // false
```

### Parameter Properties: Concise Initialization

```ts
class Product {
  constructor(
    public name: string,
    private price: number
  ) {}

  getInfo() {
    return `Product: ${this.name}, Price: $${this.price}`;
  }
}

const product = new Product('Laptop', 1200);
console.log(product.getInfo());
```

Typescript offers a shorthand for declaring and initializing class members from constructor parameters. By prefixing a constructor parameter with an access modifier (public, private, or protected), Typescript automatically creates a property with that name and assigns the parameter's value to it.

## The Future of Classes

The evolution of classes both in JavaScript and Typescript is an ongoing process.

There are several class related proposals in various stages of development, including:

| Feature | Stage | Description |
| --- | --- | --- |
| Class Static Blocks | Stage 4 | Allows execution of code blocks during class definition for static member initialization. |
| Class Fields | Stage 4 | Introduces public and private instance fields, static fields, and private methods. |
| Decorators | Stage 3 | Provides a way to modify or enhance classes, methods, or properties. |

Typescript already supports decorators but, until they proposal is finalized in the TC39 process, they require a compiler option to be used.

```bash
tsc --experimentalDecorators
```

Or in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

## Links and Resources

* [JavaScript Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) &mdash; MDN
* [Typescript Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) &mdash; Typescript Handbook
* [Typescript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-for-javascript-programmers.html) &mdash; Typescript Handbook
* [Private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_features) &mdash; MDN
* [Static keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static) &mdash; MDN
