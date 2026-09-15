import { Router } from 'express';
import * as controller from '../controllers/projectController.js';
import { validateBody } from '../middleware/validateRequest.js';
import { z } from 'zod';
const projectInput = z.object({ name: z.string().min(1), repositoryUrl: z.string().url(), branch: z.string().min(1), framework: z.string().min(1), language: z.string().min(1) }).strict();
export const projectRoutes = Router();
projectRoutes.post('/', validateBody(projectInput), controller.create);
projectRoutes.get('/', controller.list); projectRoutes.get('/:id', controller.get); projectRoutes.put('/:id', validateBody(projectInput.partial()), controller.update); projectRoutes.delete('/:id', controller.remove);