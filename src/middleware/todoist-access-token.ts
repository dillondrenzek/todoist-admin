import express from 'express';
import { UnauthorizedError } from '../lib/error';

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
export const todoistAccessToken: express.RequestHandler = (req, res, next) => {
  const accessToken = getBearerToken(req);

  if (!accessToken) {
    next(new UnauthorizedError());
  } else {
    req.todoist_access_token = accessToken;
    next();
  }
};
