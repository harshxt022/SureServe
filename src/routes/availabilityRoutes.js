const express = require('express');
const router = express.Router();
const c = require('../controllers/availabilityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/me', protect, c.getMyAvailability);
router.put('/me', protect, c.upsertAvailability);
router.post('/me/blackout', protect, c.addBlackout);
router.post('/me/accepting', protect, c.toggleAccepting);

module.exports = router;
