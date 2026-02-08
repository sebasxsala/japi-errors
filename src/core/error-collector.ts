import { ApiError } from './api-error'
import { AggregateError } from './aggregate-error'
import { normalizeError } from '../utils/normalize-error'

/**
 * Collects errors and allows processing them in batches.
 */
export class ErrorCollector {
  private _errors: ApiError[] = []

  /**
   * Adds an error to the collector.
   * The error is normalized to an ApiError.
   */
  add(error: unknown): void {
    this._errors.push(normalizeError(error))
  }

  /**
   * Checks if there are any collected errors.
   */
  get hasErrors(): boolean {
    return this._errors.length > 0
  }

  /**
   * Returns the count of collected errors.
   */
  get count(): number {
    return this._errors.length
  }

  /**
   * Returns the collected errors as readonly array.
   */
  get errors(): readonly ApiError[] {
    return this._errors
  }

  /**
   * Throws an AggregateError if there are any collected errors.
   * If there is only one error, it throws that error directly.
   * If there are multiple errors, it throws an AggregateError.
   */
  throw(): void {
    if (this.errors.length === 1) {
      throw this.errors[0]
    }

    throw new AggregateError(this._errors, `${this.errors.length} errors occurred`)
  }

  /**
   * Returns a result object.
   */
  toResult<T>(value?: T): { ok: true; value: T } | { ok: false; error: AggregateError } {
    if (this.hasErrors) {
      return { ok: false, error: new AggregateError(this._errors) }
    }
    return { ok: true, value: value as T }
  }

  /**
   * Clears all collected errors.
   */
  clear(): void {
    this._errors = []
  }
}
