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
    const apiError = mapper(appError)

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
    const error = mapper(new UnknownError('msg'))
    expect(error.status).toBe(400)
    expect(error.title).toBe('Application error')
  })

  test('should handle completely unknown errors with 500', () => {
    const error = mapper(new Error('Boom'))
    expect(error.status).toBe(500)
    expect(error.code).toBe('INTERNAL_SERVER_ERROR')
    expect(error.expose).toBe(false)
  })

  test('should use custom unknownHandler if provided', () => {
    const customMapper = createApiErrorMapper(
      {},
      {
        unknownHandler: (err) =>
          new ApiError({
            status: 418,
            title: 'Teapot',
            detail: 'Indeed',
            code: 'TEAPOT',
          }),
      },
    )

    const error = customMapper(new Error('Whoops'))
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
    const apiErr = complexMapper(err)

    expect(apiErr.source?.pointer).toBe('/data/attributes/email')
  })
})
