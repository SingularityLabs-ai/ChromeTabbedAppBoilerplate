export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  MISSING_HOST_PERMISSION = 'MISSING_HOST_PERMISSION',
  CONVERSATION_LIMIT = 'CONVERSATION_LIMIT',
  UNKOWN_ERROR = 'UNKOWN_ERROR',
  GOOGLETRANSLATE_EMPTY_RESPONSE = 'GOOGLETRANSLATE_EMPTY_RESPONSE'
}

export class ChatError extends Error {
  code: ErrorCode
  constructor(message: string, code: ErrorCode) {
    super(message)
    this.code = code
  }
}
