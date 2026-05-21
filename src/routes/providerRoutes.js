const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { requireProvider } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const v = require('../validators/bookingValidator');
const pb = require('../controllers/providerBookingController');
const av = require('../controllers/availabilityController');

router.use(protect, requireProvider);

// Bookings
router.get('/bookings',                      pb.list);
router.patch('/bookings/:id/accept',         pb.accept);
router.patch('/bookings/:id/reject',         validate(v.rejectSchema), pb.reject);
router.patch('/bookings/:id/start',          validate(v.startSchema), pb.start);
router.patch('/bookings/:id/complete',       pb.complete);

// Availability
router.get('/availability',                  av.getMyAvailability);
router.put('/availability',                  av.upsertAvailability);
router.post('/availability/blackout',        av.addBlackout);
router.patch('/availability/accepting',      av.toggleAccepting);

module.exports = router;
