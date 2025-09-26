const express = require('express');
const router = express.Router();
const { generateTrip } = require('../controllers/plannerController');

// In future, add authentication middleware if needed
// const { protect } = require('../middleware/authMiddleware');

router.post('/generate', generateTrip);

module.exports = router;
