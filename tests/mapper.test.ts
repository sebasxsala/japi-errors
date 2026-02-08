import { expect, test, describe } from 'bun:test'
import { AppError } from '../src/core/app-error'
import { createApiErrorMapper } from '../src/core/mapper'
import { ApiError } from '../src/core/api-error'

describe('createApiErrorMapper', () => {
  class UserNotFound extends AppError<'USER_NOT_FOUND'> {
    readonly code = 'USER_NOT_FOUND'
  }

  const mapper = createApiErrorMapper({
    USER_NOT_FOUND: {
      status: 404,
      title: 'User not found',
    },
  })

  test('should map an AppError to an ApiError based on code', () => {
    const appError = new UserNotFound('The user does not exist')
    const result = mapper(appError)
    const apiError = Array.isArray(result) ? result[0]! : result

    expect(apiError instanceof ApiError).toBe(true)
    expect(apiError.status).toBe(404)
    expect(apiError.title).toBe('User not found')
    expect(apiError.detail).toBe('The user does not exist')
    expect(apiError.code).toBe('USER_NOT_FOUND')
  })

  test('should use default mapping for unknown AppErrors', () => {
    class UnknownError extends AppError<'UNKNOWN'> {
      readonly code = 'UNKNOWN'
    }
    const result = mapper(new UnknownError('msg'))
    const error = Array.isArray(result) ? result[0]! : result
    expect(error.status).toBe(400)
    expect(error.title).toBe('Application error')
  })

  test('should handle completely unknown errors with 500', () => {
    const result = mapper(new Error('Boom'))
    const error = Array.isArray(result) ? result[0]! : result
    expect(error.status).toBe(500)
    expect(error.code).toBe('INTERNAL_SERVER_ERROR')
    expect(error.expose).toBe(false)
  })

  test('should use custom unknownHandler if provided', () => {
    const customMapper = createApiErrorMapper(
      {},
      {
        unknownHandler: (_err) =>
          new ApiError({
            status: 418,
            title: 'Teapot',
            detail: 'Indeed',
            code: 'TEAPOT',
          }),
      },
    )

    const result = customMapper(new Error('Whoops'))
    const error = Array.isArray(result) ? result[0]! : result
    expect(error.status).toBe(418)
  })

  test('should use mapping.build for complex errors', () => {
    class ValidationError extends AppError<'VAL_ERR', { field: string }> {
      readonly code = 'VAL_ERR'
    }

    const complexMapper = createApiErrorMapper({
      VAL_ERR: {
        status: 422,
        title: 'Validation Failed',
        build: (err: ValidationError) => ({
          source: { pointer: `/data/attributes/${err.meta?.field}` },
        }),
      },
    })

    const err = new ValidationError('Bad email', { field: 'email' })
    const result = complexMapper(err)
    const apiErr = Array.isArray(result) ? result[0]! : result

    expect(apiErr.source?.pointer).toBe('/data/attributes/email')
  })

  test('should support returning multiple errors from unknownHandler', () => {
    const multiMapper = createApiErrorMapper(
      {},
      {
        unknownHandler: (err: any) => {
          if (err.isZod) {
            return [
              new ApiError({ status: 422, title: 'Err 1', detail: 'd1', code: 'E1' }),
              new ApiError({ status: 422, title: 'Err 2', detail: 'd2', code: 'E2' }),
            ]
          }
          return new ApiError({ status: 500, title: 'Err', detail: 'd', code: 'E' })
        },
      },
    )

    const result = multiMapper({ isZod: true })
    expect(Array.isArray(result)).toBe(true)
    if (Array.isArray(result)) {
      expect(result.length).toBe(2)
      expect(result[0].code).toBe('E1')
      expect(result[1].code).toBe('E2')
    }
  })
})
