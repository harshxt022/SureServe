const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const c = require('../controllers/notificationController');

router.use(protect);
router.get('/', c.list);
router.patch('/:id/read', c.markRead);
router.patch('/read-all', c.markAllRead);

module.exports = router;
