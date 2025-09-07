"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TransportView } from '@/components/plan/TransportView';
import { PlanActions } from '@/components/plan/PlanActions';
import { useDraftTrip } from '@/lib/draft-trip';

export default function PlanTransportPage() {
  const router = useRouter();
  const [trip, setTrip] = useDraftTrip();

  useEffect(() => {
    try {
      localStorage.setItem('tm_plan_started', '1');
  localStorage.setItem('tm_plan_step', '2');
      document.dispatchEvent(new CustomEvent('tm:plan-started'));
  document.dispatchEvent(new CustomEvent('tm:plan-step', { detail: { step: 2 } }));
    } catch {}
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        <TransportView trip={trip} setTrip={setTrip} />
      </div>
      <PlanActions
        currentStepIndex={1}
        totalSteps={3}
        nextButtonText={'Next: Book Accommodation'}
        onNext={() => router.push('/plan/accommodation')}
        onBack={() => router.push('/plan/itinerary')}
        onSkip={() => router.push('/plan/accommodation')}
      />
    </div>
  );
}
