const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { requireCustomer } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const v = require('../validators/bookingValidator');
const c = require('../controllers/bookingController');

router.use(protect);
router.post('/',           requireCustomer, validate(v.createBookingSchema), c.create);
router.get('/me',          requireCustomer, c.listMine);
router.get('/:id',         c.getOne);
router.patch('/:id/cancel', requireCustomer, c.cancel);

module.exports = router;
