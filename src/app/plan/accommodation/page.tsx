"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AccommodationView } from '@/components/plan/AccommodationView';
import { PlanActions } from '@/components/plan/PlanActions';
import { useDraftTrip } from '@/lib/draft-trip';
import { SaveTripModal } from '@/components/plan/SaveTripModal';
import { saveTrip } from '@/services/trips';
import { toast } from 'sonner';

export default function PlanAccommodationPage() {
  const router = useRouter();
  const [trip, setTrip] = useDraftTrip();
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('tm_plan_started', '1');
  localStorage.setItem('tm_plan_step', '3');
      document.dispatchEvent(new CustomEvent('tm:plan-started'));
  document.dispatchEvent(new CustomEvent('tm:plan-step', { detail: { step: 3 } }));
    } catch {}
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async (newName: string, coverImage?: string) => {
    setSaving(true);
    try {
      const savedTrip = await saveTrip({ ...trip, name: newName }, coverImage);
      toast.success('Trip saved successfully!');
      setIsSaveOpen(false);
      router.push('/my-trips');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save trip');
    } finally {
      setSaving(false);
    }
  };

  if (!mounted) return null;

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
      <SaveTripModal isOpen={isSaveOpen} setIsOpen={setIsSaveOpen} defaultTripName={trip.name} onSave={handleSave} />
    </div>
  );
}
