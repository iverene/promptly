import { Router } from 'express';
import { folderController } from '../controllers/folder.controller.js';
import { categoryController } from '../controllers/category.controller.js';
import { promptController } from '../controllers/prompt.controller.js';
import { asyncHandler } from '../lib/http.js';
import { validate } from '../middleware/validate.js';
import { idParams, folderCreate, folderUpdate, categoryCreate, categoryUpdate, promptCreate, promptUpdate } from '../validators/index.js';

const router = Router();
const resource = (path, controller, createSchema, updateSchema) => {
  router.get(path, asyncHandler(controller.list));
  router.get(`${path}/:id`, validate(idParams, 'params'), asyncHandler(controller.get));
  router.post(path, validate(createSchema), asyncHandler(controller.create));
  router.patch(`${path}/:id`, validate(idParams, 'params'), validate(updateSchema), asyncHandler(controller.update));
  router.delete(`${path}/:id`, validate(idParams, 'params'), asyncHandler(controller.remove));
};

resource('/folders', folderController, folderCreate, folderUpdate);
resource('/categories', categoryController, categoryCreate, categoryUpdate);
resource('/prompts', promptController, promptCreate, promptUpdate);

export default router;

