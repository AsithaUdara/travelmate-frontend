const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Location = require('../models/locationModel');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected for Seeder...');
};

const locations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'locations.json'), 'utf-8')
);

const importData = async () => {
  try {
    await connectDB();
    await Location.deleteMany();
    await Location.insertMany(locations);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Location.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data destruction:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
