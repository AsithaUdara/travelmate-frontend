"use client";

import React, { useState } from 'react';
import { TransportOption } from '@/lib/trip-data';
import { TravelLeg } from './TransportView';
import { Button } from '../ui/button';
import { StarIcon } from '@heroicons/react/24/solid';
import { ClockIcon, TagIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Car } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type TransportSelectionPanelProps = {
  selectedLeg: TravelLeg | null;
  transportOptions: TransportOption[];
  onSelectOption: (option: TransportOption) => void;
  onOpenRentalModal?: () => void; // legacy: ignored (no modal)
  onRequestRentalNotice?: () => void; // header tip trigger
};

const ComfortRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={cn("h-5 w-5", i < rating ? "text-yellow-400" : "text-slate-300")} />
        ))}
    </div>
);

export const TransportSelectionPanel = ({ selectedLeg, transportOptions, onSelectOption, onRequestRentalNotice }: TransportSelectionPanelProps) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <AnimatePresence mode="wait">
        {!selectedLeg ? (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center">
            <Car className="h-16 w-16 text-slate-300" />
            <h2 className="mt-4 text-2xl font-bold">Select a travel leg</h2>
            <p className="mt-1 text-slate-500">Choose a journey from the sidebar to see your personalized transport options.</p>
          </motion.div>
        ) : (
          <motion.div key={selectedLeg.dayNumber} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-3xl font-bold">
              Options for {selectedLeg.from} to {selectedLeg.to}
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4">
              {transportOptions.map(option => (
                <div key={option.id} className={cn("p-4 border rounded-lg flex items-center justify-between transition-all bg-white", option.isRecommended ? "border-slate-900 border-2 shadow-lg" : "")}> 
                  <div className="flex-1">
                    {option.isRecommended && (
                      <div className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
                        <SparklesIcon className="h-4 w-4" /> AI Recommended
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{option.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{option.details}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-2"><ClockIcon className="h-5 w-5" /> ~{option.time} hours</div>
                      <div className="flex items-center gap-2"><TagIcon className="h-5 w-5" /> LKR {option.cost.toLocaleString()}</div>
                      <div className="flex items-center gap-2">Comfort: <ComfortRating rating={option.comfort} /></div>
                    </div>
                  </div>
                  <div className="w-56 text-right flex-shrink-0">
                    {option.category === 'Private Hire' ? (
                      <Button
                        className="w-full rounded-full font-semibold"
                        onClick={() => {
                          // Show the header tip
                          if (onRequestRentalNotice) onRequestRentalNotice();
                          else document.dispatchEvent(new CustomEvent('tm:show-rental-notice'));
                          // Also set a meaningful placeholder selection through the provided handler
                          // so the left sidebar reflects a planned state when appropriate flows update it.
                          onSelectOption({
                            ...option,
                            name: '✅ Hired: Vehicle',
                            time: option.time,
                            cost: option.cost,
                          });
                        }}
                      >
                        Rent a Vehicle
                      </Button>
                    ) : (
                      <Button className="w-full rounded-full font-semibold" onClick={() => onSelectOption(option)}>
                        Select
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};