const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { requireCustomer, requireProvider } = require('../middleware/roleMiddleware');
const c = require('../controllers/dashboardController');

router.get('/customer/dashboard', protect, requireCustomer, c.customerDashboard);
router.get('/provider/dashboard', protect, requireProvider, c.providerDashboard);

module.exports = router;
