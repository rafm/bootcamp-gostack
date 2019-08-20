const express = require('express');
const router = express.Router();
const ProjectController = require('./controller/ProjectController');

router
    .get('/projects', ProjectController.findAll);

module.exports = router;
