import express from 'express';
import { ErrorCode } from '../lib/error';
import { HttpStatusCode } from '../lib/http';

declare module 'express-serve-static-core' {
  interface Request {
    /**
     * Access token to be used with Todoist
     */
    todoist_access_token?: string;
  }
}

function getBearerToken(req: express.Request) {
  if (!req?.headers?.authorization) {
    return null;
  }
  const splitHeader = req.headers.authorization.split(' ');
  if (splitHeader[0] === 'Bearer') {
    return splitHeader[1];
  }
  return null;
}

/**
 * Middleware that checks for the Todoist access token from the client request
 *
 * Responds with `UNAUTHORIZED` error if it doesn't exist
 */
export function todoistAccessToken(): express.RequestHandler {
  return function (req, res, next) {
    req.todoist_access_token = getBearerToken(req);

    if (!req.todoist_access_token) {
      res.status(HttpStatusCode.Unauthorized).json({
        status: HttpStatusCode.Unauthorized,
        code: ErrorCode.Unauthorized,
      });
      return;
    }
    next();
  };
}
