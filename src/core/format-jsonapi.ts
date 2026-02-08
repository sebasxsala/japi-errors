import { ApiError } from './api-error'
import type { JsonApiErrorDocument, JsonApiErrorObject, JsonApiSource, Meta } from '../types'

export type { JsonApiErrorObject }

/**
 * Utility function to format one or multiple ApiErrors into a JSON:API compliant document.
 *
 * @param input - A single ApiError or an array of ApiErrors
 * @param opts - Options for the conversion
 * @param opts.sanitize - Whether to sanitize the errors (hide sensitive details).
 * @returns A JSON:API compliant document containing the errors
 */
export function formatJsonApiErrors<M = Meta, S extends JsonApiSource = JsonApiSource>(
  input: ApiError<M, S> | ApiError<M, S>[],
  opts?: { sanitize?: boolean },
): JsonApiErrorDocument<M, S> {
  const errors = Array.isArray(input) ? input : [input]

  return {
    errors: errors.flatMap((error) => error.toJsonApi(opts).errors),
  }
}
