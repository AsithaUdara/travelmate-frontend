"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trip, Activity } from '@/lib/trip-data';
import { AccommodationSidebar } from './AccommodationSidebar';
import { AccommodationSelectionPanel } from './AccommodationSelectionPanel';
import { Place } from '@/lib/mock-data';

type AccommodationViewProps = {
  trip: Trip;
  setTrip: (trip: Trip) => void;
};

export const AccommodationView = ({ trip, setTrip }: AccommodationViewProps) => {
  const locationsToBook = useMemo(() => {
    // Guard against trip.days not being available during initial renders
    if (!trip?.days) return [];
    
    const locations = new Map<string, { count: number }>();
    trip.days.forEach(day => {
      const existing = locations.get(day.location);
      locations.set(day.location, { count: (existing?.count || 0) + 1 });
    });
    return Array.from(locations.entries()).map(([name, data]) => ({ name, nights: data.count }));
  }, [trip.days]);

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        const remembered = localStorage.getItem('tm_accommodation_selected_location');
        if (remembered && locationsToBook.some(l => l.name === remembered)) {
          setSelectedLocation(remembered);
        } else if (locationsToBook.length > 0 && !selectedLocation) {
          // Default to the first location if nothing is selected yet
          const firstLocation = locationsToBook[0].name;
          setSelectedLocation(firstLocation);
          localStorage.setItem('tm_accommodation_selected_location', firstLocation);
        }
      } catch (error) {
        console.error("Could not access localStorage:", error);
      }
    }
  }, [isClient, locationsToBook, selectedLocation]);

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    try { 
      localStorage.setItem('tm_accommodation_selected_location', loc); 
    } catch {}
  };

  return (
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
          onSelectLocation={handleSelectLocation}
        />
      </div>
      <div className="col-span-8 h-full bg-slate-50 min-h-0 flex flex-col">
        {!selectedLocation ? (
          <div className="flex-1 min-h-0 flex items-center justify-center p-8">
            <div className="text-center text-slate-600">
              <p className="text-lg font-semibold">Select a location to see stays</p>
              <p className="text-sm mt-1">Choose a city or area to browse accommodation.</p>
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
  );
};