// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Import controller functions
const { registerUser, loginUser, socialLogin } = require('../controllers/authController');

// Define the route
// POST request to /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

// POST /api/auth/social-login
router.post('/social-login', socialLogin);

module.exports = router;