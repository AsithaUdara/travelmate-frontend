"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ItineraryView } from '@/components/plan/ItineraryView';
import { PlanActions } from '@/components/plan/PlanActions';
import { useDraftTrip } from '@/lib/draft-trip';

export default function PlanItineraryPage() {
  const router = useRouter();
  const [trip, setTrip] = useDraftTrip();

  useEffect(() => {
    try {
      localStorage.setItem('tm_plan_started', '1');
  localStorage.setItem('tm_plan_step', '1');
      document.dispatchEvent(new CustomEvent('tm:plan-started'));
  document.dispatchEvent(new CustomEvent('tm:plan-step', { detail: { step: 1 } }));
    } catch {}
  }, []);

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
