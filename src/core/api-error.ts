import type { Meta } from '../types'

export type ApiErrorOptions<M = Meta> = {
  status: number
  title: string
  detail: string
  code: string
  source?: {
    pointer?: string
    parameter?: string
    header?: string
  }
  meta?: M
  id?: string

  headers?: Record<string, string>
  expose?: boolean
  isOperational?: boolean
  cause?: unknown
}

export class ApiError<M = Meta> extends Error {
  readonly status: number
  readonly title: string
  readonly detail: string
  readonly code: string
  readonly source?: ApiErrorOptions['source']
  readonly meta?: M
  readonly id?: string
  readonly isOperational: boolean
  readonly headers: Record<string, string>
  readonly expose: boolean

  constructor(options: ApiErrorOptions<M>) {
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
    this.cause = options.cause
    this.expose = options.expose ?? options.status < 500
  }

  toJsonApi(opts?: { sanitize?: boolean }) {
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
          ...(!sanitize && this.meta ? { meta: this.meta as any } : {}),
        },
      ],
    }
  }
}
