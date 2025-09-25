"use client";

import React from 'react';
import { Trip } from '@/lib/trip-data';
import { cn } from '@/lib/utils';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type LocationToBook = {
  name: string;
  nights: number;
};

type AccommodationSidebarProps = {
  locations: LocationToBook[];
  trip?: Trip; // Make trip optional to handle initial render
  selectedLocation: string | null;
  onSelectLocation: (location: string) => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US').format(price);
};

export const AccommodationSidebar = ({ locations, trip, selectedLocation, onSelectLocation }: AccommodationSidebarProps) => {

  const getBookedHotelForLocation = (location: string) => {
    // Add a guard clause in case trip is not yet available
    if (!trip) return undefined;

    const dayInLocation = trip.days.find(d => d.location === location);
    const accommodation = dayInLocation?.activities.find(a => a.type === 'Accommodation');
    if (!accommodation) return undefined;

    const hotel = accommodation.name.replace('✅ Check in: ', '');
    const price = accommodation.bookingDetails?.total ?? accommodation.cost;
    const inDate = accommodation.bookingDetails?.checkIn;
    const outDate = accommodation.bookingDetails?.checkOut;

    return {
      hotel,
      price,
      dateRange: inDate && outDate ? `${inDate} → ${outDate}` : undefined,
    } as { hotel: string; price?: number; dateRange?: string };
  };

  return (
    <div className="p-6 h-full min-h-0 flex flex-col">
      <div className="pb-4 border-b">
        <h1 className="text-2xl font-bold">Book Accommodation</h1>
        <p className="text-slate-500">Select a location to find and book your stays.</p>
      </div>
      
      <div className="mt-6 flex-1 min-h-0 overflow-y-auto pr-2 space-y-2">
        {locations.map((loc) => {
          const bookedHotel = getBookedHotelForLocation(loc.name);
          return (
            <div 
              key={loc.name}
              className={cn(
                "p-4 rounded-lg cursor-pointer border-2",
                selectedLocation === loc.name ? "border-slate-900 bg-slate-50" : "border-transparent hover:bg-slate-50"
              )}
              onClick={() => onSelectLocation(loc.name)}
            >
              <p className="text-sm text-slate-500 font-semibold">{loc.nights} NIGHTS</p>
              <p className="font-bold text-lg">{loc.name}</p>
              {bookedHotel && (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-600 mt-2">
                  <CheckCircleIcon className="h-5 w-5"/>
                  <div className="flex flex-col">
                    <span>{bookedHotel.hotel}</span>
                    <span className="text-green-700/80 font-normal">
                      {bookedHotel.price ? `LKR ${formatPrice(bookedHotel.price)}` : null}
                      {bookedHotel.dateRange ? ` • ${bookedHotel.dateRange}` : null}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};