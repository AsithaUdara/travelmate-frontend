const Trip = require('../models/tripModel');
const User = require('../models/userModel');

// @desc    Create a new trip for the logged-in user
// @route   POST /api/trips
// @access  Private (requires token)
exports.createTrip = async (req, res) => {
  try {
    const { name, startDate, endDate, days, coverImage, interests } = req.body;
    
    // The `req.user` object is attached by our `protect` middleware.
    // If the code reaches here, we know the user is authenticated.
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Create a new trip object with the data from the request body
    // and link it to the logged-in user via their MongoDB ObjectId.
    const trip = new Trip({
      name,
      startDate,
      endDate,
      days,
      coverImage,
      interests,
      user: req.user._id, 
    });

    // Save the new trip to the database
    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    // Surface validation errors when present
    if (error && error.name === 'ValidationError') {
      const details = Object.values(error.errors || {}).map((e) => e.message);
      return res.status(400).json({ message: 'Trip validation failed', details });
    }
    res.status(500).json({ message: error?.message || 'Server error while creating trip.' });
  }
};

// @desc    Get all trips for the currently logged-in user
// @route   GET /api/trips/mytrips
// @access  Private (requires token)
exports.getMyTrips = async (req, res) => {
  try {
    // Use the user's ID (from the middleware) to find all trips associated with them.
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by newest first
    res.json(trips);
  } catch (error) {
    console.error('Error fetching user trips:', error);
    res.status(500).json({ message: 'Server error while fetching trips.' });
  }
};

// @desc    Get a single trip by its ID
// @route   GET /api/trips/:id
// @access  Private (requires token)
exports.getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // CRITICAL SECURITY CHECK: Ensure the trip belongs to the user making the request.
        // This prevents User A from being able to view User B's trips just by guessing the ID.
        if (trip.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this trip' });
        }

        res.json(trip);
    } catch (error) {
        console.error('Error fetching trip by ID:', error);
        res.status(500).json({ message: 'Server error while fetching trip.' });
    }
};

// @desc    Update a trip by ID (replace fields sent)
// @route   PUT /api/trips/:id
// @access  Private (requires token)
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this trip' });
    }

    const allowed = ['name', 'startDate', 'endDate', 'days', 'coverImage', 'interests'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        trip[key] = req.body[key];
      }
    });

    const saved = await trip.save();
    res.json(saved);
  } catch (error) {
    console.error('Error updating trip:', error);
    if (error && error.name === 'ValidationError') {
      const details = Object.values(error.errors || {}).map((e) => e.message);
      return res.status(400).json({ message: 'Trip validation failed', details });
    }
    res.status(500).json({ message: error?.message || 'Server error while updating trip.' });
  }
};