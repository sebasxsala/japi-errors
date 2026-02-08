import { expect, test, describe } from 'bun:test'
import { ApiError } from '../src/core/api-error'

describe('ApiError', () => {
  test('should create an ApiError with basic options', () => {
    const error = new ApiError({
      status: 400,
      title: 'Bad Request',
      detail: 'Invalid input',
      code: 'BAD_REQUEST',
    })

    expect(error.status).toBe(400)
    expect(error.title).toBe('Bad Request')
    expect(error.detail).toBe('Invalid input')
    expect(error.code).toBe('BAD_REQUEST')
    expect(error.isOperational).toBe(true)
    expect(error.expose).toBe(true)
  })

  test('should expose: false for 500 errors by default', () => {
    const error = new ApiError({
      status: 500,
      title: 'Internal Error',
      detail: 'Something went wrong',
      code: 'INTERNAL_ERROR',
    })

    expect(error.expose).toBe(false)
  })

  test('should allow overriding expose and isOperational', () => {
    const error = new ApiError({
      status: 400,
      title: 'Bad Request',
      detail: 'Invalid input',
      code: 'BAD_REQUEST',
      expose: false,
      isOperational: false,
    })

    expect(error.expose).toBe(false)
    expect(error.isOperational).toBe(false)
  })

  test('should store meta and source', () => {
    const meta = { userId: 123 }
    const source = { pointer: '/data/attributes/name' }
    const error = new ApiError({
      status: 422,
      title: 'Validation Error',
      detail: 'Invalid name',
      code: 'VALIDATION_ERROR',
      meta,
      source,
    })

    expect(error.meta).toEqual(meta)
    expect(error.source).toEqual(source)
  })

  test('toJsonApi should return JSON:API compliant structure', () => {
    const error = new ApiError({
      status: 400,
      title: 'Bad Request',
      detail: 'Invalid input',
      code: 'BAD_REQUEST',
      id: 'error-id',
      meta: { foo: 'bar' },
      source: { parameter: 'query' },
    })

    const json = error.toJsonApi()

    expect(json).toEqual({
      errors: [
        {
          status: '400',
          title: 'Bad Request',
          detail: 'Invalid input',
          code: 'BAD_REQUEST',
          id: 'error-id',
          meta: { foo: 'bar' },
          source: { parameter: 'query' },
        },
      ],
    })
  })

  test('toJsonApi should sanitize internal errors when status >= 500', () => {
    const error = new ApiError({
      status: 500,
      title: 'Database Crash',
      detail: 'SQL logic error at line 42',
      code: 'DB_CRASH',
    })

    const json = error.toJsonApi()

    expect(json.errors[0]!.title).toBe('Internal Server Error')
    expect(json.errors[0]!.detail).toBe('An unexpected error occurred on the server.')
    expect(json.errors[0]!.code).toBe('INTERNAL_SERVER_ERROR')
  })

  test('toJsonApi should allow forcing sanitize', () => {
    const error = new ApiError({
      status: 400,
      title: 'Visible Error',
      detail: 'Detailed message',
      code: 'VISIBLE',
    })

    const json = error.toJsonApi({ sanitize: true })

    expect(json.errors[0]!.title).toBe('Internal Server Error')
  })
})
