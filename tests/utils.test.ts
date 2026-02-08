import { expect, test, describe } from 'bun:test'
import { ApiError } from '../src/core/api-error'
import { isRetryable, classify } from '../src/utils/index'

describe('Utils', () => {
  describe('isRetryable', () => {
    test('should return true for retryable ApiError', () => {
      const err = new ApiError({
        status: 500,
        title: 'Error',
        detail: 'pff',
        code: 'ERR',
        retryable: true,
      })
      expect(isRetryable(err)).toBe(true)
    })

    test('should return true for specific status codes (e.g. 429)', () => {
      const err = new ApiError({
        status: 429,
        title: 'Too Many Requests',
        detail: 'Slow down',
        code: 'TOO_MANY_REQUESTS',
      })
      expect(isRetryable(err)).toBe(true)
    })

    test('should return false for non-retryable errors', () => {
      const err = new Error('Basic error')
      expect(isRetryable(err)).toBe(false)

      const apiErr = new ApiError({
        status: 400,
        title: 'Bad Request',
        detail: 'Bad',
        code: 'BAD',
      })
      expect(isRetryable(apiErr)).toBe(false)
    })
  })

  describe('classify', () => {
    test('should classify operational errors', () => {
      const err = new ApiError({
        status: 400,
        title: 'Bad Request',
        detail: 'Bad',
        code: 'BAD',
        isOperational: true,
      })
      expect(classify(err)).toBe('operational')
    })

    test('should classify programmer errors', () => {
      const err = new ApiError({
        status: 500,
        title: 'Crash',
        detail: 'Boom',
        code: 'CRASH',
        isOperational: false,
      })
      expect(classify(err)).toBe('programmer')
    })

    test('should classify unknown errors as valid normalized errors (default operational=true)', () => {
      // normalizeError defaults isOperational to true in our current impl?
      // Wait, normalizeError creates new ApiError where isOperational defaults to true (from options.isOperational ?? true)
      // ApiError constructor defaults isOperational to true.

      const err = new Error('Unknown')
      expect(classify(err)).toBe('operational')
    })
  })
})
