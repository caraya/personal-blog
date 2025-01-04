---
title: Exploring HTMX
date: 2025-01-20
tags:
  - HTMX
  - HTML
  - Javascript
  - Hypertext
  - Markup
---

[HTMX](https://htmx.org/), or Hypertext Markup Extensions, is a JavaScript library that allows developers to build web applications using HTML instead of JavaScript. It was created by Carson Gross and was initially released on November 24, 2020. You can integrate HTMX into an HTML document by adding a script tag that links to the HTMX library.

HTMX extends HTML with custom attributes that allow developers to:

* Access AJAX, CSS Transitions, WebSockets, and Server-Sent Events directly in HTML
* Dynamically update web pages
* Insert server responses into specific parts of a web page without redrawing the entire page

HTMX uses HTML attributes to:

* Swap out parts of the user interface with a response from a server
* Define the HTTP method to be used when making a request to the server
* Specify the element on the page where the response from the server will be displayed
* Determine what user action will trigger the HTMX request

HTMX allows developers to:

* Avoid sending too much JavaScript to the browser
* Simplify the process of building web applications
* Write code that resembles ordinary HTML code and is easy to understand

## Working Example

This is a basic example of a Task List application created in HTMX and Javascript. The application allows users to add tasks, mark tasks as complete, and delete tasks.

Before we start, there's a caveat: **The application as currently written doesn't preserve the tasks when the page is reloaded**. To save the tasks between page loads, you would need to store them in a database or use local storage, Indexed DB or similar technologies.

Specific HTMX attributes used in this example:

* `hx-post`: Sends an HTTP POST request to the server at the specified URL
* `hx-on`: Defines the event that will trigger the HTMX request. In this case when the `AddTask` is submitted

```html
<form
  class="add-task-form"
  hx-post="#"
  hx-on="submit: addTask(event)">
  <input
    type="text"
    id="task-input"
    placeholder="Enter a new task..." required>
  <button type="submit">Add Task</button>
</form>

<div
  class="task-list"
  id="task-list">
  <!-- Tasks will be dynamically added here -->
</div>
```

The Javascript code is made of three functions:

* `addTask`: Adds a new task to the task list. It is triggered when the form is submitted
* `toggleComplete`: Toggles the `completed` class on a task element. It is triggered when the "Toggle Complete" button is clicked
* `deleteTask`: Deletes a task from the task list. It is triggered when the "Delete" button is clicked

The `addTask` function first prevents the default form submission behavior, and then gets the task input value, creates a new task element, and appends it to the task list.

The `toggleComplete` function toggles the `completed` class on the task element, changing its appearance.

The `deleteTask` function uses the `hx-delete` attribute to send a DELETE request to the server when the delete button is clicked. In this example, the server is the same page, and the task is removed from the DOM.

```js
// A variable to keep track of the task ID, incrementing for each new task
let taskId = 0;

// Add a task to the list
function addTask(event) {
  event.preventDefault();  // Prevent the form from submitting and refreshing the page

  // Get the task input element and its trimmed value
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();

  // If the input is empty, exit the function without adding a task
  if (taskText === "") return;

  // Get the task list element where tasks will be appended
  const taskList = document.getElementById("task-list");

  // Increment the task ID for the new task
  taskId++;

  // Create a new task element as a <div>
  const taskElement = document.createElement("div");
  taskElement.className = "task";  // Assign a class for styling purposes
  taskElement.id = `task-${taskId}`;  // Unique ID for each task using the task ID

  // Set the inner HTML of the task element, including task text and buttons
  taskElement.innerHTML = `
    <span>${taskText}</span>
    <!-- Task text displayed -->
    <div>
      <button
        hx-get="#"
        hx-on="click: toggleComplete('${taskId}')"> <!-- Button to toggle the completion state -->
          Toggle Complete
      </button>
      <button class="delete-btn"
        hx-delete="#"
        hx-on="click: deleteTask('${taskId}')"> <!-- Button to delete the task -->
          Delete
      </button>
    </div>
  `;

  // Add the new task element to the task list
  taskList.appendChild(taskElement);

  // Clear the input field after adding the task
  taskInput.value = "";
}

// Toggle the completion state of a task
function toggleComplete(taskId) {
  // Find the task element using its unique ID
  const taskElement = document.getElementById(`task-${taskId}`);
  // Toggle the "completed" class to change the appearance of the task
  taskElement.classList.toggle("completed");
}

// Delete a task
function deleteTask(taskId) {
  // Find the task element using its unique ID
  const taskElement = document.getElementById(`task-${taskId}`);
  // Remove the task element from the DOM
  taskElement.remove();
}
```

This example works with an in-memory task list, and the tasks are added, marked as complete, and deleted using HTMX attributes. In a more serious application, you would need to handle these actions on the server side and update the client-side view accordingly.

## Fetching External Data

This example uses an endpoint from [REST Countries](https://restcountries.com/) to fetch country data and display it on the page.

The `load-btn` button triggers an HTMX request to fetch data from the REST Countries API. The response is an array of country objects, which are then displayed on the page using a template. The instantiation will be done in Javascript.



```html
<button
  class="load-btn"
  hx-get="https://restcountries.com/v3.1/all"
  hx-target="#countries-list"
  hx-swap="innerHTML">
    Load Countries Data
</button>

<p>Click the button to fetch and display data about countries.
</p>

<div id="countries-list">
  <em>No countries loaded yet. Click the button above to fetch data.</em>
</div>
<template id="country-card-template">
  <div class="country-card">
    <h3>{{name}}</h3>
    <p><strong>Region:</strong> {{region}}</p>
    <p><strong>Population:</strong> {{population}}</p>
    <p><strong>Capital:</strong> {{capital}}</p>
    <img src="{{flag}}" alt="Flag of {{name}}">
  </div>
</template>
```

The Javascript adds an HTMX-specific event listener (`htmx:afterOnLoad`) to the document body. This event is triggered after an HTMX request has been completed. The event listener parses the response data, clears the previous results, and populates the `countries-list` element with the country data using the template.

The code checks if the response is empty and returns if there is no data to display. It then iterates over the country data, replacing placeholders in the template with the actual country data. The resulting HTML is appended to the `countries-list` element.

```js
document.body.addEventListener("htmx:afterOnLoad", (event) => {
  const responseData = event.detail.xhr.response;
  if (!responseData) return;

  const countries = JSON.parse(responseData);

  const countriesContainer = document.getElementById('countries-list');

  const template = document.getElementById('country-card-template').innerHTML;

  countriesContainer.innerHTML = "";

  countries.forEach(country => {
    const cardHtml = template
      .replace('{{name}}', country.name?.common || "N/A")
      .replace('{{region}}', country.region || "N/A")
      .replace('{{population}}', country.population.toLocaleString())
      .replace('{{capital}}', country.capital ? country.capital[0] : "N/A")
      .replace('{{flag}}', country.flags?.png || "");

    countriesContainer.innerHTML += cardHtml;
  });
});
```

One final detail that may be interesting is that we can use `from` in the `hx-trigger` attribute to target a different element than the one that triggered the event. For example, if we want to trigger an HTMX request when a user types in an input field, we can use the `from` attribute to specify the input field.

## Links and Resources

* [HTMX &mdash; high power tools for HTML](https://htmx.org/)
* [What is HTMX? Why it Matters? and How to use it.](https://dev.to/alexmercedcoder/what-is-htmx-why-it-matters-and-how-to-use-it-10h3)
