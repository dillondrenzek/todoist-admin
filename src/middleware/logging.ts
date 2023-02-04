import express from 'express';

/**
 * App logging function
 */
export const logRequests: express.RequestHandler = (req, res, next) => {
  console.log(`[${req.method.toUpperCase()}] ${req.path}`);
  next();
};
