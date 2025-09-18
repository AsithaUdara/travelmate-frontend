// models/userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // This is the UNIQUE ID from Firebase Authentication.
  // It's the master key that links our database user to the Firebase user.
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You can add more fields here later, like profilePicture, savedTrips, etc.
});

// The first argument 'User' is the singular name of the collection.
// Mongoose automatically looks for the plural, lowercased version 'users'.
module.exports = mongoose.model('User', UserSchema);