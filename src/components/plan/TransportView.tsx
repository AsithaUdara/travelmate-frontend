"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trip, TransportOption, Vehicle, mockTransportOptions } from '@/lib/trip-data';
import { TravelLegsSidebar } from './TravelLegsSidebar';
import { TransportSelectionPanel } from './TransportSelectionPanel';
import { VehicleRentalModal } from './VehicleRentalModal';

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
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const showRentalNotice = () => {
    // Dispatch a custom event that the header listens to
    if (typeof document !== 'undefined') {
      document.dispatchEvent(new CustomEvent('tm:show-rental-notice'));
    }
  };

  const handleTransportSelect = (option: TransportOption) => {
    if (!selectedLeg) return;

    const updatedDays = trip.days.map(day => {
        if (day.day === selectedLeg.dayNumber) {
            const updatedActivities = day.activities.map(act => 
                act.type === 'Travel' 
                ? { 
                    ...act, 
                    name: `${option.name}`,
                    cost: option.cost, 
                    duration: option.time,
                    bookingDetails: { provider: option.provider }
                  } 
                : act
            );
            return { ...day, activities: updatedActivities };
        }
        return day;
    });
    
    setTrip({ ...trip, days: updatedDays });
    setSelectedLeg(null);
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    if (!selectedLeg) return;
    const updatedDays = trip.days.map(day => {
        if (day.day === selectedLeg.dayNumber) {
            const updatedActivities = day.activities.map(act => 
                act.type === 'Travel' 
                ? { ...act, name: `✅ Hired: ${vehicle.name}`, cost: vehicle.pricePerDay, duration: 0 } 
                : act
            );
            return { ...day, activities: updatedActivities };
        }
        return day;
    });
    setTrip({ ...trip, days: updatedDays });
    setIsRentalModalOpen(false);
    setSelectedLeg(null);
  }
  
  const transportOptions = (selectedLeg ? mockTransportOptions[`${selectedLeg.from}-${selectedLeg.to}`] : []) || [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-12 h-full"
      >
        <div className="col-span-4 h-full overflow-y-auto bg-white border-r">
          <TravelLegsSidebar 
              trip={trip}
              selectedLeg={selectedLeg}
              onSelectLeg={setSelectedLeg}
          />
        </div>
        <div className="col-span-8 h-full bg-slate-50">
          <TransportSelectionPanel
              selectedLeg={selectedLeg}
              transportOptions={transportOptions}
              onSelectOption={handleTransportSelect}
              onOpenRentalModal={() => { /* no-op: modal disabled */ }}
              onRequestRentalNotice={showRentalNotice}
          />
        </div>
      </motion.div>

  {/* Rental modal intentionally disabled; using header notice instead */}
    </>
  );
};