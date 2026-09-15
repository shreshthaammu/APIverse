import { RequestHandler } from 'express';
import { ZodType } from 'zod';

export const validateBody = (schema: ZodType): RequestHandler => (req, _res, next) => {
  req.body = schema.parse(req.body);
  next();
};