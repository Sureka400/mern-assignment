const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { isBookOwner } = require('../middleware/ownership');
const bookController = require('../controllers/bookController');

router.post('/', protect, bookController.createBook);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', protect, isBookOwner, bookController.updateBook);
router.delete('/:id', protect, isBookOwner, bookController.deleteBook);

module.exports = router;