---
title: "WordPress CMS CRUD (part 1): Getting Started"
date: "2020-05-25"
---

The whole idea of the WordPress REST API is to allow developers to use whatever tools they choose to create front-ends for WordPress systems. We're no longer limited to PHP and the Gutenberg editor and the possibilities are endless.

This post will cover authentication using JWT, listing pages of posts, viewing individual posts, and the basic CRUD operations: create, update, and delete. We covered setting up JWT authentication in WordPress in [Adding JWT to WordPress](https://publishing-project.rivendellweb.net/adding-jwt-to-wordpress/)

We will write this using ES Modules, so we'll have to build a quick WebPack build system to convert it into something that works in browsers.

## The build system

Because we will be working with modules we need to write a quick WebPack build script that will use Babel to convert this into something that browsers will read without having to inline scripts with `type=module`.

```js
const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, arg) => {
  config = {
    entry: ["./src/index.js"],
    output: {
      filename: "bundle.min.js",
      path: path.resolve(__dirname, "dist")
    },
    devServer: {
      port: 3000,
      https: true,
      contentBase: path.join(__dirname, "dist")
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-modules"],
            }
          }
        }
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    }
  };
  if (arg.mode === "development") {
    config.devtool = "source-map";
  }
  return config;
};
```

We then install the Node modules that we'll need for WebPack to run.

The only module I'll mention is [@babel/preset-modules](https://github.com/babel/preset-modules/blob/master/README.md). It is an improvement over preset-env in that it fixes additional problems that would cause bundled code to be larger than necessary.

```bash
npm i -D @babel/cli \
@babel/core \
@babel/preset-modules \
babel-loader \
terser-webpack-plugin \
webpack webpack-cli \
webpack-dev-server
```

We will also install the packages that we'll use directly in the code we write.

```bash
npm i axios \
form-urlencoded \
js-cookie
```

[axios](https://www.npmjs.com/package/axios) is the package that we'll use to handle fetching data from the server.

[form-urlencoded](https://www.npmjs.com/package/form-urlencoded) will serialize the data we send to the server

[js-cookie](https://github.com/js-cookie/js-cookie#readme) provides a programmatic way to set and read cookies. We'll store the JSON Web Token in a cookie that we'll read in different parts of the code.

## Create Initial State

We will create a sate constant where we'll set initial values for our authentication, and data storage for the values we get from the API.

We also create a function to add elements to the state. This is a very simplified version of what a state management library would do and, if we use React or Vue it would be unnecessary.

```js
// Set state object with values that are changed programatically
const state = {
  loggedIn: false,
  restUrl: "http://localhost:8888/wordpress/wp-json/",
  token: "wp-token",
};

const setState = (toSet, newValue) => {
  state[toSet] = newValue;
};

export { state, setState };
```

## Authenticate

To authenticate we first import all the packages that we'll use: Axios, js-cookie, and form-urlencoded. We also import our state script.

```js
// Import libraries
import axios from "axios";
import Cookies from "js-cookie";
import formurlencoded from "form-urlencoded";

// Import configs
import { state, setState } from "../state";
```

We then check if the cookie with our JWT token exists, meaning that the user is authenticated.

If it does then we initiate the login process and display the log out button.

If we're not logged in then we display the login form and initiate the logout process.

```js
export function init() {
  if (Cookies.get(state.token) === undefined) {
    logout();
    initLogin();
  } else {
    login();
    initLogout();
  }
}
```

The code makes the following assumptions:

- We have a login form where the user will enter his username and password
- On successful login, the form will be replaced with a logout button

The code proceeds as follows:

1. Capture the username and password values from the form
2. Use Axios to make a POST request to the JWT token endpoint with the urlencoded credentials as the payload data
3. If we get back a 200 response code, and only then, we set a cookie with the token as the value
4. We call the `init()` function
5. If we do not receive a 200 code there was a problem and we tell the user that we couldn't log her in
6. If there was an error with the promise, the `catch()` block is called and we tell the user what the error was

```js
export function initLogin() {
  getEl(loginForm).addEventListener("submit", event =>
    event.preventDefault();
    const creds = {
      username: document.getElementById(username).value,
      password: document.getElementById(password).value
    }; // 1

    // Make request to authenticate
    axios({
      method: "post",
      url: state.restUrl + "jwt-auth/v1/token",
      data: formurlencoded(creds),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }) // 2
      .then(response => {
        if (200 === response.status) {
          Cookies.set(state.token, response.data.token, {
            expires: 1,
            secure: true
          }); // 3
          init(); // 4
        } else {
          // Executed when response code is not 200
          alert("Login failed, please check credentials and try again!");
        }
      }) // 5
      .catch(error => {
        // Also log the actual error
        console.error(error);
      }); // 6
  });
}
```

The `login()` function does housekeeping. It removes the login form, it shows the listing of posts and does any other task that you need to do once the user is logged in.

```js
export function login() {
  // Set the loggedIn status to true
  setState("loggedIn", true);

  // Remove login form and replace it
  // with log out button

  // Show the listing of posts

  // Do whatever else you need to
}
```

The `initLogout()` function handles the logout functionality.

It is conceptually simpler than `initLogin()`. It removes the token cookie and it calls the `logout()` function.

```js
export function initLogout() {
  // Setup event listeners for logout form
  getEl(logoutForm).addEventListener("click", event => {
    event.preventDefault();
    Cookies.remove(state.token, { secure: true });

    logout();
  });
}
```

The `logout()` function, like its login counterpart, does the housekeeping we need to do to make sure this works.

We set the loggedIn state to false so that the workflow will prompt for a login.

We swap the logout button for the login form and we show the posts available when the user is not logged in.

```js
export function logout() {
  // Set the loggedIn statis to false
  setState("loggedIn", false);

  // Remove logout button and adds login form

  // Show unauthenticated posts listing
}
```

## Read Content

To display the content of our WordPress blog we need to do two things: display a list of all posts, like what you'd see in a default WordPress home page, and display individual posts.

We'll tackle these tasks separately.

### Post Listing

To get a listing of the first posts on the database, 10 by default, we run code similar to the init function below.

We use Axios to make a GET request to the `posts` API endpoint. We save the posts data to our state object and call the render function.

```js
export function init(event) {
  // If coming from an event,
  // prevent default behavior
  if (event) event.preventDefault();

  // Make API request with Axios
  axios
    .get(state.restUrl + "wp/v2/posts", {
      params: {
        per_page: 10
      }
    })
    .then(({ data: posts }) => {
      setState("posts", posts);
      render();
    });
}
```

The `render()` function is what creates the content that will create the content we display to the users. It is cumbersome and, for a production application, I would consider using Handlebars or some kind of templating solution but in this case I'm more concerned with the authentication and how it works.

For each post that we get from the database via ou state object we do the following:

1. We create an article element
2. We add the `post` class to the article we just created
3. We then create the content using the article's [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) attribute with a [Template Literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
    
    - The template literal interpolates values from the posts we store in our state object
4. We add an event listener to the post title to link to the post and then call the `post()` function

```js
export function render() {
  // Map through the posts
  state.posts.map(post => {
    // Setup the post article element
    const article = createEl("article"); // 1
    article.classList.add("post"); // 2
    article.innerHTML = `
      <h2 class="entry-title">
        <a href="#${post.slug}">
          ${post.title.rendered}
        </a>
      </h2>
      <div class="entry-content">
        ${post.excerpt.rendered}
      </div>
    `; // 3

  article.querySelector(".entry-title a")
    .addEventListener("click", event => {
      event.preventDefault();
      setState("post", post);
      Post();
  }); // 4
```

### Single Post

The single post render function does as the title says, it renders the content of a single post on the screen and, if the user is logged in, displays links to edit and delete the current post.

The function does the following:

1. Create the article and a
2. Attach the post CSS class to it.
3. Add the content using innerHTML.
    
    - The content includes a link to go back to the post listing; we'll attach an event to the link later
    - We also use the rendered versions of the title and the content for the post
4. We attach a click event to the back link so that clicking on the link will display a list of the available posts
5. If the user is logged in, provide links to edit and delete the post

```js
export function render(event) {
  // Setup the post article element
  const article = createEl("article"); // 1
  article.classList.add("post"); // 2
  article.innerHTML = `
    <p><a id="${backBtn}" href="#">
    &lt; Back to Posts</a></p>
    <h1 class="entry-title">
      ${state.post.title.rendered}
    </h1>
    <div class="entry-content">
      ${state.post.content.rendered}
    </div>
  `; // 3

  // Attach event listeners to back button
  article.querySelector(`#${backBtn}`).addEventListener("click", event => {
    event.preventDefault();
    setState("post", null);
    Posts();
  }); .// 4

  // If logged in, display edit link
  if (state.loggedIn) {
    article.append(editLink(state.post));
    article.append(deleteLink(state.post));
  } // 5

  // Clear the posts from the page

  // Add the single post to the page
}
```

The last two functions of this section, `editLink()` and `deleteLink()` wor similarly so we'll describe them together.

They will create a link element and add the respective class (edit and delete) and content text.

They will add a click event handler that will call the appropriate function, `loadPost()` for `editLink()` and `deletePost()` for `deleteLink()`.

```js
export function editLink(post) {
  // Setup the edit link
  const link = document.createElement("a");
  link.href = "#edit-post";
  link.classList.add("edit");
  link.innerText = "Edit";

  link.addEventListener("click", () => {
    setState("editorPost", post.id);
    loadPost();
  });

  // Return the link element
  return link;
}

export function deleteLink(post) {
  // Setup the delete link
  const link = document.createElement("a");
  link.href = "#delete-post";
  link.classList.add("delete-post");
  link.innerText = "Delete";

  link.addEventListener("click", event => {
    event.preventDefault();
    deletePost(post);
  });

  // Return the delete link
  return link;
}
```

With the code so far we have the basic authentication structure and a way listing of posts and individual posts.

We'll explore more details in the next post.
