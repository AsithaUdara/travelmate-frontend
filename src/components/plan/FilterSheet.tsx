"use client";

import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

type FilterSheetProps = {
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  radius: number;
  setRadius: (value: number) => void;
  onApply: () => void;
  onClear: () => void;
};

const radiusOptions = [5, 10, 25, 50];

export const FilterSheet = ({ priceRange, setPriceRange, radius, setRadius, onApply, onClear }: FilterSheetProps) => {
  const [minRating, setMinRating] = React.useState<number>(0);
  const [amenities, setAmenities] = React.useState<{wifi:boolean;pool:boolean}>({ wifi: false, pool: false });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 rounded-full font-semibold">
          <AdjustmentsHorizontalIcon className="h-5 w-5" /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[380px] sm:w-[480px] flex flex-col overflow-x-hidden">
        <SheetHeader className="pr-8">
          <SheetTitle>Filters</SheetTitle>
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
             <XMarkIcon className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        </SheetHeader>
        <div className="py-6 grid gap-6 flex-1 overflow-y-auto px-3">
          <div className="grid gap-4">
            <Label className="font-semibold text-lg">Price range per night</Label>
            <Slider
              min={10000}
              max={200000}
              step={5000}
              value={priceRange}
              onValueChange={setPriceRange}
              className="[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-slate-200 [&_[data-slot=slider-range]]:bg-sky-400 [&_[data-slot=slider-thumb]]:h-4 [&_[data-slot=slider-thumb]]:w-4 [&_[data-slot=slider-thumb]]:border-slate-900"
              thumbClassName="bg-black"
            />
            <div className="flex justify-between text-sm text-slate-600">
              <span>LKR {priceRange[0].toLocaleString()}</span>
              <span>LKR {priceRange[1].toLocaleString()}</span>
            </div>
          </div>
          <div className="grid gap-4">
            <Label className="font-semibold text-lg">Radius from city center</Label>
            <div className="flex gap-2 flex-wrap">
              {radiusOptions.map(option => (
                <Button 
                    key={option} 
                    variant={radius === option ? "default" : "outline"}
                    className="rounded-full flex-1"
                    onClick={() => setRadius(option)}
                >
                    {option} km
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Label className="font-semibold text-lg">Minimum rating</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {[0,4,4.5,4.7,4.9].map(r => (
                <Button key={r} variant={minRating===r?"default":"outline"} className="rounded-full" onClick={() => setMinRating(r)}>
                  {r===0? 'Any': r}
                </Button>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <Label className="font-semibold text-lg">Amenities</Label>
            <div className="flex gap-2 flex-wrap">
              <Button variant={amenities.wifi?"default":"outline"} className="rounded-full" onClick={() => setAmenities(a=>({...a,wifi:!a.wifi}))}>Free Wifi</Button>
              <Button variant={amenities.pool?"default":"outline"} className="rounded-full" onClick={() => setAmenities(a=>({...a,pool:!a.pool}))}>Pool</Button>
            </div>
          </div>
        </div>
        <SheetFooter className="flex-row justify-between pt-3 border-t px-3">
            <Button variant="ghost" className="rounded-full font-semibold underline" onClick={onClear}>Clear all</Button>
            <SheetClose asChild>
                <Button className="w-48 rounded-full" size="lg" onClick={() => {
                  // Persist extras in localStorage so the panel can read them when applying.
                  try {
                    localStorage.setItem('tm_acc_min_rating', String(minRating));
                    localStorage.setItem('tm_acc_amenities', JSON.stringify(amenities));
                  } catch {}
                  onApply();
                }}>Apply Filters</Button>
            </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
