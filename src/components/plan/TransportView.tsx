"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trip, TransportOption } from '@/lib/trip-data';
import { TravelLegsSidebar } from './TravelLegsSidebar';
import { TransportSelectionPanel } from './TransportSelectionPanel';
import { toast } from 'sonner';

type TransportViewProps = {
  trip: Trip;
  setTrip: (trip: Trip) => void;
};

export type TravelLeg = {
  from: string;
  to: string;
  dayNumber: number;
};

export const TransportView = ({ trip, setTrip }: TransportViewProps) => {
  const [selectedLeg, setSelectedLeg] = useState<TravelLeg | null>(null);
  const [highlightDay, setHighlightDay] = useState<number | null>(null);

  const handleTransportSelect = (option: TransportOption) => {
    if (!selectedLeg) return;

    const updatedDays = trip.days.map(day => {
      if (day.day !== selectedLeg.dayNumber) return day;
      const label = option.category === 'Private Hire' ? '✅ Hired: Vehicle' : `✅ ${option.name}`;
      const updated: typeof day = { ...day };
      const idx = updated.activities.findIndex(a => a.type === 'Travel');
      if (idx >= 0) {
        updated.activities = updated.activities.map((act, i) => i === idx ? {
          ...act,
          name: label,
          cost: option.cost,
          duration: option.time,
          bookingDetails: { provider: option.provider }
        } : act);
      } else {
        // Insert a new Travel activity at the top so the sidebar can read it
        updated.activities = [
          {
            id: `travel-${Date.now()}`,
            name: label,
            type: 'Travel',
            duration: option.time,
            cost: option.cost,
            bookingDetails: { provider: option.provider }
          },
          ...updated.activities
        ];
      }
      return updated;
    });
    
    setTrip({ ...trip, days: updatedDays });
    setSelectedLeg(null);
    setHighlightDay(selectedLeg.dayNumber);
    try { toast.success(`Added transport: ${option.name}`); } catch {}
    // Clear highlight after a short delay
    window.setTimeout(() => setHighlightDay(null), 1200);
  };

  const handleClearLeg = (leg: TravelLeg) => {
    // Reset the Travel activity to a generic placeholder
    const updatedDays = trip.days.map(day => {
      if (day.day !== leg.dayNumber) return day;
      const placeholder = `Travel to ${leg.to}`;
      const updated = { ...day };
      const idx = updated.activities.findIndex(a => a.type === 'Travel');
      if (idx >= 0) {
        updated.activities = updated.activities.map((a, i) => i === idx ? {
          ...a,
          name: placeholder,
          duration: 0,
          cost: 0,
          bookingDetails: undefined
        } : a);
      } else {
        updated.activities = [
          { id: `travel-${Date.now()}`, name: placeholder, type: 'Travel', duration: 0, cost: 0 },
          ...updated.activities
        ];
      }
      return updated;
    });
    setTrip({ ...trip, days: updatedDays });
    setHighlightDay(leg.dayNumber);
    window.setTimeout(() => setHighlightDay(null), 800);
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-12 h-full min-h-0"
      >
  <div className="col-span-4 h-full min-h-0 overflow-y-auto bg-white border-r">
          <TravelLegsSidebar 
              trip={trip}
              selectedLeg={selectedLeg}
              onSelectLeg={setSelectedLeg}
              onClearLeg={handleClearLeg}
              highlightDayNumber={highlightDay}
          />
        </div>
        <div className="col-span-8 h-full bg-slate-50 flex flex-col min-h-0">
          <TransportSelectionPanel
              key={selectedLeg?.dayNumber}
              selectedLeg={selectedLeg}
              onSelectOption={handleTransportSelect}
              tripInterests={trip.interests || []}
          />
        </div>
      </motion.div>
  );
};