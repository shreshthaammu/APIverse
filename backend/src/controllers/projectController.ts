import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import * as service from '../services/projectService.js';
import { isDemoMode } from '../config/demoData.js';
import { failure, success } from '../utils/response.js';
const valid = (id: string) => isDemoMode() || isValidObjectId(id);
const badId = (res: Response) => failure(res, 'Invalid project id', 'INVALID_ID', 400);
export async function create(req: Request, res: Response, next: NextFunction) { try { success(res, await service.createProject(req.body), 201); } catch (e) { next(e); } }
export async function list(_req: Request, res: Response, next: NextFunction) { try { success(res, await service.listProjects()); } catch (e) { next(e); } }
export async function get(req: Request, res: Response, next: NextFunction) { try { if (!valid(req.params.id)) return badId(res); const item = await service.getProject(req.params.id); item ? success(res, item) : failure(res, 'Project not found', 'PROJECT_NOT_FOUND', 404); } catch (e) { next(e); } }
export async function update(req: Request, res: Response, next: NextFunction) { try { if (!valid(req.params.id)) return badId(res); const item = await service.updateProject(req.params.id, req.body); item ? success(res, item) : failure(res, 'Project not found', 'PROJECT_NOT_FOUND', 404); } catch (e) { next(e); } }
export async function remove(req: Request, res: Response, next: NextFunction) { try { if (!valid(req.params.id)) return badId(res); const item = await service.deleteProject(req.params.id); item ? success(res, item) : failure(res, 'Project not found', 'PROJECT_NOT_FOUND', 404); } catch (e) { next(e); } }