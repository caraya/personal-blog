---
title: Building An Express App - Creating A Database In Express
date: 2024-11-25
tags:
  - Express
  - Database
  - Development
---

One of the aspects I seldom consider when building demos and applications is how to build the database that will power the CRUD application.

For this post we'll use Postgresql 17 installed via Homebrew. Just like with Node, we append the version specifying it using `@` and the version that we want to install. This is important because the Homebrew default version is not the latest.

```bash
brew install postgresql@17
```

When starting the database we have two options. We can start it manually every time we want to use it with this command:

The `LC_ALL` variable control collation settings for the database.

You specify the location of the database cluster using the `-D` option.

```bash
LC_ALL="C" /usr/local/opt/postgresql@17/bin/postgres \
	-D /usr/local/var/postgresql@17
```

If you'd like to start the database on system startup use [Homebrew services](https://github.com/Homebrew/homebrew-services) command.

```bash
brew services start postgresql@17
```

Once you start the database using either method, we need to log in to the database using the [psql](https://www.postgresql.org/docs/current/app-psql.html) command to connect to the `postgres` database.

```bash
psql postgres
```

Once we login with the default superuser account, we need to create a new account to ensure security. We don't want a superuser account for everyday use.

Instead of user or account we use [create role](https://www.postgresql.org/docs/current/sql-createrole.html) with a login password expressed as a string in single quotation marks.

```psql
CREATE ROLE me WITH LOGIN PASSWORD 'password';
```

Then we use [alter role](https://www.postgresql.org/docs/current/sql-alterrole.html) statement to enable our new account to create databases and tables.

```psql
ALTER ROLE me CREATEDB;
```

We then quit Postgresql.

```psql
\q
```

Connecting table to Postgresql with another account is slightly different. We specify the database with the `-d` parameter and the user with `-U`.

```bash
psql -d postgres -U me
```

Once we are logged in as `me`, we create the database.

```psql
CREATE DATABASE api;
```

Next step, we connect to the database we just created

```psql
\c api
```

We can then build the database structure by creating tables with the appropriate structure using the [create table](https://www.postgresql.org/docs/current/sql-createtable.html) statement.

```psql
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name VARCHAR(30),
  email VARCHAR(30)
);
```

We can insert data into the tables using the [insert](https://www.postgresql.org/docs/current/sql-insert.html) statement.

```psql
INSERT INTO users (name, email)
  VALUES ('Jerry', 'jerry@example.com'), ('George', 'george@example.com');
```

We can check if the results match our expectations using the [select](https://www.postgresql.org/docs/current/sql-select.html) statement. In this case we retrieve all rows from the users table.

```psql
SELECT * FROM users;
```

The post just glosses over table related commands and tasks. That's on purpose. A future post will address this in more detail when discussing a proposed application using Express and Postgresql together.
