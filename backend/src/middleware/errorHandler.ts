import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { failure } from '../utils/response.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    failure(res, error.issues.map((issue) => issue.message).join(', '), 'VALIDATION_ERROR', 400);
    return;
  }
  if (error?.name === 'CastError') {
    failure(res, 'Invalid resource id', 'INVALID_ID', 400);
    return;
  }
  console.error(error);
  failure(res, 'Internal server error', 'INTERNAL_ERROR', 500);
};