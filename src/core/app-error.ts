import type { Meta } from '../types'

export abstract class AppError<Code extends string = string, M = Meta> extends Error {
  abstract readonly code: Code
  readonly isOperational: boolean = true

  readonly meta?: M

  constructor(message: string, meta?: M) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.meta = meta
  }
}
