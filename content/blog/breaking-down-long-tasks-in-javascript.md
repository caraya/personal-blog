---
title: Breaking Down Long Tasks In Javascript
date: 2025-02-10
tags:
  - Javascript
  - Performance
---

Over time I've read over and over that we should break down tasks in Javascript to avoid blocking the main thread but I never really understood how to do it.

This post will explore one way to break down tasks in Javascript when working with arrays.

## The problem

When we have a long-running task in Javascript, it blocks the main thread and makes the page unresponsive. This is a problem because the main thread is responsible for handling user interactions and rendering the page.

Rick Viscomi explains this problem in his article [Breaking down tasks in Javascript](https://calendar.perfplanet.com/2024/breaking-up-with-long-tasks-or-how-i-learned-to-group-loops-and-wield-the-yield/). I've used the article as a reference for this post.

## Solution 1

When working with arrays in Javascript, we can use the [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) method to iterate over each item in the array.

The [yield()](https://developer.mozilla.org/en-US/docs/Web/API/Scheduler/yield) method of the Scheduler interface is used for yielding to the main thread during a task and continuing execution later, with the continuation scheduled as a [prioritized task](https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API). This allows long-running work to be broken up so the browser stays responsive.

The first naive example uses `yield` inside the `forEach` loop.

```js
function handleClick() {
  items.forEach(async (item) => {
    await scheduler.yield();
    process(item);
  });
}
```

The `forEach` method doesn’t care if your callback function is asynchronous, it will run through every item in the array without awaiting the yield. And it doesn’t matter which approach you use: `scheduler.yield` or `setTimeout`.

The solution is to use a `for..of` loop instead.

```js
async function handleClick() {
  for (const item of items) {
    await scheduler.yield();
    process(item);
  }
}
```

Yielding within a `for..of` loop seems like the best way to achieve responsive interactions, but there may be problems problem because it yields on every iteration of the loop. It may also cause issues in browsers that don't support the `yield` method.

## Solution 2

Rather than taking the overhead of yielding on every iteration, we can batch the items and yielding after processing each batch.

Rather than batching by number of items, a better approach would be to batch items by the time it takes to process them. This way you can set a reasonable batch duration and yield only when it’s been at least that long since the last yield.

The batch duration is a tradeof between the amount of time a user would spend waiting if they interacted with the page during the batch processing and the total time to process everything in the array.

We set up two variables, `BATCH_DURATION` and `timeOfLastYield`. `BATCH_DURATION` is the time in milliseconds that we want to wait before yielding. `timeOfLastYield` is the time in milliseconds when the last yield occurred.

We then create a function `shouldYield` that returns `true` if the time since the last yield is greater than the batch duration.

We use `shouldYield` to determine if we should yield the main thread before processing each item in the array.

```js
const duration = 50;
let timeOfLastYield = performance.now();

function shouldYield() {
  const now = performance.now();
  if (now - timeOfLastYield > duration) {
    timeOfLastYield = now;
    return true;
  }
  return false;
}

async function handleClick() {
  for (const item of items) {
    if (shouldYield()) {
      await scheduler.yield();
    }
    process(item);
  }
}
```

If the task is long then it'll break it down to smaller, more manageable tasks. It's not perfect... if the task takes too long then the yielded task will still block the main thread but it's a start
