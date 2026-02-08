import type {
  JsonApiErrorObject,
  JsonApiLinks,
  JsonApiSource,
  Meta,
  ProblemDetails,
} from '../types'

/**
 * Options for creating an ApiError.
 */
export type ApiErrorOptions<
  M extends Record<string, unknown> = Meta,
  S = JsonApiSource | undefined,
> = {
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
  /** Links to further information about the error */
  links?: JsonApiLinks
  /** Tags for categorization/filtering */
  tags?: string[]
  /** Indicates if the operation can be retried */
  retryable?: boolean

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
export class ApiError<
  M extends Record<string, unknown> = Meta,
  S = JsonApiSource | undefined,
> extends Error {
  readonly status: number
  readonly title: string
  readonly detail: string
  readonly code: string
  readonly source: S
  readonly meta: M
  readonly id?: string
  readonly links?: JsonApiLinks
  readonly tags: string[]
  readonly retryable: boolean
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
    this.source = options.source as S
    this.meta = options.meta as M
    this.id = options.id
    this.links = options.links
    this.tags = options.tags ?? []
    this.retryable = options.retryable ?? false
    this.isOperational = options.isOperational ?? true
    this.headers = options.headers ?? {}
    this.expose = options.expose ?? options.status < 500
  }

  /**
   * Sets the source of the error and returns a new instance.
   */
  withSource(source: ApiErrorOptions<M, S>['source']): ApiError<M, S> {
    return new ApiError({ ...this.toOptions(), source })
  }

  /**
   * Sets the metadata of the error and returns a new instance.
   */
  withMeta(meta: M): ApiError<M, S> {
    return new ApiError({ ...this.toOptions(), meta })
  }

  /**
   * Sets the ID of the error and returns a new instance.
   */
  withId(id: string): ApiError<M, S> {
    return new ApiError({ ...this.toOptions(), id })
  }

  /**
   * Sets the links of the error and returns a new instance.
   */
  withLinks(links: JsonApiLinks): ApiError<M, S> {
    return new ApiError({ ...this.toOptions(), links })
  }

  /**
   * Returns the options object used to create this error.
   */
  private toOptions(): ApiErrorOptions<M, S> {
    return {
      status: this.status,
      title: this.title,
      detail: this.detail,
      code: this.code,
      source: this.source,
      meta: this.meta,
      id: this.id,
      links: this.links,
      tags: this.tags,
      retryable: this.retryable,
      isOperational: this.isOperational,
      headers: this.headers,
      expose: this.expose,
      cause: this.cause,
    }
  }

  /**
   * Converts the error to a JSON:API compliant error object.
   */
  toJsonApiObject(opts?: { sanitize?: boolean }): JsonApiErrorObject<M, S> {
    const sanitize = opts?.sanitize ?? (!this.expose || this.status >= 500)
    const title = sanitize ? 'Internal Server Error' : this.title
    const detail = sanitize ? 'An unexpected error occurred on the server.' : this.detail
    const code = sanitize ? 'INTERNAL_SERVER_ERROR' : this.code

    return {
      status: String(this.status),
      title,
      detail,
      code,
      ...(this.id ? { id: this.id } : {}),
      ...(this.links ? { links: this.links } : {}),
      ...(!sanitize && this.source ? { source: this.source as any } : {}),
      ...(!sanitize && this.meta ? { meta: this.meta as any } : {}),
    } as JsonApiErrorObject<M, S>
  }

  /**
   * Converts the error to a JSON:API compliant document.
   *
   * @param opts - Options for the conversion
   * @param opts.sanitize - Whether to sanitize the error (hide sensitive details).
   *                        Defaults to the inverse of `expose` or true for status >= 500.
   */
  toJsonApiDocument(opts?: { sanitize?: boolean }): { errors: [JsonApiErrorObject<M, S>] } {
    return {
      errors: [this.toJsonApiObject(opts)],
    }
  }

  /**
   * Converts the error to a Problem Details object (RFC 9457).
   */
  toProblemDetails(opts?: { sanitize?: boolean }): ProblemDetails<M> {
    const sanitize = opts?.sanitize ?? (!this.expose || this.status >= 500)
    const title = sanitize ? 'Internal Server Error' : this.title
    const detail = sanitize ? 'An unexpected error occurred on the server.' : this.detail
    const type = this.links?.about ?? 'about:blank'

    return {
      type,
      title,
      status: this.status,
      detail,
      instance: this.id,
      code: sanitize ? 'INTERNAL_SERVER_ERROR' : this.code,
      ...(!sanitize && this.meta ? this.meta : {}),
    } as ProblemDetails<M>
  }
}
