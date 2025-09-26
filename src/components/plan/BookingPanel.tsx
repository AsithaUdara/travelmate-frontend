"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Place } from '@/lib/mock-data';
import { useDraftTrip } from '@/lib/draft-trip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, differenceInDays } from "date-fns";
import { AnimatePresence, motion } from 'framer-motion';

export const BookingPanel = ({ place }: { place: Place }) => {
    const router = useRouter();
    const [trip, setTrip] = useDraftTrip();
    const [checkIn, setCheckIn] = useState<Date | undefined>(new Date(2025, 9, 10));
    const [checkOut, setCheckOut] = useState<Date | undefined>(new Date(2025, 9, 12));
    const [guests, setGuests] = useState(2);
    const [isConfirming, setIsConfirming] = useState(false);

    const numberOfNights = useMemo(() => {
        if (checkIn && checkOut) {
            return differenceInDays(checkOut, checkIn);
        }
        return 0;
    }, [checkIn, checkOut]);

    const basePrice = place.price * numberOfNights;
    const serviceFee = Math.round(basePrice * 0.1);
    const taxes = Math.round(basePrice * 0.05);
    const totalPrice = basePrice + serviceFee + taxes;

    const handleBookNow = () => {
        if(numberOfNights > 0) {
            setIsConfirming(true);
        } else {
            alert("Please select a valid date range.");
        }
    };
    
    const handleProceedToPayment = () => {
        // Navigate to the multi-step booking flow, carrying the selected dates and guests
        if (!checkIn || !checkOut || numberOfNights <= 0) return;
        let placeB64 = '';
        try {
            placeB64 = typeof window !== 'undefined' ? btoa(JSON.stringify(place)) : '';
        } catch {}
        const qs = new URLSearchParams({
            checkIn: format(checkIn, 'yyyy-MM-dd'),
            checkOut: format(checkOut, 'yyyy-MM-dd'),
            guests: String(guests),
            ...(placeB64 ? { place: placeB64 } : {}),
        }).toString();
        router.push(`/plan/hotel/${place.id}/booking?${qs}`);
    };

    const inferLocationFromPlace = (hotelName: string) => {
        const lower = hotelName.toLowerCase();
        // naive mapping to match trip day locations
        if (lower.includes('colombo')) return 'colombo';
        if (lower.includes('kandy')) return 'kandy';
        if (lower.includes('ella')) return 'ella';
        if (lower.includes('mirissa')) return 'mirissa';
        if (lower.includes('galle')) return 'galle';
        return '';
    };

    const findBestDayIndex = () => {
        // Fall back to nearest itinerary day based on coordinates when name mapping fails
        let bestIdx = 0;
        let best = Number.POSITIVE_INFINITY;
        trip.days.forEach((d, i) => {
            const dx = (d.latitude || 0) - (place.latitude || 0);
            const dy = (d.longitude || 0) - (place.longitude || 0);
            const dist = dx * dx + dy * dy;
            if (dist < best) {
                best = dist;
                bestIdx = i;
            }
        });
        return bestIdx;
    };

    return (
        <div className="sticky top-28 border rounded-xl shadow-lg p-6">
            <AnimatePresence mode="wait">
                {!isConfirming ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-baseline gap-2">
                            <p className="font-bold text-2xl">LKR {place.price.toLocaleString()}</p>
                            <p className="text-slate-600">night</p>
                        </div>
                        <div className="border rounded-lg mt-4">
                            <div className="grid grid-cols-2 border-b">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-3 text-left w-full">
                                            <p className="text-xs font-bold uppercase">Check-in</p>
                                            <p>{checkIn ? format(checkIn, "dd/MM/yyyy") : "Select date"}</p>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkIn} onSelect={setCheckIn} /></PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-3 text-left border-l w-full">
                                            <p className="text-xs font-bold uppercase">Checkout</p>
                                            <p>{checkOut ? format(checkOut, "dd/MM/yyyy") : "Select date"}</p>
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={checkIn ? { before: new Date(checkIn.getTime() + 86400000) } : undefined} /></PopoverContent>
                                </Popover>
                            </div>
                            <div className="p-3">
                                <p className="text-xs font-bold uppercase">Guests</p>
                                <Input type="number" value={guests} onChange={e => setGuests(Number(e.target.value))} className="border-none p-0 h-auto text-base focus-visible:ring-0 focus-visible:ring-offset-0" />
                            </div>
                        </div>
                        <Button size="lg" className="w-full mt-4 rounded-full h-12 text-base font-semibold" onClick={handleBookNow}>
                            Book Now
                        </Button>
                        <p className="text-center text-sm text-slate-500 mt-2">You won't be charged yet</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="confirmation"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="flex items-center justify-between">
                             <h2 className="text-2xl font-bold">Confirm your booking</h2>
                             <button onClick={() => setIsConfirming(false)} className="text-sm font-semibold underline">Edit</button>
                        </div>
                        <div className="mt-4 space-y-2 py-4 border-y">
                            <div className="flex justify-between"><span className="text-slate-600">LKR {place.price.toLocaleString()} x {numberOfNights} nights</span><span>LKR {basePrice.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">Service fee</span><span>LKR {serviceFee.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-slate-600">Taxes</span><span>LKR {taxes.toLocaleString()}</span></div>
                        </div>
                        <div className="flex justify-between font-bold text-lg mt-2">
                            <span>Total</span>
                            <span>LKR {totalPrice.toLocaleString()}</span>
                        </div>

                        <Button size="lg" className="w-full mt-6 rounded-full h-12 text-base font-semibold" onClick={handleProceedToPayment}>
                            Proceed to Payment
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
