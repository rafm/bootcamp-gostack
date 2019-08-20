const express = require('express');
let requestCount = 0;

express()
    .use(express.json())
    .use((request, response, next) => {
        console.log(`Request number: ${++requestCount}`);
        return next();
    })
    .use(require('./src/routes'))
    .listen(3000);
