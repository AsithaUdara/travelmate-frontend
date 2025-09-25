const mongoose = require('mongoose');

const accBookingSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required.'],
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone number is required.'],
    trim: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
  },
  numberOfNights: {
    type: Number,
    required: true,
    min: 0,
  },
  priceDetails: {
    basePrice: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    taxes: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash'],
    required: true,
  },
  specialRequests: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Confirmed', 'Pending', 'Cancelled'],
    default: 'Confirmed',
  },
}, { timestamps: true });

const AccBooking = mongoose.model('AccBooking', accBookingSchema);

module.exports = AccBooking;