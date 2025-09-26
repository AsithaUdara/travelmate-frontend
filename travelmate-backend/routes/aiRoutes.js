const express = require('express');
const router = express.Router();
const { generateTrip, getSuggestions, getTransportOptions, getAccommodationSuggestions } = require('../controllers/aiController');

// POST /api/ai/generate-trip
router.post('/generate-trip', generateTrip);

// POST /api/ai/get-suggestions
router.post('/get-suggestions', getSuggestions);

// POST /api/ai/get-transport-options
router.post('/get-transport-options', getTransportOptions);

// POST /api/ai/get-accommodation-suggestions
router.post('/get-accommodation-suggestions', getAccommodationSuggestions);

module.exports = router;
