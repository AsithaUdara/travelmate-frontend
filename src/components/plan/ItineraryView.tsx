"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ItinerarySidebar } from './ItinerarySidebar';
import { ItineraryDay, Trip } from '@/lib/trip-data';
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-12 h-full"
    >
      <div className="col-span-4 h-full overflow-y-auto bg-white">
        <ItinerarySidebar trip={trip} setTrip={setTrip} activeDay={activeDay} setActiveDay={setActiveDay} />
      </div>
      <div className="col-span-8 h-full">
        <ItineraryMap days={trip.days} activeDay={activeDay} setActiveDay={setActiveDay} />
      </div>
    </motion.div>
  );
};