# japi-errors 🚀

[![npm version](https://img.shields.io/npm/v/japi-errors.svg)](https://www.npmjs.com/package/japi-errors)
[![bundle size](https://img.shields.io/bundlephobia/minzip/japi-errors)](https://bundlephobia.com/package/japi-errors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, robust, and tree-shakable error handling toolkit for **JSON:API** compliant applications. Bridge the gap between your application logic and your API responses with ease.

### ✨ Features

- **🪶 Ultra Lightweight**: ~2.5KB min+zipped.
- **📦 Zero Dependencies**: Pure TypeScript/JavaScript.
- **🌳 Tree-shakable**: Import only what you need (ESM support).
- **🛡️ Type-Safe**: Strict type inference for metadata and source.
- **🌐 RFC 9457**: Built-in support for Problem Details for HTTP APIs.
- **🔒 Secure by Default**: Automatic sanitization for 5xx errors.
- **🧩 JSON:API Compliant**: Generates structures following the [official specification](https://jsonapi.org/format/#error-objects).
- **🔗 Fluent Interface**: Build errors using chainable methods like `.withMeta()`, `.withSource()`, etc.
- **📚 Error Aggregation**: Collect multiple errors and throw them together using `ErrorCollector`.
- **🗺️ Powerful Mapping**: Map any error (Zod, Prisma, etc.) centrally via a type-safe mapper.

---

## 🚀 Quick Start

```bash
npm install japi-errors
# or
yarn add japi-errors
# or
bun add japi-errors
```

### Basic Usage

```typescript
import { NotFound, toJsonApiErrors } from 'japi-errors'

const error = NotFound({ detail: 'User not found' })

// Convert to JSON:API document
const document = toJsonApiErrors(error)

/* Output:
{
  "errors": [{
    "status": "404",
    "title": "Not Found",
    "detail": "User not found",
    "code": "NOT_FOUND"
  }]
}
*/
```

### RFC 9457 (Problem Details)

If you prefer the Problem Details standard (RFC 9457):

```typescript
const pd = error.toProblemDetails()

/* Output:
{
  "type": "about:blank",
  "title": "Not Found",
  "status": 404,
  "detail": "User not found",
  "code": "NOT_FOUND"
}
*/
```

---

## 🛠️ Key Concepts

### 1. Fluent / Chainable API

All `ApiError` instances support chainable methods for a better developer experience. Metadata and source are strictly typed.

```typescript
import { BadRequest } from 'japi-errors'

const error = BadRequest({ detail: 'Missing field' })
  .withSource({ pointer: '/data/attributes/email' })
  .withMeta({ validator: 'zod', attempts: 3 })
  .withId('unique-error-id')
  .withLinks({ about: 'https://docs.api.com/errors/400' })

// JSON:API Object
const obj = error.toJsonApiObject()
// obj.meta.validator is inferred as string!
```

### 2. Error Collection & Aggregation

Need to collect multiple errors during validation? Use `ErrorCollector`.

```typescript
import { ErrorCollector } from 'japi-errors'

const collector = new ErrorCollector()

// Add any error (it will be normalized to ApiError)
collector.add(new Error('Something went wrong'))
collector.add(BadRequest({ detail: 'Invalid value' }))

if (collector.hasErrors) {
  // If 1 error: throws that error
  // If >1 error: throws an AggregateError
  collector.throw()
}

// Or get a Result object
const result = collector.toResult(someValue)
if (!result.ok) {
  console.log(result.error.errors) // Access collected ApiErrors
}
```

### 3. Error Classification & Retry Logic

Helper utilities for operational logic:

```typescript
import { classify, isRetryable } from 'japi-errors'

try {
  await doSomething()
} catch (err) {
  if (isRetryable(err)) {
    // Retry logic (e.g. for 429, 502, 503, 504)
  }

  const identity = classify(err) // 'operational' | 'programmer'
}
```

### 4. Application Errors (Domain Logic)

Define your own errors in your domain layer without HTTP dependencies.

```typescript
import { AppError } from 'japi-errors'

export class UserNotFound extends AppError<'USER_NOT_FOUND', { id: string }> {
  readonly code = 'USER_NOT_FOUND'
}

// Usage in services
throw new UserNotFound('Not found', { id: '123' })
```

### 5. Error Mapping

Connect your application errors to HTTP responses centrally.

```typescript
import { createApiErrorMapper, defineErrorMap } from 'japi-errors'

const errorMap = defineErrorMap({
  USER_NOT_FOUND: {
    status: 404,
    title: 'User Missing',
    // Custom logic to build the final ApiError
    build: (err) => ({
      detail: err.message,
      meta: err.meta,
    }),
  },
})

const mapError = createApiErrorMapper(errorMap)

// In your controller
try {
  await service.getUser(id)
} catch (err) {
  const apiError = mapError(err)
  return res.status(apiError.status).json(apiError.toJsonApiDocument())
}
```

---

## 🌍 Integration Examples

### Zod Integration

The `unknownHandler` in `createApiErrorMapper` supports returning multiple errors.

```typescript
import { z } from 'zod'
import { ApiError, createApiErrorMapper, toJsonApiErrors } from 'japi-errors'

const mapError = createApiErrorMapper(
  {},
  {
    unknownHandler: (err) => {
      if (err instanceof z.ZodError) {
        return err.issues.map(
          (issue) =>
            new ApiError({
              status: 422,
              title: 'Validation Error',
              detail: issue.message,
              code: `ZOD_ERROR_${issue.code.toUpperCase()}`,
              source: { pointer: `/${issue.path.join('/')}` },
            }),
        )
      }
      return InternalServerError({ cause: err })
    },
  },
)

// Integration with toJsonApiErrors
try {
  schema.parse(data)
} catch (err) {
  const apiError = mapError(err)
  return res.status(422).json(toJsonApiErrors(apiError))
}
```

### Express / Next.js

```typescript
// Express
app.use((err, req, res, next) => {
  const apiError = mapError(err)
  const status = Array.isArray(apiError) ? apiError[0].status : apiError.status
  res.status(status).json(toJsonApiErrors(apiError))
})

// Next.js (App Router)
export async function GET() {
  try {
    // ...
  } catch (err) {
    const apiError = mapError(err)
    return Response.json(toJsonApiErrors(apiError), {
      status: Array.isArray(apiError) ? apiError[0].status : apiError.status,
    })
  }
}
```

---

## 📄 License

MIT © [Sebastian Sala](https://github.com/sebastiansala)
