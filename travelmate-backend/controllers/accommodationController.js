const Hotel = require('../models/Hotel');

// @desc    Get hotels based on location and filters
// @route   GET /api/accommodations
// @access  Public
exports.getAccommodations = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, minRating, sortBy } = req.query;

    let query = {};

    // --- Filtering ---
    if (location) {
      // Case-insensitive search for location
      query.location = { $regex: new RegExp(`^${location}$`, 'i') };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // --- Sorting ---
    let sortOption = {};
    switch (sortBy) {
      case 'price-asc':
        sortOption = { price: 1 };
        break;
      case 'price-desc':
        sortOption = { price: -1 };
        break;
      case 'rating-desc':
        sortOption = { rating: -1, reviews: -1 };
        break;
      case 'reviews-desc':
        sortOption = { reviews: -1, rating: -1 };
        break;
      case 'top-picks':
      default:
        // Balanced sort: rating desc, then reviews desc
        sortOption = { rating: -1, reviews: -1 };
        break;
    }

    const hotels = await Hotel.find(query).sort(sortOption);
    
    res.status(200).json(hotels);

  } catch (error) {
    console.error('Error fetching accommodations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single hotel by its ID
// @route   GET /api/accommodations/:id
// @access  Public
exports.getAccommodationById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.status(200).json(hotel);
    } catch (error) {
        console.error('Error fetching accommodation by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new hotel
// @route   POST /api/accommodations/admin
// @access  Private/Admin
exports.createHotel = async (req, res) => {
    try {
        const newHotel = new Hotel(req.body);
        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (error) {
        console.error('Error creating hotel:', error);
        res.status(500).json({ message: 'Error creating hotel', error: error.message });
    }
};

// @desc    Update a hotel by ID
// @route   PUT /api/accommodations/admin/:id
// @access  Private/Admin
exports.updateHotel = async (req, res) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.status(200).json(updatedHotel);
    } catch (error) {
        console.error('Error updating hotel:', error);
        res.status(500).json({ message: 'Error updating hotel', error: error.message });
    }
};

// @desc    Delete a hotel by ID
// @route   DELETE /api/accommodations/admin/:id
// @access  Private/Admin
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        res.status(200).json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error('Error deleting hotel:', error);
        res.status(500).json({ message: 'Error deleting hotel' });
    }
};
