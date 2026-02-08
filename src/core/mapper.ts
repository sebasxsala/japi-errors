import { ApiError, type ApiErrorOptions } from './api-error'
import { AppError } from './app-error'

export type Mapping<E extends AppError = AppError> = {
  status: number
  title: string
  expose?: boolean
  build?: (err: E) => Partial<ApiErrorOptions>
}

export type ErrorMap = Record<string, Mapping<any>>

export function createApiErrorMapper(
  map: ErrorMap,
  opts?: {
    defaultMapping?: Mapping
    unknownHandler?: (err: unknown) => ApiError
  },
) {
  const defaultMapping: Mapping = opts?.defaultMapping ?? {
    status: 400,
    title: 'Application error',
  }

  return function toApiError(err: unknown): ApiError {
    if (err instanceof ApiError) return err

    if (err instanceof AppError) {
      const mapping = map[err.code] ?? defaultMapping
      const extra = mapping.build?.(err)

      return new ApiError({
        status: mapping.status,
        title: mapping.title,
        detail: err.message,
        code: err.code,
        meta: (extra?.meta ?? err.meta) as any,
        source: extra?.source,
        headers: extra?.headers,
        id: extra?.id,
        expose: extra?.expose ?? mapping.expose,
        isOperational: err.isOperational,
        cause: extra?.cause,
      })
    }

    if (opts?.unknownHandler) return opts.unknownHandler(err)

    return new ApiError({
      status: 500,
      title: 'Internal Server Error',
      detail: 'An unexpected error occurred on the server.',
      code: 'INTERNAL_SERVER_ERROR',
      expose: false,
      isOperational: false,
      cause: err,
    })
  }
}
