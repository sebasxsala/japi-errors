import { ApiError } from '../core/api-error'

/**
 * Normalizes any error value into an ApiError.
 */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (error instanceof Error) {
    return new ApiError({
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      title: 'Internal Server Error',
      detail: error.message,
      cause: error,
    })
  }

  return new ApiError({
    status: 500,
    code: 'UNKNOWN_ERROR',
    title: 'Unknown Error',
    detail: String(error),
    cause: error,
  })
}
