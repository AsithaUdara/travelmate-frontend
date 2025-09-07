"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { getAllTrips } from '@/lib/trip-manager';
import { format, isValid, parseISO } from 'date-fns';

export default function PlannerCalendarPage() {
  const trips = getAllTrips();
  const active = trips[0];

  const dates = (active?.days || [])
    .map(d => {
      // Try ISO parse first; fallback to Date
      const byIso = parseISO(d.date as any);
      const byNew = new Date(d.date as any);
      return isValid(byIso) ? byIso : byNew;
    })
    .filter(d => isValid(d));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Calendar</h1>
      <p className="text-slate-500">Visualize your itinerary dates at a glance.</p>
      <div className="mt-4">
        <Calendar mode="multiple" selected={dates} />
      </div>
      {active && (
        <div className="mt-6 space-y-2">
          {active.days.map(d => (
            <div key={d.day} className="p-3 rounded-lg border bg-white">
              <p className="font-semibold">
                {(() => {
                  const dtIso = parseISO(d.date as any);
                  const dtNew = new Date(d.date as any);
                  const dt = isValid(dtIso) ? dtIso : dtNew;
                  return isValid(dt) ? format(dt, 'PPP') : d.date;
                })()}: Day {d.day} - {d.location} • {d.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
