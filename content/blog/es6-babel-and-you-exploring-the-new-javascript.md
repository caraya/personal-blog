---
title: "ES6, Babel and You: Exploring the new Javascript"
date: "2016-05-30"
categories: 
  - "technology"
---

I haven’t been this excited about Javascript in a long time.

Javascript is becoming fun again with better aync support in Promises and async/await code, better modularity and reusability with classes and modules and a consistent, concise syntax for anonymous functions with arrow syntax and, better support accross Node.js and browsers.

Until support for ES6 (also known as ES2015) is complete accross major browserss we still need to transpile the code to ES5, the version that is currently supported accross browsers.

There are two tables that list compatibility tables that guide you on native support for different features across ECMAScript implementations

[http://kangax.github.io/compat-table/es6/](http://kangax.github.io/compat-table/es6/) [http://kangax.github.io/compat-table/esnext/](http://kangax.github.io/compat-table/esnext/)

### Definitions

Before jumping into a more in depth analysys of what we can do with Babel let’s throw some terminology down to make our lives easier as we work.

- **ECMAScript**: he Javascript standard implemented by ECMA (European Computer Machinery Association.) All Javascript implementations follow the ECMAScript Standard
- **TC39**: The Technical Committee in charge of the ECMAScript specification
- **ES4**: ES4 was a failed attempt at update Javascript. There was no agreement between participants as to how much of these changes to implement so the specification died and was not implemented. Some features from ES4 have made it into ES6
- **ES5**: Released as a compromise after the ES4 debacle. It is also known as ESHarmony
- **ES6 / ES2015** The current standard version of ECMAScript released in June, 2015. Moves to incremental anual releases and staged features.
- **ES7/ES2016**: Next release of The ECMAScript standard. Includes async / await functionality
- **ESNext**: My term for features that are currently at **stage 3** on TC39’s proposal pipeline and, unless withdrawn, are likely to make it to stage 4 and release in the next major version of the specification

## Enter Babel

Babel (formerly known as 6to5) is a transpiler. It takes ES6 or ESNext code and converts it to ES5 that runs natively in modern browsers. This makes it easier for developers to work with modern code without waiting for vendors to implement the feature you’re working with.

### Installing Babel

Babel is a node application. As such, Node must be installed on your sytem. Then it’s as simple as the following command to install Babel’s CLI, ES2015 Preset and stage-3 preset.

```javascript
npm install -g babel-cli babel-preset-es2015 babel-preset-stage-3
```

To use the presets create an `.babelrc` at the root of your working director. It should look like this:

```javascript
{
   "presets": [
     "es2015",
     "stage-3"
   ],
   "plugins": []
}
```

Each of the presets allows you to load several plugins rather than leaving individually.

### Minimal Transpiler

I’ve also created a `minimal-transpiler` to automate the transpilation, linting and quality check for ES6 files.

```javascript
npm install --save-dev babel-eslint babel-preset-es2015 
babel-preset-stage-0 babel-preset-stage-3 babel-register 
eslint eslint-config-defaults gulp gulp-eslint 
gulp-jsdoc3 gulp-jshint gulp-load-plugins jshint
```

The Babel task (using ES6 syntax)

```javascript
gulp.task("babel", () => {
  return gulp.src("app/es6/**/*.js")
    .pipe($.sourcemaps.init())
    .pipe($.babel({
       presets: [
         "es2015",
         "stage-3",
       ]
    }))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest("app/js/"))
    .pipe($.size({
      pretty: true,
      title: "Babel"
     }));
});
```

## Arrow syntax for anonymous functions

(Adapted from [Exploring JS](http://exploringjs.com/es6/ch_arrow-functions.html#fnref-arrow_functions_1) from Axel Rauschmayer)

My first foray into ES6 was with arrow functions which are ES6 new way of creating anonymous functions. I’ve always struggled with fat fingers and invariably write functoin and have to go back and fix it so the less I have to write it the happier I am :)

Traditional function literals in ES5 are written like this:

```javascript
// ES5
var selected = allJobs.filter(function (job) {
  return job.isSelected();
});
```

The “fat” arrow => (as opposed to the thin arrow ->) was chosen to be compatible with CoffeeScript, whose fat arrow functions are very similar. The example function above could be rewritten as follows:

```javascript
// ES6 
var selected = allJobs.filter( (job) => {
  job.isSelected()
}
```

It could be further reduce by eliminating parens around the parameter and {} around the return statement as we’ll see below but I don’t like the shorthand syntax as it is more error prone. It may be better for people who like shortcuts but I’m not one of them.

**Specifying parameters:**

ES6 syntax for promises offers 3 ways to specify parameters:

- If we have no parameters then we use `() => {...}` with the empty parens indicating there are no parameters.
- With one parameter we can use `x => {...}` where x is the parameter specificied on its own. For the case the parameters are optional
- More than one parameter requires us to use `(x,y) => {...}` but now the parens are required

**Specifying a body:**

```javascript
x => { return x * x }  // block
x => x * x  // expression, equivalent to previous line
```

The statement block behaves like a normal function body. For example, you need return to give back a value. With an expression body, the expression is always implicitly returned.

Note how much an arrow function with an expression body can reduce verbosity. Compare:

```javascript
const squares = [1, 2, 3].map(function (x) { return x * x });
const squares = [1, 2, 3].map(x => x * x)
```

Omitting the parentheses around the parameters is only possible if they consist of a single identifier:

```javascript
> [1,2,3].map(x => 2 * x)
  [ 2, 4, 6 ]
```

As soon as there is anything else, you have to type the parentheses, even if there is only a single parameter. For example, you need parens if you destructure a single parameter:

```javascript
> [[1,2], [3,4]].map(([a,b]) => a + b)
  [ 3, 7 ]
```

And you need parens if a single parameter has a default value (undefined triggers the default value!):

```javascript
> [1, undefined, 3].map((x='yes') => x)
  [ 1, 'yes', 3 ]
```

The source of this is an important distinguishing aspect of arrow functions:

Traditional functions have a dynamic this; its value is determined by how they are called.

Arrow functions have a lexical this; **its value is determined by the surrounding scope**.

The complete list of variables whose values are determined lexically is:

- arguments
- super
- this
- new.target

There are a few syntax-related details that can sometimes trip you up.

Syntactically, arrow functions bind very loosely. The reason is that you want every expression that can appear in an expression body to “stick together”; it should bind more tightly than the arrow function:

```javascript
const f = x => (x % 2) === 0 ? x : 0;
```

As a consequence, you often have to wrap arrow functions in parentheses if they appear somewhere else. For example:

```javascript
console.log(typeof () => {}); // SyntaxError
console.log(typeof (() => {})); // OK
```

On the flip side, you can use typeof as an expression body without putting it in parens:

```javascript
const f = x => typeof x;
```

ES6 forbids a line break between the parameter definition and the arrow of an arrow function:

```javascript
const func1 = (x, y) // SyntaxError
=> {
   return x + y;
};

const func2 = (x, y) => // OK
{
  return x + y;
};

const func3 = (x, y) => { // OK
  return x + y;
};

const func4 = (x, y) // SyntaxError
  => x + y;

const func5 = (x, y) => // OK
  x + y;
```

Line breaks inside parameter definitions are OK:

```javascript
const func6 = ( // OK
  x,
  y
) => {
  return x + y;
};
```

The rationale for this restriction is that it keeps the options open regarding “headless” arrow functions in the future: if there are zero parameters, you’d be able to omit the parentheses.

## Asynchronous code with promises

Promises are one alternative to callback hell. Creation is similar to using callbacks in that we use `onload` and `onerror` but this time we wrap them in a Promise as shown in the example below.

The promise API is surprisingly simple. I will only emphasize the elements I work with the most when creating promise-based async scripts. Mozilla’s MDN has a [more in-depth article about promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) you can refer to for more information.

### Methods

#### Promise.all

Returns a promise that **resolves when all of the promises in the iterable argument have resolved** or **rejects as soon as one of the promises in the iterable argument rejects**, this is also know as ‘fall fast.’

This method is useful when we need to group promises together or when we need something to happen only if all the required actions are successful. In the example below `Promise.all` will display the result of all the successful promises.

```javascript
var p1 = Promise.resolve(42);
var p2 = 347;
var p3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, "Made it");
});

Promise.all([p1, p2, p3])
  .then(function(values) {
     console.log(values) // [42, 347, "Made it"]
  .catch(function (errror) {
     // Gets the first rejection among the promises
    console.log(error);
  });
});
```

If we change any of the values to a rejection, for example:

```javascript
var p2 = Promise.reject('Sorry, can't do that');
```

The promise will reject with the message on p2 and will not test p3, the promise has already failed.

This is a similar technique to the ones used in Font Face Observer to handle multiple fonts:

```javascript
var fontA = new FontFaceObserver('Family A');
var fontB = new FontFaceObserver('Family B');

Promise.all([fontA.load(), fontB.load()]).then(function () {
  console.log('Family A & B have loaded');
});
```

#### Promise.race

Promise.race() takes an array of promises (thenables and other values are converted to promises via Promise.resolve()) and returns a promise with the same value (resolve or reject) as the first settled promise.

We can use a promise race to create a timer. We first create a delay function to set up the time we will race against.

```javascript
function delay(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms); 
  });
}
```

We can then set up a race between a function we want to run and a delay. Say, for example that we want to load a resource and make sure that it will load in less than the time we set in the delay function (2000 miliseconds in the example below.)

If the httpGet promises resolves first then the race resolves and the `then` portion of the promise is executed.

If the delay promise resolves first then we throw an error; this will automatically reject the project and the `catch` portion of the promise is executed.

```javascript
Promise.race([
  httpGet('http://example.com/file.txt'),
  delay(2000).then(function () {
    throw new Error('Timed out')
  });
])
  .then(function (text) { ... })
  .catch(function (reason) { ... });
```

#### Promise.reject

Returns a Promise object that is rejected with the given reason.

```javascript
Promise.reject("Testing static reject").then(function(reason) {
  // not called
}, function(reason) {
  console.log(reason);
});
```

This is the static equivalent to the catch statement.

#### Promise.resolve

Returns a Promise object that is resolved with the given value. This is the opposite of Promise.reject.

If the returned value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable, adopting its eventual state; otherwise the returned promise will be fulfilled with the value.

**_Generally, if you want to know if a value is a promise or not - Promise.resolve(value) it instead and work with the return value as a promise._**

```javascript
Promise.resolve("Success")
  .then(function(value) {
     console.log(value); // "Success"
  }, function(value) {
     // not called
} );
```

### Methods

These are the two methods that you will see the most often when working with promises.

#### Promise.then

Adds fulfillment and rejection handlers to the promise, and returns a new promise resolving to the return value of the called handler, or to its original settled value if the promise was not handled (i.e. if the relevant handler onFulfilled or onRejected is undefined).

```javascript
function loadImage(url) {
  return new Promise( (resolve, reject) => {
    var image = new Image();
    image.src = url;

    image.onload = function() {
      resolve(image);
    };

    image.onerror = function() {
      reject(new Error('Could not load image at ' + url));
    };

  });
}
```

We then define the functions that we’ll use in our code. Note that all the functions have an `image` parameter and that we return it at the end of every function. This will become important when we start working with the promise code later in the section.

For this example the functions just log to console. In a real application we would import a module like [Imagemagic](http://www.imagemagick.org/) or [GraphicMagick](http://www.graphicsmagick.org/) to actually handle the image manipulation.

```javascript
function scaleToFit(width, height, image) {
  console.log('Scaling image to ' + width + ' x ' + height);
  return image;
}

function watermark(text, image) {
  console.log('Watermarking image with ' + text);
  return image;
}

function grayscale(image) {
  console.log('Converting image to grayscale');
  return image;
}
```

When we create the pipeline we use the functions. There is a single catch statement at the end of the chain. This will catch any errors bubbling from the other functions in the chain.

```javascript
// Image processing pipeline
function processImage(image) {
  loadImage(image)
    .then((image)  => {
       document.body.appendChild(image);
       return scaleToFit(300, 450, image);
    })
    .then((image)  => {
       return watermark('The Real Estate Company', image);
    })
    .then((image)  => {
       return grayscale(image);
    })
    .catch((error) => {
       console.log('we had a problem in running processImage ' + error)
    });
}
```

The above can also be represented in a more concise manner with the following code:

```javascript
function processImage(image) {
  // Image is always last parameter preceded by any configuration parameters
  var customScaleToFit = scaleToFit.bind(null, 300, 450);
  var customWatermark = watermark.bind(null, 'The Real Estate Company');

  return Promise.resolve(image)
    .then(customScaleToFit)
    .then(customWatermark)
    .then(grayscale);
}
```

Unless I have a very compelling reason (and I have yet to find one) I prefer the first syntax as it keeps me from jumping between functions to troubleshoot… Yes, it sacrifices the compactness of the second version but it saves me from binding the functions and makes my life easier in the long run.

Another API that uses promises extensively is the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), the replacement for XHR. The example below uses fetch to get an image from the network and insert it in an image tag.

```javascript
var myImage = document.querySelector('img');

fetch('flowers.jpg')
  .then(function(response) {
    return response.blob();
  })
  .then(function(myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
  });
```

#### Promise.catch

Appends a rejection handler callback to the promise, and returns a new promise resolving to the return value of the callback, or to its original fulfillment value if the promise is instead fulfilled.

Whatever you return in an error handler becomes a fulfillment value (not rejection value!). That allows you to specify default values that are used in case of failure:

```javascript
retrieveFileName()
  .catch(function () {
    // Something went wrong
    // Use this value instead
    return 'Untitled.txt';
  })
  .then(function (fileName) {
    // Nothing here
  });
```

## Modularity / Reusability with Classes

I was surprised to find classes as part of ES6… Ever since the language was created developers have had to learn to work with prototypal inheritance, how to make that chain work for us and what are the pitfalls to avoid when doing so. The first question I asked when I started looking at ES6 was what are classes in ES6?

They’re syntactic sugar on top of prototypical inheritance. Everything we’ll discuss in this section is built on top of the traditional prototypal inheritance framework and the parser will use that under the hood while we do all out shiny work with classes.

This will be our example to look at how classes work. It defines a class `Person` with three default elements: \* `first` name \* `last`name \* `age`.

It also defines 2 methods:

- `fullName` returning the first and last name
- `howOld` returing the string {name} is {age} years old

Note that the methods use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) with string interpolations.

```javascript
class Person {
  constructor(first, last, age) {
    this.first = first;
    this.last = last;
    this.age = age;
  }

  fullName() {
    return `${this.first} ${this.last}`;
  }

  howOld() {
    return `${this.first} is ${this.age} years old`
  }
}
```

To instantiate a new object of class Person we must use the new keyword like so:

```javascript
let  carlos =  new Person('carlos', 'araya', 49);
```

Now we can use the class methods like this:

```javascript
carlos.fullName();
// returns "carlos araya"
carlos.howOld();
// returns "carlos is 49 years old"
```

### Subclasses, extends and super

Now let’s say that we want to expand on the Person class by assigning additional attributes to the constructor and add additional methods. We could copy all the material from the Person class into our new class, call it Engineer, but Javascript saves us from having to do so. The `extends` keyword allows us to use a class as the basis for another one.

To continue the example, we’ll extend `Person&nbsp;` to become and `Engineer&nbsp;`. We’ll say that the Engineer is a person with all the attributes and methods of the Person class with 2 additions:

- They belong to a `department`
- They have a favorite language represented by the `lang` parameter

The Engineer class is presented below:

```javascript
class Engineer extends Person {
  constructor(first, last, age, department, lang) {
    // super calls the parent class for the indicated attributes
    super(first, last, age);
    this.department = department;
    this.language = lang;
  }

  departmentBelonging() {
    return `${this.first} is in the ${this.department} department`;
  }

  favoriteLanguage() {
    return `${this.first} favorite language is ${this.language}`;
  }
}
```

In the constructor we pass the same three values as for the Person Class but, rather than associate them with their values like we did in the Person class, we simply call the constructor of the parent class using the `super` keyword.

We then add the methods specific to the Engineer class: What department they belong to and what’s their favorite programming language.

The instantiation is the same as before

```javascript
const william = new Engineer('William', 'Cameron', 49, 'engineering', 'C++');
```

Now the cool part. Even though we didn’t add the methods `fullName` and `howOld` we get them for free becaure they are defined in the parent class. WIth william (defined above) we can do:

```javascript
william.fullName() 
// returns "William Cameron"

william.howOld() 
// returns "William is 49 years old"
```

and we get the methods that are exclusive to our Engineer class that are not part of Person:

```javascript
william.departmentBelonging() 
// returns "William is in the engineering department"

william.favoriteLanguage() 
// returns "William favorite language is C++"
```

## To come

Modules are a static alternative to classes. Where you can instantiate a class directly you have to import modules. Think of modules as the ES6 native version of CommonJS and AMD modules.

I’m having a hard time getting the transpiled modules work in a browser so, until I do I will hold off on writing up about them. I want them to be useful now rather than a theoretical example.
