import { expect, test, describe } from 'bun:test'
import { AppError } from '../src/core/app-error'

describe('AppError', () => {
  class TestError extends AppError<'TEST_CODE', { foo: string }> {
    readonly code = 'TEST_CODE'
  }

  test('should create and store code and meta with full type inference', () => {
    const meta = { foo: 'bar' }
    const error = new TestError('message', meta)

    expect(error.message).toBe('message')
    expect(error.code).toBe('TEST_CODE')
    expect(error.meta).toBe(meta)
    expect(error.meta?.foo).toBe('bar') // Verify autocomplete-like access
    expect(error.isOperational).toBe(true)
  })

  test('should work with interfaces for meta', () => {
    interface MyMeta {
      count: number
    }
    class InterfaceError extends AppError<'INT_CODE', MyMeta> {
      readonly code = 'INT_CODE'
    }

    const error = new InterfaceError('msg', { count: 42 })
    expect(error.meta?.count).toBe(42)
  })
})
