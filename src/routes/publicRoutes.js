const express = require('express');
const router = express.Router();
const c = require('../controllers/publicController');

// Public endpoints
router.get('/providers', c.getProviders);
router.get('/providers/:id', c.getProviderById);

module.exports = router;
