import React from 'react';
import { Place } from '@/lib/mock-data';
import { ResultCard } from './ResultCard';
import { ActivityCard } from './ActivityCard';
import { AttractionCard } from './AttractionCard';
import { AtmCard } from './AtmCard'; // Import new card
import { EatCard } from './EatCard';
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
  case 'eat': return 'Restaurants in Sri Lanka';
        case 'atm': return 'ATMs in Colombo';
        default: return 'Explore';
    }
}

export const ResultsPane = ({ places, onPlaceHover, hoveredPlaceId, category }: ResultsPaneProps) => {
  // Curated Eats list
  const curatedEats: Place[] = category === 'eat' ? [
    { id: 'eat-col-1', name: 'Nuga Gama - Cinnamon Grand', category: 'eat', type: 'Sri Lankan Restaurant', images: ['/gallery/gallery-2.jpg'], rating: 4.7, reviews: 2100, price: 8000, totalPrice: 8000, priceType: 'person', latitude: 6.9159, longitude: 79.8487 },
    { id: 'eat-kdy-1', name: 'The Empire Cafe', category: 'eat', type: 'Cafe & Sri Lankan', images: ['/gallery/gallery-3.jpg'], rating: 4.6, reviews: 1250, price: 4500, totalPrice: 4500, priceType: 'person', latitude: 7.2906, longitude: 80.6337 },
    { id: 'eat-ell-1', name: 'Cafe Chill', category: 'eat', type: 'Casual Dining', images: ['/gallery/gallery-4.jpg'], rating: 4.5, reviews: 1890, price: 3500, totalPrice: 3500, priceType: 'person', latitude: 6.8667, longitude: 81.0466 },
    { id: 'eat-gal-1', name: 'Pedlar’s Inn Cafe', category: 'eat', type: 'Cafe & Western', images: ['/gallery/gallery-1.jpg'], rating: 4.4, reviews: 980, price: 4200, totalPrice: 4200, priceType: 'person', latitude: 6.0535, longitude: 80.2210 },
  ] : [];
  const finalPlaces = category === 'eat' ? [...curatedEats, ...places] : places;
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
          {finalPlaces.map(place => {
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
            if (category === 'eat') {
              return <EatCard key={place.id} place={place} onHover={onPlaceHover} isHovered={hoveredPlaceId === place.id} />
            }
            // Unknown category
            return null;
          })}
        </div>
      </div>
    </div>
  );
};