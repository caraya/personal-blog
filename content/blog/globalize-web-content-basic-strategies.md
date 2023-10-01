---
title: "Globalize Web Content: Basic Strategies"
date: "2017-12-06"
---

## Quick and Dirty: JS Template String Literals

This is a quick recap of an [earlier post](https://publishing-project.rivendellweb.net/js-template-literals/) that described Javascript Template String Literals and one way to use them to provide content translation.

Andrea Giamarchi wrote an article: "[Easy i18n in 10 lines of JavaScript (PoC)](https://codeburst.io/easy-i18n-in-10-lines-of-javascript-poc-eb9e5444d71e)" that provides an idea of how to do translation using template literals. This code has been further developed in a [Github Repo](https://github.com/WebReflection/i18n-utils).

See the article in [my blog](https://publishing-project.rivendellweb.net/js-template-literals/) and Andrea's post for more information.

## Messages: Gender- and plural-capable messages

The next step is to use [Messages](https://messageformat.github.io/). We use the library to separate your code from your text formatting while enabling much more humane expressions. This library will eliminate the following from your UI:

- There are 1 results.
- There are 1 result(s).
- Number of results: 5.

The installation process is just like any other application:

```bash
npm --save install messageformat
```

Once it's installed we require it like any other in a Node application.

```javascript
const MessageFormat = require('messageformat');
```

We then build the message we want to display to our users. In this case, we build a message with three rules:

- A gender (GENDER) rule with values for male, female and other
- A Resource (RES) rule with values for no results, (exactly) 1 result and more than one result
- A Category (rule) with ordinal values for one, two, third and other categories

```javascript
{% raw %}
const msg =
  '{GENDER, select, male{He} female{She} other{They} }' +
  ' found ' +
  '{RES, plural, =0{no results} one{1 result} other{# results} }' +
  ' in the ' +
  '{CAT, selectordinal, one{#st} two{#nd} few{#rd} other{#th} }' +
  ' category.';
{% endraw %}
```

The last step is to compile the rules and use it as needed. The compilation makes it possible to use the different combinations of the values defined in our message variables.

Using the compiled message we build using `mfunc` and the values for the categories that we created when we defined the message. The examples below show how the different combinations of messages.

```javascript
{% raw %}
// Compiles the messages and formats.
const mfunc = new MessageFormat('en').compile(msg);

mfunc({ GENDER: 'male', RES: 1, CAT: 2 })
// 'He found 1 result in the 2nd category.'

mfunc({ GENDER: 'female', RES: 1, CAT: 2 })
// 'She found 1 result in the 2nd category.'

mfunc({ GENDER: 'male', RES: 2, CAT: 1 })
// 'He found 2 results in the 1st category.'

mfunc({ RES: 2, CAT: 2 })
// 'They found 2 results in the 2nd category.'
{% endraw %}
```

For more information on how to use the formatting capabilities of Messageformat, check the [Format Guide](https://messageformat.github.io/guide/) particularly the sections where it gives instructions for what values to use in what situation.
