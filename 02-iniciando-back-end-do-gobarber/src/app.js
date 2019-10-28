import express from 'express'; // const express = require('express');
import routes from './routes'; // const routes = require('./routes');

import './database';    // When you won't gonna store the import value, you don't need to use the from keyword,
                        // in this case, we just need to run the models mapping logic.
                        // Also, want to import a file/js which its name is "index.js", you don't need to pass
                        // the file name, only the package name.

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server; // module.exports = new App().server;
