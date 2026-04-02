---
name: rust-core
description: "Rust skill for ownership, borrowing, lifetimes, trait design, and idiomatic safe code. Trigger phrases: Rust, borrow checker, ownership, lifetime, trait, unsafe, cargo, crate, enum, pattern matching."
---

# Rust Core Skill

## Use When

- Writing or reviewing Rust code.
- Resolving borrow checker, lifetime, or ownership errors.
- Designing traits, enums, and public APIs.
- Checking idiomatic patterns and safety boundaries.

## Checklist

1. Ownership and borrowing
- Is ownership transferred only when necessary? Prefer references.
- Are borrows as short-lived as possible to avoid lifetime conflicts?
- Is `clone()` used only where necessary, not as a borrow checker escape hatch?

2. Lifetimes
- Are explicit lifetime annotations required, or can they be elided?
- Are struct lifetimes the minimum needed to satisfy the borrow checker?
- Are lifetime errors caused by a structural design issue rather than annotation?

3. Trait design
- Are traits focused on behavior, not data?
- Are `Display`, `Debug`, `From`, `Into`, `Default`, and `Error` implemented where appropriate?
- Are trait bounds on functions as loose as possible (prefer `impl Trait` over `dyn Trait` for owned values)?

4. Error handling
- Use `Result<T, E>` for recoverable errors; `panic!` only for unrecoverable states.
- Use the `?` operator for ergonomic propagation.
- Define domain-specific error types that implement `std::error::Error`.

5. Safety and unsafe
- Is `unsafe` justified and documented with a safety comment?
- Is the unsafe block as small as possible?
- Are invariants upheld across the unsafe boundary?

6. Idiomatic patterns
- Use iterators and combinators over manual loops where clarity allows.
- Use `match` exhaustively; avoid `_ =>` catch-all unless intentional.
- Prefer `Option`/`Result` over sentinel values or panics.

## Output Requirements

For each finding provide:
- Location
- Ownership, safety, or API risk
- Why it matters
- Minimal fix with code example

## Scope

This repository also contains a short `rust` umbrella skill (deprecated placeholder). Consolidated guidance should live in `rust-core`, `rust-debugging`, `rust-formatting`, and `rust-performance`.

Use this `rust-core` SKILL as the authoritative source for core Rust guidance; the `rust` placeholder has been removed.
