---
title: Building a Recipe Database
date: 2024-11-27
tags:
  - Express
  - Database
  - Development
---

In a previous post we looked at how to create a database in a Homebrew version of Postgresql.

This post will look at the database structure of a hypothetical license database web application as an example of building the schema and the database in Postgres 17 along with some necessary concepts when building the schema and table.

## Database Overview

* **recipe**
  * **id** unique primary key
  * **name** name of the recipe for example carrot cake
  * **description** short descriptive text about the recipe
  * **instructions** step by step on how to make it
  * **created_at** date when the recipe was inserted into the database
* **ingredient**
  * **id** unique primary key
  * **name** name of the ingredient for example butter
* **measure**
  * **id** unique primary key
  * **name** name of the measure for example cup

We want each recipe to have multiple ingredients in different measurements (like 2 coups of flour). To achieve this we need a table that reference items on the other tables.

* **recipe_ingredient**
  * **recipe_id** reference to a recipe
  * **ingredient_id** reference to an ingredient
  * **measure_id** reference to a measure
  * **amount** how much of the ingredient should be added

## SQL Data Types

These are the types of data values that we'll use with the database.

When creating databases there are times when specific types will perform best and others when saving storage space is essential. It's a trade off that you have to evaluate every time you build a database.

The text types we use are `integer`, an integer numeric value and `serial`, an auto increasing decimal value, used mostly for IDs.

| Type | Description | Storage Size | Range| Example |
| :---: | :---: | :---: | :---: | :---: |
| integer | A 4-byte integer type (default integer type). | 4 bytes | -2,147,483,648<br>to<br>2,147,483,647	-5000,| 0, 150000 |
| serial | An auto-incrementing 4-byte integer type, often used for primary keys.| 4 bytes | Same as integer. | Automatically increments by 1 |

For text fields, we use`varchar()` for text fields of text of nore more than the specified length (varchar(255) will be no longer than 255 characters), and `text`, an unlimited text field

| Type | Description | Storage Size | Length | Example |
| :---: | :---: | :---: | :---: | :---: |
| varchar(n) | A variable-length character type. It can store strings with a maximum length of n.	| 1 byte + actual length | 1 to 8,000 | 'Alice', 'Bob' |
| text | A variable-length character type with no specific length limit. | 1 + actual length (1 byte for length) | No limit | 'This is a long text string.' |

We use `timestamp` to capture date and time values. In this database we use it to capture the date the recipe was created.

| Type | Description | Storage Size | Range | Example |
| :---: | :---: | :---: | :---: | :---: |
| timestamp | Stores both date and time (without time zone). | 8 bytes | 4713 BC<br>to<br>5874897 AD | 2024-10-08 14:30:00 |


## SQL code

This is the SQL code that describes the database we want to create.

The first table is the main `recipe` table with the following elements:

| Name | Type | Notes |
| :---: | :---: | :---: |
| id | serial | primary key |
| name | varchar(250) | |
| description | varchar(250) | |
| instruction | text | The full text of the recipe|
| created_at | timestamp | Not null<br></br>defaults to current time |

```sql
create table recipe (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250),
  description VARCHAR(250),
  instructions text,
  created_at timestamp NOT NULL DEFAULT NOW());
```

The ingredient table has two elements. Each ingredient is unique, there can't be duplicate ingredients.

| Name | Type | Notes |
| :---: | :---: | :---: |
| id | serial | primary key |
| name | varchar(100) | unique |

```sql
create table ingredient (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE);
```

The `measure` table has two elements. Each ingredient is unique, there can't be duplicate neasurements.

| Name | Type | Notes |
| :---: | :---: | :---: |
| id | serial | primary key |
| name | varchar(100) | unique |

```sql
create table measure (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE);
```

The `recipe_ingredient` table uses A foreign key constraint to specify that the values in a column (or a group of columns) must match the values appearing in some row of another table.

We say this maintains the referential integrity between two related tables.

| Name | Type | Notes |
| :---: | :---: | :---: |
| recipe_id | int | not null |
| ingredient_id | int | not null |
| measure_id | int | not null |
| amount | int | |

The table also has a set of [foreign key constraints](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)

`ON DELETE CASCADE` is used to specify that when a row is deleted from the parent table, all rows in the child table that reference the deleted row should also be deleted. This is useful for maintaining the integrity of the database.

| Name | Type | Notes |
| :---: | :---: | :---: |
| fk_recipe | foreign key (recipe_id) References Recipe(id) | ON DELETE CASCADE |
| fk_ingredient | FOREIGN KEY(ingredient_id) REFERENCES Ingredient(id) | |
| fk_measure | foreign key (measure_id) references Measure(id) | |

```sql
create table recipe_ingredient (
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  measure_id INT,
  amount INT,

  CONSTRAINT fk_recipe FOREIGN KEY(recipe_id) REFERENCES Recipe(id) ON DELETE CASCADE,
  CONSTRAINT fk_ingredient FOREIGN KEY(ingredient_id) REFERENCES Ingredient(id),
  CONSTRAINT fk_measure FOREIGN KEY(measure_id) REFERENCES Measure(id));
```

This will create the necessary database. We can now play with front ends in different languages.

To run a basic test using Node.js we first create a database driver file:

```js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'recipes',
  password: 'password',
  port: 5432,
});

module.exports = {
  query: (text, params, callback) => pool.query(text, params, callback),
};
```

We then create a basic Express application to validate that the database works as intended.

```js
const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

app.get('/api', async (req, res) => {
  const queryResult = await db.query('select * from recipe');
  res.send(queryResult.rows);
});

app.listen(port || 2509, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
```
