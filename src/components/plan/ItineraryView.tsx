"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItinerarySidebar } from './ItinerarySidebar';
import { ItineraryDay, Trip, Activity } from '@/lib/trip-data';
import { DayDetailView } from './DayDetailView';
import { WelcomeAIPrompt } from './WelcomeAIPrompt'; // <-- IMPORT THE PROMPT
import dynamic from 'next/dynamic';

const ItineraryMap = dynamic(() =>
  import('./ItineraryMap').then(mod => mod.ItineraryMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

type ItineraryViewProps = {
  trip: Trip;
  setTrip: (trip: Trip) => void;
};

export const ItineraryView = ({ trip, setTrip }: ItineraryViewProps) => {
  const [activeDay, setActiveDay] = useState<ItineraryDay | null>(trip.days.length > 0 ? trip.days[0] : null);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);

  const handleDaySelect = (day: ItineraryDay) => {
    setSelectedDay(day);
    setActiveDay(day);
  };

  const handleGoBack = () => {
    setSelectedDay(null);
  };

  const handleAddActivity = (dayNumber: number, activity: Activity) => {
    const updatedDays = trip.days.map(day => {
      if (day.day === dayNumber) {
        return { ...day, activities: [...day.activities, activity] };
      }
      return day;
    });

    const updatedTrip = { ...trip, days: updatedDays };
    setTrip(updatedTrip);

    setSelectedDay(updatedTrip.days.find(d => d.day === dayNumber) || null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-12 h-full relative" // <-- Add relative positioning
    >
      {/* ADD THE WELCOME PROMPT HERE */}
      <WelcomeAIPrompt />

      <div className="col-span-4 h-full overflow-hidden bg-white relative">
        <AnimatePresence mode="wait">
          {selectedDay ? (
            <DayDetailView 
                key={selectedDay.day}
                day={selectedDay}
                onBack={handleGoBack}
                onAddActivity={handleAddActivity}
                interests={trip.interests}
            />
          ) : (
            <ItinerarySidebar 
                key="trip-overview"
                trip={trip}
                setTrip={setTrip} 
                activeDay={activeDay} 
                onDaySelect={handleDaySelect}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="col-span-8 h-full">
        <ItineraryMap days={trip.days} activeDay={activeDay} setActiveDay={setActiveDay} />
      </div>
    </motion.div>
  );
};