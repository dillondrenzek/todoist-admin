import express from 'express';
import { TodoistApi } from '@doist/todoist-api-typescript';
import { TodoistSyncApi } from '../lib/todoist/todoist-sync-api';
import { SnapshotController } from '../controllers/snapshot-controller';
import { todoistAccessToken } from '../middleware/todoist-access-token';
import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { AppError, ErrorCode } from '../lib/app-error';
import { isTodoistApiError } from '../lib/todoist/error';

export interface TodoistApiError {
  // status: error['httpStatusCode'];
  // // message: error['responseData'],
  httpStatusCode: number;
  responseData: unknown;
}

interface ApiError {
  code: ErrorCode;
  reason: string;
}

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
function getHttpStatusForAppError(err: AppError): HttpStatusCode {
  if (!err || !(err instanceof AppError)) {
    return HttpStatusCode.InternalServerError;
  }

  if (err instanceof AppError) {
    switch (err.errorCode) {
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
}

function parseAppError(err: unknown): AppError {
  if (err instanceof AppError) {
    return err;
  }

  if (isAxiosError(err)) {
    console.error('Axios error', err.toJSON());

    if (err.code === 'ERR_BAD_REQUEST') {
      return new AppError(ErrorCode.BadRequest);
    }

    return new AppError(ErrorCode.Unknown);
  }

  if (isTodoistApiError(err)) {
    console.error('Todoist Error', err);
  }

  return new AppError(ErrorCode.Unknown);
}

const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    const error = parseAppError(err);
    const httpStatus = getHttpStatusForAppError(error);
    const apiError: ApiError = getApiErrorFromAppError(err);

    console.error('Error handler', error);

    res.status(httpStatus).json(apiError);
  }

  next();
};

export default function apiController() {
  const api = express();

  // Gate authentication
  api.use(todoistAccessToken);

  api.get('/filter-snapshots', async (req, res, next) => {
    try {
      const accessToken = req.todoist_access_token;
      const controller = new SnapshotController(
        new TodoistApi(accessToken),
        new TodoistSyncApi(accessToken)
      );
      const response = await controller.getFilterSnapshots();

      res.status(200).send(response);
      return;
    } catch (error) {
      next(error);
    }
  });

  // Error Handling
  api.use(errorHandler);

  return api;
}
