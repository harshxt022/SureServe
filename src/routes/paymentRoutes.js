const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const c = require('../controllers/paymentController');

router.use(protect);

router.post('/create-order', c.createOrder);
router.post('/verify', c.verifyPayment);
router.get('/invoice/:bookingId', c.getInvoice);

module.exports = router;
