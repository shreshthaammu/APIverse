import { RequestHandler } from 'express';
import { failure } from '../utils/response.js';

export const notFound: RequestHandler = (_req, res) => {
  failure(res, 'Route not found', 'NOT_FOUND', 404);
};