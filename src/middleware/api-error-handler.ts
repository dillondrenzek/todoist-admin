import express from 'express';
import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { AppError, ErrorCode } from '../lib/app-error';
import { isTodoistApiError } from '../lib/todoist/error';
import { AppEnvironment } from '../env';

interface ApiError {
  code: ErrorCode;
  reason: string;
}

/**
 * @deprecated why does this function exist?
 */
function getApiErrorFromAppError(err: AppError): ApiError {
  return {
    code: err.errorCode,
    reason: err.message,
  };
}

/**
 * Returns an HTTP status code given an error code
 * @param err AppError
 * @returns Http status code
 */
function getHttpStatusForApiError(err: ApiError): HttpStatusCode {
  if (!err) {
    return HttpStatusCode.InternalServerError;
  }

  switch (err.code) {
    case ErrorCode.BadRequest:
      // 400
      return HttpStatusCode.BadRequest;

    case ErrorCode.Unauthorized:
      // 401
      return HttpStatusCode.Unauthorized;

    case ErrorCode.Unknown:
    case ErrorCode.InternalServerError:
    default:
      // 500
      return HttpStatusCode.InternalServerError;
  }
}

/**
 * @deprecated Move this logic to `parseApiError`
 */
function parseAppError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  // Axios
  if (isAxiosError(err)) {
    console.error('Axios error', err.toJSON());

    if (err.code === 'ERR_BAD_REQUEST') {
      return new AppError(ErrorCode.BadRequest);
    }

    // TODO
    console.error('Unhandled Axios Error', err);
  }

  // Todoist API
  if (isTodoistApiError(err)) {
    // TODO
    console.error('Unhandled Todoist Error', err);
  }

  return new AppError(ErrorCode.Unknown);
}

function parseApiError(err: unknown): ApiError {
  const appError = parseAppError(err);
  return getApiErrorFromAppError(appError);
}

const apiErrorHandler: (env: AppEnvironment) => express.ErrorRequestHandler =
  (env: AppEnvironment) => (err, req, res, next) => {
    if (err) {
      const apiError = parseApiError(err);
      const httpStatus = getHttpStatusForApiError(apiError);

      if (env.DEBUG) {
        console.error('Error handler:', err);
        console.error(' - API Error', apiError);
        console.error(' - HTTP Status', apiError);
      }

      res.status(httpStatus).json(apiError);
    } else {
      next();
    }
  };

export default apiErrorHandler;
