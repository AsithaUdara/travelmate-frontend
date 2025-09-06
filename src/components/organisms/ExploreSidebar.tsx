"use client";

import React from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Search, Hotel, Utensils, Hospital, Landmark, Banknote, Bus, Heart, X, Plus } from 'lucide-react';

const categories = [
  { name: 'Hotels & Stays', icon: Hotel, category: 'hotel' },
  { name: 'Restaurants', icon: Utensils, category: 'restaurant' },
  { name: 'Hospitals', icon: Hospital, category: 'hospital' },
  { name: 'Sights & Attractions', icon: Landmark, category: 'attraction' },
  { name: 'ATMs', icon: Banknote, category: 'atm' },
  { name: 'Transportation', icon: Bus, category: 'transport' },
];

export const ExploreSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-96 h-full p-6 bg-white border-r overflow-y-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Explore</h1>
        <Button variant="ghost" size="icon" className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input placeholder="Search and Explore" className="pl-10 h-12 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map(({ name, icon: Icon, category }) => (
          <Link key={name} href={`${pathname}?category=${category}`} scroll={false}>
            <Button variant="outline" className="w-full h-14 flex items-center justify-start gap-3 rounded-xl">
              <Icon className="h-5 w-5" />
              <span className="text-sm">{name}</span>
            </Button>
          </Link>
        ))}
      </div>
      
      <div className="border-t my-4" />
      
      <div className="space-y-4">
         <Button variant="ghost" className="w-full h-14 flex items-center justify-start gap-3 text-base">
            <Heart className="h-5 w-5" /> My Saved Places
        </Button>
         <Button variant="ghost" className="w-full h-14 flex items-center justify-start gap-3 text-base">
            <Plus className="h-5 w-5" /> Start Trip
        </Button>
      </div>
    </aside>
  );
};