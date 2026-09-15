import { Router } from 'express';
import * as controller from '../controllers/changeController.js';
export const changeRoutes = Router({ mergeParams: true });
changeRoutes.get('/', controller.list); changeRoutes.post('/', controller.create); changeRoutes.get('/:changeId', controller.get);