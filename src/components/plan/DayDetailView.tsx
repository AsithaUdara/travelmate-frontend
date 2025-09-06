"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ItineraryDay, Activity, mockSuggestions } from '@/lib/trip-data';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <p className="text-sm text-slate-500">{item.type} &bull; {item.duration > 0 ? `${item.duration} hours` : `LKR ${item.cost.toLocaleString()}`}</p>
    </div>
    <Button size="icon" variant="outline" className="h-9 w-9 rounded-full flex-shrink-0" onClick={onAdd}>
      <PlusIcon className="h-5 w-5"/>
    </Button>
  </motion.div>
);

export const DayDetailView = ({ day, onBack, onAddActivity }: DayDetailViewProps) => {
  const suggestions = mockSuggestions[day.location] || {};
  
  // Filter out suggestions that are already in the day's plan for each category
  const availableStays = suggestions.stays?.filter(sug => !day.activities.some(act => act.id === sug.id)) || [];
  const availableActivities = suggestions.activities?.filter(sug => !day.activities.some(act => act.id === sug.id)) || [];
  const availableEats = suggestions.eats?.filter(sug => !day.activities.some(act => act.id === sug.id)) || [];

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
        {/* The new Tabs component */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stay">Stays</TabsTrigger>
            <TabsTrigger value="activity">Activities</TabsTrigger>
            <TabsTrigger value="eat">Eats</TabsTrigger>
          </TabsList>

          <TabsContent value="stay" className="mt-4">
            <h2 className="font-bold text-lg mb-2">AI Hotel Suggestions</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {availableStays.length > 0 ? availableStays.map(item => (
                  <SuggestionItem key={item.id} item={item} onAdd={() => onAddActivity(day.day, item)} />
                )) : <p className="text-sm text-slate-500 p-4 text-center">No new stay suggestions.</p>}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <h2 className="font-bold text-lg mb-2">AI Activity Suggestions</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {availableActivities.length > 0 ? availableActivities.map(item => (
                  <SuggestionItem key={item.id} item={item} onAdd={() => onAddActivity(day.day, item)} />
                )) : <p className="text-sm text-slate-500 p-4 text-center">No new activity suggestions.</p>}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="eat" className="mt-4">
            <h2 className="font-bold text-lg mb-2">AI Restaurant Suggestions</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {availableEats.length > 0 ? availableEats.map(item => (
                  <SuggestionItem key={item.id} item={item} onAdd={() => onAddActivity(day.day, item)} />
                )) : <p className="text-sm text-slate-500 p-4 text-center">No new restaurant suggestions.</p>}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>

        {/* Current Schedule is now at the bottom for reference */}
        <div className="mt-8 pt-6 border-t">
            <h2 className="font-bold text-lg mb-2">Current Schedule for Day {day.day}</h2>
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
                            <p className="text-sm text-slate-500">{activity.type} &bull; {activity.duration > 0 ? `${activity.duration} hours` : `LKR ${activity.cost.toLocaleString()}`}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {day.activities.length === 0 && <p className="text-sm text-slate-500">No activities scheduled yet.</p>}
            </div>
        </div>
      </div>
    </motion.div>
  );
};