"use client";

import React from 'react';
import { weatherByLocation } from '@/lib/weather';
import { getAllTrips, saveTrip } from '@/lib/trip-manager';
import { Button } from '@/components/ui/button';

export default function PlannerAlertsPage() {
  const trips = getAllTrips();
  const active = trips[0];
  const alerts: Array<{ day: number; message: string; action?: () => void }> = [];

  if (active) {
    active.days.forEach(d => {
      const wf = weatherByLocation[d.location]?.find(x => x.date === d.date);
      if (wf && (wf.condition === 'Thunderstorms' || wf.precipChance >= 50)) {
        alerts.push({
          day: d.day,
          message: `Weather alert for ${d.location} on ${d.date}: ${wf.condition} (${wf.precipChance}% chance). Consider swapping outdoor activities.`,
        });
      }
    });
  }

  const handleSwap = () => {
    if (!active) return;
    if (active.days.length < 2) return;
    const [a, b] = [active.days[5], active.days[6]]; // demo: swap days 6 and 7
    if (!a || !b) return;
    const temp = a.activities;
    a.activities = b.activities;
    b.activities = temp;
    const updated = { ...active, days: [...active.days] };
    saveTrip(updated);
    location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Alerts</h1>
      <p className="text-slate-500">Proactive notifications that help you adapt to real-world changes.</p>

      <div className="mt-6 space-y-3">
        {alerts.length === 0 && <p className="text-slate-500">No alerts right now.</p>}
        {alerts.map(al => (
          <div key={al.day} className="p-4 rounded-lg border bg-white">
            <p className="font-semibold">Day {al.day}</p>
            <p className="text-sm text-slate-600">{al.message}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button className="rounded-full" onClick={handleSwap}>Swap Activities</Button>
      </div>
    </div>
  );
}
