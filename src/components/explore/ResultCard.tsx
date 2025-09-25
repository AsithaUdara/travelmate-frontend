"use client";

import React from 'react';
import { Place } from '@/lib/mock-data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

type ResultCardProps = {
  place: Place;
  onHover: (placeId: string | null) => void;
  isHovered: boolean;
  isRecommended?: boolean;
};

// A safe, consistent number formatter to prevent hydration errors and handle missing values.
const formatPrice = (price: number | undefined | null): string => {
  if (typeof price !== 'number') {
    return 'Not available'; // Fallback text if the price is missing
  }
  return price.toLocaleString('en-US'); // Use a specific locale to be consistent
};

export const ResultCard = ({ place, onHover, isHovered, isRecommended = false }: ResultCardProps) => {
  // Gracefully handle cases where the place object might be incomplete or missing
  if (!place || !place.id) {
    return (
      <div className="flex items-center justify-center p-4 border rounded-xl bg-red-50 text-red-700">
        Error: Could not display result due to missing data.
      </div>
    );
  }
  
  return (
    <div 
      className={cn(
        "flex gap-4 border bg-white shadow-sm transition-all duration-300",
        isHovered ? "scale-105 shadow-xl z-10" : "",
        isRecommended ? "border-2 border-slate-900 rounded-none" : "rounded-xl"
      )}
      onMouseEnter={() => onHover(place.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="w-1/3 flex-shrink-0 relative">
        {/* Check if images array exists and is not empty */}
        {place.images && place.images.length > 0 ? (
          <Carousel className="w-full h-full group">
            <CarouselContent className="h-full">
              {place.images.map((img, index) => (
                <CarouselItem key={index} className="relative">
                  <Image 
                    src={img || '/placeholder.png'} // Add a placeholder for empty image strings
                    alt={place.name || 'Image of the location'} 
                    fill 
                    style={{objectFit: 'cover'}} 
                    className={cn(isRecommended ? "" : "rounded-l-xl")} 
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100" />
            <CarouselNext className="right-2 opacity-0 group-hover:opacity-100" />
          </Carousel>
        ) : (
          // Render a placeholder if no images are available
          <div className={cn("w-full h-full bg-slate-100 flex items-center justify-center", isRecommended ? "" : "rounded-l-xl")}>
            <span className="text-sm text-slate-500">No Image</span>
          </div>
        )}
      </div>

      <div className={cn("p-3 flex flex-col justify-between flex-grow", isRecommended ? "" : "rounded-r-xl")}>
        <div>
          <p className="text-sm text-slate-500">{place.type || 'Accommodation'}</p>
          <h3 className="font-bold text-lg truncate">{place.name || 'Unnamed Place'}</h3>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div>
            {/* --- FIX: ONLY RENDER PRICE IF IT EXISTS --- */}
            {typeof place.price === 'number' && (
              <p className="font-bold text-lg">
                LKR {formatPrice(place.price)}
                {place.priceType && <span className="text-sm font-normal text-slate-500"> / {place.priceType}</span>}
              </p>
            )}
            {/* --- FIX: ONLY RENDER TOTAL PRICE IF IT EXISTS --- */}
            {typeof place.totalPrice === 'number' && (
              <p className="text-xs text-slate-500 underline">LKR {formatPrice(place.totalPrice)} total</p>
            )}
          </div>
          {/* --- FIX: ONLY RENDER RATING IF IT EXISTS --- */}
          {typeof place.rating === 'number' && (
            <div className="flex items-center gap-2 font-bold text-sm bg-green-100 px-2 py-1 rounded-full text-green-800">
              {place.rating}
              <StarIcon className="h-4 w-4 text-green-800" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};