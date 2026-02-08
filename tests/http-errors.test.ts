import { expect, test, describe } from 'bun:test'
import { HttpErrors, NotFound, InternalServerError } from '../src/http/http-errors'
import { ApiError } from '../src/core/api-error'

describe('HttpErrors', () => {
  test('NotFound should create a 404 error', () => {
    const err = NotFound({ detail: 'Where?' })
    expect(err instanceof ApiError).toBe(true)
    expect(err.status).toBe(404)
    expect(err.title).toBe('Not Found')
    expect(err.detail).toBe('Where?')
    expect(err.code).toBe('NOT_FOUND')
  })

  test('InternalServerError should create a 500 error and not expose it', () => {
    const err = InternalServerError()
    expect(err.status).toBe(500)
    expect(err.expose).toBe(false)
  })

  test('should allow custom code and meta in HTTP errors', () => {
    const err = HttpErrors.badRequest({
      code: 'CUSTOM_BAD_REQUEST',
      meta: { foo: 'bar' },
    })
    expect(err.code).toBe('CUSTOM_BAD_REQUEST')
    expect(err.meta).toEqual({ foo: 'bar' })
  })

  test('factory should have multiple status codes', () => {
    expect(HttpErrors.forbidden().status).toBe(403)
    expect(HttpErrors.unauthorized().status).toBe(401)
    expect(HttpErrors.conflict().status).toBe(409)
    expect(HttpErrors.unprocessableEntity().status).toBe(422)
  })
})
