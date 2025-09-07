"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { mockPlaces } from "@/lib/mock-data";
import { useDraftTrip } from "@/lib/draft-trip";
import { format, parseISO, differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, CreditCard, Info, Star, Users, Calendar as CalIcon } from "lucide-react";

export default function HotelBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const searchParams = useSearchParams();
  const [trip, setTrip] = useDraftTrip();

  const place = useMemo(() => mockPlaces.find(p => p.id === id && p.category === 'stay'), [id]);

  // Prefill from query
  const qCheckIn = searchParams.get('checkIn');
  const qCheckOut = searchParams.get('checkOut');
  const qGuests = parseInt(searchParams.get('guests') || '2', 10);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | ''>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [checkIn, setCheckIn] = useState<string>(qCheckIn || format(new Date(), 'yyyy-MM-dd'));
  const [checkOut, setCheckOut] = useState<string>(qCheckOut || format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'));
  const [guests, setGuests] = useState<number>(isNaN(qGuests) ? 2 : qGuests);

  const nights = useMemo(() => {
    try {
      const d1 = parseISO(checkIn);
      const d2 = parseISO(checkOut);
      const n = differenceInDays(d2, d1);
      return Math.max(0, n);
    } catch {
      return 0;
    }
  }, [checkIn, checkOut]);

  const basePrice = (place?.price || 0) * nights;
  const serviceFee = Math.round(basePrice * 0.1);
  const taxes = Math.round(basePrice * 0.05);
  const totalPrice = basePrice + serviceFee + taxes;

  useEffect(() => {
    if (!bookingConfirmed) return;
    const t = setInterval(() => setCountdown(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(t);
  }, [bookingConfirmed]);

  useEffect(() => {
    if (bookingConfirmed && countdown === 0) {
      router.push('/plan/accommodation');
    }
  }, [bookingConfirmed, countdown, router]);

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!(customerName && customerPhone && nights > 0 && guests > 0);
      case 2:
        return paymentMethod === 'card' || paymentMethod === 'cash';
      case 3:
        return agreedToTerms && agreedToPolicy;
      default:
        return false;
    }
  };

  const handleConfirm = () => {
    // Persist booking into the draft trip as an Accommodation activity
  try {
      const activity: any = {
    id: `acc-${place?.id ?? 'unknown'}`,
    name: `✅ Check in: ${place?.name ?? 'Hotel'}`,
        type: 'Accommodation',
        duration: 0,
    cost: place?.price ?? 0,
        bookingDetails: {
      reference: `BK-${(place?.id ?? 'UNKNOWN').toUpperCase()}`,
          checkIn,
          checkOut,
          guests,
          nights,
          total: totalPrice,
        },
      };
      // naive match by name
    const lowerName = (place?.name || '').toLowerCase();
      const updatedDays = trip.days.map(d => {
        const match = d.location.toLowerCase();
        if (lowerName.includes(match) || match.includes(lowerName)) {
          const withoutOld = d.activities.filter(a => a.type !== 'Accommodation');
          return { ...d, activities: [...withoutOld, activity] };
        }
        return d;
      });
      setTrip({ ...trip, days: updatedDays });
      try {
        localStorage.setItem('tm_accommodation_selected_location', trip.days[0]?.location || '');
        localStorage.setItem('tm_plan_started', '1');
        localStorage.setItem('tm_plan_step', '3');
        document.dispatchEvent(new CustomEvent('tm:plan-started'));
        document.dispatchEvent(new CustomEvent('tm:plan-step', { detail: { step: 3 } }));
      } catch {}
    } catch {}
    setBookingConfirmed(true);
  };

  if (!place) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white border rounded-lg shadow p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Stay not found</h1>
          <p className="text-gray-600 mb-6">The accommodation you're trying to book doesn't exist.</p>
          <Button onClick={() => router.push('/plan/accommodation')}>Back to Stays</Button>
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
            <p className="text-gray-600 mb-6">Your stay has been added to your plan</p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-600">Hotel</p><p className="font-semibold">{place.name}</p></div>
                <div><p className="text-gray-600">Nights</p><p className="font-semibold">{nights}</p></div>
                <div><p className="text-gray-600">Dates</p><p className="font-semibold">{checkIn} → {checkOut}</p></div>
                <div><p className="text-gray-600">Total Amount</p><p className="font-semibold text-green-600">LKR {totalPrice.toLocaleString()}</p></div>
              </div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-lg"><CheckCircle className="w-5 h-5 flex-shrink-0" /><span className="text-sm">We sent a confirmation to your phone</span></div>
              <div className="flex items-center gap-3 text-blue-600 bg-blue-50 p-4 rounded-lg"><Info className="w-5 h-5 flex-shrink-0" /><div className="text-sm text-left"><p className="font-medium">Heads up</p><p>Your hotel may contact you for arrival details.</p></div></div>
            </div>
            <div className="flex gap-4">
              <Button onClick={() => router.push('/plan/accommodation')} className="flex-1" size="lg">View My Plan</Button>
              <Button onClick={() => router.push('/plan/accommodation')} variant="outline" className="flex-1" size="lg">Back to Stays</Button>
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
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
              <p className="text-sm text-gray-600">{place.name}</p>
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
                <h2 className="text-xl font-semibold text-gray-900">Personal & Stay Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="+94 77 123 4567" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><CalIcon className="w-4 h-4 inline mr-1" />Check-in</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><CalIcon className="w-4 h-4 inline mr-1" />Check-out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"><Users className="w-4 h-4 inline mr-1" />Guests</label>
                    <input type="number" min={1} value={guests} onChange={(e) => setGuests(parseInt(e.target.value||'1',10))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                  <textarea value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Any special requirements or requests..." />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="text-blue-600" />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div><p className="font-medium">Credit/Debit Card</p><p className="text-sm text-gray-600">Pay securely with your card</p></div>
                    </label>
                  </div>
                  <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <label className="flex items-center gap-3">
                      <input type="radio" name="paymentMethod" value="cash" checked={paymentMethod === 'cash'} onChange={(e) => setPaymentMethod(e.target.value as any)} className="text-blue-600" />
                      <div className="w-5 h-5 bg-green-600 rounded text-white flex items-center justify-center text-xs font-bold">$</div>
                      <div><p className="font-medium">Pay at Hotel</p><p className="text-sm text-gray-600">Settle on arrival</p></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Review & Confirm</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Customer:</span><span className="font-medium">{customerName}</span></div>
                    <div className="flex justify-between"><span>Phone:</span><span className="font-medium">{customerPhone}</span></div>
                    <div className="flex justify-between"><span>Hotel:</span><span className="font-medium">{place.name}</span></div>
                    <div className="flex justify-between"><span>Dates:</span><span className="font-medium">{checkIn} → {checkOut}</span></div>
                    <div className="flex justify-between"><span>Guests:</span><span className="font-medium">{guests}</span></div>
                    <div className="flex justify-between"><span>Payment Method:</span><span className="font-medium capitalize">{paymentMethod || '-'}</span></div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Room rate</span><span>LKR {place.price.toLocaleString()} × {nights} nights</span></div>
                    <div className="flex justify-between text-gray-600"><span>Service fee (10%)</span><span>LKR {serviceFee.toLocaleString()}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Taxes (5%)</span><span>LKR {taxes.toLocaleString()}</span></div>
                    <div className="border-t pt-3 flex justify-between font-semibold text-lg"><span>Total</span><span className="text-green-600">LKR {totalPrice.toLocaleString()}</span></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="flex items-start gap-3"><input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1 text-blue-600" /><span className="text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a></span></label>
                  <label className="flex items-start gap-3"><input type="checkbox" checked={agreedToPolicy} onChange={(e) => setAgreedToPolicy(e.target.checked)} className="mt-1 text-blue-600" /><span className="text-sm text-gray-700">I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></span></label>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t">
              <Button onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1} variant="outline">Previous</Button>
              {currentStep < 3 ? (
                <Button onClick={() => setCurrentStep(s => Math.min(3, s + 1))} disabled={!isStepValid()} size="lg">Continue</Button>
              ) : (
                <Button onClick={handleConfirm} disabled={!isStepValid()} size="lg">Confirm Booking</Button>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {/* Image */}
            <img src={place.images?.[0] || '/hero/hero-1.jpg'} alt={place.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{place.name}</h3>
            <p className="text-gray-600 mb-4">{place.type}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4"><span className="flex items-center gap-1"><Users className="w-4 h-4" />{guests} guests</span><span><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {place.rating}</span></div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Room rate</span><span>LKR {place.price.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Nights</span><span>{nights}</span></div>
              <div className="border-t pt-3 flex justify-between font-semibold"><span>Est. Total</span><span className="text-green-600">LKR {totalPrice.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
