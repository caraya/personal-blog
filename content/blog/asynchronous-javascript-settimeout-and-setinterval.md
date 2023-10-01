---
title: "Asynchronous Javascript: SetTimeout and SetInterval"
date: "2018-08-13"
categories: 
  - "mdn"
---

SetTimeout and SetInterval provide ways to schedule tasks to run at a future point in time.

`setTimeout` allows you to schedule a task after a given interval.

`setInterval` lets you run a task periodically with a given interval between runs.

## SetTimeout

setTimeout takes two parameters:

A string representing code to run and a number representing the time interval in milliseconds to wait before executing the code.

In the following example, the browser will wait two seconds before executing the anonymous function and presenting the alert message.

```javascript
let myGreeting = setTimeout(function() {
  alert('Hello, Mr. Universe!');
}, 2000)
```

We're not required to write anonymous functions. The second version of the example uses `sayHi` as the name of the function. The rest of the code remains unchanged.

```javascript
let myGreeting = setTimeout(function sayHi() {
  alert('Hello, Mr. Universe!');
}, 2000)
```

The code is rather messy. We can clean up the `setTimeout` call by taking the function outside the `setTimeout` call. The next iteration of our code defines `sayHi` first and then references the function by calling `sayHi` without parenthesis as the first parameter of `setTimeout`.

```javascript
function sayHi() {
  alert('Hello Mr. Universe!');
}

let myGreeting = setTimeout(sayHi, 2000);
```

The last step in the demo is to pass parameters to the function we want to use in setTimeout.

This gets a little tricky.

First, we configure the function to add the parameter and use it in the body of the function.

When we call `setTimeout` we pass the values for the function parameters as the third (and subsequent if there is more than one) parameters.

```javascript
function sayHi(who) {
  alert('Hello ' + who + '!');
}

let myGreeting = setTimeout(sayHi, 2000, 'Mr. Universe');
```

All versions of the function will produce the same result... but they show different ways we can use setTimeout and the flexibility we have in writing the code.

## ClearTimeout

This is less of an issue with `setTimeout` as it is with `setInterval` (discussed in later sections) but there may still be situations where you want to abort the execution of code inside a `setTimeout` call. For example, let's say that we set the timeout for a very expensive task.

```javascript
function runExpensiveTask() {
  alert('Expensive Task has been completed!');
}

let myTaskRunner = setTimeout(runExpensiveTask, 30000);
```

And we want to stop it because we want to do something else on the page. To do it we call `clearTimeout` with the id of we assigned to `setTimeout` when we created it.

```javascript
let forgetIt = clearTimeout(myTaskRunner);
```

clearTimeout() and its cousin clearInterval() use the same list of entries to clear from. This means that you can use either method to remove a setTimeout or setInterval. For consistency, I use clearTimeout to clear setTimeout() entries and clearInterval to clear setInterval() entries.

## setInterval

setTimeout works perfectly when we need to run the code once after a set period of time. But what happens when we need to run the code every x milliseconds?

That's where setInterval comes in. When we use this command, the code we attach to it will run every time the interval completes.

The example below creates a new date object and logs it to console. We then attach it to setInterval and execute it once every second. This will create the effect of a running clock that updates once per second.

```javascript
function countTime() {
    let date = new Date();
    let time = date.toLocaleTimeString();
    document.getElementById('demo').innerHTML = time;
}

const createClock = setInterval(countTime, 1000);
```

## clearInterval

With repetitive tasks like our clock example, we definitely want a way to stop the activity... otherwise, we may end up getting errors when the browser can't complete any further versions of the task.

`stopTime()` clears the interval with the ID we created.

The example goes further and creates a button and attaches the stopTime function to the button's click event so when we click the button the interval will stop.

```javascript
function stopTime() {
    clearInterval(createClock);
}

let myButton = document.getElementById('stopButton');
myButton.addEventListener('click', stopTime);
```

Because clearTimeout() and clearInterval() clear entries from the same list, either method can be used to clear timers created by setTimeout() or setInterval().

## Things to keep in mind

There are a few things to keep in mind when working with setTimeout and setInterval.

### Recursive Timeout

There is another way we can use setTimeout: Use it recursively to call the same code repeatedly instead of using setInterval.

Compare the first example using a recursive setTimeout to run the code ever 1000 milliseconds.

```javascript
let i = 1;

setTimeout(function run() {
  console.log(i);
  setTimeout(run, 100);
}, 100);
```

The second example uses setInterval to accomplish the same effect of running the code every 100 milliseconds.

```javascript
let i = 1;

setInterval(function run() {
  console.log(i);
}, 100);
```

The difference between the two versions of the code is a subtle one.

Recursive setTimeout guarantees a delay between the executions; the code will run and then wait 100 milliseconds before it runs again. The 100 milliseconds will happen regardless of how long the code takes to run.

![](https://javascript.info/article/settimeout-setinterval/settimeout-interval@2x.png)

Using recursive setTimeout guarantees the interval will be the same between executions. Image taken from [https://javascript.info/settimeout-setinterval](https://javascript.info/settimeout-setinterval).

The example using setInterval does things differently. The interval we choose for setInterval includes the code we want to run in its execution. Let's say that the code takes 40 milliseconds to run, then the interval ends up being only 60 milliseconds.

![](https://javascript.info/article/settimeout-setinterval/setinterval-interval@2x.png)

The interval we set for setInterval includes our own code execution. Image taken from [https://javascript.info/settimeout-setinterval](https://javascript.info/settimeout-setinterval).

### Immediate Timeout

Using 0 as the value for setTimeout schedules the execution of func as soon as possible but only after the current code is complete.

For instance, the code below outputs “Hello”, then immediately “World”:

```javascript
setTimeout(function() {
  alert('Mr. Universe')
}, 0);

alert('hello');
```

## When would you use them?

setTimeout and setInterval are useful when you need to schedule code execution.

Use setTimeout if you want to execute the code once after a given time elapses. Pay attention to the gotchas for using setTimeout and consider them additional alternatives

Use setInterval if you need the code to execute repeatedly at given intervals.
