---
title: "Yes, you can write 'wrong' CSS"
date: 2026-06-12
tags:
  - CSS
  - Web Development
  - Best Practices
youtube: true
---

Jens Oliver Meiert wrote an interesting article on SitePoint: [There Is No "Wrong" in CSS](https://www.sitepoint.com/there-is-no-wrong-in-css/).

He offers four reasons why CSS can't really be "wrong":

1. If It Works, It Works
2. The One Who Suffers Is You
3. It’s Easy to Change
4. Barriers for Users Are a Web Platform Responsibility

I agree with part of his argument, but I think the conclusion is too broad.

Whether CSS is "wrong" depends on what standard we apply:

In this post, "wrong" means predictably creating avoidable user barriers or high change risk.

1. Rendering is the floor, not the standard.
2. Maintainability and resilience are quality criteria.
3. Avoiding user barriers is a responsibility criterion.

Rendering is only the floor. Good CSS also needs to be maintainable, resilient, and unlikely to create barriers for users. A stylesheet can pass the first test and still fail the others. That does not always make it broken, but it can absolutely make it poor CSS, and in some cases it makes it wrong in practice.

## If it works, it works

If you define "wrong" as "not working," then yes, you can't write wrong CSS. If it renders, it passes that test.

But passing that test doesn't mean the CSS is good, maintainable, or efficient. In the effort to *not break the web*, CSS has evolved to be forgiving, so very old patterns still function.

That forgiveness has a tradeoff: code can render while still being fragile. Deeply nested selectors or heavy `!important` usage might work today and still create long-term problems.

For example, this will probably render exactly as intended, but it is brittle and difficult to override later:

```css
.homepage #hero .content .cta a {
  color: white !important;
  background: darkblue !important;
  padding: 0.75rem 1.25rem !important;
}
```

This version is easier to reason about, reuse, and maintain:

```css
.cta-link {
  color: white;
  background: darkblue;
  padding: 0.75rem 1.25rem;
}
```

## The one who suffers is you

> It is your problem, your incentive to solve it, and your call when to do what in your CSS. Therefore, there is no wrong CSS here, either.

The statement is technically correct, but it also assumes that the person writing the CSS is the only one who will be affected by it.

In the example from Jens's article, if the CSS is not written with RTL support in mind, it could lead to a poor user experience for users of right-to-left scripts.

For example, this works in left-to-right layouts, but it hard-codes a direction into the design:

```css
.callout {
  padding-left: 1rem;
  border-left: 0.25rem solid currentColor;
  text-align: left;
}
```

This version is more resilient because it uses logical properties:

```css
.callout {
  padding-inline-start: 1rem;
  border-inline-start: 0.25rem solid currentColor;
  text-align: start;
}
```

It can also lead to lost business if users leave because of that poor experience. So while it may be "your problem" in the sense that you wrote the CSS, it is also a problem for everyone affected by it.

So yes, you can write CSS that renders correctly and still creates avoidable maintenance costs or user barriers.

## It’s easy to change

Yes, CSS is easy to change, but "easy to edit" is not the same as "cheap to change."

Layout dependencies, selector specificity, and component coupling can make a small visual tweak cascade into regressions. If every change requires detective work, the stylesheet is functioning as technical debt.

For example, this looks like a tiny change made to fix spacing in one card component:

```css
.card h2 {
  margin-block-end: 0;
}
```

But if `h2` appears inside product cards, promo cards, sidebars, and modal panels, that one rule can quietly change spacing across the whole interface.

That is the real cost. A broad selector couples unrelated surfaces through the cascade, so a change meant for one component becomes a change you now have to verify everywhere else that selector might match. Future edits become harder to predict, and simple fixes turn into wider regression tests. Scoped selectors and component-level visual regression tests reduce that risk.

This version is safer because it targets the specific variant that actually needs the change:

```css
.product-card__title {
  margin-block-end: 0;
}
```

## Barriers for Users Are a Web Platform Responsibility

Here the argument shifts from CSS specifically to the web platform more broadly. That broader framing still matters, because CSS is part of that platform, and the same question remains: can the platform reduce barriers without guaranteeing access?

> Assuming the case that there’s something entirely wrong, and the CSS you’re using is creating problems for your users.
>
> While this can prompt action—nothing here says you may not act—, here’s where we can fall back to a point not often appreciated:
>
> *The platform should make it hard to create barriers, and easy to remove them.*

CSS, like any language, will not stop us from creating barriers if we're not careful. The platform can make accessible decisions easier, but it cannot force them.

As developers, we are still responsible for whether people can use what we build. That includes semantic HTML, alternative text, keyboard support, and thoughtful CSS defaults.

### A short case study: where platform guarantees stop

Meiert's post references Joe Clark's [When accessibility is not your problem](https://joeclark.org/appearances/atmedia2007/).

Clark extends the same basic idea even further: that many accessibility barriers are ultimately the platform's responsibility, not the author's. I disagree for the same reason I disagree with Meiert's argument. The platform can help, but it cannot prevent developers from making choices that create barriers.

Clark's examples are a useful way to test the limits of platform responsibility through CSS-specific choices:

Font resizing
: The issue is not simply whether a stylesheet uses `px`. Modern browsers can still zoom pixel-sized text.
: The bigger problem is when developers choose text sizes that are too small, lock content into fixed-height containers, or build layouts that start breaking as soon as users zoom or increase default text size.
: By "default settings" here, I mean either browser defaults or the baseline styles a project sets to replace them.
: How would the platform prevent those choices? Should it block small text, fixed heights, or any layout that becomes fragile under scaling?
: Teams often restyle headings to fit a visual system. The risk is a split between visual hierarchy and semantic hierarchy: sighted users infer one document structure, while assistive technologies navigate another.

Foreground and background colors
: Should the browser prevent insufficient contrast combinations?
: Should it prevent interfaces that rely on color alone to communicate state, especially red/green distinctions that many users cannot reliably differentiate?
: Even when contrast passes, we can still create barriers if meaning is encoded only in hue instead of reinforced with text, icons, or patterns.

Cultural meaning of color
: This is a different issue from accessibility, but it points to the same limit in the platform-responsibility argument.
: Even if the platform restricted some color choices, it still could not decide what a color means for different cultures, markets, or communities.
: At some point, interpretation and responsibility still belong to authors and teams.
: This video illustrates one perspective on how different cultures perceive colors differently and how this can affect design decisions.
: <lite-youtube videoid="fpyc3i3NDIM"></lite-youtube>
: Also see [Do different cultures perceive colors differently? How does this affect design decisions?](https://cieden.com/book/sub-atomic/color/color-symbolism-and-meanings)

Cognitive disabilities
: Cognitive and learning disabilities include a wide range of conditions that can affect memory, attention, language processing, and executive function.
: The barriers here are often cumulative and subtle. A single choice might be tolerable, but several together can make a page exhausting or unusable.
: CSS can directly increase cognitive load when we create dense, noisy interfaces: tightly packed text, long line lengths, low contrast, decorative fonts for body copy, or all-caps blocks that are harder to scan.
: Motion and animation are another common source of friction. Autoplaying carousels, parallax effects, and aggressive transitions can distract users, increase fatigue, or trigger vestibular symptoms.
: A common anti-pattern looks like this:

```css
.promo-banner {
  animation: pulse 600ms infinite;
}

.carousel {
  scroll-behavior: smooth;
}
```

: A better default respects reduced-motion preferences and keeps the interface calmer:

```css
.content {
  line-height: 1.6;
  max-width: 65ch;
}

@media (prefers-reduced-motion: reduce) {
  .promo-banner {
    animation: none;
  }

  .carousel {
    scroll-behavior: auto;
  }
}
```

: Time pressure patterns are also relevant. CSS-only countdown cues, disappearing messages, and hover-only disclosures can punish users who need more time to process information.
: The platform gives us tools, but not guarantees. Browsers can expose user preferences like `prefers-reduced-motion`, but they cannot force us to honor them.
: If we ignore those preferences, we can still ship a technically valid experience that is functionally inaccessible.
: Practical CSS guardrails that reduce cognitive friction include:
: * Keep body text highly readable (comfortable line-height, moderate line length, strong contrast)
: * Avoid auto-rotating UI and non-essential motion
: * Respect `prefers-reduced-motion` and offer a calm default when possible
: * Preserve visible focus styles and predictable interaction states
: * Avoid using color, position, or motion as the only way to convey meaning
: None of these practices are especially difficult, but they do require intent. That is why "the platform guarantees access" is too strong: developer decisions still determine whether people can understand and use the interface.

Meiert further states that:

> The developer provides the intent; the platform provides the guarantee of access.

This is where I disagree most.

The platform can provide tools and features to help developers create accessible content, but it cannot guarantee that all content will be accessible if developers do not use those tools correctly.

## Conclusion

Meiert is right that CSS is forgiving and that the platform can support better outcomes. But support is not the same as a guarantee.

My takeaway is simple: valid CSS is not automatically good CSS.

If a stylesheet predictably creates barriers for users, increases maintenance risk for teams, or makes future change expensive, then it is reasonable to call it "wrong" in practice, even when it technically renders.

That standard is stricter than "if it works, it works," and I think the web is better when we use the stricter standard.
