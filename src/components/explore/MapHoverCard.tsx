"use client";

import React from 'react';
import { Place } from '@/lib/mock-data';
import Image from 'next/image';
import { Button } from '../ui/button';
import { StarIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

type MapHoverCardProps = {
  place: Place;
  position: { x: number; y: number };
};

export const MapHoverCard = ({ place, position }: MapHoverCardProps) => {
  const router = useRouter();
  if (!place) return null;
  if (!position) return null;

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
        {/* Overlay actions removed as requested */}
        {/* Rating badge on image */}
        {place.rating ? (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-green-100 text-green-800 font-semibold text-xs px-2 py-1 rounded-full shadow">
            {place.rating}
            <StarIcon className="h-4 w-4" />
          </div>
        ) : null}
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
        <div className="flex items-center justify-end mt-4">
          {/* Conditionally render Book Now button */}
          {place.category !== 'sights' && place.category !== 'atm' && (
            <Button
              className="rounded-full font-semibold bg-slate-900 hover:bg-slate-800"
              onClick={() => {
                // For stays, navigate to the plan hotel details page
                if (place.category === 'stay') {
                  router.push(`/plan/hotel/${place.id}`);
                }
              }}
            >
              Book now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};