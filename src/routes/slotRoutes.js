const router = require('express').Router();
const c = require('../controllers/slotController');
router.get('/providers/:id/slots', c.getSlotsForDate);
router.get('/providers/:id/slots/range', c.getSlotsForRange);
module.exports = router;
