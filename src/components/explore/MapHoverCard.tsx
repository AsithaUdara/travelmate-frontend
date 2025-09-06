import React from 'react';
import { Place } from '@/lib/mock-data';
import Image from 'next/image';
import { Button } from '../ui/button';
import { BookmarkIcon, PlusIcon } from '@heroicons/react/24/outline';

type MapHoverCardProps = {
  place: Place;
  position: { x: number; y: number };
};

export const MapHoverCard = ({ place, position }: MapHoverCardProps) => {
  if (!place || !position) return null;

  return (
    <div
      className="absolute z-[1001] w-72 bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%) translateY(-20px)',
      }}
    >
      <div className="relative h-40 w-full">
        <Image src={place.images[0]} alt={place.name} fill style={{ objectFit: 'cover' }} />
        <div className="absolute top-2 right-2 flex gap-2">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                <PlusIcon className="h-5 w-5"/>
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/80 hover:bg-white">
                <BookmarkIcon className="h-5 w-5"/>
            </Button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs text-slate-500">{place.type}</p>
        <h3 className="font-bold text-md truncate">{place.name}</h3>
        {/* Conditionally render price */}
        {place.price > 0 && (
          <p className="font-bold text-lg mt-2">
            LKR {place.price.toLocaleString()}
            <span className="text-sm font-normal text-slate-500"> / {place.priceType}</span>
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" className="rounded-full font-semibold">Add To Trip</Button>
          {/* Conditionally render Book Now button */}
          {place.category !== 'sights' && place.category !== 'atm' && (
            <Button className="rounded-full font-semibold bg-slate-900 hover:bg-slate-800">Book now</Button>
          )}
        </div>
      </div>
    </div>
  );
};