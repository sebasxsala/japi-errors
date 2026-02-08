import { ApiError } from '../core/api-error'
import { AppError } from '../core/app-error'
import type { JsonApiErrorDocument, JsonApiErrorObject } from '../types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isOptionalString = (value: unknown): value is string | undefined =>
  value === undefined || typeof value === 'string'

const isOptionalRecord = (value: unknown): value is Record<string, unknown> | undefined =>
  value === undefined || isRecord(value)

/** Checks if an error is an instance of ApiError */
export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError
/** Checks if an error is an instance of AppError */
export const isAppError = (e: unknown): e is AppError => e instanceof AppError

/** Checks if an object has an `isOperational` boolean property */
export const isOperationalError = (e: unknown): e is { isOperational: boolean } =>
  isRecord(e) && 'isOperational' in e && typeof e.isOperational === 'boolean'

/** Checks if an object looks like a standard Error object */
export const isErrorLike = (e: unknown): e is { name: string; message: string; stack?: string } =>
  isRecord(e) &&
  typeof e.name === 'string' &&
  typeof e.message === 'string' &&
  isOptionalString(e.stack)

/** Checks if an object is a valid JSON:API Error Object */
export const isJsonApiErrorObject = (input: unknown): input is JsonApiErrorObject => {
  if (!isRecord(input)) return false

  return (
    isOptionalString(input.id) &&
    isOptionalString(input.status) &&
    isOptionalString(input.code) &&
    isOptionalString(input.title) &&
    isOptionalString(input.detail) &&
    isOptionalRecord(input.source) &&
    isOptionalRecord(input.meta) &&
    isOptionalRecord(input.links)
  )
}

/** Checks if an object is a valid JSON:API Error Document */
export const isJsonApiErrorDocument = (input: unknown): input is JsonApiErrorDocument => {
  if (!isRecord(input) || !Array.isArray(input.errors)) return false

  return input.errors.every(isJsonApiErrorObject)
}
