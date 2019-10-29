import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

// Router() = new Router()
// call constructor/function and returns an object with the defined functions and attributes of the class
const routes = new Router();
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // This middleware will be applied only to the next declared routes, not to the previous ones.

routes.put('/users', UserController.update);

export default routes;
