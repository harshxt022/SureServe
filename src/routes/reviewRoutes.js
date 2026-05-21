const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { requireCustomer } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const v = require('../validators/reviewValidator');
const c = require('../controllers/reviewController');

router.get('/provider/:providerId', c.getProviderReviews);
router.post('/', protect, requireCustomer, validate(v.submitReviewSchema), c.submitReview);

module.exports = router;
