---
title: "Why I love @property in CSS"
date: "2023-04-12"
---

CSS Custom Properties (also known as CSS Variables) rock but they are not without drawbacks.

Since you can put any value and change the values, the browser will treat the value as a string and force you to work around converting it to specific units.

The following example, takes a variable defined in the `:root` element and then converts it to a `length` unit by multiplying it by `1rem`. In `example2` we take the same variable and multiply it by `1vw` to get a completely different value... which one is the correct one?

```css
:root {
  --default-width: 30;
}

.example {
  width: calc(
    var(--default-width) * 1rem)
}

.example2 {
    width: calc(
    var(--default-width) * 1vw)}
```

When we define the same property with the `@property` at-rule, we get a few things for free:

1. We know what values are allowed (in this case it's either a length value like 20px or 10em or a percentage)
2. We can control if the property can be inherited or not
3. We can provide an initial value so using `--default-width` without parameters will return a `30rem`

```css
@property --default-width {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 30rem;
}
```

Properties defined with the at-rule take more work upfront but they offer a lot more flexibility.

They force you to be specific about the type of values the property will take. The syntax attribute is required so you must include it.

Because we've told the browser the type of values that the property take means that we can animate it.

Controlling whether a property inherits or not gives us more flexibility in how we use it

A default value saves us from possible errors if the property is not defined and it helps us tell what we wanted to do when we created it. There may be times when we want to fail if there is no value but most of the time I think **_be kind to your future self_**.
