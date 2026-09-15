import { Router } from 'express';
import * as controller from '../controllers/apiController.js';
export const apiRoutes = Router({ mergeParams: true });
apiRoutes.get('/', controller.list); apiRoutes.post('/', controller.create); apiRoutes.get('/:apiId', controller.get); apiRoutes.put('/:apiId', controller.update); apiRoutes.delete('/:apiId', controller.remove);