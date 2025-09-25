const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/accBookingController');

// Route to create a new booking
router.post('/', createBooking);

module.exports = router;