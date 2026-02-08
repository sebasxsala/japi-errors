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

  describe('chainable methods', () => {
    const base = new ApiError({
      status: 400,
      title: 'Bad Request',
      detail: 'Original',
      code: 'BAD_REQUEST',
      meta: { foo: 'bar' },
      source: { pointer: '/old' },
    })

    test('withSource should update source', () => {
      const updated = base.withSource({ pointer: '/new' })
      expect(updated.source?.pointer).toBe('/new')
      expect(updated.detail).toBe('Original')
    })

    test('withMeta should update meta', () => {
      const updated = base.withMeta({ foo: 'bar' })
      expect(updated.meta).toEqual({ foo: 'bar' })
    })

    test('withId should update id', () => {
      const updated = base.withId('new-id')
      expect(updated.id).toBe('new-id')
    })

    test('withLinks should update links', () => {
      const updated = base.withLinks({ about: 'http://example.com' })
      expect(updated.links?.about).toBe('http://example.com')
    })

    test('methods should return new instances', () => {
      const updated = base.withId('new-id')
      expect(updated).not.toBe(base)
    })
  })

  test('toObject should include links', () => {
    const error = new ApiError({
      status: 400,
      title: 'Err',
      detail: 'msg',
      code: 'CODE',
      links: { about: 'http://foo' },
    })

    expect(error.toObject().links?.about).toBe('http://foo')
  })
})
