import React from 'react';
import { Place } from '@/lib/mock-data';
import { ResultCard } from './ResultCard';
import { ActivityCard } from './ActivityCard';
import { AttractionCard } from './AttractionCard';
import { AtmCard } from './AtmCard'; // Import new card
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdjustmentsHorizontalIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid';

type ResultsPaneProps = {
  places: Place[];
  onPlaceHover: (placeId: string | null) => void;
  hoveredPlaceId: string | null;
  category: 'stay' | 'activity' | 'eat' | 'flight' | 'sights' | 'atm';
};

const getTitle = (category: string) => {
    switch (category) {
        case 'stay': return 'Stays in Colombo';
        case 'activity': return 'Activities in Colombo';
        case 'sights': return 'Sights in Sri Lanka';
        case 'eat': return 'Restaurants in Colombo';
        case 'atm': return 'ATMs in Colombo';
        default: return 'Explore';
    }
}

export const ResultsPane = ({ places, onPlaceHover, hoveredPlaceId, category }: ResultsPaneProps) => {
  return (
    <div className="flex flex-col bg-white h-full overflow-y-auto">
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input placeholder="Search Location..." className="col-span-1 md:col-span-3 rounded-lg h-12" />
          {/* Conditional rendering for date/person inputs */}
          {category === 'stay' && (
            <>
              <Input type="date" defaultValue="2025-09-10" className="rounded-lg h-12" />
              <Input type="date" defaultValue="2025-09-29" className="rounded-lg h-12" />
              <Input type="number" defaultValue="2" placeholder="Adults" className="rounded-lg h-12" />
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" className="flex items-center gap-2 rounded-full font-semibold">
            <AdjustmentsHorizontalIcon className="h-5 w-5" /> Filters
          </Button>
          <Button variant="outline" className="flex items-center gap-2 rounded-full font-semibold">
            Sort by: Top picks <ArrowsUpDownIcon className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="text-2xl font-bold">{getTitle(category)}</h2>
        <div className="mt-4 grid grid-cols-1 gap-4">
          {places.map(place => {
            if (category === 'stay') {
              return <ResultCard key={place.id} place={place} onHover={onPlaceHover} isHovered={hoveredPlaceId === place.id} />
            }
            if (category === 'activity') {
              return <ActivityCard key={place.id} place={place} onHover={onPlaceHover} isHovered={hoveredPlaceId === place.id} />
            }
            if (category === 'sights') {
              return <AttractionCard key={place.id} place={place} onHover={onPlaceHover} isHovered={hoveredPlaceId === place.id} />
            }
             if (category === 'atm') {
              return <AtmCard key={place.id} place={place} onHover={onPlaceHover} isHovered={hoveredPlaceId === place.id} />
            }
            // Add a card for 'eat' when you're ready
            return null;
          })}
        </div>
      </div>
    </div>
  );
};