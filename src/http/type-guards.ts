import { ApiError } from '../core/api-error'
import { AppError } from '../core/app-error'

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError
export const isAppError = (e: unknown): e is AppError => e instanceof AppError

export const isOperationalError = (e: unknown): e is { isOperational: boolean } =>
  typeof e === 'object' &&
  e !== null &&
  'isOperational' in e &&
  typeof (e as any).isOperational === 'boolean'
