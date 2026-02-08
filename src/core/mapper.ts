import { ApiError, type ApiErrorOptions } from './api-error'
import { AppError } from './app-error'
import type { JsonApiSource, Meta } from '../types'

type AnyAppError = AppError<string, Meta>
type MetaOf<E extends AnyAppError> = E extends AppError<string, infer M> ? M : Meta

/**
 * Defines how an AppError should be mapped to an ApiError.
 */
export type Mapping<E extends AnyAppError = AnyAppError> = {
  /** HTTP status code */
  status: number
  /** Short, human-readable summary */
  title: string
  /** Whether to expose the error details. Defaults to true for 4xx, false for 5xx. */
  expose?: boolean
  /** Optional function to build extra ApiError options from the AppError */
  build?: (err: E) => Partial<ApiErrorOptions<MetaOf<E>, JsonApiSource>>
}

/**
 * A map of AppError codes to their corresponding Mapping.
 */
export type ErrorMap<E extends AnyAppError = AnyAppError> = Partial<{
  [Code in E['code']]: Mapping<Extract<E, { code: Code }>>
}>

type LooseMapping = {
  status: number
  title: string
  expose?: boolean
  build?: (err: never) => Partial<ApiErrorOptions>
}

type LooseErrorMap = Record<string, LooseMapping>

export type ApiErrorLike = ApiError | readonly ApiError[]

export type ErrorAdapter = (err: unknown) => ApiErrorLike | undefined

/**
 * Utility to define an ErrorMap with proper type inference for AppErrors.
 */
export const defineErrorMap = <E extends AnyAppError>(map: ErrorMap<E>): ErrorMap<E> => map

/**
 * Creates a mapper function that converts any error (AppError, ApiError, or unknown)
 * into an ApiError based on the provided map.
 *
 * @param map - A map of AppError codes to Mappings
 * @param opts - Options for the mapper
 * @param opts.defaultMapping - Mapping to use when an AppError code is not found in the map
 * @param opts.adapters - An array of adapter functions to handle special error types (e.g. Zod, Axios)
 * @param opts.unknownHandler - A function to handle completely unknown errors
 * @returns A function that takes an error and returns an ApiError
 */
export function createApiErrorMapper<E extends AnyAppError = AnyAppError>(
  map: ErrorMap<E> | LooseErrorMap,
  opts?: {
    defaultMapping?: Mapping<AnyAppError>
    adapters?: readonly ErrorAdapter[]
    unknownHandler?: (err: unknown) => ApiErrorLike
  },
) {
  const defaultMapping: Mapping<AnyAppError> = opts?.defaultMapping ?? {
    status: 400,
    title: 'Application error',
  }

  return function toApiError(err: unknown): ApiErrorLike {
    if (err instanceof ApiError) return err

    if (err instanceof AppError) {
      const appError = err as AnyAppError
      const mapping =
        (map[appError.code as E['code']] as Mapping<AnyAppError> | LooseMapping | undefined) ??
        defaultMapping
      const extra = (
        mapping.build as ((err: AnyAppError) => Partial<ApiErrorOptions>) | undefined
      )?.(appError)

      return new ApiError({
        status: mapping.status,
        title: mapping.title,
        detail: appError.message,
        code: appError.code,
        meta: extra?.meta ?? appError.meta,
        source: extra?.source,
        headers: extra?.headers,
        id: extra?.id,
        links: extra?.links,
        expose: extra?.expose ?? mapping.expose,
        isOperational: appError.isOperational,
        cause: extra?.cause,
      })
    }

    if (opts?.adapters) {
      for (const adapter of opts.adapters) {
        const adapted = adapter(err)
        if (adapted) return adapted
      }
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
