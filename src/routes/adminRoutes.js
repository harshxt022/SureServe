const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const c = require('../controllers/adminController');

router.use(protect, requireAdmin);
router.get('/dashboard', c.getDashboardStats);
router.get('/users', c.listUsers);
router.get('/providers', c.listProviders);
router.post('/services', c.createService);
router.put('/services/:id', c.updateService);
router.delete('/services/:id', c.deleteService);

module.exports = router;
