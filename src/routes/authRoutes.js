const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register/user', authController.registerUser);
router.post('/register/provider', authController.registerProvider);
router.post('/login', authController.login);

module.exports = router;
