---
title: Web Components, Frameworks or Both?
date: 2024-12-11
tags:
  - Design
  - Javascript
  - Web Components
  - Opinion
---

I came across [Web Components Are Not the Future](https://dev.to/ryansolid/web-components-are-not-the-future-48bh) by Ryan Carniato, the creator of [Solid.js](https://www.solidjs.com/).

I think that the article is biased and it makes assumptions based on his experience as the creator of a framework, Solid.js so, out of the gate, I would expect biases even though he has done work with web components before.

I think the biggest issue I have with the article is that Ryan presents web components and frameworks as an either/or dychothomy where I see it as a cooperative `and` type of scenario.

For example, he addresses the advantages and disadvantages of web components:

> The introduction of higher-level primitives can have a positive effect. Suddenly something harder to do becomes easier. Which initially leads to more exploration. Web Components caused an increase in the number of JavaScript frameworks in the mid 2010s. It was an important inspiration for why I created SolidJS. A similar example would be the increase in Metaframeworks being built thanks to Vite.
>
> But it also can have a negative effect. If too many assumptions are made it becomes harder to explore alternative space because everything gravitates around the establishment. What is more established than a web standard that can never change?

Each framework, like each build tool presented a divergent version of how to accomplish the same task and some times the migration between major versions is nothing if not painful, so we as developers have to choose between standards that only change after careful debate and consideration or having to go through potentially backward incompatible changes on an anual basis (since breaking changes should only happen in major version releases, if the product hasn't reached a 1.0 version, right?)

Saying that web standards never change is disingeneous at best. For example, to change the HTML standard you (taken from [How should I go about proposing new features to WHATWG standards?](https://whatwg.org/faq#adding-new-features)):

* Write down a description of the underlying problem you’re trying to solve. What are the use cases? A use case is an actual user wanting to do something. Then list requirements for each use case. For a good example of how to do this, see this email
* Get more people involved. Open a new issue in whatwg/html on GitHub that describes the use cases and their requirements
  * Ask fellow web developers about their opinions (but remind them that you're not looking for solutions yet)
  * Adjust the list of use cases and requirements as appropriate
  * Say which use cases are important and which are just nice to have.
* Optionally, your work is done at this point. If you have done a good job of the above steps and convinced other people that your use case is an important one to solve, they can do the remaining steps
* Research existing solutions
  * Come up with new solutions
  * Try to keep the solutions as simple as possible, maybe only addressing the important use cases and leaving the nice to have use cases for later (when there’s implementation experience)
  * Send this list of solutions, old and new, as a comment on the feature’s issue
  * Ask browser vendors for feedback. Maybe some particular solutions don’t fit with the browser’s architecture, optimizations, etc., and just are not going to be implemented no matter how much you like them. Strike those solutions and don’t grieve about the loss!
* Evaluate how well each of the remaining solutions address each use case and how well they meet the requirements
  * This step should show which solution is the technically best fit (might turn out to be someone else’s solution)
* Get multi-implementer interest in the solution
  * This means a commitment from two or more browser engines to implement and ship your feature
  * Many features get stuck here; don't get too discouraged! Browsers are tough, resource-constrained software projects
  * If they aren't able to immediately prioritize your feature, you can try to raise the profile of your problem via community outreach. A commonly-successful way of doing this is to create a polyfill for your solution, and show that it gets very wide use, and is thus worth shipping with the browser.
* Once you have multiple implementers on board, ask the editor to put that solution in the standard, or create a pull request on GitHub yourself
  * Possibly your text won’t be taken verbatim, but will be written in a style that is more suitable for implementers or better hooks in to the rest of the standard, etc.
* Write a test suite for the feature to help along the implementations. Cross-browser tests are maintained in web-platform-tests on GitHub
  * Implementers are often much more eager to add a feature when someone else has provided them with a comprehensive test suite. As a bonus, this often also finds bugs or imprecisions in the proposed standard
    * Note that writing comprehensive tests for a complex feature before it has been implemented at all is difficult and error-prone, and in such cases you might want to work with the implementers to develop the test suite in tandem with their initial implementations.
* At this point, if the editor judges everything is all lined up, the pull request for your feature will be merged into the standard! But you're not done yet.
* Ensure that browser vendors follow up and ship the newly specified solution
  * This process sometimes finds new problems with the solution that need to be addressed, or even discovers that a different solution is actually better.
* Participate in subsequent design discussions
  * When there are two or more mature implementations, it may be time to extend the feature to address the nice to have use cases, repeating this process.

Standards bodies like W3C, WHATWG and TC39 are not the venue for experimentation since all the changes made there are baked into browsers' Javascript and rendering engines. Changes are possible but they have to account for all the people who will use the changed tools.

This is different from iterating features in a framework or library where the stakes, whether we want to accept it or not, are much lower. All frameworks and libraries sit on top of web standards so they can iterate and experiment in ways that can later be folded into the ECMAScript specification (as it has been done before) even though the bar is high, some may say too high.

> I can only imagine the nightmare it would have been if JSX had been standardized in the browser. Forgetting how frameworks like Inferno, Solid, and Million, have done way more optimal things with their JSX transform, even React has changed their transform over time.

This sounds like the situation the Javascript community now finds itself with the package.json file format. It has grown so confusing and convoluted that now TC39, the standards body for Javascript, has chartered a group to make sense of the current mess and come up with a unified way to use package.json that provides consistency, something that is severely lacking today.


> &hellip; DOM elements can be cloned. But Custom Elements have different behavior which means they should be imported instead. They have DOM-based lifecycles that can trigger synchronously or asynchronously depending on when they upgrade. This wreaks havoc on things like Reactivity tracking and Context APIs. However, these details are important to interface with native DOM behaviors and events. These are also all things that a JavaScript Component doesn't worry about.

Why shouldn't we do the same things that framework did and build what we think is missing as addons for vanilla web components?

The web has grown and thrived on people adding functionality on top of what the platform provides. Why would this be any different?

> I've talked about where early standardization would have been catastrophic. But it also has the potential to stifle future innovation along certain paths because it assumes too much.

I'm confused about this statement. What is this potential to stifle future innovation?

How would it affect developers and framework/library implementors from building the necessary abstractions on top of the standard? If these abstractions become popular, would it really be unreasonable to fold them into the relevant standard like the community did with responsive images and querySelector/querySelectorAll?

> Improvements to hydration, things like Resumability, Partial or Selective Hydration depend on event delegation to work. But if Shadow DOM messes with that then how could Web Components fit that model? SSR some might say was an oversight because we didn't think about that much in 2013, but this gap only continues to grow over time.

How does shadow DOM messes with event delegation?

This is important to me since all the research I've done points to events working properly.

We can dispatch custom events from the shadow DOM both inside and outside custom elements, as long as the shadow root was created in `open` mode.

Outside custom elements:

```js
const div = document.createElement("div");
const shadowRoot = div.attachShadow({ mode: "open" });

shadowRoot.addEventListener("test", (evt) => {
  console.log(">> Shadow root listener invoked", evt);
});

const evt = new Event("test");
shadowRoot.dispatchEvent(evt);
```

And inside a custom element:

```js
customElements.define('user-card', class extends HTMLElement {
  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = `<p>
      <button>Click me</button>
    </p>`;
    this.shadowRoot.firstElementChild.onclick =
      e => alert("Inner target: " + e.target.tagName);
  }
});

document.onclick =
  e => alert("Outer target: " + e.target.tagName);
</script>
```

According to [Shadow DOM and events](https://javascript.info/shadow-dom-events)

We use a flattened DOM for bubbling purposes.

If we have a slotted element, and an event occurs somewhere inside it, then it bubbles up to the `slot` and then to the the custom elements (the direct parent) and its parents in the host document.

The full path to the original event target, with all the shadow elements, can be obtained using `event.composedPath()`. That path is taken after the composition.

To summarize:

Events only cross shadow DOM boundaries if their composed flag is set to true.

Built-in events mostly have composed: true, as described in the relevant specifications:

* [UI Events](https://www.w3.org/TR/uievents)
* [Touch Events](https://w3c.github.io/touch-events)
* [Pointer Events](https://www.w3.org/TR/pointerevents)

Some built-in events that have `composed: false`:

* mouseenter, mouseleave (also do not bubble)
* load, unload, abort, error,
select
* slotchange

These events can be caught only on elements within the same DOM.

If we dispatch a CustomEvent, then we should explicitly set `composed: true`.

> If anything with compilers and advancements in build tools, we are moving more in the direction away from components being anything more than a Developer Experience consideration. Something you have at authoring time that vanish from the final output. For optimal user experience we optimize away the components.

IMO, optimizing away components is a mistake. But, in the end, this is a choice for each project to make.

The web evolves in stages and the same move back to server side rendering it's likely that we'll move back to a web that won't require as much building.

> But frontend is a much more restrictive space. The cost of each kilobyte of JS is not insignificant. It isn't only maintenance why you wouldn't want to mix and match but to reduce payload. And this is where the wheels start coming off.

Do they, really? Custom elements provide a framework neutral to add functionality to a web site or app so why wouldn't we want to add them?

[Custom Elements Everywhere](https://custom-elements-everywhere.com/) shows custom element support for different frameworks. While the number of frameworks is small the level of support is eye opening for me.

The biggest item for me in this conversation is that it seems to miss the "write once, run everywhere" promise of web components. Yes, you may have to do some additional wiring on your framework to be fully compatible, but if the largest frameworks like React, Vue and Angualr have done it, it really shouldn't be that hard to do.

Rather than having to learn multiple frameworks, you can learn one way to create components and then move them between frameworks without much complain.

Or you can adopt frameworks like [Astro](https://astro.build/) that are designed to work with components from other frameworks

I believe that, in the end, this is a personal choice rather than a technical one.

## Links and References

* [Shadow DOM and events](https://pm.dartus.fr/posts/2021/shadow-dom-and-event-propagation/)
* <https://medium.com/torq-ai/shadow-dom-events-59a90068e612>
* <https://javascript.info/shadow-dom-events>
* <https://dev.to/rrees/server-side-rendered-web-components-34pl>
* <https://developer.mozilla.org/en-US/docs/Web/API/Event/composedPath>
* [Custom Elements Everywhere](https://custom-elements-everywhere.com/)
* [Astro](https://astro.build/)
