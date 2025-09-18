const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri || uri.includes('YOUR_PASSWORD_HERE')) {
      console.warn('MONGO_URI is missing or still contains the placeholder password. Skipping DB connection.');
      return;
    }

    await mongoose.connect(uri);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
