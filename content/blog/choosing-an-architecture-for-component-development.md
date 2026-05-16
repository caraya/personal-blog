---
title: "Choosing an Architecture for Component Development"
date: 2026-07-10
tags:
  - Code
  - Design
  - Software Engineering
---

When we build interfaces or components, we must decide how to organize our code. Do we group files by type (e.g., all CSS in one folder, all JavaScript in another) or by feature (e.g., all files related to a specific component together), or do we bundle everything into a single module? This decision can impact the maintainability and scalability of our codebase.

As I've researched this topic, I've come across several resources that discuss different approaches to organizing code and related concepts.

This post explores how to build components by analyzing different approaches to code organization and the concepts of coupling, cohesion, and cognitive load, along with how they apply to component packaging.

## Presenting The Issue

How we organize our code can affect how we understand, maintain, and scale our applications. Different approaches can lead to varying levels of cognitive load, coupling, and cohesion, which in turn impact developer productivity and code quality.

Before looking at the approaches themselves, it helps to define the criteria we will use to compare them.

### Cognitive Load

> Cognitive load is how much a developer needs to think in order to complete a task.
>
> When reading code, you put things like values of variables, control flow logic and call sequences into your head. The average person can hold roughly four such chunks in working memory. Once the cognitive load reaches this threshold, it becomes much harder to understand things.
>
> Let's say we have been asked to make some fixes to a completely unfamiliar project. We were told that a really smart developer had contributed to it. Lots of cool architectures, fancy libraries and trendy technologies were used. In other words, the author had created a high cognitive load for us.
>
> Source: [Cognitive Load Is What Matters](https://github.com/zakirullin/cognitive-load#introduction)

**High cognitive load example:**

Imagine trying to understand what this does: you need to hold multiple concerns in mind at once.

```ts
const processData = (d, c, v, r, s, m) => {
  const a = d.map((x) => x * 2).filter((x) => x > 10);
  const b = a.reduce((acc, x) => acc + x, 0);
  const e = c.find((x) => x.id === v);
  if (!e || b > r) return { error: m };
  const p = s(b);
  return { data: p, cached: c.length > 0 };
};
```

Problems:

* Single-letter variable names require you to track what each holds
* Multiple responsibilities mixed together
* No clear intent or separation of concerns

**Low cognitive load example:**

```ts
// Immediately clear what each step does
const processUserScores = (scores, cachedCategories, categoryId, maxScore, scorer, errorMsg) => {
  const validScores = filterAndDoubleScores(scores);
  const totalScore = sumScores(validScores);
  const category = findCategory(cachedCategories, categoryId);

  if (!category || totalScore > maxScore) {
    return { error: errorMsg };
  }

  const processedScore = scorer(totalScore);
  return { data: processedScore, cached: hasCachedData(cachedCategories) };
};

const filterAndDoubleScores = (scores) => scores.map((s) => s * 2).filter((s) => s > 10);
const sumScores = (scores) => scores.reduce((sum, s) => sum + s, 0);
const findCategory = (categories, id) => categories.find((c) => c.id === id);
const hasCachedData = (categories) => categories.length > 0;
```

Benefits:

* Each function has one purpose
* Names clearly describe intent
* Easier to test and reuse
* Developers can understand a section without holding all details in memory

### Coupling And Cohesion

> Coupling refers to the degree of interdependence between software modules. High coupling means that modules are closely connected and changes in one module may affect other modules. Low coupling means that modules are independent, and changes in one module have little impact on other modules.
>
> ![Coupling](https://media.geeksforgeeks.org/wp-content/uploads/20240503155100/coupling-(1).webp)
>
> Cohesion refers to the degree to which elements within a module work together to fulfill a single, well-defined purpose. High cohesion means that elements are closely related and focused on a single purpose, while low cohesion means that elements are loosely related and serve multiple purposes.
>
> ![Cohesion](https://media.geeksforgeeks.org/wp-content/uploads/20240503155137/Cohesion-(1).webp)

**High coupling, low cohesion example:**

```ts
class UserService {
  constructor(private db: Database, private logger: Logger, private config: Config) {}

  async createUser(email: string, password: string) {
    this.logger.info("Creating user"); // Logging concern
    if (!email.includes("@")) {
      this.logger.error("Invalid email"); // Logging concern
      throw new Error("Invalid email");
    }
    const hash = require("bcrypt").hashSync(password); // Cryptography concern
    await this.db.query("INSERT INTO users..."); // Database concern
    await this.db.query("INSERT INTO audit_log..."); // Auditing concern
    this.config.setValue("last_user_created", email); // Config concern
    return { success: true };
  }
}
```

Problems:

* Changing logging, database, or crypto layer affects this class.
* Hard to test because it depends on real DB and config.
* Cannot reuse the validation or hashing logic elsewhere.

**Low coupling, high cohesion example:**

```ts
class UserService {
  constructor(
    private userRepository: UserRepository, // Abstraction, not concrete DB
    private passwordHasher: PasswordHasher,  // Abstraction, not bcrypt
  ) {}

  async createUser(email: string, password: string) {
    // Focused: only orchestrates user creation
    const hashedPassword = await this.passwordHasher.hash(password);
    return this.userRepository.create({ email, passwordHash: hashedPassword });
  }
}

// Email validation is a separate concern
const isValidEmail = (email: string): boolean => email.includes("@");

```

Now:

* UserService is independent of logging, config, and auditing
* Each piece is testable in isolation (mock the repository and hasher)
* Changes to DB or crypto don't break UserService
* Validation and hashing logic can be reused elsewhere

Notice in the second example:

* **Cohesion**: Each class has a single, well-defined purpose
* **Decoupling**: Dependencies are abstractions (interfaces), not concrete implementations
* **Result**: Easy to test, modify, and reuse

With those criteria in mind, we can now look at the organization strategies themselves.

### No Organization

The most basic approach is not to have any structure at all. All files are in a single directory, and there are no conventions for naming or grouping.

All files are in one place. This works best for small projects or prototypes, but will quickly become unmanageable.

Once a project grows past that stage, teams usually introduce structure by grouping code according to technical role. That is where horizontal layering usually enters the picture.

### Horizontal Layering

This is what we often see in traditional MVC (Model-View-Controller) or layered architectures. Code is organized into layers based on technical concerns (e.g., all database code in one directory, all components in their own directory, all utility code in another).

Files are grouped by types (all components together, all services together, etc.). This can lead to "dependency hell" where changes in one layer affect multiple other layers.

The diagram below shows a horizontal layering structure for a Vue3 project:

```text
src/
├── assets/      # Static assets (images, fonts, global CSS)
├── components/  # Reusable, shared components (buttons, cards)
├── composables/ # Reusable logic (Vue 3 Composition API)
├── layouts/     # Reusable page layouts (headers, footers)
├── router/      # Vue Router configuration
├── stores/      # Pinia or Vuex state management
├── views/       # Components representing specific routes/pages
├── App.vue      # Main application component
└── main.js      # Entry file (app initialization)
```

This is often the first meaningful improvement over no structure, but it still optimizes for technical categories more than for the way developers actually change features. The next step is to organize around slices of behavior instead of shared file types.

### Vertical Slice Architecture (VSA)

Instead of horizontal layers, this approach cuts "vertical slices" through the system for each feature.

Everything required for a feature (API endpoint, handler, data model, validation) lives in the same folder or file.

This helps when teams ship feature work frequently and want code discovery and changes to stay localized.

```text
src/
├── features/
│   └── users/
│       ├── create-user/         # Vertical Slice
│       │   ├── create-user.controller.ts
│       │   ├── create-user.use-case.ts
│       │   ├── create-user.dto.ts
│       │   ├── create-user.validator.ts
│       │   └── create-user.spec.ts
│       └── get-user-by-id/      # Another Slice
│           ├── get-user.controller.ts
│           └── get-user.use-case.ts
├── domain/                      # Shared Entities (optional)
├── infrastructure/              # DB setup, external adapters
└── shared/                      # Common utilities/middleware
```

This helps when high cohesion, easy navigation, and low coupling between features are priorities.

If you keep pushing that idea further, you can make the slice even smaller. Instead of grouping everything for a feature together, you can group everything for a single request or endpoint together.

### REPR Pattern (Request-Endpoint-Response)

A highly granular version of Vertical Slices often used in API development.

Each API endpoint is its own class, handling its own request, response, and logic, removing the need for a central "Controller" layer.

This helps when endpoint behavior needs to be isolated, independently testable, and easy to change without side effects.

Example of a single REPR endpoint:

```ts
// features/auth/register-user.ts
export class RegisterUserEndpoint {
  constructor(private db: Database, private emailService: EmailService, private passwordHasher: PasswordHasher) {}

  async handle(request: { email: string; password: string }): Promise<{ status: number; body: { id: string } }> {
    // Validate
    if (!request.email.includes("@")) return {
      status: 400,
      body: {
        error: "Invalid email"
      }
    };

    // Check if exists
    const existing = await this.db.users.findByEmail(request.email);
    if (existing) return {
      status: 409,
      body: {
        error: "Email already registered"
      }
    };

    // Hash password
    const hash = await this.passwordHasher.hash(request.password);

    // Create user
    const user = await this.db.users.create({ email: request.email, passwordHash: hash });

    // Send confirmation
    await this.emailService.sendConfirmation(request.email);

    return { status: 201, body: { id: user.id } };
  }
}

// Each endpoint is self-contained; no dispatcher or central router needed.
// Add a new endpoint? Create a new REPR class. Modify one? Only that class changes.
```

REPR is useful when the unit of change is extremely small, especially in backend or API-heavy systems. On the frontend, though, teams often need a broader structure that still centers features while separating UI, state, and integration concerns.

### Feature-Sliced Design (FSD)

FSD is a specialized frontend architecture, particularly popular in React/Next.js, that organizes code into layers based on abstraction levels, then by features.

Structure follows Project -> Layer -> Slice -> Segment (e.g., features/auth/loginForm.tsx).

This helps when frontend teams need clear boundaries between UI, state, API integration, and local utilities inside each feature.

```text
src/
├── features/         # Layer
│   └── add-to-cart/  # Slice
│     ├── ui/         # Segment: React/Vue components
│     ├── model/      # Segment: Business logic, state (Redux/Zustand), types
│     ├── api/        # Segment: Fetching/API requests
│     ├── lib/        # Segment: Slice-specific helpers
│     └── index.tsx   # Public API (entry point for the slice)
```

<lite-youtube videoid="8n_uPCQS0lM"></lite-youtube>

FSD keeps the focus on features, but it is still primarily a frontend-oriented way to structure work. If the goal shifts from frontend features to business domains that span multiple use cases, the next model broadens the organizing principle again.

### Domain-Driven Design (DDD) / Modular Monolith

Organizing code around business domains rather than technical concerns. It's the same idea of vertical slices but applied differently.

Folders are named after business entities (e.g., /users, /billing, /catalog).

This helps when business capabilities are complex and you want architecture to mirror domain language and ownership.

```text
src/
├── core/                   # Shared types, UI kit, and infrastructure
└── modules/ (or domains/)
  ├── auth/               # Bounded Context: Authentication
  │   ├── domain/         # User entity, login rules
  │   ├── application/    # useLogin hook, auth services
  │   ├── infrastructure/ # API clients for auth
  │   └── ui/             # LoginForm, AuthPage components
  └── products/           # Bounded Context: Product Catalog
      ├── domain/         # Product model, price calculations
      ├── application/    # useProductList hook
      ├── infrastructure/ # Fetching product data
      └── ui/             # ProductList, ProductCard
```

DDD moves the center of gravity from UI features to business capabilities. From there, the next question is not just how to group code, but how to control dependency direction so that business rules remain insulated from frameworks and infrastructure.

### Hexagonal / Onion / Clean Architecture

While often considered a strict form of layering, these are alternatives to naive vertical layering. They focus on domain-centric design.

In this design system, the core business logic is at the center, surrounded by layers for application services, infrastructure, and UI. Infrastructure depends on the domain, not vice versa.

This helps when preserving core business rules from framework and infrastructure churn is more important than optimizing for delivery speed in a single layer.

```text
src/
├── domain/                       # Core business rules (entities, value objects)
│   ├── entities/
│   │   └── user.ts
│   ├── value-objects/
│   │   └── email.ts
│   ├── repositories/
│   │   └── user-repository.ts    # Port (interface)
│   └── services/
│       └── password-policy.ts
├── application/                  # Use cases and orchestration
│   ├── use-cases/
│   │   ├── register-user.ts
│   │   └── login-user.ts
│   └── dto/
│       └── user-response.ts
├── infrastructure/               # Adapters for external systems
│   ├── persistence/
│   │   └── postgres-user-repository.ts
│   ├── crypto/
│   │   └── bcrypt-hasher.ts
│   └── http/
│       └── auth-api-client.ts
└── presentation/                 # Framework/UI layer
    ├── controllers/
    │   └── auth-controller.ts
    ├── routes/
    │   └── auth-routes.ts
    └── ui/
        └── login-form.tsx
```

Dependency rule: outer layers can depend on inner layers, but inner layers never depend on outer layers.

To make this practical, think in terms of *source code imports*:

* `presentation` can import from `application` and `domain`
* `infrastructure` can import from `application` and `domain`
* `application` can import from `domain`
* `domain` imports nothing from outer layers

That means `domain` never knows about frameworks, databases, HTTP clients, or UI. It only knows business rules.

Example flow using the structure above:

1. `presentation/controllers/auth-controller.ts` receives an HTTP request and calls `application/use-cases/register-user.ts`.
2. `register-user.ts` depends on the `UserRepository` interface from `domain/repositories/user-repository.ts`.
3. `infrastructure/persistence/postgres-user-repository.ts` implements that interface.
4. Wiring (composition root) connects the concrete Postgres repository to the use case.

Minimal code example:

```ts
// domain/repositories/user-repository.ts
export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>;
  save(user: { id: string; email: string; passwordHash: string }): Promise<void>;
}
```

What this shows: this file is a **port** (an interface contract) in the domain layer. It defines *what* the business needs (`existsByEmail`, `save`) without saying *how* data is stored.

```ts
// application/use-cases/register-user.ts
import type { UserRepository } from "../../domain/repositories/user-repository";

export class RegisterUser {
  constructor(private readonly users: UserRepository) {}

  async execute(input: { email: string; passwordHash: string }) {
    const alreadyExists = await this.users.existsByEmail(input.email);
    if (alreadyExists) throw new Error("Email already registered");

    await this.users.save({
      id: crypto.randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
    });
  }
}
```

What this shows: the use case depends on the domain contract, not on a concrete database. This keeps application logic focused on rules and flow (check existing user, then save) and makes it easy to test by mocking `UserRepository`.

```ts
// infrastructure/persistence/postgres-user-repository.ts
import type { UserRepository } from "../../domain/repositories/user-repository";

export class PostgresUserRepository implements UserRepository {
  async existsByEmail(email: string): Promise<boolean> {
    // SQL query here
    return false;
  }

  async save(user: { id: string; email: string; passwordHash: string }): Promise<void> {
    // SQL insert here
  }
}
```

What this shows: infrastructure is an adapter that implements the domain contract using a specific technology (Postgres). If you switch to another storage engine, you replace this adapter, not the use case.

```ts
// presentation/controllers/auth-controller.ts
import { RegisterUser } from "../../application/use-cases/register-user";
import { PostgresUserRepository } from "../../infrastructure/persistence/postgres-user-repository";

const registerUser = new RegisterUser(new PostgresUserRepository());

export async function registerController(req: { body: { email: string; passwordHash: string } }) {
  await registerUser.execute(req.body);
  return { status: 201 };
}
```

What this shows: presentation handles transport concerns (HTTP request/response) and delegates business behavior to the application layer. The controller does not contain business rules; it just maps input/output.

Notice the direction: business logic (`domain` + `application`) is stable and reusable, while infrastructure and UI can change with minimal impact.

## Conclusion

There is no single "best" way to organize components. The right structure depends on what you are optimizing for in your project right now.

If your goal is speed on a small codebase, a simple structure may be enough. As the system grows, the cost of understanding and changing code grows too, and that is where cognitive load, coupling, and cohesion become useful decision criteria.

Across the models in this post, the direction is clear:

* Horizontal layers improve basic order but can spread feature changes across many folders.
* Vertical slices and REPR localize behavior and make change safer.
* FSD adds clearer frontend boundaries for UI, model, and API concerns.
* DDD aligns code with business language and domain ownership.
* Clean Architecture emphasizes dependency direction to protect core business rules.

In practice, architecture is not a one-time choice. Teams often start simple, then evolve toward stronger boundaries as complexity increases. The key is to pick the smallest structure that reduces cognitive load today while leaving room to grow tomorrow.
