"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trip, Activity } from '@/lib/trip-data';
import { AccommodationSidebar } from './AccommodationSidebar';
import { AccommodationSelectionPanel } from './AccommodationSelectionPanel';
import { HotelDetailModal } from './HotelDetailModal';
import { Place } from '@/lib/mock-data';

type AccommodationViewProps = {
  trip: Trip;
  setTrip: (trip: Trip) => void;
};

export const AccommodationView = ({ trip, setTrip }: AccommodationViewProps) => {
  // Memoize the list of unique locations needing accommodation
  const locationsToBook = useMemo(() => {
    const locations = new Map<string, { count: number, details: Place | undefined }>();
    trip.days.forEach(day => {
      const existing = locations.get(day.location);
      locations.set(day.location, { 
        count: (existing?.count || 0) + 1,
        details: undefined // We'll add details later if needed
      });
    });
    return Array.from(locations.entries()).map(([name, data]) => ({ name, nights: data.count }));
  }, [trip.days]);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  React.useEffect(() => {
    try {
      const remembered = localStorage.getItem('tm_accommodation_selected_location');
      if (remembered && locationsToBook.some(l => l.name === remembered)) {
        setSelectedLocation(remembered);
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [selectedHotel, setSelectedHotel] = useState<Place | null>(null);

  const handleHotelSelect = (hotel: Place) => {
    const newActivity: Activity = {
        id: `acc-${hotel.id}`,
        name: `✅ Check in: ${hotel.name}`,
        type: 'Accommodation',
        duration: 0,
        cost: hotel.price,
    };

    const updatedDays = trip.days.map(day => {
        if (day.location === selectedLocation) {
            // Remove any previous accommodation booking for this location
            const filteredActivities = day.activities.filter(act => act.type !== 'Accommodation');
            // Add the new one
            return { ...day, activities: [...filteredActivities, newActivity] };
        }
        return day;
    });

    setTrip({ ...trip, days: updatedDays });
    setSelectedHotel(null); // Close the modal
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-12 h-full min-h-0"
      >
        <div className="col-span-4 h-full overflow-y-auto bg-white border-r">
          <AccommodationSidebar
            locations={locationsToBook}
            trip={trip}
            selectedLocation={selectedLocation}
            onSelectLocation={(loc) => {
              setSelectedLocation(loc);
              try { localStorage.setItem('tm_accommodation_selected_location', loc); } catch {}
            }}
          />
        </div>
    <div className="col-span-8 h-full bg-slate-50 min-h-0 flex flex-col">
      {!selectedLocation ? (
        <div className="flex-1 min-h-0 flex items-center justify-center p-8">
          <div className="text-center text-slate-600">
            <p className="text-lg font-semibold">Select a location on the left to see stays</p>
            <p className="text-sm mt-1">Choose a city or area to browse and book accommodation.</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0">
          <AccommodationSelectionPanel 
            locationName={selectedLocation}
          />
        </div>
      )}
    </div>
      </motion.div>
      
  {/* HotelDetailModal is now replaced by a dedicated page. Keep this block removed. */}
    </>
  );
};
