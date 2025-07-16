---
title: Why learn a framework?
date: 2025-08-20
tags:
  - Web Development
  - Frameworks
  - CSS
  - Javascript
  - HTML
---

I recently read two post that got me thinking about the value of learning a web development framework. These posts also align with my own experiences and thoughts on the subject.

This post will explore my experiences, why I think learning a framework may be beneficial, and when do we learn to reach beyond frameworks and back to web standards.

## My Experience

I've finally started to learn [React](https://react.dev/) and I can see the value in learning a framework but the value is tempered by the assumptions we all make when learning the framework.

## The Assumptions I see

### What do I need to know?

Whenever I look at React docs, I find myself asking "what do I need to know to understand this?" and "where are these concepts taught?"

When I look at the React documentation, I see many assumptions made about the reader's knowledge of web development and Javascript. These assumptions can make it difficult for someone new to React (or brand new to front-end development) to understand the examples and concepts presented.

Taking this example from the React Docs Quickstart:

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Would you be able to understand this code without knowing that `export default` exports a single value from a module? Or that it will make the `MyApp` component the default export of the module? Or that the full script is a module that has to be imported either with a `<script type="module">` tag or with a bundler like [Vite](https://vitejs.dev/), [Rollup](https://rollupjs.org/), or [Webpack](https://webpack.js.org/)?

I generalize this to say that many frameworks assume you know how to use Javascript without explaining the concepts used in the examples.

Perhaps this is because the React team and people who build React training, outside academic institutions or bootcamp-style training programs, assume that most people who learn React already know Javascript, but this is not always the case.

People may also jump into learning a framework without understanding the underlying technologies because they can get started quickly, copy and paste code from existing projects and, more recently, use AI tools to generate code snippets or full applications without understanding the code or how components talk to each other.

### Is Javascript the solution to all problems?

The biggest assumption is that Javascript is the solution to all problems and that humongous amounts of Javascript are needed to build a web application.

This assumption is not only prevalent in the React ecosystem but also in many other frameworks and libraries.

Why do we need CSS if we have JS libraries like [Tailwind CSS](https://tailwindcss.com/) or [styled-components](https://styled-components.com/)? Why do we need HTML if we can build everything with React or Vue or Svelte (or your favorite framework) components? Why do we need to learn the web platform if we can use a framework that abstracts it away?

### Framework churn

I've seen many frameworks come and go over the years and sometimes the changes between versions are so drastic that it feels like learning a new framework altogether.

| Framework | Year Introduced | Update Frequency |
| --- | --- | --- |
| Angular | 2010 | Every 6 months |
| React | 2013 | No fixed schedule |
| Vue | 2014 | No fixed schedule |
| Svelte | 2016 | No fixed schedule |

The current version of Angular owes its stability to the fact that the migration from AngularJS to Angular(2) was so painful that the Angular team decided to keep the API stable and only introduce breaking changes in major releases.

The React team has also been careful to avoid breaking changes, but the introduction of new features like [React Server Components](https://react.dev/blog/2020/10/20/react-server-components) and [Concurrent Mode](https://react.dev/blog/2022/03/08/the-plan-for-react-18) can make it feel like a new framework.

The Vue team has also been careful to avoid breaking changes, but the introduction of new features like [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) and [Teleport](https://vuejs.org/guide/built-ins/teleport.html) can make it feel like a new framework.

Svelte is more aggressive in its updates and the features it introduces, but it has a smaller ecosystem and community compare to the other frameworks.

### Javascript bloat

According to [HTTP Archive](https://httparchive.org/), the median size of a web application is:

* 702.0 KB in desktop browsers
* 642.4 KB in mobile browsers

But the report in the archive doesn't mention if the payloads are compressed (with Gzip or Brotli) or not, so the actual size of the payloads may be (significantly) larger.

It also can't account for the parsing and execution time of the Javascript code, which can have a significant impact on the performance of the application, particularly on mobile devices with limited resources or in places with poor network conditions.

I'm deliberately not talking about people disabling Javascript in their browsers, but rather the impact of large amounts of Javascript on the performance of the application.

Also according to the HTTP archive we make a lot of Javascript requests:

* 22 Requests in desktop browsers
* 21 Requests in mobile browsers

If any of these request fails, the application may fail or not work as expected.

## Fighting the assumptions

### Foundational Knowledge

I've answered variations of "Should I learn Javascript and CSS" in Quora with a resounding "yes!" because these are foundational skills that will serve you well regardless of the framework you choose.

### Is Javascript the solution to our CSS problems?

I will not go into CSS-in-JS or Tailwind CSS, but I will note that many frameworks use Javascript to solve problems that could be solved with CSS.

modern CSS features like layers (@layer), scopes (@scope), and custom properties (variables) address many of the long-standing challenges that led to the rise of CSS-in-JS. Component-based frameworks also offer ways to colocate styles.

#### **Scoping with @layer and @scope**

CSS Layers (@layer) and the @scope at-rule provide powerful, native, solutions for managing the global nature of CSS, which was a primary motivator for CSS-in-JS.

* **CSS Layers (`@layer`)**: Layers allow you to explicitly define the order of precedence for your stylesheets, independent of their specificity or source order. This is a massive improvement for managing styles from different sources (third-party libraries, frameworks, themes, and your own components) and preventing specificity wars. You can create distinct "layers" for your styles, ensuring that, for example, utility classes always override component styles, which in turn override a baseline design system.
* **`@scope` At-Rule**: This is an even more direct answer to the scoping problem. `@scope` lets you apply styles to a specific section, or "scoped root," of the DOM. This means you can write styles that are guaranteed to only affect elements within a particular component or container, preventing them from leaking out and affecting other parts of the page. This functionality is very similar to the scoped styling that CSS-in-JS libraries provide.

#### **Dynamic Styling with CSS Variables**

CSS Custom Properties (Variables) are a game-changer and significantly reduce the need for Javascript to handle dynamic styling. They allow you to:

* **Create dynamic themes**: You can define a theme by setting a group of variables on a high-level element (like :root or body). Changing these variables, either with a class switch or a small amount of Javascript, can instantly re-theme your entire application.
* **Pass "props" to styles**: You can set a custom property on a component's host element using an inline style attribute, and then use that variable within the component's stylesheet. This effectively allows you to pass values from a parent (or Javascript) directly into your CSS, mimicking the "props-based styling" popular in CSS-in-JS.
* **Simplify responsive design**: Variables can be updated within media queries, making it easier to manage design tokens and maintain consistency across different screen sizes.

While CSS-in-JS can still offer more complex logic (like looping or complex calculations directly in your styling code), CSS variables cover a vast majority of dynamic use cases in a more performant, native way.

#### Colocation in Modern Frameworks

Most modern front-end frameworks (like React, Vue, Svelte, and Angular) now have built-in or officially supported ways to handle component-level styling and colocation, even without using CSS-in-JS.

For example:

* Vue has single-file components (.vue files) where the `<style>` tag can be marked as scoped, automatically scoping the CSS to that component.
* Svelte also scopes styles to the component by default.
* React projects, especially those created with tools like Create React App or Vite, often use CSS Modules. With CSS Modules, you import a stylesheet into your component file, and the build process automatically generates unique class names for that component, effectively scoping the styles.

#### Shadow DOM

You can also use the Shadow DOM with modern Javascript frameworks, and some frameworks even embrace it as a core feature.

The integration varies by framework, ranging from seamless native support to requiring a bit of manual implementation.

Angular 🅰️
: Angular has the most robust, out-of-the-box support for Shadow DOM. It's built directly into the framework's component model through its `ViewEncapsulation API`. When creating a component, you can simply choose the encapsulation mode:

* `ViewEncapsulation.Emulated` (the default): Angular emulates style scoping by adding unique attributes to your component's HTML and rewriting your CSS selectors. It doesn't use the actual Shadow DOM.
* `ViewEncapsulation.ShadowDom`: This mode uses the native browser Shadow DOM to create a fully encapsulated component with its own scoped styles and DOM tree.

Vue and Svelte 🟢
: Both Vue and Svelte have excellent support for compiling components into native custom elements, which use the Shadow DOM internally. This is the primary way they integrate with it.

* **Vue**: You can use Vue's `defineCustomElement` function to create a native custom element from a standard Vue component. This new element will use the Shadow DOM to encapsulate its template and styles.
* **Svelte**: Svelte allows you to compile your components directly into custom elements by setting the `<svelte:options tag="my-element" />` tag inside a component. This is a very common and straightforward way to produce standards-compliant web components that leverage the Shadow DOM.

React ⚛️
: React has the most complex relationship with the Shadow DOM. While you can use it, it requires more manual effort because of how React's virtual DOM interacts with the actual DOM. The main challenges are:

* **Event Propagation**: React's synthetic event system expects a direct path for events to bubble up to the document. The Shadow DOM boundary can interrupt this, causing some events to not work as expected without extra code.
* **Styling**: Passing styles (like with CSS-in-JS libraries) into the shadow root can be tricky and may require specific library support or manual DOM manipulation.

Despite these hurdles, it is achievable. Developers typically create a wrapper component that handles attaching a shadow root and rendering React components inside of it, often using a ref to get a direct handle on the DOM element. Libraries also exist to simplify this process.

### Web components as an interchange format

Most frameworks now support web components as framework-agnostic components that can be used across different frameworks. This means you can create a component as a standalone element and use it in any framework that supports web components.

For more information on web components, see [Web Components: The Future of Front-End Development](https://web.dev/web-components/).

For more information on how to use web components in your framework of choice, see the [MDN Web Components Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

For information on framework web components, see [Custom Elements Everywhere](https://custom-elements-everywhere.com/)

### Is AI the solution?

AI has the potential to assist in various aspects of web development, including automating repetitive tasks, providing intelligent code suggestions, and even generating code snippets. However, it's not a silver bullet that can solve all problems.

Developers still need a solid understanding of the underlying principles and best practices, both foundational and framework specific, to effectively leverage AI tools.

If you can't troubleshoot a problem or understand the AI-generated code well enough to debug it, you may end up with a solution that doesn't work and you wouldn't know why.

### How we learn matters

Learning a framework is not just about the framework itself but also about how we learn and what we focus on.

Effective learning strategies aim to minimize extraneous cognitive load (e.g., by using tools like Vite to simplify setup or provide a skeleton app that users can build upon) so learners can focus on the intrinsic and germane aspects of learning.

From a teaching perspective, several methods have proven effective:

* **Scaffolding**: This involves providing learners with initial support that is gradually removed. For example:
  * Start with direct instruction on a single concept (e.g., what a component is).
  * Provide boilerplate code where the learner only has to fill in a small part.
  * Gradually require the learner to write more of the code from scratch.
  * Finally, assign a project where they build the entire feature themselves.
* **Inquiry-Based Learning**: This approach encourages learners to explore and question. A teacher might provide a working piece of code and ask students, "What happens if you change this? How could you make it do X?" This mirrors how developers learn on the job.
* **Modeling**: Instructors who model the entire development process—including making mistakes, debugging, and searching for answers on Google or in the documentation—provide a more realistic and encouraging learning experience.

## Conclusion: Should you learn a platform?

This is a tricky question and the answer, like many things in web development, is "it depends."

If you are new to web development, I recommend learning the foundational skills of HTML, CSS, and Javascript before diving into a framework. This will give you a solid understanding of how the web works and how to build web applications that can be transfered between frameworks and environments.

If your goal is to build a web application quickly and you are comfortable with the framework's assumptions, then learning a framework can be a good choice. Frameworks can provide a lot of abstractions to build applications faster, but they also come with their own set of assumptions and limitations.

It may also be that your work requires you to use a specific framework, in which case you will have to learn it regardless of your personal preferences.

But, in the end, the most important thing is to have a solid understanding of the web platform and how it works. This will allow you to make informed decisions about which framework to use and how to use it effectively.

## Links and Resources

* [No Time To Learn (Web) Framework X](https://brainbaking.com/post/2025/06/no-time-to-learn-web-framework-x/)
* [The cost of convenience](https://surma.dev/things/cost-of-convenience/)
