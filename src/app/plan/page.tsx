"use client";

import React, { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';
import { InitialPlanner } from '@/components/plan/InitialPlanner';
import { ItineraryView } from '@/components/plan/ItineraryView';
import { TransportView } from '@/components/plan/TransportView';
import { AccommodationView } from '@/components/plan/AccommodationView';
import { PlanActions } from '@/components/plan/PlanActions';
import { SaveTripModal } from '@/components/plan/SaveTripModal';
import { Trip } from '@/lib/trip-data';
import { useDraftTrip } from '@/lib/draft-trip';
import { saveTrip } from '@/lib/trip-manager';
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

const InitialPlanMap = dynamic(() =>
  import('@/components/plan/InitialPlanMap').then(mod => mod.PlanMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

const PLANNER_STEPS = ['itinerary', 'transport', 'accommodation'];
const NEXT_BUTTON_TEXTS = ['Next: Plan Transport', 'Next: Book Accommodation', 'Finalize & Save Trip'];

function PlanPageContent() {
  const router = useRouter();
  const [isPlanningStarted, setIsPlanningStarted] = useState(false);
  const [trip, setTrip] = useDraftTrip();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  // If the user lands on /plan after starting, redirect to the last unlocked step
  useEffect(() => {
    try {
      const started = typeof window !== 'undefined' ? localStorage.getItem('tm_plan_started') === '1' : false;
      if (started && typeof window !== 'undefined' && window.location.pathname === '/plan') {
        const stepStr = localStorage.getItem('tm_plan_step');
        const step = stepStr ? parseInt(stepStr) : 1;
        const target = step >= 3 ? '/plan/accommodation' : step === 2 ? '/plan/transport' : '/plan/itinerary';
        router.replace(target);
      }
    } catch {}
  }, [router]);

  const currentStep = PLANNER_STEPS[currentStepIndex];

  const handleGenerateTrip = () => {
    setIsPlanningStarted(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tm_plan_started', '1');
        document.dispatchEvent(new CustomEvent('tm:plan-started'));
      }
    } catch {}
    // Navigate to the first planner subpage for a clear URL
    router.push('/plan/itinerary');
  };

  const handleNextStep = () => {
    if (currentStepIndex < PLANNER_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsSaveModalOpen(true);
    }
  };

  const handleSkipStep = () => {
     if (currentStepIndex < PLANNER_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  }
  
  const handleBackStep = () => {
    if (currentStepIndex > 0) {
        setCurrentStepIndex(currentStepIndex - 1);
    }
  }

  const handleSaveTrip = (newName: string) => {
    const finalTrip = { ...trip, name: newName };
    saveTrip(finalTrip);
    toast.success("Trip Saved Successfully!", {
      description: "You can find all your plans under 'My Trips'.",
      action: {
        label: "View My Trips",
        onClick: () => router.push('/my-trips'),
      },
    });
    router.push('/my-trips');
  };

  return (
    <>
      <div className="relative h-full w-full">
        <AnimatePresence>
          {!isPlanningStarted ? (
            <div key="initial-planner" className="absolute inset-0 z-10 flex items-center justify-center p-4">
              <div className="absolute inset-0 z-0"> <InitialPlanMap /> </div>
              <InitialPlanner onGenerate={handleGenerateTrip} />
            </div>
          ) : (
            <div key="main-planner" className="relative h-full flex flex-col">
              <div className="flex-grow overflow-hidden">
                  <AnimatePresence mode="wait">
                      {currentStep === 'itinerary' && <ItineraryView key="itinerary" trip={trip} setTrip={setTrip} />}
                      {currentStep === 'transport' && <TransportView key="transport" trip={trip} setTrip={setTrip} />}
                      {currentStep === 'accommodation' && <AccommodationView key="accommodation" trip={trip} setTrip={setTrip} />}
                  </AnimatePresence>
              </div>
              <PlanActions 
                  currentStepIndex={currentStepIndex} totalSteps={PLANNER_STEPS.length}
                  onNext={handleNextStep} onBack={handleBackStep} onSkip={handleSkipStep}
                  nextButtonText={NEXT_BUTTON_TEXTS[currentStepIndex]}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
      <SaveTripModal 
        isOpen={isSaveModalOpen}
        setIsOpen={setIsSaveModalOpen}
        defaultTripName={trip.name}
        onSave={handleSaveTrip}
      />
    </>
  );
}

export default function PlanPage() {
    return (
        <Suspense fallback={<div className="flex-1 bg-slate-100 flex items-center justify-center">Loading...</div>}>
            <PlanPageContent />
        </Suspense>
    )
}