const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

router.use(protect);

router.get('/:bookingId', chatController.getMessages);
router.post('/', chatController.sendMessage);

module.exports = router;
