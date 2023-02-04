import express from 'express';

export const logRequests: express.RequestHandler = (req, res, next) => {
  console.log(`[${req.method.toUpperCase()}] ${req.path}`);
  next();
};
