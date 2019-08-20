const express = require('express');

express()
    .use(require('./src/routes'))
    .listen(3000);
