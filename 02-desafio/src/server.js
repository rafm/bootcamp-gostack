import express from 'express';
import routes from './routes';

express()
    .use(express.json())
    .use(routes)
    .listen(3000);
