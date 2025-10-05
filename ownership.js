const Book = require('../models/Book');

exports.isBookOwner = async (req, res, next) => {
  const bookId = req.params.id;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (book.addedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden: not owner' });
  }
  req.book = book;
  next();
};