import { ApiError } from '../core/api-error'
import { normalizeError } from './normalize-error'

export { normalizeError }

/**
 * Determines if an error represents a retryable condition.
 * Checks for `retryable` property or specific HTTP status codes (429, 502, 503, 504).
 */
export function isRetryable(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.retryable || [429, 502, 503, 504].includes(error.status)
  }
  return false
}

/**
 * Classifies an error into a category.
 * Currently distinguishes between 'operational' (expected) and 'programmer' (unexpected) errors.
 */
export function classify(error: unknown): 'operational' | 'programmer' {
  const apiError = normalizeError(error)
  return apiError.isOperational ? 'operational' : 'programmer'
}
