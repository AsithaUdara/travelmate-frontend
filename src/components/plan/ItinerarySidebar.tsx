"use client";

import React, { useState } from 'react';
import { Trip, ItineraryDay, searchablePlaces } from '@/lib/trip-data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type ItinerarySidebarProps = {
  trip: Trip;
  setTrip: (trip: Trip) => void;
  activeDay: ItineraryDay | null;
  setActiveDay: (day: ItineraryDay | null) => void;
};

export const ItinerarySidebar = ({ trip, setTrip, activeDay, setActiveDay }: ItinerarySidebarProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const searchResults = searchablePlaces.filter(place => 
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDestination = (placeToAdd: typeof searchablePlaces[0]) => {
    const newDay: ItineraryDay = {
      day: trip.days.length + 1,
      date: "New Date",
      location: placeToAdd.name,
      title: `Exploring ${placeToAdd.name}`,
      activities: [],
      latitude: placeToAdd.latitude,
      longitude: placeToAdd.longitude,
    };

    const updatedDays = [...trip.days, newDay].map((day, index) => ({
      ...day,
      day: index + 1
    }));
    
    setTrip({ ...trip, days: updatedDays });
    setIsSearching(false);
    setSearchQuery("");
  };

  const handleRemoveDay = (dayToRemove: number) => {
     const updatedDays = trip.days
        .filter(day => day.day !== dayToRemove)
        .map((day, index) => ({ ...day, day: index + 1 }));
    
    setTrip({ ...trip, days: updatedDays });
    if(activeDay?.day === dayToRemove) {
        setActiveDay(updatedDays.length > 0 ? updatedDays[0] : null);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="pb-4 border-b">
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <p className="text-slate-500">Oct 5th - Oct 15th, 2025</p>
      </div>
      
      <div className="mt-6 flex-1 overflow-y-auto pr-2">
        {trip.days.map((day, index) => (
          <div 
            key={day.day} 
            className="relative"
            onMouseEnter={() => setHoveredDay(day.day)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            {index < trip.days.length - 1 && (
              <div className="absolute top-5 left-[18px] w-0.5 h-full bg-slate-200" />
            )}

            <div 
              className={cn(
                "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors",
                activeDay?.day === day.day ? "bg-slate-100" : "hover:bg-slate-50"
              )}
              onClick={() => setActiveDay(day)}
            >
              <div className="relative z-10">
                <div className={cn(
                  "flex items-center justify-center h-10 w-10 rounded-full font-bold",
                  activeDay?.day === day.day ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700"
                )}>
                  {day.day}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-bold">{day.location}</p>
                <p className="text-sm text-slate-500">{day.title}</p>
              </div>
              {hoveredDay === day.day && (
                 <motion.div initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={(e) => {e.stopPropagation(); handleRemoveDay(day.day)}}>
                        <XMarkIcon className="h-5 w-5"/>
                    </Button>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <AnimatePresence>
        {isSearching ? (
          <motion.div 
            key="search-view"
            initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}
          >
            <Input 
              placeholder="Search for a city or attraction..." 
              className="h-12 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="mt-4 space-y-2">
              {searchResults.map(place => (
                <button key={place.id} onClick={() => handleAddDestination(place)} className="w-full text-left p-3 rounded-lg hover:bg-slate-100">
                  <p className="font-semibold">{place.name}</p>
                  <p className="text-sm text-slate-500">{place.type}</p>
                </button>
              ))}
            </div>
             <Button variant="ghost" className="w-full mt-2" onClick={() => setIsSearching(false)}>Cancel</Button>
          </motion.div>
        ) : (
          <motion.div key="add-button" initial={{opacity: 0}} animate={{opacity: 1}}>
            {/* FIX: Correct button styling */}
            <Button variant="outline" className="w-full rounded-full h-12 flex items-center justify-center gap-2 font-semibold" onClick={() => setIsSearching(true)}>
              + Add a Destination
            </Button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </div>
  );
};