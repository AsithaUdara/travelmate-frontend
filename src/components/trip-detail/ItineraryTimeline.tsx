"use client";

import React from 'react';
import { Trip, ItineraryDay, Activity } from '@/lib/trip-data';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '../ui/button';
import { PencilSquareIcon, BuildingOfficeIcon, TicketIcon } from '@heroicons/react/24/solid';

type ItineraryTimelineProps = {
    trip: Trip;
    onDaySelect: (day: ItineraryDay) => void;
    onAccommodationSelect: (activity: Activity) => void;
    onTravelSelect: (leg: { from: string, to: string, activity: Activity }) => void;
}

// A dedicated card for Accommodation and Travel items in the timeline
const LogisticalItemCard = ({ activity, icon: Icon, onClick }: { activity: Activity, icon: React.ElementType, onClick: () => void }) => (
    <button onClick={onClick} className="w-full mt-2 p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors">
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-slate-500"/>
            <div className="text-left">
                <p className="font-semibold text-sm">{activity.name}</p>
                <p className="text-xs text-slate-500">{activity.type}</p>
            </div>
        </div>
    </button>
);

export const ItineraryTimeline = ({ trip, onDaySelect, onAccommodationSelect, onTravelSelect }: ItineraryTimelineProps) => {
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
                {format(new Date(trip.startDate), 'MMMM d, yyyy')} - {format(new Date(trip.endDate), 'MMMM d, yyyy')}
              </p>
            </div>
            <div className="space-y-2">
              {trip.days.map((day, index) => {
                  const prevDay = index > 0 ? trip.days[index - 1] : null;
                  const accommodation = day.activities.find(a => a.type === 'Accommodation');
                  const travel = day.activities.find(a => a.type === 'Travel');

                  return (
                      <div key={day.day} className="flex gap-4">
                          <div className="flex flex-col items-center">
                              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-slate-900 text-white font-bold z-10">{day.day}</div>
                              {index < trip.days.length - 1 && <div className="w-0.5 flex-1 bg-slate-200" />}
                          </div>
                          <div className="pb-8 flex-1">
                              <button onClick={() => onDaySelect(day)} className="text-left w-full hover:bg-slate-50 p-2 rounded-lg">
                                  <p className="font-semibold text-slate-500">{format(new Date(day.date), 'EEEE, MMMM d')}</p>
                                  <h3 className="text-xl font-bold">{day.location}: {day.title}</h3>
                              </button>
                              
                              {/* Display accommodation and travel cards separately and make them clickable */}
                              {accommodation && <LogisticalItemCard activity={accommodation} icon={BuildingOfficeIcon} onClick={() => onAccommodationSelect(accommodation)} />}
                              {travel && prevDay && <LogisticalItemCard activity={travel} icon={TicketIcon} onClick={() => onTravelSelect({ from: prevDay.location, to: day.location, activity: travel })} />}
                          </div>
                      </div>
                  )
              })}
            </div>
        </div>
    );
};
