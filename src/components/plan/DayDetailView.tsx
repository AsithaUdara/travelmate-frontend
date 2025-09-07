"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItineraryDay, Activity, mockSuggestions } from '@/lib/trip-data';
import { Button } from '../ui/button';
import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/solid';

type DayDetailViewProps = {
  day: ItineraryDay;
  onBack: () => void;
  onAddActivity: (dayNumber: number, activity: Activity) => void;
};

// A reusable component for a single suggestion item
const SuggestionItem = ({ item, onAdd }: { item: Activity, onAdd: () => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.5 }}
    transition={{ duration: 0.3 }}
    className="flex items-center justify-between p-3 bg-white border rounded-lg"
  >
    <div>
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm text-slate-500">{item.type} &bull; {item.duration} hours</p>
    </div>
    <Button size="icon" variant="outline" className="h-9 w-9 rounded-full flex-shrink-0" onClick={onAdd}>
      <PlusIcon className="h-5 w-5"/>
    </Button>
  </motion.div>
);

export const DayDetailView = ({ day, onBack, onAddActivity }: DayDetailViewProps) => {
  // We now only care about activity suggestions for this view
  const suggestions = mockSuggestions[day.location]?.activities || [];
  
  const availableSuggestions = suggestions.filter(sug => 
    !day.activities.some(act => act.id === sug.id)
  );

  return (
    <motion.div
      key="day-detail"
      initial={{ opacity: 0, x: "-50%" }}
      animate={{ opacity: 1, x: "0%" }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="p-6 h-full flex flex-col"
    >
      <div className="flex-shrink-0">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 mb-4 -ml-4 font-semibold">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to Trip Overview
        </Button>
        <div className="pb-4 border-b">
          <p className="text-sm text-slate-500">Day {day.day} &bull; {day.location}</p>
          <h1 className="text-2xl font-bold">{day.title}</h1>
        </div>
      </div>
      
      <div className="mt-6 flex-1 overflow-y-auto pr-2">
        {/* Current Schedule */}
        <h2 className="font-bold text-lg mb-2">Your Schedule for Day {day.day}</h2>
        <div className="space-y-3">
            <AnimatePresence>
                {day.activities.map(activity => (
                    <motion.div 
                        key={activity.id} 
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="p-3 bg-slate-100 rounded-lg"
                    >
                        <p className="font-semibold">{activity.name}</p>
                        <p className="text-sm text-slate-500">{activity.type} &bull; {activity.duration} hours</p>
                    </motion.div>
                ))}
            </AnimatePresence>
            {day.activities.length === 0 && <p className="text-sm text-slate-500">No activities scheduled yet. Add some from the suggestions below!</p>}
        </div>

        {/* AI Activity Suggestions */}
        <div className="mt-8">
            <h2 className="font-bold text-lg mb-2">AI Activity Suggestions for {day.location}</h2>
            <div className="space-y-3">
                <AnimatePresence>
                    {availableSuggestions.map(suggestion => (
                       <SuggestionItem key={suggestion.id} item={suggestion} onAdd={() => onAddActivity(day.day, suggestion)} />
                    ))}
                </AnimatePresence>
                {availableSuggestions.length === 0 && <p className="text-sm text-slate-500">You've added all available activity suggestions!</p>}
            </div>
        </div>
      </div>
    </motion.div>
  );
};