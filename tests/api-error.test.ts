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

    const jsonDocument = error.toJsonApiDocument()

    expect(jsonDocument).toEqual({
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

    const json = error.toJsonApiObject()

    expect(json.meta.foo).toBe('bar')
    expect(json.source?.parameter).toBe('query')
  })

  test('toJsonApi should sanitize internal errors when status >= 500', () => {
    const error = new ApiError({
      status: 500,
      title: 'Database Crash',
      detail: 'SQL logic error at line 42',
      code: 'DB_CRASH',
      meta: { foo: 'bar' },
    })

    const json = error.toJsonApiDocument()

    expect(json.errors[0].title).toBe('Internal Server Error')
    expect(json.errors[0].detail).toBe('An unexpected error occurred on the server.')
    expect(json.errors[0].code).toBe('INTERNAL_SERVER_ERROR')
    expect(json.errors[0]).not.toHaveProperty('meta')
    expect(json.errors[0]).not.toHaveProperty('source')
  })

  test('toJsonApi should allow forcing sanitize', () => {
    const error = new ApiError({
      status: 400,
      title: 'Visible Error',
      detail: 'Detailed message',
      code: 'VISIBLE',
    })

    const json = error.toJsonApiDocument({ sanitize: true })

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

    expect(error.toJsonApiObject().links?.about).toBe('http://foo')
  })

  describe('toProblemDetails', () => {
    test('should return RFC 9457 compliant structure', () => {
      const error = new ApiError({
        status: 404,
        title: 'Not Found',
        detail: 'Resource not found',
        code: 'NOT_FOUND',
        id: 'instance-id',
        links: { about: 'http://docs/errors/404' },
      })

      const pd = error.toProblemDetails()

      expect(pd.type).toBe('http://docs/errors/404')
      expect(pd.title).toBe('Not Found')
      expect(pd.status).toBe(404)
      expect(pd.detail).toBe('Resource not found')
      expect(pd.instance).toBe('instance-id')
    })

    test('should sanitize when status >= 500', () => {
      const error = new ApiError({
        status: 500,
        title: 'Crash',
        detail: 'Stack trace',
        code: 'CRASH',
      })

      const pd = error.toProblemDetails()

      expect(pd.title).toBe('Internal Server Error')
      expect(pd.detail).toBe('An unexpected error occurred on the server.')
      expect(pd.code).toBe('INTERNAL_SERVER_ERROR')
    })

    test('should default type to about:blank', () => {
      const error = new ApiError({
        status: 400,
        title: 'Bad',
        detail: 'Bad',
        code: 'BAD',
        meta: { cosita: 'aoiesnt' },
      })

      const pd = error.toProblemDetails()
      expect(pd.type).toBe('about:blank')
    })

    test('should include meta when not sanitized', () => {
      const error = new ApiError({
        status: 400,
        title: 'Bad',
        detail: 'Bad',
        code: 'BAD',
        meta: { cosita: 'aoiesnt', number: 123 },
      })

      const pd = error.toProblemDetails({ sanitize: false })
      expect(pd.cosita).toBe('aoiesnt')
      expect(typeof pd.cosita).toBe('string')
      expect(pd.number).toBe(123)
      expect(typeof pd.number).toBe('number')
    })
  })
})
