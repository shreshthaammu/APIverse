import { Router, Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import * as service from '../services/resourceService.js';
import { failure, success } from '../utils/response.js';
export const openapiRoutes = Router();
const run = (fn: (req: Request) => Promise<unknown>, status = 200) => async (req: Request, res: Response, next: NextFunction) => { try { if (!isValidObjectId(req.params.projectId)) return failure(res, 'Invalid project id', 'INVALID_ID', 400); success(res, await fn(req), status); } catch (e) { next(e); } };
openapiRoutes.get('/:projectId', run((r) => service.getOpenApi(r.params.projectId))); openapiRoutes.post('/:projectId', run((r) => service.saveOpenApi(r.params.projectId, r.body), 201));