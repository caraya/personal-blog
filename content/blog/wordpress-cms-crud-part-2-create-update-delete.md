---
title: "WordPress CMS CRUD (Part 2): Create, Update, Delete"
date: "2020-05-27"
---

So far we've [installed JWT in our WordPress instance](https://publishing-project.rivendellweb.net/adding-jwt-to-wordpress/) and created a basic infrastructure for the app.

This post will take care of the rest of the CRUD system, we'll create/save a post, update it and delete it.

All the functions we'll discuss in this post require the user to be authenticated and will not work if there is no authentication token stored in a cookie on the user's machine. A later iteration of this code may do better error handling.

## Create

Creating a new post means, essentially, saving the content of a form into the database.

The code completes the following functions:

1. Gets a reference to the cookie storing the JWT authentication cookie
2. Writes a POST HTTP request to insert the data into the database and create the post
3. Does any cleanup necessary after the post was created. Some of those things may include
    
    - Clearing the editor
    - Notifying the user of the successful post creation
4. Catch any errors that are not related to the promise code in the catch statement

```js
export function save(post) {
  const token = Cookies.get(state.token); // 1
  // Save post
  axios({
    method: "post",
    url: state.restUrl + "wp/v2/posts",
    data: post,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  }) // 2
    .then(response => {
      // do something
  }) // 3
    .catch(error => {
      console.error(error);
    }); // 4
}
```

## Update

The update function is an almost exact copy of the save() function discussed in the previous section.

The HTTP method we use is different, rather than POST, we use PUT to update the content.

The request is made to a specific post indicated by ID rather than the general posts endpoint.

```js
export function update(post) {
  const token = Cookies.get(state.token); // 1
  axios({
    method: "put",
    url: state.restUrl + "wp/v2/posts/" + post.id,
    data: post,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    }
  }) // 2
    .then(response => {
      // Do something after the update
  }) // 3
    .catch(error => {
      console.error(error);
    }); // 4
}
```

## Delete

The delete function is the most delicate operation to perform. Once the data is gone it's impossible to recover it from WordPress unless you have backups.

The function will:

Create and display a prompt to confirm you want to delete the post

Get a reference to the cookie holding our JWT credentials

If we confirmed the removal, the function will create a delete request for the specified post

The `then()` portion of the promise handles any cleanup or post-deletion activities we need to do like showing the updated list of posts.

As usual, the `catch()` block will handle any errors that happen in our code.

```js
export function deletePost(post) {
  const confirm = window.confirm(`Delete Post: "${post.title.rendered}"`); // 1
  const token = Cookies.get(state.token); // 2

  // If user confirms delete then proceed
  if (true === confirm) {
    axios({
      method: "delete",
      url: state.restUrl + "wp/v2/posts/" + post.id,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    }) // 3
      .then(response => {
        // Display the list of posts
        // without the post we deleted
      })
      .catch(error => {
        console.error(error);
      }); // 4
  }
}
```

And that's it. We now have a very basic CRUD application that will talk to a WordPress installation with JWT support enabled.

The code can certainly be enhanced, either by incorporating it into a framework that will make it easier to create individual components or by using a templating engine like Handlebars or Nunjucks.

There are other items related to WordPress and its REST API that we'll discuss in the next post.
