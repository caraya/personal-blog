---
title: "Testing javascript with Node and Chai"
date: "2023-05-24"
---

When the Node team marked their [test runner](https://nodejs.org/api/test.html) stable in Node 20.0, it reignited my interest in testing code in general and, potentially, in [test-driven development](https://en.wikipedia.org/wiki/Test-driven_development)

This post will cover my experiments with testing using Node's built-in test runner and the [Chai](https://www.chaijs.com/) assertion library with the [Chai as promised](https://www.chaijs.com/plugins/chai-as-promised/) plugin to better handle promises.

## Running tests

I'm still learning the Chai API and the different ways to run tests. Some of these exercises are trivial, meant to get comfortable with the technology. Others are examples of how to test against external APIs... while WordPress may be overkill, it shows how you can connect to your own APIs during development to test them.

### Getting everything ready

The first block of code will import packages that we need for the other parts of the code.

We import Chai and Chai As Promised and then configure Chai to use the Chai As Promised plugin and the `should` assertion library.

We then import the necessary methods from the Node test package.

```js
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import {
  describe, 
  it,
} from 'node:test';
```

### Running the code in the test file

The first set of examples defines the object we want to test inside the `it` portion of the test along with the test.

We can have more than one test per collection. The `Basic Matches` collection has two tests. You can have as many as you need or want to make sure that your code works as intended.

```js
describe('Assertions', () => {
  describe('Basic matches', () => {
    it('String matches string', () => {
      let message = 'Hello'
      message.should.equal('Hello', 'greeting check')
    })
    it('Number Should match itself', () => {
      let numberOne = 1;
      numberOne.should.equal(1);
    })
  })
```

When testing arrays, I was surprised by what you can do.

Because we define the array locally, we know what we're working on but with external code, we can't be guaranteed the shape of the object we'll get so checking that we're getting an array and the length of the object we get is useful and it helps keeps you honest.

```js
  describe('Testing Arrays', () => {
    const tngCrew = [
      'picard',
      'riker',
      'data',
      'laforge',
      'beverly',
      'worf',
      'wesley'
    ];

    it('Should be an array', () => {
      tngCrew.should.be.an('array')
    })

    it('Crew should have 7 members', () => {
      tngCrew.length.should.equal(7)
    })

    it('Picard should always be present', () => {
      tngCrew.should.contain('picard')
    })
  })
```

### Importing your code

We can also import code from our working tree to test against.

This is the code of the `workingCode.mjs` file.

```js
export function meaningOfLife() {
  return 42;
};

export function doubleNumber(a) {
  return a * 2;
}
```

We then import the functions at the top of the testing script. These are static imports so they will only work at the top of the script.

```js
import {
  meaningOfLife,
  doubleNumber,
} from '../js/workingCode.mjs';
```

In each test we then run the code and test the result from running the function against what we expect the results to be.

```js
  describe('Testing External', () => {
    const result = meaningOfLife();
    describe('Meaning of life', () => {
      it('should be 42', () => {
        result.should.equal(42)
      })
    })
  })
  describe('Testing numbers', () => {
    const numberDoubled = doubleNumber(3);
    it('doubleNumber(3) should be 6', () => {
      numberDoubled.should.equal(6)
    })

    it('should be a number', () => {
      numberDoubled.should.be.a('number')
    })
  })
```

### Working with APIs

Even though Node now supports Fetch natively, I still prefer to use Axios instead. The first step is to import Axios at the top of the script.

```js
import axios from 'axios';
```

We then create a variable to hold the address of the server running the API so we can reduce typing and make it easier if we want to make changes.

```js
const baseWpURL = 'https://path-to-wp-site.net/wp-json/wp/v2/posts';
```

Each test queries the API and uses the results of the query on an individual test.

Yes, WordPress may not be the best example, but I think it works well enough to illustrate the basics. We could also leverage similar tests when working with custom endpoints for the WordPress API.

```js
  describe('WordPress API tests', () => {

    it('should GET data', async () => {
      const response = await axios.get(`${baseWpURL}`)
      response.status.should.equal(200);
    })

    it('should GET a JSON payload', async () => {
      const response = await axios.get(`${baseWpURL}`)
      response.headers.should.contain({'content-type': 'application/json; charset=UTF-8'});
    })

    it('should GET 10 items', async () => {
      const response = await axios.get(`${baseWpURL}`)
      response.data.length.should.equal(10)
    })

    it('should GET an array of data', async () => {
      const response = await axios.get(`${baseWpURL}`)
      response.data.should.be.an('array')
    })
  })

})
```

## Housekeeping

there are a couple of things that are not strictly test related but are good to keep in mind.

### Running only some tests

You can choose to run only some tests, in this case only tests that match a given string

run tests with "GET" in the title

```bash
node --test \
--test-name-pattern GET
```

With this command, Node will only run the tests that have GET in the title which are the tests that run against the WordPress API.

## Writing tests in Typescript

So far we've written all our code, both production code and test, in vanilla Javascript.

If you want to work with Typescript, then you need to complete a few additional steps:

Install Typescript and TS-Node into your project.

```js
npm install -D typescript \
ts-node
```

Use [ts-node](https://github.com/TypeStrong/ts-node) as the loader with a command like this:

```bash
node --loader ts-node/esm \
--test tests/tests.ts
```
