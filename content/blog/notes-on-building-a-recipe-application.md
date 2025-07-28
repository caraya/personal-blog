---
title: Notes On Building A Recipe Application
date: 2025-09-03
tags:
  - Web
  - Client-Server
  - Architecture
  - Design
---

As a way to learn React and exercise Typescript, I started building a recipe database application using PostgreSQL as the database, Express as the API server, and Vite/React as the client.

This post will cover notes, observtions, design decisions and challenges I've faced while building the application.

## Why these tools?

Before we start with specifics, let's talk about the tools I've chosen for this project:

[PostgreSQL](https://www.postgresql.org/) is powerful, open-source, and has great support for JSON data types, which is useful for storing recipe data.

I chose to use [Prisma](https://www.prisma.io/) as the [Object Relational Mapping](https://www.freecodecamp.org/news/what-is-an-orm-the-meaning-of-object-relational-mapping-database-tools/) (ORM) because it provides a type-safe way to interact with the database, making it easier to work with Typescript.

I chose to use Typescript for the entire stack to ensure type safety and to keep myself honest about the code I write.

Typescript requires you to make your assumptions explicit, you have to model your data in interfaces and the IDE will catch errors while writing code and at compile time which will help you avoid runtime errors.

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building APIs.

Since [Create React App was deprecated](https://react.dev/blog/2025/02/14/sunsetting-create-react-app), they now recommend using [Vite](https://vite.dev/), Parcel or RSBuild to build React applications

I finally decided to learn React for client-side development because it is widely used, has a large ecosystem, and was designed to build user interfaces.

While I prefer Vue.js for its simplicity and ease of use, I wanted to learn React because that's what most companies use and it is a good skill to have in my toolbox. It will also help me understand frameworks like [Next.js](https://nextjs.org/) and [Remix](https://remix.run/).

## Database

Designing and modeling a database schema is way more complex than I expected. What I thought would be a simple schema turned into something more complex.

I had to consider relationships between different entities, data normalization, and how to efficiently query the data later on.

The block below shows the first attempt an an example of a recipe for the application:

```js
{
  "title": "Classic Pancakes",
  "description": "Fluffy and delicious pancakes made from scratch. A perfect weekend breakfast.",
  "instructions": "1. In a large bowl, sift together the flour, baking powder, salt, and sugar.\n2. Make a well in the center and pour in the milk, egg, and melted butter; mix until smooth.\n3. Heat a lightly oiled griddle or frying pan over medium-high heat.\n4. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.",
  "ingredients": [
    "1.5 cups All-Purpose Flour",
    "2 tsp Baking Powder",
    "0.5 tsp Salt",
    "2 tbsp White Sugar",
    "1.25 cups Milk",
    "1 large Egg",
    "3 tbsp Melted Butter"
  ]
}
```

The `instructions` field is a single string with all instructions, and the `ingredients` field is an array of strings that contains all the ingredients in a single line, which is not ideal for querying and take additional work to display properly in the UI later on.

That's where [database normalization](https://en.wikipedia.org/wiki/Database_normalization) comes into play.

The original ingredients structure is a denormalized structure. While simple, it has several major drawbacks:

No Place for Quantities
: There was no way to store the quantity or unit (e.g., "2 cups," "1 tsp") for each ingredient in a structured way. You'd have to cram it into the string itself, which is messy.

Data Redundancy
: If 50 recipes used "Salt," the word "Salt" would be stored 50 times in the database.

Inconsistent Data
: One recipe might list "flour," another "All-Purpose Flour," and a third a typo like "flor." To the database, these are three completely different ingredients.

Difficult to Query
: It's very hard to ask questions like, "Which recipes use Salt?" or "Show me all the unique ingredients in my database."

To fix these issues, we normalize the data by breaking it into three distinct, related tables for each core concept (Recipe, Ingredient) and a third table to link them together.

Ingredient Table
: A new Ingredient model was created to store a unique list of all possible ingredients.
: The name field is marked as @unique, so "Salt" can only exist once in this table. This eliminates redundancy and ensures data consistency. It becomes the single source of truth for ingredient names.

Recipe Table
: The ingredients array was removed from the Recipe model. The recipe table is now only concerned with recipe-specific information like the title and instructions.

RecipeIngredient (The Join Table)
: This is the most important part of the normalization. A new RecipeIngredient model was created to act as a bridge between recipes and ingredients.
: Each row in this table connects one specific recipe to one specific ingredient.
: Crucially, this is where we now store the information that describes that relationship: the quantity and unit.

For the "Classic Pancakes" recipe, the database creates these linked records:

* One row in the Recipe table for "Classic Pancakes"
* One row in the Ingredient table for "All-Purpose Flour"
* One row in the RecipeIngredient table that says:
 	* recipeId: (ID of "Classic Pancakes")
 	* ingredientId: (ID of "All-Purpose Flour")
 	* quantity: 1.5
 	* unit: "cups"

This normalized structure solves all the initial problems, giving you a scalable, efficient, and reliable database design.

The normalized version of the recipe looks like this:

```js
  {
    title: 'Classic Pancakes',
    description: 'Fluffy and delicious pancakes made from scratch. A perfect weekend breakfast.',
    instructions: '1. In a large bowl, sift together the flour, baking powder, salt, and sugar.\n2. Make a well in the center and pour in the milk, egg, and melted butter; mix until smooth.\n3. Heat a lightly oiled griddle or frying pan over medium-high heat.\n4. Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake. Brown on both sides and serve hot.',
    ingredients: [
      { name: 'All-Purpose Flour', quantity: 1.5, unit: 'cups' },
      { name: 'Baking Powder', quantity: 2, unit: 'tsp' },
      { name: 'Salt', quantity: 0.5, unit: 'tsp' },
      { name: 'White Sugar', quantity: 2, unit: 'tbsp' },
      { name: 'Milk', quantity: 1.25, unit: 'cups' },
      { name: 'Egg', quantity: 1, unit: 'large' },
      { name: 'Melted Butter', quantity: 3, unit: 'tbsp' },
    ],
  },
```

The normalized ingredients structure is now an array of objects, where each object contains the name, quantity, and unit of each ingredient and they will be stored in the database as two separate tables: one for the ingredient name and another for the relationship between the recipe and the ingredient, including the quantity and unit.

---

Deciding to use an ORM like Prisma adds another tool to manage, another layer of complexity and a rather steep learning curve. You have to decide if an ORM is the right choice for your project.

---

Always create a seed script to populate the database with initial data. This will help in testing and development since we'll have data to work with right away.

## Server

Using Express presents some interesting challenges for me, mostly around middleware and routing.

---

This may sound obvious but I had to figure it out the hard way: always use the CORS middleware to allow requests from the cient to the server.

Make sure that you install the `CORS` package and add it to your express app:

```js
import cors from 'cors';

const app = express();

// Middleware setup
// use cors for all route
app.use(cors());
```

If you don't do this the client's request will fail with a CORS error and you'll spend hours trying to figure out why the request is not working.

Eventhough both the client and server are running on `localhost`, the browser treats them as different origins, thus restricting cross-origin requests.

---

You have the choice to use a single index file for all routes or to create separate files for each set of routes. I prefer to use multiple files for better organization and maintainability.

```js
import express, { Response } from 'express';
import recipesRoute from './routes/recipes.js';

// Initialize the express application
const app = express();

// load the recipes route
app.use('/api/recipes', recipesRoute);
```

When we mount the route using the [use](https://expressjs.com/en/4x/api.html#app.use) method, we associate a path (`/api/recipes`) with the `recipesRoute` router. This means that any request to `/api/recipes` will be handled by the `recipesRoute` router.

Whenever we need to make changes to the recipes route, we do so in the `recipesRoute` file, keeping our code organized and modular.

This will also keep the index file clean and focused on the overall application setup, while each route file can handle its own logic and middleware.


## Client

Styling a React application can be done in many way, but I prefer to use CSS modules for component specific styles.

While [Tailwind](https://tailwindcss.com/) sounds like an interesting option, I find that it adds a lot of complexity to the project since you have to learn a large set of Tailwind utility classes and how to configure the project to use them.

I've switched to [Open Props](https://open-props.style/) and plain CSS since it better matches how I'm used to writing styles and it allows me to use CSS variables for theming and reusability.

---

This is counter intuitive to me. The react router package is `react-router-dom` and not `react-router`. The `react-router` package is for server-side rendering and not for client-side applications.

```jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Layout component wraps all pages to provide a consistent header/footer */}
        <Route path="/" element={<Layout />}>

          {/* The "index" route is the homepage, which shows the list of recipes */}
          <Route index element={<RecipeList />} />

          {/* This route handles the page for creating a new recipe */}
          <Route path="recipe/new" element={<NewRecipe />} />

          {/* This dynamic route handles displaying a single recipe by its ID */}
          <Route path="recipe/:id" element={<RecipeDetail />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

Routing is done using nested routes. The `BrowserRouter` component wraps the entire application, and the `Routes` component contains all the routes represented by individual `Route` components.

The `Route` component contains a `path` prop that defines the URL path for the route and an `element` prop that specifies the component to render when the route matches.

The `recipe/:id` matches any URL that starts with `/recipe/` followed by an ID, allowing us to display a specific recipe based on its ID.

---

While Vite gives you a good starting point for building a React application, you still need to add directories for hooks, services, and other application-specific logic.

---

When you're working with Typescript, you have to model the data you expect to receive from the server in interfaces. This will help you catch errors at compile time and ensure that your code is type-safe.

```ts
// --- Data Models ---
// Define the structure of the incoming data from the API
interface IngredientDetails {
  id: string;
  name: string;
}

interface RecipeIngredient {
  quantity: number;
  unit: string;
  ingredient: IngredientDetails;
}

// This interface defines the structure for a single ingredient in the form state
interface IngredientInput {
  name: string;
  quantity: string;
  unit: string;
}
```

You can then use these interfaces to type elements in your components, ensuring that you have the correct types for the data you're working with. To me, this is another example of how Typescript keeps you honest.
