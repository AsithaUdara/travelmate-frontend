import React from 'react';
import { Place } from '@/lib/mock-data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { DEFAULT_HOTEL_IMAGES } from '@/config/images';

type ResultCardProps = {
  place: Place;
  onHover: (placeId: string | null) => void;
  isHovered: boolean;
  isRecommended?: boolean;
};

export const ResultCard = ({ place, onHover, isHovered, isRecommended = false }: ResultCardProps) => {
  // For hotels/stays, ALWAYS use our default image regardless of provided images
  // For other categories, fallback to default when images are missing
  const images = place.category === 'stay'
    ? DEFAULT_HOTEL_IMAGES
    : ((place.images && place.images.length > 0) ? place.images : DEFAULT_HOTEL_IMAGES);

  return (
    <div 
      className={cn(
  "flex gap-4 border shadow-sm transition-all duration-300",
        isHovered ? "scale-105 shadow-xl z-10" : "",
  isRecommended ? "border-2 border-slate-900 rounded-none" : "rounded-xl"
      )}
      onMouseEnter={() => onHover(place.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="w-1/3 flex-shrink-0">
        <Carousel className="w-full h-full group">
          <CarouselContent className="h-full">
            {images.map((img, index) => (
              <CarouselItem key={index} className="relative">
    <Image src={img} alt={place.name} fill style={{objectFit: 'cover'}} className={cn(isRecommended ? "" : "rounded-l-xl")} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100" />
        </Carousel>
      </div>
      <div className={cn("p-3 bg-white flex flex-col justify-between flex-grow", isRecommended ? "" : "rounded-r-xl") }>
        <div>
          <p className="text-sm text-slate-500">{place.type}</p>
          <h3 className="font-bold text-lg truncate">{place.name}</h3>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-bold text-lg">
              LKR {place.price.toLocaleString()}
              <span className="text-sm font-normal text-slate-500"> / {place.priceType}</span>
            </p>
            <p className="text-xs text-slate-500 underline">LKR {place.totalPrice.toLocaleString()} total</p>
          </div>
          <div className="flex items-center gap-2 font-bold text-sm bg-green-100 px-2 py-1 rounded-full text-green-800">
            {place.rating}
            <StarIcon className="h-4 w-4 text-green-800" />
          </div>
        </div>
      </div>
    </div>
  );
};