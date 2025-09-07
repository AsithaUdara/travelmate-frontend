"use client";

import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from '../ui/button';
import { Place } from '@/lib/mock-data';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { StarIcon } from '@heroicons/react/24/solid';

type HotelDetailModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  place: Place;
  onSelect: (place: Place) => void;
};

export const HotelDetailModal = ({ isOpen, setIsOpen, place, onSelect }: HotelDetailModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl p-0">
                <DialogTitle className="sr-only">Hotel details: {place.name}</DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
                <Carousel className="w-full h-full">
                    <CarouselContent>
                        {place.images.map((img, index) => (
                        <CarouselItem key={index} className="aspect-square relative">
                            <Image src={img} alt={place.name} fill style={{objectFit: 'cover'}} />
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                </Carousel>
            </div>
            <div className="p-8 flex flex-col">
                <p className="text-sm text-slate-500">{place.type}</p>
                <h2 className="text-3xl font-bold mt-1">{place.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                    <StarIcon className="h-5 w-5 text-yellow-500"/>
                    <span className="font-bold">{place.rating}</span>
                    <span className="text-slate-500">({place.reviews.toLocaleString()} reviews)</span>
                </div>
                <div className="border-t my-6"/>
                <p className="text-slate-600">
                    A placeholder description for the hotel. In a real application, this would contain rich details about the property, its history, and unique features.
                </p>
                <div className="flex-grow" />
                <div className="mt-8 pt-6 border-t flex items-center justify-between">
                    <div>
                        <p className="font-bold text-2xl">LKR {place.price.toLocaleString()}</p>
                        <p className="text-sm text-slate-500">per {place.priceType}</p>
                    </div>
                    <Button size="lg" className="rounded-full font-semibold" onClick={() => onSelect(place)}>
                        Add to Trip
                    </Button>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
