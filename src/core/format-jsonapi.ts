// format-jsonapi.ts
import { ApiError } from './api-error'
import type { Meta } from '../types'

export type JsonApiErrorObject = {
  id?: string
  links?: { about?: string; type?: string }
  status?: string
  code?: string
  title?: string
  detail?: string
  source?: { pointer?: string; parameter?: string; header?: string }
  meta?: Meta
}

export function formatJsonApiErrors(
  input: ApiError<any> | ApiError<any>[],
  opts?: { sanitize?: boolean },
): { errors: JsonApiErrorObject[] } {
  const errors = Array.isArray(input) ? input : [input]

  return {
    errors: errors.map((e) => {
      const sanitize = opts?.sanitize ?? !e.expose

      const title = sanitize ? 'Internal Server Error' : e.title
      const detail = sanitize ? 'An unexpected error occurred on the server.' : e.detail
      const code = sanitize ? 'INTERNAL_SERVER_ERROR' : e.code

      return {
        status: String(e.status),
        title,
        detail,
        code,
        ...(e.id ? { id: e.id } : {}),
        ...(!sanitize && e.source ? { source: e.source } : {}),
        ...(!sanitize && e.meta ? { meta: e.meta as any } : {}),
      }
    }),
  }
}
