import { expect, test, describe } from 'bun:test'
import { ApiError } from '../src/core/api-error'
import { formatJsonApiErrors } from '../src/formatters/json-api'

describe('formatJsonApiErrors', () => {
  const err1 = new ApiError({
    status: 400,
    title: 'Error 1',
    detail: 'Detail 1',
    code: 'CODE1',
  })

  const err2 = new ApiError({
    status: 404,
    title: 'Error 2',
    detail: 'Detail 2',
    code: 'CODE2',
  })

  test('should format a single error', () => {
    const result = formatJsonApiErrors(err1)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]!.status).toBe('400')
  })

  test('should format an array of errors', () => {
    const result = formatJsonApiErrors([err1, err2])
    expect(result.errors).toHaveLength(2)
    expect(result.errors[0]!.code).toBe('CODE1')
    expect(result.errors[1]!.code).toBe('CODE2')
  })

  test('should sanitize errors globally', () => {
    const result = formatJsonApiErrors(err1, { sanitize: true })
    expect(result.errors[0]!.title).toBe('Internal Server Error')
  })
})
