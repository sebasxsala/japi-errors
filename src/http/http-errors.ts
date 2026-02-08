import { ApiError, type ApiErrorOptions } from '../core/api-error'

/**
 * Options for HTTP errors, excluding status and title which are provided by the factory.
 * All fields are optional to provide maximum flexibility.
 */
export type HttpErrorOptions = Partial<Omit<ApiErrorOptions, 'status' | 'title'>>

/**
 * Internal helper to create HTTP errors with defaults.
 */
const createHttpError = (
  status: number,
  title: string,
  defaultCode: string,
  options: HttpErrorOptions = {},
): ApiError => {
  return new ApiError({
    status,
    title,
    detail: options.detail ?? title,
    code: options.code ?? defaultCode,
    ...options,
  } as ApiErrorOptions)
}

/**
 * A factory object containing methods for creating standard HTTP errors.
 */
export const HttpErrors = {
  // 4xx Client Errors
  badRequest: (o?: HttpErrorOptions) => createHttpError(400, 'Bad Request', 'BAD_REQUEST', o),
  unauthorized: (o?: HttpErrorOptions) => createHttpError(401, 'Unauthorized', 'UNAUTHORIZED', o),
  paymentRequired: (o?: HttpErrorOptions) =>
    createHttpError(402, 'Payment Required', 'PAYMENT_REQUIRED', o),
  forbidden: (o?: HttpErrorOptions) => createHttpError(403, 'Forbidden', 'FORBIDDEN', o),
  notFound: (o?: HttpErrorOptions) => createHttpError(404, 'Not Found', 'NOT_FOUND', o),
  methodNotAllowed: (o?: HttpErrorOptions) =>
    createHttpError(405, 'Method Not Allowed', 'METHOD_NOT_ALLOWED', o),
  notAcceptable: (o?: HttpErrorOptions) =>
    createHttpError(406, 'Not Acceptable', 'NOT_ACCEPTABLE', o),
  proxyAuthenticationRequired: (o?: HttpErrorOptions) =>
    createHttpError(407, 'Proxy Authentication Required', 'PROXY_AUTHENTICATION_REQUIRED', o),
  requestTimeout: (o?: HttpErrorOptions) =>
    createHttpError(408, 'Request Timeout', 'REQUEST_TIMEOUT', o),
  conflict: (o?: HttpErrorOptions) => createHttpError(409, 'Conflict', 'CONFLICT', o),
  gone: (o?: HttpErrorOptions) => createHttpError(410, 'Gone', 'GONE', o),
  lengthRequired: (o?: HttpErrorOptions) =>
    createHttpError(411, 'Length Required', 'LENGTH_REQUIRED', o),
  preconditionFailed: (o?: HttpErrorOptions) =>
    createHttpError(412, 'Precondition Failed', 'PRECONDITION_FAILED', o),
  payloadTooLarge: (o?: HttpErrorOptions) =>
    createHttpError(413, 'Payload Too Large', 'PAYLOAD_TOO_LARGE', o),
  uriTooLong: (o?: HttpErrorOptions) => createHttpError(414, 'URI Too Long', 'URI_TOO_LONG', o),
  unsupportedMediaType: (o?: HttpErrorOptions) =>
    createHttpError(415, 'Unsupported Media Type', 'UNSUPPORTED_MEDIA_TYPE', o),
  rangeNotSatisfiable: (o?: HttpErrorOptions) =>
    createHttpError(416, 'Range Not Satisfiable', 'RANGE_NOT_SATISFIABLE', o),
  expectationFailed: (o?: HttpErrorOptions) =>
    createHttpError(417, 'Expectation Failed', 'EXPECTATION_FAILED', o),
  imATeapot: (o?: HttpErrorOptions) => createHttpError(418, "I'm a teapot", 'IM_A_TEAPOT', o),
  misdirectedRequest: (o?: HttpErrorOptions) =>
    createHttpError(421, 'Misdirected Request', 'MISDIRECTED_REQUEST', o),
  unprocessableEntity: (o?: HttpErrorOptions) =>
    createHttpError(422, 'Unprocessable Entity', 'UNPROCESSABLE_ENTITY', o),
  locked: (o?: HttpErrorOptions) => createHttpError(423, 'Locked', 'LOCKED', o),
  failedDependency: (o?: HttpErrorOptions) =>
    createHttpError(424, 'Failed Dependency', 'FAILED_DEPENDENCY', o),
  tooEarly: (o?: HttpErrorOptions) => createHttpError(425, 'Too Early', 'TOO_EARLY', o),
  upgradeRequired: (o?: HttpErrorOptions) =>
    createHttpError(426, 'Upgrade Required', 'UPGRADE_REQUIRED', o),
  preconditionRequired: (o?: HttpErrorOptions) =>
    createHttpError(428, 'Precondition Required', 'PRECONDITION_REQUIRED', o),
  tooManyRequests: (o?: HttpErrorOptions) =>
    createHttpError(429, 'Too Many Requests', 'TOO_MANY_REQUESTS', o),
  requestHeaderFieldsTooLarge: (o?: HttpErrorOptions) =>
    createHttpError(431, 'Request Header Fields Too Large', 'REQUEST_HEADER_FIELDS_TOO_LARGE', o),
  unavailableForLegalReasons: (o?: HttpErrorOptions) =>
    createHttpError(451, 'Unavailable For Legal Reasons', 'UNAVAILABLE_FOR_LEGAL_REASONS', o),

  // 5xx Server Errors
  internalServerError: (o?: HttpErrorOptions) =>
    createHttpError(500, 'Internal Server Error', 'INTERNAL_SERVER_ERROR', o),
  notImplemented: (o?: HttpErrorOptions) =>
    createHttpError(501, 'Not Implemented', 'NOT_IMPLEMENTED', o),
  badGateway: (o?: HttpErrorOptions) => createHttpError(502, 'Bad Gateway', 'BAD_GATEWAY', o),
  serviceUnavailable: (o?: HttpErrorOptions) =>
    createHttpError(503, 'Service Unavailable', 'SERVICE_UNAVAILABLE', o),
  gatewayTimeout: (o?: HttpErrorOptions) =>
    createHttpError(504, 'Gateway Timeout', 'GATEWAY_TIMEOUT', o),
  httpVersionNotSupported: (o?: HttpErrorOptions) =>
    createHttpError(505, 'HTTP Version Not Supported', 'HTTP_VERSION_NOT_SUPPORTED', o),
  variantAlsoNegotiates: (o?: HttpErrorOptions) =>
    createHttpError(506, 'Variant Also Negotiates', 'VARIANT_ALSO_NEGOTIATES', o),
  insufficientStorage: (o?: HttpErrorOptions) =>
    createHttpError(507, 'Insufficient Storage', 'INSUFFICIENT_STORAGE', o),
  loopDetected: (o?: HttpErrorOptions) => createHttpError(508, 'Loop Detected', 'LOOP_DETECTED', o),
  notExtended: (o?: HttpErrorOptions) => createHttpError(510, 'Not Extended', 'NOT_EXTENDED', o),
  networkAuthenticationRequired: (o?: HttpErrorOptions) =>
    createHttpError(511, 'Network Authentication Required', 'NETWORK_AUTHENTICATION_REQUIRED', o),
}

// Export individual functions for each error for better flexibility
/** Creates a 400 Bad Request error. */
export const BadRequest = (o?: HttpErrorOptions) => HttpErrors.badRequest(o)
/** Creates a 401 Unauthorized error. */
export const Unauthorized = (o?: HttpErrorOptions) => HttpErrors.unauthorized(o)
/** Creates a 402 Payment Required error. */
export const PaymentRequired = (o?: HttpErrorOptions) => HttpErrors.paymentRequired(o)
/** Creates a 403 Forbidden error. */
export const Forbidden = (o?: HttpErrorOptions) => HttpErrors.forbidden(o)
/** Creates a 404 Not Found error. */
export const NotFound = (o?: HttpErrorOptions) => HttpErrors.notFound(o)
/** Creates a 405 Method Not Allowed error. */
export const MethodNotAllowed = (o?: HttpErrorOptions) => HttpErrors.methodNotAllowed(o)
/** Creates a 406 Not Acceptable error. */
export const NotAcceptable = (o?: HttpErrorOptions) => HttpErrors.notAcceptable(o)
/** Creates a 407 Proxy Authentication Required error. */
export const ProxyAuthenticationRequired = (o?: HttpErrorOptions) =>
  HttpErrors.proxyAuthenticationRequired(o)
/** Creates a 408 Request Timeout error. */
export const RequestTimeout = (o?: HttpErrorOptions) => HttpErrors.requestTimeout(o)
/** Creates a 409 Conflict error. */
export const Conflict = (o?: HttpErrorOptions) => HttpErrors.conflict(o)
/** Creates a 410 Gone error. */
export const Gone = (o?: HttpErrorOptions) => HttpErrors.gone(o)
/** Creates a 411 Length Required error. */
export const LengthRequired = (o?: HttpErrorOptions) => HttpErrors.lengthRequired(o)
/** Creates a 412 Precondition Failed error. */
export const PreconditionFailed = (o?: HttpErrorOptions) => HttpErrors.preconditionFailed(o)
/** Creates a 413 Payload Too Large error. */
export const PayloadTooLarge = (o?: HttpErrorOptions) => HttpErrors.payloadTooLarge(o)
/** Creates a 414 URI Too Long error. */
export const UriTooLong = (o?: HttpErrorOptions) => HttpErrors.uriTooLong(o)
/** Creates a 415 Unsupported Media Type error. */
export const UnsupportedMediaType = (o?: HttpErrorOptions) => HttpErrors.unsupportedMediaType(o)
/** Creates a 416 Range Not Satisfiable error. */
export const RangeNotSatisfiable = (o?: HttpErrorOptions) => HttpErrors.rangeNotSatisfiable(o)
/** Creates a 417 Expectation Failed error. */
export const ExpectationFailed = (o?: HttpErrorOptions) => HttpErrors.expectationFailed(o)
/** Creates a 418 I'm a teapot error. */
export const ImATeapot = (o?: HttpErrorOptions) => HttpErrors.imATeapot(o)
/** Creates a 421 Misdirected Request error. */
export const MisdirectedRequest = (o?: HttpErrorOptions) => HttpErrors.misdirectedRequest(o)
/** Creates a 422 Unprocessable Entity error. */
export const UnprocessableEntity = (o?: HttpErrorOptions) => HttpErrors.unprocessableEntity(o)
/** Creates a 423 Locked error. */
export const Locked = (o?: HttpErrorOptions) => HttpErrors.locked(o)
/** Creates a 424 Failed Dependency error. */
export const FailedDependency = (o?: HttpErrorOptions) => HttpErrors.failedDependency(o)
/** Creates a 425 Too Early error. */
export const TooEarly = (o?: HttpErrorOptions) => HttpErrors.tooEarly(o)
/** Creates a 426 Upgrade Required error. */
export const UpgradeRequired = (o?: HttpErrorOptions) => HttpErrors.upgradeRequired(o)
/** Creates a 428 Precondition Required error. */
export const PreconditionRequired = (o?: HttpErrorOptions) => HttpErrors.preconditionRequired(o)
/** Creates a 429 Too Many Requests error. */
export const TooManyRequests = (o?: HttpErrorOptions) => HttpErrors.tooManyRequests(o)
/** Creates a 431 Request Header Fields Too Large error. */
export const RequestHeaderFieldsTooLarge = (o?: HttpErrorOptions) =>
  HttpErrors.requestHeaderFieldsTooLarge(o)
/** Creates a 451 Unavailable For Legal Reasons error. */
export const UnavailableForLegalReasons = (o?: HttpErrorOptions) =>
  HttpErrors.unavailableForLegalReasons(o)

/** Creates a 500 Internal Server Error error. */
export const InternalServerError = (o?: HttpErrorOptions) => HttpErrors.internalServerError(o)
/** Creates a 501 Not Implemented error. */
export const NotImplemented = (o?: HttpErrorOptions) => HttpErrors.notImplemented(o)
/** Creates a 502 Bad Gateway error. */
export const BadGateway = (o?: HttpErrorOptions) => HttpErrors.badGateway(o)
/** Creates a 503 Service Unavailable error. */
export const ServiceUnavailable = (o?: HttpErrorOptions) => HttpErrors.serviceUnavailable(o)
/** Creates a 504 Gateway Timeout error. */
export const GatewayTimeout = (o?: HttpErrorOptions) => HttpErrors.gatewayTimeout(o)
/** Creates a 505 HTTP Version Not Supported error. */
export const HttpVersionNotSupported = (o?: HttpErrorOptions) =>
  HttpErrors.httpVersionNotSupported(o)
/** Creates a 506 Variant Also Negotiates error. */
export const VariantAlsoNegotiates = (o?: HttpErrorOptions) => HttpErrors.variantAlsoNegotiates(o)
/** Creates a 507 Insufficient Storage error. */
export const InsufficientStorage = (o?: HttpErrorOptions) => HttpErrors.insufficientStorage(o)
/** Creates a 508 Loop Detected error. */
export const LoopDetected = (o?: HttpErrorOptions) => HttpErrors.loopDetected(o)
/** Creates a 510 Not Extended error. */
export const NotExtended = (o?: HttpErrorOptions) => HttpErrors.notExtended(o)
/** Creates a 511 Network Authentication Required error. */
export const NetworkAuthenticationRequired = (o?: HttpErrorOptions) =>
  HttpErrors.networkAuthenticationRequired(o)
