"use client";

import React, { useEffect, useState } from 'react';

export default function PlanWeatherPage() {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem('tm_plan_started', '1');
      setStarted(true);
    } catch {}
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Weather</h1>
      <p className="text-slate-500">Coming soon: forecast and seasonal tips for your itinerary days.</p>
      {started && (
        <div className="mt-4 p-4 rounded-lg border bg-white text-sm text-slate-700">
          We’ll pull weather insights for each location and date in your plan.
        </div>
      )}
    </div>
  );
}
