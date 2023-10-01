---
title: "Asynchronous Javascript: Introduction and Synchronous Code"
date: "2018-08-08"
categories: 
  - "mdn"
---

When we write Javascript we normally do it synchronously, every instruction is executed one at a time in the order they appear in the script. The script will finish once the last instruction is executed.

In the example below, we log three items to the console.

```javascript
console.log('1');
console.log('2');
console.log('3');
```

We will always get the same result: 1 2 3.

This works great for small pieces of code or scripts that don't produce output on the browser. But sooner rather than later you will want to work on larger scripts and you will find one of the first issues with Javascript: **It blocks rendering**.

Let's take the following HTML document.

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Document</title>
    <script src='myscript.js'></script>
  </head>
  <body>

  </body>
</html>
```

And the following content in `myscript.js`:

```javascript
// Capture the body tag as the third child of the document (zero based)
const content = document.documentElement.childNodes[2];
// Create an h2 element and assign it to the header constiable
const header = document.createElement('h2');
// Add content to the header
header.innerHTML = 'This was inserted';
// Assign it as the first child of the body element
content.insertAdjacentElement('afterbegin', header);
```

The browser will load the page and when it finds the script it will load it and process it. Because the browser can not know ahead of time if the script will insert, remove or change content on the page it will pause rendering until the script is fully parsed and any changes to the page like inserting or removing nodes are done. The script can have any number of functions and interact with databases and other resources on your page and application.

This will happen for every script that you add to the page; they will each load completely before moving onto the next. Working with smaller scripts may be fine but imagine if you're loading jQuery from a Content Delivery Network and then loading our script. Our HTML will look like this:

```html
<!DOCTYPE html>
<html lang='en'>
  <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Document</title>
    <script
      src='https://code.jquery.com/jquery-3.3.1.min.js'></script>
    <script src='myscript.js'></script>
  </head>
  <body>
    <!-- content goes here -->
  </body>
</html>
```

Even with no content, this page will take longer to load as it now has to download jQuery before it can continue processing the page and its content, which may include other scripts.

Things will get slower when the code we write does heavy processing like database access or image manipulation.

The figure below gives you an example of what the execution order or stack looks like for a synchronous blocking language like Javascript.

Before we jump into asynchronous (async) code we'll look at two ways of writing synchronous code: Callbacks and try/catch blocks.

### Callbacks

Callbacks are functions that are passed as parameters to other functions.

An example of a callback is the second parameter of an event listener. In the example below, clicking the button with id of `myButton` will trigger the function and produce the alert for the user.

```javascript
myButton.addEventListener('click', function() {
  alert('You Clicked THE Button');
})
```

Another example is when we use `forEach` to loop through the items in an Array. In this case `forEach` will loop through the array

```javascript
const gods = ['Apollo', 'Artemis', 'Ares', 'Zeus'];

gods.forEach(function (eachName, index){
  console.log(index + 1 + '. ' + eachName);
});
```

The two examples work because Javascript allows functions as parameters in other functions.

When we pass a callback function as an argument to another function, we are only passing the function definition. We are not executing the function in the parameter. The containing function can execute the callback anytime.

Note that the callback function is not executed immediately. It is “called back” (hence the name) somewhere inside the containing function’s body synchronously.

#### Working with 'this'

When the callback function uses the `this` object, we have to modify how we execute the callback function to preserve the this object context. Or else the this object will either point to the global window object (in the browser) if callback was passed to a global function. Or it will point to the object of the containing method.

```javascript
const agentData = {
  id: 007,
  fullName: 'Not Set',
  // setUserName is a method on the agentData object
  setUserName: function (firstName, lastName)  {
    this.fullName = firstName + ' ' + lastName;
  }
}

function getUserInput(firstName, lastName, callback)  {
  if ((firstName.length > 3) && (lastName.length > 3)) {
    callback (firstName, lastName);
  } else {
    console.log('data could not be saved.');
  }
}
```

When we create a new agent something unexpected happens. `agentData.fullName` returns the default value of Not Set but when we check for fullName in the window object (`window.fullName`) we get the name we expected.

```javascript
getUserInput ('James', 'Bond', agentData.setUserName);
console.log (agentData.fullName);
console.log (window.fullName);
```

The problem has to do with `this`.

In most cases, the value of this is determined by how a function is called. It can't be set by assignment during execution, and it may be different each time the function is called.

When we call a function directly, like we call getUserInput, the context is the root object (window in the case of the browser)

When a function is called as a method of an object, its this is set to the object the method is called on.

So how do we solve this problem?

#### Call and Apply

We can fix the problem with this using `call` or `apply`. These methods (available to all functions) are used to set the `this` object inside the function and to pass arguments to the functions.

Call takes the value to be used as the `this` object inside the function as the first parameter, and the remaining arguments to be passed to the function are passed as a comma-separated list.

For `call` and `apply` to work we add an extra parameter that designates what object we want to use to represent `this`, in this case, we call it `callbackObj`.

The biggest difference is that our new version of `getUserInput` uses the `call` method of the `callback` function with four parameters, including the new `callbackObj`.

```javascript
const agentData = {
  id: 007,
  fullName: 'Not Set',
  // setUserName is a method on the agentData object
  setUserName: function (firstName, lastName)  {
    this.fullName = firstName + ' ' + lastName;
  }
}

function getUserInput(firstName, lastName, callback, callbackObj)  {
   if ((firstName.length > 3) && (lastName.length > 3)) {
    callback.call (callbackObj, firstName, lastName);
  } else {
    console.log('data could not be saved.');
  }
}
```

To verify that it works we add a new agent with our `getUserInput` function and, here is the key, we tell it that we want to use `agentData` as the object to represent this.

When we log the value of `agentData.fullName` we get the expected value. When we try to log the value of `window.fullName` we get undefined because `this` means `agentData` not the global window object.

```javascript
getUserInput ('James', 'Bond', agentData.setUserName, agentData);

console.log (agentData.fullName); // James Bond
console.log (window.fullName); // undefined
```

The Apply function’s first parameter is also the value to be used as the `this` object inside the function, while the last parameter is an array of values to pass to the function.

The difference between `apply` and `call` is the signature of the method.

```javascript
const agentData = {
  id: 007,
  fullName: 'Not Set',
  // setUserName is a method on the agentData object
  setUserName: function (firstName, lastName)  {
    this.fullName = firstName + ' ' + lastName;
  }
}

function getUserInput(firstName, lastName, callback, callbackObj)  {
   if ((firstName.length > 3) && (lastName.length > 3)) {
    callback.apply (callbackObj, [firstName, lastName]);
  } else {
    console.log('data could not be saved.');
  }
}
```

The signature for `getUserInput` doesn't change when we use `apply` instead of `call`. The results are identical.

```javascript
getUserInput ('James', 'Bond', agentData.setUserName, agentData);

console.log (agentData.fullName); // James Bond
console.log (window.fullName); // Undefined
```

### Try/Catch blocks

The second way to write synchronous code is to create `try/catch` blocks.

The idea behind `try/catch` blocks is that we need to run instructions in sequence but we must also do something if any of the commands fail.

We will use the following JSON for the example.

```javascript
// data from the server
let json = '{"id":"007", "firstName":"James", "lastName": "Bond"}';
```

In the try/catch block below, we want to make sure that the data parse succeeds and do something if there is an error.

In this example, we just log a message and the error to console. In more complex examples the catch error may attempt connecting to the database again or ask the user to enter the data again if it wasn't complete or well formed.

```javascript
try {
  // convert the text representation to JS object
  let user = JSON.parse(json);
  // Log the results to console
  console.log (user.id); // 007
  console.log (user.firstName);  // James
  console.log (user.lastName); // Bond
} catch(err) {
  console.log ('I\'m sorry Dave, I can\'t do that ');
  console.log (err.name);
  console.log (err.message);
}
```

There is a third optional parameter, `finally`. It will happen regardless of whether the `try` block succeeds or the `catch` block is called. This gives the option of doing cleanup, closing database connections and doing other cleanup tasks your code needs to complete.

In the example below, the script will always log `All Done`, regardless if the JSON parsing was successful or not.

```javascript
try {
  // convert the text representation to JS object
  let user = JSON.parse(json);
  // Log the results to console
  console.log (user.id); // 007
  console.log (user.firstName);  // James
  console.log (user.lastName); // Bond
} catch(err) {
  console.log ('I\'m sorry Dave, I can\'t do that ');
  console.log (err.name);
  console.log (err.message);
} finally {
  //This will always execute regardless
  console.log ('All Done');
}
```

## Brief Introduction to Async Code

Async (short for asynchronous) code will execute without blocking rendering and return a value when the code in the async block finishes.

Contrast the definition of async with the synchronous code we've been working so far where all statements are executed in the order they appear.

The example below uses both sync (synchronous) and async (asynchronous) code to illustrate the difference. The console log statements outside of fetch will execute in the order they appear in the document.

```javascript
console.log ('Starting');
fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/32795/coffee2.png') // 1
  .then((response) => {
    if (response.ok) {
      console.log('It worked :)')
      return response.blob(); // 2
    } else {
      throw new Error('Network response was not ok.' );
    }
  })
  .then((myBlob) => {
    let objectURL = URL.createObjectURL(myBlob); // 3
    let myImage = document.createElement('img'); // 4
    myImage.src = objectURL; // 5
    document.body.appendChild(myImage); // 6
  })
  .catch((error) => {
    console.log(
      'There has been a problem with your fetch operation: ',
      error.message
    );
  });
console.log ('All done!');
```

The fetch function and it's associated chain uses the Promise API (discussed in more detail in a later document) to get a resource from the network and perform one or more tasks. It won't make the script wait until it's done but will continue working in the background until it completes.

The async nature of the Fetch API produces unexpected results. The sequence of messages logged to console:

1. Starting
2. All done!
3. It worked :)

The messages from both console.log calls outside fetch appear in their document order but the message signaling success doesn't appear until the chain started with fetch completes.

Javascript is at its most basic a synchronous, blocking, single-threaded language; Only one operation can be in progress at a time.

Whether we want to run code synchronously or asynchronously will depend on what we're trying to do.

There are times when we want things to load and happen right away. The callback for a click event handler is a good example.

If we're running an expensive operation like querying a database and using the results to populate templates then we want to push this off the main thread and complete the task asynchronously.
