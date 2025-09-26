const express = require('express');
const router = express.Router();
const { createTrip, getMyTrips, getTripById, updateTrip } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to ALL routes defined in this file.
// This means a user must provide a valid Firebase ID token to access any of these endpoints.
router.use(protect);

// Handle POST requests to /api/trips/
// Handle GET requests to /api/trips/mytrips
router.route('/mytrips').get(getMyTrips);
router.route('/').post(createTrip);

// Handle GET requests to /api/trips/:id (where :id is a variable)
router.route('/:id').get(getTripById).put(updateTrip);

module.exports = router;