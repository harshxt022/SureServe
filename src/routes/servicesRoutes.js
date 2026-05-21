const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');

// GET /services endpoint
router.get('/', servicesController.getAllServices);

module.exports = router;
