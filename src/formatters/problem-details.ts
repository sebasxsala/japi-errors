import { ApiError } from '../core/api-error'
import type { ProblemDetails } from '../types'

/**
 * Utility function to format an ApiError into a Problem Details object.
 *
 * @param error - The ApiError to format
 * @param opts - Options for the conversion
 * @returns A Problem Details object
 */
export function formatProblemDetails(
  error: ApiError,
  opts?: { sanitize?: boolean },
): ProblemDetails {
  return error.toProblemDetails(opts)
}
