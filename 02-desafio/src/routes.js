import express from 'express';

export default express.Router()
    .get('/', (request, response) => response.send('Hello world!'));
