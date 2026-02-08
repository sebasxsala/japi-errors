# japi-errors 🚀

[![npm version](https://img.shields.io/npm/v/japi-errors.svg)](https://www.npmjs.com/package/japi-errors)
[![bundle size](https://img.shields.io/bundlephobia/minzip/japi-errors)](https://bundlephobia.com/package/japi-errors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, robust, and tree-shakable error handling toolkit for **JSON:API** compliant applications. Bridge the gap between your application logic and your API responses with ease.

### ✨ Features

- **🪶 Ultra Lightweight**: ~2KB min+zipped.
- **📦 Zero Dependencies**: Pure TypeScript/JavaScript.
- **🌳 Tree-shakable**: Import only what you need (ESM support).
- **🛡️ Type-Safe**: Built with TypeScript for excellent IDE support and JSDoc tooltips.
- **🔒 Secure by Default**: Automatic sanitization for 5xx errors (hidden from clients).
- **🧩 JSON:API Compliant**: Generates structures following the [official specification](https://jsonapi.org/format/#error-objects).

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
import { NotFound, formatJsonApiErrors } from 'japi-errors'

const error = NotFound({ detail: 'User not found' })

// Convert to JSON:API document
const document = formatJsonApiErrors(error)

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

### Direct Instantiation (Custom Errors)

If you need complete control or a custom status code not in the defaults, import `ApiError` directly:

```typescript
import { ApiError } from 'japi-errors'

const error = new ApiError({
  status: 418,
  title: "I'm a teapot",
  detail: 'Custom brewing error',
  code: 'TEAPOT_ERROR',
  meta: { temperature: 100 },
})
```

### Extending ApiError

You can also create your own specialized error classes by extending `ApiError`:

```typescript
import { ApiError } from 'japi-errors'

class PaymentRequiredError extends ApiError {
  constructor(detail: string) {
    super({
      status: 402,
      title: 'Payment Required',
      detail,
      code: 'PAYMENT_REQUIRED_CUSTOM',
    })
  }
}
```

---

## 🛠️ Key Concepts

### 1. Unified HTTP Errors

Import any standard HTTP error directly. All are fully typed and tree-shakable.

```typescript
import { BadRequest, Forbidden, Conflict, InternalServerError } from 'japi-errors'

// 400s are exposed by default
throw BadRequest({ detail: 'Invalid email format' })

// 500s are sanitized (hidden) by default
throw InternalServerError()
```

### 2. Application Errors (Domain Logic)

Define your own errors in your domain/application layer without dragging HTTP dependencies everywhere.

```typescript
import { AppError } from 'japi-errors'

export class UserNotFound extends AppError<'USER_NOT_FOUND'> {
  readonly code = 'USER_NOT_FOUND'
}

// Usage in services
throw new UserNotFound('The requested user does not exist')
```

### 3. Error Mapping

Connect your application errors to HTTP responses in one central place.

```typescript
import { createApiErrorMapper, defineErrorMap } from 'japi-errors'

const errorMap = defineErrorMap({
  USER_NOT_FOUND: {
    status: 404,
    title: 'User Missing',
  },
})

const mapError = createApiErrorMapper(errorMap)

// In your controller/handler
try {
  // do something...
} catch (err) {
  const apiError = mapError(err)
  return res.status(apiError.status).json(apiError.toJsonApi())
}
```

---

## 🌍 Integration Examples

### Express Middleware

```typescript
import { createApiErrorMapper } from 'japi-errors'

// Setup your mapper
const mapError = createApiErrorMapper(myErrorMap)

app.use((err, req, res, next) => {
  const apiError = mapError(err)

  res.status(apiError.status).json(apiError.toJsonApi())
})
```

### Next.js (App Router) Error Handling

```typescript
// app/api/[...route]/route.ts
import { InternalServerError } from 'japi-errors'

export async function GET() {
  try {
    // ...
  } catch (err) {
    const apiError = InternalServerError({ cause: err })
    return Response.json(apiError.toJsonApi(), {
      status: apiError.status,
    })
  }
}
```

---

## 📄 License

MIT © [Sebastian Sala](https://github.com/sebastiansala)
