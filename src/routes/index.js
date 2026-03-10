const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

router.get('/', (req, res) => {
  res.send('Welcome to SureServe API');
});

router.use('/auth', authRoutes);

module.exports = router;
