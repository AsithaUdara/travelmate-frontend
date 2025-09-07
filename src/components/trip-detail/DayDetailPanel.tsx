"use client";
import React from 'react';
import { ItineraryDay, Trip, Activity, mockSuggestions } from '@/lib/trip-data';
import { Button } from '../ui/button';
import { PlusIcon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { format } from 'date-fns';

type DayDetailPanelProps = {
  day: ItineraryDay;
  trip: Trip;
  setTrip: (trip: Trip) => void;
};

// A dedicated, intelligent card for displaying any activity
const ItemCard = ({ activity, onRemove, date, section }: { activity: Activity, onRemove?: () => void, date?: string, section?: 'Accommodation' | 'Travel' | 'Activity' }) => {
  const isBooked = Boolean(activity.bookingDetails) || activity.type === 'Accommodation' || activity.type === 'Travel';
  const prefix = isBooked ? '✅ ' : '';
  const subtitle = activity.type === 'Travel' && activity.duration ? `${activity.type} • ${activity.duration} hours` : activity.type;
  return (
     <motion.div layout initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="p-4 bg-slate-100 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold">{prefix}{activity.name}</p>
          <p className="text-sm text-slate-500">{subtitle}</p>
            {/* Show check-in date and reference for accommodation */}
            {section === 'Accommodation' && date && (
              <div className="mt-1 text-xs text-slate-500">
                <p>Check-in: {format(new Date(date), 'MMMM d, yyyy')}</p>
                {activity.bookingDetails?.reference && (
                  <p className="mt-0.5">Reference: {activity.bookingDetails.reference}</p>
                )}
              </div>
            )}
        </div>
        {onRemove && (
           <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full flex-shrink-0 -mr-2" onClick={onRemove}>
            <XMarkIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Display rich details if they exist */}
      {activity.bookingDetails?.provider && (
        <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">Provider: {activity.bookingDetails.provider}</p>
          {activity.bookingDetails.contact && (
            <>
                <p className="text-xs text-slate-500 mt-2">Please contact {activity.bookingDetails.provider} to confirm times as they can change.</p>
              <a href={`tel:${activity.bookingDetails.contact}`}>
                <Button variant="outline" className="rounded-full mt-2 h-8 text-xs">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  Contact Provider
                </Button>
              </a>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
};

export const DayDetailPanel = ({ day, trip, setTrip }: DayDetailPanelProps) => {
  const suggestions = mockSuggestions[day.location]?.activities || [];
  const availableSuggestions = suggestions.filter(sug => !day.activities.some(act => act.id === sug.id));

  const accommodation = day.activities.find(act => act.type === 'Accommodation');
  const transport = day.activities.find(act => act.type === 'Travel');
  const dailyActivities = day.activities.filter(act => act.type !== 'Accommodation' && act.type !== 'Travel');

  const handleAddActivity = (activity: Activity) => {
    const updatedDays = trip.days.map(d => {
      if (d.day === day.day) {
        return { ...d, activities: [...d.activities, activity] };
      }
      return d;
    });
    setTrip({ ...trip, days: updatedDays });
  };

  const handleRemoveActivity = (activityId: string) => {
    const updatedDays = trip.days.map(d => {
      if (d.day === day.day) {
        const updatedActivities = d.activities.filter(act => act.id !== activityId);
        return { ...d, activities: updatedActivities };
      }
      return d;
    });
    setTrip({ ...trip, days: updatedDays });
  };

  return (
  <div>
    <h3 className="text-2xl font-bold">{day.title}</h3>
    <div className="mt-6 space-y-6">
        
    {accommodation && (
      <div>
        <p className="font-bold mb-2">Accommodation</p>
  <ItemCard activity={accommodation} date={day.date} section="Accommodation" />
      </div>
    )}

    {transport && (
       <div>
        <p className="font-bold mb-2">Transport</p>
  <ItemCard activity={transport} date={day.date} section="Travel" />
      </div>
    )}
        
    {dailyActivities.length > 0 && (
      <div>
        <p className="font-bold mb-2">Activities</p>
        <div className="space-y-2">
          <AnimatePresence>
            {dailyActivities.map(act => (
               <ItemCard key={act.id} activity={act} onRemove={() => handleRemoveActivity(act.id)} section="Activity" />
            ))}
          </AnimatePresence>
        </div>
      </div>
    )}
    </div>

    <div className="mt-8">
    <p className="font-bold mb-2">AI Suggestions for {day.location}</p>
    <div className="space-y-2">
      <AnimatePresence>
      {availableSuggestions.map(sug => (
         <motion.div key={sug.id} layout initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="font-semibold">{sug.name}</p>
            <p className="text-sm text-slate-500">{sug.type}</p>
          </div>
          <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={() => handleAddActivity(sug)}>
            <PlusIcon className="h-4 w-4" />
          </Button>
         </motion.div>
      ))}
      </AnimatePresence>
    </div>
    </div>
  </div>
  );
};
