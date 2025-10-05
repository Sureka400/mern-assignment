const Review = require('../models/Review');
const Book = require('../models/Book');

// Add or update review (allow update separate endpoint too)
exports.addReview = async (req, res) => {
  const { bookId, rating, reviewText } = req.body;
  const userId = req.user._id;

  // optional: prevent multiple reviews by same user
  let review = await Review.findOne({ bookId, userId });
  if (review) {
    review.rating = rating;
    review.reviewText = reviewText;
    await review.save();
  } else {
    review = await Review.create({ bookId, userId, rating, reviewText });
  }

  // update book aggregate fields (avg, count)
  const reviews = await Review.find({ bookId });
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await Book.findByIdAndUpdate(bookId, { avgRating: avg, reviewsCount: reviews.length });

  res.status(201).json(review);
};

exports.getReviewsForBook = async (req, res) => {
  const reviews = await Review.find({ bookId: req.params.bookId }).populate('userId', 'name');
  res.json(reviews);
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await review.remove();

  // update book aggregates
  const reviews = await Review.find({ bookId: review.bookId });
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) : 0;
  await Book.findByIdAndUpdate(review.bookId, { avgRating: avg, reviewsCount: reviews.length });

  res.json({ message: 'Review deleted' });
};
