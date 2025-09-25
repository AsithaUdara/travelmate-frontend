const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true }, // e.g., "5-Star Eco Hotel", "Luxury Villa Resort"
  location: { type: String, required: true, index: true }, // e.g., "Kandy", "Colombo"
  price: { type: Number, required: true },
  priceType: { type: String, default: 'night' },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  images: [{ type: String }], // Array of image URLs
  description: { type: String, default: '' },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  amenities: {
    wifi: { type: Boolean, default: false },
    pool: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Create a text index for searching by name and location
hotelSchema.index({ name: 'text', location: 'text' });

const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;