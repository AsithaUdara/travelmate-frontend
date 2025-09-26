const mongoose = require('mongoose');
const { Schema } = mongoose;

// This defines the structure for a single activity within a day's itinerary.
// The `_id: false` option is important; it prevents MongoDB from creating a separate ID for each activity.
const ActivitySchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String },
  duration: { type: Number },
  cost: { type: Number },
  // Allow flexible booking details (accommodation/travel extras)
  bookingDetails: { type: Schema.Types.Mixed },
}, { _id: false });

// This defines the structure for a single day within a trip.
const ItineraryDaySchema = new Schema({
  day: { type: Number, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  title: { type: String },
  activities: [ActivitySchema],
  latitude: { type: Number },
  longitude: { type: Number },
  // Optional AI helper copy
  aiMessage: { type: String },
}, { _id: false });

// This is the main schema for the entire Trip.
const TripSchema = new mongoose.Schema({
  // This is the most critical field. It links this trip document
  // to a specific user in your 'users' collection.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // This tells Mongoose, "The value in this field is an ID from the User model."
  },
  name: {
    type: String,
    required: [true, 'Please add a trip name'],
    trim: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  days: [ItineraryDaySchema],
  coverImage: {
    type: String,
    trim: true,
  },
  interests: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// This creates the 'Trip' model from the schema and exports it.
// Mongoose will automatically create a collection named 'trips' in your database.
module.exports = mongoose.model('Trip', TripSchema);