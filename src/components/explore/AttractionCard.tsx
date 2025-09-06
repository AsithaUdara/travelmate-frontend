import React from 'react';
import { Place } from '@/lib/mock-data';
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

type AttractionCardProps = {
  place: Place;
  onHover: (placeId: string | null) => void;
  isHovered: boolean;
};

export const AttractionCard = ({ place, onHover, isHovered }: AttractionCardProps) => {
  return (
    <div 
      className={cn(
        "flex gap-4 border rounded-xl overflow-hidden shadow-sm transition-all duration-300",
        isHovered ? "scale-105 shadow-xl z-10" : ""
      )}
      onMouseEnter={() => onHover(place.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="w-48 h-full flex-shrink-0 relative">
        <Image src={place.images[0]} alt={place.name} fill style={{objectFit: 'cover'}} />
      </div>
      <div className="p-4 bg-white flex flex-col justify-between flex-grow">
        <div>
          <p className="text-sm text-slate-500">{place.type}</p>
          <h3 className="font-bold text-lg truncate">{place.name}</h3>
        </div>
        <div className="flex items-center gap-2 font-bold text-sm bg-green-100 px-2 py-1 rounded-full text-green-800 w-fit mt-2">
            {place.rating}
            <StarIcon className="h-4 w-4 text-green-800" />
            <span className="font-normal text-slate-500">({place.reviews.toLocaleString()})</span>
        </div>
      </div>
    </div>
  );
};