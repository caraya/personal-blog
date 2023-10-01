---
title: "Creating a login system for web apps"
date: "2023-09-04"
---

I'm working on a starter application template to get me started when working on prototyping ideas.

One of the things that I'm most interested on is how to create a login system for Express-based apps.

Rather than crafting an authentication system from scratch, I chose to use [Passport.js](https://www.passportjs.org).

Passport offers multiple login strategies or systems without much code overhead. These strategies make it easier to create multiple authentication channels for your app.

For this post we'll explore the local authentication strategy. We don't want to add dependencies to the project, that would be done at a later implementation stage.

This post assumes you have a working Express application that you can add routes and components to. It also assumes that you've created a users table in your SQLlite database.

## Log In

I broke the log in process into the following steps:

1. Create the login route
2. Add the login route to the default entry point to the app
3. Create the log in form
4. Verify the password
5. Establish the session

I first create the basic route for the login route. I define the routes in its own `authorization.js` file that will be referenced in the the root `app.js` file.

```js
const express = require('express');

const router = express.Router();

router.get('/login', function(req, res, next) {
  res.render('login');
});

module.exports = router;
```

In `app.js` we import the routes and then use the imported routes using the [app.use](https://www.geeksforgeeks.org/express-js-app-use-function/) middleware handler function.

Yes, we want use both the login route to render the page and the authorization route to handle the login itself.

```js
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/', authRouter);
```

We now build the login form that we'll place in the login template we referenced in the `indexRouter` login.

```html
<h1>Sign in</h1>
<form action="/login/password" method="post">
    <section>
        <label for="username">Username</label>
        <input id="username" name="username" type="text" autocomplete="username" required autofocus>
    </section>
    <section>
        <label for="current-password">Password</label>
        <input id="current-password" name="password" type="password" autocomplete="current-password" required>
    </section>
    <button type="submit">Sign in</button>
</form>
```

### Verify Password

Now comes the first part that uses Passport.

To get started we install `passport` for the core Passport features and `passport-local` for the local login strategy.

Import the `sqlite3` and `mkdirp` packages. The `crypto` module is a builtin part of Node.

```bash
npm i -D sqlite2 \
mkdirp
```

Before we can work on the code for the app, we need to create the database, create a users table and insert an initial user.

```js
const crypto = require('node:crypto');
const sqlite3 = require('sqlite3');
const mkdirp = require('mkdirp');


mkdirp.sync('./var/db');

const db = new sqlite3.Database('./var/db/projects.db');

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id INTEGER PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");

  // create an initial user (username: alice, password: letmein)
  const salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'alice',
    crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
    salt
  ]);
});

module.exports = db;
```

Next, we install the Passport-related packages: `passport` for the core Passport functionality and `passport-local` for the local authentication strategy.

```js
npm install -D passport \
passport-local
```

We require the necessary packages:

- The `node:crypto` built-in packge
- `Passport`
- `Passport-local`
- The database we created

```js
const crypto = require('node:crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('../db');
```

The next block of code will do the actual matching of the password stored in the datbase against what the user entered in in the form.

If the match succeeds then the login was valid and the user is autheticated.

```js
passport.use(new LocalStrategy(function verify(username, password, cb) {
  db.get('SELECT * FROM users WHERE username = ?', [ username ], function(err, row) {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

    crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return cb(err); }
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      return cb(null, row);
    });
  });
}));
```

The `/login/password` route will validate the user when they submit the login form.

If the log in is successful it will redirect the user to the index page; if not then it will redirect the user to the login page for them to try again.

```js
router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));
```

### Establish Session

Right now we have a working log in form but it will produce errors because there is a piece missing. Passport authenticates against a session and we haven't built the session handler yet.

As usual, we first install the required packages: `express-session` to handle the Express side of session management and `connect-sqlite3` to create the session store in the database.

```bash
npm install -D express-session  \
connect-sqlite3
```

Next, we install the packages and configure the SQLiteStore with a session.

```js
const passport = require('passport');
const session = require('express-session');

const SQLiteStore = require('connect-sqlite3')(session);
```

In `app.js` we need to add a session middleware and initialize it with the SQLiteStore we created.

We then use the sessionto authenticate via Passport.

```js
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
}));
app.use(passport.authenticate('session'));
```

The last step to get a working log in system is to configure Passport to persist user information in the login session.

Add the following code to your `auth.js` router file.

```js
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});
```

We now have a full login system.

## Log Out

The log out functionality is fairly easy. We just need to create a post route in our `auth.js` router file and use Passport's logOut method to remove the log in credentials for the user.

According to Passport's [logOut](https://www.passportjs.org/concepts/authentication/logout/) documentation:

> Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).

```js
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});
```

## Sign up

Creating a signup form is optional since we may not want to allow users to register for the site (in that case it would be easier to create the accounts manually)

The first step is to create a route to get the signup template.

```js
router.get('/signup', function(req, res, next) {
  res.render('signup');
});
```

The form goes inside the correspnding template

```html
<h1>Sign up</h1>
<form action="/signup" method="post">
    <section>
        <label for="username">Username</label>
        <input id="username" name="username" type="text" autocomplete="username" required>
    </section>
    <section>
        <label for="new-password">Password</label>
        <input id="new-password" name="password" type="password" autocomplete="new-password" required>
    </section>
    <button type="submit">Sign up</button>
</form>
```

The final step in creating the signup flow is to create a post route in the `auth.js` route file to handle account creation.

This route will store salted password in the database using a [cryptographical salt](https://en.wikipedia.org/wiki/Salt_(cryptography)) of 16 random characters.

```js
router.post('/signup', function(req, res, next) {
  const salt = crypto.randomBytes(16);

  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    db.run('INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
      req.body.username,
      hashedPassword,
      salt
    ], function(err) {
      if (err) { return next(err); }
      var user = {
        id: this.lastID,
        username: req.body.username
      };
      req.login(user, function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    });
  });
});
```

Using the code we discussed in this post. We've created a basic authentication system in an Express.js backend.

A possible next step is to add one or more additional authentication providers like Google, Facebook or Github. I chose not to do it for this project since they require accounts and resources that tie the project to your account and identity.
