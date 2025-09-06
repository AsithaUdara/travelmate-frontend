import React from 'react';
import { Place } from '@/lib/mock-data';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from 'next/image';
import { StarIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

type ActivityCardProps = {
  place: Place;
  onHover: (placeId: string | null) => void;
  isHovered: boolean;
};

export const ActivityCard = ({ place, onHover, isHovered }: ActivityCardProps) => {
  return (
    <div 
      className={cn(
        "flex gap-4 border rounded-xl overflow-hidden shadow-sm transition-all duration-300",
        isHovered ? "scale-105 shadow-xl z-10" : ""
      )}
      onMouseEnter={() => onHover(place.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="w-48 h-full flex-shrink-0">
        <Carousel className="w-full h-full group">
          <CarouselContent className="h-full">
            {place.images.map((img, index) => (
              <CarouselItem key={index} className="relative h-full">
                <Image src={img} alt={place.name} fill style={{objectFit: 'cover'}} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100" />
          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100" />
        </Carousel>
      </div>
      
      <div className="p-4 bg-white flex flex-col justify-between flex-grow">
        <div>
          <p className="text-sm text-slate-500">{place.type}</p>
          <h3 className="font-bold text-lg truncate">{place.name}</h3>
        </div>
        <div className="flex items-end justify-between mt-2">
            <p className="font-bold text-lg">
                LKR {place.price.toLocaleString()}
                <span className="text-sm font-normal text-slate-500"> / {place.priceType}</span>
            </p>
            <div className="flex items-center gap-2 font-bold text-sm bg-green-100 px-2 py-1 rounded-full text-green-800">
                {place.rating}
                <StarIcon className="h-4 w-4 text-green-800" />
                <span className="font-normal text-slate-500">({place.reviews.toLocaleString()})</span>
            </div>
        </div>
      </div>
    </div>
  );
};