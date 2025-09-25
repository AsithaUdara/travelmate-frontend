// const express = require('express');
// const router = express.Router();
// const { 
//     getAccommodations, 
//     getAccommodationById,
//     createHotel,       // Import new function
//     updateHotel,       // Import new function
//     deleteHotel        // Import new function
// } = require('../controllers/accommodationController');

// // Route to get all accommodations with filters
// router.get('/', getAccommodations);
// router.get('/:id', getAccommodationById);

// router.post('/admin', createHotel);
// router.put('/admin/:id', updateHotel);
// router.delete('/admin/:id', deleteHotel);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { 
    getAccommodations, 
    getAccommodationById,
    createHotel,
    updateHotel,
    deleteHotel
} = require('../controllers/accommodationController');

// --- FIX: Import the review controller functions ---
const { getHotelReviews, createHotelReview } = require('../controllers/reviewController');

// --- PUBLIC ROUTES ---
router.get('/', getAccommodations);
router.get('/:id', getAccommodationById);

// --- REVIEW ROUTES ---
// This section will now work correctly
router.route('/:hotelId/reviews')
  .get(getHotelReviews)
  .post(createHotelReview);

// --- ADMIN ROUTES ---
router.post('/admin', createHotel);
router.put('/admin/:id', updateHotel);
router.delete('/admin/:id', deleteHotel);

module.exports = router;