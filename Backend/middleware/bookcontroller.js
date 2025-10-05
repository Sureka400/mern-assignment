const Book = require('../models/Book');
const Review = require('../models/Review');

// Create book
exports.createBook = async (req, res) => {
  const { title, author, description, genre, year } = req.body;
  const book = await Book.create({ title, author, description, genre, year, addedBy: req.user._id });
  res.status(201).json(book);
};

// Get books list with pagination, optional search/filter
exports.getBooks = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = 5;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    const q = req.query.search;
    filter.$or = [{ title: { $regex: q, $options: 'i' } }, { author: { $regex: q, $options: 'i' } }];
  }
  if (req.query.genre) filter.genre = req.query.genre;

  const total = await Book.countDocuments(filter);
  const books = await Book.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip).limit(limit)
    .populate('addedBy', 'name');

  res.json({
    page,
    totalPages: Math.ceil(total / limit),
    total,
    books
  });
};

// Get book details with reviews and average rating
exports.getBookById = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id).populate('addedBy', 'name email');
  if (!book) return res.status(404).json({ message: 'Book not found' });

  // fetch reviews
  const reviews = await Review.find({ bookId: id }).populate('userId', 'name');
  // compute avg rating
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;

  res.json({ book, reviews, avgRating: +avg.toFixed(2), reviewsCount: reviews.length });
};

// Update & Delete (only owner) - ownership middleware used in route
exports.updateBook = async (req, res) => {
  const updates = req.body;
  const book = req.book;
  Object.assign(book, updates);
  await book.save();
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  const book = req.book;
  await book.remove();
  // delete associated reviews
  await Review.deleteMany({ bookId: book._id });
  res.json({ message: 'Book deleted' });
};