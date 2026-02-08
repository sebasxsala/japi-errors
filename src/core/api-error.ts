import type { JsonApiErrorDocument, JsonApiSource, Meta } from '../types'

/**
 * Options for creating an ApiError.
 */
export type ApiErrorOptions<M = Meta, S extends JsonApiSource = JsonApiSource> = {
  /** HTTP status code (e.g. 400, 404, 500) */
  status: number
  /** Short, human-readable summary of the problem */
  title: string
  /** Detailed explanation specific to this occurrence of the problem */
  detail: string
  /** Application-specific error code */
  code: string
  /** Object containing references to the source of the error */
  source?: S
  /** Non-standard meta-information about the error */
  meta?: M
  /** Unique identifier for this particular occurrence of the problem */
  id?: string

  /** Custom HTTP headers to be sent with the error response */
  headers?: Record<string, string>
  /** Whether to expose the error details to the client. Defaults to true for 4xx, false for 5xx. */
  expose?: boolean
  /** Whether the error is operational (expected) or a programmer error (unexpected) */
  isOperational?: boolean
  /** The underlying cause of the error */
  cause?: unknown
}

/**
 * Represents an error that can be converted to a JSON:API compliant structure.
 */
export class ApiError<M = Meta, S extends JsonApiSource = JsonApiSource> extends Error {
  readonly status: number
  readonly title: string
  readonly detail: string
  readonly code: string
  readonly source?: ApiErrorOptions<M, S>['source']
  readonly meta?: M
  readonly id?: string
  readonly isOperational: boolean
  readonly headers: Record<string, string>
  readonly expose: boolean

  constructor(options: ApiErrorOptions<M, S>) {
    super(options.detail, { cause: options.cause })
    Object.setPrototypeOf(this, new.target.prototype)

    this.status = options.status
    this.title = options.title
    this.detail = options.detail
    this.code = options.code
    this.source = options.source
    this.meta = options.meta
    this.id = options.id
    this.isOperational = options.isOperational ?? true
    this.headers = options.headers ?? {}
    this.expose = options.expose ?? options.status < 500
  }

  /**
   * Converts the error to a JSON:API compliant document.
   *
   * @param opts - Options for the conversion
   * @param opts.sanitize - Whether to sanitize the error (hide sensitive details).
   *                        Defaults to the inverse of `expose` or true for status >= 500.
   */
  toJsonApi(opts?: { sanitize?: boolean }): JsonApiErrorDocument<M, S> {
    const sanitize = opts?.sanitize ?? (!this.expose || this.status >= 500)
    const title = sanitize ? 'Internal Server Error' : this.title
    const detail = sanitize ? 'An unexpected error occurred on the server.' : this.detail
    const code = sanitize ? 'INTERNAL_SERVER_ERROR' : this.code

    return {
      errors: [
        {
          status: String(this.status),
          title,
          detail,
          code,
          ...(this.id ? { id: this.id } : {}),
          ...(!sanitize && this.source ? { source: this.source } : {}),
          ...(!sanitize && this.meta ? { meta: this.meta } : {}),
        },
      ],
    }
  }
}
