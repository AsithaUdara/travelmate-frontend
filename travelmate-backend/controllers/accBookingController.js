const AccBooking = require('../models/accBookingModel');
const Hotel = require('../models/Hotel');

// @desc    Create a new accommodation booking
// @route   POST /api/bookings
// @access  Public (for now)
exports.createBooking = async (req, res) => {
  try {
    const { hotelId, ...bookingData } = req.body;

    // Verify that the hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found.' });
    }

    // Create a new booking instance with the hotel's ID
    const newBooking = new AccBooking({
      ...bookingData,
      hotel: hotelId,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({ 
      message: 'Booking created successfully!', 
      booking: savedBooking 
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error while creating booking.', error: error.message });
  }
};