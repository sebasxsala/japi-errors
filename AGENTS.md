# AGENTS.md

This file provides guidance for coding agents working in this repository.

## Project Snapshot

- Project name: `jsonapi-errors`
- Runtime/tooling: Bun
- Language: TypeScript (ESNext modules)
- Primary domain: structured application/API error types for JSON:API style responses
- Package type: ESM (`"type": "module"`)

## Repository Layout

- `index.ts` - current entry point
- `src/core/` - core error abstractions and mappings
  - `app-error.ts`
  - `api-error.ts`
  - `mapper.ts`
- `src/http/` - HTTP-focused helpers
  - `http-errors.ts`
  - `type-guards.ts` (currently empty)
- `src/types.ts` - shared types (currently empty)
- Config:
  - `package.json`
  - `tsconfig.json`
  - `.oxlintrc.json`
  - `.oxfmtrc.json`
  - `.vscode/settings.json`

## Install / Setup

- Install dependencies:
  - `bun install`

- Recommended editor behavior (already configured in VS Code):
  - OXC formatter as default
  - format on save enabled

## Build / Lint / Test Commands

This repo currently has formatter and linter scripts, but no explicit build/test scripts.

### Formatting

- Format all files:
  - `bun run format`
- Check formatting only:
  - `bun run format:check`

Formatting is controlled by `.oxfmtrc.json`:

- no semicolons (`"semi": false`)
- single quotes (`"singleQuote": true`)
- consistent quoting for object keys (`"quoteProps": "consistent"`)

### Linting

- Run linter:
  - `bun run lint`
- Auto-fix lint issues:
  - `bun run lint:fix`

Lint config is intentionally minimal in `.oxlintrc.json` (few enforced custom rules).

### Type Checking (No dedicated script yet)

Because this is TypeScript with `noEmit: true`, use:

- `bunx tsc --noEmit`

If you add a script in `package.json`, prefer:

- `"typecheck": "tsc --noEmit"`

### Build

- No dedicated build pipeline currently configured.
- Treat this as source-first TypeScript library code unless a build tool is introduced.

### Tests

There are currently no test files in the repository. Bun test runner is available.

- Run all tests:
  - `bun test`
- Run a single test file:
  - `bun test path/to/file.test.ts`
- Run tests matching file name pattern:
  - `bun test error`
  - (matches test files whose path/name includes `error`)
- Run a single test by test name pattern:
  - `bun test -t "returns jsonapi payload"`
- Combine single file + single test case:
  - `bun test src/core/api-error.test.ts -t "toJsonApi"`
- Coverage:
  - `bun test --coverage`

Agent guidance:

- Prefer targeted test runs first (`bun test <file>` or `-t`) before full suite.
- If no tests exist for changed code, consider adding minimal focused tests.

## TypeScript Configuration Expectations

`tsconfig.json` highlights:

- `strict: true` (required)
- `noUncheckedIndexedAccess: true` (important safety signal)
- `moduleResolution: "bundler"`
- `allowImportingTsExtensions: true`
- `verbatimModuleSyntax: true`
- `noEmit: true`

Implications:

- Maintain strict typing; do not introduce `any` unless unavoidable and documented.
- Preserve ESM import/export style.
- Keep types explicit when inference harms readability or safety.

## Code Style Guidelines

### Imports and Exports

- Prefer `import type` for type-only imports.
- Keep imports minimal and local to module needs.
- Use named exports over default exports.
- Preserve existing relative import style.
- Follow existing pattern of exporting at bottom when already used in file.

### Formatting

- Do not add semicolons.
- Use single quotes.
- Keep object/array literals readable with trailing commas where formatter applies.
- Let `oxfmt` decide final spacing/wrapping.

### Types

- Prefer precise types and generics over `any`.
- Use `unknown` for external/untrusted values, then narrow.
- Use `readonly` properties for immutable class state where appropriate.
- Keep public type contracts small and explicit (`type` aliases are common here).

### Naming Conventions

- Files: kebab-case (`api-error.ts`, `http-errors.ts`)
- Classes/types/interfaces: PascalCase (`ApiError`, `AppError`, `Mapping`)
- Variables/functions/methods: camelCase
- Error factory objects may use PascalCase namespace-like constants (`HttpErrors`).
- Error codes should be stable strings; avoid ad hoc changes once published.

### Error Handling and Domain Patterns

When implementing custom errors, follow existing patterns:

- Extend `Error` for custom classes.
- Call `Object.setPrototypeOf(this, new.target.prototype)` in constructor.
- Preserve operational vs programmer error distinction (`isOperational` flag).
- Keep machine-readable fields explicit:
  - `status`, `title`, `detail`, `code`, optional `source`, `meta`, `id`
- Prefer safe defaults:
  - `isOperational: true`
  - `expose: true` only when suitable for client-facing details
- Preserve optional `cause` and headers metadata if applicable.
- Ensure JSON:API serialization shape remains stable (`{ errors: [...] }`).

### JSON:API Response Shape

For API-facing errors, maintain compatibility with this structure:

- Top level object with `errors` array
- Each error object generally includes:
  - `status` (string in payload)
  - `title`
  - `detail`
  - `code`
- Optional fields included conditionally:
  - `id`, `source`, `meta`

Do not add fields casually; treat shape changes as contract changes.

## Agent Workflow Expectations

- Before editing: read related modules fully.
- After editing:
  1. `bun run format`
  2. `bun run lint`
  3. `bunx tsc --noEmit`
  4. `bun test` (or targeted test command)
- Prefer small, focused changes over broad refactors.
- Avoid introducing new dependencies unless justified.

## Cursor / Copilot Rule Status

Checked and not found at time of writing:

- `.cursor/rules/` (not present)
- `.cursorrules` (not present)
- `.github/copilot-instructions.md` (not present)

If these files are added later, update this document to incorporate them.

## Notes for Future Contributors

- `src/types.ts` and `src/http/type-guards.ts` are currently empty; align new additions with strict typing and existing naming.
- If adding scripts (build/test/typecheck), update this AGENTS file immediately.
- If introducing tests, prefer colocated or clearly named `*.test.ts` files and document single-test invocation examples.
