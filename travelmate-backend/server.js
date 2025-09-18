const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/db');
const admin = require('firebase-admin');

// Load env vars from .env file explicitly from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });
console.log('[env] PORT:', process.env.PORT || '(default 5000)');
console.log('[env] MONGO_URI present:', !!process.env.MONGO_URI);
console.log('[env] FIREBASE_WEB_API_KEY present:', !!process.env.FIREBASE_WEB_API_KEY);

// --- INITIALIZE FIREBASE ADMIN SDK ---
try {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase Admin SDK Initialized...');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1); // Exit if Firebase Admin fails to initialize
}
// ------------------------------------

// Connect to MongoDB Atlas database
connectDB();

const app = express();

// --- MIDDLEWARE ---
// Enable Cross-Origin Resource Sharing to allow your frontend to make requests
app.use(cors());
// Allow the server to accept and parse JSON in request bodies
app.use(express.json());
// --------------------

// --- API ROUTES ---
// Root endpoint for basic server status check
app.get('/', (req, res) => {
    res.send('TravelMate API is running...');
});

// Development-only env check (does not expose actual values)
if (process.env.NODE_ENV !== 'production') {
  app.get('/_debug/env', (req, res) => {
    res.json({
      port: process.env.PORT || '5000',
      mongoUriPresent: !!process.env.MONGO_URI,
      firebaseWebApiKeyPresent: !!process.env.FIREBASE_WEB_API_KEY,
      nodeEnv: process.env.NODE_ENV || 'development',
    });
  });
}

// This line tells the server that any request starting with "/api/auth"
// should be handled by the routes defined in './routes/authRoutes.js'
app.use('/api/auth', require('./routes/authRoutes'));

// You will add more routes here as your application grows
// Example: app.use('/api/trips', require('./routes/tripRoutes'));
// --------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));