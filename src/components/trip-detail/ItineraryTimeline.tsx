"use client";

import React from 'react';
import { Trip, ItineraryDay, Activity } from '@/lib/trip-data';
import { format, isValid, parseISO } from 'date-fns';
import Link from 'next/link';
import { Button } from '../ui/button';
import { PencilSquareIcon } from '@heroicons/react/24/solid';

type ItineraryTimelineProps = {
    trip: Trip;
    onDaySelect: (day: ItineraryDay) => void;
}

// A simple, reusable card for displaying a single activity in the main timeline
const TimelineActivityCard = ({ activity }: { activity: Activity }) => {
  const isBooked = Boolean(activity.bookingDetails) || activity.type === 'Accommodation' || activity.type === 'Travel';
  const prefix = isBooked ? '✅ ' : '';
  const subtitle = activity.type === 'Travel' && activity.duration ? `${activity.type} • ${activity.duration} hours` : activity.type;
  return (
  <div className="text-left w-full mt-2 p-3 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-default" title={activity.name}>
      <p className="font-semibold text-sm">{prefix}{activity.name}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
};

export const ItineraryTimeline = ({ trip, onDaySelect }: ItineraryTimelineProps) => {
    const safeFormat = (dateStr: string | Date, fmt: string) => {
      try {
        const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
        return isValid(d) ? format(d, fmt) : String(dateStr);
      } catch {
        return String(dateStr);
      }
    };
    return (
        <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl font-bold">{trip.name}</h1>
                <Link href="/plan">
                  <Button variant="outline" className="rounded-full font-semibold flex items-center gap-2">
                    <PencilSquareIcon className="h-5 w-5" />
                    Edit Trip
                  </Button>
                </Link>
              </div>
              <p className="text-lg text-slate-500 mt-2">
                {safeFormat(trip.startDate, 'MMMM d, yyyy')} - {safeFormat(trip.endDate, 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="space-y-2">
              {trip.days.map((day, index) => (
                  <div key={day.day} className="flex gap-4">
                      <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-900 text-white font-bold z-10">{day.day}</div>
                          {index < trip.days.length - 1 && <div className="w-0.5 flex-1 bg-slate-200" />}
                      </div>
                      <div className="pb-8 flex-1">
                          <button onClick={() => onDaySelect(day)} className="text-left w-full hover:bg-slate-50 p-2 rounded-lg">
                              <p className="font-semibold text-slate-500">{safeFormat(day.date, 'EEEE, MMMM d')}</p>
                              <h3 className="text-xl font-bold">{day.location}: {day.title}</h3>
                          </button>
                          
                          {/* FIX: Display ALL activities for the day in the timeline */}
                          <div className="mt-2 space-y-2">
                            {day.activities.map(activity => (
                                <TimelineActivityCard key={activity.id} activity={activity} />
                            ))}
                          </div>
                      </div>
                  </div>
              ))}
            </div>
        </div>
    );
};
