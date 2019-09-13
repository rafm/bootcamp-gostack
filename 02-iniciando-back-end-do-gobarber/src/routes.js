import { Router } from 'express';

// Router() = new Router()
// call constructor/function and returns an object with the defined functions and attributes of the class
const routes = new Router();
routes.get('/', (request, response) => response.send('Hello world!'));

export default routes;
