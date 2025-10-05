const router = require('express').Router();
const { protect } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

router.post('/', protect, reviewController.addReview);
router.get('/book/:bookId', reviewController.getReviewsForBook);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;