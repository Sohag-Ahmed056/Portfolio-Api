import type { ErrorRequestHandler } from 'express';
import ApiError from '../errors/ApiError.js';

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  const expected = error instanceof ApiError;
  if (!expected) console.error('Request failed:', error);
  res.status(expected ? error.statusCode : 500).json({
    success: false,
    message: expected ? error.message : 'An unexpected server error occurred.',
  });
};
