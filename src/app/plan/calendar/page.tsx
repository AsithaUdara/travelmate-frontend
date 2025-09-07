"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { getAllTrips } from '@/lib/trip-manager';
import { format } from 'date-fns';

export default function PlannerCalendarPage() {
  const trips = getAllTrips();
  const active = trips[0];

  const dates = (active?.days || []).map(d => new Date(d.date));

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
              <p className="font-semibold">{format(new Date(d.date), 'PPP')}: Day {d.day} - {d.location} • {d.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
