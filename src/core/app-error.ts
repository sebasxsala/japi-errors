import type { Meta } from '../types'

/**
 * Base class for all internal application errors.
 * These errors represent domain-specific problems and should be mapped to ApiErrors.
 */
export abstract class AppError<Code extends string = string, M = Meta> extends Error {
  /** Application-specific error code */
  abstract readonly code: Code
  /** Whether the error is operational (expected) or a programmer error (unexpected) */
  readonly isOperational: boolean = true

  /** Domain-specific metadata about the error */
  readonly meta?: M

  constructor(message: string, meta?: M) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.meta = meta
  }
}
