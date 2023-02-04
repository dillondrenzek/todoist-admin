import express from 'express';

export function getBearerToken(req: express.Request) {
  if (!req?.headers?.authorization) {
    return null;
  }
  const splitHeader = req.headers.authorization.split(' ');
  if (splitHeader[0] === 'Bearer') {
    return splitHeader[1];
  }
  return null;
}
