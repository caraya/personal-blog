---
title: Understanding PGlite
date: 2025-09-24
tags:
  - PGlite
  - PostgreSQL
  - Offline First
youtube: true
---

I've always loved the idea of running a database directly in the browser. Until I heard about [PGLite](https://pglite.dev/), I thought it was just a dream and that the only way to use PostgreSQL was to set up a server in the same box I was running the client code. But PGlite has changed that, allowing you to run a lightweight version of PostgreSQL entirely in the browser or in a JavaScript environment like Node.js.

In this post we'll explore what PGlite is, when it's a good choice (and when it's not) and how to sync it with an external PostgreSQL database.

## What is PGlite

PGlite is a lightweight version of PostgreSQL that runs entirely in a web browser or a JavaScript environment like Node.js. It uses WebAssembly (WASM) to run a single-user version of Postgres without needing to install a separate database server. This makes it incredibly useful for certain scenarios, but it's not a one-to-one replacement for a traditional PostgreSQL server.

## When is PGlite a Good Choice?

PGlite is an excellent choice for:

* **Local-First Applications**: For apps that need to work offline, PGlite can store and manage data directly in the user's browser using [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for persistence.
* **Rapid Prototyping and Demos**: You can build and showcase applications without the need for a backend database setup, making it great for proofs-of-concept.
* **Testing**: It allows for fast and isolated unit tests, as you can spin up a fresh, in-memory database for each test file, avoiding conflicts.
* **Edge and Serverless Functions**: Its small footprint makes it suitable for running in environments where you can't install a full database server.
* **On-device AI and RAG**: With support for extensions like pgvector, it can be used for local [retrieval-augmented generation (RAG)](https://aws.amazon.com/what-is/retrieval-augmented-generation/) and other AI tasks directly in the browser.

## When Should You Stick with Traditional PostgreSQL?

You should stick with a traditional PostgreSQL server when:

* **When You Need High Concurrency**: PGlite only supports a single connection at a time, making it unsuitable for applications with multiple simultaneous users or processes.
* **You Have A Large-Scale Production Database**: You need a standard PostgreSQL for large, mission-critical databases that require high availability, scalability, and robust performance.
* **Complex Features and Extensions**: PGlite doesn't have access to the full range of extensions available for PostgreSQL.
* **Network-Level Features**: Features like replication and clustering are not supported.

**PGlite vs. Traditional PostgreSQL at a Glance**

| Feature | PGlite | Traditional PostgreSQL |
|---|---|------------------------|
| Architecture | In-browser/in-process (WASM) | Client-Server |
| Setup | No installation needed | Server installation required |
| Concurrency | Single connection | Multiple connections |
| Persistence | In-memory or IndexedDB | Filesystem |
| Best For | Local-first apps, testing, demos | Production applications, large databases |
| Performance | Slower than native | High performance |

## Syncing PGlite with an External PostgreSQL Database

Since PGlite doesn't have a built-in replication feature, you need to build a data transfer process in your application.

The most robust method is to use an API layer as a middleman.

This approach is ideal for "offline-first" applications where you need to sync changes efficiently without transferring the entire database each time.

* **Pulling Changes from External Postgres to Local PGlite**: This keeps your local PGlite database up-to-date with the main server.
 	* **Add Timestamps**: Ensure your tables in the main PostgreSQL database have an `updated_at` column that automatically updates whenever a row is changed.
 	* **Create an API Endpoint**: Build an endpoint, like `GET /api/records/since/{last_sync_timestamp}`, on your server. This endpoint queries the main database for all records where updated_at is newer than the `last_sync_timestamp` provided by the client.
 	* **Client-Side Logic**: Your application periodically calls this endpoint with the timestamp of its last successful sync. It then takes the returned records and `INSERTs` or `UPDATEs` them into the local PGlite database using an "upsert" operation `(INSERT ... ON CONFLICT ... DO UPDATE)`.

* **Pushing Changes from Local PGlite to External PostgreSQL**: This sends the user's local changes back to the main server.
  * **Track Local Changes**: In your PGlite database, you need a way to know which records have been created or modified. You can do this by adding a "dirty" flag (e.g., is_synced = false) to your tables or by logging all changes in a separate "outbox" table.
  * **Create another API Endpoint**: Build a `POST /api/records` endpoint on your server. This endpoint receives a batch of changed records from the client.
  * **Server-Side Logic**: The server processes the batch of changes. It validates the data and performs the necessary `INSERT` or `UPDATE` operations on the main PostgreSQL database. This is a critical place to handle any potential conflict resolution (e.g., if the same record was changed on the server while the client was offline).
  * **Confirm Sync**: After the API successfully processes the changes, it sends a success response back to the client. The client can then mark the local records as synced (e.g., set `is_synced = true` or clear the outbox table).

## Alternative Sync Method: Full Dump and Restore

This method is simpler but much less efficient. It's best suited for initializing the local database for the first time or for very infrequent, manual updates, not for continuous syncing.

* **Postgres to PGlite**: Use the `pg_dump` command-line tool to export your entire remote database (or specific tables) into a `.sql` file. Transfer this file to your application, and then execute the script within PGlite to populate it.
* **PGlite to Postgres**: PGlite has a built-in `dump()` function that works similarly to `pg_dump`. You can use it to export the local data, send the resulting SQL text to your server, and use a tool like `psql` to import it into the remote database. Warning: This approach typically involves wiping the remote tables before importing, which can be destructive.

In summary, while a full dump is easy for one-off tasks, the API-mediated approach is the standard, scalable solution for building applications that require regular syncing between pglite and a central PostgreSQL server.

For a great overview of pglite and its use in modern web applications, check out this video.

<lite-youtube videoid="i9xSBCKUqV8"></lite-youtube>
