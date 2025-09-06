"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { InitialPlanner } from '@/components/plan/InitialPlanner';
import { ItineraryView } from '@/components/plan/ItineraryView';
import { mockTrip, Trip } from '@/lib/trip-data';

const InitialPlanMap = dynamic(() =>
  import('@/components/plan/InitialPlanMap').then(mod => mod.PlanMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

export default function PlanPage() {
  const [isPlanningStarted, setIsPlanningStarted] = useState(false);
  // NEW: The trip state now lives here, so it can be modified
  const [trip, setTrip] = useState<Trip>(mockTrip);

  const handleGenerateTrip = () => {
    setIsPlanningStarted(true);
  };

  return (
    <div className="relative h-full w-full">
      <AnimatePresence>
        {!isPlanningStarted ? (
          <div key="initial-planner" className="absolute inset-0 z-10 flex items-center justify-center p-4">
            <div className="absolute inset-0 z-0">
                <InitialPlanMap />
            </div>
            <InitialPlanner onGenerate={handleGenerateTrip} />
          </div>
        ) : (
          <ItineraryView trip={trip} setTrip={setTrip} />
        )}
      </AnimatePresence>
    </div>
  );
}