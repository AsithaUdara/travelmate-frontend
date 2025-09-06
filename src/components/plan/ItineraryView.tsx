"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItinerarySidebar } from './ItinerarySidebar';
import { ItineraryDay, Trip, Activity, TransportOption, mockTransportOptions } from '@/lib/trip-data';
import { DayDetailView } from './DayDetailView';
import { TransportOptionsModal } from './TransportOptionsModal';
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
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);
  const [selectedTravelLeg, setSelectedTravelLeg] = useState<{from: string, to: string, dayNumber: number} | null>(null);

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

  const handleOpenTransportModal = (from: string, to: string, dayNumber: number) => {
    setSelectedTravelLeg({ from, to, dayNumber });
    setIsTransportModalOpen(true);
  };

  const handleTransportSelect = (option: TransportOption) => {
    if (!selectedTravelLeg) return;

    const updatedDays = trip.days.map(day => {
        if (day.day === selectedTravelLeg.dayNumber) {
            const updatedActivities = day.activities.map(act => 
                act.type === 'Travel' 
                ? { ...act, name: `✅ ${option.type} to ${selectedTravelLeg.to} (Booked)`, cost: option.cost } 
                : act
            );
            return { ...day, activities: updatedActivities };
        }
        return day;
    });
    
    setTrip({ ...trip, days: updatedDays });
  };
  
  const transportOptions = selectedTravelLeg ? mockTransportOptions[`${selectedTravelLeg.from}-${selectedTravelLeg.to}`] : [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-12 h-full"
      >
        <div className="col-span-4 h-full overflow-hidden bg-white relative">
          <AnimatePresence mode="wait">
            {selectedDay ? (
              <DayDetailView 
                  key={selectedDay.day}
                  day={selectedDay}
                  onBack={handleGoBack}
                  onAddActivity={handleAddActivity}
              />
            ) : (
              <ItinerarySidebar 
                  key="trip-overview"
                  trip={trip}
                  setTrip={setTrip} 
                  activeDay={activeDay} 
                  onDaySelect={handleDaySelect}
                  onPlanTransport={handleOpenTransportModal}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="col-span-8 h-full">
          <ItineraryMap days={trip.days} activeDay={activeDay} setActiveDay={setActiveDay} />
        </div>
      </motion.div>

      {/* The Modal Itself */}
      <TransportOptionsModal
        isOpen={isTransportModalOpen}
        setIsOpen={setIsTransportModalOpen}
        options={transportOptions}
        from={selectedTravelLeg?.from || ''}
        to={selectedTravelLeg?.to || ''}
        onSelect={handleTransportSelect}
      />
    </>
  );
};