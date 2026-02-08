import { ApiError } from './api-error'

/**
 * Represents a collection of ApiErrors.
 */
export class AggregateError extends Error {
  readonly errors: ApiError[]

  constructor(errors: ApiError[], message = 'Multiple errors occurred') {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'AggregateError'
    this.errors = errors
  }

  /**
   * Returns an iterator for the errors.
   */
  [Symbol.iterator](): Iterator<ApiError> {
    return this.errors[Symbol.iterator]()
  }
}
