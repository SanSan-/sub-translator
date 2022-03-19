export enum ResponseStatus {
  _200 = 200,
  _299 = 299,
  _400 = 400,
  _401 = 401,
  _403 = 403,
  _404 = 404,
  _599 = 599
}

export enum Headers {
  CONTENT_LENGTH = 'Content-Length',
  CONTENT_TYPE = 'Content-Type',
  USER_AGENT = 'User-Agent',
  ACCESS_CONTROL_ALLOW_ORIGIN = 'Access-Control-Allow-Origin',
  AUTHORIZATION = 'Authorization',
  STRICT_TRANSPORT_SECURITY = 'Strict-Transport-Security',
  CONTENT_SECURITY_POLICY = 'Content-Security-Policy',
  CONTENT_DISPOSITION = 'Content-Disposition'
}

export enum HeaderContent {
  ATTACHMENT_FILE = 'data:attachment/file;',
  FILENAME = 'filename="',
  FILENAME_END = '";',
  BEARER = 'Bearer',
  MAX_AGE = 'max-age=31536000; includeSubDomains',
  DEFAULT_SRC_SELF = 'default-src self;',
  ORIGIN_LIST = 'origin-list'
}

export enum Method {
  GET = 'GET',
  POST = 'POST',
  HEAD = 'HEAD'
}

export enum RequestCredentials {
  SAME_ORIGIN = 'same-origin',
  INCLUDE = 'include',
  OMIT = 'omit'
}

export enum RequestMode {
  SAME_ORIGIN = 'same-origin',
  CORS = 'cors',
  NO_CORS = 'no-cors',
  NAVIGATE = 'navigate'
}

export enum ContentType {
  HTML = 'text/html',
  PLAIN = 'text/plain',
  PLAIN_UTF8 = 'text/plain;charset=utf-8',
  ASS_UTF8 = 'text/ass;charset=utf-8',
  SRT_UTF8 = 'text/srt;charset=utf-8',
  VTT_UTF8 = 'text/vtt;charset=utf-8',
  CSV = 'text/csv;charset=utf-8',
  JSON = 'application/json;charset=utf-8',
  XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  OCTET_STREAM = 'application/octet-stream',
  URL_ENCODED_UTF_8 = 'application/x-www-form-urlencoded;charset=utf-8'
}

export enum Elements {
  IFRAME = 'iframe',
  TEXTAREA = 'textarea'
}

export enum Document {
  COMMAND_COPY = 'copy'
}

export enum DispositionType {
  ATTACHMENT = 'attachment'
}
