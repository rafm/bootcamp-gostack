const express = require('express');

express()
    .use(express.json())
    .use(require('./src/routes'))
    .listen(3000);
