const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    index: true,
  },
  name: { type: String, required: true }, // In a real app, this might be a user ID
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

// Middleware to recalculate a hotel's average rating after a review is saved
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.hotel);
});

// Middleware to recalculate after a review is deleted
reviewSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.hotel);
});

// Static method to perform the calculation
reviewSchema.statics.calculateAverageRating = async function(hotelId) {
  const stats = await this.aggregate([
    {
      $match: { hotel: hotelId }
    },
    {
      $group: {
        _id: '$hotel',
        reviewCount: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Hotel').findByIdAndUpdate(hotelId, {
        reviews: stats[0].reviewCount,
        rating: stats[0].avgRating.toFixed(1) // Round to one decimal place
      });
    } else {
      // If no reviews exist, reset to defaults
      await mongoose.model('Hotel').findByIdAndUpdate(hotelId, {
        reviews: 0,
        rating: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;