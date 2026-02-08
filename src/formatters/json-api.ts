import { ApiError } from '../core/api-error'
import type { JsonApiErrorDocument, JsonApiSource, Meta } from '../types'

type ApiErrorLike<M = Meta | undefined, S = JsonApiSource | undefined> =
  | ApiError<M, S>
  | readonly ApiError<M, S>[]

/**
 * Utility function to format one or multiple ApiErrors into a JSON:API compliant document.
 *
 * @param input - A single ApiError or an array of ApiErrors
 * @param opts - Options for the conversion
 * @param opts.sanitize - Whether to sanitize the errors (hide sensitive details).
 * @returns A JSON:API compliant document containing the errors
 */
export function formatJsonApiErrors<M = Meta | undefined, S = JsonApiSource | undefined>(
  input: ApiErrorLike<M, S>,
  opts?: { sanitize?: boolean },
): JsonApiErrorDocument<M, S> {
  const errors = Array.isArray(input) ? input : [input]

  return {
    errors: errors.map((error) => error.toJsonApiObject(opts)),
  }
}
