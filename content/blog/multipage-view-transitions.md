---
title: Multipage View Transitions
date: 2024-06-19
tags:
  - CSS
  - View Transitions
youtube: true
---

When initially introduced, view transitions would only work with single-page applications. This is awesome but it doesn't work with regular web pages like what I normally work with.

During I/O 2024, Bramus introduced extensions to the Page View API that would make them work across pages on the same origin.

<lite-youtube videoid="eY6C_-aDdTo"></lite-youtube>

This will create more appealing transitions between pages in an application.

## How they work

!!! note <strong>Note:</strong>
Cross-document view transitions are limited to same-origin navigations only. Navigation is considered to be same-origin if the origin of both participating pages is the same.
!!!

To have a cross-document view transition between two documents, both participating pages need to opt-in to allow this. we do this with the `@view-transition` at-rule in CSS.

We enable same-origin view transitions by setting the `navigation` descriptor to `auto`.

```css
@view-transition {
  navigation: auto;
}
```

With this at-rule, we get the default transitions as determined by the browser developers.

## Customizing view transitions

We have code that will enable same-origin view transitions between pages, now we can customize the behavior of the transitions using new pseudo-elements: [::view-transition-old](https://developer.mozilla.org/en-US/docs/Web/CSS/::view-transition-old) and [::view-transition-new](https://developer.mozilla.org/en-US/docs/Web/CSS/::view-transition-new).

The most basic example changes the duration of the view transition. We can put additional animation attributes that are common to the page we're transitioning from and the page we're transitioning into.

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 3s;
}
```

We can also customize the animations for the page we're leaving and the page we're entering.

First, we define the keyframe animations that we want to execute.

We then customize the animations using `::view-transition-old(root)` and
`::view-transition-new(root)`

```css
@keyframes fade-in {
  from { opacity: 0; }
}

@keyframes fade-out {
  to { opacity: 0; }
}

@keyframes slide-from-right {
  from { transform: translateX(30px); }
}

@keyframes slide-to-left {
  to { transform: translateX(-30px); }
}

::view-transition-old(root) {
  animation: 90ms cubic-bezier(0.4, 0, 1, 1) both fade-out,
    300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-to-left;
}

::view-transition-new(root) {
  animation: 210ms cubic-bezier(0, 0, 0.2, 1) 90ms both fade-in,
    300ms cubic-bezier(0.4, 0, 0.2, 1) both slide-from-right;
}
```

## Handling multiple transitions

It should also be possible to control transitions for different parts of pages where necessary.

The code below, adapted from Bramus's [Pagination MPA example](https://view-transitions.netlify.app/pagination/mpa/) uses CSS and Javascript to achieve the effect we want.

In CSS we define the types of events that we want to work with and the name of the view transitions for each component we want to work with.

```css
html:active-view-transition-type(forwards, backwards) {
  :root {
    view-transition-name: none;
  }

  header {
    view-transition-name: page-header;
  }

	.container {
    view-transition-name: content;
  }
}
```

We then set up the different types of transitions that we want to work with for both the forward and backward navigations.

```css
html:active-view-transition-type(forwards) {
  &::view-transition-old(content) {
    animation-name: slide-out-to-left;
  }
  &::view-transition-new(content) {
    animation-name: slide-in-from-right;
  }
}

html:active-view-transition-type(backwards) {
  &::view-transition-old(content) {
    animation-name: slide-out-to-right;
  }
  &::view-transition-new(content) {
    animation-name: slide-in-from-left;
  }
}

/* Animation styles for reload type only */
html:active-view-transition-type(reload) {
  &::view-transition-old(root) {
    animation-name: fade-out, scale-down;
  }
  &::view-transition-new(root) {
    animation-delay: 0.25s;
    animation-name: fade-in, scale-up;
  }
}
```

At this point, we have not provided a way to detect the navigations, this is not automatic.

We use Javascript to handle this.

The `determineTransitionType` functions will determine the type of transition that will be used in the CSS code.

It accomplishes the task by doing the following:

1. Assigning a value of 1 to `index.html`
2. Comparing the index value for each page in the navigation
3. Setting the navigation type based on the comparison result

```js
// Path where this app is deployed.
const basePath = './';

const determineTransitionType = (oldNavigationEntry, newNavigationEntry) => {
	const currentURL = new URL(oldNavigationEntry.url);
	const destinationURL = new URL(newNavigationEntry.url);

	const currentPathname = currentURL.pathname.replace(basePath, '');
	const destinationPathname = destinationURL.pathname.replace(basePath, '');

	if (currentPathname === destinationPathname) {
		return "reload";
	} else {
		let currentPageIndex = currentPathname.replace('/index', '').replace('/', '').replace('.html', '');
		let destinationPageIndex = destinationPathname.replace('/index', '').replace('/', '').replace('.html', '');

		// The first page has no number in its path so we assign 1 to it
		currentPageIndex = currentPageIndex ? parseInt(currentPageIndex) : 1;
		destinationPageIndex = destinationPageIndex ? parseInt(destinationPageIndex) : 1;

		if (currentPageIndex > destinationPageIndex) {
			return 'backwards';
		}
		if (currentPageIndex < destinationPageIndex) {
			return 'forwards';
		}

		return 'unknown';
	}
};
```

The `pageswap` and `pagereveal` events handle the transitions themselves. We don't have to use these events, we could

pageswap
: fires before the last frame of a page is rendered. You can use this to make some last-minute changes on the outgoing page, right before the old snapshots get taken.

pagereveal
: fires on a page after it has been initialized or reactivated but before the first rendering opportunity. With it, you can customize the new page before the new snapshots get taken.

In this example

```js
window.addEventListener("pageswap", async (e) => {
	if (e.viewTransition) {
		const transitionType = determineTransitionType(e.activation.from, e.activation.entry);
		console.log(`pageSwap: ${transitionType}`);
		e.viewTransition.types.add(transitionType);
	}
});

window.addEventListener("pagereveal", async (e) => {
	if (e.viewTransition) {
		const transitionType = determineTransitionType(navigation.activation.from, navigation.activation.entry);
		console.log(`pageReveal: ${transitionType}`);
		e.viewTransition.types.add(transitionType);
	}
});
```

## The Javascript Option

There is also a Javascript way to control view transitions, both single page and multipage.

The Javascript API is discussed in the [API portion of the specification](https://drafts.csswg.org/css-view-transitions/#api) and the Google articles: [Same-document view transitions for single-page applications](https://developer.chrome.com/docs/web-platform/view-transitions/same-document) and [Smooth transitions with the View Transition API](https://developer.chrome.com/docs/web-platform/view-transitions)

I've chosen not to cover the Javascript API here for space reasons and because I'm trying to wrap my head around it.

## Defensive Coding

There are three aspects to coding defensively when it comes to view transitions:

* Use it as progressive enhancement
* Honor `prefer-reduced-motion` media queries
* Use feature queries

### Use as progressive enhancement

This feature is very difficult to polyfill so, rather than try and polyfill it, consider it as progressive enhancement.

If a browser doesn't support the feature then it will load the pages as we're already used to.

### Honoring prefer-reduced-motion media queries

We should also honor the user's reduced operating system motion preference.

The [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) media query reflects the system motion preference.

If the user had disabled motion preferences we then provide alternative styles that don't rely on motion to convey meaning.

In this example, we disable view transitions.

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

But as Michelle Barker [reminds us](https://www.smashingmagazine.com/2021/10/respecting-users-motion-preferences/):

> **reduced-motion Doesn’t Mean No Motion**
>
> When styling for reduced motion preferences, it’s important that we still provide the user with meaningful and accessible indicators of when an action has occurred.

We can start with no animation and then use the `prefer-reduced-motion: no-preference` to trigger animations. In this context, `no-preference` indicates that we haven't indicated we don't want motion so it would be OK to run animations and other motion content.

```css
@media (prefers-reduced-motion: no-preference) {
	::view-transition-old(root),
	::view-transition-new(root) {
		animation-duration: 3s;
	}
}
```

### Feature Queries (@supports)

Another way to code defensively is to use feature queries to check if the browser supports the API and use it if it does.

```css
@supports (view-transition-name: demo) {
	@view-transition {
		navigation: auto;
	}

	::view-transition-old(root),
	::view-transition-new(root) {
		animation-duration: 3s;
	}
}
```

## Browser Support

As of writing this post, the view transitions API only works in Chromium browsers.

Think of the API as progressive enhancement.

If the browser doesn't support the API then the user will not see the transitions and page navigation will happen as we're used to.

## Final Notes

This post scratches the surface of what view transitions can do. As mentioned earlier, we skipped the view transitions Javascript API as I'm working to understand it and figure out when it's best to use it.

## Links and Resources

* [CSS View Transitions Module Level 1](https://drafts.csswg.org/css-view-transitions/)
* [Same-document view transitions for single-page applications](https://developer.chrome.com/docs/web-platform/view-transitions/same-document)
* [Smooth transitions with the View Transition API](https://developer.chrome.com/docs/web-platform/view-transitions)
* [What's new in view transitions? (Google I/O 2024 update)](https://developer.chrome.com/blog/view-transitions-update-io24)
* [Using @starting-style and transition-behavior for enter and exit stage effects](https://nerdy.dev/using-starting-style-and-transition-behavior-for-enter-and-exit-stage-effects)
* [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) &mdash; MDN
  * [::view-transition-old](https://developer.mozilla.org/en-US/docs/Web/CSS/::view-transition-old) &mdash; MDN
  * [::view-transition-new](https://developer.mozilla.org/en-US/docs/Web/CSS/::view-transition-new) &mdash; MDN
