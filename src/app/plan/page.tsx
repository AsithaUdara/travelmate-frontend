"use client";

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { InitialPlanner } from '@/components/plan/InitialPlanner';
import { ItineraryView } from '@/components/plan/ItineraryView';
import { mockTrip, Trip } from '@/lib/trip-data';
import { WelcomeAIPrompt } from '@/components/plan/WelcomeAIPrompt';

const InitialPlanMap = dynamic(() =>
  import('@/components/plan/InitialPlanMap').then(mod => mod.PlanMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

function PlanPageContent() {
  const [isPlanningStarted, setIsPlanningStarted] = useState(false);
  const [trip, setTrip] = useState<Trip>(mockTrip); // The trip state now lives here

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
          // We pass the trip data AND the function to update it down to the ItineraryView
          <ItineraryView trip={trip} setTrip={setTrip} />
        )}
      </AnimatePresence>

      {/* Show the welcome prompt only right after the trip is generated */}
      {isPlanningStarted && <WelcomeAIPrompt />}
    </div>
  );
}

// The outer component with Suspense remains the same
export default function PlanPage() {
    return (
        <Suspense fallback={<div className="flex-1 bg-slate-100 flex items-center justify-center">Loading...</div>}>
            <PlanPageContent />
        </Suspense>
    )
}