import { expect, test, describe } from 'bun:test'
import { ApiError } from '../src/core/api-error'
import { ErrorCollector } from '../src/core/error-collector'
import { AggregateError } from '../src/core/aggregate-error'

describe('ErrorCollector', () => {
  test('should collect errors', () => {
    const collector = new ErrorCollector()
    collector.add(new Error('Something went wrong'))
    collector.add(
      new ApiError({
        status: 400,
        title: 'Bad Request',
        detail: 'Invalid input',
        code: 'BAD_REQUEST',
      }),
    )

    expect(collector.count).toBe(2)
    expect(collector.hasErrors).toBe(true)
  })

  test('should normalize errors', () => {
    const collector = new ErrorCollector()
    collector.add('A string error')

    expect(collector.errors[0]).toBeInstanceOf(ApiError)
    expect(collector.errors[0]!.detail).toBe('A string error')
    expect(collector.errors[0]!.code).toBe('UNKNOWN_ERROR')
  })

  test('should clear errors', () => {
    const collector = new ErrorCollector()
    collector.add(new Error('test'))
    collector.clear()

    expect(collector.count).toBe(0)
    expect(collector.hasErrors).toBe(false)
  })

  test('should throw first ApiError if only one error exists', () => {
    const collector = new ErrorCollector()
    collector.add(
      new ApiError({
        status: 400,
        title: 'Bad Request',
        detail: 'Invalid input',
        code: 'BAD_REQUEST',
      }),
    )

    expect(() => collector.throw()).toThrow(ApiError)
    try {
      collector.throw()
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      if (e instanceof ApiError) {
        expect(e.status).toBe(400)
        expect(e.title).toBe('Bad Request')
        expect(e.detail).toBe('Invalid input')
        expect(e.code).toBe('BAD_REQUEST')
      }
    }
  })

  test('should throw AggregateError if errors exist', () => {
    const collector = new ErrorCollector()
    collector.add(new Error('test'))
    collector.add(
      new ApiError({
        status: 400,
        title: 'Bad Request',
        detail: 'Invalid input',
        code: 'BAD_REQUEST',
      }),
    )

    expect(() => collector.throw()).toThrow(AggregateError)
    try {
      collector.throw()
    } catch (e) {
      expect(e).toBeInstanceOf(AggregateError)
      if (e instanceof AggregateError) {
        expect(e.errors).toHaveLength(2)
      }
    }
  })

  test('should return result object', () => {
    const collector = new ErrorCollector()

    // No errors
    const success = collector.toResult('success')
    expect(success.ok).toBe(true)
    if (success.ok) {
      expect(success.value).toBe('success')
    }

    // With errors
    collector.add(new Error('failure'))
    const failure = collector.toResult()
    expect(failure.ok).toBe(false)
    if (!failure.ok) {
      expect(failure.error).toBeInstanceOf(AggregateError)
    }
  })
})
