"use client";

import React, { useState } from 'react';
import { Trip, ItineraryDay, searchablePlaces } from '@/lib/trip-data';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';

type ItinerarySidebarProps = {
  trip: Trip;
  setTrip: (trip: Trip) => void;
  activeDay: ItineraryDay | null;
  onDaySelect: (day: ItineraryDay) => void;
};

export const ItinerarySidebar = ({ trip, setTrip, activeDay, onDaySelect }: ItinerarySidebarProps) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [draggingDay, setDraggingDay] = useState<number | null>(null);

  const searchResults = searchablePlaces.filter(place => 
    place.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDestination = (placeToAdd: typeof searchablePlaces[0]) => {
    const newDay: ItineraryDay = {
      day: trip.days.length + 1, date: "New Date", location: placeToAdd.name,
      title: `Exploring ${placeToAdd.name}`, activities: [], latitude: placeToAdd.latitude, longitude: placeToAdd.longitude,
    };
    const updatedDays = [...trip.days, newDay].map((day, index) => ({ ...day, day: index + 1 }));
    setTrip({ ...trip, days: updatedDays });
    setIsSearching(false);
    setSearchQuery("");
  };

  const handleRemoveDay = (dayToRemove: number) => {
     const updatedDays = trip.days.filter(day => day.day !== dayToRemove).map((day, index) => ({ ...day, day: index + 1 }));
    setTrip({ ...trip, days: updatedDays });
    if(activeDay?.day === dayToRemove) {
        onDaySelect(updatedDays.length > 0 ? updatedDays[0] : null as any);
    }
  };

  // Drag and drop handlers
  const onDragStart = (dayNumber: number) => setDraggingDay(dayNumber);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDrop = (targetDayNumber: number) => {
    if (draggingDay == null || draggingDay === targetDayNumber) return;
    const fromIndex = trip.days.findIndex(d => d.day === draggingDay);
    const toIndex = trip.days.findIndex(d => d.day === targetDayNumber);
    if (fromIndex === -1 || toIndex === -1) return;
    const newDays = [...trip.days];
    const [moved] = newDays.splice(fromIndex, 1);
    newDays.splice(toIndex, 0, moved);
    const reNumbered = newDays.map((d, idx) => ({ ...d, day: idx + 1 }));
    setTrip({ ...trip, days: reNumbered });
    setDraggingDay(null);
  };

  return (
    <motion.div
        key="trip-overview"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="p-6 h-full flex flex-col"
    >
      <div className="pb-4 border-b">
        <h1 className="text-2xl font-bold">{trip.name}</h1>
        <p className="text-slate-500">
          {(() => {
            try {
              if (trip.startDate && trip.endDate) {
                const s = format(parseISO(trip.startDate), 'MMM do');
                const e = format(parseISO(trip.endDate), 'MMM do, yyyy');
                return `${s} - ${e}`;
              }
            } catch {}
            return '';
          })()}
        </p>
      </div>
      
      <div className="mt-6 flex-1 overflow-y-auto pr-2">
        {trip.days.map((day, index) => (
          <React.Fragment key={day.day}>
            <div 
                className="relative"
                onMouseEnter={() => setHoveredDay(day.day)}
                onMouseLeave={() => setHoveredDay(null)}
            >
        <div 
                    className={cn("flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors", activeDay?.day === day.day ? "bg-slate-100" : "hover:bg-slate-50")}
          onClick={() => onDaySelect(day)}
          draggable
          onDragStart={() => onDragStart(day.day)}
          onDragOver={onDragOver}
          onDrop={() => onDrop(day.day)}
                >
                    <div className="relative z-10">
                      <div className={cn("flex items-center justify-center h-10 w-10 rounded-full font-bold", activeDay?.day === day.day ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-700")}>{day.day}</div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{day.location}</p>
                      <p className="text-sm text-slate-500">{day.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {day.activities.length > 0
                          ? `${day.activities.length} activit${day.activities.length === 1 ? 'y' : 'ies'}`
                          : 'No activities yet'}
                      </p>
                      {day.activities.length > 0 && (
                        <ul className="mt-1 space-y-1">
                          {day.activities.slice(0, 2).map((a) => (
                            <li key={a.id} className="text-xs text-slate-600 truncate">
                              • {a.name}
                            </li>
                          ))}
                          {day.activities.length > 2 && (
                            <li className="text-xs text-slate-400">+{day.activities.length - 2} more</li>
                          )}
                        </ul>
                      )}
                    </div>
                    {hoveredDay === day.day && (
                      <motion.div initial={{opacity: 0, scale: 0.8}} animate={{opacity: 1, scale: 1}}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={(e) => {e.stopPropagation(); handleRemoveDay(day.day)}}>
                              <XMarkIcon className="h-5 w-5"/>
                          </Button>
                      </motion.div>
                    )}
                </div>
            </div>
             {index < trip.days.length - 1 && (
                <div className="relative h-12">
                    <div className="absolute top-0 left-[18px] w-0.5 h-[calc(100%-1rem)] mt-2 bg-slate-200" />
                </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t">
        <AnimatePresence>
        {isSearching ? (
          <motion.div key="search-view" initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}}>
             <Input placeholder="Search for a city or attraction..." className="h-12 rounded-full" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} autoFocus />
             <div className="mt-4 space-y-2">
              {searchResults.map(place => (
                <button key={place.id} onClick={() => handleAddDestination(place)} className="w-full text-left p-3 rounded-lg hover:bg-slate-100">
                  <p className="font-semibold">{place.name}</p>
                  <p className="text-sm text-slate-500">{place.type}</p>
                </button>
              ))}
            </div>
             <Button variant="ghost" className="w-full mt-2" onClick={() => setIsSearching(false)}>Cancel</Button>
          </motion.div>
        ) : (
          <motion.div key="add-button" initial={{opacity: 0}} animate={{opacity: 1}}>
            <Button variant="outline" className="w-full rounded-full h-12 flex items-center justify-center gap-2 font-semibold" onClick={() => setIsSearching(true)}>
              <PlusIcon className="h-5 w-5" /> Add a Destination
            </Button>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};