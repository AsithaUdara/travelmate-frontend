"use client";

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { InitialPlanner } from '@/components/plan/InitialPlanner';

const InitialPlanMap = dynamic(() =>
  import('@/components/plan/InitialPlanMap').then(mod => mod.PlanMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-slate-200 animate-pulse" /> }
);

function PlanPageContent() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 z-0">
        <InitialPlanMap />
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <InitialPlanner />
      </div>
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-slate-100 flex items-center justify-center">Loading...</div>}>
      <PlanPageContent />
    </Suspense>
  );
}