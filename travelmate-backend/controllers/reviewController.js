const Review = require('../models/Review');
const Hotel = require('../models/Hotel');

// @desc    Get all reviews for a specific hotel
// @route   GET /api/accommodations/:hotelId/reviews
// @access  Public
exports.getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hotel: req.params.hotelId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new review for a hotel
// @route   POST /api/accommodations/:hotelId/reviews
// @access  Private (for now, public for simplicity)
exports.createHotelReview = async (req, res) => {
  try {
    const { name, rating, text } = req.body;
    
    const reviewData = {
      hotel: req.params.hotelId,
      name,
      rating: Number(rating),
      text,
    };

    const newReview = new Review(reviewData);
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);

  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
};