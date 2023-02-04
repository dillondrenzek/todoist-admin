import util from 'util';

export enum ErrorCode {
  BadRequest = 'BAD_REQUEST',
  InternalServerError = 'INTERNAL_SERVER_ERROR',
  Unauthorized = 'UNAUTHORIZED',
  Unknown = 'UNKNOWN',
}

const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.BadRequest]: 'Bad request.',
  [ErrorCode.InternalServerError]: '',
  [ErrorCode.Unauthorized]:
    'Client must authenticate to receive requested response.',
  [ErrorCode.Unknown]: 'Something went wrong',
};

export class AppError extends Error {
  constructor(public errorCode: ErrorCode) {
    super(errorMessages[errorCode]);
  }

  [util.inspect.custom](): string {
    return `[ERROR] ${this.errorCode} - ${this.message}${
      this.errorCode === ErrorCode.Unknown ? '\n' + this.stack : ''
    }`;
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(ErrorCode.Unauthorized);
  }
}
