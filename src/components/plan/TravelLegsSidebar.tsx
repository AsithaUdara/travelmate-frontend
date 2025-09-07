"use client";

import React from 'react';
import { Trip } from '@/lib/trip-data';
import { TravelLeg } from './TransportView'; // Import the type
import { cn } from '@/lib/utils';
import { ArrowLongRightIcon } from '@heroicons/react/24/solid';

type TravelLegsSidebarProps = {
  trip: Trip;
  selectedLeg: TravelLeg | null;
  onSelectLeg: (leg: TravelLeg) => void;
};

export const TravelLegsSidebar = ({ trip, selectedLeg, onSelectLeg }: TravelLegsSidebarProps) => {

  // Intelligently generate the list of travel legs from the trip data
  const travelLegs: TravelLeg[] = [];
  trip.days.forEach((day, index) => {
    if (index > 0) {
      const prevDay = trip.days[index - 1];
      if (day.location !== prevDay.location) {
        travelLegs.push({
          from: prevDay.location,
          to: day.location,
          dayNumber: day.day,
        });
      }
    }
  });

  // Helper: detect generic placeholder like "Travel to Yala/Mirissa/..."
  const isGenericTravelPlaceholder = (name?: string) => {
    if (!name) return true;
    return /^travel to\s+/i.test(name.trim());
  };

  // Function to check if a leg has been planned (not only checkmark-prefixed)
  const isLegPlanned = (leg: TravelLeg) => {
    const day = trip.days.find(d => d.day === leg.dayNumber);
    const a = day?.activities.find(act => act.type === 'Travel');
    if (!a) return false;
    // Treat explicit placeholders like "Travel to XYZ" as NOT planned,
    // regardless of any default duration/cost values in seed data.
    if (isGenericTravelPlaceholder(a.name)) return false;
    // Otherwise, consider it planned if it has any meaningful details
    // or explicitly uses the checkmark prefix.
    return (
      Boolean(a.bookingDetails) ||
      (a.cost != null && a.cost > 0) ||
      (a.duration != null && a.duration > 0) ||
      (a.name?.startsWith('✅') ?? false)
    );
  };

  const getPlannedLabel = (leg: TravelLeg) => {
    const day = trip.days.find(d => d.day === leg.dayNumber);
    const a = day?.activities.find(act => act.type === 'Travel');
    if (!a) return '';
    return a.name || '';
  };

  const getPlannedMeta = (leg: TravelLeg) => {
    const day = trip.days.find(d => d.day === leg.dayNumber);
    const a = day?.activities.find(act => act.type === 'Travel');
    if (!a) return '';
    const parts: string[] = [];
    if (a.duration && a.duration > 0) {
      const dur = a.duration % 1 === 0 ? `${a.duration}` : `${a.duration}`;
      parts.push(`~${dur}h`);
    }
    if (typeof a.cost === 'number' && a.cost > 0) {
      const cost = `LKR ${a.cost.toLocaleString('en-LK')}`;
      const per = a.name?.toLowerCase().includes('hired') ? ' / day' : '';
      parts.push(cost + per);
    }
    return parts.join(' • ');
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="pb-4 border-b">
        <h1 className="text-2xl font-bold">Plan Your Transport</h1>
        <p className="text-slate-500">Select a travel leg to see AI-powered options.</p>
      </div>
      
  <div className="mt-6 flex-1 overflow-y-auto pr-2 pb-28 space-y-2" aria-label="Travel legs list">
        {travelLegs.map((leg, index) => (
          <div 
            key={index}
            className={cn(
              "p-4 rounded-lg cursor-pointer border-2",
              selectedLeg?.dayNumber === leg.dayNumber ? "border-slate-900 bg-slate-50" : "border-transparent hover:bg-slate-50"
            )}
            onClick={() => onSelectLeg(leg)}
          >
            <p className="text-sm text-slate-500 font-semibold">LEG {index + 1}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="font-bold text-lg">{leg.from}</p>
              <ArrowLongRightIcon className="h-5 w-5 text-slate-400"/>
              <p className="font-bold text-lg">{leg.to}</p>
            </div>
            {isLegPlanned(leg) ? (
              <>
                <p className="text-sm font-semibold text-green-600 mt-2">
                  {getPlannedLabel(leg)}
                </p>
                {getPlannedMeta(leg) && (
                  <p className="text-xs text-slate-500 mt-1">{getPlannedMeta(leg)}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 mt-2">Select a transport option</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};