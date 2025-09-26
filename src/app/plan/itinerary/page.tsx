"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ItineraryView } from '@/components/plan/ItineraryView';
import { Trip } from '@/lib/trip-data';
import { saveDraftTrip, loadDraftTrip } from '@/lib/draft-trip';
import { PlanActions } from '@/components/plan/PlanActions';

function ItineraryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const tripParam = searchParams.get('trip');
    if (tripParam) {
      try {
        const decoded = JSON.parse(atob(tripParam));
        setTrip(decoded);
        try { saveDraftTrip(decoded); } catch {}
      } catch (e) {
        console.error('Failed to parse trip data from URL:', e);
      }
    } else {
      // Fallback: load last draft so the page isn't stuck
      try {
        const draft = loadDraftTrip();
        setTrip(draft);
      } catch {}
    }
  }, [searchParams]);

  if (!trip) {
    return <div className="flex-1 bg-slate-100 flex items-center justify-center">Generating your itinerary...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ItineraryView trip={trip} setTrip={setTrip} />
      </div>
      <PlanActions
        currentStepIndex={0}
        totalSteps={3}
        nextButtonText={'Next: Plan Transport'}
        onNext={() => router.push('/plan/transport')}
        onBack={() => router.push('/plan')}
        onSkip={() => router.push('/plan/transport')}
      />
    </div>
  );
}

export default function PlanItineraryPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-slate-100 flex items-center justify-center">Loading Planner...</div>}>
      <ItineraryPageContent />
    </Suspense>
  );
}
