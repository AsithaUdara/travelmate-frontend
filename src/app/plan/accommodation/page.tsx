"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccommodationView } from '@/components/plan/AccommodationView';
import { PlanActions } from '@/components/plan/PlanActions';
import { useDraftTrip } from '@/lib/draft-trip';
import { SaveTripModal } from '@/components/plan/SaveTripModal';
import { saveTrip } from '@/lib/trip-manager';

// This is the page component that will be rendered.
export default function PlanAccommodationPage() {
  const router = useRouter();
  const [trip, setTrip] = useDraftTrip();
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  // --- HYDRATION FIX ---
  // We introduce a state to ensure this component only renders its real content
  // after it has mounted on the client. This prevents a mismatch with the server.
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This runs once after the initial render on the client-side
    setIsClient(true); 

    try {
      localStorage.setItem('tm_plan_started', '1');
      localStorage.setItem('tm_plan_step', '3');
      document.dispatchEvent(new CustomEvent('tm:plan-started'));
      document.dispatchEvent(new CustomEvent('tm:plan-step', { detail: { step: 3 } }));
    } catch {}
  }, []);

  const handleSave = (newName: string) => {
    if (!trip) return; // Guard against trip not being loaded yet
    saveTrip({ ...trip, name: newName });
    setIsSaveOpen(false);
    router.push('/my-trips');
  };

  // While not on the client OR if the trip data is not ready, show a loading state.
  // This is the key to fixing the hydration error.
  if (!isClient || !trip) {
    return (
        <div className="h-full flex items-center justify-center">
            <p>Loading your trip plan...</p>
        </div>
    );
  }

  // Once mounted and trip is loaded, render the full page.
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <AccommodationView trip={trip} setTrip={setTrip} />
      </div>
      <PlanActions
        currentStepIndex={2}
        totalSteps={3}
        nextButtonText={'Finalize & Save Trip'}
        onNext={() => setIsSaveOpen(true)}
        onBack={() => router.push('/plan/transport')}
        onSkip={() => setIsSaveOpen(true)}
      />
      <SaveTripModal 
        isOpen={isSaveOpen} 
        setIsOpen={setIsSaveOpen} 
        defaultTripName={trip.name} 
        onSave={handleSave} 
      />
    </div>
  );
}