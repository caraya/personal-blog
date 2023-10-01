---
title: "Accessibility: Best Practices"
date: "2018-01-08"
---

Rather than reinvent the wheel I'll look at two collections of accessibility best practices: [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/) and Ebay's [MIND Patterns: Accessibility Patterns for the Web](https://ebay.gitbooks.io/mindpatterns/) (suggested by Rob Dodson).

we will take the accordion example from the ARIA Authoring Practices and explore what we need to have in an accessible component. Note that, as of this writing, MIND does not have suggestions for an accordion element.

This is a longer exercise than the one we did for the button demo earlier. Longer because of the element complexity, because there are many more moving parts and because there is no native equivalent on the web platform.

Before we get started there are a couple terminology items we need to get out of the way: headers and panels as they refer to the according object.

**Accordion Header**

Label for or thumbnail representing a section of content that also serves as a control for showing, and in some implementations, hiding the section of content.

In some accordions, there are additional elements that are always visible adjacent to the accordion header. For instance, a menubutton may accompany each accordion header to provide access to actions that apply to that section. And, in some cases, a snippet of the hidden content may also be visually persistent.

**Accordion Panel**

Section of content associated with an accordion header.

Next we look at the keyboard interactions that we need and should have for our **Keyboard Interaction**

- Required elements
    
    - Enter or Space:
    - When focus is on the accordion header for a collapsed panel, expands the associated panel. If the implementation allows only one panel to be expanded, and if another panel is expanded, collapses that panel
    - When focus is on the accordion header for an expanded panel, collapses the panel if the implementation supports collapsing. Some implementations require one panel to be expanded at all times and allow only one panel to be expanded; so, they do not support a collapse function
- Optional Elements
    
    - Down Arrow: If focus is on an accordion header, moves focus to the next accordion header. If focus is on the last accordion header, either does nothing or moves focus to the first accordion header
    - Up Arrow: If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.
    - Home: When focus is on an accordion header, moves focus to the first accordion header
    - End: When focus is on an accordion header, moves focus to the last accordion header.
    - Control + Page Down: If focus is inside an accordion panel or on an accordion header, moves focus to the next accordion header. If focus is in the last accordion header or panel, either does nothing or moves focus to the first accordion header
    - Control + Page Up: If focus is inside an accordion panel, moves focus to the header for that panel. If focus is on an accordion header, moves focus to the previous accordion header. If focus is on the first accordion header, either does nothing or moves focus to the last accordion header.

**ARIA Roles, States, and Properties:**

- The title of each accordion header is contained in an element with role [button](https://www.w3.org/TR/wai-aria-1.1/#button)
- Each accordion header `button` is wrapped in an element with role [heading](https://www.w3.org/TR/wai-aria-1.1/#heading) that has a value set for [aria-level](https://www.w3.org/TR/wai-aria-1.1/#aria-level) that is appropriate for the information architecture of the page
    
    - If the native host language has an element with an implicit `heading` and `aria-level`, such as an HTML heading tag, a native host language element may be used
    - The `button` element is the only element inside the `heading` element. That is, if there are other visually persistent elements, they are not included inside the `heading` element
- If the accordion panel associated with an accordion header is visible, the header `button` element has [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded) set to `true`. If the panel is not visible, [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded) is set to `false`
- The accordion header `button` element has [aria-controls](https://www.w3.org/TR/wai-aria-1.1/#aria-controls) set to the ID of the element containing the accordion panel content
- If the accordion panel associated with an accordion header is visible, and if the accordion does not permit the panel to be collapsed, the header `button` element has [aria-disabled](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled) set to `true`
- Optionally, each element that serves as a container for panel content has role [region](https://www.w3.org/TR/wai-aria-1.1/#region) and [aria-labelledby](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby) with a value that refers to the button that controls display of the panel
    
    - Avoid using the `region` role in circumstances that create landmark region proliferation, e.g., in an accordion that contains more than approximately 6 panels that can be expanded at the same time
    - Role `region` is especially helpful to the perception of structure by screen reader users when panels contain heading elements or a nested accordion

### The Code

As with the button example we will look at the HTML, CSS and Javascript separately to get an idea of what is involved to build this accessible component.

The HTML uses a description list to group together headers (using the `dt` element) and panels (using `dd`)

The code introduces the following ARIA attributes, some of them seen in the button demo:

- [role](https://www.w3.org/TR/wai-aria-1.1/#usage_intro) provides a way to clasify elements according to function, similar to the [Role 1.0 Recommendation](https://www.w3.org/TR/role-attribute/). The semantics provided in ARIA are specific to accessibility roles, the Roles Recommendation provides more generic use caases
- [aria-disabled](https://www.w3.org/TR/role-attribute/) Indicates that the element is perceivable (we can see it and read it in the page) but disabled (we can't interact with it, so it is not editable or otherwise operable)
    
    - Used in conjunction with the `disabled` attribute
    - This is different than being hidden using the [aria-hidden](https://www.w3.org/TR/wai-aria-1.1/#aria-hidden) or being read-only using the [aria-readonly](https://www.w3.org/TR/wai-aria-1.1/#aria-readonly)
- [aria-level](https://www.w3.org/TR/wai-aria-1.1/#aria-level) defines the position of the element within the page hierarchy
    
    - Multiple elements in a set may have the same value for this attribute
    - This attribute can be used to provide an explicit indication of the level when that is not possible to calculate from the document structure or the aria-owns attribute
- [aria-expanded](https://www.w3.org/TR/wai-aria-1.1/#aria-expanded) indicates whether the element, or another grouping element it controls, is currently expanded or collapsed
    
    - If the element with the `aria-expanded` attribute controls the expansion of another grouping container that is not 'owned by' the element, the author should reference the container by using the `aria-controls` attribute.
- [aria-controls](https://www.w3.org/TR/wai-aria-1.1/#aria-controls) Identifies the element (or elements) whose contents or presence are controlled by the current element
    
    - For the accordion we'll use the heading to control the associated panels
- [aria-labelledby](https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby) identifies the element (or elements) that labels the current element

```html
  <h1 id="page-title">Accordion Demo</h1>
  <dl id="accordionGroup" role="presentation" class="Accordion">
    <dt role="heading" aria-level="3">
      <button   aria-expanded="true"
                class="Accordion-trigger"
                aria-controls="sect1"
                id="accordion1id">
        <span class="Accordion-title">Personal Information</span>
        <span class="Accordion-icon"></span>
      </button>
    </dt>
    <dd   id="sect1"
          role="region"
          aria-labelledby="accordion1id"
          class="Accordion-panel">
      <div>
        <fieldset>
          <p>
            <label for="cufc1">Name
              <span aria-hidden="true">*</span>:</label>
            <input  type="text"
                    value=""
                    name="Name"
                    id="cufc1"
                    class="required"
                    aria-required="true">
          </p>
          <p>
            <label for="cufc2">Email
              <span aria-hidden="true">*</span>:</label>
            <input  type="text"
                    value=""
                    name="Email"
                    id="cufc2"
                    aria-required="true">
          </p>
          <p>
            <label for="cufc3">Phone:</label>
            <input type="text" value="" name="Phone" id="cufc3">
          </p>
          <p>
            <label for="cufc4">Extension:</label>
            <input type="text" value="" name="Ext" id="cufc4">
          </p>
          <p>
            <label for="cufc5">Country:</label>
            <input type="text" value="" name="Country" id="cufc5">
          </p>
          <p>
            <label for="cufc6">City/Province:</label>
            <input type="text" value="" name="City_Province" id="cufc6">
          </p>
        </fieldset>
      </div>
    </dd>
    <dt role="heading" aria-level="3">
      <button   aria-expanded="false"
                class="Accordion-trigger"
                aria-controls="sect2"
                id="accordion2id">
        <span class="Accordion-title">Billing Address</span>
        <span class="Accordion-icon"></span>
      </button>
    </dt>
    <dd   id="sect2"
          role="region"
          aria-labelledby="accordion2id"
          class="Accordion-panel" hidden>
      <div>
        <fieldset class="billing flex">
          <p>
            <label for="b-add1">Address 1:</label>
            <input type="text" name="b-add1" id="b-add1" />
          </p>
          <p>
            <label for="b-add2">Address 2:</label>
            <input type="text" name="b-add2" id="b-add2" />
          </p>
          <p>
            <label for="b-city">City:</label>
            <input type="text" name="b-city" id="b-city" />
          </p>
          <p>
            <label for="b-state">State:</label>
            <input type="text" name="b-state" id="b-state" />
          </p>
          <p>
            <label for="b-zip">Zip Code:</label>
            <input type="text" name="b-zip" id="b-zip" />
          </p>
        </fieldset>
      </div>
    </dd>
    <dt role="heading" aria-level="3">
      <button   aria-expanded="false"
                class="Accordion-trigger"
                aria-controls="sect3"
                id="accordion3id">
        <span class="Accordion-title">Shipping Address</span>
        <span class="Accordion-icon"></span>
      </button>
    </dt>
    <dd   id="sect3"
          role="region"
          aria-labelledby="accordion3id"
          class="Accordion-panel" hidden>
      <div>
        <fieldset>
          <p>
            <label for="m-add1">Address 1:</label>
            <input type="text" name="m-add1" id="m-add1" />
          </p>
          <p>
            <label for="m-add2">Address 2:</label>
            <input type="text" name="m-add2" id="m-add2" />
          </p>
          <p>
            <label for="m-city">City:</label>
            <input type="text" name="m-city" id="m-city" />
          </p>
          <p>
            <label for="m-state">State:</label>
            <input type="text" name="m-state" id="m-state" />
          </p>
          <p>
            <label for="m-zip">Zip Code:</label>
            <input type="text" name="m-zip" id="m-zip" />
          </p>
        </fieldset>
      </div>
    </dd>
  </dl>
</body>
</html>
```

The CSS controls the layout and animation for the different items we've defined in markup

```css
.Accordion {
    border: 1px solid hsl(0, 0%, 82%);
    border-radius: .3em;
    box-shadow: 0 1px 2px hsl(0, 0%, 82%);
}

.Accordion > * + * {
    border-top: 1px solid hsl(0, 0%, 82%);
}

.Accordion-trigger {
    background: none;
    border: 0;
    color: hsl(0, 0%, 13%);
    display: block;
    font-size: 1rem;
    font-weight: normal;
    margin: 0;
    padding: 1em 1.5em;
    position: relative;
    text-align: left;
    width: 100%;
}

.Accordion dt:first-child .Accordion-trigger {
    border-radius: .3em .3em 0 0;
}

.Accordion-trigger:focus,
.Accordion-trigger:hover {
    background: hsl(0, 0%, 93%);
}

.Accordion-icon {
    border: solid hsl(0, 0%, 62%);
    border-width: 0 2px 2px 0;
    height: .5rem;
    position: absolute;
    right: 1.5em;
    top: 50%;
    transform: translateY(-60%) rotate(45deg);
    width: .5rem;
}

.Accordion-trigger:focus .Accordion-icon,
.Accordion-trigger:hover .Accordion-icon {
    border-color: hsl(0, 0%, 13%);
}

.Accordion-trigger[aria-expanded="true"] .Accordion-icon {
    transform: translateY(-50%) rotate(-135deg);
}

.Accordion-panel {
    margin: 0;
    padding: 1em 1.5em;
}

fieldset {
    border: 0;
    margin: 0;
    padding: 0;
}

input {
    border: 1px solid hsl(0, 0%, 62%);
    border-radius: .3em;
    display: block;
    font-size: inherit;
    padding: .3em .5em;
}
```

I've broken the Javascript in sections to make sure I'm not inundating readers with bunches of terminology that I'm working on understanding myself.

For all the elements that have the class `Accordion` we create an array anf run the instructions below.

We set up constant holding information about the array, if allows toggle (has the attribute `data-allow-toggle`) and whether it allows multiple panels (has the attribute `data-allow-multiple`).

Then we create arrays for elements inside the accordion; the triggers (`Accordion-trigger` class) and the panel (`Accordion-panel` class).

```javascript
Array.from(document.querySelectorAll('.Accordion')).forEach(function (accordion) {

  // Allow for each toggle to both open and close individually
  const allowToggle = accordion.hasAttribute('data-allow-toggle');
  // Allow for multiple accordion sections to be expanded at the same time
  const allowMultiple = accordion.hasAttribute('data-allow-multiple');

  // Create the array of toggle elements for the accordion group
  const triggers = Array.from(accordion.querySelectorAll('.Accordion-trigger'));
  const panels = Array.from(accordion.querySelectorAll('.Accordion-panel'));
```

I've broken the `click` event into two sections to handle the case where we don't allow multiple panels and the two cases for `allowToggle` and `isExpanded`.

The idea for the first block is that, if we don't allow multiple panes to be open we want the open panes to close when we open a new one.

```javascript
  accordion.addEventListener('click', function (event) {
    const target = event.target;

    if (target.classList.contains('Accordion-trigger')) {
      const isExpanded = target.getAttribute('aria-expanded') == 'true';

      if (!allowMultiple) {
        triggers.forEach(function (trigger) {
          if (trigger.getAttribute('aria-expanded') == 'true') {
            document.getElementById(trigger.getAttribute('aria-controls'))
                    .setAttribute('hidden', '');
            trigger.setAttribute('aria-expanded', 'false');
          }
        });
      }
```

Then we test if we allow toggle events and whether the panel is expanded. If we allow both of these then we remove the `hidden` attribute and switch the value of the `aria-expanded` attribute to false.

If we don't allow toggle and the element is not expanded we remove the `hidden` attribute from the element with `aria-control` and set the `aria-expanded` attribute to true

```javascript
      if (allowToggle && isExpanded) {

        document.getElementById(target.getAttribute('aria-controls'))
                .setAttribute('hidden', '');
        target.setAttribute('aria-expanded', 'false');
      }
      else if (!allowToggle && !isExpanded) {
        document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');
        // Set the expanded state on the triggering element
        target.setAttribute('aria-expanded', 'true');
      }

      event.preventDefault();
    }
  });
```

The keyboard navigation for the accordion is more complicated as we have to consider where we are in the accordion or inside one of its children.

The keydown event listener intoruces control modifiers to keyboard events. `ctrlModifier` only returns true if its assigned keys **and** the control key (represented by `event.ctrlKey`) are pressed.

The accordion works with the following key codes:

- 33 = Page Up
- 34 = Page Down
- 38 = Up,
- 40 = Down
- 35 = End
- 36 = Home

If the element we're testing for has the class `Accordion-trigger` then we test which element are we over. If it's an element the key wwe pressed were the `up` or `down` key or the `control + PageUp` or `control + PageDown` combinations.

```javascript
  // Bind keyboard behaviors on the main accordion container
  accordion.addEventListener('keydown', function (event) {
    const target = event.target;
    const key = event.which.toString();
      const ctrlModifier = (event.ctrlKey && key.match(/33|34/));

    // Is this coming from an accordion header?
    if (target.classList.contains('Accordion-trigger')) {
      // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
      if (key.match(/38|40/) || ctrlModifier) {
        const index = triggers.indexOf(target);
        const direction = (key.match(/34|40/)) ? 1 : -1;
        const length = triggers.length;
        const newIndex = (index + length + direction) % length;

        triggers[newIndex].focus();

        event.preventDefault();
      }
```

If we match either `home` or `end` we move to the first or last panel respectively.

```javascript
      else if (key.match(/35|36/)) {
        // 35 = End, 36 = Home keyboard operations
        switch (key) {
          // Go to first accordion
          case '36':
            triggers[0].focus();
            break;
          // Go to last accordion
          case '35':
            triggers[triggers.length - 1].focus();
            break;
        }

        event.preventDefault();
      }
    }
```

If we use `control + PageUp` or `control + PageDown` then we want to make sure we do two things: prevent the default browser behavior and focus on the panel that we want to.

```javascript
    else if (ctrlModifier) {
      // Control + Page Up/ Page Down keyboard operations
      // Catches events that happen inside of panels
      panels.forEach(function (panel, index) {
        if (panel.contains(target)) {
          triggers[index].focus();

          event.preventDefault();
        }
      });
    }
  });
});
```

An accordion is useful but it's a lot of work to make it accessible. Still, it's a good example of how to build accessible components.
