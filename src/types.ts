/** Non-standard meta-information about the error */
export type Meta = Record<string, unknown>

/** Object containing references to the source of the error */
export type JsonApiSource = {
  /** A JSON Pointer [RFC6901] to the associated entity in the request document */
  pointer?: string
  /** A string indicating which URI query parameter caused the error */
  parameter?: string
  /** A string indicating the name of a single HTTP header which caused the error */
  header?: string
} & Record<string, unknown>

/** Links to further information about the error */
export type JsonApiLinks = {
  /** A link that leads to further details about this particular occurrence of the problem */
  about?: string
  /** A link that leads to a type definition for the error */
  type?: string
}

/**
 * A JSON:API compliant Error Object.
 * @see https://jsonapi.org/format/#error-objects
 */
export type JsonApiErrorObject<M = Meta, S = JsonApiSource | undefined> = {
  /** A unique identifier for this particular occurrence of the problem */
  id?: string
  /** A links object containing about and type links */
  links?: JsonApiLinks
  /** The HTTP status code applicable to this problem, expressed as a string value */
  status?: string
  /** An application-specific error code, expressed as a string value */
  code?: string
  /** A short, human-readable summary of the problem */
  title?: string
  /** A human-readable explanation specific to this occurrence of the problem */
  detail?: string
  /** An object containing references to the source of the error */
  source?: S
  /** A meta object containing non-standard meta-information about the error */
  meta?: M
}

/**
 * A JSON:API compliant Error Document.
 */
export type JsonApiErrorDocument<M = Meta, S = JsonApiSource | undefined> = {
  errors: JsonApiErrorObject<M, S>[]
}
