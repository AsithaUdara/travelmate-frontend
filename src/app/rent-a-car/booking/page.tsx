"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Shield, 
  CheckCircle,
  Star,
  Users,
  Car,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function BookingPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleId = searchParams.get('vehicleId');
  
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    pickupLocation: 'Colombo Fort',
    dropoffLocation: 'Kandy',
    pickupDate: '2025-09-10',
    pickupTime: '08:00',
    customerName: '',
    customerPhone: '',
    driverLanguage: '',
    specialRequests: '',
    paymentMethod: '',
    agreedToTerms: false,
    agreedToPolicy: false
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId] = useState('BK' + Date.now().toString().slice(-8));
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const getVehicleData = () => {
    const mockVehicles = {
      'v1': {
        id: 'v1', name: 'Toyota Corolla', type: 'Car', image: 'https://wptaxi.pl/wp-content/uploads/2024/09/Oklejenie-taksowki-czego-wymagaja-miasta-Bolt-1024x621-1.jpg', capacity: 4,
        fuelType: 'Petrol', transmission: 'Auto', priceWithDriver: 15000, rating: 4.7, reviews: 156, features: ['AC', 'GPS', 'Bluetooth', 'USB Charging'], owner: 'Lanka Car Rentals',
        driverInfo: { name: 'Roshan Perera', experience: '8 years', languages: ['English', 'Sinhala', 'Tamil'], rating: 4.8 }
      },
      'v2': {
        id: 'v2', name: 'Toyota Hiace', type: 'Van', image: 'https://st3.depositphotos.com/27209332/36674/i/450/depositphotos_366742904-stock-photo-pasay-may-toyota-hiace-van.jpg', capacity: 15,
        fuelType: 'Diesel', transmission: 'Manual', priceWithDriver: 25000, rating: 4.5, reviews: 89, features: ['AC', 'GPS', 'WiFi', 'Luggage Space'], owner: 'City Transport Services',
        driverInfo: { name: 'Kamal Silva', experience: '10 years', languages: ['English', 'Sinhala'], rating: 4.6 }
      },
      'v3': {
        id: 'v3', name: 'Suzuki Jimny', type: 'Car', image: 'https://lh3.googleusercontent.com/6FMFz0nOGgE4KQPDVBuIy0d5zDjB2ABx3kVsj1hBXPRGxfQB0v80jplGhbRh4ealhRlVefIJIdOGZVdKlVaPWv1o5XoPWfIka8rM=s1000', capacity: 4,
        fuelType: 'Petrol', transmission: 'Manual', priceWithDriver: 18000, rating: 4.8, reviews: 203, features: ['4WD', 'AC', 'GPS', 'Off-road Capable'], owner: 'Adventure Rentals',
        driverInfo: { name: 'Suresh Kumara', experience: '6 years', languages: ['English', 'Sinhala'], rating: 4.7 }
      },
      'v4': {
        id: 'v4', name: 'Honda Civic', type: 'Car', image: 'https://kereta.info/wp-content/uploads/2010/10/CIvic-TAxi-400x327.jpg', capacity: 4,
        fuelType: 'Hybrid', transmission: 'Auto', priceWithDriver: 17000, rating: 4.6, reviews: 134, features: ['Hybrid', 'AC', 'GPS', 'Premium Interior'], owner: 'Green Drive Lanka',
        driverInfo: { name: 'Nuwan Jayasuriya', experience: '7 years', languages: ['English'], rating: 4.5 }
      },
      'v5': {
        id: 'v5', name: 'Yamaha FZ25', type: 'Bike', image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/54265/yamaha-fz25-rear-view32.jpeg?wm=2&q=100', capacity: 2,
        fuelType: 'Petrol', transmission: 'Manual', priceWithDriver: 0, rating: 4.4, reviews: 67, features: ['Fuel Efficient', '250cc', 'Digital Display'], owner: 'Bike Hub',
        driverInfo: { name: '—', experience: '—', languages: [], rating: 4.4 }
      }
    } as const;
    const key = (vehicleId as keyof typeof mockVehicles) ?? 'v1';
    return mockVehicles[key] ?? mockVehicles['v1'];
  };

  const vehicle = getVehicleData();

  useEffect(() => {
    if (!bookingConfirmed) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [bookingConfirmed]);

  useEffect(() => {
    if (bookingConfirmed && countdown === 0) {
      router.push('/rent-a-car?tab=bookings');
    }
  }, [bookingConfirmed, countdown, router]);

  const calculatePricing = () => {
    const basePrice = vehicle?.priceWithDriver ?? 0;
    const estimatedDistance = 115; // km from Colombo to Kandy
    const distanceCharge = estimatedDistance * 10; // LKR 10 per km
    const driverFee = 5000; // Fixed driver fee
    const serviceFee = 1000;
  const subtotal = basePrice + distanceCharge + driverFee;
    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + serviceFee + tax;
    return { basePrice, distanceCharge, estimatedDistance, driverFee, serviceFee, tax, subtotal, total };
  };

  const pricing = calculatePricing();

  const handleInputChange = (field: string, value: string | boolean) => setBookingData(prev => ({ ...prev, [field]: value }));
  const handleNextStep = () => setCurrentStep(s => Math.min(3, s + 1));
  const handlePrevStep = () => setCurrentStep(s => Math.max(1, s - 1));
  const handleConfirmBooking = () => setBookingConfirmed(true);

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!(bookingData.customerName && bookingData.customerPhone);
      case 2: return !!bookingData.paymentMethod;
      case 3: return !!(bookingData.agreedToTerms && bookingData.agreedToPolicy);
      default: return false;
    }
  };

  const handleBack = () => router.push('/rent-a-car');
  const handleRedirectNow = () => router.push('/rent-a-car?tab=bookings');

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Vehicle not found</h1>
          <p className="text-gray-600 mb-6">Please go back and select a vehicle again.</p>
          <button onClick={() => router.push('/rent-a-car')} className="px-6 py-3 bg-blue-600 text-white rounded-lg">Back to search</button>
        </div>
      </div>
    );
  }

  if (bookingConfirmed) {
    return (
  <div className="min-h-screen bg-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg border p-8 text-center relative">
            <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">Redirecting in {countdown}s</div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">Your vehicle has been successfully booked</p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-600">Booking ID</p><p className="font-semibold text-blue-600">{bookingId}</p></div>
                <div><p className="text-gray-600">Vehicle</p><p className="font-semibold">{vehicle.name}</p></div>
                <div><p className="text-gray-600">Pickup Date</p><p className="font-semibold">{bookingData.pickupDate} at {bookingData.pickupTime}</p></div>
                <div><p className="text-gray-600">Total Amount</p><p className="font-semibold text-green-600">LKR {pricing.total.toLocaleString()}</p></div>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg"><CheckCircle className="w-5 h-5 flex-shrink-0" /><span className="text-sm">SMS confirmation sent to {bookingData.customerPhone}</span></div>
              <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-4 rounded-lg"><Info className="w-5 h-5 flex-shrink-0" /><div className="text-sm text-left"><p className="font-medium">What's next?</p><p>Your driver will contact you 30 minutes before pickup time.</p></div></div>
            </div>
            <div className="flex gap-4">
              <Button onClick={handleRedirectNow} className="flex-1" size="lg">Continue Browsing</Button>
              <Button onClick={() => router.push('/rent-a-car?tab=bookings')} variant="outline" className="flex-1" size="lg">View My Bookings</Button>
            </div>
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-1"><div className="bg-blue-600 h-1 rounded-full transition-all duration-1000 ease-linear" style={{ width: `${((5 - countdown) / 5) * 100}%` }}></div></div>
              <p className="text-xs text-gray-500 mt-2">Automatically redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
              <p className="text-sm text-gray-600">{vehicle.name} with Professional Driver</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === currentStep ? 'bg-black text-white' :
                    step < currentStep ? 'bg-green-600 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  <span className={`ml-2 text-sm ${
                    step === currentStep ? 'text-black font-semibold' :
                    step < currentStep ? 'text-green-600' :
                    'text-gray-500'
                  }`}>
                    {step === 1 && 'Personal Details'}
                    {step === 2 && 'Payment Method'}
                    {step === 3 && 'Confirmation'}
                  </span>
                  {step < 3 && <div className="flex-1 h-px bg-gray-300 mx-4" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><User className="w-4 h-4 inline mr-1" />Full Name *</label>
                    <input type="text" value={bookingData.customerName} onChange={(e) => handleInputChange('customerName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="w-4 h-4 inline mr-1" />Phone Number *</label>
                    <input type="tel" value={bookingData.customerPhone} onChange={(e) => handleInputChange('customerPhone', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+94 77 123 4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driver Language Preference</label>
                  <select value={bookingData.driverLanguage} onChange={(e) => handleInputChange('driverLanguage', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">No preference</option>
                    <option value="English">English</option>
                    <option value="Sinhala">Sinhala</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                  <textarea value={bookingData.specialRequests} onChange={(e) => handleInputChange('specialRequests', e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Any special requirements or requests..." />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="card" checked={bookingData.paymentMethod === 'card'} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="text-blue-600" />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div><p className="font-medium">Credit/Debit Card</p><p className="text-sm text-gray-600">Pay securely with your card</p></div>
                    </label>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="cash" checked={bookingData.paymentMethod === 'cash'} onChange={(e) => handleInputChange('paymentMethod', e.target.value)} className="text-blue-600" />
                      <div className="w-5 h-5 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">$</div>
                      <div><p className="font-medium">Pay on Pickup</p><p className="text-sm text-gray-600">Pay cash when driver arrives</p></div>
                    </label>
                  </div>
                </div>
                {bookingData.paymentMethod === 'card' && (
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-gray-900">Card Details</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label><input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label><input type="text" placeholder="MM/YY" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                        <div><label className="block text sm font-medium text-gray-700 mb-2">CVV</label><input type="text" placeholder="123" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                      </div>
                      <div><label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label><input type="text" placeholder="John Doe" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Review & Confirm</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Customer:</span><span className="font-medium">{bookingData.customerName}</span></div>
                    <div className="flex justify-between"><span>Phone:</span><span className="font-medium">{bookingData.customerPhone}</span></div>
                    <div className="flex justify-between"><span>Vehicle:</span><span className="font-medium">{vehicle.name}</span></div>
                    <div className="flex justify-between"><span>Pickup:</span><span className="font-medium">{bookingData.pickupLocation}</span></div>
                    <div className="flex justify-between"><span>Drop-off:</span><span className="font-medium">{bookingData.dropoffLocation}</span></div>
                    <div className="flex justify-between"><span>Date & Time:</span><span className="font-medium">{bookingData.pickupDate} at {bookingData.pickupTime}</span></div>
                    <div className="flex justify-between"><span>Payment Method:</span><span className="font-medium capitalize">{bookingData.paymentMethod}</span></div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Driver</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">{vehicle.driverInfo.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="font-medium">{vehicle.driverInfo.name}</p>
                      <p className="text-sm text-gray-600">{vehicle.driverInfo.experience} experience</p>
                      <div className="flex items-center gap-2 text-sm"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span>{vehicle.driverInfo.rating} rating</span><span className="text-gray-500">• Speaks {vehicle.driverInfo.languages.join(', ')}</span></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-3"><input type="checkbox" checked={bookingData.agreedToTerms} onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)} className="mt-1 text-blue-600" /><span className="text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a></span></label>
                  <label className="flex items-start gap-3"><input type="checkbox" checked={bookingData.agreedToPolicy} onChange={(e) => handleInputChange('agreedToPolicy', e.target.checked)} className="mt-1 text-blue-600" /><span className="text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></span></label>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex gap-3"><Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" /><div className="text-sm text-yellow-800"><p className="font-medium mb-2">Important Notes:</p><ul className="space-y-1 list-disc list-inside"><li>Driver will contact you 30 minutes before pickup</li><li>Please have a valid ID ready for verification</li><li>Cancellation is free up to 2 hours before pickup</li></ul></div></div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t">
              <Button onClick={handlePrevStep} disabled={currentStep === 1} variant="outline">Previous</Button>
              {currentStep < 3 ? (
                <Button onClick={handleNextStep} disabled={!isStepValid()} size="lg">Continue</Button>
              ) : (
                <Button onClick={handleConfirmBooking} disabled={!isStepValid()} size="lg">Confirm Booking</Button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden">
          <button onClick={() => setShowMobileSummary(!showMobileSummary)} className="w-full bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between"><span className="font-semibold">Booking Summary</span>{showMobileSummary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</button>
        </div>

        <div className={`w-full lg:w-96 space-y-6 ${showMobileSummary ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
            <p className="text-gray-600 mb-4">{vehicle.owner}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4"><span className="flex items-center gap-1"><Users className="w-4 h-4" />{vehicle.capacity} seats</span><span>{vehicle.fuelType}</span><span>{vehicle.transmission}</span></div>
            <div className="flex items-center gap-2 mb-4"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span className="text-sm font-medium">{vehicle.rating}</span><span className="text-sm text-gray-500">({vehicle.reviews} reviews)</span></div>
            <div className="flex flex-wrap gap-1">{vehicle.features.map((feature: string) => (<span key={feature} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{feature}</span>))}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Vehicle base rate</span><span>LKR {pricing.basePrice.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Distance charge ({pricing.estimatedDistance} km)</span><span>LKR {pricing.distanceCharge.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Professional driver fee</span><span>LKR {pricing.driverFee.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600"><span>Service fee</span><span>LKR {pricing.serviceFee.toLocaleString()}</span></div>
              <div className="flex justify-between text-gray-600"><span>Tax (15%)</span><span>LKR {pricing.tax.toLocaleString()}</span></div>
              <div className="border-t pt-3 flex justify-between font-semibold text-lg"><span>Total</span><span className="text-green-600">LKR {pricing.total.toLocaleString()}</span></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg"><Shield className="w-5 h-5" /><span className="text-sm font-medium">Secure booking with insurance coverage</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading booking...</div>}>
      <BookingPageInner />
    </Suspense>
  );
}

// Route segment config moved to parent server layout to avoid client/server mismatch
