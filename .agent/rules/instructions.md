---
trigger: always_on
---

# japi-errors - AI Agent Rules

## Project Context

Lightweight (~2.5KB) zero-dependency TypeScript library for standardizing errors to JSON:API format in Node.js.

## Core Principles

- **Zero dependencies**: Never suggest installing packages
- **Lightweight**: Keep bundle ~2.5KB
- **TypeScript-first**: Strict typing required
- **JSON:API compliant**: Follow https://jsonapi.org/format/#errors

## Code Style

### TypeScript

- Strict mode always
- `interface` over `type` for objects
- Export types users might need
- `readonly` for immutable props
- `unknown` over `any`

### Error Architecture

- `AppError` → Business logic (app layer)
- `ApiError` → HTTP transport (presentation layer)
- `ErrorMapper` → Conversion layer
- **Sanitize stack traces** in production (5xx errors)

### Naming

- Classes: `PascalCase`
- Interfaces: `PascalCase` (add `I` prefix if needed)
- Functions: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Files: `kebab-case`

## JSON:API Error Format

```typescript
{
  errors: [{
    id?: string;
    status: string;        // HTTP code as string
    code?: string;         // App-specific
    title: string;         // Human-readable
    detail?: string;
    source?: {
      pointer?: string;    // JSON Pointer
      parameter?: string;
      header?: string;
    };
    meta?: Record<string, unknown>;
  }]
}
```

## Testing

- Test new features + edge cases
- Aim for >90% coverage
- Descriptive names: `it('should sanitize stack trace for 500 errors')`
- Run before committing:

```bash
npm run lint:fix && npm run format:check && npm test && npm run build
```

## What to AVOID

❌ Dependencies (even tiny ones)
❌ Breaking changes without discussion  
❌ Complex abstractions
❌ Exposing stack traces/internal paths
❌ `console.log` (use proper debug tools)
❌ Mutations (prefer immutability)

## What to PREFER

✅ Pure functions
✅ Immutable data
✅ Explicit over clever
✅ Early returns
✅ Descriptive names

## Security

- Never expose sensitive data in errors
- Sanitize stack traces in production
- Generic messages for 5xx errors
- Validate user input in `detail` fields

## Before Suggesting Changes

1. Aligns with zero-deps philosophy?
2. Bundle size impact? (run `npm run build`)
3. Tests included?
4. Types updated?
5. Backwards compatible?

## Performance

- Simple string methods > regex
- Avoid unnecessary object creation
- Cache repeated computations
- Readability > micro-optimizations

## Commit Format

```
feat: add custom error serializer
fix: sanitize stack traces in production
docs: update migration guide
test: add edge cases for ErrorMapper
```

## Key Question

Does this make the library **simpler, faster, or more reliable**?  
When in doubt → choose simplicity.
