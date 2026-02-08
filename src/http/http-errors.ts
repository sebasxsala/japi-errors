import { ApiError, type ApiErrorOptions } from '../core/api-error'

export type HttpErrorOptions = Partial<Omit<ApiErrorOptions, 'status' | 'title'>>

/**
 * Common factory for creating HTTP errors.
 * Exported to allow creating custom HTTP errors that follow the same pattern.
 */
export const createHttpError = (
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
    source: options.source,
    meta: options.meta,
    id: options.id,
    headers: options.headers,
    expose: options.expose,
    isOperational: options.isOperational,
    cause: options.cause,
  })
}

// 4xx Errors
/** 400 Bad Request error factory */
export const BadRequest = (options?: HttpErrorOptions) =>
  createHttpError(400, 'Bad Request', 'BAD_REQUEST', options)

/** 401 Unauthorized error factory */
export const Unauthorized = (options?: HttpErrorOptions) =>
  createHttpError(401, 'Unauthorized', 'UNAUTHORIZED', options)

/** 402 Payment Required error factory */
export const PaymentRequired = (options?: HttpErrorOptions) =>
  createHttpError(402, 'Payment Required', 'PAYMENT_REQUIRED', options)

/** 403 Forbidden error factory */
export const Forbidden = (options?: HttpErrorOptions) =>
  createHttpError(403, 'Forbidden', 'FORBIDDEN', options)

/** 404 Not Found error factory */
export const NotFound = (options?: HttpErrorOptions) =>
  createHttpError(404, 'Not Found', 'NOT_FOUND', options)

export const MethodNotAllowed = (options?: HttpErrorOptions) =>
  createHttpError(405, 'Method Not Allowed', 'METHOD_NOT_ALLOWED', options)

export const NotAcceptable = (options?: HttpErrorOptions) =>
  createHttpError(406, 'Not Acceptable', 'NOT_ACCEPTABLE', options)

export const ProxyAuthenticationRequired = (options?: HttpErrorOptions) =>
  createHttpError(407, 'Proxy Authentication Required', 'PROXY_AUTHENTICATION_REQUIRED', options)

export const RequestTimeout = (options?: HttpErrorOptions) =>
  createHttpError(408, 'Request Timeout', 'REQUEST_TIMEOUT', options)

/** 409 Conflict error factory */
export const Conflict = (options?: HttpErrorOptions) =>
  createHttpError(409, 'Conflict', 'CONFLICT', options)

export const Gone = (options?: HttpErrorOptions) => createHttpError(410, 'Gone', 'GONE', options)

export const LengthRequired = (options?: HttpErrorOptions) =>
  createHttpError(411, 'Length Required', 'LENGTH_REQUIRED', options)

export const PreconditionFailed = (options?: HttpErrorOptions) =>
  createHttpError(412, 'Precondition Failed', 'PRECONDITION_FAILED', options)

export const PayloadTooLarge = (options?: HttpErrorOptions) =>
  createHttpError(413, 'Payload Too Large', 'PAYLOAD_TOO_LARGE', options)

export const UriTooLong = (options?: HttpErrorOptions) =>
  createHttpError(414, 'URI Too Long', 'URI_TOO_LONG', options)

export const UnsupportedMediaType = (options?: HttpErrorOptions) =>
  createHttpError(415, 'Unsupported Media Type', 'UNSUPPORTED_MEDIA_TYPE', options)

export const RangeNotSatisfiable = (options?: HttpErrorOptions) =>
  createHttpError(416, 'Range Not Satisfiable', 'RANGE_NOT_SATISFIABLE', options)

export const ExpectationFailed = (options?: HttpErrorOptions) =>
  createHttpError(417, 'Expectation Failed', 'EXPECTATION_FAILED', options)

export const ImATeapot = (options?: HttpErrorOptions) =>
  createHttpError(418, "I'm a teapot", 'IM_A_TEAPOT', options)

export const MisdirectedRequest = (options?: HttpErrorOptions) =>
  createHttpError(421, 'Misdirected Request', 'MISDIRECTED_REQUEST', options)

/** 422 Unprocessable Entity error factory */
export const UnprocessableEntity = (options?: HttpErrorOptions) =>
  createHttpError(422, 'Unprocessable Entity', 'UNPROCESSABLE_ENTITY', options)

export const Locked = (options?: HttpErrorOptions) =>
  createHttpError(423, 'Locked', 'LOCKED', options)

export const FailedDependency = (options?: HttpErrorOptions) =>
  createHttpError(424, 'Failed Dependency', 'FAILED_DEPENDENCY', options)

export const TooEarly = (options?: HttpErrorOptions) =>
  createHttpError(425, 'Too Early', 'TOO_EARLY', options)

export const UpgradeRequired = (options?: HttpErrorOptions) =>
  createHttpError(426, 'Upgrade Required', 'UPGRADE_REQUIRED', options)

export const PreconditionRequired = (options?: HttpErrorOptions) =>
  createHttpError(428, 'Precondition Required', 'PRECONDITION_REQUIRED', options)

export const TooManyRequests = (options?: HttpErrorOptions) =>
  createHttpError(429, 'Too Many Requests', 'TOO_MANY_REQUESTS', options)

export const RequestHeaderFieldsTooLarge = (options?: HttpErrorOptions) =>
  createHttpError(
    431,
    'Request Header Fields Too Large',
    'REQUEST_HEADER_FIELDS_TOO_LARGE',
    options,
  )

export const UnavailableForLegalReasons = (options?: HttpErrorOptions) =>
  createHttpError(451, 'Unavailable For Legal Reasons', 'UNAVAILABLE_FOR_LEGAL_REASONS', options)

// 5xx Errors
/** 500 Internal Server Error error factory */
export const InternalServerError = (options?: HttpErrorOptions) =>
  createHttpError(500, 'Internal Server Error', 'INTERNAL_SERVER_ERROR', options)

export const NotImplemented = (options?: HttpErrorOptions) =>
  createHttpError(501, 'Not Implemented', 'NOT_IMPLEMENTED', options)

export const BadGateway = (options?: HttpErrorOptions) =>
  createHttpError(502, 'Bad Gateway', 'BAD_GATEWAY', options)

/** 503 Service Unavailable error factory */
export const ServiceUnavailable = (options?: HttpErrorOptions) =>
  createHttpError(503, 'Service Unavailable', 'SERVICE_UNAVAILABLE', options)

export const GatewayTimeout = (options?: HttpErrorOptions) =>
  createHttpError(504, 'Gateway Timeout', 'GATEWAY_TIMEOUT', options)

export const HttpVersionNotSupported = (options?: HttpErrorOptions) =>
  createHttpError(505, 'HTTP Version Not Supported', 'HTTP_VERSION_NOT_SUPPORTED', options)

export const VariantAlsoNegotiates = (options?: HttpErrorOptions) =>
  createHttpError(506, 'Variant Also Negotiates', 'VARIANT_ALSO_NEGOTIATES', options)

export const InsufficientStorage = (options?: HttpErrorOptions) =>
  createHttpError(507, 'Insufficient Storage', 'INSUFFICIENT_STORAGE', options)

export const LoopDetected = (options?: HttpErrorOptions) =>
  createHttpError(508, 'Loop Detected', 'LOOP_DETECTED', options)

export const NotExtended = (options?: HttpErrorOptions) =>
  createHttpError(510, 'Not Extended', 'NOT_EXTENDED', options)

export const NetworkAuthenticationRequired = (options?: HttpErrorOptions) =>
  createHttpError(
    511,
    'Network Authentication Required',
    'NETWORK_AUTHENTICATION_REQUIRED',
    options,
  )

/**
 * Object containing all HTTP error factories.
 * Note: Using this object will disable tree-shaking for all individual HTTP error factories.
 * For better tree-shaking, import individual error factories instead.
 */
export const HttpErrors = {
  badRequest: BadRequest,
  unauthorized: Unauthorized,
  paymentRequired: PaymentRequired,
  forbidden: Forbidden,
  notFound: NotFound,
  methodNotAllowed: MethodNotAllowed,
  notAcceptable: NotAcceptable,
  proxyAuthenticationRequired: ProxyAuthenticationRequired,
  requestTimeout: RequestTimeout,
  conflict: Conflict,
  gone: Gone,
  lengthRequired: LengthRequired,
  preconditionFailed: PreconditionFailed,
  payloadTooLarge: PayloadTooLarge,
  uriTooLong: UriTooLong,
  unsupportedMediaType: UnsupportedMediaType,
  rangeNotSatisfiable: RangeNotSatisfiable,
  expectationFailed: ExpectationFailed,
  imATeapot: ImATeapot,
  misdirectedRequest: MisdirectedRequest,
  unprocessableEntity: UnprocessableEntity,
  locked: Locked,
  failedDependency: FailedDependency,
  tooEarly: TooEarly,
  upgradeRequired: UpgradeRequired,
  preconditionRequired: PreconditionRequired,
  tooManyRequests: TooManyRequests,
  requestHeaderFieldsTooLarge: RequestHeaderFieldsTooLarge,
  unavailableForLegalReasons: UnavailableForLegalReasons,
  internalServerError: InternalServerError,
  notImplemented: NotImplemented,
  badGateway: BadGateway,
  serviceUnavailable: ServiceUnavailable,
  gatewayTimeout: GatewayTimeout,
  httpVersionNotSupported: HttpVersionNotSupported,
  variantAlsoNegotiates: VariantAlsoNegotiates,
  insufficientStorage: InsufficientStorage,
  loopDetected: LoopDetected,
  notExtended: NotExtended,
  networkAuthenticationRequired: NetworkAuthenticationRequired,
} as const
